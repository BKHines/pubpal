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
    public class SellerDA
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _mongoDatabase;
        private static string storeName;

        public SellerDA(string _dbName, string _storeName)
        {
            storeName = _storeName;
            _client = new MongoClient();
            var mongoDBName = _dbName;
            _mongoDatabase = _client.GetDatabase(mongoDBName);
        }

        public IEnumerable<SellerModel> GetSellers()
        {
            if (_mongoDatabase != null)
            {
                var users = _mongoDatabase.GetCollection<SellerModel>(storeName);
                var result = users.Find(a => true).ToEnumerable();
                return result;
            }

            return null;
        }

        public SellerModel GetSellerById(string id)
        {
            var queryText = $"{{'_id': {{'$oid':'{id}'}} }}";
            var seller = GetFromSellerStore(queryText);
            return seller.SingleOrDefault();
        }

        public SellerModel GetSellerByEmail(string email)
        {
            var queryText = $"{{'email': '{email}' }}";
            var seller = GetFromSellerStore(queryText);
            return seller.SingleOrDefault();
        }

        public SellerModel GetSellerByName(string fname, string lname)
        {
            var queryText = string.Empty;
            if (!string.IsNullOrWhiteSpace(fname) && string.IsNullOrWhiteSpace(lname))
            {
                queryText = $"{{ $or: [ {{ 'firstname':/^{fname}$/i }}, {{ 'lastname':/^{fname}$/i }} ] }}";
            }
            else
            {
                queryText = $"{{ 'firstname':/^{fname}$/i, 'lastname':/^{lname}$/i }}";
            }
            var seller = GetFromSellerStore(queryText);
            return seller.SingleOrDefault();
        }

        public SellerModel[] GetSellersByLocation(float lat, float lng, int miles)
        {
            // TODO: find a way to query geo properties within miles or pull them back and do it in LINQ (probably too slow)
            var queryText = $"{{ }}";
            var sellers = GetFromSellerStore(queryText);
            return sellers != null ? sellers.ToArray() : null;
        }

        public string CreateSeller(SellerModel newSeller)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<SellerModel>(storeName);
                coll.InsertOne(newSeller);

                return newSeller._id;
            }

            return String.Empty;
        }

        public bool UpdateSeller(SellerModel updatedSeller, bool updatePassword)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<SellerModel>(storeName);
                var _seller = GetSellerById(updatedSeller._id);
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

        public bool DeleteSeller(string id)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<SellerModel>(storeName);
                coll.DeleteOne(a => a._id == id);

                return true;
            }

            return false;
        }

        private IEnumerable<SellerModel> GetFromSellerStore(string jsonQuery)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<SellerModel>(storeName);
                var filter = BsonSerializer.Deserialize<BsonDocument>(jsonQuery);
                var result = coll.Find(filter).ToEnumerable();

                return result;
            }

            return null;
        }

    }
}
