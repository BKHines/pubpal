using System;
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

namespace pubpalapi.Controllers
{
    [Produces("application/json")]
    [Route("api/User")]
    [EnableCors("PubPalCORS")]
    [ServiceFilter(typeof(PubPalInterceptor))]
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
                return users == null ? NotFound() : (IActionResult)Ok(users);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetUserById/{id}", Name = "GetUserById")]
        public IActionResult GetById([FromRoute] string id)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var user = repo.GetUserById(id);
                return user == null ? NotFound() : (IActionResult)Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetUserByEmail/{email}", Name = "GetUserByEmail")]
        public IActionResult GetByEmail([FromRoute] string email)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var user = repo.GetUserByEmail(email);
                return user == null ? NotFound() : (IActionResult)Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetUserByName/{name}", Name = "GetUserByName")]
        public IActionResult GetByName([FromRoute] string name)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var user = repo.GetUserByName(name);
                return user == null ? NotFound() : (IActionResult)Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] UserModel req)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(req.password))
            {
                return BadRequest();
            }

            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userId = repo.CreatUser(req);
                return Ok(userId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut]
        public IActionResult Put([FromBody] UserModel req)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(req._id))
            {
                return BadRequest();
            }

            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userupdated = repo.UpdateUser(req);
                return Ok(userupdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DeleteUser/{delid}", Name = "DeleteUser")]
        public IActionResult DeleteUser([FromRoute] string id)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userdeleted = repo.DeleteUser(id);
                return Ok(userdeleted);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DisableUser/{disid}", Name = "DisableUser")]
        public IActionResult DisableUser([FromRoute] string id)
        {
            try
            {
                var repo = new UserRepository(dbName, storeName);
                var userdisabled = repo.DisableUser(id);
                return Ok(userdisabled);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
    }
}