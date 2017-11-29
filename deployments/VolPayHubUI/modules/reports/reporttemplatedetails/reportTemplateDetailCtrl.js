VolpayApp.controller('reportTemplateDetailCtrl', function ($scope, $http, $location, $filter,GlobalService) {
       $scope.strData = [];
       console.log("c1")
       console.log(GlobalService.specificData)

       if(GlobalService.specificData.TEMPLATE)
       {
       GlobalService.specificData.TEMPLATE = $filter('hex2a')(GlobalService.specificData.TEMPLATE)
       }

       $scope.FXRate = GlobalService.specificData;

       $scope.fromAddNew = GlobalService.fromAddNew;

         $scope.ViewClicked = GlobalService.ViewClicked;


    $.each($scope.FXRate, function(k, v) {
        //display the key and value pair
        $scope.strData.push({'label':k,'value':v})

    });

    console.log("from",$scope.fromAddNew)
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
    $location.path('app/reporttemplate')
    }

    $scope.createData = function(newData)
    {

       newData = removeEmptyValueKeys(newData)

       //GlobalService.specificData.TEMPLATE = $filter('hex2a')(GlobalService.specificData.TEMPLATE)
        newData.TEMPLATE = stringToHex(newData.TEMPLATE).toUpperCase();

        $http.post(BASEURL+RESTCALL.ReportsTemplate,newData).success(function(data){
             GlobalService.Fxupdated = data.responseMessage;
              $location.path('app/reporttemplate')
        }).error(function(err)
        {
            $scope.alerts = [{
                        type : 'danger',
                        msg : err.error.message		//Set the message to the popup window
                    }];
        })

    }


function stringToHex(tmp) {
					var str = '',
					i = 0,
					tmp_len = tmp.length,
					c;

					for (; i < tmp_len; i += 1) {
						c = tmp.charCodeAt(i);
						str += d2h(c);
					}
					return str;
				}
function d2h(d) {
					return d.toString(16);
				}
				function h2d(h) {
					return parseInt(h, 16);
				}




    $scope.updateData = function(editedData)
    {

        editedData = removeEmptyValueKeys(editedData)
        restServer = RESTCALL.ReportsTemplate;
        //editedData.TEMPLATE = $filter()


		editedData.TEMPLATE = stringToHex(editedData.TEMPLATE).toUpperCase();

        					console.log(editedData)
        					//return str;


           $http.put(BASEURL+RESTCALL.ReportsTemplate,editedData).success(function(data){
               GlobalService.Fxupdated = data.responseMessage;
               $location.path('app/reporttemplate')

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
            $scope.delObj.OfficeID = $scope.FXRate['OfficeID'];
            $scope.delObj.ApplicableDate = $scope.FXRate['ApplicableDate'];
            $scope.delObj.SourceCurrency = $scope.FXRate['SourceCurrency'];
            $scope.delObj.TargetCurrency = $scope.FXRate['TargetCurrency'];

        $http.post(BASEURL+RESTCALL.ReportsTemplate+'delete',$scope.delObj).success(function(data){

               GlobalService.Fxupdated = "Deleted Successfully";
               $location.path('app/reporttemplate')

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

