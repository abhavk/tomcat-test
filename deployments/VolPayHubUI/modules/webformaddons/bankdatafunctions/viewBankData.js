VolpayApp.controller('webviewBankData', function ($scope, $state, $timeout, $stateParams, $filter, $http, bankData, GlobalService, LogoutService) {
	$scope.auditError404 = true
	$scope.parentInput = $stateParams.input;
	console.log($scope.parentInput)
	$scope.fieldData = ($stateParams.input.fieldData)?$stateParams.input.fieldData:{};
	$scope.IconName = ($scope.parentInput.gotoPage.IconName)?$scope.parentInput.gotoPage.IconName:''
	//if(('FDCParameters' in $scope.fieldData) && ($scope.fieldData['FDCParameters'].match(/</g)) && ($scope.fieldData['FDCParameters'].match(/>/g))){
	if('FDCParameters' in $scope.fieldData && typeof($scope.fieldData['FDCParameters']) != 'object' && ($scope.fieldData['FDCParameters'].match(/</g))&&($scope.fieldData['FDCParameters'].match(/>/g))){
		xmlDoc = $.parseXML($scope.fieldData['FDCParameters']); //is valid XML
		console.log(xmlArr, $scope.fieldData['FDCParameters'])
		var xmlData = xmlDoc.getElementsByTagName("FieldPath");
		var xmlArr = []
		for(k in xmlData){
			if(xmlData[k].innerHTML)
			xmlArr.push(xmlData[k].innerHTML)
			console.log(xmlData,xmlData[k].innerHTML)
		}
		
		$scope.fieldData['FDCParameters'] = xmlArr
	}
	
	$scope.gotoState = function(inputData){	
		$scope.parentInput['Operation'] = inputData['Operation']
		$state.go('app.addonoperation', {query: $scope.parentInput.ulName.replace(/\s+/g, ''), input:$scope.parentInput});
	}
	
	
	$scope.gotoParent = function(alertMsg){
		$scope.input = {
			'gotoPage' : $stateParams.input.gotoPage,
			'responseMessage' : alertMsg
		}
		$state.go('app.webformPlugin', {query: $scope.parentInput.ulName.replace(/\s+/g, ''), input:$scope.input});
	}
	
	
	/** List and Grid view Ends**/
	$scope.restResponse = {};  
	function crudRequest(_method, _url, _data){
		return $http({
			method: _method,
			url: BASEURL + "/rest/v2/" + _url,
			data: _data
		}).then(function(response){
			$scope.restResponse = {
				'Status' : 'Success',
				'data'	: response 
			}
			return $scope.restResponse
		},function(error){
			if(error.status == 401){
				if(configData.Authorization=='External'){
                    window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
                }
                else{
                    LogoutService.Logout();
                }
			}
			$scope.restResponse = {
				'Status' : 'Error',
				'data'	: error.data.error.message  
			}
			$('.modal').modal("hide");
			$scope.alerts = [{
								type : 'danger',
								msg : error.data.error.message 		//Set the message to the popup window
							}];	
			/* $timeout(function(){
				$('#statusBox').hide();
			}, 4000); */
			return $scope.restResponse
		})
	}
	
	
	// I delete the given data from the Restserver.
	$scope.deleteData = function() {
		delete $scope.fieldData.$$hashKey
		$scope.delval = {}
		for(var j in $scope.parentInput.primarykey){
			$scope.delval[$scope.parentInput.primarykey[j]] = $scope.fieldData[$scope.parentInput.primarykey[j]]			
		}
		
		crudRequest("POST", $scope.parentInput.parentLink+'/delete', $scope.delval).then(function(response){
			$scope.auditError404 = true;
			if(response.Status === 'Success'){
				
				$scope.gotoParent("Deleted Successfully");				
			}
		})
	}	
	$scope.editedLog = [];
	$scope.auditVal = {}
	for(var j in $scope.parentInput.primarykey){	
		$scope.auditVal[$scope.parentInput.primarykey[j]] = $scope.fieldData[$scope.parentInput.primarykey[j]]			
	}
	console.log($scope.parentInput.primarykey,$scope.auditVal) 
	if($scope.parentInput.parentLink != 'logconfig'){
		crudRequest("POST", $scope.parentInput.parentLink+'/audit/readall', $scope.auditVal).then(function(response){
			console.log(response.data.data)
				console.log(response)
			if((response.Status=='Error')&&(!response.data.data)){
				$scope.auditError404 = false
				//console.log('adf')

				//$('.modal').modal("hide");
			}	
			$scope.editedLog = response.data.data
		})
	}
	 
	$scope.getDisplayValue = function(cmprWith, cmprThiz){
	//console.log(cmprWith,cmprThiz)
		if(cmprThiz || cmprThiz == false){			
			cmprThiz = cmprThiz.toString()
			for(k in cmprWith){
				if(cmprWith[k].actualvalue == cmprThiz){
					return cmprWith[k].displayvalue
				}
			}
			return cmprThiz
		}
		else{
			console.log('ad',cmprThiz)
			return cmprThiz
		}
	}
	$scope.AssociatedVal = [];
	$scope.ReqAssociated = [{
								'AssociatedKey' : [
														{
															'FieldName' : "ServiceCode",
															'Label'		: "Service Code"
														},
														{
															'FieldName' : "ServiceName",
															'Label'		: "Service Name"
														},
														{
															'FieldName' : "EffectiveFromDate",
															'Label'		: "Effective From Date"
														},
														{
															'FieldName' : "EffectiveTillDate",
															'Label'		: "Effective Till Date"
														},
														{
															'FieldName' : "Status",
															'Label'		: "Status"
														},
													],
								'gotoLink'		: 	'services',
								'parentInfo'	: 	{
														'Link' 		: 	'servicegroups',
														'Label'		:	'Service Groups',
														'fieldName'	:	'ServiceGroupCode'
													},
								'Key'			:	[],
								'Data'			:	[]
							},
							{
								'AssociatedKey' : [
														{
															'FieldName' : "BranchCode",
															'Label'		: "Branch Code"
														},
														{
															'FieldName' : "BranchName",
															'Label'		: "Branch Name"
														},
														{
															'FieldName' : "EffectiveFromDate",
															'Label'		: "Effective From Date"
														},
														{
															'FieldName' : "EffectiveTillDate",
															'Label'		: "Effective Till Date"
														},
														{
															'FieldName' : "Status",
															'Label'		: "Status"
														},
													],
								'gotoLink'		: 	'branches',
								'parentInfo'	: 	{
														'Link' 		: 	'offices',
														'Label'		:	'Office',
														'fieldName'	:	'OfficeCode'
													},
								'Key'			:	[],
								'Data'			:	[]
							}]
			
	for(linking in $scope.ReqAssociated){
		if($scope.ReqAssociated[linking].parentInfo.Link == $scope.parentInput.parentLink){
			$scope.AssociatedVal = $scope.ReqAssociated[linking];
			$scope.AssociatesInputData = {"filters":{"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND","groupLvl3":[{"logicalOperator":"AND","clauses":[{"columnName":$scope.AssociatedVal.parentInfo.fieldName,"operator":"=","value":$scope.parentInput.fieldData[$scope.AssociatedVal.parentInfo.fieldName]}]}]}]}]},"sorts":[],"start":0,"count":20}
				gotoLoadmore($scope.AssociatedVal.gotoLink,$scope.AssociatesInputData)
		}
	}
	$scope.dtLen = 0
	function gotoLoadmore(argu1,argu2){
		crudRequest("POST", argu1+'/readall', argu2).then(function(response){
			if(response.data.data.length != 0){
				$scope.dtLen = response.data.data;
				$scope.AssociatedVal.Data = $scope.AssociatedVal.Data.concat(response.data.data);
				crudRequest("GET", argu1+'/primarykey', '').then(function(response){
					$scope.setprimarykey = response.data.data.responseMessage
				})
			}
		})
	}

	$(document).ready(function(){
		$('.listView').on('scroll', function() { 
			if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight) {
				debounceHandler();
			}
		});
		
		$(".FixHead").scroll(function (e) {
			var $tablesToFloatHeaders = $('table');
			//console.log($tablesToFloatHeaders)
			$tablesToFloatHeaders.floatThead({
				//useAbsolutePositioning: true,
				scrollContainer: true
			})
			$tablesToFloatHeaders.each(function () {
				var $table = $(this);
				//console.log($table.find("thead").length)
				// $table.closest('.FixHead').scroll(function (e) {
				// 	$table.floatThead('reflow');
				// });
			});
		})
		


		$(window).bind("resize",function(){
			setTimeout(function(){
            	$(".listView").scrollLeft(30)      
			},300)
			if($(".dataGroupsScroll").scrollTop() == 0){
				$(".dataGroupsScroll").scrollTop(50)
			}
			
		})
		$(window).trigger('resize'); 
	})
	
	//I Load More datas on scroll
	var loadMore = function(){
		if($scope.dtLen.length >= 20){
			$scope.AssociatesInputData.start += 20;
			gotoLoadmore($scope.AssociatedVal.gotoLink,$scope.AssociatesInputData)
		}
		
	}	

	var debounceHandler = _.debounce(loadMore, 700, true);
	

	 $scope.gotoService = function(argu){	
		if(!argu.fieldData){
			argu.fieldData = {}
			argu.fieldData[$scope.AssociatedVal.parentInfo.fieldName] = $scope.parentInput.fieldData[$scope.AssociatedVal.parentInfo.fieldName];
		}
		$scope.serviceInput = {
			'toPage':	$scope.AssociatedVal.gotoLink,
			'val'	: 	argu
		}
		console.log($scope.serviceInput)
		$state.go('app', {details:$scope.serviceInput},{'reload':true});
	} 
	
});
