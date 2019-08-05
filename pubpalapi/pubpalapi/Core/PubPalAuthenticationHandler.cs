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
    public class PubPalAuthenticationHandler : AuthenticationHandler<TokenAuthenticationOptions>
    {
        IHttpContextAccessor _httpContextAccessor = null;
        private readonly PubPalLogger _logger;
        private readonly SettingsModel _settings;

        public PubPalAuthenticationHandler(IOptionsMonitor<TokenAuthenticationOptions> options, ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock, IHttpContextAccessor httpContextAccessor, IOptions<SettingsModel> settingsoptions)
        : base(options, logger, encoder, clock)
        {
            _httpContextAccessor = httpContextAccessor;
            var LOGGER = logger.CreateLogger("PubPalInterceptor");
            _logger = new PubPalLogger(LOGGER);

            _settings = settingsoptions.Value;
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            if (!IsAuthorized())
            {
                return Task.FromResult(AuthenticateResult.Fail($"Token not valid"));
            }
            else
            {
                var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
                var claims = new[] { new Claim("token", token) };
                var identity = new ClaimsIdentity(claims, nameof(PubPalAuthenticationHandler));
                var ticket = new AuthenticationTicket(new ClaimsPrincipal(identity), this.Scheme.Name);
                return Task.FromResult(AuthenticateResult.Success(ticket));
            }
        }

        private bool IsAuthorized()
        {
            if (_settings.IsDev)
            {
                _httpContextAccessor.HttpContext.Request.Headers["Authorization"] = "Bearer DevToken";
                return true;
            }

            var token = _httpContextAccessor.HttpContext.Request.Headers["Authorization"];
            if (!String.IsNullOrWhiteSpace(token))
            {
                // remove "Bearer " from auth in headers
                var tokenTrim = token.First().Remove(0, 7);

                try
                {
                    string ip = _httpContextAccessor.HttpContext.Request.Headers["X-Forwarded-For"]; // AWS compatibility
                    if (string.IsNullOrEmpty(ip))
                    {
                        ip = _httpContextAccessor.HttpContext.Features.Get<IHttpConnectionFeature>()?.RemoteIpAddress.ToString();
                    }
                    string dbName = _settings.Database;
                    string userStore = _settings.UsersStoreName;

                    return PubPalSecurityManager.IsTokenValid(tokenTrim, ip, dbName, userStore, _logger);
                }
                catch
                {
                    return false;
                }
            }

            return false;
        }
    }

    public class TokenAuthenticationOptions : AuthenticationSchemeOptions { }
}
