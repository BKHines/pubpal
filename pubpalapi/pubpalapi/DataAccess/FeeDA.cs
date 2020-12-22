using MongoDB.Driver;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.DataAccess
{
    public class FeeDA
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _mongoDatabase;
        protected static string storeName;

        public FeeDA(string _dbName, string _storeName)
        {
            storeName = _storeName;
            _client = new MongoClient();
            var mongoDBName = _dbName;
            _mongoDatabase = _client.GetDatabase(mongoDBName);
        }

        public FeeModel GetFee()
        {
            if (_mongoDatabase != null)
            {
                var fees = _mongoDatabase.GetCollection<FeeModel>(storeName);
                var result = fees.Find(a => true).FirstOrDefault();
                return result;
            }

            return null;
        }

        public FeeModel GetFeeByPrice(decimal cost)
        {
            if (_mongoDatabase != null)
            {
                var fees = _mongoDatabase.GetCollection<FeeModel>(storeName);
                var _fees = fees.Find(a => true).ToEnumerable().ToList();
                var result = _fees.OrderByDescending(a => a.threshold).FirstOrDefault(a => cost >= a.threshold);
                return result;
            }

            return null;
        }
    }
}
