VolpayApp.controller('myprofileCtrl', function ($scope, $http, $location, $translate, $state, $timeout, $filter, $interval, GlobalService, AllPaymentsGlobalData, LogoutService,DashboardService, $rootScope) {

  
    /* $timeout(function()
        {sidebarMenuControl('Home','MyProfile');
    },500)*/
    sidebarMenuControl('Home','MyProfile');
    $scope.callOnTimeOut = function()
    {
        $('.alert').hide();
    }


     $http.get(BASEURL + RESTCALL.CreateRole).success(function (data, status) {
						
                /*for (var i = 0; i < data.length; i++) {
                        $scope.selectOptions.push({
                            'label' : data[i].RoleName,
                            'value' : data[i].RoleID
                        })
                }*/

                $scope.selectOptions = data;

                sessionStorage.selectOptions = JSON.stringify($scope.selectOptions);
        })


    //$scope.profileSetup = !Boolean(sessionStorage.ForceResetFlag)
     if((sessionStorage.pwRest == false)||(sessionStorage.pwRest =='false'))
    {
        $scope.profileSetup = false;
    }
    else{

        $scope.profileSetup = true;
    }

    if ((document.cookie) && (configData.Authorization == "External")) {
		$scope.profileSetup = false;
	}
    
    
    //console.log($scope.profileSetup)
    setTimeout(function(){
        if($scope.profileSetup==true){
         $('.fixedfooter').css('margin-left', '0');
         $('.footertext1').css('left','0');
         }
    },50)
        




    // if((sessionStorage.ForceResetFlag == 'true') || (sessionStorage.ForceResetFlag == true))
    // {
    // $scope.profileSetup = true;    
    // }
    // else
    // {
    //     $scope.profileSetup = false;    
    // }
    //alert( $scope.profileSetup)
   
    //$scope.profileSetup = Boolean(sessionStorage.IsProfileSetup);
    //console.log($scope.profileSetup )

     //console.log("forceReset",sessionStorage.pwRest)

   $scope.setting={
        'selectedrefreshField':[],
        'refreshTime':120
    };

    $scope.refreshFields = [];
    $scope.sidebarVal =  GlobalService.sidebarVal;

    for(k in $scope.sidebarVal){
        for(i in $scope.sidebarVal[k].subMenu){
            $scope.refreshFields.push({
                'actualvalue' : $scope.sidebarVal[k].subMenu[i].Link,
                'displayvalue' : $scope.sidebarVal[k].subMenu[i].Name
            })
        }
    }

    $scope.viewProfile = true;

	//var profileObj = {};
	//profileObj.UserId = sessionStorage.UserID;
	$scope.dbSettingFlag =false;
	$scope.settingsChanged =false;

	$scope.accessToken = true;

   // $timeout(function(){
   // $('.loaderStyle').css({'visibility':'visible','position':'absolute','left':($(window).width()/2)+'px','top':$(window).height()/2+'px'})
   // },100)







    $scope.initialCall = function()
    {
          
       $scope.Restloaded = false;
       if((($scope.flag == $state.current.name.split('.')[1])||($scope.accessToken)))
       {
           
            $http.get(BASEURL + RESTCALL.UserProfile).success(function (data, status, header, config) {
                $scope.cData = data;
               
               

                $scope.backupData = angular.copy(data)
                $scope.profileName = $scope.cData.FirstName;
                $timeout(function(){
                    $scope.Restloaded = true;
               },300)
            }).error(function (data, status, header, config) 
			{
                $scope.alerts = [{
                            type : 'danger',
                            msg : data.error.message
                        }];
						
				$timeout(function(){
                $scope.Restloaded = true;
               },300)		
						
						
            });
        }
        else{
           
           clearInterval($scope.interval);
        }
    }
    $scope.initialCall()

    $scope.autoRefresh = false;

    $scope.refreshFn = function()
    {
        if($scope.viewProfile)
        {
            clearInterval($scope.interval);

           var cal = sessionStorage.refreshData ? JSON.parse(sessionStorage.refreshData) : '';
           if(cal){

				$timeout(function(){
                $('#autorefreshFields').select2('val',cal.selectedrefreshField)
                },200)


                //console.log(cal.autoRefresh, typeof(cal.autoRefresh))
                if(cal.autoRefresh)
                {$('#toggle-event').bootstrapToggle('on')
                $scope.autoRefresh = true;
                }else
                {$('#toggle-event').bootstrapToggle('off')
                $scope.autoRefresh = false;
                    $scope.setting={
                        'selectedrefreshField':[],
                        'refreshTime':120
                        };
                }



                $scope.setting.refreshTime = cal.refreshTime;
                for(i in cal.selectedrefreshField){
                    if($state.current.name.split('.')[1] == cal.selectedrefreshField[i]){
						$scope.accessToken = false;
                        $scope.interval = setInterval($scope.initialCall, Number(cal.refreshTime)*1000);
                        $scope.flag = cal.selectedrefreshField[i];
                    }

                }
            }
        }
        else
        {
            clearInterval($scope.interval);
            $('#toggle-event').bootstrapToggle('off')
            $timeout(function(){
            $('#autorefreshFields').select2('val','')
            },200)

            $scope.autoRefresh = false;
            $scope.setting={
                'selectedrefreshField':[],
                'refreshTime':120
                };
        }
    }
   // $scope.refreshFn()

    $scope.resetProfileData = function(){
       // $scope.cData = angular.copy($scope.backupData);
       $("#EmailAddress").removeAttr("style")
       $scope.initialCall()
       //$scope.timeZone()
    }

    $scope.timezoneOptions = [];

	function callAtTimeout() {
    		$('.alert-success,.alert-danger').hide();
    }
      
           
    $scope.ProfileUpdate = function(data)
	{

            

        $scope.eFlag = emailValidation("#EmailAddress");
        if(!$scope.eFlag)
        {
            $scope.alerts = [{
									type : 'danger',
									msg : "Please Enter Valid Email Address"
							}];
                            $scope.alertStyle =  alertSize().headHeight;
                $scope.alertWidth = alertSize().alertWidth;
            $(window).scrollTop(20);
            setTimeout(function(){
                callAtTimeout()
            },3000)
            return false;
            
        }
         else{
                    $('.alert-danger').hide()
                }   
        data.IsForceReset = false;
        data.Status = 'ACTIVE';
        var copyData = angular.copy(data)

        var ProfUbdateObj={};
		ProfUbdateObj.UserId = sessionStorage.UserID;
		ProfUbdateObj.Data = btoa(JSON.stringify(copyData))



		$http.put(BASEURL + RESTCALL.CreateNewUser, copyData).success(function (data, status, header, config) {

               
                /*$scope.alerts = [{
                    type : 'success',
                    msg : data.responseMessage
                }]*/
                
                $rootScope.profileUpdated = data.responseMessage;
                $scope.viewProfile = true;

                LogoutService.Logout();

              

                /* setTimeout(function(){
                        callAtTimeout()
                    },3000)*/



			

		}).
		error(function (data, status, header, config) {

                     $scope.alerts1 = [{
                                        type : 'danger',
                                        msg : data.error.message
                                    }]
		});

	}


    $scope.value= 'en_US';
    $scope.flagTrue = true;

     $scope.themeSelect = function(color){
        $('#themeColor').attr("href",'themes/styles/' + color + ".css");
        $scope.selectedColor = color;
        $scope.ssColor = color;
    }



    $scope.retainSavedResults = function()
    {
        
     

         $scope.FListSavedSearchNotExist = true;
         $scope.AllPaymentsSavedSearchNotExist = true;
			
			$scope.aa = {
					"Queryfield":[
						{
						  "ColumnName": "UserID",
						  "ColumnOperation": "=",
						  "ColumnValue": sessionStorage.UserID
						}
					],
                    "Operator":"AND"
				}
			
           $scope.aa = constructQuery($scope.aa);
        $http.post(BASEURL+RESTCALL.userProfileData+'/readall',$scope.aa).success(function(data){
            
           

             sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;

            $scope.userFullObj = data;
            $scope.uData =  JSON.parse($filter('hex2a')(data[0].ProfileData))
            userData =  $scope.uData; 



            // console.log($scope.uData.defaultdashboard,"udata")

            $scope.active = userData.customDashboardWidgets.showDashboard;
          
           
            $scope.customDashboardWidgets = userData.customDashboardWidgets.settings;
            $scope.DboardPreferences = userData.DboardPreferences;

             $scope.setting.landingModule = $scope.uData.myProfileSetting.landingModule.name;
 

    // setTimeout(function()
    // {

   
   
    //  },100)
             

            
            //Setting Default chart types to payment dashboard
            // for(var i in userData.defaultChartTypes.paymentDashoard)
            // {
            //  $scope.selectedVal[userData.defaultChartTypes.paymentDashoard[i].id] = userData.defaultChartTypes.paymentDashoard[i].chartType;
            // }

            // $scope.myDboardSelectedVal = {
            //        "CurDisCustom":"",
            //        "test2Custom":"",
            //        "MopBarCustom":"",
            //        "sankeyChartCustom":"" 
            //          }

 $scope.myDboardSelectedVal = { };
 $scope.dBoardSelectedVal = {
     "paymentDashboard":{},
     "fileDashboard":{}
 };



            //Setting Default chart types to my dashboard
            
                for(var i in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard)
                {
                $scope.myDboardSelectedVal[userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType;
                }
                
                
                for(var i in userData.defaultChartTypes.paymentDashoard)
                {
                   $scope.dBoardSelectedVal.paymentDashboard[userData.defaultChartTypes.paymentDashoard[i].id] =  userData.defaultChartTypes.paymentDashoard[i].chartType;
                }
                
               

            

            $scope.showingSelectedDboard = $scope.uData.defaultdashboard;

            
             $scope.selectDefDashboard = userData.defaultdashboard.defDashboard;
            // console.log( $scope.selectDefDashboard)

            /***Language Setting ***/
            $('.lang').attr('checked',false)
            /*$('.lang').each(function(key,value){
                if($(value).attr('value') == $scope.uData.genSetting.languageSelected)
                {
                    $scope.langSelected = $(value).attr('value')
                    $(value).prop('checked',true)
                }
             })*/

             
            
                    if($translate.use() == 'en_US')
                    {
                         $('#lang_1').prop('checked',true)
                    }
                    else{
                        $('#lang_2').prop('checked',true)
                    }

                    
                       
            
            
            /*** Theme Setting ***/
            $scope.ssColor = $scope.uData.genSetting.themeSelected;

            $scope.language = {
                        // Handles language dropdown
                        listIsOpen: false,
                        // list of available languages
                        available: {
                            'en_US': 'English',
                            'es_ES': 'Spanish',
                            'fr_FR': 'French',
                            'ru_RU': 'Russian'
                        },
                        // display always the current ui language
                        init: function () {
                            var proposedLanguage = $translate.proposedLanguage() || $translate.use();
                            var preferredLanguage = $translate.preferredLanguage();

                         $scope.proposedLanguage = proposedLanguage;

                         //console.log("initla",$scope.proposedLanguage)

                        $scope.language.selected = $scope.language.available[(proposedLanguage || preferredLanguage)];
                        
                          $scope.langSelected = proposedLanguage;
                          
                        
                        },
                        set: function (localeId, ev) {
                            
                           
							$translate.use(localeId);
                            $scope.language.selected = $scope.language.available[localeId];
                            $scope.language.selected1 = localeId;
                            $scope.language.listIsOpen = !$scope.language.listIsOpen;

								$('.lang').attr('checked',false)
								if(localeId == 'en_US')
								{
								 $('#lang_1').attr('checked',true)
								}
								else if(localeId == 'es_ES')
								{
								$('#lang_2').attr('checked',true)
								}

							$scope.langSelected = localeId;

						 }
                    };
                    
                   
            // DashboardService.curDis = $scope.uData.dashboardSetting.curDis
            // DashboardService.inbndPayment = $scope.uData.dashboardSetting.inbndPayment
            // DashboardService.mop = $scope.uData.dashboardSetting.mop
            // DashboardService.status = $scope.uData.dashboardSetting.status

           
            $scope.checkSavedSearches = function()
            {

                        $scope.savedSearches = {
                            "FileList":[],
                            "AllPayments":[]
                        };
                        
                        //console.log($scope.uData)

                    for(var i in $scope.uData.savedSearch)
                    {
                        for(var j in $scope.uData.savedSearch[i])
                        {
                            $scope.savedSearches[i].push($scope.uData.savedSearch[i][j])
                        }

                    }

                    if($scope.savedSearches.FileList.length > 0)
                    {$scope.FListSavedSearchNotExist = false;
                    }
                    if($scope.savedSearches.AllPayments.length > 0)
                    {$scope.AllPaymentsSavedSearchNotExist = false;
                    }
              }
           $scope.checkSavedSearches()

            $scope.checkBoxsetting = function()
            {

           
            //setTimeout(function(){
                for(var i in $scope.DboardPreferences)
                {
                    for(var j in $scope.DboardPreferences[i])
                    {

                        if($('.'+i+'_'+j+':checked').length<$('.'+i+'_'+j).length)
                        {
                            $('#'+i+'_'+j).prop('checked',false)
                        }
                        else if($('.'+i+'_'+j+':checked').length == $('.'+i+'_'+j).length)
                        {
                        $('#'+i+'_'+j).prop('checked',true)  
                        }

                    }
                       
                }
           // },100)

               $scope.divCheckAll = {
                    "paymentDashboard":false,
                    "fileDashboard":false
                }

          //  setTimeout(function(){

                
                for(var i in $scope.customDashboardWidgets)
                {
                    for(var j in $scope.customDashboardWidgets[i])
                    {
                       // console.log($('.'+i+'_'+j+'_custom:checked').length,$('.'+i+'_'+j+'_custom').length)
                       if($('.'+i+'_'+j+'_custom:checked').length<$('.'+i+'_'+j+'_custom').length)
                        {
                        
                            $('#'+i+'_'+j+'_custom').prop('checked',false)
                        }
                        else if($('.'+i+'_'+j+'_custom:checked').length == $('.'+i+'_'+j+'_custom').length)
                        {
                            //console.log("matched",'#'+i+'_'+j+'_custom')
                        $('#'+i+'_'+j+'_custom').prop('checked',true)  
                        }
                    }
                }

                 for(var i in $scope.customDashboardWidgets)
                {
                    //$scope.dummy = false;
                   
                    for(var j in $scope.customDashboardWidgets[i])
                    {
                            
                         if($('.checkAll_'+i+':checked').length == 2)
                         {
                             $('#checkAll_'+i+'_custom').prop('checked',true)  
                             
                             $scope.divCheckAll[i] = true; 
                         }
                         else{
                             $('#checkAll_'+i+'_custom').prop('checked',false)   
                             
                             $scope.divCheckAll[i] = false; 
                         }
                    }
                }

                //console.log($scope.divCheckAll)

             //},100)

              }

              setTimeout(function(){
                $scope.checkBoxsetting(); 
              },100)



    $scope.resetFn =  function()
    {
        $scope.password = {};
    }


    $scope.setDefaultValues = function()
    {
         uProfileData = retrieveProfileData();
            $scope.customDashboardWidgets = uProfileData.customDashboardWidgets.settings;
            $scope.DboardPreferences = uProfileData.DboardPreferences;

                


                for(var i in $scope.DboardPreferences)
                {
                    for(var j in $scope.DboardPreferences[i])
                    {
                        for(var k in $scope.DboardPreferences[i][j])
                        {
                               // console.log('#'+i+'_'+j+'_'+k,$scope.DboardPreferences[i][j][k].name)
                                $('#'+i+'_'+j+'_'+$scope.DboardPreferences[i][j][k].name).prop('checked',$scope.DboardPreferences[i][j][k].visibility)
                                 $('#'+i+'_'+j).prop('checked',$scope.DboardPreferences[i][j][k].visibility)
                        }
                    }
                       
                }

               for(var i in $scope.customDashboardWidgets)
                {
                    for(var j in $scope.customDashboardWidgets[i])
                    {
                           // for(var k in  $scope.customDashboardWidgets[i][j][k])
                            //{
                                
                                $('#'+i+'_'+j+'_custom').prop('checked',$scope.customDashboardWidgets[i][j][k].visibility)
                           // }

                    }
                }



            userData.DboardPreferences=$scope.DboardPreferences;
            userData.customDashboardWidgets.settings=$scope.customDashboardWidgets;

            

           
                for(var i in uProfileData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard)
                {
                $scope.myDboardSelectedVal[uProfileData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].id] = uProfileData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[i].chartType;
                }
            

                
                
                for(var i in uProfileData.defaultChartTypes.paymentDashoard)
                {
                   $scope.dBoardSelectedVal.paymentDashboard[uProfileData.defaultChartTypes.paymentDashoard[i].id] =  uProfileData.defaultChartTypes.paymentDashoard[i].chartType;
                }

                    //Set chart type to my dashboard
                    for(var i in $scope.myDboardSelectedVal)
                    {
                        for(var j in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard)
                        {
                            if(i == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].id)
                            {
                                userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].chartType = $scope.myDboardSelectedVal[i];
                            }
                        }
                    }

                    /** Setting Default chart type to payment/file dashboards */
                    for(var key in $scope.dBoardSelectedVal)
                    {
                        for(var i in $scope.dBoardSelectedVal[key])
                        {
                            for(var j in userData.defaultChartTypes.paymentDashoard)
                            {
                                if(i == userData.defaultChartTypes.paymentDashoard[j].id)
                                {
                                    userData.defaultChartTypes.paymentDashoard[j].chartType = $scope.dBoardSelectedVal[key][i];
                                }
                            }

                        }
                    }

                     $scope.active = false;
            userData.customDashboardWidgets.showDashboard = false;        

        $scope.checkSavedSearches()
        updateUserProfile($filter('stringToHex')(JSON.stringify(userData)),$http,$scope.userFullObj[0]).then(function(response){
            $scope.alerts = [{
                type : response.Status,
                msg : (response.Status == 'success')?response.data.data.responseMessage:response.data.data.error.message
            }];
            $scope.alertWidth = alertSize().alertWidth;
            $timeout(function(){
            $scope.callOnTimeOut()
            },4000)

            }) 
        
    }

 $scope.$watch(function(){
    
    
    if($scope.active)
    {
    $('#MyDashboard').css('display','block')
    }
    else{
    $('#MyDashboard').css('display','none')
       
        /*for(var i in $scope.uData.myProfileSetting.landingPagesArr)
        {
          
            if($scope.uData.myProfileSetting.landingPagesArr[i].name == "My Dashboard")
            {
                $scope.uData.myProfileSetting.landingPagesArr.splice(i,1)
                $scope.setting.landingModule = 'paymentsummary';
       
            }
        }*/
    }

   
})
                    
                                             
                        


     })
        .error(function(data,status){
			$translate.use("en_US");
           // console.log(data.error.message,status)
		  if(status == 401)
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
						msg : data.error.message
					}
				];
		   }
      })
    }

