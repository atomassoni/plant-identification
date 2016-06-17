myApp.controller('UserController', ['$scope', '$http', '$window', '$location', function($scope, $http, $window, $location) {
    // This happens after view/controller loads -- not ideal

    console.log('checking user');
    //user variables
    $scope.user = {};
    $scope.loggedIn = false;
    $scope.log = '';

    $scope.imagePath = '/uploads/';
    $scope.uploads = [];

    $scope.admin = false;

    checkLogin();

    function checkLogin() {
        $http.get('/user').then(function(response) {
            if (response.data.username) {
                $scope.user = response.data;
                console.log('User Data: ', $scope.user);
                $scope.loggedIn = true;
                $scope.log = 'logout';
                $scope.admin = $scope.user.level > 4 ? true : false;
                getUserImages();
            } else {
                $location.path("/home");
                $scope.loggedIn = '';
                $scope.log = 'login';
            }
        });
    }

    $scope.logout = function() {
        $http.get('/user/logout').then(function(response) {
            console.log('logged out');
            $location.path("/home");
        });


    }

    //loads page
    function getUserImages() {
        if ($scope.admin){
            $http.get('/user/all/')
                .then(function(response) {
                    $scope.uploads = response.data;
                    console.log('GET /users ', response.data);
                });

        } else {
            $http.get('/user/' + $scope.user._id)
                .then(function(response) {
                    $scope.uploads = response.data;
                    console.log('GET /users ', response.data);
                });
        }
    }
    //admin only remove accepted id
    $scope.removeApproved = function(id, aID) {
        if ($scope.admin) {
            var plantID = {
                'id': aID
            };
            if (confirm("Remove id?")) {
                $http.put('/user/approveds/' + id, plantID)
                    .then(function(response) {

                        getUserImages();

                    });
            }
        }
    };

    //user remove id
    $scope.removeID = function(id, pID) {
        var plantID = {
            'id': pID
        };
        if (confirm("Remove id?")) {
            $http.put('/user/ids/' + id, plantID)
                .then(function(response) {

                    getUserImages();

                });
        }
    };

    //user remove item
    $scope.removeItem = function(id) {
        if (confirm("Remove upload?")) {
            $http.delete('/user/' + id)
                .then(function(response) {

                    getUserImages();

                });
        }
    };



}]);
