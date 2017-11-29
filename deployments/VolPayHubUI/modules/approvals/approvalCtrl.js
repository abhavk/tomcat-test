VolpayApp.controller('approvalCtrl', function ($scope, $state, $http, $timeout, GlobalService, CommonService, bankData, LogoutService) {

	$scope.restData = [];

	if (CommonService.refDataApproved.flag) {

		$scope.alerts = [{
				type : 'success',
				msg : CommonService.refDataApproved.msg
			}
		];

	}
$scope.changeViewFlag = GlobalService.viewFlag;
		$scope.$watch('changeViewFlag', function (newValue, oldValue) {
			GlobalService.viewFlag = newValue;
				// $scope.changeViewFlag = GlobalService.viewFlag;
		})
	function hex2a(hexx) {
		var hex = hexx.toString(); //force conversion
		var str = '';
		for (var i = 0; i < hex.length; i += 2)
			str += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
		return str;
	}

	function a2hex(str) {
		var arr = [];
		for (var i = 0, l = str.length; i < l; i++) {
			var hex = Number(str.charCodeAt(i)).toString(16);
			arr.push(hex);
		}
		return arr.join('');
	}

	function formatXml(xml) {
		var formatted = '';
		var reg = /(>)(<)(\/*)/g;
		xml = xml.replace(reg, '$1\r\n$2$3');
		var pad = 0;
		jQuery.each(xml.split('\r\n'), function (index, node) {
			var indent = 0;
			if (node.match(/.+<\/\w[^>]*>$/)) {
				indent = 0;
			} else if (node.match(/^<\/\w/)) {
				if (pad != 0) {
					pad -= 1;
				}
			} else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
				indent = 1;
			} else {
				indent = 0;
			}

			var padding = '';
			for (var i = 0; i < pad; i++) {
				padding += '  ';
			}

			formatted += padding + node + '\r\n';
			pad += indent;
		});
		//console.log(formatted)


		return formatted;
	}

	function htmlDecode(input) {
		var doc = new DOMParser().parseFromString(input, "text/html");
		return doc.documentElement.textContent;
	}

	var x2js = new X2JS();
	function convertXml2JSon(hhhh) {
		//console.log(hhhh)
		var removeRuleStru = x2js.xml_str2json(hhhh);
		//console.log(removeRuleStru.BusinessRules.RuleStructure)
		delete removeRuleStru.BusinessRules.RuleStructure;
		removeRuleStru.BusinessRules.Rule = htmlDecode(removeRuleStru.BusinessRules.Rule);
		//console.log(removeRuleStru)
		return convertJSon2XML(removeRuleStru);
		//return removeRuleStru;
	}

	function convertJSon2XML(bbb) {
		var formatXMLData = '<?xml version="1.0" encoding="UTF-8"?>' + x2js.json2xml_str(bbb);
		//console.log(formatXMLData);
		return formatXml(formatXMLData);
	}

	/* function convertJSon2XML(bbb) {
	return x2js.json2xml_str(bbb);
	}  */

	$timeout(function () {
		CommonService.refDataApproved.flag = false;
		CommonService.refDataApproved.msg = '';
		$('.alert-success').hide()
	}, 5000)

	$scope.readallFn = function (dataObj) {
		$http.post(BASEURL + RESTCALL.ReferenceDataApproval + '/readall', dataObj).success(function (data, status, headers, config) {

			$scope.restVal = data;
			$scope.totalCount = headers().totalcount;
			$scope.filteredCount = headers().filteredcount;
//			console.log(headers().filteredcount)
			//alert(headers().filteredcount)
			if ($scope.loadmoreCalled) {

				$scope.restData = $scope.restData.concat(data);
			} else {
				$scope.restData = data;
			}
			for (var i = 0; i < data.length; i++) {
				if (data[i].TableName == 'BusinessRules') {
					data[i].NewData = convertXml2JSon(hex2a(data[i].NewData));
					if (data[i].OldData != undefined) {
						data[i].OldData = convertXml2JSon(hex2a(data[i].OldData));
					}
				}
			}


			setTimeout(function()
			{
					if($(window).height()>=760)
					{
						$('.listView').css({'max-height':($(window).height()*65)/100+'px'})
					}
					else{
						$('.listView').css({'max-height':($(window).height()*52)/100+'px'})
					}
			},100)

			//$scope.restVal = data;

			/*if ($scope.restVal.length > 0) {
			$scope.dataFound = true;
			} else {
			$scope.dataFound = false; ;
			}*/
		}).error(function (err, status) {
			if (status == 401) {
				if (configData.Authorization == 'External') {
					window.location.href = '/VolPayHubUI' + configData['401ErrorUrl'];
				} else {
					LogoutService.Logout();
				}
			} else {
				$scope.alerts = [{
						type : 'danger',
						msg : err.error.message
					}
				];

			}
		})

		$timeout(function () {
			$scope.scrollFn()

			/*$('.listView').bind('scroll', function () {
			console.log("aaaa")

			console.log(Math.round($(this).scrollTop() + $(this).innerHeight(),$(this)[0].scrollHeight))
			if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
			alert($scope.filteredCount)
			if ($scope.totalCount >= $scope.filteredCount) {

			debounceHandler()
			// $scope.loadMore();
			}
			}
			})*/
		}, 10)

	}

	var len = 1000;

	var dataObj = {
		'Queryfield' : [],
		'QueryOrder' : [],
		'start' : 0,
		'count' : 1000,
	};

	$scope.loadmoreCalled = false;
	$scope.initData = function () {
		$scope.loadmoreCalled = false;
		dataObj = {
			'Queryfield' : [],
			'QueryOrder' : [],
			'start' : 0,
			'count' : 1000,
		};

		len = 1000;

		$scope.dupData = angular.copy(dataObj)
			dataObj = constructQuery(dataObj);

		$scope.readallFn(dataObj)

	}

	$scope.initData();

	$scope.viewData = function (data) {
		$state.go('app.viewApprovalData', {
			input : data
		})
	}

	$scope.exportToExcel = function () {
		// var tabledata = angular.element( document.querySelector('#exportTable') ).clone();
		//$(tabledata).find('thead').find('tr').find('th:first-child').remove()
		//$(tabledata).find('tbody').find('tr').find('td:first-child').remove()

		var table_html = $('#exportTable').html();
		bankData.exportToExcel(table_html, 'ReferenceDataForApproval')
	}

	$scope.loadMore = function () {

		$scope.loadmoreCalled = true;
		dataObj.start = len;
		dataObj.count = 1000;
		
		$scope.readallFn(dataObj)
		len = len + 1000;

	}

	/** List and Grid view Starts**/
	$scope.listTooltip = "List View";
	$scope.gridTooltip = "Grid View";
	$scope.changeViewFlag = GlobalService.viewFlag;

	$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');

	if ($scope.changeViewFlag) {
		$('#btn_1').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
		$scope.changeViewFlag = true;

	} else {
		$('#btn_2').addClass('disabledBtnColor').removeClass('cmmonBtnColors');
		$scope.changeViewFlag = false;
	}

	var debounceHandler = _.debounce($scope.loadMore, 700, true);
	/*jQuery(
	function ($) {
	alert()

	$('.listView').bind('scroll', function () {
	//console.log("aaaa")
	//debounceHandler()
	//$scope.widthOnScroll();
	console.log(Math.round($(this).scrollTop() + $(this).innerHeight(),$(this)[0].scrollHeight))
	if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
	alert($scope.filteredCount)
	if ($scope.totalCount >= $scope.filteredCount) {

	debounceHandler()
	// $scope.loadMore();
	}
	}
	})
	setTimeout(function () {}, 1000)
	});*/

	$scope.scrollFn = function () {
		$('.listView').bind('scroll', function () {

			//console.log(Math.round($(this).scrollTop() + $(this).innerHeight(),$(this)[0].scrollHeight))
			if (Math.round($(this).scrollTop() + $(this).innerHeight()) >= $(this)[0].scrollHeight) {
				console.log($scope.filteredCount,$scope.totalCount)
				if ($scope.totalCount >= JSON.parse($scope.filteredCount)) {
					debounceHandler()
					// $scope.loadMore();
				}
			}
		})
	}
	setTimeout(function () {
		$scope.scrollFn()
	}, 1000)

	$scope.hello = function (value, eve) {
		$(".listView").scrollTop(0);
		var hitId = eve.currentTarget.id;
		$('.viewbtn').addClass('cmmonBtnColors').removeClass('disabledBtnColor');
		$('#' + hitId).addClass('disabledBtnColor').removeClass('cmmonBtnColors');

		if (value == "list") {
			$scope.changeViewFlag = !$scope.changeViewFlag;

		} else if (value == "grid") {
			$scope.changeViewFlag = !$scope.changeViewFlag;
		} else {
			$scope.changeViewFlag = !$scope.changeViewFlag;
		}

		GlobalService.viewFlag = $scope.changeViewFlag;
	}

	$scope.printFn = function () {
		window.print()
	}

})