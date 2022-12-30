using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Hosting;
using NotifyFunction.Binding;

[assembly: FunctionsStartup(typeof(NotifyFunction.Startup))]
namespace NotifyFunction
{
    public class Startup : IWebJobsStartup
    {
        public void Configure(IWebJobsBuilder builder)
        {
            builder.AddAccessTokenBinding();
        }
    }
}
