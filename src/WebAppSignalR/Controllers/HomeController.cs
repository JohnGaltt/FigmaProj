using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;
using WebAppSignalR.Hubs;

namespace WebAppSignalR.Controllers
{
    public class HomeController : Controller
    {
        private IHubContext<TransactionHub> _hubContext { get; set; }

        public HomeController(IHubContext<TransactionHub> hubcontext)
        {
            _hubContext = hubcontext;
        }

        public IActionResult Index()
        {
            return View();
        }

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
