using Google.Apis.Auth.OAuth2;
using Google.Cloud.Vision.V1;
using Google.Protobuf;
using Microsoft.AspNetCore.Http;
using PayPalHttp;
using pubpalapi.DataAccess;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class SellerRepository
    {
        private SellerDA sellerDA;
        private const string VISION_URL = @"https://vision.googleapis.com/v1/images:annotate";

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

        public IEnumerable<object> GetSellerNamesByIds(string[] ids)
        {
            var sellers = new List<SellerModel>();
            foreach (var id in ids)
            {
                var seller = sellerDA.GetPersonById(id);
                sellers.Add(seller);
            }

            return sellers.Select(a => new { name = a.place.name, sellerid = a._id });
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

        public string[] GetSellerCategories(string id)
        {
            var seller = sellerDA.GetPersonById(id);
            var sellerCategories = seller.items?.Select(a => a.category);
            return sellerCategories != null ? sellerCategories.ToArray() : new List<String>() { String.Empty }.ToArray();
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

        public SellerTagModel[] GetSellerTagsByUser(string sellerid, string userid)
        {
            var seller = sellerDA.GetPersonById(sellerid);
            return seller.tags != null ? seller.tags.Where(a => string.Equals(a.userid, userid)).ToArray() : new List<SellerTagModel>().ToArray();
        }

        public SellerModel[] GetSellersByTagSearch(string searchText, float lat = 0, float lng = 0)
        {
            IEnumerable<SellerModel> sellers;
            var _sellers = sellerDA.GetSellersByTags(searchText);

            if (lat != 0 && lng != 0)
            {
                sellers = _sellers.OrderBy(a => GetDistance(lat, lng, a.place.location.coordinates[1], a.place.location.coordinates[0]));
            }
            else
            {
                sellers = _sellers;
            }

            return sellers.ToArray();
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

        public bool AddTag(string id, SellerTagModel tag)
        {
            var seller = sellerDA.GetPersonById(id);
            if (seller.tags == null)
            {
                seller.tags = new List<SellerTagModel>().ToArray();
            }

            if (!seller.tags.Any(a => string.Equals(a.tag, tag.tag, StringComparison.InvariantCultureIgnoreCase)
                                        && string.Equals(a.userid, tag.userid)))
            {
                var _tags = seller.tags.ToList();
                _tags.Add(tag);
                seller.tags = _tags.ToArray();
            }

            var sellerupdated = sellerDA.UpdatePerson(seller, false);
            return sellerupdated;
        }

        public bool RemoveTag(string id, SellerTagModel tag)
        {
            var seller = sellerDA.GetPersonById(id);

            seller.tags = seller.tags.Where(a => !(string.Equals(a.userid, tag.userid) && string.Equals(a.tag, tag.tag, StringComparison.InvariantCultureIgnoreCase))).ToArray();

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

        private double GetDistance(float userlat, float userlng, float sellerlat, float sellerlng)
        {
            var p = Math.PI / 180;
            var a = 0.5 - Math.Cos((userlat - sellerlat) * p) / 2 + Math.Cos(sellerlat * p) * Math.Cos((userlat) * p) * (1 - Math.Cos(((userlng - sellerlng) * p))) / 2;
            var dis = (12742 * Math.Asin(Math.Sqrt(a))) * 0.621371; // 2 * R; R = 6371 km
            return dis;
        }

        public IEnumerable<string> ScrapeImageText(IFormFile img)
        {
            var rv = new List<string>();
            using (var ms = new MemoryStream())
            {
                img.CopyTo(ms);
                var fileBytes = ms.ToArray();
                var _img = Image.FromBytes(fileBytes);
                System.Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "pubpal-8e4e5a6505d6.json");

                var client = ImageAnnotatorClient.Create();
                
                var response = client.DetectText(_img);
                foreach (var annotation in response)
                {
                    if (annotation.Description != null)
                    {
                        rv.Add(annotation.Description);
                    }
                }
            }

            return rv;
        }

        public IEnumerable<string> ScrapeImageLogo(IFormFile img)
        {
            var rv = new List<string>();
            using (var ms = new MemoryStream())
            {
                img.CopyTo(ms);
                var fileBytes = ms.ToArray();
                var _img = Image.FromBytes(fileBytes);
                System.Environment.SetEnvironmentVariable("GOOGLE_APPLICATION_CREDENTIALS", "pubpal-8e4e5a6505d6.json");

                var client = ImageAnnotatorClient.Create();

                var response = client.DetectLogos(_img);
                foreach (var annotation in response)
                {
                    if (annotation.Description != null)
                    {
                        rv.Add(annotation.Description);
                    }
                }
            }

            return rv;
        }
    }
}
