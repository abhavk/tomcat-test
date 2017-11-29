VolpayApp.controller('brdBusinessRulesCtrl3', function ($scope, $http, $state, bankData, GlobalService, $timeout, Scopes3) {
	console.log(GlobalService.editRuleBuilder)
	_url1 = BASEURL + '/rest/v2/rulebuilder/schema/read';
								$http({
									url : _url1,
									method : "GET",
									headers : {
										'Content-Type' : 'application/json'
									}
								}).success(function (data, status, headers, config) {
									sessionStorage.RuleBaseObjs = btoa(JSON.stringify(data))
								}).error(function (data, status, headers, config) {
									console.log(data);
								});


    $('.BNYM_BR_validate').live('keypress', function (e) {

    		var regex = /^[a-zA-Z_0-9]$/;
    		var key = String.fromCharCode(e.which);
    		//console.log("key---"+e.which)
    		if (key == '"') {
    			//console.log("if---"+key)
    			return false;
    		} else {
    			// console.log("else---"+key)
    			return true;
    		}

    	});

    	$(".BNYM_BR_validateCP").live('input paste', function (e) {
    	e.preventDefault();
    	});
});


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

//return an array of values that match on a certain key
function getValues(obj, key) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i))
			continue;
		if (typeof obj[i] == 'object') {
			objects = objects.concat(getValues(obj[i], key));
		} else if (i == key) {
			objects.push(obj[i]);
		}
	}
	return objects;
}

//return an array of keys that match on a certain value
function getKeys(obj, val) {
	var objects = [];
	for (var i in obj) {
		if (!obj.hasOwnProperty(i))
			continue;
		if (typeof obj[i] == 'object') {
			objects = objects.concat(getKeys(obj[i], val));
		} else if (obj[i] == val) {
			objects.push(i);
		}
	}
	return objects;
}

function objectFindByKey(array, key, value) {
	for (var i = 0; i < array.length; i++) {
		if (array[i][key] === value) {
			return array[i];
		}
	}
	return null;
}

function hex2a(hex) {
	var str = '';
	for (var i = 0; i < hex.length; i += 2) {
		var v = parseInt(hex.substr(i, 2), 16);
		if (v)
			str += String.fromCharCode(v);
	}
	return str;
}

