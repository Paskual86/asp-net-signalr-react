using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Notify.API.Messages;

namespace Notify.API.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendMessage(NotifyMessage message)
        {
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
