using pubpalapi.DataAccess;
using pubpalapi.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Repositories
{
    public class UserRepository
    {
        private UserDA userDA;

        public UserRepository(string dbName, string storeName)
        {
            userDA = new UserDA(dbName, storeName);
        }

        public UserModel GetScrubbedUser(UserModel user)
        {
            user.password = string.Empty;
            return user;
        }

        public IEnumerable<UserModel> GetUsers()
        {
            var users = userDA.GetUsers();
            return users;
        }

        public UserModel GetUserById(string id)
        {
            var user = userDA.GetUserById(id);
            return user;
        }

        public UserModel GetUserByEmail(string email)
        {
            var user = userDA.GetUserByEmail(email);
            return user;
        }

        public UserModel GetUserByName(string name)
        {
            var nameParts = name.Split(' ');
            if (string.IsNullOrWhiteSpace(name))
            {
                return null;
            }

            var user = userDA.GetUserByName(nameParts[0], nameParts.Length > 1 ? nameParts[1] : string.Empty);
            return user;
        }

        public string CreateUser(UserModel user)
        {
            var userid = userDA.CreateUser(user);
            return userid;
        }

        public bool UpdateUser(UserModel user)
        {
            var userupdated = userDA.UpdateUser(user);
            return userupdated;
        }

        public bool DeleteUser(string id)
        {
            var userdeleted = userDA.DeleteUser(id);
            return userdeleted;
        }

        public bool DisableUser(string id)
        {
            var user = userDA.GetUserById(id);
            user.enabled = false;
            var userupdated = userDA.UpdateUser(user);
            return userupdated;
        }
    }
}
