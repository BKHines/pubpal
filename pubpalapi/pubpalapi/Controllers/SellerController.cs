﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Hosting;
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
    public class SellerController : ControllerBase
    {
        private readonly SettingsModel _settings;
        private readonly string dbName;
        private readonly string storeName;
        private readonly string purchaseStoreName;
        private readonly PubPalLogger _logger;
        private readonly IWebHostEnvironment _env;

        public SellerController(IOptions<SettingsModel> options, ILogger<SellerController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            storeName = _settings.SellerStoreName;
            purchaseStoreName = _settings.PurchaseStoreName;
            _logger = new PubPalLogger(logger);
        }

        #region Seller Methods
        [HttpGet]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult Get()
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Sellers = repo.GetSellers();
                if (Sellers == null)
                {
                    return NotFound();
                }
                var _Sellers = Sellers.Select(a => repo.GetScrubbedSeller(a));
                return Ok(_Sellers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellerById", Name = "GetSellerById")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult GetById(string id)
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Seller = repo.GetSellerById(id);
                if (Seller == null)
                {
                    return NotFound();
                }
                var _Seller = repo.GetScrubbedSeller(Seller);
                return Ok(_Seller);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellerByEmail", Name = "GetSellerByEmail")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult GetByEmail(string email)
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Seller = repo.GetSellerByEmail(email);
                if (Seller == null)
                {
                    return NotFound();
                }
                var _Seller = repo.GetScrubbedSeller(Seller);
                return Ok(_Seller);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellerByName", Name = "GetSellerByName")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult GetByName(string name)
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Seller = repo.GetSellerByName(name);
                if (Seller == null)
                {
                    return NotFound();
                }
                var _Seller = repo.GetScrubbedSeller(Seller);
                return Ok(_Seller);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetSellerCategories", Name = "GetSellerCategories")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult GetSellerCategories(string id)
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var sellerCats = repo.GetSellerCategories(id).Distinct();
                if (sellerCats == null)
                {
                    return NotFound();
                }
                return Ok(sellerCats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost]
        public IActionResult Post([FromBody] SellerModel Seller)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(Seller.email))
            {
                return BadRequest();
            }

            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var SellerId = repo.CreateSeller(Seller);
                return Ok(SellerId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult Put([FromBody] SellerModel Seller)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(Seller._id))
            {
                return BadRequest();
            }

            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Sellerupdated = repo.UpdateSeller(Seller);
                return Ok(Sellerupdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("AddItem", Name = "AddItem")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult AddItem(string id, [FromBody] PurchasableItemModel item)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var purchasableItemId = repo.AddPurchasableItem(id, item);
                return Ok(purchasableItemId);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("UpdateItem", Name = "UpdateItem")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult UpdateItem(string id, [FromBody] PurchasableItemModel item)
        {
            if (!ModelState.IsValid || string.IsNullOrEmpty(id))
            {
                return BadRequest();
            }

            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var itemupdated = repo.UpdatePurchasableItem(id, item);
                return Ok(itemupdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("UpdatePassword", Name = "UpdateSellerPassword")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult UpdatePassword([FromBody] ChangePasswordRequest changePassword)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest();
            }

            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Sellerupdated = repo.ChangePassword(changePassword);
                return Ok(Sellerupdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DeleteItem", Name = "DeleteItem")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult DeleteItem(string id, string itemid)
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Sellerdeleted = repo.DeletePurchasableItem(id, itemid);
                return Ok(Sellerdeleted);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DeleteSeller", Name = "DeleteSeller")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult DeleteSeller(string deleteid)
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Sellerdeleted = repo.DeleteSeller(deleteid);
                return Ok(Sellerdeleted);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DisableSeller/{id}", Name = "DisableSeller")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult DisableSeller(string disableid)
        {
            try
            {
                var repo = new SellerRepository(dbName, storeName);
                var Sellerdisabled = repo.DisableSeller(disableid);
                return Ok(Sellerdisabled);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost("ScrapeLabel", Name = "ScrapeLabel")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesSellerConst)]
        public IActionResult ScrapeLabel()
        {
            try
            {
                IEnumerable<string> texts = null, logos = null;
                var _files = HttpContext.Request.Form.Files;
                if (_files.Any())
                {
                    var repo = new SellerRepository(dbName, storeName);
                    texts = repo.ScrapeImageText(_files.First());
                    logos = repo.ScrapeImageLogo(_files.First());
                }

                return Ok(new { texts, logos });
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
        #endregion
    }
}
