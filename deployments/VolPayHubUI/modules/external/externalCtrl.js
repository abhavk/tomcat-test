VolpayApp.controller('externalCtrl', function ($scope, $stateParams,$rootScope, $http, $location, $state, $timeout,$sce) {
    

    // $scope.url = $stateParams.url;
    // $("#frame").attr("src", $stateParams.url);

      //$scope.currentProjectUrl = $sce.trustAsResourceUrl($stateParams.url);
      console.log($stateParams.url)
       $scope.url = $sce.trustAsResourceUrl($stateParams.url);

})