VolpayApp.controller('QueryBuilderCtrl_3', ['$scope', 'Scopes3', '$http', 'GlobalService', function ($scope, Scopes3, $http, GlobalService) {

			Scopes3.store('QueryBuilderCtrl_3', $scope);

			//console.log(hex2a(GlobalService.editRuleBuilder))
			//console.log(atob(sessionStorage.RuleBaseObjs))
			
			function currectStru(ruleObj) {
					//console.log(ruleObj)
					//ruleObj=ruleObj.Rule;
					for (var i1 = 0; i1 < ruleObj.group.rules.length; i1++) {
						//console.log(ruleObj.group.rules[i1].selectedChapter);
						if (ruleObj.group.rules[i1].selectedChapter != undefined) {	
								ruleObj.group.rules[i1].selectedChapters = objectFindByKey(JSON.parse(atob(sessionStorage.RuleBaseObjs)).RuleVariables, 'Category', ruleObj.group.rules[i1].selectedChapter.category).Fields;
							//	delete ruleObj.group.rules[i1].selectedChapters;
						}

						if (ruleObj.group.rules[i1].group != undefined) {
							currectStru(ruleObj.group.rules[i1])
						}
					}
					return ruleObj;
				}

			var ddd11_0=JSON.parse(hex2a(GlobalService.editRuleBuilder));	
			var ddd11 =ddd11_0;
			ddd11.Rule =currectStru(ddd11_0.Rule);
			//console.log(ddd11_0)
			

			function Hello(val11, field) {
				//console.log(val11)
				//console.log(field)
				var FieldsArr = objectFindByKey(JSON.parse(atob(sessionStorage.RuleBaseObjs)).RuleVariables, 'Category', val11).Fields;
				if (field.Name != undefined) {
					var FieldsArr2 = objectFindByKey(FieldsArr, 'Name', field.Name);
				} else {
					var FieldsArr2 = objectFindByKey(FieldsArr, 'Name', field);
				}
				console.log(FieldsArr)
				console.log(FieldsArr2)
				return FieldsArr2.Type;
			}

			function injectType(ddd11) {
				$scope.rules123 = ddd11.group.rules;
				for (var u = 0; u < $scope.rules123.length; u++) {
					if ($scope.rules123[u].category != undefined) {
						if ($scope.rules123[u] != undefined) {
							//Hello($scope.rules123[u].category,$scope.rules123[u].field);
							ddd11.group.rules[u].type = Hello($scope.rules123[u].category, $scope.rules123[u].field);
							//return $scope.rules123[u];
						}
					}
					if ($scope.rules123[u].group != undefined) {
						injectType($scope.rules123[u])
					}
				}
			}

			//injectType(ddd11.Rule)

			var data = JSON.stringify(ddd11.Rule);
			//console.log(data);
			$scope.rules123 = ddd11.Rule.group.rules;

			//console.log(ddd11.Rule)

			function htmlEntities(str) {
				return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}

			function computed(group) {
				if (!group)
					return "";
				for (var str = "(", i = 0; i < group.rules.length; i++) {

					i > 0 && (str += " <strong>" + group.operator + "</strong> ");
					if (group.rules[i].condition == 'formula') {
						str += group.rules[i].group ?
						computed(group.rules[i].group) :
						group.rules[i].field + "." + group.rules[i].data;
					} else {
						str += group.rules[i].group ?
						computed(group.rules[i].group) :
						group.rules[i].field + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data;
					}
				}

				return str + ")";
			}

			$scope.json = null;

			$scope.filter = JSON.parse(data);

			$scope.$watch('filter', function (newValue) {

				$scope.json = JSON.stringify(newValue, null, 2);
				//console.log(newValue.group)
				$scope.output = computed(newValue.group);
				$scope.output1 = newValue;
				//console.log(newValue)
			}, true);

		}
	]);

