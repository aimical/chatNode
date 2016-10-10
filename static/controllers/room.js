//romCtrl
angular.module('chatNode').controller('RoomCtrl', function ($scope, socket) {
    $scope.messages = [];
    socket.emit('getAllMessages');
    socket.on('allMessage', function (messages) {
        $scope.messages = messages
    });
    socket.on('addMessage', function (message) {
        $scope.messages.push(message)
    })
});