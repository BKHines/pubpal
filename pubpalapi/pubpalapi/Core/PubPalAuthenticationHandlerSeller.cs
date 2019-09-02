using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using PubPalAPI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;
using System.Threading.Tasks;

namespace pubpalapi.Core
{
    public class PubPalAuthenticationHandlerSeller : PubPalAuthenticationHandler
    {
        public PubPalAuthenticationHandlerSeller(IOptionsMonitor<TokenAuthenticationOptions> options,
            ILoggerFactory logger,
            UrlEncoder encoder,
            ISystemClock clock,
            IHttpContextAccessor httpContextAccessor,
            IOptions<SettingsModel> settingsoptions)
        : base(options, logger, encoder, clock, httpContextAccessor, settingsoptions)
        {
            _settings = settingsoptions.Value;
            _storeToUse = _settings.SellerStoreName;
        }
    }
}
