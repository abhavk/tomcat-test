VolpayApp.controller('initiateTransactionCtrl', function ($scope, $http, $state, $location, $timeout, GlobalService, LogoutService, $filter, getMethodService) {

	$timeout(function () {
		sidebarMenuControl('PaymentModule', 'InitiateTransaction')
	}, 500)

	$scope.selectOptions = []
	$scope.PaymentDetails = {}
	$scope.OrderingCustomer = {};
	$scope.BeneficiaryBank = {}
	$scope.Beneficiary = {}
	$scope.PaymentInformation = {}
	$scope.RemittanceInformation = {}
	$scope.IntermediaryBankDetails = {}
	$scope.CurrencyDecimalDigits = 3;

	//$scope.psaCode = {};

	$scope.forUSRTP = {};
	$scope.RemitInfoMaxLength = 140;
	$scope.ChargeCodelength = 0;
	$scope.ProductsSupported123 = '';
	$scope.serviceIsNotSingle = true;
	$scope.OrderingCustomerAccountNumber = '';
	$scope.SaveTemplate = false;
	$scope.TemplateDetails = {}
	$scope.TemplateDetails.Status = "ACTIVE"
		$scope.Templateloading = false;

	$scope.OrderingCustomer.AccountNumber = "";
	$scope.OrderingCustomer_AccountCurrency = ""
		$scope.selectOptions.push({})
		//$scope.ServiceAvailabilty = true;
		$scope.isOrderingCustomerCollapsed = true;
	$scope.isBenenficiaryBankDetailsCollapsed = true;
	$scope.isBenenficiaryDetailsCollapsed = true;
	$scope.isPaymentInfoCollapsed = true;
	$scope.isRemittanceInformationCollapsed = true;
	$scope.OrderingCustomerAccountNumber_length = 0;
	$scope.serviceCodeFromTemplate = false;

	$(document).ready(function () {

		$scope.select2Arr = [{
				"name" : "party",
				"key" : "PartyName",
				"url" : "/rest/v2/parties/readall",
				"method" : "POST"
			}, {
				"name" : "templates",
				"key" : "TemplateName",
				"url" : "/rest/v2/manualpaymentinitiationtemplate/readall",
				"method" : "POST"
			}
		]
		//remoteDataConfig('AllAccountNumber','AccountName', '/rest/v2/accounts/readall', 'POST')

		$scope.currentSelect2 = {};

		$scope.limit = 500;
		var ddddd = {
			"start" : 0,
			"count" : 300
		};
		var newObj = JSON.stringify(ddddd);

		$scope.querySearchContructor = function (key, value123, start, count) {

			//console.log(key, value123,start, count)
			$scope.query = {
				"Queryfield" : [{
						"ColumnName" : key,
						"ColumnOperation" : "like",
						"ColumnValue" : value123
					}
				],
				"start" : start * count ? start * count : 0,
				"count" : count
			}
			if (value123 != '') {
				$scope.query = constructQuery($scope.query);
			} else {
				$scope.query = {
					"start" : 0,
					"count" : count
				};
			}

			return $scope.query;
		}

		var remoteDataConfig = function (ID, key, RESTCALL, METHOD) {

			$('.appendselect2').select2({
				ajax : {
					url : function () {
						//console.log($(this).attr('name'))

						for (var i in $scope.select2Arr) {
							if ($scope.select2Arr[i].name == $(this).attr('name')) {
								$scope.currentSelect2 = $scope.select2Arr[i];
								return BASEURL + $scope.select2Arr[i].url
							}
						}
					},
					method : "POST",
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

						var query = $scope.querySearchContructor('', '', params.page, $scope.limit);

						if (params.term) {
							query = $scope.querySearchContructor($scope.currentSelect2.key, params.term, params.page, $scope.limit);
						}

						//console.log("query", query, params)
						return JSON.stringify(query);
					},
					processResults : function (data, params) {

						//console.log(this,$scope.currentSelect2)
						params.page = params.page ? params.page : 0;
						var myarr = []
						//console.log(data)
						for (j in data) {

							if (data[j][$scope.currentSelect2.key] == undefined) {
								myarr.push({
									'id' : JSON.stringify(data[j]),
									'text' : data[j].PartyCode
								})
							} else {
								myarr.push({
									'id' : JSON.stringify(data[j]),
									'text' : data[j][$scope.currentSelect2.key]
									//'text' : data[j][$scope.currentSelect2.key]+ "  - "+data[j].PartyCode
								})
							}
						}
						return {
							results : myarr,
							pagination : {
								more : data.length >= $scope.limit
							}
						};
					},
					cache : true
				},
				placeholder : '--Select--',
				minimumInputLength : 0,
				allowClear : true
			}).on('select2:select', function () {

				//console.log(this,$(this).val())

				if ($(this).attr('name') == 'templates') {
					$scope.tempVal = JSON.parse($(this).val());
					$scope.tempVal.Template = $filter('hex2a')($scope.tempVal.Template)
						$scope.tempVal.Template = JSON.parse($scope.tempVal.Template)
						//console.log($scope.tempVal)

						//var query = $scope.querySearchContructor('', '', params.page, $scope.limit);

						//if (params.term) {
						$scope.tempQuery = $scope.querySearchContructor("PartyCode", $scope.tempVal.Template.Party, 0, 500);
					//}

					//console.log("query", query, params)
					//return JSON.stringify(query);

					$http.post(BASEURL + '/rest/v2/parties/readall', $scope.tempQuery).success(function (data) {

						//console.log(data[0], 'has', data[0]['$$hashKey'])
						//$('select[name=party]').select2().select2('destroy')
						$scope.partyOptions = data;
						setTimeout(function () {
							delete data[0].$$hashKey;
							$scope.party = JSON.stringify(data[0]);
							//console.log($scope.party)
							$('select[name=party]').val($scope.party)
							//$('select[name=party]').select2()
						}, 100)
						//$scope.party = data[0];
						//console.log(data)

						//$('select[name=party]').val(data[0])


					})

					//console.log($scope.tempVal)
					//$scope.loadTemplateData($scope.tempVal)
				}
			})

			//$(".appendselect2").select2({ width: 'resolve' });
		}
		//remoteDataConfig('PartyCode','PartyName','/rest/v2/parties/readall', 'POST')
		//remoteDataConfig('AllAccountNumber','AccountName', '/rest/v2/accounts/readall', 'POST')

		remoteDataConfig()
	})

	var remoteDataConfig1 = function () {

		$scope.select2Arr1 = [{
				"name" : "AccountNumber",
				"key" : "AccountNo",
				"url" : "/rest/v2/accounts/readall",
				"method" : "POST"
			}
		]

		$('.appendselect21').select2({
			ajax : {
				url : function () {
					//console.log($(this).attr('name'))

					for (var i in $scope.select2Arr1) {
						if ($scope.select2Arr1[i].name == $(this).attr('name')) {
							$scope.currentSelect2 = $scope.select2Arr1[i];
							return BASEURL + $scope.select2Arr1[i].url
						}
					}
				},
				method : "POST",
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

					var query = $scope.querySearchContructor('', '', params.page, $scope.limit);

					if (params.term) {
						query = $scope.querySearchContructor($scope.currentSelect2.key, params.term, params.page, $scope.limit);
					}

					//console.log("query", query, params)
					return JSON.stringify(query);
				},
				processResults : function (data, params) {

					//console.log(this,$scope.currentSelect2)
					params.page = params.page ? params.page : 0;
					var myarr = []
					//console.log(data)
					for (j in data) {

						if (data[j][$scope.currentSelect2.key] == undefined) {
							myarr.push({
								'id' : JSON.stringify(data[j]),
								'text' : data[j].PartyCode
							})
						} else {
							myarr.push({
								'id' : JSON.stringify(data[j]),
								'text' : data[j][$scope.currentSelect2.key]
								//'text' : data[j][$scope.currentSelect2.key]+ "  - "+data[j].PartyCode
							})
						}
					}
					return {
						results : myarr,
						pagination : {
							more : data.length >= $scope.limit
						}
					};
				},
				cache : true
			},
			placeholder : '--Select--',
			minimumInputLength : 0,
			allowClear : true
		}).on('select2:select', function () {

			//console.log(this,$(this).val())

			if ($(this).attr('name') == 'templates') {
				$scope.tempVal = JSON.parse($(this).val());
				$scope.tempVal.Template = $filter('hex2a')($scope.tempVal.Template)
					$scope.tempVal.Template = JSON.parse($scope.tempVal.Template)
					//console.log($scope.tempVal)

					//var query = $scope.querySearchContructor('', '', params.page, $scope.limit);

					//if (params.term) {
					$scope.tempQuery = $scope.querySearchContructor("PartyCode", $scope.tempVal.Template.Party, 0, 500);
				//}

				//console.log("query", query, params)
				//return JSON.stringify(query);

				$http.post(BASEURL + '/rest/v2/parties/readall', $scope.tempQuery).success(function (data) {

					//console.log(data[0], 'has', data[0]['$$hashKey'])
					//$('select[name=party]').select2().select2('destroy')
					$scope.partyOptions = data;
					setTimeout(function () {
						delete data[0].$$hashKey;
						$scope.party = JSON.stringify(data[0]);
						//console.log($scope.party)
						$('select[name=party]').val($scope.party)
						//$('select[name=party]').select2()
					}, 100)
					//$scope.party = data[0];
					//console.log(data)

					//$('select[name=party]').val(data[0])


				})

				//console.log($scope.tempVal)
				//$scope.loadTemplateData($scope.tempVal)
			}
		})

		//$(".appendselect2").select2({ width: 'resolve' });
	}
	//remoteDataConfig('PartyCode','PartyName','/rest/v2/parties/readall', 'POST')
	//remoteDataConfig('AllAccountNumber','AccountName', '/rest/v2/accounts/readall', 'POST')


	$scope.getServiceList = function (party) {

		console.log(party)
		$scope.psaCode = "";
		$scope.psaCode11 = '';
		$scope.PSAvalue = '';

		if (!$scope.Templateloading) {
			$scope.PaymentDetails.ValueDate = date;
			$scope.TemplateDetails.EffectiveFromDate = date;
		} else {
			$http({
				url : BASEURL + '/rest/v2/services/read',
				method : "POST",
				data : {
					"ServiceCode" : $scope.TemplateData.Service
				},
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				$scope.getPSAbyPartyService(party, JSON.stringify(data))
				$scope.service11 = JSON.stringify(data);
				$scope.serviceCodeFromTemplate = true;
			}).error(function (data, status, headers, config) {});
		}

		$scope.query = {
			"Queryfield" : [{
					"ColumnName" : "PartyCode",
					"ColumnOperation" : "=",
					"ColumnValue" : JSON.parse(party).PartyCode
				}
			],
			"start" : 0,
			"count" : 1000
		}

		$scope.query = constructQuery($scope.query);

		$http({
			url : BASEURL + '/rest/v2/partyserviceassociations/readall',
			method : "POST",
			data : $scope.query,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			//$scope.selectOptions = data;
			if (data.length >= 1) {
				$scope.query_Service = {
					"Queryfield" : [],
					"start" : 0,
					"count" : 1000
				}

				if (data.length > 1) {
					for (i = 0; i < data.length; i++) {
						$scope.query_Service.Queryfield.push({
							"ColumnName" : "ServiceCode",
							"ColumnOperation" : "=",
							"ColumnValue" : data[i].ServiceCode
						})
					}
				} else {
					$scope.query_Service.Queryfield.push({
						"ColumnName" : "ServiceCode",
						"ColumnOperation" : "=",
						"ColumnValue" : data[0].ServiceCode
					})
				}

				$scope.query_for_serive = constructQuery($scope.query_Service);

				$http({
					url : BASEURL + '/rest/v2/services/readall',
					method : "POST",
					data : $scope.query_for_serive,
					headers : {
						'Content-Type' : 'application/json'
					}
				}).success(function (data, status, headers, config) {

					if (data.length > 1) {
						$scope.serviceIsNotSingle = false;
						//$scope.service11 = data[0].ServiceCode;
						//$scope.service11 = '';
					} else if (data.length == 1) {

						$scope.service11 = data[0].ServiceCode;
						$scope.serviceIsNotSingle = false;
						//console.log(party)
						//console.log($scope.service11)
						$scope.serviceCodeFromTemplate = false;
						$scope.getPSAbyPartyService(party, JSON.stringify(data[0]))
					}

					$scope.serviceOptions = data;
					$timeout(function () {
						$('select[name=service11]').select2()
					}, 500)

				}).error(function (data, status, headers, config) {});
			} else {
				// $scope.ServiceAvailabilty = false;
				//alert("There is no Service availble for this "+JSON.parse(party).PartyName);
			}
		}).error(function (data, status, headers, config) {});

	}

	$scope.getPSAbyPartyService = function (party, service) {

		//console.log(party)
		//console.log(service)
		$scope.service11 = JSON.parse(service).ServiceCode;

		$scope.isOrderingCustomerCollapsed = false;
		$scope.isBenenficiaryBankDetailsCollapsed = false;
		$scope.isBenenficiaryDetailsCollapsed = false;
		$scope.isPaymentInfoCollapsed = false;
		$scope.isRemittanceInformationCollapsed = false;

		$scope.party123 = JSON.parse(party);

		$timeout(function () {
			remoteDataConfig1()
		}, 500)

		$scope.query_Party_Service = {
			"Queryfield" : [{
					"ColumnName" : "PartyCode",
					"ColumnOperation" : "=",
					"ColumnValue" : JSON.parse(party).PartyCode
				}, {
					"ColumnName" : "ServiceCode",
					"ColumnOperation" : "=",
					"ColumnValue" : JSON.parse(service).ServiceCode
				}
			],
			"start" : 0,
			"count" : 1000
		}
		$scope.query123 = constructQuery($scope.query_Party_Service);
		//console.log($scope.query123)

		$http({
			url : BASEURL + '/rest/v2/partyserviceassociations/readall',
			method : "POST",
			data : $scope.query123,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			//console.log(data)

			if (data.length == 1) {
				$scope.psaCode11 = data[0].PartyServiceAssociationCode;
				$scope.getPaymentDetailsByPSA(JSON.stringify(data[0]))
			}

			$scope.selectOptions = data;

		}).error(function (data, status, headers, config) {});

		$scope.getUniqueCurrency = function (AllCurrency) {
			var Currencies123 = [];
			for (i = 0; i < AllCurrency.length; i++) {
				Currencies123.push(AllCurrency[i].actualvalue);
			}
			return uniques(Currencies123);
		}

		function uniques(arr) {
			var a = [];
			for (var i = 0, l = arr.length; i < l; i++)
				if (a.indexOf(arr[i]) === -1 && arr[i] !== '')
					a.push(arr[i]);
			return a.sort();
		}

		if (JSON.parse(service).InstructionCurrencies == 'ALL') {
			//$scope.forUSRTP.PaymentCurrency=getSupportedProducts(JSON.parse(service).InstructionCurrencies);
			$scope.CurrencyAll = false;
			$http.get(BASEURL + '/rest/v2/currencies/code?start=0&count=1000').success(function (data, status, headers, config) {
				//console.log(data)
				if (JSON.parse($scope.getUniqueCurrency(data)).length == 1) {
					$scope.PaymentDetails.PaymentCurrency = JSON.parse($scope.getUniqueCurrency(data))[0];
				}
				$scope.forUSRTP.PaymentCurrency = $scope.getUniqueCurrency(data);
			}).error(function (data, status, headers, config) {
				//console.log(data)

			});
		} else {
			if (getSupportedProducts(JSON.parse(service).InstructionCurrencies).length == 1) {
				//console.log(getSupportedProducts(JSON.parse(service).InstructionCurrencies).length)
				$scope.PaymentDetails.PaymentCurrency = getSupportedProducts(JSON.parse(service).InstructionCurrencies)[0];
			}
			$scope.forUSRTP.PaymentCurrency = getSupportedProducts(JSON.parse(service).InstructionCurrencies);

		}

		$http.post(BASEURL + '/rest/v2/currencies/read', {
			"CurrencyCode" : JSON.parse(service).InstructionCurrencies,
			"CountryCode" : JSON.parse(party).Country
		}).success(function (data, status, headers, config) {
			$scope.CurrencyDecimalDigits = data.DecimalDigits + 1
		}).error(function (data, status, headers, config) {
			//console.log(data)
		});

		var ClientID1234 = '';
		$http.get(BASEURL + '/rest/v2/party/code/' + JSON.parse(party).PartyCode).success(function (data, status, headers, config) {
			//console.log(data)

			if (data.length == 1) {
				$scope.OrderingCustomer.ClientID = data[0].actualvalue;
				//console.log($scope.OrderingCustomer.ClientID)
			}

			if (data.length > 1) {
				$scope.ClientID123 = data;

			} else {
				$scope.ClientID123 = data;

			}
			$scope.ClientID123 = data;
			ClientID1234 = data;
			fetchClientData($scope.ClientID123)

		}).error(function (data, status, headers, config) {
			//console.log(data)
		});

		$timeout(function () {
			getMethodService.fetchData(BASEURL + '/rest/v2/party/code/' + JSON.parse(party).PartyCode).then(function (d) {
				console.log(d)
				ClientID1234 = d;
			});
		}, 500)

		console.log(ClientID1234)

		function fetchClientData(ClientData) {
			console.log(ClientData)
			//$scope.OrderingCustomer.ClientID = 'A309213';

			if ($scope.party123.PartyName != undefined) {
				$scope.OrderingCustomer.ClientName = $scope.party123.PartyName;
			}
			if ($scope.party123.AddressLine1 != undefined) {

				$scope.OrderingCustomer.ClientAddressLine1 = $scope.party123.AddressLine1;
			}
			if ($scope.party123.AddressLine2 != undefined) {

				$scope.OrderingCustomer.ClientAddressLine2 = $scope.party123.AddressLine2;
			}
			if ($scope.party123.City != undefined) {

				$scope.OrderingCustomer.City = $scope.party123.City;
			}
			if ($scope.party123.State != undefined) {

				$scope.OrderingCustomer.State = $scope.party123.State;
			}
			if ($scope.party123.PostCode != undefined) {

				$scope.OrderingCustomer.PostCode = $scope.party123.PostCode;
			}
			if ($scope.party123.Country != undefined) {

				$scope.OrderingCustomer.Country = $scope.party123.Country;
			}

			/* var CA3 = '';
			if ($scope.party123.City != undefined) {
			CA3 = CA3 + $scope.party123.City + ', '
			}
			if ($scope.party123.State != undefined) {
			CA3 = CA3 + $scope.party123.State + ', '
			}
			if ($scope.party123.PostCode != undefined) {
			CA3 = CA3 + $scope.party123.PostCode
			}

			if ($scope.party123.AddressLine2 != undefined) {

			$scope.OrderingCustomer.ClientAddressLine2 = $scope.party123.AddressLine2;
			$scope.OrderingCustomer.ClientAddressLine2 = $scope.OrderingCustomer.ClientAddressLine2 + " " + CA3;
			} else {
			//$scope.OrderingCustomer.ClientAddressLine2 = CA3;
			} */

			$scope.PaymentBranch = '';

			$scope.OrderingCustomerAccountNumber = '';
			$scope.OrderingCustomer.AccountCurrency = '';
			$scope.OrderingCustomer.AccountName = '';
		
			
			inputObj3 = {
				"filters" : {
					"logicalOperator" : "AND",
					"groupLvl1" : [{
							"logicalOperator" : "AND",
							"groupLvl2" : [{
									"logicalOperator" : "AND",
									"groupLvl3" : [{
											"logicalOperator" : "AND",
											"clauses" : [{
													"columnName" : "PartyCode",
													"operator" : "=",
													"value" : ClientData[0].actualvalue
												}
											]
										}
									]
								}
							]
						}
					]
				},
				"start" : 0,
				"count" : 1000
			}

			console.log(inputObj3)

			$http({
				url : BASEURL + '/rest/v2/accounts/readall',
				method : "POST",
				data : inputObj3,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				console.log(data)

				if (data.length == 1) {
					$scope.OrderingCustomerAccountNumber_length = 1;
					$scope.OrderingCustomerAccountNumber = JSON.stringify(data[0]);
					
					console.log(getSupportedProducts(data[0].AccountCurrency))
					$scope.OrderingCustomer_AccountCurrency = getSupportedProducts(data[0].AccountCurrency);
					$scope.OrderingCustomer.AccountCurrency = data[0].DefaultCurrency;
					$scope.OrderingCustomer.AccountName = data[0].AccountName;
					$scope.getAccountNumberCurrency(JSON.stringify(data[0]));
					$scope.AccountNumber11 = data;
				} else if (data.length == 0) {
					$scope.OrderingCustomerAccountNumber_length = 0;
				} else {
					
					if($scope.Templateloading==true){
						$http({
							url : BASEURL + '/rest/v2/accounts/read',
							method : "POST",
							data : {
								"AccountNo" : $scope.TemplateData.OrderingCustomer.AccountNumber
							},
							headers : {
								'Content-Type' : 'application/json'
							}
						}).success(function (data, status, headers, config) {
							console.log(data)
							$scope.getAccountNumberCurrency(JSON.stringify(data));
							$scope.OrderingCustomerAccountNumber = JSON.stringify(data);
						}).error(function (data, status, headers, config) {});
					}
					
					$scope.OrderingCustomerAccountNumber_length = data.length;
					$scope.AccountNumber11 = data;
					console.log($scope.AccountNumber11)
					
				}

			}).error(function (data, status, headers, config) {
				////console.log(data)
				if (err.status == 401) {
					if (configData.Authorization == 'External') {
						window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
					} else {
						LogoutService.Logout();
					}
				} else {
					$scope.alerts = [{
							type : 'danger',
							msg : data.error.message
						}
					];
				}
			});
			
			
		}

		//console.log(JSON.parse(party).PartyCode)
		//console.log(JSON.parse(service).ServiceCode)

		$timeout(function () {
			$('select[name=psaCode]').select2()
			$('select[name=Branch]').select2()
			$('select[name=PaymentType]').select2()
			$('select[name=ClientID]').select2()
			$('select[name=PaymentCurrency]').select2()
			$('select[name=OrderingCustomer_AccountNumber]').select2()
			$('select[name=AccountDomiciledCountry]').select2()
			$('select[name=AccountCurrency]').select2()
		}, 500)

		//$scope.loadBenenficiaryBankDetails()

	}

	$scope.ignoreEmptyValue = function (Arr) {
		var CCValue = [];
		for (i = 0; i < Arr.length; i++) {
			if (Arr[i].SupportedChargeCodes != undefined) {
				CCValue.push(Arr[i])
			}
		}
		if (CCValue.length >= 1) {
			return CCValue;
		} else {
			CCValue = '';
			return CCValue;
		}
	}

	$scope.getPaymentTypeDetails = function (ProductsSupported, Service) {

		console.log(ProductsSupported)
		console.log(Service)

		if (Service == 'RPX') {
			$scope.RemitInfoMaxLength = 35 * 4;

			$scope.forUSRTP.MessageType = [{
					"actualValue" : "Credit Transfer",
					"displayValue" : "Credit Transfer"
				}, {
					"actualValue" : "Request for payment",
					"displayValue" : "Request for payment"
				}
			];

			$scope.forUSRTP.DebtorCustomerProprietaryCode = [{
					"actualValue" : "Consumer",
					"displayValue" : "Consumer"
				}, {
					"actualValue" : "FAConsumer",
					"displayValue" : "FAConsumer"
				}, {
					"actualValue" : "Business",
					"displayValue" : "Business"
				}, {
					"actualValue" : "FABusiness",
					"displayValue" : "FABusiness"
				}
			];

		} else if ((Service == 'GVP') || (Service == 'GLV')) {

			$scope.forUSRTP.MessageType = [{
					"actualValue" : "Credit Transfer",
					"displayValue" : "Credit Transfer"
				}

			];
			$scope.PaymentDetails.MessageType = "Credit Transfer";
			$scope.RemitInfoMaxLength = 35 * 10;

		} else if ((Service == 'CXC')) {

			$scope.forUSRTP.MessageType = [{
					"actualValue" : "Credit Transfer Standard",
					"displayValue" : "Credit Transfer Standard"
				}, {
					"actualValue" : "Credit Transfer Expedited",
					"displayValue" : "Credit Transfer Expedited"
				}

			];
			$scope.RemitInfoMaxLength = 200;

		} else {
			$http.get(BASEURL + '/rest/v2/messagetypes/readall?start=0&count=1000').success(function (data, status, headers, config) {
				console.log(data)
				$scope.forUSRTP.MessageType = data;
			}).error(function (data, status, headers, config) {
				//console.log(data)
			});

			$http.get(BASEURL + '/rest/v2/debtorcustomer/code?start=0&count=1000').success(function (data, status, headers, config) {
				//console.log(data)
				$scope.forUSRTP.DebtorCustomerProprietaryCode = data;
			}).error(function (data, status, headers, config) {
				//console.log(data)
			});

			/* $http.get(BASEURL + '/rest/v2/charge/code?start=0&count=1000').success(function (data, status, headers, config) {
			//console.log(data)
			$scope.forUSRTP.ChargeCode = data;
			}).error(function (data, status, headers, config) {
			//console.log(data)
			}); */
		}

		$scope.loadBenenficiaryBankDetails($scope.ProductsSupported123)

		inputObj21 = {
			"filters" : {
				"logicalOperator" : "AND",
				"groupLvl1" : [{
						"logicalOperator" : "AND",
						"groupLvl2" : [{
								"logicalOperator" : "AND",
								"groupLvl3" : [{
										"logicalOperator" : "AND",
										"clauses" : [{
												"columnName" : "ProductCode",
												"operator" : "=",
												"value" : ProductsSupported
											}
										]
									}
								]
							}
						]
					}
				]
			},
			"start" : 0,
			"count" : 1000
		}

		$http({
			url : BASEURL + '/rest/v2/methodofpayments/readall',
			method : "POST",
			data : inputObj21,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			//console.log(data)
			if (data.length == 1) {
				$scope.ChargeCodelength = 1;
				$scope.PaymentDetails.ChargeCode = $scope.ignoreEmptyValue(data[0]);
			}
			if (data.length > 1) {
				$scope.ChargeCodelength = data.length;
				$scope.forUSRTP.ChargeCode = $scope.ignoreEmptyValue(data);
			}

		}).error(function (data, status, headers, config) {
			////console.log(data)
			if (err.status == 401) {
				if (configData.Authorization == 'External') {
					window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
				} else {
					LogoutService.Logout();
				}
			} else {
				$scope.alerts = [{
						type : 'danger',
						msg : data.error.message
					}
				];
			}
		});

		$("#idforNotes").keydown(function (e) {
			$("#lCnt").text(($scope.RemitInfoMaxLength - $(this).val().length) + " Characters Left");
		});

		$scope.getPaymentType($scope.PaymentDetails.MessageType)

		$timeout(function () {
			$('select[name=MessageType]').select2()
			$('select[name=DebtorCustomerProprietaryCode]').select2()
		}, 500)

	}

	$scope.collapseAll = function () {
		$scope.isOrderingCustomerCollapsed = true;
		$scope.isBenenficiaryBankDetailsCollapsed = true;
		$scope.isBenenficiaryDetailsCollapsed = true;
		$scope.isPaymentInfoCollapsed = true;
		$scope.isRemittanceInformationCollapsed = true;
		$scope.activatePicker();
	}

	$scope.expandAll = function () {
		$scope.isOrderingCustomerCollapsed = false;
		$scope.isBenenficiaryBankDetailsCollapsed = false;
		$scope.isBenenficiaryDetailsCollapsed = false;
		$scope.isPaymentInfoCollapsed = false;
		$scope.isRemittanceInformationCollapsed = false;
		$scope.activatePicker();
	}

	$scope.Reload = function () {

		$state.reload();

		$scope.isOrderingCustomerCollapsed = true;
		$scope.isBenenficiaryBankDetailsCollapsed = true;
		$scope.isBenenficiaryDetailsCollapsed = true;
		$scope.isPaymentInfoCollapsed = true;
		$scope.isRemittanceInformationCollapsed = true;
		$scope.activatePicker();

	}

	$scope.loadBenenficiaryBankDetails = function (ProductsSupported) {

		$scope.isBenenficiaryBankDetailsCollapsed = false;

		inputObj_BIC = {
			"filters" : {
				"logicalOperator" : "AND",
				"groupLvl1" : [{
						"logicalOperator" : "AND",
						"groupLvl2" : [{
								"logicalOperator" : "AND",
								"groupLvl3" : [{
										"logicalOperator" : "AND",
										"clauses" : [{
												"columnName" : "ProductCode",
												"operator" : "=",
												"value" : ProductsSupported
											}
										]
									}
								]
							}
						]
					}
				]
			},
			"start" : 0,
			"count" : 1000
		}

		$http.post(BASEURL + '/rest/v2/methodofpayments/readall', inputObj_BIC).success(function (data, status, headers, config) {
			if (data.length == 1) {
				$scope.BeneficiaryBank.BankIdentifierType = data[0].ClearingSchemeCode;
				//$scope.IntermediaryBankDetails.BankIdentifierType=data[0].ClearingSchemeCode;
				$scope.getBankIdentifierCode($scope.BeneficiaryBank.BankIdentifierType)
				//$scope.getBankIdentifierCode1($scope.BeneficiaryBank.BankIdentifierType)
			}
			$scope.forUSRTP.BICCode = data;
			$timeout(function () {
				$('select[name=BankIdentifierType1]').select2()
				$('select[name=BIC1]').select2()
				$('select[name=BankIdentifierType]').select2()
				$('select[name=BIC]').select2()
			}, 500)
		}).error(function (data, status, headers, config) {
			//console.log(data)
		});

		/* $http.get(BASEURL + '/rest/v2/bic/code?start=0&count=1000').success(function (data, status, headers, config) {
		//console.log(data)
		$scope.forUSRTP.BICCode = data;
		$timeout(function () {
		$('select[name=BankIdentifierType1]').select2()
		$('select[name=BIC1]').select2()
		$('select[name=BankIdentifierType]').select2()
		$('select[name=BIC]').select2()
		}, 500)
		}).error(function (data, status, headers, config) {
		//console.log(data)
		}); */

	}

	$scope.getPaymentType = function (MessageType) {
		$http.get(BASEURL + '/rest/v2/paymenttype/' + encodeURI(MessageType) + '?start=0&count=1000').success(function (data, status, headers, config) {
			//console.log(data)
			$scope.PaymentTypePushPull = data;
		}).error(function (data, status, headers, config) {
			//console.log(data)
		});
	}

	var today = new Date();
	//var date = today.getDate() + '-' + (today.getMonth() + 1) + '-' + today.getFullYear();
	var month = '';
	if ((today.getMonth() + 1) <= 9) {
		month = '0' + (today.getMonth() + 1);
	} else {
		month = today.getMonth() + 1;
	}
	//var date = today.getFullYear() + '-' +month + '-' +today.getDate();
	var date = todayDate();

	//console.log(date)
	if (!$scope.Templateloading) {
		$scope.PaymentDetails.ValueDate = date;
	}
	$scope.fieldMandatory = false;
	$scope.INDSelected = true;

	$scope.CountryIND = "OTHER";
	$scope.getBeneficiaryCountry = function (Country) {

		if ($scope.PaymentType == "SWIFT") {
			if (Country == "IND") {
				$scope.INDSelected = false;
				$scope.CountryIND = "IND";
				$scope.forUSRTP.PaymentCurrency = "INR";
				//$scope.PaymentDetails.BeneficiaryCountry=""

			} else {
				$scope.INDSelected = true;
				$scope.PaymentDetails.PaymentCurrency = "";
				$scope.CountryIND = "OTHER";
				$scope.forUSRTP.PaymentCurrency = ["USD", "GBP", "EUR"];
			}
		}
	}

	$timeout(function () {

		$('.toggle-on').css('background-color', '#ccc')

		$('.toggle-group .btn').click(function () {

			//console.log(this)

			$(this).parent().parent().parent().parent().find('.col-md-3').find('input').val('')

			if (($(this).text().toUpperCase() == 'BIC') || ($(this).text().toUpperCase() == 'IBAN')) {
				$(this).parent().parent().parent().parent().find('.col-md-3').find('input').attr('onkeydown', 'return allowOnlyNumbersAlone(event)')
			} else {
				$(this).parent().parent().parent().parent().find('.col-md-3').find('input').removeAttr('onkeydown', 'return allowOnlyNumbersAlone(event)')
			}

		})

	}, 500)

	$(".allownumericwithdecimal").on("keypress keyup blur", function (event) {
		$(this).val($(this).val().replace(/[^0-9\.]/g, ''));
		if ((event.which != 46 || $(this).val().indexOf('.') != -1) && (event.which < 48 || event.which > 57)) {
			event.preventDefault();
		}
	});

	$scope.SWIFTVal = 'BIC';
	$scope.toggleSwitch = function (e) {

		//console.log($(e.currentTarget).find('span:nth-child(2)').text().toUpperCase())
		//  //console.log(e.currentTarget)
		////console.log($(e.currentTarget).parent().find('label'))
		$(e.currentTarget).parent().find('label').find('span:first-child').html('')
		$(e.currentTarget).find('span:first-child').html('<i class="fa fa-check-circle checkIcon"></i>')

		////console.log($(e.currentTarget).parent().parent().parent().find('.fieldArea').find('input'))


		//$scope.BeneficiaryBank.ClearingCode = "00000000007";
		/* $scope.BeneficiaryBank.BeneficiaryBankName = "TEST BANK";
		$scope.BeneficiaryBank.BeneficiaryBankAddressLine1 = "Bank Address Line1";
		$scope.BeneficiaryBank.BeneficiaryBankAddressLine2 = "Bank Address Line2";
		$scope.BeneficiaryBank.BeneficiaryBankAddressLine3 = "Bank Address Line3";
		$scope.BeneficiaryBank.BeneficiaryBankCountry = "US"; */

		$(e.currentTarget).parent().parent().parent().find('.fieldArea').find('input').val('')
		$(e.currentTarget).parent().parent().parent().find('.fieldArea').find('input').attr('placeholder', 'Please Enter' + $(e.currentTarget).text())

		if (($(e.currentTarget).find('span:nth-child(2)').text().toUpperCase() == "CLEARING CODE") || ($(e.currentTarget).find('span:nth-child(2)').text().toUpperCase() == "ACCOUNT NUMBER")) {
			if ($(e.currentTarget).find('span:nth-child(2)').text().toUpperCase() == "CLEARING CODE") {
				$scope.SWIFTVal = 'ClearingCode';
			}

			$(e.currentTarget).parent().parent().parent().find('.fieldArea').find('input').attr('onkeydown', 'return allowOnlyNumbersAlone(event)')
		} else {

			$scope.SWIFTVal = '';

			$(e.currentTarget).parent().parent().parent().find('.fieldArea').find('input').removeAttr('onkeydown', 'return allowOnlyNumbersAlone(event)')
		}

		$(e.currentTarget).parent().find('.togBtn').addClass('toggleOff').removeClass('toggleOn');
		$(e.currentTarget).addClass('toggleOn').removeClass('toggleOff')
	}

	function getSupportedProducts(val) {

		var gSPArray = [];
		val1 = val.split(',');
		for (i = 0; i < val1.length; i++) {
			if (val1[i].trim().length > 0) {
				gSPArray.push(val1[i]);
			}
		}
		console.log(gSPArray)
		return gSPArray;
	}

	$scope.getPaymentDetailsByPSA = function (PSACODE) {

		$scope.PSAvalue = PSACODE;
		// var inputObj={}
		//inputObj.PartyCode=JSON.parse(PSACODE).PartyCode;
		//console.log(PSACODE)

		//console.log(JSON.parse(PSACODE))

		$scope.ProductsSupported = getSupportedProducts(JSON.parse(PSACODE).ProductsSupported);

		//console.log($scope.ProductsSupported)

		var inputObj = '';
		$scope.branchList = '';
		if (JSON.parse(PSACODE).DeriveBranchCode == false) {

			inputObj = {
				"filters" : {
					"logicalOperator" : "AND",
					"groupLvl1" : [{
							"logicalOperator" : "AND",
							"groupLvl2" : [{
									"logicalOperator" : "AND",
									"groupLvl3" : [{
											"logicalOperator" : "AND",
											"clauses" : [{
													"columnName" : "BranchCode",
													"operator" : "=",
													"value" : JSON.parse(PSACODE).BranchCode
												}
											]
										}
									]
								}
							]
						}
					]
				},
				"start" : 0,
				"count" : 1000
			}

			//console.log(inputObj);
			$http({
				url : BASEURL + '/rest/v2/branches/readall',
				method : "POST",
				data : inputObj,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				////console.log(data)
				if (data.length == 1) {
					$scope.PaymentBranch = data[0].BranchCode;
				}
				if (data.length > 0) {
					$scope.branchList = data;
				} else {}
			}).error(function (data, status, headers, config) {
				////console.log(data)
				if (err.status == 401) {
					if (configData.Authorization == 'External') {
						window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
					} else {
						LogoutService.Logout();
					}
				} else {
					$scope.alerts = [{
							type : 'danger',
							msg : data.error.message
						}
					];
				}
			});

		} else {
			//inputObj = {};

			inputObj = {
				"ServiceCode" : JSON.parse(PSACODE).ServiceCode
			}

			$http({
				url : BASEURL + '/rest/v2/services/read',
				method : "POST",
				data : inputObj,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				//console.log(data)

				$scope.multipleOfferedEntity = getSupportedProducts(data.OfferedByEntity)
					//	alert($scope.multipleOfferedEntity.length)


					$scope.query_Service_forBranch = {
					"Queryfield" : [],
					"start" : 0,
					"count" : 1000
				}

				if ($scope.multipleOfferedEntity.length > 1) {
					for (i = 0; i < $scope.multipleOfferedEntity.length; i++) {
						$scope.query_Service_forBranch.Queryfield.push({
							"ColumnName" : "BranchCode",
							"ColumnOperation" : "=",
							"ColumnValue" : $scope.multipleOfferedEntity[i]
						})
					}
				} else {
					$scope.query_Service_forBranch.Queryfield.push({
						"ColumnName" : "BranchCode",
						"ColumnOperation" : "=",
						"ColumnValue" : $scope.multipleOfferedEntity[0]
					})
				}

				$scope.query_Service_forBranch = constructQuery($scope.query_Service_forBranch);

				//console.log(inputObj);
				$http({
					url : BASEURL + '/rest/v2/branches/readall',
					method : "POST",
					data : $scope.query_Service_forBranch,
					headers : {
						'Content-Type' : 'application/json'
					}
				}).success(function (data, status, headers, config) {
					////console.log(data)
					if (data.length == 1) {
						$scope.PaymentBranch = data[0].BranchCode;
					}
					if (data.length > 0) {
						$scope.branchList = data;
					} else {}
				}).error(function (data, status, headers, config) {
					////console.log(data)
					if (err.status == 401) {
						if (configData.Authorization == 'External') {
							window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
						} else {
							LogoutService.Logout();
						}
					} else {
						$scope.alerts = [{
								type : 'danger',
								msg : data.error.message
							}
						];
					}
				});

			}).error(function (data, status, headers, config) {
				////console.log(data)
				if (err.status == 401) {
					if (configData.Authorization == 'External') {
						window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
					} else {
						LogoutService.Logout();
					}
				} else {
					$scope.alerts = [{
							type : 'danger',
							msg : data.error.message
						}
					];
				}
			});

		}

		/* if (PSACODE = 'OSISRTP_ISOPACS008') {
		$scope.OrderingCustomer.ClientID = '000000007';
		//$scope.BeneficiaryBank.ClearingCode = "000000007";
		$scope.OrderingCustomer.AccountNumber = "00100045679";
		} */

	}

	$scope.getAccountNumberCurrency = function (AccNum) {
		
		$scope.AccNum1 = JSON.parse(AccNum);
		console.log($scope.AccNum1)
		$scope.OrderingCustomer.AccountNumber = $scope.AccNum1.AccountNo;
		$scope.OrderingCustomer_AccountCurrency = getSupportedProducts($scope.AccNum1.AccountCurrency);
		$scope.OrderingCustomer.AccountCurrency = $scope.AccNum1.DefaultCurrency;
		$scope.OrderingCustomer.AccountName = $scope.AccNum1.AccountName;
		//$scope.OrderingCustomer.AccountDomiciledCountry = 'US';
		if ($scope.AccNum1.BranchCode == undefined) {

			$http({
				url : BASEURL + '/rest/v2/countries/readall',
				method : "POST",
				data : {
					"start" : 0,
					"count" : 1000
				},
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				//console.log(data)
				//alert()
				if (data.length > 0) {

					//$scope.OrderingCustomer.ClientID = data[0].SchemeParticipantIdentifer;
					/* $scope.OrderingCustomer.AccountNumber = '02123456789012345';
					$scope.OrderingCustomer.AccountCurrency = 'USD';
					$scope.OrderingCustomer.AccountName = 'TEST RTP Account';
					$scope.OrderingCustomer.AccountDomiciledCountry = 'US'; */

					$scope.AccountDomiciledCountry = data;

				} else {}
				//console.log($scope.OrderingCustomer)
			}).error(function (data, status, headers, config) {
				////console.log(data)
				if (err.status == 401) {
					if (configData.Authorization == 'External') {
						window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
					} else {
						LogoutService.Logout();
					}
				} else {
					$scope.alerts = [{
							type : 'danger',
							msg : data.error.message
						}
					];
				}
			});

		} else {

			inputObj = {
				"filters" : {
					"logicalOperator" : "AND",
					"groupLvl1" : [{
							"logicalOperator" : "AND",
							"groupLvl2" : [{
									"logicalOperator" : "AND",
									"groupLvl3" : [{
											"logicalOperator" : "AND",
											"clauses" : [{
													"columnName" : "BranchCode",
													"operator" : "=",
													"value" : $scope.AccNum1.BranchCode
												}
											]
										}
									]
								}
							]
						}
					]
				},
				"start" : 0,
				"count" : 1000
			}
			//console.log(inputObj);
			$http({
				url : BASEURL + '/rest/v2/branches/readall',
				method : "POST",
				data : inputObj,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				//console.log(data)
				$scope.AccountDomiciledCountry123 = data;
				if (data.length > 0) {
					//$scope.branchList = data;
				} else {
					$http({
						url : BASEURL + '/rest/v2/countries/readall',
						method : "POST",
						data : {
							"start" : 0,
							"count" : 1000
						},
						headers : {
							'Content-Type' : 'application/json'
						}
					}).success(function (data, status, headers, config) {
						//console.log(data)
						//alert()
						if (data.length > 0) {

							//$scope.OrderingCustomer.ClientID = data[0].SchemeParticipantIdentifer;
							/* $scope.OrderingCustomer.AccountNumber = '02123456789012345';
							$scope.OrderingCustomer.AccountCurrency = 'USD';
							$scope.OrderingCustomer.AccountName = 'TEST RTP Account';
							$scope.OrderingCustomer.AccountDomiciledCountry = 'US'; */

							$scope.AccountDomiciledCountry = data;

						} else {}
						//console.log($scope.OrderingCustomer)
					}).error(function (data, status, headers, config) {
						////console.log(data)
						if (err.status == 401) {
							if (configData.Authorization == 'External') {
								window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
							} else {
								LogoutService.Logout();
							}
						} else {
							$scope.alerts = [{
									type : 'danger',
									msg : data.error.message
								}
							];
						}
					});
				}
			}).error(function (data, status, headers, config) {
				//console.log(data)
			});

		}

		$timeout(function () {
			$('select[name=ClientID]').select2()
			$('select[name=AccountNumber]').select2()			
			$scope.OrderingCustomer.AccountCurrency = $scope.AccNum1.DefaultCurrency;
		}, 500)

	}

	$scope.callPicker = function () {
		setTimeout(function () {

			$('.DatePicker').datepicker({
				format : "yyyy-mm-dd",
				showClear : true,
				autoclose : true,
				startDate : new Date()

			})

			$('.input-group-addon').on('click focus', function (e) {
				$(this).prev().focus().click()
			});
		}, 1000)
	}

	$scope.activatePicker = function () {
		//console.log("came")

		var prev = null;
		$('.DatePicker').datepicker({
			format : "yyyy-mm-dd",
			showClear : true,
			startDate : new Date()
		}).on('dp.change', function (ev) {
			//console.log($(ev.currentTarget).val())

			$scope[$(ev.currentTarget).attr('ng-model').split('.')[0]][$(ev.currentTarget).attr('name')] = $(ev.currentTarget).val()

				//console.log($scope.PaymentDetails)

		}).on('dp.show', function (ev) {}).on('dp.hide', function (ev) {});
	}

	$scope.getBankIdentifierCode = function (BankIdentifierType) {

		//console.log(BankIdentifierType)
		//$scope.BeneficiaryBank={}
		$scope.BankIdentifierCode123 = '';
		if ((BankIdentifierType != '') && (BankIdentifierType != undefined)) {
			inputObj = {
				"filters" : {
					"logicalOperator" : "AND",
					"groupLvl1" : [{
							"logicalOperator" : "AND",
							"groupLvl2" : [{
									"logicalOperator" : "AND",
									"groupLvl3" : [{
											"logicalOperator" : "AND",
											"clauses" : [{
													"columnName" : "SchemeCode",
													"operator" : "=",
													"value" : BankIdentifierType
												}
											]
										}
									]
								}
							]
						}
					]
				},
				"start" : 0,
				"count" : 1000
			}

			//console.log(inputObj);
			$http({
				url : BASEURL + '/rest/v2/memberships/readall',
				method : "POST",
				data : inputObj,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				//console.log(data)
				if ($scope.Templateloading != true) {
					$scope.Beneficiary = {}
				}
				$scope.BankIdentifierCode123 = data;

				if (data.length > 0) {
					//$scope.branchList = data;
				} else {}

			}).error(function (data, status, headers, config) {
				//console.log(data)
			});
		} else {

			$http({
				url : BASEURL + '/rest/v2/accounts/readall',
				method : "POST",
				data : {
					"start" : 0,
					"count" : 1000
				},
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				$scope.AccountNumberDrop = data;
			}).error(function (data, status, headers, config) {});
		}

	}

	$scope.getBankIdentifierCode1 = function (BankIdentifierType) {
		//console.log(BankIdentifierType)
		$scope.BankIdentifierCode1234 = {};
		if ((BankIdentifierType != '') && (BankIdentifierType != undefined)) {

			inputObj = {
				"filters" : {
					"logicalOperator" : "AND",
					"groupLvl1" : [{
							"logicalOperator" : "AND",
							"groupLvl2" : [{
									"logicalOperator" : "AND",
									"groupLvl3" : [{
											"logicalOperator" : "AND",
											"clauses" : [{
													"columnName" : "SchemeCode",
													"operator" : "=",
													"value" : BankIdentifierType
												}
											]
										}
									]
								}
							]
						}
					]
				},
				"start" : 0,
				"count" : 1000
			}

			//console.log(inputObj);
			$http({
				url : BASEURL + '/rest/v2/memberships/readall',
				method : "POST",
				data : inputObj,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				//console.log(data)
				$scope.BankIdentifierCode1234 = data;
				if (data.length > 0) {
					//$scope.branchList = data;
				} else {}
				$timeout(function () {
					$('select[name=BankIdentifierType]').select2()
					$('select[name=BIC]').select2()
				}, 1500)
			}).error(function (data, status, headers, config) {
				//console.log(data)
			});

		} else {}

	}

	$scope.getAccountDetails = function (AccObj) {
		//console.log(AccObj)
		$http({
			url : BASEURL + '/rest/v2/parties/read',
			method : "POST",
			data : {
				"PartyCode" : JSON.parse(AccObj).PartyCode
			},
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			//console.log(data)
			$scope.Beneficiary.Name = data.PartyName;

		}).error(function (data, status, headers, config) {
			//console.log(data)
		});
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
		//console.log(str)
		return str;
	}

	function addNewlines(str) {

		var result = '';
		while (str.length > 0) {
			result += str.substring(0, 35) + '\\n';
			str = str.substring(35);
		}
		//console.log(JSON.stringify(result))
		return JSON.stringify(result);
	}

	$scope.templateOverride = false;
	$scope.checkTemplateName = function (checkTemplateName) {		
		if ($scope.templateName === checkTemplateName) {
			$scope.templateOverride = true;
		}
	}

	$scope.createData = function (PaymentDetails, OrderingCustomer, BeneficiaryBank, Beneficiary, RemittanceInformation, psaCode, option1, party, service, IntermediaryBankDetails, OrderingCustomerAccountNumber, ProductsSupported123, SaveTemplate, TemplateDetails, psaCode11) {

		$scope.activatePicker()
		//alert(typeof(service))
		////console.log("D1" + JSON.stringify(data1))
		////console.log("OrderingCustomer" + JSON.stringify(OrderingCustomer))
		////console.log("D2" + JSON.stringify(data2))
		////console.log("D3" + JSON.stringify(data3))

		/* var sss=Object.assign(data1, data2, data3);
		//console.log(JSON.stringify(sss)) */
		if (typeof($scope.PSAvalue) == 'string') {
			$scope.PSAvalue = JSON.parse($scope.PSAvalue)
		} else {
			$scope.PSAvalue = $scope.PSAvalue;
		}

		//	alert("asdsadsad")
		//	alert(psaCode11)

		console.log(psaCode11)
		console.log(TemplateDetails)

		console.log(PaymentDetails)
		console.log(OrderingCustomer)
		console.log(BeneficiaryBank)
		console.log(Beneficiary)
		console.log(RemittanceInformation)
		console.log(psaCode)
		console.log(option1)
		console.log(party)
		console.log(service)
		console.log(IntermediaryBankDetails)
		console.log(OrderingCustomerAccountNumber)
		/*console.log(typeof BeneficiaryBank)
		console.log(typeof Beneficiary)
		console.log(typeof Beneficiary.AccountNumber) */
		//console.log(typeof JSON.parse(Beneficiary.AccountNumber))
		//console.log($.isEmptyObject(BeneficiaryBank));
		if ($.isEmptyObject(BeneficiaryBank)) {
			Beneficiary.AccountNumber = JSON.parse(Beneficiary.AccountNumber).AccountNo;
		}
		//

		var finalObj = {};
		finalObj.Party = JSON.parse(party).PartyCode;

		if ($scope.serviceCodeFromTemplate == true) {
			finalObj.Service = JSON.parse(service).ServiceCode;
		} else {
			finalObj.Service = service;
		}
		finalObj.PartyServiceAssociationCode = $scope.PSAvalue.PartyServiceAssociationCode;
		finalObj.BranchCode = option1;
		finalObj.ProductsSupported = ProductsSupported123;
		finalObj.PaymentDetails = PaymentDetails;
		finalObj.OrderingCustomer = OrderingCustomer;

		if ($scope.OrderingCustomerAccountNumber_length == 0) {
			finalObj.OrderingCustomer.AccountNumber = OrderingCustomerAccountNumber;
		} else if ($scope.OrderingCustomerAccountNumber_length == 1) {
			finalObj.OrderingCustomer.AccountNumber = JSON.parse(OrderingCustomerAccountNumber).AccountNo;
		} else {
			//alert("asdsadas")
			//finalObj.OrderingCustomer.AccountNumber =OrderingCustomerAccountNumber.AccountNo;
		}
		if (Object.keys(BeneficiaryBank).length != 0) {
			finalObj.BeneficiaryBank = BeneficiaryBank;
		}
		finalObj.Beneficiary = Beneficiary;
		//finalObj.RemittanceInformation = addNewlines(RemittanceInformation.RemittanceInformation);
		finalObj.RemittanceInformation = RemittanceInformation;
		if(!($.isEmptyObject(IntermediaryBankDetails))) {
			finalObj.IntermediaryBankDetails = IntermediaryBankDetails;
		}
		PSA = $scope.PSAvalue.PartyServiceAssociationCode;
		console.log(finalObj);
		console.log(JSON.stringify(finalObj));

		TemplateDetails.Template = stringToHex(JSON.stringify(finalObj))
			TemplateDetails.Creator = sessionStorage.UserID;
		if ((TemplateDetails.RolesAccessible == "") || (TemplateDetails.RolesAccessible == undefined)) {
			delete TemplateDetails.RolesAccessible;
		}

		////console.log(psaCode);
		/* //console.log(option1);
		//console.log(option2); */
		////console.log(BASEURL +'/rest/v2/payments/initiation/'+psaCode.PSA);

		$http({
			url : BASEURL + '/rest/v2/payments/initiation/' + PSA,
			method : "POST",
			data : finalObj,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			$location.path('app/allpayments');
		}).error(function (data, status, headers, config) {
			////console.log(data)
			$scope.alerts = [{
					type : 'danger',
					msg : data.error.message
				}
			];
		});

		if (SaveTemplate == true) {

			if ($scope.templateName === TemplateDetails.TemplateName) {
				$scope.method = "PUT";
			} else {
				delete TemplateDetails.MPITemplate_PK;
				$scope.method = "POST";
			}
			$http({
				url : BASEURL + '/rest/v2/manualpaymentinitiationtemplate',
				method : $scope.method,
				data : TemplateDetails,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				$location.path('app/allpayments');
			}).error(function (data, status, headers, config) {
				////console.log(data)
				$scope.alerts = [{
						type : 'danger',
						msg : data.error.message
					}
				];
			});
		}
	}

	$scope.loadTemplateData = function (templatedata) {

		$scope.templateName = JSON.parse(templatedata).TemplateName;
		$scope.MPITemplate_PK = JSON.parse(templatedata).MPITemplate_PK;

		$scope.Templateloading = true;
		//console.log(templatedata)
		$scope.isOrderingCustomerCollapsed = false;
		$scope.isBenenficiaryBankDetailsCollapsed = false;
		//$scope.isBenenficiaryDetailsCollapsed = false;
		$scope.isPaymentInfoCollapsed = false;
		$scope.isRemittanceInformationCollapsed = false;
		//console.log($filter('hex2a')(JSON.parse(templatedata).Template))
		$scope.TemplateData = JSON.parse($filter('hex2a')(JSON.parse(templatedata).Template));
		console.log($scope.TemplateData)
		$scope.OrderingCustomer = $scope.TemplateData.OrderingCustomer;
		//alert($scope.TemplateData.Party)
		$scope.party = $scope.TemplateData.Party;
		$scope.ProductsSupported123 = $scope.TemplateData.ProductsSupported;

		delete $scope.TemplateData.PaymentDetails.Amount;
		delete $scope.TemplateData.PaymentDetails.ValueDate;
		$scope.PaymentDetails = $scope.TemplateData.PaymentDetails;
		//console.log($scope.TemplateData.Beneficiary)
		$scope.psaCode11 = $scope.TemplateData.PartyServiceAssociationCode;
		$scope.Beneficiary.AccountNumber = $scope.TemplateData.Beneficiary.AccountNumber;

		$scope.Beneficiary.Name = $scope.TemplateData.Beneficiary.Name;
		$scope.Beneficiary.BankAddressLine1 = $scope.TemplateData.Beneficiary.BankAddressLine1;
		$scope.Beneficiary.BankAddressLine2 = $scope.TemplateData.Beneficiary.BankAddressLine2;
		$scope.Beneficiary.City = $scope.TemplateData.Beneficiary.City;
		$scope.Beneficiary.State = $scope.TemplateData.Beneficiary.State;
		$scope.Beneficiary.Country = $scope.TemplateData.Beneficiary.Country;
		$scope.Beneficiary.PostCode = $scope.TemplateData.Beneficiary.PostCode;
		//console.log($scope.Beneficiary.AccountNumber)
		$scope.BeneficiaryBank = $scope.TemplateData.BeneficiaryBank;
		$scope.PaymentInformation = $scope.TemplateData.PaymentInformation;
		$scope.RemittanceInformation.RemittanceInformation = $scope.TemplateData.RemittanceInformation.RemittanceInformation;
		//$scope.RemitInfoMaxLength=$scope.RemitInfoMaxLength-$scope.RemittanceInformation.RemittanceInformation.length;
		//console.log($scope.TemplateData.PaymentDetails.MessageType)

		//console.log($scope.PaymentDetails)
		$http({
			url : BASEURL + '/rest/v2/parties/read',
			method : "POST",
			data : {
				"PartyCode" : $scope.party
			},
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			console.log(data)
			$scope.psaCode11 = JSON.stringify(data);
			$scope.getServiceList(JSON.stringify(data))
			$scope.getPaymentTypeDetails(JSON.stringify(data), $scope.TemplateData.Service)
			$scope.PaymentDetails.MessageType = $scope.TemplateData.PaymentDetails.MessageType;
			$scope.PaymentDetails.DebtorCustomerProprietaryCode = $scope.TemplateData.PaymentDetails.DebtorCustomerProprietaryCode;
			if ($scope.TemplateData.BeneficiaryBank.BankIdentifierType != undefined) {
				$scope.BeneficiaryBank.BankIdentifierType = $scope.TemplateData.BeneficiaryBank.BankIdentifierType
					$scope.getBankIdentifierCode($scope.TemplateData.BeneficiaryBank.BankIdentifierType);
				$scope.BeneficiaryBank.BankIdentifierCode = $scope.TemplateData.BeneficiaryBank.BankIdentifierCode;
			}
			$scope.IntermediaryBankDetails = $scope.TemplateData.IntermediaryBankDetails;
			$scope.getBankIdentifierCode1($scope.TemplateData.IntermediaryBankDetails.BankIdentifierType);

		}).error(function (data, status, headers, config) {
			//console.log(data)
		});

	}

});

VolpayApp.factory('getMethodService', function ($http) {
	var getMethodService = {
		fetchData : function (url) {
			// $http returns a promise, which has a then function, which also returns a promise
			var promise = $http.get(url).then(function (response) {
					// The then function here is an opportunity to modify the response
					console.log(response);
					// The return value gets picked up by the then in the controller.
					return response.data;
				});
			// Return the promise to the controller
			return promise;
		}
	};
	return getMethodService;
});