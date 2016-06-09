myApp.controller('HomeController', ['$scope', '$http', 'Upload', 'DataFactory', function($scope, $http, Upload, DataFactory) {
    $scope.dataFactory = DataFactory;
    $scope.file = '';
    $scope.comment = '';
    $scope.uploads = [];
    $scope.postTime = '';
    getImages();

    $scope.submit = function() {
      if ($scope.form.file.$valid && $scope.file) {
        $scope.upload($scope.file);
        console.log('file' , $scope.file);
      }
    };

    // upload on file select or drop
       $scope.upload = function (file) {

           Upload.upload({
               url: '/uploads',
               data: {file: file, 'username': $scope.username, 'comment':$scope.comment}
           }).then(function (resp) {
               console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
           }, function (resp) {
               console.log('Error status: ' + resp.status);
           }, function (evt) {
               var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
               console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
               getImages();
           });
       };

    function getImages() {
        $http.get('/uploads')
      .then(function (response) {
        $scope.uploads = response.data;
        console.log('GET /uploads ', response.data);
      });
    }


}]);
