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
    public class PasswordResetController : ControllerBase
    {
        private readonly SettingsModel _settings;
        private readonly string dbName;
        private readonly string storeName;
        private readonly string sellerStoreName;
        private readonly string userStoreName;
        private readonly PubPalLogger _logger;

        public PasswordResetController(IOptions<SettingsModel> options, ILogger<PasswordResetController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            storeName = _settings.PasswordResetStoreName;
            sellerStoreName = _settings.SellerStoreName;
            userStoreName = _settings.UserStoreName;
            _logger = new PubPalLogger(logger);
        }

        [HttpPatch("CreatePasswordResetRequest", Name = "CreatePasswordResetRequest")]
        public IActionResult CreatePasswordResetRequest([FromBody] dynamic req)
        {
            if (string.IsNullOrWhiteSpace(req.email.ToString()) || string.IsNullOrWhiteSpace(req.ip.ToString()))
            {
                return BadRequest();
            }

            try
            {
                var resetReq = new PasswordResetRequestModel()
                {
                    email = req.email.ToString(),
                    ip = req.ip.ToString()
                };

                var repo = new PasswordResetRepository(dbName, storeName, sellerStoreName, userStoreName);
                repo.CreatePasswordResetRequest(resetReq.email, resetReq.ip);
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPatch("UpdatePasswordReset", Name = "UpdatePasswordReset")]
        public IActionResult UpdatePasswordReset([FromBody] dynamic changeReq)
        {
            if (string.IsNullOrWhiteSpace(changeReq.confirmpassword.ToString()) || string.IsNullOrWhiteSpace(changeReq.email.ToString()) 
                || string.IsNullOrWhiteSpace(changeReq.ip.ToString()) || string.IsNullOrWhiteSpace(changeReq.newpassword.ToString()) 
                || string.IsNullOrWhiteSpace(changeReq.resetid.ToString()))
            {
                return BadRequest();
            }

            try
            {
                var changePasswordResetReq = new ChangePasswordResetRequest()
                {
                    confirmpassword = changeReq.confirmpassword.ToString(),
                    email = changeReq.email.ToString(),
                    ip = changeReq.ip.ToString(),
                    newpassword = changeReq.newpassword.ToString(),
                    resetid = changeReq.resetid.ToString()
                };
                var pwRepo = new PasswordResetRepository(dbName, storeName, sellerStoreName, userStoreName);
                if (pwRepo.HasResetRequestExpired(changePasswordResetReq.resetid))
                {
                    return StatusCode(410, new Exception("Link has expired"));
                }

                var userUpdated = pwRepo.ChangePasswordAndCompletePasswordResetRequest(changePasswordResetReq);
                return Ok(userUpdated);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }

        [HttpPatch("CancelPasswordReset", Name = "CancelPasswordReset")]
        public IActionResult CancelPasswordReset([FromBody] dynamic changeReq)
        {
            if (string.IsNullOrWhiteSpace(changeReq.id.ToString()) || string.IsNullOrWhiteSpace(changeReq.ip.ToString()))
            {
                return BadRequest();
            }

            try
            {
                var pwRepo = new PasswordResetRepository(dbName, storeName, sellerStoreName, userStoreName);
                pwRepo.CancelPasswordResetRequest(changeReq.id.ToString(), changeReq.ip.ToString());
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
    }
}