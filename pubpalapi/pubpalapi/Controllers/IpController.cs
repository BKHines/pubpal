using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using pubpalapi.Core;
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
    public class IpController : ControllerBase
    {
        private readonly PubPalLogger _logger;

        public IpController(IOptions<SettingsModel> options, ILogger<IpController> logger)
        {
            _logger = new PubPalLogger(logger);
        }

        [HttpGet]
        public IActionResult Get()
        {
            string ip = HttpContext.Request.Headers["X-Forwarded-For"]; // AWS compatibility
            if (string.IsNullOrEmpty(ip))
            {
                ip = HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString();
            }
            return Ok(ip);
        }
    }
}
