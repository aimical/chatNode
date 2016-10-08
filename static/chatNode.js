angular.module('chatNode', []);

//socket service
angular.module('chatNode').factory('socket', function ($rootScope) {
    var socket = io.connect('192.168.0.170:3000');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args)
                })
            })
        },
        emit: function (eventName, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args)
                })
            })
        }
    }
});

//romCtrl
angular.module('chatNode').controller('RoomCtrl', function ($scope, socket) {
    $scope.messages = [];
    socket.on('allMessages', function (messages) {
        $scope.messages = messages
    })
    socket.on('messageAdded', function (message) {
        $scope.messages.push(message)
    })
});

//messageController
angular.module('chatNode').controller('MessageCreateCtrl', function ($scope, socket) {
    $scope.newMessage = '';
    $scope.createMessage = function () {
        if($scope.newMessage == ''){
            return
        }
        socket.emit('createMessage',$scope.newMessage)
        $scope.newMessage = '';
    }
});
