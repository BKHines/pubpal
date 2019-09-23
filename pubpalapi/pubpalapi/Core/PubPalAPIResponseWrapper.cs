using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Internal;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace pubpalapi.Core
{
    public class PubPalAPIResponseWrapper
    {
        private readonly RequestDelegate _next;

        public PubPalAPIResponseWrapper(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            //Hold on to original body for downstream calls
            Stream originalBody = context.Response.Body;
            if (context.Request.Path.Value.StartsWith("/api"))
            {
                context.Request.EnableRewind();
                var origStatus = context.Response.StatusCode;
                PubPalAPIResponse objResult;

                try
                {
                    string responseBody = null;
                    using (var memStream = new MemoryStream())
                    {
                        //Replace stream for upstream calls.
                        context.Response.Body = memStream;
                        //continue up the pipeline
                        await _next(context);
                        //back from upstream call.
                        //memory stream now hold the response data
                        //reset position to read data stored in response stream
                        memStream.Position = 0;
                        responseBody = new StreamReader(memStream).ReadToEnd();
                    }//dispose of previous memory stream.
                     //lets convert responseBody to something we can use
                    var data = JsonConvert.DeserializeObject(responseBody);

                    switch (context.Response.StatusCode)
                    {
                        case (int)HttpStatusCode.OK:
                            objResult = PubPalAPIResponse.Create(HttpStatusCode.OK, data, string.Empty);
                            break;
                        case (int)HttpStatusCode.Forbidden:
                            {
                                var errorMessage = "You are not authorized to request this content.";
                                objResult = PubPalAPIResponse.Create(HttpStatusCode.Forbidden, null, errorMessage);
                            }
                            break;
                        case (int)HttpStatusCode.BadRequest:
                            {
                                var errorMessage = "Your request was not structured correctly and the error has been logged.";
                                objResult = PubPalAPIResponse.Create(HttpStatusCode.BadRequest, null, errorMessage);
                            }
                            break;
                        case (int)HttpStatusCode.Unauthorized:
                            {
                                var errorMessage = "Your request was not authorized and the error has been logged.";
                                objResult = PubPalAPIResponse.Create(HttpStatusCode.BadRequest, null, errorMessage);
                            }
                            break;
                        default:
                            {
                                var errorMessage = "An error occurred and has been logged.";
                                objResult = PubPalAPIResponse.Create(HttpStatusCode.InternalServerError, null, errorMessage);
                            }
                            break;
                    }

                    var buffer = Encoding.UTF8.GetBytes(JsonConvert.SerializeObject(objResult));
                    using (var output = new MemoryStream(buffer))
                    {
                        await output.CopyToAsync(originalBody);
                    }//dispose of output stream
                }
                // Exceptions handled elsewhere but if something is failing to reach requests, turn this on to troubleshoot
                catch (Exception ex)
                {
                    var msg = ex.Message;
                }
                finally
                {
                    //and finally, reset the stream for downstream calls
                    await _next(context);
                }
            }
            else
            {
                await _next(context);
            }
        }

        private async Task<string> FormatRequest(HttpRequest request)
        {
            var body = request.Body;

            //This line allows us to set the reader for the request back at the beginning of its stream.
            request.EnableRewind();

            //We now need to read the request stream.  First, we create a new byte[] with the same length as the request stream...
            var buffer = new byte[Convert.ToInt32(request.ContentLength)];

            //...Then we copy the entire request stream into the new buffer.
            await request.Body.ReadAsync(buffer, 0, buffer.Length);

            //We convert the byte[] into a string using UTF8 encoding...
            var bodyAsText = Encoding.UTF8.GetString(buffer);

            //..and finally, assign the read body back to the request body, which is allowed because of EnableRewind()
            request.Body = body;

            return $"{request.Scheme} {request.Host}{request.Path} {request.QueryString} {bodyAsText}";
        }

        private async Task<string> FormatResponse(HttpResponse response)
        {
            //We need to read the response stream from the beginning...
            response.Body.Seek(0, SeekOrigin.Begin);

            //...and copy it into a string
            string text = await new StreamReader(response.Body).ReadToEndAsync();

            //We need to reset the reader for the response so that the client can read it.
            response.Body.Seek(0, SeekOrigin.Begin);

            var mpnResp = PubPalAPIResponse.Create((HttpStatusCode)response.StatusCode, JsonConvert.DeserializeObject(text), null);
            //Return the string for the response, including the status code (e.g. 200, 404, 401, etc.)
            return $"{response.StatusCode}: {JsonConvert.SerializeObject(mpnResp)}";
        }

    }

    public static class ResponseWrapperExtensions
    {
        public static IApplicationBuilder UseResponseWrapper(this IApplicationBuilder builder)
        {
            return builder.UseMiddleware<PubPalAPIResponseWrapper>();
        }
    }
}
