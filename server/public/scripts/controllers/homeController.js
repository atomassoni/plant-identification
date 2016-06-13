myApp.controller('HomeController', ['$scope', '$http', 'Upload', 'DataFactory', function($scope, $http, Upload, DataFactory) {
    $scope.dataFactory = DataFactory;
    $scope.file = '';
    $scope.comment = '';
    $scope.uploads = [];
    $scope.postTime = '';

    $scope.currentIdItem = '';
    $scope.itemForID = {};
    $scope.itemForID.name = '';
    $scope.itemForID.apiKey = 0;

    $scope.GBIFSearch = {};
    $scope.GBIFSearch.search = '';
    $scope.GBIFSearch.rank = {rank :'SPECIES'};
    $scope.GBIFranks =  [{rank: 'SPECIES',label:'Species level search'},
  {rank: 'GENUS', label: 'Genus level search'},
  {rank: 'FAMILY', label: 'Family level search'}
];

    $scope.results = [];
    $scope.positiveID = '';
    $scope.speciesKey = '';
    $scope.image = '';
    $scope.numResults = '';
    $scope.limit = 20;
    $scope.offset = 0;


    $scope.show = {allResults: false, buttonText: 'Expand Results'};

    $scope.userID = "574f2b394539cf4a7e69a877";
    $scope.userLevel = 5;

    $scope.activePlant = {};

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

$scope.setActive = function (obj) {
  $scope.activePlant = obj;
  console.log($scope.activePlant);
};

$scope.selectID = function (id, idIndex) {

  console.log("id", id);
  var userVote = {'user': $scope.userID, 'level': $scope.userLevel, 'idIndex' :idIndex };
  $http.put('/uploads/select/' + id, userVote)
  .then(function (response) {
console.log('PUT /selects ', userVote);
getImages();

});
};

    $scope.submitID = function (id) {
      var plantID = $scope.itemForID;
console.log('newid', plantID);
      $http.put('/uploads/' + id, plantID)
        .then(function (response) {
          console.log('PUT /ids ', plantID);
          getImages();
          $scope.currentIdItem = '';
          $scope.itemForID = {};
        });
    };






        // if($scope.dataFactory.factoryGetFavorites() === undefined) {
        //   $scope.dataFactory.factoryRefreshFavoriteData().then(function() {
        //     $scope.favCount = $scope.dataFactory.factoryGetFavorites().length;
        //   });
        // } else {
        //   $scope.favCount = $scope.dataFactory.factoryGetFavorites().length;
        // }

    $scope.loadSpeciesInfo = function () {
      $scope.limit = 20;
      getSpeciesInfo();
    }

      function getSpeciesInfo () {
          $scope.currentIdItem = $scope.activePlant._id;
          var query = 'q=' + encodeURI($scope.GBIFSearch.search);
          query += '&rank=' + $scope.GBIFSearch.rank.rank;
          query += '&limit=' + $scope.limit;

          if ($scope.GBIFSearch.rank.rank=='SPECIES') {

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
                    console.log('NEW OBJ', $scope.results);

                    //$scope.GBIFSearch = {};
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

                    if ($scope.GBIFSearch.rank.rank=='GENUS') {
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

        function itemImage(key) {

            var query = 'key=' + key;
            return $http.get('plantexplorer/image?' + query);

        }

        $scope.setSelectedSpecies = function (name, key) {

            $scope.itemForID.name = name;
            $scope.itemForID.apiKey = key;

        }

        $scope.showResults = function () {
          if ($scope.show.allResults) {
            $scope.show.allResults = false;
            $scope.show.buttonText = 'Expand results';
          } else {
            $scope.show.allResults = true;
            $scope.show.buttonText = 'Collapse results';
          }
        };
        $scope.loadMoreItems = function () {
            $scope.limit += 10;
            if ($scope.limit > $scope.numResults) {
                $scope.limit = $scope.numResults;
            }
            getSpeciesInfo();
        };

}]);
