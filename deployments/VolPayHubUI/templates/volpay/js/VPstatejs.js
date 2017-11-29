VolpayApp.config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
			
			var n = new Date().getTime()
			if (configData.Authorization == 'Internal') {
				$urlRouterProvider.otherwise("/login");
			}

			if (configData.Authorization == 'External') {
				$urlRouterProvider.otherwise("/app/dashboard");
			}

			$stateProvider
			.state('login', {
				url : "/login",
				templateUrl : "templates/login/VPlogin.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "loginCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'templates/login/VPloginCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app', {
				url : "/app",
				templateUrl : "modules/app.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					details : null
				},
				controller : "appCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'templates/sidebar/VPsidebar.css',
									'templates/sidebar/VPsidebarCtrl.js',

									'templates/header/VPheaderCtrl.js',
									'templates/header/VPheader.css',

									'modules/appCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.paymentsummary', {
				url : "/dashboard",
				templateUrl : "modules/paymentdashboard/dashboard.html?a=" + n,
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "dashboardController",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/paymentdashboard/dashboardController.js'
								]
							});
						}
					]
				}
			})
			.state('app.routeregistry', {
				url : "/routeregistry",
				templateUrl : "modules/routeregistry/routeregistry.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "routeregistryCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/routeregistry/routeregistry.js'
								]
							});
						}
					]
				}
			})
			.state('app.payments', {
				url : "/allpayments",
				templateUrl : "modules/allpayments/allpayments.html?a=" + n,
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : ''
				},
				controller : "allPaymentsCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/allpayments/allPaymentsController.js'
								]
							});
						}
					]
				}
			})
			/*.state('app.paymentforbulking', {
			url : "/paymentforbulking",
			templateUrl : "modules/paymentforbulking/paymentforbulking.html",
			data : {
			pageTitle : 'AngularJS File Upload'
			},
			params : {
			input : ''
			},
			controller : "paymentforbulkingController",

			resolve : {
			deps : ['$ocLazyLoad', function ($ocLazyLoad) {
			return $ocLazyLoad.load({
			name : 'VolpayApp',
			files : [
			'modules/paymentforbulking/paymentforbulkingController.js'
			]
			});
			}
			]
			}
			})*/
			.state('app.paymentdetail', {
				url : "/paymentdetail",
				templateUrl : "modules/paymentdetail/paymentdetail.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : ''
				},
				controller : "paymentDetailCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [
									'modules/paymentdetail/paymentDetailCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.interfaceoverride', {
				url : "/interfaceoverride",
				templateUrl : "modules/interfaceoverride/interfaceoverride.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				params : {
					input : ''
				},
				controller : "interfaceoverrideCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/interfaceoverride/interfaceoverrideCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.payment-repair', {
				url : "/payment-repair",
				templateUrl : "modules/paymentrepair/payment-repair.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				params : {
					input : ''
				},
				controller : "paymentRepairCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/paymentrepair/paymentRepairCtrl.js'
								]
							});
						}
					]
				}
			})

			.state('app.filesummary', {
				url : "/filedashboard",
				templateUrl : "modules/filedashboard/fileDashboard.html?a=" + n,
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "fileDashboardController",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/filedashboard/fileDashboardController.js'
								]
							});
						}
					]
				}
			})
			.state('app.instructions', {
				url : "/instructions",
				templateUrl : "modules/allfiles/filelist.html?a=" + n,
				data : {
					pageTitle : ''
				},
				controller : "fileListController",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/allfiles/fileListController.js'
								]
							});
						}
					]
				}
			})
			.state('app.distributedinstructions', {
				url : "/distributedinstructions",
				templateUrl : "modules/distributedinstructions/distributedinstructions.html",
				data : {
					pageTitle : 'Distributed Instructions'
				},
				params : {
					input : ''
				},
				controller : "distributedinstructionsctrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/distributedinstructions/distributedinstructionsctrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.outputpaymentsummary', {
				url : "/outputpaymentsummary",
				templateUrl : "modules/paymentsummary/outputpaymentsummary.html",
				data : {
					pageTitle : 'Output Payment Summary'
				},
				params : {
					input : ''
				},
				controller : "outputpaymentsummaryctrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/paymentsummary/outputpaymentsummaryctrl.js'
								]
							});
						}
					]
				}
			})
  
			.state('app.filedetail', {
				url : "/filedetail",
				templateUrl : "modules/filedetail/filedetail.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "filedetailCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/filedetail/filedetailCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.initiatetransaction', {
				url : "/initiatetransaction",
				templateUrl : "modules/initiatetransation/initiateTransaction.html?a=" + n,
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "initiateTransactionCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/initiatetransation/initiateTransactionCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.fileupload', {
				url : "/fileupload",
				templateUrl : "modules/fileupload/fileupload.html?a=" + n,
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "fileuploadCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/fileupload/fileuploadCtrl.js'
								]
							});
						}
					]
				}
			})

			.state('app.myprofile', {
				url : "/myprofile",
				templateUrl : "modules/myprofile/myprofile.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "myprofileCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [

									'lib/bootstrap-toggle-master/css/bootstrap-toggle.min.css',
									//'lib/select2/select2.css',
									//'lib/select2/select2.min.js',
									'lib/bootstrap-toggle-master/js/bootstrap-toggle.min.js',
									'modules/myprofile/myprofileCtrl.js'

								]
							});
						}
					]
				}
			})
			.state('app.notifications', {
				url : "/AlertsandNotification",
				templateUrl : "modules/alertsnotification/AlertandNotific.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "AlertandNotifiCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [

									'modules/alertsnotification/alertnotification.css',
									'modules/alertsnotification/AlertandNotifiCtrl.js'
								]
							});
						}
					]
				}
			})
			// User Management
			.state('app.users', {
				url : "/usermanagement",
				templateUrl : "modules/usermanagement/usermanagement.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "userMgmtController",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',

								files : [
									'modules/usermanagement/userManagementCtrl.js'
								]
							});
						}
					]
				}
			})
			//Add user
			.state('app.adduser', {
				url : "/adduser",
				templateUrl : "modules/adduser/adduser.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "adduserCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [
									'modules/adduser/adduserCtrl.js'
								]
							});
						}
					]
				}
			})
			//Roles and Responsibilities
			.state('app.roles', {
				url : "/roles",
				templateUrl : "modules/rolesandpermission/roles.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "rolesCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',

								files : [
									'modules/rolesandpermission/rolesCtrl.js'
								]

							});
						}
					]
				}
			})

			//Bank Data
			.state('app.bankData', {
				url : "/",
				templateUrl : "modules/bankdata/bankData.html",
				data : {
					pageTitle : ''
				},
				params : {
					input : null
				},
				controller : "bankDataCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/bankdata/bankDataCtrl.js'
								]
							});
						}
					]
				}
			})

			.state('app.operation', {
				url : "/",

				templateUrl : "modules/bankdata/bankdatafunctions/bankDataFunctions.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "bankDataFunctions",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									// 'lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css',
									//'lib/select2/select2.css',
									//'lib/select2/select2.min.js',
									// 'lib/bootstrap-datetimepicker/js/moment.min.js',
									//'lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
									'modules/bankdata/bankdatafunctions/bankDataFunctions.js'
								]
							});
						}
					]
				}
			})

			// AngularJS plugins
			.state('app.view', {
				url : "/",
				templateUrl : "modules/bankdata/bankdatafunctions/viewBankData.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "viewBankData",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/bankdata/bankdatafunctions/viewBankData.js'
								]
							});
						}
					]
				}
			})
			//Addons
			.state('app.webformPlugin', {
				url : "/addons",
				templateUrl : "modules/webformaddons/webformPlugin.html",
				data : {
					pageTitle : ''
				},
				params : {
					input : null
				},
				controller : "bankDataAddonCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',

								files : [

									'modules/webformaddons/bankDataAddonCtrl.js'
								]
							});
						}
					]
				}
			})
			//Addon Operation
			.state('app.addonoperation', {
				url : "/addons",

				templateUrl : "modules/webformaddons/bankdatafunctions/bankDataFunctions.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "webbankDataFunctions",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									// 'lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.css',
									// 'lib/bootstrap-datetimepicker/js/moment.min.js',
									//'lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.js',
									'modules/webformaddons/bankdatafunctions/bankDataFunctions.js'
								]
							});
						}
					]
				}
			})

			//Addon view
			.state('app.addonview', {
				url : "/addons",
				templateUrl : "modules/webformaddons/bankdatafunctions/viewBankData.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "webviewBankData",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/webformaddons/bankdatafunctions/viewBankData.js'
								]
							});
						}
					]
				}
			})
			//Business Rules
			.state('app.businessrules', {
				url : "/businessrules",
				templateUrl : "modules/businessrules/businessRules.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "brdBusinessRulesCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [

									//'lib/jquery-ui/jquery-ui.css',
									//'lib/jquery-ui/jquery-ui.min.js',

									//'lib/bootstrap-daterangepicker/daterangepicker-bs3.css',
									//'lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
									//'lib/bootstrap-datepicker/css/clockface.css',
									//'lib/ui-select/select.min.js',
									//'lib/bootstrap-daterangepicker/moment.min.js',
									//'lib/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
									//'lib/bootstrap-datepicker/js/clockface.js',
									//'lib/bootstrap-daterangepicker/daterangepicker.js',
									//'lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',

									'modules/businessrules/brdBusinessRulesCtrl.js'
								]
							});
						}
					]
				}
			})

			.state('app.businessrulesdetails', {
				url : "/businessrulesdetails",
				templateUrl : "modules/businessrules/businessruleDetails.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "businessRuleDetailsCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [

									/*'lib/bootstrap-datepicker/css/bootstrap-datepicker3.min.css',
									'lib/bootstrap-daterangepicker/daterangepicker-bs3.css',
									'lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
									'lib/bootstrap-datepicker/css/clockface.css',*/
									//'lib/ui-select/select.min.js',
									//'lib/bootstrap-daterangepicker/moment.min.js',
									/*'lib/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
									'lib/bootstrap-daterangepicker/daterangepicker.js',
									'lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',
									'lib/bootstrap-datepicker/js/clockface.js',*/

									'modules/businessrules/businessRuleDetailsCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.businessrules2', {
				url : "/businessrules2",
				templateUrl : "modules/businessrules/businessRule2.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [

									//'lib/jquery-ui/jquery-ui.css',
									//'lib/jquery-ui/jquery-ui.min.js',

									/*'lib/bootstrap-daterangepicker/daterangepicker-bs3.css',
									'lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
									'lib/bootstrap-datepicker/css/clockface.css',*/
									//'lib/ui-select/select.min.js',
									//'lib/bootstrap-daterangepicker/moment.min.js',
									/*'lib/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
									'lib/bootstrap-datepicker/js/clockface.js',
									'lib/bootstrap-daterangepicker/daterangepicker.js',
									'lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',*/

									'modules/businessrules/brdBusinessRulesCtrl2.js'
								]
							});
						}
					]
				}
			})
			.state('app.businessrules3', {
				url : "/businessrules3",
				templateUrl : "modules/businessrules/businessRule3.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',

								files : [
									/*'lib/jquery-ui/jquery-ui.css',
									'lib/jquery-ui/jquery-ui.min.js',

									'lib/bootstrap-daterangepicker/daterangepicker-bs3.css',
									'lib/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min.css',
									'lib/bootstrap-datepicker/css/clockface.css',*/
									//'lib/ui-select/select.min.js',
									// 'lib/bootstrap-daterangepicker/moment.min.js',
									/*'lib/bootstrap-datepicker/js/bootstrap-datepicker.min.js',
									'lib/bootstrap-datepicker/js/clockface.js',
									'lib/bootstrap-daterangepicker/daterangepicker.js',
									'lib/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min.js',*/
									'modules/businessrules/brdBusinessRulesCtrl3.js'
								]
							});
						}
					]
				}
			})

			//Application configuration
			.state('app.configurations', {
				url : "/AppConfig",
				templateUrl : "modules/appconfig/AppConfig.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "AppConfigCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before', // load the above css files before a LINK element with this ID. Dynamic CSS files must be loaded between core and theme css files
								files : [

									'modules/appconfig/AppConfigCtrl.js'
								]
							});
						}
					]
				}
			})

			//Volpayidconfig
			.state('app.idconfigurations', {
				url : "/volpayidconfig",
				templateUrl : "modules/volpayidconfig/volpayIdConfig.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "volpayidConfigCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [

									'modules/volpayidconfig/volpayidConfigCtrl.js'
								]
							});
						}
					]
				}
			})

			//Volpayidconfig Details
			.state('app.volpayidconfigdetail', {
				url : "/volpayidconfigdetail",
				templateUrl : "modules/volpayidconfig/viewvolpayidconfig/viewVolpayIdConfig.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "volpayidConfigDetailCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [

									'modules/volpayidconfig/viewvolpayidconfig/volpayidConfigDetailCtrl.js'
								]
							});
						}
					]
				}
			})
			//Bank Data approvals
			.state('app.approvals', {
				url : "/approval",
				templateUrl : "modules/approvals/approval.html?a=" + n,
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "approvalCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',

								files : [

									'lib/xmltojson/xml2json.js',
									'modules/approvals/approvalCtrl.js'
								]
							});
						}
					]
				}
			})

			.state('app.viewApprovalData', {
				url : "/approval",
				templateUrl : "modules/approvals/viewapproval/viewApprovalData.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				params : {
					input : null
				},
				controller : "viewApprovalDataCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [
									'modules/approvals/viewapproval/viewApprovalDataCtrl.js'
								]
							});
						}
					]
				}
			})

			//Add Roles
			.state('app.addroles', {
				url : "/addroles",
				templateUrl : "modules/addrole/addroles.html",
				data : {
					pageTitle : 'Admin Dashboard Template'
				},
				controller : "addrolesCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [
									'modules/addrole/addrolesCtrl.js'
								]
							});
						}
					]
				}
			})

			//Forgot Password
			.state('app.forgotpassword', {
				url : "/forgotpassword",
				templateUrl : "modules/forgotpassword/forgotpassword.html",
				data : {
					pageTitle : 'forgotpasswordCtrl'
				},
				controller : "forgotpasswordCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [
									'modules/forgotpassword/forgotpasswordCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.mpitemplate', {
				url : "/mpitemplate",
				templateUrl : "modules/mpitemplate/mpitemplate.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "mpitemplateCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/mpitemplate/mpitemplateCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.mpidetail', {
				url : "/mpidetail",
				templateUrl : "modules/mpitemplate/mpidetail/mpidetail.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "mpidetailsCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/mpitemplate/mpidetail/mpidetailsCtrl.js'
								]
							});
						}
					]
				}
			})

			.state('app.fxratecharts', {
				url : "/fxrate",
				templateUrl : "modules/fxrates/FXRate.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "brdFXRateChartCtrl",
				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/fxrates/brdFXRateChartCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.fxratedetail', {
				url : "/fxratedetail",
				templateUrl : "modules/fxrates/fxratedetail/FXRateDetail.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				params : {
					input : null
				},
				controller : "FXRateDetailCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								files : [
									'modules/fxrates/fxratedetail/FXRateDetailCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.reportsdetail', {
				url : "/reportsdetail",
				templateUrl : "modules/reports/reportsdetail/reportsDetail.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "reportsDetailCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files : [
									'modules/reports/reportsdetail/reportsDetailCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.reportparams', {
				url : "/reportparams",
				templateUrl : "modules/reports/reportsparams/reportParams.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "reportParamsCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files : [
									'modules/reports/reportsparams/reportParamsCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.reportparamsdetail', {
				url : "/reportparamsdetail",
				templateUrl : "modules/reports/reportparamsdetail/reportParamsDetail.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "reportParamsDetailCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files : [
									'modules/reports/reportparamsdetail/reportParamsDetailCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.reporttemplate', {
				url : "/reporttemplate",
				templateUrl : "modules/reports/reporttemplate/reportTemplate.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "reportTemplateCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files : [
									'modules/reports/reporttemplate/reportTemplateCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.reporttemplatedetail', {
				url : "/reporttemplatedetail",
				templateUrl : "modules/reports/reporttemplatedetails/reportTemplateDetail.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "reportTemplateDetailCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files : [
									'modules/reports/reporttemplatedetails/reportTemplateDetailCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.reportlog', {
				url : "/reportlog",
				templateUrl : "modules/reports/reportlog/reportlog.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "reportLogCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before', // load the above css files before '#ng_load_plugins_before'
								files : [
									'modules/reports/reportlog/reportLogCtrl.js'
								]
							});
						}
					]
				}
			})

			.state('app.reportgenerate', {
				url : "/reportgenerate",
				templateUrl : "modules/reports/reportgenerate/reportgenerate.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "reportGenerateCtrl",

				resolve : {
					deps : ['$ocLazyLoad', function ($ocLazyLoad) {
							return $ocLazyLoad.load({
								name : 'VolpayApp',
								insertBefore : '#ng_load_plugins_before',
								files : [
									
									'lib/xmltojson/xml2json.js',
									'modules/reports/reportgenerate/reportGenerateCtrl.js'
								]
							});
						}
					]
				}
			})
			.state('app.externalLink', {
				url : "/external",
				templateUrl : "modules/external/external.html",
				data : {
					pageTitle : 'AngularJS File Upload'
				},
				controller : "externalCtrl",
				params : {
					url : null,
				},
				resolve : {
					"check" : function ($location, $stateParams) {

						console.log($stateParams)
						if ($stateParams.url == null) {
							$location.path('app/dashboard')
						}
					},
					otherFeature : function ($ocLazyLoad, $stateParams) {
						return $ocLazyLoad.load({
							name : "VolpayApp",
							files : ["modules/external/externalCtrl.js"]
						})

					}
				}
			})

			.state('app.newmodules', {
				url : '/:url',
				templateUrl : function (aa) {
					if (aa.tempUrl != null) {
						return aa.tempUrl + '/' + aa.url + '.html'
					}
				},
				data : {
					pageTitle : 'Dynamic Modules'
				},
				controllerProvider : function ($stateParams) {
					return $stateParams.contrl
				},
				params : {
					url : null,
					tempUrl : null,
					contrl : null,
				},
				resolve : {
					"check" : function ($location, $stateParams) {
						if ($stateParams.tempUrl == null) {

							$location.path('app/dashboard')
						}
					},
					otherFeature : function ($ocLazyLoad, $stateParams) {

						if ($stateParams.tempUrl != null) {
							return $ocLazyLoad.load({
								name : "VolpayApp",
								files : [$stateParams.tempUrl + '/' + $stateParams.contrl + '.js']
							})
						}

					}
				}
			})

		}
	]);