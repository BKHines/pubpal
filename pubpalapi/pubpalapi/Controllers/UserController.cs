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
    [Route("api/User")]
    [EnableCors("PubPalCORS")]
    [ServiceFilter(typeof(PubPalInterceptor))]
    [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
    public class UserController : ControllerBase
    {
        private readonly SettingsModel _settings;
        private readonly string dbName;
        private readonly string storeName;
        private readonly PubPalLogger _logger;

        public UserController(IOptions<SettingsModel> options, ILogger<UserController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            storeName = _settings.UsersStoreName;
            _logger = new PubPalLogger(logger);
        }

        [HttpGet]
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
                // TODO: get password from token and set it on user object
                var userId = repo.CreateUser(user);
                return Ok(userId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut]
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

        [HttpPut("DeleteUser", Name = "DeleteUser")]
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
    }
}