setTimeout(function(){
    
$scope.retainSavedResults()
},100)



/*$scope.selectedChartVal = function(value,idname){
    
    for(i in userData.defaultChartTypes.paymentDashoard)
     {
        if(userData.defaultChartTypes.paymentDashoard[i].id == idname)
        {
            userData.defaultChartTypes.paymentDashoard[i].chartType = value;
        }
     }
}*/


    $scope.settingForDashboard = function(data)
    {
    //console.log(data)
    $scope.showingSelectedDboard.defDashboard = data;
    
    }


//Called when user save their settings like Thems, Language
$scope.saveUserSetting = function(data){

        $scope.settingsChanged =true;
        data.autoRefresh = $('#toggle-event').prop('checked');

        if(data.autoRefresh)
        {
            if(data.selectedrefreshField.length == 0)
            {
            $scope.setting={
                'selectedrefreshField':[],
                'refreshTime':120
                };
            delete sessionStorage.refreshData;
            clearInterval($scope.interval);
            }
            else
            {
            sessionStorage.refreshData = JSON.stringify(data);
          //  $scope.refreshFn()
            }
        }
        else
        {
            delete sessionStorage.refreshData;
            $timeout(function(){
            $('#autorefreshFields').select2('val','')
            },200)

           // $scope.refreshFn()
        }

    userData.genSetting={
        "languageSelected":$scope.langSelected,
        "themeSelected":$scope.ssColor
    };
    
     for(var i in userData.myProfileSetting.landingPagesArr)
      {  
          if(data.landingModule == userData.myProfileSetting.landingPagesArr[i].state)
          {
             
            userData.myProfileSetting.landingModule.name = data.landingModule;
            userData.myProfileSetting.landingModule.stateParams = userData.myProfileSetting.landingPagesArr[i].stateParams
            
          }
      }

      
      updateUserProfile($filter('stringToHex')(JSON.stringify(userData)),$http,$scope.userFullObj[0]).then(function(response){
            $scope.alerts = [{
                type : response.Status,
                msg : (response.Status == 'success')?response.data.data.responseMessage:response.data.data.error.message
            }];
            $scope.alertWidth = alertSize().alertWidth;
            $timeout(function(){
            $scope.callOnTimeOut()
            },4000)

            }) 

}
//console.log(userData.defaultdashboard.selectChart)
// $rootScope.toRedirect = {};
    // $("#selVal").on("change",function()
    // {

        
    //     //console.log(this.value)
    //     var toRedirect = this.value.trim();
    //     console.log(toRedirect)

    //     if(toRedirect == 'My Dashboard')
    //     {
            
    //         $scope.$apply(function(){

    //         $scope.active = true;
    //         })
    //     }
        
    //         for(i in userData.defaultdashboard.selectChart)
    //         {
               
    //           if(userData.defaultdashboard.selectChart[i].options.indexOf(toRedirect) != -1 )
    //           {
                    
    //             userData.defaultdashboard.selectChart[i].selected = true;
            
    //           }
    //           else
    //           {
    //              userData.defaultdashboard.selectChart[i].selected = false; 
    //           }
           
    //         }

    //         console.log( $scope.selectDefDashboard)
        
    // })

    $scope.selVal = function(val)
    {
        $scope.selectDefDashboard = val;
        
         if(val == 'myDashboard')
        {  

            $scope.active = true;
           
        }

        userData.defaultdashboard.defDashboard = $scope.selectDefDashboard;
    }




