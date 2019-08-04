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
    public class UserDA
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _mongoDatabase;
        private static string storeName;

        public UserDA(string _dbName, string _storeName)
        {
            storeName = _storeName;
            _client = new MongoClient();
            var mongoDBName = _dbName;
            _mongoDatabase = _client.GetDatabase(mongoDBName);
        }

        public IEnumerable<UserModel> GetUsers()
        {
            if (_mongoDatabase != null)
            {
                var users = _mongoDatabase.GetCollection<UserModel>(storeName);
                var result = users.Find(a => true).ToEnumerable();
                return result;
            }

            return null;
        }

        public UserModel GetUserById(string id)
        {
            var queryText = $"{{'_id': {{'$oid':'{id}'}} }}";
            var user = GetFromUserStore(queryText);
            return user.SingleOrDefault();
        }

        public UserModel GetUserByEmail(string email)
        {
            var queryText = $"{{'email': '{email}' }}";
            var user = GetFromUserStore(queryText);
            return user.SingleOrDefault();
        }

        public UserModel GetUserByName(string fname, string lname)
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
            var user = GetFromUserStore(queryText);
            return user.SingleOrDefault();
        }

        public string CreateUser(UserModel newUser)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<UserModel>(storeName);
                coll.InsertOne(newUser);

                return newUser._id;
            }

            return String.Empty;
        }

        public bool UpdateUser(UserModel updatedUser, bool updatePassword)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<UserModel>(storeName);
                var _user = GetUserById(updatedUser._id);
                _user.email = updatedUser.email;
                if (updatePassword)
                {
                    _user.password = updatedUser.password;
                }
                _user.enabled = updatedUser.enabled;
                _user.firstname = updatedUser.firstname;
                _user.lastname = updatedUser.lastname;

                coll.ReplaceOne(a => a._id == updatedUser._id, _user);
                return true;
            }

            return false;
        }

        public bool DeleteUser(string id)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<UserModel>(storeName);
                coll.DeleteOne(a => a._id == id);

                return true;
            }

            return false;
        }

        private IEnumerable<UserModel> GetFromUserStore(string jsonQuery)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<UserModel>(storeName);
                var filter = BsonSerializer.Deserialize<BsonDocument>(jsonQuery);
                var result = coll.Find(filter).ToEnumerable();

                return result;
            }

            return null;
        }
    }
}
