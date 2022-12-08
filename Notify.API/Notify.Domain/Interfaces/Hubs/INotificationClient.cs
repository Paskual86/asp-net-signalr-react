using Notify.Domain.Messages;

namespace Notify.Domain.Interfaces.Hubs
{
    public interface INotificationClient
    {
        Task ReceiveMessage(NotifyMessage message);
    }
}
