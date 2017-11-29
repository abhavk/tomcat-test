VolpayApp.controller('addrolesCtrl', function ($scope, $rootScope, $http, $location, $state, $timeout, GlobalService) {

        $scope.roleAdded = GlobalService.roleAdded;
		
		
        /*if($scope.roleAdded)
        {
            $scope.alerts = [{
                    type : 'success',
                    msg : "Role added successfully"
                    }];
            $scope.alertStyle =  alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;
            $timeout(callAtTimeout, 4000);
            GlobalService.roleAdded = false;

        }*/

        function callAtTimeout() {
            $('.alert-success').hide();
        }


   // $scope.role.Status=;

    $scope.addroles = function(role){
        //role.CRT_USER_ID = sessionStorage.createUserLoginName;
        //role.CRT_TS =  new Date().toISOString();

      //  role.SUPER_ADMIN_FL = $('#superAdminFlag').val();
        role.IsSuperAdmin = true;
        console.log(role)
        //role.Status = $('#enableFlag').val()


         $http.post(BASEURL + RESTCALL.CreateRole, role).success(function (data, status) {

                GlobalService.roleAdded = true;
                $rootScope.roleAddedMesg = data;

                $location.path('app/roles')

           //$state.reload()

        }).error(function(data,status){

            GlobalService.roleAdded = false;
            $scope.roleAdded = false;

             $scope.alerts = [{
                           type : 'danger',
                           msg : data.error.message
                       }];



            $scope.alertStyle =  alertSize().headHeight;
            $scope.alertWidth = alertSize().alertWidth;

           })

    }


    $scope.GoBackFromRole = function()
    {
        $location.path('app/roles')
    }

    $scope.multipleEmptySpace = function (e) {
            if($.trim($(e.currentTarget).val()).length == 0)
    	    {
    	    $(e.currentTarget).val('');
    	    }
        }

        /*** To control Load more data ***/
        	$(window).scroll(function() {
        		$scope.widthOnScroll();
        		});

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



     $(window).resize(function(){

            		$scope.$apply(function () {
                        $scope.alertWidth = $('.tab-content').width();

            		});

            	});

})