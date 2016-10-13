angular.module('chatNode').config(function ($routePrvieder,$locationPrvider) {
    $locationPrvider.html5Mode(true);
    $routePrvieder
        .when('/',{
            templateUrl:''
        })
});