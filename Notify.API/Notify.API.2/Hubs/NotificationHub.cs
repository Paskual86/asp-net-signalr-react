using Microsoft.AspNetCore.SignalR;
using Notify.API.Messages;

namespace Notify.API.Hubs
{
    public class NotificationHub : Hub<INotificationClient>
    {
        public async Task SendMessage(NotifyMessage message)
        {
            Console.WriteLine($"Received message from connection: {Context.ConnectionId}. MEssage: {message.Message}");
            await Clients.All.ReceiveMessage(message);
        }
    }
}
