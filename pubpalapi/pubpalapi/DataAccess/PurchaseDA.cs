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
    public class PurchaseDA
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _mongoDatabase;
        protected static string storeName;

        public PurchaseDA(string _dbName, string _storeName)
        {
            storeName = _storeName;
            _client = new MongoClient();
            var mongoDBName = _dbName;
            _mongoDatabase = _client.GetDatabase(mongoDBName);
        }

        public IEnumerable<PurchaseModel> GetPurchases()
        {
            if (_mongoDatabase != null)
            {
                var users = _mongoDatabase.GetCollection<PurchaseModel>(storeName);
                var result = users.Find(a => true).ToEnumerable();
                return result;
            }

            return null;
        }

        public PurchaseModel GetPurchaseById(string id)
        {
            var queryText = $"{{'_id': {{'$oid':'{id}'}} }}";
            var purchase = GetFromStore(queryText);
            return purchase.SingleOrDefault();
        }

        public PurchaseModel GetPurchaseByIdAndPersonId(string id, string personId)
        {
            var queryText = $"{{ $and: [{{'_id': {{ '$oid':'{id}' }} }}, {{ $or: [ {{ 'sellerid': {{ '$oid':'{personId}'}} }}, {{ 'userid': {{ '$oid':'{personId}' }} }}] }}] }}";
            var purchases = GetFromStore(queryText);
            return purchases.SingleOrDefault();
        }

        public IEnumerable<PurchaseModel> GetPurchasesBySellerId(string sellerid)
        {
            if (_mongoDatabase != null)
            {
                var queryText = $"{{'sellerid': {{'$oid':'{sellerid}'}} }}";
                var purchases = GetFromStore(queryText);
                return purchases;
            }

            return null;
        }

        public IEnumerable<PurchaseModel> GetPurchasesByUserId(string userid)
        {
            if (_mongoDatabase != null)
            {
                var queryText = $"{{'userid': {{'$oid':'{userid}'}} }}";
                var purchases = GetFromStore(queryText);
                return purchases;
            }

            return null;
        }

        public IEnumerable<PurchaseModel> GetSellerPurchasesByStatus(string sellerid, PurchaseStatus status)
        {
            if (_mongoDatabase != null)
            {
                var queryText = $"{{ $and: [{{'sellerid': {{ '$oid':'{sellerid}' }} }}, {{'currentstatus': '{status.ToString()}' }}] }}";
                var purchases = GetFromStore(queryText);
                return purchases;
            }

            return null;
        }

        public string CreatePurchase(PurchaseModel newPurchase)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<PurchaseModel>(storeName);
                coll.InsertOne(newPurchase);

                return GetIdFromObject(newPurchase);
            }

            return String.Empty;
        }

        public bool UpdatePurchase(PurchaseModel updatedPurchase)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<PurchaseModel>(storeName);

                coll.ReplaceOne(a => a._id == GetIdFromObject(updatedPurchase), updatedPurchase);
                return true;
            }

            return false;
        }

        public bool DeletePurchase(string id)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<PurchaseModel>(storeName);
                coll.DeleteOne(a => GetIdFromObject(a) == id);

                return true;
            }

            return false;
        }

        protected IEnumerable<PurchaseModel> GetFromStore(string jsonQuery)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<PurchaseModel>(storeName);
                var filter = BsonSerializer.Deserialize<BsonDocument>(jsonQuery);
                var result = coll.Find(filter).ToEnumerable();

                return result;
            }

            return null;
        }

        private string GetIdFromObject(PurchaseModel _object)
        {
            return (string)_object.GetType().GetProperty("_id").GetValue(_object, null);
        }
    }
}
