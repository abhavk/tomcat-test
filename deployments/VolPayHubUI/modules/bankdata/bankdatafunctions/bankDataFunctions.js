VolpayApp.controller('bankDataFunctions', function ($scope, $state, $timeout, $stateParams, $filter, $http, bankData, GlobalService, LogoutService) {

	//console.log($stateParams.input)
	$scope.parentInput = $stateParams.input;
	$scope.fieldData = ($stateParams.input.fieldData) ? $stateParams.input.fieldData : {};

	$scope.Title = $scope.parentInput.pageTitle;
	$scope.ulName = $scope.parentInput.ulName;
	$scope.IconName = ($scope.parentInput.gotoPage.IconName) ? $scope.parentInput.gotoPage.IconName : ''
	$scope.showPageTitle = $filter('nospace')($scope.Title);
	$scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle);
	$scope.showsubTitle = $scope.showPageTitle + '.Edit';
	$scope.showPageTitle = $filter('specialCharactersRemove')($scope.showPageTitle) + '.PageTitle';

	
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

	$scope.gotoParent = function (alertMsg) {
		$scope.input = {
			'gotoPage' : $stateParams.input.gotoPage,
			'responseMessage' : alertMsg
		}
		$state.go('app.bankData', {query: $scope.parentInput.ulName.replace(/\s+/g, ''), input:$scope.input});
	}

	if ($scope.parentInput.Operation == 'Clone') {
		for (var k = 0; k < $scope.parentInput.primarykey.length; k++) {
			if ($scope.parentInput.fieldData) {
				$scope.parentInput.fieldData[$scope.parentInput.primarykey[k]] = ''
					if ($scope.parentInput.primarykey[k] == 'PartyServiceAssociationCode') {
						var PSAdepended = ['PartyCode', 'ServiceCode', 'InputFormat']
						for (j in PSAdepended) {
							//console.log($scope.parentInput.primarykey[k],PSAdepended[j])
							$scope.parentInput.fieldData[PSAdepended[j]] = ''
						}
					}
			}
		}
	}
	$scope.calldisabled = function (x) {
		if ($scope.parentInput.Operation != 'Clone') {
			if (($scope.parentInput.parentLink == 'partyserviceassociations') && ((($scope.parentInput.fieldData) && ('PartyCode' === x)) || (($scope.parentInput.fieldData) && ('ServiceCode' === x)))) {
				return true
			} else if (($scope.parentInput.parentLink == 'partyserviceassociations') && ('PartyServiceAssociationCode' === x)) {
				$('input[name=PartyServiceAssociationCode]').attr('placeholder', 'Select Party Code, Service Code and Input Format')
				return true
			}
			for (var k = 0; k < $scope.parentInput.primarykey.length; k++) {
				if (($scope.parentInput.fieldData) && ($scope.parentInput.primarykey[k] === x)) {
					return true
				}
			}
		}
		if (($scope.parentInput.parentLink == 'partyserviceassociations') && ('PartyServiceAssociationCode' === x)) {
			$('input[name=PartyServiceAssociationCode]').attr('placeholder', 'Select Party Code, Service Code and Input Format')
			return true
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

	$scope.setHeights = function (x) {
		setTimeout(function () {
			var subsec = 'Subsection' in $scope.parentInput.pageInfo ? $scope.parentInput.pageInfo.Subsection.length ? $scope.parentInput.pageInfo.Subsection : $scope.replaceField.Subsection.length ? $scope.replaceField.Subsection : '' : ''
				if (subsec) {
					for (k in subsec) {
						$('#' + subsec[k].FieldName).css({
							'height' : Math.round($('#' + subsec[k].FieldName).find('.anitem').outerHeight()) + 10 + 'px'
						})
					}
				}
		}, 500)
	}
	
	
	$scope.remove_Section = function(x,y,z){
		//console.log(x,y,z)
		if(y[z].length > 1){	
			y[z].splice(x,1)
		}
		else{
		}
	}
	$scope.addsubSection = function(x,y,z){
		console.log('',x,y,z)
		delete y.$$hashKey;
		$('#'+z.FieldName).css({'height':$('#'+z.FieldName+'_'+x).outerHeight()+10+'px'})
		y = removeEmptyValueKeys(y)
		$scope.subSectionfieldData[z.FieldName] = removeEmptyValueKeys($scope.subSectionfieldData[z.FieldName])
			if(Object.keys(y).length !== 0){
			//console.log($scope.subSectionfieldData[z])
				$scope.subSectionfieldData[z.FieldName].push({})
			}
		$('#'+z.FieldName).animate({scrollTop: ($('#'+z.FieldName+'_'+x).outerHeight() * (x + 1 )) + 'px'});
		
	}

	$scope.removesubSection = function (x, y, z) {
		if ($scope.subSectionfieldData[z].length > 1) {
			$scope.subSectionfieldData[z].splice(x, 1)
		} else {
			//$scope.subSectionNewData[y] = {}
			//console.log(x,y)
		}
	}

	/** List and Grid view Ends**/
	$scope.restResponse = {};
	function crudRequest(_method, _url, _data, _query) {
		return $http({
			method : _method,
			url : BASEURL + "/rest/v2/" + _url,
			data : _data,
			params : _query
		}).then(function (response) {
			$scope.restResponse = {
				'Status' : 'Success',
				'data' : response
			}
			return $scope.restResponse
		}, function (error) {
			//console.log(error.data.error.message)
			if (error.status == 401) {
				if (configData.Authorization == 'External') {
					window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
				} else {
					LogoutService.Logout();
				}
			}
			$scope.restResponse = {
				'Status' : 'Error',
				'data' : error.data
			}
			$scope.alerts = [{
					type : 'danger',
					msg : error.data.error.message //Set the message to the popup window
				}
			];
			/* $timeout(function(){
			$('#statusBox').hide();
			}, 4000); */
			return $scope.restResponse
		})
	}
	
		
	$scope.cleantheinputdata = function(argu){
		//console.log(argu)
		for(var k in argu){
			//console.log(argu[k])
			if($.isPlainObject(argu[k])){
				var isEmptyObj = $scope.cleantheinputdata(argu[k])
				if($.isEmptyObject(isEmptyObj)){
					delete argu[k]
				}
				else{
					//console.log(argu[k])
					argu[k] = JSON.stringify(argu[k])				
				}
			}
			else if(Array.isArray(argu[k])){
				//console.log(argu[k])
				for(var n in argu[k]){	
					var isEmptyObj1 = $scope.cleantheinputdata(argu[k][n])
					if($.isEmptyObject(isEmptyObj1)){
						argu[k].splice(n, 1);
					}
				}
				if(argu[k].length){
					var _val_ = true;
					for(var j in argu[k]){
						if($.isPlainObject(argu[k][j])){
							//argu[k][j] = JSON.stringify(argu[k][j])	
							_val_ = false
						}
					}
					if(_val_){
						argu[k] = argu[k].toString()						
					}
					else{
						console.log(argu[k])
						//argu[k] = argu[k].toString()	
						//argu[k] = argu[k].toString()	
						//argu[k] = JSON.stringify(argu[k])		
					}
				}					
				else{
					delete argu[k]
				}
			}
			else if(argu[k] === "" || argu[k] === undefined || argu[k] === null){
				delete argu[k]
			}
			else{
				argu[k] = argu[k]
			}
		}
		return argu
	}
	
	// I process the Create Data Request.
	$scope.createData = function(newData,subSectionNewData) {
		console.log(newData,subSectionNewData,$scope.replaceFieldData,$scope.nameofthefield)
		$scope.backupSubsection = subSectionNewData ? angular.copy(subSectionNewData) : ''
		$scope.backupNewData = newData ? angular.copy(newData) : ''
		$scope.backupreplaceFieldData = $scope.replaceFieldData ? angular.copy($scope.replaceFieldData) : ''
		if($scope.backupSubsection && $.isPlainObject($scope.backupSubsection)){	
			$scope.backupSubsection = $scope.cleantheinputdata($scope.backupSubsection)
			$scope.backupNewData = jQuery.extend($scope.backupNewData, $scope.backupSubsection)
		}
		$scope.backupNewData = $scope.cleantheinputdata($scope.backupNewData)
		$scope.backupreplaceFieldData = $scope.cleantheinputdata($scope.backupreplaceFieldData)
		/*if($scope.backupreplaceFieldData){
			$scope.backupNewData[$scope.nameofthefield] = {};
			//console.log(newData[$scope.nameofthefield])
			for(var k in $scope.backupreplaceFieldData){
				//console.log(k,$scope.backupreplaceFieldData[k],newData[$scope.nameofthefield])
				if($.isPlainObject($scope.backupreplaceFieldData[k])){
					$scope.backupNewData[$scope.nameofthefield][k] = {}
					var isEmptyObj = $scope.cleantheinputdata($scope.backupreplaceFieldData[k])				
					if($.isEmptyObject(isEmptyObj)){
						delete $scope.backupNewData[$scope.nameofthefield][k]
					}
					else{
						$scope.backupNewData[$scope.nameofthefield][k] = JSON.stringify($scope.backupreplaceFieldData[k])				
					}
				}
				else if(Array.isArray($scope.backupreplaceFieldData[k])){
					$scope.backupNewData[$scope.nameofthefield][k] = []
					for(var n in $scope.backupreplaceFieldData[k]){						
						var isEmptyObj = $scope.cleantheinputdata($scope.backupreplaceFieldData[k][n])
						if($.isEmptyObject(isEmptyObj)){
							$scope.backupreplaceFieldData[k].splice(n, 1);
						}
					}
					if($scope.backupreplaceFieldData[k].length){
						$scope.backupNewData[$scope.nameofthefield][k] = JSON.stringify($scope.backupreplaceFieldData[k])
					}					
					else{
						delete $scope.backupNewData[$scope.nameofthefield][k]
					}
				}
				else{
					$scope.backupNewData[$scope.nameofthefield][k] = $scope.backupreplaceFieldData[k]
				}
			}
			//newData[$scope.nameofthefield] = jQuery.extend(newData[$scope.nameofthefield], $scope.backupreplaceFieldData)			
		}*/
		
		if($scope.backupreplaceFieldData && $scope.nameofthefield){
			$scope.backupNewData[$scope.nameofthefield] = JSON.stringify($scope.backupreplaceFieldData)			
		}
		//console.log($scope.backupNewData)
		$scope.method = ($scope.parentInput.Operation != 'Edit')?"POST":"PUT"
		crudRequest($scope.method, $scope.parentInput.parentLink, $scope.backupNewData).then(function(response){
			if(response.Status === "Success"){
				$scope.gotoParent(response.data.data.responseMessage);				
			}
			else{				
				$scope.subSectionfieldData = subSectionNewData;				
			}
		});
	};

	$scope.checkType = function (eve, type) {
		var compareVal = '';
		var regex = {
			'Integer' : /^[0-9]$/,
			'BigDecimal' : /^[0-9.]$/,
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

	$scope.multipleEmptySpace = function (e) {
		if ($.trim($(e.currentTarget).val()).length == 0) {
			$(e.currentTarget).val('');
		}
		if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
			$(e.currentTarget).data("DateTimePicker").hide();
		}
	}

	$scope.addsubfieldedSection = function (x, y, z) {
		delete y.$$hashKey;
		$('#' + z).css({
			'height' : $('#' + z + '_' + x).outerHeight() + 10 + 'px'
		})
		y = removeEmptyValueKeys(y)
			$scope.replaceFieldData[z] = removeEmptyValueKeys($scope.replaceFieldData[z])
			if (Object.keys(y).length !== 0) {
				//console.log($scope.subSectionfieldData[z])
				$scope.replaceFieldData[z].push({})
			}
			$('#' + z).animate({
				scrollTop : ($('#' + z + '_' + x).outerHeight() * (x + 1)) + 'px'
			});
	}

	$scope.removesubfieldedSection = function (x, y, z) {
		if ($scope.replaceFieldData[z].length > 1) {
			$scope.replaceFieldData[z].splice(x, 1)
		} else {
			//$scope.subSectionNewData[y] = {}
			//console.log(x,y)
		}
	}

	$scope.backupCstmdrop = angular.copy($scope.parentInput.pageInfo.Section)
		$scope.replaceField = [];
	$scope.replaceFieldData = {};
	$scope.fieldAddedDetails = [];
	$scope.nameofthefield = '';

	function callforVisibility(x) {
		for (var k in x.customattributes.property) {
			if (x.customattributes.property[k].name === 'WebFormExcerptView') {
				return x.customattributes.property[k].value
			}
		}
	}
	function BuildnReplaceField(argu, argu1) {
		//		console.log(argu, argu1)
		var obtainedFields = argu.data.data.Data.webformuiformat.fields.field;
		$scope.replaceField = {
			'Section' : [], /* Field values */
			'Subsection' : []/* SubField values */
		};
		$scope.replaceFieldData = {};
		$scope.fieldAddedDetails = [];
		//console.log(argu1)
		if (argu1) {
			$scope.replaceFieldData = argu1;
		}
		for (k in obtainedFields) {
			//console.log(obtainedFields[k])
			if ("webformfieldgroup" in obtainedFields[k].fieldGroup1) {
				$scope.replaceField.Section.push({
					'FieldName' : ('name' in obtainedFields[k] ? obtainedFields[k].name : ''),
					'Type' : ('type' in obtainedFields[k] ? obtainedFields[k].type : ''),
					'Label' : ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label : ''),
					'InputType' : ('type' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type : ''),
					'MaxLength' : ('width' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width : ''),
					'Mandatory' : ('notnull' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.notnull : ''),
					'ChoiceOptions' : (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice)?obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions:'',
					'Multiple' : (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice)?obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].choiceOptions : '',
					'Rows' : (obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea")? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows:'',
					'PrimaryKey' : (obtainedFields[k].name == $scope.primarykey) ? true : false,
					'Visible' : ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) : false,
					'property' : ('customattributes' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
					'View' : ('visible' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 ? obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible : '')
				})

				if ('label' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2 && obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label == 'Status' && 'Choice' in obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer) {
					$scope.Status = obtainedFields[k].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions;
				}
			} else {
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
					'ChoiceOptions' : (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice)? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions:'',
					'Multiple' : (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice)? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.Choice.choiceOptions:'',
					'Rows' : (obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type == "TextArea")? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].rows:'',
					'Visible' : ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? callforVisibility(obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]):false,					
					'property': ('customattributes' in obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type]) ? obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[obtainedFields[k].fieldGroup1.webformsectiongroup.fields.field[j].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].customattributes.property : false,
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

		if ('Subsection' in $scope.replaceField) {
			for (k in $scope.replaceField.Subsection) {
				if (!$scope.replaceFieldData[$scope.replaceField.Subsection[k].FieldName]) {
					$scope.replaceFieldData[$scope.replaceField.Subsection[k].FieldName] = [{}
					]
				}
			}
		}
		//console.log($scope.replaceField)
		return $scope.replaceField;

	}

	//$scope.checkIfthereIs = false;
	$scope.dependedDropval = function (x, y, z, z1,z2) {
		//console.log('Selva', x, y, z, z1)
		$scope.dependedval = {
			'Direction' : ['Reference Code', 'Transport Type', 'Transport Mode'],
			'TransportType' : ['Transport Mode'],
			'InputFormat' : ['File Duplicate Check - Parameters'],
			'IncidenceCode' : ['Process Status'],
			'ServiceCode' : ['Additional Config'],
			'WorkFlowCode' : ['Process Status', 'Action'],
			'ResourceName' : ['Operation', 'Attribute Name']
		}
		//$scope.nameofthefield = '';
		for(var chk in $scope.backupCstmdrop){
			for(k in $scope.dependedval[z]){
				if($scope.backupCstmdrop[chk].Label === $scope.dependedval[z][k]){	
				//console.log($scope.backupCstmdrop[chk].FieldName in $scope.fieldData)
				if($scope.backupCstmdrop[chk].FieldName in $scope.fieldData && z2){
					if($scope.backupCstmdrop[chk].FieldName == 'FDCParameters'){						//console.log($scope.fieldData[$scope.backupCstmdrop[chk].FieldName],$scope.backupCstmdrop[chk].FieldName)						
					}
					else{
						console.log('came')
						$scope.fieldData[$scope.backupCstmdrop[chk].FieldName] = ''						
					}
				}
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
					//console.log($scope.fieldAddedDetails,saveDropval,Object.keys($scope.fieldAddedDetails).length)						
						if(saveDropval == ''){
						//	console.log('came')
							$scope.replaceField = [];
							$scope.replaceFieldData = {};
							$scope.fieldAddedDetails = [];
							$scope.nameofthefield = '';
						}
				}
				else{
						
					//console.log(droplink && droplink[0].value)
					droplink = 'property' in droplink ? droplink.property : droplink
					if((droplink && droplink[0].value === $filter('removeSpace')(z))){
						//console.log('input',z1)	
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
								
								if(z1){
									$scope.setInitval(z1)
								}
							},500)
							//$("[name="+$scope.parentInput.pageInfo.Section[observedIndex].FieldName+"]").multiselect();		//console.log($scope.staticInputbox,$scope.parentInput.pageInfo.Section[observedIndex],$("[name="+$scope.staticInputbox+"]"))

									} else if ((droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) && ($filter('removeSpace')(z) == 'WorkFlowCode')) {
										//console.log(x,y,z,z1)
										$scope.staticInputbox = $scope.parentInput.pageInfo.Section[observedIndex].FieldName
											links = '';
										//links = droplink[k].value.split('/')[0]+'/'+y
										something(droplink[k].value.split('/')[0] + '/' + y, observedIndex, {
											start : 0,
											count : 500
										})
									} else if (droplink[k].name.split('|')[0] == y) {
										links = droplink[k].value
											//console.log("links",links)
									} else if (droplink[k].name.split('|')[0] == $filter('removeSpace')(z)) {
										if ($filter('removeSpace')(z) == 'ResourceName') {
											var linkss;
											for (jk in $scope.dependedval[z]) {
												for (kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData) {
													console.log('came', y, $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj], $scope.dependedval[z][jk])
													if ($scope.dependedval[z][jk] == $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].Label) {
														var keysss = kj
															if (y) {
																if ($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[1].value.match('{' + $filter('removeSpace')(z) + '}')) {
																	if (z1) {
																		$scope.setInitval(z1)
																	}
																	linkss = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[1].value.replace('{' + $filter('removeSpace')(z) + '}', $scope.fieldData[$filter('removeSpace')(z)])
																} else {
																	linkss = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[1].value.split('/')[0] + "/" + y
																}
																crudRequest("GET", linkss, '', '').then(function (response) {
																	//console.log(response)
																	$scope.parentInput.pageInfo.Subsection[0].subSectionData[keysss].ChoiceOptions = response.data.data;
																})
															}
															//break;
													}
												}
											}
										}
										//else{
										if (y) {
											if (droplink[k].value.match('{' + $filter('removeSpace')(z) + '}')) {
												if (z1) {
													//console.log(z1)
													$scope.setInitval(z1)
												}
												links = droplink[k].value.replace('{' + $filter('removeSpace')(z) + '}', $scope.fieldData[$filter('removeSpace')(z)])
											} else {
												links = droplink[k].value.split('/')[0] + "/" + y
											}
										}
										//}
										//},100)
									}
								}
								if (links) {
									//console.log(links)
									something(links, observedIndex, '')
								}
							} else if (droplink && droplink[0].value.indexOf('&&') > -1) {
								//console.log('input1',z1)
								var queryParams = [];
								for (j in droplink[0].value.split('&&')) {
									queryParams.push(droplink[0].value.split('&&')[j].trim())
								}
								setTimeout(function () {
									for (k in droplink) {
										if (droplink[k].name == 'REST') {
											var k = droplink[k].value
												for (u in queryParams) {
													if (k.indexOf(queryParams[u]) > -1) {
														if ($("select[name=" + queryParams[u] + "]").val()) {
															k = k.replace('{' + queryParams[u] + '}', $("select[name=" + queryParams[u] + "]").val())
														} else {
															k = ''
														}

													}
												}
												if (k) {
													something(k, observedIndex, '')
												}

										}
									}
								}, 750)
							} else {
								//console.log('input',z1)
									if(z1 && z1.FieldName === 'InputFormat'){
									$scope.setInitval(z1)
								}
						$scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = $scope.backupCstmdrop[observedIndex].ChoiceOptions
					}
				
				}
						
				}
			}

		}
	}
	var something = function (links, observedIndex, queryfield) {
		//	console.log(links,observedIndex,queryfield)
		crudRequest("GET", links, '', queryfield).then(function (response) {
			$scope.parentInput.pageInfo.Section[observedIndex].ChoiceOptions = response.data.data;
			if ($scope.parentInput.pageInfo.Section[observedIndex].FieldName == "ReferenceCode") {
				$('select[name=ReferenceCode]').select2({
					ajax : {
						url : function () {
							return BASEURL + "/rest/v2/" + links
						},
						headers : {
							"Authorization" : "SessionToken:" + sessionStorage.SessionToken,
							"Content-Type" : "application/json"
						},
						dataType : 'json',
						delay : 250,
						xhrFields : {
							withCredentials : true
						},
						beforeSend : function (xhr) {
							xhr.setRequestHeader('Cookie', document.cookie),
							xhr.withCrendentials = true
						},
						crossDomain : true,
						data : function (params) {
							//console.log(params)
							var query = {
								start : params.page * 500 ? params.page * 500 : 0,
								count : 500
							}
							if (params.term) {
								query = {
									search : params.term,
									start : params.page * 500 ? params.page * 500 : 0,
									count : 500
								};
							}
							return query;
						},
						processResults : function (data, params) {

							params.page = params.page ? params.page : 0;
							var myarr = []
							for (j in data) {
								myarr.push({
									'id' : data[j].actualvalue,
									'text' : data[j].displayvalue
								})
							}
							console.log(myarr)
							return {
								results : myarr,
								pagination : {
									more : data.length >= 500
								}
							};
						},
						cache : true
					},
					placeholder : 'Select',
					minimumInputLength : 0,
					allowClear : true,
					/*,tags: true,
					createTag: function (tag) {
					console.log(tag)
					return {
					id: tag.term,
					text: tag.term,
					tag: true
					};
					}*/
				})
			}
			//console.log(observedIndex,response.data.data,$scope.parentInput.pageInfo.Section[observedIndex])
			//console.log($scope.parentInput.pageInfo.Section[observedIndex])
		})
	}

	$scope.activatePicker = function (e) {
		var prev = null;
		$('.DatePicker').datetimepicker({
			format : "YYYY-MM-DD",
			useCurrent : false,
			showClear : true
		}).on('dp.change', function (ev) {
			//console.log($(ev.currentTarget).attr('ng-model').split('[')[0])
			if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			} else {
				var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
				$scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
			}
		}).on('dp.show', function (ev) {
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({
				"overflow-y" : ""
			});
			if ($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2) {
				$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
					if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().attr('id'))) {}
					else {
						$(this).css({
							"display" : "none"
						});
					}
				})
			}
		}).on('dp.hide', function (ev) {
			if ($(ev.currentTarget).parent().parent().parent().parent().attr('id')) {
				var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
				var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0]
					$(ev.currentTarget).parent().parent().parent().parent().parent().css({
						"overflow-y" : "auto"
					});
				$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
					$(this).css({
						"display" : ""
					});
				})
				$('#' + y).animate({
					scrollTop : ($('#' + y + '_' + x).outerHeight() * (x + 1)) + 'px'
				}, 0);
			}
		});

		$('.TimePicker').datetimepicker({
			format : 'HH:mm:ss',
			useCurrent : false,
		}).on('dp.change', function (ev) {
			if ($(ev.currentTarget).attr('ng-model').split('[')[0] != 'subData') {
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			} else {
				var pId = $(ev.currentTarget).parent().parent().parent().parent().parent().attr('id');
				$scope.subSectionfieldData[pId][$(ev.currentTarget).attr('name').split('_')[1]][$(ev.currentTarget).attr('name').split('_')[0]] = $(ev.currentTarget).val()
			}
		}).on('dp.show', function (ev) {
			$(ev.currentTarget).parent().parent().parent().parent().parent().css({
				"overflow-y" : ""
			});
			if ($(ev.currentTarget).parent().parent().parent().parent().parent().children().length > 2) {
				$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
					if ($(this).is("#" + $(ev.currentTarget).parent().parent().parent().parent().attr('id'))) {}
					else {
						$(this).css({
							"display" : "none"
						});
					}
				})
			}
		}).on('dp.hide', function (ev) {
			if ($(ev.currentTarget).parent().parent().parent().parent().attr('id')) {
				var x = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[1];
				var y = $(ev.currentTarget).parent().parent().parent().parent().attr('id').split('_')[0]
					$(ev.currentTarget).parent().parent().parent().parent().parent().css({
						"overflow-y" : "auto"
					});
				$(ev.currentTarget).parent().parent().parent().parent().parent().children().each(function () {
					$(this).css({
						"display" : ""
					});
				})
				$('#' + y).animate({
					scrollTop : ($('#' + y + '_' + x).outerHeight() * (x + 1)) + 'px'
				}, 0);
			}
		});
	}

	$scope.triggerPicker = function (e) {

		if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
			$scope.activatePicker($(e.currentTarget).prev());
			$('input[name=' + $(e.currentTarget).prev().attr('name') + ']').data("DateTimePicker").show();
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
	$scope.select2Loadmore = function (argu, _link) {
		//console.log($('select[name='+argu.FieldName+']').val())
		if ($scope.fieldData[argu.FieldName]) {
			var _query = {
				search : $scope.fieldData[argu.FieldName],
				start : 0,
				count : 500
			}
			crudRequest('GET', _link, '', _query).then(function (response) {
				//argu.ChoiceOptions = response.data.data
				console.log(response.data.data)
				for (hj in $scope.parentInput.pageInfo.Section) {
					if ($scope.parentInput.pageInfo.Section[hj].FieldName == argu.FieldName) {
						$scope.parentInput.pageInfo.Section[hj].ChoiceOptions = response.data.data
					}
				}
			});
		}
		//	else{

		var pageLimitCount = 500;
		$('select[name=' + argu.FieldName + ']').select2({
			ajax : {
				url : function () {
					return BASEURL + "/rest/v2/" + _link
				},
				headers : {
					"Authorization" : "SessionToken:" + sessionStorage.SessionToken,
					"Content-Type" : "application/json"
				},
				dataType : 'json',
				delay : 250,
					xhrFields : {
						withCredentials : true
					},
					beforeSend : function(xhr){
					xhr.setRequestHeader('Cookie', document.cookie),
					xhr.withCrendentials = true
					},
					crossDomain : true,
				data : function (params) {
					//console.log(params)
					var query = {
						start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
						count : pageLimitCount
					}
					if (params.term) {
						query = {
							search : params.term,
							start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
							count : pageLimitCount
						};
					}
					return query;
				},
				processResults : function (data, params) {
					params.page = params.page ? params.page : 0;
					var myarr = []
					for (j in data) {
						myarr.push({
							'id' : data[j].actualvalue,
							'text' : data[j].displayvalue
						})
					}
					return {
						results : myarr,
						pagination : {
							more : data.length >= pageLimitCount
						}
					};
				},
				cache : true
			},
			placeholder : 'Select',
			minimumInputLength : 0,
			allowClear : true,
			/*,tags: true,
			createTag: function (tag) {
			console.log(tag)
			return {
			id: tag.term,
			text: tag.term,
			tag: true
			};
			}*/
		})
		//	}
	}

	$scope.dependedInputval = ['ConnectingParty', 'ParentEntity', 'RedirectionParticipantID']

	$(document).ready(function(){
		setTimeout(function(){
			
			
		if($scope.parentInput.Operation == 'Add'){
			//console.log(Object.keys($scope.fieldData).length)
			var pageLimitCount = 500;
			//console.log($scope.fieldData,$scope.parentInput.pageInfo.Section)
			$("select").each(function () {
				//console.log(this)
				var details = JSON.parse($(this).attr('detailsoffield'))
					if ('Multiple' in details && details.Multiple[details.Multiple.length - 1].displayvalue == 'MULTISELECT' && details.Multiple[details.Multiple.length - 1].actualvalue) {
						//console.log(this)
						$(this).find('option').each(function () {
							if ($(this).attr('value') == '') {
								$(this).remove();
							}
						})
						$(this).find('option:first-child').remove()
						$(this).val('')
						$(this).attr('multiple', true)
					}
					for (j in $scope.dependedInputval) {
						if ($scope.dependedInputval[j] == details.FieldName) {
							var saveLink = details.property[details.property.length - 1].value;
							var inputName = []
							var _links = ($scope.parentInput.parentLink != 'methodofpayments') ? {
								'_data' : $scope.parentInput.pageInfo.Section,
								'_name' : 'FieldName'
							}
							 : {
								'_data' : $scope.parentInput.pageInfo,
								'_name' : 'name'
							};
							for (k in _links._data) {
								if (_links._data[k][_links._name] == details.FieldName) {
									$scope.dependedInputvalchoice = {
										'_index' : k,
										'_data' : _links._data[k]
									}
								}
							}
							for (v in saveLink.split('/')) {
								if (saveLink.split('/')[v].match('{')) {
									inputName.push(saveLink.split('/')[v].replace('{', '').replace('}', ''))
									$('input[name=' + inputName[inputName.length - 1] + ']').on('blur', function () {
										var kash;
										saveLink = details.property[details.property.length - 1].value
											for (u in inputName) {
												if ($('input[name=' + inputName[u] + ']').val() == '') {
													kash = false
														saveLink = details.property[details.property.length - 1].value
														console.log($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible"))
														if (_links._name == 'FieldName') {
															if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
																$('select[name=' + details.FieldName + ']').select2('destroy')
																$('select[name=' + details.FieldName + ']').val('')
																$('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
															}
															$scope.parentInput.pageInfo.Section[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions;
															console.log('came')
														} else {
															if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
																$('select[name=' + details.FieldName + ']').select2('destroy')
																$('select[name=' + details.FieldName + ']').val('')
																$('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
															}
															$scope.parentInput.pageInfo[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions
														}
														break;
												} else {
													kash = true
														saveLink = saveLink.replace('{' + inputName[u] + '}', $('input[name=' + inputName[u] + ']').val());
												}
											}
											if (kash) {
												$scope.select2Loadmore(details, saveLink);
											}
									})
								}
							}

						}
					}

			})
			var remoteDataConfig = function () {
				//setTimeout(function(){
				$(".appendSelect2").each(function () {
					$(this).select2({
						ajax : {
							url : function () {
								var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {
									'_data' : $scope.parentInput.pageInfo.Section,
									'_name' : 'FieldName'
								}
								 : {
									'_data' : $scope.parentInput.pageInfo,
									'_name' : 'name'
								};
								for(k in _link._data){
							if(_link._data[k][_link._name] == $(this).attr('name')){
								$scope.links = _link._data[k].ChoiceOptions[_link._data[k].ChoiceOptions.length-1].configDetails.links
							}
							if('webform' in _link._data[k]){
								//console.log(_link._data[k]['webform'])
								for(jk in _link._data[k]['webform'].Subsection[0].subSectionData){
								if(_link._data[k]['webform'].Subsection[0].subSectionData[jk][_link._name] == $(this).attr('name')){
										$scope.links = _link._data[k]['webform'].Subsection[0].subSectionData[jk].property[0].value
										
										if($scope.links.match('{')){
											for(var j in $scope.links.split('/')){
												if($scope.links.split('/')[j].match('{') && $scope.links.split('/')[j].match('}')){
													var inputs = $scope.links.split('/')[j].replace('{','').replace('}','')
													$scope.links = $scope.links.replace($scope.links.split('/')[j],$('select[name='+inputs+']').val())
												}								
											}
										}
									}
								}
							}
						}
						if(_link._name == 'FieldName' && $scope.parentInput.pageInfo.Subsection.length && 'subSectionData' in $scope.parentInput.pageInfo.Subsection[0]){
							for(kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData){
								if($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj][_link._name] == $(this).attr('name')){
							 		//console.log(_link._data[k])
									$scope.links = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[0].value
							 	}
							}
						}
						return BASEURL + "/rest/v2/" + $scope.links
					},
					headers: {"Authorization" : "SessionToken:"+sessionStorage.SessionToken,"Content-Type" : "application/json"},
					dataType: 'json',
					delay: 250,
					beforeSend : function(xhr){
					xhr.setRequestHeader('Cookie', document.cookie),
					xhr.withCrendentials = true
					},
					crossDomain : true,
							data : function (params) {
								//console.log(params)
								var query = {
									start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
									count : pageLimitCount
								}
								if (params.term) {
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
							processResults : function (data, params) {
								params.page = params.page ? params.page : 0;
								var myarr = []
								for (j in data) {
									myarr.push({
										'id' : data[j].actualvalue,
										'text' : data[j].displayvalue
									})
								}
								return {
									results : myarr,
									pagination : {
										more : data.length >= pageLimitCount
									}
								};
							},
							cache : true
						},
						placeholder : 'Select',
						minimumInputLength : 0,
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
				})
				//},0)


			}
			remoteDataConfig();
		} else {
			$("select").each(function () {
				var details = JSON.parse($(this).attr('detailsoffield'))
					for (j in $scope.dependedInputval) {
						if ($scope.dependedInputval[j] == details.FieldName) {
							var saveLink = details.property[details.property.length - 1].value;
							var inputName = []
							var _links = ($scope.parentInput.parentLink != 'methodofpayments') ? {
								'_data' : $scope.parentInput.pageInfo.Section,
								'_name' : 'FieldName'
							}
							 : {
								'_data' : $scope.parentInput.pageInfo,
								'_name' : 'name'
							};
							for (k in _links._data) {
								if (_links._data[k][_links._name] == details.FieldName) {
									$scope.dependedInputvalchoice = {
										'_index' : k,
										'_data' : _links._data[k]
									}
								}
							}
							for (v in saveLink.split('/')) {
								if (saveLink.split('/')[v].match('{')) {
									inputName.push(saveLink.split('/')[v].replace('{', '').replace('}', ''))
									$('input[name=' + inputName[inputName.length - 1] + ']').on('blur', function () {
										var kash;
										saveLink = details.property[details.property.length - 1].value
											for (u in inputName) {
												if ($('input[name=' + inputName[u] + ']').val() == '') {
													kash = false
														saveLink = details.property[details.property.length - 1].value
														//											console.log($('select[name='+details.FieldName+']').hasClass("select2-hidden-accessible"))
														if (_links._name == 'FieldName') {
															if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
																$('select[name=' + details.FieldName + ']').select2('destroy')
																$('select[name=' + details.FieldName + ']').val('')
																$('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
															}
															$scope.parentInput.pageInfo.Section[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions;
															//console.log('came')
														} else {
															if ($('select[name=' + details.FieldName + ']').hasClass("select2-hidden-accessible")) {
																$('select[name=' + details.FieldName + ']').select2('destroy')
																$('select[name=' + details.FieldName + ']').val('')
																$('select[name=' + details.FieldName + ']').find('option:nth-child(2)').remove()
															}
															$scope.parentInput.pageInfo[$scope.dependedInputvalchoice._index].ChoiceOptions = details.ChoiceOptions
														}
														break;
												} else {
													kash = true
														saveLink = saveLink.replace('{' + inputName[u] + '}', $('input[name=' + inputName[u] + ']').val());
												}
											}
											if (kash) {
												$scope.select2Loadmore(details, saveLink);
											}
									})
								}
							}

						}
					}
			})
		}

		$("select").on("change", function (e) {
			if ($scope.parentInput.pageTitle === 'Party Service Association') {
				//			console.log('came')
				if (($(e.currentTarget).attr('name') == 'PartyCode') || ($(e.currentTarget).attr('name') == 'ServiceCode') || ($(e.currentTarget).attr('name') == 'InputFormat')) {
					$('input[name=PartyServiceAssociationCode]').val($('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=ServiceCode]').val() + '_' + $('select[name=InputFormat]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() : $('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=ServiceCode]').val() : $('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=PartyCode]').val() + '_' + $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() + '_' + $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && !$('select[name=ServiceCode]').val() && $('select[name=InputFormat]').val() ? $('select[name=InputFormat]').val() : !$('select[name=PartyCode]').val() && $('select[name=ServiceCode]').val() && !$('select[name=InputFormat]').val() ? $('select[name=ServiceCode]').val() : '')
					$scope.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val()
						//$scope.parentInput.fieldData['PartyServiceAssociationCode'] = $('input[name=PartyServiceAssociationCode]').val()
				}
			}
		});

		$('input[type=radio]').each(function () {
			if ($(this).val() == 'false' && $scope.parentInput.Operation == 'Add') {
				$scope.fieldData[$(this).attr('name')] = false
			}
		})
		},1000)
	})
	$scope.setInitval = function(argu,a,b,c){
			$scope.multipleFlag = false;
			var _name = ($scope.parentInput.parentLink != 'methodofpayments') ? argu.FieldName : argu.name;
			var _query = {}
			var multipleVal = []
			//console.log('came',argu,a,b,$scope.fieldData[_name],_name,a,b)
			
			if($scope.fieldData[_name] && $scope.fieldData[_name].match(/\,/g)){
				//console.log('ss',$scope.fieldData[_name],_name)
				argu.ChoiceOptions = []
				 for(k in $scope.fieldData[_name].split(',')){
					 _query = {
						search : $scope.fieldData[_name].split(',')[k],
						start : 0,
						count : 500
					}
					multipleVal.push($scope.fieldData[_name].split(',')[k])
					crudRequest('GET', argu.property[0].value,'',_query).then(function(response){
						for(k in response.data.data){
							//argu.ChoiceOptions.push(response.data.data[k])
							argu.ChoiceOptions.push(response.data.data[k])
							//console.log('Multiple',argu.ChoiceOptions, response.data.data[k])
						}	
												
					});					
				} 
			}
			else if($scope.fieldData[_name]){
				argu.ChoiceOptions = []
				_query = {
					//search : $filter('nospace')($scope.fieldData[_name]),
					search : $scope.fieldData[_name],
					start : 0,
					count : 500
				}
				crudRequest('GET', argu.property[0].value,'',_query).then(function(response){
					//console.log('Single',argu,response.data.data)
					argu.ChoiceOptions = response.data.data				
				});				
			}
			else if(a && b){
				var seta_Flag = true;
				var backupChoiceOptions = angular.copy(argu.ChoiceOptions);
				var backupMultiple = angular.copy(argu.Multiple)
				
				//argu.ChoiceOptions = []
				var l_link = argu.property[0].value
				if(l_link.match('{')){
					for(var j in l_link.split('/')){
						if(l_link.split('/')[j].match('{') && l_link.split('/')[j].match('}')){
							var inputs = l_link.split('/')[j].replace('{','').replace('}','')
							l_link = l_link.replace(l_link.split('/')[j],$scope.fieldData[inputs])
							//console.log('sss',$('select[name='+inputs+']').val(),$scope.fieldData[inputs])
							if(!$('select[name='+inputs+']').val()){
								seta_Flag = false;
							}
						}								
					}
				}
				for(k in $scope.fieldData[a][b]){
					delete $scope.fieldData[a][b][k].$$hashKey						
					console.log($scope.fieldData[a][b][k])
					 _query = {
						//search : $scope.fieldData[a][b][k][_name],
						start : 0,
						count : 1000
					}
					if($scope.fieldData[a][b][k][_name] && seta_Flag){
						crudRequest('GET', l_link,'',_query).then(function(response){
							argu.ChoiceOptions = []
							for(k in response.data.data){
								argu.ChoiceOptions.push(response.data.data[k])
							}					
						});
						
					}
					else{
						delete $scope.fieldData[a][b][k].$$hashKey
						if($scope.fieldData[a][b][k][_name]){
							//$scope.fieldData[a][b][k][_name] = ''
						}
						argu.ChoiceOptions = backupChoiceOptions
					}
				} 
			}
			
			setTimeout(function(){	
				var pageLimitCount = 500;	
				//console.log(argu)
				if(argu.Multiple[argu.Multiple.length-1].displayvalue == 'MULTISELECT'){
					$('select[name='+_name+']').attr('multiple',true)
						if(multipleVal.length){
							console.log(multipleVal)
								if($('select[name='+_name+']').length > 1){	
								$('select[name='+_name+']').each(function(e){									//console.log(multipleVal)
									
								if($($('select[name='+_name+']')[e]).val() != multipleVal[e]){
									console.log('if',multipleVal[e],$($('select[name='+_name+']')[e]))
									//$($('select[name='+_name+']')[e]).val('')
									$($('select[name='+_name+']')[e]).val(multipleVal[e])								
								}
								else{
									
	//								console.log($($('select[name='+_name+']')[e]).val(),multipleVal[e],multipleVal)
								}
								})
								
							}
							else{
								$('select[name='+_name+']').val(multipleVal)
							}
							
						}
						else{
							
							if($('select[name='+_name+']').val()){
														
							}
							else{
								//$('select[name='+_name+']').val('');	
							}
						}	
				}
				$("select").each(function(){				
				var details = JSON.parse($(this).attr('detailsoffield'))
				//console.log(details)
				for(j in $scope.dependedInputval){
					if($scope.dependedInputval[j] == details.FieldName){
						var saveLink = details.property[details.property.length-1].value;
						var inputName = []
						var _links = ($scope.parentInput.parentLink != 'methodofpayments') ? {'_data':$scope.parentInput.pageInfo.Section,'_name' : 'FieldName'} : {'_data':$scope.parentInput.pageInfo,'_name' : 'name'};
						for(k in _links._data){
							if(_links._data[k][_links._name] == details.FieldName){
								$scope.dependedInputvalchoice = {
									'_index'	: k,
									'_data'		: _links._data[k]
								}
							}
						}
						for(v in saveLink.split('/')){
							if(saveLink.split('/')[v].match('{')){
								inputName.push(saveLink.split('/')[v].replace('{','').replace('}',''))
								for(u in inputName){
									if($('input[name='+inputName[u]+']').val() != ''){
										//console.log($('input[name='+inputName[u]+']').val(),saveLink)
										saveLink = saveLink.replace('{'+inputName[u]+'}',$('input[name='+inputName[u]+']').val());
									}
								}
								//console.log(saveLink)
								$scope.select2Loadmore(details,saveLink);
							}
						}													

						}
					}

			})
			//$('select[name='+_name+']').select2()
			$('select[name=' + _name + ']').select2({
				ajax : {
					url : function () {
						var _link = ($scope.parentInput.parentLink != 'methodofpayments') ? {
							'_data' : $scope.parentInput.pageInfo.Section,
							'_name' : 'FieldName'
						}
						 : {
							'_data' : $scope.parentInput.pageInfo,
							'_name' : 'name'
						};
						//console.log(_link)
						for (k in _link._data) {
							if (_link._data[k][_link._name] == _name) {
								//console.log(_link._data[k])
								$scope.links = _link._data[k].property[0].value
							}
							if('webform' in _link._data[k]){
								//console.log(_link._data[k]['webform'])
								for(jk in _link._data[k]['webform'].Subsection[0].subSectionData){
								if(_link._data[k]['webform'].Subsection[0].subSectionData[jk][_link._name] == $(this).attr('name')){
										$scope.links = _link._data[k]['webform'].Subsection[0].subSectionData[jk].property[0].value
										
										if($scope.links.match('{')){
											for(var j in $scope.links.split('/')){
												if($scope.links.split('/')[j].match('{') && $scope.links.split('/')[j].match('}')){
													var inputs = $scope.links.split('/')[j].replace('{','').replace('}','')
													$scope.links = $scope.links.replace($scope.links.split('/')[j],$('select[name='+inputs+']').val())
												}								
											}
										}
									}
								}
							}
						}
						if (_link._name == 'FieldName' && $scope.parentInput.pageInfo.Subsection.length && 'subSectionData' in $scope.parentInput.pageInfo.Subsection[0]) {
							for (kj in $scope.parentInput.pageInfo.Subsection[0].subSectionData) {
								if ($scope.parentInput.pageInfo.Subsection[0].subSectionData[kj][_link._name] == _name) {
									//console.log(_link._data[k])
									$scope.links = $scope.parentInput.pageInfo.Subsection[0].subSectionData[kj].property[0].value
								}
							}
						}
						return BASEURL + "/rest/v2/" + $scope.links
					},
					headers : {
						"Authorization" : "SessionToken:" + sessionStorage.SessionToken,
						"Content-Type" : "application/json"
					},
					dataType : 'json',
					delay : 250,
					xhrFields : {
						withCredentials : true
					},
					beforeSend : function(xhr){
					xhr.setRequestHeader('Cookie', document.cookie),
					xhr.withCrendentials = true
					},
					crossDomain : true,
					data : function (params) {
						//console.log(params)
						var query = {
							start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
							count : pageLimitCount
						}
						if (params.term) {
							query = {
								search : params.term,
								start : params.page * pageLimitCount ? params.page * pageLimitCount : 0,
								count : pageLimitCount
							};
						}
						return query;
					},
					processResults : function (data, params) {
						params.page = params.page ? params.page : 0;
						var myarr = []
						for (j in data) {
							myarr.push({
								'id' : data[j].actualvalue,
								'text' : data[j].displayvalue
							})
						}
						return {
							results : myarr,
							pagination : {
								more : data.length >= pageLimitCount
							}
						};
					},
					cache: true
					},
					placeholder : 'Select',
					minimumInputLength: 0,
					allowClear : true,
					/*,tags: true,
					createTag: function (tag) {
						console.log(tag)
						return {
							id: tag.term,
							text: tag.term,
							tag: true
						};
					}*/
				})
			},3500)		
		}
	
	
	function updateTextarea(_link,_input,_index){
		crudRequest("GET",_link,'').then(function(response){
			$scope.parentInput.pageInfo.Section[_index]['webform'] = BuildnReplaceField(response,_input);
			if(!_input){
				if('Subsection' in $scope.parentInput.pageInfo.Section[_index]['webform']){
					$scope.fieldData[$scope.parentInput.pageInfo.Section[_index].FieldName] = {}
					for(k in $scope.parentInput.pageInfo.Section[_index]['webform'].Subsection){
						console.log($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k])
						if($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].FieldName == 'fldName'){
							$scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.splice($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions.length-1,1)
							console.log($scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].subSectionData[0].ChoiceOptions)
						}
						$scope.fieldData[$scope.parentInput.pageInfo.Section[_index].FieldName][$scope.parentInput.pageInfo.Section[_index]['webform'].Subsection[k].FieldName] = [{}]
					}
				}
			}			
		})
		//console.log($scope.fieldData)
	}
	
	for(k in $scope.parentInput.pageInfo.Section){		
		if($scope.parentInput.pageInfo.Section[k].InputType == 'TextArea' && 'property' in $scope.parentInput.pageInfo.Section[k] && $scope.parentInput.pageInfo.Section[k].property && $scope.parentInput.pageInfo.Section[k].property[0].name == 'REST-WEBFORM'){
//			console.log($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])
			if($scope.parentInput.pageInfo.Section[k].FieldName in $scope.fieldData){
				if(Array.isArray($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])){
					//console.log($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])
					//$scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName] = $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]
				}
				else if(($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].match(/</g))&&($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].match(/>/g))){
//					console.log($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])
					xmlDoc = $.parseXML($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]); //is valid XML
					//console.log(xmlDoc)
					var xmlData = xmlDoc.getElementsByTagName("duplicateCheckThreshold");
					var constuctfromXml = {};
					var constuctfromXmlObj = {};
					var constuctfromXmlarr = [];					
					$(xmlDoc).children().each(function(e){
						$(this).children().each(function(e){
							var parentName = $(this).prop("tagName")
							if($(this).children().length){
								constuctfromXml[parentName] = constuctfromXmlarr
								$(this).children().each(function(e){
									constuctfromXmlObj[$(this).prop("tagName")] = $(this).text()
									constuctfromXmlarr.push(constuctfromXmlObj)
									constuctfromXmlObj = {}
								})
							}
							else{
								constuctfromXml[parentName] = $(this).text()
								//console.log('1',this,e,$(this).prop("tagName"),$(this).text());
							}
						})
					});
					//console.log(constuctfromXml)
					$scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName] = constuctfromXml
					//console.log(xmlArr)
					//$scope.fieldData['FDCParameters'] = xmlArr 
				}
				else if(typeof($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName]) == 'string'){
					$scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName] = JSON.parse($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName])
					for(j in $scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields){
						if(Object.values($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0].match(',')){
							$scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j][Object.keys($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0]] = Object.values($scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName].Fields[j])[0].split(',')							
						}
						
					}
					
				}
			}
			updateTextarea($scope.parentInput.pageInfo.Section[k].property[0].value,$scope.fieldData[$scope.parentInput.pageInfo.Section[k].FieldName],k)
		}
	}
	
	
	$scope.add_Section = function(x,y,z,z1,z2){
		delete y[z][x].$$hashKey;
		//$('#'+z1).css({'height':$('#'+z1+'_'+x).outerHeight()+10+'px'})
		y[z][x] = removeEmptyValueKeys(y[z][x])
		if(Object.keys(y[z][x]).length !== 0){
			y[z].push({})
			setTimeout(function(){				
				for(var j in z2.subSectionData){	

					$scope.setInitval(z2.subSectionData[j],z1.split('_')[1],z1.split('_')[0],x)				
				}
			},100)
			
			//console.log(x,y,z,z1,Object.keys(y[z][x]))
		}
		//$('#'+z1).animate({scrollTop: ($('#'+z1+'_'+x).outerHeight() * (x + 1 )) + 'px'});
		
	}
	
	$scope.addsubSection = function(x,y,z){
		//console.log('',x,y,z)
		delete y.$$hashKey;
		$('#'+z.FieldName).css({'height':$('#'+z.FieldName+'_'+x).outerHeight()+10+'px'})
		y = removeEmptyValueKeys(y)
		$scope.subSectionfieldData[z.FieldName] = removeEmptyValueKeys($scope.subSectionfieldData[z.FieldName])
			if(Object.keys(y).length !== 0){
			//console.log($scope.subSectionfieldData[z])
				$scope.subSectionfieldData[z.FieldName].push({})
				//setTimeout(function(){
					for(var j in z.subSectionData){
					$scope.setInitval(z.subSectionData[0])					
				}
			//	},500)
				
			}
		$('#'+z.FieldName).animate({scrollTop: ($('#'+z.FieldName+'_'+x).outerHeight() * (x + 1 )) + 'px'});
		
	}
		
});