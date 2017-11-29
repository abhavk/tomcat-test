VolpayApp.controller('volpayidConfigCtrl', function ($scope, $state, $http, bankData, GlobalService, $timeout, $location,LogoutService) {

	$scope.permission = {
        		'C' : false,
        		'D'	: false,
        		'R'	: false,
        		'U'	: false
        	}

        	$http.post(BASEURL+RESTCALL.ResourcePermission,{
        		"RoleId": sessionStorage.ROLE_ID,
        		"ResourceName": "VolPay ID Configuration"
        	}).success(function(response){
        	    for(k in response){
                        for(j in Object.keys($scope.permission)){
        					if(Object.keys($scope.permission)[j] == response[k].ResourcePermission){
        						$scope.permission[Object.keys($scope.permission)[j]] = true;
        					}
        				}
        		}
        })

    $scope.sortMenu = [
                         {
                             "label":"IDCode",
                             "FieldName":"IDCode",
                             "visible":true,
							 "Type":"String"
                         },{
                             "label":"Pattern",
                             "FieldName":"Pattern",
                             "visible":true,
							 "Type":"String"
                         },{
                             "label":"FixLen",
                             "FieldName":"FixLen",
                             "visible":true
                         }
                         ]




	var restServer = RESTCALL.volPayIdConfig + 'readall';
            	var delData = {};
            	$scope.backUp = {};
            	$scope.indexx = "";
            	$scope.dataFound = false;
            	$scope.loadMorecalled = false;
            	$scope.CRUD = "";
            	$scope.restVal = []

              /*** Sorting ***/
                $scope.orderByField = 'IDCode';
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


            	$scope.bankData ={
									"start": 0,
									"count": 20,
									"Operator" : "AND",
									"QueryOrder": []
								}

				$scope.dupBankData = angular.copy($scope.bankData);

				$scope.bankData = constructQuery($scope.bankData);

            	//$scope.bankData.UserId = sessionStorage.UserID;
            	//$scope.bankData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : 20,"QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}]}));
            	bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);

				}
				

				$scope.initData();
              $scope.loadData = function(){
        
                        $scope.bankData.start = 0
                        $scope.bankData.count = 20
                        len = 20;
						$scope.loadMorecalled = false;
                        $('.listView').scrollTop(0)
                        $scope.initData ();
                }






            	//I Load More datas on scroll
            	var len = 20;
            	$scope.loadMore = function(){
            		$scope.loadMorecalled = true;

            		//$scope.bankData.IsReadAllRecord = true;
                 //   $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                    $scope.bankData.start=len;
                    $scope.bankData.count=20;

					$scope.bankData = constructQuery($scope.bankData);
            		//$scope.bankData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : len, 'count' : 20,"QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}]}))
            		bankData.crudRequest("POST", restServer,$scope.bankData).then(applyRestData,errorFunc);
            		len = len + 20;
            	}




            	// I delete the given data from the Restserver.
            	$scope.deleteData = function() {
                    //console.log(delData)
            		delete delData.$$hashKey;
                    $scope.delObj = {};
            		$scope.delObj.IDCode = delData.IDCode;

                    restServer = RESTCALL.volPayIdConfig+'delete';
            		bankData.crudRequest("POST",restServer,$scope.delObj).then(getData,errorFunc);
            		$('.modal').modal("hide");
            		$scope.CRUD = "Deleted Successfully";
            	};

            	// I load the rest data from the server.
            	function getData(response) {
            		$scope.loadMorecalled = false;
            		//$scope.bankData.IsReadAllRecord = true;
                  //  $scope.bankData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                    $scope.bankData.start=0;
                    $scope.bankData.count=20;
                    len = 20;
            		restServer = RESTCALL.volPayIdConfig+'readall';
            		bankData.crudRequest("POST", restServer,$scope.bankData).then(applyRestData,errorFunc);
            	}

            	// I apply the rest data to the local scope.
            	function applyRestData(restDat) {
        			var restData = restDat.data;
        			$scope.restData = restData;
        			$scope.restData.splice(0,0,{});
					$scope.totalForCountbar = restDat.headers().totalcount;

            		if($scope.loadMorecalled){
            			$scope.restVal = $scope.restVal.concat(restData);
            			$scope.loadedCnt = $scope.restVal.length;
            		}
            		else{
            				if(restData.length == 1){
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
            	function errorFunc(errorMessage){
            		//console.log(errorMessage)
            		// var errorMessage = errorMessag.data;
					if(errorMessage.status == 401)
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
            				msg : errorMessage.data.error.message		//Set the message to the popup window
            			}];
					}
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

                    $state.go('app.volpayidconfigdetail',{input:$scope.permission})
                    //$location.path('app/viewtaskdetails')
                   }

                   $scope.addFxRate = function()
                   {
                   GlobalService.fromAddNew = true;
                   $location.path('app/volpayidconfigdetail')
                   }


        $scope.multipleEmptySpace = function (e) {
        		if($.trim($(e.currentTarget).val()).length == 0)
        	    {
        	    $(e.currentTarget).val('');
        	    }
            }
						$scope.bankData = 	{
											  "start": 0,
											  "count": 20,
											  "sorts":[]
											}

            $scope.gotoSorting = function(dat){

					// $scope.dupBankData.start = 0;
			        // $scope.dupBankData.count = len;


                    // var orderFlag = true;
            		// if($scope.dupBankData.QueryOrder.length){
            		// 	for(k in $scope.dupBankData.QueryOrder){
            		// 		if($scope.dupBankData.QueryOrder[k].ColumnName == dat.FieldName){
            		// 			if($scope.dupBankData.QueryOrder[k].ColumnOrder == 'Asc'){
            		// 				$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-desc')
            		// 				$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-down')
            		// 				$scope.dupBankData.QueryOrder[k].ColumnOrder = 'Desc'
            		// 				orderFlag = false;
                    //                 break;
            		// 			}
            		// 			else{
            		// 				$scope.dupBankData.QueryOrder.splice(k,1);
            		// 				orderFlag = false;
            		// 				$('#'+dat.FieldName+'_icon').attr('class','fa fa-hand-pointer-o')
            		// 				$('#'+dat.FieldName+'_Icon').removeAttr('class')
                    //                 break;
            		// 			}
            		// 		}
            		// 	}
            		// 	if(orderFlag){
            		// 		$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
            		// 		$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
            		// 		$scope.dupBankData.QueryOrder.push({
            		// 						"ColumnName": dat.FieldName,
            		// 						"ColumnOrder": 'Asc'
            		// 		})

            		// 	}
            		// }
            		// else{
            		// 	$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
            		// 	$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
            		// 	$scope.dupBankData.QueryOrder.push({
            		// 					  "ColumnName": dat.FieldName,
            		// 					  "ColumnOrder": 'Asc'
            		// 					})

            		// }

					// $scope.bankData = constructQuery($scope.dupBankData);

            		// bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);


			$scope.bankData.start = 0;
            $scope.bankData.count = len;

		  


        var orderFlag = true;
		if($scope.bankData.sorts.length){
			for(k in $scope.bankData.sorts){
				if($scope.bankData.sorts[k].columnName == dat.FieldName){
					if($scope.bankData.sorts[k].sortOrder == 'Asc'){
						$('#'+dat.FieldName+'_icon').attr('class','fa fa-long-arrow-down')
						$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-down')
						$scope.bankData.sorts[k].sortOrder = 'Desc'
						orderFlag = false;
                        break;
					}
					else{
						$scope.bankData.sorts.splice(k,1);
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
				$scope.bankData.sorts.push({
								"columnName": dat.FieldName,
								"sortOrder": 'Asc'
				})

			}
		}
		else{
			$('#'+dat.FieldName+'_icon').attr('class','fa fa-long-arrow-up')
			$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
			$scope.bankData.sorts.push({
							  "columnName": dat.FieldName,
							  "sortOrder": 'Asc'
							})
			
		}	

		//$scope.bankData = constructQuery($scope.dupBankData);
		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);



                   }



				     $scope.clearSort = function(id){
							$(id).find('i').each(function(){
								$(this).removeAttr('class').attr('class','fa fa-minus fa-sm');
								$('#'+$(this).attr('id').split('_')[0]+'_Icon').removeAttr('class');
							});

						$scope.bankData.sorts = [];

						//$scope.bankData = constructQuery($scope.bankData);
						console.log($scope.bankData)
						bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);


							}

	$scope.buildFilter = function(argu1,argu2){	
		console.log(argu1,argu2)
		for(k in $scope.sortMenu){
			if($scope.sortMenu[k].Type == 'String'){
				argu2.push({
					"columnName": $scope.sortMenu[k].FieldName,
					"operator": "LIKE",
					"value": argu1
				})
			}
		}
		return argu2;
		//console.log(argu2)
	}




	$scope.searchFilter = function(val){
		console.log(val);
		val = removeEmptyValueKeys(val)
		$scope.bankData.filters = removeEmptyValueKeys($scope.bankData.filters)

		console.log(val)
		$scope.bankData.filters = {  
											"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND",
												"groupLvl3":[]
											}]}]
										}
		for(j in Object.keys(val)){
			$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
				"logicalOperator" : "OR",
				"clauses" : []
			})
			if(Object.prototype.toString.call(val[Object.keys(val)[j]]) === '[object Array]') {
				for(i in val[Object.keys(val)[j]]){
			 		console.log('in if',val[Object.keys(val)[j]][i])
					 $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName": Object.keys(val)[j],
						"operator": "=",
						"value": val[Object.keys(val)[j]][i]
					})
			 	}
			}
			else{
				if(typeof(val[Object.keys(val)[j]]) === 'object'){					
					$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName": "EffectiveFromDate",
						"operator": $('#startDate').val() == $('#endDate').val() ? '=': $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
						"value": $('#startDate').val()
					})
					$scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName": "EffectiveFromDate",
						"operator": $('#startDate').val() == $('#endDate').val() ? '=': $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
						"value": $('#endDate').val()
					})		
				}
				else{
					$scope.buildFilter(val[Object.keys(val)[j]], $scope.bankData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses)
				}
				
			}
		}
			//$scope.bankData = constructQuery($scope.bankData)
			$scope.filterParams = {};
			bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);
	}

	$scope.clearFilter = function(){
		$scope.bankData = 	{
									"start": 0,
									"count": 20,
									"sorts":[]
								}		
		$scope.showCustom = false;
		$scope.filterParams = {};
		$('.filterBydate').each(function(){
			$(this).css({'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
		})

		$scope.selectedStatus = [];	
		$('.filterBystatus').each(function(){
			$(this).css({'box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
		})
		$('.customDropdown').removeClass('open');
		$scope.bankData = constructQuery($scope.bankData)
		bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);
	}

     //$("#Filter").find(".input-group-addon")

    // $("#keysearch").keydown(function(e){
	// 	console.log($(this).val().length)
	// 	if($(this).val().length < 2 ){
	// 		$("#Filter").find(".input-group-addon").css("pointer-events", "none");
	// 	}
	// 	else
	// 	{
	// 		$("#Filter").find(".input-group-addon").css("pointer-events", "auto");
	// 	}
    // });


             /* $scope.Sorting = function(orderByField)
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
                     //   sortObj.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}];
                        sortObj.start=0;
                        sortObj.count=20;
                        //sortObj.UserId = sessionStorage.UserID;
                        //sortObj.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : len, 'QueryOrder':[QueryOrder]}));

                        bankData.crudRequest("POST", restServer, sortObj).then(applyRestData,errorFunc);
                    }*/

         var debounceHandler = _.debounce($scope.loadMore, 700, true);
		/*** To control Load more data ***/
		$('.listView').bind('scroll', function()
    	{
		if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
        {
			 if($scope.restData.length >= 20){
			   //console.log($scope.restData.length)
				  // $scope.loadMore();
				 debounceHandler(); 
			   }
		   }
		});


	function autoScrollDiv(){
					$(".dataGroupsScroll").scrollTop(0);
		}
    /** List and Grid view Starts**/

	$scope.listTooltip = "List View";
	$scope.gridTooltip = "Grid View";
	$scope.changeViewFlag = GlobalService.viewFlag;


	$scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
				GlobalService.viewFlag = newValue;
				var checkFlagVal = newValue;	
				if(checkFlagVal){
					$(".floatThead ").find("thead").hide();
					autoScrollDiv();
				}
				else{
					$(".floatThead ").find("thead").show();
					if($(".dataGroupsScroll").scrollTop() == 0){
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

		$scope.printFn = function()
		{
		 $('[data-toggle="tooltip"]').tooltip('hide');
		window.print()
		}

		/*** Export to Excel function ***/
		$scope.exportToExcel = function(){
		bankData.exportToExcelHtml($('#DummyExportContent').html(), 'VolPayIDConfiguration');
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

		$(document).ready(function () {
		$(".FixHead").scroll(function (e) {
			var $tablesToFloatHeaders = $('table');
			//console.log($tablesToFloatHeaders)
			$tablesToFloatHeaders.floatThead({
				useAbsolutePositioning: true,
				scrollContainer: true
			})
			$tablesToFloatHeaders.each(function () {
				var $table = $(this);
				//console.log($table.find("thead").length)
				$table.closest('.FixHead').scroll(function (e) {
					$table.floatThead('reflow');
				});
			});
		})
		


		$(window).bind("resize",function(){
			setTimeout(function(){
             autoScrollDiv();
			},300)
			
			
			
		})
		$(window).trigger('resize');  

	})

});