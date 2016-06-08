var myApp = angular.module('myApp', ['ngRoute']);



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
      .otherwise({
        redirectTo: 'home'
      })
}]);
