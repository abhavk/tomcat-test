VolpayApp.controller('allPaymentsCtrl', function ($scope, $http, $location, $translate, $rootScope, RefService, GlobalService, AllPaymentsGlobalData, PersonService, $state, $filter, $stateParams, bankData, LogoutService, $timeout) {

	sidebarMenuControl('PaymentModule', 'AllPayments');

	$scope.sortMenu = [{
			"label" : "Payment ID",
			"FieldName" : "PaymentID",
			"Icon" : "fa fa-building",
			"listViewflag" : false,
			"visible" : true
		}, {
			"label" : "Original Payment Reference",
			"FieldName" : "OriginalPaymentReference",
			"Icon" : "fa fa-envelope",
			"listViewflag" : true,
			"visible" : true
		}, {
			"label" : "Instruction ID",
			"FieldName" : "InstructionID",
			"Icon" : "fa fa-slack",
			"listViewflag" : false,
			"visible" : true
		}, {
			"label" : "PSA Code",
			"FieldName" : "PartyServiceAssociationCode",
			"Icon" : "fa fa-code-fork",
			"listViewflag" : true,
			"visible" : true
		}, {
			"label" : "MOP",
			"FieldName" : "MethodOfPayment",
			"Icon" : "fa fa-cogs",
			"listViewflag" : true,
			"visible" : true
		}, {
			"label" : "Currency",
			"FieldName" : "Currency",
			"Icon" : "fa fa-building",
			"listViewflag" : true,
			"visible" : true
		}, {
			"label" : "Amount",
			"FieldName" : "Amount",
			"Icon" : "fa fa-money",
			"listViewflag" : false,
			"visible" : true
		}, {
			"label" : "Received Date",
			"FieldName" : "ReceivedDate",
			"Icon" : "fa fa-calendar",
			"listViewflag" : true,
			"visible" : true
		}, {
			"label" : "Value Date",
			"FieldName" : "ValueDate",
			"Icon" : "fa fa-calendar-o",
			"listViewflag" : true,
			"visible" : true
		}, {
			"label" : "Status",
			"FieldName" : "Status",
			"Icon" : "fa fa-check-circle",
			"listViewflag" : false,
			"visible" : false
		}
	]

	clearInterval(menuInterval)

	$('li.dropdown.mega-dropdown a').on('click', function (event) {
		$(this).parent().toggleClass("open");

	});

	$('body').on('click', function (e) {
		// console.log($('li.dropdown.mega-dropdown').has(e.target).length)
		if (!$('li.dropdown.mega-dropdown').is(e.target) && $('li.dropdown.mega-dropdown').has(e.target).length === 0 && $('.open').has(e.target).length === 0) {

			$('li.dropdown.mega-dropdown').removeClass('open');
		}
	});

	$scope.limit = 500;
	$scope.setInitval = function () {

		var query = {
			start : 0,
			count : $scope.limit
		}

		$http({
			method : "GET",
			url : BASEURL + RESTCALL.PartyCodeDropdown,
			params : query
		}).success(function (val) {

			$scope.psaCodeDrop = val;

			$scope.dynamicArr = ["PartyServiceAssociationCode"]
			for (var i in $scope.dynamicArr) {
				$("select[name=" + $scope.dynamicArr[i] + "]").select2()
			}

		}).error(function (data) {})
	}

	$scope.changeViewFlag = GlobalService.viewFlag;
	$scope.dataLength = 10;

	/*var interval = "";
	clearInterval(interval)
	interval = setInterval(function(){
	if(!$('#PaymentModule').hasClass('open')){sidebarMenuControl('PaymentModule','AllPayments')
	}
	else{
	if(!$('#AllPayments').hasClass('sideMenuSelected')){
	sidebarMenuControl('PaymentModule','AllPayments')

	}
	else{

	clearInterval(interval)
	}
	}
	},100)*/

	sessionStorage.menuSelection = JSON.stringify({
			'val' : 'PaymentModule',
			'subVal' : 'AllPayments'
		})
		checkMenuOpen()

		$scope.fromDashboard = AllPaymentsGlobalData.fromDashboard;
	if ($state.params.input && 'responseMessage' in $state.params.input && $state.params.input.responseMessage) {
		$scope.alerts = $state.params.input.responseMessage;

		$timeout(function () {
			$('.alert-success').hide()

		}, 4000)
	}

	$scope.isSortingClicked = AllPaymentsGlobalData.isSortingClicked;
	$scope.prevLen = -1;
	$scope.loadCnt = 0;
	delete sessionStorage.AllPaymentsCurrentRESTCALL;

	$scope.search = {
		"InstructionData" : {
			"ReceivedDate" : {
				"Start" : "",
				"End" : ""
			},
			"ValueDate" : {
				"Start" : "",
				"End" : ""
			},
			"Amount" : {
				"Start" : "",
				"End" : ""
			}
		}

	};
	$scope.AdsearchParams = angular.copy($scope.search)

		if (GlobalService.ApproveInitiated) {

			if (GlobalService.PaymentApproved) {

				$scope.alerts = [{
						type : 'success',
						msg : "Payment Id " + GlobalService.repairURI + ", Approved successfully."
					}
				];
			} else {

				$scope.alerts = [{
						type : 'danger',
						msg : "Payment Id " + GlobalService.repairURI + ", not Approved. It will remains in repair status"
					}
				];
			}

			GlobalService.ApproveInitiated = false;
		}

		$scope.lskey = ["New Search"];
	$scope.uData = '';
	$scope.testing = function () {
		$scope.lskey = ["New Search"];

		$scope.uDetails = {
			"Queryfield" : [{
					"ColumnName" : "UserID",
					"ColumnOperation" : "=",
					"ColumnValue" : sessionStorage.UserID
				}
			],
			"Operator" : "AND"
		}
		$scope.uDetails = constructQuery($scope.uDetails);

		$http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.uDetails).success(function (data) {

			$scope.userFullObj = data[0];
			$scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))

				for (var i in $scope.uData.savedSearch.AllPayments) {
					$scope.lskey.push($scope.uData.savedSearch.AllPayments[i].name)
				}
		}).error(function (error) {

			$translate.use("en_US");
		})
		/* var kk=1;
		for (var key in localStorage){

		if(key.indexOf('AS_'+sessionStorage.UserID+"_") >= 0){
		$scope.lskey[kk]=key.substr(3+sessionStorage.UserID.length+1);
		kk++;
		}
		}
		return $scope.lskey; */
	}
	$scope.testing();

	$scope.all = AllPaymentsGlobalData.all;
	$scope.today = AllPaymentsGlobalData.today;
	$scope.week = AllPaymentsGlobalData.week;
	$scope.month = AllPaymentsGlobalData.month;
	$scope.custom = AllPaymentsGlobalData.custom;

	$scope.UIR = false;
	$scope.customDateFilled = false;
	$scope.alertMsg = false;
	$scope.nothingSelected = true;
	$scope.dropdownSelected = false;

	$scope.noPaymentSelected = true;
	$scope.sourceChannelArr = [];
	$scope.mopArr = [];
	$scope.PaymentStatusArr = [];
	$scope.CurrencyArr = [];

	$scope.items = [];
	$scope.isAdvacedSearchClicked = false;

	$scope.searchClicked = AllPaymentsGlobalData.searchClicked;
	$scope.isEntered = AllPaymentsGlobalData.isEntered;

	$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;

	//$scope.finalREST = AllPaymentsGlobalData.finalREST;
	$scope.paylistsearch = AllPaymentsGlobalData.FLuir;
	$scope.startDate = AllPaymentsGlobalData.startDate;
	$scope.endDate = AllPaymentsGlobalData.endDate;

	/* if(localStorage.languageSelected == 'es_ES'){
	if(AllPaymentsGlobalData.selectCriteriaTxt == 'All'){AllPaymentsGlobalData.selectCriteriaTxt = 'Todas';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Today'){AllPaymentsGlobalData.selectCriteriaTxt = 'Hoy';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Week'){AllPaymentsGlobalData.selectCriteriaTxt = 'Semana';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Month'){AllPaymentsGlobalData.selectCriteriaTxt = 'Mes';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Custom'){AllPaymentsGlobalData.selectCriteriaTxt = 'Personalizado';}
	}
	else if(localStorage.languageSelected == 'en_US'){
	if(AllPaymentsGlobalData.selectCriteriaTxt == 'Todas'){AllPaymentsGlobalData.selectCriteriaTxt = 'All';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Hoy'){AllPaymentsGlobalData.selectCriteriaTxt = 'Today';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Semana'){AllPaymentsGlobalData.selectCriteriaTxt = 'Week';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Mes'){AllPaymentsGlobalData.selectCriteriaTxt = 'Month';}
	else if(AllPaymentsGlobalData.selectCriteriaTxt == 'Personalizado'){AllPaymentsGlobalData.selectCriteriaTxt = 'Custom';}
	} */

	$scope.$watch("searchname", function (val) {
		$scope.searchNameDuplicated = false;
	})

	$('#paymentDropdownBtnTxt').html(AllPaymentsGlobalData.selectCriteriaTxt)
	$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
	$('#menulist_' + AllPaymentsGlobalData.selectCriteriaID).addClass('listSelected').removeClass('listNotSelected');

	$scope.orderByField = AllPaymentsGlobalData.orderByField; // set the default sort type
	$scope.sortReverse = AllPaymentsGlobalData.sortReverse;
	$scope.sortType = AllPaymentsGlobalData.sortType;

	$scope.alertToggle = function () {
		if ($scope.items.length == 0) {
			$scope.alertMsg = true;
		} else {
			$scope.alertMsg = false;
		}
	}

	$scope.loadmoreEnableDisable = function (len) {
		if (len >= 20) {
			$scope.function123 = "loadMore()";
		} else {
			$scope.function123 = "";
		}
	}

	$scope.showErrorMessage = function (items) {

		$scope.alerts = [{
				type : 'danger',
				msg : items.data.error.message
			}
		];
		$scope.items = [];
		$scope.alertMsg = true;
	}

	$scope.defaultCallValues = function (items) {
		$scope.items = items;
		$scope.loadedData = items;
		AllPaymentsGlobalData.allPaymentDetails = items;
		$scope.alertMsg = false;
		$('.alert-danger').hide()
	}

	$scope.txtValfn = function () {
		var txtVal = ''
			if ($scope.paylistsearch) {
				txtVal = $scope.paylistsearch
					$scope.UIR = true;
			} else {
				txtVal = ''
					$scope.UIR = false;
			}
			return txtVal;
	}

	$scope.aa = AllPaymentsGlobalData.DataLoadedCount;

	$scope.settingSelectValues = function () {

		for (i in AllPaymentsGlobalData.searchParams) {
			if (AllPaymentsGlobalData.searchParams[i] == 'InstructionData') {

				for (j in AllPaymentsGlobalData.searchParams[i]) {
					$scope.AdsearchParams[i][j] = AllPaymentsGlobalData.searchParams[i][j];
					$scope.search[i][j] = AllPaymentsGlobalData.searchParams[i][j];
				}
			} else {
				$scope.AdsearchParams[i] = AllPaymentsGlobalData.searchParams[i];
				$scope.search[i] = AllPaymentsGlobalData.searchParams[i];

				if (Array.isArray($scope.search[i])) {
					//$("[name="+i+"]").select2().select2('val',$scope.search[i])
					console.log("abc", i, $scope.search[i])

					$("select[name='" + i + "']").select2({
						data : $scope.search[i]
					});

				}

			}

		}
	}

	$scope.triggerSelect2 = function () {
		for (var i in $scope.FieldsValues) {
			if ($scope.FieldsValues[i].type == 'dropdown') {
				$('[name=' + $scope.FieldsValues[i].value + ']').select2();
				$scope.remoteDataConfig()

				//console.log($scope.FieldsValues[i])
				//$("select[name='PartyServiceAssociationCode']")('val', ff.searchParams.PartyServiceAssociationCode);
			}
		}

		$scope.settingSelectValues()

	}

	//function initialCall(adSearch)
	$scope.initialCall = function (adSearch) {

		if (!adSearch) {
			//console.log("normal")

			if ($scope.all) {
				$scope.nothingSelected = true;
				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "all").then(function (items) {

					if (items.response == 'Error') {
						/* if(items.data.error.code == 400){
						$scope.alerts = [{
						type : 'danger',
						msg :items.data.error.message
						}];
						$scope.alertMsg = true;
						}*/

						if (items.data.error.code == 401) {
							if (configData.Authorization == 'External') {
								window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
							} else {
								LogoutService.Logout();
							}
						} else {
							$scope.alerts = [{
									type : 'danger',
									msg : items.data.error.message
								}
							];
							$scope.alertMsg = true;

						}

					} else {

						$scope.items = items.data;

						$scope.loadedData = items.data;
						$scope.alertMsg = false;
						AllPaymentsGlobalData.allPaymentDetails = items.data;

						$scope.wildcard = false;

						getForceAction($scope.items[0])

					}

				});

			} else if ($scope.today) {

				$scope.nothingSelected = false;
				AllPaymentsGlobalData.todayDate = todayDate();
				$scope.todayDate = AllPaymentsGlobalData.todayDate;

				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Today').then(function (items) {

					if (items.response == "Error") {

						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						// console.log(items)
						getForceAction(items.data[0])

						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;

					}
				});

			} else if ($scope.week) {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.weekStart = week().lastDate;
				AllPaymentsGlobalData.weekEnd = week().todayDate;
				$scope.weekStart = AllPaymentsGlobalData.weekStart;
				$scope.weekEnd = AllPaymentsGlobalData.weekEnd;

				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Week').then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
						getForceAction(items.data[0])
					}

				});

			} else if ($scope.month) {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.monthStart = month().lastDate;
				AllPaymentsGlobalData.monthEnd = month().todayDate;

				$scope.monthStart = AllPaymentsGlobalData.monthStart;
				$scope.monthEnd = AllPaymentsGlobalData.monthEnd;

				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Month').then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
						getForceAction(items.data[0])
					}

				});

			} else if ($scope.custom) {
				$scope.startDate = AllPaymentsGlobalData.startDate;
				$scope.endDate = AllPaymentsGlobalData.endDate;

				$scope.ShowStartDate = AllPaymentsGlobalData.startDate;
				$scope.ShowEndDate = AllPaymentsGlobalData.endDate;

				$scope.nothingSelected = false;
				RefService.getFeedNewAllCustomSorting($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa).then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
						getForceAction(items.data[0])
					}

				});
			}
		} else {

			$scope.search = {
				"InstructionData" : {
					"ReceivedDate" : {
						"Start" : "",
						"End" : ""
					},
					"ValueDate" : {
						"Start" : "",
						"End" : ""
					},
					"Amount" : {
						"Start" : "",
						"End" : ""
					}
				}
			};
			$scope.AdsearchParams = angular.copy($scope.search)

				//console.log($scope.AdsearchParams)
				//console.log("searchParams", AllPaymentsGlobalData.searchParams)

				for (i in AllPaymentsGlobalData.searchParams) {
					if (AllPaymentsGlobalData.searchParams[i] == 'InstructionData') {
						for (j in AllPaymentsGlobalData.searchParams[i]) {
							$scope.AdsearchParams[i][j] = AllPaymentsGlobalData.searchParams[i][j];
							$scope.search[i][j] = AllPaymentsGlobalData.searchParams[i][j];
						}
					} else {
						$scope.AdsearchParams[i] = AllPaymentsGlobalData.searchParams[i];
						$scope.search[i] = AllPaymentsGlobalData.searchParams[i];
					}

				}

				if (AllPaymentsGlobalData.fromMyProfilePage) {
					var FieldArr = AllPaymentsGlobalData.FieldArr;
				} else if (AllPaymentsGlobalData.fromDashboard) {
					var FieldArr = AllPaymentsGlobalData.FromDashboardFieldArr;
				} else {
					AllPaymentsGlobalData.fromMyProfilePage = false;
					var FieldArr = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
				}

				$scope.AdsearchParams = removeEmptyValueKeys($scope.AdsearchParams)

				$scope.triggerSelect2()
				$scope.setInitval()

				//	$scope.settingSelectValues()

				if ($scope.all) {

					$scope.nothingSelected = true;

					RefService.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "All").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
							getForceAction(items.data[0])
						}
					});
				} else if ($scope.today) {
					AllPaymentsGlobalData.todayDate = todayDate();
					$scope.todayDate = AllPaymentsGlobalData.todayDate;
					$scope.nothingSelected = false;

					RefService.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "Today").then(function (items) {
						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
							getForceAction(items.data[0])
						}
					});

				} else if ($scope.week) {
					AllPaymentsGlobalData.weekStart = week().lastDate;
					AllPaymentsGlobalData.weekEnd = week().todayDate;
					$scope.weekStart = AllPaymentsGlobalData.weekStart;
					$scope.weekEnd = AllPaymentsGlobalData.weekEnd;
					$scope.nothingSelected = false;

					RefService.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "Week").then(function (items) {
						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
							getForceAction(items.data[0])
						}
					});

				} else if ($scope.month) {
					AllPaymentsGlobalData.monthStart = month().lastDate;
					AllPaymentsGlobalData.monthEnd = month().todayDate;
					$scope.monthStart = AllPaymentsGlobalData.monthStart;
					$scope.monthEnd = AllPaymentsGlobalData.monthEnd;
					$scope.nothingSelected = false;

					RefService.retainSearchResults(FieldArr, $scope.orderByField, $scope.sortType, $scope.aa, "Month").then(function (items) {
						$scope.items = items;
						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
							getForceAction(items.data[0])
						}
					});
				} else if ($scope.custom) {
					$scope.nothingSelected = false;
					$scope.startDate = AllPaymentsGlobalData.startDate;
					$scope.endDate = AllPaymentsGlobalData.endDate;

					$scope.ShowStartDate = AllPaymentsGlobalData.startDate;
					$scope.ShowEndDate = AllPaymentsGlobalData.endDate;

					RefService.retainCustomSearchResults($scope.startDate, $scope.endDate, FieldArr, $scope.orderByField, $scope.sortType, $scope.aa).then(function (items) {
						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
							getForceAction(items.data[0])
						}
					})
				}
		}

	}
	$scope.initialCall($scope.advancedSearchEnable)

	if ($scope.paylistsearch != '') {
		$scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
		$scope.nothingSelected = false;
	} else {
		//$scope.nothingSelected = true;
		$scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
	}

	/** Sorting function **/
	var hh = 20;
	$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;

	$scope.Sorting = function (orderByField) {
		// console.log("sorting"+"---"+$scope.advancedSearchEnable)

		$scope.aa = $scope.DataLoadedCount;
		$scope.prevLen = -1;
		AllPaymentsGlobalData.isSortingClicked = true;
		$scope.isSortingClicked = AllPaymentsGlobalData.isSortingClicked;

		AllPaymentsGlobalData.orderByField = orderByField;
		$scope.orderByField = AllPaymentsGlobalData.orderByField;
		AllPaymentsGlobalData.sortReverse = !AllPaymentsGlobalData.sortReverse;
		$scope.sortReverse = AllPaymentsGlobalData.sortReverse;

		if ($scope.sortReverse == false) {
			AllPaymentsGlobalData.sortType = 'Desc';
			$scope.sortType = AllPaymentsGlobalData.sortType;
		} else {
			AllPaymentsGlobalData.sortType = 'Asc';
			$scope.sortType = AllPaymentsGlobalData.sortType;
		}

		if (!$scope.advancedSearchEnable) {
			if ($scope.all) {
				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'all').then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				});

			} else if ($scope.today) {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.todayDate = todayDate();
				$scope.todayDate = AllPaymentsGlobalData.todayDate;
				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Today').then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}

				});
			} else if ($scope.week) {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.weekStart = week().lastDate;
				AllPaymentsGlobalData.weekEnd = week().todayDate;
				$scope.weekStart = AllPaymentsGlobalData.weekStart;
				$scope.weekEnd = AllPaymentsGlobalData.weekEnd;
				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Week').then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});

			} else if ($scope.month) {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.monthStart = month().lastDate;
				AllPaymentsGlobalData.monthEnd = month().todayDate;

				$scope.monthStart = AllPaymentsGlobalData.monthStart;
				$scope.monthEnd = AllPaymentsGlobalData.monthEnd;
				RefService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Month').then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});
			} else if ($scope.custom) {
				$scope.startDate = AllPaymentsGlobalData.startDate;
				$scope.endDate = AllPaymentsGlobalData.endDate;
				$scope.nothingSelected = false;

				RefService.getFeedNewAllCustomSorting($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa).then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}

				});
			}
		} else {
			var FieldArr = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
			//console.log(FieldArr)

			if ($scope.all) {
				$scope.nothingSelected = true;
				RefService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr).then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if ($scope.today) {
				AllPaymentsGlobalData.todayDate = todayDate();
				$scope.todayDate = AllPaymentsGlobalData.todayDate;
				$scope.nothingSelected = false;
				RefService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr).then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if ($scope.week) {
				AllPaymentsGlobalData.weekStart = week().lastDate;
				AllPaymentsGlobalData.weekEnd = week().todayDate;
				$scope.weekStart = AllPaymentsGlobalData.weekStart;
				$scope.weekEnd = AllPaymentsGlobalData.weekEnd;
				$scope.nothingSelected = false;
				RefService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr).then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if ($scope.month) {
				AllPaymentsGlobalData.monthStart = month().lastDate;
				AllPaymentsGlobalData.monthEnd = month().todayDate;
				$scope.monthStart = AllPaymentsGlobalData.monthStart;
				$scope.monthEnd = AllPaymentsGlobalData.monthEnd;
				$scope.nothingSelected = false;
				RefService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr).then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if ($scope.custom) {
				$scope.nothingSelected = false;
				$scope.startDate = AllPaymentsGlobalData.startDate;
				$scope.endDate = AllPaymentsGlobalData.endDate;
				RefService.advancedSearchCustomSorting($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr).then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			}

		}
	}

	$scope.loadMore = function () {

		if (!$scope.advancedSearchEnable) {

			if (!$scope.isSortingClicked) {

				if ($scope.all) {
					RefService.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "All").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
						}
					});
					$scope.aa = $scope.aa + 20;
				} else if ($scope.today) {

					RefService.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Today").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
						}
					});
					$scope.aa = $scope.aa + 20;
				} else if ($scope.week) {

					RefService.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Week").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
						}
					});
					$scope.aa = $scope.aa + 20;
				} else if ($scope.month) {

					RefService.filterDataLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Month").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
						}
					});
					$scope.aa = $scope.aa + 20;
				} else if ($scope.custom) {
					RefService.customSearchLoadmore($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa).then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
						}
					});
					$scope.aa = $scope.aa + 20;
				}
			} else {
				if ($scope.aa == 20) {
					$scope.aa = $scope.aa + 20;
				}

				if ($scope.all) {
					RefService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "All").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.prevLen = items.data.length;
						}
					});

					AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.today) {
					RefService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Today").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.prevLen = items.data.length;
						}

					});
					AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.week) {
					RefService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Week").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.prevLen = items.data.length;
						}
					});
					AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.month) {
					RefService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Month").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.prevLen = items.data.length;
						}
					});
					AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.custom) {
					RefService.sortingCustomSearchLoadmore($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa).then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.prevLen = items.data.length;
						}
					});
					AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				}

			}
		} else {
			/**Advanced Search  Loadmore **/
			/** If sorting not clicked **/
			var FieldArr = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr)

				if (!$scope.isSortingClicked) {
					if ($scope.all) {
						RefService.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
							}
						});
						$scope.aa = $scope.aa + 20;
					} else if ($scope.today) {
						RefService.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
							}
						});
						$scope.aa = $scope.aa + 20;

					} else if ($scope.week) {
						RefService.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
							}
						});
						$scope.aa = $scope.aa + 20;
					} else if ($scope.month) {
						RefService.advancedSearchLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
							}
						});
						$scope.aa = $scope.aa + 20;
					} else if ($scope.custom) {
						RefService.advancedSearchCustomLoadmore($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								AllPaymentsGlobalData.allPaymentDetails = AllPaymentsGlobalData.allPaymentDetails.concat(items.data);
							}
						});
						$scope.aa = $scope.aa + 20;
					}
				} else {
					/** If Sorting Clicked **/
					if ($scope.aa == 20) {
						$scope.aa = $scope.aa + 20;
					}

					if ($scope.all) {
						RefService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = items.data;
								AllPaymentsGlobalData.allPaymentDetails = items.data;
								$scope.prevLen = items.data.length;
							}
						});

						AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					} else if ($scope.today) {
						RefService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = items.data;
								AllPaymentsGlobalData.allPaymentDetails = items.data;
								$scope.prevLen = items.data.length;
							}
						});
						AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
						$scope.aa = $scope.aa + 20;

					} else if ($scope.week) {
						RefService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = items.data;
								AllPaymentsGlobalData.allPaymentDetails = items.data;
								$scope.prevLen = items.data.length;
							}
						});
						AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					} else if ($scope.month) {
						RefService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = items.data;
								AllPaymentsGlobalData.allPaymentDetails = items.data;
								$scope.prevLen = items.data.length;
							}
						});
						AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					} else if ($scope.custom) {

						RefService.advancedCustomSortingLoadmore($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = items.data;
								AllPaymentsGlobalData.allPaymentDetails = items.data;
								$scope.prevLen = items.data.length;
							}
						});
						AllPaymentsGlobalData.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					}
				}

		}
	}

	/**To control Load more data **/
	var debounceHandler = _.debounce($scope.loadMore, 700, true);
	jQuery(
		function ($) {
		$('.listView').bind('scroll', function () {
			$scope.widthOnScroll();
			if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
				if ($scope.loadedData.length >= 20) {
					//$scope.loadMore();
					debounceHandler()
					$scope.loadCnt = 0;
				}
			}
		})
		setTimeout(function () {}, 1000)
	});

	/*$(window).scroll(function () {
	if ($location.path() == '/app/allpayments') {
	if ($(window).scrollTop() + $(window).height() >= ($(document).height() - 2)) {
	//$scope.loadCnt++;
	console.log($scope.loadedData.length)

	if (($scope.loadedData.length >= 20)) {

	$scope.loadMore();
	$scope.loadCnt = 0;
	}
	}
	}
	});*/

	$scope.loadData1 = function () {
		$(".listView").scrollTop(0);
		$scope.aa = 20;

		//$scope.paylistsearch = '';

		$scope.loadCnt = 0;
		if (sessionStorage.AllPaymentsCurrentRESTCALL) {
			RefService.refreshAll().then(function (items) {

				if (items.response == "Error") {
					$scope.showErrorMessage(items)
				} else {
					$scope.loadedData = items.data;
					$scope.defaultCallValues(items.data)
				}

			});
		}

		if ($scope.paylistsearch != '') {
			$scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
			$scope.nothingSelected = false;
		} else {
			$scope.paylistsearchValue = AllPaymentsGlobalData.FLuir;
		}

	};

	$scope.clickReferenceID = function (val) {
		//console.log(id)
		GlobalService.fileListId = val.data.InstructionID;
		GlobalService.UniqueRefID = val.data.PaymentID;
		GlobalService.fromPage = "allpayments";

		//$rootScope.fromBulk = false;

		/*$state.go('app.paymentdetail', {
		input: val
		})*/

		$scope.Obj = {
			'uor' : val.data.OutputInstructionID,
			'nav' : {
				'UIR' : val.data.InstructionID,
				'PID' : val.data.PaymentID
			},
			'from' : 'allpayments'
		}

		$state.go('app.paymentdetail', {
			input : $scope.Obj
		})

	}

	$scope.PaymentListSearch = function () {
		$scope.aa = 20;
		var a = $('#searchBox').val();
		if (a.length != 0) {
			AllPaymentsGlobalData.FLuir = a;

			$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
			AllPaymentsGlobalData.searchClicked = true;
			$scope.searchClicked = AllPaymentsGlobalData.searchClicked;
			$scope.paylistsearchValue = $scope.paylistsearch;

			$scope.nothingSelected = false;

			if ($scope.all) {
				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
						$scope.wildcard = false;
					}
				});

			} else if ($scope.today) {
				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today").then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});
			} else if ($scope.week) {
				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});

			} else if ($scope.month) {
				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month").then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});
			} else if ($scope.custom) {
				RefService.customSearch($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.txtValfn()).then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});
			}

			$scope.search = {
				"InstructionData" : {
					"ReceivedDate" : {
						"Start" : "",
						"End" : ""
					},
					"ValueDate" : {
						"Start" : "",
						"End" : ""
					},
					"Amount" : {
						"Start" : "",
						"End" : ""
					}
				}
			};
			$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable = false;
			$scope.anythingSelected = false;
			$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
			$scope.isAdvacedSearchClicked = false;
		} else {
			$scope.nothingSelected = true;
		}

	}

	$scope.checkinfo = function (eve) {

		var a = $('#searchBox').val();

		if ((a.length == 0) && (!$scope.advancedSearchEnable)) {

			AllPaymentsGlobalData.fromMyProfilePage = false;
			$scope.UIR = false;
			delete sessionStorage.AllPaymentsCurrentRESTCALL;

			AllPaymentsGlobalData.startDate = '';
			AllPaymentsGlobalData.endDate = '';

			AllPaymentsGlobalData.ShowStartDate = '';
			AllPaymentsGlobalData.ShowEndDate = '';

			AllPaymentsGlobalData.FLuir = '';
			AllPaymentsGlobalData.searchClicked = false;
			AllPaymentsGlobalData.isEntered = false;
			AllPaymentsGlobalData.advancedSearchEnable = false;

			AllPaymentsGlobalData.searchNameDuplicated = false;
			AllPaymentsGlobalData.SelectSearchVisible = false;
			AllPaymentsGlobalData.searchname = '';

			AllPaymentsGlobalData.searchParams = {
				"InstructionData" : {
					"ReceivedDate" : {
						"Start" : "",
						"End" : ""
					},
					"ValueDate" : {
						"Start" : "",
						"End" : ""
					},
					"Amount" : {
						"Start" : "",
						"End" : ""
					}
				}
			};
			$scope.search = AllPaymentsGlobalData.searchParams;

			if ($scope.searchClicked || $scope.isEntered) {
				if ($scope.all) {
					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All").then(function (items) {
						if (items.response == "Error") {
							$scope.showErrorMessage(items)
							$scope.nothingSelected = false;
						} else {
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.loadedData = $scope.items;

							if ($scope.items.length == 0) {
								$scope.alertMsg = true;
								$scope.nothingSelected = false;
							} else {

								$scope.alertMsg = false;
								$scope.nothingSelected = true;
								AllPaymentsGlobalData.searchClicked = false;
								$scope.searchClicked = AllPaymentsGlobalData.searchClicked;
								AllPaymentsGlobalData.isEntered = false;
								$scope.isEntered = AllPaymentsGlobalData.isEntered;

								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];

								$scope.UIR = false;
							}
						}
					});

				} else if ($scope.today) {
					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.loadedData = $scope.items;
							if ($scope.items.length == 0) {
								$scope.alertMsg = true;

							} else {

								AllPaymentsGlobalData.searchClicked = false;
								$scope.searchClicked = AllPaymentsGlobalData.searchClicked;
								AllPaymentsGlobalData.isEntered = false;
								$scope.isEntered = AllPaymentsGlobalData.isEntered;
								$scope.alertMsg = false;
								$scope.dropdownSelected = true;
								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];
							}
						}

					});
				} else if ($scope.week) {
					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.loadedData = $scope.items;
							if ($scope.items.length == 0) {
								$scope.alertMsg = true;

							} else {

								AllPaymentsGlobalData.searchClicked = false;
								$scope.searchClicked = AllPaymentsGlobalData.searchClicked;
								AllPaymentsGlobalData.isEntered = false;
								$scope.isEntered = AllPaymentsGlobalData.isEntered;
								$scope.alertMsg = false;
								$scope.dropdownSelected = true;
								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];
							}
						}
					});
				} else if ($scope.month) {

					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month").then(function (items) {
						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.loadedData = $scope.items;
							if ($scope.items.length == 0) {
								$scope.alertMsg = true;

							} else {
								AllPaymentsGlobalData.searchClicked = false;
								$scope.searchClicked = AllPaymentsGlobalData.searchClicked;
								AllPaymentsGlobalData.isEntered = false;
								$scope.isEntered = AllPaymentsGlobalData.isEntered;
								$scope.alertMsg = false;
								$scope.dropdownSelected = true;
								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];
							}
						}
					});
				} else if ($scope.custom) {
					RefService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.items = items.data;
							AllPaymentsGlobalData.allPaymentDetails = items.data;
							$scope.loadedData = $scope.items;
							if ($scope.items.length == 0) {
								$scope.alertMsg = true;

							} else {
								AllPaymentsGlobalData.searchClicked = false;
								$scope.searchClicked = AllPaymentsGlobalData.searchClicked;
								AllPaymentsGlobalData.isEntered = false;
								$scope.isEntered = AllPaymentsGlobalData.isEntered;
								$scope.alertMsg = false;
								$scope.dropdownSelected = true;
								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];
							}
						}

					});
				}

			}
		}

		if (eve.keyCode == 13) {

			$scope.aa = 20;
			$scope.paylistsearchValue = $('#searchBox').val()

				var a = $('#searchBox').val()

				if (a.length != '') {

					AllPaymentsGlobalData.fromMyProfilePage = false;

					AllPaymentsGlobalData.FLuir = a; ;
					$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
					AllPaymentsGlobalData.isEntered = true;
					$scope.isEntered = AllPaymentsGlobalData.isEntered;

					if ($scope.all) {
						RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All").then(function (items) {
							if (items.response == "Error") {
								$scope.showErrorMessage(items)
							} else {
								$scope.items = items.data;
								$scope.loadedData = $scope.items;
								AllPaymentsGlobalData.allPaymentDetails = items.data;

								if ($scope.items.length == 0) {

									$scope.alertMsg = true;
									$scope.dropdownSelected = false;
								} else {

									$scope.alertMsg = false;
									$scope.nothingSelected = false;
									$scope.UIR = true;
									$scope.dropdownSelected = true;
									$scope.alerts = [{
											type : '',
											msg : ''
										}
									];
								}

							}
						});
					} else if ($scope.today) {

						RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today").then(function (items) {
							if (items.response == "Error") {
								$scope.showErrorMessage(items)
							} else {
								$scope.items = items.data;
								AllPaymentsGlobalData.allPaymentDetails = items.data;
								$scope.loadedData = $scope.items;

								if ($scope.items.length == 0) {
									$scope.alertMsg = true;
									$scope.dropdownSelected = false;
								} else {
									$scope.alertMsg = false;
									$scope.dropdownSelected = true;
									$scope.alerts = [{
											type : '',
											msg : ''
										}
									];
								}
							}
						});
					} else if ($scope.week) {

						RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week").then(function (items) {
							if (items.response == "Error") {
								$scope.showErrorMessage(items)
								$scope.dropdownSelected = false;
							} else {
								$scope.defaultCallValues(items.data)
								$scope.dropdownSelected = true;
								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];
							}
						});

					} else if ($scope.month) {

						RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month").then(function (items) {
							if (items.response == "Error") {
								$scope.showErrorMessage(items)
								$scope.dropdownSelected = false;
							} else {
								$scope.defaultCallValues(items.data)
								$scope.dropdownSelected = true;
								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];
							}
						});
					} else if ($scope.custom) {
						RefService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
							if (items.response == "Error") {
								$scope.showErrorMessage(items)
								$scope.dropdownSelected = false;
							} else {
								$scope.defaultCallValues(items.data)
								$scope.dropdownSelected = true;
								$scope.alerts = [{
										type : '',
										msg : ''
									}
								];
							}

						});
					}

					$scope.nothingSelected = false;

				} else {
					$scope.nothingSelected = true;
				}

				$scope.PaymentAdvancedSearch = true;
			//$scope.UIRtxtVal = '';
			$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable = false;
			$scope.anythingSelected = false;
			$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
			$scope.isAdvacedSearchClicked = false;
			$scope.search = {
				"InstructionData" : {
					"ReceivedDate" : {
						"Start" : "",
						"End" : ""
					},
					"ValueDate" : {
						"Start" : "",
						"End" : ""
					},
					"Amount" : {
						"Start" : "",
						"End" : ""
					}
				}
			};
		}
	}

	$scope.prev = 'all';
	$scope.prevSelectedTxt = 'all'
		$scope.prevId = 1;
	$scope.prev = AllPaymentsGlobalData.prev;
	$scope.prevSelectedTxt = AllPaymentsGlobalData.prevSelectedTxt;
	$scope.prevId = AllPaymentsGlobalData.prevId;

	$('.customDropdown').find('ul').find('li:first-child').addClass('listSelected')

	$scope.clearSearch = function () {
		$scope.aa = 20;
		$scope.paylistsearchValue = '';
		$scope.UIR = false;
		$scope.nothingSelected = true;
		$scope.alertMsg = false;

		for (i in AllPaymentsGlobalData.searchParams) {

			if (i == 'InstructionData') {
				for (j in AllPaymentsGlobalData.searchParams[i]) {
					AllPaymentsGlobalData.searchParams[i][j].Start = "";
					AllPaymentsGlobalData.searchParams[i][j].End = "";
				}
			} else {
				AllPaymentsGlobalData.searchParams[i] = '';
			}

		}

		AllPaymentsGlobalData.fromDashboard = false;
		AllPaymentsGlobalData.myProfileFLindex = '';
		AllPaymentsGlobalData.todayDate = '';
		AllPaymentsGlobalData.weekStart = '';
		AllPaymentsGlobalData.weekEnd = '';
		AllPaymentsGlobalData.monthStart = '';
		AllPaymentsGlobalData.monthEnd = '';

		AllPaymentsGlobalData.orderByField = 'ReceivedDate';
		AllPaymentsGlobalData.sortReverse = false;
		AllPaymentsGlobalData.sortType = 'Desc';
		AllPaymentsGlobalData.isSortingClicked = false;
		AllPaymentsGlobalData.DataLoadedCount = 20;
		AllPaymentsGlobalData.all = true;
		AllPaymentsGlobalData.today = false;
		AllPaymentsGlobalData.week = false;
		AllPaymentsGlobalData.month = false;
		AllPaymentsGlobalData.custom = false;
		AllPaymentsGlobalData.FLuir = '';
		AllPaymentsGlobalData.startDate = '';
		AllPaymentsGlobalData.endDate = '';
		AllPaymentsGlobalData.ShowStartDate = '';
		AllPaymentsGlobalData.ShowEndDate = '';
		AllPaymentsGlobalData.selectCriteriaTxt = 'All';
		AllPaymentsGlobalData.selectCriteriaID = 1;
		AllPaymentsGlobalData.prev = 'all';
		AllPaymentsGlobalData.prevSelectedTxt = 'all';
		AllPaymentsGlobalData.prevId = 1;
		AllPaymentsGlobalData.searchClicked = false;
		AllPaymentsGlobalData.isEntered = false;
		AllPaymentsGlobalData.advancedSearchEnable = false;
		AllPaymentsGlobalData.searchNameDuplicated = false;
		AllPaymentsGlobalData.SelectSearchVisible = false;
		AllPaymentsGlobalData.searchname = '';
		$state.reload();

	}

	$scope.FilterByDate = function (text, eve) {

		$scope.paylistsearchValue = $scope.paylistsearch;

		$scope.aa = 20;
		var _id;
		$scope.globalEsearch = PersonService.txtBoxVal = $scope.esearch;
		_id = $(eve.currentTarget).attr('id').split('_')[1]
			if ($scope.prevId != _id) {
				$scope.prevSelected = $scope.prevId;
				AllPaymentsGlobalData.prevId = $scope.prevId;
			}

			$scope.parent = $(eve.currentTarget).parent().parent().find('span:first-child');
		$scope.parentTxt = $scope.parent.text();
		$scope.child = $(eve.currentTarget).text()

			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_' + _id).addClass('listSelected').removeClass('listNotSelected');

		$($scope.parent).html($scope.child)
		$scope.prev = $scope.child;

		if (($scope.prev == 'All') || ($scope.prev == 'Today') || ($scope.prev == 'Week') || ($scope.prev == 'Month')) {
			AllPaymentsGlobalData.selectCriteriaTxt = $scope.prev;
			AllPaymentsGlobalData.selectCriteriaID = _id;
		}
		AllPaymentsGlobalData.prev = $scope.prev;
		$scope.prevTxt = $(eve.currentTarget).text();
		$scope.prevId = _id;

		if (!$scope.advancedSearchEnable) {

			if (text == 'all') {

				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';

				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.all = true;
				AllPaymentsGlobalData.today = false;
				AllPaymentsGlobalData.week = false;
				AllPaymentsGlobalData.month = false;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				var xx = $('#searchBox').val()

					if (xx.length != 0) {

						$scope.nothingSelected = false;
						$scope.UIR = true;
						AllPaymentsGlobalData.searchClicked = true;
						$scope.searchClicked = AllPaymentsGlobalData.searchClicked;

						AllPaymentsGlobalData.isEntered = true;
						$scope.isEntered = AllPaymentsGlobalData.isEntered;
					} else {
						$scope.nothingSelected = true;
						AllPaymentsGlobalData.searchClicked = false;
						$scope.searchClicked = AllPaymentsGlobalData.searchClicked;

						AllPaymentsGlobalData.isEntered = false;
						$scope.isEntered = AllPaymentsGlobalData.isEntered;
					}

					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					});
			}

			if (text == 'today') {

				$scope.nothingSelected = false;

				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';

				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.todayDate = todayDate();
				$scope.todayDate = AllPaymentsGlobalData.todayDate;

				AllPaymentsGlobalData.all = false;
				AllPaymentsGlobalData.today = true;
				AllPaymentsGlobalData.week = false;
				AllPaymentsGlobalData.month = false;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});
			}

			if (text == 'week') {

				$scope.nothingSelected = false;
				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';

				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.weekStart = week().lastDate;
				AllPaymentsGlobalData.weekEnd = week().todayDate;
				$scope.weekStart = AllPaymentsGlobalData.weekStart;
				$scope.weekEnd = AllPaymentsGlobalData.weekEnd;

				AllPaymentsGlobalData.all = false;
				AllPaymentsGlobalData.today = false;
				AllPaymentsGlobalData.week = true;
				AllPaymentsGlobalData.month = false;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week").then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});

			}

			if (text == 'month') {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';
				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.monthStart = month().lastDate;
				AllPaymentsGlobalData.monthEnd = month().todayDate;
				$scope.monthStart = AllPaymentsGlobalData.monthStart;
				$scope.monthEnd = AllPaymentsGlobalData.monthEnd;

				AllPaymentsGlobalData.all = false;
				AllPaymentsGlobalData.today = false;
				AllPaymentsGlobalData.week = false;
				AllPaymentsGlobalData.month = true;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});

			}

		} else {

			var FieldREST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);

			if (text == 'all') {
				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';
				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.all = true;
				AllPaymentsGlobalData.today = false;
				AllPaymentsGlobalData.week = false;
				AllPaymentsGlobalData.month = false;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				var xx = $('#searchBox').val()

					if (xx.length != 0) {
						$scope.nothingSelected = false;
						$scope.UIR = true;

						AllPaymentsGlobalData.searchClicked = true;
						$scope.searchClicked = AllPaymentsGlobalData.searchClicked;

						AllPaymentsGlobalData.isEntered = true;
						$scope.isEntered = AllPaymentsGlobalData.isEntered;
					} else {
						$scope.nothingSelected = true;
						AllPaymentsGlobalData.searchClicked = false;
						$scope.searchClicked = AllPaymentsGlobalData.searchClicked;

						AllPaymentsGlobalData.isEntered = false;
						$scope.isEntered = AllPaymentsGlobalData.isEntered;

					}

					RefService.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "All").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.defaultCallValues(items.data)
						}
					})
			} else if (text == 'today') {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';
				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.todayDate = todayDate();
				$scope.todayDate = AllPaymentsGlobalData.todayDate;

				AllPaymentsGlobalData.all = false;
				AllPaymentsGlobalData.today = true;
				AllPaymentsGlobalData.week = false;
				AllPaymentsGlobalData.month = false;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				RefService.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "Today").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if (text == 'week') {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';
				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.weekStart = week().lastDate;
				AllPaymentsGlobalData.weekEnd = week().todayDate;
				$scope.weekStart = AllPaymentsGlobalData.weekStart;
				$scope.weekEnd = AllPaymentsGlobalData.weekEnd;

				AllPaymentsGlobalData.all = false;
				AllPaymentsGlobalData.today = false;
				AllPaymentsGlobalData.week = true;
				AllPaymentsGlobalData.month = false;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				RefService.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "Week").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if (text == 'month') {
				$scope.nothingSelected = false;
				AllPaymentsGlobalData.startDate = '';
				AllPaymentsGlobalData.endDate = '';
				$scope.startDate = AllPaymentsGlobalData.startDate
					$scope.endDate = AllPaymentsGlobalData.endDate;

				AllPaymentsGlobalData.monthStart = month().lastDate;
				AllPaymentsGlobalData.monthEnd = month().todayDate;
				$scope.monthStart = AllPaymentsGlobalData.monthStart;
				$scope.monthEnd = AllPaymentsGlobalData.monthEnd;

				AllPaymentsGlobalData.all = false;
				AllPaymentsGlobalData.today = false;
				AllPaymentsGlobalData.week = false;
				AllPaymentsGlobalData.month = true;
				AllPaymentsGlobalData.custom = false;

				$scope.all = AllPaymentsGlobalData.all;
				$scope.today = AllPaymentsGlobalData.today;
				$scope.week = AllPaymentsGlobalData.week;
				$scope.month = AllPaymentsGlobalData.month;
				$scope.custom = AllPaymentsGlobalData.custom;

				RefService.advancedSearch(FieldREST, $scope.orderByField, $scope.sortType, "Month").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			}
		}

		if (($scope.startDate != '') && ($scope.endDate != '')) {
			$scope.customDateFilled = true;
		} else {
			$scope.customDateFilled = false;
		}

		if (($scope.startDate != '') || ($scope.endDate != '')) {
			$('#okBtn').removeAttr('disabled', 'disabled')
		} else {
			$('#okBtn').attr('disabled', 'disabled')
		}

		if ($('#searchBox').val() != '') {
			$scope.UIR = true;
		} else {
			$scope.UIR = false;
		}

		$scope.customDateRangePicker()

	}
	$scope.FilterByDate1 = function () {

		$('#myModal').modal('hide')

		if (!$scope.advancedSearchEnable) {
			AllPaymentsGlobalData.all = false;
			AllPaymentsGlobalData.today = false;
			AllPaymentsGlobalData.week = false;
			AllPaymentsGlobalData.month = false;
			AllPaymentsGlobalData.custom = true;

			$scope.all = AllPaymentsGlobalData.all;
			$scope.today = AllPaymentsGlobalData.today;
			$scope.week = AllPaymentsGlobalData.week;
			$scope.month = AllPaymentsGlobalData.month;
			$scope.custom = AllPaymentsGlobalData.custom;

			AllPaymentsGlobalData.startDate = $scope.startDate;
			AllPaymentsGlobalData.endDate = $scope.endDate;

			AllPaymentsGlobalData.ShowStartDate = AllPaymentsGlobalData.startDate;
			AllPaymentsGlobalData.ShowEndDate = AllPaymentsGlobalData.endDate;
			$scope.ShowStartDate = AllPaymentsGlobalData.ShowStartDate;
			$scope.ShowEndDate = AllPaymentsGlobalData.ShowEndDate;

			AllPaymentsGlobalData.selectCriteriaID = 5;
			AllPaymentsGlobalData.prev = "Custom"
				AllPaymentsGlobalData.selectCriteriaTxt = "Custom"
				$scope.prev = AllPaymentsGlobalData.prev;

			RefService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {

				if (items.response == "Error") {
					$scope.showErrorMessage(items)
					$scope.dropdownSelected = false;
				} else {
					$scope.defaultCallValues(items.data)
					$scope.dropdownSelected = true;
				}
			});
		} else {

			var FieldREST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);

			AllPaymentsGlobalData.all = false;
			AllPaymentsGlobalData.today = false;
			AllPaymentsGlobalData.week = false;
			AllPaymentsGlobalData.month = false;
			AllPaymentsGlobalData.custom = true;

			$scope.all = AllPaymentsGlobalData.all;
			$scope.today = AllPaymentsGlobalData.today;
			$scope.week = AllPaymentsGlobalData.week;
			$scope.month = AllPaymentsGlobalData.month;
			$scope.custom = AllPaymentsGlobalData.custom;

			AllPaymentsGlobalData.startDate = $scope.startDate;
			AllPaymentsGlobalData.endDate = $scope.endDate;

			AllPaymentsGlobalData.ShowStartDate = AllPaymentsGlobalData.startDate;
			AllPaymentsGlobalData.ShowEndDate = AllPaymentsGlobalData.endDate;

			$scope.ShowStartDate = $scope.startDate;
			$scope.ShowEndDate = $scope.endDate;

			AllPaymentsGlobalData.prev = "Custom";
			AllPaymentsGlobalData.selectCriteriaTxt = "Custom";
			$scope.prev = AllPaymentsGlobalData.prev;

			AllPaymentsGlobalData.selectCriteriaID = 5;

			RefService.advancedCustomSearch(FieldREST, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType).then(function (items) {

				if (items.response == "Error") {
					$scope.showErrorMessage(items)
				} else {
					$scope.defaultCallValues(items.data)
				}
			})
		}

		if (($scope.startDate != '') && ($scope.endDate != '')) {
			$('#okBtn').removeAttr('disabled', 'disabled');
			$scope.customDateFilled = true;
			$scope.nothingSelected = false;
			$scope.custom = true;
		} else {
			$('#okBtn').attr('disabled', 'disabled');
			$scope.customDateFilled = false;
			$scope.nothingSelected = true;

		}
	}

	$scope.filterCancel = function () {

		$scope.startDate = AllPaymentsGlobalData.startDate;
		$scope.endDate = AllPaymentsGlobalData.endDate;

		if ($scope.startDate && $scope.endDate) {
			$($scope.parent).html("Custom")
			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_5').addClass('listSelected').removeClass('listNotSelected')
		} else {
			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_' + AllPaymentsGlobalData.prevId).addClass('listSelected').removeClass('listNotSelected')

			$($scope.parent).html($('#menulist_' + AllPaymentsGlobalData.prevId).text())
		}

	}

	$scope.DateReset = function () {}
	$scope.removeFn = function () {

		if (($('#startDate').val() != '') || ($('#endDate').val() != '')) {
			$('#okBtn').removeAttr('disabled', 'disabled')
		} else {
			$('#okBtn').attr('disabled', 'disabled')
		}
	}

	$scope.dummy = function (eve) {
		if (eve.keyCode == 27) {
			$scope.filterCancel()
		}
	}

	$scope.modelhide = function (e) {
		if (e.currentTarget == e.target) {

			$scope.filterCancel()
		}

	}

	/***************Advanced Search functionlities***************/
	function setFlag(val) {
		if (val) {
			return true;
		} else {
			return false;
		}
	}

	//function initializeSetting()
	$scope.initializeSetting = function () {

		$scope.FieldsValues = [{
				"label" : "Instruction ID",
				"value" : "InstructionID",
				"type" : "text",
				"allow" : "number",
				"visible" : true
			}, {
				"label" : "Service ID",
				"value" : "ServiceID",
				"type" : "text",
				"allow" : "string",
				"visible" : true
			}, {
				"label" : "Payment ID",
				"value" : "PaymentID",
				"type" : "text",
				"allow" : "string",
				"visible" : true
			}, {
				"label" : "PSA Code",
				"value" : "PartyServiceAssociationCode",
				"type" : "dropdown",
				"visible" : true
			}, {
				"label" : "Payment Reference",
				"value" : "OriginalPaymentReference",
				"type" : "text",
				"allow" : "string",
				"visible" : true
			}, {
				"label" : "Payment Currency",
				"value" : "Currency",
				"type" : "dropdown",
				"visible" : true
			}, {
				"label" : "Received Date",
				"value" : "ReceivedDate",
				"type" : "dateRange",
				"allow" : "date",
				"visible" : true
			}, {
				"label" : "Amount",
				"value" : "Amount",
				"type" : "amountRange",
				"allow" : "number",
				"visible" : true
			}, {
				"label" : "Value Date",
				"value" : "ValueDate",
				"type" : "dateRange",
				"allow" : "date",
				"visible" : true
			}, {
				"label" : "MOP",
				"value" : "MethodOfPayment",
				"type" : "dropdown",
				"visible" : true
			}, {
				"label" : "Distribution ID",
				"value" : "DistributionID",
				"type" : "text",
				"allow" : "string",
				"visible" : true
			}, {
				"label" : "Payment Status",
				"value" : "Status",
				"type" : "dropdown",
				"visible" : true
			}, {
				"label" : "Debtor Name",
				"value" : "D_Name",
				"type" : "text",
				"allow" : "string",
				"visible" : setFlag($scope.search.D_Name)
			}, {
				"label" : "Debtor Account Number",
				"value" : "D_Account",
				"type" : "text",
				"allow" : "string",
				"visible" : setFlag($scope.search.D_Account)
			}, {
				"label" : "Creditor Name",
				"value" : "C_Name",
				"type" : "text",
				"allow" : "string",
				"visible" : setFlag($scope.search.C_Name)
			}, {
				"label" : "Creditor Account Number",
				"value" : "C_Account",
				"type" : "text",
				"allow" : "string",
				"visible" : setFlag($scope.search.C_Account)
			}
		]
	}

	$scope.initializeSetting();

	$(document).ready(function () {
		for (var i in $scope.FieldsValues) {
			if ($scope.FieldsValues[i].type == 'dropdown') {
				$('[name=' + $scope.FieldsValues[i].value + ']').select2();
			}
		}

		//	$scope.setInitval()

		$scope.remoteDataConfig = function () {

			$("select[name='PartyServiceAssociationCode']").select2({
				ajax : {
					url : BASEURL + RESTCALL.PartyCodeDropdown,
					headers : {
						"Authorization" : "SessionToken:" + sessionStorage.SessionToken,
						"Content-Type" : "application/json"
					},
					dataType : 'json',
					delay : 250,
					xhrFields : {
						withCredentials : true
					},
					beforeSend : function (xhr) {
						xhr.setRequestHeader('Cookie', document.cookie),
						xhr.withCrendentials = true
					},
					crossDomain : true,
					data : function (params) {
						var query = {
							start : params.page * $scope.limit ? params.page * $scope.limit : 0,
							count : $scope.limit
						}

						if (params.term) {
							query = {
								search : params.term,
								start : params.page * $scope.limit ? params.page * $scope.limit : 0,
								count : $scope.limit
							};
						}
						return query;
					},
					processResults : function (data, params) {
						params.page = params.page ? params.page : 0;
						var myarr = []

						for (j in data) {
							myarr.push({
								'id' : data[j].actualvalue,
								'text' : data[j].displayvalue
							})
						}
						return {
							results : myarr,
							pagination : {
								more : data.length >= $scope.limit
							}
						};

					},
					cache : true
				},
				placeholder : 'Select',
				minimumInputLength : 0,
				allowClear : true

			})
		}

		$scope.remoteDataConfig()

	})

	/*$http.get(BASEURL + RESTCALL.PartyCodeDropdown).success(function (data) {
	$scope.psaCodeDrop = data;
	}).error(function () { })*/

	RefService.GetUniquePaymentDropdown().then(function (items) {

		$scope.uniqueMOP = uniques(items.MOP)
			$scope.uniquePaymentStatusArr = uniques(items.PaymentStatus);
		$scope.uniqueCurrency = uniques(items.Currency);

		$scope.uniqueMOP.sort();
		$scope.uniquePaymentStatusArr.sort();
		$scope.uniqueCurrency.sort();

	})

	$scope.anythingSelected = false;

	$scope.additionalWhereClauses = '';
	$scope.additionalWhereClauseArr = [];
	$scope.advancedUIR = AllPaymentsGlobalData.advancedUIR;

	$scope.SelectValue = function (index) {
		// console.log(index)
		$scope.seeVisible = false;
		$scope.FieldsValues[index]['visible'] = !$scope.FieldsValues[index]['visible'];
		setTimeout(function () {
			$scope.triggerSelect2()
		}, 10);
		for (var i in $scope.FieldsValues) {
			if ($scope.FieldsValues[i].visible) {
				$scope.seeVisible = true;
			}
			// if( i%2 == 1)
			// {
			// 	$(".row").find("#clearSpace"+i).after("<div class='clearfix'></div>")
			// 	// console.log($(".row").find("#clearSpace"+i),i)
			// }

		}

		if ($scope.seeVisible) {
			$('#saveSearchBtn, #AdSearchBtn').removeAttr('disabled', 'disabled');
		} else {
			$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
			$scope.PaymentAdvancedSearch = true;
			$('#saveSearchBtn, #AdSearchBtn').attr('disabled', 'disabled');
		}
	}

	// $scope.clearSpc = function(toggleFlg,index)
	// {
	// 	console.log(toggleFlg,index)
	// 	if(!toggleFlg)
	// 	{
	// 		// console.log($("#3"),index+2)
	// 		index=index+2;
	// 		$("div#"+(index)).removeAttr("class")

	// 	}
	// 	else
	// 	{
	// 		// $(".clearSpace").after("<div class='clearfix' ng-if="+index%2 == 1+"'></div>")
	// 	}
	// }


	$scope.searchNameDuplicated = AllPaymentsGlobalData.searchNameDuplicated;
	$scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;
	$scope.searchName = AllPaymentsGlobalData.searchname;
	$scope.isAnyFieldFilled = false;

	$scope.keyIndex = '';
	$scope.saveSearch = function () {
		//alert($scope.searchname)
		if ($scope.searchname) {
			$scope.isSearchNameFilled = false;
			for (var key in userData.savedSearch.AllPayments) {
				if (userData.savedSearch.AllPayments[key].name == $scope.searchname) {

					$scope.searchNameDuplicated = true;
					$scope.keyIndex = key;
					break;
				} else {
					$scope.searchNameDuplicated = false;
				}

			}
			if (!$scope.searchNameDuplicated) {
				var saveSearchObjects = $scope.buildSearch();
				if ($scope.searchname) {
					$scope.searchSet = false;
					for (i in $scope.search) {
						if (i == 'InstructionData') {
							for (j in $scope.search[i]) {
								if ((j == 'ReceivedDate') || (j == 'ValueDate') || (j == 'Amount')) {
									for (k in $scope.search[i][j]) {
										if (($scope.search[i][j].Start != '') && ($scope.search[i][j].End != '')) {
											$scope.searchSet = true;
										}

									}
								} else {
									if ($scope.search[i][j] != "") {
										$scope.searchSet = true;
									}
								}
							}
						} else {
							if ($scope.search[i] != '') {
								$scope.searchSet = true;
							}
						}
					}

					if ($scope.searchSet) {

						AllPaymentsGlobalData.SelectSearchVisible = true;
						$scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;

						userData.savedSearch.AllPayments.push({
							'name' : $scope.searchname,
							'params' : saveSearchObjects
						})

						updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function (response) {
							if (response.Status == 'danger') {
								$scope.alerts = [{
										type : 'danger',
										msg : response.data.data.error.message
									}
								];
							} else {
								AllPaymentsGlobalData.searchname = $scope.searchname;
								$scope.searchName = AllPaymentsGlobalData.searchname;
								$scope.testing();
							}

						})

						$('#myModal1').modal('hide');
					} else {
						$scope.isAnyFieldFilled = true;
					}
				}
			}

			$scope.saveSearch1 = function () {

				saveSearchObjects = $scope.buildSearch();

				//localStorage.setItem("AS_"+sessionStorage.UserID+"_"+$scope.searchname,JSON.stringify(saveSearchObjects));


				$('#myModal1').modal('hide');
				AllPaymentsGlobalData.SelectSearchVisible = true;
				$scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;

				AllPaymentsGlobalData.searchname = $scope.searchname;
				$scope.searchName = AllPaymentsGlobalData.searchname;

				$scope.searchname = '';

				userData.savedSearch.AllPayments[$scope.keyIndex].name = $scope.searchName

					userData.savedSearch.AllPayments[$scope.keyIndex].params = JSON.stringify(saveSearchObjects)

					updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function (response) {

						$scope.testing();
					})

			}
		} else {
			$scope.isSearchNameFilled = true;
		}

	}

	$scope.ClearAlert = function () {
		$scope.searchNameDuplicated = false;
		$scope.searchname = '';
		$scope.isAnyFieldFilled = false;
		$scope.isSearchNameFilled = false;
	}

	$scope.selectSearch = function (eve, index) {

		AllPaymentsGlobalData.searchname = $scope.lskey[index];
		$scope.searchName = AllPaymentsGlobalData.searchname;

		$timeout(function () {

			$scope.triggerSelect2()
		}, 0)

		//$scope.searchName = AllPaymentsGlobalData.searchname;


		if ($scope.searchName != 'New Search') {

			var ff = $scope.uData.savedSearch.AllPayments[index - 1].params;
			console.log(ff)

			//$scope.triggerSelect2(ff)


			AllPaymentsGlobalData.searchParams = ff.searchParams;

			$scope.search = ff.searchParams;

			$scope.all = ff.all;
			$scope.today = ff.today;
			$scope.week = ff.week;
			$scope.month = ff.month;
			$scope.custom = ff.custom;
			$scope.FLuir = ff.FLuir;

			$scope.startDate = ff.startDate;
			$scope.endDate = ff.endDate;

			$scope.todayDate = ff.todayDate;
			$scope.weekStart = ff.weekStart;
			$scope.weekEnd = ff.weekEnd;
			$scope.monthStart = ff.monthStart;
			$scope.monthEnd = ff.monthEnd;

			$scope.selectCriteriaTxt = ff.selectCriteriaTxt;
			$scope.selectCriteriaID = ff.selectCriteriaID;
			AllPaymentsGlobalData.selectCriteriaID = $scope.selectCriteriaID;
			$scope.prev = ff.prev;
			$scope.prevSelectedTxt = ff.prevSelectedTxt;
			$scope.prevId = ff.prevId;

			$scope.searchClicked = ff.searchClicked;
			$scope.isEntered = ff.isEntered;

			//setTimeout(function(){
			//$scope.remoteDataConfig()
			//$scope.search = ff.searchParams;
			//console.log($scope.search)
			//console.log("d",$scope.search.PartyServiceAssociationCode)

			$scope.dynamicArr = ["PartyServiceAssociationCode"]
			for (var i in $scope.dynamicArr) {
				$("select[name='" + $scope.dynamicArr[i] + "']").select2({
					data : $scope.search[$scope.dynamicArr[i]]
				});
			}

			//},100)

			//setTimeout(function(){


			//$("select[name='PartyServiceAssociationCode']")('val', ff.searchParams.PartyServiceAssociationCode);

			//},100)

			//$('[name=' + $scope.FieldsValues[i].value + ']').select2('val', '');


			$scope.advancedSearchEnable = ff.advancedSearchEnable;
			AllPaymentsGlobalData.advancedSearchEnable = ff.advancedSearchEnable;
			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_' + AllPaymentsGlobalData.selectCriteriaID).addClass('listSelected').removeClass('listNotSelected');

			$('#paymentDropdownBtnTxt').html(ff.selectCriteriaTxt)
			AllPaymentsGlobalData.fromMyProfilePage = true;

			AllPaymentsGlobalData.FieldArr = ff.FieldArr;
			$scope.initialCall(true)
			$scope.initializeSetting()

		} else {
			setTimeout(function () {
				$scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
				$scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')

				/*$scope.dynamicArr = ["PartyServiceAssociationCode","Currency","MethodOfPayment","Status"];
				for(var i in $scope.dynamicArr){
				$('select[name='+$scope.dynamicArr[i]+']').val('');
				$("select[name="+$scope.dynamicArr[i]+"]").select2()
				}*/

			}, 200)

			$scope.search = {
				"InstructionData" : {
					"ReceivedDate" : {
						"Start" : "",
						"End" : ""
					},
					"ValueDate" : {
						"Start" : "",
						"End" : ""
					},
					"Amount" : {
						"Start" : "",
						"End" : ""
					}
				}

			};

			AllPaymentsGlobalData.searchParams = $scope.search;
			console.log("params", AllPaymentsGlobalData.searchParams)

			AllPaymentsGlobalData.all = true;
			AllPaymentsGlobalData.today = false;
			AllPaymentsGlobalData.week = false;
			AllPaymentsGlobalData.month = false;
			AllPaymentsGlobalData.custom = false;

			$scope.all = AllPaymentsGlobalData.all;
			$scope.today = AllPaymentsGlobalData.today;
			$scope.week = AllPaymentsGlobalData.week;
			$scope.month = AllPaymentsGlobalData.month;
			$scope.custom = AllPaymentsGlobalData.custom;

			$scope.resetFilter()
			$('#paymentDropdownBtnTxt').html('All');
			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_1').addClass('listSelected').removeClass('listNotSelected');

			$scope.PaymentAdvancedSearch = false;

			$scope.triggerSelect2()

		}
	}

	$scope.spliceSearchArr = function (key) {
		//console.log($scope.search)
		delete $scope.search[key];

		$scope.dArr = ["PartyServiceAssociationCode", "Currency", "MethodOfPayment", "Status"]
		$timeout(function () {

			for (var i in $scope.dArr) {
				if (key == $scope.dArr[i]) {
					$("select[name='" + $scope.dArr[i] + "']").select2({
						data : []
					});
				}
			}

		}, 500)

		$scope.buildSearch()
	}

	$scope.buildSearch = function () {

		//console.log($scope.search)

		$scope.AdsearchParams = angular.copy($scope.search)

			//console.log($scope.AdsearchParams)
			statusBasedActions()

			$scope.additionalWhereClauses = '';
		$scope.additionalWhereClauseArr = [];
		$scope.amountAlert = false;

		console.log("1", $scope.AdsearchParams)

		$scope.AdsearchParams = removeEmptyValueKeys($scope.AdsearchParams)

			for (var i in $scope.AdsearchParams) {

				if (Array.isArray($scope.AdsearchParams[i])) {
					console.log(i, $scope.AdsearchParams[i])
					if (!$scope.AdsearchParams[i].length) {
						delete $scope.AdsearchParams[i]
					}

				}

			}

			console.log("2", $scope.AdsearchParams)

			for (i in $scope.AdsearchParams) {
				if (i == 'InstructionData') {
					for (j in $scope.AdsearchParams[i]) {
						//if($scope.AdsearchParams[i][j] != "")
						//{
						if ((j == 'ReceivedDate') || (j == 'ValueDate') || (j == 'Amount')) {
							for (k in $scope.AdsearchParams[i][j]) {
								if ((k == 'Start') && ($scope.AdsearchParams[i][j][k] != "")) {
									//console.log(AllPaymentsGlobalData.searchParams[i][j])
									AllPaymentsGlobalData.searchParams[i][j].Start = $scope.AdsearchParams[i][j][k];
									if (j == 'ReceivedDate') {
										$scope.additionalWhereClauses = "EntryDateBetween=" + $scope.AdsearchParams[i][j][k];
									} else if (j == 'ValueDate') {
										$scope.additionalWhereClauses = "ValueStartDate=" + $scope.AdsearchParams[i][j][k];
									} else if (j == 'Amount') {
										$scope.additionalWhereClauses = "AmountStart=" + $scope.AdsearchParams[i][j][k];
									}
									$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
								} else if ((k == 'End') && ($scope.AdsearchParams[i][j][k] != "")) {
									AllPaymentsGlobalData.searchParams[i][j].End = $scope.AdsearchParams[i][j][k];
									if (j == 'ReceivedDate') {
										$scope.additionalWhereClauses = "EndDateBetween=" + $scope.AdsearchParams[i][j][k];
									} else if (j == 'ValueDate') {
										$scope.additionalWhereClauses = "ValueEndDate=" + $scope.AdsearchParams[i][j][k];
									} else if (j == 'Amount') {
										$scope.additionalWhereClauses = "AmountEnd=" + $scope.AdsearchParams[i][j][k];
									}
									$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
								}
							}
						} else {

							AllPaymentsGlobalData.searchParams[i][j] = $scope.AdsearchParams[i][j];
							$scope.additionalWhereClauses = j + '=' + $scope.AdsearchParams[i][j];
							$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
						}

						//}
					}
				} else {

					//	console.log(i,$scope.AdsearchParams[i])
					AllPaymentsGlobalData.searchParams[i] = $scope.AdsearchParams[i];
					if (Array.isArray($scope.AdsearchParams[i])) {
						for (var k in $scope.AdsearchParams[i]) {
							$scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i][k];
							$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
						}
					} else {

						$scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i];
						$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
					}

					/*AllPaymentsGlobalData.searchParams[i] = $scope.AdsearchParams[i];

					if($scope.AdsearchParams[i].length >= 2){
					for(var k=0;k<$scope.AdsearchParams[i].length;k++){

					console.log(i,$scope.AdsearchParams[i][k])
					$scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i][k];
					$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
					}
					}
					else{
					console.log(i,$scope.AdsearchParams[i][0])
					$scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i][0];
					$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
					}*/

				}
			}

			$scope.searchSet = false;
		for (i in $scope.AdsearchParams) {
			if (i == 'InstructionData') {
				for (j in $scope.AdsearchParams[i]) {
					if ((j == 'ReceivedDate') || (j == 'ValueDate') || (j == 'Amount')) {

						for (k in $scope.AdsearchParams[i][j]) {
							if (($scope.AdsearchParams[i][j].Start != '') && ($scope.AdsearchParams[i][j].End != '')) {
								$scope.searchSet = true;
							}
						}
					}
				}
			} else {
				if ($scope.AdsearchParams[i] != '') {
					$scope.searchSet = true;
				}
			}
		}

		console.log("adParams", $scope.AdsearchParams)

		if ($scope.searchSet) {

			$scope.anythingSelected = true;
			$scope.isAdvacedSearchClicked = true;
			$scope.showSearchWarning = false;
			$('#showWarning').removeClass('in');

			//			console.log($scope.additionalWhereClauseArr)


			//getForceAction(firstObj)


		} else {
			$scope.anythingSelected = false;
			$scope.isAdvacedSearchClicked = false;
			$scope.showSearchWarning = true;
			$('#showWarning').addClass('in');
		}

		//console.log($scope.additionalWhereClauseArr)
		//$scope.triggerSelect2();

		if ($scope.anythingSelected) {
			AllPaymentsGlobalData.fromMyProfilePage = false;
			AllPaymentsGlobalData.FieldArr = $scope.additionalWhereClauseArr;
			AllPaymentsGlobalData.fromDashboard = false;
			$scope.fromDashboard = AllPaymentsGlobalData.fromDashboard;
			AllPaymentsGlobalData.DataLoadedCount = 20;
			$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;
			AllPaymentsGlobalData.FLuir = $scope.paylistsearch = ''
				$scope.checkDropdownSelected('search');
			$scope.PaymentAdvancedSearch = true;

			AllPaymentsGlobalData.advancedSearchEnable = true;
			$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;

			$scope.UIR = false;
			$scope.aa = 20;

			if ($scope.all) {
				$scope.nothingSelected = true;
				RefService.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "All").then(function (items) {
					console.log(items.data[0])

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						getForceAction(items.data[0])
						$scope.defaultCallValues(items.data)
					}

				})
			} else if ($scope.today) {
				$scope.nothingSelected = false;
				RefService.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "Today").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if ($scope.week) {
				$scope.nothingSelected = false;
				RefService.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "Week").then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if ($scope.month) {
				$scope.nothingSelected = false;
				RefService.advancedSearch($scope.additionalWhereClauseArr, $scope.orderByField, $scope.sortType, "Month").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			} else if ($scope.custom) {
				$scope.nothingSelected = false;
				RefService.advancedCustomSearch($scope.additionalWhereClauseArr, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				})
			}
		} else {

			if ($scope.advancedSearchEnable) {
				AllPaymentsGlobalData.advancedSearchEnable = false;
				$scope.advancedSearchEnable = AllPaymentsGlobalData.advancedSearchEnable;
				//AllPaymentsGlobalData.finalREST = BASEURL + '/rest/v1/payment?';
				//$scope.finalREST = AllPaymentsGlobalData.finalREST;
				if ($scope.all) {

					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
							$scope.wildcard = false;
						}
					});

				} else if ($scope.today) {
					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today").then(function (items) {
						if (items.response == "Error") {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.defaultCallValues(items.data)
							$scope.dropdownSelected = true;
						}

					});
				} else if ($scope.week) {
					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.defaultCallValues(items.data)
							$scope.dropdownSelected = true;

						}
					});
				} else if ($scope.month) {
					RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month").then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.defaultCallValues(items.data)
							$scope.dropdownSelected = true;

						}
					});
				} else if ($scope.custom) {
					RefService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == "Error") {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.defaultCallValues(items.data)
							$scope.dropdownSelected = true;
						}

					});
				}
			}
		}

		$scope.AllPaymentsGlobalData = AllPaymentsGlobalData;
		delete $scope.AllPaymentsGlobalData.allPaymentDetails;

		return $scope.AllPaymentsGlobalData;

	}

	$scope.retainAlert = function (eve) {

		$(eve.currentTarget).parent().removeClass('in')
		$scope.showSearchWarning = false;
	}

	$scope.rstAdvancedSearchFlag = function () {

		if ($scope.advancedSearchEnable == false) {
			$scope.AdsearchParams = {
				"InstructionData" : {
					"ReceivedDate" : {
						"Start" : "",
						"End" : ""
					},
					"ValueDate" : {
						"Start" : "",
						"End" : ""
					},
					"Amount" : {
						"Start" : "",
						"End" : ""
					}
				}

			};
			$scope.search = angular.copy($scope.AdsearchParams);
		}
		GlobalService.PaymentAdvancedSearch = true;
		$scope.PaymentAdvancedSearch = true;
		$scope.amountAlert = false;
	}

	$scope.resetFilter = function () {
		$scope.showSearchWarning = false;

		setTimeout(function () {
			$scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
			$scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
		}, 200)

		$scope.AdsearchParams = {
			"InstructionData" : {
				"ReceivedDate" : {
					"Start" : "",
					"End" : ""
				},
				"ValueDate" : {
					"Start" : "",
					"End" : ""
				},
				"Amount" : {
					"Start" : "",
					"End" : ""
				}
			}

		};
		$scope.initializeSetting()
		$scope.search = angular.copy($scope.AdsearchParams);

		$scope.isAdvacedSearchClicked = false;

		$('#saveSearchBtn,#AdSearchBtn').removeAttr('disabled', 'disabled');
		AllPaymentsGlobalData.searchNameDuplicated = false;
		AllPaymentsGlobalData.SelectSearchVisible = false;

		$scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
		$scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')

		$timeout(function () {
			$scope.triggerSelect2();
		}, 10)

		$timeout(function () {

			for (var i in $scope.FieldsValues) {
				if ($scope.FieldsValues[i].type == 'dropdown') {
					$('[name=' + $scope.FieldsValues[i].value + ']').select2();
					$('[name=' + $scope.FieldsValues[i].value + ']').select2('val', '');
				}
			}
		}, 0)

		if ($scope.advancedSearchEnable) {
			$scope.UIR = false;
			$scope.paylistsearchValue = '';
			AllPaymentsGlobalData.advancedSearchEnable = false;
			$scope.advancedSearchEnable = false;

			AllPaymentsGlobalData.orderByField = 'ReceivedDate';
			$scope.orderByField = AllPaymentsGlobalData.orderByField;
			AllPaymentsGlobalData.sortReverse = false;
			$scope.sortReverse = AllPaymentsGlobalData.sortReverse;
			AllPaymentsGlobalData.sortType = 'Desc';
			$scope.sortType = AllPaymentsGlobalData.sortType;

			AllPaymentsGlobalData.isSortingClicked = false;
			$scope.isSortingClicked = AllPaymentsGlobalData.isSortingClicked;

			AllPaymentsGlobalData.DataLoadedCount = 20;
			$scope.aa = AllPaymentsGlobalData.DataLoadedCount; ;
			$scope.DataLoadedCount = AllPaymentsGlobalData.DataLoadedCount;

			if ($scope.all) {
				$scope.nothingSelected = true;
				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "All").then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
						$scope.wildcard = false;
					}
				});

			} else if ($scope.today) {
				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Today").then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}

				});
			} else if ($scope.week) {

				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Week").then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}
				});

			} else if ($scope.month) {
				RefService.filterData($scope.txtValfn(), $scope.orderByField, $scope.sortType, "Month").then(function (items) {

					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}

				});
			} else if ($scope.custom) {
				RefService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == "Error") {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.defaultCallValues(items.data)
						$scope.dropdownSelected = true;
					}

				});
			}
		}
	}

	$scope.checkDropdownSelected = function (data) {
		if (data == 'search') {
			AllPaymentsGlobalData.SelectSearchVisible = false;
			$scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;
		} else {
			AllPaymentsGlobalData.SelectSearchVisible = true;
			$scope.SelectSearchVisible = AllPaymentsGlobalData.SelectSearchVisible;
		}
	}

	$scope.showAlertMsg = false;
	$scope.confirmationAlert = function (index) {
		$scope.showAlertMsg = true;
		$scope.selectedSearchName = index;
		$scope.DeleteSearchName = $scope.lskey[$scope.selectedSearchName];
	}

	$scope.deleteSelectedSearch = function (eve) {
		userData.savedSearch.AllPayments.splice($scope.selectedSearchName - 1, 1)
		updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function (response) {
			$scope.testing();
		})

		$('#alertBox').modal('hide');
	};

	$scope.focusInfn = function (data) {

		$('#' + data).focus()
	}

	$scope.toggleFocus = function (event, index, active) {
		var val = event.currentTarget
			var id = $(val).attr('id')

			if (event.keyCode == 13) {

				$scope.active = !$scope.active;

				$scope.SelectValue(index);

				if ($('#' + id).hasClass('checked')) {
					$('#' + id).removeClass('checked')
				} else {
					$('#' + id).addClass('checked');
					console.log("calling here")
					$scope.triggerSelect2()
				}
			}
	}

	$scope.customDateRangePicker = function (sDate, eDate) {
		var startDate = new Date();
		var FromEndDate = new Date();
		var ToEndDate = new Date();
		ToEndDate.setDate(ToEndDate.getDate() + 365);
		$('#' + sDate).datepicker({
			weekStart : 1,
			startDate : '1900-01-01',
			minDate : 1,
			//endDate: FromEndDate,
			autoclose : true,
			format : 'yyyy-mm-dd'
		}).on('changeDate', function (selected) {
			startDate = new Date(selected.date.valueOf());
			startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
			$('#' + eDate).datepicker('setStartDate', startDate);
		});

		$('#' + sDate).datepicker('setEndDate', FromEndDate);
		$('#' + eDate).datepicker({
			weekStart : 1,
			startDate : startDate,
			endDate : ToEndDate,
			autoclose : true,
			format : 'yyyy-mm-dd'
		})
		.on('changeDate', function (selected) {
			FromEndDate = new Date(selected.date.valueOf());
			FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
			$('#' + sDate).datepicker('setEndDate', FromEndDate);
		});
		$('#' + eDate).datepicker('setStartDate', startDate);
	}
	// $scope.customDateRangePicker('EntryStartDate','EntryEndDate')
	$timeout(function () {
		$scope.customDateRangePicker('ReceivedDateStart', 'ReceivedDateEnd')
		$scope.customDateRangePicker('ValueDateStart', 'ValueDateEnd')
	}, 500)
	$scope.customDateRangePicker('startDate', 'endDate')

	$scope.customPicker = function (sDate, eDate) {
		var startDate = new Date();
		var FromEndDate = new Date();
		var ToEndDate = new Date();
		ToEndDate.setDate(ToEndDate.getDate() + 365);
		console.log(ToEndDate)

		$('#' + sDate).datetimepicker({
			weekStart : 1,
			startDate : '1900-01-01',
			minDate : 1,
			//endDate: FromEndDate,
			autoclose : true,
			format : 'YYYY-MM-DD'
		}).on('click.togglePicker', function (selected) {
			console.log(selected)

			//startDate = new Date(selected.date.valueOf());
			//startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
			//$('#'+eDate).datetimepicker('setStartDate', startDate);

		});

		$('#' + sDate).datetimepicker('setEndDate', FromEndDate);
		$('#' + eDate).datetimepicker({
			weekStart : 1,
			startDate : startDate,
			endDate : ToEndDate,
			autoclose : true,
			format : 'YYYY-MM-DD'
		})
		.on('click.togglePicker', function (selected) {

			FromEndDate = new Date(selected.date.valueOf());
			FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
			$('#' + sDate).datetimepicker('setEndDate', FromEndDate);
		});
		$('#' + eDate).datetimepicker('setStartDate', startDate);
	}

	$timeout(function () {

		// $scope.customPicker('ReceivedDateStart','ReceivedDateEnd')
	}, 500)

	$scope.CustomDatesReset = function () {
		$scope.startDate = '';
		$scope.endDate = '';
		$('#okBtn').attr('disabled', 'disabled')
		$scope.customDateRangePicker('startDate', 'endDate')
	}
	$scope.listTooltip = "List View";
	$scope.gridTooltip = "Grid View";

	// $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
	// if ($scope.changeViewFlag) {

	// 	$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');

	// 	$scope.changeViewFlag = true;

	// } else {

	// 	$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
	// 	$scope.changeViewFlag = false;
	// }

	function autoScrollDiv() {
		$(".dataGroupsScroll").scrollTop(0);
	}

	/* used to store select view in the global variable for furture use */
	$scope.$watch('changeViewFlag', function (newValue, oldValue, scope) {
		GlobalService.viewFlag = newValue;
		var checkFlagVal = newValue;
		if (checkFlagVal) {
			$(".floatThead ").find("thead").hide();
			autoScrollDiv();
		} else {
			$(".floatThead ").find("thead").show();
			if ($(".dataGroupsScroll").scrollTop() == 0) {
				$table = $("table.stickyheader")
					$table.floatThead('destroy');

			}
			autoScrollDiv();
		}

	})

	/*$scope.hello = function (value, eve) {
	var hitId = eve.currentTarget.id;

	$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
	$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');

	if (value == "list") {
	$scope.changeViewFlag = !$scope.changeViewFlag;

	} else if (value == "grid") {
	$scope.changeViewFlag = !$scope.changeViewFlag;
	} else {
	$scope.changeViewFlag = !$scope.changeViewFlag;
	}

	GlobalService.viewFlag = $scope.changeViewFlag;
	}*/

	/*** Export to Excel ***/
	$scope.exportToExcel = function (eve) {

		// var table_html = $('#exportContent').html();
		// console.log(table_html)
		bankData.exportToExcelHtml($('#dummyExportContent').html(), 'All Payments');
		//var table_html = $('#exportContent').html();
		//bankData.exportToExcel(table_html, 'All Payments');


		// $scope.dat = angular.copy($scope.items);
		// $scope.dat.shift();

		// JSONToCSVConvertor(bankData,$scope.dat, 'AllPayments', true);


	}

	/*** Print Function ***/
	$scope.printFn = function () {

		$('#dummyExportContent').find('th').removeAttr('nowrap')
		window.print()
		$('#dummyExportContent').find('th').attr('nowrap', true)
	}

	/*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

	$scope.widthOnScroll = function () {
		var mq = window.matchMedia("(max-width: 991px)");
		var headHeight
		if (mq.matches) {
			headHeight = 0;
			$scope.alertWidth = $('.pageTitle').width();
		} else {
			$scope.alertWidth = $('.pageTitle').width();
			headHeight = $('.page-header').outerHeight(true) + 10;
		}
		$scope.alertStyle = headHeight;
	}

	$scope.widthOnScroll();

	/*** On window resize ***/
	$(window).resize(function () {
		$scope.$apply(function () {
			$scope.alertWidth = $('.alertWidthonResize').width();
		});

	});

	$scope.allowOnlyNumbersAlone = function ($event, field) {
		// console.log($event,field)
		// if(field == 'Instruction ID'){
		var txt = String.fromCharCode($event.which);
		//console.log(txt + ' : ' + $event.which);
		if (!txt.match(/[0-9]/)) //+#-.
		{
			//console.log(!txt.match(/[0-9]/))
			$event.preventDefault();
		}
		// }
		// $($event.currentTarget).val($($event.currentTarget).val().replace(/[^0-9\.]/g, ''));
		// if (($event.which != 46 || $($event.currentTarget).val().indexOf('.') != -1) && ($event.which < 48 || $event.which > 57)) {
		// 	$event.preventDefault();
		// }

		/* if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		// Allow: Ctrl+A, Command+A
		(e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
		// Allow: home, end, left, right, down, up
		(e.keyCode >= 35 && e.keyCode <= 40)) {
		// let it happen, don't do anything
		return;
		}
		// Ensure that it is a number and stop the keypress
		if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		e.preventDefault();
		}*/

	}

	$scope.allowNumberWithDecimal = function ($event) {

		if (($event.keyCode == 46) || ($event.charCode == 46)) {
			$($event.currentTarget).val($($event.currentTarget).val().replace(/[^0-9\.]/g, ''));

		}

		if (($event.which != 46 || $($event.currentTarget).val().indexOf('.') != -1) && ($event.which < 48 || $event.which > 57)) {
			$event.preventDefault();
		}

	}

	$scope.notAllowAnything = function (eve) {
		console.log(eve.keyCode)
		if ((eve.keyCode == 8) || (eve.keyCode == 9)) {
			return;
		} else {
			eve.preventDefault();
		}
	}

	$scope.checkAll = function (evt) {
		$scope.selectedAll = $(evt.currentTarget).prop('checked');
		angular.forEach($scope.items, function (item) {
			item.Selected = $scope.selectedAll;
		});

	};

	$scope.enableBulkActions = '';
	function getForceAction(firstObj) {

		$http.post(BASEURL + '/rest/v2/partyserviceassociations/read', {
			'PartyServiceAssociationCode' : firstObj.InstructionData.PartyServiceAssociationCode
		}).then(function (response) {
			$scope.ProcessCode = response.data.ProcessCode;

			$http.post(BASEURL + '/rest/v2/actions', {
				"ProcessStatus" : firstObj.Status,
				"WorkFlowCode" : "PAYMENT",
				"ProcessName" : $scope.ProcessCode
			}).then(function (response) {
				if (response.data.length > 0) {
					$scope.enableBulkActions = response.data;
				} else {}
				//console.log(response.data);
			}, function (err) {
				//console.error('ERR', err);
			})

		}, function (err) {
			//console.error('ERR', err);
		})
	}

	/*
	$http.get(BASEURL+RESTCALL.ClearingHouse).success(function(data){
	$scope.clearingHouseVal = data;
	}).error(function(data){
	})*/

	$scope.dependsCycle = function (data) {
		if (data) {
			$http({
				url : BASEURL + RESTCALL.dependsCycle,
				method : "GET",
				params : {
					clearingCode : data
				}
			}).success(function (data) {
				$scope.cycleCode = data;
			}).error(function (data) {
				$scope.cycleCode = "";
			});
		} else {
			$scope.cycleCode = "";
		}

	}

	$scope.checkStatus = function (event, allpayments1) {
		console.log(allpayments1)
		$scope.allowedStatus = allpayments1;

		if ($(event.currentTarget).prop("checked")) {

			for (var i in $scope.items) {
				if (allpayments1 == $scope.items[i].Status) {}
				else {
					$('#check_' + i).attr('disabled', true)
				}
			}
		} else {
			$('.checkBoxClass').attr('disabled', false)
		}

	}

	$('.cHouseBtn').addClass('disabledBtnColor')

	$scope.CHouse1 = {
		"clearingHouse" : "",
		"cycles" : ""
	};

	$scope.checkStatusForBulk = function (event, allpayments1, index) {
		$scope.anythingChecked = false;

		$scope.allowedStatus = allpayments1;

		/*if ($(event.currentTarget).prop("checked")) {
		for (var i in $scope.items) {
		if (allpayments1 == $scope.items[i].Status) {
		}
		else {
		$('#check_' + i).attr('disabled', true)
		}
		}
		} else {
		$('.checkBoxClass').attr('disabled', false)
		}*/

		$scope.cMOPArr = [];

		for (var i in $scope.items) {
			if ($('#check_' + i).prop("checked")) {
				$scope.anythingChecked = true;
				$scope.cMOPArr.push($scope.items[i].DestinationMessageType)
			}
		}

		if ($scope.anythingChecked) {
			$('.cHouseBtn').removeClass('disabledBtnColor')
		} else {
			$('.cHouseBtn').addClass('disabledBtnColor')
		}

		$scope.uniqMopArr = uniques($scope.cMOPArr)

			if ($scope.uniqMopArr.length > 1) {
				$scope.mopWarnTxt = "Please select unique MOP"
					$scope.CHouse1.clearingHouse = ""

					$scope.alertTxt = true;

				/* $scope.alerts = [{
				type : 'danger',
				msg : 'Please select unique MOP'
				}]*/
				//$('#cCycle').addClass('disabledBtnColor')
				//$('.cHouseBtn').addClass('disabledBtnColor')


			} else {
				$scope.mopWarnTxt = "";
				$scope.CHouse1.clearingHouse = $scope.uniqMopArr[0];
				$scope.alertTxt = false;

				$('.alert-danger').hide()
				//$('.cHouseBtn').removeClass('disabledBtnColor')
				// $('#cCycle').removeClass('disabledBtnColor')
			}

	}

	$scope.resetObj = function (flag) {
		$scope.CHouse = {
			"clearingHouse" : ""
		};
		$scope.CHouse2 = {
			"clearingHouse" : "",
			"cycles" : ""
		};

		$scope.CHouse1.cycles = "";

		$scope.cycleCode = [];

		if (flag) {
			if (!$scope.alertTxt) {
				$('.alert-danger').hide()

				$http({
					url : BASEURL + RESTCALL.dependsCycle,
					method : "GET",
					params : {
						clearingCode : $scope.CHouse1.clearingHouse
					}
				}).success(function (data) {
					$scope.cycleCode = data;
				}).error(function (data) {
					$scope.cycleCode = [];
				});

			} else {
				$scope.alerts = [{
						type : 'danger',
						msg : 'Please select unique MOP'
					}
				]
			}
		}
	}

	$scope.changeClearing = function (data) {
		$scope.temArr = [];
		//console.log($scope.items)
		$scope.inputObj = {}
		$scope.inputObj.cycle = data.cycles;
		$scope.inputObj.clearing = data.clearingHouse;
		$scope.inputObj.user = sessionStorage.UserID;

		for (var i in $scope.items) {
			if ($('#check_' + i).prop("checked")) {
				$scope.temArr.push($scope.items[i].PaymentID)
			}
		}

		$scope.inputObj.paymentIds = $scope.temArr.join(',');
		console.log($scope.inputObj)

		$http.post(BASEURL + RESTCALL.submitCHouse, $scope.inputObj).success(function (data) {

			/*$state.go('app.newmodules', {url:'bulkpayments',tempUrl:"plug-ins/modules/bulkpayments",contrl:'paymentforbulkingCtrl'});*/

			// $state.reload()

			$scope.initialCall($scope.advancedSearchEnable)

		}).error(function (data) {

			$scope.alerts = [{
					type : 'danger',
					msg : data.error.message
				}
			]
		})

		$('.modal').modal('hide')

		$scope.alerts = [{
				type : 'success',
				msg : "Success"
			}
		];

		//submitCHouse


	}

	function objectFindByKey(array, key, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	}

	function statusBasedActions() {

		$scope.enableActionbuttons = '';
		if (sessionStorage.ColpData != undefined) {
			$scope.ColpData = JSON.parse(atob(sessionStorage.ColpData));
			//console.log($scope.ColpData);
			if ($scope.ColpData.length > 0) {
				var thisPageNewActions = objectFindByKey($scope.ColpData, 'Page', $location.path());

				if (thisPageNewActions.Page == $location.path()) {

					for (i = 0; i < thisPageNewActions.Actions.length; i++) {

						//console.log(Object.keys(AllPaymentsGlobalData.searchParams).indexOf("Status"),(thisPageNewActions.Actions[i].CurrentStatus),AllPaymentsGlobalData.searchParams,$scope.AdsearchParams)

						if (Object.keys(AllPaymentsGlobalData.searchParams).indexOf("Status") != -1) {

							//console.log(thisPageNewActions.Actions[i].CurrentStatus,AllPaymentsGlobalData.searchParams)
							if (AllPaymentsGlobalData.searchParams.Status) {

								if ((thisPageNewActions.Actions[i].CurrentStatus == AllPaymentsGlobalData.searchParams.Status[0])) {

									$scope.enableActionbuttons = thisPageNewActions.Actions[i].DropDownList.length;
									$scope.BRActions = thisPageNewActions.Actions[i].DropDownList;
									// console.log($scope.BRActions);
									$scope.toActionObject = thisPageNewActions;
								}
							}
						}

					}

				}
			}
		}
	}
	statusBasedActions()

	function toGetBulkorReverseObj(items1, actions) {
		//console.log(items1)
		//console.log(actions)

		var obj1 = {};
		var PID = '';
		for (i = 0; i < items1.length; i++) {
			if (items1[i].Selected == true) {

				PID += items1[i].PaymentID + ',';

			}
		}
		PID = PID.substring(0, PID.length - 1);
		obj1.urid = PID;
		//obj1.datetime="";
		obj1.status = actions;
		obj1.actionuser = {
			"username" : sessionStorage.UserID
		};
		return obj1;
	}

	$scope.forceAction = function (items, actions) {

		// console.log(items)
		// console.log(actions)

		var actions123 = actions; // JSON.parse(actions)
		var data123 = toGetBulkorReverseObj(items, actions123);
		var method = $scope.toActionObject.REST_Method;
		var REST_URL = $scope.toActionObject.REST;

		console.log(data123)

		$http({
			url : BASEURL + REST_URL,
			method : method,
			data : data123,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			$scope.alerts = [{
					type : 'success',
					msg : 'Success'
				}
			];
			$location.path($scope.toActionObject.SuccessURL);
		}).error(function (data, status, headers, config) {
			$scope.alerts = [{
					type : 'danger',
					msg : data.error.message
				}
			];
			if ($scope.toActionObject.failureURL != '') {
				$location.path($scope.toActionObject.failureURL);
			}
		});

	}

	$(document).ready(function () {
		$(".FixHead").scroll(function (e) {
			var $tablesToFloatHeaders = $('table');
			//console.log($tablesToFloatHeaders)
			$tablesToFloatHeaders.floatThead({
				//useAbsolutePositioning: true,
				scrollContainer : true
			})
			$tablesToFloatHeaders.each(function () {
				var $table = $(this);
				//console.log($table.find("thead").length)
				$table.closest('.FixHead').scroll(function (e) {
					$table.floatThead('reflow');
				});
			});
		})

		$(window).bind("resize", function () {

			setTimeout(function () {
				autoScrollDiv();
			}, 300)
			if ($(".dataGroupsScroll").scrollTop() == 0) {
				$(".dataGroupsScroll").scrollTop(50)
			}

		})

		//$(window).trigger('resize');

	})

	$scope.callthis = function () {
		console.log('came')
		return 10
	}

	// $(document).ready(function(){
	// 	for(i=0;i<$scope.FieldsValues.length;i++)
	// 	{
	// 		if( i%2 == 1)
	// 		{
	// 			$(".row").find("#clearSpace"+i).after("<div class='clearfix'></div>")
	// 			// console.log($(".row").find("#clearSpace"+i),i)
	// 		}
	// 	}
	// })

});