﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SampleChat.Models
{
    public class ChatModel
    {
        public string Id { get; set; }
        public string UserId { get; set; }
        public string NickName { get; set; }
        public string Message { get; set; }
        public string IP { get; set; }
        public string ChatTime { get; set; }

    }
}