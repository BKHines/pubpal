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
            return sellers;
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

        public bool ChangePassword(SellerModel seller)
        {
            var sellerupdated = sellerDA.UpdatePerson(seller, true);
            return sellerupdated;
        }

        public bool AddPurchasableItem(string id, PurchasableItemModel item)
        {
            item.id = new Guid().ToString();
            var seller = sellerDA.GetPersonById(id);
            if (seller.items == null)
            {
                seller.items = new List<PurchasableItemModel>().ToArray();
            }

            var _items = seller.items.ToList();
            _items.Add(item);
            seller.items = _items.ToArray();
            var sellerupdated = sellerDA.UpdatePerson(seller, false);
            return sellerupdated;
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
