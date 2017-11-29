var timeZoneDropValues;

var userData = uProfileData;

VolpayApp.controller('appCtrl', function ($scope, $http, $location, $filter, $state, $timeout, $translate) {

	$scope.searchParam = $location.search().view;
	//sessionStorage.iframeFlag = false;
	//$timeout(function () {
	sessionStorage.iframeFlag = false;
	//console.log($scope.searchParam);
	if ($scope.searchParam == 'inside') {
		$scope.iframeFlag = true;
		sessionStorage.iframeFlag = true;
		$('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");
		//$('.breadCrumb').css({'display':'none'})
	}

	if ($scope.searchParam == 'All') {
		sessionStorage.iframeFlag = false;
		$scope.iframeFlag = false;
	}
	if (sessionStorage.iframeFlag != undefined) {
		$scope.iframeFlag = JSON.parse(sessionStorage.iframeFlag);

	}

	//}, 1500)

	if ($location.path() != '/app/forgotpassword') {

		$timeout(function () {
			$scope.aa = {
				"Queryfield": [{
						"ColumnName": "UserID",
						"ColumnOperation": "=",
						"ColumnValue": sessionStorage.UserID
					}
				],
				"Operator": "AND"
			}

			$scope.aa = constructQuery($scope.aa);

			$http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).success(function (data) {

				if (!data.length) {
					uProfileData = retrieveProfileData()
						userData = uProfileData;

					var lObj = {};
					lObj.UserID = sessionStorage.UserID;
					lObj.ProfileData = $filter('stringToHex')(JSON.stringify(uProfileData));
					//lObj.aaa = "aaa";

					$http.post(BASEURL + RESTCALL.userProfileData, lObj).success(function (data) {}).error(function (error) {

						console.log(error)
					})
					$translate.use('en_US');
				} else {
					sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;

					$scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))
						userData = $scope.uData;

					setTimeout(function () {
						if (userData.customDashboardWidgets.showDashboard) {
							$('#MyDashboard').css('display', 'block')
						} else {
							$('#MyDashboard').css('display', 'none')
						}
					}, 1000)

					$translate.use($scope.uData.genSetting.languageSelected);
				}

				$('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");

			}).error(function (error) {
				userData = uProfileData;
				$translate.use("en_US");
			})

		}, 1500);
		$http.get(BASEURL + RESTCALL.TimezoneOptions).success(function (data) {
			timeZoneDropValues = data;
		}).error(function () {})

	}
})