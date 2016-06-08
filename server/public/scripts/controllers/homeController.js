myApp.controller('HomeController', ['$scope', '$http', 'DataFactory', function($scope, $http, DataFactory) {
    $scope.dataFactory = DataFactory;

    $scope.submit = function(){
        Upload.upload({
          url: '/uploads',
          method: 'post',
          data: $scope.upload
        }).then(function (response) {
          console.log(response.data);
          $scope.uploads.push(response.data);
          $scope.upload = {};
        })
      }

}]);
