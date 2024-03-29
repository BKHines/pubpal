﻿using PayPalHttp;
using PayPalCheckoutSdk.Core;
using PayPalCheckoutSdk.Orders;
using pubpalapi.DataAccess;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using pubpalapi.PaymentIntegration.PayPal;

namespace pubpalapi.Repositories
{
    public class PurchaseRepository
    {
        private PurchaseDA purchaseDA;
        private UserRepository userRepo;

        public PurchaseRepository(string dbName, string storeName, string userStoreName = "")
        {
            purchaseDA = new PurchaseDA(dbName, storeName);
            if (!string.IsNullOrWhiteSpace(userStoreName))
            {
                userRepo = new UserRepository(dbName, userStoreName);
            }
        }

        public PurchaseModel GetPurchaseById(string id)
        {
            var purchase = purchaseDA.GetPurchaseById(id);
            return purchase;
        }

        public IEnumerable<PurchaseModel> GetPurchasesByUserId(string id)
        {
            var purchases = GetPurchasesById(id, false);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetPurchasesBySellerId(string id)
        {
            var purchases = GetPurchasesById(id, true);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetPurchasesBySellerIdAndActivityDate(string id, string activitydate)
        {
            var _activityDate = DateTime.Parse(activitydate).ToString("yyyy-MM-dd");
            var purchases = purchaseDA.GetSellerPurchasesByIdAndActivityDate(id, _activityDate);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetSellersOrderedPurchases(string id)
        {
            var purchases = purchaseDA.GetSellerPurchasesByStatus(id, PurchaseStatus.ordered);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetSellersAcceptedPurchases(string id)
        {
            var purchases = purchaseDA.GetSellerPurchasesByStatus(id, PurchaseStatus.accepted);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetSellersInProgressPurchases(string id)
        {
            var purchases = purchaseDA.GetSellerPurchasesByStatus(id, PurchaseStatus.inprogress);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetSellersReadyPurchases(string id)
        {
            var purchases = purchaseDA.GetSellerPurchasesByStatus(id, PurchaseStatus.ready);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetSellersPickedUpPurchases(string id)
        {
            var purchases = purchaseDA.GetSellerPurchasesByStatus(id, PurchaseStatus.pickedup);
            return purchases;
        }

        public IEnumerable<PurchaseModel> GetSellersCancelledPurchases(string id)
        {
            var purchases = purchaseDA.GetSellerPurchasesByStatus(id, PurchaseStatus.cancelled);
            return purchases;
        }

        public PurchaseCreateWithResponse CreatePurchaseWithResponse(PurchaseModel newPurchase, PurchaseServiceType serviceType)
        {
            switch (serviceType)
            {
                case PurchaseServiceType.paypal:
                    return CreatePurchaseWithPayPal(newPurchase);
            }

            return null;
        }

        private PurchaseCreateWithResponse CreatePurchaseWithPayPal(PurchaseModel newPurchase)
        {
            var purchaseid = CreatePurchaseRecord(newPurchase);
            var createOrderResponse = CreateOrder.ExecuteCreateOrder(newPurchase).Result;
            var createOrderResult = createOrderResponse.Result<Order>();
            var responseUrlLink = createOrderResult.Links.FirstOrDefault(a => a.Rel.Equals("approve", StringComparison.InvariantCultureIgnoreCase));
            var purchaseCreateWithPayPalResponse = new PurchaseCreateWithResponse()
            {
                purchaseid = purchaseid,
                responseurl = responseUrlLink != null ? responseUrlLink.Href : string.Empty
            };
            return purchaseCreateWithPayPalResponse;
        }

        private string CreatePurchaseRecord(PurchaseModel newPurchase)
        {
            var purchaseid = purchaseDA.CreatePurchase(newPurchase);
            var user = userRepo.GetUserById(newPurchase.userid);
            if (user.waivedfeetokens > 0)
            {
                user.waivedfeetokens -= 1;
                userRepo.UpdateUser(user);
            }
            return purchaseid;
        }

        public bool UpdatePurchase(PurchaseModel updatePurchase)
        {
            var purchaseupdated = purchaseDA.UpdatePurchase(updatePurchase);
            return purchaseupdated;
        }

        public bool UpdatePurchaseStatus(string personId, string id, PurchaseStatus status, string message = "")
        {
            var purchase = purchaseDA.GetPurchaseByIdAndPersonId(id, personId);
            if (purchase == null)
            {
                throw new Exception($"Purchase {id} was not found for person {personId}");
            }
            CheckStatusWorkflow(id, personId, purchase.currentstatus, status);
            purchase.currentstatus = status;
            var purchaseHistory = new List<PurchaseHistory>();
            if (purchase.purchasehistory != null)
            {
                purchaseHistory = purchase.purchasehistory.ToList();
            }
            var localTime = DateTime.Now;
            var offsetTime = new DateTimeOffset(localTime, TimeZoneInfo.Local.GetUtcOffset(localTime));
            purchaseHistory.Add(new PurchaseHistory() { 
                purchasestatus = status, 
                statusdate = offsetTime.ToString("yyyy-MM-ddTHH:mm:sszzz"),
                message = message });
            purchase.purchasehistory = purchaseHistory.ToArray();
            var purchaseupdated = purchaseDA.UpdatePurchase(purchase);
            if (status == PurchaseStatus.cancelled && purchase.feewaived)
            {
                var user = userRepo.GetUserById(purchase.userid);
                user.waivedfeetokens += 1;
                userRepo.UpdateUser(user);
            }
            return purchaseupdated;
        }

        private void CheckStatusWorkflow(string id, string personid, PurchaseStatus currentStatus, PurchaseStatus newStatus)
        {
            bool invalidStatus = false;
            switch (newStatus)
            {
                case PurchaseStatus.accepted:
                    invalidStatus = currentStatus != PurchaseStatus.ordered;
                    break;
                case PurchaseStatus.inprogress:
                    invalidStatus = currentStatus != PurchaseStatus.accepted;
                    break;
                case PurchaseStatus.ready:
                    invalidStatus = currentStatus != PurchaseStatus.inprogress;
                    break;
                case PurchaseStatus.pickedup:
                    invalidStatus = currentStatus != PurchaseStatus.ready;
                    break;
                case PurchaseStatus.cancelled:
                    invalidStatus = currentStatus > PurchaseStatus.inprogress;
                    break;
            }
            if (invalidStatus)
            {
                throw new Exception($"Invalid workflow: Purchase {id} for person {personid} attempted to change status {currentStatus} to {newStatus}.");
            }
        }

        private IEnumerable<PurchaseModel> GetPurchasesById(string id, bool isSeller)
        {
            var purchases = isSeller ? purchaseDA.GetPurchasesBySellerId(id) : purchaseDA.GetPurchasesByUserId(id);
            return purchases;
        }
    }
}
