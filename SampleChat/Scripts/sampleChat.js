(function () {
    var app = angular.module('chat-app', []);

    app.controller('ChatContoller', function ($scope) {
        // scope variables
        $scope.name = 'Guest'; // holds the user's name
        $scope.message = ''; // holds the new message
        $scope.messages = []; // collection of messages coming from server
        $scope.chatHub = null; // holds the reference to hub

        $scope.chatHub = $.connection.chatHub; // initializes hub
        $.connection.hub.start(); // starts hub

        // register a client method on hub to be invoked by the server
        $scope.chatHub.client.broadcastMessage = function (chatModels) {
            console.log(chatModels);
            
            $scope.messages = [];
            angular.forEach(chatModels, function (value, key) {
                $scope.messages.push(value);

            });
           
           $scope.$apply();
        };

        $scope.newMessage = function () {

            // sends a new message to the server
            $scope.chatHub.server.sendMessage($scope.name, $scope.message);

            $scope.message = '';
        }
    })
}());