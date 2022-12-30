using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Host.Bindings;
using Microsoft.Azure.WebJobs.Host.Protocols;

namespace NotifyFunction.Binding
{
    public class AccessTokenBinding : IBinding
    {
        public Task<IValueProvider> BindAsync(BindingContext context)
        {
            var httpContext = new DefaultHttpContext();
            // Get the HTTP request
            var request = context.BindingData["req"] as HttpRequest;

            // Get the configuration files for the OAuth token issuer
            var issuerToken = "c2VjcmV0";//Environment.GetEnvironmentVariable("IssuerToken");
            var audience = "api1"; //Environment.GetEnvironmentVariable("Audience");
            var issuer = "https://localhost:5001"; //Environment.GetEnvironmentVariable("Issuer");

            return Task.FromResult<IValueProvider>(new AccessTokenValueProvider(request, issuerToken, audience, issuer));
        }

        public bool FromAttribute => true;

        public Task<IValueProvider> BindAsync(object value, ValueBindingContext context) => null;

        public ParameterDescriptor ToParameterDescriptor() => new ParameterDescriptor();
    }
}
