VolpayApp.controller('forgotpasswordCtrl', function ($scope, $http, $state, $timeout, $location, GlobalService) {

    $('html').css({"background":"transparent"})

    $scope.fgpassword,$scope.resp = "";
	$scope.$on('$viewContentLoaded', function(){

		$timeout(function(){
            $('.main-sidebar').css({'display':'none'});
	        $('.notiIcons').css('display','none');
    		$('.content-wrapper').css({'margin-left':'0px'});
    		//$('#homeBreadCrumb').css({'pointer-events':'none'});
		}, 200);
	});
	//alert('3');
	$scope.forgotPassword = function(val){

	// $('[data-toggle="popover"]').popover();
		console.log(val)
		$scope.backupData = angular.copy(val);
		if($scope.resp == ""){
			$scope.URL = BASEURL + RESTCALL.ForgotPassword;
		}
		else if($scope.resp == 1){
			$scope.URL = BASEURL + RESTCALL.ForgotPwdOTP;
			delete $scope.backupData.EmailId;
		}
		else if($scope.resp == 2){

			if($scope.backupData.ConfirmPassword == $scope.backupData.Password){
				$scope.URL = BASEURL + RESTCALL.ForgotPwdReset;
				delete $scope.backupData.EmailId;
				delete $scope.backupData.ConfirmPassword;
			}
			else{
				$scope.showMsg('danger', "New password and confirm password does not match.");
				$('input[name="Password"]').focus();
				return false;
			}
		}
		$scope.RestCallFn();
	}
	
	$scope.RestCallFn = function(){
			
		/*$scope.objFgtPwd = {
			"UserId" : $scope.backupData.UserId,
			"Data": btoa(JSON.stringify($scope.backupData))
		}*/

		$scope.objFgtPwd = JSON.stringify($scope.backupData);

		console.log($scope.objFgtPwd,$scope.backupData)


		$http.post($scope.URL, $scope.objFgtPwd).success(function (data, status, header, config) {
			$scope.resp = Number($scope.resp) + 1;

             $timeout(function(){
             $('[data-toggle="popover"]').popover();

             },200)
			$scope.showMsg('success', data.responseMessage);
			if($scope.resp > 2){

			    GlobalService.passwordChanged = true;
				GlobalService.responseMessage = data.responseMessage;
				window.location.href="#/login";
			}
		}).error(function (data, status, header, config) {
			$scope.showMsg('danger', data.error.message);
		}); 
					
	}
	
	$scope.showMsg = function(x, y){
		$scope.alerts = [{
					type : x,
					msg : y
				}];
			/*$timeout(function(){
				$('.alert').hide();
			}, 4000);*/
		return $scope.alerts
	}	

	$scope.pwCancel = function(){
		$('.top-menu').css('display','block')
		GlobalService.logoutMessage = false;
		$location.path("login");
	}


		$scope.multipleEmptySpace = function (e) {


                if($.trim($(e.currentTarget).val()).length == 0)
        	    {
        	    $(e.currentTarget).val('')
        	    }
            }

        $scope.validatePW = function(pw,userid,e)
        {
            if(pw)
            {
                 $http.post(BASEURL + RESTCALL.ValidatePW, {'UserId':userid,'Password':pw}).success(function (data) {

                        console.log(data)
                 }).error(function(data)
                 {
						
                    $scope.showMsg('danger', data.error.message);
                     $(e.currentTarget).val('');

                 })
            }
        }

        $scope.popupClick = function()
        {
             $('[data-toggle="popover"]').popover();
              console.log("clicked")
        }




	
});