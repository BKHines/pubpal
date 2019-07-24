using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace pubpalapi.Core
{
    public enum LogType
    {
        error,
        info,
        warn,
        debug
    }

    public class PubPalLog
    {
        public string title { get; set; }
        public List<string> messages { get; set; }
    }

    public class PubPalLogger
    {
        private readonly ILogger _logger;

        public PubPalLogger(ILogger logger)
        {
            _logger = logger;
        }

        public void LogMessage(LogType logType, PubPalLog mpnLog, Exception ex = null)
        {
            var currentTime = DateTime.Now;

            switch (logType)
            {
                case LogType.debug:
                    _logger.LogDebug("----------------------------------------------------------------------------------------------------------------------");
                    _logger.LogDebug($"{mpnLog.title}");
                    _logger.LogDebug("----------------------------------------------------------------------------------------------------------------------");
                    mpnLog.messages?.ForEach((m) => { _logger.LogDebug(m); });
                    if (mpnLog.messages != null && mpnLog.messages.Any())
                    {
                        _logger.LogDebug("----------------------------------------------------------------------------------------------------------------------");
                    }
                    if (ex != null)
                    {
                        _logger.LogDebug(ex, "Exception");
                        _logger.LogDebug("----------------------------------------------------------------------------------------------------------------------");
                    }
                    break;
                case LogType.error:
                    _logger.LogError("----------------------------------------------------------------------------------------------------------------------");
                    _logger.LogError($"{mpnLog.title}");
                    _logger.LogError("----------------------------------------------------------------------------------------------------------------------");
                    mpnLog.messages?.ForEach((m) => { _logger.LogError(m); });
                    if (mpnLog.messages != null && mpnLog.messages.Any())
                    {
                        _logger.LogError("----------------------------------------------------------------------------------------------------------------------");
                    }
                    if (ex != null)
                    {
                        _logger.LogError(ex, "Exception");
                        _logger.LogError("----------------------------------------------------------------------------------------------------------------------");
                    }
                    break;
                case LogType.info:
                    _logger.LogInformation("----------------------------------------------------------------------------------------------------------------------");
                    _logger.LogInformation($"{mpnLog.title}");
                    _logger.LogInformation("----------------------------------------------------------------------------------------------------------------------");
                    mpnLog.messages?.ForEach((m) => { _logger.LogInformation(m); });
                    if (mpnLog.messages != null && mpnLog.messages.Any())
                    {
                        _logger.LogInformation("----------------------------------------------------------------------------------------------------------------------");
                    }
                    if (ex != null)
                    {
                        _logger.LogInformation(ex, "Exception");
                        _logger.LogInformation("----------------------------------------------------------------------------------------------------------------------");
                    }
                    break;
                case LogType.warn:
                    _logger.LogWarning("----------------------------------------------------------------------------------------------------------------------");
                    _logger.LogWarning($"{mpnLog.title}");
                    _logger.LogWarning("----------------------------------------------------------------------------------------------------------------------");
                    mpnLog.messages?.ForEach((m) => { _logger.LogWarning(m); });
                    if (mpnLog.messages != null && mpnLog.messages.Any())
                    {
                        _logger.LogWarning("----------------------------------------------------------------------------------------------------------------------");
                    }
                    if (ex != null)
                    {
                        _logger.LogWarning(ex, "Exception");
                        _logger.LogWarning("----------------------------------------------------------------------------------------------------------------------");
                    }
                    break;
            }
        }

        public void LogInfoObject(string title, List<object> objectsToLog)
        {
            _logger.LogInformation("----------------------------------------------------------------------------------------------------------------------");
            _logger.LogInformation($"{title}");
            _logger.LogInformation("----------------------------------------------------------------------------------------------------------------------");
            objectsToLog?.ForEach((o) => { _logger.LogInformation($"{JsonConvert.SerializeObject(o)}"); });
            if (objectsToLog != null && objectsToLog.Any())
            {
                _logger.LogInformation("----------------------------------------------------------------------------------------------------------------------");
            }
        }

    }
}
