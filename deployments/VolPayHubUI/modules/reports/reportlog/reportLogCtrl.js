VolpayApp.controller('reportLogCtrl', function ($scope, $http, $location, $timeout, $filter, GlobalService,LogoutService){
//console.log(BASEURL)
	
	/*** Sorting ***/
	var sortObj = {};
	//sortObj.QueryOrder = [{"ColumnName":"SEND_DATE","ColumnOrder":"Desc"}];
	
	$http({
		url : BASEURL + "/rest/v2/reports/log/readall",
		method : "POST",
		async : false,
		cache : false,
		data : sortObj,
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function (data, status, headers, config) {
		console.log(data);
		$scope.items = data;

		//$(".alert-danger").alert("close");
	}).error(function (data, status, headers, config) {
		if(status == 401)
		{
			if(configData.Authorization=='External'){										
				window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
			}
			else{
				LogoutService.Logout();
			}
		}
		else
		{
			$scope.alerts = [{
				  type: 'danger',
				  msg: data.error.message
			  }];
		}
	});
	
	$scope.Download=function(reports){
		
		$scope.pdfName = $filter('dateFormat')(reports.SendDate)+'_'+reports.ReportID+'_'+reports.UserName+'.pdf'
		//console.log($scope.pdfName)
		
		$http({
		url : BASEURL + "/rest/v2/reports/download",
		method : "POST",
		async : false,
		cache : false,
		data : {"FolioID": reports.FolioID},
		headers : {
			'Content-Type' : 'application/json'
		}
	}).success(function (data, status, headers, config) {
		
		var pdf = 'data:application/octet-stream;base64,' +data.ReportInfo[0].rawOutFile;
		var dlnk = document.getElementById('dwnldLnk');
		dlnk.href = pdf;
		dlnk.download = $scope.pdfName;
		dlnk.click();
		
	}).error(function (data, status, headers, config) {
		
	}); 
		
		
		
	}
	
	$scope.Sorting = function(orderByField){
		$scope.orderByField = orderByField;

		if($scope.SortReverse == false)
		{
		   $scope.SortType = 'Desc';
		   $scope.SortReverse = true;
		}
		else
		{
			$scope.SortType = 'Asc';
			$scope.SortReverse = false;
		}

		var QueryOrder={};
		QueryOrder.ColumnName = orderByField;
		QueryOrder.ColumnOrder = $scope.SortType;

		var sortObj = {};
		//sortObj.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
		$http({
			url : BASEURL + "/rest/v2/reports/log/readall",
			method : "POST",
			async : false,
			cache : false,
			data : sortObj,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			$scope.items = data;
		}).error(function (data, status, headers, config) {
			
		});
	}
	
	
});