VolpayApp.controller('dashboardController', function ($scope, $http, $filter, $timeout, $state,$translate, $location, $window, PersonService1, AllPaymentsGlobalData, GlobalService, LogoutService, DashboardService) {

	if(configData.Authorization=="Internal"){
		$scope.aa = {
			"Queryfield" : [{
					"ColumnName" : "UserID",
					"ColumnOperation" : "=",
					"ColumnValue" : sessionStorage.UserID
				}
			],
			"Operator" : "AND"
		}
		$scope.aa = constructQuery($scope.aa);
		
		$http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).success(function (data) {
			
			userData = JSON.parse($filter('hex2a')(data[0].ProfileData))
			sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;
		}).error(function (data) {
			userData = uProfileData;
		})
	}
	clearInterval(menuInterval)
	

	/*var interval = "";
	clearInterval(interval)
	interval = setInterval(function () {
			if (!$('#PaymentModule').hasClass('open')) {
				sidebarMenuControl('PaymentModule', 'PaymentsDashboard')
			} else {
				clearInterval(interval)
			}
		}, 100)*/
		
		
		sessionStorage.menuSelection = JSON.stringify({'val':'PaymentModule','subVal': 'PaymentsDashboard'})
		checkMenuOpen()



		$scope.checkstatusBarVal = function () {
		$scope.statusBarVal = [{
				"Status" : "REPAIR",
				"NavStatus" : "REPAIR",
				"Icon" : "fa fa-wrench",
				"Color" : "linear-gradient(to right, rgb(243, 111, 111), rgb(228, 11, 11) 60%, #b71c1c 100%)",
				"Visibility" : "",
				"searchArr":["REPAIR"],
				"Count" : 0
			}, {
				"Status" : "FOR APPROVAL",
				"NavStatus" : "WAITFORAPPROVAL",
				"Icon" : "fa fa-thumbs-o-up",
				"Color" : "linear-gradient(to right, rgb(130, 199, 83), rgb(79, 154, 29) 60%, #558b2f 100%)",
				"Visibility" : "",
				"searchArr":["WAITFORAPPROVAL"],
				"Count" : 0
			}, {
				"Status" : "FOR BULKING",
				"NavStatus" : "FOR_BULKING",
				"Icon" : "fa fa-stack-overflow",
				"Color" : "linear-gradient(to right, rgb(108, 135, 142), rgb(55, 79, 89) 60%, rgb(8, 45, 64) 100%)",
				"Visibility" : "",
				"searchArr":["FOR_BULKING"],
				"Count" : 0
			}, {
				"Status" : "WAREHOUSED",
				"NavStatus" : "WAREHOUSED",
				"Icon" : "fa fa-home",
				"Color" : "linear-gradient(to right, rgb(186, 186, 195), rgb(117, 117, 117) 60%,#666666 100%)",
				"Visibility" : "",
				"searchArr":["WAREHOUSED"],
				"Count" : 0
			}, {
				"Status" : "WAITING",
				"NavStatus" : "WAITING",
				"Icon" : "fa fa-hourglass-half",
				"Color" : "linear-gradient(to right, rgb(119, 194, 232), rgb(40, 148, 204) 60%, #0288d1 100%)",
				"searchArr":["WAITING"],
				"Visibility" : "",
				"Count" : 0
			}, {
				"Status" : "HOLD",
				"NavStatus" : "HOLD",
				"Icon" : "fa fa-hand-paper-o",
				"Color" : "linear-gradient(to right, rgb(239, 171, 119), rgb(249, 113, 8) 60%, #ff6f00 100%)",
				"searchArr":["HOLD"],
				"Visibility" : "",
				"Count" : 0
			}
		]

		//setTimeout(function () {
		for (var i in userData.DboardPreferences.paymentDashboard.statusSummary) {
			for (var j in $scope.statusBarVal) {
				if (userData.DboardPreferences.paymentDashboard.statusSummary[i].name == $scope.statusBarVal[j].NavStatus) {
					$scope.statusBarVal[j].Visibility = userData.DboardPreferences.paymentDashboard.statusSummary[i].visibility;
				}
			}
		}

		for (var i in userData.DboardPreferences.paymentDashboard.statusSummary) {

			if (userData.DboardPreferences.paymentDashboard.statusSummary[i].visibility) {
				$scope.count = userData.DboardPreferences.paymentDashboard.statusSummary.filter(function (x) {
						return x.visibility;
					}).length;

			}

		}

		// }, 100)
	}

	$scope.checkstatusBarVal()

	$scope.staus = $scope.statusBarVal.length;

	$scope.uSetting = {};
	//setTimeout(function () {
	for (var i in userData.DboardPreferences.paymentDashboard.widget) {
		$scope.uSetting[userData.DboardPreferences.paymentDashboard.widget[i].name] = userData.DboardPreferences.paymentDashboard.widget[i].visibility

	}
	

	//}, 100);

	setTimeout(function () {
		enableDisableChart()
	}, 100)

	function enableDisableChart() {
		if (!$scope.uSetting.CurDis) // If CurDuis hidden
		{
			setTimeout(function () {

				$('#MOPDist').removeAttr('class').addClass('col-md-8 droppable');
				$('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
			}, 100)
		}
		if ((!$scope.uSetting.InbndPayment) && (!$scope.uSetting.CurDis)) // If CurDuis hidden & InbndPayment hidden
		{
			setTimeout(function () {

				$('#MOPDist').removeAttr('class').addClass('col-md-6 droppable');
				$('#paymentStatusDist').removeAttr('class').addClass('col-md-6 droppable');
			}, 100)
		}
		if ((!$scope.uSetting.CurDis) && (!$scope.uSetting.Mop)) // If CurDuis hidden & MOP hidden
		{

			setTimeout(function () {

				$('#paymentStatusDist').removeAttr('class').addClass('col-md-8 droppable');
			}, 150)
		}
		if ((!$scope.uSetting.CurDis) && (!$scope.uSetting.Mop) && (!$scope.uSetting.InbndPayment)) // If CurDuis & Inbound & MOP hidden
		{
			setTimeout(function () {

				$('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
			}, 150)

		}
		if ((!$scope.uSetting.CurDis) && (!$scope.uSetting.Status) && (!$scope.uSetting.InbndPayment)) // If CurDuis & Inbound & status hidden
		{
			setTimeout(function () {

				$('#MOPDist').removeAttr('class').addClass('col-md-12 droppable');
			}, 150)

		}
		if (!$scope.uSetting.InbndPayment) // If inboundPayment hidden
		{
			setTimeout(function () {

				$('#pymtCurDisChart').removeAttr('class').addClass('col-md-12 droppable');
			}, 100)
		}
		if (!$scope.uSetting.Mop) // If MOP hidden
		{
			setTimeout(function () {

				$('#paymentStatusDist').removeAttr('class').addClass('col-md-12 droppable');
			}, 100)
		}
	}

	function outputForSankey(data, name) {
		var curDisTot = 0,
		curDisAmt = 0;
		for (var i in data) {
			curDisTot = curDisTot + data[i].Count;
			curDisAmt = curDisAmt + data[i].Amount;
		}

		if (name == 'curDis') {
			data.push({
				'Name' : 'Total',
				'Currency' : '',
				'Count' : curDisTot,
				'Amount' : curDisAmt
			})
			$scope.curDisData = data;
		} else if (name == 'srcChannel') {
			data.push({
				'Name' : 'Total',
				'Currency' : '',
				'Count' : curDisTot,
				'Amount' : curDisAmt
			})
			$scope.srcChannelData = data;
		} else if (name == 'mop') {
			data.push({
				'Name' : 'Total',
				'Currency' : '',
				'Count' : curDisTot,
				'Amount' : curDisAmt
			})
			$scope.mopData = data;
		} else if (name == 'status') {
			data.push({
				'Name' : 'Total',
				'Currency' : '',
				'Count' : curDisTot,
				'Amount' : curDisAmt
			})
			$scope.payStatData = data;
		}
	}

	$scope.accessToken = true;

	$scope.initialCall = function () {

		
		$scope.checkstatusBarVal()

		var restdata = {};
		var testdata = {};
		$scope.testdata = {};
		var testdata1 = {};
		$scope.testdata1 = {};
		var PSData = [];
		$scope.PSData = [];
		$scope.data1 = {};

		$('.donutChartSelected').css('display', 'none')
		$('.pieChartSelected').css('display', 'none')
		$('.sankeyChartSelected').css('display', 'none')
		$('.legendHolder').css('display', 'none')
		$scope.loadedTrue = true;

		$scope.dashboardData = function (obj) {
			$http({
				url : BASEURL + RESTCALL.paymentDashboard,
				method : "POST",
				data : obj,
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {
				/* $timeout(function(){
				$scope.Restloaded = true;
				},300)*/

				restdata = data;
				var sankeyData = angular.copy(data);
				var prevIndex = -1;
				var prevObj = -1;
				var preClicked = -1;
				var clickCnt = 0;

				function returnModifyData(id) {
					if (id == 'InboundModal') {
						dummytestData = $scope.inData;
						parentId = 'resizeWindow';
					} else if (id == 'test2') {
						dummytestData = angular.copy(testdata1)
							parentId = 'inbndChart';
					} else if (id == 'CurDis') {
						dummytestData = angular.copy(restdata.PaymentStatus)
							parentId = 'pymtCurDisChart';
					} else if (id == 'MopBar') {
						dummytestData = angular.copy(restdata.MOP)
							parentId = 'MOPDist';
					} else if (id == 'sankeyChart') {
						dummytestData = angular.copy(restdata.PaymentStatus)
							parentId = 'paymentStatusDist';
					}

					var retObj = {};
					retObj.dummytestData = dummytestData;
					retObj.parentId = parentId

						return retObj;

				}

				$scope.CustomDataModifyforPie = function (evt, index, CustDumData, id) {
					
						//console.log(evt,index,CustDumData,id)

					var parentId;
					var dummytestData;

					var Mdata = returnModifyData(id);
					dummytestData = Mdata.dummytestData;
					parentId = Mdata.parentId;

					var aaText = $(evt.currentTarget).find('.channelName').text()
						var className = $(evt.currentTarget).attr('class').split(' ')[1]
						var legDiv = $(evt.currentTarget).find('span div');
					var legnedDivColors = $('.legDivs');

					aaText = $filter('addunderscore')(aaText)

						var showEach = "All";
					$('#' + parentId).find('.' + className).css({
						'opacity' : 0.4,
						'font-weight' : 'normal'
					})
					$('#' + parentId).find('#' + className + '_' + index).css({
						'opacity' : 1,
						'font-weight' : 'bold'
					})

					var DataIndex = [];
					if (prevIndex != index) {
						for (var i = 0; i < dummytestData.length; i++) {
							if (aaText == dummytestData[i].Name) {
								DataIndex.push({
									'Name' : dummytestData[i].Name,
									'Amount' : dummytestData[i].Amount,
									'Count' : dummytestData[i].Count,
									'Currency' : dummytestData[i].Currency
								})
							}
						}
						if (prevObj != -1) {
							var backupLeg = $('#' + parentId).find('#' + className + '_' + prevIndex).find('span div')
								for (var i = 0; i < prevObj.length; i++) {
									$(backupLeg[i]).css({
										'background-color' : prevObj[i].color
									})
								}
						}
						for (var i = 0; i < DataIndex.length; i++) {
							$(legDiv[i]).css({
								'background-color' : myColors[i]
							})
						}
						prevIndex = index;
						prevObj = CustDumData.Currency;
						preClicked = $(evt.currentTarget)
							showEach = DataIndex[0].Name;
					} else {
						showEach = "All"
							$('.' + className).css({
								'opacity' : 1,
								'font-weight' : 'normal'
							})
							prevObj = -1;
						prevIndex = -1;
						preClicked = -1;
						DataIndex = dummytestData;
						if (id == 'test2') {
							$scope.dumObj = srcChannelLegenColorGen(DataIndex);
						} else if (id == 'CurDis') {

							$scope.dumObjCurDist = srcChannelLegenColorGen(DataIndex);
						} else if (id == 'MopBar') {
							$scope.dumObjMOP = srcChannelLegenColorGen(DataIndex);
						} else if (id == 'sankeyChart') {
							$scope.dumObjStatus = srcChannelLegenColorGen(DataIndex);
							console.log($scope.dumObjStatus)
						}
					}

					if (id != 'InboundModal') {
						//inbndCntAmt = $('#dropVal_' + id).html();
						var btnVal = $('#' + parentId).find('.custDropDown').find('.btn').find('span:first-child').text()
					} else {
						var btnVal = $('#' + parentId).find('.custDropDownInsideModal').find('.btn').find('span:first-child').text()

						
					}

					//console.log(btnVal)

					inbndCntAmt = $('#dropVal_' + id).html();
					
					console.log(DataIndex,inbndCntAmt,id)

					chartFunctions.PieChart({
						'data' : DataIndex,
						'flag' : false,
						'filter' : $filter,
						'location' : $location,
						'globalData' : AllPaymentsGlobalData,
						'selectVal' : inbndCntAmt,
						'id' : id
					})

					d3.select('#' + parentId).select('#' + id).selectAll('text').each(function () {
						if ($(this).attr('class') == 'middle') {
							d3.select(this).each(function () {
								$(this).text('')
								$(this).html('')
							})
						}
					})

					// commonFunctions.textForPie(donutData, DataIndex, showEach, id, $filter, $location)
					// commonFunctions.textForPie({'dd':cntAmt, 'index':DataIndex, 'sw':showEach, 'Id':id, 'filter':$filter, 'location':$location})

					// commonFunctions.textForPie({'donutData':"Count", 'data':CustDumData, 'all':"All", 'id':id, 'filter':$filter, 'location':$location})
				}

				var prevIndex = -1;
				var prevObj = -1;
				var preClicked = -1;
				$scope.CustomDataModify = function (evt, index, CustDumData, id) {
					console.log(evt, index, CustDumData, id)
					var parentId;
					var Mdata = returnModifyData(id);
					dummytestData = Mdata.dummytestData;
					parentId = Mdata.parentId;

					var aaText = $(evt.currentTarget).find('.channelName').text()
						var className = $(evt.currentTarget).attr('class').split(' ')[1]
						var legDiv = $(evt.currentTarget).find('span div');
					aaText = $filter('addunderscore')(aaText)

				//	console.log(evt,index,CustDumData,id)
						var showEach = "All";
					$('#' + parentId).find('.' + className).css({
						'opacity' : 0.4,
						'font-weight' : 'normal'
					})
					$('#' + parentId).find('#' + className + '_' + index).css({
						'opacity' : 1,
						'font-weight' : 'bold'
					})

					var DataIndex = [];
					if (prevIndex != index) {
						
						for (var i = 0; i < dummytestData.length; i++) {
							if (aaText == dummytestData[i].Name) {
								DataIndex.push({
									'Name' : dummytestData[i].Name,
									'Amount' : dummytestData[i].Amount,
									'Count' : dummytestData[i].Count,
									'Currency' : dummytestData[i].Currency
								})
							}
						}
						if (prevObj != -1) {
							var backupLeg = $('#' + parentId).find('#' + className + '_' + prevIndex).find('span div')
							console.log(backupLeg)
								for (var i = 0; i < prevObj.length; i++) {
									$(backupLeg[i]).css({
										'background-color' : prevObj[i].color
									})
								}
						}
						for (var i = 0; i < DataIndex.length; i++) {
							$(legDiv[i]).css({
								'background-color' : myColors[i]
							})
						}
						prevIndex = index;
						prevObj = CustDumData.Currency;
						preClicked = $(evt.currentTarget)
							showEach = DataIndex[0].Name;
					} else {
						
						showEach = "All"
							$('.' + className).css({
								'opacity' : 1,
								'font-weight' : 'normal'
							})
							prevObj = -1;
						prevIndex = -1;
						preClicked = -1;
						DataIndex = dummytestData;
						
						if (id == 'test2') {
							$scope.dumObj = srcChannelLegenColorGen(DataIndex);
						} else if (id == 'CurDis') {
							$scope.dumObjCurDist = srcChannelLegenColorGen(DataIndex);
						} else if (id == 'MopBar') {
							$scope.dumObjMOP = srcChannelLegenColorGen(DataIndex);
								console.log("aa",$scope.dumObjMOP )
						} else if (id == 'sankeyChart') {
							$scope.dumObjStatus = srcChannelLegenColorGen(DataIndex);
						}
					}
					if (id != 'InboundModal') {
					
						var btnVal = $('#' + parentId).find('.custDropDown').find('.btn').find('span:first-child').text()
					} else {
						var btnVal = $('#' + parentId).find('.custDropDownInsideModal').find('.btn').find('span:first-child').text()
					}
				inbndCntAmt = $('#dropVal_' + id).html();
					console.log(DataIndex,inbndCntAmt,id)
					chartFunctions.DonutChart({
						'data' : DataIndex,
						'flag' : false,
						'filter' : $filter,
						'location' : $location,
						'globalData' : AllPaymentsGlobalData,
						'selectVal' : inbndCntAmt,
						'id' : id
					})

				}

				$('.custDropDown').find('button').find('span:first-child').html('Count');
				$('.custDropDown').find('ul').find('li').removeClass('listSelected').removeClass('listNotSelected')
				$('.custDropDown').find('ul').find('li:first-child').addClass('listSelected').removeClass('listNotSelected')

				var inbndCntAmt = 'Count';

				var cahrtFunctnly = {

					pie : function (arg1) {

						console.log("pie",arg1)
						setChartProp.pie(arg1)
						arg1.data = restdata[arg1.basedOn];
						arg1.flag = false;
						arg1.filter = $filter;
						arg1.location = $location;
						arg1.globalData = AllPaymentsGlobalData;
						arg1.selectVal = inbndCntAmt;

						chartFunctions.PieChart(arg1)
					},
					donut : function (arg1) {
						// console.log("cntAmt",inbndCntAmt)
						console.log("donut",arg1)
						setChartProp.donut(arg1)
						arg1.data = restdata[arg1.basedOn];
						arg1.flag = false;
						arg1.filter = $filter;
						arg1.location = $location;
						arg1.globalData = AllPaymentsGlobalData;
						arg1.selectVal = inbndCntAmt;

						chartFunctions.DonutChart(arg1)
					},
					horizontal : function (arg1) {

						setChartProp.horizontalVertical(arg1)

						arg1.flag = false;
						arg1.filter = $filter;
						arg1.location = $location;
						arg1.globalData = AllPaymentsGlobalData;
						arg1.selectVal = inbndCntAmt;

						var HorizData = commonFunctions.formatingData(restdata[arg1.basedOn])
							arg1.data = HorizData;
						chartFunctions.HorizontalMultibarChart(arg1)
					},
					vertical : function (arg1) {
						setChartProp.horizontalVertical(arg1)

						arg1.flag = false;
						arg1.filter = $filter;
						arg1.location = $location;
						arg1.selectVal = inbndCntAmt;
						arg1.globalData = AllPaymentsGlobalData;
						var vertData = commonFunctions.formatingData(restdata[arg1.basedOn]);
						arg1.data = vertData;
						vertData.sort(compare);
						chartFunctions.VerticalMultibarChart(arg1)
					},
					sankey : function (arg1) {

						arg1.selectVal = inbndCntAmt;
						arg1.flag = false;
						arg1.filter = $filter;
						arg1.location = $location;
						arg1.globalData = AllPaymentsGlobalData;
						var graph = jsonToSankeyData(restdata, arg1.basedOn, arg1.selectVal, 'totalTrue')
							arg1.data = graph;

						setChartProp.sankey({
							'id' : arg1.id,
							'parentId' : arg1.parentId
						})
						chartFunctions.SankeyChart(arg1)

					},
					verticalsankey : function (arg1) {

						arg1.selectVal = inbndCntAmt;
						arg1.flag = false;
						arg1.filter = $filter;
						arg1.location = $location;
						arg1.globalData = AllPaymentsGlobalData;
						var energy = CurrencySankey(restdata, arg1.basedOn, arg1.selectVal, 'totalFalse');

						arg1.data = energy;

						setChartProp.sankey(arg1)
						chartFunctions.verticalSankeyChart(arg1)

					}
				}

				$scope.statusFlag = {
					'CurDis' : 'false',
					'test2' : 'false',
					'MopBar' : 'false',
					'sankeyChart' : 'false'
				}

				//this condition works when the data is not present
				if (Object.keys(restdata).length == 0) {

					//this condition works when the data is empty
					$scope.schannel = 0;
					$scope.mop = 0;
					$scope.paymentstatus = 0;
					$scope.noCurrenciesFound = true;

					$scope.checkstatusBarVal()

					PersonService1.GetChart1().then(function (items) {

						restdata = items.data;

						sankeyData = items.data;

						$scope.dumObj = srcChannelLegenColorGen(restdata.SourceChannel)
							$scope.dumObjCurDist = srcChannelLegenColorGen(restdata.PaymentStatus)
							$scope.dumObjMOP = srcChannelLegenColorGen(restdata.MOP.sort(compareWithName))

							testdata1 = items.data.SourceChannel;
						$scope.testdata1 = items.data.SourceChannel;
						testdata = items.data.MOP;
						$scope.testdata = items.data.MOP;
						$scope.totInboundAmt = 0;
						$scope.totCount = 0;

						$scope.PSData = items.data.PaymentStatus;
						var noPaymentsankey = angular.copy(items.data)
							$scope.donutColor = myColors;
						d3.scale.myColors = function () {
							return d3.scale.ordinal().range(myColors);
						};
						var statusArr = [];
						var unqStatusArr = [];
						$scope.overallStatus = [];
						for (var i = 0; i < items.data.PaymentStatus.length; i++) {
							statusArr.push(items.data.PaymentStatus[i].Name)
						}

						for (var i = 0; i < statusArr.length; i++) {
							if (unqStatusArr.indexOf(statusArr[i]) == -1) {
								unqStatusArr.push(statusArr[i]);
							}
						}

						for (var i = 0; i < unqStatusArr.length; i++) {
							var cnt = 0;
							var Amt = 0;
							for (var j = 0; j < items.data.PaymentStatus.length; j++) {
								if (unqStatusArr[i] == items.data.PaymentStatus[j].Name) {
									cnt = cnt + items.data.PaymentStatus[j].Count;
									Amt = Amt + items.data.PaymentStatus[j].Amount;
								}
							}
							$scope.overallStatus.push({
								'Name' : unqStatusArr[i],
								'Count' : cnt,
								"Amount" : Amt
							})
						}

						$scope.valObj = {
							"CurDis" : srcChannelLegenColorGen(restdata['PaymentStatus']),
							"test2" : srcChannelLegenColorGen(restdata['SourceChannel']),
							"MopBar" : srcChannelLegenColorGen(restdata['MOP']),
							"sankeyChart" : srcChannelLegenColorGen(restdata['PaymentStatus'])

						}

						for (var i in userData.defaultChartTypes.paymentDashoard) {
							cahrtFunctnly[userData.defaultChartTypes.paymentDashoard[i].chartType](userData.defaultChartTypes.paymentDashoard[i])
							$scope.statusFlag[userData.defaultChartTypes.paymentDashoard[i].id] = userData.defaultChartTypes.paymentDashoard[i].flag;

						}

						outputForSankey(angular.copy(restdata.PaymentStatus), 'curDis')
						outputForSankey(angular.copy(restdata.SourceChannel), 'srcChannel')
						outputForSankey(angular.copy(restdata.MOP), 'mop')
						outputForSankey(angular.copy(restdata.PaymentStatus), 'status')

						$scope.click = function (val, id, parentId) {
							prevIndex = -1;
							prevObj = -1;
							preClicked = -1;
							inbndCntAmt = val;
							$('#' + parentId).find('.channelLegend').css({
								'opacity' : 1,
								'font-weight' : 'normal'
							})
							$('#' + parentId).find('.channelLegendAmt').css({
								'opacity' : 1,
								'font-weight' : 'normal'
							})

							for (var i in userData.defaultChartTypes.paymentDashoard) {

								if (id == userData.defaultChartTypes.paymentDashoard[i].id) {
									//  console.log(id, userData.defaultChartTypes.paymentDashoard[i].id)

									cahrtFunctnly[userData.defaultChartTypes.paymentDashoard[i].chartType](userData.defaultChartTypes.paymentDashoard[i]);

									if (val == 'Count') {
										$scope.statusFlag[id] = false;
									} else if (val == 'Amount') {
										$scope.statusFlag[id] = true;
									}

								}

							}

							if (val == 'Count') {
								if (id == 'InboundModal') {
									$scope.clickedModal = false;
								} else { //$scope.clicked = false;
									$scope.curDistClicked = false;
								}
							} else if (val == 'Amount') {
								if (id == 'InboundModal') {
									$scope.clickedModal = true;
								} else { //$scope.clicked = true;
									$scope.curDistClicked = true;
								}
							}
						}

						/*** For Inbound Payment New Legend Starts***/
						// $scope.dumObj = srcChannelLegenColorGen(items.data.SourceChannel)
						// console.log($scope.dumObj)
						// $scope.pieChartSelected = true;
						// setChartProp.pie('test2', 'inbndChart')
						// chartFunctions.PieChart('Count', 'test2', testdata1, false, $filter, AllPaymentsGlobalData, $location)

						// $scope.click = function (val, id, parentId) {
						//     if (val == 'Count') {
						//         $scope.clicked = false;
						//     } else {
						//         $scope.clicked = true;
						//     }
						//     chartFunctions.PieChart(val, 'test2', testdata1, false, $filter, AllPaymentsGlobalData, $location)
						// }

						// $scope.curDistClicked = false;
						// setChartProp.horizontalVertical('CurDis', 'pymtCurDisChart')
						// chartFunctions.VerticalMultibarChart('Count', commonFunctions.formatingData(items.data.PaymentStatus1), 'CurDis', $filter, AllPaymentsGlobalData, $location)

						// $scope.selectCurrencyDist = function (val, id, parentId) {
						//     if (val == 'Amount') {
						//         $scope.curDistClicked = true;
						//     } else {
						//         $scope.curDistClicked = false;
						//     }
						//     chartFunctions.VerticalMultibarChart(val, commonFunctions.formatingData(items.data.PaymentStatus1), 'CurDis', $filter, AllPaymentsGlobalData, $location)
						// }
						// setChartProp.horizontalVertical('MopBar', 'MOPDist')
						//chartFunctions.HorizontalMultibarChart("Count", commonFunctions.formatingData(items.data.MOP), 'MopBar', $filter, AllPaymentsGlobalData, $location)

						// $scope.clickMOP = function (a) {
						//     if (a == 'Count') {
						//         $scope.MOPclicked = false;
						//         chartFunctions.HorizontalMultibarChart("Count", commonFunctions.formatingData(items.data.MOP), 'MopBar', $filter, AllPaymentsGlobalData, $location)
						//     } else if (a == 'Amount') {
						//         $scope.MOPclicked = true;
						//         chartFunctions.HorizontalMultibarChart("Amount", commonFunctions.formatingData(items.data.MOP), id, $filter, AllPaymentsGlobalData, $location)
						//     }
						// }

						/**** Horizontal MultiBar Chart Ends here ****/
						// outputForSankey(angular.copy(items.data.PaymentStatus), 'status')

						/*** Calling Sankey flow chart ***/
						//var graph = jsonToSankeyData(noPaymentsankey, 'PaymentStatus1', 'Count', 'totalTrue');
						//chartFunctions.SankeyChart(graph, 'sankeyChart', $filter, AllPaymentsGlobalData, $location);

						/*** Payment Status- Sankey Flow Chart Count/Amount ***/
						// $scope.clickPaymentStatus = function (val) {

						//     $('#sankeyChart').html('');
						//     if (val == 'Count') {
						//         $scope.paymentClicked = false;
						//         var graph = jsonToSankeyData(noPaymentsankey, 'PaymentStatus1', 'Count', 'totalTrue');
						//         chartFunctions.SankeyChart(graph, 'sankeyChart', $filter, AllPaymentsGlobalData, $location)
						//     } else {
						//         $scope.paymentClicked = true;
						//         var graph = jsonToSankeyData(noPaymentsankey, 'PaymentStatus1', 'Amount', 'totalTrue');
						//         chartFunctions.SankeyChart(graph, 'sankeyChart', $filter, AllPaymentsGlobalData, $location)
						//     }
						// }
						/*** Sankey Charts Ends here....***/
					});
				} else {
					//this condition works when the data is present
					$scope.schannel = 1;
					$scope.mop = 1;
					$scope.paymentstatus = 1;
					$scope.noCurrenciesFound = false;
					$scope.donutChartVisible = true;
					$scope.pieChartSelected = false;
					$scope.sankeyChartSelected = false;

					$scope.fCntAmt = [];

					$scope.uniqueFileStatus = constructObject.getUniqueVal(restdata.PaymentStatus, 'Name')

						for (var i in $scope.uniqueFileStatus) {
							$scope.fCnt = 0;
							for (var j in restdata.PaymentStatus) {

								if ($scope.uniqueFileStatus[i] == restdata.PaymentStatus[j].Name) {
									$scope.fCnt = $scope.fCnt + restdata.PaymentStatus[j].Count;
								}
							}

							$scope.fCntAmt.push({
								'Status' : $scope.uniqueFileStatus[i],
								'Count' : $scope.fCnt
							})
						}

							console.log("fcntAmt", $scope.fCntAmt)


						$scope.totStatusCnt = 0;
						for (var i in $scope.statusBarVal) {
							for (var j in $scope.fCntAmt) {

								//console.log("a",$scope.fCntAmt[j].Status.match($scope.statusBarVal[i].NavStatus))
								//console.log($scope.statusBarVal[i].NavStatus, $scope.fCntAmt[j].Status)
								//if(($scope.statusBarVal[i].NavStatus == $scope.fCntAmt[j].Status))
								if(($scope.statusBarVal[i].NavStatus == $scope.fCntAmt[j].Status) || ($scope.fCntAmt[j].Status.match($scope.statusBarVal[i].NavStatus)))
								{
									
									$scope.statusBarVal[i].Count = $scope.statusBarVal[i].Count+$scope.fCntAmt[j].Count;
									//console.log($scope.fCntAmt[j])
									//console.log($scope.statusBarVal[i].searchArr.includes($scope.fCntAmt[j].Status),$scope.fCntAmt[j].Status)

									//if(!($scope.statusBarVal[i].searchArr.includes($scope.fCntAmt[j].Status)))
								//console.log("aa",$scope.statusBarVal[i].searchArr[0],$scope.fCntAmt[j].Status,$scope.statusBarVal[i].searchArr[0].indexOf($scope.fCntAmt[j].Status))
									if($scope.statusBarVal[i].searchArr[0].indexOf($scope.fCntAmt[j].Status) == -1)
									{
									$scope.statusBarVal[i].searchArr.push($scope.fCntAmt[j].Status)
									}	


									//$scope.totStatusCnt = $scope.totStatusCnt+$scope.fCntAmt[j].Count;
									//console.log($scope.fCntAmt[j].Count, $scope.totStatusCnt)
								 }
									//console.log($scope.fCntAmt[j].Count)
							}
						}

						console.log($scope.statusBarVal)
						if (Object.keys(data).indexOf("SourceChannel") == -1) {

							data.SourceChannel = [{
									"Name" : "BOOK",
									"Amount" : 4000,
									"Count" : 20,
									"Currency" : "EUR"
								}, {
									"Name" : "SEPA",
									"Amount" : 2000,
									"Count" : 8,
									"Currency" : "GBP"
								}, {
									"Name" : "SWIFT",
									"Amount" : 1000,
									"Count" : 4,
									"Currency" : "USD"
								}
							];
							$scope.schannel = 0;
							$scope.donutChartVisible = false;
						}

						if (Object.keys(data).indexOf("MOP") == -1) {
							data.MOP = [{
									"Name" : "BOOK",
									"Amount" : 1200,
									"Count" : 8,
									"Currency" : "EUR"
								}, {
									"Name" : "SWIFT",
									"Amount" : 3300,
									"Count" : 12,
									"Currency" : "GBP"
								}
							];
							$scope.mop = 0;
						}

						if (Object.keys(data).indexOf("PaymentStatus") == -1) {
							data.PaymentStatus = [{
									"Name" : "REPAIR",
									"Amount" : 2500,
									"Count" : 5,
									"Currency" : "EUR"
								}, {
									"Name" : "COMPLETED",
									"Amount" : 3500,
									"Count" : 20,
									"Currency" : "USD"
								}, {
									"Name" : "WAREHOUSED",
									"Amount" : 1000,
									"Count" : 7,
									"Currency" : "GBP"
								}
							];
							$scope.noCurrenciesFound = true;
							$scope.paymentstatus = 0;
						}

						$scope.donutSet = false;
					var sort_by;
					(function () {
						var default_cmp = function (a, b) {
							if (a == b)
								return 0;
							return a < b ? -1 : 1;
						},
						getCmpFunc = function (primer, reverse) {
							var cmp = default_cmp;
							if (primer) {
								cmp = function (a, b) {
									return default_cmp(primer(a), primer(b));
								};
							}
							if (reverse) {
								return function (a, b) {
									return -1 * cmp(a, b);
								};
							}
							return cmp;
						};
						sort_by = function () {
							var fields = [],
							n_fields = arguments.length,
							field,
							name,
							reverse,
							cmp;
							for (var i = 0; i < n_fields; i++) {
								field = arguments[i];
								if (typeof field === 'string') {
									name = field;
									cmp = default_cmp;
								} else {
									name = field.name;
									cmp = getCmpFunc(field.primer, field.reverse);
								}
								fields.push({
									name : name,
									cmp : cmp
								});
							}

							return function (A, B) {
								var a,
								b,
								name,
								cmp,
								result;
								for (var i = 0, l = n_fields; i < l; i++) {
									result = 0;
									field = fields[i];
									name = field.name;
									cmp = field.cmp;

									result = cmp(A[name], B[name]);
									if (result !== 0)
										break;
								}
								return result;
							}
						}
					}
						());

					data.SourceChannel.sort(sort_by('Name', {
							name : 'Currency',
							reverse : false
						}));
					data.MOP.sort(sort_by('Name', {
							name : 'Currency',
							reverse : false
						}));
					data.PaymentStatus.sort(sort_by('Name', {
							name : 'Currency',
							reverse : false
						}));

					var statusArr = [];
					var unqStatusArr = [];
					$scope.overallStatus = [];

					for (var i = 0; i < data.PaymentStatus.length; i++) {
						statusArr.push(data.PaymentStatus[i].Name)
					}

					for (var i = 0; i < statusArr.length; i++) {
						if (unqStatusArr.indexOf(statusArr[i]) == -1) {
							unqStatusArr.push(statusArr[i]);
						}
					}

					for (var i = 0; i < unqStatusArr.length; i++) {
						var cnt = 0;
						var Amt = 0;
						for (var j = 0; j < data.PaymentStatus.length; j++) {
							if (unqStatusArr[i] == data.PaymentStatus[j].Name) {
								cnt = cnt + data.PaymentStatus[j].Count;
								Amt = Amt + data.PaymentStatus[j].Amount;
							}
						}

						$scope.overallStatus.push({
							'Name' : unqStatusArr[i],
							'Count' : cnt,
							"Amount" : Amt
						})
					}

					$scope.data1 = data;
					var testdata1 = data.SourceChannel;
					$scope.testdata1 = data.SourceChannel;
					var testdata = data.MOP;
					$scope.testdata = data.MOP;

					$scope.PSData = [];
					$scope.PSData = data.PaymentStatus;
					var PSData = [];
					var PSData = data.PaymentStatus;

					$scope.donutColor = myColors;
					d3.scale.myColors = function () {
						return d3.scale.ordinal().range(myColors);
					};
					$scope.totInboundAmt = 0;
					$scope.totCount = 0;

					/*** Inbound Payments Charts ***/

					/*** For Inbound Payment New Legend Starts***/
					$scope.dumObj = srcChannelLegenColorGen(data.SourceChannel)
						/*** For Inbound Payment New Legend End***/

						//    $scope.statusFlag = {
						//         'CurDis': 'false',
						//         'test2': 'false',
						//         'MopBar': 'false',
						//         'sankeyChart': 'false'


						//     }

						$scope.valObj = {
						"CurDis" : srcChannelLegenColorGen(restdata['PaymentStatus']),
						"test2" : srcChannelLegenColorGen(restdata['SourceChannel']),
						"MopBar" : srcChannelLegenColorGen(restdata['MOP']),
						"sankeyChart" : srcChannelLegenColorGen(restdata['PaymentStatus'])

					}

					for (var i in userData.defaultChartTypes.paymentDashoard) {
						cahrtFunctnly[userData.defaultChartTypes.paymentDashoard[i].chartType](userData.defaultChartTypes.paymentDashoard[i])
						$scope.statusFlag[userData.defaultChartTypes.paymentDashoard[i].id] = userData.defaultChartTypes.paymentDashoard[i].flag;

					}

					outputForSankey(angular.copy(restdata.PaymentStatus), 'curDis')
					outputForSankey(angular.copy(restdata.SourceChannel), 'srcChannel')
					outputForSankey(angular.copy(restdata.MOP), 'mop')
					outputForSankey(angular.copy(restdata.PaymentStatus), 'status')

					/*** Inbound Channel - Pie chart Count/Amount ***/
					$scope.click = function (val, id, parentId) {
						prevIndex = -1;
						prevObj = -1;
						preClicked = -1;
						inbndCntAmt = val;
						$('#' + parentId).find('.channelLegend').css({
							'opacity' : 1,
							'font-weight' : 'normal'
						})
						$('#' + parentId).find('.channelLegendAmt').css({
							'opacity' : 1,
							'font-weight' : 'normal'
						})

						for (var i in userData.defaultChartTypes.paymentDashoard) {

							if (id == userData.defaultChartTypes.paymentDashoard[i].id) {
								console.log(id, userData.defaultChartTypes.paymentDashoard[i].id)
								cahrtFunctnly[userData.defaultChartTypes.paymentDashoard[i].chartType](userData.defaultChartTypes.paymentDashoard[i]);

								if (val == 'Count') {
									$scope.statusFlag[id] = false;
								} else if (val == 'Amount') {
									$scope.statusFlag[id] = true;
								}

							}

						}

						if (val == 'Count') {
							if (id == 'InboundModal') {
								$scope.clickedModal = false;
							} else { //$scope.clicked = false;
								$scope.curDistClicked = false;
							}
						} else if (val == 'Amount') {
							if (id == 'InboundModal') {
								$scope.clickedModal = true;
							} else { //$scope.clicked = true;
								$scope.curDistClicked = true;
							}
						}
					}

					$(window).resize(function () {
						for (var i in userData.defaultChartTypes.paymentDashoard) {
							cahrtFunctnly[userData.defaultChartTypes.paymentDashoard[i].chartType](userData.defaultChartTypes.paymentDashoard[i])
							$scope.statusFlag[userData.defaultChartTypes.paymentDashoard[i].id] = userData.defaultChartTypes.paymentDashoard[i].flag;

						}
					})

					$scope.InboundModal = function (svgId, objKey, eve) {

						$scope.origObjKey = '';
						$scope.clickedModal = false;
						


						var modalCaption = ($(eve.currentTarget).parent().parent().parent().parent().parent().find('.caption').find('span:first-child').text())


							$('.channelLegendpie').css({
								'opacity' : 1,
								'font-weight' : 'normal'
							})
							$('.channelLegendModal').css({
								'opacity' : 1,
								'font-weight' : 'normal'
							})
							$('#InboundTotalforModal').css('display', 'none')
							var winWidth = 0;
						var winHeight = 0;
						winWidth = $(window).width();
						winHeight = $(window).height();
						var mq = window.matchMedia("(max-width: 991px)");

						if (mq.matches) {
							$('#resizeWindow').css({
								'width' : winWidth * 85 / 100 + 'px',
								'height' : '500px'
							})
							$('.inbndModalBody').css({
								'width' : winWidth * 80 / 100 + "px",
								'height' : '400px'
							})
							$('.modaltestBlock').css({
								'width' : '100%',
								'height' : "900px"
							})
							$('#InboundModal').css({
								'width' : "100%",
								'height' : "900px"
							})
						} else {
							$('#resizeWindow').css({
								'width' : winWidth * 59 / 100 + 'px',
								'height' : '890px'
							})
							$('.inbndModalBody').css({
								'width' : winWidth * 57.2 / 100 + "px",
								'height' : '800px'
							})
							$('.modaltestBlock').css({
								'width' : '100%',
								'height' : "600px"
							})
							$('#InboundModal').css({
								'width' : "100%",
								'height' : "600px"
							})
						}

						setTimeout(function () {
							$('.modaltestBlock').height($('#InboundModal').height())
						}, 2000)

						$('#' + svgId).html('')
						$('#' + svgId).empty('')
						$scope.objKey = objKey;

						for (var i in userData.defaultChartTypes.paymentDashoard) {
							if (userData.defaultChartTypes.paymentDashoard[i].basedOn == objKey) {
									
								inbndCntAmt = $('#dropVal_' + userData.defaultChartTypes.paymentDashoard[i].id).html()

									if (inbndCntAmt == 'Count') {
										$scope.clickedModal = false;
									} else {
										$scope.clickedModal = true;
									}

									if (userData.defaultChartTypes.paymentDashoard[i].id == 'CurDis') {
										$scope.inbndModalDefChart = userData.defaultChartTypes.paymentDashoard[i].chartType;
										break;
									} else {
										$scope.inbndModalDefChart = userData.defaultChartTypes.paymentDashoard[i].chartType;

									}

							}
							// cahrtFunctnly[userData.defaultChartTypes.paymentDashoard[i].chartType](userData.defaultChartTypes.paymentDashoard[i])
						}

						$scope.dumObjKey = {
							"CurDis" : "",
							"test2" : "",
							"MopBar" : "",
							"sankeyChart" : ""
						}

						for (var i in userData.defaultChartTypes.paymentDashoard) {
							//console.log(userData.defaultChartTypes.paymentDashoard[i].id,userData.defaultChartTypes.paymentDashoard[i])
							$scope.dumObjKey[userData.defaultChartTypes.paymentDashoard[i].id] = userData.defaultChartTypes.paymentDashoard[i].chartType
						}

						if ($scope.objKey == 'SourceChannel') {
							$scope.inData = testdata1;
							//$scope.inbndModalDefChart = sessionStorage.inbndChart;
							$scope.inbndModalDefChart = $scope.dumObjKey.test2;
							$scope.modalData = $scope.dumObj;
						} else if ($scope.objKey == 'PaymentStatus') {
							$scope.inData = restdata.PaymentStatus;
							//  $scope.inbndModalDefChart = sessionStorage.paymentCurDist;
							$scope.inbndModalDefChart = $scope.dumObjKey.CurDis;
							$scope.modalData = $scope.dumObjCurDist;
						} else if ($scope.objKey == 'MOP') {
							$scope.modalData = $scope.dumObjMOP;
							//  $scope.inbndModalDefChart = sessionStorage.mopChart;
							$scope.inbndModalDefChart = $scope.dumObjKey.MopBar;
							$scope.inData = restdata.MOP;
						} else if ($scope.objKey == 'PaymentStatus1') {
							$scope.origObjKey = 'PaymentStatus1';
							$scope.objKey = 'PaymentStatus';
							$scope.inData = restdata.PaymentStatus;
							//$scope.inbndModalDefChart = sessionStorage.statusChart;
							$scope.inbndModalDefChart = $scope.dumObjKey.sankeyChart;
							$scope.modalData = $scope.dumObjStatus;
						}

						$('#resizeWindow').find('.modal-body').find('.portlet-title').find('.custDropDownInsideModal').find('.dropdown-toggle').find('.dropVal').html(inbndCntAmt)

						setTimeout(function () {
							$('.listClassModal').removeClass('listSelected listNotSelected')
							$('#Mdlli_' + inbndCntAmt).removeClass('listNotSelected').addClass('listSelected')
						}, 200)

						//$('#Mdlli_'+Count).addClass('listSelected')

						$('#resizeWindow').find('.modal-body').find('.portlet-title').find('.custDropDownInsideModal').find('.dropdown-menu').find('li').addClass('listNotSelected').removeClass('listSelected')
						$('#resizeWindow').find('.modal-body').find('.portlet-title').find('.custDropDownInsideModal').find('.dropdown-menu').find('li:first-child').removeClass('listNotSelected').addClass('listSelected')

						$('#resizeWindow').find('.modal-body').find('.portlet-title').find('.personalizeClass').find('li').addClass('listNotSelected').removeClass('listSelected')

						$('#resizeWindow').find('.chartModalLegends').css('display', 'none')
						setTimeout(function () {
							 $('#resizeWindow').find('.modal-body').find('.row').find('.portlet').find('.portlet-title').find('.caption').find('span').html(modalCaption)
							$('#' + svgId).css('margin-left', '0px')
							$('.modaltestBlock').css({
								'width' : '100%'
							})

							if ($scope.inbndModalDefChart == 'pie') {

								$('#InboundTotalforModal').css('display', 'block')
								$('.modalHt').css('display', 'block')
								$('#resizeWindow').find('.pieChartSelected').css('display', 'block');
								//   arg1.data = testdata1;
								// arg1.flag = false;
								// arg1.filter = $filter;
								//  arg1.location = $location;
								// arg1.globalData = AllPaymentsGlobalData;
								//   arg1.selectVal = inbndCntAmt;


								chartFunctions.PieChart({
									'selectVal' : inbndCntAmt,
									'id' : svgId,
									'data' : testdata1,
									'filter' : $filter,
									'globalData' : AllPaymentsGlobalData,
									'location' : $location
								})
								console.log($scope.donutSet)
							} else if ($scope.inbndModalDefChart == 'donut') {
								$('#InboundTotalforModal').css('display', 'block')
								$('.modalHt').css('display', 'block')
								$('#resizeWindow').find('.donutChartSelected').css('display', 'block');
								chartFunctions.DonutChart({
									'selectVal' : inbndCntAmt,
									'id' : svgId,
									'data' : testdata1,
									'filter' : $filter,
									'globalData' : AllPaymentsGlobalData,
									'location' : $location
								})
							} else if ($scope.inbndModalDefChart == 'sankey') {
								$('.modalHt').css('display', 'block')
								$('#resizeWindow').find('.sankeyChartSelected').css('display', 'block');
								var graph = jsonToSankeyData(restdata, $scope.objKey, 'Count', 'totalTrue');
								chartFunctions.SankeyChart({
									'selectVal' : inbndCntAmt,
									'id' : svgId,
									'data' : graph,
									'filter' : $filter,
									'globalData' : AllPaymentsGlobalData,
									'location' : $location
								})
								//$('#' + svgId).css('margin-left', '20px')
							} else if ($scope.inbndModalDefChart == 'verticalsankey') {
								$('.modalHt').css('display', 'block')
								$('#resizeWindow').find('.sankeyChartSelected').css('display', 'block');
								setTimeout(function () {
									var graph = CurrencySankey(restdata, $scope.objKey, 'Count', 'totalFalse');
									if ($scope.origObjKey == 'PaymentStatus1') {
										var graph = jsonToSankeyData(restdata, $scope.objKey, 'Count', 'totalFalse');
									}
									chartFunctions.verticalSankeyChart({
										'selectVal' : inbndCntAmt,
										'id' : svgId,
										'data' : graph,
										'filter' : $filter,
										'globalData' : AllPaymentsGlobalData,
										'location' : $location
									})
								}, 500)

								//$('#' + svgId).css('margin-left', '20px')
							} else if ($scope.inbndModalDefChart == 'horizontal') {
								$('.modalHt').css('display', 'none')
								$('#InboundModal').css('height', $('.inbndModalBody').height() + 'px')
								var HorizData = commonFunctions.formatingData($scope.inData)
								console.log(HorizData,inbndCntAmt,svgId)
									chartFunctions.HorizontalMultibarChart({
										'selectVal' : inbndCntAmt,
										'id' : svgId,
										'data' : HorizData,
										'filter' : $filter,
										'globalData' : AllPaymentsGlobalData,
										'location' : $location
									})
							} else if ($scope.inbndModalDefChart == 'vertical') {

								$('.modalHt').css('display', 'none')
								$('#InboundModal').css('height', $('.inbndModalBody').height() + 'px')
								var vertData = commonFunctions.formatingData($scope.inData)
									vertData.sort(compare);
								chartFunctions.VerticalMultibarChart({
									'selectVal' : inbndCntAmt,
									'id' : svgId,
									'data' : vertData,
									'filter' : $filter,
									'globalData' : AllPaymentsGlobalData,
									'location' : $location
								})
							}
						}, 300)
					}
				setTimeout(function(){
				$('.customCharts').find('li:first-child').addClass('listSelected');
				console.log( $('.customCharts').find('li:first-child'))
				},100)
					$scope.insideModalPersonalize = function (chartId, chartType, evt) {

						console.log("objkey", $scope.objKey)
//$('.custDropDownInsideModal').find('ul').find('li:first-child').addClass('listSelected');	 

          
					//	$('#' + chartId).parent().parent().parent().parent().parent().parent().find('.portlet-title').find('.actions').find('.dropdown').first().find('ul').find('li').addClass('listNotSelected').removeClass('listSelected')
						//$(evt.currentTarget).addClass('listSelected').removeClass('listNotSelected')
						$('.custDropDownInsideModal').find('button').find('span:first-child').html('Count')
						//$('.custDropDownInsideModal').find('ul').find('li').removeClass('listSelected');
                      $(evt.currentTarget).addClass('listSelected').siblings("li").removeClass("listSelected");
					
                       //$(evt.currentTarget).addClass('listSelected');
						$('#resizeWindow').find('.chartModalLegends').css('display', 'none')
						$scope.clickedModal = false;
						$('#' + chartId).html('');
						$('#' + chartId).empty();
						$scope.inbndModalDefChart = chartType;
						$('#' + chartId).parent().addClass('animated fadeInUp')
						setTimeout(function () {
							$('#' + chartId).parent().removeClass('animated fadeInUp')
						}, 1000)

						$('#InboundTotalforModal').css('display', 'none')

						cahrtFunctnly[chartType]({
							'chartTitle' : '',
							'chartType' : chartType,
							'id' : chartId,
							'parentId' : 'resizeWindow',
							'basedOn' : $scope.objKey
						})
						$('.modaltestBlock').css('height', $('#' + chartId).height() + 'px')
					}

					$scope.selectFrmModal = function (val, id) {
						$('.modaltestBlock').css('height', $('#' + id).height() + 'px')
						inbndCntAmt = val;

						if (val == 'Count') {
							$scope.clickedModal = false;
						} else {
							$scope.clickedModal = true;
						}
						var inputData;

						cahrtFunctnly[$scope.inbndModalDefChart]({
							'chartTitle' : '',
							'chartType' : $scope.inbndModalDefChart,
							'id' : id,
							'parentId' : 'resizeWindow',
							'basedOn' : $scope.objKey
						})

					}

					$scope.pieChart = true;
					var mopchartData;
					outputForSankey(angular.copy(restdata.PaymentStatus), 'curDis')
					outputForSankey(angular.copy(restdata.SourceChannel), 'srcChannel')
					outputForSankey(angular.copy(restdata.MOP), 'mop')
					outputForSankey(angular.copy(restdata.PaymentStatus), 'status')

					$scope.defFormatCurDis = restdata.PaymentStatus;
					$scope.defFormatCurDis.sort(compareWithName);

					$scope.dumObjCurDist = srcChannelLegenColorGen(restdata.PaymentStatus)

						var curDisCntAmt = 'Count';

					$scope.selectCurrencyDist = function (val, id, parentId) {
						curDisCntAmt = val;
						if (val == 'Amount') {
							$scope.curDistClicked = true;
						} else {
							$scope.curDistClicked = false;
						}
						$('#' + parentId).find('.channelLegend').css({
							'opacity' : 1,
							'font-weight' : 'normal'
						})
						$('#' + parentId).find('.channelLegendAmt').css({
							'opacity' : 1,
							'font-weight' : 'normal'
						})
						cahrtFunctnly.vertical({
							'chartTitle' : 'aa',
							'chartType' : 'vertical',
							'id' : 'CurDis',
							'parentId' : 'pymtCurDisChart',
							'basedOn' : 'PaymentStatus'
						})
					}
					$scope.dumObjMOP = srcChannelLegenColorGen(data.MOP.sort(compareWithName))

						var mopCntAmt = 'Count'

						/*** Calling Sankey flow chart ***/
						var statusCntAmt = 'Count';

					// Payment Status- Sankey Flow Chart Count/Amount
					// $scope.clickPaymentStatus = function (val, id, parentId) {
					//     statusCntAmt = val;
					//     if (val == 'Count') {
					//         $scope.paymentClicked = false;
					//     } else {
					//         $scope.paymentClicked = true;
					//     }
					//     fnForInbnt(val, id)
					// }

					// On window resize  -- Sankey Flow chart
					// $(window).resize(function () {
					//     if ($location.path() == '/app/dashboard') {
					//         fnForInbnt(statusCntAmt, id)

					//     }
					// })

					$('#resizeWindow').bind('resize', function (e) {

						var wid = $('#resizeWindow').width()
							var hgt = $('#resizeWindow').height()

							$('.inbndModalBody').css({
								'width' : wid - 32 + "px",
								'height' : hgt - 120 + "px"
							})
							$('#InboundModal').css({
								'width' : wid + "px",
								'height' : hgt - 250 + "px"
							})
							$('.modaltestBlock').height($('#InboundModal').height())
							cahrtFunctnly[$scope.inbndModalDefChart]({
								'chartTitle' : '',
								'chartType' : $scope.inbndModalDefChart,
								'id' : 'InboundModal',
								'parentId' : 'resizeWindow',
								'basedOn' : $scope.objKey
							})
					});

					$scope.datas = {
						"title" : "",
						"chartType" : ""
					};

					$scope.getChartName = function (name, svgid, key) {
						
						$scope.datas = {
							"chartType" : "",
							"title" : ""
						};

						$scope.chartName = name;
						$scope.svgId = svgid;
						$scope.objKey = key;

						//inbndCntAmt = $('#dropVal_'+svgid).html()
						console.log(inbndCntAmt)

						for (var i in userData.defaultChartTypes.paymentDashoard) {
							if (svgid == userData.defaultChartTypes.paymentDashoard[i].id) {
								// console.log(userData.defaultChartTypes.paymentDashoard[i].chartType) 
								$scope.datas.chartType = userData.defaultChartTypes.paymentDashoard[i].chartType;
							}
						}
					}

					// Personalization Config
					$scope.personalizeChart = function (data) {

						// console.log(userData.DboardPreferences)


						for (var i in userData.defaultChartTypes.paymentDashoard) {
							delete userData.defaultChartTypes.paymentDashoard[i].data;
						}

						if ((data.title != '') || (data.chartType != '')) {
							console.log(data)

							$scope.curDistClicked = false;
							$scope.clicked = false;
							$scope.paymentClicked = false;
							$('.channelLegend').css({
								'opacity' : 1,
								'font-weight' : 'normal'
							})
							$('.modal').modal('hide')

							if (data.title) {
								$('#' + $scope.chartName).find('.caption').find('span:first-child').html(data.title)
							}
							$('#dropVal_' + $scope.svgId).html('Count')
							$('#dropVal_' + $scope.svgId).parent().next().find('li').addClass('listNotSelected').removeClass('listSelected')
							$('#dropVal_' + $scope.svgId).parent().next().find('li:first-child').removeClass('listNotSelected').addClass('listSelected')

							var inputData;
							var parentId;

							// if ($scope.svgId == 'test2') {
							//     inputData = testdata1;
							//     parentId = 'inbndChart';
							//     sessionStorage.inbndChart = data.chartType;
							// } else if ($scope.svgId == 'CurDis') {
							//     inputData = restdata.PaymentStatus;
							//     parentId = 'pymtCurDisChart';
							//     sessionStorage.paymentCurDist = data.chartType;
							// } else if ($scope.svgId == 'MopBar') {
							//     parentId = 'MOPDist';
							//     sessionStorage.mopChart = data.chartType;
							//     inputData = angular.copy(restdata.MOP);
							// } else if ($scope.svgId == 'sankeyChart') {
							//     inputData = restdata.PaymentStatus;
							//     parentId = 'paymentStatusDist';
							//     sessionStorage.statusChart = data.chartType;
							// }

							if (data.chartType) {
								$scope.donutChartSelected = false;
								$scope.sankeyChartSelected = false;
								$scope.pieChartSelected = false;

								$('#' + parentId).find('.legendHolder').find('.chartLegends').css('display', 'none')
								$scope.InbndModalDef = data.chartType;
								$('#' + $scope.svgId).css('margin-left', '0px')
								$('#InboundTotalforModal').hide()
								$('#' + $scope.svgId).html('')
								$('#' + $scope.svgId).empty()
								$('#' + $scope.svgId).parent().addClass('animated fadeInUp')
								setTimeout(function () {
									$('#' + $scope.svgId).parent().removeClass('animated fadeInUp')
								}, 1000)

								// console.log($scope.svgId)

								for (var i in userData.defaultChartTypes.paymentDashoard) {
									if ($scope.svgId == userData.defaultChartTypes.paymentDashoard[i].id) {
										cahrtFunctnly[data.chartType]({
											'chartTitle' : userData.defaultChartTypes.paymentDashoard[i].chartTitle,
											'chartType' : data.chartType,
											'id' : $scope.svgId,
											'parentId' : userData.defaultChartTypes.paymentDashoard[i].parentId,
											'basedOn' : userData.defaultChartTypes.paymentDashoard[i].basedOn,
											'key':$('#dropVal_' + $scope.svgId).html()
										})
										userData.defaultChartTypes.paymentDashoard[i].chartType = data.chartType;
									}
								}
									
								updateUserProfile($filter('stringToHex')(JSON.stringify(userData)), $http).then(function (response) {
									console.log(response)
									$scope.alerts = [{
											type : response.Status,
											msg : (response.Status == 'success') ? response.data.data.responseMessage : response.data.data.error.message
										}
									];
									$scope.alertWidth = alertSize().alertWidth;
									$timeout(function () {
										callOnTimeOut()
									}, 4000)

								})

							}
						}
					}
				}

			})
			.error(function (data, status, headers, config) {
				// console.log(data)
				//console.log(data.error.message)
				if (status == 401) {
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

		$scope.allData = true;
		var objData = {}
		if ($scope.allData) {
			objData = {};
			objData.IsAllInfoRead = true;
			$scope.dashboardData(objData);
		}

	};

	setTimeout(function () {
		$scope.initialCall();
	}, 200)

	$scope.reloadPment = function()
	{
		$scope.initialCall();
		$('#rBtn').addClass('pointerNone')
		setTimeout(function () {
			$('#rBtn').removeClass('pointerNone')
		}, 200)
	}

	$scope.dashboardPrint = function () {
		$('[data-toggle="tooltip"]').tooltip('hide');
		window.print()
	}

	$scope.dashboardToAllPayment = function (status) {
		
		AllPaymentsGlobalData.fromDashboard = true;
		AllPaymentsGlobalData.DataLoadedCount = 20;
		AllPaymentsGlobalData.FLuir = "";
		AllPaymentsGlobalData.SelectSearchVisible = false;
		AllPaymentsGlobalData.advancedSearchEnable = true;
		AllPaymentsGlobalData.all = true;
		AllPaymentsGlobalData.custom = false;
		AllPaymentsGlobalData.endDate = "";
		AllPaymentsGlobalData.isEntered = false;
		AllPaymentsGlobalData.isSortingClicked = false;
		AllPaymentsGlobalData.month = false;
		AllPaymentsGlobalData.monthEnd = "";
		AllPaymentsGlobalData.monthStart = "";
		AllPaymentsGlobalData.myProfileFLindex = "";
		AllPaymentsGlobalData.prev = "all";
		AllPaymentsGlobalData.prevId = 1;
		AllPaymentsGlobalData.prevSelectedTxt = "all";
		AllPaymentsGlobalData.searchClicked = false;
		AllPaymentsGlobalData.searchNameDuplicated = false;
		AllPaymentsGlobalData.searchname = "";
		AllPaymentsGlobalData.selectCriteriaID = 1;
		AllPaymentsGlobalData.selectCriteriaTxt = "All";
		AllPaymentsGlobalData.sortReverse = false;
		AllPaymentsGlobalData.sortType = "Desc";
		AllPaymentsGlobalData.startDate = "";
		AllPaymentsGlobalData.today = false;
		AllPaymentsGlobalData.todayDate = "";
		AllPaymentsGlobalData.uirTxtValue = "";
		AllPaymentsGlobalData.week = false;
		AllPaymentsGlobalData.weekEnd = "";
		AllPaymentsGlobalData.weekStart = "";
		AllPaymentsGlobalData.orderByField = "ReceivedDate";

		AllPaymentsGlobalData.searchParams = {
			"InstructionData" : {
				"ReceivedDate" : {
					"Start" : "",
					"End" : ""
				},
				"ValueDate" : {
					"Start" : "",
					"End" : ""
				},
				"Amount" : {
					"Start" : "",
					"End" : ""
				}
			}
		};

		AllPaymentsGlobalData.searchParams.Status = status;
		AllPaymentsGlobalData.FromDashboardFieldArr = [];

		for(var i in status)
		{
			AllPaymentsGlobalData.FromDashboardFieldArr.push('Status=' + status[i])
		}
		//console.log(AllPaymentsGlobalData.FromDashboardFieldArr)
		//AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status];

		//$state.go('app.payment');
		$location.path('app/allpayments');
	}

	/*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

	$scope.widthOnScroll = function () {
		var mq = window.matchMedia("(max-width: 991px)");
		var headHeight
		if (mq.matches) {
			headHeight = 0;
			$scope.alertWidth = $('.pageTitle').width();
		} else {
			$scope.alertWidth = $('.pageTitle').width();
			headHeight = $('.main-header').outerHeight(true) + 10;
		}
		$scope.alertStyle = headHeight;
	}
	$scope.widthOnScroll();

	$timeout(function () {
		mediaMatches()
	}, 200)

	/*** On window resize ***/
	$(window).resize(function () {
		mediaMatches()
		$scope.$apply(function () {
			$scope.alertWidth = $('.alertWidthonResize').width();
		});
	});
	$('.channelLegendInbnd,.channelLegendCurDis,.channelLegendMOP,.channelLegendStatus').css({
		'opacity' : 1,
		'font-weight' : 'normal'
	})

	$scope.makeitMove = function () {
		$('.dragHandle').css('cursor', 'move')
		$('.droppable').mouseenter(function () {
			$(this).css('border', '2px dotted #000')
		})
		$('.droppable').mouseleave(function () {
			$(this).css('border', '2px dotted transparent')
		})

		$(function () {
			$(".sTrack").sortable({
				start : function (event, ui) {
					$('.droppable').find('.caption').css('pointer-events', 'none')
				},
				stop : function (event, ui) {
					$('.droppable').find('.caption').css('pointer-events', 'auto')
				}
			});
		});
	}

	$scope.deleteChart = function (id) {
		
		if (id == 'pymtCurDisChart') {
			$scope.uSetting.CurDis = false;
		}
		if (id == 'inbndChart') {
			$scope.uSetting.InbndPayment = false;
		}
		if (id == 'MOPDist') {
			$scope.uSetting.Mop = false;
		}
		if (id == 'paymentStatusDist') {
			$scope.uSetting.Status = false;
		}

		$('#' + id).fadeOut(500)
		enableDisableChart()
		//console.log(id,$scope.uSetting)


	}

	$scope.chartDrop = function (eve) {

$(eve.currentTarget).addClass("listSelected").siblings("li").removeClass("listSelected");
		var parent = $(eve.currentTarget).parent().parent().find('button').find('a')
		
		var parentTxt = parent.text();

		var child = $(eve.currentTarget);
		var id = child.attr('id').split('_')[1];
		//childTxt = child.text()
		childTxt = child.find('a').html()

		//console.log(parent,child,id, $(child).attr('tooltip'))
		$(parent).parent().find('span').html($(child).attr('tooltip'))
		//console.log($(parent).parent().find('span'))

		

		//$(parent).parent().attr('tooltip',$(child).attr('tooltip'))
		//$(parent).parent().tooltip($(child).attr('tooltip'))
		
		
		//console.log(child.find('a').html()	)

			if (id == 'Mod1' || id == 'Mod2') {
				$('.listClassModal ').addClass('listNotSelected').removeClass('listSelected')
			}

			if (id == 1 || id == 2) {
				$('.listClass1').addClass('listNotSelected').removeClass('listSelected')
			}
			if (id == 3 || id == 4) {
				$('.listClass2').addClass('listNotSelected').removeClass('listSelected')

			}
			if (id == 5 || id == 6) {
				$('.listClass3').addClass('listNotSelected').removeClass('listSelected')

			}
			if (id == 7 || id == 8) {
				$('.listClass4').addClass('listNotSelected').removeClass('listSelected')

			}
			if (id == 9 || id == 10) {
				$('.listClass5').addClass('listNotSelected').removeClass('listSelected')
			}
			if (id == 11 || id == 12) {
				$('.listClass6').addClass('listNotSelected').removeClass('listSelected')
			}
			if (id == 13 || id == 14) {
				$('.listClass7').addClass('listNotSelected').removeClass('listSelected')
			}
			$(child).addClass('listSelected').removeClass('listNotSelected');

		$(parent).html(childTxt)

		// console.log(srcChannelObj)
	}

	$scope.$on('$viewContentLoaded', function () {
		/* console.log(new Date())
		$scope.msg = $state.current.templateUrl + ' is loaded !!';
		var d = new Date();
		d.setTime(d.getTime() + 5 * 60 * 1000); // in milliseconds
		document.cookie = 'jwtuser=admin;path=/;'; */

		if ((document.cookie) && (configData.Authorization == "External")) {

			$http.get(BASEURL + '/rest/v2/users/me').success(function (data) {
				console.log(data)

				var ExternalUser = data;

				sessionStorage.ROLE_ID = ExternalUser.RoleID;
				sessionStorage.UserID = ExternalUser.UserID;
				if (ExternalUser.RoleID == 'Super Admin') {
					sessionStorage.showMoreFieldOnCreateUser = true;
				} else {
					sessionStorage.showMoreFieldOnCreateUser = false;
				}

			}).error(function (error) {});

			var sessionData = function () {

				return $.ajax({
					url : BASEURL + '/rest/v2/ui/configuration',
					cache : false,
					async : false,
					type : 'GET'
				}).responseJSON;
			}

			var sData = sessionData();
			for (i in sData) {
				if (sData[i].Name.toUpperCase() == 'FILESIZERESTRICTION') {
					sessionStorage.fileUploadLimit = sData[i].Value;
				} else if (sData[i].Name.toUpperCase() == 'SESSIONTIMEOUT') {
					sessionStorage.sessionTimeLimit = sData[i].Value;
				}
			}

			var applicationInfo = function () {

				return $.ajax({
					url : BASEURL + RESTCALL.appInfo,
					cache : false,
					async : false,
					type : 'GET'
				}).responseJSON;
			}

			var aData = applicationInfo();
			sessionStorage.VersionInfo = aData.Version

				$timeout(function () {

					$scope.aa = {
						"Queryfield" : [{
								"ColumnName" : "UserID",
								"ColumnOperation" : "=",
								"ColumnValue" : sessionStorage.UserID
							}
						],
						"Operator" : "AND"
					}
					$scope.aa = constructQuery($scope.aa);
					console.log($scope.aa)
					$http.post(BASEURL + RESTCALL.userProfileData + '/readall', $scope.aa).success(function (data) {

						if (!data.length) {

							userData = uProfileData;
							var lObj = {};
							lObj.UserID = sessionStorage.UserID;
							lObj.ProfileData = $filter('stringToHex')(JSON.stringify(userData));
							
							$http.post(BASEURL + RESTCALL.userProfileData, lObj).success(function (data) {}).error(function (error) {

								console.log(error)
							})
							$translate.use('en_US');
								
							checkCustomDashboard(userData)
						} else {

							$scope.uData = JSON.parse($filter('hex2a')(data[0].ProfileData))
								userData = $scope.uData;

							sessionStorage.UserProfileDataPK = data[0].UserProfileData_PK;
							//checkCustomDashboard($scope.uData)
							$translate.use($scope.uData.genSetting.languageSelected);
						}

						$('#themeColor').attr("href", "themes/styles/" + userData.genSetting.themeSelected + ".css");

					}).error(function (error) {
						userData = uProfileData;
						$translate.use("en_US");
					})

				}, 1500)

		}
	});


	function checkCustomDashboard(val) {
		
		if (val.defaultdashboard.defDashboard.trim() == 'dashboardFile') {
			$state.go('app.filesummary', {});
			$timeout(function () {
				sidebarMenuControl('PaymentModule', 'DashboardFile')
			}, 500)
		} else if (val.defaultdashboard.defDashboard.trim() == 'dashboardPayments') {
			$state.go('app.paymentsummary', {})
			$timeout(function () {
				sidebarMenuControl('PaymentModule', 'DashboardPayments')
			}, 500)
		} else if (val.defaultdashboard.defDashboard.trim() == 'myDashboard') {
			$state.go('app.newmodules', {
				url : 'mydashboard',
				tempUrl : 'plug-ins/modules/mydashboard',
				contrl : 'mydashboardCtrl'
			});

			$timeout(function () {
				sidebarMenuControl('Home', 'MyDashboard')
			}, 500)
		}

	}


});