VolpayApp.controller('ActionQueryBuilderCtrl_3', ['$scope', '$http', '$location', 'Scopes3', 'GlobalService', function ($scope, $http, $location, Scopes3, GlobalService) {

			Scopes3.store('ActionQueryBuilderCtrl_3', $scope);
			var ddd11 = JSON.parse(hex2a(GlobalService.editRuleBuilder));
			var data = JSON.stringify(ddd11.Action);

			//console.log(data);

			function htmlEntities(str) {
				return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
			}

			function computed(group) {
				if (!group)
					return "";
				for (var str = "(", i = 0; i < group.actions.length; i++) {
					i > 0 && (str += " <strong>;</strong> ");
					str += group.actions[i].group ?
					computed(group.actions[i].group) :
					group.actions[i].field + " " + htmlEntities(group.actions[i].condition) + " " + group.actions[i].data;
				}

				return str + ")";
			}

			$scope.json = null;

			$scope.filter = JSON.parse(data);

			$scope.$watch('filter', function (newValue) {
				$scope.json = JSON.stringify(newValue, null, 2);

				$scope.output = computed(newValue.group);

				$scope.output1 = $scope.json;
			}, true);

			sessionStorage.newEditRule = false;
			$scope.confirmRule = function () {
				//$location.path('app/businessrules');
				sessionStorage.newEditRule = true;
				//$location.path('app/businessrules');
				$location.path('app/businessrulesdetails');
				//window.location.href = '#/app/businessrules'
			}

			$scope.cancelpressed = function () {
				delete sessionStorage.newEditRule;
				delete sessionStorage.editWindowID;
				delete sessionStorage.newRuleFormData;
				delete sessionStorage.newEditRuleFormData;
				delete sessionStorage.newRule;
				delete sessionStorage.editruleJSONBinary;
				delete sessionStorage.buildedRule;
				delete sessionStorage.editWindowID;

				GlobalService.ViewClicked = false;

				//$location.path('app/businessrules');
				$location.path('app/businessrulesdetails');
				//window.location.href = '#/app/businessrulesdetails'
				//window.location.href = '#/app/businessrules'
			}

			$scope.buttonClick = function () {
				
				
				//console.log("TwoController");
				//console.log("OneController::variable1", Scopes3.get('QueryBuilderCtrl').output);
				//console.log("TwoController::variable1", Scopes3.get('ActionQueryBuilderCtrl_3').output);
				//console.log("$scope::variable1", $scope.variable1);

				/*
				$scope.FinalOutput=[]
				$scope.FinalOutput.push(Scopes3.get('QueryBuilderCtrl').output);
				$scope.FinalOutput.push(Scopes3.get('ActionQueryBuilderCtrl_3').output);
				 */

				/*
				$scope.FinalOutput={}
				$scope.FinalOutput.Rule=Scopes3.get('QueryBuilderCtrl').output1;
				$scope.FinalOutput.Action=Scopes3.get('ActionQueryBuilderCtrl_3').output1;
				 */

				//console.log(JSON.parse(JSON.stringify($scope.FinalOutput[0], null, 2)));
				//console.log(JSON.parse(JSON.stringify($scope.FinalOutput[1], null, 2)));
				//var json=JSON.stringify($scope.FinalOutput);
				//console.log(Scopes3.get('QueryBuilderCtrl').output1)


				/* $scope.finalRules=[];
				for(var k=0;k<(Scopes3.get('QueryBuilderCtrl').output1.group.rules).length;k++){
				var rules111=Scopes3.get('QueryBuilderCtrl').output1.group.rules[k];
				$scope.finalRules.push({"category":rules111.category.Category,"field":rules111.field.Name,"type":rules111.field.Type,"condition":rules111.condition,"data":rules111.data})
				} */

				// console.log(ruleArray(Scopes3.get('QueryBuilderCtrl').output1.group.rules))


				function ruleGenerator(AllRuleValues) {
					$scope.ggg = [];
					//console.log(ruleArray(AllRuleValues))
					// console.log(ruleArray(AllRuleValues))
					$scope.ggg.push(ruleArray(AllRuleValues))

					for (var k = 0; k < AllRuleValues.length; k++) {
						//var rules111=Scopes3.get('QueryBuilderCtrl').output1.group.rules;
						//console.log(AllRuleValues[k])
						//console.log(ruleArray(AllRuleValues[k]).length)
						if (ruleArray(AllRuleValues[k]).length > 0) {
							$scope.ggg.push(ruleArray(AllRuleValues[k]))
						}
						if (AllRuleValues[k].group != undefined) {
							//console.log(AllRuleValues[k].group)
							//console.log(AllRuleValues[k].group)
							if (ruleArray(AllRuleValues[k].group).length > 0) {
								$scope.ggg.push(ruleArray(AllRuleValues[k].group))
							}
						}

					}
					return $scope.ggg;
				}

				//console.log(ruleGenerator(Scopes3.get('QueryBuilderCtrl').output1.group.rules))
				//console.log(JSON.stringify(Scopes3.get('QueryBuilderCtrl').output1))
				//console.log((Scopes3.get('ActionQueryBuilderCtrl_3').output1).replace(/(\r\n|\n|\r)/gm,""))


				function ruleArray(ruleArrayValue) {
					$scope.finalRules = [];
					for (var k = 0; k < ruleArrayValue.length; k++) {
						var rules111 = ruleArrayValue[k];
						$scope.finalRules.push({
							"category" : rules111.category.Category,
							"field" : rules111.field.Name,
							"type" : rules111.field.Type,
							"condition" : rules111.condition,
							"data" : rules111.data
						})
					}
					return $scope.finalRules;
				}

				function unwantedObj(rObj) {
					console.log(rObj)
					for (var i = 0; i < rObj.group.rules.length; i++) {
						//console.log(rObj.group.rules[i].category)

						/* if (rObj.group.rules[i].category != undefined) {
						delete rObj.group.rules[i].category.Fields;
						rObj.group.rules[i].category = getCategory(rObj.group.rules[i].category)
						//console.log(1)
						} */

						delete rObj.group.rules[i].selectedChapters;
						delete rObj.group.rules[i].selectedChapter;
						delete rObj.group.rules[i].selectedTitles;
						//delete rObj.group.rules[i].type;
						if (rObj.group.rules[i].field != undefined) {
							//rObj.group.rules[i].type = getfieldType(rObj.group.rules[i].field)
							//rObj.group.rules[i].field = getfield(rObj.group.rules[i].field)
						}
						if (rObj.group.rules[i].group != undefined) {
							unwantedObj(rObj.group.rules[i])
						}
					}

					return rObj;
				}

				function unwantedObj11(rObj) {
					console.log(rObj)
					for (var i = 0; i < rObj.group.rules.length; i++) {						
						delete rObj.group.rules[i].selectedChapters;
						if (rObj.group.rules[i].group != undefined) {
							unwantedObj11(rObj.group.rules[i])
						}
					}

					return rObj;
				}

				function getCategory(Obj) {
					return Obj.Category;
				}

				function getfield(Obj1) {
					//console.log(Obj1);
					return Obj1.Name;
				}

				function getfieldType(Obj11) {
					//console.log(Obj11);
					return Obj11.Type;
				}

				function convert(val1) {
					output = {};
					output.value = "";
					for (i = 0; i < val1.length; i++) {
						output.value += val1[i].charCodeAt(0).toString(2) + " ";
					}
					return output.value;
				}

				function d2h(d) {
					return d.toString(16);
				}
				function h2d(h) {
					return parseInt(h, 16);
				}
				function stringToHex(tmp) {
					var str = '',
					i = 0,
					tmp_len = tmp.length,
					c;

					for (; i < tmp_len; i += 1) {
						c = tmp.charCodeAt(i);
						str += d2h(c);
					}
					return str;
				}

				var ActionVariable1 = objectFindByKey(JSON.parse(atob(sessionStorage.RuleBaseObjs)).RuleVariables, 'Category', 'Action');
				//console.log(ActionVariable)
				$scope.fields1 = ActionVariable1.Fields;

				function getActionType(val1) {

					//scope.type = objectFindByKey(scope.fields, 'Name', val1).Type;
					$scope.jj1 = JSON.parse(val1);
					for (var i1 = 0; i1 < $scope.jj1.group.actions.length; i1++) {

						$scope.jj1.group.actions[i1].type = objectFindByKey($scope.fields1, 'Name', $scope.jj1.group.actions[i1].field).Type;
						//$scope.jj1.actions[i1].type="String";
						delete $scope.jj1.group.actions[i1].$$hashKey;
					}
					return $scope.jj1;
				}

				function getRuleType(val1) {

					console.log(val1)
					for (var i1 = 0; i1 < val1.group.rules.length; i1++) {

						console.log(val1.group.rules[i1].selectedChapter)
						if (val1.group.rules[i1].group == undefined) {
							val1.group.rules[i1].type = val1.group.rules[i1].selectedChapter.Type
								val1.group.rules[i1].category = val1.group.rules[i1].selectedChapter.category
								delete val1.group.rules[i1].$$hashKey;
						} else {
							getRuleType(val1.group.rules[i1])
						}

						/* if((val1.group.rules[i1].group!=undefined)||(val1.group.rules[i1].group!='')){
						//getRuleType(val1.group.rules[i1])

						}else{



						//val1.group.rules[i1].type=val1.group.rules[i1].selectedChapter.Type
						//$scope.jj1.actions[i1].type="String";
						//delete val1.group.rules[i1].$$hashKey;
						}  */

					}
					return val1
				}

				//console.log(Scopes3.get('QueryBuilderCtrl').output1);
				var ruletoBlob = angular.copy(Scopes3.get('QueryBuilderCtrl_3').output1);
				var actiontoBlob = angular.copy(Scopes3.get('ActionQueryBuilderCtrl_3').output1);
				//console.log(JSON.stringify(ruletoBlob));
				//console.log(JSON.stringify(JSON.parse(actiontoBlob)));

				//console.log(JSON.stringify(unwantedObj(ruletoBlob)))

				var ToBLOBData = {
					Rule : "",
					Action : ""
				};
				ToBLOBData.Rule = unwantedObj11(ruletoBlob);
				ToBLOBData.Action = getActionType(actiontoBlob);
				var ToBLOBData1 = JSON.stringify(ToBLOBData).replace(/(\\)/gm, "");

				sessionStorage.editruleJSONBinary = stringToHex(ToBLOBData1);

				//console.log(unwantedObj(Scopes3.get('QueryBuilderCtrl').output1));


				//console.log(data1);
				//$scope.ruleArrayFinal = '{\n  "group":{\n    "operator": "AND",\n    "rules": ' + JSON.stringify((ruleGenerator(Scopes3.get('QueryBuilderCtrl').output1.group.rules)[0]), null, 2) + '\n  }\n}';
				$scope.ruleArrayFinal = JSON.stringify(unwantedObj(ruletoBlob), null, 2);
				$scope.ActionArrayFinal = JSON.stringify(getActionType(Scopes3.get('ActionQueryBuilderCtrl_3').output1), null, 2)

					//console.log($scope.ruleArrayFinal)
					//console.log($scope.ActionArrayFinal)

					$scope.FinalJSON = '{\n "Rule":' + $scope.ruleArrayFinal + ',\n "Action":' + $scope.ActionArrayFinal + ' \n}';

				var someText = $scope.FinalJSON.replace(/(\r\n|\n|\r)/gm, "");

				//console.log(someText);
				//console.log(JSON.stringify(ruletoBlob))
				var toBlob = JSON.stringify({
						"Rule" : JSON.stringify(Scopes3.get('QueryBuilderCtrl_3').output1),
						"Action" : (Scopes3.get('ActionQueryBuilderCtrl_3').output1).replace(/(\r\n|\n|\r)/gm, "")
					});
				//console.log(toBlob)

				//console.log(stringToHex(ToBLOBData))

				function hex2a(hex) {
					var str = '';
					for (var i = 0; i < hex.length; i += 2) {
						var v = parseInt(hex.substr(i, 2), 16);
						if (v)
							str += String.fromCharCode(v);
					}
					return str;
				}

				//console.log(JSON.parse(hex2a(sessionStorage.ruleJSONBinary)))

				//console.log(btoa($scope.FinalJSON))
				//var b64Rule = btoa($scope.FinalJSON);
				var b64Rule = btoa($scope.FinalJSON);

				//_url1 = BASEURL + '/rest/v2/ruleengine/create';
				_url1 = BASEURL + RESTCALL.BankBusinessRuleREST+'rulebuilder';

				$http({
					method : "POST",
					url : _url1,
					data : $.param({
						"jsonData" : $scope.FinalJSON
					}),
					headers : {
						'Content-Type' : 'application/x-www-form-urlencoded'
					}
				}).success(function (data, status, headers, config) {
					//console.log(data);
					
					sessionStorage.buildedRule = data.responseMessage;
					$scope.buildedRule = data.responseMessage;
					$scope.confirmRule();

				}).error(function (data, status, headers, config) {
					//console.log(data);
				});

				/* console.log(JSON.parse(JSON.stringify($scope.FinalOutput, null, 2)));
				console.log(JSON.parse(JSON.stringify($scope.FinalOutput.Rule, null, 2)));
				console.log(JSON.parse(JSON.stringify($scope.FinalOutput.Action, null, 2)));	 */

			};
		}
	]);

