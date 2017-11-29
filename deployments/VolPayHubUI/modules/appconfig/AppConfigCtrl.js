VolpayApp.controller('AppConfigCtrl', function ($scope, $state, $timeout, $http, bankData, GlobalService,LogoutService) {

  

    	$scope.permission = {
        		'C' : false,
        		'D'	: false,
        		'R'	: false,
        		'U'	: false
        	}

        	$http.post(BASEURL+RESTCALL.ResourcePermission,{
        		"RoleId": sessionStorage.ROLE_ID,
        		"ResourceName": "Application Config"
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
                             "label":"Name",
                             "FieldName":"Name",
                             "visible":true
                         },{
                             "label":"Value",
                             "FieldName":"Value",
                             "visible":true
                         },{
                             "label":"Type",
                             "FieldName":"Type",
                             "visible":true
                         }]


	var restServer = RESTCALL.AppConfig + 'readall';
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


    $scope.deletedFlag = false;
    /*** Sorting ***/
    $scope.orderByField = 'Name';
    $scope.AppcofigSortReverse  = false;
    $scope.AppcofigSortType = 'Asc';

    //I Load the initial set of data onload

	var len = 20;
    $scope.initData = function()
    {
         $(".listView").scrollTop(0);
       /* $scope.AppConfigData ={};
        $scope.AppConfigData.start=0;
        $scope.AppConfigData.count=20;*/

			$scope.loadMorecalled = false;

        $scope.AppConfigData ={
                          "start": 0,
                          "count": 20,
                          "Queryfield":[],
                          "QueryOrder": []
                        }
			
			len = 20;

			$scope.dupBankData = angular.copy($scope.AppConfigData)	
			$scope.AppConfigData = constructQuery($scope.AppConfigData);		
			$scope.CRUD = "";
        bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData,errorFunc);
    }

    $scope.initData()
	//I Load More data on scroll


	$scope.loadMore = function(){

	//console.log("aa",len)

        $scope.loadMorecalled = true;

        //$scope.AppConfigData.IsReadAllRecord = true;
     //   $scope.AppConfigData.QueryOrder = [{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.AppcofigSortType}];
        $scope.AppConfigData.start=len;
        $scope.AppConfigData.count=20;


		//$scope.AppConfigData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : len, 'count' : 20, "QueryOrder":[{"ColumnName":$scope.orderByField,"ColumnOrder":$scope.AppcofigSortType}]}))
		bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData,errorFunc);
		len = len + 20;
	}
	
	// I process the Create Data Request.
	$scope.createData = function(newData) {
		//$scope.AppConfigData.Data = btoa(JSON.stringify(newData))
        newData = removeEmptyValueKeys(newData)
		$scope.AppConfigData = newData;

		restServer = RESTCALL.AppConfig;

		$scope.deletedFlag = false;

		bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(getData,errorFunc);
		//$scope.CRUD = "Created Successfully";
		$scope.newData = "";		// Reset the form once values have been consumed.
	};


	$scope.resetAddNewFields = function()
    {
    $scope.newData = {}
    }

    $scope.newRecordAdd = function()
    {
    $scope.creatingWindow = !$scope.creatingWindow;
    $scope.submitted = false;
    }


	// I update the given data to the Restserver.
	$scope.updateData = function(editedData) {
		delete editedData.$$hashKey;
		$scope.loadMorecalled = false;
		$scope.deletedFlag = false;
		editedData = removeEmptyValueKeys(editedData);

        $scope.sessionTimeoutName = editedData.Name;

        console.log($scope.sessionTimeoutName)

        restServer = RESTCALL.AppConfig;
		bankData.crudRequest("PUT", restServer, editedData).then(getData,errorFunc);
		
		//$scope.CRUD = "Updated Successfully";
		//uiConfiguration();

    //frontRotate(180,0,$('#listViewPanelHeading_'+x));
    //frontRotate(0,180,$('#collapse'+x),x);
     $timeout(function(){
    			//$scope.restVal[$scope.indexx] = $scope.backUp
    			$scope.indexx = undefined;
    			$scope.ctId = undefined;
    			$scope.came = undefined;
    			$scope.prev = undefined;
    		},800)



	};
	



	// I delete the given data from the Restserver.
	$scope.deleteData = function() {
		delete delData.$$hashKey
		/*$scope.AppConfigData.Data = btoa(JSON.stringify({
		  "Records" : [{
							"ColumnName" : "Name",
							"ColumnValue" : delData.Name
						}]
		  
		}))*/

		$scope.loadMorecalled = false;
        restServer = RESTCALL.AppConfig+'delete';
		bankData.crudRequest("POST", restServer, {"Name":delData.Name}).then(getData,errorFunc);
		$('.modal').modal("hide");
        $scope.deletedFlag = true;
	//	$scope.CRUD = "Deleted Successfully";

		

	};
		
	// I load the rest data from the server.
	function getData(response) {


		console.log(response)

$scope.CRUD = response.data.responseMessage;

       /* if(!$scope.deletedFlag)
        {
            $scope.CRUD = response.data.responseMessage;
        }
		else{
			if(response.status == 204)
			{
				$scope.CRUD = "Deleted Successfully";
			}
			else{
				$scope.CRUD = response.data.responseMessage;
			}
		}*/

        $scope.loadMorecalled = false;

        $scope.AppConfigData={}
        
		$scope.AppConfigData.start=0;
        $scope.AppConfigData.count=20;

        len = 20;

		//$scope.AppConfigData.Data = btoa(JSON.stringify({'UserId' : sessionStorage.UserID, 'start' : 0, 'count' : 20}));

		restServer = RESTCALL.AppConfig+'readall';
		bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData,errorFunc);

		
	}
		 	
	// I apply the rest data to the local scope.	
	function applyRestData(restDat) {
        var restData = restDat.data;
		//console.log(restData)
		$scope.restData = restData;
		//console.log($scope.restData.length)
		$scope.totalForCountbar = restDat.headers().totalcount;
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

				console.log("abc",$scope.CRUD)
				if($scope.CRUD != "")
				{	
					$scope.alerts = [{
						type : 'success',
						msg : $scope.CRUD		//Set the message to the popup window
					}];
					$timeout(callAtTimeout, 4000);
				}
		}

		        if(($scope.sessionTimeoutName == 'SESSIONTIMEOUT') || ($scope.sessionTimeoutName == 'FILESIZERESTRICTION'))
				{
				uiConfiguration();
				}


		//$scope.feedMore = bankData.loadMoredata(restData.length)
		
	}
	
	// I apply the Error Message to the Popup Window.
	function errorFunc(errorMessag){
         //console.log(errorMessag.status)
		 var errorMessage = errorMessag.data;
		  // console.log(errorMessage.error.message)

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
	}
	
	function callAtTimeout() {
		$('.alert').hide();
	}


