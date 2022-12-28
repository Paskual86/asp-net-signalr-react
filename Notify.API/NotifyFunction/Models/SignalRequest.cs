using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace NotifyFunction.Models
{
    public class SignalRequest
    {
        public string Target { get; set; }
        public string Payload { get; set; }
        public string Message { get; set; }
    }
}