VolpayApp.directive('actionBuilder3', ['$compile', 'GlobalService', function ($compile, GlobalService) {
			return {
				restrict : 'E',
				scope : {
					group : '='
				},
				templateUrl : '/actionBuilderDirective3.html',
				compile : function (element, attrs) {
					var content,
					directive;
					content = element.contents().remove();
					return function (scope, element, attrs) {
						scope.operators = [{
								name : 'AND'
							}, {
								name : 'OR'
							}
						];

						var ddd = JSON.parse(hex2a(GlobalService.editRuleBuilder));
						//console.log(ddd.Action.group.actions);
						//scope.group.actions = JSON.parse(ddd.Action).group.actions;
						scope.group.actions = ddd.Action.group.actions;
						scope.conditions = [{
								name : '='
							},
						];

						//console.log(JSON.parse(atob(sessionStorage.RuleBaseObjs)))
						var ActionVariable = objectFindByKey(JSON.parse(atob(sessionStorage.RuleBaseObjs)).RuleVariables, 'Category', 'Action');

						scope.fields = ActionVariable.Fields;

						/* scope.getActionConditions = function (jj) {
						scope.conditions = [];
						scope.type = objectFindByKey(scope.fields, 'Name', jj).Type;
						var conditions = objectFindByKey(JSON.parse(atob(sessionStorage.RuleBaseObjs)).RuleOperators, 'Type', scope.type).Operations.split(",");
						for (var k = 0; k < conditions.length; k++) {

						scope.conditions.push({
						"name" : conditions[k]
						});
						}
						} */

						scope.conditions = [{
								name : '='
							},
						];

						scope.addAction = function () {
							scope.group.actions.push({
								condition : '=',
								field : 'Status',
								data : '',
								type : 'String'
							});
						};

						scope.removeAction = function (index) {
							scope.group.actions.splice(index, 1);
						};

						directive || (directive = $compile(content));

						element.append(directive(scope, function ($compile) {
								return $compile;
							}));
							
						scope.validateAction=function(value,index1){
							for(var i=0;i<index1;i++){								
								var fieldValue1=$("#actionField"+i).val()
								var fieldValue2=$("#actionField"+index1).val()



								if(fieldValue1==fieldValue2)
								{
									alert("Action field should be unique");
									//$("#actionField"+index1).val("select");
									scope.removeAction(index1)
								} 
							}
						}		
					}
				}
			}
		}
	]);

