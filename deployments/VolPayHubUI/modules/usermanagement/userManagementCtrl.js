VolpayApp.controller('userMgmtController',function($scope,$rootScope,$http, $state, userMgmtService, $timeout, bankData, GlobalService, $location,LogoutService) {



    $scope.permission = {
            		'C' : false,
            		'D'	: false,
            		'R'	: false,
            		'U'	: false
            	}

        $http.post(BASEURL+RESTCALL.ResourcePermission,{
            "RoleId": sessionStorage.ROLE_ID,
            "ResourceName": "User Management"
        }).success(function(response){
            for(k in response){
                    for(j in Object.keys($scope.permission)){
                        if(Object.keys($scope.permission)[j] == response[k].ResourcePermission){
                            $scope.permission[Object.keys($scope.permission)[j]] = true;
                        }
                    }
            }
    })


	var restServer = RESTCALL.CreateNewUser+'/readall';
	var delData = {};
	$scope.backUp = {};
	$scope.indexx = "";
	$scope.dataFound = false;
	$scope.loadMorecalled = false;
	$scope.CRUD = "";
	$scope.restVal = [];

	$scope.changeViewFlag = GlobalService.viewFlag;

			function autoScrollDiv(){
			$(".listView").scrollTop(0);
			}

	$scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
				GlobalService.viewFlag = newValue;
				var checkFlagVal = newValue;	
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
				}
				
			})


    $scope.takeBackup = function(val,Id,flag){
		$scope.backUp = angular.copy(val);
		$scope.indexx = angular.copy(Id);
        $scope.viewMe = flag;
		//console.log(flag)
	}


	 /*** Sorting ***/
        $scope.orderByField  = 'UserID';
        $scope.SortReverse  = false;
        $scope.SortType = 'Asc';



$scope.cancelpressed = function(Id){
		$scope.restVal[$scope.indexx] = $scope.backUp;
		$('#editingWindow_'+Id).collapse('hide');
		$('#displayingWindow_'+Id).collapse('show');
	}

	$scope.prev = null;

$scope.toggleWindow = function(val,Id,flag){

    val.Status = String(val.Status)
	val.IsForceReset = String(val.IsForceReset)

    if($scope.prev != null)
	{
		$('#collapse'+$scope.prev).collapse('hide');
	}

	$scope.prev = Id;

	$scope.takeBackup(val,Id,flag);
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
	$scope.activeDropdown=['--Select--',true,false];

	setTimeout(function(){
            $scope.timeZone();
            },100)

	}


