VolpayApp.controller('AlertandNotifiCtrl', function ($scope, $state, $http, $timeout, $filter, $anchorScroll, $rootScope, bankData, GlobalService,LogoutService) {

    console.log( $rootScope.totAlertCnt)

	  $scope.permission = {
                    		'C' : false,
                    		'D'	: false,
                    		'R'	: false,
                    		'U'	: false
                    	}

                $http.post(BASEURL+RESTCALL.ResourcePermission,{
                    "RoleId": sessionStorage.ROLE_ID,
                    "ResourceName": "Alerts & Notifications"
                }).success(function(response){
                    for(k in response){
                            for(j in Object.keys($scope.permission)){
                                if(Object.keys($scope.permission)[j] == response[k].ResourcePermission){
                                    $scope.permission[Object.keys($scope.permission)[j]] = true;
                                }
                            }
                    }
                })


    //For sidebar
      $timeout(function(){
      sidebarMenuControl('Home',$filter('specialCharactersRemove')('Alerts&Notifications'))
    },500)

    $scope.Restloaded = false;


	$scope.clickedId = GlobalService.AandN.AlertId;
	$scope.NotifCount = GlobalService.AandN.NotifCount;
	$timeout(function(){
		if($scope.clickedId != ''){
			GlobalService.AandN.functions.anchorSmoothScroll($scope.clickedId);
			GlobalService.AandN.functions.assignClassName();
		}
		else{
			GlobalService.AandN.functions.assignClassName();
		}
	},500)


	$scope.sortMenu = [
                     {
                         "label":"REFERENCE ID",
                         "FieldName":"REFERENCE_ID",
                         "visible":true,
                     },{
                         "label":"OFFICE ID",
                         "FieldName":"OFFICE_ID",
                         "visible":true,
                     },{
                         "label":"BRANCH ID",
                         "FieldName":"BRANCH_ID",
                         "visible":true,
                     },
					 {
                         "label":"ALERT DATE",
                         "FieldName":"ALERT_DATE",
                         "visible":true,
                     },
					 {
                         "label":"CONTENT",
                         "FieldName":"CONTENT",
                         "visible":true,
                     },
					 {
                         "label":"NOTIFICATION",
                         "FieldName":"NOTIFICATION",
                         "visible":true,
                     },
					 {
                         "label":"NOTIF CLASS",
                         "FieldName":"NOTIF_CLASS",
                         "visible":true,
                     }
					 ]



	var restServer = RESTCALL.AlertandNotific + 'readall';
	var delData = {};
	$scope.backUp = {};
	$scope.viewMe = true;
	$scope.dataFound = false;
	$scope.loadMorecalled = false;
	$scope.backuup = {};
	$scope.CRUD = "";
	$scope.restVal = [];
	$scope.indexx = undefined;
	$scope.came = undefined;
	$scope.prev = undefined;
	$scope.pageDisplay = 'View starting count - End count of Total Count';
	$scope.pageSelect = "20";
	$scope.pageEnter = "";

	/*** Sorting ***/
	$scope.orderByField = 'ALERT_DATE';
	$scope.AppcofigSortReverse = true;
	$scope.AppcofigSortType = 'Desc';


	$scope.accessToken = true;
	//$timeout(function(){
	 $('.loaderStyle').css({'visibility':'visible','position':'absolute','left':($(window).width()/2)+'px','top':$(window).height()/2+'px'})
	//},100)


    $scope.initHeader = function(){

		$http({
				url : BASEURL + '/rest/v2/notifications/view',
				method : "POST",
				/*data : {
					UserId : sessionStorage.UserID
				},*/
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				//console.log('data',data)
				//GlobalService.AandN.functions.constructData(data)
			}).error(function (data, status, headers, config) {
				
				if (status == 401) {
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
						msg : data.error.message
					}
				];
				
			}				
				
				
			});
	}
	
    $scope.initialCall = function(){

        $scope.AlertandNotificData = {};
        

         $scope.loadMorecalled = false;
         len = 20;

        //I Load the initial set of datas onload

		//$scope.AlertandNotificData.IsReadAllRecord = true;
		$scope.AlertandNotificData.QueryOrder=[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.AppcofigSortType}]
		$scope.AlertandNotificData.start=0;

		$scope.AlertandNotificData.count=20;
		/* if($rootScope.totAlertCnt)
		{
			
		$scope.AlertandNotificData.count=$rootScope.totAlertCnt;
		//console.log($scope.AlertandNotificData.count)
		}
		else
		{
		    $scope.AlertandNotificData.count=20;
		
		} */
		
		$scope.dupData = angular.copy($scope.AlertandNotificData);

		$scope.AlertandNotificData = constructQuery($scope.AlertandNotificData);


        bankData.crudRequest("POST", restServer,$scope.AlertandNotificData).then(applyRestData, errorFunc);
	}

	//Calling default function first time
	$scope.initHeader();
    $scope.initialCall();

    $scope.defaultCalls = function()
    {

         if((($scope.flag == $state.current.name.split('.')[1])||($scope.accessToken)))
         {
            $scope.Restloaded = false;
            $scope.initHeader();
            $scope.initialCall();
         }
         else{
            clearInterval($scope.interval);
         }
    }

        $scope.refreshFn = function()
        {
				clearInterval($scope.interval);
				
                var cal = sessionStorage.refreshData ? JSON.parse(sessionStorage.refreshData) : '';
                console.log(cal)

                if(cal.autoRefresh){
                    for(i in cal.selectedrefreshField){
                        if($state.current.name.split('.')[1] == cal.selectedrefreshField[i]){
                            $scope.interval = setInterval($scope.defaultCalls, Number(cal.refreshTime)*1000);
                            $scope.flag = cal.selectedrefreshField[i];
                        }
                    }
                }
        }
       // $scope.refreshFn()

