VolpayApp.controller('loginCtrl', function ($rootScope, $scope, $http, $location, $state, $timeout, $filter, $translate, AdminService, GlobalService, AllPaymentsGlobalData) {

	delete sessionStorage.menuSelection;

	$('.nvtooltip').css('opacity',0);
	$('.select2-container').removeClass('select2-container--open')

			

	$('body').css('background-color','transparent')
	$('html').css({
		"background" : "url(themes/" + configData.ThemeName + "/bg.jpg) no-repeat center center fixed",
		"background-size" : "cover"
	})


	$('.nvtooltip').css({
		'display' : 'none'
	});

	setTimeout(function () {
		$('.fixedfooter,.main-footer').css({
			'background-color' : '#364150',
			'margin-left': '0'
		})
       $('.footertext1').css('left', '20px');
	}, 200)

	/*if(sessionStorage.UserID!=undefined){

	GlobalService.logoutMessage = false;
	$http({
	url : BASEURL + RESTCALL.LogoutREST,
	method : "POST",
	data : {
	UserId : sessionStorage.UserID
	},
	headers : {
	'Content-Type' : 'application/json'
	}
	}).success(function (data, status, headers, config) {


	delete $http.defaults.headers.common['Authorization'];
	sessionStorage.clear();
	GlobalAllPaymentReset(GlobalService,AllPaymentsGlobalData)
	$location.path('login');
	}).error(function (data, status, headers, config) {
	console.log(data)
	$scope.alerts = [{
	type : 'danger',
	msg : data.error.message
	}
	];
	});
	}*/

	function rand(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}

	var userData = uProfileData;
	// userData.genSetting={
	// "languageSelected":"en_US",
	// "themeSelected":"volante"
	// };
	// userData.dashboardSetting={
	//                              "curDis":true,
	//                              "inbndPayment":true,
	//                              "mop":true,
	//                              "status":true,
	//                          };
	// userData.savedSearch={
	//            "FileList":[],
	//            "AllPayments":[]
	//        };


	$scope.login = function (loginData) {

		var loginObj = {};
		//loginObj.UserId = loginData.UserId;
		loginObj = (JSON.stringify(loginData));

		$http.post(BASEURL + RESTCALL.LoginREST, loginObj).success(function (data, status) {

			// console.log(loginData)
			sessionStorage.createUserLoginName = loginData.UserId;
			sessionStorage.UserID = loginData.UserId;
			sessionStorage.SessionToken = data.SessionToken;
			sessionStorage.IsProfileSetup = data.IsProfileSetup;

			// sessionStorage.paymentCurDist = 'vertical';
			// sessionStorage.inbndChart = 'pie';
			// sessionStorage.mopChart = 'horizontal';
			// sessionStorage.statusChart = 'sankey';


			uiConfiguration();

			//var d = decrypt(e, password1);
			sessionStorage.forSLSK = "SECRET" + rand(11111, 55555);

			sessionStorage.forSL = JSON.stringify(encrypt(JSON.stringify(loginObj), sessionStorage.forSLSK));

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
					checkLogin(userData)
					//checkCustomDashboard(userData)
				} else {

					$scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))
						userData = $scope.uData;
					/*userData.genSetting = $scope.uData.genSetting;
					userData.dashboardSetting = $scope.uData.dashboardSetting;
					userData.savedSearch.FileList = $scope.uData.savedSearch.FileList;
					userData.savedSearch.AllPayments = $scope.uData.savedSearch.AllPayments;
					userData.DboardPreferences =  $scope.uData.DboardPreferences;
					userData.defaultChartTypes = $scope.uData.defaultChartTypes;
					userData.customDashboardWidgets.showDashboard = $scope.uData.customDashboardWidgets.showDashboard;
					userData.customDashboardWidgets.settings = $scope.uData.customDashboardWidgets.settings;*/

					sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;
					//checkCustomDashboard($scope.uData)
							if($scope.uData.genSetting.languageSelected)
							{
								$translate.use($scope.uData.genSetting.languageSelected);
							}
							else{
								$translate.use("en_US");
							}
					
					checkLogin($scope.uData)
				}

				

			}).error(function (error) {

				userData = uProfileData;
				checkLogin(userData)

				//  checkCustomDashboard(uProfileData)

				$translate.use("en_US");
			})

			function checkLogin(inData)
			{
			$('#themeColor').attr("href", "themes/styles/" + inData.genSetting.themeSelected + ".css");
			
			if ((sessionStorage.IsProfileSetup == true) || (sessionStorage.IsProfileSetup == 'true')) {
				sessionStorage.showMoreFieldOnCreateUser = false;
				GlobalService.pwRest = true;
				sessionStorage.pwRest = GlobalService.pwRest;

				sessionStorage.Name = "Default";
				$location.path('app/adduser');
			} else {
				sessionStorage.UserID = data.UserInfo.UserID;
				GlobalService.pwRest = data.UserInfo.ForceResetFlag;
				sessionStorage.pwRest = GlobalService.pwRest;
				if (GlobalService.pwRest) {
					sessionStorage.showMoreFieldOnCreateUser = false;
					$location.path('app/myprofile');
				} else {
					sessionStorage.ROLE_ID = data.UserInfo.RoleID;
					sessionStorage.showMoreFieldOnCreateUser = true;
					
//console.log(inData)					

//console.log(inData.myProfileSetting)

	if((inData.myProfileSetting != undefined))
	{
				 if(inData.myProfileSetting.landingModule != undefined)
				 {
					
					 findLandingModule(inData.myProfileSetting.landingModule,$state)
				 }
				else
				{
				
					userData.myProfileSetting.landingModule={}
					userData.myProfileSetting.landingModule.name = "paymentsummary";
					userData.myProfileSetting.landingModule.stateParams = {};

					var interval = "";
					clearInterval(interval)
					interval = setInterval(function () {
							if (sessionStorage.UserProfileDataPK != undefined) {
								//console.log("as")
							updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))),$http).then(function(response){
							}) 
							//	console.log("if")
								clearInterval(interval)

						} 
						// else {
						// 	console.log("else")
						// 		clearInterval(interval)
						// 	}
						}, 100)				
						$state.go('app.paymentsummary', {});
				}
	}
	else
		{
			
			userData.myProfileSetting = {};
			userData.myProfileSetting.landingModule={}
			userData.myProfileSetting.landingModule.name = "paymentsummary";
			userData.myProfileSetting.landingModule.stateParams = {};
			
			userData.myProfileSetting.landingPagesArr = [
				{
					"name":"Payments Dashboard",
					"state":"paymentsummary",
					"static":true,
					"stateParams":{}
				},
				{
					"name":"All Payments",
					"state":"payments",
					"static":true,
					"stateParams":{}
				},
				{
					"name":"Instructions Dashboard",
					"state":"filesummary",
					"static":true,
					"stateParams":{}
				},
				{
					"name":"All Instructions",
					"state":"instructions",
					"static":true,
					"stateParams":{}
				}
			];
			
			

			var interval = "";
			clearInterval(interval)
			interval = setInterval(function () {
					if (sessionStorage.UserProfileDataPK != undefined) {
						//console.log("as")
					updateUserProfile(($filter('stringToHex')(JSON.stringify(userData))),$http).then(function(response){
					}) 
					//	console.log("if")
						clearInterval(interval)

				} 
				// else {
				// 	console.log("else")
				// 		clearInterval(interval)
				// 	}
			}, 100)	
						
				$state.go('app.paymentsummary', {});
		}
				

					//checkCustomDashboard(userData)

					/*function checkCustomDashboard(val) {
						
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

					}*/

				}
			}
		}

		}).error(function (data, status, headers, config) {
			$scope.alerts = [{
					type : 'danger',
					msg : data.error.message
				}
			];
		});

	}


	if($rootScope.profileUpdated)
	{
		$scope.alerts = [{
				type : 'success',
				msg : $rootScope.profileUpdated
			}]
	}

	if (GlobalService.passwordChanged) {
		$scope.alerts = [{
				type : 'success',
				msg : GlobalService.responseMessage
			}
		];
		GlobalService.passwordChanged = false;

	} else {
		GlobalService.responseMessage = "";

	}

	if (GlobalService.userCreated) {
		$scope.alerts = [{
				type : 'success',
				msg : 'User created successfully.'
			}
		];
		GlobalService.userCreated = false;
	}

	if (GlobalService.logoutMessage) {
		$scope.alerts = [{
				type : 'success',
				msg : 'Logged out successfully.'
			}
		];
		GlobalService.logoutMessage = false;
	}



	$scope.multipleEmptySpace = function (e) {

		if ($.trim($(e.currentTarget).val()).length == 0) {
			$(e.currentTarget).val('')
		}
	}

});