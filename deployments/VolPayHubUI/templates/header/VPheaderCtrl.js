VolpayApp.controller('headerCtrl', function ($http, $state, $scope, $location, $translate, $timeout, GlobalService, AllPaymentsGlobalData, AdminService, LogoutService, $rootScope, $filter) {
	//$scope.showSmallLogo = false;

	if ((document.cookie) && (configData.Authorization == "External")) {
		$http.get(BASEURL + '/rest/v2/users/me').success(function (data) {
			console.log(data)

			var ExternalUser = data;

			sessionStorage.ROLE_ID = ExternalUser.RoleID;
			sessionStorage.UserID = ExternalUser.UserID;
			if (ExternalUser.RoleID == 'Super Admin') {
				sessionStorage.showMoreFieldOnCreateUser = true;
			} else {
				sessionStorage.showMoreFieldOnCreateUser = false;
			}

		}).error(function (error) {});

		var sessionData = function () {

			return $.ajax({
				url : BASEURL + '/rest/v2/ui/configuration',
				cache : false,
				async : false,
				type : 'GET'
			}).responseJSON;
		}

		var sData = sessionData();
		for (i in sData) {
			if (sData[i].Name.toUpperCase() == 'FILESIZERESTRICTION') {
				sessionStorage.fileUploadLimit = sData[i].Value;
			} else if (sData[i].Name.toUpperCase() == 'SESSIONTIMEOUT') {
				sessionStorage.sessionTimeLimit = sData[i].Value;
			}
		}

		var applicationInfo = function () {

			return $.ajax({
				url : BASEURL + RESTCALL.appInfo,
				cache : false,
				async : false,
				type : 'GET'
			}).responseJSON;
		}

		var aData = applicationInfo();
		sessionStorage.VersionInfo = aData.Version

			$timeout(function () {

				$scope.aa = {
					"Queryfield" : [{
							"ColumnName" : "UserID",
							"ColumnOperation" : "=",
							"ColumnValue" : sessionStorage.UserID
						}
					],
					"Operator" : "AND"
				}
				$scope.aa = constructQuery($scope.aa);
				console.log($scope.aa)
				$http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).success(function (data) {

					if (!data.length) {

						userData = uProfileData;
						var lObj = {};
						lObj.UserID = sessionStorage.UserID;
						lObj.ProfileData = $filter('stringToHex')(JSON.stringify(userData));

						$http.post(BASEURL + RESTCALL.userProfileData, lObj).success(function (data) {}).error(function (error) {

							console.log(error)
						})
						$translate.use('en_US');

						checkCustomDashboard(userData)
					} else {

						$scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))
							userData = $scope.uData;

						sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;
						//checkCustomDashboard($scope.uData)
						$translate.use($scope.uData.genSetting.languageSelected);
					}

					$('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");

				}).error(function (error) {
					userData = uProfileData;
					$translate.use("en_US");
					console.log(userData.genSetting)
					$('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");
				})

			}, 1500)

	}

	$timeout(function () {
		$scope.accessUserName = sessionStorage.UserID;
	}, 2000)

	//$rootScope.headerLogo = false;

	$scope.sideBar = function (value) {

		if ($(window).width() <= 767) {

			if ($("body").hasClass('sidebar-open')) {
				//$('.main-sidebar').css({'min-height':'50%'})
				$("body").removeClass('sidebar-open');
				$scope.sidebarToggleTooltip = "Show Menu";
				//$rootScope.headerLogo = false;
			} else {

				//$('.main-sidebar').css({'min-height':'50%'})
				$("body").addClass('sidebar-open');
				$scope.sidebarToggleTooltip = "Hide Menu";
				//$rootScope.headerLogo = false;
			}
		}
	};

	if ($("body").hasClass('sidebar-open')) {
		$scope.sidebarToggleTooltip = "Hide Menu"
	} else {

		$scope.sidebarToggleTooltip = "Show Menu"
	}

	$scope.goTo = function (clickedId, eve, Id) {
		GlobalService.AandN.AlertId = clickedId;
		if ($(eve.currentTarget).parent().hasClass('notVisited')) {
			GlobalService.AandN.NotifData.NotifyContent[Id]['status'] = false
				$scope.NotifCount = $scope.NotifCount - 1;
			GlobalService.AandN.NotifCount = $scope.NotifCount;
			$(eve.currentTarget).parent().removeClass('notVisited')
		}
		if ($location.path() != "/app/AlertsandNotification") {
			$location.path("app/AlertsandNotification")
		} else {
			GlobalService.AandN.functions.anchorSmoothScroll(clickedId);
		}
	}

	$scope.alertFn = function () {

		if ($location.path() != '/app/forgotpassword') {

			$http({
				url : BASEURL + RESTCALL.AlertandNotific + 'view',
				method : "POST",
				data : {
					UserId : sessionStorage.UserID
				},
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				GlobalService.AandN.NotifData = data;
				for (var k in GlobalService.AandN.NotifData.NotifyContent) {
					GlobalService.AandN.NotifData.NotifyContent[k]['status'] = true;
				}
				$scope.Notifi = GlobalService.AandN.NotifData;
				$scope.NotifCount = GlobalService.AandN.NotifData.notificationCount;

				$rootScope.totAlertCnt = GlobalService.AandN.NotifData.notificationCount; ;

			}).error(function (data, status, headers, config) {
				$scope.alerts = [{
						type : 'danger',
						msg : data.error.message
					}
				];
			});
		}

	}
	$scope.alertFn();

	$rootScope.$on("CallParentMethod", function () {
		$scope.alertFn();
	});

	$scope.MultiLanguage = sessionStorage.MultiLanguage;

	/*if(localStorage.themeSelected){
	$('#themeColor').attr("href", "themes/styles/"+localStorage.themeSelected+".css");
	}
	else{
	$('#themeColor').attr("href", "themes/styles/default.css");
	}*/
	var d1 = new Date(),
	d2 = new Date(d1);
	d2.setMinutes(d1.getMinutes());
	var currentTime123 = d2;

	$scope.accessUserName = sessionStorage.UserID;

	$scope.logout = function () {
		GlobalAllPaymentReset(GlobalService, AllPaymentsGlobalData) // For resetting the FileList/App Payments Data
		LogoutService.Logout()
	}

	function checkCustomDashboard(val) {

		if (val.defaultdashboard.defDashboard.trim() == 'dashboardFile') {
			$state.go('app.filesummary', {});
			$timeout(function () {
				sidebarMenuControl('PaymentModule', 'DashboardFile')
			}, 500)
		} else if (val.defaultdashboard.defDashboard.trim() == 'dashboardPayments') {
			$state.go('app.paymentsummary', {})
			$timeout(function () {
				sidebarMenuControl('PaymentModule', 'DashboardPayments')
			}, 500)
		} else if (val.defaultdashboard.defDashboard.trim() == 'myDashboard') {
			$state.go('app.newmodules', {
				url : 'mydashboard',
				tempUrl : 'plug-ins/modules/mydashboard',
				contrl : 'mydashboardCtrl'
			});

			$timeout(function () {
				sidebarMenuControl('Home', 'MyDashboard')
			}, 500)
		}

	}

})