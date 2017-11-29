VolpayApp.controller('adduserCtrl', function ($scope, $http, $location, $state, $rootScope, LogoutService, GlobalService, $timeout) {


//alert(sessionStorage.showMoreFieldOnCreateUser)
//console.log(sessionStorage.showMoreFieldOnCreateUser)
//console.log(Boolean(sessionStorage.showMoreFieldOnCreateUser))

$scope.selectOptions = [];

$scope.timezoneOptions = [];


//$scope.showMoreFieldOnCreateUser = Boolean(sessionStorage.showMoreFieldOnCreateUser);
if((sessionStorage.showMoreFieldOnCreateUser == true) || (sessionStorage.showMoreFieldOnCreateUser == 'true'))
{
$scope.showMoreFieldOnCreateUser = true;
}
else
{
$scope.showMoreFieldOnCreateUser = false;
}

$scope.userCreated = GlobalService.userCreated;


        if($scope.userCreated)
        {
        console.log($rootScope.userCreateMsg)
          $scope.alerts = [{
                      type : 'success',
                      msg : $rootScope.userCreateMsg
                  }];
          GlobalService.userCreated = false;
        }



    $timeout(callAtTimeout, 4000);

    function callAtTimeout() {
    		$('.alert-success').hide();
    	}




//$scope.showMoreFieldOnCreateUser = false;


    if($scope.showMoreFieldOnCreateUser)
    {
           // var createObj = {}
           // createObj.UserId = sessionStorage.UserID;

            $http.get(BASEURL + RESTCALL.CreateRole).success(function (data, status) {

                    for (var i = 0; i < data.length; i++) {
                            $scope.selectOptions.push({
                                'label' : data[i].RoleName,
                                'value' : data[i].RoleID
                            })
                    }

                    sessionStorage.selectOptions = JSON.stringify($scope.selectOptions);

                  //  console.log($scope.selectOptions)

            }).error(function (data, status, headers, config) {
                    $scope.alerts = [{
                            type : 'danger',
                            msg : data.error.message
                        }];

                         $scope.alertStyle =  alertSize().headHeight;
                                      $scope.alertWidth = alertSize().alertWidth;
                   });



    }

       $http.get(BASEURL+RESTCALL.TimezoneOptions).success(function (data, status) {

                     for (var i = 0; i < data.TimeZone.length; i++) {
                                $scope.timezoneOptions.push({
                                   'value' : data.TimeZone[i].TimeZoneId
                                })

                        }
                  // console.log(data.TimeZone)

                }).error(function (data, status, headers, config) {
                     $scope.alerts = [{
                             type : 'danger',
                             msg : data.error.message
                         }];

                          $scope.alertStyle =  alertSize().headHeight;
                          $scope.alertWidth = alertSize().alertWidth;
                    });


     $scope.current1 = true;
     $scope.hello = 50;
	 
	 $scope.createData={};


     $scope.emailValidate = function()
     {

            if($("#AddUserMail").val() != "")
            {
                $scope.eFlag = emailValidation("#AddUserMail")
                if(!$scope.eFlag)
                {
                    
                   // $(window).scrollTop(20);
                    // setTimeout(function(){
                    //     callAtTimeout()
                    // },3000)
                     $scope.alertStyle =  alertSize().headHeight;
                     $scope.alertWidth = alertSize().alertWidth;
                     $("#AddUserMail").focus()
                    setTimeout(function()
                    {
                    $("#AddUserMail").val('')
                   $scope.alerts = [{
                                            type : 'danger',
                                            msg : "Please Enter Valid Email Address"
                                    }];
                    },200)
                    return false;
                    
                } 
                else{
                    $('.alert-danger').hide()
                }


                }
              
     } 
            

    $scope.continue1 = function (createData) {

        createData.RoleID = $('#RoleId').val()
        createData.Status = $('#enableFlag').val()
        createData.TimeZone = $('#timeZone').val()

        
           



        if($scope.showMoreFieldOnCreateUser)
        {
            for(i=0; i<$scope.selectOptions.length; i++){

                if($scope.selectOptions[i].value == createData.RoleID)
                {
                 $scope.RoleID = $scope.selectOptions[i].label;

                }

               /* if($scope.selectOptions[i].value == createData['ROLE_ID']){

                    console.log($scope.selectOptions[i])
                   // $scope.userData.ROLE_ID = $scope.selectOptions[i].label

                }*/

            }
        }

        if(createData.Password == $scope.ConfirmPW)
        {
        $(".alert-danger").alert("close");

        $scope.userData = createData;
        $scope.page = 2;
        $scope.current1 = false;
        $scope.current2 = true;
         $scope.hello = 100;
        $('.tab-pane').removeClass("active");
        $('#tab2').addClass("active");
        $('.tab_li').removeClass("active");
        $('#li_1').addClass("done");
        $('#li_2').addClass("active");
        }
        else
        {
             $scope.alerts = [{
                            type : 'danger',
                            msg : "Password and confirm does not match."
                        }];
             $scope.alertStyle =  alertSize().headHeight;
              $scope.alertWidth = alertSize().alertWidth;

        }
    }



    $scope.ConfirmCreateUser = function(){



       /*var createUserObj = {};
       createUserObj.UserId = sessionStorage.createUserLoginName;
       createUserObj.Data = btoa(JSON.stringify($scope.userData))*/

        $scope.userData.RoleID = "Super Admin";
        //$scope.userData.CRT_USER_ID = sessionStorage.createUserLoginName;
        //$scope.userData.CRT_TS = new Date().toISOString();
        $scope.userData.IsForceReset = true;
        $scope.userData.Status = 'ACTIVE';


        console.log($scope.userData)
  $http.post(BASEURL + RESTCALL.CreateNewUser, $scope.userData).success(function (response) {

            GlobalService.userCreated = true;

             	LogoutService.Logout();

            /*if(configData.Authorization=='External'){
				window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
			}
			else{
				LogoutService.Logout();
			}*/
        }).error(function (data, status, headers, config) {
          //  console.log("1",data,status)
        $scope.alerts = [{
                type : 'danger',
                msg : data.error.message
            }];
        });


    }



    $scope.ConfirmCreateUserbySuperAdmin = function(){



        //$scope.userData.CRT_USER_ID = sessionStorage.createUserLoginName;
        //$scope.userData.CRT_TS = new Date().toISOString();
        $scope.userData.IsForceReset = Boolean($scope.userData.IsForceReset);
        $scope.userData.Status = $scope.userData.Status;

       // $scope.userData = removeEmptyValueKeys($scope.userData)



       /* var createUserObj = {};
        createUserObj.UserId = sessionStorage.createUserLoginName;
        createUserObj.Data = btoa(JSON.stringify($scope.userData))*/   

       
        $http.post(BASEURL + RESTCALL.CreateNewUser, $scope.userData ).success(function (data, status, headers, config) {

            GlobalService.userCreated = true;
             $rootScope.userCreateMsg = data.responseMessage
            $state.reload();

 
        }).error(function (data, status, headers, config) {

            //console.log("2",data,status)
                  $scope.alerts = [{
                          type : 'danger',
                          msg : data.error.message
                      }];

                $scope.alertStyle =  alertSize().headHeight;
                 $scope.alertWidth = alertSize().alertWidth;
                  });

    }


    $scope.back2to1 = function () {


        $('.alert-danger').alert('close');

        $scope.hello = 50;
        $scope.current1 = true;
        $scope.current2 = false;
        $('.tab-pane').removeClass("active");
        $('#tab1').addClass("active");

        $('.tab_li').removeClass("done active");
        $('#li_1').addClass("active");
        $scope.page = 1;


        $('#tab1').addClass('slideInLeft')

       }



	$scope.multipleEmptySpace = function (e) {
        if($.trim($(e.currentTarget).val()).length == 0)
	    {
	    $(e.currentTarget).val('');
	    }
    }
	
	
	
	$scope.validatePassWord = function(val, e)
	{

		if(val)
		{

          /*  var PWObj = {};
            PWObj.UserId = sessionStorage.UserID;
            PWObj.Data = btoa(JSON.stringify({'UserId':sessionStorage.UserID,'Password':val}))*/

            $http.post(BASEURL + RESTCALL.ValidatePW, {'UserId':sessionStorage.UserID,'Password':val} ).success(function (data, status, headers, config) {

            $('.alert-danger').alert('close');

            }).error(function (data, status, headers, config) {

                $scope.alerts = [{
                      type : 'danger',
                      msg : data.error.message
                  }];

             $(e.currentTarget).val('');
             $scope.alertStyle =  alertSize().headHeight;
             $scope.alertWidth = alertSize().alertWidth;
              });

        }
        else
        {
        $('.alert-danger').alert('close');
        }
		
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


        
	$scope.select2Arr = ["RoleID","IsForceReset","Status","TimeZone"]
	$(document).ready(function(){

		for(var i in $scope.select2Arr)
		{
			$("select[name="+$scope.select2Arr[i]+"]").select2()
		}
	})

        $(window).resize(function(){

        		$scope.$apply(function () {
                    $scope.alertWidth = $('.tab-content').width();

        		});

        	});

});