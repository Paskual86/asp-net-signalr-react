using Microsoft.AspNet.SignalR;
using Notify.Domain.Interfaces.Hubs;
using Notify.Domain.Messages;

namespace Notify.SignalR.Hubs
{
    public class NotificationHub : Hub
    {
        public async Task SendMessage(NotifyMessage message)
        {
            System.Console.WriteLine($"Receiving that message: {message.Message} from ConnectionID: {Context.ConnectionId}");
            //await Clients.All.ReceiveMessage(message);
            await Clients.All.SendAsync("ReceiveMessage", message);
        }
    }
}
