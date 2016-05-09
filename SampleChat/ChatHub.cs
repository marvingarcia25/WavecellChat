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

        public static List<UserModel> userModels = new List<UserModel>();
        public static UserModel userModel = new UserModel();
        public static List<ChatModel> chatModels = new List<ChatModel>();
        public static ChatModel chatModel = new ChatModel();
        public void SendMessage(string userId, string name, string message, string chatTime, string iP)
        {
            chatModel = new ChatModel();
            chatModel.UserId = userId;
            chatModel.NickName = name;
            chatModel.Message = message;
            chatModel.ChatTime = chatTime;
            chatModel.IP = iP;
            chatModels.Add(chatModel);
            RefreshChat();  
        }

        public FloodCheckModel AddUser( string nickname, string IP) 
        {
            FloodCheckModel floodCheck = new FloodCheckModel();
            userModel = new UserModel();

            var match = userModels.Exists(x => x.NickName == nickname);
            if (match == true)
            {
                floodCheck.IsDuplicate = true;
            }
            else
            {
                floodCheck.IsDuplicate = false;
                userModel.Id = Guid.NewGuid().ToString();
                userModel.NickName = nickname;
                userModel.IP = IP;
                userModels.Add(userModel);

                floodCheck.AccessToken = userModel.Id;
            }

            RefreshChat();  
            return floodCheck;
            
        }

        public void LogoutUser(string accessToken, string nickname) 
        {
            userModels.RemoveAll(usermodel => usermodel.Id.Contains(accessToken) && usermodel.NickName.Contains(nickname));
            Clients.All.broadcastUserList(userModels);
            Clients.All.broadcastMessage(chatModels);
            Clients.All.LogoutUser(accessToken);
        }

        public void RefreshChat() 
        {
            Clients.All.broadcastUserList(userModels);
            Clients.All.broadcastMessage(chatModels);
        }
    }
}