$scope.showCustomDboard = function()
{
    $scope.active = !$scope.active;
    if($scope.active)
    {
        $('#MyDashboard').css('display','block')
    }
    else{
        $('#MyDashboard').css('display','none')
    }
}


$scope.saveWidgetSetting = function()
{

        for(var i in $scope.customDashboardWidgets)
        {
            for(var j in $scope.customDashboardWidgets[i])
            {
                for(var k in $scope.customDashboardWidgets[i][j])
                {
                $scope.customDashboardWidgets[i][j][k].visibility =  $('#'+i+"_"+j+"_"+$scope.customDashboardWidgets[i][j][k].name+"_custom").prop("checked")
                }

            }

        }

        //console.log($scope.myDboardSelectedVal)
        for(var i in $scope.myDboardSelectedVal)
        {
            for(var j in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard)
            {
                if(i == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].id)
                {
                    userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].chartType = $scope.myDboardSelectedVal[i];
                }
            }
        }
           // console.log("abc",userData.customDashboardWidgets)


    userData.customDashboardWidgets.settings=$scope.customDashboardWidgets;

    $('#cDashboardWidgets').modal('hide')
    

}



    

  $scope.checkAllDivFn = function(val,flag)
  {
   // console.log(val,flag)

        for(var i in $scope.customDashboardWidgets[val])
        {

            if(flag)
            {
                $('.'+val+'_'+i+'_custom').prop('checked',true)
                 $('#'+val+'_'+i+'_custom').prop('checked',true)
            }
            else{
                $('.'+val+'_'+i+'_custom').prop('checked',false)
                $('#'+val+'_'+i+'_custom').prop('checked',false)
            }

           

        }
    }


