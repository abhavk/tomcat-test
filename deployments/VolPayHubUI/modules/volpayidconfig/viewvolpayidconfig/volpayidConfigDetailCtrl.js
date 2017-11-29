VolpayApp.controller('volpayidConfigDetailCtrl', function ($scope, $http, $location, $stateParams, GlobalService) {


               if($stateParams.input)
               {
                   $scope.permission = {
                  		'C' : $stateParams.input["C"],
                  		'D'	: $stateParams.input["D"],
                  		'R'	: $stateParams.input["R"],
                  		'U'	: $stateParams.input["U"]
                  	}
               }

       $scope.strData = [];
       $scope.TaskDetails = GlobalService.specificData;

       $scope.fromAddNew = GlobalService.fromAddNew;
        $scope.ViewClicked = GlobalService.ViewClicked;

    console.log($scope.permission)

    $scope.viewTaskDetail = angular.copy($scope.TaskDetails);
    delete $scope.viewTaskDetail.IsParallel;


    $.each($scope.TaskDetails, function(k, v) {
        //display the key and value pair
        $scope.strData.push({'label':k,'value':v})

    });


     $scope.TaskDetailsCreate= {};
    $scope.gotoEdit = function()
    {

     $scope.ViewClicked = false;
    }
    $scope.gotoParent = function()
    {
    $location.path('app/volpayidconfig')
    }

    $scope.createData = function(newData)
    {

       //newData.IsParallel = false;
       newData = removeEmptyValueKeys(newData)

        $http.post(BASEURL+RESTCALL.volPayIdConfig,newData).success(function(data){
             GlobalService.Fxupdated = data.responseMessage;
              $location.path('app/volpayidconfig')
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
        restServer = RESTCALL.volPayIdConfig;

           $http.put(BASEURL+RESTCALL.volPayIdConfig,editedData).success(function(data){

               GlobalService.Fxupdated = data.responseMessage;
               $location.path('app/volpayidconfig')

           }).error(function(err)
           {
                $scope.alerts = [{
                                type : 'danger',
                                msg : err.error.message	//Set the message to the popup window
                            }];
           })
        //bankData.crudRequest("PUT", restServer,editedData).then(getData,errorFunc);
    }



    $scope.deleteData = function(da)
    {
            $scope.delObj = {};
            $scope.delObj.IDCode = $scope.TaskDetails['IDCode'];

           $http.post(BASEURL+RESTCALL.volPayIdConfig+'delete',$scope.delObj).success(function(data){

               GlobalService.Fxupdated = "Deleted Successfully";
               $location.path('app/volpayidconfig')

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
    			headHeight = $('.main-header').outerHeight(true)+10;
    		}
    		$scope.alertStyle=headHeight;
    	}

    		$scope.widthOnScroll();

    		$(window).scroll(function() {
    		$scope.widthOnScroll();
    		})



})