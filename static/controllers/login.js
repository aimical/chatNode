angular.module('chatNode').controller('LoginCtrl', function ($scope, $http, $location) {
    $scope.login = function () {
        $http({
            url: '/api/login',
            method: 'post',
            data: {
                email: $scope.email
            }
        })
            .success(function (user) {
                $scope.$emit('login', user);
                $location.path('/')
            })
            .error(function (err) {
                console.log(err);
                debugger;
                $location.path('/login')
            })
    }
});