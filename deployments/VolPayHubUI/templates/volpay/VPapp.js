var VolpayApp = angular.module('VolpayApp', [
			'ui.router',
			'ui.bootstrap',
			'oc.lazyLoad',
			'isoCurrency',
			'ngSanitize',
			'ngIdle',
			'pascalprecht.translate',
			'ngCookies',
			'ngFileSaver'
		]);

var retrieveProfileData = function () {
	return $.ajax({
		url: 'config/userData.json',
		async: false,
		cache: false,
		type: 'GET',
		dataType: 'json'
	}).responseJSON;
}
var uProfileData = retrieveProfileData();

var defaultClearing;

/*** Loading Properties file ***/
var retrieveREST = function () {
	return $.ajax({
		url: 'config/service.properties',
		async: false,
		cache: false,
		type: 'GET',
		dataType: 'json'
	}).responseJSON;
}
var RESTCALL = retrieveREST();

/*** Loading Configuration setting ***/
var retrieveData = function () {
	return $.ajax({
		url: 'config/config.json',
		async: false,
		cache: false,
		type: 'GET',
		dataType: 'json'
	}).responseJSON;
}
var configData = retrieveData();
var diffRestServer={}
if (configData.IsRESTServerInSameMachine == "Yes") {
	var protocol_host_port = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');
	var BASEURL = protocol_host_port + '/' + configData.RESTWebApp;
} else {
	console.log(objectFindByKey2(configData.RESTServer, 'UIDomainName', location.hostname))
	var diffRestServer = objectFindByKey2(configData.RESTServer, 'UIDomainName', location.hostname);
	var BASEURL = diffRestServer.Protocol + '://' + diffRestServer.RESTDomainName + ':' + diffRestServer.Port + '/' + configData.RESTWebApp;
	console.log(BASEURL)
}
//console.log(BASEURL)


if (configData.Authorization == "External") {
	sessionStorage.lastRefreshTime = new Date().getTime();

}

function objectFindByKey2(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if ($.isArray(array[i][key])) {
			if (array[i][key].indexOf(value) != -1) {
				return array[i];
			}
		} else {
			if (array[i][key] === value) {
				return array[i];
			}
		}
	}
	return null;
}

VolpayApp.config(['$httpProvider', function ($httpProvider) {
			$httpProvider.defaults.useXDomain = true;
			$httpProvider.defaults.withCredentials = true;
			$httpProvider.interceptors.push('loadmeOnscroll');
			$httpProvider.interceptors.push('timestampMarker');
		}
	]);
if (configData.IdleTimeOut == true) {
	VolpayApp.config(['KeepaliveProvider', 'IdleProvider', function (KeepaliveProvider, IdleProvider) {
				IdleProvider.idle(sessionStorage.sessionTimeLimit * 60);
				IdleProvider.timeout(30);
				KeepaliveProvider.interval(30);
			}
		]);
}
VolpayApp.run(['Idle', function (Idle) {
			//Idle.watch();
		}
	]);

VolpayApp.config(['$anchorScrollProvider', function ($anchorScrollProvider) {
			$anchorScrollProvider.disableAutoScrolling();
		}
	]);

if (configData.Authorization == 'Internal') {
	function authInterceptor(API, auth) {
		return {
			request: function (config) {
				var token = auth.getToken();
				if (config.url.indexOf(API) === 0 && token) {
					config.headers.Authorization = 'SessionToken:' + token;
				}
				return config;
			}
		}
	}
	function authService($window) {
		var self = this;
		self.getToken = function () {
			return sessionStorage.SessionToken;
		}
	}

	VolpayApp.factory('authInterceptor', authInterceptor)
	.service('auth', authService)
	.constant('API', BASEURL)
	.config(function ($httpProvider) {
		$httpProvider.interceptors.push('authInterceptor');
	});
}

VolpayApp.factory('timestampMarker', [function () {
			var timestampMarker = {
				request: function (config) {
					config.requestTimestamp = new Date().getTime();
					return config;
				},
				response: function (response) {
					response.config.responseTimestamp = new Date().getTime();
					sessionStorage.lastActivityTime = response.config.responseTimestamp;
					return response;
				}
			};
			return timestampMarker;
		}
	]);

VolpayApp.config(['$translateProvider', function ($translateProvider) {
			$translateProvider.useStaticFilesLoader({
				prefix: 'config/language/',
				suffix: '.json'
			});
			
			// Tell the module what language to use by default

			//$translateProvider.preferredLanguage(userData.genSetting.languageSelected);
			/*if(localStorage.languageSelected)
		{
			$translateProvider.preferredLanguage(localStorage.languageSelected);

			}
			else
		{
			$translateProvider.preferredLanguage('en_US');
			}*/
			//$translateProvider.preferredLanguage('en_US');
		}
	]);

