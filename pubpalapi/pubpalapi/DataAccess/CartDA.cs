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
    public class CartDA
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _mongoDatabase;
        protected static string storeName;

        public CartDA(string _dbName, string _storeName)
        {
            storeName = _storeName;
            _client = new MongoClient();
            var mongoDBName = _dbName;
            _mongoDatabase = _client.GetDatabase(mongoDBName);
        }

        public IEnumerable<CartModel> GetCarts()
        {
            if (_mongoDatabase != null)
            {
                var users = _mongoDatabase.GetCollection<CartModel>(storeName);
                var result = users.Find(a => true).ToEnumerable();
                return result;
            }

            return null;
        }

        public CartModel GetCartById(string id)
        {
            var queryText = $"{{'_id': {{'$oid':'{id}'}} }}";
            var cart = GetFromStore(queryText);
            return cart.SingleOrDefault();
        }

        public CartModel GetCartByUserId(string userid)
        {
            var queryText = $"{{'purchases.userid': {{'$oid':'{userid}'}} }}";
            var cart = GetFromStore(queryText);
            return cart.SingleOrDefault();
        }

        public string CreateCart(CartModel newCart)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<CartModel>(storeName);
                coll.InsertOne(newCart);

                return GetIdFromObject(newCart);
            }

            return String.Empty;
        }

        public bool UpdateCart(CartModel updatedCart)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<CartModel>(storeName);

                coll.ReplaceOne(a => a._id == GetIdFromObject(updatedCart), updatedCart);
                return true;
            }

            return false;
        }

        public bool DeleteCart(string id)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<CartModel>(storeName);
                coll.DeleteOne(a => GetIdFromObject(a) == id);

                return true;
            }

            return false;
        }

        protected IEnumerable<CartModel> GetFromStore(string jsonQuery)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<CartModel>(storeName);
                var filter = BsonSerializer.Deserialize<BsonDocument>(jsonQuery);
                var result = coll.Find(filter).ToEnumerable();

                return result;
            }

            return null;
        }

        private string GetIdFromObject(CartModel _object)
        {
            return (string)_object.GetType().GetProperty("_id").GetValue(_object, null);
        }
    }
}
