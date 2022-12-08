using Notify.API.Messages;

namespace Notify.API.Hubs
{
    public interface INotificationClient
    {
        Task ReceiveMessage(NotifyMessage message);
    }
}
