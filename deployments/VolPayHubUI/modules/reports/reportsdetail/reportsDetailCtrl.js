VolpayApp.controller('reportsDetailCtrl', function ($scope, $http, $location, $filter, $stateParams, GlobalService) {


        if($stateParams.input)
        {
            $scope.permission = {
           		'C' : $stateParams.input["C"],
           		'D'	: $stateParams.input["D"],
           		'R'	: $stateParams.input["R"],
           		'W'	: $stateParams.input["W"]
           	}
        }


       $scope.strData = [];
       $scope.FXRate = GlobalService.specificData;
	 

       $scope.fromAddNew = GlobalService.fromAddNew;



       $scope.ViewClicked = GlobalService.ViewClicked;


    $.each($scope.FXRate, function(k, v) {
        //display the key and value pair
        $scope.strData.push({'label':k,'value':v})

    });

   // console.log("from",$scope.fromAddNew)
     $scope.FXRateCreate= {};

    /*if($scope.fromAddNew)
    {

    }*/



    $scope.gotoEdit = function()
    {
     $scope.ViewClicked = false;
    }
    $scope.gotoParent = function()
    {
    $location.path('app/reports')
    }

    $scope.createData = function(newData)
    {
       // console.log(newData)
       newData = removeEmptyValueKeys(newData)

        $http.post(BASEURL+RESTCALL.AllReports,newData).success(function(data){
             GlobalService.Fxupdated = data.responseMessage;
              $location.path('app/reports')
        }).error(function(err)
        {
            $scope.alerts = [{
                        type : 'danger',
                        msg : err.data.error.message		//Set the message to the popup window
                    }];
        })

    }

    $scope.updateData = function(editedData)
    {
        editedData = removeEmptyValueKeys(editedData)
        restServer = RESTCALL.AllReports;

        //console.log(editedData)

           $http.put(BASEURL+RESTCALL.AllReports,editedData).success(function(data){

               GlobalService.Fxupdated = data.responseMessage;
               $location.path('app/reports')

           }).error(function(err)
           {
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.data.error.message		//Set the message to the popup window
                            }];
           })
        //bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
    }
	
	function removeBreaks(noBreaksText){
		//console.log(noBreaksText)
		//var noBreaksText = document.getElementById("xml").value;
		//var noBreaksText = $('#xml').val();
		noBreaksText = noBreaksText.replace(/(\r\n|\n|\r)/gm,"<1br />");
		re1 = /<1br \/><1br \/>/gi;
		re1a = /<1br \/><1br \/><1br \/>/gi;
		re2 = /\<1br \/>/gi;
		noBreaksText = noBreaksText.replace(re2, " ");
		re3 = /\s+/g;
		noBreaksText = noBreaksText.replace(re3," ");
		re4 = /<2br \/>/gi;
		noBreaksText = noBreaksText.replace(re4,"\n\n");
		//noBreaksText = noBreaksText.replace(/(> <)/gm,"><");
		//console.log(noBreaksText);
		return noBreaksText;
	}
	function formatXml(xml) {
		xml = xml.replace(/(> )/gm,">\n");	
//		console.log(xml)
		return xml;
	};
	$scope.updateTemplateData = function(dat){
		//console.log(dat)
		//removeBreaks(dat.TEMPLATE)
		dat.TEMPLATE = a2hex(removeBreaks(dat.TEMPLATE)).toUpperCase();
		$http.put(BASEURL+RESTCALL.ReportsTemplate,dat).success(function(data){
               //GlobalService.Fxupdated = data.responseMessage;
               $location.path('app/reports')

           }).error(function(err)
           {
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.data.error.message		//Set the message to the popup window
                            }];
           })
		
	}


    $scope.deleteData = function()
    {
            $scope.delObj = {};
            $scope.delObj.OfficeID = $scope.FXRate['REPORTID'];
            $scope.delObj.ApplicableDate = $scope.FXRate['OFFICEID'];
            $scope.delObj.SourceCurrency = $scope.FXRate['BRANCHID'];


        $http.post(BASEURL+RESTCALL.AllReports+'delete',$scope.delObj).success(function(data){

               GlobalService.Fxupdated = "Deleted Successfully";
               $location.path('app/reports')

           }).error(function(err)
           {
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.data.error.message		//Set the message to the popup window
                            }];
           })

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
			
	$scope.reportEdit = false;
	$scope.templateEdit = true;
	$scope.gotoEdit = function(){
		$scope.reportEdit = !$scope.reportEdit;
	}
	$scope.gotoEdit1 = function(){		
		$scope.templateEdit = !$scope.templateEdit;		
	}
	
	function hex2a(hexx) {
		var hex = hexx.toString();//force conversion
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}
	//hex2a('32343630');
	
	function a2hex(str) {
	  var arr = [];
	  for (var i = 0, l = str.length; i < l; i ++) {
		var hex = Number(str.charCodeAt(i)).toString(16);
		arr.push(hex);
	  }
	  return arr.join('');
	}
	//a2hex('2460');

	$scope.collapsefn = function(eve){
		var ids = $(eve.currentTarget).attr('id');
		$('#'+ids+'Module').collapse("toggle")
		$(eve.currentTarget).find('span i').each(function(){
			if($(this).hasClass('fa')){
				$(this).toggleClass('fa-chevron-circle-right fa-chevron-circle-down');
				if($(this).hasClass('fa-chevron-circle-right')){
					$(eve.currentTarget).css({'border-bottom': ''})
				}
				else{
					$(eve.currentTarget).css({'border-bottom': '1px solid #cccccc'})					
				}
			}
		})
	}
	/* $scope.templateData = {}
	$scope.reportAction = function(eve,id){		
		$http.post(BASEURL+RESTCALL.ReportParams+'readall',{}).success(function(data){
			$scope.params = []
			for(k in data){
				if(data[k].REPORTID == $scope.FXRate["REPORTID"]){
					$scope.params.push(data[k])
					if(data[k].PARAM_KEY == "TEMPLATEID"){
					var queryOrder = 	{
										  "Queryfield": [
											{
											  "ColumnName": "TEMPLATETID",
											  "ColumnOperation": "=",
											  "ColumnValue": hex2a(data[k].PARAM_VALUE)
											}
										  ]
										}
					if(id == 'templateHeader'){
						$http.post(BASEURL+RESTCALL.ReportsTemplate+'readall',queryOrder).success(function(data){
							$scope.templatetData = [];
							for(k in data){
								for(j in data[k]){
									if(j == 'TEMPLATE'){										
										$scope.templatetData.push({
											'Label' : j,
											'Value'	: formatXml($filter('hex2a')(data[k][j]))
										})
									}
									else{
										$scope.templatetData.push({
											'Label' : j,
											'Value'	: data[k][j]
										})
									}
								}
								$scope.templateData = data[k]
								$scope.templateData.TEMPLATE = $filter('hex2a')($scope.templateData.TEMPLATE)
								$scope.templateData.TEMPLATE = formatXml($scope.templateData.TEMPLATE)
							}
						}).error(function(err){
							$scope.alerts = [{
								type : 'danger',
								msg : err.ErrorMessage		//Set the message to the popup window
							}];
						})
					}
					}
				}			
			}
		}).error(function(err){
			$scope.alerts = [{
				type : 'danger',
				msg : err.ErrorMessage		//Set the message to the popup window
			}];
		})
	} */
	
	$scope.restResponse= {}
	function crudRequest(_method, _url, _data){
		return $http({
			method: _method,
			url: BASEURL + "/rest/v2/" + _url+'/readall',
			data: _data
		}).then(function(response){
			$scope.restResponse = {
				'Status' : 'Success',
				'data'	: response 
			}
			return $scope.restResponse
		},function(error){
			$scope.restResponse = {
				'Status' : 'Error',
				'data'	: error.data.error.message 
			}
			return $scope.restResponse
		})
	}
	$scope.queryOrder = ''
	$scope.paremsCallFlag = true;
	$scope.templateCallFlag = true;
	$scope.paramsCall = function(callback){			
		$scope.paremsCallFlag = false;
		crudRequest("POST", 'reports/params', {}).then(function(response){
			$scope.params = []
				if(response.Status === "Success"){
					for(k in response.data.data){
						if(response.data.data[k].REPORTID == $scope.FXRate["REPORTID"]){
							$scope.params.push(response.data.data[k]);	
							if(response.data.data[k].PARAM_KEY == "TEMPLATEID"){
								$scope.queryOrder = 	{
									  "Queryfield": [
										{
										  "ColumnName": "TEMPLATETID",
										  "ColumnOperation": "=",
										  "ColumnValue": hex2a(response.data.data[k].PARAM_VALUE)
										}
									  ]
									}
								
								if(callback){
									callback();						
								}
							}
						}
					}
										
				}
			return response.Status
		})
	}
	
	$scope.templateCall = function(){
		$scope.templateCallFlag = false;
		console.log($.isEmptyObject($scope.queryOrder))
		if(!$scope.queryOrder){
			$scope.paramsCall(function(){				
				$scope.templateCall()
			})
		}
		else{
			crudRequest("POST", 'reports/templates', $scope.queryOrder).then(function(response){
				console.log(response)
				$scope.templatetData = []
				if(response.Status === "Success"){
					for(k in response.data.data){
						$scope.templatetData = response.data.data[k];
					}
					console.log($scope.templatetData)
					$scope.templatetData.TEMPLATE = $filter('hex2a')($scope.templatetData.TEMPLATE)
					$scope.templatetData.TEMPLATE = formatXml($scope.templatetData.TEMPLATE)
				}
			})			
		}
	}
	
	$scope.setFixedHeight = function(k){
		setTimeout(function(){
			$('#paramsModule_0').parent().css({'max-height':$('#paramsModule_0').outerHeight()+10+'px','overflow-y':'auto'})
		},1000)
	}
	
})

