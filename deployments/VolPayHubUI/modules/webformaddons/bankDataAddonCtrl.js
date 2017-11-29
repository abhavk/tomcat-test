VolpayApp.controller('bankDataAddonCtrl', function ($scope, $state, $timeout, $stateParams, $filter, $http, $translate,bankData, GlobalService, LogoutService) {	
	
	$scope.permission = {'C' : false,'D' : false,'R' : false,'U' : false}

	/* for Crud operation*/	
	crudRequest("POST","roles/resourcepermission",{
		"RoleId": sessionStorage.ROLE_ID,
		"ResourceName": $stateParams.input.gotoPage.Name
	}).then(function(response){
		if(response.Status == "Success"){

			for(k in response.data.data){
				for(j in Object.keys($scope.permission)){
					if(Object.keys($scope.permission)[j] == response.data.data[k].ResourcePermission){
						$scope.permission[Object.keys($scope.permission)[j]] = true;
					}
				}
			}
		}
	})


	/* for Crud operation*/
	
	/* Variable declaration Begins*/	
	$scope.fieldDetails = {
		'Section' : [],							/* Field values */
		'Subsection' : []						/* SubField values */
	};	
	$scope.CRUD = ($stateParams.input.responseMessage)?($stateParams.input.responseMessage):"";  /* Response Message stored here */
	$scope.colSpanVal = ""				/* used in slider insertion */
	$scope.ulName = ($stateParams.input.gotoPage.ParentName)?$stateParams.input.gotoPage.ParentName:''; 	/* used to display the parent name */
	$scope.dataLen = ''					/* used to store the data length in loadmore */		
	$scope.readData = []				/* used to store the data */
	$scope.Title = ($stateParams.input.gotoPage.Name)?$stateParams.input.gotoPage.Name:''  /* used to display the title in add new */
	$scope.IconName = ($stateParams.input.gotoPage.IconName)?$stateParams.input.gotoPage.IconName:''  /* used to display the title in add new */
	$scope.showPageTitle = $filter('removeSpace')(($stateParams.input.gotoPage.Name)?$stateParams.input.gotoPage.Name:'');
	$scope.showsubTitle = $filter('specialCharactersRemove')($scope.showPageTitle)+'.SubTitle';				/* used to display the discription */
	$scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle)+'.PageTitle'; /* used to display the parent name */
	$scope.changeViewFlag = GlobalService.viewFlag;		/* used to store select view */
	$scope.restResponse = {};		/* used to store the rest response */
	/* Variable declaration Ends */	
	
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

	/* used to store select view in the global variable for furture use */
	$scope.$watch('changeViewFlag', function(newValue, oldValue, scope) {
		GlobalService.viewFlag = newValue;
		var checkFlagVal = newValue;    	
		if(checkFlagVal){
			$(".floatThead ").find("thead").hide();
			autoScrollDiv();
		}
		else{
			$(".floatThead ").find("thead").show();
			if($(".dataGroupsScroll").scrollTop() == 0){
				$table = $("table.stickyheader")
				 $table.floatThead('destroy');
				
			}
			autoScrollDiv();
		}		
	})    
	
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
	
	function callforVisibility(x){
		for(var k in x.customattributes.property){
			if(x.customattributes.property[k].name === 'WebFormExcerptView'){
				return x.customattributes.property[k].value
			}
		}
	}
	function callDropvalRest(x,y,z,q,names){
		//console.log(x,y,z,q)
		names = names.toUpperCase()
		//if( names != 'PARTYCODE' && names != 'CONNECTINGPARTY' && names != 'CURCORRESPARTYCODE' && names != 'ROUTINGAGENTPARTYCODE' &&  names != 'COUNTRYCORRESPARTYCODE' && names != 'PREFERREDACCOUNT'){
		if('customattributes' in x){
			//console.log(x.customattributes.property[0].name)
			if(x.customattributes.property[0].name === "REST"){
				/* return [{
							actualvalue :	"REST",
							displayvalue:	"LoadMore",
							configDetails: {
									'links'		: x.customattributes.property[0].value
								}
						}] */
				//console.log(x)
				crudRequest("GET",x.customattributes.property[0].value,'',{start : 0 ,count : 100}).then(function(response){
					//console.log(response.data.data)
					if(z == 'Section'){					
						$scope.fieldDetails[z][y]['ChoiceOptions'] = response.data.data
						$scope.fieldDetails[z][y]['ChoiceOptions'][$scope.fieldDetails[z][y]['ChoiceOptions'].length-1] = {
							actualvalue :	"REST",
							displayvalue:	"LoadMore",
							configDetails: {
									'links'		: x.customattributes.property[0].value,
									'totalCount': response.totalCount
								}
						}
					}
					else{
						$scope.fieldDetails[z][y][q]['ChoiceOptions'] = response.data.data
					}
				})		
			}
			else if(x.customattributes.property[0].name === "Choice"){
				return x.customattributes.property
			}
			else{
				return x.choiceOptions
			}
		}
		else{
			return x.choiceOptions
		}
		//}
	}

	function callDropvalRest1(argu,name){
		//console.log(argu,name)
		if('customattributes' in argu){
			for(k in argu.customattributes.property){
				if(argu.customattributes.property[k].name == "REST"){					
					return [{
							actualvalue :	"REST",
							displayvalue:	"LoadMore",
							configDetails: {
									'links'		: argu.customattributes.property[0].value
								}
						}]
					/*crudRequest("GET",argu.customattributes.property[k].value,"").then(function(response){
						for(k in $scope.MOPdata){
							if($scope.MOPdata[k].name == name){
								$scope.MOPdata[k].ChoiceOptions = response.data.data;
							}
						}
					})*/
				}
				else if(argu.customattributes.property[k].name === "Choice"){
					return argu.customattributes.property
				}
				else{
					return argu.choiceOptions
				}
			}
		}
		else{
			return argu.choiceOptions
		}		
	}
	
	$scope.getTextAreaRows= function(val1){
    	return Math.ceil(val1);
    }
	$scope.MOPdata = []
	function buildFields(argu,fieldset){
		//console.log(argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer)
		$scope.MOPdata.push({
			'FieldSet' 		: fieldset,
			'cstmcolumnspan': false,
			'name' 			: ('name' in argu ? argu.name : ''),
			'type' 			: ('type' in argu ? argu.type : ''),
			'columnspan'	: ('columnspan' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.columnspan : ''),	
			'enabled'		: ('enabled' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.enabled : ''),
			'label'			:	('label' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
			'labelposition' : ('labelposition' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.labelposition : ''),
			'newrow'		:('newrow' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.newrow : ''),
			'notnull'		:('notnull' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
			'renderer'		:('renderer' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer : ''),
			'rowspan'		:('rowspan' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.rowspan : ''),
			'visible'		:('visible' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : ''),
			'WebFormExcerptView': ('customattributes' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]):false,
			'ChoiceOptions' : ('Choice' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer)?callDropvalRest1(argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice,argu.name):'',
			'PrimaryKey' : (argu.name == $scope.primarykey) ? true : false
		})
		console.log(argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2)
		if('label' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2 && argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.label == 'Status' && 'Choice' in argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer){							
			$scope.Status = argu.fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions;					
		}
	}

	$scope.primarykey = '';
	$scope.primarykey1 = '';
	$scope.Status = '';
	//Get Field Values
	crudRequest("GET",$stateParams.input.gotoPage.Link+'/metainfo',"").then(function(response){
		crudRequest("GET",$stateParams.input.gotoPage.Link+"/primarykey",'').then(function(res){
			$scope.primarykey = res.data.data.responseMessage.split(',');
			$scope.primarykey1 = $scope.primarykey[0].match(/_PK/g) ? '' : $scope.primarykey[0];
			//console.log($scope.primarykey1,$scope.primarykey[0].match(/_PK/g))
			console.log(response)
		var obtainedFields = response.data.data.Data.webformuiformat.fields.field
		
		$scope.colSpanVal = obtainedFields.length;
		$scope.truetag = ($stateParams.input.gotoPage.Link == 'methodofpayments')? false : true;
		if($stateParams.input.gotoPage.Link == 'methodofpayments'){
				var fieldset = false;
				var FieldGroupval = 0;
				$scope.colspanArr = [];
			for(k in obtainedFields){
				if(obtainedFields[k].name == "FieldGroup" || obtainedFields[k].name == "FieldGroupEnd"){
					//console.log(k)
					fieldset = 'fieldGroup1' in obtainedFields[k] ? obtainedFields[k].fieldGroup1.webformsectiongroup : false;
					if(obtainedFields[k].name == "FieldGroup"){
						FieldGroupval = k;
					}
					if(obtainedFields[k].name == "FieldGroupEnd"){
						//console.log(FieldGroupval,k, k - FieldGroupval -1,$scope.MOPdata.length)
						$scope.colspanArr.push(k - FieldGroupval -1)
						//$scope.MOPdata[FieldGroupval].cstmcolumnspan =  k - FieldGroupval -1
					}
				}
				else{
					//console.log('else',spanval)
					buildFields(obtainedFields[k],fieldset)
				}				
			}	
				//console.log($scope.MOPdata)	
				var j1 = 0;
				for(k in $scope.MOPdata){
					if($scope.MOPdata[k].FieldSet && $scope.MOPdata[k].FieldSet.sectionheader != $scope.MOPdata[k-1].FieldSet.sectionheader){
						$scope.MOPdata[k].cstmcolumnspan = $scope.colspanArr[j1];
						j1++;
					}
				}
			
		}
		else{
			for(k in obtainedFields)
			{
				//console.log(obtainedFields[k])
				if("webformfieldgroup" in obtainedFields[k].fieldGroup1){
					//console.log(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer,obtainedFields[k])
										
					$scope.fieldDetails.Section.push({
						'FieldName' : ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
						'Type' : ('type' in obtainedFields[k] ? obtainedFields[k].type : ''),
						'Label' : ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
						'InputType' : ('type' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
						'MaxLength' : ('width' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
						'Mandatory' : ('notnull' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
						'ChoiceOptions' : (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice)?callDropvalRest(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice,k,'Section','',obtainedFields[k].name):obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes,
						'Rows' : (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea")? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows:'',
						'PrimaryKey' : (obtainedFields[k].name == $scope.primarykey) ? true : false,
						'Visible' : ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]):false,
						'View' : ('visible' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : '')
					})					
						
					if('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 && obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label == 'Status' && 'Choice' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer){							
						$scope.Status = obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions;						
						// $scope.Status.push({
                        //                         "displayvalue":"ACTIVE-WAITFORAPPROVAL",
                        //                         "actualvalue":"ACTIVE-WAITFORAPPROVAL"
                        //                     })					
						//console.log($scope.Status)					
					}
				}
				else{
					var subSectionData = [];
					for(j in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field){
						subSectionData.push({ 
						'FieldName' : ('name' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].name : ''),
						'Type' : ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].type : ''),
						'Label' : ('label' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
						'InputType' : ('type' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
						'MaxLength' : ('width' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
						'Mandatory' : ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
						'Mandatory' : ('notnull' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
						'ChoiceOptions' : (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice)? callDropvalRest(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions,k,'Subsection',j):'',
						'Rows' : (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea")? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows:'',
						'Visible' : ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]):false,
						'View' : ('visible' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : '')
						})
					}
					$scope.fieldDetails.Subsection.push({	
							'Type' : 'Subsection',
							'Mandatory' : ('showsectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.showsectionheader : ''),
							'Label' : ('sectionheader' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.sectionheader : ''),
							'MaxOccarance' : ('maxoccurs' in obtainedFields[k].fieldGroup1.webformsectiongroup ? obtainedFields[k].fieldGroup1.webformsectiongroup.maxoccurs : ''),
							'FieldName' : ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
							'subSectionData' : subSectionData,
							'PrimaryKey' : (obtainedFields[k].name == $scope.primarykey) ? true : false							
					})					
				}
			}
		}
		


			if(response.Status === "Success"){
				$scope.restInputData = 	{
											  "start": 0,
											  "count": 20,
											  "sorts":[]
											}	
				if($stateParams.input.gotoPage.Link == 'businessprocesses'){
					$scope.restInputData.sorts = [ 
															{  
																"columnName":"ProcessCode",
																"sortOrder":"Asc"
															},
															{  
																"columnName":"WorkFlowCode",
																"sortOrder":"Asc"
															},
															{  
																"columnName":"ActivityIndex",
																"sortOrder":"Asc"
															}
													  ]
				}
				//$scope.$watch('restInputData',function(){
					
		
						$timeout(function(){
						for(j in $scope.restInputData.sorts)
						{
							if($scope.restInputData.sorts[j].sortOrder == "Asc")
							{
								//console.log($('#'+$scope.restInputData.QueryOrder[j].ColumnName+'_Icon'),$('#ProcessCode_Icon'))
								$('#'+$scope.restInputData.sorts[j].columnName+'_Icon').attr('class','fa fa-caret-up')				

							}
							if($scope.restInputData.sorts[j].sortOrder == "Desc")
							{
								$('#'+$scope.restInputData.sorts[j].columnName+'_Icon').attr('class','fa fa-caret-down')	
							}
						
						}
						},500)

			//	})
				$scope.applyRestData();						
			}			
		})
		
	})

	
	$scope.takeDeldata = function(val,Id){
		delData = val;
		$scope.delIndex = Id;
	}
	
	//I Load More datas on scroll
	var len = 20;
	var loadMore = function(){
		if(($scope.dataLen.length >= 20)){
			$scope.restInputData.start = len;
			$scope.restInputData.count = 20;
			crudRequest("POST",$stateParams.input.gotoPage.Link+"/readall",$scope.restInputData).then(function(response){	
				$scope.dataLen = response.data.data			
				if(response.data.data.length != 0){
					$scope.readData = $scope.readData.concat($scope.dataLen)
					len = len + 20;		
				}
			})
		}
		console.log($scope.dataLen)
	}	

	var debounceHandler = _.debounce(loadMore, 700, true);
	$('.listView').on('scroll', function() {                                              
		$scope.widthOnScroll();
		if( Math.round($(this).scrollTop() + $(this).innerHeight())>=$(this)[0].scrollHeight) {
			debounceHandler();
		}
	});

	//I Load More datas on scroll
	/*var len = 20;
	$scope.prevRestdata = [];
	$scope.loadMore = function(){
		$scope.restInputData.start = len;
		//console.log(len)
		crudRequest("POST",$stateParams.input.gotoPage.Link+"/readall",$scope.restInputData).then(function(response){	
				$scope.dataLen = response.data.data		
				console.log('in loadmore',JSON.stringify($scope.prevRestdata) != JSON.stringify($scope.dataLen))				
				if((response.data.data.length != 0)&&(JSON.stringify($scope.prevRestdata) != JSON.stringify($scope.dataLen))){
					$scope.prevRestdata = angular.copy(response.data.data)
					$scope.readData = $scope.readData.concat(response.data.data)
					len = len + 20;
				}
				else{
					$scope.prevRestdata = [];
				}
			})
		
	}

	 /*** To control Load more data ***/
	/*jQuery(
		function($)
			{
				$('.listView').bind('scroll', function()
				{
					$scope.widthOnScroll();
					if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
					{			
						console.log('in scroll',JSON.stringify($scope.prevRestdata) != JSON.stringify($scope.dataLen))			
						if(($scope.dataLen.length >= 20)&&(JSON.stringify($scope.prevRestdata) != JSON.stringify($scope.dataLen))){
							$scope.loadMore();
						}	
					}
				})
				
				$('.dropdown-menu #Filter').click(function (e) {
					e.stopPropagation();
				});
				
			}		
	);*/
	
	 /*** Print function ***/

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
			JSONToCSVConvertor($scope.dat, (argu > excelLimit) ?  $scope.Title + '_'+(''+excelLimit)[0]: $scope.Title, true);
			$scope.dat = [];
			excelLimit += 100000
		}
		crudRequest("POST",$stateParams.input.gotoPage.Link+"/readall",{"start": argu,"count": ($scope.TotalCount > 1000) ? 1000 : $scope.TotalCount}).then(function(response){	
			$scope.dat = $scope.dat.concat(response.data.data)
			if(response.data.data.length >= 1000){
				//console.log(argu)
				argu += 1000;
				$scope.ExportMore(argu,excelLimit)				
			}
			else{
				JSONToCSVConvertor($scope.dat,(argu > excelLimit) ?  $scope.Title + '_'+(''+excelLimit)[0]: $scope.Title, true);
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
			$scope.dat.shift();
			
			JSONToCSVConvertor($scope.dat, $scope.Title, true);
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
			if($stateParams.input.gotoPage.Link == 'methodofpayments'){
				for(i in $scope.MOPdata){
					colName.push($scope.MOPdata[i].name)
					row += $scope.MOPdata[i].label + ',';
				}
			}
			else{
				for(i in $scope.fieldDetails.Section){
					colName.push($scope.fieldDetails.Section[i].FieldName)
					row += $scope.fieldDetails.Section[i].Label + ',';
				}
				for(i in $scope.fieldDetails.Subsection){
					colName.push($scope.fieldDetails.Subsection[i].FieldName)
					row += $scope.fieldDetails.Subsection[i].Label + ',';
				}

				console.log($scope.fieldDetails)

				/*for(i in $scope.fieldDetails.Subsection){
					colName.push($scope.fieldDetails.Subsection[i].FieldName)
					row += $scope.fieldDetails.Subsection[i].Label + ',';
				}*/
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

					//row += '' + JSON.stringify(arrData[i][colName[jk]]) + ',';
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

$scope.showCol = false;
$scope.colLimit = 6;
$scope.dataContainer = '';
var colsplicearr = [];
$scope.splitData = function(dat,size){
	//console.log(dat,size)	
	var dataArr = angular.copy(dat);
	var arr = [];
	while (dataArr.length > 0){
    	arr.push(dataArr.splice(0, size));
	}
	//console.log(arr)
	for(a in arr){
		if(a != 0){
			colsplicearr[a] = arr[a].length + colsplicearr[Number(a-1)];
		}
		else{
			colsplicearr[a] = arr[a].length;
		}
	}
	console.log(colsplicearr)
	return true;
}
var indexPsnt = false;
var k = 0;
$scope.insertSlider = function(index){
	console.log(index)
	for(a in colsplicearr){	
		if(colsplicearr[a] === index){
			indexPsnt = true;
			k = colsplicearr[a]
			//console.log('insertSlider',index,indexPsnt)
		}
		else{
			indexPsnt = false;
		}
	}
	console.log(k, index)
	if(k < index){
	 	return indexPsnt;
	 }
	 else{
		 return !indexPsnt;
	 }


	/*for(a in colsplicearr){
		if((a % 2 === 0)&&(colsplicearr[a] != colsplicearr[colsplicearr.length - 1])&&(e === colsplicearr[a])){
			var k = e;
			setTimeout(function(){				
				$('#'+k+'_I').after('<th ng-click="gotoshowCol()" style="width: 10px; margin: 0; padding: 2px; background: #ccc; border: 1px solid #ccc;"><span><i style="color: #4c679a;" class="fa fa-lg" aria-hidden="true"></i></span></th>')
				console.log(colsplicearr[a],colsplicearr.length,'insert',$('#'+k+'_I'))
			},500)
		}
	}*/
	
}

$scope.gotoshowCol = function(){
	$scope.showCol = !$scope.showCol;
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
	
	// I delete the given data from the Restserver.
	$scope.deleteData = function() {
		delete delData.$$hashKey
		$scope.delval = {}
		for(var j in $scope.primarykey){
			$scope.delval[$scope.primarykey[j]] = delData[$scope.primarykey[j]]			
		}
		
		crudRequest("POST", $stateParams.input.gotoPage.Link+'/delete', $scope.delval).then(function(response){
			if(response.Status === 'Success'){
				$('.modal').modal("hide");
				$scope.CRUD = response.data.data.responseMessage;	
				$scope.CRUD = "Deleted Successfully";	
				$scope.restInputData = 	{
										  "start": 0,
										  "count": 20,
										  "sorts":[]
										}
				//applyRestData();
				$scope.applyRestData();	
			}
		})
	};
	
	$scope.applyRestData = function(argu){
		if(argu){
			$scope.restInputData = 	{
										"start": 0,
										"count": 20,
										"sorts":[]
									}
		}

		crudRequest("POST",$stateParams.input.gotoPage.Link+"/readall",$scope.restInputData).then(function(response){
			$scope.readData = response.data.data;
			$scope.totalForCountBar = $scope.restResponse.totalCount;
			console.log($scope.totalForCountBar)
			//console.log($scope.restResponse.totalCount)
			$scope.readData.splice(0, 0, {});

			$scope.dataLen = response.data.data
			if($scope.readData.length === 1){
				$scope.dataFound = true;
			}
			else{
				$scope.dataFound = false;
			}
			if($scope.CRUD != ""){	
				$scope.alerts = [{
					type : 'success',
					msg : $scope.CRUD		//Set the message to the popup window
				}];					
				$scope.CRUD = ""
				$timeout(callAtTimeout, 4000);
			}				
		})
		$scope.TotalCount = 0;
		for(j in $scope.Status){
			getCountbyStatus($scope.Status[j])
		}	
	}
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
		console.log(argu1,argu2)
		if($stateParams.input.gotoPage.Link == 'methodofpayments'){
			for(k in $scope.MOPdata){
				if($scope.MOPdata[k].type == 'String'){
					argu2.push({
						"columnName": $scope.MOPdata[k].name,
						"operator": "LIKE",
						"value": argu1
					})
				}
			}
		}
		else{
			for(k in $scope.fieldDetails.Section){
				if($scope.fieldDetails.Section[k].Type == 'String'){
					argu2.push({
						"columnName": $scope.fieldDetails.Section[k].FieldName,
						"operator": "LIKE",
						"value": argu1
					})
				}
				/*else if(typeof(argu) === "boolean" && $scope.fieldDetails.Section[k].Type == 'Boolean'){
					$scope.fieldDetails.Section[k].FieldName,$scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[0].clauses.push({
						"columnName": $scope.fieldDetails.Section[k].FieldName,
						"operator": "=",
						"value": argu == 'true' ? 1 : argu == 'false' ? 0 : argu
					})
				}*/
			}
		}
		
		return argu2;
	}
	
	$scope.searchFilter = function(val){
		val = removeEmptyValueKeys(val)
		console.log(val,"asas")
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
						"columnName": "EffectiveFromDate",
						"operator": $('#startDate').val() == $('#endDate').val() ? '=': $('#startDate').val() > $('#endDate').val() ? '<=' : '>=',
						"value": $('#startDate').val()
					})
					$scope.restInputData.filters.groupLvl1[0].groupLvl2[0].groupLvl3[j].clauses.push({
						"columnName": "EffectiveFromDate",
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
		to['EffectiveDate'] = val;
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
	
	$scope.gotoState = function(inputData){

		console.log(inputData)
		inputData['pageTitle'] = $scope.Title;
		inputData['ulName'] = $scope.ulName;
		inputData['parentLink'] = $stateParams.input.gotoPage.Link;
		inputData['pageInfo'] = ($stateParams.input.gotoPage.Link == 'methodofpayments') ? $scope.MOPdata : $scope.fieldDetails;
		inputData['primarykey'] = $scope.primarykey;
		inputData['gotoPage'] = $stateParams.input.gotoPage
		//console.log(inputData)
		$state.go('app.addonoperation', {query: $scope.ulName.replace(/\s+/g, ''), input:inputData});
	}
	
	
	$scope.gotoView = function(inputData){
		//console.log(inputData)
		inputData['pageTitle'] = $scope.Title;
		inputData['ulName'] = $scope.ulName;
		inputData['parentLink'] = $stateParams.input.gotoPage.Link;
		inputData['pageInfo'] = ($stateParams.input.gotoPage.Link == 'methodofpayments')  ? $scope.MOPdata : $scope.fieldDetails
		inputData['primarykey'] = $scope.primarykey;
		inputData['gotoPage'] = $stateParams.input.gotoPage
		//console.log(inputData)
		$state.go('app.addonview', {query: $scope.ulName.replace(/\s+/g, ''), input:inputData});
	}	
	
	/*$scope.getDisplayValue = function(cmprWith, cmprThiz){
		//console.log(cmprThiz)
		if(cmprThiz || cmprThiz==false){
			cmprThiz = cmprThiz.toString()
			for(k in cmprWith.ChoiceOptions){
				if(cmprWith.ChoiceOptions[k].actualvalue == cmprThiz){
					return cmprWith.ChoiceOptions[k].displayvalue
				}
			}
			return cmprThiz
		}
		else{
			return cmprThiz
		}
	}*/
	
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
			//console.log('initial',$scope.restInputData.QueryOrder)
		}
		$scope.applyRestData();
	}
	
	$(document).ready(function () {
		$(".FixHead").scroll(function (e) {
			var $tablesToFloatHeaders = $('table');
			//console.log($tablesToFloatHeaders)
			$tablesToFloatHeaders.floatThead({
				//useAbsolutePositioning: true,
				scrollContainer: true
			})
			//$tablesToFloatHeaders.each(function () {
				//var $table = $(this);
				//console.log($table.find("thead").length)
				 $table.closest('.FixHead').scroll(function (e) {
				 	$table.floatThead('reflow');
				});
			//});
		})
		                                                                                                                                                                                                                                                                                                    


		$(window).bind("resize",function(){
			setTimeout(function(){
               autoScrollDiv();
            $(".listView").scrollLeft(30)      
			},300)
			if($(".dataGroupsScroll").scrollTop() == 0){
				$(".dataGroupsScroll").scrollTop(50)
			}
			
		})
		$(window).trigger('resize');  

	})

	$scope.gotoFilter = function(argu){
		console.log(argu)
		
	}
	$scope.gotoSort = function(argu){
		console.log(argu)
	}

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

	if('triggerIs' in $stateParams.input){	
		//console.log($stateParams.input.triggerIs.val.fieldData)
		setTimeout(function(){
			if($stateParams.input.triggerIs.val.Operation == 'View'){
				$scope.gotoView({'Permission':$scope.permission,'Operation':$stateParams.input.triggerIs.val.Operation,'fieldData':$stateParams.input.triggerIs.val.fieldData,'primarykey':$stateParams.input.triggerIs.val.primarykey})	
			}
			else{
				$scope.gotoState({'Permission':$scope.permission,'Operation':$stateParams.input.triggerIs.val.Operation,'fieldData':$stateParams.input.triggerIs.val.fieldData,'primarykey':$stateParams.input.triggerIs.val.primarykey})					
			}
		},500)
	}

	for(k in $scope.Status){
		//console.log($scope.Status[k])
	}
	
	
	/* Get count */
	function getCountbyStatus(argu){
		crudRequest("GET",$stateParams.input.gotoPage.Link+'/'+argu.actualvalue+'/count',"").then(function(response){
			//console.log(response.data.data.TotalCount,response.data.data)	
			argu.TotalCount = response.data.data.TotalCount;
			$scope.TotalCount = $scope.TotalCount + response.data.data.TotalCount;	
			//console.log($scope.TotalCount,response.data.data.TotalCount,$scope.TotalCount + response.data.data.TotalCount)	
			return response.data.data.TotalCount
		})
	}
	//console.log($scope.TotalCount)
	/* Get count */

});