//  $timeout(function()
//  {
//      if($scope.AppConfigData.QueryOrder.length){
//          for(k in $scope.AppConfigData.QueryOrder){
//              if($scope.AppConfigData.QueryOrder[k].ColumnOrder == 'Asc'){
//                 $('#'+$scope.AppConfigData.QueryOrder[k].ColumnName+'_Icon').attr('class','fa fa-caret-up')

//              }
//              else{
//                   $('#'+$scope.AppConfigData.QueryOrder[k].ColumnName+'_Icon').attr('class','fa fa-caret-down')
//              }
//          }
//      }
//  },100)

$scope.gotoSorting = function(dat){

            // $scope.AppConfigData.start = 0;
            // $scope.AppConfigData.count = len;

			$scope.dupBankData.start = 0;
			$scope.dupBankData.count = len;

			$scope.loadMorecalled = false;

    var orderFlag = true;
    if($scope.dupBankData.QueryOrder.length){
        for(k in $scope.dupBankData.QueryOrder){
            if($scope.dupBankData.QueryOrder[k].ColumnName == dat.FieldName){
                if($scope.dupBankData.QueryOrder[k].ColumnOrder == 'Asc'){
                    $('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-desc')
                    $('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-down')
                    $scope.dupBankData.QueryOrder[k].ColumnOrder = 'Desc'
                    orderFlag = false;
                    break;
                }
                else{
                    $scope.dupBankData.QueryOrder.splice(k,1);
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
            $scope.dupBankData.QueryOrder.push({
                            "ColumnName": dat.FieldName,
                            "ColumnOrder": 'Asc'
            })

        }
    }
    else{
        $('#'+dat.FieldName+'_icon').attr('class','fa fa-sort-alpha-asc')
        $('#'+dat.FieldName+'_Icon').attr('class','fa fa-caret-up')
        $scope.dupBankData.QueryOrder.push({
                          "ColumnName": dat.FieldName,
                          "ColumnOrder": 'Asc'
                        })
       
    }


    	$scope.AppConfigData = constructQuery($scope.dupBankData);
     bankData.crudRequest("POST", restServer, $scope.AppConfigData).then(applyRestData,errorFunc);
}




    $scope.Sorting = function(orderByField)
    {
        $scope.CRUD = "";
        $scope.loadMorecalled = false;
        $scope.orderByField = orderByField;

        if($scope.AppcofigSortReverse == false)
        {
           $scope.AppcofigSortType = 'Desc';
           $scope.AppcofigSortReverse = true;
        }
        else
        {
            $scope.AppcofigSortType = 'Asc';
            $scope.AppcofigSortReverse = false;
        }

        var QueryOrder={};
        QueryOrder.ColumnName = orderByField;
        QueryOrder.ColumnOrder = $scope.AppcofigSortType;
            len = 20;
        var sortObj = {};
        //sortObj.IsReadAllRecord = true;
        sortObj.QueryOrder = [QueryOrder];
        sortObj.start = 0;
        sortObj.count = 20;

        bankData.crudRequest("POST", restServer, sortObj).then(applyRestData,errorFunc);
    }


		var debounceHandler = _.debounce($scope.loadMore, 700, true);
	/*** To control Load more data ***/

	jQuery(
            function($)
                {
                    $('.listView').bind('scroll', function()
                    {
                        //$scope.widthOnScroll();
                        if(Math.round($(this).scrollTop() + $(this).innerHeight())>=$(this)[0].scrollHeight)
                        {
                            if($scope.restData.length >= 20){
								debounceHandler()
                               // $scope.loadMore();
                            }
                        }
                    })
                    setTimeout(function(){},1000)
                }
        );

	/*$(window).scroll(function() {

		if(($(window).scrollTop() + $(window).height()) >= ($(document).height()-2)) {

                //console.log($scope.restData.length)
		    if($scope.restData.length >= 20){
    		   //console.log($scope.restData.length)
    			   $scope.loadMore();
    		   }
    	   }
		});*/
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

    	/*$scope.viewType = function (value, eve) {
			
    		var hitId = eve.currentTarget.id;
    		$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
    		$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');

    		if (value == "list") {
    			$scope.changeViewFlag = !$scope.changeViewFlag;					
				if(($scope.indexx != undefined)&&($scope.indexx != $scope.ctId)){
					$scope.ctId = $scope.indexx;
					$timeout(function(){
						$scope.flip($scope.indexx)
					},100)
				}
    		} else if (value == "grid") {
    			$scope.changeViewFlag = !$scope.changeViewFlag;	
				if(($scope.indexx != undefined)&&($scope.indexx != $scope.ctId)){
					$scope.ctId = $scope.indexx;
					$timeout(function(){
						$scope.slideDown($scope.indexx)
					},100)
				}
    		} else {
    			$scope.changeViewFlag = !$scope.changeViewFlag;
    		}

    		GlobalService.viewFlag = $scope.changeViewFlag;
    	}*/

    /** List and Grid view Ends**/


    /*** Print function ***/

    $scope.printFn = function()
    {
    $('[data-toggle="tooltip"]').tooltip('hide');
    window.print()

    }



	$scope.exportToExcel = function(){
		var tabledata = angular.element( document.querySelector('#DummyExportContent') );
		var table_html = $(tabledata).html();
		bankData.exportToExcelHtml(table_html, 'ApplicationConfig')
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
					if($('.flip')[0]){	
						$('#'+($($('.flip')[0]).attr('id'))).parent().css({'height':$('.outerCrcle').outerHeight() + $('#collapse'+($($('.flip')[0]).attr('id')).split("_")[1]).outerHeight() +'px','width':$('#'+($($('.flip')[0]).attr('id'))).parent().parent().width()+'px'});
					}
    			});

    		});
			
			/*** On click resize ***/
			$( window ).click(function() {
				if((sessionStorage.sidebarToggleClosed != undefined)&&($('.flip')[0] != undefined)){					
					$('#'+($($('.flip')[0]).attr('id'))).parent().css({'width':$('#'+($($('.flip')[0]).attr('id'))).parent().parent().width()+'px'});
				}
			});		
	$scope.takeBackup = function(val,Id,v){

        if($scope.changeViewFlag)
        {
	    $scope.flip(Id);
        }
        else if(!$scope.changeViewFlag)
        {
        $scope.slideDown(Id)
        }

		$scope.viewMe = v;
		$scope.backUp = angular.copy(val);
		$scope.indexx = angular.copy(Id);
		$scope.takeDeldata(val,Id);
	}
	$scope.changeviewMe = function(v){
		$scope.viewMe = v;
	}
	
	$scope.takeDeldata = function(val,Id){
		delData = val;
		$scope.delIndex = Id;
	}
	
	$scope.slideUp = function(Id){
		$('#editingWindow_'+Id).collapse('hide');
		$('.editHere').removeClass('trHilght');
		$('#displayingWindow_'+Id).collapse('show');
		$('#editingWindow_'+Id).on('hidden.bs.collapse', function(){
			$scope.restVal[$scope.indexx] = $scope.backUp;
			$scope.indexx = undefined;
			$scope.ctId = undefined;
			$scope.came = undefined;
			$scope.prev = undefined;
		});
		
	}	

	$scope.slideDown = function(Id){
		
		if(($scope.prev != undefined)&&($scope.prev != Id))
		{
			$('#collapse'+$scope.prev).collapse('hide');
		}

		$scope.prev = Id;
		$('#displayingWindow_'+Id).collapse('hide');
		$('.displayWindow').collapse('show');
		$('.editWindow').collapse('hide');
		$('#editingWindow_'+Id).collapse('show');
		$('.editHere').removeClass('trHilght');
		$('#editHere_'+Id).addClass('trHilght');		
	}

	$scope.flip = function(x) {
		if(($scope.came != undefined)&&($scope.came != x)){	
			frontRotate(180,0,$('#listViewPanelHeading_'+$scope.came));
			frontRotate(0,180,$('#collapse'+$scope.came),$scope.came);
		}
		
		$('#listViewPanelHeading_'+x).parent().css({'width':$('#listViewPanelHeading_'+x).parent().outerWidth()+'px','position':'relative'});
		$('#listViewPanelHeading_'+x).parent().animate({'height':$('.outerCrcle').outerHeight() + $('#collapse'+x).outerHeight() +'px'},{
					duration: 100,
					easing: "linear",      
				});
		$('#listViewPanelHeading_'+x).addClass('flip');
		$('#collapse'+x).removeClass('hideMe').addClass('flip');
		
		frontRotate(0,180,$('#listViewPanelHeading_'+x));
		frontRotate(180,0,$('#collapse'+x));
		$scope.came = x;
	}
	
	$scope.flipReverse = function(x){

		frontRotate(180,0,$('#listViewPanelHeading_'+x));
		frontRotate(0,180,$('#collapse'+x),x);

		$('#editingWindow_'+x).collapse('hide');
		$('.editHere').removeClass('trHilght');
		$('#displayingWindow_'+x).collapse('show');
		$timeout(function(){
			$scope.restVal[$scope.indexx] = $scope.backUp
			$scope.indexx = undefined;
			$scope.ctId = undefined;
			$scope.came = undefined;
			$scope.prev = undefined;
		},800)
	}	

	$scope.multipleEmptySpace = function (e) {
            if($.trim($(e.currentTarget).val()).length == 0)
    	    {$(e.currentTarget).val('');
    	    }
        }
	
function frontRotate(frm,to,Id1,go){
    $({deg: frm}).animate({deg: to}, {
        duration: 800,
        step: function(now,fx){
            Id1.css({
                 transform: "rotateY(" + now + "deg)",
				 perspective: now,
                 backfaceVisibility: "hidden"
            });
           
        },
      complete:function(){
			if(go != undefined){				
				$('#listViewPanelHeading_'+go).removeClass('flip').removeAttr('style');
				$('#collapse'+go).addClass('hideMe').removeClass('flip').removeAttr('style');
				$('#listViewPanelHeading_'+go).parent().animate({'height':$('.outerCrcle').outerHeight() + $('#listViewPanelHeading_'+go).outerHeight() +'px'}, {
								duration: 100,
								easing: "linear",
								complete: function() {
									$('#listViewPanelHeading_'+go).parent().removeAttr('style');
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
			
			
			
		})
		$(window).trigger('resize');  

	})





});