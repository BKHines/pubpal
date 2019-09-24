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
    public class PasswordResetDA
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _mongoDatabase;
        protected static string storeName;

        public PasswordResetDA(string _dbName, string _storeName)
        {
            storeName = _storeName;
            _client = new MongoClient();
            var mongoDBName = _dbName;
            _mongoDatabase = _client.GetDatabase(mongoDBName);
        }

        public PasswordResetModel GetPasswordResetById(string id)
        {
            var queryText = $"{{'_id': {{'$oid':'{id}'}} }}";
            var pwreset = GetFromStore(queryText);
            return pwreset.SingleOrDefault();
        }

        private IEnumerable<PasswordResetModel> GetActivePasswordResetRequestIdsByUserId(string personid)
        {
            var queryText = $"{{'userid': {{'$oid':'{personid}'}} }}";
            var pwresets = GetFromStore(queryText);
            return pwresets.Where(a => (a.cancelledstatus is null || a.cancelledstatus.finished == false) && (a.completestatus is null || a.completestatus.finished == false));
        }

        public string CreatePasswordResetRequest(PasswordResetModel newPWResetReq)
        {
            if (_mongoDatabase != null)
            {
                var _activeUserPWResets = GetActivePasswordResetRequestIdsByUserId(newPWResetReq.personid);
                foreach (var _activeUserPWReset in _activeUserPWResets)
                {
                    _activeUserPWReset.completestatus = new PasswordResetFinishStatusModel()
                    {
                        requesttimestamp = DateTime.UtcNow,
                        requestip = newPWResetReq.requeststatus.requestip,
                        finished = true
                    };
                    UpdatePasswordResetRequest(_activeUserPWReset);
                }
                var coll = _mongoDatabase.GetCollection<PasswordResetModel>(storeName);
                coll.InsertOne(newPWResetReq);

                return GetIdFromObject(newPWResetReq);
            }

            return String.Empty;
        }

        public bool CompletePasswordResetRequest(string id, string ip)
        {
            var pwResetReq = GetPasswordResetById(id);
            pwResetReq.completestatus = new PasswordResetFinishStatusModel()
            {
                finished = true,
                requestip = ip,
                requesttimestamp = DateTime.UtcNow
            };
            return UpdatePasswordResetRequest(pwResetReq);
        }

        private bool UpdatePasswordResetRequest(PasswordResetModel pwReset)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<PasswordResetModel>(storeName);
                coll.ReplaceOne(a => a._id == GetIdFromObject(pwReset), pwReset);
                return true;
            }

            return false;
        }

        public bool CancelPasswordResetRequest(string id, string ip)
        {
            var pwResetReq = GetPasswordResetById(id);
            pwResetReq.cancelledstatus = new PasswordResetFinishStatusModel()
            {
                finished = true,
                requestip = ip,
                requesttimestamp = DateTime.UtcNow,
            };
            return UpdatePasswordResetRequest(pwResetReq);
        }

        protected IEnumerable<PasswordResetModel> GetFromStore(string jsonQuery)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<PasswordResetModel>(storeName);
                var filter = BsonSerializer.Deserialize<BsonDocument>(jsonQuery);
                var result = coll.Find(filter).ToEnumerable();

                return result;
            }

            return null;
        }

        private string GetIdFromObject(PasswordResetModel _object)
        {
            return (string)_object.GetType().GetProperty("_id").GetValue(_object, null);
        }
    }
}
