var myApp = angular.module('myApp', ['ngRoute', 'ngFileUpload', 'ngModal']);


  myApp.config(['$routeProvider', function($routeProvider) {
    $routeProvider
      .when('/home', {
        templateUrl: '/views/home.html',
        controller: "HomeController"
      })
      .when('/plantexplorer', {
        templateUrl: '/views/plantexplorer.html',
        controller: "PlantexplorerController"
      })
      .when('/register', {
        templateUrl: '/views/register.html',
        controller: "LoginController"
      })
      .when('/user', {
        templateUrl: '/views/user.html',
        controller: "UserController"
      })
      .when('/login', {
        templateUrl: '/views/login.html',
        controller: "LoginController"
      })
      .otherwise({
        redirectTo: 'home'
      })
}]);
