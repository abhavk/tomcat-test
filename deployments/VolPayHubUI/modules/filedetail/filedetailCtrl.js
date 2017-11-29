VolpayApp.controller('filedetailCtrl', function ($scope, $http, $state, $location, $compile, GlobalService, bankData,$timeout,$filter) {
	$scope.isCollapsed = false;
	$scope.isPaymentCollapsed = false;

	$scope.refId = GlobalService.fileListId;

	$scope.fileDetailObj = {};
    $scope.fileDetailObj.InstructionID = $scope.refId;

    if($scope.refId == -1)
	{
        //$location.path('app/allpayments')
		$state.go('app.instructions')

	}



        $scope.fromOutputSummary = $state.params.input;
        console.log($scope.fromOutputSummary)

        $scope.gotoOutputPaymentSummary = function()
        {

        $state.go('app.outputpaymentsummary',{input:{'uor':$scope.fromOutputSummary.input.uor,'nav':{},'from':'distributedinstructions'}})
        }
    

    //setTimeout(function(){
        sessionStorage.menuSelection = JSON.stringify({'val':'PaymentModule','subVal': 'ReceivedInstructions'})
        sidebarMenuControl('PaymentModule', 'ReceivedInstructions')
   // },1500)
    
    


      $scope.GoToDupData = function(val)
      {
           GlobalService.fileListId = val

            GlobalService.sidebarCurrentVal={
                               "ParentName":"Payment Module",
                               "Link":"app",
                               "IconName":"icon-settings"
            }
             GlobalService.sidebarSubVal={
                    "IconName":"fa-file-text-o",
                    "Id":"002",
                    "Link":"filedetail",
                    "Name":"File List",
                    "ParentName":"Payment Module"
             }




                $state.reload()
      }


    $http.post(BASEURL + RESTCALL.FileSpecificREST,$scope.fileDetailObj).then(function (resp) {
        		$scope.filedetail = resp.data;
				getForceAction($scope.filedetail)
        			},function(err){
        				$scope.alerts = [{
        					type : 'danger',
        					msg : err.data.error.message
        				}];

        				$timeout(function(){
        				    callOnTimeOut()
        				},4000)


        			});

    $scope.aa = {
				"Queryfield": [{
						"ColumnName": "InstructionID",
						"ColumnOperation": "=",
						"ColumnValue": $scope.refId
					}
				]
			}

			$scope.aa = constructQuery($scope.aa);

    $http.post(BASEURL+RESTCALL.InstructionCurrency,$scope.aa).success(function(data){

            $scope.currencyWiseSum = data;
        console.log("currency",data)
    }).error(function(data){

    })

    $scope.filedetailpcd=[];

    $scope.paymentDataFn = function(obj){

        $http.post(BASEURL + RESTCALL.FilePCDREST,$scope.fileDetailObjLimit).then(function (resp1) {
                    $scope.loadedData =  resp1.data;
                    $scope.filedetailpcd = $scope.filedetailpcd.concat(resp1.data);
                    GlobalService.allFileListDetails = resp1.data
        }, function (err) {
                $scope.loadedData=[];
                console.log(err)
        });
    }

    if(sessionStorage.InstructionNotes==undefined){
        $scope.NotesArr=[];
    }else{
        $scope.NotesArr=JSON.parse(sessionStorage.InstructionNotes);
    }
	
	
	$scope.data={};
	$scope.addNotes = function(notes,toDetails){
		//console.log(notes,toDetails.InstructionID,toDetails.PaymentID)
		$scope.Notes = {
							"InstructionID": toDetails,
							"Notes": notes.notes
						}
		$http.post(BASEURL+'/rest/v2/instructions/notes',$scope.Notes).then(function (notes) {
			//console.log(notes)

			$scope.alerts = [{
                                type : 'success',
                                msg : notes.data.responseMessage
                            }
                        ];
             $timeout(function(){
                $('.alert-success').hide()
             },5000)


			$scope.data.notes = ''
			$('.modal').modal('hide')
				$http.post(BASEURL + RESTCALL.FileAuditREST,$scope.fileDetailObj).then(function (resp2) {
						$scope.filedetailaudit = resp2.data;
				}, function (err) {
					console.error('ERR', err);
				})
		}, function (err) {
			$scope.alerts = [{
					type : 'danger',
					msg : err.data.error.message
				}
			];
		})
	}
/* 
    $scope.findExistingObj = function(data,refId){
        $scope.fileObjExistingFlag=false;
        for(i=0;i<$scope.NotesArr.length;i++){
            if($scope.NotesArr[i].InstructionID==refId){
               $scope.fileObjExistingFlag=true;
               delete data.$$hashKey;
               $scope.NotesArr[i].notes=data.notes;
               $scope.NotesArr[i].NoteBy=sessionStorage.ROLE_ID;
               $scope.NotesArr[i].Datetime=new Date();
            }
        }
        if($scope.fileObjExistingFlag==false){
		 data.NoteBy=sessionStorage.ROLE_ID;
		 data.Datetime=new Date();
         $scope.NotesArr.push(data)
        }

    }

    $scope.ExistingNodes=false;
    $scope.addNotes = function(data,refId)
    {
        data.InstructionID=refId;
        data=$scope.findExistingObj(data,refId)
        sessionStorage.InstructionNotes = JSON.stringify($scope.NotesArr);
        $scope.ExistingNodes=true;
        $('.modal').modal('hide')
    }

    $scope.data={};
    $scope.getExistingNotes=function(refId){
         $scope.ExistingNodes=false;
            for(i=0;i<$scope.NotesArr.length;i++){
                    if($scope.NotesArr[i].InstructionID==refId){
                        $scope.data.notes=$scope.NotesArr[i].notes;
						$scope.data.NoteBy=$scope.NotesArr[i].NoteBy;
						console.log($scope.NotesArr[i].Datetime)
						$scope.data.Datetime=$scope.NotesArr[i].Datetime;
                        $scope.ExistingNodes=true;
                    }
                }
            if(!$scope.ExistingNodes)
            {
             $scope.data.notes="";
            }
    }

    $scope.getExistingNotes($scope.refId)

 */
   $('#activeId').click(function(){
        $scope.len = 0;
        $scope.filedetailpcd=[];
        $scope.fileDetailObjLimit = {};
        $scope.fileDetailObjLimit.InstructionID = $scope.refId;
        $scope.fileDetailObjLimit.start = $scope.len;
        $scope.fileDetailObjLimit.count = 20;
        $scope.paymentDataFn($scope.fileDetailObjLimit);
   })


    $scope.selfCalling = function(){

        $('#restoreFileData').css('pointer-events','none')
        $timeout(function(){
            $('#restoreFileData').css('pointer-events','auto')
        },400)

            $scope.filedetailpcd=[];
            $scope.len = 0;
            $scope.fileDetailObjLimit = {};
            $scope.fileDetailObjLimit.InstructionID = $scope.refId;
            $scope.fileDetailObjLimit.start = $scope.len;
            $scope.fileDetailObjLimit.count = 20;

        $scope.paymentDataFn($scope.fileDetailObjLimit);

	$http.post(BASEURL + RESTCALL.FileAuditREST,$scope.fileDetailObj).then(function (resp2) {
    		$scope.filedetailaudit = resp2.data;

            for(var i=0; i<resp2.data.length;i++)
            {
                if(resp2.data[i].Event == 'RECEIVE_PAYMENT')
                {
                    var str = resp2.data[i].Description;
                    var initData = str.split('[')
                    var String=str.substring(str.lastIndexOf("[")+1,str.lastIndexOf("]"));


                    setTimeout(function(){

                        if(String.indexOf(',') > -1)
                        {
                            var trimedData = [];
                            $.each(String.split(','), function(){
                                trimedData.push($.trim(this));
                            });

                            var htmlData='';
                            for(var i in trimedData)
                            {
                             htmlData = htmlData+'<span class="cursorPointer bold dupClick" ng-click="GoToDupData('+trimedData[i]+')">'+trimedData[i]+'</span>'+', '
                            }

                            var btnhtml  = htmlData
                        }
                        else
                        {
                            var btnhtml = '<span class="cursorPointer bold dupClick" ng-click="GoToDupData('+String+')">'+String+'</span>';
                        }

                    var temp = $compile(btnhtml)($scope);
                    $('.dupDatas').append(initData[0]+'[')
                    $('.dupDatas').append(temp)
                    $('.dupDatas').append(']')

                    },100)


                }

            }


        $scope.getTotal = function () {
    			$scope.total = 0;
    			for (var i = 0; i < $scope.filedetailaudit.length; i++) {
    				if ($scope.filedetailaudit[i].Event == "RECEIVE_FILE") {
    					$scope.total++;
    				}
    			}
    			return $scope.total;
    		}
    		$scope.getTotal(); //function CALL

    		$scope.getTotal2 = function () {
    			$scope.total2 = 0;
    			for (var i = 0; i < $scope.filedetailaudit.length; i++) {
    				if ($scope.filedetailaudit[i].Event == "RECEIVE_PAYMENT") {
    					$scope.total2++;
    				}
    			}
    			return $scope.total2;
    		}
    		$scope.getTotal2(); //function CALL

    	}, function (err) {
    		// console.error('ERR', err);
    	});




    	/*$http.post(BASEURL + RESTCALL.FLTransactionalDetails,$scope.fileDetailObj).then(function (response) {
			$scope.transactionData = response.data;
		}, function (err) {/v2/instructions/interaction/readall
				
			}); */

            $http.post(BASEURL+RESTCALL.FileSystemInteraction,$scope.fileDetailObj).then(function(response){
                $scope.newdata = response.data;

            },function(err){

            })

            $http.post(BASEURL+RESTCALL.FileExtCommunication,$scope.fileDetailObj).then(function(response){
            //   console.log(response)
            $scope.externaldata = response.data;
            console.log($scope.externaldata)
            },function(err){

            })


	}

	$scope.selfCalling()



    $scope.navToPaymentFrmOutput = function()
    {
        GlobalService.fileListId = $scope.fromOutputSummary.input.nav.UIR;
		GlobalService.UniqueRefID = $scope.fromOutputSummary.input.nav.PID;
		GlobalService.fromPage = 'filedetail'
       


        $scope.Obj = {
		'uor':$scope.fromOutputSummary.input.uor,
		'nav':{
			  'UIR':$scope.fromOutputSummary.input.nav.UIR,
			  'PID':$scope.fromOutputSummary.input.nav.PID
				},
		'from': 'filedetail'
	    }

		$state.go('app.paymentdetail', {
			input: $scope.Obj
		})
    }

	$scope.clickReferenceID = function (val) {
        
        GlobalService.fileListId = val.data.InstructionID;
		GlobalService.UniqueRefID = val.data.PaymentID;
		GlobalService.fromPage = val.fromPage;
       


        $scope.Obj = {
		'uor':val.data.OutputInstructionID,
		'nav':{
			  'UIR':val.data.InstructionID,
			  'PID':val.data.PaymentID
				},
		'from': 'filedetail'
	    }

		$state.go('app.paymentdetail', {
			input: $scope.Obj
		})


	}

	$scope.underScoreReplace = function (obj) {
		return obj.replace(/_/g, ' ');
	};


$scope.fileStatus = function(status)
	{

	    $http.put(BASEURL+RESTCALL.FileStatusREST, {'InstructionID':$scope.refId,'status':status}).success(function(data){
            GlobalService.fileDetailStatus.Status = status;
            GlobalService.fileDetailStatus.Msg = data.responseMessage;
            $timeout(function(){
           // $location.path('app/filelist')
		   $state.go("app.instructions")
            },200)

	    }).error(function(err){





	            $scope.alerts = [{
                            type : 'danger',
                            msg : err.error.message
                        }];


                $timeout(function(){
                    callOnTimeOut()
                },4000)
        })


}

	

   /*           $scope.fileDetailObjLimit = {};
                $scope.fileDetailObjLimit.UIR = $scope.refId;
                $scope.fileDetailObjLimit.start = $scope.len;
                $scope.fileDetailObjLimit.count = 3;

	*/

	/*** To control Load more data ***/
        jQuery(
            function($)
                {
                    $('.fileDetailOverflow').bind('scroll', function()
                    {

                        if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
                        {
                               if(($scope.loadedData.length >= 20) && $('#activeId').hasClass('active'))
                               {
                                $scope.len = $scope.len+20;
                                $scope.fileDetailObjLimit = {};
                                $scope.fileDetailObjLimit.InstructionID = $scope.refId;
                                $scope.fileDetailObjLimit.start = $scope.len;
                                $scope.fileDetailObjLimit.count = 20;
                                $scope.paymentDataFn($scope.fileDetailObjLimit);
                               }

                        }
                    })
                    setTimeout(function(){},1000)
                }
        );

  $scope.multipleEmptySpace = function (e) {
                if($.trim($(e.currentTarget).val()).length == 0)
        	    {
        	    $(e.currentTarget).val('');
        	    }
        }


	$scope.exportToDoc = function(msg)
	{
        console.log(msg)
	//console.log($filter('hex2a')(msg.MessageContents))
     bankData.textDownload($filter('hex2a')(msg.MessageContents),msg.GroupInteractionUniqueID);
	}


$scope.ExportForIE = function()
{
    var ua = window.navigator.userAgent;
    var msie = ua.indexOf("MSIE");
     if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
     {
     var table_html = $('#tableExport').html();
     bankData.exportToExcel(table_html, $scope.filedetail.UniqueInstructionReference+"_"+$scope.filedetail.TransportName);
     }
}

$scope.tablesToExcel = function () {

    var ua = window.navigator.userAgent;
       var msie = ua.indexOf("MSIE");

       if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
       {
            //console.log("IE")

       }
       else
       {

            var uri = 'data:application/vnd.ms-excel;base64,'
           , tmplWorkbookXML = '<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">'
             + '<DocumentProperties xmlns="urn:schemas-microsoft-com:office:office"><Author>Axel Richter</Author><Created>{created}</Created></DocumentProperties>'
             + '<Styles>'
             + '<Style ss:ID="Currency"><NumberFormat ss:Format="Currency"></NumberFormat></Style>'
             + '<Style ss:ID="Date"><NumberFormat ss:Format="Medium Date"></NumberFormat></Style>'
             + '</Styles>'
             + '{worksheets}</Workbook>'
           , tmplWorksheetXML = '<Worksheet ss:Name="{nameWS}"><Table>{rows}</Table></Worksheet>'
           , tmplCellXML = '<Cell{attributeStyleID}{attributeFormula}><Data ss:Type="{nameType}">{data}</Data></Cell>'
           , base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s))) }
           , format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; }) }
           return function(tables, wsnames, wbname, appname) {

             var ctx = "";
             var workbookXML = "";
             var worksheetsXML = "";
             var rowsXML = "";

             for (var i = 0; i < tables.length; i++) {
               if (!tables[i].nodeType) tables[i] = document.getElementById(tables[i]);
               for (var j = 0; j < tables[i].rows.length; j++) {
                 rowsXML += '<Row>'
                 for (var k = 0; k < tables[i].rows[j].cells.length; k++) {
                   var dataType = tables[i].rows[j].cells[k].getAttribute("data-type");
                   var dataStyle = tables[i].rows[j].cells[k].getAttribute("data-style");
                   var dataValue = tables[i].rows[j].cells[k].getAttribute("data-value");
                   dataValue = (dataValue)?dataValue:tables[i].rows[j].cells[k].innerHTML;
                   var dataFormula = tables[i].rows[j].cells[k].getAttribute("data-formula");
                   dataFormula = (dataFormula)?dataFormula:(appname=='Calc' && dataType=='DateTime')?dataValue:null;
                   ctx = {  attributeStyleID: (dataStyle=='Currency' || dataStyle=='Date')?' ss:StyleID="'+dataStyle+'"':''
                          , nameType: (dataType=='Number' || dataType=='DateTime' || dataType=='Boolean' || dataType=='Error')?dataType:'String'
                          , data: (dataFormula)?'':dataValue
                          , attributeFormula: (dataFormula)?' ss:Formula="'+dataFormula+'"':''
                         };
                   rowsXML += format(tmplCellXML, ctx);
                 }
                 rowsXML += '</Row>'
               }
               ctx = {rows: rowsXML, nameWS: wsnames[i] || 'Sheet' + i};
               worksheetsXML += format(tmplWorksheetXML, ctx);
               rowsXML = "";
             }

             ctx = {created: (new Date()).getTime(), worksheets: worksheetsXML};
             workbookXML = format(tmplWorkbookXML, ctx);

             console.log($scope.filedetail)
       wbname = $scope.filedetail.InstructionID+"_"+$scope.filedetail.TransportName+".xls"

             var link = document.createElement("A");
             link.href = uri + base64(workbookXML);
             link.download = wbname || 'Workbook.xlsx';
             link.target = '_blank';
             document.body.appendChild(link);
             link.click();
             document.body.removeChild(link);
           }

       }

}();


	function getForceAction(value) {
		$http.post(BASEURL + '/rest/v2/partyserviceassociations/read', {
			'PartyServiceAssociationCode' : value.InputReferenceCode
		}).then(function (response) {
			//console.log(response.data.ProcessCode)
			$scope.ProcessCode = response.data.ProcessCode;

			var actionInput = {}
			actionInput.ProcessStatus = $scope.filedetail.FileStatus;
			actionInput.WorkFlowCode = 'INSTRUCTION';
			actionInput.ProcessName = $scope.ProcessCode;

			$http.post(BASEURL + '/rest/v2/actions', actionInput).then(function (response) {
				console.log(response)
				if (response.data.length > 0) {
					$scope.enableActionbuttons = response.data;
				}
				console.log(response.data);
			}, function (err) {
				console.error('ERR', err);
			})

		}, function (err) {
			console.error('ERR', err);
		})
	}
	
	$scope.forceAction=function(items,actions){
		//console.log(items)
		//console.log(actions)
			
		
		var obj1={};
		obj1.InstructionID= items.InstructionID;		
		//obj1.status= items.FileStatus;		
		//console.log(obj1)		
		var method=actions.RestMethod;
		var REST_URL='/rest'+actions.RestURL;
		
		$http({
			url : BASEURL + REST_URL,
			method :method,
			data : obj1,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			
			if((actions.SuccessURL!='')&&(actions.SuccessURL!=undefined)){
				
				GlobalService.fileDetailStatus.Msg = data.responseMessage;
				$timeout(function(){
			    $location.path(actions.SuccessURL);
			   //$state.go("app.instructions")			   
				},200)
			}else{
				GlobalService.fileDetailStatus.Msg = data.responseMessage;
				$timeout(function(){
					$location.path('app/instructions')		   
				},200)
				
			}
			
		}).error(function (data, status, headers, config) {
			$scope.alerts = [{
				type : 'danger',
				msg : data.error.message
			}];
			if((actions.failureURL!='')&&(actions.failureURL!=undefined)){
				$location.path(actions.failureURL);
			}else{
				//alert("Failed");
				$location.path('app/instructions')
			}
			
		});  
		 
	}	


});
