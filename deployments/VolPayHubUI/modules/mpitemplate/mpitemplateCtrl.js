VolpayApp.controller('mpitemplateCtrl', function ($scope, $http, $state, $location, $timeout, GlobalService, LogoutService, $filter, bankData) {

	$scope.status1 = [{
			"actualvalue" : "ACTIVE",
			"displayvalue" : "ACTIVE"
		}, {
			"actualvalue" : "SUSPENDED",
			"displayvalue" : "SUSPENDED"
		}, {
			"actualvalue" : "CREATED",
			"displayvalue" : "CREATED"
		}, {
			"actualvalue" : "WAITINGFORAPPROVAL",
			"displayvalue" : "WAITINGFORAPPROVAL"
		}, {
			"actualvalue" : "APPROVED",
			"displayvalue" : "APPROVED"
		}, {
			"actualvalue" : "FORREVISION",
			"displayvalue" : "FORREVISION"
		}, {
			"actualvalue" : "REJECTED",
			"displayvalue" : "REJECTED"
		}, {
			"actualvalue" : "DELETED",
			"displayvalue" : "DELETED"
		}
	];

	$scope.Status = GlobalService.storeStatus ? GlobalService.storeStatus : $scope.status1;

	$scope.permission = {
		'C' : false,
		'D' : false,
		'R' : false,
		'U' : false
	}

	$http.post(BASEURL + RESTCALL.ResourcePermission, {
		"RoleId" : sessionStorage.ROLE_ID,
		"ResourceName" : "MPI Template"
	}).success(function (response) {
		for (k in response) {
			for (j in Object.keys($scope.permission)) {
				if (Object.keys($scope.permission)[j] == response[k].ResourcePermission) {
					$scope.permission[Object.keys($scope.permission)[j]] = true;
				}
			}
		}
	})

	if (GlobalService.Fxupdated != '') {
		$scope.alerts = [{
				type : 'success',
				msg : GlobalService.Fxupdated //Set the message to the popup window
			}
		];

		GlobalService.Fxupdated = '';
		$timeout(callAtTimeout, 4000);

	}

	$scope.sortMenu = [{
			"label" : "Template Name",
			"FieldName" : "TemplateName",
			"visible" : true,
			"Type" : "String"
		}, {
			"label" : "Creator",
			"FieldName" : "Creator",
			"visible" : true,
			"Type" : "DateOnly"
		}, {
			"label" : "Roles Accessible",
			"FieldName" : "RolesAccessible",
			"visible" : true,
			"Type" : "String"
		}, {
			"label" : "Status",
			"FieldName" : "Status",
			"visible" : true,
			"Type" : "String"
		}, {
			"label" : "Effective From Date",
			"FieldName" : "EffectiveFromDate",
			"visible" : true,
			"Type" : "DateOnly"
		}, {
			"label" : "Effective Till Date",
			"FieldName" : "EffectiveTillDate",
			"visible" : true,
			"Type" : "DateOnly"
		}
	]

	$scope.filterBydate = [{
			'actualvalue' : todayDate(),
			'displayvalue' : 'Today'
		}, {
			'actualvalue' : week(),
			'displayvalue' : 'This Week'
		}, {
			'actualvalue' : month(),
			'displayvalue' : 'This Month'
		}, {
			'actualvalue' : year(),
			'displayvalue' : 'This Year'
		}, {
			'actualvalue' : '',
			'displayvalue' : 'Custom'
		}
	]

	$scope.Status = [{
			"actualvalue" : "ACTIVE",
			"displayvalue" : "ACTIVE"
		}, {
			"actualvalue" : "SUSPENDED",
			"displayvalue" : "SUSPENDED"
		}, {
			"actualvalue" : "CREATED",
			"displayvalue" : "CREATED"
		}, {
			"actualvalue" : "WAITINGFORAPPROVAL",
			"displayvalue" : "WAITINGFORAPPROVAL"
		}, {
			"actualvalue" : "APPROVED",
			"displayvalue" : "APPROVED"
		}, {
			"actualvalue" : "FORREVISION",
			"displayvalue" : "FORREVISION"
		}, {
			"actualvalue" : "REJECTED",
			"displayvalue" : "REJECTED"
		}, {
			"actualvalue" : "DELETED",
			"displayvalue" : "DELETED"
		}
	]

	/*$scope.getDisplayValue = function(cmprWith, cmprThiz){

	if(cmprThiz || cmprThiz==false){
	cmprThiz = cmprThiz.toString()
	for(k in cmprWith.ChoiceOptions){
	if(cmprWith.ChoiceOptions[k].actualvalue == cmprThiz){
	return cmprWith.ChoiceOptions[k].displayvalue
	}
	}
	return cmprThiz
	}
	else{

	return cmprThiz
	}
	}*/

	$scope.focusInfn = function (data) {
		$('#' + data).focus()
	}

	$scope.filterParams = {};
	$scope.selectedStatus = [];

	/*$scope.setStatusvalue = function(val,to){
	var addme = true;
	if($scope.selectedStatus.length){
	for(k in $scope.selectedStatus){
	if($scope.selectedStatus[k] == val){
	$('#'+val).css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
	$scope.selectedStatus.splice(k,1);
	addme = false
	break
	}
	}
	if(addme){
	$('#'+val).css({'background-color':'#d8d5d5','box-shadow':''})
	$scope.selectedStatus.push(val);
	}
	}
	else{
	$('#'+val).css({'background-color':'#d8d5d5','box-shadow':''})
	$scope.selectedStatus.push(val);
	}
	to['Status'] = $scope.selectedStatus;
	console.log(val,to)
	}*/

	$scope.showCustom = false;
	$scope.selectedDate = '';

	/* $scope.setEffectivedate = function(val,to){
	to['EffectiveDate'] = val;
	if($scope.selectedDate == val.displayvalue){
	$scope.showCustom = false;
	$('.filterBydate').css({'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
	$scope.selectedDate = '';
	}
	else{
	$scope.showCustom = true;
	$scope.selectedDate = angular.copy(val.displayvalue);
	$('.filterBydate').css({'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
	$('#'+$scope.selectedDate.replace(/\s+/g, '')).css({'box-shadow':''})
	}

	if(typeof(val.actualvalue) == "object"){
	var date = []
	for(k in val.actualvalue){
	date.push(val.actualvalue[k])
	}
	$('#customPicker').find('input').each(function(i){
	if(i == 0){
	if(date[i] < date[Number(i+1)]){
	$(this).val(date[i])
	$(this).parent().children().each(function(){
	$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
	})
	}
	else{
	$(this).val(date[Number(i+1)])
	$(this).parent().children().each(function(){
	$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
	})
	}
	}
	else{
	$(this).val(date[Number(i-1)])
	$(this).parent().children().each(function(){
	$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
	})
	}
	})
	}
	else if(val.displayvalue == 'Custom'){
	$('#customPicker').find('input').each(function(i){
	$(this).parent().children().each(function(){
	$(this).css({'cursor': 'pointer'}).removeAttr('disabled').val('')
	})
	})
	}
	else{
	$('#customPicker').find('input').each(function(i){
	$(this).val(val.actualvalue)
	$(this).parent().children().each(function(){
	$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
	})
	})
	}
	}*/

	$scope.restResponse = {};
	function crudRequest(_method, _url, _data) {
		return $http({
			method : _method,
			url : BASEURL + _url,
			data : _data
		}).then(function (response) {
			$scope.restResponse = {
				'Status' : 'Success',
				'data' : response
			}
			//console.log('came')
			return $scope.restResponse
		}, function (error) {
			console.log(error.data.error.code)
			if (error.data.error.code == 401) {
				console.log(error)
				if (configData.Authorization == 'External') {
					window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
				} else {
					LogoutService.Logout();
				}
			}
			$scope.restResponse = {
				'Status' : 'Error',
				'data' : error.data.error.message
			}
			$('.modal').modal("hide");
			$scope.alerts = [{
					type : 'danger',
					msg : error.data.error.message //Set the message to the popup window
				}
			];
			//$timeout(callAtTimeout, 4000);
			return $scope.restResponse
		})
	}

	var restServer = RESTCALL.MPITemplates + 'readall';
	var delData = {};
	$scope.backUp = {};
	$scope.indexx = "";
	$scope.dataFound = false;
	$scope.loadMorecalled = false;
	$scope.CRUD = "";
	$scope.restVal = []

	/*** Sorting ***/
	/* $scope.orderByField = 'OfficeCode';
	$scope.SortReverse  = false;
	$scope.SortType = 'Asc';*/

	if (GlobalService.Fxupdated != '') {
		$scope.alerts = [{
				type : 'success',
				msg : GlobalService.Fxupdated //Set the message to the popup window
			}
		];

		GlobalService.Fxupdated = '';
		$timeout(callAtTimeout, 4000);

	}

	$scope.takeBackup = function (val, Id) {
		$scope.backUp = angular.copy(val);
		$scope.indexx = angular.copy(Id);
	}

	$scope.cancelpressed = function (Id) {
		$scope.restVal[$scope.indexx] = $scope.backUp;
		$('#editingWindow_' + Id).collapse('hide');
		$('#displayingWindow_' + Id).collapse('show');
	}

	$scope.prev = null;

	/*$scope.toggleWindow = function(val,Id,viewMe){
	$scope.viewMe = viewMe;
	if($scope.prev != null){
	$('#collapse'+$scope.prev).collapse('hide');
	}

	$scope.prev = Id;

	$scope.takeBackup(val,Id);
	$scope.takeDeldata(val,Id);

	$('#displayingWindow_'+Id).collapse('hide');
	$('.displayWindow').collapse('show');
	$('.editWindow').collapse('hide');
	$('#editingWindow_'+Id).collapse('show');
	$('.editHere').removeClass('trHilght');
	$('#editHere_'+Id).addClass('trHilght');
	$('.collapse').removeClass('trHilght');
	$('#collapse'+Id).addClass('trHilght');

	$('#listViewPanelHeading_'+Id).collapse('hide');
	$('#collapse'+Id).collapse('show');

	$('.listViewPanelHeading').css('display','block')
	$('#listViewPanelHeading_'+Id).css('display','none')

	}*/

	$scope.setViewMe = function (viewMe) {
		$scope.viewMe = viewMe;
	}

	$scope.takeDeldata = function (val, Id) {
		delData = val;
		$scope.delIndex = Id;
	}

	//I Load the initial set of datas onload
	$scope.initData = function () {

		$scope.bankData = {};

		/*$scope.bankData ={};
		$scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
		$scope.bankData.start=0;
		$scope.bankData.count=20;*/

		// $scope.bankData ={
		//                   "start": 0,
		//                   "count": 20,
		//                   "Queryfield":[],
		//                   "QueryOrder": []
		//                 }

		$scope.bankData.QueryOrder = [];
		$scope.bankData.start = 0;
		$scope.bankData.count = 20;
		$scope.bankData.Operator = "AND";

		$scope.dupBankData = angular.copy($scope.bankData)

			$scope.bankData = constructQuery($scope.bankData);
		//console.log($scope.bankData)


		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);

	}

	$scope.initData()
	//I Load More datas on scroll
	var len = 20;
	$scope.loadMore = function () {

		$scope.loadMorecalled = true;
		//$scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];

		console.log($scope.bankData)
		$scope.bankData.start = len;
		$scope.bankData.count = 20;

		//$scope.bankData = constructQuery($scope.bankData);
		//$scope.bankData.sorts=[];
		crudRequest("POST", restServer, $scope.bankData).then(function (response) {
			$scope.lenthofData = response.data.data;
			if (response.data.data.length != 0) {
				$scope.restVal = $scope.restVal.concat(response.data.data)
					len = len + 20;
			}
		})
	}
	$scope.loadData = function () {

		$scope.bankData.start = 0
			$scope.bankData.count = 20
			len = 20;
		$('.listView').scrollTop(0)
		$scope.initData();
	}
	// I process the Create Data Request.
	$scope.createData = function (newData) {
		restServer = RESTCALL.MPITemplates;
		newData = removeEmptyValueKeys(newData)

			bankData.crudRequest("POST", restServer, newData).then(getData, errorFunc);
		$scope.CRUD = "Created Successfully";
		$scope.newData = ""; // Reset the form once values have been consumed.
	};

	// I update the given data to the Restserver.
	$scope.updateData = function (editedData) {
		delete editedData.$$hashKey;
		editedData = removeEmptyValueKeys(editedData)
			restServer = RESTCALL.MPITemplates;
		bankData.crudRequest("PUT", restServer, editedData).then(getData, errorFunc);
		$scope.CRUD = "Updated Successfully";
	};

	// I delete the given data from the Restserver.
	$scope.deleteData = function () {
		delete delData.$$hashKey

		$scope.delObj = {};
		/*$scope.delObj.OfficeCode = delData.OfficeCode;
		$scope.delObj.ApplicableDate = delData.ApplicableDate;
		$scope.delObj.SourceCurrency = delData.SourceCurrency;
		$scope.delObj.TargetCurrency = delData.TargetCurrency;*/
		$scope.delObj.TemplateName = delData.TemplateName
			console.log(delData)

			restServer = RESTCALL.MPITemplates + 'delete';

		bankData.crudRequest("POST", restServer, $scope.delObj).then(getData, errorFunc);
		$('.modal').modal("hide");
		$('body').removeClass('modal-open')
	};

	// I load the rest data from the server.
	function getData(response) {

		$scope.CRUD = response.data.responseMessage;
		$scope.loadMorecalled = false;

		//$scope.bankData.IsReadAllRecord = true;
		// $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
		$scope.bankData.QueryOrder = [];
		$scope.bankData.start = 0;
		$scope.bankData.count = len;

		$scope.bankData = constructQuery($scope.bankData);

		restServer = RESTCALL.MPITemplates + 'readall';
		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
	}

	$scope.bData = '';
	// I apply the rest data to the local scope.
	function applyRestData(restDat) {
		//	alert()
		$scope.bData = angular.copy(restDat)

			var restData = restDat.data;
		$scope.restVal = restData;

		console.log($scope.restVal)
		//console.log(restDat.headers().totalcount)
		$scope.totalForCountbar = restDat.headers().totalcount;
		$scope.restVal.splice(0, 0, {});

		$scope.lenthofData = $scope.bData.data;

		if ($scope.restVal.length == 1) {
			$scope.dataFound = true;
		} else {
			$scope.dataFound = false;
		}
		if ($scope.CRUD != "") {
			$scope.alerts = [{
					type : 'success',
					msg : $scope.CRUD //Set the message to the popup window
				}
			];
			$timeout(callAtTimeout, 4000);
		}

		$('.alert-danger').hide()

	}

	// I apply the Error Message to the Popup Window.
	function errorFunc(errorMessag) {
		if (errorMessag.status == 401) {
			if (configData.Authorization == 'External') {
				window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
			} else {

				LogoutService.Logout();
			}
		} else {

			$scope.alerts = [{
					type : 'danger',
					msg : errorMessag.data.error.message //Set the message to the popup window
				}
			];

		}
	}

	function callAtTimeout() {
		$('.alert').hide();
	}

	$scope.viewData = function (data, flag) {

		GlobalService.fromAddNew = false;
		delete data.$$hashKey;
		GlobalService.specificData = data;
		GlobalService.ViewClicked = flag;

		$state.go('app.mpidetail', {
			input : $scope.permission
		})
	}

	$scope.addFxRate = function () {
		GlobalService.fromAddNew = true;
		GlobalService.ViewClicked = false;
		$location.path('app/mpidetail')
	}

	$scope.multipleEmptySpace = function (e) {
		if ($.trim($(e.currentTarget).val()).length == 0) {
			$(e.currentTarget).val('');
		}
	}

	var sortOrder = [];
	$scope.bankData = {
		"start" : 0,
		"count" : 20,
		"sorts" : []
	}

	$scope.gotoSorting = function (dat) {

		console.log(dat)
		//$scope.dupBankData.start = 0;
		//$scope.dupBankData.count = len;

		$scope.bankData.start = 0;
		$scope.bankData.count = len;

		var orderFlag = true;
		if ($scope.bankData.sorts.length) {
			for (k in $scope.bankData.sorts) {
				if ($scope.bankData.sorts[k].columnName == dat.FieldName) {
					if ($scope.bankData.sorts[k].sortOrder == 'Asc') {
						$('#' + dat.FieldName + '_icon').attr('class', 'fa fa-long-arrow-down')
						$('#' + dat.FieldName + '_Icon').attr('class', 'fa fa-caret-down')
						$scope.bankData.sorts[k].sortOrder = 'Desc'
							orderFlag = false;
						break;
					} else {
						$scope.bankData.sorts.splice(k, 1);
						orderFlag = false;
						$('#' + dat.FieldName + '_icon').attr('class', 'fa fa-minus fa-sm')
						$('#' + dat.FieldName + '_Icon').removeAttr('class')
						break;
					}
				}
			}
			if (orderFlag) {
				$('#' + dat.FieldName + '_icon').attr('class', 'fa fa-long-arrow-up')
				$('#' + dat.FieldName + '_Icon').attr('class', 'fa fa-caret-up')
				$scope.bankData.sorts.push({
					"columnName" : dat.FieldName,
					"sortOrder" : 'Asc'
				})

			}
		} else {
			$('#' + dat.FieldName + '_icon').attr('class', 'fa fa-long-arrow-up')
			$('#' + dat.FieldName + '_Icon').attr('class', 'fa fa-caret-up')
			$scope.bankData.sorts.push({
				"columnName" : dat.FieldName,
				"sortOrder" : 'Asc'
			})

		}

		//$scope.bankData = constructQuery($scope.dupBankData);
		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);

	}

	$scope.clearSort = function (id) {
		$(id).find('i').each(function () {
			$(this).removeAttr('class').attr('class', 'fa fa-minus fa-sm');
			$('#' + $(this).attr('id').split('_')[0] + '_Icon').removeAttr('class');
		});

		//$scope.restInputData.QueryOrder = [];
		//$scope.applyRestData();

		// $scope.bankData = {
		// 	"start":0,
		// 	"count":20
		// };
		$scope.bankData.sorts = [];

		//$scope.bankData = constructQuery($scope.bankData);
		console.log($scope.bankData)
		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);

	}
	/* $scope.gotoSorting = function(dat){

	console.log($scope.dupBankData)
	//$scope.dupBankData.start = 0;
	//$scope.dupBankData.count = len;

	//$scope.bankData = constructQuery($scope.bankData);


	// console.log(dat)
	$scope.bankData.start = 0;
	$scope.bankData.count = len;


	console.log(Object.keys($scope.bankData).indexOf('sorts'))
	//$scope.bankData.sorts = [];
	//console.log($scope.bankData)
	//$scope.bankData.QueryOrder = [];
	//	$scope.bankData = constructQuery($scope.bankData);
	var orderFlag = true;

	console.log($scope.bankData)
	if($scope.bankData.sorts.length){

	for(k in $scope.bankData.sorts){
	if($scope.bankData.sorts[k].columnName == dat.FieldName){
	if($scope.bankData.sorts[k].sortOrder == 'Asc'){
	$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-desc')
	$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-down')
	$scope.bankData.sorts[k].sortOrder = 'Desc'
	orderFlag = false;
	break;
	}
	else{
	$scope.bankData.sorts.splice(k,1);
	orderFlag = false;
	$('#'+dat.FieldName+'_icon').attr('class','fa fa-hand-pointer-o')
	$('#'+dat.FieldName+'_Icon').removeAttr('class')
	break;
	}
	}
	}
	if(orderFlag){

	$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
	$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
	$scope.bankData.sorts.push({
	"columnName": dat.FieldName,
	"sortOrder": 'Asc'
	})

	}
	}
	else{

	$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
	$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
	$scope.bankData.sorts.push({
	"columnName": dat.FieldName,
	"sortOrder": 'Asc'
	})

	}

	// $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder": $scope.SortType}]
	//$scope.bankData.start=0;
	//$scope.bankData.count=20;
	//$scope.bankData.Operator = "AND";

	// $scope.bankData = constructQuery($scope.bankData);


	bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);

	}*/

	$scope.buildFilter = function (argu1, argu2) {
		console.log(argu1, argu2)
		for (k in $scope.sortMenu) {
			if ($scope.sortMenu[k].Type == 'String') {
				argu2.push({
					"columnName" : $scope.sortMenu[k].FieldName,
					"operator" : "LIKE",
					"value" : argu1
				})
			}
		}
		return argu2;
		//console.log(argu2)
	}

	$scope.searchFilter = function (val) {
		console.log(val);
		val = removeEmptyValueKeys(val)
			$scope.bankData.filters = removeEmptyValueKeys($scope.bankData.filters)

			console.log(val)
			$scope.bankData.filters = {
			"logicalOperator" : "AND",
			"groupLvl1" : [{
					"logicalOperator" : "AND",
					"groupLvl2" : [{
							"logicalOperator" : "AND",
							"groupLvl3" : []
						}
					]
				}
			]
		}
		for (j in Object.keys(val)) {
			$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
				"logicalOperator" : "OR",
				"clauses" : []
			})
			if (Object.prototype.toString.call(val[Object.keys(val)[j]]) === '[object Array]') {
				for (i in val[Object.keys(val)[j]]) {
					console.log('in if', val[Object.keys(val)[j]][i])
					$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName" : Object.keys(val)[j],
						"operator" : "=",
						"value" : val[Object.keys(val)[j]][i]
					})
				}
			} else {
				if (typeof(val[Object.keys(val)[j]]) === 'object') {
					$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].logicalOperator = "AND"
						$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
							"columnName" : "EffectiveFromDate",
							"operator" : $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
							"value" : $('#startDate').val()
						})
						$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
							"columnName" : "EffectiveFromDate",
							"operator" : $('#startDate').val() == $('#endDate').val() ? '=' : $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
							"value" : $('#endDate').val()
						})
				} else {
					$scope.buildFilter(val[Object.keys(val)[j]], $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses)
				}

			}
		}
		//$scope.bankData = constructQuery($scope.bankData)
		$scope.filterParams = {};
		$('.filterBydate').each(function () {
			$(this).css({
				'background-color' : '#fff',
				'box-shadow' : '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
			})
		})

		$scope.selectedStatus = [];
		$('.filterBystatus').each(function () {
			$(this).css({
				'background-color' : '#fff',
				'box-shadow' : '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
			})
		})
		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
	}

	$scope.clearFilter = function () {
		$scope.bankData = {
			"start" : 0,
			"count" : 20,
			"sorts" : []
		}
		$scope.showCustom = false;
		$scope.filterParams = {};
		$('.filterBydate').each(function () {
			$(this).css({
				'box-shadow' : '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
			})
		})

		$scope.selectedStatus = [];
		$('.filterBystatus').each(function () {
			$(this).css({
				'box-shadow' : '1.18px 2px 1px 1px rgba(0,0,0,0.40)'
			})
		})
		$('.customDropdown').removeClass('open');
		$scope.bankData = constructQuery($scope.bankData)
			bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData, errorFunc);
	}

	$scope.multiSortObj = []
	/* $scope.Sorting = function(orderByField,evt){
	$scope.CRUD = '';
	$scope.loadMorecalled = false;
	$scope.orderByField = orderByField;

	if($scope.SortReverse == false){
	$scope.SortType = 'Desc';
	$scope.SortReverse = true;
	}
	else{
	$scope.SortType = 'Asc';
	$scope.SortReverse = false;
	}

	var QueryOrder={};
	QueryOrder.ColumnName = orderByField;
	QueryOrder.ColumnOrder = $scope.SortType;

	len = 20;

	var sortObj = {};
	sortObj.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
	sortObj.start=0;
	sortObj.count=20;

	bankData.crudRequest("POST", restServer, sortObj).then(applyRestData,errorFunc);


	}*/

	var debounceHandler = _.debounce($scope.loadMore, 700, true);

	/*** To control Load more data ***/
	jQuery(
		function ($) {
		$('.listView').bind('scroll', function () {
			$scope.widthOnScroll();
			if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
				if ($scope.lenthofData.length >= 20) {
					debounceHandler()
					//$scope.loadMore();
				}
			}
		})
		setTimeout(function () {}, 1000)

		// $(window).bind('scroll', function()
		// {
		// 	if($scope.changeViewFlag){
		// 		$scope.widthOnScroll();

		// 		if(($(window).scrollTop() + $(window).height()) >= ($(document).height()-2))
		// 		{
		// 			if($scope.lenthofData.length >= 20){
		// 				$scope.loadMore();
		// 			}
		// 		}
		// 	}
		// })
		// setTimeout(function(){},1000)

		$('.dropdown-menu #Filter').click(function (e) {
			e.stopPropagation();
		});

	});

	function autoScrollDiv() {
		$(".dataGroupsScroll").scrollTop(0);
	}

	/** List and Grid view Starts**/
	$scope.listTooltip = "List View";
	$scope.gridTooltip = "Grid View";
	$scope.changeViewFlag = GlobalService.viewFlag;

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

	// $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
	// if ($scope.changeViewFlag) {
	// 	$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
	// 	$scope.changeViewFlag = true;
	// }
	// else {
	// 	$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
	// 	$scope.changeViewFlag = false;
	// }

	// $scope.hello = function (value, eve) {
	// var hitId = eve.currentTarget.id;
	// $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
	// $('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');
	// 	if (value == "list") {
	// 		$scope.changeViewFlag = !$scope.changeViewFlag;
	// 	}
	// 	else if (value == "grid") {
	// 		$scope.changeViewFlag = !$scope.changeViewFlag;
	// 	}
	// 	else {
	// 		$scope.changeViewFlag = !$scope.changeViewFlag;
	// 	}
	// 	GlobalService.viewFlag = $scope.changeViewFlag;
	// }

	/** List and Grid view Ends**/

	/*** Print function ***/
	$scope.printFn = function () {
		$('[data-toggle="tooltip"]').tooltip('hide');
		window.print()
	}

	$scope.TotalCount = 0;
	// for(j in $scope.Status){
	// 	getCountbyStatus($scope.Status[j])
	// }


	$scope.ExportMore = function (argu, excelLimit) {
		console.log(argu, excelLimit)
		if (argu >= excelLimit) {
			//console.log('limit',$scope.Title+'_'+(''+excelLimit)[0])
			JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? 'FxRates' + '_' + ('' + excelLimit)[0] : 'FxRates', true);
			$scope.dat = [];
			excelLimit += 100000;
		}
		crudRequest("POST", RESTCALL.MPITemplates + "readall", {
			"start" : argu,
			"count" : ($scope.TotalCount > 1000) ? 1000 : $scope.TotalCount
		}).then(function (response) {

			$scope.dat = $scope.dat.concat(response.data.data)

				if (response.data.data.length >= 1000) {
					console.log(argu)
					argu += 1000;
					$scope.ExportMore(argu, excelLimit)
				} else {

					JSONToCSVConvertor(bankData, $scope.dat, (argu > excelLimit) ? 'FxRates' + '_' + ('' + excelLimit)[0] : 'FxRates', true);
				}

		})
	}

	function getCountbyStatus(argu) {
		crudRequest("GET", RESTCALL.MPITemplates + argu.actualvalue + '/count', "").then(function (response) {
			//console.log(response.data.data.TotalCount,response.data.data)
			argu.TotalCount = response.data.data.TotalCount;
			$scope.TotalCount = $scope.TotalCount + response.data.data.TotalCount;
			//console.log($scope.TotalCount)
			//console.log($scope.TotalCount,response.data.data.TotalCount,$scope.TotalCount + response.data.data.TotalCount)
			return response.data.data.TotalCount
		})
	}

	$("#expbtn").click(function () {
		$scope.dat = [];
		//var radioValue = $("input[name='gender']:checked").val();
		if ($("input[name='gender'][value='All']").prop("checked")) {
			$scope.ExportMore(0, 100000);
		} else {
			//$scope.dat = [];
			$scope.dat = angular.copy($scope.restVal);
			$scope.dat.shift();

			JSONToCSVConvertor(bankData, $scope.dat, 'FXRates', true);
		}
	});

	/* $scope.exportAsExcel = function(data){
	$scope.dat = [];
	$scope.dat = angular.copy($scope.restVal);
	//$scope.dat.shift();
	console.log($scope.dat,data);

	JSONToCSVConvertor(bankData,$scope.dat, 'FXRates', true);
	//$scope.dat.shift();
	//bankData.exportToExcel($scope.dat, $scope.Title)
	//JSONToCSVConvertor(bankData,$scope.dat, 'FXRates', true);
	}*/

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
				useAbsolutePositioning : true,
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
		$(window).trigger('resize');

	})

});