/*** Export to Excel function ***/
		$scope.exportToExcel = function(eve){
			var tabledata = angular.element( document.querySelector('#exportTable') ).clone();
			$(tabledata).find('thead').find('tr').find('th:first-child').remove()
			$(tabledata).find('tbody').find('tr').find('td:first-child').remove()

			var table_html = $(tabledata).html();
			bankData.exportToExcel(table_html, 'Users')
		}


	    $scope.modalHide= function(Id)
        {


       /* $('#userList_'+Id).modal({
            backdrop: 'static',
            keyboard: false
        })*/

       /* $('.modal').click(function(e){

            if(e.target == this)
            {
               $('.modal').unbind('click')
            }
            else
            {
               $('.modal').bind('click')
            }


        })*/
        }


    $scope.userDataFn = function(val,Id,flag)
    {

        setTimeout(function(){
		$scope.timeZone()
		
        },20)

		

        val.Status = String(val.Status)
        val.IsForceReset = String(val.IsForceReset)


        $scope.userData1 = angular.copy(val);

        if($scope.prev != null)
        {
            $('#collapse'+$scope.prev).collapse('hide');
        }

        $scope.prev = Id;

        $scope.takeBackup(val,Id,flag);
        $scope.takeDeldata(val,Id);

        $timeout(function(){
        $scope.modalHide(Id)
	},1000)
	
     $(".alert").hide();
	 $("div").find("#ViewUserMail").removeAttr("style");

 }



	$scope.takeDeldata = function(val,Id){
		delData = val;
		$scope.delIndex = Id;
    }

	//I Load the initial set of datas onload
	$scope.refreshCall=function()
	{

	$scope.UserData ={};
	$scope.CRUD = "";
	/*$scope.UserData.UserId = sessionStorage.UserID;
	$scope.UserData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start':0, 'count':20,  "QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder": $scope.SortType}]}));*/

	//$scope.UserData.IsReadAllRecord = true;
	$scope.UserData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder": $scope.SortType}]
	$scope.UserData.start=0;
	$scope.UserData.count=20;
	$scope.UserData.Operator = "AND";
	$scope.UserData = constructQuery($scope.UserData);
	
	restServer = RESTCALL.CreateNewUser+'/readall';
    $scope.initialObj = {};
	$scope.initialObj.UserId =  sessionStorage.UserID;
    bankData.crudRequest("POST", restServer, $scope.UserData).then(applyRestData,errorFunc);
	}

	$scope.refreshCall();
	var len = 20;
	$scope.loadData = function()
	{
		$scope.UserData.start=0;
		$scope.UserData.count=20;
		len = 20;
		$('.listView').scrollTop(0);
		$scope.loadMorecalled = false;
		$scope.refreshCall();

	}
    //I Load More datas on scroll

	$scope.loadMore = function(){

		$scope.loadMorecalled = true;

		//$scope.UserData.IsReadAllRecord = true;
        $scope.UserData.sorts = [{"columnName":$scope.orderByField,"sortOrder": $scope.SortType}]
        $scope.UserData.start=len;
        $scope.UserData.count=20;

		//$scope.UserData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : len, 'count' : 20,  "QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.SortType}]}))
		bankData.crudRequest("POST", restServer,$scope.UserData).then(applyRestData,errorFunc);
		len = len + 20;
	}

	// I process the Create Data Request.
	/*$scope.createData = function(newData) {
		$scope.UserData.Data = btoa(JSON.stringify(newData))
		restServer = RESTCALL.UserData+'create';

		bankData.crudRequest("POST", restServer,$scope.UserData).then(getData,errorFunc);
		$scope.CRUD = "Created Successfully";
		$scope.newData = "";		// Reset the form once values have been consumed.
	};*/

	// I update the given data to the Restserver.
	$scope.UpdateData = function(editedData,getIDS) { 
	    delete editedData.$$hashKey;
        editedData = removeEmptyValueKeys(editedData)
	//console.log(getIDS)
		$scope.eFlag = emailValidation("#"+getIDS)
        if(!$scope.eFlag)
        {
            $scope.alerts = [{
									type : 'danger',
									msg : "Please Enter Valid Email Address"
							}];
           // $(window).scrollTop(20);
           // setTimeout(function(){
                callAtTimeout()
           // },2000)
            return false;
            
        }  
		
		restServer = RESTCALL.CreateNewUser;
	//	bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
		
		$http.put(BASEURL+restServer,editedData).success(function(data){
					if(sessionStorage.UserID != editedData.UserID)	
					{
						$scope.alerts = [{
									type : 'success',
									msg : data.responseMessage
							}];
					}
					else{
						$rootScope.profileUpdated = data.responseMessage;
							LogoutService.Logout();
					}

		}).error(function(data)
		{

		})
		
		
		$('.modal,.modal-backdrop').hide()
		$('body').removeClass('modal-open')
		setTimeout(function(){
        $scope.timeZone();
        },100)
    };

	// I delete the given data from the Restserver.
	/*$scope.deleteData = function() {
		delete delData.$$hashKey
		$scope.UserData.Data = btoa(JSON.stringify({
			 "Records" : [{
					"ColumnName" : "OfficeID",
					"ColumnValue" : delData.OfficeID
				},
				{
					"ColumnName" : "BranchID",
					"ColumnValue" : delData.BranchID
				}]

		}))
		restServer = RESTCALL.UserData+'delete';
		bankData.crudRequest("POST", restServer,$scope.UserData).then(getData,errorFunc);
		$('.modal').modal("hide");
		$scope.CRUD = "Deleted Successfully";
	};*/
 
	// I load the rest data from the server.
	function getData(response) {

		$scope.CRUD = response.data.responseMessage;
		$scope.loadMorecalled = false;

		$scope.UserData.sorts = [{"columnName":$scope.orderByField,"sortOrder": $scope.SortType}]
        $scope.UserData.start=0;
        $scope.UserData.count=20;

        len = 20;
        restServer = RESTCALL.CreateNewUser+'/readall';
		bankData.crudRequest("POST", restServer,$scope.UserData).then(applyRestData,errorFunc);
		setTimeout(function(){
            $scope.timeZone();
            },100)
	}

	// I apply the rest data to the local scope.

	function applyRestData(restDat) {
		var restData = restDat.data
		$scope.restData = restData;
		if($scope.loadMorecalled){
			$scope.restVal = $scope.restVal.concat(restData);
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
				if($scope.CRUD != "")
				{
					$scope.alerts = [{
						type : 'success',
						msg : $scope.CRUD		//Set the message to the popup window
					}];
					$timeout(callAtTimeout, 4000);
				}
		}
	}

	// I apply the Error Message to the Popup Window.
	function errorFunc(errorMessag){
	    var errorMessage = errorMessag.data;
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
					msg : errorMessage.error.message		//Set the message to the popup window
				}];
			}

			$timeout(callAtTimeout, 4000);

	}

	function callAtTimeout() {
		$('.alert').hide();
	}


	$scope.goToCreateUser = function(){
	$location.path('app/adduser');

	}




				var createObj = {};
                createObj.UserId = sessionStorage.UserID;

                $scope.selectOptions=[];

                $http.get(BASEURL + RESTCALL.CreateRole).success(function (data, status) {
						
                        for (var i = 0; i < data.length; i++) {
                                $scope.selectOptions.push({
                                    'label' : data[i].RoleName,
                                    'value' : data[i].RoleID
                                })
                        }

                        sessionStorage.selectOptions = JSON.stringify($scope.selectOptions);
                }).error(function (data, status, headers, config) {
                        $scope.alerts = [{
                                type : 'danger',
                                msg : data.error.message
                            }];

                             $scope.alertStyle =  alertSize().headHeight;
                             $scope.alertWidth = alertSize().alertWidth;
                       });


    $scope.Sorting = function(orderByField)
    {
        $scope.loadMorecalled = false;
        $scope.orderByField = orderByField;
        $scope.CRUD = '';

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

        sortObj.sorts = [{"columnName":$scope.orderByField,"sortOrder":$scope.SortType}];
        sortObj.start=0;
        sortObj.count=len;

        //sortObj.UserId = sessionStorage.UserID;
        //sortObj.Data = btoa(JSON.Stringify({'UserId':sessionStorage.UserID,'start':0,'Count':20}))
       // sortObj.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : len, 'QueryOrder':[QueryOrder]}));

        bankData.crudRequest("POST", restServer, sortObj).then(applyRestData,errorFunc);
    }


    $scope.printFn = function()
    {
    window.print()
    }

    $scope.timeZone = function () {
        var totArr = ["TZoneGrid","TZoneList"]
        bankData.ApplyTimeZone(totArr)
     }

       /*setTimeout(function(){
        $scope.timeZone()
        },100)*/

	/*** To control Load more data ***/
	var debounceHandler = _.debounce($scope.loadMore, 700, true);
	jQuery(
		function ($) {
			$('.listView').bind('scroll', function () {
				$scope.widthOnScroll();
				if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
					if ($scope.restData.length >= 20) {
						//$scope.loadMore();
						debounceHandler()
						// $scope.loadCnt = 0;
					}
				}
			})
			setTimeout(function () { }, 1000)
		}  
	);

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
			if($(".dataGroupsScroll").scrollTop() == 0){
				$(".dataGroupsScroll").scrollTop(50)
			}
			
			
		})
		$(window).trigger('resize');  

	})
            /** List and Grid view Starts**/
            		// $scope.listTooltip = "List View";
                	// $scope.gridTooltip = "Grid View";
					

                	// $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');

                	// if ($scope.changeViewFlag) {
                	// 	$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
                	// 	$scope.changeViewFlag = true;

                	// } else {
                	// 	$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
                	// 	$scope.changeViewFlag = false;
                	// }

            // $scope.hello = function (value, eve) {
            //  $scope.timeZone()
            //     		var hitId = eve.currentTarget.id;
            //     		$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
            //     		$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');

            //     		if (value == "list") {
            //     			$scope.changeViewFlag = !$scope.changeViewFlag;

            //     		} else if (value == "grid") {
            //     			$scope.changeViewFlag = !$scope.changeViewFlag;
            //     		} else {
            //     			$scope.changeViewFlag = !$scope.changeViewFlag;
            //     		}

            //     		GlobalService.viewFlag = $scope.changeViewFlag;
            //     	}




    });