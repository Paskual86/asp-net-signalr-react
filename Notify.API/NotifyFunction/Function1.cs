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
using NotifyFunction.Models;
using Azure.Core;
using Microsoft.Extensions.Configuration;
using NotifyFunction.Binding;

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

        // This way is knowing that "DECLARATIVE BINDING"
        /*[FunctionName("negotiate")]
        public static SignalRConnectionInfo Negotiate(
            [HttpTrigger(AuthorizationLevel.Function)] HttpRequest req,
            [SignalRConnectionInfo(HubName = "serverless", UserId = "{headers.x-ms-client-principal-id}"), ] SignalRConnectionInfo connectionInfo)
        {
            Console.WriteLine(req.ToString());
            Console.WriteLine("Started connection with the client...");
            ClaimsPrincipal identities = req.HttpContext.User;
            Console.WriteLine(identities.ToString());
            return connectionInfo;
        }*/

        [FunctionName("negotiate")]
        public static async Task<SignalRConnectionInfo> Negotiate(
        [HttpTrigger(AuthorizationLevel.Function)] HttpRequest req,
        IBinder binder)
        {
            // https://www.codeguru.com/dotnet/asp-net-cookies/
            // https://asp.mvc-tutorial.com/es/479/httpcontext/cookies/
            var cookie = req.Headers["cookie"];

            if ( !string.IsNullOrEmpty(cookie)) { 
                string userId = req.Headers["x-ms-client-principal-id"];
                //Console.WriteLine($"Request received for {accessTokenResult.Principal?.Identity.Name ?? "anonymous"}.");
                var attribute = new SignalRConnectionInfoAttribute
                {
                    HubName = "serverless",
                    UserId = userId
                };
                SignalRConnectionInfo connectionInfo = await binder.BindAsync<SignalRConnectionInfo>(attribute);
                return connectionInfo;
            }
            else {
                return null;
            }
        }


        [FunctionName("AddToGroup")]
        public static Task AddToGroup(
        [HttpTrigger(AuthorizationLevel.Function, "post", Route = "{group}/add/{userId}")] HttpRequest req,
        string group,
        string userId,
        [SignalR(HubName = "serverless")] IAsyncCollector<SignalRGroupAction> signalRGroupActions)
        {
            return signalRGroupActions.AddAsync(
                new SignalRGroupAction
                {
                    UserId = userId,
                    GroupName = group,
                    Action = GroupAction.Add
                });
        }

        [Authorize]
        [FunctionName("sendmessage")]
        public static async Task<IActionResult> Run(
            [HttpTrigger(AuthorizationLevel.Admin, "get", "post", Route = null)] HttpRequest req,
            [SignalR(HubName = "serverless")] IAsyncCollector<SignalRMessage> signalRMessages,
            ILogger log, ClaimsPrincipal claimsPrincipal)
        {
            log.LogInformation("C# HTTP trigger function processed a request.");
            
            ClaimsPrincipal identities = req.HttpContext.User;
            Console.WriteLine(identities.ToString());

            string userID = req.Query["userId"];
            string target = req.Query["target"];
            string group = req.Query["group"];

            string requestBody = await new StreamReader(req.Body).ReadToEndAsync();
            SignalRequest data = null;
            if (!string.IsNullOrEmpty(requestBody))
            {
                data = JsonConvert.DeserializeObject<SignalRequest>(requestBody);
            }

            var signalMessage = new SignalRMessage();
            
            if (!string.IsNullOrEmpty(group))
            {
                signalMessage.GroupName = group;
            }
            else
            {
                if (!string.IsNullOrEmpty(userID))
                {
                    signalMessage.UserId = userID;
                }
            }

            if (!string.IsNullOrEmpty(target))
            {
                signalMessage.Target = target;
            }
            else {
                return new BadRequestObjectResult("The target could not be empty");
            }

            if (data != null)
            {
                signalMessage.Arguments = new[] { data.Message };
            }
            await signalRMessages.AddAsync(signalMessage);

            return new OkResult();
        }


    }
}
