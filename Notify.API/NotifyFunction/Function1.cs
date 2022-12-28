using System;
using System.IO;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Microsoft.Azure.WebJobs.Extensions.SignalRService;
using Azure;
using System.Net.Http;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace NotifyFunction
{
    public static class Function
    {
        /*
         Accodridn this article we could set the user from two sites: 
            https://learn.microsoft.com/en-us/azure/azure-functions/functions-bindings-signalr-service-input?tabs=in-process&pivots=programming-language-csharp
        using the headers:
                    headers.x-ms-client-principal-id
                    headers.x-ms-client-principal-name
         */
        [FunctionName("negotiate")]
        public static SignalRConnectionInfo Negotiate(
            [HttpTrigger(AuthorizationLevel.Anonymous)] HttpRequest req,
            [SignalRConnectionInfo(HubName = "serverless", UserId = "{headers.x-ms-client-principal-id}")] SignalRConnectionInfo connectionInfo)
        {
            Console.WriteLine(req.ToString());
            Console.WriteLine("Started connection with the client...");
            return connectionInfo;
        }
        
        [Authorize]
        [FunctionName("sendmessage")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
            [SignalR(HubName = "serverless")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log, ClaimsPrincipal claimsPrincipal)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");

            string userID = req.Query["userId"];
            string target = req.Query["target"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            dynamic data = JsonConvert.DeserializeObject(requestBody);

            if (!string.IsNullOrEmpty(userID))
            {
                await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = target,
                    UserId = userID,
                    Arguments = new[] { $"Test Message" }
                });
            }
            else
            {
                await signalRMessages.AddAsync(
                new SignalRMessage
                {
                    Target = target,
                    Arguments = new[] { $"Test Message" }
                });
            }
            
            
            return new OkResult();
        }


    }
}
