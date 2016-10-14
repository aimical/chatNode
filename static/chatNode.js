angular.module('chatNode',['ngRoute'])
    .run(function ($window, $rootScope, $http, $location) {
        $http({
            url: '/api/validate',
            method: 'get'
        }).success(function (user) {
            $rootScope.me = user;
            $location.path('/')
        }).error(function (data) {
            $location.path('/login')
        });
        $rootScope.logout = function() {
            $http({
                url: '/api/loginOut',
                method: 'GET'
            }).success(function () {
                $rootScope.me = null;
                $location.path('/login')
            })
        };
        $rootScope.$on('login', function (evt, me) {
            $rootScope.me = me;
        })
    });


