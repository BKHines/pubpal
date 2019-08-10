using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Driver;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.DataAccess
{
    public class SellerDA : PersonDA<SellerModel>
    {
        public SellerDA(string _dbName, string _storeName) : base(_dbName, _storeName)
        {
        }

        public SellerModel[] GetSellersByLocation(float lat, float lng, int miles)
        {
            // TODO: find a way to query geo properties within miles or pull them back and do it in LINQ (probably too slow)
            var queryText = $"{{ }}";
            var sellers = GetFromStore(queryText);
            return sellers != null ? sellers.Cast<SellerModel>().ToArray() : null;
        }

        public new bool UpdatePerson(SellerModel updatedSeller, bool updatePassword)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<SellerModel>(storeName);
                var _seller = (SellerModel)GetPersonById(updatedSeller._id);
                _seller.email = updatedSeller.email;
                if (updatePassword)
                {
                    _seller.password = updatedSeller.password;
                }
                _seller.enabled = updatedSeller.enabled;
                _seller.firstname = updatedSeller.firstname;
                _seller.lastname = updatedSeller.lastname;
                _seller.place = updatedSeller.place;
                _seller.items = updatedSeller.items;

                coll.ReplaceOne(a => a._id == updatedSeller._id, _seller);
                return true;
            }

            return false;
        }
    }
}