VolpayApp.directive('queryBuilder3', ['$compile', '$http', 'GlobalService', function ($compile, $http, GlobalService) {
			return {

				restrict : 'E',
				scope : {
					group : '='
				},
				templateUrl : '/queryBuilderDirective3.html',
				compile : function (element, attrs) {
					var content,
					directive;
					content = element.contents().remove();
					return function (scope, element, attrs) {

						scope.operators = [{
								name : 'AND'
							}, {
								name : 'OR'
							}
						];

						scope.addCondition = function () {
							scope.group.rules.push({
								condition : '',
								category : '',
								field : '',
								data : '',
								type : ''
							});
						};

						scope.rules11 = [];
						scope.rules = [];
						
						var json1 = JSON.parse(atob(sessionStorage.RuleBaseObjs));
						var ruleVariables11 = json1.RuleVariables;

						for (var i = 0; i < ruleVariables11.length; i++) {

							if (ruleVariables11[i].Category != 'Action') {
								scope.rules.push(ruleVariables11[i])								
							}
						}
						
						function getRuleConditions(RVArr){
							scope.options = [];
							scope.optionsRHS = [];
							for (var i = 0; i < RVArr.length; i++) {
							scope.rules11.push({
									"Category" : RVArr[i].Category
								})
								scope.options.push({
									"Category" : RVArr[i].Category,
									"Fields" : []
								})
								//console.log(ruleVariables11[i].Fields)
								for (var j = 0; j < RVArr[i].Fields.length; j++) {
									RVArr[i].Fields[j].category = RVArr[i].Category;
									scope.options[i].Fields.push(RVArr[i].Fields[j])
									scope.optionsRHS.push(RVArr[i].Fields[j])
								}
							}
						}
						
						
						getRuleConditions(scope.rules)
						
						function arrayTrim(arr) {
							for (var i = 0; i < arr.length; i++) {
								arr[i] = arr[i].trim();
							}
							return arr
						}

						scope.onBookChange = function (b, book) {
							//alert("inside");
							//console.log(b)
							//console.log(book.Fields)
							b.selectedChapters = objectFindByKey(json1.RuleVariables, 'Category', book).Fields;
						}
						scope.inputTypeDate = false;

						scope.onChapterChange = function (b, cha, type1) {
						console.log(b);
						console.log(cha);
						console.log(type1);
							if (type1 == 'add') {
								b.selectedChapter = JSON.parse(cha);
								b.category=b.selectedChapter.category;
								b.type=b.selectedChapter.Type;
								b.selectedChapters = objectFindByKey(json1.RuleVariables, 'Category', b.selectedChapter.category).Fields;								
							}
							if (type1 == 'edit') {
								var cccc = objectFindByKey(objectFindByKey(json1.RuleVariables, 'Category', b.category).Fields, 'Name', cha);
								
								delete cccc.$$hashKey;
								b.data = "";
								b.selectedChapter = cccc;
								b.type=b.selectedChapter.Type;
								b.selectedChapters = objectFindByKey(json1.RuleVariables, 'Category', b.category).Fields;
							}
							b.selectedTitles = arrayTrim(getObjects(json1.RuleOperators, 'Type', b.selectedChapter.Type)[0].Operations.split(","));
							
							if (type1 == 'add') {
								b.condition=b.selectedTitles[0];
							}
							
							if(b.selectedChapter.Type == 'Date')
                            {
                                    setTimeout(function(){
                                        /*$('.DatePicker').datetimepicker({
                                            format: 'YYYY-MM-DD',
                                            autoclose: true,
                                            pickTime: false
                                        })*/

                                        $('.DatePicker').datepicker({
                                                format: 'yyyy-mm-dd',
                                                autoclose: true
                                            });

                                        $('.input-group-addon').on('click focus', function(e){
                                        $(this).prev().focus().click()
                                         });

                                      },200)
                            }
                            if(b.selectedChapter.Type == 'DateTime')
                            {

                                    setTimeout(function(){
                                        /*$('.DateTimePicker').datetimepicker({
                                            pickDate: true,
                                            pickTime: true,
                                            format:"YYYY-MM-DDTHH:mm:ss",
                                            useCurrent: false,
                                            minuteStepping: 1,
                                            useSeconds:  true,
                                            autoclose: true
                                        });*/
										$('.DateTimePicker').datepicker({
                                            format: 'yyyy-mm-dd'+'T00:00:00',
                                            autoclose: true
                                        });
                                        $('.input-group-addon').on('click focus', function(e){

                                        $(this).prev().focus().click()
                                         });

                                      },200)
                            }


						}

						var ddd11 = JSON.parse(hex2a(GlobalService.editRuleBuilder));
						var data = JSON.stringify(ddd11.Rule);
						scope.rules123 = ddd11.Rule.group.rules;

						scope.removeCondition = function (index) {
							scope.group.rules.splice(index, 1);
						};

						scope.addGroup = function () {
							scope.group.rules.push({
								group : {
									operator : 'AND',
									rules : []
								}
							});
						};

						scope.removeGroup = function () {
							"group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
						};

						directive || (directive = $compile(content));

						element.append(directive(scope, function ($compile) {
								return $compile;
							}));

					}

				}

			}
		}
	]);

VolpayApp.factory('Scopes3', function ($rootScope) {
	var mem = {};

	return {
		store : function (key, value) {
			$rootScope.$emit('scope.stored', key);
			mem[key] = value;
		},
		get : function (key) {
			return mem[key];
		}
	};
});