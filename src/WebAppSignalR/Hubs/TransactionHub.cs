using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace WebAppSignalR.Hubs
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