$scope.dbNewSetting = function()
{

    // Setting preferences for Payment and file dashboard 
    for(var i in $scope.DboardPreferences)
    {
        for(var j in $scope.DboardPreferences[i])
        {
            for(var k in $scope.DboardPreferences[i][j])
            {
               $scope.DboardPreferences[i][j][k].visibility =  $('#'+i+"_"+j+"_"+$scope.DboardPreferences[i][j][k].name).prop("checked")
            }

        }

    }

    userData.DboardPreferences=$scope.DboardPreferences;

    //set visibile widget and status summary for my dashboard
    for(var i in $scope.customDashboardWidgets)
    {
        for(var j in $scope.customDashboardWidgets[i])
        {
            for(var k in $scope.customDashboardWidgets[i][j])
            {
            $scope.customDashboardWidgets[i][j][k].visibility =  $('#'+i+"_"+j+"_"+$scope.customDashboardWidgets[i][j][k].name+"_custom").prop("checked")
            }

        }

    }
     
    //Set chart type to my dashboard
    for(var i in $scope.myDboardSelectedVal)
    {
        for(var j in userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard)
        {
            if(i == userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].id)
            {
                userData.customDashboardWidgets.myDashboardDefaultChartTypes.paymentDashoard[j].chartType = $scope.myDboardSelectedVal[i];
            }
        }
    }

    /** Setting Default chart type to payment/file dashboards */
    for(var key in $scope.dBoardSelectedVal)
    {
        for(var i in $scope.dBoardSelectedVal[key])
        {
            for(var j in userData.defaultChartTypes.paymentDashoard)
            {
                if(i == userData.defaultChartTypes.paymentDashoard[j].id)
                {
                    userData.defaultChartTypes.paymentDashoard[j].chartType = $scope.dBoardSelectedVal[key][i];
                } 
            }

        }
    }

      
       
      //userData.defaultdashboard.defDashboard = $scope.selectDefDashboard;

    
     userData.customDashboardWidgets.settings=$scope.customDashboardWidgets;
      userData.customDashboardWidgets.showDashboard = $scope.active;
        /*if(($scope.selectDefDashboard == 'myDashboard') && (!$scope.active))
        {
             userData.customDashboardWidgets.showDashboard = true;
             $scope.active = true;
        }
        else{
            userData.customDashboardWidgets.showDashboard = $scope.active;

        }*/
   
         updateUserProfile($filter('stringToHex')(JSON.stringify(userData)),$http,$scope.userFullObj[0]).then(function(response){
            $scope.alerts = [{
                type : response.Status,
                msg : (response.Status == 'success')?response.data.data.responseMessage:response.data.data.error.message
            }];
            $scope.alertWidth = alertSize().alertWidth;
            $timeout(function(){
            $scope.callOnTimeOut()
            },4000)

            }) 
        
    
  
}






