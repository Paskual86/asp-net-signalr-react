using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace Notify.SignalR.IoC
{
    public static class IoCExtensions
    {
        public static void AddEndpointsSignalR(this IEndpointRouteBuilder endpoint){
            //endpoint.MapHub<Hubs.NotificationHub>("/hubs/notifications");
        }
    }
}
