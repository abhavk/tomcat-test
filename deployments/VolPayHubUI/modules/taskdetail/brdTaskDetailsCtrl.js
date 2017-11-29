VolpayApp.controller('brdTaskDetailsCtrl', function ($scope, $state, $http, bankData, GlobalService, $timeout, $location,LogoutService) {

    $scope.sortMenu = [
                     {
                         "label":"Office Code",
                         "FieldName":"OfficeCode",
                         "visible":true,
                     },{
                         "label":"Process Name",
                         "FieldName":"ProcessName",
                         "visible":true,
                     },{
                         "label":"Task Type",
                         "FieldName":"TaskType",
                         "visible":true,
                     },{
                         "label":"Task Code",
                         "FieldName":"TaskCode",
                         "visible":true,
                     },{
                         "label":"Task Name",
                         "FieldName":"TaskName",
                         "visible":true,
                     },{
                         "label":"Flow Name",
                         "FieldName":"FlowName",
                         "visible":true,
                     },{
                         "label":"Task Index",
                         "FieldName":"TaskIndex",
                         "visible":true,
                     },{
                         "label":"Task Config",
                         "FieldName":"TaskConfig",
                         "visible":false,
                     },{
                         "label":"Status",
                         "FieldName":"Status",
                         "visible":true
                     },{
                         "label":"Effective From Date",
                         "FieldName":"EffectiveFromDate",
                         "visible":true
                     },{
                         "label":"Effective Till Date",
                         "FieldName":"EffectiveTillDate",
                         "visible":false
                     }]



	$scope.permission = {
        		'C' : false,
        		'D'	: false,
        		'R'	: false,
        		'U'	: false
        	}

        	$http.post(BASEURL+RESTCALL.ResourcePermission,{
        		"RoleId": sessionStorage.ROLE_ID,
        		"ResourceName": "Task Details"
        	}).success(function(response){
        	    for(k in response){
                        for(j in Object.keys($scope.permission)){
        					if(Object.keys($scope.permission)[j] == response[k].ResourcePermission){
        						$scope.permission[Object.keys($scope.permission)[j]] = true;
        					}
        				}
        		}
        })


    $scope.restResponse = {};
        	function crudRequest(_method, _url, _data){
        		return $http({
        			method: _method,
        			url: BASEURL + _url,
        			data: _data
        		}).then(function(response){
        			$scope.restResponse = {
        				'Status' : 'Success',
        				'data'	: response
        			}
        			//console.log('came')
        			return $scope.restResponse
        		},function(error){
        			console.log(error.data.error.code)
        			if(error.data.error.code == 401){
        				console.log(error)
        				LogoutService.Logout();
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
        			//$timeout(callAtTimeout, 4000);
        			return $scope.restResponse
        		})
        	}

	var restServer = RESTCALL.BankTaskDetailREST + 'readall';
            	var delData = {};
            	$scope.backUp = {};
            	$scope.indexx = "";
            	$scope.dataFound = false;
            	$scope.loadMorecalled = false;
            	$scope.CRUD = "";
            	$scope.restVal = []

              /*** Sorting ***/
                $scope.orderByField = 'OfficeCode';
                $scope.SortReverse  = false;
                $scope.SortType = 'Asc';


            	$scope.takeBackup = function(val,Id){
            		$scope.backUp = angular.copy(val);
            		$scope.indexx = angular.copy(Id);
            	}

            	$scope.cancelpressed = function(Id){
            		$scope.restVal[$scope.indexx] = $scope.backUp;
            		$('#editingWindow_'+Id).collapse('hide');
            		$('#displayingWindow_'+Id).collapse('show');
            	}

            	$scope.prev = null;

            	 if(GlobalService.Fxupdated != '')
                    {
                        $scope.alerts = [{
                            type : 'success',
                            msg : GlobalService.Fxupdated		//Set the message to the popup window
                        }];

                        GlobalService.Fxupdated= '';
                        $timeout(callAtTimeout, 4000);

                    }

            $scope.toggleWindow = function(val,Id,viewMe){

                $scope.viewMe = viewMe;
            	if($scope.prev != null)
            	{
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

            	}

            $scope.setViewMe = function(viewMe)
            {
                $scope.viewMe = viewMe;
            }

            	$scope.takeDeldata = function(val,Id){
            		delData = val;
            		$scope.delIndex = Id;
            	}

            	//I Load the initial set of datas onload
				
				$scope.initData = function()
				{
				$scope.bankData ={};
            	$scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                $scope.bankData.start=0;
                $scope.bankData.count=20;
				
				bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);

				}
				
				$scope.initData();
            	//I Load More datas on scroll
            	var len = 20;
            	$scope.loadMore = function(){
            		$scope.loadMorecalled = true;

            		//$scope.bankData.IsReadAllRecord = true;
                    $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                    $scope.bankData.start=len;
                    $scope.bankData.count=20;

                     crudRequest("POST",restServer,$scope.bankData).then(function(response){

                            $scope.lenthofData = response.data.data;
                                console.log(response)
                                if(response.data.data.length != 0 )
                                {
                                    $scope.restVal = $scope.restVal.concat(response.data.data)
                                    len = len + 20;
                                }
                            })

            		//bankData.crudRequest("POST", restServer,$scope.bankData).then(applyRestData,errorFunc);
            		//len = len + 20;
            	}

            	// I process the Create Data Request.
            	$scope.createData = function(newData) {
            		//$scope.bankData.Data = btoa(JSON.stringify(newData))
            		restServer = RESTCALL.BankTaskDetailREST;
            		newData = removeEmptyValueKeys(newData)

            		bankData.crudRequest("POST", restServer,newData).then(getData,errorFunc);
            		$scope.CRUD = "Created Successfully";
            		$scope.newData = "";		// Reset the form once values have been consumed.
            	};

            	// I update the given data to the Restserver.
            	$scope.updateData = function(editedData) {
            		delete editedData.$$hashKey;
            		 editedData = removeEmptyValueKeys(editedData)
            		 console.log(editedData)

            		//$scope.bankData.Data = btoa(JSON.stringify(editedData))
            		restServer = RESTCALL.BankTaskDetailREST;
            		bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
            		$scope.CRUD = "Updated Successfully";
            	};

            	// I delete the given data from the Restserver.
            	$scope.deleteData = function() {

                    delete delData.$$hashKey

            		/*$scope.bankData.Data = btoa(JSON.stringify({
            			 "Records" : [{
            					"ColumnName" : "OfficeID",
            					"ColumnValue" : delData.OfficeID
            				},
            				{
            					"ColumnName" : "TaskId",
            					"ColumnValue" : delData.TaskId
            				}]

            		}))*/

            		$scope.delObj = {};
            		$scope.delObj.OfficeCode = delData.OfficeCode;
            		$scope.delObj.TaskCode = delData.TaskCode;

            		restServer = RESTCALL.BankTaskDetailREST+'delete';
            		bankData.crudRequest("POST",restServer,$scope.delObj).then(getData,errorFunc);
            		$('.modal').modal("hide");
            		//$scope.CRUD = "Deleted Successfully";
            	};

            	// I load the rest data from the server.
            	function getData(response) {

            	    $scope.CRUD = response.data.responseMessage;
            		$scope.loadMorecalled = false;
            		//$scope.bankData.IsReadAllRecord = true;
                    $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                    $scope.bankData.start=0;
                    $scope.bankData.count=len;

                    len = 20;
            		//$scope.bankData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : 20,"QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}]}));
            		restServer = RESTCALL.BankTaskDetailREST+'readall';
            		bankData.crudRequest("POST", restServer,$scope.bankData).then(applyRestData,errorFunc);
            	}


                $scope.bData = '';
            	// I apply the rest data to the local scope.
            	function applyRestData(restDat) {

            	    $scope.bData = angular.copy(restDat)
        			var restData = restDat.data;


        			$scope.restVal = restData;
                    $scope.restVal.splice(0,0,{});

                    $scope.lenthofData = $scope.bData.data;

        			/*if($scope.loadMorecalled){
            			$scope.restVal = $scope.restVal.concat(restData);
            			$scope.loadedCnt = $scope.restVal.length;
            		}
            		else{*/
            				if($scope.restVal.length == 1){
            					$scope.dataFound = true;
            				}
            				else
            				{
            					$scope.dataFound = false;
            				}
            			//$scope.restVal = restData;
            			//$scope.loadedCnt = $scope.restVal.length;
            				if($scope.CRUD != "")
            				{
            					$scope.alerts = [{
            						type : 'success',
            						msg : $scope.CRUD		//Set the message to the popup window
            					}];
            					$timeout(callAtTimeout, 4000);
            				}
            		//}
            		//$scope.feedMore = bankData.loadMoredata(restData.length)

            	}

            	// I apply the Error Message to the Popup Window.
            	function errorFunc(errorMessag){
            		//console.log(errorMessag)
            		 //var errorMessage = errorMessag.data;
            			$scope.alerts = [{
            				type : 'danger',
            				msg : errorMessag.data.error.message		//Set the message to the popup window
            			}];
            	}

            	function callAtTimeout() {
            		$('.alert').hide();
            	}

            	 $scope.viewData = function(data,flag,add)
                   {
                    GlobalService.fromAddNew = false;
                    delete data.$$hashKey;
                    GlobalService.specificData = data;
                    GlobalService.ViewClicked = flag;

                    $state.go('app.viewtaskdetails',{input:$scope.permission})
                    //$location.path('app/viewtaskdetails')
                   }

                   $scope.addFxRate = function()
                   {
                   GlobalService.fromAddNew = true;
                   $location.path('app/viewtaskdetails')
                   }


        $scope.multipleEmptySpace = function (e) {
        		if($.trim($(e.currentTarget).val()).length == 0)
        	    {
        	    $(e.currentTarget).val('');
        	    }
            }

              $scope.Sorting = function(orderByField)
              {
                        $scope.CRUD = '';
                        $scope.loadMorecalled = false;
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

                        len = 20;
                        var sortObj = {};
                        //sortObj.IsReadAllRecord = true;
                        sortObj.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                        sortObj.start=0;
                        sortObj.count=20;
                        //sortObj.UserId = sessionStorage.UserID;
                        //sortObj.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : len, 'QueryOrder':[QueryOrder]}));

                        bankData.crudRequest("POST", restServer, sortObj).then(applyRestData,errorFunc);
                    }


		/*** To control Load more data ***/
		/*$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			 if($scope.restData.length >= 20){
			   //console.log($scope.restData.length)
				   $scope.loadMore();
			   }
		   }
		});*/

		jQuery(
                function($)
                    {
                        $('#exportTable').bind('scroll', function()
                        {
                            $scope.widthOnScroll();
                            //console.log($scope.lenthofData.length, $(this).scrollTop()+$(this).innerHeight(),$(this)[0].scrollHeight )
                            if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
                            {
                                if($scope.lenthofData.length >= 20){
                                    $scope.loadMore();
                                }
                            }
                        })
                        setTimeout(function(){},1000)

                        $(window).bind('scroll', function()
                        {
                            if($scope.changeViewFlag){
                                $scope.widthOnScroll();
                                //console.log($scope.lenthofData.length, Math.round($(window).scrollTop()+$(window).height()), $(document).height()  )
                                if(($(window).scrollTop() + $(window).height()) >= ($(document).height()-2))
                                {
                                //alert()
                                    if($scope.lenthofData.length >= 20){
                                        $scope.loadMore();
                                    }
                                }
                            }
                        })
                        setTimeout(function(){},1000)
                    }
            );

    /** List and Grid view Starts**/

	$scope.listTooltip = "List View";
	$scope.gridTooltip = "Grid View";
	$scope.changeViewFlag = GlobalService.viewFlag;
	$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
	if ($scope.changeViewFlag) {
		$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
		$scope.changeViewFlag = true;
	}
	else {
		$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
		$scope.changeViewFlag = false;
	}

	$scope.hello = function (value, eve) {
	var hitId = eve.currentTarget.id;
	$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
	$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');
		if (value == "list") {
			$scope.changeViewFlag = !$scope.changeViewFlag;
		} 
		else if (value == "grid") {
			$scope.changeViewFlag = !$scope.changeViewFlag;
		} 
		else {
			$scope.changeViewFlag = !$scope.changeViewFlag;
		}
		GlobalService.viewFlag = $scope.changeViewFlag;
	}
	
	/** List and Grid view Ends**/


		/*** Print function ***/

		$scope.printFn = function()
		{
		 $('[data-toggle="tooltip"]').tooltip('hide');
		 window.print()
		}

		/*** Export to Excel function ***/
		$scope.exportToExcel = function(){
			var tabledata = angular.element( document.querySelector('#exportTable') ).clone();
			$(tabledata).find('thead').find('tr').find('th:first-child').remove()
			$(tabledata).find('tbody').find('tr').find('td:first-child').remove()

			var table_html = $(tabledata).html();
			bankData.exportToExcel(table_html, 'Task Details')
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

    	/*** On window resize ***/
    	$(window).resize(function(){
    		$scope.$apply(function () {
                $scope.alertWidth = $('.alertWidthonResize').width();
    		});

    	});
});