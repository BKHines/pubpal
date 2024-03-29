﻿using pubpalapi.DataAccess;
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
            var users = userDA.GetPersons();
            return users;
        }

        public UserModel GetUserById(string id)
        {
            var user = userDA.GetPersonById(id);
            return user;
        }

        public UserModel GetUserByEmail(string email)
        {
            var user = userDA.GetPersonByEmail(email);
            return user;
        }

        public UserModel GetUserByName(string name)
        {
            var nameParts = name.Split(' ');
            if (string.IsNullOrWhiteSpace(name))
            {
                return null;
            }

            var user = userDA.GetPersonByName(nameParts[0], nameParts.Length > 1 ? nameParts[1] : string.Empty);
            return user;
        }

        public string CreateUser(UserModel user)
        {
            var userid = userDA.CreatePerson(user);
            return userid;
        }

        public bool UpdateUser(UserModel user)
        {
            var userupdated = userDA.UpdatePerson(user, false);
            return userupdated;
        }

        public bool ChangePassword(ChangePasswordRequest changePassword)
        {
            var user = userDA.GetPersonById(changePassword.id);
            if (changePassword.newpassword == changePassword.confirmpassword)
            {
                user.password = changePassword.newpassword;
            }
            var userupdated = userDA.UpdatePerson(user, true);
            return userupdated;
        }

        public bool AddFavorite(string userid, string sellerid)
        {
            var user = userDA.GetPersonById(userid);
            if (user.favorites == null)
            {
                user.favorites = new List<string>().ToArray();
            }
            var _favorites = user.favorites.ToList();
            _favorites.Add(sellerid);
            user.favorites = _favorites.ToArray();
            var userupdated = userDA.UpdatePerson(user, false);
            return userupdated;
        }

        public bool RemoveFavorite(string userid, string sellerid)
        {
            var user = userDA.GetPersonById(userid);
            user.favorites = user.favorites?.ToList().Where(a => !string.Equals(a, sellerid, StringComparison.InvariantCultureIgnoreCase)).ToArray();
            var userupdated = userDA.UpdatePerson(user, false);
            return userupdated;
        }

        public bool DeleteUser(string id)
        {
            var userdeleted = userDA.DeletePerson(id);
            return userdeleted;
        }

        public bool DisableUser(string id)
        {
            var user = userDA.GetPersonById(id);
            user.enabled = false;
            var userupdated = userDA.UpdatePerson(user, false);
            return userupdated;
        }
    }
}
