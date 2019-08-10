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
    public class UserDA : PersonDA<UserModel>
    {
        public UserDA(string _dbName, string _storeName) : base(_dbName, _storeName)
        {
        }

        public new bool UpdatePerson(UserModel updatedUser, bool updatePassword)
        {
            if (_mongoDatabase != null)
            {
                var coll = _mongoDatabase.GetCollection<UserModel>(storeName);
                var _user = (UserModel)GetPersonById(updatedUser._id);
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
    }
}
