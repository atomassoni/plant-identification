myApp.controller('PlantexplorerController', ['$scope', '$http', 'DataFactory', function($scope, $http, DataFactory) {
    $scope.dataFactory = DataFactory;



    $scope.GBIFSearch = 'mulberry';
    $scope.GBIFrank = {rank :'SPECIES'};
    $scope.GBIFranks =  [{rank: 'SPECIES',label:'Species level search'},
  {rank: 'GENUS', label: 'Genus level search'},
  {rank: 'FAMILY', label: 'Family level search'}
];

    $scope.results = [];
    $scope.positiveID = '';
    $scope.speciesKey = '';
    $scope.itemForID = '';
    $scope.itemNameForID = '';
    $scope.image = '';
    $scope.numResults = '';
    $scope.limit = 20;
    $scope.offset = 0;
    $scope.count = 0;



    // if($scope.dataFactory.factoryGetFavorites() === undefined) {
    //   $scope.dataFactory.factoryRefreshFavoriteData().then(function() {
    //     $scope.favCount = $scope.dataFactory.factoryGetFavorites().length;
    //   });
    // } else {
    //   $scope.favCount = $scope.dataFactory.factoryGetFavorites().length;
    // }



    $scope.getSpeciesInfo = function() {

      var query = 'q=' + encodeURI($scope.GBIFSearch);
      query += '&rank=' + $scope.GBIFrank.rank;
      query += '&limit=' + $scope.limit;

      if ($scope.GBIFrank.rank=='SPECIES') {



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
                    //rObj.speciesKey = ;
                    itemImage(obj.speciesKey).then(
                        function(response) {
                            var media = response.data.results[0] ? response.data.results[0].identifier : '';
                            rObj.imageURL = media;

                        });
                    return rObj;
                })
                console.log('NEW OBJ', $scope.results);
            }
        )
      } else {
console.log("genus");

        $http.get('plantexplorer/species?' + query).then(

          function(response) {
            console.log('GBIF', response.data);
            $scope.result = response.data.results;
            $scope.numResults = parseInt(response.data.count);
            $scope.results = $scope.result.map(function(obj) {
                var rObj = {};

                rObj.descriptions = obj.descriptions;
                rObj.canonicalName = obj.canonicalName;

                if ($scope.GBIFrank.rank=='GENUS') {
                rObj.speciesKey = obj.genusKey;
              } else {
                rObj.speciesKey = obj.familyKey;
              }
                return rObj;
      });
    })
  }
}

    function itemImage(key) {

        var query = 'key=' + key;
        return $http.get('plantexplorer/image?' + query);

    }

    $scope.setSelectedSpecies = function (key) {
        $scope.itemForID = key;
        $scope.itemNameForID = $scope.results.canonicalName;

    }

    $scope.loadMoreItems = function () {
        $scope.limit += 10;
        if ($scope.limit > $scope.count) {
            $scope.limit = $scope.count;
        }

    };

    $scope.addID = function() {
        var desc = $scope.animal.description.$t;
        petFave.petId = $scope.animal.id.$t;
        petFave.name = $scope.animal.name.$t;
        petFave.imageUrl = $scope.animal.media.photos.photo[3].$t;
        petFave.description = desc ? desc : 'No description';
        petFave.animalType = $scope.animal.animal.$t;

        $scope.dataFactory.factorySaveFavorite(petFave).then(function() {
            console.log('done saving');
            $scope.favCount = $scope.dataFactory.factoryGetFavorites().length;
        });


    }



}]);
