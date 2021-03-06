myApp.controller('HomeController', ['$scope', '$http', '$window', '$location', 'Upload', function($scope, $http, $window, $location, Upload) {

//file variables
    $scope.file = '';
    $scope.comment = '';
    $scope.uploads = [];
    $scope.postTime = '';
    $scope.lastUpload = '';

//item for ID variables
    $scope.currentIdItem = '';
    $scope.itemForID = {};
    $scope.itemForID.name = '';
    $scope.itemForID.apiKey = 0;

//Search variables
    $scope.GBIFSearch = {};
    $scope.GBIFSearch.search = '';
    $scope.GBIFSearch.rank = {
        rank: 'SPECIES'
    };
    //select dropdown on search bar
    $scope.GBIFranks = [{
        rank: 'SPECIES',
        label: 'Species level search'
    }, {
        rank: 'GENUS',
        label: 'Genus level search'
    }, {
        rank: 'FAMILY',
        label: 'Family level search'
    }];

    $scope.results = [];
    $scope.speciesKey = '';
    $scope.image = '';
    $scope.numResults = '';

    //query parameters
    $scope.highertaxonKey = 6;
    $scope.language = 'ENG';
    $scope.limit = 20;
    $scope.offset = 0;

//initial setting on search results, either shows all info or not
    $scope.show = {
        allResults: false,
        buttonText: 'Expand Results'
    };

//user variables
    $scope.user = {};
    $scope.loggedIn = false;
    $scope.log = '';

//sets the item that the user is interacting with
    $scope.activeItem = {};

//how many votes it takes +1 to make an id acceptable
    $scope.voteThreshhold = 4;

//initialize
    getImages();
    checkLogin();
//loads page
    function getImages() {
        $http.get('/uploads')
            .then(function(response) {
                $scope.uploads = response.data;
                console.log('GET /uploads ', response.data);
            });
    }
//user login functions
    function checkLogin() {
        $http.get('/user').then(function(response) {
            if (response.data.username) {
                $scope.user = response.data;

                console.log('User Data: ', $scope.user);
                $scope.loggedIn = true;
                $scope.log = 'logout';
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
            $scope.user = {};
            $location.path("/login");
        });
    }

//file uploading functions
    $scope.submit = function() {
        if ($scope.loggedIn) {
            if ($scope.form.file.$valid && $scope.file) {
                $scope.upload($scope.file);
                console.log('file', $scope.file);
            }
        } else {
        alert("Please login or register to upload");
        }
    };

    $scope.upload = function(file) {

        Upload.upload({
            url: '/uploads',
            data: {
                file: file,
                'user': $scope.user,
                'comment': $scope.comment
            }
        }).then(function(resp) {
            console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
            getImages();
        }, function(resp) {
            console.log('Error status: ' + resp.status);
        }, function(evt) {
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);

        });
    };


//sets photo item that user is interacting with
    $scope.setActive = function(obj) {
        $scope.activeItem = obj;
        console.log($scope.activeItem);
    };

//**** ID FUNCTIONS *****

//lets user vote for an id
    $scope.selectID = function(id, plant) {

        if ($scope.loggedIn) {

            var userVote = {
                'user': $scope.user,
                'idIndex': plant._id
            };

            $http.put('/uploads/select/' + id, userVote)
                .then(function(response) {
                    console.log('PUT /selects ', userVote);
                    checkApproval($scope.activeItem, plant);
                    getImages();
                });
        } else {
            alert("If you'd like to select this as the ID, please log in or register");
        }
    };

//submits a new id to an item
    $scope.submitID = function(id) {
        var plantID = $scope.itemForID;
        if ($scope.loggedIn) {
            if($scope.itemForID.name != '') {
                $http.put('/uploads/' + id, plantID)
                    .then(function(response) {
                        console.log('PUT /ids ', plantID);
                        getImages();
                        $scope.currentIdItem = '';
                        $scope.itemForID = {};
                    });
            } else {
                alert('“It is common sense to take a method and try it. If it fails, admit it frankly and try another. But above all, try something.” ');
            }
        } else {
            alert("Please log in or register if you'd like to suggest IDs");
        }
    };


//find out whether a displayed ID suggestion has enough votes to be approved
    $scope.dispCalculateVotes = function (voteArray) {
        calculateVotes(voteArray);
    };

//calculate the votes that an ID suggestion has
    function calculateVotes (voteArray) {
        console.log("calculating votes");
        var voteTotal = 0;
        voteArray.forEach(function(item, index) {
            voteTotal += item.user.level;
        });
        return voteTotal;
    }

//see if an ID has enough votes to be on the accepted list
    function checkApproval (uploadObj, plant) {
        var numVotes = 0;
        var found = false;

        var approved = {'apiKey' : plant.apiKey , 'name' : plant.name };

        uploadObj.plantID.forEach(function(item, index){

            numVotes = calculateVotes(item.userVotes);
            console.log('plant id item', item);

            uploadObj.approved.forEach(function(pItem, pIndex){

                if (pItem.apiKey == plant.apiKey) {
                    found = true;
                    console.log("FOUND SO NOT PUTTING");
                }
            });

         });
         if (!found && numVotes>$scope.voteThreshhold) {
             submitApprovedID(approved, uploadObj._id);
         }
        }

//submits accepted IDs to the approved list
    function submitApprovedID (approved, id) {
        $http.put('/uploads/approved/' + id, approved)
            .then(function(response) {
                console.log('PUT /approved ', approved);
                getImages();
            });
    }

//utility to count the number of IDs in the accepted list
    $scope.numAccepted = function (approvedArray) {
        return approvedArray.length;
    }
//utility to check if an item is in the uservote array
    $scope.isVote = function (id, array) {
        var exists = false;
        array.forEach(function (pItem, index) {

            if (pItem.user._id == id) {
                exists =  true;
            }
        });
        return exists;
    };

// *** API SEARCH FUNCTIONS ****

// displays the searched info
    $scope.loadSpeciesInfo = function() {
        $scope.limit = 20;
        getSpeciesInfo();
    }

//makes the call to the API to get results
    function getSpeciesInfo() {

        $scope.currentIdItem = $scope.activeItem._id;

        var query = 'taxonkey=' + $scope.highertaxonKey;
        query += '&q=' + encodeURI($scope.GBIFSearch.search);
        query += '&rank=' + $scope.GBIFSearch.rank.rank;
        query += '&limit=' + $scope.limit;
        query += '&language=' + $scope.language;

        if ($scope.GBIFSearch.rank.rank == 'SPECIES') {

            $http.get('plantexplorer/species?' + query).then(
                function(response) {
                    console.log('GBIF', response.data);
                    $scope.result = response.data.results;
                    $scope.numResults = parseInt(response.data.count);
                    $scope.results = $scope.result.map(function(obj) {
                        var rObj = {};

                        rObj.descriptions = obj.descriptions;
                        rObj.canonicalName = obj.canonicalName;
                        rObj.vernacularNames = obj.vernacularNames;
                        rObj.speciesKey = obj.speciesKey;
                        itemImage(obj.speciesKey).then(
                            function(response) {
                                var media = response.data.results[0] ? response.data.results[0].identifier : '';
                                rObj.imageURL = media;

                            });
                        return rObj;
                    })

                }


            )
        } else {

            $http.get('plantexplorer/species?' + query).then(

                function(response) {
                    console.log('GBIF', response.data);
                    $scope.result = response.data.results;
                    $scope.numResults = parseInt(response.data.count);
                    $scope.results = $scope.result.map(function(obj) {
                        var rObj = {};

                        rObj.descriptions = obj.descriptions;
                        rObj.canonicalName = obj.canonicalName;

                        if ($scope.GBIFSearch.rank.rank == 'GENUS') {
                            rObj.speciesKey = obj.genusKey;
                        } else {
                            rObj.speciesKey = obj.familyKey;
                        }
                        return rObj;
                    });
                    //$scope.GBIFSearch = {};

                })
        }


    };
//utility function to get an image from each species
    function itemImage(key) {

        var query = 'key=' + key;
        return $http.get('plantexplorer/image?' + query);

    }

//sets the species when a user selects it from the list of species
    $scope.setSelectedSpecies = function(name, key) {

        $scope.itemForID.name = name;
        $scope.itemForID.apiKey = key;


    }
//allows user to toggle complete search results or just names
    $scope.showResults = function() {
        if ($scope.show.allResults) {
            $scope.show.allResults = false;
            $scope.show.buttonText = 'Expand results';
        } else {
            $scope.show.allResults = true;
            $scope.show.buttonText = 'Collapse results';
        }
    };
//allows user to load more than 20 items on the search, upon click
    $scope.loadMoreItems = function() {
        $scope.limit += 10;
        if ($scope.limit > $scope.numResults) {
            $scope.limit = $scope.numResults;
        }
        getSpeciesInfo();
    };

//modal code
    $scope.myData = {

        modalShown: false,

    }

    $scope.logClose = function() {
        console.log('close!');
        $scope.GBIFSearch.search = '';
        $scope.results = [];
        $scope.numResults = '';
    };
    $scope.toggleModal = function() {

        $scope.myData.modalShown = !$scope.myData.modalShown;

    };



}]);
