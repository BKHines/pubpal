using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using pubpalapi.Core;
using pubpalapi.Repositories;
using PubPalAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Controllers
{
    [Produces("application/json")]
    [Route("api/[controller]")]
    [EnableCors("PubPalCORS")]
    [ServiceFilter(typeof(PubPalInterceptor))]
    public class CommonController : ControllerBase
    {
        private readonly SettingsModel _settings;
        private readonly string dbName;
        private readonly string feeStoreName;
        private readonly PubPalLogger _logger;

        public CommonController(IOptions<SettingsModel> options, ILogger<CommonController> logger)
        {
            _settings = options.Value;
            dbName = _settings.Database;
            feeStoreName = _settings.FeeStoreName;
            _logger = new PubPalLogger(logger);
        }

        [HttpGet("GetIp", Name = "GetIp")]
        public IActionResult GetIp()
        {
            string ip = HttpContext.Request.Headers["X-Forwarded-For"]; // AWS compatibility
            if (string.IsNullOrEmpty(ip))
            {
                ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString();
            }
            return Ok(ip);
        }

        [HttpGet("GetFee", Name = "GetFee")]
        [Authorize(AuthenticationSchemes = Constants.SchemesNamesUserConst)]
        public IActionResult GetFee()
        {
            try
            {
                var repo = new FeeRepository(dbName, feeStoreName);
                var fee = repo.GetFee();
                return Ok(fee);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex);
            }
        }
    }
}