VolpayApp.controller('activeController', ['$scope', '$rootScope', '$http', '$location', '$state', 'GlobalService', 'Idle', 'Keepalive', '$modal', 'AllPaymentsGlobalData', '$window', 'LogoutService', '$timeout', function ($scope, $rootScope, $http, $location, $state, GlobalService, Idle, Keepalive, $modal, AllPaymentsGlobalData, $window, LogoutService, $timeout) {

		
			$rootScope.profileUpdated = '';
			$scope.searchParam = $location.search().view;
			
			sessionStorage.iframeFlag = false;
			//console.log($scope.searchParam);
			if ($scope.searchParam == 'inside') {
				sessionStorage.iframeFlag = true;
				$('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");
				//$('.breadCrumb').css({'display':'none'})
			}

			if ($scope.searchParam == 'All') {
				sessionStorage.iframeFlag = false;
			}

			if ((document.cookie) && (configData.Authorization == "External") && (JSON.parse(sessionStorage.iframeFlag) != false)) {
				$('.breadCrumb').css({
					'display': 'none'
				})
			} else {
				$('.breadCrumb').css({
					'display': 'block'
				})
			}

			$('body').css('background-color', '#f2f2f2')

			$('.fixedfooter').css('margin-left', '230px');
			$('.footertext1').css('left', '-210px');
			setTimeout(function () {
				if ($(window).height() >= 760) {
					$('.listView').css({
						'max-height': ($(window).height() * 65) / 100 + 'px'
					})
				} else {
					$('.listView').css({
						'max-height': ($(window).height() * 52) / 100 + 'px'
					})
				}
			}, 100)

			$('.nvtooltip').css({
				'display': 'none'
			});

			$('html').css({
				"background": "",
				"background-size": "cover"
			})

			window.scrollTo(0, 0);

			$scope.goToHome = function () {
				sidebarMenuControl('PaymentModule', 'DashboardPayments')
				$state.go('app.paymentsummary', {})
			}

			$scope.checkPageContent = function () {
				$scope.mediaQuery = window.matchMedia("(max-width: 767px)");
				if ($scope.mediaQuery.matches) {
					$('.content-wrapper').css({
						'margin-left': '0px'
					});
				} else {
					$('.content-wrapper').css({
						'margin-left': '230px'
					});
				}
			}

			var pwRest = sessionStorage.pwRest;

			if ((pwRest == true) || (pwRest == 'true')) {
				$scope.showBreadcrumb = false;

				$('.content-wrapper').css({
					'margin-left': '0px'
				});
				$timeout(function () {
					$('.main-sidebar,.headerSideToggle').css({
						'display': 'none'
					});
				}, 200);
			} else if ((pwRest == false) || (pwRest == 'false')) {
				$scope.showBreadcrumb = true;
				$timeout(function () {
					$('.main-sidebar').css({
						'display': 'block'
					});
					$('#homeBreadCrumb').css({
						'pointer-events': 'auto'
					});
				}, 200);

				$scope.checkPageContent()
			}

			$('.ng-isolate-scope').css('display', 'none')
			$('.modal-backdrop').css('display', 'none')
			$('.modal').modal('hide')
			$('body').removeClass('modal-open')

			$scope.$on('$locationChangeStart', function (e, next, previous) {
				$scope.oldUrl = previous;
				$scope.oldHash = $window.location.hash;
				if ($scope.oldHash == "#/app/AlertsandNotification") {
					GlobalService.AandN.AlertId = '';
				}
			});

			var findRESTStatus = function () {

				$http.get(BASEURL + RESTCALL.HomePageDataREST).success(function (data, status) {})
				.error(function (error) {

					$scope.alerts = [{
							type: 'danger',
							msg: fetchErrorMessage(error.data)

						}
					];
				});
			}

			$scope.started = false;

			function closeModals() {
				if ($scope.warning) {
					$scope.warning.close();
					$scope.warning = null;
				}

				if ($scope.timedout) {
					$scope.timedout.close();
					$scope.timedout = null;
				}
			}

			if ((configData.Authorization == 'Internal') || (configData.IdleTimeOut == true)) {

				$scope.$on('IdleStart', function () {
					closeModals();

					$scope.warning = $modal.open({
							templateUrl: 'warning-dialog.html',
							windowClass: 'modal-warning'
						});
				});

				$scope.$on('IdleEnd', function () {
					closeModals();
				});

				$scope.$on('IdleTimeout', function () {

					LogoutService.Logout();

					$('.modal').modal('hide')
					$('.modal-backdrop').hide()

					$('body').css({
						'background-color': '#f2f2f2'
					});
					$('body').removeClass('modal-open')

					GlobalAllPaymentReset(GlobalService, AllPaymentsGlobalData)
					closeModals();
					$scope.timedout = $modal.open({
							templateUrl: 'timedout-dialog.html',
							windowClass: 'modal-danger'
						});

					delete $http.defaults.headers.common['Authorization'];
					sessionStorage.clear();
					$location.path("login")

				});

				$scope.start = function () {
					closeModals();
					Idle.watch();
					$scope.started = true;
				};

				$scope.stop = function () {
					closeModals();
					Idle.unwatch();
					$scope.started = false;

				};

				Idle.watch();
			}

			$(window).resize(function () {

				//$('.listView').css({'max-height':($(window).height()*65)/100+'px'})

				var mediaQuery = window.matchMedia("(max-width: 991px)");
				if (mediaQuery.matches) {
					$('.sidebar-menu').slimScroll({
						    color: '#ddd',
						    size: '7px',
						    height: '350px',
						    alwaysVisible: true
					});
				} else {
					$('.sidebar-menu').slimScroll({
						    color: '#ddd',
						    size: '7px',
						     //height: $(window).outerHeight()-200+'px',
						height: (configData.ThemeName == 'volante') ? ($(window).outerHeight() - 130 + 'px') : ($(window).outerHeight() - 330 + 'px'),
						    alwaysVisible: true
					});
				}

				if ((pwRest == false) || (pwRest == 'false')) {
					$scope.checkPageContent()
				}

				//setTimeout(function()
				//{
				if ($(window).height() >= 760) {
					$('.listView').css({
						'max-height': ($(window).height() * 65) / 100 + 'px'
					})
				} else {
					$('.listView').css({
						'max-height': ($(window).height() * 52) / 100 + 'px'
					})
				}
				//	},100)


			})

			//$('.slimScrollDiv').css({'height':$(window).outerHeight()+'px','overflow':'auto'})

			/*$('.sidebar-menu').slimScroll({
			    color: '#ddd',
			    size: '7px',
			    height: $(window).outerHeight()+'px',
			    alwaysVisible: true
			});*/

			$('.page-breadcrumb').find('li:last-child').click(function () {
				checkMenuOpen()
			})

		}
	])

VolpayApp.controller('RefreshController', ['$scope', '$http', '$location', '$state', 'GlobalService', 'Idle', 'Keepalive', '$modal', 'AllPaymentsGlobalData', '$window', 'LogoutService', '$timeout', '$cookies', '$interval', '$filter', function ($scope, $http, $location, $state, GlobalService, Idle, Keepalive, $modal, AllPaymentsGlobalData, $window, LogoutService, $timeout, $cookies, $interval, $filter) {

			$scope.Timer = null;

			//Timer start function.
			$scope.StartTimer = function () {

				//Initialize the Timer to run every 10000 milliseconds i.e. Ten second.
				$scope.Timer = $interval(function () {
						//Display the current time.
						//var time = $filter('date')(new Date(), 'HH:mm:ss');
						var time = new Date().getTime()

							console.log("Current Time: " + new Date(time));
						console.log("Last Refresh Time: " + new Date(JSON.parse(sessionStorage.lastRefreshTime)));
						console.log("Last Activity Time: " + new Date(JSON.parse(sessionStorage.lastActivityTime)));
						//console.log("Current Time - lastRefreshTime in seconds "+(time - JSON.parse(sessionStorage.lastRefreshTime)));
						//console.log("Refresh TimeOut in seconds: "+ configData.RefreshTimeOut * 60 * 1000)

						if (((time - JSON.parse(sessionStorage.lastRefreshTime)) > (configData.RefreshTimeOut * 60 * 1000)) && (JSON.parse(sessionStorage.lastActivityTime) > JSON.parse(sessionStorage.lastRefreshTime))) {
							$http.get('refresh.html?' + time).success(function (response) {
								$interval.cancel($scope.Timer);
								console.log("Return Cookie: " + document.cookie);
								sessionStorage.lastRefreshTime = new Date().getTime();
								$scope.StartTimer();
								//console.log(status)

							})
						}

					}, 10000);
			};

			if (configData.Authorization == 'External') {
				$scope.StartTimer();
			}

		}
	]);

$(window).scroll(function () {

	var scrollPoint = $(this).scrollTop();
	var mediaQuery = window.matchMedia("(max-width: 767px)");
	var dynamicHeight = $('.main-header').outerHeight();

	if (mediaQuery.matches) {
		dynamicHeight = $('body').hasClass('sidebar-open') ? ($('.main-header').outerHeight() + $('.sidebar').outerHeight()) : ($('.main-header').outerHeight());
		if (scrollPoint > dynamicHeight) {
			$('.breadCrumb').css({
				'top': (scrollPoint - dynamicHeight) + 'px',
				'z-index': '1'
			});
		} else if (scrollPoint < dynamicHeight) {
			$('.breadCrumb').css({
				'top': '0px',
				'z-index': '1'
			});
		}
	} else {
		$('.breadCrumb').css({
			'top': scrollPoint + "px",
			'z-index': '1'
		})
	}

	var mq = window.matchMedia("(max-width: 991px)");
	var headHeight
	if (mq.matches) {
		headHeight = 50;
	} else {
		headHeight = 50;
	}

	var scroll = $(window).scrollTop();

	var ht = $('.breadCrumb').outerHeight() + $('.pageTitle').outerHeight()
		if (scroll > ht) {
			$('.autoAdjustAlert').css('top', headHeight + "px")
			$('.autoAdjustAlert').addClass('affix')
		} else {
			$('.autoAdjustAlert').css("top", "");
			$('.autoAdjustAlert').removeClass('affix')
			$('.CountBar').css('top', "")
			$('.CountBar').removeClass('affix')

		}

});