$scope.checkAllFn = function(x,y)
{
        
    $('.'+x+'_'+y).each(function(a,b){
            if($('#'+x+"_"+y).prop("checked"))
            {
                $(this).prop('checked',true)
            }
            else{
                $(this).prop('checked',false)
            }
      
    })

     $('.'+x+'_'+y+'_custom').each(function(a,b){

        

            if($('#'+x+"_"+y+'_custom').prop("checked"))
            {
                $(this).prop('checked',true)
            }
            else{
                $(this).prop('checked',false)
            }
      
    })
}


$scope.checkInidivisualCheckbox = function(x,y,z)
{
      
    
  //  ($(".aa:checked").length)
   // console.log('.'+x+'_'+y+':checked', $('.'+x+'_'+y+':checked').length, $('.'+x+'_'+y).length)

    if($('.'+x+'_'+y+':checked').length<$('.'+x+'_'+y).length)
    {
        $('#'+x+'_'+y).prop('checked',false)
    }
    else if($('.'+x+'_'+y+':checked').length == $('.'+x+'_'+y).length)
    {
      $('#'+x+'_'+y).prop('checked',true)  
    }

   
    if($('.'+x+'_'+y+'_custom:checked').length<$('.'+x+'_'+y+'_custom').length)
    {
        $('#'+x+'_'+y+'_custom').prop('checked',false)
    }
    else if($('.'+x+'_'+y+'_custom:checked').length == $('.'+x+'_'+y+'_custom').length)
    {
      $('#'+x+'_'+y+'_custom').prop('checked',true)  
    }

    //console.log(x+"_"+y,$('.'+x+"_"+y).prop("checked"))


    //console.log($('.'+x+"_"+y).prop("checked"))
    //console.log($('#'+x+"_"+y+"_"+z).prop("checked"))
    // if(!$('#'+x+"_"+y+"_"+z).prop("checked"))
    // {
    //     $('#'+x+"_"+y).prop("checked",false)
    // }






}


