VolpayApp.controller('fileListController', function ($scope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService) {

	sidebarMenuControl('PaymentModule', 'ReceivedInstructions');

	clearInterval(menuInterval)

	sessionStorage.menuSelection = JSON.stringify({
			'val' : 'PaymentModule',
			'subVal' : 'ReceivedInstructions'
		})
		checkMenuOpen()

		$scope.loadCnt = 0;

	if (GlobalService.fileDetailStatus.Msg) {

		$scope.type = "success";
		$scope.alerts = [{
				type : $scope.type,
				msg : GlobalService.fileDetailStatus.Msg
			}
		];

		$timeout(function () {
			GlobalService.fileDetailStatus = {
				"Status" : "",
				"Msg" : ""

			}
		}, 4000)

	}

	$scope.isSearchNameFilled = false;
	$scope.startDate = GlobalService.startDate;
	$scope.endDate = GlobalService.endDate;
	$scope.isCollapsed = true;

	$scope.isSortingClicked = GlobalService.isSortingClicked;
	delete sessionStorage.FileListCurrentRESTCALL;

	$scope.lskey = ["New Search"];
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
				for (var i in $scope.uData.savedSearch.FileList) {
					$scope.lskey.push($scope.uData.savedSearch.FileList[i].name)
				}
		}).error(function (error) {
			$translate.use("en_US");
		})
	}

	$scope.testing();

	$scope.all = GlobalService.all;
	$scope.today = GlobalService.today;
	$scope.week = GlobalService.week;
	$scope.month = GlobalService.month;
	$scope.custom = GlobalService.custom;
	$scope.UIR = false;
	$scope.customDateFilled = false;
	$scope.alertMsg = false;
	$scope.nothingSelected = true;
	$scope.dropdownSelected = false;
	$scope.isCustomDateCollapsed = true;
	$scope.isEntered = GlobalService.isEntered;
	$scope.searchClicked = GlobalService.searchClicked;
	$scope.advancedSearchEnable = GlobalService.advancedSearchEnable;
	$scope.showSeachParams = true;

	$scope.additionalWhereClauses = '';
	$scope.esearch = GlobalService.FLuir;

	/*if (localStorage.languageSelected == 'es_ES') {
	if (GlobalService.selectCriteriaTxt == 'All') {
	GlobalService.selectCriteriaTxt = 'Todas';
	} else if (GlobalService.selectCriteriaTxt == 'Today') {
	GlobalService.selectCriteriaTxt = 'Hoy';
	} else if (GlobalService.selectCriteriaTxt == 'Week') {
	GlobalService.selectCriteriaTxt = 'Semana';
	} else if (GlobalService.selectCriteriaTxt == 'Month') {
	GlobalService.selectCriteriaTxt = 'Mes';
	} else if (GlobalService.selectCriteriaTxt == 'Custom') {
	GlobalService.selectCriteriaTxt = 'Personalizado';
	}
	} else if (localStorage.languageSelected == 'en_US') {
	if (GlobalService.selectCriteriaTxt == 'Todas') {
	GlobalService.selectCriteriaTxt = 'All';
	} else if (GlobalService.selectCriteriaTxt == 'Hoy') {
	GlobalService.selectCriteriaTxt = 'Today';
	} else if (GlobalService.selectCriteriaTxt == 'Semana') {
	GlobalService.selectCriteriaTxt = 'Week';
	} else if (GlobalService.selectCriteriaTxt == 'Mes') {
	GlobalService.selectCriteriaTxt = 'Month';
	} else if (GlobalService.selectCriteriaTxt == 'Personalizado') {
	GlobalService.selectCriteriaTxt = 'Custom';
	}
	}*/

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

			$scope.dynamicArr = ["InputReferenceCode"]
			for (var i in $scope.dynamicArr) {
				$("select[name=" + $scope.dynamicArr[i] + "]").select2()
			}

		}).error(function (data) {})
	}

	$scope.$watch("searchname", function (val) {
		$scope.searchNameDuplicated = false;
	})

	$('#dropdownBtnTxt').html(GlobalService.selectCriteriaTxt)
	$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
	$('#menulist_' + GlobalService.selectCriteriaID).addClass('listSelected').removeClass('listNotSelected');

	$scope.toggleAdvancedSeach = function () {
		$scope.advancedSearch = !$scope.advancedSearch;
		$scope.showSearchWarning = false;
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

	$scope.items = [];
	$scope.busy = false;

	$scope.triggerSelect2 = function () {

		for (i in $scope.FieldsValues) {
			if ($scope.FieldsValues[i]['type'] == 'dropdown') {
				$("[name=" + $scope.FieldsValues[i].value + "]").select2();
				$scope.remoteDataConfig()
				//console.log($scope.FieldsValues[i])
			}
		}

		$scope.setInitval()

		for (i in GlobalService.searchParams) {

			if (GlobalService.searchParams[i] == 'InstructionData') {

				for (j in GlobalService.searchParams[i]) {
					$scope.AdsearchParams[i][j] = GlobalService.searchParams[i][j];
					$scope.search[i][j] = GlobalService.searchParams[i][j];
				}
			} else {
				$scope.AdsearchParams[i] = GlobalService.searchParams[i];
				$scope.search[i] = GlobalService.searchParams[i];

				//console.log(i,$scope.search[i])
				$("[name=" + i + "]").select2('val', $scope.search[i])

			}

		}

	}

	$scope.txtValfn = function () {
		var txtVal = ''
			if ($scope.esearch) {
				txtVal = $scope.esearch
					$scope.UIR = true;
			} else {
				txtVal = ''
					$scope.UIR = false;
			}
			return txtVal;
	}

	$scope.alertToggle = function () {
		if ($scope.items.length == 0) {
			$scope.alertMsg = true;
		} else {
			$scope.alertMsg = false;
		}
	}

	$scope.orderByField = GlobalService.orderByField; // set the default sort type
	$scope.sortReverse = GlobalService.sortReverse;
	$scope.sortType = GlobalService.sortType;

	$scope.aa = GlobalService.DataLoadedCount;

	$scope.defaultCallValues = function (items) {
		$scope.items = items;

		$scope.loadedCnt = $scope.items.length;
		$scope.loadedData = items;
		$scope.alertToggle();

		$('.alert-danger').hide()

	}

	$scope.advancedDefaultval = function (items) {

		$scope.items = items;
		$scope.loadedCnt = $scope.items.length;
		$scope.loadedData = items;
		$scope.alertMsg = false;

		$('.alert-danger').hide()
	}

	$scope.search = {
		"InstructionData" : {
			"EntryDate" : {
				"Start" : "",
				"End" : ""
			}
		}
	}

	$scope.AdsearchParams = angular.copy($scope.search)

		/*  $http.post(BASEURL+RESTCALL.FileCurrencies,{"start":0,"count":20}).success(function(data){

		console.log(data)

		}).error(function(error){
		}) */

	function initialCall(adSearch) {
		if (!adSearch) {
			if ($scope.all) {

				$scope.nothingSelected = true;
				PersonService.filterData($scope.txtValfn(), "All", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						if (items.data.error.code == 401) {
							if (configData.Authorization == 'External') {
								window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
							} else {
								LogoutService.Logout();
							}
						} else {
							$scope.showErrorMessage(items)
							$scope.alertMsg = true;
						}
					} else {
						$scope.defaultCallValues(items.data)
						$scope.alertMsg = false;
					}
				});
			} else if ($scope.today) {
				$scope.todayDate = GlobalService.todayDate;
				$scope.nothingSelected = false;

				PersonService.filterData($scope.txtValfn(), "Today", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				});

			} else if ($scope.week) {
				$scope.nothingSelected = false;
				$scope.weekStart = GlobalService.weekStart;
				$scope.weekEnd = GlobalService.weekEnd;

				PersonService.filterData($scope.txtValfn(), "Week", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				});

			} else if ($scope.month) {
				$scope.monthStart = GlobalService.monthStart;
				$scope.monthEnd = GlobalService.monthEnd;
				$scope.nothingSelected = false;

				PersonService.filterData($scope.txtValfn(), "Month", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				});

			} else if ($scope.custom) {

				$scope.nothingSelected = false;
				$scope.startDate = GlobalService.startDate;
				$scope.endDate = GlobalService.endDate;

				$scope.ShowStartDate = GlobalService.startDate;
				$scope.ShowEndDate = GlobalService.endDate;
				PersonService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}

				});
			}
		} else {

			$scope.search = {
				"InstructionData" : {
					"EntryDate" : {
						"Start" : "",
						"End" : ""
					}
				}
			}

			$scope.AdsearchParams = angular.copy($scope.search)

				$scope.isAdvacedSearchClicked = true;

			console.log("searchParams", GlobalService.searchParams)
			for (i in GlobalService.searchParams) {
				// console.log(i,GlobalService.searchParams[i])
				if (GlobalService.searchParams[i] == 'InstructionData') {
					for (j in GlobalService.searchParams[i]) {
						$scope.AdsearchParams[i][j] = GlobalService.searchParams[i][j];
						$scope.search[i][j] = GlobalService.searchParams[i][j];
					}
				} else {

					//   delete GlobalService.searchParams[i]['$$hashKey']

					$scope.AdsearchParams[i] = GlobalService.searchParams[i];
					$scope.search[i] = GlobalService.searchParams[i];

					console.log("11", $scope.search[i])
				}

			}

			if (GlobalService.fromMyProfilePage) {
				var FieldArr = GlobalService.FieldArr;
			} else if (GlobalService.fromDashboard) {
				var FieldArr = GlobalService.FieldArr;

				for (var i in FieldArr) {
					if (FieldArr[i].indexOf("InputReferenceCode") != -1) {
						$scope.fileChannelPSA = FieldArr[i].split("=")[1]
					}

				}
			} else {

				GlobalService.fromMyProfilePage = false;
				var FieldArr = JSON.parse(sessionStorage.advancedSearchFieldArr)
					//var FieldArr = JSON.parse(sessionStorage.advancedSearchFieldArr)
			}

			$scope.AdsearchParams = removeEmptyValueKeys($scope.AdsearchParams)

				$scope.triggerSelect2();

			$scope.setInitval()

			if ($scope.all) {
				$scope.nothingSelected = true;
				PersonService.retainSearchResults(FieldArr, $scope.aa, "All", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}

				})
			} else if ($scope.today) {
				$scope.nothingSelected = false;
				$scope.todayDate = GlobalService.todayDate;
				PersonService.retainSearchResults(FieldArr, $scope.aa, "Today", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			} else if ($scope.week) {
				$scope.nothingSelected = false;
				$scope.weekStart = GlobalService.weekStart;
				$scope.weekEnd = GlobalService.weekEnd;

				PersonService.retainSearchResults(FieldArr, $scope.aa, "Week", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			} else if ($scope.month) {
				$scope.nothingSelected = false;
				$scope.monthStart = GlobalService.monthStart;
				$scope.monthEnd = GlobalService.monthEnd;

				PersonService.retainSearchResults(FieldArr, $scope.aa, "Month", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			} else if ($scope.custom) {
				$scope.nothingSelected = false;
				$scope.startDate = GlobalService.startDate;
				$scope.endDate = GlobalService.endDate;

				$scope.ShowStartDate = GlobalService.startDate;
				$scope.ShowEndDate = GlobalService.endDate;

				PersonService.retainCustomSearchResults(FieldArr, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			}
		}
	}

	initialCall($scope.advancedSearchEnable)

	// $scope.triggerSelect2 = function()
	// {
	// 		$(".js-multiple-filelist").select2({

	// 					allowClear : true
	// 			});
	// }

	if ($scope.esearch != '') {
		$scope.globalEsearch = GlobalService.FLuir;
		$scope.nothingSelected = false;
	} else {
		//$scope.nothingSelected = true;
		$scope.globalEsearch = GlobalService.FLuir;
	}

	$scope.DataLoadedCount = GlobalService.DataLoadedCount;

	$scope.Sorting = function (orderByField) {
		$scope.aa = $scope.DataLoadedCount;
		$scope.prevLen = -1;
		GlobalService.isSortingClicked = true;
		$scope.isSortingClicked = GlobalService.isSortingClicked;

		GlobalService.orderByField = orderByField;
		$scope.orderByField = GlobalService.orderByField;
		GlobalService.sortReverse = !GlobalService.sortReverse;
		$scope.sortReverse = GlobalService.sortReverse;

		if ($scope.sortReverse == false) {
			GlobalService.sortType = 'Desc';
			$scope.sortType = GlobalService.sortType;
		} else {
			GlobalService.sortType = 'Asc';
			$scope.sortType = GlobalService.sortType;
		}

		if (!$scope.advancedSearchEnable) {

			if ($scope.all) {
				PersonService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'all').then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.loadedData = items.data;
						$scope.items = items.data;
						$scope.alertToggle();

					}
				});

			} else if ($scope.today) {
				$scope.nothingSelected = false;
				GlobalService.todayDate = todayDate();
				$scope.todayDate = GlobalService.todayDate;
				PersonService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Today').then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.items = items.data;
						$scope.loadedData = items.data;
						GlobalService.allPaymentDetails = items.data;
						$scope.alertMsg = false;
						$scope.dropdownSelected = true;
					}

				});
			} else if ($scope.week) {
				$scope.nothingSelected = false;
				GlobalService.weekStart = week().lastDate;
				GlobalService.weekEnd = week().todayDate;
				$scope.weekStart = GlobalService.weekStart;
				$scope.weekEnd = GlobalService.weekEnd;
				PersonService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Week').then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.items = items.data;
						$scope.loadedData = $scope.items;
						GlobalService.allPaymentDetails = $scope.items;
						$scope.alertMsg = false;
						$scope.dropdownSelected = true;
					}
				});

			} else if ($scope.month) {
				$scope.nothingSelected = false;
				GlobalService.monthStart = month().lastDate;
				GlobalService.monthEnd = month().todayDate;

				$scope.monthStart = GlobalService.monthStart;
				$scope.monthEnd = GlobalService.monthEnd;
				PersonService.getFeedNewAllSorting($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, 'Month').then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.items = items.data;
						$scope.loadedData = $scope.items;
						$scope.dropdownSelected = true;
					}

				});
			} else if ($scope.custom) {
				$scope.startDate = GlobalService.startDate;
				$scope.endDate = GlobalService.endDate;
				$scope.nothingSelected = false;

				PersonService.getFeedNewAllCustomSorting($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.items = items.data;
						$scope.loadedData = $scope.items;
						$scope.dropdownSelected = true;
					}
				});
			}
		} else {
			var FieldArr = JSON.parse(sessionStorage.advancedSearchFieldArr)

				if ($scope.all) {
					$scope.nothingSelected = true;
					PersonService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					})
				} else if ($scope.today) {
					GlobalService.todayDate = todayDate();
					$scope.todayDate = GlobalService.todayDate;
					$scope.nothingSelected = false;
					PersonService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					})
				} else if ($scope.week) {
					GlobalService.weekStart = week().lastDate;
					GlobalService.weekEnd = week().todayDate;
					$scope.weekStart = GlobalService.weekStart;
					$scope.weekEnd = GlobalService.weekEnd;
					$scope.nothingSelected = false;
					PersonService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					})
				} else if ($scope.month) {
					GlobalService.monthStart = month().lastDate;
					GlobalService.monthEnd = month().todayDate;
					$scope.monthStart = GlobalService.monthStart;
					$scope.monthEnd = GlobalService.monthEnd;
					$scope.nothingSelected = false;
					PersonService.advancedSearchSorting($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					})
				} else if ($scope.custom) {
					$scope.nothingSelected = false;
					$scope.startDate = GlobalService.startDate;
					$scope.endDate = GlobalService.endDate;
					PersonService.advancedSearchCustomSorting($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					})
				}
		}
	}

	//$scope.aa = 20;
	$scope.loadMore = function () {

		val = $scope.esearch;
		if (!$scope.advancedSearchEnable) {

			if (!$scope.isSortingClicked) {
				if ($scope.all) {
					PersonService.filterDataLoadmore($scope.txtValfn(), $scope.aa, "All", $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							$scope.loadedCnt = $scope.items.length;
						} else {
							$scope.loadedData = [];
						}
					});
					$scope.aa = $scope.aa + 20;
				} else if ($scope.today) {

					PersonService.filterDataLoadmore($scope.txtValfn(), $scope.aa, "Today", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							$scope.loadedCnt = $scope.items.length;

						} else {
							$scope.loadedData = [];
						}
					});
					$scope.aa = $scope.aa + 20;

				} else if ($scope.week) {
					PersonService.filterDataLoadmore($scope.txtValfn(), $scope.aa, "Week", $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							$scope.loadedCnt = $scope.items.length;

						} else {
							$scope.loadedData = [];
						}
					});
					$scope.aa = $scope.aa + 20;
				} else if ($scope.month) {
					PersonService.filterDataLoadmore($scope.txtValfn(), $scope.aa, "Month", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							$scope.loadedCnt = $scope.items.length;

						} else {
							$scope.loadedData = [];
						}
					});
					$scope.aa = $scope.aa + 20;
				} else if ($scope.custom) {
					PersonService.customSearchloadmore($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.aa, $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;
							$scope.items = $scope.items.concat(items.data);
							$scope.loadedCnt = $scope.items.length;

						} else {
							$scope.loadedData = [];
						}
					});
					$scope.aa = $scope.aa + 20;
				}
			} else {
				if ($scope.aa == 20) {
					$scope.aa = $scope.aa + 20;
				}

				if ($scope.all) {
					PersonService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "All").then(function (items) {

						if (items.response == 'Success') {
							$scope.loadedData = items.data;

							$scope.items = items.data;
							$scope.loadedCnt = $scope.items.length;
							GlobalService.allPaymentDetails = $scope.items;
							$scope.prevLen = $scope.items.length;
						} else {
							$scope.loadedData = [];
						}

					});

					GlobalService.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = GlobalService.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.today) {
					PersonService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Today").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;

							$scope.items = items.data;
							GlobalService.allPaymentDetails = items;
							$scope.prevLen = $scope.items.length;
							$scope.loadedCnt = $scope.items.length;
						} else {
							$scope.loadedData = [];
						}

					});
					GlobalService.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = GlobalService.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.week) {
					PersonService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Week").then(function (items) {

						if (items.response == 'Success') {
							$scope.loadedData = items.data;

							$scope.items = items.data;
							GlobalService.allPaymentDetails = items.data;
							$scope.prevLen = $scope.items.length;
							$scope.loadedCnt = $scope.items.length;
						} else {
							$scope.loadedData = [];
						}
					});
					GlobalService.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = GlobalService.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.month) {
					PersonService.sortingLoadmore($scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa, "Month").then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;

							$scope.items = items.data;
							GlobalService.allPaymentDetails = items.data;
							$scope.prevLen = $scope.items.length;
							$scope.loadedCnt = $scope.items.length;
						} else {
							$scope.loadedData = [];
						}
					});
					GlobalService.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = GlobalService.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				} else if ($scope.custom) {
					PersonService.sortingCustomSearchLoadmore($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType, $scope.aa).then(function (items) {
						if (items.response == 'Success') {
							$scope.loadedData = items.data;

							$scope.items = items.data;
							GlobalService.allPaymentDetails = items.data;
							$scope.prevLen = $scope.items.length;
							$scope.loadedCnt = $scope.items.length;
						} else {
							$scope.loadedData = [];
						}
					});
					GlobalService.DataLoadedCount = $scope.aa;
					$scope.DataLoadedCount = GlobalService.DataLoadedCount;
					$scope.aa = $scope.aa + 20;
				}

			}
		} else if ($scope.advancedSearchEnable) {

			var FieldArr = JSON.parse(sessionStorage.advancedSearchFieldArr)

				if (!$scope.isSortingClicked) {
					// var FieldArr = JSON.parse(sessionStorage.advancedSearchFieldArr)

					if ($scope.all) {

						PersonService.advancedSearchLoadmore($scope.aa, "All", $scope.orderByField, $scope.sortType, FieldArr).then(function (items) {

							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								$scope.loadedCnt = $scope.items.length;

							} else {
								$scope.loadedData = [];
							}

						});
						$scope.aa = $scope.aa + 20;
					} else if ($scope.today) {
						PersonService.advancedSearchLoadmore($scope.aa, "Today", $scope.orderByField, $scope.sortType, FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								$scope.loadedCnt = $scope.items.length;

							} else {
								$scope.loadedData = [];
							}
						});
						$scope.aa = $scope.aa + 20;

					} else if ($scope.week) {
						PersonService.advancedSearchLoadmore($scope.aa, "Week", $scope.orderByField, $scope.sortType, FieldArr).then(function (items) {

							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								$scope.loadedCnt = $scope.items.length;

							} else {
								$scope.loadedData = [];
							}
						});
						$scope.aa = $scope.aa + 20;
					} else if ($scope.month) {
						PersonService.advancedSearchLoadmore($scope.aa, "Month", $scope.orderByField, $scope.sortType, FieldArr).then(function (items) {

							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								$scope.loadedCnt = $scope.items.length;

							} else {
								$scope.loadedData = [];
							}
						});
						$scope.aa = $scope.aa + 20;
					} else if ($scope.custom) {
						PersonService.advancedCustomSearchLoadmore($scope.aa, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, FieldArr).then(function (items) {
							if (items.response == 'Success') {
								$scope.loadedData = items.data;
								$scope.items = $scope.items.concat(items.data);
								$scope.loadedCnt = $scope.items.length;

							} else {
								$scope.loadedData = [];
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
						PersonService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "All", FieldArr).then(function (items) {

							if (items.response == 'Success') {

								$scope.loadedData = items.data;
								$scope.items = items.data;
								$scope.prevLen = $scope.items.length;
								$scope.loadedCnt = $scope.items.length;
							} else {
								$scope.loadedData = [];
							}

						});

						GlobalService.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = GlobalService.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					} else if ($scope.today) {
						PersonService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Today", FieldArr).then(function (items) {

							if (items.response == 'Success') {

								$scope.loadedData = items.data;
								$scope.items = items.data;
								$scope.prevLen = $scope.items.length;
								$scope.loadedCnt = $scope.items.length;
							} else {
								$scope.loadedData = [];
							}
						});
						GlobalService.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = GlobalService.DataLoadedCount;
						$scope.aa = $scope.aa + 20;

					} else if ($scope.week) {
						PersonService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Week", FieldArr).then(function (items) {

							if (items.response == 'Success') {

								$scope.loadedData = items.data;
								$scope.items = items.data;
								$scope.prevLen = $scope.items.length;
								$scope.loadedCnt = $scope.items.length;
							} else {
								$scope.loadedData = [];
							}
						});
						GlobalService.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = GlobalService.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					} else if ($scope.month) {
						PersonService.advancedSortingLoadmore($scope.orderByField, $scope.sortType, $scope.aa, "Month", FieldArr).then(function (items) {
							if (items.response == 'Success') {

								$scope.loadedData = items.data;
								$scope.items = items.data;
								$scope.prevLen = $scope.items.length;
								$scope.loadedCnt = $scope.items.length;
							} else {
								$scope.loadedData = [];
							}
						});
						GlobalService.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = GlobalService.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					} else if ($scope.custom) {

						PersonService.advancedCustomSortingLoadmore($scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType, $scope.aa, FieldArr).then(function (items) {
							if (items.response == 'Success') {

								$scope.loadedData = items.data;
								$scope.items = items.data;
								$scope.prevLen = items.data.length;
								$scope.loadedCnt = $scope.items.length;
							} else {
								$scope.loadedData = [];
							}
						});
						GlobalService.DataLoadedCount = $scope.aa;
						$scope.DataLoadedCount = GlobalService.DataLoadedCount;
						$scope.aa = $scope.aa + 20;
					}
				}
		}
	};

	//To set PSA Code dropdown

	/*$http.get(BASEURL+RESTCALL.PartyCodeDropdown).success(function(data){
	$scope.psaCodeDrop = data;
	}).error(function(){

	})*/

	var debounceHandler = _.debounce($scope.loadMore, 700, true);
	/**To control Load more data **/

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

	/* $(window).scroll(function () {
	if($location.path() == '/app/filelist'){
	if($(window).scrollTop() + $(window).height() >= ($(document).height()-1) ) {
	console.log("len",$scope.loadedData.length)
	//$scope.loadCnt++;

	//console.log($scope.loadedData.length)
	if(($scope.loadedData.length >= 20)) {
	$scope.loadMore();
	$scope.loadCnt = 0;
	}
	}
	}
	});*/

	$scope.clickRefId = function (id, index) {
		GlobalService.fileListIndex = index;
		GlobalService.fileListId = id.InstructionID;

		$location.path('app/filedetail')
	}

	$scope.loadData1 = function () {
		//$scope.esearch = '';
		$(".listView").scrollTop(0);
		$scope.aa = 20;
		$scope.loadCnt = 0;

		if (sessionStorage.FileListCurrentRESTCALL) {
			PersonService.refreshAll().then(function (items) {
				if (items.response == 'Success') {
					$scope.items = items.data;
					$scope.loadedData = items.data;
					if ($scope.items.length > 0) {
						$scope.alertMsg = false;

						/* $scope.alerts = [{
						type : '',
						msg : ''
						}
						];*/

					} else {
						$scope.alertMsg = true;
					}
				} else if (items.response == 'Error') {
					if (items.data.error.code == 401) {
						if (configData.Authorization == 'External') {
							window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
						} else {
							LogoutService.Logout();
						}
					} else {
						$scope.showErrorMessage(items)
					}
				}

			});
		}

	};

	$scope.FileListSearch = function () {

		$scope.aa = 20;
		var b = $('#searchBox').val();
		var c = b.trim()

			$scope.globalEsearch = PersonService.txtBoxVal = $scope.esearch;
		if (c != '') {

			delete sessionStorage.advancedSearchFieldArr;

			GlobalService.FLuir = c;

			GlobalService.advancedSearchEnable = false;
			$scope.advancedSearchEnable = GlobalService.advancedSearchEnable;

			$scope.isAdvacedSearchClicked = false;

			$scope.advancedSearch = true;

			GlobalService.searchClicked = true;
			$scope.searchClicked = GlobalService.searchClicked;

			if (c.length != 0) {
				$scope.nothingSelected = false;
			} else {
				$scope.nothingSelected = true;
			}

			if ($scope.all) {
				$scope.UIR = true;

				PersonService.filterData($scope.txtValfn(), "All", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})

			} else if ($scope.today) {
				PersonService.filterData($scope.txtValfn(), "Today", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				});

			} else if ($scope.week) {
				PersonService.filterData($scope.txtValfn(), "Week", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				});

			} else if ($scope.month) {
				PersonService.filterData($scope.txtValfn(), "Month", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				});

			} else if ($scope.custom) {
				PersonService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				});
			}

			$scope.resetFilter()
		}

	};

	$scope.checkinfo = function (eve) {

		var a = $('#searchBox').val();

		if ((a.length == 0) && (!$scope.advancedSearchEnable)) {

			GlobalService.fromMyProfilePage = false;

			$scope.UIR = false;
			GlobalService.advancedSearchEnable = false;
			$scope.advancedSearchEnable = GlobalService.advancedSearchEnable;

			delete sessionStorage.FileListCurrentRESTCALL;

			GlobalService.FLuir = '';
			GlobalService.startDate = '';
			GlobalService.endDate = '';
			GlobalService.ShowStartDate = '';
			GlobalService.ShowEndDate = '';
			GlobalService.searchClicked = false;
			GlobalService.isEntered = false;
			GlobalService.advancedSearch = true;
			GlobalService.advancedSearchEnable = false;
			GlobalService.searchNameDuplicated = false;
			GlobalService.SelectSearchVisible = false;
			GlobalService.searchname = '';

			if ($scope.searchClicked || $scope.isEntered) {
				if ($scope.all) {
					$scope.nothingSelected = true;

					PersonService.filterData($scope.txtValfn(), "All", $scope.orderByField, $scope.sortType).then(function (items) {
						$scope.wildcard = false;

						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}

					});

				} else if ($scope.today) {
					PersonService.filterData($scope.txtValfn(), "Today", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					});

				} else if ($scope.week) {
					PersonService.filterData($scope.txtValfn(), "Week", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					});

				} else if ($scope.month) {
					PersonService.filterData($scope.txtValfn(), "Month", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					});

				} else if ($scope.custom) {
					PersonService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}

					});
				}

			}

		}

		if (eve.keyCode == 13) {

			$scope.aa = 20;
			var a = $('#searchBox').val();

			if (a.length != '') {
				GlobalService.fromMyProfilePage = false;
				delete sessionStorage.advancedSearchFieldArr;
				GlobalService.FLuir = a;
				GlobalService.advancedSearchEnable = false;
				$scope.advancedSearchEnable = GlobalService.advancedSearchEnable;

				$scope.isAdvacedSearchClicked = false;
				$scope.advancedSearch = true;

				GlobalService.isEntered = true;
				$scope.isEntered = GlobalService.isEntered;

				$scope.globalEsearch = PersonService.txtBoxVal = $scope.esearch;
				if ($scope.all) {
					PersonService.filterData($scope.txtValfn(), "All", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.advancedDefaultval(items.data)
						}
					});

				} else if ($scope.today) {
					PersonService.filterData($scope.txtValfn(), "Today", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.advancedDefaultval(items.data)
						}
					});

				} else if ($scope.week) {
					PersonService.filterData($scope.txtValfn(), "Week", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.advancedDefaultval(items.data)
						}
					});

				} else if ($scope.month) {
					PersonService.filterData($scope.txtValfn(), "Month", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.advancedDefaultval(items.data)
						}
					});

				} else if ($scope.custom) {
					PersonService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.advancedDefaultval(items.data)
						}

					});
				}

				$scope.UIR = true;

				$scope.nothingSelected = false;

				if ($scope.dropdownSelected == true) {
					$scope.dropdownSelected = false;
				} else {
					$scope.dropdownSelected = true;
				}

				$scope.resetFilter()

			}

		}
	}

	$scope.clearSearch = function () {

		for (i in GlobalService.searchParams) {

			if (i == 'InstructionData') {
				for (j in GlobalService.searchParams[i]) {
					GlobalService.searchParams[i][j].Start = "";
					GlobalService.searchParams[i][j].End = "";
				}
			} else {
				GlobalService.searchParams[i] = '';
			}

		}
		GlobalService.FLuir = "",
		$scope.all = GlobalService.all = !0,
		$scope.today = GlobalService.today = !1,
		$scope.week = GlobalService.week = !1,
		$scope.month = GlobalService.month = !1,
		$scope.custom = GlobalService.custom = !1,
		GlobalService.selectCriteriaTxt = "All",
		GlobalService.selectCriteriaID = 1,
		GlobalService.prev = "all",
		GlobalService.prevSelectedTxt = "all",
		GlobalService.prevId = 1,
		GlobalService.myProfileFLindex = "",
		GlobalService.todayDate = "",
		GlobalService.weekStart = "",
		GlobalService.weekEnd = "",
		GlobalService.monthStart = "",
		GlobalService.monthEnd = "",
		GlobalService.startDate = "",
		GlobalService.endDate = "",
		GlobalService.ShowStartDate = "",
		GlobalService.ShowEndDate = "",
		$scope.nothingSelected = !0,
		$scope.isAdvacedSearchClicked = !1;
		GlobalService.orderByField = 'EntryDate';
		GlobalService.sortReverse = false;
		GlobalService.sortType = 'Desc';
		GlobalService.isSortingClicked = false;
		GlobalService.DataLoadedCount = 20;

		$scope.anythingSelected = !1,
		$scope.advancedSearchEnable = !1,
		GlobalService.advancedSearchEnable = !1,
		//	GlobalService.fileNameVal = "",
		$scope.advancedSearchEnable = !1,
		GlobalService.advancedSearchEnable = !1,
		$scope.advancedSearchEnable = !1,
		GlobalService.FLuir = "",
		$scope.esearch = "",
		GlobalService.searchClicked = !1,
		GlobalService.isEntered = !1,
		GlobalService.searchNameDuplicated = !1,
		GlobalService.SelectSearchVisible = !1,
		GlobalService.searchname = "";
		delete sessionStorage.advancedSearchFieldArr;

		GlobalService.sidebarCurrentVal = {
			"ParentName" : "Payment Module",
			"Link" : "app",
			"IconName" : "icon-settings"
		}
		GlobalService.sidebarSubVal = {
			"IconName" : "fa-file-text-o",
			"Id" : "002",
			"Link" : "instructions",
			"Name" : "All Files",
			"ParentName" : "Payment Module"
		}

		$state.reload();
	}

	$scope.listTooltip = "List View";
	$scope.gridTooltip = "Grid View";
	$scope.changeViewFlag = GlobalService.viewFlag;
	$scope.changeViewFlag1 = false;
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
		$scope.changeViewFlag1 = false;
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
	$scope.findHeader = function () {

		if ($scope.changeViewFlag1) {
			$(".floatThead ").find("thead").hide();
		} else {
			$(".floatThead ").find("thead").show();
		}

	}
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

	$scope.prev = GlobalService.prev;
	$scope.prevSelectedTxt = GlobalService.prevSelectedTxt;
	$scope.prevId = GlobalService.prevId;

	$scope.FilterByDate = function (text, eve) {

		GlobalService.searchClicked = false;
		$scope.searchClicked = GlobalService.searchClicked;
		GlobalService.isEntered = false;
		$scope.isEntered = GlobalService.isEntered;

		$scope.aa = 20;
		var _id;
		$scope.globalEsearch = PersonService.txtBoxVal = $scope.esearch;
		_id = $(eve.currentTarget).attr('id').split('_')[1]
			if ($scope.prevId != _id) {

				$scope.prevSelected = $scope.prevId;
				GlobalService.prevId = $scope.prevId;

			}

			$scope.parent = $(eve.currentTarget).parent().parent().find('span:first-child');
		$scope.parentTxt = $scope.parent.text();
		$scope.child = $(eve.currentTarget).text()

			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_' + _id).addClass('listSelected').removeClass('listNotSelected');

		$($scope.parent).html($scope.child)
		$scope.prev = $scope.child;

		if (($scope.prev == 'All' || $scope.prev == 'Todas') || ($scope.prev == 'Today' || $scope.prev == 'Hoy') || ($scope.prev == 'Week' || $scope.prev == 'Semana') || ($scope.prev == 'Month' || $scope.prev == 'Mes')) {
			GlobalService.selectCriteriaTxt = $scope.prev;
			GlobalService.selectCriteriaID = _id;
		}

		GlobalService.prev = $scope.prev;
		$scope.prevTxt = $(eve.currentTarget).text();

		$scope.prevId = _id;

		if (!$scope.advancedSearchEnable) {
			if (text == 'all') {

				GlobalService.startDate = '';
				GlobalService.endDate = '';

				$scope.startDate = GlobalService.startDate
					$scope.endDate = GlobalService.endDate;

				$scope.all = true;
				$scope.today = false;
				$scope.week = false;
				$scope.month = false;
				$scope.custom = false;

				GlobalService.all = true;
				GlobalService.today = false;
				GlobalService.week = false;
				GlobalService.month = false;
				GlobalService.custom = false;

				var xx = $('#searchBox').val();
				if (xx.length != 0) {
					$scope.nothingSelected = false;
					$scope.UIR = true;
					GlobalService.searchClicked = true;
					$scope.searchClicked = GlobalService.searchClicked;

					GlobalService.isEntered = true;
					$scope.isEntered = GlobalService.isEntered;
				} else {
					$scope.nothingSelected = true;
					GlobalService.searchClicked = false;
					$scope.searchClicked = GlobalService.searchClicked;

					GlobalService.isEntered = false;
					$scope.isEntered = GlobalService.isEntered;
				}

				PersonService.filterData($scope.txtValfn(), "All", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}

				});
			}

			if (text == 'today') {
				$scope.nothingSelected = false;
				GlobalService.startDate = '';
				GlobalService.endDate = '';

				$scope.startDate = GlobalService.startDate
					$scope.endDate = GlobalService.endDate;

				GlobalService.todayDate = todayDate();
				$scope.todayDate = GlobalService.todayDate;

				$scope.all = false;
				$scope.today = true;
				$scope.week = false;
				$scope.month = false;
				$scope.custom = false;

				GlobalService.all = false;
				GlobalService.today = true;
				GlobalService.week = false;
				GlobalService.month = false;
				GlobalService.custom = false;

				PersonService.filterData($scope.txtValfn(), "Today", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.advancedDefaultval(items.data)
						$scope.dropdownSelected = true;
					}

				});

			}

			if (text == 'week') {

				$scope.nothingSelected = false;
				GlobalService.startDate = '';
				GlobalService.endDate = '';

				$scope.startDate = GlobalService.startDate
					$scope.endDate = GlobalService.endDate;

				GlobalService.weekStart = week().lastDate;
				GlobalService.weekEnd = week().todayDate;

				$scope.weekStart = GlobalService.weekStart;
				$scope.weekEnd = GlobalService.weekEnd;

				$scope.all = false;
				$scope.today = false;
				$scope.week = true;
				$scope.month = false;
				$scope.custom = false;

				GlobalService.all = false;
				GlobalService.today = false;
				GlobalService.week = true;
				GlobalService.month = false;
				GlobalService.custom = false;

				PersonService.filterData($scope.txtValfn(), "Week", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.advancedDefaultval(items.data)
						$scope.dropdownSelected = true;
					}
				});

			}

			if (text == 'month') {
				$scope.nothingSelected = false;
				GlobalService.startDate = '';
				GlobalService.endDate = '';

				$scope.startDate = GlobalService.startDate
					$scope.endDate = GlobalService.endDate;

				GlobalService.monthStart = month().lastDate;
				GlobalService.monthEnd = month().todayDate;

				$scope.monthStart = GlobalService.monthStart;
				$scope.monthEnd = GlobalService.monthEnd;

				$scope.all = false;
				$scope.today = false;
				$scope.week = false;
				$scope.month = true;
				$scope.custom = false;

				GlobalService.all = false;
				GlobalService.today = false;
				GlobalService.week = false;
				GlobalService.month = true;
				GlobalService.custom = false;

				PersonService.filterData($scope.txtValfn(), "Month", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
						$scope.dropdownSelected = false;
					} else {
						$scope.advancedDefaultval(items.data)
						$scope.dropdownSelected = true;
					}

				});
			}
		} else if ($scope.advancedSearchEnable) {

			var FieldArr = JSON.parse(sessionStorage.advancedSearchFieldArr)

				if (text == 'all') {
					GlobalService.startDate = '';
					GlobalService.endDate = '';

					$scope.startDate = GlobalService.startDate
						$scope.endDate = GlobalService.endDate;

					$scope.all = true;
					$scope.today = false;
					$scope.week = false;
					$scope.month = false;
					$scope.custom = false;

					GlobalService.all = true;
					GlobalService.today = false;
					GlobalService.week = false;
					GlobalService.month = false;
					GlobalService.custom = false;

					var xx = $('#searchBox').val()

						if (xx.length != 0) {
							$scope.nothingSelected = false;
							$scope.UIR = true;
							GlobalService.searchClicked = true;
							$scope.searchClicked = GlobalService.searchClicked;

							GlobalService.isEntered = true;
							$scope.isEntered = GlobalService.isEntered;
						} else {
							$scope.nothingSelected = true;
							GlobalService.searchClicked = false;
							$scope.searchClicked = GlobalService.searchClicked;

							GlobalService.isEntered = false;
							$scope.isEntered = GlobalService.isEntered;
						}

						PersonService.advancedSearch(FieldArr, "All", $scope.orderByField, $scope.sortType).then(function (items) {

							if (items.response == 'Error') {
								$scope.showErrorMessage(items)
							} else {
								$scope.advancedDefaultval(items.data)
							}

						})
				} else if (text == 'today') {
					$scope.nothingSelected = false;
					GlobalService.startDate = '';
					GlobalService.endDate = '';

					$scope.startDate = GlobalService.startDate
						$scope.endDate = GlobalService.endDate;

					GlobalService.todayDate = todayDate();
					$scope.todayDate = GlobalService.todayDate;

					$scope.all = false;
					$scope.today = true;
					$scope.week = false;
					$scope.month = false;
					$scope.custom = false;

					GlobalService.all = false;
					GlobalService.today = true;
					GlobalService.week = false;
					GlobalService.month = false;
					GlobalService.custom = false;

					PersonService.advancedSearch(FieldArr, "Today", $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.advancedDefaultval(items.data)
							$scope.dropdownSelected = true;
						}
					})
				} else if (text == 'week') {

					$scope.nothingSelected = false;
					GlobalService.startDate = '';
					GlobalService.endDate = '';

					$scope.startDate = GlobalService.startDate
						$scope.endDate = GlobalService.endDate;

					GlobalService.weekStart = week().lastDate;
					GlobalService.weekEnd = week().todayDate;

					$scope.weekStart = GlobalService.weekStart;
					$scope.weekEnd = GlobalService.weekEnd;

					$scope.all = false;
					$scope.today = false;
					$scope.week = true;
					$scope.month = false;
					$scope.custom = false;

					GlobalService.all = false;
					GlobalService.today = false;
					GlobalService.week = true;
					GlobalService.month = false;
					GlobalService.custom = false;

					PersonService.advancedSearch(FieldArr, "Week", $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.advancedDefaultval(items.data)
							$scope.dropdownSelected = true;
						}
					})
				} else if (text == 'month') {
					//console.log("Month")
					$scope.nothingSelected = false;
					GlobalService.startDate = '';
					GlobalService.endDate = '';

					$scope.startDate = GlobalService.startDate
						$scope.endDate = GlobalService.endDate;

					GlobalService.monthStart = month().lastDate;
					GlobalService.monthEnd = month().todayDate;

					$scope.monthStart = GlobalService.monthStart;
					$scope.monthEnd = GlobalService.monthEnd;

					$scope.all = false;
					$scope.today = false;
					$scope.week = false;
					$scope.month = true;
					$scope.custom = false;

					GlobalService.all = false;
					GlobalService.today = false;
					GlobalService.week = false;
					GlobalService.month = true;
					GlobalService.custom = false;

					PersonService.advancedSearch(FieldArr, "Month", $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
							$scope.dropdownSelected = false;
						} else {
							$scope.advancedDefaultval(items.data)
							$scope.dropdownSelected = true;
						}
					})
				}
		}

		if ($scope.startDate && $scope.endDate) {
			$('#okBtn').removeAttr('disabled', 'disabled')
		} else {
			$('#okBtn').attr('disabled', 'disabled')
		}

		$scope.customDateRangePicker()

	}
	$scope.FilterByDate1 = function () {
		$('#myModal').modal('hide');
		if (!$scope.advancedSearchEnable) {
			$scope.all = false;
			$scope.today = false;
			$scope.week = false;
			$scope.month = false;
			$scope.custom = true;

			GlobalService.all = false;
			GlobalService.today = false;
			GlobalService.week = false;
			GlobalService.month = false;
			GlobalService.custom = true;

			GlobalService.startDate = $scope.startDate;
			GlobalService.endDate = $scope.endDate;

			GlobalService.ShowStartDate = GlobalService.startDate;
			GlobalService.ShowEndDate = GlobalService.endDate;

			$scope.ShowStartDate = GlobalService.ShowStartDate;
			$scope.ShowEndDate = GlobalService.ShowEndDate;

			//console.log("dates", $scope.ShowStartDate, $scope.ShowEndDate)

			GlobalService.prev = "Custom"
				GlobalService.selectCriteriaTxt = "Custom"
				$scope.prev = GlobalService.prev;

			PersonService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {

				if (items.response == 'Error') {
					$scope.showErrorMessage(items)
					$scope.dropdownSelected = false;
				} else {
					$scope.advancedDefaultval(items.data)
					$scope.dropdownSelected = true;
				}
			});

		} else if ($scope.advancedSearchEnable) {

			var FieldArr = JSON.parse(sessionStorage.advancedSearchFieldArr)

				// console.log(FieldArr)

				$scope.all = false;
			$scope.today = false;
			$scope.week = false;
			$scope.month = false;
			$scope.custom = true;

			GlobalService.all = false;
			GlobalService.today = false;
			GlobalService.week = false;
			GlobalService.month = false;
			GlobalService.custom = true;

			GlobalService.startDate = $scope.startDate;
			GlobalService.endDate = $scope.endDate;
			$scope.ShowStartDate = GlobalService.startDate;
			$scope.ShowEndDate = GlobalService.endDate;

			GlobalService.prev = "Custom"
				GlobalService.selectCriteriaTxt = "Custom"
				$scope.prev = GlobalService.prev;

			PersonService.advancedCustomSearch(FieldArr, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType).then(function (items) {

				if (items.response == 'Error') {
					$scope.showErrorMessage(items)
				} else {
					$scope.advancedDefaultval(items.data)
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

		$scope.startDate = GlobalService.startDate;
		$scope.endDate = GlobalService.endDate;

		if ($scope.startDate && $scope.endDate) {
			$($scope.parent).html("Custom")
			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_5').addClass('listSelected').removeClass('listNotSelected')
		} else {
			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_' + GlobalService.prevId).addClass('listSelected').removeClass('listNotSelected')
			$($scope.parent).html($('#menulist_' + GlobalService.prevId).text())

			GlobalService.selectCriteriaTxt = $('#menulist_' + GlobalService.prevId).text();
		}

	}

	/*$scope.startDate = '';
	$scope.endDate = '';*/

	$scope.removeFn = function () {
		if ($scope.startDate || $scope.endDate) {
			$('#okBtn').removeAttr('disabled', 'disabled')
		} else {
			$('#okBtn').attr('disabled', 'disabled')

			//$scope.customAlert = true;
		}
	}

	$scope.dummy = function (eve) {

		if (eve.keyCode == 27) {
			$scope.filterCancel()
		}
	}

	/*$scope.modelhide = function (e) {
	if (e.currentTarget == e.target) {

	$scope.filterCancel()
	}

	}*/

	function setFlag(val) {
		if (val) {
			return true;
		} else {
			return false;
		}
	}

	/* Advanced search functionality*/

	function initializeSetting() {

		$scope.FieldsValues = [{
				"label" : "Instruction ID",
				"value" : "InstructionID",
				"type" : "text",
				"allow" : "number",
				"visible" : true
			}, {
				"label" : "Instruction Status",
				"value" : "FileStatus",
				"type" : "dropdown",
				"visible" : true
			}, {
				"label" : "Entry Date",
				"value" : "EntryDate",
				"type" : "dateRange",
				"allow" : "date",

				"visible" : true
			}, {
				"label" : "Input Reference Code",
				"value" : "InputReferenceCode",
				"type" : "dropdown",
				"allow" : "string",
				"visible" : true
			}, {
				"label" : "Instruction Name",
				"value" : "TransportName",
				"type" : "text",
				"allow" : "string",
				"visible" : setFlag($scope.search.TransportName)
			}

		]
	}

	initializeSetting()

	$(document).ready(function () {
		for (var i in $scope.FieldsValues) {
			if ($scope.FieldsValues[i].type == 'dropdown') {
				$('[name=' + $scope.FieldsValues[i].value + ']').select2();
			}
		}

		$scope.remoteDataConfig = function () {

			$("select[name='InputReferenceCode']").select2({
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

	// $scope.triggerSelect2();


	$scope.SelectValue = function (index) {
		$scope.seeVisible = false;
		$scope.FieldsValues[index]['visible'] = !$scope.FieldsValues[index]['visible'];

		setTimeout(function () {
			$scope.triggerSelect2()
		}, 10);

		for (var i in $scope.FieldsValues) {
			if ($scope.FieldsValues[i].visible) {
				$scope.seeVisible = true;
			}
		}

		if ($scope.seeVisible) {
			$('#saveSearchBtn,#AdSearchBtn').removeAttr('disabled', 'disabled');
		} else {
			$scope.advancedSearch = true;
			GlobalService.advancedSearchEnable = false;
			$scope.advancedSearchEnable = GlobalService.advancedSearchEnable;
			$('#saveSearchBtn,#AdSearchBtn').attr('disabled', 'disabled');

		}
	}

	var statusArr = [];
	var newArr = [];

	$scope.statusArrnames = [];

	$scope.selectOptions = [];

	/*** Fetching All Unique File Status ***/
	PersonService.totalFileStatus().then(function (items) {
		for (var i = 0; i < items.length; i++) {
			statusArr.push(items[i].FileStatus)
		}

		$scope.statusArrnames = statusArr;
		$scope.uniqueNames = items.FileStatus;
		$scope.uniqueNames.sort();
	})

	$scope.searchNameDuplicated = GlobalService.searchNameDuplicated;
	$scope.SelectSearchVisible = GlobalService.SelectSearchVisible;
	$scope.searchName = GlobalService.searchname;

	$scope.searchNameDuplicated = false;

	$scope.isAnyFieldFilled = false;
	$scope.keyIndex = '';
	$scope.saveSearch = function () {

		if ($scope.searchname) {
			$scope.isSearchNameFilled = false;
			for (var key in userData.savedSearch.FileList) {
				if (userData.savedSearch.FileList[key].name == $scope.searchname) {
					$scope.searchNameDuplicated = true;
					$scope.keyIndex = key;
					break;
				} else
					{
					$scope.searchNameDuplicated = false;
				}

			}

			if (!$scope.searchNameDuplicated) {
				var saveSearchObjects = $scope.buildSearch();
				$scope.SelectSearchVisible = false;
				$scope.searchSet = false;
				for (i in $scope.search) {
					if (i == 'InstructionData') {
						for (j in $scope.search[i]) {
							if (j == 'EntryDate') {
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
					// localStorage.setItem("FList_" + sessionStorage.UserID + "_" + $scope.searchname, JSON.stringify(saveSearchObjects));
					GlobalService.SelectSearchVisible = true;
					$scope.SelectSearchVisible = GlobalService.SelectSearchVisible;

					GlobalService.searchname = $scope.searchname;
					$scope.searchName = GlobalService.searchname;

					$scope.searchname = '';
					$('#myModal1').modal('hide');
					userData.savedSearch.FileList.push({
						'name' : $scope.searchName,
						'params' : saveSearchObjects
					})
					console.log(userData)
					updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function (response) {
						$scope.testing();
					})
				} else {
					$scope.isAnyFieldFilled = true;
				}

			}
		} else {
			$scope.isSearchNameFilled = true;
		}

	}
	$scope.saveSearch1 = function () {

		saveSearchObjects = $scope.buildSearch();
		//localStorage.setItem("FList_" + sessionStorage.UserID + "_" + $scope.searchname, JSON.stringify(saveSearchObjects));
		$('#myModal1').modal('hide');

		GlobalService.SelectSearchVisible = true;
		$scope.SelectSearchVisible = GlobalService.SelectSearchVisible;

		console.log($scope.searchname)

		userData.savedSearch.FileList[$scope.keyIndex].name = $scope.searchName

			userData.savedSearch.FileList[$scope.keyIndex].params = JSON.stringify(saveSearchObjects)

			updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http, $scope.userFullObj).then(function (response) {
				if (response.Status == 'danger') {
					$scope.alerts = [{
							type : 'danger',
							msg : response.data.data.error.message
						}
					];
				} else {
					GlobalService.searchname = $scope.searchname;
					$scope.searchName = GlobalService.searchname;
					$scope.searchname = '';
					$scope.testing();

				}

			})
	}

	$scope.ClearAlert = function () {
		$scope.searchNameDuplicated = false;
		$scope.isAnyFieldFilled = false;
		$scope.isSearchNameFilled = false;
		$scope.searchname = '';

	}

	$scope.selectSearch = function (index) {
		GlobalService.searchname = $scope.lskey[index];

		$scope.searchName = GlobalService.searchname;

		$timeout(function () {
			$scope.triggerSelect2()
		}, 0)

		if ($scope.searchName != 'New Search') {
			var ff = $scope.uData.savedSearch.FileList[index - 1].params;

			GlobalService.searchParams = ff.searchParams;

			sessionStorage.advancedSearchFieldArr = JSON.stringify(ff.FieldArr)
				$scope.search = ff.searchParams;

			console.log($scope.search)

			$scope.all = ff.all;
			$scope.today = ff.today;
			$scope.week = ff.week;
			$scope.month = ff.month;
			$scope.custom = ff.custom;
			$scope.todayDate = ff.todayDate;
			$scope.weekStart = ff.weekStart;
			$scope.weekEnd = ff.weekEnd;
			$scope.monthStart = ff.monthStart;
			$scope.monthEnd = ff.monthEnd;
			$scope.selectCriteriaTxt = ff.selectCriteriaTxt;
			$scope.selectCriteriaID = ff.selectCriteriaID;
			GlobalService.selectCriteriaID = $scope.selectCriteriaID;
			$scope.prev = ff.prev;
			$scope.prevSelectedTxt = ff.prevSelectedTxt;
			$scope.prevId = ff.prevId;
			$scope.startDate = ff.startDate;
			$scope.endDate = ff.endDate;
			$scope.ShowStartDate = ff.ShowStartDate;
			$scope.ShowEndDate = ff.ShowEndDate;
			$scope.searchClicked = ff.searchClicked;
			$scope.isEntered = ff.isEntered;
			$scope.isAdvacedSearchClicked = true;

			$scope.dynamicArr = ["FileStatus", "InputReferenceCode"]
			for (var i in $scope.dynamicArr) {
				$("select[name='" + $scope.dynamicArr[i] + "']").select2({
					data : $scope.search[$scope.dynamicArr[i]]

				});

				//console.log("aa",$scope.search[$scope.dynamicArr[i]])
			}

			$scope.advancedSearch = ff.advancedSearch;
			$scope.advancedSearchEnable = ff.advancedSearchEnable;

			GlobalService.fromMyProfilePage = true;
			GlobalService.FieldArr = ff.FieldArr;
			initialCall(true)
			initializeSetting()

			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_' + GlobalService.selectCriteriaID).addClass('listSelected').removeClass('listNotSelected');
			$('#dropdownBtnTxt').html(ff.selectCriteriaTxt)
			$scope.checkDropdownSelected('dropdown');
		} else {

			setTimeout(function () {
				$scope.customDateRangePicker('EntryDateStart', 'EntryDateEnd')

				/*$scope.dynamicArr = ["FileStatus","InputReferenceCode"];
				for(var i in $scope.dynamicArr){
				$('select[name='+$scope.dynamicArr[i]+']').val('');
				$("select[name="+$scope.dynamicArr[i]+"]").select2()
				}*/

			}, 150)

			$scope.AdsearchParams = {
				"InstructionData" : {
					"EntryDate" : {
						"Start" : "",
						"End" : ""
					}
				}
			}

			$scope.search = angular.copy($scope.AdsearchParams);

			GlobalService.searchParams = $scope.search;

			GlobalService.all = true;
			GlobalService.today = false;
			GlobalService.week = false;
			GlobalService.month = false;
			GlobalService.custom = false;

			$scope.all = GlobalService.all;
			$scope.today = GlobalService.today;
			$scope.week = GlobalService.week;
			$scope.month = GlobalService.month;
			$scope.custom = GlobalService.custom;

			$scope.resetFilter()
			$('#dropdownBtnTxt').html('All');
			$('.menuClass').removeClass('listSelected').addClass('listNotSelected')
			$('#menulist_1').addClass('listSelected').removeClass('listNotSelected');
			$scope.advancedSearch = false;

			$scope.triggerSelect2()

		}

	}

	$scope.spliceSearchArr = function (key) {
		delete $scope.search[key];

		$scope.dArr = ["FileStatus", "InputReferenceCode"]
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
		$scope.additionalWhereClauses = '';
		$scope.additionalWhereClauseArr = [];

		$scope.AdsearchParams = angular.copy($scope.search)

			$scope.AdsearchParams = removeEmptyValueKeys($scope.AdsearchParams)

			for (var i in $scope.AdsearchParams) {

				if (Array.isArray($scope.AdsearchParams[i])) {
					if (!$scope.AdsearchParams[i].length) {
						delete $scope.AdsearchParams[i]
					}

				}

			}

			for (i in $scope.AdsearchParams) {
				if (i == 'InstructionData') {
					for (j in $scope.AdsearchParams[i]) {
						if (j == 'EntryDate') {
							for (k in $scope.AdsearchParams[i][j]) {
								if ((k == 'Start') && ($scope.AdsearchParams[i][j][k] != "")) {
									GlobalService.searchParams[i][j].Start = $scope.AdsearchParams[i][j][k];
									if (j == 'EntryDate') {
										$scope.additionalWhereClauses = "EntryDateBetween=" + $scope.AdsearchParams[i][j][k];
									}
									$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
								} else if ((k == 'End') && ($scope.AdsearchParams[i][j][k] != "")) {
									GlobalService.searchParams[i][j].End = $scope.AdsearchParams[i][j][k];
									if (j == 'EntryDate') {
										$scope.additionalWhereClauses = "EndDateBetween=" + $scope.AdsearchParams[i][j][k];
									}
									$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)

								}
							}
						}

					}
				} else {
					/*GlobalService.searchParams[i] = $scope.AdsearchParams[i];
					$scope.additionalWhereClauses = i+'='+$scope.AdsearchParams[i];
					$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)*/
					//	console.log(i,$scope.AdsearchParams[i])

					GlobalService.searchParams[i] = $scope.AdsearchParams[i];
					if (Array.isArray($scope.AdsearchParams[i])) {
						for (var k in $scope.AdsearchParams[i]) {
							$scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i][k];
							$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
						}
					} else {

						$scope.additionalWhereClauses = i + '=' + $scope.AdsearchParams[i];
						$scope.additionalWhereClauseArr.push($scope.additionalWhereClauses)
					}

				}
			}

			//console.log($scope.additionalWhereClauseArr)

			$scope.searchSet = false;
		for (i in $scope.AdsearchParams) {
			if (i == 'InstructionData') {
				for (j in $scope.AdsearchParams[i]) {
					if (j == 'EntryDate') {
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

		if ($scope.searchSet) {
			$scope.anythingSelected = true;
			$scope.isAdvacedSearchClicked = true;
			$scope.showSearchWarning = false;
			$('#warnTxt').removeClass('in');

		} else {
			$scope.showSearchWarning = true;
			$scope.anythingSelected = false;
			$scope.isAdvacedSearchClicked = false;
			$('#warnTxt').addClass('in');

		}

		if ($scope.anythingSelected) {

			GlobalService.fromMyProfilePage = false;
			GlobalService.FieldArr = $scope.additionalWhereClauseArr;
			$scope.checkDropdownSelected('search');
			GlobalService.FLuir = $scope.esearch = '';
			GlobalService.advancedSearchEnable = true;
			$scope.advancedSearchEnable = GlobalService.advancedSearchEnable;
			$scope.advancedSearch = true;

			$scope.UIR = false;
			$scope.aa = 20;

			if ($scope.all) {
				$scope.nothingSelected = true;

				PersonService.advancedSearch($scope.additionalWhereClauseArr, "All", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {

						$scope.advancedDefaultval(items.data)
					}

				})
			} else if ($scope.today) {
				$scope.nothingSelected = false;

				PersonService.advancedSearch($scope.additionalWhereClauseArr, "Today", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			} else if ($scope.week) {
				$scope.nothingSelected = false;

				PersonService.advancedSearch($scope.additionalWhereClauseArr, "Week", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			} else if ($scope.month) {
				$scope.nothingSelected = false;

				PersonService.advancedSearch($scope.additionalWhereClauseArr, "Month", $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			} else if ($scope.custom) {

				$scope.nothingSelected = false;

				GlobalService.startDate = $scope.startDate;
				GlobalService.endDate = $scope.endDate;

				PersonService.advancedCustomSearch($scope.additionalWhereClauseArr, $scope.startDate, $scope.endDate, $scope.orderByField, $scope.sortType).then(function (items) {

					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.advancedDefaultval(items.data)
					}
				})
			}

		} else {

			if ($scope.advancedSearchEnable) {

				if ($scope.all) {

					PersonService.filterData($scope.txtValfn(), "All", $scope.orderByField, $scope.sortType).then(function (items) {

						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
							$scope.wildcard = false;
						}

					});

				} else if ($scope.today) {

					PersonService.filterData($scope.txtValfn(), "Today", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					});

				} else if ($scope.week) {
					PersonService.filterData($scope.txtValfn(), "Week", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					});

				} else if ($scope.month) {
					PersonService.filterData($scope.txtValfn(), "Month", $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}
					});

				} else if ($scope.custom) {
					$scope.startDate = GlobalService.startDate;
					$scope.endDate = GlobalService.endDate;

					PersonService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
						if (items.response == 'Error') {
							$scope.showErrorMessage(items)
						} else {
							$scope.defaultCallValues(items.data)
						}

					});
				}
			}
		}

		$scope.delValArr = ["fileDetailStatus", "sidebarCurrentVal", "sidebarSubVal", "specificData", "Fxupdated", "ViewClicked", "fromAddNew", "pwRest", "userCreated", "responseMessage", "roleAdded", "paymentRepaired", "logoutMessage", "passwordChanged", "ApproveInitiated", "PaymentApproved", "data123_backup", "fileListId", "UniqueRefID", "fileListIndex", "enrichPaymentID", "enrichPaymentIDRevert", "ErrorMessage123", "myProfileFLindex", "editRuleBuilder", "sidebarVal", "viewFlag", "AandN"]
		$scope.GlobalService = angular.copy(GlobalService)

			for (var i in $scope.delValArr) {
				delete $scope.GlobalService[$scope.delValArr[i]]
			}

			return $scope.GlobalService;
	}

	$scope.retainAlert = function (eve) {

		$(eve.currentTarget).parent().removeClass('in')
		$scope.showSearchWarning = false;
	}

	$scope.rstAdvancedSearchFlag = function () {

		if ($scope.advancedSearchEnable == false) {
			$scope.AdsearchParams = {
				"InstructionData" : {
					"EntryDate" : {
						"Start" : "",
						"End" : ""
					}
				}
			}

			$scope.search = angular.copy($scope.AdsearchParams);
		}

		GlobalService.advancedSearch = true;
		$scope.advancedSearch = true;

	}

	$scope.resetFilter = function () {

		$scope.showSearchWarning = false;
		setTimeout(function () {
			$scope.customDateRangePicker('EntryDateStart', 'EntryDateEnd')
		}, 150)

		$scope.AdsearchParams = {
			"InstructionData" : {
				"EntryDate" : {
					"Start" : "",
					"End" : ""
				}
			}
		}

		initializeSetting()

		$scope.search = angular.copy($scope.AdsearchParams);

		$scope.anythingSelected = false;
		$scope.isAdvacedSearchClicked = false;

		GlobalService.searchNameDuplicated = false;
		GlobalService.SelectSearchVisible = false;
		GlobalService.searchname = '';

		// $(document).ready(function() {
		// $(".js-multiple-filelist").select2({
		// 	allowClear : true
		// });
		// 	});
		/*setTimeout(function(){
		for(var i in $scope.FieldsValues)
	{
		if($scope.FieldsValues[i].type == 'dropdown')
	{
		console.log($scope.FieldsValues[i])
		$('[name='+$scope.FieldsValues[i].value+']').select2();
		$('[name='+$scope.FieldsValues[i].value+']').select2('val','');
		}
		}

		},0)*/
		$scope.customDateRangePicker('EntryDateStart', 'EntryDateEnd')
		$('#saveSearchBtn,#AdSearchBtn').removeAttr('disabled', 'disabled');

		if ($scope.advancedSearchEnable) {
			GlobalService.advancedSearchEnable = false;
			$scope.advancedSearchEnable = false;

			if ($scope.all) {
				$scope.nothingSelected = true;

				PersonService.filterData($scope.txtValfn(), "All", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
						$scope.wildcard = false;
					}

				});

			} else if ($scope.today) {
				PersonService.filterData($scope.txtValfn(), "Today", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				});

			} else if ($scope.week) {
				PersonService.filterData($scope.txtValfn(), "Week", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				});

			} else if ($scope.month) {

				PersonService.filterData($scope.txtValfn(), "Month", $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}
				});

			} else if ($scope.custom) {
				PersonService.customSearch($scope.startDate, $scope.endDate, $scope.txtValfn(), $scope.orderByField, $scope.sortType).then(function (items) {
					if (items.response == 'Error') {
						$scope.showErrorMessage(items)
					} else {
						$scope.defaultCallValues(items.data)
					}

				});
			}

		}
		$timeout(function () {
			for (var i in $scope.FieldsValues) {
				if ($scope.FieldsValues[i].type == 'dropdown') {
					//console.log(i,$scope.FieldsValues[i])
					//	console.log($scope.FieldsValues[i])
					$('[name=' + $scope.FieldsValues[i].value + ']').select2();
					$('[name=' + $scope.FieldsValues[i].value + ']').select2('val', '');
				}
			}

		}, 0)
		//	setTimeout(function(){
		/*	for(var i in $scope.FieldsValues)
	{
		if($scope.FieldsValues[i].type == 'dropdown')
	{
		console.log($scope.FieldsValues[i])
		$('[name='+$scope.FieldsValues[i].value+']').select2();
		$('[name='+$scope.FieldsValues[i].value+']').select2('val','');
		}
		}*/

		//},0)

	}

	$scope.checkDropdownSelected = function (data) {

		if (data == 'search') {
			GlobalService.SelectSearchVisible = false;
			$scope.SelectSearchVisible = GlobalService.SelectSearchVisible;
		} else {
			GlobalService.SelectSearchVisible = true;
			$scope.SelectSearchVisible = GlobalService.SelectSearchVisible;
		}
	}

	$scope.showAlertMsg = false;
	$scope.confirmationAlert = function (index) {

		$scope.showAlertMsg = true;
		$scope.selectedSearchName = index;
		$scope.DeleteSearchName = $scope.lskey[$scope.selectedSearchName];
	}

	$scope.deleteSelectedSearch = function (eve) {

		userData.savedSearch.FileList.splice($scope.selectedSearchName - 1, 1)
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
					$('#' + id).addClass('checked')
				}
			}
	}

	$scope.customDateRangePicker = function (sDate, eDate) {
		var startDate = new Date();
		var FromEndDate = new Date();
		var ToEndDate = new Date();
		ToEndDate.setDate(ToEndDate.getDate() + 365);

		/*  $('#'+sDate).datetimepicker({
		format: 'YYYY-MM-DD',
		autoclose: true,
		pickTime: false
		})

		$('#'+sDate).on('dp.change', function(e){
		alert()
		});*/

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

	$scope.customDateRangePicker('startDate', 'endDate')
	setTimeout(function () {
		$scope.customDateRangePicker('EntryDateStart', 'EntryDateEnd')
	}, 1000)

	$scope.CustomDatesReset = function () {
		$scope.startDate = '';
		$scope.endDate = '';
		$('#okBtn').attr('disabled', 'disabled')
		//$scope.customDateRangePicker()
		$scope.customDateRangePicker('startDate', 'endDate')
	}
	$scope.exportToExcelFlist = function (eve) {

		var table_html = $('#dummyExportContent').html();

		bankData.exportToExcelHtml(table_html, 'All Instructions');

		// $scope.dat = angular.copy($scope.loadedData);
		// $scope.dat.shift();

		// JSONToCSVConvertor(bankData,$scope.dat, 'AllFiles', true);


	}

	$scope.exportToTextDoc = function (name, UIR) {
		console.log(name, UIR)
		/*if(name.TransportName!=undefined){
		filename=name.TransportName;
		}else{
		//filename=name.InputReferenceCode+'_'+name.InstructionID;
		filename=UIR+'_'+name;
		}*/

		//console.log(name,UIR)
		filename = UIR + '_' + name;
		var content;
		var FLDownloadObj = {};
		FLDownloadObj.InstructionID = UIR;

		$http.post(BASEURL + RESTCALL.Filedownload, FLDownloadObj).success(function (data, status) {
			content = data[0].Data;

			bankData.textDownload($filter('hex2a')(content), filename);
		}).error(function (data, status, headers, config) {
			$scope.alerts = [{
					type : 'danger',
					msg : data.error.message
				}
			];
		});
	}

	$scope.printFLpage = function () {
		//$('#exportContent').find('table').find('thead').find('tr:first-child').find('th:first-child').removeAttr('nowrap')
		window.print()
		//$('#exportContent').find('table').find('thead').find('tr:first-child').find('th:first-child').attr('nowrap', true)
	}

	$scope.allowOnlyNumbersAlone = function ($event) {
		//  if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
		//              // Allow: Ctrl+A, Command+A
		//             (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) ||
		//              // Allow: home, end, left, right, down, up
		//             (e.keyCode >= 35 && e.keyCode <= 40)) {
		//                  // let it happen, don't do anything
		//                  return;
		//         }
		//         // Ensure that it is a number and stop the keypress
		//         if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
		//             e.preventDefault();
		//         }
		var txt = String.fromCharCode($event.which);
		//console.log(txt + ' : ' + $event.which);
		if (!txt.match(/[0-9]/)) //+#-.
		{
			//console.log(!txt.match(/[0-9]/))
			$event.preventDefault();
		}

	}
	$scope.notAllowAnything = function (eve) {
		// console.log(eve.keyCode)
		if ((eve.keyCode == 8) || (eve.keyCode == 9)) {
			return;
		} else {
			eve.preventDefault();
		}

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
			headHeight = $('.main-header').outerHeight(true) + 10;
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

});