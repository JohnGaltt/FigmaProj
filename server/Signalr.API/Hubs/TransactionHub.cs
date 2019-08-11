using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace Signalr.API.Hubs
{
    public class TransactionHub : Hub
    {
        public async Task PaymentCompleted()
        {
            await Clients.All.SendAsync("payment_completed");
        }

        public async Task PaymentDetected()
        {
            await Clients.All.SendAsync("payment_detected");
        }
    }   
}
