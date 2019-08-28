using pubpalapi.DataAccess;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class PurchaseRepository
    {
        private PurchaseDA purchaseDA;

        public PurchaseRepository(string dbName, string storeName)
        {
            purchaseDA = new PurchaseDA(dbName, storeName);
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

        public string CreatePurchase(PurchaseModel newPurchase)
        {
            var purchaseid = purchaseDA.CreatePurchase(newPurchase);
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
            purchaseHistory.Add(new PurchaseHistory() { purchasestatus = status, statusdate = DateTime.Now.ToString(), message = message });
            purchase.purchasehistory = purchaseHistory.ToArray();
            var purchaseupdated = purchaseDA.UpdatePurchase(purchase);
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
