using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Signalr.API.Hubs;

namespace Signalr.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HomeController : ControllerBase
    {
        private IHubContext<TransactionHub> _hubContext { get; set; }

        public HomeController(IHubContext<TransactionHub> hubcontext)
        {
            _hubContext = hubcontext;
        }

        public IActionResult Get() => Ok("Signal R works :)");

        [HttpGet("completed")]
        public async Task<IActionResult> PaymentCompleted()
        {
            await _hubContext.Clients.All.SendAsync("payment_completed", "test");
            return Ok();
        }

        [HttpGet("detected")]
        public async Task<IActionResult> PaymentDetected()
        {
            await _hubContext.Clients.All.SendAsync("payment_detected", "test");
            return Ok();
        }
    }
}
