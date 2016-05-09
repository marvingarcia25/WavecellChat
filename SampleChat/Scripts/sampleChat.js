

(function (utils) {
    var app = angular.module('chat-app', ['ngCookies']);

    app.controller('ChatController', function ($scope, $http, $cookies) {
        // scope variables
        $scope.nickName = 'Guest'; // holds the user's name
        $scope.message = ''; // holds the new message
        $scope.messages = []; // collection of messages coming from server
        $scope.user = ''; //holds user nickname
        $scope.userList = []; // collection of user list

        $scope.chatTime = '';
        $scope.iP = '';
        $scope.chatHub = null; // holds the reference to hub
        $scope.showLogin = true;
        $scope.showChat = false;
        $scope.showWarning = false;
    
        
        if ($cookies.get('wavecellToken') === undefined) {
            $scope.showChat = false;
            $scope.showLogin = true;
        } else {
             $scope.showLogin = false;
            $scope.showChat = true;
        }


        $scope.chatHub = $.connection.chatHub; // initializes hub

        //start the hub
        $.connection.hub.start().done(function () {
            $scope.chatHub.server.refreshChat();
            
            var height = 10000;
            $('.chatScroll').each(function (i, value) {
                height += parseInt($(this).height());
            });

            height += '';

            $('.chatScroll').animate({ scrollTop: height });
        }); 

        // register a client method on hub to be invoked by the server
        $scope.chatHub.client.broadcastMessage = function (chatModels) {
            
            
            $scope.messages = [];
            angular.forEach(chatModels, function (value, key) {
                $scope.messages.push(value);
            });
           
           $scope.$apply();
        };

        // register a client method on hub to be invoked by the server
        $scope.chatHub.client.broadcastUserList = function (userModels) {
            

            $scope.userList = [];
            
            angular.forEach(userModels, function (value, key) {
                
                $scope.userList.push(value);
            });
            $scope.$apply();
     
        };

        $scope.chatHub.client.logoutUser = function (accessToken) {
            
        }
        $scope.newMessage = function () {

            $scope.chatTime = new Date();
            //call server hub
            $scope.chatHub.server.sendMessage($cookies.get('wavecellToken'), $scope.nickName, $scope.message, $scope.formatDate($scope.chatTime, "yyyy-dd-MM HH:mm:ss"), $scope.iP);
            $scope.message = '';
            var height = 10000;
            $('.chatScroll').each(function (i, value) {
                height += parseInt($(this).height());
            });

            height += '';

            $('.chatScroll').animate({ scrollTop: height });
        }

        $scope.addUser = function (id) {
            var json = "http://ipv4.myexternalip.com/json";

            $http.get(json).then(function (result) {
                $scope.iP = result.data.ip;
                console.log($scope.nickName);
                if ($scope.nickName === undefined) {
                    console.log($scope.nickName);
                 
                    $scope.showWarning = true;
                }else{
                    $scope.chatHub.server.addUser($scope.nickName, $scope.iP).then(function (addUserResult) {
        
                        
                        if (addUserResult.IsDuplicate == true) {
                            alert("NickName already taken");
                        } else{                    
                            $scope.$apply(function () {
                                $scope.showChat = true;
                                $scope.showLogin = false;
                                $cookies.put('wavecellToken', addUserResult.AccessToken);
                                
                            });
                        }
                    }, function (e) {
                        alert(e.Message);
                    });

                }

                //Add the user nickname and IP
           
            }, function (e) {
                //TODO: define error here
                    alert(e.Message);
            });

        }

        $scope.logOutUser = function () {
        
            $scope.chatHub.server.logoutUser($cookies.get('wavecellToken'), $scope.nickName).then(function () {
                $scope.$apply(function () {
                    $scope.showChat = false;
                    $scope.showLogin = true;
                    $cookies.remove('wavecellToken');
                });
            }, function (e) {
                alert(e.message);
            });

        }
        
        $scope.formatDate = function (date, format, utc) {
            var MMMM = ["\x00", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
            var MMM = ["\x01", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
            var dddd = ["\x02", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            var ddd = ["\x03", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

            function ii(i, len) {
                var s = i + "";
                len = len || 2;
                while (s.length < len) s = "0" + s;
                return s;
            }

            var y = utc ? date.getUTCFullYear() : date.getFullYear();
            format = format.replace(/(^|[^\\])yyyy+/g, "$1" + y);
            format = format.replace(/(^|[^\\])yy/g, "$1" + y.toString().substr(2, 2));
            format = format.replace(/(^|[^\\])y/g, "$1" + y);

            var M = (utc ? date.getUTCMonth() : date.getMonth()) + 1;
            format = format.replace(/(^|[^\\])MMMM+/g, "$1" + MMMM[0]);
            format = format.replace(/(^|[^\\])MMM/g, "$1" + MMM[0]);
            format = format.replace(/(^|[^\\])MM/g, "$1" + ii(M));
            format = format.replace(/(^|[^\\])M/g, "$1" + M);

            var d = utc ? date.getUTCDate() : date.getDate();
            format = format.replace(/(^|[^\\])dddd+/g, "$1" + dddd[0]);
            format = format.replace(/(^|[^\\])ddd/g, "$1" + ddd[0]);
            format = format.replace(/(^|[^\\])dd/g, "$1" + ii(d));
            format = format.replace(/(^|[^\\])d/g, "$1" + d);

            var H = utc ? date.getUTCHours() : date.getHours();
            format = format.replace(/(^|[^\\])HH+/g, "$1" + ii(H));
            format = format.replace(/(^|[^\\])H/g, "$1" + H);

            var h = H > 12 ? H - 12 : H == 0 ? 12 : H;
            format = format.replace(/(^|[^\\])hh+/g, "$1" + ii(h));
            format = format.replace(/(^|[^\\])h/g, "$1" + h);

            var m = utc ? date.getUTCMinutes() : date.getMinutes();
            format = format.replace(/(^|[^\\])mm+/g, "$1" + ii(m));
            format = format.replace(/(^|[^\\])m/g, "$1" + m);

            var s = utc ? date.getUTCSeconds() : date.getSeconds();
            format = format.replace(/(^|[^\\])ss+/g, "$1" + ii(s));
            format = format.replace(/(^|[^\\])s/g, "$1" + s);

            var f = utc ? date.getUTCMilliseconds() : date.getMilliseconds();
            format = format.replace(/(^|[^\\])fff+/g, "$1" + ii(f, 3));
            f = Math.round(f / 10);
            format = format.replace(/(^|[^\\])ff/g, "$1" + ii(f));
            f = Math.round(f / 10);
            format = format.replace(/(^|[^\\])f/g, "$1" + f);

            var T = H < 12 ? "AM" : "PM";
            format = format.replace(/(^|[^\\])TT+/g, "$1" + T);
            format = format.replace(/(^|[^\\])T/g, "$1" + T.charAt(0));

            var t = T.toLowerCase();
            format = format.replace(/(^|[^\\])tt+/g, "$1" + t);
            format = format.replace(/(^|[^\\])t/g, "$1" + t.charAt(0));

            var tz = -date.getTimezoneOffset();
            var K = utc || !tz ? "Z" : tz > 0 ? "+" : "-";
            if (!utc) {
                tz = Math.abs(tz);
                var tzHrs = Math.floor(tz / 60);
                var tzMin = tz % 60;
                K += ii(tzHrs) + ":" + ii(tzMin);
            }
            format = format.replace(/(^|[^\\])K/g, "$1" + K);

            var day = (utc ? date.getUTCDay() : date.getDay()) + 1;
            format = format.replace(new RegExp(dddd[0], "g"), dddd[day]);
            format = format.replace(new RegExp(ddd[0], "g"), ddd[day]);

            format = format.replace(new RegExp(MMMM[0], "g"), MMMM[M]);
            format = format.replace(new RegExp(MMM[0], "g"), MMM[M]);

            format = format.replace(/\\(.)/g, "$1");

            return format;
        };

    })
}());

var height = 0;
$('.chatScroll').each(function (i, value) {
    height += parseInt($(this).height());
});

height += '';

$('.chatScroll').animate({ scrollTop: height });

