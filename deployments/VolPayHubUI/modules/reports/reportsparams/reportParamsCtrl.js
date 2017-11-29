VolpayApp.controller('reportParamsCtrl', function ($scope, $state, bankData, GlobalService, $timeout,$location,$filter,LogoutService) {
	var restServer = RESTCALL.ReportParams + 'readall';
            	var delData = {};
            	$scope.backUp = {};
            	$scope.indexx = "";
            	$scope.dataFound = false;
            	$scope.loadMorecalled = false;
            	$scope.CRUD = "";
            	$scope.restVal = []

            	/*** Sorting ***/
                $scope.orderByField = 'OfficeID';
                $scope.SortReverse  = false;
                $scope.SortType = 'Asc';



                if(GlobalService.Fxupdated != '')
                {
                    $scope.alerts = [{
                        type : 'success',
                        msg : GlobalService.Fxupdated		//Set the message to the popup window
                    }];

                    GlobalService.Fxupdated= '';
                    $timeout(callAtTimeout, 4000);

                }




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

				
				$scope.initCall = function()
				{
					
					//I Load the initial set of datas onload
					$scope.bankData ={};
					//$scope.bankData.IsReadAllRecord = true;
				   // $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
					$scope.bankData.start=0;
					$scope.bankData.count=20;
					//$scope.bankData.UserId = sessionStorage.UserID;
					//$scope.bankData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : 20, "QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}]}));
					bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);
						
				}

				$scope.initCall();

            	//I Load More datas on scroll
            	var len = 20;
            	$scope.loadMore = function(){
            		$scope.loadMorecalled = true;

            		//$scope.bankData.IsReadAllRecord = true;
                    $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                    $scope.bankData.start=len;
                    $scope.bankData.count=20;

            		//$scope.bankData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : len, 'count' : 20, "QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}]}))
            		bankData.crudRequest("POST", restServer,$scope.bankData).then(applyRestData,errorFunc);
            		len = len + 20;
            	}

            	// I process the Create Data Request.
            	$scope.createData = function(newData) {
            		//$scope.bankData.Data = btoa(JSON.stringify(newData))
            		restServer = RESTCALL.ReportParams;
            		newData = removeEmptyValueKeys(newData)

            		bankData.crudRequest("POST", restServer,newData).then(getData,errorFunc);
            		$scope.CRUD = "Created Successfully";
            		$scope.newData = "";		// Reset the form once values have been consumed.
            	};

            	// I update the given data to the Restserver.
            	$scope.updateData = function(editedData) {
            		delete editedData.$$hashKey;
            		 editedData = removeEmptyValueKeys(editedData)
            		//$scope.bankData.Data = btoa(JSON.stringify(editedData))
            		restServer = RESTCALL.ReportParams;
            		bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
            		$scope.CRUD = "Updated Successfully";
            	};

            	// I delete the given data from the Restserver.
            	$scope.deleteData = function() {
            		delete delData.$$hashKey


                    $scope.delObj = {};
            		$scope.delObj.REPORTID = delData.REPORTID;
            		$scope.delObj.OFFICEID = delData.OFFICEID;
            		$scope.delObj.BRANCHID = delData.BRANCHID;
            		$scope.delObj.PARAMKEY = delData.PARAMKEY;


            		//console.log($scope.bankData.Data)

            		restServer = RESTCALL.ReportParams+'delete';

            		bankData.crudRequest("POST", restServer,$scope.delObj).then(getData,errorFunc);
            		$('.modal').modal("hide");
            		$scope.CRUD = "Deleted Successfully";
            	};

            	// I load the rest data from the server.
            	function getData(response) {
            		$scope.loadMorecalled = false;

            		//$scope.bankData.IsReadAllRecord = true;
                    $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                    $scope.bankData.start=0;
                    $scope.bankData.count=20;

            		//$scope.bankData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : 20, "QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}]}));
            		restServer = RESTCALL.ReportParams+'readall';
            		bankData.crudRequest("POST", restServer,$scope.bankData).then(applyRestData,errorFunc);
            	}

            	// I apply the rest data to the local scope.
            	function applyRestData(restDat) {
        			var restData = restDat.data;
        			$scope.restData = restData;
        			$scope.restData = restData.splice(0,0,{});

            		if($scope.loadMorecalled){
            			$scope.restVal = $scope.restVal.concat(restData);
            			$scope.loadedCnt = $scope.restVal.length;

            		}
            		else{
            				if(restData.length == 0){
            					$scope.dataFound = true;
            				}
            				else
            				{
            					$scope.dataFound = false;
            				}
            			$scope.restVal = restData;

            			$scope.loadedCnt = $scope.restVal.length;

            				if($scope.CRUD != "")
            				{
            					$scope.alerts = [{
            						type : 'success',
            						msg : $scope.CRUD		//Set the message to the popup window
            					}];
            					$timeout(callAtTimeout, 4000);
            				}
            		}
            		$scope.feedMore = bankData.loadMoredata(restData.length)

            	}

            	// I apply the Error Message to the Popup Window.
            	function errorFunc(errorMessag){
				 var errorMessage = errorMessag.data;
            		//console.log(errorMessage.error.message)
					if(errorMessag.status == 401)
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
								type : 'danger',
								msg : errorMessage.error.message	//Set the message to the popup window
							}];
						
					}
            	}

            	function callAtTimeout() {
            		$('.alert').hide();
            	}


           $scope.viewData = function(data,flag)
           {
            GlobalService.fromAddNew = false;
            delete data.$$hashKey;
            data.PARAMVALUE = $filter('hex2a')(data.PARAMVALUE)
            GlobalService.specificData = data;
            GlobalService.ViewClicked = flag;
            $location.path('app/reportparamsdetail')
           }

           $scope.addFxRate = function()
           {
           GlobalService.fromAddNew = true;
           $location.path('app/reportparamsdetail')
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

            var sortObj = {};
            //sortObj.IsReadAllRecord = true;
            sortObj.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
            sortObj.start=0;
            sortObj.count=len;
            bankData.crudRequest("POST", restServer, sortObj).then(applyRestData,errorFunc);
        }


		/*** To control Load more data ***/
		$(window).scroll(function() {
            if($(window).scrollTop() + $(window).height() == $(document).height()) {
                if($scope.restData.length >= 20){
                    $scope.loadMore();
                }
           }
        });

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
		$scope.exportToExcel = function(eve){
			var tabledata = angular.element( document.querySelector('#exportTable') ).clone();
			$(tabledata).find('thead').find('tr').find('th:first-child').remove()
			$(tabledata).find('tbody').find('tr').find('td:first-child').remove()

			var table_html = $(tabledata).html();
			bankData.exportToExcel(table_html, 'ReportParams')
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
