using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using pubpalapi.Core;
using pubpalapi.Models;
using pubpalapi.Repositories;
using PubPalAPI.Models;

namespace pubpalapi.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [EnableCors("PubPalCORS")]
    [ServiceFilter(typeof(PubPalInterceptor))]
    [ApiController]
    public class PurchaseController : ControllerBase
    {
        private readonly SettingsModel _settings;
        private readonly string dbName;
        private readonly string storeName;
        private readonly string purchaseStoreName;
        private readonly string sellerStoreName;
        private readonly PubPalLogger _logger;

        public PurchaseController(IOptions<SettingsModel> options, ILogger<PurchaseController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            storeName = _settings.UserStoreName;
            purchaseStoreName = _settings.PurchaseStoreName;
            sellerStoreName = _settings.SellerStoreName;
            _logger = new PubPalLogger(logger);
        }

        #region User Purchase Methods
        [HttpGet("GetSellerOptionsById", Name = "GetSellerOptionsById")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
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
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult CreatePurchase([FromBody] PurchaseRequestWithService prequest)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName, storeName);
                var purchaseCreateWithResponse = repo.CreatePurchaseWithResponse(prequest.purchase, prequest.servicetype);
                return Ok(purchaseCreateWithResponse);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost("UpdatePurchaseByUser", Name = "UpdatePurchaseByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult UpdatePurchaseByUser([FromBody] PurchaseModel purchase)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName);
                var purchased = repo.UpdatePurchase(purchase);
                return Ok(purchased);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("PickedUpPurchaseByUser", Name = "PickedUpPurchaseByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult PickedUpPurchaseByUser(string id, [FromBody] ChangePurchaseStatusRequest req)
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

        [HttpPut("CancelPurchaseByUser", Name = "CancelPurchaseByUser")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
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

        #region Seller Purchase Methods
        [HttpGet("GetPurchasesBySellerId", Name = "GetPurchasesBySellerId")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult GetPurchasesBySellerId(string personid)
        {
            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName);
                var purchases = repo.GetPurchasesBySellerId(personid);
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

        [HttpGet("GetPurchasesBySellerIdAndDate", Name = "GetPurchasesBySellerIdAndDate")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult GetPurchasesBySellerIdAndDate(string personid, string activitydate)
        {
            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName);
                var purchases = repo.GetPurchasesBySellerIdAndActivityDate(personid, activitydate);
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

        [HttpGet("GetPurchaseForSellerById", Name = "GetPurchaseForSellerById")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult GetPurchaseForSellerById(string id)
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

        [HttpPut("ChangePurchaseStatusBySeller", Name = "ChangePurchaseStatusBySeller")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult ChangePurchaseStatusBySeller(string id, [FromBody] ChangePurchaseStatusRequest req)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            try
            {
                var repo = new PurchaseRepository(dbName, purchaseStoreName);
                var purchaseStatusUpdated = repo.UpdatePurchaseStatus(id, req.purchaseid, req.status, req.message);
                return Ok(purchaseStatusUpdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("CancelPurchaseBySeller", Name = "CancelPurchaseBySeller")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult CancelPurchaseBySeller(string id, [FromBody] ChangePurchaseStatusRequest req)
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