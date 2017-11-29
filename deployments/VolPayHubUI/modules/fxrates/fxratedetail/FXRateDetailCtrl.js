VolpayApp.controller('FXRateDetailCtrl', function ($scope, $http, $location, $stateParams, GlobalService) {


        if($stateParams.input)
        {
            $scope.permission = {
           		'C' : $stateParams.input["C"],
           		'D'	: $stateParams.input["D"],
           		'R'	: $stateParams.input["R"],
           		'U'	: $stateParams.input["U"]
           	}

        }

       // console.log($scope.permission)

       $scope.strData = [];
       $scope.FXRate = GlobalService.specificData;

       $scope.fromAddNew = GlobalService.fromAddNew;
	   $scope.ViewClicked = GlobalService.ViewClicked;
	   

	   console.log("flag",$scope.fromAddNew)

	   


    $.each($scope.FXRate, function(k, v) {
        //display the key and value pair
        $scope.strData.push({'label':k,'value':v})

    });


     $scope.FXRateCreate= {};

	function crudRequest(_method, _url, _data,_query){
		return $http({
			method: _method,
			url: _url,
			data: _data,
			params:_query
		}).then(function(response){
			$scope.restResponse = {
				'Status' : 'Success',
				'data'	: response 
			}
			return $scope.restResponse
		},function(error){
				//console.log(error.data.error.message)
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
				'data'	: error.data  
			}
			$scope.alerts = [{
				type : 'danger',
				msg : error.data.error.message		//Set the message to the popup window
			}];
			/* $timeout(function(){
				$('#statusBox').hide();
			}, 4000); */
			return $scope.restResponse
		})
	}


			/*if($scope.fromAddNew)
			{
				//$scope.FXRateCreate.OfficeCode = ''	

				$('select[name=OfficeCode]').val('')
			}*/

	$scope.setIntiVal = function()
	{
		
			console.log($scope.FXRate)
		var _query = {
						search : $scope.FXRate.OfficeCode,
						start : 0,
						count : 500
					}

			crudRequest('GET', BASEURL + RESTCALL.OfficeCode,'',_query).then(function(response){
					console.log(response)
						$scope.officeCodeVal = response.data.data;
					
												
					});	


		
	}


	 $(document).ready(function(){
	
	$scope.limit = 500;	
	$scope.remoteDataConfig = function()
		{
			
			$("select[name='OfficeCode']").select2({
				ajax:{
					url:BASEURL + RESTCALL.OfficeCode,
					headers: {"Authorization" : "SessionToken:"+sessionStorage.SessionToken,"Content-Type" : "application/json"},
					dataType: 'json',
					delay: 250,
					data:function(params)
						{
							
							console.log("1",params)
							var query = {
								start : params.page * $scope.limit ? params.page * $scope.limit : 0,
								count : $scope.limit
							}

							if(params.term){
							query = {
								search : params.term,
								start : params.page * $scope.limit ? params.page * $scope.limit : 0,
								count : $scope.limit
							};
						 }
							return query;
						},
					processResults:function(data,params)	
						{
							params.page = params.page ? params.page : 0;
							var myarr = []
							
							for(j in data){
								myarr.push({
									'id' : data[j].actualvalue,
									'text':data[j].displayvalue
								})
							}
							return {
								results: myarr,
								pagination: {
									more: data.length >= $scope.limit   
								}
							};
							
						},
					cache: true
				},
				placeholder : 'Select an option',
				minimumInputLength: 0,
				allowClear : true

			})
		}

		$scope.remoteDataConfig()
})

    /*if($scope.fromAddNew)
    {

    }*/

   /* $http.get(BASEURL+RESTCALL.OfficeCode).success(function(data){

        	        $scope.officeCodeVal = data;
        	        console.log(data)

        	    })*/


    $scope.gotoEdit = function()
    {
		$scope.ViewClicked = false;
		
     
        setTimeout(function(){
			$scope.remoteDataConfig()
             $('.DatePicker').datepicker({
                 format: 'yyyy-mm-dd',
                 autoclose: true
             });

             $('.input-group-addon').on('click focus', function(e){
             			        $(this).prev().focus().click()
                              });
        },200)

    }
    $scope.gotoParent = function()
    {$location.path('app/fxrate')
    }

    $scope.createData = function(newData)
    {
		/*$scope.dateArr = ["ApplicableDate","EffectiveFromDate","EffectiveTillDate"];

		for(var i in $scope.dateArr)
		{
			newData[$scope.dateArr[i]] = $('[name='+$scope.dateArr[i]+']').val()
		}
        console.log(newData)*/

       newData = removeEmptyValueKeys(newData)
	   $http.post(BASEURL+RESTCALL.BankFXRateChartREST,newData).success(function(data){
             GlobalService.Fxupdated = data.responseMessage;
              $location.path('app/fxrate')
        }).error(function(err)
        {
            $scope.alerts = [{
                        type : 'danger',
                        msg : err.error.message		//Set the message to the popup window
                    }];
        })

    }

    $scope.updateData = function(editedData)
    {
        editedData = removeEmptyValueKeys(editedData)
        restServer = RESTCALL.BankFXRateChartREST;

           $http.put(BASEURL+RESTCALL.BankFXRateChartREST,editedData).success(function(data){

               GlobalService.Fxupdated = data.responseMessage;
               $location.path('app/fxrate')

           }).error(function(err)
           {
            console.log(err)
            console.log(err.error.message)
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.error.message		//Set the message to the popup window
                            }];
           })
        //bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
    }


    $scope.deleteData = function()
    {
            $scope.delObj = {};
            $scope.delObj.OfficeCode = $scope.FXRate['OfficeCode'];
            $scope.delObj.ApplicableDate = $scope.FXRate['ApplicableDate'];
            $scope.delObj.SourceCurrency = $scope.FXRate['SourceCurrency'];
            $scope.delObj.TargetCurrency = $scope.FXRate['TargetCurrency'];

        $http.post(BASEURL+RESTCALL.BankFXRateChartREST+'delete',$scope.delObj).success(function(data){
               GlobalService.Fxupdated = data.responseMessage;
               $('body').removeClass('modal-open')
               $location.path('app/fxrate')

           }).error(function(err)
           {
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.error.message		//Set the message to the popup window
                            }];
           })

    }
    $scope.deleteData = function()
    {
            $scope.delObj = {};
            $scope.delObj.OfficeCode = $scope.FXRate['OfficeCode'];
            $scope.delObj.ApplicableDate = $scope.FXRate['ApplicableDate'];
            $scope.delObj.SourceCurrency = $scope.FXRate['SourceCurrency'];
            $scope.delObj.TargetCurrency = $scope.FXRate['TargetCurrency'];

        $http.post(BASEURL+RESTCALL.BankFXRateChartREST+'delete',$scope.delObj).success(function(data){
               GlobalService.Fxupdated = data.responseMessage;
               $('body').removeClass('modal-open')
               $location.path('app/fxrate')

           }).error(function(err)
           {
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.error.message		//Set the message to the popup window
                            }];
           })

    }

     $scope.multipleEmptySpace = function (e) {
        		if($.trim($(e.currentTarget).val()).length == 0)
        		{
        		$(e.currentTarget).val('');
        		}
        		/*if($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')){
        			$(e.currentTarget).data("DateTimePicker").hide();
        		}*/
        	}
	$scope.activatePicker = function(e){

		var prev = null;
		$('.DatePicker').datetimepicker({
			format:"YYYY-MM-DD",
			useCurrent: true,
			showClear: true
		}).on('dp.change', function(ev){
				

			if($(ev.currentTarget).attr('ng-model').split('.')[0] != 'subData'){

				$scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()

			}
			else{
				var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
				
				$scope.subSectionfieldData[pId][$('#'+pId).children().length - 2][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}

			
		}).on('dp.show', function(ev){
			
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": ""});
			if($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2){	
				$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
					if($(this).is("#"+$(ev.currentTarget).parent().parent().parent().parent().attr('id'))){					
					}
					else{
						$(this).css({"display": "none"});
					}
				})
			}		
		}).on('dp.hide', function(ev){
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": "auto"});
			$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
				$(this).css({"display": ""});				
			})	
		});



		$('.TimePicker').datetimepicker({
			format: 'HH:mm:ss',
			useCurrent: true
		}).on('dp.change', function(ev){


			if($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData'){
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}
			else{
				var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
				console.log($(ev.currentTarget).attr('ng-model').split('[')[0],pId,$('#'+pId).children().length)
				$scope.subSectionfieldData[pId][$('#'+pId).children().length - 2][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}

			//console.log($scope.subSectionfieldData,$scope.subSectionfieldData.length,$(ev.currentTarget).attr('name'),$(ev.currentTarget).val())
		}).on('dp.show', function(ev){
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": ""});
		if($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2){	
			$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
				if($(this).is("#"+$(ev.currentTarget).parent().parent().parent().parent().attr('id'))){					
				}
				else{
					$(this).css({"display": "none"});
				}
			})
		}		
		}).on('dp.hide', function(ev){
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": "auto"});
			$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
				$(this).css({"display": ""});				
			})	
		});

		$('.input-group-addon').on('click focus', function(e){
			$(this).prev().focus().click()
		});
	 }
    /*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

    	$scope.widthOnScroll = function()
    	{
    		var mq = window.matchMedia( "(max-width: 991px)" );
    		var headHeight
    		if (mq.matches) {
    		 headHeight =0;
    		 $scope.alertWidth = $('.pageTitle').width();
    		} else {
    		   $scope.alertWidth = $('.pageTitle').width();
    			headHeight = $('.main-header').outerHeight(true)+10;
    		}
    		$scope.alertStyle=headHeight;
    	}

    		$scope.widthOnScroll();

    		$(window).scroll(function() {
    		$scope.widthOnScroll();
        })
	if(!GlobalService.fromAddNew){

			$scope.editedLog = [];
			$scope.auditLogObj = {
				"OfficeCode"     : $scope.FXRate["OfficeCode"],
				"ApplicableDate" : $scope.FXRate["ApplicableDate"],
				"SourceCurrency" : $scope.FXRate["SourceCurrency"],
				"TargetCurrency" : $scope.FXRate["TargetCurrency"]
			}
			$http.post(BASEURL + RESTCALL.BankFXRateChartREST+'audit/readall',$scope.auditLogObj).success(function(response){
				for(i in response){
					console.log(response[i])
					if(response[i].tableName == 'FXRateChart'){
						$scope.editedLog.push(response[i])
					}
				}
			}).error(function(err)
        {
			//console.log(err,err.error.code)

			if(err.error.code != "404")
			{
  					$scope.alerts = [{
                        type : 'danger',
                        msg : err.error.message		//Set the message to the popup window
                    }];
			}
          
        })
   
		
	}
//console.log($scope.editedLog)




})

