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
    public class CartController : ControllerBase
    {
        private readonly SettingsModel _settings;
        private readonly string dbName;
        private readonly string storeName;
        private readonly string purchaseStoreName;
        private readonly string userStoreName;
        private readonly PubPalLogger _logger;

        public CartController(IOptions<SettingsModel> options, ILogger<UserController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            storeName = _settings.CartStoreName;
            purchaseStoreName = _settings.PurchaseStoreName;
            userStoreName = _settings.UserStoreName;
            _logger = new PubPalLogger(logger);
        }

        [HttpGet("GetCartById", Name = "GetCartById")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetCartById(string id)
        {
            try
            {
                var repo = new CartRepository(dbName, storeName);
                var cart = repo.GetCartById(id);
                if (cart == null)
                {
                    return NotFound();
                }
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetCartByUserId", Name = "GetCartByUserId")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetCartByUserId(string userid)
        {
            try
            {
                var repo = new CartRepository(dbName, storeName);
                var cart = repo.GetCartByUserId(userid);
                return Ok(cart);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpGet("GetCartPurchaseByCartPurchaseId", Name = "GetCartPurchaseByCartPurchaseId")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetCartPurchaseByCartPurchaseId(string id, string cartPurchaseId)
        {
            try
            {
                var repo = new CartRepository(dbName, storeName);
                var cartPurchase = repo.GetCartPurchaseByCartPurchaseId(id, cartPurchaseId);
                if (cartPurchase == null)
                {
                    return NotFound();
                }
                return Ok(cartPurchase);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult Post([FromBody] CartModel cart)
        {
            if (!ModelState.IsValid || cart.purchases.Any(a => string.IsNullOrWhiteSpace(a.userid) || string.IsNullOrWhiteSpace(a.sellerid)))
            {
                return BadRequest();
            }

            try
            {
                var repo = new CartRepository(dbName, storeName);
                var cartid = repo.AddCart(cart);
                return Ok(cartid);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPatch("AddPurchaseToCart", Name = "AddPurchaseToCart")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult AddPurchaseToCart(string id, [FromBody] CartPurchaseModel cartPurchase)
        {
            if (!ModelState.IsValid || string.IsNullOrWhiteSpace(cartPurchase.userid) || string.IsNullOrWhiteSpace(cartPurchase.sellerid))
            {
                return BadRequest();
            }

            try
            {
                var repo = new CartRepository(dbName, storeName);
                var purchaseAdded = repo.AddPurchaseToCart(id, cartPurchase);
                return Ok(purchaseAdded);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPatch("RemovePurchaseFromCart", Name = "RemovePurchaseFromCart")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult RemovePurchaseFromCart(string id, string cartpurchaseid)
        {
            try
            {
                var repo = new CartRepository(dbName, storeName);
                var purchaseRemoved = repo.RemovePurchaseFromCart(id, cartpurchaseid);
                return Ok(purchaseRemoved);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("DeleteCart", Name = "DeleteCart")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult DeleteCart(string id)
        {
            try
            {
                var repo = new CartRepository(dbName, storeName);
                var cartDeleted = repo.DeleteCart(id);
                return Ok(cartDeleted);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPut("MakePurchases", Name = "MakePurchases")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult MakePurchases(string id)
        {
            try
            {
                var repo = new CartRepository(dbName, storeName, purchaseStoreName, userStoreName);
                var purchasesMade = repo.MakePurchases(id);
                return Ok(purchasesMade);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
    }
}