$scope.gotoFileListSearch = function(searchNameIndex, searchName, $event)
{

    if(searchName == 'Flist')
    {
        //console.log($scope.uData.savedSearch.FileList[searchNameIndex])
        GlobalService.myProfileFLindex = searchNameIndex;
        // var x = "FList_"+sessionStorage.UserID+"_"+$scope.lskey[GlobalService.myProfileFLindex];
        //var ff=JSON.parse(localStorage.getItem(x));
        var ff=$scope.uData.savedSearch.FileList[searchNameIndex].params;
        

        GlobalService.all=ff.all,GlobalService.today=ff.today,GlobalService.week=ff.week,GlobalService.month=ff.month,GlobalService.custom=GlobalService.custom=ff.custom,GlobalService.todayDate=GlobalService.todayDate=ff.todayDate,GlobalService.weekStart=ff.weekStart,GlobalService.weekEnd=ff.weekEnd,GlobalService.monthStart=ff.monthStart,GlobalService.monthEnd=GlobalService.monthEnd=ff.monthEnd,GlobalService.selectCriteriaTxt=ff.selectCriteriaTxt,GlobalService.selectCriteriaID=ff.selectCriteriaID,GlobalService.prev=ff.prev,GlobalService.prevSelectedTxt=ff.prevSelectedTxt,GlobalService.prevId=GlobalService.prevId=ff.prevId,GlobalService.startDate=GlobalService.startDate=ff.startDate,GlobalService.endDate=ff.endDate,GlobalService.ShowStartDate=ff.ShowStartDate,GlobalService.ShowEndDate=ff.ShowEndDate,GlobalService.searchClicked=GlobalService.searchClicked=ff.searchClicked,GlobalService.isEntered=ff.isEntered,GlobalService.advancedSearch=ff.advancedSearch,GlobalService.advancedSearchEnable=ff.advancedSearchEnable,GlobalService.uirTxtValue=ff.uirTxtValue,GlobalService.fileNameVal=ff.fileNameVal,GlobalService.entrystartdate=ff.entrystartdate,GlobalService.entryenddate=ff.entryenddate;
        GlobalService.searchParams = ff.searchParams;
        GlobalService.FieldArr = ff.FieldArr;
        GlobalService.SelectSearchVisible = true;
        GlobalService.fromMyProfilePage = true;
        GlobalService.searchname = $($event.currentTarget).text().trim();

        
       // $location.path('app/filelist')
		$state.go("app.instructions")

    }
    else if(searchName == 'AllPayments')
    {
        AllPaymentsGlobalData.myProfileFLindex = searchNameIndex
        // var x = "AS_"+sessionStorage.UserID+"_"+$scope.IsKeyAllPayments[AllPaymentsGlobalData.myProfileFLindex];
        //var ff=JSON.parse(localStorage.getItem(x));
        
        var ff= $scope.uData.savedSearch.AllPayments[searchNameIndex].params;
        AllPaymentsGlobalData.FieldArr = ff.FieldArr;

        AllPaymentsGlobalData.searchParams = ff.searchParams;
        AllPaymentsGlobalData.orderByField=ff.orderByField,AllPaymentsGlobalData.sortReverse=ff.sortReverse,AllPaymentsGlobalData.sortType=ff.sortType,AllPaymentsGlobalData.isSortingClicked=ff.isSortingClicked,AllPaymentsGlobalData.DataLoadedCount=ff.DataLoadedCount,AllPaymentsGlobalData.myProfileFLindex=ff.myProfileFLindex,AllPaymentsGlobalData.all=ff.all,AllPaymentsGlobalData.today=ff.today,AllPaymentsGlobalData.week=ff.week,AllPaymentsGlobalData.month=ff.month,AllPaymentsGlobalData.custom=ff.custom,AllPaymentsGlobalData.FLuir=ff.FLuir,AllPaymentsGlobalData.startDate=ff.startDate,AllPaymentsGlobalData.endDate=ff.endDate,AllPaymentsGlobalData.ShowStartDate=ff.ShowStartDate,AllPaymentsGlobalData.ShowEndDate=ff.ShowEndDate,AllPaymentsGlobalData.todayDate=ff.todayDate,AllPaymentsGlobalData.weekStart=ff.weekStart,AllPaymentsGlobalData.weekEnd=ff.weekEnd,AllPaymentsGlobalData.monthStart=ff.monthStart,AllPaymentsGlobalData.monthEnd=ff.monthEnd,AllPaymentsGlobalData.selectCriteriaTxt=ff.selectCriteriaTxt,AllPaymentsGlobalData.selectCriteriaID=ff.selectCriteriaID,AllPaymentsGlobalData.prev=ff.prev,AllPaymentsGlobalData.prevSelectedTxt=ff.prevSelectedTxt,AllPaymentsGlobalData.prevId=ff.prevId,AllPaymentsGlobalData.searchClicked=ff.searchClicked,AllPaymentsGlobalData.isEntered=ff.isEntered,AllPaymentsGlobalData.advancedSearchEnable=ff.advancedSearchEnable,AllPaymentsGlobalData.uirTxtValue=ff.uirTxtValue,
        AllPaymentsGlobalData.searchNameDuplicated=ff.searchNameDuplicated;
        AllPaymentsGlobalData.SelectSearchVisible = true;
        AllPaymentsGlobalData.fromMyProfilePage = true;
        AllPaymentsGlobalData.searchParams = ff.searchParams;

        
        AllPaymentsGlobalData.searchname = $($event.currentTarget).text().trim();
        $location.path('app/allpayments')
    }
}








