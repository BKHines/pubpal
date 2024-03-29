﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using PubPalAPI.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using pubpalapi.Core;
using pubpalapi.Models;
using pubpalapi.Repositories;
using Microsoft.AspNetCore.Authorization;

namespace pubpalapi.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [EnableCors("PubPalCORS")]
    [ServiceFilter(typeof(PubPalInterceptor))]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly SettingsModel _settings;
        private readonly string dbName;
        private readonly string storeName;
        private readonly string sellerStoreName;
        private readonly string cartStoreName;
        private readonly string purchaseStoreName;
        private readonly PubPalLogger _logger;

        public UserController(IOptions<SettingsModel> options, ILogger<UserController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            storeName = _settings.UserStoreName;
            sellerStoreName = _settings.SellerStoreName;
            cartStoreName = _settings.CartStoreName;
            purchaseStoreName = _settings.PurchaseStoreName;
            _logger = new PubPalLogger(logger);
        }

        #region User Methods
        [HttpGet]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult Get()
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var users = repo.GetUsers();
                if (users == null)
                {
                    return NotFound();
                }
                var _users = users.Select(a => repo.GetScrubbedUser(a));
                return Ok(_users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetUserById", Name = "GetUserById")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetById(string id)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var user = repo.GetUserById(id);
                if (user == null)
                {
                    return NotFound();
                }
                var _user = repo.GetScrubbedUser(user);
                return Ok(_user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetUserByEmail", Name = "GetUserByEmail")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetByEmail(string email)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var user = repo.GetUserByEmail(email);
                if (user == null)
                {
                    return NotFound();
                }
                var _user = repo.GetScrubbedUser(user);
                return Ok(_user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetUserByName", Name = "GetUserByName")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetByName(string name)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var user = repo.GetUserByName(name);
                if (user == null)
                {
                    return NotFound();
                }
                var _user = repo.GetScrubbedUser(user);
                return Ok(_user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("GetSellerNamesByIds", Name = "GetSellerNamesByIds")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetSellerNamesByIds([FromBody] string[] sellerids)
        {
            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var sellerNames = repo.GetSellerNamesByIds(sellerids);
                if (sellerNames == null)
                {
                    return NotFound();
                }
                return Ok(sellerNames);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellersByLocation", Name ="GetSellersByLocation")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetSellersByLocation(float lat, float lng, int miles)
        {
            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var Sellers = repo.GetSellersByLocation(lat, lng, miles);
                if (Sellers == null)
                {
                    return NotFound();
                }
                return Ok(Sellers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellerTagsForUser", Name = "GetSellerTagsForUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetSellerTagsForUser(string userid, string sellerid)
        {
            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var SellerTags = repo.GetSellerTagsByUser(sellerid, userid);
                return Ok(SellerTags);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellersByTagSearch", Name = "GetSellersByTagSearch")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetSellersByTagSearch(string tagSearchText, float lat = 0, float lng = 0)
        {
            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var sellers = repo.GetSellersByTagSearch(tagSearchText, lat, lng);
                return Ok(sellers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserModel user)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(user.email))
            {
                return BadRequest();
            }

            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userId = repo.CreateUser(user);
                return Ok(userId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult Put([FromBody] UserModel user)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(user._id))
            {
                return BadRequest();
            }

            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userupdated = repo.UpdateUser(user);
                return Ok(userupdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("UpdatePassword", Name = "UpdateUserPassword")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult UpdatePassword([FromBody] dynamic changeReq)
        {
            try
            {
                var changePassword = (ChangePasswordRequest)changeReq;
                var repo = new UserRepository(dbName, storeName);
                var Userupdated = repo.ChangePassword(changePassword);
                return Ok(Userupdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("AddFavorite", Name = "AddFavorite")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult AddFavorite(string userid, string sellerid)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userUpdated = repo.AddFavorite(userid, sellerid);
                return Ok(userUpdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("RemoveFavorite", Name = "RemoveFavorite")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult RemoveFavorite(string userid, string sellerid)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userUpdated = repo.RemoveFavorite(userid, sellerid);
                return Ok(userUpdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("AddSellerTagByUser", Name = "AddSellerTagByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult AddTag(string sellerid, SellerTagModel tag)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var tagadded = repo.AddTag(sellerid, tag);
                return Ok(tagadded);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("RemoveSellerTagByUser", Name = "RemoveSellerTagByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult RemoveTag(string sellerid, SellerTagModel tag)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var tagadded = repo.RemoveTag(sellerid, tag);
                return Ok(tagadded);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DeleteUser", Name = "DeleteUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult DeleteUser(string deleteid)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userdeleted = repo.DeleteUser(deleteid);
                return Ok(userdeleted);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DisableUser/{id}", Name = "DisableUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult DisableUser(string disableid)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userdisabled = repo.DisableUser(disableid);
                return Ok(userdisabled);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
        #endregion
    }
}