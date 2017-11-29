VolpayApp.controller('rolesCtrl', function ($scope, $rootScope, $http, $state, $location,$filter, userMgmtService, $timeout, GlobalService, LogoutService) {

	$scope.permission = {
		'C' : false,
		'D' : false,
		'R' : false,
		'U' : false
	}

	$scope.Obj = {};

	$http.post(BASEURL + RESTCALL.ResourcePermission, {
		"RoleId" : sessionStorage.ROLE_ID,
		"ResourceName" : "Roles & Permissions"
	}).success(function (response) {
		for (k in response) {
			for (j in Object.keys($scope.permission)) {
				if (Object.keys($scope.permission)[j] == response[k].ResourcePermission) {
					$scope.permission[Object.keys($scope.permission)[j]] = true;
				}
			}
		}
	})

		function CRUDReConstruct(Array123){
			for(i=0;i<Array123.length;i++){
				//console.log(Array123[i])
				if(Array123[i]=='C'){
					Array123[i]='Create';
				}
				if(Array123[i]=='R'){
					Array123[i]='Read';
				}
				if(Array123[i]=='U'){
					Array123[i]='Update';
				}
				if(Array123[i]=='D'){
					Array123[i]='Delete';
				}
			}
			return Array123;
		}
	
	
	function CRUDReConstruct123(Array123){
			//console.log(Array123.Operations)
			//console.log(Array123.Operations.length)
			 for(i=0;i<Array123.Operations.length;i++){
				//console.log(Array123.Operations[i].Operation)
				if(Array123.Operations[i].Operation=='C'){
					Array123.Operations[i].Operation='Create';
				}
				if(Array123.Operations[i].Operation=='R'){
					Array123.Operations[i].Operation='Read';
				}
				if(Array123.Operations[i].Operation=='U'){
					Array123.Operations[i].Operation='Update';
				}
				if(Array123.Operations[i].Operation=='D'){
					Array123.Operations[i].Operation='Delete';
				} 
			} 
			//console.log(Array123)
			return Array123;
		}
	
	$scope.resourceAttributes = '';
	$scope.trial = '';
	$scope.getResourceAttributes = function (val, roleID) {

		$http.post(BASEURL + '/rest/v2/roles/attributes/read', {
			"RoleId" : roleID,
			"ResourceName" : val
		}).success(function (response) {
			$scope.trial = response;
			$scope.test111 = [];
			for (var i in response.Attributes) {
				//console.log('#select_' + val + '_' + i)
				//$('#select_'+val+'_'+i).select2();

				//$scope.test111.push({'key':val,'cnt':i, 'value':response.Attributes[i].Permissions[j].Operation})
				$scope.test111.push({
					'key' : val,
					'cnt' : i,
					'value' : []
				})
				for (var j in response.Attributes[i].Permissions) {

					if (response.Attributes[i].Permissions[j].Permission) {
						
						$scope.test111[i].value.push(response.Attributes[i].Permissions[j].Operation);

					}
				}

			}
			console.log($scope.test111)

			setTimeout(function () {

				for (var i in $scope.test111) {
					//console.log("value", $scope.test111[i].value)
					//console.log("value", CRUDReConstruct($scope.test111[i].value))
					
					console.log('select[name="select_' + val + '_' + i + '"]')
					//console.log($filter('removeSpace')('select[name="select_' + val + '_' + i + '"]'));
					var selectName=$filter('removeSpace')('select[name="select_' + val + '_' + i + '"]');
					$(selectName).val($scope.test111[i].value)
					$(selectName).select2();

				}

			}, 10)

		})

		$http.post(BASEURL + '/rest/v2/roles/attributes/attributenames', {
			"ResourceName" : val
		}).success(function (response) {
			console.log(response)
			$scope.attributes = response;
		})

		$http.post(BASEURL + '/rest/v2/roles/operationlist', {
			"ResourceName" : val
		}).success(function (response) {
			console.log(response)
			setTimeout(function () {
				$('.js-select2-multiple').select2();
			}, 1000)
			$scope.operationlist = response;
		})

	}

	if (GlobalService.roleAdded) {
		$scope.alerts = [{

				type : 'success',
				msg : $rootScope.roleAddedMesg.responseMessage
			}
		];
		$scope.alertStyle = alertSize().headHeight;
		$scope.alertWidth = alertSize().alertWidth;

		setTimeout(function () {
			$scope.callAtTimeout()

		}, 4000)

		GlobalService.roleAdded = false;

	}

	$scope.checkBoxChecked = false;
	$scope.active = false;

	$scope.tabClickCnt = 0;
	
		function removeCheckTrue(Arr12345){
		console.log(Arr12345.length)
		for(i=0;i<Arr12345.length;i++){
			
			for(j=0;j<Arr12345[i].PermissionList.length;j++){
				delete Arr12345[i].PermissionList[j].check;
			}
		}
		return Arr12345;
	}
	
	
	
	$scope.saveAll = function (toUpdateData, RoleID, index) {

		//console.log(toUpdateData,RoleID,index)

		$scope.updateData = {};
		$scope.updateData.RoleID = RoleID;
		$scope.updateData.ResourceGroupName = $('#collapse' + index).find('.listGroup').find('.active').text().trim();
		$scope.updateData.ResourceGroupPermissions = removeCheckTrue(toUpdateData);

		// console.log($scope.updateData)

		$http({
			method : "PUT",
			url : BASEURL + '/rest/v2/roles/groupresourcepermission',
			data : $scope.updateData
		}).success(function (data, status, headers, config) {

			$scope.alerts = [{
					type : 'success',
					msg : data.responseMessage
				}
			];

			$('.collapse').collapse('hide');

			setTimeout(function () {
				$('.alert-success').hide();
			}, 3000)

			//$state.reload();
		}).error(function (err) {
			$scope.alerts = [{
					type : 'danger',
					msg : err.error.message
				}
			];

		});
	}


	// $scope.showAlert = true;
	$scope.userRoles = [];
	$http.get(BASEURL + RESTCALL.CreateRole).success(function (data) {
		console.log(data)
		//$scope.userRoles = data;
		for (var i = 0; i < data.length; i++) {
			if (data[i].RoleID != 'Super Admin') {
				$scope.userRoles.push(data[i]);
			}
		}
		//console.log($scope.userRoles)
		if ($scope.userRoles.length > 0) {
			$scope.showAlert = false;
		} else {
			$scope.showAlert = true;
		}

	}).error(function (data, status) {
		//console.log(data.error.message,status)

		if (status == 401) {
			if (configData.Authorization == 'External') {
				window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
			} else {
				LogoutService.Logout();
			}
		} else {
			$scope.alerts = [{
					type : 'danger',
					msg : data.error.message //Set the message to the popup window
				}
			];
		}

	});

	function removeAdminPanel(Arr12344){
		var rGroupFinal=[];
		for(i=0;i<Arr12344.length;i++){
			if(Arr12344[i].ResourceGroupName!="Admin Panel"){
				rGroupFinal.push({"ResourceGroupName":Arr12344[i].ResourceGroupName});
			}
		}	
		//console.log(rGroupFinal)
		return rGroupFinal;
	}
	
	$http.get(BASEURL + "/rest/v2/roles/resourcegroup").success(function (data) {
		//console.log(data)		
		// $scope.resourceGroup = removeAdminPanel(data);
		$scope.resourceGroup = data;
	});

	$scope.roleFlag = false;

	$scope.showRoles1 = false;
	$scope.showRoles2 = true;

	$scope.currentIndex = ''

		$scope.getAccordion1 = function (v1, v2, index) {

		console.log(v1, v2, index)
		//$scope.currentIndex = index;


		if ($scope.active) {

			$('#roleEdit').modal('show')
		} else {
			$scope.active = false;

			if ($('#collapse' + index).hasClass('in')) {
				$scope.showRoles1 = true
					$scope.showRoles2 = false;
				//$scope.getGroupPermission(v1,v2,index,0);
			} else {

				$('.collapse').collapse('hide')
				$('#collapse' + index).collapse('show')
				$scope.getGroupPermission(v1, v2, index, 0);
				$scope.showRoles1 = true
					$scope.showRoles2 = false;
			}

		}

		$http.post(BASEURL + RESTCALL.RoleSpecificRead, {
			'RoleID' : v2
		}).success(function (data) {
			$scope.role = data;
		}).error(function (err) {
			$scope.alerts = [{
					type : 'danger',
					msg : err.error.message
				}
			];

		})

	}

	$scope.getGroupName = function ($event) {
		$scope.grpName = $($event.currentTarget).parent().parent().parent().parent().prev().find('.active').text().trim();
	}

	$scope.setDefault = function ($event) {

		$('#resetRoleBox').modal('hide')

		$http.post(BASEURL + RESTCALL.DefaultPermision, {
			'RoleId' : $scope.RoleID
		}).success(function (data) {
			//console.log(data)
			$scope.alerts = [{
					type : 'success',
					msg : data.responseMessage
				}
			];

			setTimeout(function () {
				$('.alert-success').hide()
			}, 3000)

			$http.post(BASEURL + RESTCALL.ResourcePermission + "/readall", {
				'RoleID' : $scope.RoleID,
				'ResourceGroupName' : $scope.grpName
			}).success(function (data) {
				getActionHeaders(data)
				$scope.resourcePermission = data;

			});

			//$scope.updateData.ResourceGroupName


		}).error(function (err) {

			$scope.alerts = [{
					type : 'danger',
					msg : err.error.message
				}
			];
		})
	}

	$scope.callAtTimeout = function () {
		$('.alert').hide();
	}

	$scope.prevIndex = '';

	$scope.getAccordion = function (v1, v2, index) {

		console.log(v1, v2, index)
		$scope.currentIndex = index;
		if ($('#collapse' + $scope.prevIndex).hasClass('in')) {

			if ($scope.active) {
				$('#roleEdit1').modal('show')
				$scope.newObj = {};
				$scope.newObj.v1 = v1;
				$scope.newObj.v2 = v2;
				$scope.newObj.index = index;
				$scope.newObj.zero = 0;

			} else {

				$scope.active = false;
				$('.checkClass').removeClass('checked')
				$scope.checkBoxChecked = false;
				$('.collapse').collapse('hide')
				$('#collapse' + index).collapse('show')
				$scope.prevIndex = index;
				$scope.getGroupPermission(v1, v2, index, 0);
			}
		} else {
			$scope.active = false;
			$('.checkClass').removeClass('checked')
			$scope.checkBoxChecked = false;
			$('#collapse' + index).collapse('show')
			$scope.prevIndex = index;
			$scope.getGroupPermission(v1, v2, index, 0);
		}

		$scope.showRoles1 = false
			$scope.showRoles2 = true;

		setTimeout(function () {
			$('#tab_' + index).css('display', 'block');
		}, 100)

		$('.listGroupList').removeClass('active')
		$("#listGroupListID_" + v2 + "_0").addClass('active')

	}

	$scope.updateExistingRoles = function (role) {

		role.IsSuperAdmin = true;
		$http.put(BASEURL + RESTCALL.CreateRole, role).success(function (data) {

			$scope.alerts = [{
					type : 'success',
					msg : data.responseMessage
				}
			];

			$('.collapse').collapse('hide')

			setTimeout(function () {
				$scope.callAtTimeout()
			}, 4000)

			$scope.alertStyle = alertSize().headHeight;
			$scope.alertWidth = alertSize().alertWidth;
		}).error(function (data, status) {
			$scope.alerts = [{
					type : 'danger',
					msg : data.error.message
				}
			];

			setTimeout(function () {
				$scope.callAtTimeout()
			}, 4000)

			$scope.alertStyle = alertSize().headHeight;
			$scope.alertWidth = alertSize().alertWidth;
		})
	}

	$scope.looseChanges1 = function () {
		//console.log($scope.newObj)

		$('#roleEdit1').modal('hide')
		$scope.active = false
			$('.checkClass').removeClass('checked')
			$scope.checkBoxChecked = false;

		$('.collapse').collapse('hide')
		$('#collapse' + $scope.currentIndex).collapse('show')
		$scope.prevIndex = $scope.currentIndex;
		$('#rolesTable td').css('padding', '12px');

		$scope.getGroupPermission($scope.newObj.v1, $scope.newObj.v2, $scope.newObj.index, $scope.newObj.zero);

	}

	$scope.looseChanges = function () {

		$('#roleEdit').modal('hide')

		if ($('#collapse' + $scope.currentIndex).hasClass('in')) {

			$scope.showRoles1 = true
				$scope.showRoles2 = false;
			$scope.active = false
				$scope.checkBoxChecked = false;
		}
		/* else{
		$('#collapse'+index).collapse('show')
		$scope.showRoles1 = true
		$scope.showRoles2 = false;
		}*/
	}

	$scope.keepOriginal = function () {
		$scope.checkBoxChecked = false;
		$scope.active = false;
		$('#rolesTable td').css('padding', '12px');
		$('.alert-danger').hide()
	}

	$scope.GoBackFromRole = function (index) {
		$scope.active = false;
		$('#collapse' + index).collapse('hide')
	}

	$scope.enableStatus = function (cTab) {
		//$scope.active = true;
		$scope.CurrentTab = cTab;
		$scope.checkBoxChecked = false;

		$scope.active = false;

		setTimeout(function () {

			$('#checkId').removeClass('checked')
		}, 100)

	}

	function getObjects(obj, key, val) {
		var objects = [];
		for (var i in obj) {
			if (!obj.hasOwnProperty(i))
				continue;
			if (typeof obj[i] == 'object') {
				objects = objects.concat(getObjects(obj[i], key, val));
			} else
				//if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
				if (i == key && obj[i] == val || i == key && val == '') { //
					objects.push(obj);
				} else if (obj[i] == val && key == '') {
					//only add if the object is not already in the array
					if (objects.lastIndexOf(obj) == -1) {
						objects.push(obj);
					}
				}
		}
		return objects;
	}

	function getActionHeaders(rpArray) {
		//console.log(rpArray)
		$scope.aheader = [];
		for (i = 0; i < rpArray.length; i++) {
			//console.log(rpArray[i].PermissionList)
			for (j = 0; j < rpArray[i].PermissionList.length; j++) {
				//console.log(rpArray[i].PermissionList[j].Operation)
				$scope.aheader.push(rpArray[i].PermissionList[j].Operation)
			}
		}
		//console.log($scope.aheader)
		return _.uniq($scope.aheader);
	}

	$scope.getGroupPermission = function (gName, roleID, parentId, curId) {

		$scope.RoleID = roleID;
		$scope.toPostData = {}
		$scope.toPostData.RoleID = roleID
			$scope.toPostData.ResourceGroupName = gName
			$http.post(BASEURL + RESTCALL.ResourcePermission + "/readall", $scope.toPostData).success(function (data) {
				$scope.actionHeader123 = getActionHeaders(data)
					$scope.resourcePermission = data;

			});
	}

	/*   $http.get('roles.json').success(function (data) {

	$scope.rolesData = data;
	});
	 */
	$scope.users = [{
			name : 'All Clients',
			value : 'All Clients'
		}, {
			name : 'System',
			value : 'System'
		}, {
			name : 'Client Id',
			value : 'Client Id'
		}
	]

	$scope.checkBox = function (val, flag) {

		$scope.active = !$scope.active;

		if (!flag) {
			// $('#checkId').addClass('checked')
			$scope.checkBoxChecked = true;
			$('#rolesTable td').css('padding', '6px 12px');
		} else {
			//$('#checkId').removeClass('checked')
			$scope.checkBoxChecked = false;
			$('#rolesTable td').css('padding', '12px 12px');
		}
	}

	$scope.checkOpt = function (val) {
		var visible = $(val.currentTarget).parent().parent().parent().parent().find('.visible');

		var visibleDropdown = $(val.currentTarget).parent().parent().find('button:first-child').find('span:first-child');

		//  console.log($(visibleDropdown).attr("class"))

		var selEle = $(val.currentTarget).find("span");
		var selClass = selEle.attr("class");

		console.log(selClass)
		console.log($(visible).attr("class"))

		$(visibleDropdown).removeAttr('class').addClass('opt checkedDropdown').addClass(selClass)
		$(visible).removeAttr("class").addClass('visible').addClass(selClass);
	}

	/* $scope.getRoleDetail = function(index){
	if($('#collapse'+index).hasClass('in')){

	if($scope.showRoles){
	$('#collapse'+index).collapse('hide')
	$scope.showRoles = false;
	}
	else{
	$('#collapse'+index).collapse('show')
	$scope.showRoles = true;
	}

	}
	else{


	if($scope.showRoles){
	$('#collapse'+index).collapse('hide')
	$scope.showRoles = false;
	}
	else{
	$('#collapse'+index).collapse('show')
	$scope.showRoles = true;
	}
	}

	}*/

	$scope.AddNewRole = function () {
		$location.path('app/addroles');
	}

	$scope.AddNewPermissions = function () {
		$location.path('app/addpermissions');
	}

	/*** On window resize ***/
	$(window).resize(function () {
		$scope.$apply(function () {

			$scope.alertWidth = $('.alertWidthonResize').width();
		});

	});

	$scope.action123 = false;
	$scope.buttonStatus = 0;
	$scope.editAllAttribute = function (val, flag) {

		if ((val == '') || (val == false)) {
			$scope.action123 = true;
		} else {
			$scope.action123 = false;
		}
		console.log(val, flag)
		//$('.checkClass').removeClass('checked')
		//$scope.checkBoxChecked = true;
		//alert()
	}

	$scope.operators = ["=", "!=", "<", ">", "<=", ">=", "IN"]

	$scope.addAttribute = function (as, asd, ResourceName, uRoles, key) {

		setTimeout(function () {
			$('.js-select2-multiple').select2();
		}, 0)
		console.log($scope.Obj)
		console.log(key)
		if (key == undefined) {
			key = 0;
		}
		$scope.Obj[key] = true;
		if ($scope.trial.Attributes == undefined) {
			$scope.trial.Attributes = [];
		}

		console.log($scope.trial)
		$scope.attributeObj = {};
		$scope.attributeObj.AttributeName = "";
		$scope.attributeObj.Operator = "";
		$scope.attributeObj.AttributeValue = "";
		$scope.attributeObj.Permissions = [];
		$scope.attributeObj.Permissions123 = [];
		/* $scope.attributeObj.Permissions = [{
		"Operation" : "C",
		"Permission" : false
		}, {
		"Operation" : "R",
		"Permission" : false
		}, {
		"Operation" : "U",
		"Permission" : false
		}, {
		"Operation" : "D",
		"Permission" : false
		}
		]; */
		//console.log($scope.resourceAttributes)
		$scope.trial.Attributes.push($scope.attributeObj);
		console.log($scope.trial)

	}

	function AttributeObjRestructure(Arr) {

		//console.log(Arr)

		for (i = 0; i < Arr.length; i++) {
			var InnerArr = Arr[i].Permissions;

			//console.log(InnerArr)
			for (j = 0; j < InnerArr.length; j++) {
				//console.log(InnerArr[j]);

				if ((j == 0) && (InnerArr[j].Permission == true) && (InnerArr[j].Permission != "")) {
					InnerArr[j].Permission = "C";
				} else {
					delete InnerArr[j];
				}

				if ((j == 1) && (InnerArr[j].Permission == true) && (InnerArr[j].Permission != "")) {
					InnerArr[j].Permission = "R";
				} else {
					delete InnerArr[j];
				}

				if ((j == 2) && (InnerArr[j].Permission == true) && (InnerArr[j].Permission != "")) {
					InnerArr[j].Permission = "U";
				} else {
					delete InnerArr[j];
				}

				if ((j == 3) && (InnerArr[j].Permission == true) && (InnerArr[j].Permission != "")) {
					InnerArr[j].Permission = "D";
				} else {
					delete InnerArr[j];
				}

				/*
				if(InnerArr[j].Permission==false){
				delete InnerArr[j];
				} */
			}
			delete Arr[i].Permissions123;
		}
		//console.log(Arr)
		return Arr;
	}

	function AttributeObjRestructure2(Arr) {
		for (i = 0; i < Arr.length; i++) {
			var InnerArr = Arr[i].Permissions;
			console.log(InnerArr)
			for (j = 0; j < InnerArr.length; j++) {
				if ((j == 0) && (InnerArr[j].Permission == "C")) {
					InnerArr[j].Permission = true;
				} else {
					delete InnerArr[j].Permission;
				}
				if ((j == 1) && (InnerArr[j].Permission == "R")) {
					InnerArr[j].Permission = true;
				} else {
					delete InnerArr[j].Permission;
				}
				if ((j == 2) && (InnerArr[j].Permission == "U")) {
					InnerArr[j].Permission = true;
				} else {
					delete InnerArr[j].Permission;
				}
				if ((j == 3) && (InnerArr[j].Permission == "D")) {
					InnerArr[j].Permission = true;
				} else {
					delete InnerArr[j];
				}
			}
		}
		//console.log(Arr)
		return Arr;
	}

	function AttributeObjRestructure3(Arr) {

		console.log(Arr)
		console.log(Arr.length)

		for (i = 0; i < Arr.length; i++) {
			var InnerArr = Arr[i].Permissions123;

			console.log(InnerArr)
			console.log(InnerArr.length)
			delete Arr[i].Permissions;
			Arr[i].Permissions = [];
			for (j = 0; j < InnerArr.length; j++) {
				//console.log(InnerArr[j]);
				var OP123 = {}
				/* if(InnerArr[j]=='Create'){
					InnerArr[j]='C';
				}
				if(InnerArr[j]=='Read'){
					InnerArr[j]='R';
				}
				if(InnerArr[j]=='Update'){
					InnerArr[j]='U';
				}
				if(InnerArr[j]=='Delete'){
					InnerArr[j]='D';
				} */
				OP123.Operation = InnerArr[j];
				OP123.Permission = true;
				Arr[i].Permissions.push(OP123);

			}
			delete Arr[i].Permissions123;
		}
		//console.log(Arr)
		return Arr;
	}

	$scope.submitAllAttribute = function (attributeArray, ResourceName, RoleID) {
		//console.log(attributeArray)
		$scope.Obj = {};
		var FinalObj = {};
		FinalObj.ResourceName = ResourceName
			FinalObj.RoleID = RoleID
			FinalObj.Attributes = AttributeObjRestructure3(attributeArray.Attributes);

		//var Obj123 = attributeArray;
		//Obj123.Attributes=AttributeObjRestructure(g.Attributes)

		console.log(FinalObj)

		$http.post(BASEURL + '/rest/v2/roles/attributes', FinalObj).success(function (data) {
			console.log(data)
			$scope.alerts = [{
					type : 'success',
					msg : 'Success'
				}
			];

			$('.collapse').collapse('hide');

			setTimeout(function () {
				$('.alert-success').hide();
			}, 3000)
			$scope.detailExpanded = false;
			$scope.action123 = false;
		}).error(function (err) {
			$scope.alerts = [{
					type : 'danger',
					msg : err.error.message
				}
			];

		});
	}

	$scope.toggleAll = function (permissionArr, value111) {
		console.log(value111)
		console.log(permissionArr)
		angular.forEach(permissionArr, function (itm) {
			itm.Permission = value111;
		});
	}

	$scope.attributeCollapse = function () {
		console.log($scope.detailExpanded)
		$scope.Obj = {}
		$scope.action123 = true;

	}

	$scope.deleteRow = function (rowNum) {
		console.log(rowNum,"ADMI B")
		var Attributes123 = $scope.trial.Attributes;
		Attributes123.splice(rowNum, 1);
		console.log($scope.trial)
	}

	//$scope.jjj_0=false;
	$scope.editRow = function (rowNum) {
		$scope.Obj[rowNum] = true;
		//$scope.jjj_0=true;
		//editRow
	}

	$scope.getActionValue123 = function (v1, Arr123) {
		//console.log(v1)
		//console.log(Arr123)
		for (i = 0; i < Arr123.length; i++) {
			//console.log(Arr123[i])
			if (Arr123[i].Operation == v1) {
				Arr123[i].check = true;
				return Arr123[i];
			}
		}
	}

});