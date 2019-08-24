using pubpalapi.DataAccess;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class SellerRepository
    {
        private SellerDA sellerDA;

        public SellerRepository(string dbName, string storeName)
        {
            sellerDA = new SellerDA(dbName, storeName);
        }

        public SellerModel GetScrubbedSeller(SellerModel seller)
        {
            seller.password = string.Empty;
            return seller;
        }

        public IEnumerable<SellerModel> GetSellers()
        {
            var sellers = sellerDA.GetPersons();
            return sellers;
        }

        public SellerModel GetSellerById(string id)
        {
            var seller = sellerDA.GetPersonById(id);
            return seller;
        }

        public SellerModel GetSellerByEmail(string email)
        {
            var seller = sellerDA.GetPersonByEmail(email);
            return seller;
        }

        public SellerModel GetSellerByName(string name)
        {
            var nameParts = name.Split(' ');
            if (string.IsNullOrWhiteSpace(name))
            {
                return null;
            }

            var seller = sellerDA.GetPersonByName(nameParts[0], nameParts.Length > 1 ? nameParts[1] : string.Empty);
            return seller;
        }

        public SellerModel[] GetSellersByLocation(float lat, float lng, int miles)
        {
            var sellers = sellerDA.GetSellersByLocation(lat, lng, miles);
            var _sellers = sellers.Select(a => GetScrubbedSeller(a));
            return _sellers.ToArray();
        }

        public PurchasableItemModel[] GetSellersOptions(string sellerId)
        {
            var seller = sellerDA.GetPersonById(sellerId);
            return seller.items;
        }

        public PurchasableItemModel GetSellersOption(string sellerId, string purchaseId)
        {
            var seller = sellerDA.GetPersonById(sellerId);
            return seller.items.FirstOrDefault(a => a.id == purchaseId);
        }

        public string CreateSeller(SellerModel seller)
        {
            if (seller.items != null)
            {
                seller.items.Select((a) =>
                {
                    a.id = new Guid().ToString();
                    return a;
                }).ToList();
            }
            var sellerid = sellerDA.CreatePerson(seller);
            return sellerid;
        }

        public bool UpdateSeller(SellerModel seller)
        {
            var sellerupdated = sellerDA.UpdatePerson(seller, false);
            if (seller.items != null)
            {
                seller.items.Where(a => String.IsNullOrEmpty(a.id)).Select((a) =>
                {
                    a.id = new Guid().ToString();
                    return a;
                }).ToList();
            }
            return sellerupdated;
        }

        public bool ChangePassword(ChangePasswordRequest changePassword)
        {
            var seller = sellerDA.GetPersonById(changePassword.id);
            if (changePassword.newpassword == changePassword.confirmpassword)
            {
                seller.password = changePassword.newpassword;
            }
            var sellerupdated = sellerDA.UpdatePerson(seller, true);
            return sellerupdated;
        }

        public string AddPurchasableItem(string id, PurchasableItemModel item)
        {
            item.id = Guid.NewGuid().ToString();
            var seller = sellerDA.GetPersonById(id);
            if (seller.items == null)
            {
                seller.items = new List<PurchasableItemModel>().ToArray();
            }

            var _items = seller.items.ToList();
            _items.Add(item);
            seller.items = _items.ToArray();
            var sellerupdated = sellerDA.UpdatePerson(seller, false);
            return sellerupdated ? item.id : string.Empty;
        }

        public bool UpdatePurchasableItem(string id, PurchasableItemModel item)
        {
            var seller = sellerDA.GetPersonById(id);
            var itemToUpdate = seller.items.First(a => a.id == item.id);
            var indexOfItemToUpdate = Array.IndexOf(seller.items, itemToUpdate);
            seller.items[indexOfItemToUpdate] = item;
            var sellerUpdated = sellerDA.UpdatePerson(seller, false);
            return sellerUpdated;
        }

        public bool DeletePurchasableItem(string id, string itemid)
        {
            var seller = sellerDA.GetPersonById(id);

            var _items = seller.items.ToList();
            seller.items = _items.Where(a => !String.Equals(a.id, itemid)).ToArray();
            var sellerupdated = sellerDA.UpdatePerson(seller, false);
            return sellerupdated;
        }

        public bool DeleteSeller(string id)
        {
            var sellerdeleted = sellerDA.DeletePerson(id);
            return sellerdeleted;
        }

        public bool DisableSeller(string id)
        {
            var seller = sellerDA.GetPersonById(id);
            seller.enabled = false;
            var sellerupdated = sellerDA.UpdatePerson(seller, false);
            return sellerupdated;
        }

    }
}
