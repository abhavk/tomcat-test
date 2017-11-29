VolpayApp.controller('paymentDetailCtrl', function ($scope, $http, $location, $state, $timeout, $filter, $rootScope , GlobalService,AllPaymentsGlobalData,RefService,bankData) {	//console.log($state.params.input)
	
	
	$scope.Pconfirm={}
	$http.get(BASEURL + '/rest/v2/confirmation/status').success(function (data, status, headers, config) {
		console.log(data)	
		$scope.confirmationStatus=data;
	}).error(function (data, status, headers, config) {
		console.log(data)
	});
	
	$scope.ManualConfirmationStatusArr=["COMPLETED","DELIVERED","ACCEPTED","PROCESSING","PENDING","PARTIALLYACCEPTED","PARTIALLYCOMPLETED","COMPLETED WITH AMENDMENTS"]
	
	//console.log("aa",$state.params.input)

	if($state.params.input == '')
	{
		//$location.path('app/allpayments')
		$state.go('app.payments')

	}

	console.log($state.params.input)
	
	$scope.uor = $state.params.input.uor;
	//$scope.refId = $state.params.input.nav.UIR;
	$scope.UniqueRefID = $state.params.input.nav.PID;
	$scope.refId='';
	/*$scope.refId = $state.params.input.data.InstructionID;
	$scope.UniqueRefID = $state.params.input.data.PaymentID;	
	$scope.MOPForConfirm = $state.params.input.data.MethodOfPayment;*/
	
	$scope.fromPage = $state.params.input.from;
	

	$scope.isCollapsed = false;
	$scope.isPaymentCollapsed = false;
	$scope.isPaymentInfoCollapsed = true;
	$scope.isPaymentInfoDebitPartyCollapsed = true;
	$scope.isPaymentInfoCreditPartyCollapsed = true;
	$scope.isPaymentInfoRoutingCollapsed = false; 


	$scope.DebtorAgentCollapsed = true;
	$scope.InstructingReimbursementAgentCollapse = true;
	$scope.senderCollapsed = true;
	$scope.CreditorAgentCollapsed = true;
	$scope.IntermediaryAgent1Collapsed = true;
	$scope.IntermediaryAgent2Collapsed = true;
	$scope.ThirdReimbursementAgentCollapsed = true;
	$scope.ReceiversCorrespondentCollapsed = true;
	$scope.DebitSideDetailsCollapsed = true;
	$scope.CreditSideDetailsCollapsed = true;

	$scope.isFileInfoCollapsed = true;
	$scope.morefileInfoCollapsed = false;

    $scope.debitGroup = false;
    $scope.iscreditorGroup = false;
    $scope.additionalPaymntInfoCollapsed = false;
    $scope.additionalProcessingInfoCollapsed = false;
    $scope.fxDetailsCollapsed = false;




	$scope.loading=false;
	$scope.AuditTableLoaded=false;
	$scope.BIDLoaded=false;
	$scope.RelatedMSGLoaded=false;	
	$scope.pagination = false;
	
	$scope.paymentObj = {};
	$scope.dropdownVal = [];
	var payObj = {};
	$scope.valCheck=0;
	$scope.count = 0;


	$scope.IsApproveUser = sessionStorage.ROLE_ID;
	$scope.AccountPostingTab=false;
	$scope.ErrorInfoTab=false;
		
	$scope.paymentRepaired = GlobalService.paymentRepaired;

		if($scope.paymentRepaired)
		{

			$scope.alerts = [{
						type : 'success',
						msg : "Payment Repair details have been forwarded to bank"
					}
				];
			GlobalService.paymentRepaired = false;
		}



	
	
	function fillData(){

		//console.log($scope.dropdownVal.length)



		if($scope.dropdownVal.length > 1){
		
			$scope.pagination = true;
		}
		else{
		
			$scope.pagination = false;
		}
		
		for (var i = 0; i < $scope.dropdownVal.length; i++) { 
			if ($scope.dropdownVal[i]["PaymentID"] == $scope.UniqueRefID) {
				$scope.valCheck = angular.copy(i);	
				if($scope.dropdownVal.length>1)
				{
				  if(($scope.valCheck == ($scope.dropdownVal.length - 1))&&($scope.fromPage != "filedetail")){

                    $scope.count += 20;
					RefService.dropDownLoadMore($scope.count).then(function (items) {
					   
						if(items.data.length){
						    $scope.dropdownVal = $scope.dropdownVal.concat(items.data);
						 }
                    });

				}
			  }

			}
		}

		
		$scope.paymentObj.PaymentID = $scope.UniqueRefID;
		
        $http.post(BASEURL+RESTCALL.AllPaymentListSpecificREST,$scope.paymentObj).then(function (allPaymentlist) {			
            $scope.cData = allPaymentlist.data;

			$scope.refId = $scope.cData.InstructionID;
			$scope.UniqueRefID = $scope.cData.PaymentID;	
			$scope.MOPForConfirm = $scope.cData.MethodOfPayment;

			$scope.showOverride = false;
			$scope.statusCheck = $scope.cData.Status.split('_');

			if($scope.statusCheck[0].toUpperCase() == 'WAITING')
			{
				for(var i=0;i<=$scope.statusCheck.length;i++)
				{
					if($scope.statusCheck[$scope.statusCheck.length-1].indexOf('RESPONSE') != -1)
					{
						$scope.showOverride = true;
					}
				}
			}

				if($scope.statusCheck[0].toUpperCase() == 'TECHNICALFAILURE')
				{
					$scope.showOverride = true;
				}
			


			//$scope.uor = $state.params.input.uor;
				$http.post(BASEURL+RESTCALL.PaymentRelatedMsgREST,{'PaymentID':$scope.UniqueRefID,'InstructionID':$scope.refId}).then(function (paymentRelatedMsg) {
				$scope.relatedMsgs = paymentRelatedMsg.data;
				$scope.rowSpan = $scope.relatedMsgs.length;
				$scope.RelatedMSGLoaded=true;
				$scope.loading=true;
					}, function (err) {
						console.error('ERR', err);
					})

			getForceAction()
			//$("#refreshBtn").focus();

				

		}, function (err) {
			$scope.alerts = [{
					type : 'danger',
					msg : err.data.error.message
				}
			];
		})


		$http.post(BASEURL+RESTCALL.PaymentAuditREST,$scope.paymentObj).then(function (paymentAudit) {
		    $scope.cDataAudit = paymentAudit.data;			
			$scope.AuditTableLoaded=true;
		}, function (err) {
			console.error('ERR', err);
			$scope.AuditTableLoaded=true;
		})

		$http.post(BASEURL+RESTCALL.PaymentBIDREST,$scope.paymentObj).then(function (paymentBID) {
			$scope.cDataBID = paymentBID.data;
			$scope.BIDLoaded=true;
		}, function (err) {
			console.error('ERR', err);
		})

		

			
		

	/*var payTransaction = {};
	payTransaction.UserId = sessionStorage.UserID;
	payTransaction.Data = btoa(JSON.stringify({'UIR':$scope.refId,'URI':$scope.UniqueRefID}));*/

	/*$http.post(BASEURL+RESTCALL.PaymentTransaction,{'PaymentID':$scope.UniqueRefID,'InstructionID':$scope.refId}).then(function (response) {
            $scope.transactionalData = response.data;
        }, function (err) {
			console.error('ERR', err);
		})*/

		$http.post(BASEURL+'/rest/v2/payments/accountposting/readall',$scope.paymentObj).success(function (data, status, headers, config) {
			$scope.AccountPostingTab=true;
			$scope.accountPostingDetails=data;
			console.log($scope.accountPostingDetails,"$scope.accountPostingDetails")
		}).error(function (data, status, headers, config) {
			console.log(data);
		})
		
		
		$http.post(BASEURL+'/rest/v2/payments/errorinformation/readall',$scope.paymentObj).success(function (data, status, headers, config) {
			$scope.ErrorInfoTab=true;
			$scope.errorInformationData=data;
		}).error(function (data, status, headers, config) {
			console.log(data);
		})
	

		$http.post(BASEURL+RESTCALL.linkedPayements,$scope.paymentObj).success(function (data, status, headers, config) {
			$scope.linkedPayments=data;
			console.log(data)
		}).error(function (data, status, headers, config) {
			console.log(data);
		})

		//console.log($state.params.input)

		

		

        /*** Payment Process Data ***/
		/* $http.post(BASEURL+RESTCALL.PaymentProcess,payObj).then(function (response) {

			$scope.formatedRawData = response.data.formattedRawData

		//	console.log($scope.formatedRawData)

		}, function (err) {
			console.error('ERR', err);
		}) */

		
    }


	/*$scope.gotoPaymentSummary = function(uor)
	{
		console.log($state.params.input)
		$state.go('app.outputpaymentsummary',{input:{'uor':uor,'from':$state.params.input.from}})
	}*/

	$scope.textDocDownload = function(data)
	 {
			bankData.textDownload($filter('hex2a')(data.OutputMessage), data.UniqueOutputReference);
	 }



	$scope.fetchDataAgain = function()
	{
		fillData()
	}


     if(sessionStorage.InstructionPaymentNotes==undefined){
        $scope.NotesArr=[];
    }else{
        $scope.NotesArr=JSON.parse(sessionStorage.InstructionPaymentNotes);
    }

	$scope.data={};
	$scope.addNotes = function(notes,toDetails){
		$scope.Notes = {
							"InstructionID": toDetails.InstructionID,
							"PaymentID": toDetails.PaymentID,
							"Notes": notes.notes
						}
		$http.post(BASEURL+'/rest/v2/payments/notes',$scope.Notes).then(function (notes) {
			     $scope.alerts = [{
            					type : 'success',
            					msg : notes.data.responseMessage
            				}
            			];

            	$timeout(function(){
            	    $('.alert-success').hide;
            	},5000)

			$scope.data.notes = ''
			$('.modal').modal('hide')

                $http.post(BASEURL+RESTCALL.PaymentAuditREST,$scope.paymentObj).then(function (paymentAudit) {
					$scope.cDataAudit = paymentAudit.data;
					$scope.AuditTableLoaded=true;
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
    $scope.findExistingObj = function(data,PaymentID){
        $scope.fileObjExistingFlag=false;
        for(i=0;i<$scope.NotesArr.length;i++){
            if($scope.NotesArr[i].PaymentID==PaymentID){
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
	

    $scope.ExistingPaymentNodes=false;
    $scope.addPaymentNotes = function(data,PaymentID)
    {
        data.PaymentID=PaymentID;
        data=$scope.findExistingObj(data,PaymentID)		
        sessionStorage.InstructionPaymentNotes = JSON.stringify($scope.NotesArr);


    }
	
	
	//$scope.addNotes($state.params.input.data);

    

    $scope.getExistingPaymentNotes=function(PaymentID){
         $scope.ExistingPaymentNodes=false;
            for(i=0;i<$scope.NotesArr.length;i++){
                    if($scope.NotesArr[i].PaymentID==PaymentID){
                        $scope.data.notes=$scope.NotesArr[i].notes;
						$scope.data.NoteBy=$scope.NotesArr[i].NoteBy;
						$scope.data.Datetime=$scope.NotesArr[i].Datetime;
                        $scope.ExistingPaymentNodes=true;
                    }
                }
            if(!$scope.ExistingPaymentNodes)
            {
             $scope.data.notes="";
            }
    }

    $scope.getExistingPaymentNotes($scope.UniqueRefID)

 */

	
	//console.log($scope.fromPage);
	if($scope.fromPage == "filedetail")
	{

        $scope.dropdownVal = GlobalService.allFileListDetails;
		fillData()
	}
    else{


		$scope.dropdownVal = [];
		$scope.dropdownVal = (AllPaymentsGlobalData.allPaymentDetails)?AllPaymentsGlobalData.allPaymentDetails:[];
		fillData();
	}

	$scope.NrP = function(val){
			console.log(val)
		if(val != ''){
			$("#SelectedUniqueReferenceId :selected")[val]().prop("selected", true);
		}
		$scope.UniqueRefID = $("#SelectedUniqueReferenceId :selected").val()
		$('.panel').addClass('fade-in-up');
		if($scope.UniqueRefID != ''){
			fillData();			
		}
		$timeout(function() {
			$('.panel').removeClass('fade-in-up');
		}, 500);
	}
	

$scope.goToRepair = function(val) {
        GlobalService.fileListId = val.data.InstructionID;
		GlobalService.UniqueRefID = val.data.PaymentID;
		GlobalService.fromPage = val.fromPage;

		$state.go('app.payment-repair',{input:val})
	}

    $scope.goToWaitforApproval = function(URI,RepairID){
        GlobalService.repairURI = URI;
        GlobalService.repairId = RepairID;
        $location.path('app/waitforpaymentapproval')
    }

	$scope.gotoFiledetail = function (id) {
		GlobalService.fileListId = id;
		$state.go('app.filedetail', {
			input: $state.params
		})

		//$location.path('app/filedetail')

	}

	$scope.multipleEmptySpace = function (e) {
            if($.trim($(e.currentTarget).val()).length == 0)
            {
            $(e.currentTarget).val('');
            }
    }


	$scope.exportToDoc = function(msg)
	{
	//console.log($filter('hex2a')(msg.MessageContents))
    bankData.textDownload($filter('hex2a')(msg.MessageContents),msg.GroupInteractionUniqueID+"_"+msg.MessageInteractionUniqueID);
	}


    $scope.ExportForIE = function()
    {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf("MSIE");
        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
        var table_html = ($('#pymntDetailTable').html()).concat($('#fileInfoTable').html()).concat($('#pymntInfoTable').html()).concat($('#tableExport').html());
       // var content2 = $('#tableExport').html();
        bankData.exportToExcelHtml(table_html, $scope.cData.InstructionID+"_"+$scope.cData.OriginalPaymentReference);
        }
    }

	



    var tablesToExcel = (function() {

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

			console.log(tables,wsnames,wbname,appname)
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


         wbname = $scope.cData.InstructionID+"_"+$scope.cData.OriginalPaymentReference+".xls"
		  

          var link = document.createElement("A");
          link.href = uri + base64(workbookXML);
          link.download = wbname || 'Workbook.xls';
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      })();


      $('#exportBtn').click(function(){

         var ua = window.navigator.userAgent;
         var msie = ua.indexOf("MSIE");

        if (msie > 0 || !!navigator.userAgent.match(/Trident.*rv\:11\./))  // If Internet Explorer, return version number
        {
            $scope.ExportForIE();
        }
        else
        {
			tablesToExcel(['val1','flInfo','val2','tab1','tab2','tab3','tab4'], ['Payment Details','File Information','Payment Information','Payment Event Log','System Interaction','External Communications','Transaction Details'], 'TestBook.xls', 'Excel');

		//tablesToExcel(['val1','flInfo','val2','tab1'], ['Payment Details','File Information','Payment Information','aaa'], 'TestBook.xls', 'Excel');
        }
    })

    function objectFindByKey(array, key, value) {
		var findArr=[];
		for (var i = 0; i < array.length; i++) {
				//console.log(array[i])
			if (array[i][key] === value) {				
				findArr.push(array[i]);
			}
		}
		if(findArr.length>0){
			return findArr;
		}else{
			return null;
		}
	}


	function getForceAction() {

		$http.post(BASEURL + '/rest/v2/partyserviceassociations/read', {
			'PartyServiceAssociationCode' : $scope.cData.InstructionData.PartyServiceAssociationCode
		}).then(function (response) {
			//console.log(response.data.ProcessCode)
			$scope.ProcessCode = response.data.ProcessCode;

			$http.post(BASEURL + '/rest/v2/actions', {
				"ProcessStatus" : $scope.cData.Status,
				"WorkFlowCode" : "PAYMENT",
				"ProcessName" : $scope.ProcessCode
			}).then(function (response) {
				if(response.data.length>0){
					$scope.enableActionbuttons=response.data;
				}
				console.log(response.data);
			}, function (err) {
				console.error('ERR', err);
			})

		}, function (err) {
			console.error('ERR', err);
		})
		
	
		
		/* var enableActionbuttons='';
			 $http.get(BASEURL + '/rest/v2/actionhandler/readall').success(function (data) {
				if(data.length>0){			
					var thisPageNewActions=objectFindByKey(data,'ProcessStatus',$state.params.input.data.Status);
						$scope.enableActionbuttons=thisPageNewActions
											
				}
				else{
					if(sessionStorage.ColpData!=undefined){
						$scope.ColpData=JSON.parse(atob(sessionStorage.ColpData));
						console.log($scope.ColpData);
						if($scope.ColpData.length>0)
						{
							var thisPageNewActions=objectFindByKey($scope.ColpData,'Page',$location.path());
								if(thisPageNewActions.Page==$location.path()){
									$scope.enableActionbuttons=thisPageNewActions.CurrentState;
									//console.log($scope.enableActionbuttons)
								}
							}
						}
				}
				
			 }).error(function (error) {}) */
	}
	
	//getForceAction()
	
/* 	var enableActionbuttons='';
	if(sessionStorage.ColpData!=undefined){
	$scope.ColpData=JSON.parse(atob(sessionStorage.ColpData));
	console.log($scope.ColpData);
	if($scope.ColpData.length>0)
	{
		var thisPageNewActions=objectFindByKey($scope.ColpData,'Page',$location.path());
			if(thisPageNewActions.Page==$location.path()){
				$scope.enableActionbuttons=thisPageNewActions.CurrentState;
				//console.log($scope.enableActionbuttons)
			}
		}
	}
	 */
	
	function getProcessCode(val){			
			 $http.post(BASEURL+'/rest/v2/partyserviceassociations/read',{'PartyServiceAssociationCode':val}).then(function (response) {
				//console.log(response.data.ProcessCode)
				$scope.ProcessCode = response.data.ProcessCode;
				return response.data.ProcessCode;
			}, function (err) {
				console.error('ERR', err);
			})
		}
	
		
	$scope.forceAction=function(items,actions){
		//console.log(items)
		//console.log(actions)
			
		
		var obj1={};
		obj1.payments=[{"PaymentID": items.PaymentID}];		
		console.log(obj1)		
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
			$scope.alerts = [{
				type : 'success',
				msg : 'Success'
			}];
			if((actions.SuccessURL!='')&&(actions.SuccessURL!=undefined)){
				$location.path(actions.SuccessURL);
			}else{
				//alert("Success");
				$location.path('app/allpayments')
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
				$location.path('app/allpayments')
			}
			
		});  
		 
	}	

	
	
		$scope.resendAction=function(values){
			console.log(values)
			
			var obj1={};
			obj1.GrpReferenceId=values.GrpReferenceId;
			obj1.InvocationPoint=values.InvocationPoint;
			obj1.Relationship=values.Relationship;
			obj1.Status=values.Status;
			console.log(obj1)
			console.log(BASEURL+'/rest/v2/interface/request/resend')
			
			
			 $http({
				url : BASEURL+'/rest/v2/interface/request/resend',
				method :'POST',
				data : obj1,
				headers : {
					'Content-Type' : 'application/json'
				}
				}).success(function (data, status, headers, config) {
					console.log(data);
					//$location.path(actions.SuccessURL);
				}).error(function (data, status, headers, config) {
					$scope.alerts = [{
						type : 'danger',
						msg : data.error.message
					}];
					//$location.path(actions.failureURL);
				}); 
			}

	$scope.fetchedData = {};

	$scope.fetchData = function(addButtons)
	{
		var Inputdata={}
		Inputdata[addButtons.InputObjKey]=$scope.UniqueRefID;
		
		
		var method=addButtons.REST_Method;
		var REST_URL='/rest'+addButtons.REST;
		
		$http({
			url : BASEURL + REST_URL,
			method :method,
			data : Inputdata,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function(data){
	    $scope.fetchedData = data;
	    console.log($scope.fetchedData)
			if((addButtons.SuccessURL!='')&&(addButtons.SuccessURL!=undefined)){
				$location.path(addButtons.SuccessURL);
			}

	    }).error(function(){
			if((addButtons.failureURL!='')&&(addButtons.failureURL!=undefined)){
				$location.path(addButtons.failureURL);
			}	
	    })
	}

	
	var modalPopButton='';
	if(sessionStorage.PopUpAddonData!=undefined){
	$scope.PopUpAddonData=JSON.parse(atob(sessionStorage.PopUpAddonData));
	console.log($scope.PopUpAddonData);
	if($scope.PopUpAddonData.length>0)
	{
		console.log($scope.PopUpAddonData)
		var thisPageNewActions=objectFindByKey($scope.PopUpAddonData,'Page',$location.path());
		console.log(thisPageNewActions)
			if(thisPageNewActions[0].Page==$location.path()){
				$scope.modalPopButton=thisPageNewActions[0].CurrentState;
				console.log($scope.modalPopButton)
			}
		}
	}

	$scope.paymentConfirm = function (confirm1, MOPForConfirm) {
	confirm1.InstructionID = $scope.refId;
		//console.log(confirm1,$scope.refId)
		$http.post(BASEURL + '/rest/v2/confirmation/' + MOPForConfirm, confirm1).success(function (data, status, headers, config) {
			
			$scope.alerts = [{
					type : 'success',
					msg : data.responseMessage
				}
			];

		$('.modal').modal('hide')
		}).error(function (data, status, headers, config) {
			console.log(data)
			$scope.alerts = [{
						type : 'danger',
						msg : data.error.message
					}];
		});
	}
	
	
	
	$scope.clickReferenceID = function (val) {
		
		console.log(val)
		/*val.data.PaymentID=val.LinkedMsgID;
        GlobalService.fileListId = val.InstructionID;
		GlobalService.UniqueRefID = val.LinkedMsgID;
		GlobalService.fromPage = val.fromPage;

		$state.go('app.paymentdetail',{input:val}) */


		GlobalService.fileListId = val.data.InstructionID;
		GlobalService.UniqueRefID = val.data.PaymentID;
		GlobalService.fromPage = val.fromPage;
       


        $scope.Obj = {
		'uor':(val.data.OutputInstructionID)?val.data.OutputInstructionID:'',
		'nav':{
			  'UIR':val.data.InstructionID,
			  'PID':val.data.PaymentID
				},
		'from': val.fromPage
	    }

		
		$state.go('app.paymentdetail', {
			input: $scope.Obj
		})

	}

	$scope.goToPaymentSummary = function(val)
{
	console.log($state.params.input,$scope.refId)
	//$state.go('app.outputpaymentsummary',{input:{'uor':val}})

	$scope.Obj = {
		'uor':val,
		'nav':{
			  'UIR':$scope.refId,
			  'PID':$scope.UniqueRefID
				},
		'from': $state.params.input.from
		//'from': ($scope.fromPage == 'allpayments')?'allpayments':'filedetail'
	}

	$state.go('app.outputpaymentsummary',{input:$scope.Obj})
}
	
$scope.paymentOverride = function()
{
	$scope.pVal = {
		'PID':$scope.UniqueRefID,
		'UIR':$state.params.input.nav.UIR,
		'from':$state.params.input.from,
		'uor':$state.params.input.uor
		
	}
		
	$state.go('app.interfaceoverride',{input:$scope.pVal})
}

	
	/*$scope.gotoBulk = function()
	{
	    $state.go('app.newmodules', {url:'bulkpayments',tempUrl:"plug-ins/modules/bulkpayments",contrl:'paymentforbulkingCtrl'});
	}*/


	/*$scope.fetchCustomDetail = function()
	{
	    $http.post(BASEURL+RESTCALL.PaymentCustomDetail,{"UNIQUEREFERENCEID":$scope.UniqueRefID}).success(function(data)
	    {       if(data)
                {
                    $scope.customData = data;
                    $scope.customDataFound = true;
                }
                else
                {
                    $scope.customDataFound = false;
                }
	    }).error(function(data){
	        console.log(data)
	    })
	}*/
 //--------------Fixed Table Header Starts----------------------
// 			function autoScrollDiv(){
// 						$(".dataGroupsScroll").scrollTop(0);
// 			}


// 	$(document).ready(function () {
// 			 $scope.callingStickyHeader = function(flag){
// 				//console.log($(".floatThead-container").offset().top,$('.FixHead').find("table").offset().top)
// 					 setTimeout(function(){
// 						if(flag == false){
// 								$("div").find(".floatThead-container").css("transform","");	
// 								if($('.FixHead').scrollTop() == 0){
// 									$(window).scrollTop($(document).height())
// 								}

// 						}
// 						else{
// 							$(window).scrollTop($(window).scrollTop()+80);
// 						    $('.FixHead').scrollTop(50)
// 						}
// 					 },500)
// 				console.log(flag)
// 			}


// 		$(".FixHead").scroll(function (e) {
// 			var ref_this = $("ul.nav-tabs").find(".active");
//  			var get_target = ref_this.find("a").attr("data-target");

// 		if ($('.FixHead').scrollTop() > $(get_target).find("thead").height())
// 		{

//             var $tablesToFloatHeaders = $(get_target).find("table");
// 			//console.log($tablesToFloatHeaders)
// 			$tablesToFloatHeaders.floatThead({
// 				position: 'fixed',
// 				scrollContainer: true
// 			})
// 			$tablesToFloatHeaders.each(function () {
// 				var $table = $(this);
// 				//console.log($table.find("thead").length)
// 				$table.closest('.FixHead').scroll(function (e) {
// 					$table.floatThead('reflow');
// 				});
// 			});
// 		}

//  })
		
// })    --------------Fixed Table Header End----------------------

			


		// 		function moveScroll() {
		// 			var ref_this = $("ul.nav-tabs").find(".active");
		// 			var get_target = ref_this.find("a").attr("data-target");
		// 			//console.log( $('.FixHead').scrollTop(),$(get_target).find("thead").height())
		// 	        var currentTabHeader = $(get_target).find("thead").clone().attr("class","replaceNewHeader");
		// 			if ($('.FixHead').scrollTop() > $(get_target).find("thead").height())
		// 			{
        //              ///  $(get_target).find("tbody").find("tr").css("color","red")
					   
		// 			   $(".overflowPaymentSection").find("thead").after(currentTabHeader.css({"position":"absolute"}));
		// 			   console.log(currentTabHeader)
		// 			   console.log($("thead.replaceNewHeader").length)
		// 			   if($("thead.replaceNewHeader").length>1)
		// 			   {
		// 					//$("thead.replaceNewHeader").remove();
		// 					$(".overflowPaymentSection").find("thead").remove();
							
		// 					//$(".overflowPaymentSection").find("thead").after(currentTabHeader.css({"position":"absolute"}));
		// 					//$(".overflowPaymentSection").find('table').append(currentTabHeader).css({"position":"absolute"});

		// 			   }
		// 			   else
		// 			   {
		// 					// $(".overflowPaymentSection").before(currentTabHeader.css({"position":"absolute"}));
		// 			   }
					  
		// 			  // console.log( $(".nav-tabs").append(currentTabHeader.html()));
		// 			}
		// 			else{
		// 				//$(get_target).find("tbody").find("tr").css("color","blue")
		// 				// $(".nav-tabs").append(currentTabHeader.css("display","hidden"));
		// 			}
        //           }
				
			
		// $('.FixHead').scroll(moveScroll);


		

	// 	$(window).bind("resize",function(){
	// 		// console.log($(".dataGroupsScroll").scrollTop())
	// 		// if($(".dataGroupsScroll").scrollTop() == 0){
	// 		// 	$(".dataGroupsScroll").scrollTop(50)
	// 		// }
	// 		setTimeout(function(){
	// 					$(".dataGroupsScroll").scrollLeft(2);
	// 					$(".dataGroupsScroll").scrollTop(2)
	// 		},300)

    //   })
	// 	$(window).trigger('resize'); 
	
	

    //console.log($state.params)
    $scope.iteratedObj = {};
    $scope.fieldDetails = [];
    $scope.objectIttration = function(argu,k,l){

		//console.log("argu",argu,k,l)
		for (var key in argu) {
			
			if (argu.hasOwnProperty(key)) {				
				if(typeof(argu[key]) == 'object'){
								
					$scope.objectIttration(argu[key],k,l);						
					if(($scope.obtainThisKeys).indexOf(key) != -1 && !(key in $scope.iteratedObj)){
						$scope.iteratedObj[key] = argu[key]	
					}							
				}
				else{
					//console.log('else',key,obj[key])						
					if(($scope.obtainThisKeys).indexOf(key) != -1 && !(key in $scope.iteratedObj)){
						$scope.iteratedObj[key] = argu[key]	
					}
				}
			}
		}
		return $scope.iteratedObj
	}
	
	$scope.fieldData = {};

	$scope.PayId = $scope.UniqueRefID;

	$scope.callInterfaceOverride = function(){
		
	$scope.iteratedObj = {};
    $scope.fieldDetails = [];
	$scope.fieldData = {};
		
		/*$scope.alerts1 = [{
				type : 'danger',
				msg : 'Please fill all the mandatory fields'
			}];*/

			$('.alert-danger').hide()


    $http.post(BASEURL+RESTCALL.PaymentInterface,{"PaymentID":$scope.PayId}).then(function(val){
		
		$scope.allResponse = val;
		
		
        $scope.globalObj = angular.copy(val.data);
		$scope.globalObj.CMetaInfo = JSON.parse(atob($scope.globalObj.metaInfo)).Data;
		$scope.globalObj.CData = JSON.parse(atob($scope.globalObj.data));
		console.log($scope.globalObj.CData)
		
		
		
		
		$timeout(function(){

			$scope.fieldData = $scope.globalObj.CData;
		},100)
		

		$scope.backupData = angular.copy($scope.globalObj.CData)
		
	
		
		$scope.fieldDetails = [];
$scope.iteratedObj = {}

		$scope.webformIttration = function(argu){
		
			var obtainedFields = argu.webformuiformat.fields.field;
			$scope.obtainThisKeys = ['name','type','columnspan','rowspan','enabled','label','labelposition','newrow','notnull','visible','width','renderer','customsectionlayout','indentsubfields','maxoccurs','minoccurs','sectionheader','showsectionheader','dateformat','property','choiceOptions']
			var k ='';
			var j = ''
			for(j in obtainedFields){
				if(obtainedFields[j].type != 'Section'){

					$scope.fieldDetails.push($scope.objectIttration(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field))
				}
				else if(obtainedFields[j].type == 'Section'){

					$scope.iteratedObj['sectionlabel'] = obtainedFields[j].name;
					$scope.fieldDetails.push({
						'name':obtainedFields[j].name,
						'type':obtainedFields[j].type,
						'showsectionheader':obtainedFields[j].fieldGroup1.webformsectiongroup.showsectionheader,
						'sectionheader':obtainedFields[j].fieldGroup1.webformsectiongroup.sectionheader,
						'indentsubfields':obtainedFields[j].fieldGroup1.webformsectiongroup.indentsubfields,
						'customsectionlayout':obtainedFields[j].fieldGroup1.webformsectiongroup.customsectionlayout,
						'minoccurs':obtainedFields[j].fieldGroup1.webformsectiongroup.minoccurs,
						'maxoccurs':obtainedFields[j].fieldGroup1.webformsectiongroup.maxoccurs,
						'subArr':[]

					})

					for(k in obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field){
						if(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].type == "Section")
						{
							if(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.maxoccurs == -1)
								{
									$scope.fieldDetails[j]['subArr'].push(iterateSubArr(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k],false))	
								}
								else
								{
									$scope.fieldDetails[j]['subArr'].push(iterateSubObj(obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k].fieldGroup1.webformsectiongroup.fields.field, obtainedFields[j].fieldGroup1.webformsectiongroup.fields.field[k],false))	
								}
						}

						for(l in Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)){
							if(($scope.obtainThisKeys).indexOf(Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]) != -1){

								$scope.iteratedObj[Object.keys(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]] = Object.values(obtainedFields[j].fieldGroup1.webformsectiongroup)[l]
							}						
						}							
						$scope.iteratedObj = {}
					}
				}						
			}
			
			return $scope.fieldDetails
	}

	
	$scope.webformIttration($scope.globalObj.CMetaInfo)


	function iterateSubObj(argu,group,flag)
	{
			$scope.section = {};
				
				$scope.section = {

						'name':group.name,
						'type':group.type,
						'showsectionheader':group.fieldGroup1.webformsectiongroup.showsectionheader,
						'sectionheader':group.fieldGroup1.webformsectiongroup.sectionheader,
						'indentsubfields':group.fieldGroup1.webformsectiongroup.indentsubfields,
						'customsectionlayout':group.fieldGroup1.webformsectiongroup.customsectionlayout,
						'minoccurs':group.fieldGroup1.webformsectiongroup.minoccurs,
						'maxoccurs':group.fieldGroup1.webformsectiongroup.maxoccurs,
						'subArr': []


				}
		
					var iArr = [];
		
				for(var i in argu)
				{
					
					if(argu[i].type != 'Section')	
					{
						$scope.section.subArr.push($scope.objectIttration(argu[i]))
					}
					else{
						$scope.section =  subsectionIterate($scope.section,argu[i],argu[i].fieldGroup1.webformsectiongroup.fields.field)
					}
					
					$scope.iteratedObj = {}
				}
				return $scope.section; 
	}

	function iterateSubArr(argu,group,flag)
	{

		console.log("iterate",argu,group,flag)

		$scope.section  = {};
	
		$scope.section = {
						'name':group.name,
						'type':group.type,
						'showsectionheader':group.fieldGroup1.webformsectiongroup.showsectionheader,
						'sectionheader':group.fieldGroup1.webformsectiongroup.sectionheader,
						'indentsubfields':group.fieldGroup1.webformsectiongroup.indentsubfields,
						'customsectionlayout':group.fieldGroup1.webformsectiongroup.customsectionlayout,
						'minoccurs':group.fieldGroup1.webformsectiongroup.minoccurs,
						'maxoccurs':group.fieldGroup1.webformsectiongroup.maxoccurs,
						'subArr':[]
		}


		var iArr = [];
		for(var i in argu)
		{
			
			if(argu[i].type != 'Section')	
			{

				iArr.push($scope.objectIttration(argu[i]))
			}
			else{
				$scope.section.subArr.push({'fields':iArr});
				subsectionIterateArr($scope.section,argu[i],argu[i].fieldGroup1.webformsectiongroup.fields.field)
			}
			
			$scope.iteratedObj = {}
		}

			

			

			console.log("fieldDetails",$scope.fieldDetails,$scope.globalObj.CData[$scope.fieldDetails[0].name][group.name])

			for(var x in $scope.fieldDetails,$scope.globalObj.CData[$scope.fieldDetails[0].name][group.name])
			{
				$scope.section.subArr.push({'fields':iArr});
			}
			
			iArr = [];
			return $scope.section;

			
				
	}


	function subsectionIterate(obj,arg1,arg2)
	{
		$scope.subArr = {
				'name':arg1.name,
				'type':arg1.type,
				'showsectionheader':arg1.fieldGroup1.webformsectiongroup.showsectionheader,
				'sectionheader':arg1.fieldGroup1.webformsectiongroup.sectionheader,
				'indentsubfields':arg1.fieldGroup1.webformsectiongroup.indentsubfields,
				'customsectionlayout':arg1.fieldGroup1.webformsectiongroup.customsectionlayout,
				'minoccurs':arg1.fieldGroup1.webformsectiongroup.minoccurs,
				'maxoccurs':arg1.fieldGroup1.webformsectiongroup.maxoccurs,
				'subArr':[]
		};

		for(var i in arg2)
		{
			$scope.subArr.subArr.push($scope.objectIttration(arg2[i]))
		}

		obj.subArr.push($scope.subArr)
		
		return obj;
	}

	function subsectionIterateArr(obj,arg1,arg2)
	{
		$scope.subArr = {
				'name':arg1.name,
				'type':arg1.type,
				'showsectionheader':arg1.fieldGroup1.webformsectiongroup.showsectionheader,
				'sectionheader':arg1.fieldGroup1.webformsectiongroup.sectionheader,
				'indentsubfields':arg1.fieldGroup1.webformsectiongroup.indentsubfields,
				'customsectionlayout':arg1.fieldGroup1.webformsectiongroup.customsectionlayout,
				'minoccurs':arg1.fieldGroup1.webformsectiongroup.minoccurs,
				'maxoccurs':arg1.fieldGroup1.webformsectiongroup.maxoccurs,
				'subArr':[]
		};

		var iArr1 = [];
		for(var i in arg2)
		{
			iArr1.push($scope.objectIttration(arg2[i]))
			$scope.iteratedObj = {}
		}
		
		$scope.subArr.subArr = iArr1
		iArr1 = [];
		obj.subArr[0].fields.push($scope.subArr);
		obj.subArr.splice(0,1)
		return obj;
	}
},function(data){
	console.log(data)
		$scope.alerts1 = [{
						type : 'danger',
						msg : data.data.error.message
					}
				];
				

	})
	
	
	}
	
	
	
	
	$scope.iteratedFields = [];

	function constructObj(inFields)
	{
		
		for(var i in inFields)
		{
			if(inFields[i].type != 'Section'){
					console.log(inFields[i])
			}
			else if(inFields[i].type == 'Section'){

				$scope.iteratedFields.push({
						'name':inFields[i].name,
						'type':inFields[i].type,
						'showsectionheader':inFields[i].fieldGroup1.webformsectiongroup.showsectionheader,
						'sectionheader':inFields[i].fieldGroup1.webformsectiongroup.sectionheader,
						'indentsubfields':inFields[i].fieldGroup1.webformsectiongroup.indentsubfields,
						'customsectionlayout':inFields[i].fieldGroup1.webformsectiongroup.customsectionlayout,
						'minoccurs':inFields[i].fieldGroup1.webformsectiongroup.minoccurs,
						'maxoccurs':inFields[i].fieldGroup1.webformsectiongroup.maxoccurs,
						'group':[]
						
				})
					$scope.TempVal = [];


						for(var j in inFields[i].fieldGroup1.webformsectiongroup.fields.field)
						{
							if(inFields[i].fieldGroup1.webformsectiongroup.fields.field[j].type == 'Section')
								{
									
									constructObj(inFields[i].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformsectiongroup.fields.field)

								}

							
											
						}
						$scope.iteratedObj = {}
					}	
		}
	}


	$scope.cleantheinputdata = function(newData){

		$.each(newData, function(key,value){
			//console.log(key,value)
			delete newData.$$hashkey;

			if($.isPlainObject(value)){	
				var isEmptyObj = $scope.cleantheinputdata(value)				
				if($.isEmptyObject(isEmptyObj)){
					delete newData[key]
				}
			}
			else if(Array.isArray(value)){
				$.each(value, function(k,v){
					var isEmptyObj = $scope.cleantheinputdata(v)	
				})
			}
			else if(value === "" || value === undefined || value === null){
				delete newData[key]
			}
		})
		
		return newData
	}


	$scope.formSubmitted = false;
	$scope.interfaceSubmit = function(val)
	{
		$scope.formSubmitted = true;

		

		val = $scope.cleantheinputdata(val)
		$scope.responseObj = {
							"paymentID": $scope.PayId,
							"domainInWebFormName": $scope.globalObj.metaInfoName,
							"DomainIn": btoa(JSON.stringify(val))
							}

		$http.post(BASEURL+RESTCALL.PaymentInterfaceOverride,$scope.responseObj).success(function(data)
		{
			$('.modal').modal('hide')

			$scope.alerts = [{
				type : 'success',
				msg : data.responseMessage
			}]


			
		}).error(function(data)
		{
				console.log(data)
				$scope.alerts1 = [{
				type : 'danger',
				msg : data.error.message
			}
		];
		})

		
	}

	$scope.checkForm = function()
	{
		
		/*if(!$scope.formSubmitted)
		{
			$scope.alerts1 = [{
				type : 'danger',
				msg : 'Please fill all the mandatory fields'
			}];
		}*/

	}


		$scope.sectionCnt=0;
	$scope.addsubSection = function(x)
	{	

			$scope.sectionCnt ++;
		//console.log($scope.sectionCnt,x.subArr.length)
			if($scope.sectionCnt == x.subArr.length)
			{
				$scope.sectionCnt = x.subArr.length-1;
				
			}
			console.log($scope.sectionCnt,x.subArr.length)
			$('.'+x.name).css('display','none')
			$('#'+x.name+'_'+$scope.sectionCnt).css('display','block')

		//console.log(x,y,z)
		//z.subArr.push({'fields':y.fields})
		//console.log(z)
		//console.log("fieldDetails",$scope.fieldDetails)
		//$scope.fieldDetails[0].subArr[1].subArr.push(y)
		//console.log("fieldDetails",$scope.fieldDetails)
		
		

	}

	$scope.removesubSection = function(x)
	{
		$scope.sectionCnt --;
		//console.log($scope.sectionCnt,x.subArr.length)
			if($scope.sectionCnt < 0 )
			{
				$scope.sectionCnt = 0;
				
			}

console.log($scope.sectionCnt,x.subArr.length)
		$('.'+x.name).css('display','none')
		$('#'+x.name+'_'+$scope.sectionCnt).css('display','block')

	}

	$scope.multipleEmptySpace = function (e) {
		if($.trim($(e.currentTarget).val()).length == 0)
		{
		$(e.currentTarget).val('');
		}
		if($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')){
			$(e.currentTarget).data("DateTimePicker").hide();
		}
	}

	$scope.checkType = function (eve, type) {

		var compareVal = '';
		var regex = {
			'Integer' : /^[0-9]$/,
			'BigDecimal' : /^[0-9.]$/,
			'Double': /^[0-9.]$/,
			'String' : /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i
		}
		for (var keys in regex) {
			if (type === keys) {
				compareVal = regex[type]
			}
		}

		if (compareVal.test(eve.key) || eve.keyCode == 16 || eve.keyCode == 36 || eve.keyCode == 46 || eve.keyCode == 8 || eve.keyCode == 9 || eve.keyCode == 35 || eve.keyCode == 37 || eve.keyCode == 39 || eve.keyCode == 38 || eve.keyCode == 40) {
			return true
		} else {
			eve.preventDefault();
		}
	}



	$scope.resetInterface = function()
	{
		$scope.fieldData = angular.copy($scope.backupData);
	}


	$scope.gotoPaymentDetail = function()
	{

		

		GlobalService.fileListId = $state.params.input.UIR;
		GlobalService.UniqueRefID = $state.params.input.PID;
		GlobalService.fromPage = $state.params.input.from;
       


        $scope.Obj = {
		'uor':$state.params.input.uor,
		'nav':{
			  'UIR':$state.params.input.UIR,
			  'PID':$state.params.input.PID
				},
		'from': $state.params.input.from
	    }

		$state.go('app.paymentdetail', {
			input: $scope.Obj
		})
	}

	
	$scope.widthOnScroll = function()
    	{	var mq = window.matchMedia( "(max-width: 991px)" );
    		var headHeight
    		if (mq.matches) {
    		 headHeight =0;
    		 $scope.alertWidth = $('.pageTitle').width();
    		} else {
    		   $scope.alertWidth = $('.pageTitle').width();
    			headHeight = 10;
			}
			$scope.alertStyle=headHeight;
    	}

			$scope.widthOnScroll();
			

	$(window).bind('scroll',function()
	{
		$scope.widthOnScroll()
	})

	$scope.activatePicker = function(e){

		var prev = null;
		$('.DatePicker').datetimepicker({
			format:"YYYY-MM-DD",
			useCurrent: false,
			showClear: true
		}).on('dp.change', function(ev){				
			var pId = $(ev.currentTarget).parent().attr('data')
			pId = pId.split('_')
			$scope.fieldData[pId[0]][pId[1]][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val();
		}).on('dp.show', function(ev){
				
	}).on('dp.hide', function(ev){

	});



		$('.TimePicker').datetimepicker({
			format: 'HH:mm:ss',
			useCurrent: false,
		}).on('dp.change', function(ev){
			var pId = $(ev.currentTarget).parent().attr('data')
			pId = pId.split('_')
			$scope.fieldData[pId[0]][pId[1]][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val();
		}).on('dp.show', function(ev){
					
		}).on('dp.hide', function(ev){
			
		});


		$('.DateTimePicker').datetimepicker({
			format : "YYYY-MM-DDTHH:mm:ss",
			useCurrent : false,
			showClear : true
		}).on('dp.change', function (ev) {
			
			var pId = $(ev.currentTarget).parent().attr('data')
			pId = pId.split('_')
			$scope.fieldData[pId[0]][pId[1]][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val();
		}).on('dp.show', function (ev) {
			
		}).on('dp.hide', function (ev) {
			
		});

		$('.ISODateTime').datetimepicker({
			format : "YYYY-MM-DDTHH:mm:ssZZ",
			useCurrent : false,
			showClear : true
		}).on('dp.change', function (ev) {
			
			
			var isoDate = moment(e.date).format().split('+')
			$(ev.currentTarget).val(isoDate[0]+":"+new Date().getMilliseconds()+'+'+isoDate[1])
			

			var pId = $(ev.currentTarget).parent().attr('data')
			pId = pId.split('_')
			$scope.fieldData[pId[0]][pId[1]][$(ev.currentTarget).attr('id')] = $(ev.currentTarget).val();
		}).on('dp.show', function (ev) {
			var isoDate = moment(e.date).format().split('+')
			$(ev.currentTarget).val(isoDate[0]+":"+new Date().getMilliseconds()+'+'+isoDate[1])
		}).on('dp.hide', function (ev) {
			
		});

		

	 }


	 $scope.triggerPicker = function(e)
	  {
		   if($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker','.ISODateTime')){			
			$scope.activatePicker($(e.currentTarget).prev());
			$('input[name='+$(e.currentTarget).prev().attr('name')+']').data("DateTimePicker").show();
			}
	  }

  


});