$scope.dbSetting = function()
{
    $timeout(function(){
    $('.dbDataWidget').find('.checkbox').each(function(key,val){

            if($(val).find('span').hasClass('checked'))
        {
            DashboardService[$(val).find('span').attr('name')]  = true;
            $scope.dbData[key].flag = DashboardService[$(val).find('span').attr('name')];



            }else
            {DashboardService[$(val).find('span').attr('name')]  = false;
            $scope.dbData[key].flag = DashboardService[$(val).find('span').attr('name')];


            }
    })
    
            
    $http.post(BASEURL+RESTCALL.userProfileData+'/readall',$scope.aa).success(function(data)
    {
        if(data.length>0)
        {
            userData.dashboardSetting={
                            "curDis":DashboardService.curDis,
                            "InbndPayment":DashboardService.inbndPayment,
                            "Mop":DashboardService.mop,
                            "Status":DashboardService.status,
                        };

            updateUserProfile($filter('stringToHex')(JSON.stringify(userData)),$http,data[0]).then(function(response){
                $scope.alerts = [{
                    type : response.Status,
                    msg : (response.Status == 'success')?response.data.data.responseMessage:response.data.data.error.message
                }];
                $scope.alertWidth = alertSize().alertWidth;
                $timeout(function(){
                    $scope.callOnTimeOut()
                },4000)
            })
        }
        else{
            
            userData = uProfileData
            var lObj = {};
            lObj.UserID = sessionStorage.UserID;
            lObj.ProfileData = $filter('stringToHex')(JSON.stringify(userData));
            
            $http.post(BASEURL+RESTCALL.userProfileData,lObj).success(function(data)
            {
                    
            }).error(function(error){
            })
            
        }
    }).error(function(){
            
        })
    
    
                
    },200)

    $scope.dbSettingFlag = true;

    $timeout(function(){
    $scope.dbSettingFlag = false;
    },3000)
}
















    $('#toggle-event').change(function() {
                   $timeout(function(){
                       if( $('#toggle-event').prop('checked'))
                       {
                       $scope.autoRefresh = true;
                       }else
                       {
                       $scope.autoRefresh = false;
                       }
                 },200)
            })

    $scope.confirmationAlert = function(index, select){
                $scope.selectedSearchName  = index;
        		$scope.showAlertMsg = true;
        		$scope.selectedSearchName  = index;

				$scope.name = select;


        		/*if($scope.name == 'FList')
				{
				$scope.DeleteSearchName = $scope.lskey[$scope.selectedSearchName];
				}
        		else if($scope.name == 'allPayments')
        		{
        		$scope.DeleteSearchName = $scope.IsKeyAllPayments[$scope.selectedSearchName];

        		}*/


        		}

    $scope.deleteSelectedSearch = function(eve){

            if($scope.name == 'FList')
            {
            userData.savedSearch.FileList.splice($scope.selectedSearchName,1)
            }
        	else if($scope.name == 'allPayments')
            {
            userData.savedSearch.AllPayments.splice($scope.selectedSearchName,1)
            }
        	updateUserProfile($filter('stringToHex')(JSON.stringify(userData)),$http).then(function(response){
                    $scope.alerts = [{
                        type : response.Status,
                        msg : (response.Status == 'success')?'Deleted Successfully':response.data.data.error.message
                    }];


                    $timeout(function(){
                        callAtTimeout()
                    },4000)
                    $scope.alertWidth = alertSize().alertWidth;

                    $('.modal').modal('hide');
                    if(response.Status == 'success')
                    {$scope.retainSavedResults()
                    }
                })
        };

    if((sessionStorage.showMoreFieldOnCreateUser == true) || (sessionStorage.showMoreFieldOnCreateUser == 'true'))
    {
    $scope.showMoreFieldOnPasswordReset = true;
    }
    else
    {
    $scope.showMoreFieldOnPasswordReset = false;
    }



