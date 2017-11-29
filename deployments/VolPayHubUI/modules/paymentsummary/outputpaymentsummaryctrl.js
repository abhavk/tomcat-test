VolpayApp.controller('outputpaymentsummaryctrl', function ($scope, $timeout, PersonService, $location, $state, $http, $translate, GlobalService, bankData, $filter, LogoutService) {

	var len = 20;

	//console.log($state.params)
	$scope.incomeObj = $state.params.input;


	//console.log($scope.incomeObj)

	


	$scope.initCall = function(){
		
		//$scope.uor = $state.params.input.uor;

		
		

		len = 20;
		$scope.query = {
							"Queryfield": [
								{
									'ColumnName':'UniqueOutputReference',
									'ColumnOperation':'=',
									'ColumnValue':$state.params.input.uor
								}
							],
							'start':0,
							'count':len
						}
		//$scope.query.Queryfield.push({'ColumnName':'UniqueOutputReference','ColumnOperation':'=','ColumnValue':$state.params.input.uor})
		$scope.query = constructQuery($scope.query);
		
		$http.post(BASEURL+RESTCALL.InputOutputCorrelation,$scope.query).success(function(data){
				$scope.datas = data;
				$scope.loadedContent = data;
				
		}).error(function(data)
		{
			$scope.datas = [];
			$scope.loadedContent = [];
			 $scope.alerts = [{
                            type : 'danger',
                            msg : data.error.message
                  }];

		})

	}

	$scope.initCall()


	$scope.gotoFiledetail = function (id) {
        GlobalService.fileListId = id;
		$location.path('app/filedetail')
	}

	$scope.clickReferenceID = function (UIR,PID) {

		 $scope.Obj = {
		'uor':$scope.incomeObj.uor,
		'nav':{
			  'UIR':UIR,
			  'PID':PID
				},
		'from': 'distributedinstructions'
	    }

		$state.go('app.paymentdetail', {
			input: $scope.Obj
		})

		
        /*GlobalService.fileListId = val.InstructionID;
		GlobalService.UniqueRefID = val.PaymentID;
		GlobalService.fromPage = "output";
        console.log("frm",val.fromPage)*/

		//$state.go('app.paymentdetail',{input:val})
	}



		$scope.details = function(val){

			console.log("val",val)
			$scope.paymentQuery = {
							"Queryfield": [
									{"ColumnName":"PaymentID",
									'ColumnOperation':'=',
									'ColumnValue':val.PaymentID
									}]
								}


			$scope.paymentQuery = constructQuery($scope.paymentQuery);

			$http.post(BASEURL+RESTCALL.AllPaymentsREST,$scope.paymentQuery).success(function(val){

					

				GlobalService.fileListId = val[0].InstructionID;
				GlobalService.UniqueRefID = val[0].PaymentID;
				GlobalService.fromPage = "distributedinstructions";

				 $scope.Obj = {
						'uor':val[0].OutputInstructionID,
						'nav':{
							'UIR':val[0].InstructionID,
							'PID':val[0].PaymentID
								},
						'from': 'distributedinstructions'
						}

						console.log( $scope.Obj)
						$state.go('app.paymentdetail', {
							input: $scope.Obj
						})

			$state.go('app.paymentdetail', {
				input : $scope.Obj
				})	

			}).error(function(data){
				 $scope.alerts = [{
                            type : 'danger',
                            msg : data.error.message
                  }];

				  $timeout(function(){
						$('.alert-danger').hide()
				  },4000)
						
					
			})
		}


	$scope.loadMore = function()
	{
		$scope.query = {
							"Queryfield": [
								{
									'ColumnName':'UniqueOutputReference',
									'ColumnOperation':'=',
									'ColumnValue':$state.params.input.uor
								}
							],
							'start':len,
							'count':20
						}
		$scope.query = constructQuery($scope.query);
		
		$http.post(BASEURL+RESTCALL.InputOutputCorrelation,$scope.query).success(function(data){
				$scope.loadedContent = data;
				$scope.datas = $scope.datas.concat(data);
				len = len+20;
		})

	}

	$scope.exportToExcel = function()
	{
		$scope.dat = angular.copy($scope.datas)
		JSONToCSVConvertor(bankData,$scope.dat, $state.params.input.uor, true);
	}


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
    			})

	 

	});