var len = 20;

    $scope.RefereshCalled = function(){
		
		$scope.Restloaded = false;
		$scope.initialCall();
		$scope.initHeader();
		$scope.CRUD = '';
	}




	$scope.$on('handleBroadcast', function() {
		$scope.Notifi = GlobalService.AandN.NotifData;
		$scope.NotifCount = $scope.Notifi.NotifyContent.length;
		console.log($scope.Notifi)
    });


	//I Load More datas on scroll
	
	$scope.loadMore = function () {
	    $scope.loadMorecalled = true;
        $scope.AlertandNotificData = {};
        //$scope.AlertandNotificData.IsReadAllRecord = true;
        $scope.AlertandNotificData.QueryOrder=[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.AppcofigSortType}]
        $scope.AlertandNotificData.start=len;
        $scope.AlertandNotificData.count=20;
		
		$scope.AlertandNotificData = constructQuery( $scope.AlertandNotificData);
		bankData.crudRequest("POST", restServer,$scope.AlertandNotificData).then(applyRestData, errorFunc);
		len = len + 20;
	}

	// I delete the given data from the Restserver.
	$scope.deleteData = function () {
		delete delData.$$hashKey
		$scope.AlertandNotificData.Data = btoa(JSON.stringify({
					"Records" : [{
							"ColumnName" : "ALERT_ID",
							"ColumnValue" : delData.ALERT_ID
						}
					]

				}))
			restServer = RESTCALL.AlertandNotific + 'delete';
		bankData.crudRequest("POST", restServer, {'ALERT_ID':delData.ALERT_ID}).then(getData, errorFunc);
		$('.modal').modal("hide");

		//$scope.CRUD = "Deleted Successfully";
	};

	// I load the rest data from the server.
	function getData(response) {
		//console.log("response",response)

			if(response.status == 204)
			{
				$scope.CRUD = "Deleted Successfully";
			}
			else{
				$scope.CRUD = response.data.responseMessage;
			}

		$scope.loadMorecalled = false;

		$scope.AlertandNotificData = {};
                //$scope.AlertandNotificData.IsReadAllRecord = true;
                $scope.AlertandNotificData.QueryOrder=[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.AppcofigSortType}]
                $scope.AlertandNotificData.start=0;
                $scope.AlertandNotificData.count=20;

				 $scope.AlertandNotificData = constructQuery($scope.AlertandNotificData);

		restServer = RESTCALL.AlertandNotific + 'readall';
		bankData.crudRequest("POST", restServer,$scope.AlertandNotificData).then(applyRestData, errorFunc);
		$rootScope.$emit("CallParentMethod", {});
	}

	// I apply the rest data to the local scope.
	function applyRestData(restDat) {
		
        $timeout(function()
	    {$scope.Restloaded = true;
	    },300)
		$scope.totalCount = restDat.headers().totalcount;

		var restData = restDat.data;
		$scope.restData = restData;

        if ($scope.loadMorecalled) {

			$scope.restVal = $scope.restVal.concat(restData);
		} else {
			if (restData.length == 0) {
				$scope.dataFound = true;
			} else {
				$scope.dataFound = false;
			}
			$scope.restVal = restData;
			if ($scope.CRUD != "") {
				$scope.alerts = [{
						type : 'success',
						msg : $scope.CRUD //Set the message to the popup window
					}
				];
				$timeout(callAtTimeout, 4000);
			}
		}
	}

	// I apply the Error Message to the Popup Window.
	function errorFunc(errorMessag) {
        //var errorMessage = errorMessag.error.message;
		$scope.alerts = [{
				type : 'danger',
				msg : errorMessag.data.error.message //Set the message to the popup window
			}
		];
	}

		/*** To control Load more data ***/
		//$scope.dLen = 0;
    	// 	$(window).scroll(function () {
        //         if ($(window).scrollTop() + $(window).height() == $(document).height()) {
    	// 		    if ($scope.restData.length >= 20) {
    	// 				//console.log($scope.restData.length)
    	// 				$scope.loadMore();
    	// 			}
    	// 		}
    	// 	});
		// $('.listView').bind('scroll', function()
    	// {
		// 	if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
		// 	{
		// 		if($scope.restData.length >= 20){
		// 		//console.log($scope.restData.length)
		// 			$scope.loadMore();
		// 		}
		// 	}
		// });
		var debounceHandler = _.debounce($scope.loadMore, 700, true);
		
		jQuery(
        		function($)
        			{
        				$('.listView').bind('scroll', function()
        				{
        					$scope.widthOnScroll();
        					if(Math.round($(this).scrollTop() + $(this).innerHeight())>=$(this)[0].scrollHeight)
        					{
        						if($scope.restData.length >= 20){
									debounceHandler()
        							//$scope.loadMore();
        						}
        					}
        				})
        				setTimeout(function(){},1000)
						}
        	);
    		

	function callAtTimeout() {
		$('.alert').hide();
	}

	// $scope.Sorting = function (orderByField) {

	//     $scope.CRUD = '';

	// 	$scope.loadMorecalled = false;
	// 	$scope.orderByField = orderByField;

	// 	if ($scope.AppcofigSortReverse == false) {
	// 		$scope.AppcofigSortType = 'Desc';
	// 		$scope.AppcofigSortReverse = true;
	// 	} else {
	// 		$scope.AppcofigSortType = 'Asc';
	// 		$scope.AppcofigSortReverse = false;
	// 	}

	// 	var QueryOrder = {};
	// 	QueryOrder.ColumnName = orderByField;
	// 	QueryOrder.ColumnOrder = $scope.AppcofigSortType;

    //     len = 20;

	//     	var sortObj = {};

	// 	sortObj.QueryOrder = [QueryOrder];
    //     sortObj.start=0;
    //     sortObj.count=20;

	// 	sortObj = constructQuery(sortObj);
    //     bankData.crudRequest("POST", restServer, sortObj).then(applyRestData, errorFunc);
	// }


	$scope.gotoSorting = function(dat){

			$scope.dupData.start = 0;
			$scope.dupData.count = len;

			$scope.loadMorecalled = false;
		

        var orderFlag = true;
		if($scope.dupData.QueryOrder.length){
			for(k in $scope.dupData.QueryOrder){
				if($scope.dupData.QueryOrder[k].ColumnName == dat.FieldName){
					if($scope.dupData.QueryOrder[k].ColumnOrder == 'Asc'){
						$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-desc')
						$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-down')
						$scope.dupData.QueryOrder[k].ColumnOrder = 'Desc'
						orderFlag = false;
                        break;
					}
					else{
						$scope.dupData.QueryOrder.splice(k,1);
						orderFlag = false;
						$('#'+dat.FieldName+'_icon').attr('class','fa fa-hand-pointer-o')
						$('#'+dat.FieldName+'_Icon').removeAttr('class')
                        break;
					}
				}
			}
			if(orderFlag){
				$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
				$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
				$scope.dupData.QueryOrder.push({
								"ColumnName": dat.FieldName,
								"ColumnOrder": 'Asc'
				})

			}
		}
		else{
			$('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
			$('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
			$scope.dupData.QueryOrder.push({
							  "ColumnName": dat.FieldName,
							  "ColumnOrder": 'Asc'
							})
			
		}	

		$scope.AlertandNotificData = constructQuery($scope.dupData);
		bankData.crudRequest("POST", restServer, $scope.AlertandNotificData).then(applyRestData, errorFunc);
		//bankData.crudRequest("POST", restServer, $scope.bankData).then(applyRestData,errorFunc);

       }


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

//console

	// $('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');

	// if ($scope.changeViewFlag) {
	// 	$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
	// 	$scope.changeViewFlag = true;

	// } else {
	// 	$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
	// 	$scope.changeViewFlag = false;
	// }

	// $scope.viewType = function (value, eve) {

	// 	var hitId = eve.currentTarget.id;
	// 	$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
	// 	$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');

	// 	if (value == "list") {
	// 		$scope.changeViewFlag = !$scope.changeViewFlag;
	// 		if (($scope.indexx != undefined) && ($scope.indexx != $scope.ctId)) {
	// 			$scope.ctId = $scope.indexx;
	// 			$timeout(function () {
	// 				$scope.flip($scope.indexx)
	// 			}, 100)
	// 		}
	// 	} else if (value == "grid") {
	// 		$scope.changeViewFlag = !$scope.changeViewFlag;
	// 		if (($scope.indexx != undefined) && ($scope.indexx != $scope.ctId)) {
	// 			$scope.ctId = $scope.indexx;
	// 			$timeout(function () {
	// 				$scope.slideDown($scope.indexx)
	// 			}, 100)
	// 		}
	// 	} else {
	// 		$scope.changeViewFlag = !$scope.changeViewFlag;
	// 	}

	// 	GlobalService.viewFlag = $scope.changeViewFlag;
	// }

	/** List and Grid view Ends**/

	/*** Print function ***/

	$scope.printFn = function () {
		$('[data-toggle="tooltip"]').tooltip('hide');
		window.print()

	}

	$scope.exportToExcel = function () {
		 $scope.dat = angular.copy($scope.restVal);
         $scope.dat.shift();
        JSONToCSVConvertor(bankData,$scope.dat, 'AlertsNotification', true);

		// var tabledata = angular.element(document.querySelector('#exportTable')).clone();
		// $(tabledata).find('thead').find('tr').find('th:first-child').remove()
		// $(tabledata).find('tbody').find('tr').find('td:first-child').remove()

		// var table_html = $(tabledata).html();
		// bankData.exportToExcel(	, 'AlertsNotification')
	}

	/*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

	$scope.widthOnScroll = function () {
		var mq = window.matchMedia("(max-width: 991px)");
		var headHeight
		if (mq.matches) {
			headHeight = 0;
			$scope.alertWidth = $('.pageTitle').width();
		} else {
			$scope.alertWidth = $('.pageTitle').width();
			headHeight = $('.main-header').outerHeight(true) + 10;
		}
		$scope.alertStyle = headHeight;
	}

	$scope.widthOnScroll();

	/*** On window resize ***/
	$(window).resize(function () {
		$scope.$apply(function () {
			$scope.alertWidth = $('.alertWidthonResize').width();
			if ($('.flip')[0]) {
				$('#' + ($($('.flip')[0]).attr('id'))).parent().css({
					'height' : $('.outerCrcle').outerHeight() + $('#collapse' + ($($('.flip')[0]).attr('id')).split("_")[1]).outerHeight() + 'px',
					'width' : $('#' + ($($('.flip')[0]).attr('id'))).parent().parent().width() + 'px'
				});
			}
		});

	});

	/*** On click resize ***/
	$(window).click(function () {
		if ((sessionStorage.sidebarToggleClosed != undefined) && ($('.flip')[0] != undefined)) {
			$('#' + ($($('.flip')[0]).attr('id'))).parent().css({
				'width' : $('#' + ($($('.flip')[0]).attr('id'))).parent().parent().width() + 'px'
			});
		}
	});
	$scope.takeBackup = function (val, Id, v) {
		$scope.viewMe = v;
		$scope.backUp = angular.copy(val);
		$scope.indexx = angular.copy(Id);
		$scope.takeDeldata(val, Id);
	}
	$scope.changeviewMe = function (v) {
		$scope.viewMe = v;
	}

	$scope.takeDeldata = function (val, Id) {
		//console.log(val)
		delData = val;
		$scope.delIndex = Id;
	}

	$scope.slideUp = function (Id) {
		$('#editingWindow_' + Id).collapse('hide');
		$('.editHere').removeClass('trHilght');
		$('#displayingWindow_' + Id).collapse('show');
		$('#editingWindow_' + Id).on('hidden.bs.collapse', function () {
			$scope.restVal[$scope.indexx] = $scope.backUp;
			$scope.indexx = undefined;
			$scope.ctId = undefined;
			$scope.came = undefined;
			$scope.prev = undefined;
		});

	}

	$scope.slideDown = function (Id) {

		if (($scope.prev != undefined) && ($scope.prev != Id)) {
			$('#collapse' + $scope.prev).collapse('hide');
		}

		$scope.prev = Id;
		$('#displayingWindow_' + Id).collapse('hide');
		$('.displayWindow').collapse('show');
		$('.editWindow').collapse('hide');
		$('#editingWindow_' + Id).collapse('show');
		$('.editHere').removeClass('trHilght');
		$('#editHere_' + Id).addClass('trHilght');
	}

	$scope.flip = function (x) {
		if (($scope.came != undefined) && ($scope.came != x)) {
			frontRotate(180, 0, $('#listViewPanelHeading_' + $scope.came));
			frontRotate(0, 180, $('#collapse' + $scope.came), $scope.came);
		}

		$('#listViewPanelHeading_' + x).parent().css({
			'width' : $('#listViewPanelHeading_' + x).parent().outerWidth() + 'px',
			'position' : 'relative'
		});
		$('#listViewPanelHeading_' + x).parent().animate({
			'height' : $('.outerCrcle').outerHeight() + $('#collapse' + x).outerHeight() + 'px'
		}, {
			duration : 100,
			easing : "linear",
		});
		$('#listViewPanelHeading_' + x).addClass('flip');
		$('#collapse' + x).removeClass('hideMe').addClass('flip');

		frontRotate(0, 180, $('#listViewPanelHeading_' + x));
		frontRotate(180, 0, $('#collapse' + x));
		$scope.came = x;
	}

	$scope.flipReverse = function (x) {
		frontRotate(180, 0, $('#listViewPanelHeading_' + x));
		frontRotate(0, 180, $('#collapse' + x), x);
		$('#editingWindow_' + x).collapse('hide');
		$('.editHere').removeClass('trHilght');
		$('#displayingWindow_' + x).collapse('show');
		$timeout(function () {
			$scope.restVal[$scope.indexx] = $scope.backUp
				$scope.indexx = undefined;
			$scope.ctId = undefined;
			$scope.came = undefined;
			$scope.prev = undefined;
		}, 800)
	}

	$scope.multipleEmptySpace = function (e) {

		console.log($(e.currentTarget).val().length)
		if ($.trim($(e.currentTarget).val()).length == 0) {
			$(e.currentTarget).val('');
		}
	}

	function frontRotate(frm, to, Id1, go) {
		$({
			deg : frm
		}).animate({
			deg : to
		}, {
			duration : 800,
			step : function (now, fx) {
				Id1.css({
					transform : "rotateY(" + now + "deg)",
					perspective : now,
					backfaceVisibility : "hidden"
				});

			},
			complete : function () {
				if (go != undefined) {
					$('#listViewPanelHeading_' + go).removeClass('flip').removeAttr('style');
					$('#collapse' + go).addClass('hideMe').removeClass('flip').removeAttr('style');
					$('#listViewPanelHeading_' + go).parent().animate({
						'height' : $('.outerCrcle').outerHeight() + $('#listViewPanelHeading_' + go).outerHeight() + 'px'
					}, {
						duration : 100,
						easing : "linear",
						complete : function () {
							$('#listViewPanelHeading_' + go).parent().removeAttr('style');
						}
					});
				}
			}
		});
	}

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







});