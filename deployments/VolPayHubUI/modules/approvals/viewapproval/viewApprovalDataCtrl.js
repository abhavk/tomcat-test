VolpayApp.controller('viewApprovalDataCtrl', function ($scope, $state, $stateParams, $http, $timeout, CommonService) {

//$scope.text_remaining = 300;
	/* $('#idforNotes').bind('keydown',function(){
		 var text_max = 300;
		 $scope.text_remaining = 300;
	 	var text_length = $('#idforNotes').val().length;
		 
		$scope.text_remaining = text_max - text_length;
		console.log($scope.text_remaining, text_max,text_length)
		
	});*/


    //var max = 300;
    var max = 270
    $("#idforNotes").keydown(function(e){
      $("#lCnt").text((max - $(this).val().length)+" Characters Left");
    });




	$scope.data = $stateParams.input;
	//console.log($scope.data)
    $scope.approvalNotes = '';
	if ($scope.data.TableName == 'BusinessRules') {

		splitData($scope.data.OldData, $scope.data.NewData)

	}
	$timeout(function () {
		if ($('.newData').height() > $('.oldData').height()) {
			$('.preData').height($('.newData').height())
		} else {
			$('.preData').height($('.oldData').height())
		}
	}, 100)

	$scope.approveData = {};
	$scope.approveData.IsApproved = false;

	$scope.approveRefData = function (notes,flag) {
	//console.log(notes,flag)
		var dataObj = {};
		dataObj.ApproveID = $scope.data.ApprovalID;
		dataObj.isApproved = flag;
		dataObj.Notes = notes.approvalNotes;

        $http.put(BASEURL + RESTCALL.ReferenceDataApproval, dataObj).success(function (data) {

			CommonService.refDataApproved.flag = true;
			CommonService.refDataApproved.msg = data.responseMessage;

			$state.go('app.approvals')

		}).error(function (err) {
			CommonService.refDataApproved.flag = false;
			//console.log(err)
			$scope.alerts = [{
					type: 'danger',
					msg: err.error.message
				}
			];

			$timeout(function () {
				$scope.alertStyle = alertSize().headHeight;
				$scope.alertWidth = alertSize().alertWidth;
			}, 100)

		})
	}

	$scope.cancelApproval = function () {
		$state.go('app.approvals');
	}

	$scope.alertWidth = 0;
	$scope.widthOnScroll = function () {
		var mq = window.matchMedia("(max-width: 991px)");
		var headHeight
		if (mq.matches) {
			headHeight = 0;
			$timeout(function () {
				$scope.alertWidth = $('.pageTitle').width();
			}, 100)
		} else {
			$timeout(function () {
				$scope.alertWidth = $('.pageTitle').width();
			}, 100)
			headHeight = $('.main-header').outerHeight(true) + 10;
		}

		$scope.alertStyle = headHeight;

	}
	$scope.widthOnScroll();

	$(window).scroll(function () {
		$scope.widthOnScroll();
	});



	$scope.multipleEmptySpace = function (e) {
		$(e.currentTarget).val($.trim($(e.currentTarget).val()))

		if($.trim($(e.currentTarget).val()).length == 0)
        {
			 //console.log(max,$(e.currentTarget).val().length)
		
            $(e.currentTarget).val('');
			
        }
			$("#lCnt").text(max - $(e.currentTarget).val().length+" Characters Left");
	}



	var nodeText1 = [],
	nodeText2 = [];
	var difference = [];
	$scope.NewDataLabel = [];
	$scope.ApprovalNewData = [];
	$scope.ApprovalNewLabel = [];
	$scope.ApprovalOldData = [];
	$scope.ApprovalOldLabel = [];

	function getVal1() {

		nodeText1.push(comp1.trim());
	}
	function getVal2() {
		nodeText2.push(comp2.trim());
	}

	if ($scope.data.TableName == 'ROLERESOURCEPERMISSION') {

		conversion($scope.data.OldData, $scope.data.NewData)

	}
	function conversion(OldData, NewData) {
		$scope.xmlData = [{
				'hexdata': OldData,
				'convXml': ''
			}
		]

		$scope.xmlNewData = [{
				'hexdata': NewData,
				'convXml': ''
			}
		]

		if ($scope.xmlData[0].hexdata) {

			for (var k = 0; k < $scope.xmlData.length; k++) {
				for (var i = 0; i < $scope.xmlData[k].hexdata.length; i += 2) {
					var v = parseInt($scope.xmlData[k].hexdata.substr(i, 2), 16);
					if (v)
						$scope.xmlData[k].convXml += String.fromCharCode(v);
				}
				$scope.xmlData[k].convXml = $scope.xmlData[k].convXml.replace(/&lt;/g, '<');
				$scope.xmlData[k].convXml = $scope.xmlData[k].convXml.replace(/&gt;/g, '>');
			}

		}

		
		for (var k = 0; k < $scope.xmlNewData.length; k++) {
			for (var i = 0; i < $scope.xmlNewData[k].hexdata.length; i += 2) {
				var v = parseInt($scope.xmlNewData[k].hexdata.substr(i, 2), 16);
				if (v)
					$scope.xmlNewData[k].convXml += String.fromCharCode(v);
			}
			$scope.xmlNewData[k].convXml = $scope.xmlNewData[k].convXml.replace(/&lt;/g, '<');
			$scope.xmlNewData[k].convXml = $scope.xmlNewData[k].convXml.replace(/&gt;/g, '>');
		}

		return $scope.xmlData,
		$scope.xmlNewData;

	}
	function splitData(OldData, NewData) {

		$scope.xmlData = [{
				'convXml': OldData
			}
		]

		$scope.xmlNewData = [{
				'convXml': NewData
			}
		]

	}

	for (k in $scope.xmlNewData) {

		$($scope.xmlNewData[k].convXml).children().each(function () {
			if ($(this).children().length) {
				$(this).children().each(function () {
					if ($(this).children().length) {
						$(this).children().each(function () {

							$scope.NewDataLabel.push(this.nodeName);
							$scope.ApprovalNewLabel.push(this.nodeName)
							$scope.ApprovalNewData.push($(this).text().trim())
							comp2 = $(this).text();
							getVal2();
						})
					} else {

						$scope.NewDataLabel.push(this.nodeName);
						$scope.ApprovalNewLabel.push(this.nodeName)
						$scope.ApprovalNewData.push($(this).text().trim())

						comp2 = $(this).text();
						getVal2();
					}
				})
			} else {
				if (this.nodeName.indexOf("_PK") == -1) {
					//console.log(this.nodeName.indexOf("_PK"))
					$scope.NewDataLabel.push(this.nodeName);
					$scope.ApprovalNewLabel.push(this.nodeName)
					$scope.ApprovalNewData.push($(this).text().trim())
					comp2 = $(this).text();
					getVal2();
				}
			}

		})

	}

	for (k in $scope.xmlData) {

		$($scope.xmlData[k].convXml).children().each(function () {

			if ($(this).children().length) {
				$(this).children().each(function () {
					if ($(this).children().length) {
						$(this).children().each(function () {
							$scope.ApprovalOldLabel.push(this.nodeName)
							$scope.ApprovalOldData.push($(this).text().trim())
							comp1 = $(this).text();
							getVal1();
						})
					} else {

						$scope.ApprovalOldLabel.push(this.nodeName)
						$scope.ApprovalOldData.push($(this).text().trim())
						comp1 = $(this).text();
						getVal1();
					}
				})
			} else {
				if (this.nodeName.indexOf("_PK") == -1) {
					//console.log(this.nodeName.indexOf("_PK"))
					$scope.ApprovalOldLabel.push(this.nodeName)
					$scope.ApprovalOldData.push($(this).text().trim())
					comp1 = $(this).text();
					getVal1();
				}
			}

		})

	}

	/*function arr_diff(a1, a2) {

		var a = [],
		diff = [];

		for (var i = 0; i < a1.length; i++) {
			a[a1[i]] = true;
		}

		for (var i = 0; i < a2.length; i++) {
			if (a[a2[i]]) {
				delete a[a2[i]];
			} else {
				a[a2[i]] = true;
			}
		}

		for (var k in a) {
			diff.push(k);
		}

		return diff;
	};*/

	var DiffArr = arr_diff($scope.ApprovalNewLabel, $scope.ApprovalOldLabel)

	function approvalDataDiff(Label, NData, OData, Diffs) {
		//alert(Label)
		var aDD = [];
		if (OData.length > 0) {

			for (i = 0; i < Diffs.length; i++) {

				for (j = 0; j < Label.length; j++) {

					var tempObj = {};
                   //console.log(Label[j])
					if (Label[j].indexOf("_PK") == -1) {
						//console.log(Label[j].indexOf("_PK"))
						if (aDD.length <= j) {

							if (Diffs[i] == Label[j] && OData[j] != NData[j] || OData[j] == undefined) {
								tempObj.Label = Label[j];
								tempObj.NewData = NData[j]
									tempObj.OldData = OData[j];
								tempObj.Difference = true;
								aDD.push(tempObj);
							} else {
								tempObj.Label = Label[j];
								tempObj.NewData = NData[j]
									tempObj.OldData = OData[j];
								tempObj.Difference = false;
								aDD.push(tempObj);
							}
						} else {
							if (Diffs[i] == Label[j] && OData[j] != NData[j] || OData[j] == undefined) {
								aDD[j].Difference = true;
							}
						}
					}

				}
			}
		} else {
			for (j = 0; j < Label.length; j++) {
				var tempObj = {};
				tempObj.Label = Label[j]
					tempObj.NewData = NData[j]
					tempObj.OldData = OData[j]
					tempObj.Difference = false;
				aDD.push(tempObj);
			}
		}
		return aDD;
	}

	if (nodeText1.length != 0 && nodeText2.length != 0) {
		jQuery.grep(nodeText2, function (el) {
			if (jQuery.inArray(el, nodeText1) == -1) {
				difference.push(el);

			}
		});

	}

	var DiffArrForEDITED = [];
	function findLabels(difference) {
		for (i = 0; i < difference.length; i++) {

			DiffArrForEDITED.push($scope.ApprovalNewLabel[$scope.ApprovalNewData.indexOf(difference[i])])
		}

		return DiffArrForEDITED;
	}
	findLabels(difference)

	if (DiffArrForEDITED.length > 0) {
		$scope.approvalDataDiffData = approvalDataDiff($scope.ApprovalNewLabel, $scope.ApprovalNewData, $scope.ApprovalOldData, DiffArrForEDITED);
	} else {
		$scope.approvalDataDiffData = approvalDataDiff($scope.ApprovalNewLabel, $scope.ApprovalNewData, $scope.ApprovalOldData, DiffArr);
	}

	function objectFindByKey(array, key, value) {
		for (var i = 0; i < array.length; i++) {
			if (array[i][key] === value) {
				return array[i];
			}
		}
		return null;
	}

	function RPRestuctureObj(OldDataArray, NewDataArray) {
		var FinalArray = [];
		for (i = 0; i < NewDataArray.length; i++) {
			var ObjTemp = {};
			ObjTemp.ResourceName = NewDataArray[i].ResourceName;
			if (objectFindByKey(OldDataArray, 'ResourceName', NewDataArray[i].ResourceName) != null) {
				ObjTemp.OldPermission = OldDataArray[i].PermissionList;
			}
			ObjTemp.NewPermission = NewDataArray[i].PermissionList;
			FinalArray.push(ObjTemp)
		}
		return FinalArray;
	}

	if ($scope.data.TableName == 'ROLERESOURCEPERMISSION') {
		var x2js = new X2JS();
		$scope.RPApprovalOldData = x2js.xml_str2json($scope.xmlData[0].convXml);
		$scope.RPApprovalNewData = x2js.xml_str2json($scope.xmlNewData[0].convXml);
		$scope.RPApprovalFinalData = RPRestuctureObj($scope.RPApprovalOldData.GroupResourcePermissions.ResourceGroupPermissions, $scope.RPApprovalNewData.GroupResourcePermissions.ResourceGroupPermissions)

	}

	function hex2a(hexx) {
		var hex = hexx.toString();
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}

	function convertXml2JSon(xml) {
		var x2js = new X2JS();
		return x2js.xml_str2json(xml);
	}

	function getMainKeysFromJSON(jsonData) {
		for (var k in jsonData) {
			return k
		}
	}

	function getKeysFromJSON(jsonData) {
		var keys = [];
		for (var k in jsonData) {
			for (var i in jsonData[k]) {
				if (i.indexOf("_PK") == -1) {
					keys.push(i);
				}
			}
		}
		return keys;
	}
	var OldData = $scope.data.OldData;
	var NewData = $scope.data.NewData;
	var Oldarr = [];
	function getFinalData(ODJSON, NDJSON, finalLabels) {

		var approvalDataArray = [];
		if (Object.keys(ODJSON).length > 0) {
			for (i = 0; i < finalLabels.length; i++) {
				var tempObj = {};
					//console.log(finalLabels[i],ODJSON[finalLabels[i]],NDJSON[finalLabels[i]])
					
					
				if ((ODJSON[finalLabels[i]]) != undefined) {
					//console.log(typeof ODJSON[finalLabels[i]],typeof NDJSON[finalLabels[i]])
					if(typeof ODJSON[finalLabels[i]] == "object" || typeof NDJSON[finalLabels[i]] == "object" )
					{
						//console.log(JSON.stringify(ODJSON[finalLabels[i]]),JSON.stringify(NDJSON[finalLabels[i]]));
						NDJSON[finalLabels[i]] = JSON.stringify(NDJSON[finalLabels[i]])
						ODJSON[finalLabels[i]] = JSON.stringify(ODJSON[finalLabels[i]])
					}

					if (NDJSON[finalLabels[i]] != ODJSON[finalLabels[i]]) {
					//console.log(NDJSON[finalLabels[i]],ODJSON[finalLabels[i]])
						tempObj.label = finalLabels[i];
						tempObj.updatedData = NDJSON[finalLabels[i]];
						tempObj.currentData = ODJSON[finalLabels[i]];
						tempObj.diffence = true;
					} else {
						tempObj.label = finalLabels[i];
						tempObj.updatedData = NDJSON[finalLabels[i]];
						tempObj.currentData = ODJSON[finalLabels[i]];
						tempObj.diffence = false;
					}
				} else {
					//console.log(NDJSON[finalLabels[i]],ODJSON[finalLabels[i]])
					tempObj.label = finalLabels[i];
					tempObj.updatedData = NDJSON[finalLabels[i]];
					tempObj.currentData = "";
					tempObj.diffence = true;
				}
				approvalDataArray.push(tempObj);
			}

		} else {
			for (j = 0; j < finalLabels.length; j++) {
				var tempObj = {};
				tempObj.label = finalLabels[j];
				tempObj.updatedData = NDJSON[finalLabels[j]];
				tempObj.currentData = ODJSON[finalLabels[j]];
				tempObj.diffence = false;
				approvalDataArray.push(tempObj);

			}
		}
		//console.log(approvalDataArray)
		return approvalDataArray;
	}
	var ruleObj = {
				"ruleOldData": [],
				"ruleNewData": []

		}
		
	var finalLabels=[];
	var finalLabelsOld=[];
	//console.log(ruleObj)
	function keyvalueForBR(XML,keysval)
	{
		//alert(keysval)
		$(XML).children().each(function () {
		
			if ($(this).children().length) {
				$(this).children().each(function () {
					if ($(this).children().length) {
						$(this).children().each(function () {
							//console.log(this.nodeName,$(this).text().trim())
							var nodeNames = this.nodeName;
							var textValus = $(this).text().trim();
							//ruleObj[keysval].push({key:nodeNames,value:textValus})
							ruleObj[keysval][nodeNames] = textValus; 
						})
					} else {
							var nodeNames = this.nodeName;
							var textValus = $(this).text().trim();
							//ruleObj[keysval].push({key:nodeNames,value:textValus})
							ruleObj[keysval][nodeNames] = textValus; 
					}
				})
			} else {
				if (this.nodeName.indexOf("_PK") == -1) {
						var nodeNames = this.nodeName;
						var textValus = $(this).text().trim();
						//ruleObj[keysval].push({key:nodeNames,value:textValus})
						ruleObj[keysval][nodeNames] = textValus; 

				}
			}
	
		})
		return ruleObj;
	}
	
	
	function isEmptyObject(obj) {
                    var name;
                    for (name in obj) {
                        return false;
                    }
                    return true;
                };

                 function jsondiff(obj1, obj2) {
                    var result = {};
                    var change;
                    for (var key in obj1) {
                        if (typeof obj2[key] == 'object' && typeof obj1[key] == 'object') {
                            change = jsondiff(obj1[key], obj2[key]);
                            if (isEmptyObject(change) === false) {
                                result[key] = change;
                            }
                        }
                        else if (obj2[key] != obj1[key]) {
                            result[key] = obj2[key];
                        }
                    }
					//console.log(result)
                    return result;
                };
		
	
/*	function getFinalRuleData(ODJSON, NDJSON, finalLabels,finalLabelsOld) {
        console.log(ODJSON, NDJSON, finalLabels)
		var approvalDataArray = [];
		if (Object.keys(ODJSON).length > 0) {
			for (i = 0; i < finalLabels.length; i++) {
				var tempObj = {};
				//console.log(ODJSON,NDJSON)
				if ((ODJSON[i]) != undefined) {
					//console.log(NDJSON[i].value)
					if (NDJSON[i].value != ODJSON[i].value) {
						tempObj.label = finalLabels[i];
						tempObj.updatedData = NDJSON[i].value;
						tempObj.currentData = ODJSON[i].value;
						tempObj.diffence = true;
					} else {
						tempObj.label = finalLabels[i];
						tempObj.updatedData = NDJSON[i].value;
						tempObj.currentData = ODJSON[i].value;
						tempObj.diffence = false;
					}
				} else {
					tempObj.label = finalLabels[i];
					tempObj.updatedData = NDJSON[i].value;
					tempObj.currentData = "";
					tempObj.diffence = true;
				}
				approvalDataArray.push(tempObj); 
			}

		} else {
			for (j = 0; j < finalLabels.length; j++) {
				var tempObj = {};
				tempObj.label = finalLabels[j];
				tempObj.updatedData = NDJSON[j].value;
				tempObj.currentData = "";
				tempObj.diffence = false;
				approvalDataArray.push(tempObj);

			}  
		}
		console.log(approvalDataArray)
		return approvalDataArray;
	}
	
	*/
	
	
	
	if ($scope.data.State != 'CREATED' && ($scope.data.State != 'Instruction Uploaded' || $scope.data.State != 'File Uploaded')) {

	var OldData = $scope.data.OldData;
	var NewData = $scope.data.NewData;
	
	if($scope.data.TableName == 'BusinessRules')
	{
		ODXML = OldData;
		NDXML = NewData;
		keyvalueForBR(ODXML,'ruleOldData')
		keyvalueForBR(NDXML,'ruleNewData')
		finalLabels = Object.keys(ruleObj['ruleNewData'])
		//console.log(finalLabels)
		$scope.checkOdataLength =Object.keys(ruleObj['ruleOldData']).length;	
	     $scope.FinalDataArray = getFinalData(ruleObj['ruleOldData'], ruleObj['ruleNewData'], finalLabels)	
	}
	else
	{
		ODXML = hex2a(OldData);
		NDXML = hex2a(NewData);
		ODJSON = convertXml2JSon(ODXML);
		NDJSON = convertXml2JSon(NDXML);
		//console.log(ODJSON)
		var finalLabels = getKeysFromJSON(NDJSON);
		$scope.checkOdataLength = Object.keys(ODJSON).length;
		var mainKey = getMainKeysFromJSON(NDJSON);
		//console.log(ODJSON)
		var keydiff = jsondiff(ODJSON,NDJSON)
		//console.log(keydiff)
		for(i in keydiff)
		{
			for(j in keydiff[i])
			{
				//console.log(keydiff[i][j],j)
				if(keydiff[i][j] == undefined)
				{
					//alert(j)
					var index = Object.keys(ODJSON[i]).indexOf(j);
					//alert(index);
					//finalLabels[index] = j;
					finalLabels.splice(index, 0, j);
					
				}
				
				
			}
		}
		console.log(finalLabels)
		$scope.FinalDataArray = getFinalData(ODJSON[mainKey], NDJSON[mainKey], finalLabels) 
	}
	
	
	} else {

		if ( $scope.data.State == 'CREATED' || ($scope.data.State != 'Instruction Uploaded' || $scope.data.State != 'File Uploaded')) {
			
			var NewData = $scope.data.NewData;
			
			if($scope.data.TableName == 'BusinessRules')
			{
				NDXML = NewData;
				keyvalueForBR(NDXML,'ruleNewData');
				finalLabels = Object.keys(ruleObj['ruleNewData'])
				console.log(finalLabels)
				$scope.checkOdataLength =Object.keys(ruleObj['ruleOldData']).length;	
				$scope.FinalDataArray = getFinalData(ruleObj['ruleOldData'], ruleObj['ruleNewData'], finalLabels)
			}
			else
			{
			NDXML = hex2a(NewData);
			NDJSON = convertXml2JSon(NDXML);
			var mainKey = getMainKeysFromJSON(NDJSON);
			var finalLabels = getKeysFromJSON(NDJSON);
			$scope.FinalDataArray = getFinalData(Oldarr, NDJSON[mainKey], finalLabels)
            
			}
		}

	}
	var newObj = {
		"FDCParameters": {
			"oldData": [],
			"newData": []

		},
		"PDCParameters": {
			"oldData": [],
			"newData": []
		}

	}

	function iterate(obj, label, dType) {


			//obj = JSON.parse(obj)
		console.log(label,obj)
		for (var property in obj) {
			if (obj.hasOwnProperty(property)) {
				if (typeof obj[property] == "object") {
					//console.log("if",label,(obj[property]), label, dType);
					iterate(obj[property], label, dType);

				} else {
					//console.log("else",label,property,obj[property])
					newObj[label][dType].push({
						'key': property,
						'value': obj[property]
					})
				}

			}
		}

	//	console.log("label",newObj)

		return newObj;
	}

	//var ab;
	//var PdcFdcheader = [];
	$scope.sendXML = function (getval, label, dType) {

		//console.log("aa",getval,"bb",label,"cc",dType)

		var data = (dType == 'oldData')?getval['currentData']:(getval['updatedData'])?getval['updatedData']:'';
		//var checkType = (dType == 'oldData')?'currentData':'updatedData'
		//console.log(dType,data)

		if(data)
		{
				//console.log("check",data.indexOf('<'))
				if(data.indexOf('<') != -1)
				{
					//console.log("1",data)
					$scope.FdcPdcparam = convertXml2JSon(data)
				}
				else{

					//console.log(data)
					$scope.FdcPdcparam = JSON.parse(data)
				}

				//console.log("2",$scope.FdcPdcparam)
		
				iterate($scope.FdcPdcparam, label, dType)
		}
		

		
		
			
	}
	
	
	setTimeout(function () {

		var keyArrObj = {

			"FDCParameters": {
				"oldData": [],
				"newData": []

			},
			"PDCParameters": {
				"oldData": [],
				"newData": []
			}

		}

		//var keyArr = [];
		var paramval = {
			"FDCParameters": {
				"oldData": [],
				"newData": [],
				"header": "FileDuplicateCheckConfig"

			},
			"PDCParameters": {
				"oldData": [],
				"newData": [],
				"header": "PaymentDuplicateCheckConfig"
			}
		};
		var count = {
			"FDCParameters": {
				"oldData": [],
				"newData": []

			},
			"PDCParameters": {
				"oldData": [],
				"newData": []
			}
		};
		//var nn = [];
		var newNN = [{
				'label': '',
				'arr': []
			}
		]

		for (var i in newObj) {
			for (var j in newObj[i]) {
				for (var k in newObj[i][j]) {
					keyArrObj[i][j].push(newObj[i][j][k].key)

				}

			}
		}

		for (var i in keyArrObj) {
			for (var j in keyArrObj[i]) {
				keyArrObj[i][j].forEach(function (k) {
					count[i][j][k] = (count[i][j][k] || 0) + 1;

				});
			}
		}

		

		for (var i in count) {
			//nn = [];
			newNN = [{
					'label': '',
					'arr': []
				}
			]

			for (var j in count[i]) {
				//nn = [];
				newNN = [{
						'label': '',
						'arr': []
					}
				]
				for (var k in newObj[i][j]) {

					for (var l in count[i][j]) {

						if ((l == newObj[i][j][k].key) && (count[i][j][l] == 1)) {
							//nn = [];
							newNN = [{
									'label': '',
									'header': '',
									'arr': []
								}
							]
							paramval[i][j].push({
								'key': l,
								'value': newObj[i][j][k].value
							})
						} else if ((l == newObj[i][j][k].key) && (count[i][j][l] != 1)) {
							//nn.push(newObj[i][j][k].value)
							newNN[0].label = l;
							newNN[0].arr.push(newObj[i][j][k].value)
						}

					}
				}

				for (var x in newNN) {

					paramval[i][j].push({
						'key': newNN[x].label,
						'value': newNN[x].arr
					})

				}
			}

		}

		
		var tD = "";
		var list = '';
		//var tData = "<table class='table table-bordered'><tbody>" + tD + "</tbody></table>"
			for (var i in paramval) {
				tD = "";
				list = "";
				for (var j in paramval[i]) {
					tD = "";
					list = "";

					for (var k in paramval[i][j]) {

						if (paramval[i][j][k].value instanceof Array) {
							//console.log(aa[i])
							for (var m = 0; m < paramval[i][j][k].value.length; m++) {
								list = list + "<li>" + paramval[i][j][k].value[m] + "</li>"
							}
							if (paramval[i][j][k].key) {
								tD = tD + "<tr><td>" + paramval[i][j][k].key + "</td>" + "<td><ul>" + list + "</ul></td></tr>"

							}

						} else {
							tD = tD + "<tr><td>" + paramval[i][j][k].key + "</td>" + "<td>" + paramval[i][j][k].value + "</td></tr>"
						}

					}
					$('#' + i + j).html("<table class='table table-bordered'><tbody><tr><th colspan='2'>" + paramval[i].header + "</th></tr>" + tD + "</tbody></table>")

				}

			}

	}, 100)
	

	
	
	
	

})