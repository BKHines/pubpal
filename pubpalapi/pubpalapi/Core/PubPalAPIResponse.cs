using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace pubpalapi.Core
{
    public class PubPalAPIResponse
    {
        public static PubPalAPIResponse Create(HttpStatusCode _code, Object _result, string _err)
        {
            return new PubPalAPIResponse(_code, _result, _err);
        }

        public HttpStatusCode status { get; set; }
        public Object result { get; set; }
        public string errormessage { get; set; }

        protected PubPalAPIResponse(HttpStatusCode _status, Object _result = null, string _err = null)
        {
            status = _status;
            result = _result;
            errormessage = _err;
        }
    }
}
