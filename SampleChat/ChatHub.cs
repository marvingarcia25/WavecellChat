using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Microsoft.AspNet.SignalR;
using SampleChat.Models;

namespace SampleChat
{

    public class ChatHub : Hub
    {

        public static List<ChatModel> chatModels = new List<ChatModel>();
        public static ChatModel chatModel = new ChatModel();
        public void SendMessage(string name, string message)
        {
            chatModel = new ChatModel();
            chatModel.NickName = name;
            chatModel.Message = message;

            chatModels.Add(chatModel);

            Clients.All.broadcastMessage(chatModels);
        }
    }
}