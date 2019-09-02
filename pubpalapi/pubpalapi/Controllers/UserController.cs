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
        private readonly string purchaseStoreName;
        private readonly string sellerStoreName;
        private readonly PubPalLogger _logger;

        public UserController(IOptions<SettingsModel> options, ILogger<UserController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            storeName = _settings.UserStoreName;
            purchaseStoreName = _settings.PurchaseStoreName;
            sellerStoreName = _settings.SellerStoreName;
            _logger = new PubPalLogger(logger);
        }

        #region User Methods
        [HttpGet]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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

        [HttpGet("GetSellersByLocation", Name ="GetSellersByLocation")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult UpdatePassword([FromBody] ChangePasswordRequest changePassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new UserRepository(dbName, storeName);
                var Userupdated = repo.ChangePassword(changePassword);
                return Ok(Userupdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DeleteUser", Name = "DeleteUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
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

        #region Purchase Methods
        [HttpGet("GetSellerOptionsById", Name = "GetSellerOptionsById")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult GetSellerOptionsById(string id)
        {
            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var options = repo.GetSellersOptions(id);
                if (options == null)
                {
                    return NotFound();
                }
                return Ok(options);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellerOptionByIds", Name = "GetSellerOptionByIds")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult GetSellerOptionById(string id, string optionId)
        {
            try
            {
                var repo = new SellerRepository(dbName, sellerStoreName);
                var option = repo.GetSellersOption(id, optionId);
                if (option == null)
                {
                    return NotFound();
                }
                return Ok(option);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetPurchasesByUserId", Name = "GetPurchasesByUserId")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult GetPurchasesByUserId(string personid)
        {
            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName);
                var purchases = repo.GetPurchasesByUserId(personid);
                if (purchases == null)
                {
                    return NotFound();
                }
                return Ok(purchases);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetPurchaseForUserById", Name = "GetPurchaseForUserById")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult GetPurchaseForUserById(string id)
        {
            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName);
                var purchase = repo.GetPurchaseById(id);
                if (purchase == null)
                {
                    return NotFound();
                }
                return Ok(purchase);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost("CreatePurchaseByUser", Name = "CreatePurchaseByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult CreatePurchase([FromBody] PurchaseModel purchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName, storeName);
                var purchaseId = repo.CreatePurchase(purchase);
                return Ok(purchaseId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost("UpdatePurchaseByUser", Name = "UpdatePurchaseByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult UpdatePurchaseByUser([FromBody] PurchaseModel purchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName);
                var purchaseId = repo.UpdatePurchase(purchase);
                return Ok(purchaseId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("CancelPurchaseByUser", Name = "CancelPurchaseByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesConst)]
        public IActionResult CancelPurchaseByUser(string id, [FromBody] ChangePurchaseStatusRequest req)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName, storeName);
                var purchaseStatusUpdated = repo.UpdatePurchaseStatus(id, req.purchaseid, req.status, req.message);
                return Ok(purchaseStatusUpdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
        #endregion
    }
}