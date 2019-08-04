using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Core
{
    public class PubPalInterceptor : ActionFilterAttribute
    {
        private readonly PubPalLogger _logger;

        public PubPalInterceptor(ILoggerFactory loggerFactory)
        {
            var logger = loggerFactory.CreateLogger("PubPalInterceptor");
            _logger = new PubPalLogger(logger);
        }

        public override void OnActionExecuting(ActionExecutingContext context)
        {
            var pathTitle = $"{context.HttpContext.Request.Path} - {context.HttpContext.Request.Method}";
            var objs = context.ActionArguments.Select(a => (object)a.Value);
            _logger.LogInfoObject(pathTitle, objs.ToList());
            base.OnActionExecuting(context);
        }

        public override void OnActionExecuted(ActionExecutedContext context)
        {
            base.OnActionExecuted(context);
        }

        public override void OnResultExecuting(ResultExecutingContext context)
        {
            base.OnResultExecuting(context);
        }

        public override void OnResultExecuted(ResultExecutedContext context)
        {
            if (context.HttpContext.Response.StatusCode != 200)
            {
                var pathTitle = $"{context.HttpContext.Request.Path} - {context.HttpContext.Request.Method}";
                var mpnLog = new PubPalLog()
                {
                    title = pathTitle,
                    messages = null
                };
                Exception ex = null;

                if (context.Result is ObjectResult)
                {
                    var objResult = context.Result as ObjectResult;

                    if (objResult.Value is Exception)
                    {
                        ex = objResult.Value as Exception;
                    }
                }

                _logger.LogMessage(LogType.error, mpnLog, ex);
            }

            base.OnResultExecuted(context);
        }
    }
}
