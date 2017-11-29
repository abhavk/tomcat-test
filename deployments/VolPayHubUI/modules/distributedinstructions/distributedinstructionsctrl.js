VolpayApp.controller('distributedinstructionsctrl', function ($scope, $rootScope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService,CommonService ) {

$rootScope.customDate={};
		$scope.sortMenu = [
						{
							"label":"Office Code",
							"FieldName":"OfficeCode",
							"visible":true,
							"Type":"String"
						},
						{
							"label":"Unique Output Reference",
							"FieldName":"UniqueOutputReference",
							"visible":true,
							"Type":"String"
						},
						{
							"label":"Destination Channel",
							"FieldName":"DestinationChannel",
							"visible":true,
							"Type":"String"
						},
						{
							"label":"Sent Date",
							"FieldName":"SentDate",
							"visible":true,
							"Type":"DateOnly"
						},
						{
							"label":"Output Message",
							"FieldName":"OutputMessage",
							"visible":true,
							"Type":"String"
						}
					 ]

//	$scope.dateArr = [];				 

	$scope.commonObj = CommonService.distInstruction;
	$scope.dateFilter = CommonService.distInstruction.dateFilter;


	//console.log($scope.dateFilter)

	//$scope
	for(var i in $scope.dateFilter)
	{
		if($scope.dateFilter[i])
		{
			$('#dropTxt').text($filter('ucwords')(i))
		}
	}

	//$scope.retExpResult()

	$scope.searchFound = $scope.commonObj.searchFound;
	$scope.loadedData='';	
	$scope.uorVal = $scope.uorFound  = $scope.commonObj.uorVal;

	$scope.fieldArr = $scope.commonObj.currentObj;
	var len = 20;


	$scope.changeViewFlag = GlobalService.viewFlag;

	$scope.retExpResult = function()
	{
		if(!$scope.dateFilter.custom)
		{
			$scope.customDate = 
						{
						startDate:'',
						endDate:''
						}
		}
		
		if($scope.dateFilter.all)
		{
			$scope.dateArr = [];
		}
		else if($scope.dateFilter.today)
		{
			$scope.dateArr = [
					{
						"ColumnName": "SentDate",
						"ColumnOperation": "=",	
						"ColumnValue": todayDate()
					}
				]
		}
		else if($scope.dateFilter.week)
		{
			$scope.dateArr = [
				{
					"ColumnName":"SentDate",
					"ColumnOperation":">=",	
					"ColumnValue":week().lastDate
				},
				{
					"ColumnName":"SentDate",
					"ColumnOperation":"<=",	
					"ColumnValue":week().todayDate
				}
			]
		}	
		else if($scope.dateFilter.month)
		{
			$scope.dateArr = [
					{
						"ColumnName":"SentDate",
						"ColumnOperation":">=",	
						"ColumnValue":month().lastDate
					},
					{
						"ColumnName":"SentDate",
						"ColumnOperation":"<=",	
						"ColumnValue":month().todayDate
					}
				]

		}
		else if($scope.dateFilter.custom)
		{	
			
			//console.log("ab",$rootScope.customDate,$scope.customDate)
			$scope.customDate.startDate = CommonService.distInstruction.customDate.startDate;
			$scope.customDate.endDate = CommonService.distInstruction.customDate.endDate;


			$('#customDate').modal('hide')
			$scope.dateArr = [
					{
						"ColumnName":"SentDate",
						"ColumnOperation":">=",	
						"ColumnValue":$scope.customDate.startDate
					},
					{
						"ColumnName":"SentDate",
						"ColumnOperation":"<=",	
						"ColumnValue":$scope.customDate.endDate
					}
				]

		}

		return $scope.dateArr;

	}
	$scope.retExpResult()


	/* Query Constructor */
	$scope.uorQueryConstruct = function(arr)
	{
		//console.log("in",arr)

		CommonService.distInstruction.currentObj = arr;
		$scope.fieldArr = arr;

		$scope.Qobj = {}
		$scope.Qobj.start = arr.start;
		$scope.Qobj.count = arr.count;
		$scope.Qobj.Queryfield = [];
		$scope.Qobj.QueryOrder = [];
			for(var i in arr)
			{
				if(i == 'params')
				{
					for(var j in arr[i])
					{
						$scope.Qobj.Queryfield.push(arr[i][j])
					}
				}
				else if(i == 'sortBy')
				{
					for(var j in arr[i])
					{
						$scope.Qobj.QueryOrder.push(arr[i][j])
					}
				}
			}

			//console.log("out",$scope.Qobj)
			$scope.Qobj = constructQuery($scope.Qobj);
			return $scope.Qobj
	}



	$scope.initCall = function(_query)
	{
		$http.post(BASEURL+RESTCALL.PaymentOutputData,_query).success(function(data){
				$scope.datas = data;
				$scope.loadedData = data;

				$('.alert-danger').hide()
			}).error(function(data){
				$scope.datas = [];
				$scope.loadedData = [];

				if(data.error.code == 401)
				{
					LogoutService.Logout();
				}
				else{
					$scope.alerts = [{
							type : 'danger',
							msg : data.error.message
						}
					];
				}
			})

	}
	
	$scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

	$scope.refresh = function()
	{
			console.log($scope.fieldArr)

		$(".listView").scrollTop(0);
		len = 20;
		$scope.fieldArr.start = 0;
		$scope.fieldArr.count = len;
		$scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
	}	

	



	$scope.FilterByDate = function(params,eve)
	{
		//customDateRangePicker('CstartDate','CendDate')

		$('.menuClass').removeClass('listSelected')
		if(params != 'custom')
		{
			$(eve.currentTarget).addClass('listSelected')
		}
		else{
			$('.menuClass:nth-child(5)').addClass('listSelected')
		}

		$('#dropTxt').html($filter('ucwords')(params))

		for(var i in $scope.dateFilter)
		{
			$scope.dateFilter[i] = false;
		}
		$scope.dateFilter[params] = true;

		

		if($scope.dateFilter.custom)
		{	

				$('#customDate').modal('hide')
				

				CommonService.distInstruction.customDate.startDate = $scope.customDate.startDate;
				CommonService.distInstruction.customDate.endDate = $scope.customDate.endDate;
				
				//console.log("customDate",CommonService.customDate)

		}

		
		$scope.dateArr = $scope.retExpResult()

		//console.log($scope.dateArr )

		$scope.backupArr = [];
		//$scope.fieldArr.params = [];


		if($scope.uorVal)
		{
			for(k in $scope.fieldArr.params)
			{
				if($scope.fieldArr.params[k].ColumnName == 'UniqueOutputReference')
				{
					$scope.backupArr = [
						{
							"ColumnName":"UniqueOutputReference",
							"ColumnOperation":"like",	
							"ColumnValue":$scope.uorVal
						}
					]

					
				}
			}

		}
		
		$scope.fieldArr.params = [];
		$scope.fieldArr.params = $scope.backupArr;
		for(var i in $scope.dateArr)
		{
			$scope.fieldArr.params.push({"ColumnName":$scope.dateArr[i].ColumnName,"ColumnOperation":$scope.dateArr[i].ColumnOperation,"ColumnValue":$scope.dateArr[i].ColumnValue});
			
		}
		

		

		console.log("out",$scope.fieldArr)

		$scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
		

	}

	
	$scope.$watch('fieldArr.params',function(nArr,oArr){
		//console.log(nArr,oArr)
		if(nArr.length)
		{CommonService.distInstruction.searchFound = true;
		}else
		{CommonService.distInstruction.searchFound = false;
		}

		$scope.searchFound = CommonService.distInstruction.searchFound;
	})
	
	$scope.uorSearch = function()
	{
		console.log("uor",$scope.uorVal)
		if($scope.uorVal)
		{
			console.log("entered")
			$scope.uorFound = $scope.uorVal;

			CommonService.distInstruction.uorVal = $scope.uorVal;
			len = 20;	
			//$scope.fieldArr.params=[];
			
				$scope.uorSearchFound = false;
				for(var i in $scope.fieldArr.params)
				{
					if($scope.fieldArr.params[i].ColumnName == 'UniqueOutputReference')
					{
						$scope.uorSearchFound = true;
						$scope.fieldArr.params[i].ColumnName = 'UniqueOutputReference';
						$scope.fieldArr.params[i].ColumnOperation = 'like';
						$scope.fieldArr.params[i].ColumnValue = $scope.uorVal;
						
					}
				}

				if(!$scope.uorSearchFound)
				{
					$scope.fieldArr.params.push({"ColumnName":"UniqueOutputReference","ColumnOperation":"like",	"ColumnValue":$scope.uorVal})
				}

				$scope.searchFound = true;
			$scope.fieldArr.start = 0;
			$scope.fieldArr.count = len;

			//$scope.searchFound = true;
			//CommonService.distInstruction.searchFound = true;
			$scope.query = $scope.uorQueryConstruct($scope.fieldArr)
			$scope.initCall($scope.query)
			
		}				

	}


	$scope.CustomDatesReset = function()
	{
		$scope.customDate = 
						{
						startDate:'',
						endDate:''
						}
	}

	$scope.getExistVal = function(eve)
	{
		if($scope.uorVal)
		{
			if (eve.keyCode == 13)
			{$scope.uorSearch()
			}

		}
		else{

		//	console.log($scope.dateFilter)
				if($scope.dateFilter.all)
				{
				$scope.uorFound = '';
				CommonService.distInstruction.uorVal = '';
				
						for(var j in $scope.fieldArr.params)
						{
							if($scope.fieldArr.params[j].ColumnName == "UniqueOutputReference")
							{
								$scope.fieldArr.params.splice(j,1)

								//console.log("len",$scope.fieldArr.params.length)

								if($scope.fieldArr.params.length)
								{
									$scope.searchFound = true;
									
								}
								else{
									$scope.searchFound = false;
								}
							}
						}



			$scope.fieldArr.start = 0;
			$scope.fieldArr.count = 20;
			$scope.initCall($scope.uorQueryConstruct($scope.fieldArr))

			}
		}
	}

	/* Clear Search Results */
	$scope.clearSearch = function()
	{
		$scope.searchFound = false;
		$scope.loadedData='';	

		$scope.fieldArr = {"sortBy":[],"params":[],"start":0,"count":20};
		len = 20;
		$scope.uorVal = '';
		CommonService.distInstruction.uorVal = '';
		$scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
	}
	
	/* Load more */
	$scope.loadMore = function(query)
	{
		$scope.fieldArr.start = len;
		$scope.fieldArr.count = 20;

			$http.post(BASEURL+RESTCALL.PaymentOutputData,$scope.uorQueryConstruct($scope.fieldArr)).success(function(data){
				$scope.datas =$scope.datas.concat(data);
				$scope.loadedData = data;
				len = len+20;
			}).error(function(data){
				
			})
	}

	$scope.bankData = {};
	/* Sorting */
	$scope.gotoSorting = function(dat){
			$scope.fieldArr.start = 0;
            $scope.fieldArr.count = len;

			var orderFlag = true;
			if($scope.fieldArr.sortBy.length)
			{
				for(var i in $scope.fieldArr.sortBy)
				{
					if($scope.fieldArr.sortBy[i].ColumnName == dat.FieldName)
					{	
						if($scope.fieldArr.sortBy[i].ColumnOrder =='Asc')
						{
							$('#'+dat.FieldName+'_icon').attr('class','fa fa-long-arrow-down')
							$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-down')
							$scope.fieldArr.sortBy[i].ColumnOrder = 'Desc';
							orderFlag = false;
                        	break;
						}
						else{
							$scope.fieldArr.sortBy.splice(i,1);
							orderFlag = false;
							$('#'+dat.FieldName+'_icon').attr('class','fa fa-minus fa-sm')
							$('#'+dat.FieldName+'_Icon').removeAttr('class')
							break;
						}

					}
				}

				if(orderFlag){
				$('#'+dat.FieldName+'_icon').attr('class','fa fa-long-arrow-up')
				$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
					$scope.fieldArr.sortBy.push({
								"ColumnName": dat.FieldName,
								"ColumnOrder": 'Asc'
							})

				}
		}
		else{
			
			$('#'+dat.FieldName+'_icon').attr('class','fa fa-long-arrow-up')
			$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')

				$scope.fieldArr.sortBy.push({
								"ColumnName": dat.FieldName,
								"ColumnOrder": 'Asc'
							})
			
		} 

		//$scope.uorQueryConstruct($scope.fieldArr)
		$scope.initCall($scope.uorQueryConstruct($scope.fieldArr))
	}

	/* Go To Payment Summary */
	$scope.detail = function(val,eve)
	{
		if((!$(eve.target).hasClass('fa-download')) || !$scope.changeViewFlag)
		{
		$state.go('app.outputpaymentsummary',{input:{'uor':val.UniqueOutputReference,'nav':{},'from':'output'}})
		}
			
		
	}

	/* Export the data to CSV*/
	$scope.exportToExcel = function()
	{
		$scope.dat = angular.copy($scope.datas)
			for(var i in $scope.dat)
			{
				$scope.dat[i].OutputMessage = $filter('hex2a')($scope.dat[i].OutputMessage)
				
			}
		 JSONToCSVConvertor(bankData,$scope.dat, 'DistributedInstructions', true);
	}

	/* Export Output Message */
	$scope.textDocDownload = function(val)
	{
		bankData.textDownload($filter('hex2a')(val.OutputMessage), val.UniqueOutputReference);
	}

	/* Print*/
	$scope.printFLpage = function()
	{
		window.print()
	}


	var debounceHandler = _.debounce($scope.loadMore, 700, true);

	jQuery(
    		function($)
    			{
    				$('.listView').bind('scroll', function()
    				{
    					if(Math.round($(this).scrollTop() + $(this).innerHeight())>=$(this)[0].scrollHeight)
    					{
    						if($scope.loadedData.length >= 20){
    								debounceHandler()
    						}
    					}
    				})
    				setTimeout(function(){},1000)
    			}
    	);

		
	$scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
				GlobalService.viewFlag = newValue;
				$(".listView").scrollTop(0);
				/*var checkFlagVal = newValue;	
				if(checkFlagVal){
					$("thead").hide();
					autoScrollDiv();
				}
				else{
					$("thead").show();
					if($(".dataGroupsScroll").scrollTop() == 0){
						$table = $("table.stickyheader")
						$table.floatThead('destroy');
						
					}
					autoScrollDiv();
				}*/
				
			})

	 

});