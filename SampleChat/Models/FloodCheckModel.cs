using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleChat.Models
{
    public class FloodCheckModel
    {
        public bool IsDuplicate { get; set; }
        public string AccessToken { get; set; }

    }
}