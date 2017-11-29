VolpayApp.controller('reportParamsDetailCtrl', function ($scope, $http, $location, $filter, GlobalService) {

       $scope.strData = [];
       $scope.FXRate = GlobalService.specificData;

       $scope.fromAddNew = GlobalService.fromAddNew;



       $scope.ViewClicked = GlobalService.ViewClicked;


    $.each($scope.FXRate, function(k, v) {
        //display the key and value pair
        $scope.strData.push({'label':k,'value':v})

    });

    $scope.FXRateCreate= {};

    $scope.gotoEdit = function()
    {
     $scope.ViewClicked = false;
    }
    $scope.gotoParent = function()
    {
    $location.path('app/reportparams')
    }

    $scope.createData = function(newData)
    {
            console.log(newData)
           newData = removeEmptyValueKeys(newData)
           newData.PARAMVALUE = $filter('stringToHex')(newData.PARAMVALUE)

            $http.post(BASEURL+RESTCALL.ReportParams,newData).success(function(data){
                 GlobalService.Fxupdated = data.responseMessage;
                  $location.path('app/reportparams')
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
        restServer = RESTCALL.ReportParams;

        console.log(editedData)
        editedData.PARAMVALUE = $filter('stringToHex')(editedData.PARAMVALUE)

           $http.put(BASEURL+RESTCALL.ReportParams,editedData).success(function(data){

               GlobalService.Fxupdated = data.responseMessage;
               $location.path('app/reportparams')

           }).error(function(err)
           {
                //console.log(err,err.error.message)
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
        $scope.delObj.REPORTID = $scope.FXRate["REPORTID"];
        $scope.delObj.OFFICEID = $scope.FXRate["OFFICEID"];
        $scope.delObj.BRANCHID = $scope.FXRate["BRANCHID"];
        $scope.delObj.PARAMKEY = $scope.FXRate["PARAMKEY"];


        $http.post(BASEURL+RESTCALL.ReportParams+'delete',$scope.delObj).success(function(data){

               GlobalService.Fxupdated = "Deleted Successfully";
               $location.path('app/reportparams')

           }).error(function(err)
           {
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.error.message		//Set the message to the popup window
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
    			headHeight = $('main-header').outerHeight(true)+10;
    		}
    		$scope.alertStyle=headHeight;
    	}

    		$scope.widthOnScroll();

    		$(window).scroll(function() {
    		$scope.widthOnScroll();
    		})


})