$scope.passwordReset = function(password){

       if(password.newPW != password.confirmPW)
		{
			$scope.pwMatchFailed = true;
			$scope.alerts = [{
                 			type : 'danger',
                 			msg : 'New password and confirm password does not match'
                 		}];


				 $scope.alertStyle =  alertSize().headHeight;
				 $scope.alertWidth = alertSize().alertWidth;
		}
		else
		{
			$scope.alertWidth = alertSize().alertWidth;
			$scope.pwMatchFailed = false;
			GlobalService.passwordChanged = true;

			var loginObj = {};
			loginObj.UserId = sessionStorage.UserID;

            if($scope.showMoreFieldOnPasswordReset)
			{
                var loginData = {};
                loginData.UserId = sessionStorage.UserID;
                loginData.OldPassword = $('#oldPW').val();
                loginData.NewPassword = password.confirmPW;

                $http.put(BASEURL + RESTCALL.ProfilePasswordReset, loginData).success(function (data, status) {
                    GlobalService.responseMessage = data.responseMessage;
					GlobalService.passwordChanged = true;

                    LogoutService.Logout();

        		}).error(function (data, status, headers, config) {

                        $scope.alerts = [{
                   			type : 'danger',
                   			msg : data.error.message
                   		}];
                });

            }
            else
            {
                var loginData = {};
                loginData.UserId = sessionStorage.UserID;
                loginData.OldPassword = $('#oldPW').val();
                loginData.NewPassword = password.confirmPW;

                $http.put(BASEURL + RESTCALL.ProfilePasswordReset, loginData).success(function (data, status) {

				 				GlobalService.responseMessage  = "Your profile has been updated with new password";
								GlobalService.passwordChanged = true;
                                LogoutService.Logout();
                }).error(function (data, status, headers, config) {
						$scope.alerts = [{
								type : 'danger',
								msg : data.error.message
							}];
					   });
            }

		}

	}


	 $scope.timeZone = function () {
            /*var totArr = ["timeZone"]
            setTimeout(function(){

            for(var k=0;k<totArr.length;k++)
            {
                var tabSelectLen = $('.'+totArr[k]).length;
                var sel;
                  for(var j=0;j<=tabSelectLen;j++)
                  {
                        var dropValues = '';

                         for (var i in timeZoneDropValues.TimeZone)
                          {
                             if($('#'+totArr[k]+'_'+j).attr('dropval') == timeZoneDropValues.TimeZone[i].TimeZoneId )
                             {
                             sel = 'selected'
                             }
                             else
                             {
                             sel=''

                             }
                             dropValues = '<option value="' + timeZoneDropValues.TimeZone[i].TimeZoneId + '" '+sel+'>' + timeZoneDropValues.TimeZone[i].TimeZoneId + '</option>' + dropValues;
                          }

                          $('#'+totArr[k]+'_'+j).append(dropValues)
                    }
            }
            },0)*/

            $scope.tZoneOptions = [];
            $http.get(BASEURL+RESTCALL.RefDataTimeZoneREST).success(function(data){
                
                $scope.tZoneOptions = data.TimeZone;

            }).error(function()
            {

            })

        }

        $scope.timeZone()

     




    $scope.multipleEmptySpace = function (e) {
	        // if($.trim($(e.currentTarget).val()).length == 0)
    	    // {
    	    // $(e.currentTarget).val('')
    	    // }
        }


	$scope.pwCancel = function()
	{
	LogoutService.Logout();
	}


	$scope.pwResetCancel = function()
	{
	$location.path('/app/dashboard')
	}

	$scope.validatePassWord = function(val, e)
    {
        if(val)
        {
            $http.post(BASEURL + RESTCALL.ValidatePW, {'UserId':sessionStorage.UserID,'Password':val}).success(function (data, status, headers, config) {

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
    }

    $(window).scroll(function() {
    $scope.widthOnScroll();
    })


    $scope.widthOnScroll = function()
    {
        var mq = window.matchMedia( "(max-width: 991px)" );
        var headHeight
        if (mq.matches) {
            headHeight =0;
         $scope.alertWidth = $('.profileHeader').width();
        } else {
           $scope.alertWidth = $('.profileHeader').width();
            headHeight = $('.page-header').outerHeight(true)+10;
        }
        $scope.alertStyle=headHeight;
    }

    $scope.widthOnScroll();


	$(window).resize(function(){

		$scope.$apply(function () {
            $scope.alertWidth = $('.tab-content').width();

		});

	});



	$scope.toggleView = function(flag)
    {
        $scope.viewProfile = flag;
         $scope.initialCall()
         if(flag)
         {

         $scope.timeZone()
         }
       // $scope.refreshFn()
    }
   

    $(document).ready(function(){

       //  $('.appendSelect2').select2();
    })


});