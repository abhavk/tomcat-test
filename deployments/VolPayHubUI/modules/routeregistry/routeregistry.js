VolpayApp.controller('routeregistryCtrl', function ($scope, $http, $rootScope, $timeout, GlobalService, bankData){
	$scope.fields = {
						"Processor": {
							'type'	: "string",
							'label'	: "Processor"
						},
						"InstanceID": {
							'type'	: "string",
							'label'	: "Instance ID"
						},
						"RouteID": {
							'type'	: "string",
							'label'	: "Route ID"
						},
						"RouteInfo": {
							'type'	: "hex",
							'label'	: "Route Info"
						},
						"DateAdded": {
							'type'	: "date",
							'label'	: "Date Added"
						},
						"Status": {
							'type'	: "select",
							'label'	: "Status",
							'value'	: 	[{
											'actualvalue' : "ACTIVE",
											'displayvalue' : "ACTIVE"
										},
										{
											'actualvalue' : "DOWN",
											'displayvalue' : "DOWN"
										}]	
						},
						"Reloadable": {
							'type'	: "boolean",
							'label'	: "Re loadable"
						}
					}
					
	$scope.fieldData = []
	
	function autoScrollDiv(){
		$(".dataGroupsScroll").scrollTop(0);
		/*setTimeout(function () {
			if ($(".dataGroupsScroll").scrollTop() != 0) {
				$(".dataGroupsScroll").scrollTop(0);
			} else {
				$(".dataGroupsScroll").scrollTop(0);
			}
		}, 300)*/
	}
    
	
	/* used for all the crud request */  
	function crudRequest(_method, _url, _data, _params){
		return $http({
			method: _method,
			url: BASEURL + "/rest/v2/" + _url,
			data: _data,
			params:_params
		}).then(function(response){
			$scope.restResponse = {
				'Status' : 'Success',
				'data'	: response,
				'totalCount': response.headers().totalcount
			}
			return $scope.restResponse
		},function(error){
			if(error.data.error.code == 401){
				if(configData.Authorization=='External'){										
					window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
				}
				else{
					LogoutService.Logout();
				}
			}
			$scope.restResponse = {
				'Status' : 'Error',
				'data'	: error.data.error.message  
			}
			
			$('.modal').modal("hide");
			$scope.alerts = [{  
								type : 'danger',
								msg : error.data.error.message 		//Set the message to the popup window
							}];	
			$timeout(callAtTimeout, 4000);
			return $scope.restResponse
		})
	}
	
	
	//I Load More datas on scroll
	var len = 20;
	var loadMore = function(){
		if(($scope.dataLen.length >= 20)){
			$scope.restInputData.start = len;
			$scope.restInputData.count = 20;
			crudRequest("POST","transports/routeregistry/readall",$scope.restInputData).then(function(response){	
				$scope.dataLen = response.data.data			
				if(response.data.data.length != 0){
					$scope.readData = $scope.readData.concat($scope.dataLen)
					len = len + 20;		
				}
			})
		}
		//console.log($scope.dataLen)
	}	

	var debounceHandler = _.debounce(loadMore, 700, true);
	$('.listView').on('scroll', function() {                                              
		$scope.widthOnScroll();
		if( Math.round($(this).scrollTop() + $(this).innerHeight())>=$(this)[0].scrollHeight) {
			debounceHandler();
		}
	});


    $scope.printFn = function(){
    	$('[data-toggle="tooltip"]').tooltip('hide');
    	window.print()
    }

    $scope.multipleEmptySpace = function (e) {
		if($.trim($(e.currentTarget).val()).length == 0){
			$(e.currentTarget).val('');
		}
	}
	
	$scope.ExportMore = function(argu,excelLimit){
		if(argu > excelLimit){
			//console.log('limit',$scope.Title+'_'+(''+excelLimit)[0])
			JSONToCSVConvertor($scope.dat, (argu > excelLimit) ?  'Route Registry_'+(''+excelLimit)[0]: 'Route Registry', true);
			$scope.dat = [];
			excelLimit += 100000
		}
		crudRequest("POST","transports/routeregistry/readall",{"start": argu,"count": ($scope.restResponse.totalCount > 1000) ? 1000 : $scope.restResponse.totalCount}).then(function(response){	
			$scope.dat = $scope.dat.concat(response.data.data)
			if(response.data.data.length >= 1000){
				//console.log(argu)
				argu += 1000;
				$scope.ExportMore(argu,excelLimit)				
			}
			else{
				JSONToCSVConvertor($scope.dat,(argu > excelLimit) ?  'Route Registry_'+(''+excelLimit)[0]: 'Route Registry', true);
			}
		})
	}

	$scope.exportAsExcel = function(){
		$scope.dat = [];
		if($("input[name=excelVal][value='All']").prop("checked")){	
			$scope.ExportMore(0,100000);
			//JSONToCSVConvertor($scope.dat, $scope.Title, true);			
		}
		else{
			$scope.dat = angular.copy($scope.readData);
			//$scope.dat.shift();
			
			JSONToCSVConvertor($scope.dat, 'Route Registry', true);
		}
		//bankData.exportToExcel($scope.dat, $scope.Title)
		
	}

	function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
		//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
		var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
		var CSV = '\n\n';
		
		//This condition will generate the Label/Header
		if (ShowLabel) {
			var row = "";		//This loop will extract the label from 1st index of on array
			var colName = [];
			for(i in $scope.fields){
				//colName.push($scope.fieldDetails.Section[i].FieldName)
				colName.push(i)
				row += $scope.fields[i].label + ',';
			}
			row = row.slice(0, -1);			
			CSV += row + '\n';
			
		}
		for (var i = 0; i < arrData.length; i++) {
			var row = "";
			for(jk in colName){
				if(JSON.stringify(arrData[i][colName[jk]]) != undefined){

					//row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';
						if(typeof(arrData[i][colName[jk]]) === 'object')
						{
						
							var cont="";
							for(var x in arrData[i][colName[jk]])
							{	
								var dStr = JSON.stringify(arrData[i][colName[jk]][x]);
								dStr = dStr.replace(/"/g,'')
								cont +=  JSON.stringify(dStr);
							}

							row +=  cont;
							row = row.replace(/""/g,"\n")
						}
						else
						{
							row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';

						}
				}
				else{
					row += ''+ ',';
				}
			}	
			row.slice(0, row.length - 1);
			CSV += row + '\n';
		}

		if (CSV == '') {
			alert("Invalid data");
			return;
		}
		bankData.exportToExcel(CSV, ReportTitle)
	}


	/*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/
	$scope.widthOnScroll = function(){
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
		});
		//$scope.setClass();
	});
		
	
	$scope.applyRestData = function(argu){
		if(argu){
			$scope.restInputData = 	{
									"start": 0,
									"count": 20,
									"sorts":[]
								}
		}		
		crudRequest("POST","transports/routeregistry/readall",$scope.restInputData).then(function(response){
			$scope.readData = response.data.data;
			$scope.dataLen = response.data.data
		})
		$scope.TotalCount = 0;
		for(j in $scope.fields.Status.value){
			getCountbyStatus($scope.fields.Status.value[j])
		}
	}
	
	$scope.applyRestData(true);
	
	$scope.loadData = function(){
		$scope.restInputData = 	{
									"start": 0,
									"count": 20
								}
		len = 20;
		$('.listView').scrollTop(0)
		$scope.clearSort('#sort');
		$scope.clearFilter();
	}
	function callAtTimeout() {
		$('#statusBox').hide();
	}
	
	$scope.allowOnlyNumbersAlone = function(e)
	{
		if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
                 // let it happen, don't do anything
                 return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }

	}
	
	$scope.multipleEmptySpace = function (e) {

		var classname = e.currentTarget.id;
		//console.log(classname)
		if (($.trim($('#' + classname).val()).length) > 0) {
			//console.log($.trim($('#'+classname).val()))
			$('#' + classname).val($.trim($('#' + classname).val()));
		} else {
			//console.log($.trim($('#'+classname).val()))
			$('#' + classname).val('');
			//$('#'+classname).focus();
		}
	}
	
	$scope.callStyle = function(){	
		return $('#listViewPanelHeading_1').outerHeight();
	}
	
	$scope.filterBydate = [	{
								'actualvalue' : custmtodayDate(),
								'displayvalue' : 'Today'
							},
							{
								'actualvalue' : week(),
								'displayvalue' : 'This Week'
							},
							{
								'actualvalue' : month(),
								'displayvalue' : 'This Month'
							},
							{
								'actualvalue' : year(),
								'displayvalue' : 'This Year'
							},
							{
								'actualvalue' : '',
								'displayvalue' : 'Custom'
							}
						  ]

	
	$scope.showCustom = false;
	$scope.selectedDate = '';	
	
	$scope.clearFilter = function(){	
		/*if($scope.showCustom || $scope.filterParams.keywordSearch || 'Status' in $scope.filterParams && $scope.filterParams.Status.length){
			$scope.applyRestData();
		}*/
		$scope.restInputData = 	{
									"start": 0,
									"count": 20,
									"sorts":[]
								}		
		$scope.showCustom = false;
		$scope.filterParams = {};
		$('.filterBydate').each(function(){
			$(this).css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
		})

		$scope.selectedStatus = [];	
		$('.filterBystatus').each(function(){
			$(this).css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
		})
		$('.customDropdown').removeClass('open');
		$scope.applyRestData();
		
	}
	


	$scope.showAlert = false

	
	$(document).ready(function(){
		$('.DatePicker').datetimepicker({
			format:"YYYY-MM-DD",
			useCurrent: true,
			showClear: true
		}).on('dp.change', function(ev){
			//console.log(ev,$(ev.currentTarget).attr('ng-model').split('[')[0])			
		})					
	})	
	
	$scope.buildFilter = function(argu1,argu2){	
		//console.log(argu1,argu2)
		for(k in $scope.fields){
			console.log(k)
			if($scope.fields[k].type == 'string'){
				console.log(k)
				argu2.push({
					"columnName": k,
					"operator": "LIKE",
					"value": argu1
				})
			}
		}
		
		return argu2;
	}
	
	$scope.searchFilter = function(val){
		val = removeEmptyValueKeys(val)
		console.log(val,"asas")
		$scope.restInputData = {
			"start":0,
			"count":len
		}
		$scope.restInputData.filters = removeEmptyValueKeys($scope.restInputData.filters)
		//console.log(val)
		$scope.restInputData.filters = {  
											"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND",
												"groupLvl3":[]
											}]}]
										}
		for(j in Object.keys(val)){
			$scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
				"logicalOperator" : "OR",
				"clauses" : []
			})
			if(Object.prototype.toString.call(val[Object.keys(val)[j]]) === '[object Array]') {
				for(i in val[Object.keys(val)[j]]){
			 		//console.log('in if',val[Object.keys(val)[j]][i])
					 $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName": Object.keys(val)[j],
						"operator": "=",
						"value": val[Object.keys(val)[j]][i]
					})
			 	}
			}
			else{
				//console.log(typeof(val[Object.keys(val)[j]]))
				if(typeof(val[Object.keys(val)[j]]) === 'object'){	
					$scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].logicalOperator = "AND"
					$scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName": "DateAdded",
						"operator": $('#startDate').val() == $('#endDate').val() ? '=': $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
						"value": $('#startDate').val()
					})
					$scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName": "DateAdded",
						"operator": $('#startDate').val() == $('#endDate').val() ? '=': $('#startDate').val() < $('#endDate').val() ? '<=' : '>=',
						"value": $('#endDate').val()
					})		
				}
				else{
					console.log('here',$scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses)
					$scope.buildFilter(val[Object.keys(val)[j]], $scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses)
				}
				
			}
		}
		$scope.applyRestData();
		$scope.filterParams = {};
		$('.filterBydate').each(function(){
			$(this).css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
		})

		$scope.selectedStatus = [];	
		$('.filterBystatus').each(function(){
			$(this).css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
		})
		
		$scope.showCustom = false;
		$scope.selectedDate = '';
	}

	$scope.filterParams = {};
	$scope.selectedStatus = [];	
	$scope.setStatusvalue = function(val,to){	
		//console.log(val,to)	
		var addme = true;
		if($scope.selectedStatus.length){			
			for(k in $scope.selectedStatus){
				if($scope.selectedStatus[k] == val){
					//console.log($scope.selectedStatus[k],k)
					$('#'+val).css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
					$scope.selectedStatus.splice(k,1);
					console.log($scope.selectedStatus)
					addme = false
					break
				}
			}
			if(addme){
				$('#'+val).css({'background-color':'#d8d5d5','box-shadow':''})
				$scope.selectedStatus.push(val);
			}
		}
		else{
			$('#'+val).css({'background-color':'#d8d5d5','box-shadow':''})
			$scope.selectedStatus.push(val);
		}
		to['Status'] = $scope.selectedStatus;
	//	console.log(val,to)
	}
	
	$scope.setEffectivedate = function(val,to){	
		//console.log(val,to)
		to['DateAdded'] = val;
		if($scope.selectedDate == val.displayvalue){
			$scope.showCustom = false;
			$('.filterBydate').css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
			$scope.selectedDate = '';
		}
		else{
			$scope.showCustom = true;
			$scope.selectedDate = angular.copy(val.displayvalue);	
			$('.filterBydate').css({'background-color':'#fff','box-shadow': '1.18px 2px 1px 1px rgba(0,0,0,0.40)'})
			$('#'+$scope.selectedDate.replace(/\s+/g, '')).css({'box-shadow':'1.18px 3px 2px 1px rgba(0,0,0,0.40)','background-color':'#d8d5d5'})
		}
		//console.log(to,typeof(val.actualvalue))
		if(typeof(val.actualvalue) == "object"){
			var date = []
			for(k in val.actualvalue){
				date.push(val.actualvalue[k])
			}
			$('#customPicker').find('input').each(function(i){
				if(i == 0){
					if(date[i] < date[Number(i+1)]){
						$(this).val(date[i])
						$(this).parent().children().each(function(){
							$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
						})
					}				
					else{
						$(this).val(date[Number(i+1)])
						$(this).parent().children().each(function(){
							$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
						})
					}
				}
				else{
					$(this).val(date[Number(i-1)])
					$(this).parent().children().each(function(){
						$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
					})
				}
			}) 			
		}
		else if(val.displayvalue == 'Custom'){
			$('#customPicker').find('input').each(function(i){
				$(this).parent().children().each(function(){
					$(this).css({'cursor': 'pointer'}).removeAttr('disabled').val('')
				})
			})
		}
		else{
			$('#customPicker').find('input').each(function(i){
				$(this).val(val.actualvalue)
				$(this).parent().children().each(function(){
					$(this).css({'cursor': 'not-allowed'}).attr('disabled','disabled')
				})
			}) 	
		}
	}
	
	
	$scope.$watch('restInputData', function(newValue, oldValue, scope) {
//		console.log('adcame',newValue, oldValue)
        // do something here
			$scope.savedQueryOrder = [];
			$scope.savedQueryfield = [];
			//console.log('sd',newValue)
			if(newValue){
				for(order in newValue.QueryOrder){
					$scope.savedQueryOrder.push({
						'fieldName' : newValue.QueryOrder[order].ColumnName,
						'fieldValue' : newValue.QueryOrder[order].ColumnOrder
					})
				}	 	
				for(field in newValue.Queryfield){
					$scope.savedQueryfield.push({
						'fieldName' : newValue.Queryfield[field].ColumnName,
						'fieldValue' : newValue.Queryfield[field].ColumnValue
					})
				}		

			}		
    }, true);	

	$scope.gotoSorting = function(dat){
		console.log(dat,$scope.restInputData.sorts)
		//$(elem.currentTarget).find('i').removeAttr('class')

		$scope.restInputData.start = 0;
        $scope.restInputData.count = len;

		var orderFlag = true;
		if($scope.restInputData.sorts.length){
			for(k in $scope.restInputData.sorts){
				if($scope.restInputData.sorts[k].columnName == dat){
					if($scope.restInputData.sorts[k].sortOrder == 'Asc'){
						$('#'+dat+'_icon').attr('class','fa fa-long-arrow-down')
						$('#'+dat+'_Icon').attr('class','fa fa-caret-down')
						$scope.restInputData.sorts[k].sortOrder = 'Desc'
						orderFlag = false;
						//console.log('Desc',$scope.restInputData.QueryOrder)
						break;
					}
					else{
						$scope.restInputData.sorts.splice(k,1);
						orderFlag = false;
						$('#'+dat+'_icon').attr('class','fa fa-minus fa-sm')
						$('#'+dat+'_Icon').removeAttr('class')
						//console.log('Remove',$scope.restInputData.QueryOrder)
						$timeout(function(){
							$(".alert-danger").hide();
						},1000)
						break;
					}				
				}
			}
			if(orderFlag){
				$('#'+dat+'_icon').attr('class','fa fa-long-arrow-up')
				$('#'+dat+'_Icon').attr('class','fa fa-caret-up')
				$scope.restInputData.sorts.push({
								"columnName": dat,
								"sortOrder": 'Asc'
				})
				//console.log('Add',$scope.restInputData.QueryOrder)
			}
		}
		else{
			$('#'+dat+'_icon').attr('class','fa fa-long-arrow-up')
			$('#'+dat+'_Icon').attr('class','fa fa-caret-up')
			$scope.restInputData.sorts.push({
							  "columnName": dat,
							  "sortOrder": 'Asc'
							})
			console.log('initial',$scope.restInputData.sorts)
		}
		$scope.applyRestData(false);
	}
	
	$(document).ready(function () {
		$(".FixHead").scroll(function (e) {
			var $tablesToFloatHeaders = $('table');
			//console.log($tablesToFloatHeaders)
			$tablesToFloatHeaders.floatThead({
				//useAbsolutePositioning: true,
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
            $(".listView").scrollLeft(10)      
			},300)
			if($(".dataGroupsScroll").scrollTop() == 0){
				$(".dataGroupsScroll").scrollTop(5)
			}
			
		})
		$(window).trigger('resize');  

	})

	

	$scope.keywordSearchdata = {}
	$scope.inputType = ''
	
	$scope.keywordSearch = function(val){
		$scope.restInputData.Queryfield  = 	[{
											  "ColumnName": val.selectBox,
											  "ColumnOperation": "=",
											  "ColumnValue": val.searchBox
											}]
		console.log(val)
		if($scope.regex[$scope.inputType].regex){
			if($scope.regex[$scope.inputType].regex.test($('#searchBox').val())){
				console.log('match',val.searchBox,$scope.regex[$scope.inputType].regex)				
				$scope.applyRestData();	
			}
			else{
				$scope.restInputData.Queryfield = [];
				console.log('No match',val.searchBox,$scope.regex[$scope.inputType].regex)
			}			
		}
		else{
			console.log('call the rest')
			$scope.applyRestData();	
		}
	}
	$scope.regex = {
		'Integer' : {
						'regex' : /^[0-9]$/,
						'className' : '',
						'placeholder' : 'Type Number Only',
						'errorMsg' : 'Please fill out this field.'
					},
		'BigDecimal' : {
						'regex' : /^[0-9.]$/,
						'className' : '',
						'placeholder' : 'Type Number Only',
						'errorMsg' : 'Please fill out this field.'
					},
		'String' : {
						'regex' : /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i,
						'className' : '',
						'placeholder' : 'Type here to Search...',
						'errorMsg' : 'Please fill out this field.'
					},
		'Boolean' : {
						'regex' : /^true$|^false$/i,
						'className' : '',
						'placeholder' : 'Type true or false Only',
						'errorMsg' : 'Boolean'
					},
		'DateOnly' : {
						'regex' : '',
						'className' : 'date date-picker',
						'placeholder' : 'YYYY-MM-DD',
						'errorMsg' : 'DateOnly'
					},
		'DateTime' : {
						'regex' : '',
						'className' : 'date form_cstm_datetime',
						'placeholder' : 'YYYY-MM-DD T HH:MM',
						'errorMsg' : 'DateTime'
					},
		'TimeOnly' : {
						'regex' : '',
						'className' : 'timepicker timepicker-24',
						'placeholder' : 'HH:MM:SS',
						'errorMsg' : 'TimeOnly'
					}
	}

	$scope.setInputtype = function(id,x){
		//console.log(x)
		$('#searchBox').datepicker('remove');
		$('#searchBox').get(0).setCustomValidity('');
		$scope.keywordSearchdata = {
			'selectBox' : x,
			'searchBox'	: ''	
		}
		
		for(k in $scope.fieldDetails.Section){
			if($scope.fieldDetails.Section[k].FieldName === x){
				$scope.inputType = $scope.fieldDetails.Section[k].Type
				$scope.cstmPlaceholder = $scope.regex[$scope.inputType].placeholder;
				$scope.className = $scope.regex[$scope.inputType].className;
				//$('#searchBox').get(0).setCustomValidity($scope.regex[type].errorMsg);
				//console.log($scope.fieldDetails.Section[k])
			}			
		}
		//console.log($scope.regex[$scope.inputType])
	}

		
	$scope.clearSort = function(id){
		$(id).find('i').each(function(){
			$(this).removeAttr('class').attr('class','fa fa-minus fa-sm');
			$('#'+$(this).attr('id').split('_')[0]+'_Icon').removeAttr('class');
		})
	   $scope.restInputData.sorts = [];
		$scope.applyRestData();
	}

	$scope.clearfromSearch = function(index,to,flag){
		console.log(index,to,flag)
		if(flag){
			$scope.clearSort('#sort');
			$scope.clearFilter();
			$scope.keywordSearchdata.searchBox = '';			 
		}
		else{
			$scope.restInputData[to].splice(index,1)			
			$scope.applyRestData();
		}
	}
	
	/*Save Search begins Here*/
	$scope.triggerSave = false;
	$scope.dummy = [];
	$scope.calltriggerSave = function(){
		$scope.triggerSave = !$scope.triggerSave;
	}
	$scope.savedSearch = [];
	$scope.savedQueryOrder = [];
	$scope.searchedParams = {
		'fieldName' : '',
		'fieldValue' : '',
	};


	for(k in $scope.Status){
		//console.log($scope.Status[k])
	}
	
	
	/* Get count */
	function getCountbyStatus(argu){		
		//console.log(argu)
		$http({
			method: "POST",
			url: BASEURL + "/rest/v2/transports/routeregistry/readall",
			data: {"start":0,"count":20,"filters":{"logicalOperator":"AND","groupLvl1":[{"logicalOperator":"AND","groupLvl2":[{"logicalOperator":"AND","groupLvl3":[{"logicalOperator":"OR","clauses":[{"columnName":"Status","operator":"LIKE","value":argu.actualvalue}]}]}]}]}},
			params:''
		}).then(function(response){
			argu.TotalCount = response.headers().totalcount;
		},function(error){
			if(error.data.error.code == 401){
				if(configData.Authorization=='External'){										
					window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
				}
				else{
					LogoutService.Logout();
				}
			}			
			$('.modal').modal("hide");
			$scope.alerts = [{  
								type : 'danger',
								msg : error.data.error.message 		//Set the message to the popup window
							}];	
			$timeout(callAtTimeout, 4000);
		})
	}
	//console.log($scope.TotalCount)
	/* Get count */
	
	$scope.gotoReload = function(argu){
		//console.log(argu)
		var input = {
						"TransportCategory": argu.Processor,
						"ReloadType": "SPECIFIC",
						"HostInetAddress": argu.InstanceID,
						"TransportDetails": {
							"RouteId": argu.RouteID
						}
					}
		//console.log(input)
		$http({
			method: "POST",
			url: BASEURL + "/rest/v2/transports/reload",
			data: input,
			params:''
		}).then(function(response){
			$('.modal').modal("hide");
			$scope.alerts = [{  
								type : 'success',
								msg : response.data.responseMessage		//Set the message to the popup window
							}];
			$timeout(callAtTimeout, 4000);
		},function(error){
			if(error.data.error.code == 401){
				if(configData.Authorization=='External'){										
					window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
				}
				else{
					LogoutService.Logout();
				}
			}			
			$('.modal').modal("hide");
			$scope.alerts = [{  
								type : 'danger',
								msg : error.data.error.message 		//Set the message to the popup window
							}];	
			$timeout(callAtTimeout, 4000);
		})
	}

});