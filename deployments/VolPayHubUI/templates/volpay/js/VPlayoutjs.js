
if((configData.AllowDirectURLAccess==false)||(configData.AllowDirectURLAccess==undefined)){
   VolpayApp.run(function ($http, $location, $rootScope, GlobalService,LogoutService) {
		$rootScope.$on('$locationChangeSuccess', function (e) {
			$rootScope.actualLocation = $location.path();
		});

		$rootScope.$watch(function () {
			return $location.path()
		}, function (newLocation, oldLocation) {

		if (sessionStorage.SessionToken) {
			  if ($rootScope.actualLocation === newLocation) {
				if (oldLocation != '/login') {
						GlobalService.Error401 = true;
						LogoutService.Logout();
					}
				}
				if ($rootScope.actualLocation == undefined) {

					GlobalService.RefreshHappen = true;
					LogoutService.Logout();
				}
			} else {

				if ($location.path() == '/login') {
					$location.path('/login');
				} else if ($location.path() == '/login/signup') {
					$location.path('/login/signup')

				} else if ($location.path() == '/app/forgotpassword') {
					$location.path('/app/forgotpassword')

				} else {
					//LogoutService.Logout();
					$location.path('/login');
				}
			}
		});

	});  
}

VolpayApp.controller('volpayAppController',function($scope){
        $scope.configData = configData;
        $scope.footerPath = 'templates/footer/'+$scope.configData.ThemeName+'/VPfooter.html';
        $('#footerCss').attr('href','themes/'+$scope.configData.ThemeName+'/styles.css')
})


