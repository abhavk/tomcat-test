VolpayApp.controller('paymentRepairCtrl', function ($scope, $state, $http, httpCall, GlobalService,$filter) {

	//$filter('hex2a')($scope.tempVal.Template)
	$scope.input = $state.params.input;
	//console.log($scope.input.data.Amount)

	$scope.repairPaymetcall = {
		"PaymentID" : $scope.input.data.PaymentID,
		"RepairID" : $scope.input.data.RepairID
	}

	httpCall.crudRequest('POST', '/rest/v2/payments', $scope.repairPaymetcall).then(function (data) {
		var rPaymentData=data.data;
		//rPaymentData.Amount=$filter('isoCurrency')(rPaymentData.Amount,"USD").trim()
		$scope.backupRepair = angular.copy(rPaymentData)
			$scope.repairPayment = rPaymentData
			httpCall.crudRequest('GET', '/rest/v2/payments/metainfo', {}).then(function (data) {
				constructwebformFields(data)
			}, errorFunction)

	}, errorFunction)

	function errorFunction(data) {

		//console.log("Er ",data.data.error.message)
		$scope.alerts = [{
				type : 'danger',
				msg : data.data.error.message
			}
		];

		//console.log('sdf',$scope.repairPaymetcall,data)
		//console.log(data)

	}

	function constructwebformFields(data) {


		$scope.webformFields = [];
		//console.log(data.data.Data.webformuiformat.fields.field)
		for (field in data.data.Data.webformuiformat.fields.field) {
			if ('webformfieldgroup' in data.data.Data.webformuiformat.fields.field[field].fieldGroup1) {
				//console.log('Stage1',data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2)
				$scope.webformFields.push({
					'header' : '',
					'Stage' : '1',
					'data' : {
						'name' : data.data.Data.webformuiformat.fields.field[field].name,
						'type' : data.data.Data.webformuiformat.fields.field[field].type,
						'label' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label,
						'inputType' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].type,
						'maxlength' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width,
						'required' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible
					}
				})
			} else {
				//console.log(data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.sectionheader, data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup)
				$scope.section = [];
				for (subfield in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field) {
					if ('webformfieldgroup' in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1) {
						$scope.section.push({
							'name' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].name,
							'type' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].type,
							'label' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label,
							'inputType' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].type,
							'maxlength' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width,
							'required' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible,
							'options' : 'choiceOptions' in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type] ? data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].choiceOptions : ''
						})
						//console.log('Stage2',data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup)
					} else {
						$scope.subSection = [];
						for (subsubfield in data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field) {
							//console.log('Stage3', data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].type)
							$scope.subSection.push({
								'name' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].name,
								'type' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].type,
								'label' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.label,
								'inputType' :
								data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].type,
								'maxlength' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer[data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.renderer.type].width,
								'required' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.fields.field[subsubfield].fieldGroup1.webformfieldgroup.webformfieldgroup_2.visible
							})
						}
						//console.log(data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup)
						$scope.section.push({
							'header' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].fieldGroup1.webformsectiongroup.sectionheader,
							'name' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.fields.field[subfield].name,
							'Stage' : '3',
							'data' : $scope.subSection
						})
					}
				}
				//console.log($scope.section)
				//console.log(data.data.Data.webformuiformat.fields.field[field].name)
				$scope.webformFields.push({
					'header' : data.data.Data.webformuiformat.fields.field[field].fieldGroup1.webformsectiongroup.sectionheader,
					'name' : data.data.Data.webformuiformat.fields.field[field].name,
					'Stage' : '2',
					'data' : $scope.section
				})
			}
		}
		//console.log($scope.webformFields)
	}

	$scope.repairSubmit = function (repairedData) {
		console.log(repairedData)
		httpCall.crudRequest('PUT', '/rest/v2/payments/repair', repairedData).then(function (data) {
			$scope.input = {
				'responseMessage' : [{
						type : 'success',
						msg : data.data.responseMessage
					}
				]
			}
			$state.go('app.payments', {
				input : $scope.input
			})
		}, errorFunction)
	}

	$scope.gotoPaymentDetail = function () {

		/*GlobalService.fileListId = $scope.input.InstructionID;
		GlobalService.UniqueRefID = $scope.input.PaymentID;
		GlobalService.fromPage = 'filedetail'*/

		//console.log("input", $scope.input)

		$scope.Obj = {
			'uor' : '',
			'nav' : {
				'UIR' : $scope.input.data.InstructionID,
				'PID' : $scope.input.data.PaymentID
			},
			'from' : GlobalService.fromPage
		}

		$state.go('app.paymentdetail', {
			input : $scope.Obj
		})

		//$state.go('app.paymentdetail',{input:$scope.input})
	}

	$scope.resetRepair = function () {
		//console.log($scope.backupRepair)
		$scope.repairPayment = angular.copy($scope.backupRepair)
	}

	$scope.multipleEmptySpace = function (e) {
		if ($.trim($(e.currentTarget).val()).length == 0) {
			$(e.currentTarget).val('');
		}
		if ($(e.currentTarget).is('.DatePicker, .DateTimePicker, .TimePicker')) {
			$(e.currentTarget).data("DateTimePicker").hide();
		}
	}

	$scope.allowData = function ($event, type) {
		//console.log($event,type)
		/*
		var regex = {
		'Integer' : /^\d+$/,
		'Binary' : /^[01]+$/,
		'BigDecimal' : /^[0-9]*\.?[0-9]*$/
		}
		if(type != 'String'){
		if(regex[type].test($event.key) || $event.keyCode <= 35 || $event.keyCode <= 40 || $event.keyCode == 46  || $event.keyCode == 8 || $event.keyCode == 9){
		if(type == 'BigDecimal'){
		$($event.currentTarget).val().match(regex['BigDecimal'])?$($event.currentTarget).val(): $($event.currentTarget).val(
		function(index, value){
		console.log(index, value)
		return value.substr(0, value.length - 1);
		})
		}
		}
		else{
		$event.preventDefault()
		}
		} */

		console.log($event, type)
		var regex = {
			'Integer' : /^\d+$/,
			'Binary' : /^[01]+$/
		}
		if (type != 'String' && type != 'BigDecimal') {
			if (regex[type].test($event.key) || $event.keyCode <= 35 || $event.keyCode <= 40 || $event.keyCode == 46 || $event.keyCode == 8 || $event.keyCode == 9) {}
			else {
				$event.preventDefault()
			}
		} else if (type == 'BigDecimal') {
			$($event.currentTarget).val($($event.currentTarget).val().replace(/[^0-9\.]/g, ''));
			if (($event.which != 46 || $($event.currentTarget).val().indexOf('.') != -1) && ($event.which < 48 || $event.which > 57)) {
				$event.preventDefault();
			}
		}
	}

	$scope.activatePicker = function (e) {

		var prev = null;
		$('.DatePicker').datetimepicker({
			format : "YYYY-MM-DD",
			useCurrent : true,
			showClear : true
		}).on('dp.change', function (ev) {
			console.log($(ev.currentTarget).attr('ng-model').split('['))
			if ($(ev.currentTarget).attr('ng-model').split('[').length == 3) {
				var pId = $(ev.currentTarget).parent().parent().parent().parent().attr('id');
				console.log($(ev.currentTarget).attr('ng-model').split('[')[0], pId, $(ev.currentTarget).attr('name'))
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][pId][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			} else {
				console.log($(ev.currentTarget).attr('ng-model').split('[')[0], $(ev.currentTarget).attr('name'))
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}
		}).on('dp.show', function (ev) {
			//console.log()
		}).on('dp.hide', function (ev) {
			//console.log()
		});

		$('.DateTimePicker').datetimepicker({
			format : "YYYY-MM-DDTHH:mm:ss",
			useCurrent : true,
			showClear : true
		}).on('dp.change', function (ev) {
			if ($(ev.currentTarget).attr('ng-model').split('[').length == 3) {
				var pId = $(ev.currentTarget).parent().parent().parent().parent().attr('id');
				console.log($(ev.currentTarget).attr('ng-model').split('[')[0], pId, $(ev.currentTarget).attr('name'))
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][pId][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			} else {
				console.log($(ev.currentTarget).attr('ng-model').split('[')[0], $(ev.currentTarget).attr('name'))
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}
		}).on('dp.show', function (ev) {
			//console.log()
		}).on('dp.hide', function (ev) {
			//console.log()
		});

		$('.TimePicker').datetimepicker({
			format : 'HH:mm:ss',
			useCurrent : true
		}).on('dp.change', function (ev) {
			if ($(ev.currentTarget).attr('ng-model').split('[').length == 3) {
				var pId = $(ev.currentTarget).parent().parent().parent().parent().attr('id');
				console.log($(ev.currentTarget).attr('ng-model').split('['), pId)
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][pId][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			} else {
				console.log($(ev.currentTarget).attr('ng-model').split('['))
				$scope[$(ev.currentTarget).attr('ng-model').split('[')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()
			}
			console.log("abc")
			//console.log($scope.subSectionfieldData,$scope.subSectionfieldData.length,$(ev.currentTarget).attr('name'),$(ev.currentTarget).val())
		}).on('dp.show', function (ev) {
			//console.log(ev)
		}).on('dp.hide', function (ev) {
			//console.log()
		});

		$('.input-group-addon').on('click focus', function (e) {
			$(this).prev().focus().click()
		});
	}

	$scope.triggerPicker = function (e) {
		if ($(e.currentTarget).prev().is('.DatePicker, .DateTimePicker, .TimePicker')) {
			$scope.activatePicker($(e.currentTarget).prev());
		}
	};

});