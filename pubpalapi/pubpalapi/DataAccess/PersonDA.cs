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
    public class PersonDA<T>
    {
        protected static IMongoClient _client;
        protected static IMongoDatabase _mongoDatabase;
        protected static string storeName;

        public PersonDA(string _dbName, string _storeName)
        {
            storeName = _storeName;
            _client = new MongoClient();
            var mongoDBName = _dbName;
            _mongoDatabase = _client.GetDatabase(mongoDBName);
        }

        public IEnumerable<T> GetPersons()
        {
            if (_mongoDatabase != null)
            {
                var users = _mongoDatabase.GetCollection<T>(storeName);
                var result = users.Find(a => true).ToEnumerable();
                return result;
            }

            return null;
        }

        public T GetPersonById(string id)
        {
            var queryText = $"{{'_id': {{'$oid':'{id}'}} }}";
            var user = GetFromStore(queryText);
            return user.SingleOrDefault();
        }

        public T GetPersonByEmail(string email)
        {
            var queryText = $"{{'email': '{email}' }}";
            var user = GetFromStore(queryText);
            return user.SingleOrDefault();
        }

        public T GetPersonByName(string fname, string lname)
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
            var user = GetFromStore(queryText);
            return user.SingleOrDefault();
        }

        public string CreatePerson(T newPerson)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<T>(storeName);
                coll.InsertOne(newPerson);

                return GetIdFromObject(newPerson);
            }

            return String.Empty;
        }

        public bool UpdatePerson(T updatedPerson, bool updatePassword)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<T>(storeName);

                coll.ReplaceOne(a => GetIdFromObject(a) == GetIdFromObject(updatedPerson), updatedPerson);
                return true;
            }

            return false;
        }

        public bool DeletePerson(string id)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<T>(storeName);
                coll.DeleteOne(a => GetIdFromObject(a) == id);

                return true;
            }

            return false;
        }

        protected IEnumerable<T> GetFromStore(string jsonQuery)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<T>(storeName);
                var filter = BsonSerializer.Deserialize<BsonDocument>(jsonQuery);
                var result = coll.Find(filter).ToEnumerable();

                return result;
            }

            return null;
        }

        private string GetIdFromObject(T _object)
        {
            return (string)_object.GetType().GetProperty("_id").GetValue(_object, null);
        }
    }
}
