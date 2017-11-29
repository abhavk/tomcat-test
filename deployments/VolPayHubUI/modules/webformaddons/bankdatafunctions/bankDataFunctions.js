VolpayApp.controller('webbankDataFunctions', function ($scope, $state, $timeout, $stateParams, $filter, $http, bankData, GlobalService, LogoutService) {
	
	console.log($stateParams.input)	
	$scope.parentInput = $stateParams.input;
	$scope.fieldData = ($stateParams.input.fieldData)?$stateParams.input.fieldData:{}; 

	$scope.Title = $scope.parentInput.pageTitle;
	$scope.ulName = $scope.parentInput.ulName;
	$scope.IconName = ($scope.parentInput.gotoPage.IconName)?$scope.parentInput.gotoPage.IconName:''
	$scope.showPageTitle = $filter('nospace')($scope.Title);
	$scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle);
	$scope.showsubTitle = $scope.showPageTitle+'.Edit';
	$scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle)+'.PageTitle';

	if('FDCParameters' in $scope.fieldData){
		if(typeof($scope.fieldData['FDCParameters']) != 'object' && ($scope.fieldData['FDCParameters'].match(/</g))&&($scope.fieldData['FDCParameters'].match(/>/g))){
			xmlDoc = $.parseXML($scope.fieldData['FDCParameters']); //is valid XML
			var xmlData = xmlDoc.getElementsByTagName("FieldPath");
			var xmlArr = []
			for(k in xmlData){
				if(xmlData[k].innerHTML)
				xmlArr.push(xmlData[k].innerHTML)			
			}
			$scope.fieldData['FDCParameters'] = xmlArr 
		}
		//console.log($scope.fieldData['FDCParameters'])
		setTimeout(function(){
			$("select[name=FDCParameters]").find('option:first-child').remove()
			$("select[name=FDCParameters]").select2({'multiple':true})
			$("select[name=FDCParameters]").select2('val',xmlArr)
		},100) 
	} 
	//console.log($scope.fieldData)
	$scope.subDataObj = {};

	$scope.subSectionfieldData = {};
	if($scope.parentInput.parentLink != 'methodofpayments'){
		if('Subsection' in $scope.parentInput.pageInfo){
			for(k in $scope.parentInput.pageInfo.Subsection){
				$scope.subSectionfield = $scope.parentInput.pageInfo.Subsection[k].subSectionData;
				$scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = ($scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName])? $scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] : [{}];
			}
		}
		else{
			$scope.subSectionfieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] = ($scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName])? $scope.fieldData[$scope.parentInput.pageInfo.Subsection[k].FieldName] : [{}]
			$scope.subSectionfield = [{}]
		}
	}

	//console.log("sec",$scope.subSectionfieldData)
	
	$scope.gotoParent = function(alertMsg){
		$scope.input = {
			'gotoPage' : $stateParams.input.gotoPage,
			'responseMessage' : alertMsg
		}
		$state.go('app.webformPlugin', {query: $scope.parentInput.ulName.replace(/\s+/g, ''), input:$scope.input});
	}
	
	if($scope.parentInput.Operation == 'Clone'){
		for(var k = 0; k<$scope.parentInput.primarykey.length; k++){
			if($scope.parentInput.fieldData){
				$scope.parentInput.fieldData[$scope.parentInput.primarykey[k]] = ''
				console.log($scope.parentInput.primarykey[k],$scope.parentInput.fieldData[$scope.parentInput.primarykey[k]])
			}
		}
	}
	$scope.calldisabled = function(x){
		if($scope.parentInput.Operation != 'Clone'){
			if(($scope.parentInput.parentLink == 'partyserviceassociations') && ((($scope.parentInput.fieldData)&&('PartyCode' === x)) || (($scope.parentInput.fieldData)&&('ServiceCode' === x)))){
				return true
			}
			else if(($scope.parentInput.parentLink == 'partyserviceassociations') && ('PartyServiceAssociationCode' === x)){
				$('input[name=PartyServiceAssociationCode]').attr('placeholder','Select Party Code, Service Code and Input Format')
				return true
			}
			for(var k = 0; k<$scope.parentInput.primarykey.length; k++){
				if(($scope.parentInput.fieldData)&&($scope.parentInput.primarykey[k] === x)){
					return true
				}
			}		
		}
	}
	
	/* $scope.setHeights = function(x){	
		console.log($('#'+$('.anitem').parent().attr('id')))	
		setTimeout(function(){
			//console.log($('.anitem').outerHeight())
			//console.log($('#subSection_0').outerHeight())
			$('#'+$('.anitem').parent().attr('id')).css({'height':$('.anitem').outerHeight()+10+'px'})
			//$('.anitem').css({'height':$('#'+$('.anitem').attr('id')+'_0').outerHeight()+'px'})
		},500)
	} */
	
	$scope.setHeights = function(x){		
		setTimeout(function(){
			var subsec = 'Subsection' in $scope.parentInput.pageInfo ? $scope.parentInput.pageInfo.Subsection.length ? $scope.parentInput.pageInfo.Subsection : $scope.replaceField.Subsection.length ? $scope.replaceField.Subsection : '' :''
			if(subsec){
				for(k in subsec){
					$('#'+subsec[k].FieldName).css({'height':Math.round($('#'+subsec[k].FieldName).find('.anitem').outerHeight())+10+'px'})
				}
			}	
		},500)
	}
	
	$scope.addsubSection = function(x,y,z){
		delete y.$$hashKey;
		$('#'+z).css({'height':$('#'+z+'_'+x).outerHeight()+10+'px'})
		y = removeEmptyValueKeys(y)
		$scope.subSectionfieldData[z] = removeEmptyValueKeys($scope.subSectionfieldData[z])
			if(Object.keys(y).length !== 0){
			//console.log($scope.subSectionfieldData[z])
				$scope.subSectionfieldData[z].push({})
			}
		$('#'+z).animate({scrollTop: ($('#'+z+'_'+x).outerHeight() * (x + 1 )) + 'px'});
	}
	
	$scope.removesubSection = function(x,y,z){
		if($scope.subSectionfieldData[z].length > 1){	
			$scope.subSectionfieldData[z].splice(x,1)
		}
		else{
			//$scope.subSectionNewData[y] = {}
			//console.log(x,y)
		}
	}
	
	/** List and Grid view Ends**/
	$scope.restResponse = {};  
	function crudRequest(_method, _url, _data,_query){
		return $http({
			method: _method,
			url: BASEURL + "/rest/v2/" + _url,
			data: _data,
			params:_query
		}).then(function(response){
			$scope.restResponse = {
				'Status' : 'Success',
				'data'	: response 
			}
			return $scope.restResponse
		},function(error){
				//console.log(error.data.error.message)
			if(error.status == 401){
                if(configData.Authorization=='External'){
                    window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
                }
                else{
                    LogoutService.Logout();
                }
			}
			$scope.restResponse = {
				'Status' : 'Error',
				'data'	: error.data  
			}
			$scope.alerts = [{
				type : 'danger',
				msg : error.data.error.message		//Set the message to the popup window
			}];
			/* $timeout(function(){
				$('#statusBox').hide();
			}, 4000); */
			return $scope.restResponse
		})
	}
	
	
	// I process the Create Data Request.
	$scope.createData = function(newData,subSectionNewData) {
		$scope.backupSubsection = '';
		if($scope.parentInput.parentLink != 'methodofpayments'){
			if(newData[$scope.staticInputbox]){
				newData[$scope.staticInputbox] = newData[$scope.staticInputbox].toString()
			}
			$scope.backupSubsection = angular.copy(subSectionNewData)
			$scope.backupreplaceFieldData = angular.copy($scope.replaceFieldData)
			if(Object.keys($scope.backupreplaceFieldData).length){
				$.each($scope.backupreplaceFieldData, function(key,value){			
					delete $scope.backupreplaceFieldData.$$hashKey;
					if(value && typeof(value) == 'object'){
						$.each(value,function(k,v){
							delete $scope.backupreplaceFieldData[key][k].$$hashKey;
							$scope.backupreplaceFieldData[key][k] = removeEmptyValueKeys($scope.backupreplaceFieldData[key][k])
							if(Object.keys($scope.backupreplaceFieldData[key][k]).length == 0){
							 	$scope.backupreplaceFieldData[key].splice(k,1);								
								if($scope.backupreplaceFieldData[key].length == 0){
									delete $scope.backupreplaceFieldData[key]
								}
							}
						})
					}
					else{
						$scope.backupreplaceFieldData = removeEmptyValueKeys($scope.backupreplaceFieldData);
					}
					
				});
				//console.log($scope.replaceFieldData)
				newData[$scope.nameofthefield] = $scope.backupreplaceFieldData ? JSON.stringify($scope.backupreplaceFieldData) :'';
				//console.log(newData[$scope.nameofthefield])
			} 
			newData = jQuery.extend(newData, $scope.backupSubsection)
		}
		
		$.each(newData, function(key,value){			
			delete newData.$$hashKey;
			//console.log(key,value)
			if(value && typeof(value) == 'object'){
				$.each(value,function(k,v){
					delete newData[key][k].$$hashKey;
					newData[key][k] = removeEmptyValueKeys(newData[key][k])	
					if(Object.keys(newData[key][k]).length == 0){
						delete newData[key];
					}
				})
			}
			else{
				newData = removeEmptyValueKeys(newData);
			}
			
		});
		//console.log(newData)
		//newData = removeEmptyValueKeys(newData);
		$scope.method = ($scope.parentInput.Operation != 'Edit')?"POST":"PUT"
		crudRequest($scope.method, $scope.parentInput.parentLink, newData).then(function(response){
			if(response.Status === "Success"){
				$scope.gotoParent(response.data.data.responseMessage);				
			}
			else{				
				$scope.subSectionfieldData = subSectionNewData;				
			}
		}); 
	};
	
	$scope.checkType = function(eve, type){
		var compareVal = '';
		var regex = {
			'Integer' : /^[0-9]$/,
			'BigDecimal' : /^[0-9.]$/,
			'String' : /^[a-z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~ ]*$/i
		}
		for(var keys in regex){
			if(type === keys){
				compareVal = regex[type]
			}
		}
		
		if(compareVal.test(eve.key) || eve.keyCode == 16 || eve.keyCode == 36 || eve.keyCode == 46 || eve.keyCode == 8 || eve.keyCode == 9 || eve.keyCode == 35 || eve.keyCode == 37 || eve.keyCode == 39 || eve.keyCode == 38 || eve.keyCode == 40){
			return true
		}
		else{
			eve.preventDefault();
		}
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


	$scope.addsubfieldedSection = function(x,y,z){
		delete y.$$hashKey;
		$('#'+z).css({'height':$('#'+z+'_'+x).outerHeight()+10+'px'})
		y = removeEmptyValueKeys(y)
		$scope.replaceFieldData[z] = removeEmptyValueKeys($scope.replaceFieldData[z])
			if(Object.keys(y).length !== 0){
			//console.log($scope.subSectionfieldData[z])
				$scope.replaceFieldData[z].push({})
			}
		$('#'+z).animate({scrollTop: ($('#'+z+'_'+x).outerHeight() * (x + 1 )) + 'px'});
	}
	
	$scope.removesubfieldedSection = function(x,y,z){
		if($scope.replaceFieldData[z].length > 1){	
			$scope.replaceFieldData[z].splice(x,1)
		}
		else{
			//$scope.subSectionNewData[y] = {}
			//console.log(x,y)
		}
	}
	
	$scope.backupCstmdrop = angular.copy($scope.parentInput.pageInfo.Section)
	$scope.replaceField = [];
	$scope.replaceFieldData = {};
	$scope.fieldAddedDetails = [];
	$scope.nameofthefield = '';	
	/*var dummyArr = [];
	function walk(obj,flag) {
		for(var key in obj){						
			if(obj.hasOwnProperty(key)){
				if(Array.isArray(obj[key])){
					console.log('Array',obj[key],key)
					walk(obj[key])
				}
				else if(typeof(obj[key]) == 'object'){
					console.log('object',obj[key],key)
					walk(obj[key],key)
				}
				else{
					console.log('string',obj[key],key)
				}
			}		
		}
		return dummyArr;
	}*/

	function BuildnReplaceField(argu, argu1){
		var obtainedFields = argu.data.data.webformuiformat.fields.field;
		$scope.replaceField = {
			'Section' : [],							/* Field values */
			'Subsection' : []						/* SubField values */
		};
		$scope.replaceFieldData = {};
		$scope.fieldAddedDetails = [];
		$scope.nameofthefield = '';
		console.log(obtainedFields,argu)
		if(argu1){
			$scope.replaceFieldData = argu1;
		}
		
		for(k in obtainedFields){
			//console.log(obtainedFields[k])
			if("webformfieldgroup" in obtainedFields[k].fieldGroup1){
				$scope.replaceField.Section.push({
					'FieldName' : ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
					'Type' : ('type' in obtainedFields[k] ? obtainedFields[k].type : ''),
					'Label' : ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
					'InputType' : ('type' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
					'MaxLength' : ('width' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
					'Mandatory' : ('notnull' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
					'ChoiceOptions' : (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice)?obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions:'',
					'Rows' : (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea")? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows:'',
					'PrimaryKey' : (obtainedFields[k].name == $scope.primarykey) ? true : false,
					'Visible' : ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]):false,
					'View' : ('visible' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : '')
				})					
					
				if('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 && obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label == 'Status' && 'Choice' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer){							
					$scope.Status = obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions;
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
				$scope.replaceField.Subsection.push({	
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

		if('Subsection' in $scope.replaceField){
			for(k in $scope.replaceField.Subsection){
				if(!$scope.replaceFieldData[$scope.replaceField.Subsection[k].FieldName]){
					$scope.replaceFieldData[$scope.replaceField.Subsection[k].FieldName] = [{}]
				}
			}
		}
		//console.log($scope.replaceField)
		return $scope.replaceField;
		
	}
	
	//$scope.checkIfthereIs = false;
	$scope.dependedDropval = function(x,y,z,z1){
		console.log('Selva',x,y,z,$scope.fieldData,z1)		
		$scope.dependedval = {
			'Direction'	:	['Reference Code', 'Transport Type', 'Transport Mode'],
			'TransportType'	:	['Transport Mode'],
			'InputFormat'	:	['File Duplicate Check - Parameters'],
			'IncidenceCode' :   ['Process Status'],
			'ServiceCode' :   ['Additional Config'],
			'WorkFlowCode':['Process Status', 'Action']
		}
		
		//$scope.nameofthefield = '';
		for(var chk in $scope.backupCstmdrop){
			for(k in $scope.dependedval[z]){
				if($scope.backupCstmdrop[chk].Label === $scope.dependedval[z][k]){
				//console.log(k,$scope.dependedval,$scope.backupCstmdrop[chk].Label,$scope.dependedval[z][k],chk)
				var observedIndex = chk;
				var droplink = $scope.backupCstmdrop[chk].ChoiceOptions;
				//console.log(droplink,$scope.backupCstmdrop[chk])
				if($scope.backupCstmdrop[chk].Label == 'Additional Config'){
				//$scope.fieldAddedDetails = [];	
				var saveDropval = '';
					if(z1){
						$scope.setInitval(z1)
					}
					//console.log($scope.backupCstmdrop[chk],$scope.nameofthefield)
					droplink = 'property' in droplink ? droplink.property : droplink
					setTimeout(function(){
						for(var k in droplink){
							//console.log('selva',droplink[k].name.split('|')[0], $("[name="+z+"]").val())	
							//console.log(droplink[k].value,droplink[k].name.match(/\|/g),$("[name="+z+"]").val())
				/*	RPX Supported		*/ if(droplink[k].name.match(/\|/g) && droplink[k].name.split('|')[0] == $("[name="+z+"]").val()){
							//	alert();
							//if(droplink[k].name.match(/\|/g) && droplink[k].name.split('|')[0] == $("[name="+z+"]").val() && $("[name="+z+"]").val() != 'RPX'){
								saveDropval = droplink[k].name.split('|')[0];
								$scope.nameofthefield = 'AdditionalConfig';
								//console.log('if',$scope.fieldData[$scope.nameofthefield],droplink[k].value,$scope.nameofthefield)
								var inputData = $scope.nameofthefield in $scope.fieldData ? JSON.parse($scope.fieldData[$scope.nameofthefield]) : '';
								crudRequest("GET",droplink[k].value,'').then(function(response){
									$scope.fieldAddedDetails = BuildnReplaceField(response,inputData);
									//console.log($scope.fieldAddedDetails)
								})
								break;								
							}
						}
						
					},2500)
					console.log($scope.fieldAddedDetails,saveDropval,Object.keys($scope.fieldAddedDetails).length)						
						if(saveDropval == ''){
							console.log('came')
							$scope.replaceField = [];
							$scope.replaceFieldData = {};
							$scope.fieldAddedDetails = [];
							$scope.nameofthefield = '';
						}
					//},100)
				}
				else{
					if((droplink && droplink[0].value === $filter('removeSpace')(z))){
					var links = '';
					for(var k in droplink){						
						//console.log(droplink[k],droplink[k].name.split('|')[0],y, $filter('removeSpace')(z) )
						if((droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) && ($filter('removeSpace')(z) =='InputFormat') ){
							$scope.staticInputbox = $scope.parentInput.pageInfo.Section[observedIndex].FieldName
							links = droplink[k].value.split('/')[0]+'/'+y							
							//console.log($scope.staticInputbox)
							setTimeout(function(){								
								$("[name="+$scope.staticInputbox+"]").attr({'multiple':true,'data-placeholder':'Select an option...'})
								if(!$("[name="+$scope.staticInputbox+"]").find('option:first-child').attr('value')){
									$("[name="+$scope.staticInputbox+"]").find('option:first-child').remove()
									$("[name="+$scope.staticInputbox+"]").select2();
									$("[name="+$scope.staticInputbox+"]").select2('val',$scope.fieldData['FDCParameters'])
								}
								else{									
									$("[name="+$scope.staticInputbox+"]").val($scope.fieldData['FDCParameters'])
								}
							},500)
							//$("[name="+$scope.parentInput.pageInfo.Section[observedIndex].FieldName+"]").multiselect();		//console.log($scope.staticInputbox,$scope.parentInput.pageInfo.Section[observedIndex],$("[name="+$scope.staticInputbox+"]"))

						}
						else if((droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) && ($filter('removeSpace')(z) =='WorkFlowCode') ){
							console.log(x,y,z,z1)
							$scope.staticInputbox = $scope.parentInput.pageInfo.Section[observedIndex].FieldName
							links = '';
							//links = droplink[k].value.split('/')[0]+'/'+y							
								something(droplink[k].value.split('/')[0]+'/'+y,observedIndex,{start:0,count:500})
							}
							else if(droplink[k].name.split('|')[0] == y){								
								links = droplink[k].value
								//console.log("links",links)
							}
							else if(droplink[k].name.split('|')[0] == $filter('removeSpace')(z)){							
								//console.log("else",droplink[k],y)
								//links = droplink[k].value
								//console.log(droplink[k].value.split('/')[0])
								if(y){
									links = droplink[k].value.split('/')[0]+"/"+y
								}
							}

							// else{
							// 	//alert("entered")
							// 	links = droplink[k].value
							// 	console.log("3aaa",links)
							// }
						}
						if(links){	
							something(links,observedIndex,'')
						}
					}
					else if(droplink && droplink[0].value.indexOf('&&') > -1) {
						//alert("3")
						var queryParams = [];
						for(j in droplink[0].value.split('&&')){
							queryParams.push(droplink[0].value.split('&&')[j].trim())
						}
						setTimeout(function(){
							for(k in droplink){
								if(droplink[k].name == 'REST'){
										var k = droplink[k].value
										for(u in queryParams){
											if(k.indexOf(queryParams[u]) > -1){
												if($("select[name="+queryParams[u]+"]").val()){
													k = k.replace('{'+queryParams[u]+'}', $("select[name="+queryParams[u]+"]").val())
												}
												else{
													k = ''
												}
												
											}
										}
										if(k){
											something(k,observedIndex,'')
										}
										
								}
							}	
						},750)					
					}
					else{
						$scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = $scope.backupCstmdrop[observedIndex].ChoiceOptions
					}
				}
							
				}
			}
			
		}
	}
	var something = function(links,observedIndex,queryfield){
		console.log(links,observedIndex,queryfield)
		crudRequest("GET",links,'',queryfield).then(function(response){
			$scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
			//console.log(observedIndex,response.data.data,$scope.parentInput.pageInfo.Section[observedIndex])
			//console.log($scope.parentInput.pageInfo.Section[observedIndex])
		})		
	}

	
	$scope.activatePicker = function(e){
		var prev = null;
		$('.DatePicker').datetimepicker({
			format:"YYYY-MM-DD",
			useCurrent: false,
			showClear: true
		}).on('dp.change', function(ev){				
			console.log($(ev.currentTarget).attr('ng-model').split('[')[0])
			
			if($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData'){
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}
			else{
				var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
				$scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
			}
		}).on('dp.show', function(ev){
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": ""});
		if($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2){	
			$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
				if($(this).is("#"+$(ev.currentTarget).parent().parent().parent().parent().attr('id'))){					
				}
				else{
					$(this).css({"display": "none"});
				}
			})
		}		
	}).on('dp.hide', function(ev){
		if($(ev.currentTarget).parent().parent().parent().parent().attr('id')){
			var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
			var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0]
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": "auto"});
			$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
				$(this).css({"display": ""});				
			})	
			$('#'+y).animate({scrollTop: ($('#'+y+'_'+x).outerHeight() * (x + 1 )) + 'px'},0);
		}			
	});



		$('.TimePicker').datetimepicker({
			format: 'HH:mm:ss',
			useCurrent: false,
		}).on('dp.change', function(ev){


			if($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData'){
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}
			else{
				var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
				$scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
			}

			console.log("abc")
			//console.log($scope.subSectionfieldData,$scope.subSectionfieldData.length,$(ev.currentTarget).attr('name'),$(ev.currentTarget).val())
		}).on('dp.show', function(ev){
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": ""});
		if($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2){	
			$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
				if($(this).is("#"+$(ev.currentTarget).parent().parent().parent().parent().attr('id'))){					
				}
				else{
					$(this).css({"display": "none"});
				}
			})
		}		
		}).on('dp.hide', function(ev){
			if($(ev.currentTarget).parent().parent().parent().parent().attr('id')){
				var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
				var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0]
				$(ev.currentTarget).parent().parent().parent().parent().parent().css({"overflow-y": "auto"});
				$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function(){
					$(this).css({"display": ""});				
				})	
				$('#'+y).animate({scrollTop: ($('#'+y+'_'+x).outerHeight() * (x + 1 )) + 'px'},0);
			}
		});
	 }
	 
	 $scope.triggerPicker = function(e){		 
		 if($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')){
			$(e.currentTarget).prev().focus().click()
			$scope.activatePicker($(e.currentTarget).prev());
			$('input[name='+$(e.currentTarget).prev().attr('name')+']').data("DateTimePicker").show();
		}
	};
	
	
	/* 
        $scope.dateRangePickerFn = function(){
        	$.getScript("https://cdnjs.cloudflare.com/ajax/libs/bootstrap-datepicker/1.6.0/locales/bootstrap-datepicker.ar.min.js", function(){
            var startDate = new Date();
            var FromEndDate = new Date();
            var ToEndDate = new Date();
            ToEndDate.setDate(ToEndDate.getDate()+365);

           
                $('#EntryStartDate').datepicker({
                weekStart: 1,
                startDate: '1900-01-01',
                minDate:1,
                endDate: FromEndDate,
                autoclose: true,
                format: 'yyyy-mm-dd'
                })
                .on('changeDate', function(selected){
                startDate = new Date(selected.date.valueOf());
                    startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
                $('#EntryEndDate').datepicker('setStartDate', startDate);

				 });

				$('#EntryStartDate').datepicker('setEndDate', FromEndDate);

				$('#EntryEndDate')
                .datepicker({
                    weekStart: 1,
                    startDate: startDate,
                    endDate: ToEndDate,
                    autoclose: true,
                    format: 'yyyy-mm-dd'
				})
                .on('changeDate', function(selected){
                FromEndDate = new Date(selected.date.valueOf());
                    FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
                    $('#EntryStartDate').datepicker('setEndDate', FromEndDate);
                });

                $('#EntryEndDate').datepicker('setStartDate', startDate);






            });

        }

		$scope.dateRangePickerFn();
	 */
	
	$(document).ready(function(){
			
		if(Object.keys($scope.fieldData).length == 0){
			var pageLimitCount = 500;
			//console.log($scope.fieldData,$scope.parentInput.pageInfo.Section)
			var remoteDataConfig = function(){
				
				$(".appendSelect2").select2({
					ajax: {					
					url: function(){						
						var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {'_data':$scope.parentInput.pageInfo.Section,'_name' : 'FieldName'} : {'_data':$scope.parentInput.pageInfo,'_name' : 'name'};
						for(k in _link._data){
							if(_link._data[k][_link._name] == $(this).attr('name')){
								$scope.links = _link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length-1].configDetails.links
							}
						}
						return BASEURL + "/rest/v2/" + $scope.links
					},
					headers: {"Authorization" : "SessionToken:"+sessionStorage.SessionToken,"Content-Type" : "application/json"},
					dataType: 'json',
					delay: 250,
					xhrFields : {
						withCredentials : true
					},
					beforeSend : function(xhr){
					xhr.setRequestHeader('Cookie', document.cookie),
					xhr.withCrendentials = true
					},
					crossDomain : true,
					data: function (params) {
						//console.log(params)
						var query = {
							start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
							count : pageLimitCount
						}
						if(params.term){
							query = {
								search : params.term,
								start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
								count : pageLimitCount
							};
						}	
						return query;
					},
					/*transport: function(params) {
						var callback = params.success;
						params.success = function(data, textStatus, jqXHR) {
							$scope.responseHeaderTcount = jqXHR.getResponseHeader('totalCount')
							 callback({
								items: data,
								total: jqXHR.getResponseHeader('totalCount')
							 }, textStatus, jqXHR);
						};
						return $.ajax(params);
					},*/
					processResults: function (data, params) {			
						params.page = params.page ? params.page : 0;
						var myarr = []
						for(j in data){
							myarr.push({
								'id' : data[j].actualvalue,
								'text':data[j].displayvalue
							})
						}
						return {
							results: myarr,
							pagination: {
								more: data.length >= pageLimitCount
							}
						};
					},
					cache: true
					},
					placeholder : 'Select',
					minimumInputLength: 0,
					allowClear : true
					/*,tags: true,
					createTag: function (tag) {
						console.log(tag)
						return {
							id: tag.term,
							text: tag.term,
							tag: true
						};
					}*/
				});
			}	
			remoteDataConfig();
		}
			
		$(".appendSelect2").on("change", function(e) { 
			if(($(e.currentTarget).attr('name') == 'PartyCode') || ($(e.currentTarget).attr('name') == 'ServiceCode') || ($(e.currentTarget).attr('name') == 'InputFormat')){
				$('input[name=PartyServiceAssociationCode]').val($('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() +'_'+ $('select[name=ServiceCode]').val() +'_'+ $('select[name=InputFormat]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() : $('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() +'_'+ $('select[name=ServiceCode]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() +'_'+ $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() +'_'+ $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() : '')
				$scope.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val()
			}			
		});
	})
	$scope.setInitval = function(argu){
	
			console.log('came',argu)
			$scope.multipleFlag = false;
			var _name = ($scope.parentInput.parentLink != 'methodofpayments') ? argu.FieldName : argu.name;
			var _query = {}
			if($scope.fieldData[_name] && $scope.fieldData[_name].match(/\,/g)){
				$scope.multipleFlag = true
				_query = {
					search : $scope.fieldData[_name].split(',')[0],
					start : 0,
					count : 1000
				}
				/* for(k in $scope.fieldData[_name].split(',')){
					crudRequest('GET', argu.ChoiceOptions[argu.ChoiceOptions.length-1].configDetails.links,'',_query).then(function(response){
						for(k in response.data.data){
							argu.ChoiceOptions.splice(argu.ChoiceOptions.length-1,0,response.data.data[k])
						}						
					});					
				} */
			}
			else{
				_query = {
					search : $scope.fieldData[_name],
					start : 0,
					count : 1000
				}				
			}
			crudRequest('GET', argu.ChoiceOptions[argu.ChoiceOptions.length-1].configDetails.links,'',_query).then(function(response){
				//console.log('Single',argu,response.data.data)
				for(k in response.data.data){
					argu.ChoiceOptions.splice(argu.ChoiceOptions.length-1,0,response.data.data[k])
					//console.log('Single',argu.ChoiceOptions, $scope.fieldData[_name])
				}					
			});
			
			setTimeout(function(){	
				var pageLimitCount = 500;
				console.log('dsf',$scope.multipleFlag)
				$('select[name='+_name+']').select2({
					ajax: {					
					url: function(){
						var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {'_data':$scope.parentInput.pageInfo.Section,'_name' : 'FieldName'} : {'_data':$scope.parentInput.pageInfo,'_name' : 'name'};
						//console.log(_link)
						for(k in _link._data){							
							if(_link._data[k][_link._name] == _name){
								//console.log(_link._data[k])
								$scope.links = _link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length-1].configDetails.links
							}
						}
						return BASEURL + "/rest/v2/" + $scope.links
					},
					headers: {"Authorization" : "SessionToken:"+sessionStorage.SessionToken,"Content-Type" : "application/json"},
					dataType: 'json',
					delay: 250,
					xhrFields : {
						withCredentials : true
					},
					beforeSend : function(xhr){
					xhr.setRequestHeader('Cookie', document.cookie),
					xhr.withCrendentials = true
					},
					crossDomain : true,
					data: function (params) {
						//console.log(params)
						var query = {
							start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
							count : pageLimitCount
						}
						if(params.term){
							query = {
								search : params.term,
								start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
								count : pageLimitCount
							};
						}	
						return query;
					},
					processResults: function (data, params) {			
						params.page = params.page ? params.page : 0;
						var myarr = []
						for(j in data){
							myarr.push({
								'id' : data[j].actualvalue,
								'text':data[j].displayvalue
							})
						}
						return {
							results: myarr,
							pagination: {
								more: data.length >= pageLimitCount
							}
						};
					},
					cache: true
					},
					placeholder : 'Select',
					minimumInputLength: 0,
					allowClear : true
					/*,tags: true,
					createTag: function (tag) {
						console.log(tag)
						return {
							id: tag.term,
							text: tag.term,
							tag: true
						};
					}*/
				});
			},100)		
		}
});
