

VolpayApp.service('ColpatriaService', function () {
	var data = {};
	data.clearingHouseValues = '';
	return data;
});

VolpayApp.service('AdminService', function () {
	var data = {};
	data.adminLogin = false;
	data.corporateLogin = false;
	data.approverLogin = false;
	//data.sidebarVal = [];
	return data;
});

VolpayApp.service('userProfileSave', function () {
	var data = {};
	data.themeSelected = false;
	data.languageSelected = 'en_US';
	return data;
})

VolpayApp.service('OnboardService', function () {
	var data = {};
	data.serviceDataShow = false;
	data.ReadyforBoarding = [];
	data.selectedIndex = -1;
	data.RequestID = -1;
	data.ClientName = -1;
	data.onBoardReqSaved = false;
	data.RequestDetailReqNo = -1;
	data.onboardReqData = '';
	data.deletedIndex = -1;

	data.onBoardReqSaved = false;
	data.currentServicePage = false;
	data.ReqInitiated = false;

	data.initiatedReqId = false;
	data.initiatedReqId = '';
	data.initiatedClientName = '';

	return data;
});

VolpayApp.service('userMgmtService', function () {

	var data = {};
	data.userData = [];
	data.updated = false;
	data.created = false;
	return data;

});

VolpayApp.service('DashboardService', function () {

	var data = {};
	data.allData = true;

	data.CurDis = true;
	data.InbndPayment = true;
	data.Mop = true;
	data.Status = true;

	return data;

})

VolpayApp.service('CommonService', function () {

	var data = {};

	data.refDataApproved = {
		"flag" : false,
		"msg" : ''
	}
	data.sidebarCurrentVal = '';
	data.sidebarSubVal = '';

	/*Distribution Instructions*/
	data.distInstruction = {
			currentObj: {
						"sortBy":[],
						"params":[],
						"start":0,
						"count":20
					},
			uorVal:'',
			dateFilter:{
				all:true,
				today:false,
				week:false,
				month:false,
				custom:false
			},
			searchFound:false,
			customDate:{
					startDate:'',
					endDate:''
			}
			
	}

	return data;

})

VolpayApp.service('GlobalService', function () {
	var data = {};

	data.fileDetailStatus = {
		"Status" : "",
		"Msg" : ""
	}

	data.sidebarCurrentVal = '';
	data.sidebarSubVal = '';

	data.specificData = {};
	data.Fxupdated = '';
	data.ViewClicked = true;
	data.fromAddNew = false;

	data.pwRest = false;
	data.userCreated = false;
	data.responseMessage = "";
	data.roleAdded = false;
	data.paymentRepaired = false;
	data.logoutMessage = false;
	data.passwordChanged = false;
	data.ApproveInitiated = false;
	data.PaymentApproved = false;
	data.data123_backup = -1;
	data.fileListId = -1;
	data.UniqueRefID = -1;
	data.fileListIndex = -1;
	data.enrichPaymentID = -1;
	data.enrichPaymentIDRevert = -1;
	data.ErrorMessage123 = -1;
	data.myProfileFLindex = '';
	data.editRuleBuilder = '';
	data.sidebarVal = '';
	data.viewFlag = true;

	/*** set the default sort properties ***/
	data.orderByField = 'EntryDate';
	data.sortReverse = false;
	data.sortType = 'Desc';
	data.isSortingClicked = false;
	data.DataLoadedCount = 20;

	data.fromDashboard = false;
	data.FLuir = '';
	data.all = true;
	data.today = false;
	data.week = false;
	data.month = false;
	data.custom = false;
	data.todayDate = '';
	data.weekStart = '';
	data.weekEnd = '';
	data.monthStart = '';
	data.monthEnd = '';
	data.selectCriteriaTxt = 'All';
	data.selectCriteriaID = 1;
	data.prev = 'all';
	data.prevSelectedTxt = 'all';
	data.prevId = 1;

	data.startDate = '';
	data.endDate = '';
	data.ShowStartDate = '';
	data.ShowEndDate = '';
	data.searchClicked = false;
	data.isEntered = false;
	data.advancedSearch = true;
	data.advancedSearchEnable = false;
	data.uirTxtValue = '';

	data.searchNameDuplicated = false;
	data.SelectSearchVisible = false;

	data.searchname = '';
	data.FieldArr = [];
	data.fromMyProfilePage = false;
	data.searchParams = {
		"InstructionData" : {
			"EntryDate" : {
				"Start" : "",
				"End" : ""
			}
		}
	};

	data.AandN = {
		'AlertId' : '',
		'NotifCount' : '',
		'NotifData' : [],
		'functions' : {}
	};

	data.AandN.functions = {
		anchorSmoothScroll : function (eID) {
			$('.panel-heading,.RowId').removeClass('alertHighlight');
			$('#' + eID).addClass('alertHighlight');
			$('#Row_' + eID).addClass('alertHighlight');
			$('#star_' + eID).find('i').addClass('fa-star-o').removeClass('fa-star');
			//var startY = currentYPosition();
			if (!data.viewFlag) {
				eID = 'Row_' + eID;
			}

			console.log($('#' + eID + '').offset().top, $('.AlertandScroll').offset().top, ($('#' + eID + '').offset().top) - $('.AlertandScroll').offset().top)
			//	function scrollDown()
			//{
			//$("html, body").animate({ scrollTop: $(document).height() },'slow');
			$('.listView').animate({
				scrollTop : ($('#' + eID + '').offset().top) - $('.AlertandScroll').offset().top
			}, 'slow')
			//}

			//setInterval(scrollDown,1000);

			// var stopY = elmYPosition(eID) - 100;
			// var distance = stopY > startY ? stopY - startY : startY - stopY;
			// if (distance < 100) {
			// 	scrollTo(0, stopY); return;
			// }
			// var speed = Math.round(distance / 10);
			// if (speed >= 20) speed = 20;
			// var step = Math.round(distance / 25);
			// var leapY = stopY > startY ? startY + step : startY - step;
			// var timer = 0;
			// if (stopY > startY) {
			// 	for ( var i=startY; i<stopY; i+=step ) {
			// 		setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
			// 		leapY += step; if (leapY > stopY) leapY = stopY; timer++;
			// 	} return;
			// }
			// for ( var i=startY; i>stopY; i-=step ) {
			// 	setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
			// 	leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
			// }


			// function currentYPosition() {
			// 	// Firefox, Chrome, Opera, Safari
			// 	if (self.pageYOffset) return self.pageYOffset;
			// 	// Internet Explorer 6 - standards mode
			// 	if (document.documentElement && document.documentElement.scrollTop)
			// 		return document.documentElement.scrollTop;
			// 	// Internet Explorer 6, 7 and 8
			// 	if (document.body.scrollTop) return document.body.scrollTop;
			// 	return 0;
			// }


			// function elmYPosition(eID) {
			// 	var elm = document.getElementById(eID);
			// 	var y = elm.offsetTop;
			// 	var node = elm;
			// 	while (node.offsetParent && node.offsetParent != document.body) {
			// 		node = node.offsetParent;
			// 		y += node.offsetTop;
			// 	} return y;
			// }
		},
		assignClassName : function () {
			for (var k in data.AandN['NotifData'].NotifyContent) {
				if (data.AandN['NotifData'].NotifyContent[k]['status'] == true) {
					$('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('a').attr('title', 'New');
					$('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('i').addClass('fa-star').removeClass('fa-star-o');
				} else {
					$('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('i').addClass('fa-star-o').removeClass('fa-star');
					$('#star_' + data.AandN['NotifData'].NotifyContent[k]['alertID']).find('a').attr('title', 'Viewed');
				}
			}
		}

	}

	return data;

});

VolpayApp.service('AllPaymentsGlobalData', function () {

	var data = {};

	/*** set the default sort properties ***/
	data.orderByField = 'ReceivedDate';
	data.sortReverse = false;
	data.sortType = 'Desc';
	data.isSortingClicked = false;

	data.DataLoadedCount = 20;
	data.myProfileFLindex = '';

	/*** Noramal Search ***/
	data.all = true;
	data.today = false;
	data.week = false;
	data.month = false;
	data.custom = false;

	data.FLuir = '';

	data.startDate = '';
	data.endDate = '';
	data.ShowStartDate = '';
	data.ShowEndDate = '';

	data.todayDate = '';
	data.weekStart = '';
	data.weekEnd = '';
	data.monthStart = '';
	data.monthEnd = '';

	data.selectCriteriaTxt = 'All';
	data.selectCriteriaID = 1;
	data.prev = 'all';
	data.prevSelectedTxt = 'all';
	data.prevId = 1;

	data.searchClicked = false;
	data.isEntered = false;

	data.fromDashboard = false;

	/****** Advanced Search ********/
	data.advancedSearchEnable = false;
	data.searchParams = {
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

	data.searchNameDuplicated = false;
	data.SelectSearchVisible = false;
	data.searchname = '';

	data.fromMyProfilePage = false;
	data.FieldArr = [];
	data.FromDashboardFieldArr = [];

	data.allPaymentDetails = "";
	return data;
});

function underScrReplace(val) {
	return val.replace(/_/g, ' ');
}

VolpayApp.filter("ucwords", function () {
	return function (input) {
		if (input) { //when input is defined the apply filter
			input = input.toLowerCase().replace(/\b[a-z]/g, function (letter) {
					return letter.toUpperCase();
				});
		}
		return input;
	}
})

VolpayApp.filter("numbers", function () {
	return function (input) {
		console.log(input, "aa")
		if (input) { //when input is defined the apply filter
			input = Number(input)
		}
		return input;
	}
})

VolpayApp.filter('nospace', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/ /g, '');

	};
});

VolpayApp.filter('underscoreRemove', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/_/g, ' ');
	};
});

VolpayApp.filter('removeSpace', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/\s+/g, '');
	};
});
VolpayApp.filter('addunderscore', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/\s+/g, '_');
	};
});

VolpayApp.filter('camelCaseFormatter', function () {
	return function (string) {
		string = string.replace(/([a-z])([A-Z])/g, '$1 $2');
		string = string.replace(/([A-Z])([A-Z][a-z])/g, '$1 $2')
			return string;
	};
});

VolpayApp.filter('dateFormat', function () {

	return function (val) {

		if (val) {
			var value = val.split('T');
			var dateVal = value[0];
			var time,
			timezone,
			stdFormat;

			time = value[1];
			stdFormat = dateVal + " | " + time;

			return stdFormat;
		}
	};
});

VolpayApp.filter('datetime', function ($filter) {
	return function (input) {
		if (input == null) {
			return "";
		}
		var _date = $filter('date')(new Date(input), 'dd-MM-yyyy | HH:mm:ss' + ':' + new Date().getMilliseconds());
		return _date.toUpperCase();

	};
});

VolpayApp.filter('HTMLEntityDecode', function () {

	return function (value) {
		return (!value) ? '' : value.replace(/&#(\d{2});/g, ' ');
	};
});

VolpayApp.filter('ParseLast2Char', function () {

	return function (value) {
		return (!value) ? '' : value.slice(-2);
	};
});

VolpayApp.filter('hex2a', function () {
	return function (hex) {
		var str = '';
		for (var i = 0; i < hex.length; i += 2) {
			var v = parseInt(hex.substr(i, 2), 16);
			if (v)
				str += String.fromCharCode(v);
		}
		str = str.replace(/&lt;/g, '<');
		str = str.replace(/&gt;/g, '>');
		return str;
	};
});

VolpayApp.filter('stringToHex', function () {

	return function (str) {
		var hex = '';
		for (var i = 0; i < str.length; i++) {
			hex += '' + str.charCodeAt(i).toString(16);
		}
		return hex;
	}
})

VolpayApp.filter("cleanItem", function () {
	return function (text) {
		return text ? String(text).replace(/"<[^>]+>/gm, '') : '';
	}
});

function stringToHex(str) {
	var hex = '';
	for (var i = 0; i < str.length; i++) {
		hex += '' + str.charCodeAt(i).toString(16);
	}
	return hex;
}

function hexToString(hex) {
	var str = '';
	for (var i = 0; i < hex.length; i += 2) {
		var v = parseInt(hex.substr(i, 2), 16);
		if (v)
			str += String.fromCharCode(v);
	}
	str = str.replace(/&lt;/g, '<');
	str = str.replace(/&gt;/g, '>');
	return str;
};

VolpayApp.filter('removeSlaceN', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/\n/g, '<br>');
	};
});

VolpayApp.filter('removeSlaceNN', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/\\n/g, '<br>');
	};
});

VolpayApp.filter('unique', function () {
	return function (collection, keyname) {
		var output = [],
		keys = [];

		angular.forEach(collection, function (item) {
			var key = item[keyname];
			if (keys.indexOf(key) === -1) {
				keys.push(key);
				output.push(item);
			}
		});
		return output;
	};
});

VolpayApp.factory('PersonService', function ($http) {

	var items = [];
	var txtVal = ''
		var txtBoxVal = '';

	var fileObj = {};
	fileObj.UserId = '';
	fileObj.UserId = sessionStorage.UserID;

	function objBuilderQueryField(val, WC) {
		var Obj = {}
		obj.Operator = "AND";
		var ff = val.split('=');
		Obj.ColumnName = ff[0];

		if (val.indexOf("EntryDateBetween") > -1) {
			WC = "great";
			Obj.ColumnName = "EntryDate";
		}

		if (val.indexOf("EndDateBetween") > -1) {
			WC = "less";
			Obj.ColumnName = "EntryDate"
		}

		if (val.indexOf("TransportName") > -1) {
			WC = "WC";
		}

		if (WC == "WC") {
			Obj.ColumnOperation = "like";
			Obj.ColumnValue = '%' + ff[1] + '%';
		} else if (WC == "less") {
			Obj.ColumnOperation = "<=";
			Obj.ColumnValue = ff[1];
		} else if (WC == 'great') {
			Obj.ColumnOperation = ">=";
			Obj.ColumnValue = ff[1];
		} else {
			Obj.ColumnOperation = "=";
			Obj.ColumnValue = ff[1];
		}

		return Obj;
	}

	function objBuilderQueryOrder(field, type) {
		var Obj = {}
		Obj.ColumnName = field;
		Obj.ColumnOrder = type;
		return Obj;
	}

	//POSTING Object
	obj = {};
	//obj.IsReadAllRecord=true;
	//obj.UserId=sessionStorage.UserID;
	obj.start = 0;
	obj.count = 20;

	return {
		totalFileStatus : function (fileStatusList) {

			//var ob={}
			//ob.UserId=sessionStorage.UserID;
			return $http.get(BASEURL + RESTCALL.UniqueFileListStatus).then(function (response) {
				items = response.data;
				return items;
			}, function (err) {

				console.log(err)
				return err;
			});

		},
		getFeedNewAllSorting : function (txtVal, orderByField, sortType, count, dateSelected) {

			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = count;

			if (txtVal) {
				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}
			} else {
				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}
			}

			sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
			sessionStorage.currentObj = JSON.stringify(obj);
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;

			}, function (err) {
				return err;
			});

		},

		getFeedNewAllCustomSorting : function (val1, val2, txtVal, orderByField, sortType, count) {

			if ((val1 != null) && (val2 != null)) {

				//fileObj.UserId = sessionStorage.UserID;
				// obj.UserId=sessionStorage.UserID;
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = 0;
				obj.count = count;

				if (txtVal) {
					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
				} else {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
				}

				var dummy = {};
				sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
				sessionStorage.currentObj = JSON.stringify(obj);
				obj = constructQuery(obj)
					return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
						items = response.data;
						dummy.response = 'Success';
						dummy.data = response.data;
						return dummy;
					}, function (err) {
						dummy.response = 'Error';
						dummy.data = err.data;
						return dummy;
					});
			}

		},

		advancedSearchSorting : function (orderByField, sortType, countVal, dateSelected, fieldArr) {
			// fileObj.UserId = sessionStorage.UserID;
			//obj.UserId=sessionStorage.UserID;
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < fieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
			}

			sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
			sessionStorage.currentObj = JSON.stringify(obj);
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});
		},

		filterData : function (txtVal, dateSelected, orderByField, sortType) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = 20;

			if (txtVal) {
				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}
			} else {
				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}

			}

			sessionStorage.removeItem('currentObj');
			sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
			sessionStorage.currentObj = JSON.stringify(obj);
			obj = constructQuery(obj)
				var dummy = {}
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success'
					dummy.data = response.data
					return dummy;
			}, function (err) {
				dummy.response = 'Error'
					dummy.data = err.data
					return dummy;
			});
		},

		customSearch : function (val1, val2, txtVal, orderByField, sortType) {
			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = 0;
				obj.count = 20;

				if (txtVal) {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
				} else {

					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
				}

				sessionStorage.removeItem('currentObj');
				sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
				sessionStorage.currentObj = JSON.stringify(obj);
				obj = constructQuery(obj)
					var dummy = {};
				return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
			}
		},
		retainSearchResults : function (FieldArr, countVal, dateSelected, orderByField, sortType) {

			sessionStorage.advancedSearchFieldArr = JSON.stringify(FieldArr);
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < FieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
			}

			sessionStorage.removeItem('currentObj');
			sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
			sessionStorage.currentObj = JSON.stringify(obj);
			obj = constructQuery(obj)

				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});

		},

		customSearchloadmore : function (val1, val2, txtVal, startVal, orderByField, sortType) {

			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.count = 20;

				if (txtVal) {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
					obj.start = startVal;

				} else {

					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
					obj.start = startVal;

				}
				obj = constructQuery(obj)
					var dummy = {};
				return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});

			}
		},

		filterDataLoadmore : function (txtVal, startVal, dateSelected, orderByField, sortType) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.count = 20;
			if (txtVal) {
				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
				obj.start = startVal;

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}
			} else {
				obj.start = startVal;
				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}
			}
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});
		},
		sortingLoadmore : function (txtVal, orderByField, sortType, countVal, dateSelected) {

			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (txtVal) {
				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}

			} else {

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
				}

				// fileObj.Data = btoa(JSON.stringify(obj));

			}
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});

		},

		sortingCustomSearchLoadmore : function (val1, val2, txtVal, orderByField, sortType, countVal) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if ((val1 != null) && (val2 != null)) {
				if (txtVal) {

					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));
					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
				} else {

					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

				}
				obj = constructQuery(obj)
					var dummy = {};
				return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
			}
		},

		advancedSortingLoadmore : function (orderByField, sortType, countVal, dateSelected, FieldArr) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < FieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
			}

			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});

		},

		advancedSearchCustomSorting : function (val1, val2, orderByField, sortType, countVal, fieldArr) {

			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = 0;
				obj.count = countVal;

				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

				for (var l = 0; l < fieldArr.length; l++) {
					obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
				}

				// fileObj.Data = btoa(JSON.stringify(obj));
				sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
				sessionStorage.currentObj = JSON.stringify(obj);
				obj = constructQuery(obj)
					var dummy = {};

				return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});

			}
		},
		advancedCustomSortingLoadmore : function (val1, val2, orderByField, sortType, countVal, fieldArr) {

			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;
			obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val1, "great"));
			obj.Queryfield.push(objBuilderQueryField("EntryDate=" + val2, "less"));

			for (var l = 0; l < fieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
			}
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
		},

		advancedSearch : function (fieldArr, dateSelected, orderByField, sortType) {

			sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = 20;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < fieldArr.length; l++) {

				obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
			}

			sessionStorage.removeItem('currentObj');
			sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
			sessionStorage.currentObj = JSON.stringify(obj);
			obj = constructQuery(obj)

				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});
		},
		advancedCustomSearch : function (fieldArr, customStrdDate, customEndDate, orderByField, sortType) {

			sessionStorage.advancedSearchFieldArr = JSON.stringify(fieldArr);
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customStrdDate, "great"));
			obj.Queryfield.push(objBuilderQueryField("EntryDate=" + customEndDate, "less"));
			obj.start = 0;
			obj.count = 20;

			for (var l = 0; l < fieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
			}

			sessionStorage.removeItem('currentObj');
			sessionStorage.FileListCurrentRESTCALL = BASEURL + RESTCALL.AllFileListREST;
			sessionStorage.currentObj = JSON.stringify(obj);
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				console.log(response)
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});

		},
		advancedSearchLoadmore : function (startVal, dateSelected, orderByField, sortType) {

			var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("EntryDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < REST.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(REST[l]))
			}
			obj.start = startVal;
			obj.count = 20;

			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});
		},
		advancedCustomSearchLoadmore : function (startVal, customStrdDate, customEndDate, orderByField, sortType) {
			var REST = JSON.parse(sessionStorage.advancedSearchFieldArr);

			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

			obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
			obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));
			obj.start = startVal;
			obj.count = 20;
			for (var l = 0; l < REST.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(REST[l]))
			}
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllFileListREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});

		},
		refreshAll : function () {
			var obj = JSON.parse(sessionStorage.currentObj);
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(sessionStorage.FileListCurrentRESTCALL, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});
		}
	}
})

VolpayApp.factory('RefService', function ($http) {

	var txtVal = '';
	var items = [];

	var PaymentObj = {};
	PaymentObj.UserId = sessionStorage.UserID;

	function objBuilderQueryField(val, WC) {

		var Obj = {};
		obj.Operator = "AND";

		var ff = val.split('=');
		Obj.ColumnName = ff[0];

		/*** To Add Entry Date in Advanced Search ***/
		if (val.indexOf("EntryDateBetween") > -1) {
			WC = "great";
			Obj.ColumnName = "ReceivedDate";
		}

		if (val.indexOf("EndDateBetween") > -1) {
			WC = "less";
			Obj.ColumnName = "ReceivedDate"
		}

		/*** To Add Value Date in Advanced Search ***/
		if (val.indexOf("ValueStartDate") > -1) {
			WC = "great";
			Obj.ColumnName = "ValueDate";
		}

		if (val.indexOf("ValueEndDate") > -1) {
			WC = "less";
			Obj.ColumnName = "ValueDate"
		}

		/*** To Add Amount in Advanced Search ***/
		if (val.indexOf("AmountStart") > -1) {
			WC = "great";
			Obj.ColumnName = "Amount";
		}

		if (val.indexOf("AmountEnd") > -1) {
			WC = "less";
			Obj.ColumnName = "Amount"
		}

		if (WC == "WC") {
			Obj.ColumnOperation = "like";
			Obj.ColumnValue = '%' + ff[1] + '%';
		} else if (WC == "less") {
			Obj.ColumnOperation = "<=";
			Obj.ColumnValue = ff[1];
		} else if (WC == 'great') {
			Obj.ColumnOperation = ">=";
			Obj.ColumnValue = ff[1];
		} else {
			Obj.ColumnOperation = "=";
			Obj.ColumnValue = ff[1];
		}

		return Obj;
	}

	function objBuilderQueryOrder(field, type) {
		var Obj = {}
		Obj.ColumnName = field;
		Obj.ColumnOrder = type;
		//obj.Operator = 'AND';
		return Obj;
	}
	//POSTING Object
	obj = {};
	//obj.IsReadAllRecord=true;
	//obj.UserId=sessionStorage.UserID;
	obj.start = 0;
	obj.count = 20;
	obj.Operator = 'AND';

	//	console.log("obj",obj)

	return {

		GetUniquePaymentDropdown : function () {

			return $http.get(BASEURL + RESTCALL.UniquePaymentData).then(function (response) {
				items = response.data;
				return items;
			}, function (err) {

				console.log(err)
				return err;
			});
		},
		getFeedNewAllSorting : function (txtVal, orderByField, sortType, count, dateSelected) {

			
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = count;

			if (txtVal) {

				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}

			} else {

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}
			}

			sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
			sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
			var dummy = {};

			obj = constructQuery(obj)



				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
		},

		getFeedNewAllCustomSorting : function (val1, val2, txtVal, orderByField, sortType, count) {

			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = 0;
				obj.count = count;

				if (txtVal) {

					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

				} else {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

				}

				sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
				sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
				var dummy = {};
				obj = constructQuery(obj)
					return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
						items = response.data;
						dummy.response = 'Success';
						dummy.data = response.data;
						return dummy;
					}, function (err) {
						dummy.response = 'Error';
						dummy.data = err.data;
						return dummy;
					});
			}

		},

		filterData : function (txtVal, orderByField, sortType, dateSelected) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = 20;

			if (txtVal) {

				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}
			} else {

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}

			}
			sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
			sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
		},

		customSearch : function (val1, val2, txtVal, orderByField, sortType) {
			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = 0;
				obj.count = 20;

				if (txtVal) {

					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
				} else {

					obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
				}

				sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
				sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
				var dummy = {};
				obj = constructQuery(obj)
					return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
						items = response.data;
						dummy.response = 'Success';
						dummy.data = response.data;
						return dummy;
					}, function (err) {
						dummy.response = 'Error';
						dummy.data = err.data;
						return dummy;
					});
			}
		},

		filterDataLoadmore : function (txtVal, orderByField, sortType, startVal, dateSelected) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = startVal;
			obj.count = 20;

			if (txtVal) {
				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}
			} else {
				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {

					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}

			}
			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});

		},

		dropDownLoadMore : function (startVal) {
			obj.start = startVal;
			var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});
		},

		customSearchLoadmore : function (val1, val2, txtVal, orderByField, sortType, startVal) {
			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = startVal;
				obj.count = 20;

				if (txtVal) {

					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));
				} else {

					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
				}

				var dummy = {};
				obj = constructQuery(obj)
					return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
						items = response.data;
						dummy.response = 'Success';
						dummy.data = response.data;
						return dummy;
					}, function (err) {
						dummy.response = 'Error';
						dummy.data = err.data;
						return dummy;
					});
			}
		},

		sortingLoadmore : function (txtVal, orderByField, sortType, countVal, dateSelected) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (txtVal) {
				obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}
			} else {

				if (dateSelected == "Today") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
				} else if (dateSelected == "Week") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
				} else if (dateSelected == "Month") {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
				}

			}
			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});

		},

		advancedSortingLoadmore : function (orderByField, sortType, countVal, dateSelected, FieldArr) {

			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < FieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
			}

			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});

		},

		advancedCustomSortingLoadmore : function (val1, val2, orderByField, sortType, countVal, FieldArr) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;
			obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
			obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

			for (var l = 0; l < FieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
			}

			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
		},

		sortingCustomSearchLoadmore : function (val1, val2, txtVal, orderByField, sortType, countVal) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if ((val1 != null) && (val2 != null)) {
				if (txtVal) {
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));
					obj.Queryfield.push(objBuilderQueryField("InstructionID=" + txtVal, "WC"));

				} else {

					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
					obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

				}
				var dummy = {};
				obj = constructQuery(obj)
					return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
						items = response.data;
						dummy.response = 'Success';
						dummy.data = response.data;
						return dummy;
					}, function (err) {
						dummy.response = 'Error';
						dummy.data = err.data;
						return dummy;
					});
			}
		},

		advancedSearchSorting : function (orderByField, sortType, countVal, dateSelected, fieldArr) {

			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < fieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
			}

			sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
			sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
		},

		advancedSearchCustomSorting : function (val1, val2, orderByField, sortType, countVal, fieldArr) {
			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = 0;
				obj.count = countVal;

				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

				for (var l = 0; l < fieldArr.length; l++) {
					obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
				}

				sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
				sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

				obj = constructQuery(obj)
					return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
						items = response.data;
						dummy.response = 'Success';
						dummy.data = response.data;
						return dummy;
					}, function (err) {
						dummy.response = 'Error';
						dummy.data = err.data;
						return dummy;
					});

			}

		},

		advancedSearch : function (fieldArr, orderByField, sortType, dateSelected) {
			sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(fieldArr);
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = 20;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < fieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
			}

			sessionStorage.removeItem('AllPaymentsCurrentObject');
			sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
			sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);

			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});

		},

		advancedCustomSearch : function (fieldArr, customStrdDate, customEndDate, orderByField, sortType) {
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = 20;

			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customStrdDate, "great"));
			obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + customEndDate, "less"));

			for (var l = 0; l < fieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(fieldArr[l]))
			}

			sessionStorage.removeItem('AllPaymentsCurrentObject');
			sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
			sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
		},

		advancedSearchLoadmore : function (orderByField, sortType, startVal, dateSelected, FieldArr) {

			var REST = JSON.parse(sessionStorage.advancedSearchPaymentsFieldArr);
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));

			obj.start = startVal;
			obj.count = 20;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
			} else if (dateSelected == "Week") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < REST.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(REST[l]))
			}
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});
		},

		advancedSearchCustomLoadmore : function (val1, val2, orderByField, sortType, startVal) {
			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

				obj.start = startVal;
				obj.count = 20;
				obj = constructQuery(obj)
					var dummy = {};
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
			}

		},

		retainSearchResults : function (FieldArr, orderByField, sortType, countVal, dateSelected) {

			sessionStorage.advancedSearchPaymentsFieldArr = JSON.stringify(FieldArr);
			obj.QueryOrder = [];
			obj.Queryfield = [];
			obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
			obj.start = 0;
			obj.count = countVal;

			if (dateSelected == "Today") {
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + todayDate()));
			} else if (dateSelected == "Week") {

				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + week().todayDate, "less"));
			} else if (dateSelected == "Month") {

				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().lastDate, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + month().todayDate, "less"));
			}

			for (var l = 0; l < FieldArr.length; l++) {
				obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
			}

			sessionStorage.removeItem('AllPaymentsCurrentObject');
			sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
			sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
			obj = constructQuery(obj)
				var dummy = {};
			return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
				items = response.data;
				dummy.response = 'Success';
				dummy.data = response.data;
				return dummy;
			}, function (err) {
				dummy.response = 'Error';
				dummy.data = err.data;
				return dummy;
			});

		},

		retainCustomSearchResults : function (val1, val2, FieldArr, orderByField, sortType, countVal) {

			if ((val1 != null) && (val2 != null)) {
				obj.QueryOrder = [];
				obj.Queryfield = [];
				obj.QueryOrder.push(objBuilderQueryOrder(orderByField, sortType));
				obj.start = 0;
				obj.count = countVal;

				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val1, "great"));
				obj.Queryfield.push(objBuilderQueryField("ReceivedDate=" + val2, "less"));

				for (var l = 0; l < FieldArr.length; l++) {
					obj.Queryfield.push(objBuilderQueryField(FieldArr[l]))
				}

				sessionStorage.removeItem('AllPaymentsCurrentObject');
				sessionStorage.AllPaymentsCurrentRESTCALL = BASEURL + RESTCALL.AllPaymentsREST;
				sessionStorage.AllPaymentsCurrentObject = JSON.stringify(obj);
				obj = constructQuery(obj)
					var dummy = {};
				return $http.post(BASEURL + RESTCALL.AllPaymentsREST, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});
			}

		},

		refreshAll : function () {
			var obj = JSON.parse(sessionStorage.AllPaymentsCurrentObject);
			var dummy = {};
			obj = constructQuery(obj)
				return $http.post(sessionStorage.AllPaymentsCurrentRESTCALL, obj).then(function (response) {
					items = response.data;
					dummy.response = 'Success';
					dummy.data = response.data;
					return dummy;
				}, function (err) {
					dummy.response = 'Error';
					dummy.data = err.data;
					return dummy;
				});

		}

	}
});

VolpayApp.factory('PersonService1', function ($http) {
	return {
		GetChart1 : function () {
			return $http.get('config/chartData.json').success(function (data) {
				return data;
			});
		}
	}
})

VolpayApp.factory('ForcePWChange', function ($http) {

	return {
		log : function (loginData) {
			var loginObj = {};
			loginObj.UserId = loginData.UserId;
			loginObj.Data = btoa(JSON.stringify(loginData));
			$http.post(BASEURL + RESTCALL.LoginREST, loginObj).success(function (response) {
				return response;
			}, function (err) {
				return err;
			});
		}
	}
})

var todayDate = function () {
	var date = new Date();
	FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	return FromDate;
}

var custmtodayDate = function () {
	var date = new Date();
	FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	return {
		todayDate : FromDate,
		lastDate : FromDate
	};
}
var todayDateForRemark = function () {

	var date = new Date();
	//FromDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
	FromDate = ('0' + (date.getMonth() + 1)).slice(-2) + '/' + ('0' + date.getDate()).slice(-2) + '/' + date.getFullYear();
	return FromDate;

}

var week = function () {

	var today = new Date();
	var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

	var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
	var lastDate = lastWeek.getFullYear() + '-' + ('0' + (lastWeek.getMonth() + 1)).slice(-2) + '-' + ('0' + lastWeek.getDate()).slice(-2);

	return {
		todayDate : todayDate,
		lastDate : lastDate
	};

}

var month = function () {

	var today = new Date()
		var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

	var priorDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 31);
	var lastDate = priorDate.getFullYear() + '-' + ('0' + (priorDate.getMonth() + 1)).slice(-2) + '-' + ('0' + priorDate.getDate()).slice(-2);
	return {
		todayDate : todayDate,
		lastDate : lastDate
	};

}

var year = function () {

	var today = new Date()
		var todayDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
	var lastDate = today.getFullYear() + '-' + '01' + '-' + '01';
	return {
		todayDate : todayDate,
		lastDate : lastDate
	};

}

var clrs = {
	"ACTIVE" : "#4155c3",
	"SUSPENDED" : "#00BCD4",
	"CREATED" : "#03a9f4",
	"WAITINGFORAPPROVAL" : "#CDDC39",
	"APPROVED" : "#4caf50",
	"FORREVISION" : "#673ab7",
	"REJECTED" : "#d81f12",
	"DELETED" : "#708090",
	"PENDINGAPPROVAL" : "#ff9800"
}

VolpayApp.filter('chooseStatus', function () {
	return function (val) {
		if (val) {
			val = val.toUpperCase();
			val = val.replace(/\s+/g, '');
			return clrs[val]
		} else {
			return '#666'
		}
	}
})

var alertSize = function () {
	var mq = window.matchMedia("(max-width: 991px)");
	var headHeight,
	alertWidth;
	if (mq.matches) {
		headHeight = 0;
		alertWidth = $('.tab-content').width();
	} else {
		alertWidth = $('.tab-content').width();
		headHeight = $('.page-header').outerHeight(true) + 10;
	}
	return {
		headHeight : headHeight,
		alertWidth : alertWidth
	};

}

function getTime() {
	var now = new Date();
	return ((now.getMonth() + 1) + '-' +
		(now.getDate()) + '-' +
		now.getFullYear() + " " +
		now.getHours() + '-' +
		((now.getMinutes() < 10)
			 ? ("0" + now.getMinutes())
			 : (now.getMinutes())) + ':' +
		((now.getSeconds() < 10)
			 ? ("0" + now.getSeconds())
			 : (now.getSeconds())));
	//console.log("Calling");
}

function encodeRFC5987ValueChars(str) {
	return encodeURIComponent(str).
	// Note that although RFC3986 reserves "!", RFC5987 does not,
	// so we do not need to escape it
	replace(/['()]/g, escape).// i.e., %27 %28 %29
	replace(/\*/g, '%2A').
	// The following are not required for percent-encoding per RFC5987,
	// so we can allow for a little better readability over the wire: |`^
	replace(/%(?:7C|60|5E)/g, unescape);
}

var idleService = function ($rootScope, $timeout, $log) {
	var idleTimer = null,
	startTimer = function () {
		console.log('Starting timer');
		idleTimer = $timeout(timerExpiring, 10000);
	},
	stopTimer = function () {
		if (idleTimer) {
			$timeout.cancel(idleTimer);
		}
	},
	resetTimer = function () {
		stopTimer();
		startTimer();
	},
	timerExpiring = function () {
		stopTimer();
		$rootScope.$broadcast('sessionExpiring');
		console.log('Timer expiring ..');
	};

	startTimer();

	return {
		startTimer : startTimer,
		stopTimer : stopTimer,
		resetTimer : resetTimer
	};
};

VolpayApp.filter('slashRemover', function () {
	return function (value) {
		return (!value) ? '' : value.replace(/\//g, '/\n');
	};
});

VolpayApp.filter('specialCharactersRemove', function () {

	return function (value) {
		return value.replace(/[^a-zA-Z0-9]/g, "")
	};

})

VolpayApp.filter('trim', function () {
	return function (value) {
		return value.replace(/' '/g, ''); // you could use .trim, but it's not going to work in IE<9
	};
});

/*** Mod 3 ***/
VolpayApp.filter('mod3', function () {

	return function (value) {
		return (value / 3).toFixed(1).split('.')[1]
	};
});

VolpayApp.filter('pwFormat', function () {

	return function (value) {

		if (value) {
			var a = '';
			for (var i = 0; i < value.length; i++) {
				a = a + '*';
			}
			return a;
		}
	}
});

var fetchErrorMessage = function (error) {

	html = $.parseHTML(error),
	nodeNames = [];
	html1 = $.parseHTML(html[6].innerHTML),
	nodeNames = [];
	console.log(html1);

	var t = html1[2].innerHTML;
	var objs = JSON.parse(t);
	//console.log(objs);
	//return 'REST OPERATION - ' +objs.RestOperation +' / Error - '+objs.ErrorMessage ;
	return objs.ErrorMessage;

	/*
	console.log(objs[0].Message);

	t = t.replace(/&gt;/g, ">").replace(/&lt;/g, "<").replace(/"/g, '"');
	str = t.slice(2, -2);
	var temp = new Array();
	temp = str.split('"');
	console.log(temp);

	//console.log(temp[11].replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\/g, ""));
	var xmlValue=temp[11].replace(/\\n/g, "").replace(/\\t/g, "").replace(/\\/g, "");
	xmlDoc = $.parseXML(xmlValue),
	$xml = $(xmlDoc),

	$title = $xml.find("Message");
	ErrorCode = $xml.find("ErrorCode");
	 */

}

function allowOnlyNumbersAlone(eve) {

	if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
		return true;
	} else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
		return false;
	} else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
		return false;
	} else {
		return true;
	}

}

function keyupfn(eve) {
	if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
		return true;
	} else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
		return false;
	} else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
		var a = $(eve.currentTarget).val()
			var b = a.replace(/[^0-9]/gi, '')
			$(eve.currentTarget).val(b)
			return false;
	} else {
		return true;
	}

}

function allowOnlyNumbersDecimalAlone(eve) {
	if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
		return true;
	} else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
		return true;
	} else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
		return false;
	} else {
		return true;
	}

}

function decimalKeyup(eve) {
	if ((eve.ctrlKey && eve.keyCode == 67) || (eve.ctrlKey && eve.keyCode == 86) || (eve.ctrlKey && eve.keyCode == 65)) {
		return true;
	} else if ((eve.keyCode == 110) || (eve.keyCode == 190)) {
		return true;
	} else if ((eve.keyCode > 64 && eve.keyCode < 91) || (eve.keyCode > 218 && eve.keyCode < 223) || (eve.keyCode > 185 && eve.keyCode < 192) || (eve.shiftKey && eve.keyCode > 47 && eve.shiftKey && eve.keyCode < 58) || (eve.keyCode == 59) || (eve.keyCode == 106) || (eve.keyCode == 107) || (eve.keyCode == 109) || (eve.keyCode == 111)) {
		var a = $(eve.currentTarget).val()
			var b = a.replace(/[^0-9]/gi, '')
			$(eve.currentTarget).val(b)
			return false;
	} else {
		return true;
	}

}

/*function removeTags(eve){

}*/

function removeFromArr(arr) {
	var what,
	a = arguments,
	L = a.length,
	ax;
	while (L > 1 && arr.length) {
		what = a[--L];
		while ((ax = arr.indexOf(what)) !== -1) {
			arr.splice(ax, 1);
		}
	}
	return arr;
}

function tabOrder(eve) {

	if ((eve.keyCode == 8) || (eve.keyCode == 9)) {
		return true
	} else {
		return false;
	}

}

function spaceNotAllowed(eve) {
	if (eve.keyCode == 32) {
		return false;
	} else {
		return true;
	}
}

VolpayApp.factory('LogoutService', function ($http, $location) {
	return {
		Logout : function () {

			$http.defaults.headers.common['Authorization'] = 'SessionToken:' + sessionStorage.SessionToken;
			$http({
				url : BASEURL + RESTCALL.LogoutREST,
				method : "POST",
				data : {
					UserId : sessionStorage.UserID
				},
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {

				delete $http.defaults.headers.common['Authorization'];
				sessionStorage.clear()

				uiConfiguration()
				if (configData.Authorization == 'External') {
					if (diffRestServer.LogoutUrl != undefined) {
						window.location.href = diffRestServer.LogoutUrl;
					} else {						
						window.location.href = configData['LogoutUrl'];
					}
				} else {
					if(configData.IsRESTServerInSameMachine.toUpperCase()=='NO')
					{
						window.location.href = diffRestServer.LogoutUrl;
					}else{						
						//window.location.href = "/VolPayHubUI/#/login";
						$location.path("login")
					}
					//$state.go('login.signin')
				}
				//$location.path("login")
			}).error(function (data, status, headers, config) {

				delete $http.defaults.headers.common['Authorization'];
				sessionStorage.clear();
				uiConfiguration()
				//$location.path("login")
				if (configData.Authorization == 'External') {
					if (diffRestServer.LogoutUrl != undefined) {
						window.location.href = diffRestServer.LogoutUrl;
					} else {						
						window.location.href = configData['LogoutUrl'];
					}
				} else {
					if(configData.IsRESTServerInSameMachine.toUpperCase()=='NO')
					{
						window.location.href = diffRestServer.LogoutUrl;
					}else{						
						//window.location.href = "/VolPayHubUI/#/login";
						$location.path("login")
					}
					//$state.go('login.signin')
				}
			});
		}
	}
});

function s2ab(s) {

	var buf = new ArrayBuffer(s.length);
	var view = new Uint8Array(buf);

	for (var i = 0; i != s.length; ++i) {
		view[i] = s.charCodeAt(i);
	}

	return view;
}
VolpayApp.service("bankData", function ($http, $q, FileSaver, Blob) {

	// Return rest request.
	return ({
		loadMoredata : loadMoredata,
		crudRequest : crudRequest,
		exportToExcel : exportToExcel,
		textDownload : textDownload,
		ApplyTimeZone : ApplyTimeZone,
		exportToExcelHtml : exportToExcelHtml
	});

	//On Scroll Load more data from rest
	function loadMoredata(len) {
		if (len >= 20) {
			feedMore = "loadMore()";
		} else {
			feedMore = "";
		}
		return feedMore;
	}

	// I add a friend with the given name to the remote collection.
	function crudRequest(_method, _url, _data) {
		//console.log(_url);
		//console.log(_data);
		var request = $http({
				method : _method,
				url : BASEURL + _url,
				data : _data
			});
		return (request.then(handleSuccess, handleError));
	}

	// I transform the error response, unwrapping the application data from the Rest Server.
	function handleError(response) {
		return ($q.reject(response));
	}

	// I transform the successful response, unwrapping the application data from the Rest Server.
	function handleSuccess(response) {
		return (response);
	}

	function exportToExcel(content, name) {
		var data = new Blob([s2ab(content)], {
				type : 'application/vnd.sun.xml.calc;charset=utf-8'
			});
		FileSaver.saveAs(data, name + '.csv');
		/*	var data = new Blob([content], { type: 'application/vnd.sun.xml.calc;charset=utf-8' });
		FileSaver.saveAs(data, name+'.csv');

		var data = new Blob([content], { type: 'text/plain;charset=utf-8' });
		FileSaver.saveAs(data, 'text.txt');*/

	}

	function exportToExcelHtml(content, name) {
		var data = new Blob([content], {
				type : 'application/vnd.sun.xml.calc;charset=utf-8'
			});
		FileSaver.saveAs(data, name + '.xls');
	}

	function textDownload(content, name) {
		var data = new Blob([content], {
				type : 'text/plain;charset=utf-8'
			});
		FileSaver.saveAs(data, name);
	}

	function ApplyTimeZone(dataArr) {
		var totArr = dataArr;
		for (var k = 0; k < totArr.length; k++) {
			var tabSelectLen = $('.' + totArr[k]).length;
			var sel;
			for (var j = 0; j < tabSelectLen; j++) {
				var dropValues = '';
				for (var i in timeZoneDropValues.TimeZone) {
					if ($('#' + totArr[k] + '_' + j).attr('dropval') == timeZoneDropValues.TimeZone[i].TimeZoneId) {
						sel = 'selected'
					} else {
						sel = ''

					}
					dropValues = '<option value="' + timeZoneDropValues.TimeZone[i].TimeZoneId + '" ' + sel + '>' + timeZoneDropValues.TimeZone[i].TimeZoneId + '</option>' + dropValues;
				}
				$('#' + totArr[k] + '_' + j).append(dropValues)
			}
		}

	}

	/* function createPage(){
	crudRequest("GET", restServer, "")

	} */

});

VolpayApp.service("httpCall", function ($http, $q, FileSaver, Blob) {
	return ({
		crudRequest : crudRequest
	});

	// I add a friend with the given name to the remote collection.
	function crudRequest(_method, _url, _data) {
		var request = $http({
				method : _method,
				url : BASEURL + _url,
				data : _data
			});
		return (request.then(handleSuccess, handleError));
	}

	// I transform the error response, unwrapping the application data from the Rest Server.
	function handleError(response) {
		return ($q.reject(response));
	}

	// I transform the successful response, unwrapping the application data from the Rest Server.
	function handleSuccess(response) {
		return (response);
	}

})
function toUTF8Array(str) {

	var utf8 = [];
	for (var j = 0; j < str.length; j++) {
		var charcode = str.charCodeAt(j);
		if (charcode < 0x80)
			utf8.push(charcode);
		else if (charcode < 0x800) {
			utf8.push(0xc0 | (charcode >> 6),
				0x80 | (charcode & 0x3f));
		} else if (charcode < 0xd800 || charcode >= 0xe000) {
			utf8.push(0xe0 | (charcode >> 12),
				0x80 | ((charcode >> 6) & 0x3f),
				0x80 | (charcode & 0x3f));
		}
		// surrogate pair
		else {
			j++;
			// UTF-16 encodes 0x10000-0x10FFFF by
			// subtracting 0x10000 and splitting the
			// 20 bits of 0x0-0xFFFFF into two halves
			charcode = 0x10000 + (((charcode & 0x3ff) << 10)
					 | (str.charCodeAt(i) & 0x3ff));
			utf8.push(0xf0 | (charcode >> 18),
				0x80 | ((charcode >> 12) & 0x3f),
				0x80 | ((charcode >> 6) & 0x3f),
				0x80 | (charcode & 0x3f));
		}
	}
	return utf8;
}

function bin2String(array) {

	return String.fromCharCode.apply(String, array);
}
function textToBin(text) {

	var length = text.length,
	output = [];
	for (var i = 0; i < length; i++) {
		var bin = text[i].charCodeAt().toString(2);

		output.push(Array(8 - bin.length + 1).join("0") + bin);
	}
	return output.join("");
}

function encrypt(message, passphrase) {

	// generate 256 bit salt
	var salt = CryptoJS.lib.WordArray.random(256 / 8);

	// generate derived key from passphrase using SHA256, 10 iterations
	var key = CryptoJS.PBKDF2(passphrase, salt, {
			iterations : 10,
			hasher : CryptoJS.algo.SHA256
		});

	// generate 128 bit IV
	var iv = CryptoJS.lib.WordArray.random(128 / 8);

	// key is already in WordArray format, so custom IV accepted
	var encrypted = CryptoJS.AES.encrypt(message, key, {
			iv : iv
		});

	// cipher paramaters to be returned. Encoded for storage
	var cp = {};

	// encode ciphertext into base46
	cp.ciphertext = CryptoJS.enc.Base64.stringify(encrypted.ciphertext);

	// encode salt and iv to string representing hexedecimal
	cp.salt = CryptoJS.enc.Hex.stringify(salt);
	cp.iv = CryptoJS.enc.Hex.stringify(iv);

	// generate HMAC
	key_str = CryptoJS.enc.Hex.stringify(key);
	var HMAC = CryptoJS.HmacSHA256(cp.ciphertext + cp.iv, key_str);
	cp.HMAC = CryptoJS.enc.Hex.stringify(HMAC);

	return cp;
}

function decrypt(cp, passphrase) {

	// decode iv and salt from string to type WordArray
	var iv = CryptoJS.enc.Hex.parse(cp.iv);
	var salt = CryptoJS.enc.Hex.parse(cp.salt);

	// generate derived key from passphrase using SHA256, 10 iterations
	var key = CryptoJS.PBKDF2(passphrase, salt, {
			iterations : 10,
			hasher : CryptoJS.algo.SHA256
		});

	// decode ciphertext from base64 string to WordArray
	ciphertext = CryptoJS.enc.Base64.parse(cp.ciphertext);

	// calculate HMAC
	var key_str = CryptoJS.enc.Hex.stringify(key);
	var HMAC = CryptoJS.HmacSHA256(cp.ciphertext + cp.iv, key_str);
	var HMAC_str = CryptoJS.enc.Hex.stringify(HMAC);

	// compare HMACs
	if (HMAC_str != cp.HMAC) {
		return;
	}

	var _cp = CryptoJS.lib.CipherParams.create({
			ciphertext : ciphertext
		});

	var decrypted = CryptoJS.AES.decrypt(_cp, key, {
			iv : iv
		});

	return decrypted.toString(CryptoJS.enc.Utf8);

}

VolpayApp.filter('statusFilter', function () {
	return function (value) {
		//console.log(value)
		if (value) {
			return "Just Now"
		} else {
			return "Viewed"
		}
		//return value.replace(/' '/g, ''); // you could use .trim, but it's not going to work in IE<9
	};
});

VolpayApp.filter('camelCaseSpacing', function () {
	return function (value) {
		return value.replace(/([A-Z])/g, ' $1')
	};
});

VolpayApp.filter('capitalize', function () {
	return function (value) {
		return (!!value) ? value.charAt(0).toUpperCase() + value.substr(1).toLowerCase() : '';
	}
});

VolpayApp.filter('titleCase', function () {
	return function (input) {
		input = input || '';
		return input.replace(/\w\S*/g, function (txt) {
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	};
});

VolpayApp.filter('beautify', function () {

	return function (value) {
		var source = value,
		output,
		opts = {};

		opts.indent_size = $('#tabsize').val();
		opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
		opts.max_preserve_newlines = $('#max-preserve-newlines').val();
		opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
		opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
		opts.break_chained_methods = $('#break-chained-methods').prop('checked');
		opts.indent_scripts = $('#indent-scripts').val();
		opts.brace_style = $('#brace-style').val();
		opts.space_before_conditional = $('#space-before-conditional').prop('checked');
		opts.unescape_strings = $('#unescape-strings').prop('checked');
		opts.jslint_happy = $('#jslint-happy').prop('checked');
		opts.end_with_newline = $('#end-with-newline').prop('checked');
		opts.wrap_line_length = $('#wrap-line-length').val();
		opts.indent_inner_html = $('#indent-inner-html').prop('checked');
		opts.comma_first = $('#comma-first').prop('checked');
		opts.e4x = $('#e4x').prop('checked');

		if (looks_like_html(source)) {
			output = html_beautify(source, opts);
		} else {
			if ($('#detect-packers').prop('checked')) {
				source = unpacker_filter(source);
			}
			output = js_beautify(source, opts);
		}

		if (the.editor) {
			the.editor.setValue(output);
		} else {
			//console.log(output)
			return output;
		}
	};
});

var the = {
	use_codemirror : (!window.location.href.match(/without-codemirror/)),
	beautify_in_progress : false,
	editor : null // codemirror editor
};

function run_tests() {
	var st = new SanityTest();
	run_javascript_tests(st, Urlencoded, js_beautify, html_beautify, css_beautify);
	run_css_tests(st, Urlencoded, js_beautify, html_beautify, css_beautify);
	run_html_tests(st, Urlencoded, js_beautify, html_beautify, css_beautify);
	JavascriptObfuscator.run_tests(st);
	P_A_C_K_E_R.run_tests(st);
	Urlencoded.run_tests(st);
	MyObfuscate.run_tests(st);
	var results = st.results_raw()
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/ /g, '&nbsp;')
		.replace(/\r/g, '·')
		.replace(/\n/g, '<br>');
	$('#testresults').html(results).show();
}

function any(a, b) {
	return a || b;
}

function read_settings_from_cookie() {
	$('#tabsize').val(any($.cookie('tabsize'), '4'));
	$('#brace-style').val(any($.cookie('brace-style'), 'collapse'));
	$('#detect-packers').prop('checked', $.cookie('detect-packers') !== 'off');
	$('#max-preserve-newlines').val(any($.cookie('max-preserve-newlines'), '5'));
	$('#keep-array-indentation').prop('checked', $.cookie('keep-array-indentation') === 'on');
	$('#break-chained-methods').prop('checked', $.cookie('break-chained-methods') === 'on');
	$('#indent-scripts').val(any($.cookie('indent-scripts'), 'normal'));
	$('#space-before-conditional').prop('checked', $.cookie('space-before-conditional') !== 'off');
	$('#wrap-line-length').val(any($.cookie('wrap-line-length'), '0'));
	$('#unescape-strings').prop('checked', $.cookie('unescape-strings') === 'on');
	$('#jslint-happy').prop('checked', $.cookie('jslint-happy') === 'on');
	$('#end-with-newline').prop('checked', $.cookie('end-with-newline') === 'on');
	$('#indent-inner-html').prop('checked', $.cookie('indent-inner-html') === 'on');
	$('#comma-first').prop('checked', $.cookie('comma-first') === 'on');
	$('#e4x').prop('checked', $.cookie('e4x') === 'on');
}

function store_settings_to_cookie() {
	var opts = {
		expires : 360
	};
	$.cookie('tabsize', $('#tabsize').val(), opts);
	$.cookie('brace-style', $('#brace-style').val(), opts);
	$.cookie('detect-packers', $('#detect-packers').prop('checked') ? 'on' : 'off', opts);
	$.cookie('max-preserve-newlines', $('#max-preserve-newlines').val(), opts);
	$.cookie('keep-array-indentation', $('#keep-array-indentation').prop('checked') ? 'on' : 'off', opts);
	$.cookie('break-chained-methods', $('#break-chained-methods').prop('checked') ? 'on' : 'off', opts);
	$.cookie('space-before-conditional', $('#space-before-conditional').prop('checked') ? 'on' : 'off',
		opts);
	$.cookie('unescape-strings', $('#unescape-strings').prop('checked') ? 'on' : 'off', opts);
	$.cookie('jslint-happy', $('#jslint-happy').prop('checked') ? 'on' : 'off', opts);
	$.cookie('end-with-newline', $('#end-with-newline').prop('checked') ? 'on' : 'off', opts);
	$.cookie('wrap-line-length', $('#wrap-line-length').val(), opts);
	$.cookie('indent-scripts', $('#indent-scripts').val(), opts);
	$.cookie('indent-inner-html', $('#indent-inner-html').prop('checked') ? 'on' : 'off', opts);
	$.cookie('comma-first', $('#comma-first').prop('checked') ? 'on' : 'off', opts);
	$.cookie('e4x', $('#e4x').prop('checked') ? 'on' : 'off', opts);

}

function unpacker_filter(source) {
	var trailing_comments = '',
	comment = '',
	unpacked = '',
	found = false;

	// cut trailing comments
	do {
		found = false;
		if (/^\s*\/\*/.test(source)) {
			found = true;
			comment = source.substr(0, source.indexOf('*/') + 2);
			source = source.substr(comment.length).replace(/^\s+/, '');
			trailing_comments += comment + "\n";
		} else if (/^\s*\/\//.test(source)) {
			found = true;
			comment = source.match(/^\s*\/\/.*/)[0];
			source = source.substr(comment.length).replace(/^\s+/, '');
			trailing_comments += comment + "\n";
		}
	} while (found);

	var unpackers = [P_A_C_K_E_R, Urlencoded, /*JavascriptObfuscator,*/ MyObfuscate];
	for (var i = 0; i < unpackers.length; i++) {
		if (unpackers[i].detect(source)) {
			unpacked = unpackers[i].unpack(source);
			if (unpacked != source) {
				source = unpacker_filter(unpacked);
			}
		}
	}

	return trailing_comments + source;
}

/* function beautify(default_text) {
if (the.beautify_in_progress) return;

store_settings_to_cookie();

the.beautify_in_progress = true;

var source = default_text,
output,
opts = {};

opts.indent_size = $('#tabsize').val();
opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
opts.max_preserve_newlines = $('#max-preserve-newlines').val();
opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
opts.break_chained_methods = $('#break-chained-methods').prop('checked');
opts.indent_scripts = $('#indent-scripts').val();
opts.brace_style = $('#brace-style').val();
opts.space_before_conditional = $('#space-before-conditional').prop('checked');
opts.unescape_strings = $('#unescape-strings').prop('checked');
opts.jslint_happy = $('#jslint-happy').prop('checked');
opts.end_with_newline = $('#end-with-newline').prop('checked');
opts.wrap_line_length = $('#wrap-line-length').val();
opts.indent_inner_html = $('#indent-inner-html').prop('checked');
opts.comma_first = $('#comma-first').prop('checked');
opts.e4x = $('#e4x').prop('checked');

if (looks_like_html(source)) {
output = html_beautify(source, opts);
} else {
if ($('#detect-packers').prop('checked')) {
source = unpacker_filter(source);
}
output = js_beautify(source, opts);
}
if (the.editor) {
the.editor.setValue(output);
} else {
return output;
}

the.beautify_in_progress = false;
} */

function looks_like_html(source) {
	// <foo> - looks like html
	// <!--\nalert('foo!');\n--> - doesn't look like html

	var trimmed = source.replace(/^[ \t\n\r]+/, '');
	var comment_mark = '<' + '!-' + '-';
	return (trimmed && (trimmed.substring(0, 1) === '<' && trimmed.substring(0, 4) !== comment_mark));
}

VolpayApp.filter('beautify2', function () {
	return function (default_text) {
		if (the.beautify_in_progress)
			return;

		store_settings_to_cookie();

		the.beautify_in_progress = true;

		//default_text = default_text.replace(/(\r\n|\n|\r)/gm,"");
		console.log(default_text)
		var source = default_text,
		output,
		opts = {};

		opts.indent_size = $('#tabsize').val();
		opts.indent_char = opts.indent_size == 1 ? '\t' : ' ';
		opts.max_preserve_newlines = $('#max-preserve-newlines').val();
		opts.preserve_newlines = opts.max_preserve_newlines !== "-1";
		opts.keep_array_indentation = $('#keep-array-indentation').prop('checked');
		opts.break_chained_methods = $('#break-chained-methods').prop('checked');
		opts.indent_scripts = $('#indent-scripts').val();
		opts.brace_style = $('#brace-style').val();
		opts.space_before_conditional = $('#space-before-conditional').prop('checked');
		opts.unescape_strings = $('#unescape-strings').prop('checked');
		opts.jslint_happy = $('#jslint-happy').prop('checked');
		opts.end_with_newline = $('#end-with-newline').prop('checked');
		opts.wrap_line_length = $('#wrap-line-length').val();
		opts.indent_inner_html = $('#indent-inner-html').prop('checked');
		opts.comma_first = $('#comma-first').prop('checked');
		opts.e4x = $('#e4x').prop('checked');

		if (looks_like_html(source)) {
			output = html_beautify(source, opts);
		} else {
			if ($('#detect-packers').prop('checked')) {
				source = unpacker_filter(source);
			}
			output = js_beautify(source, opts);
		}

		if (the.editor) {
			the.editor.setValue(output);
		} else {
			console.log(output)
			return output;
		}

		the.beautify_in_progress = false;
		return default_text;
	};
});

function removeEmptyValueKeys(obj) {
	$.each(obj, function (key, value) {
		if (value === "" || value === undefined || value === null) {
			delete obj[key];
		}
	});

	return obj;

}
function removeHashkeyValue(obj) {
	$.each(obj, function (key, value) {
		console.log(key, value)
		if (value === "") {
			delete obj[key];
		}
	});

	return obj;

}

function callOnTimeOut() {
	$('.alert').hide()
}

VolpayApp.filter('startFrom', function () {
	return function (input, start) {
		start = +start; //parse to int
		return input.slice(start);
	}
});

var clrs = {
	"ACTIVE" : "#4155c3",
	"SUSPENDED" : "#00BCD4",
	"CREATED" : "#03a9f4",
	"WAITINGFORAPPROVAL" : "#CDDC39",
	"APPROVED" : "#4caf50",
	"FORREVISION" : "#673ab7",
	"REJECTED" : "#d81f12",
	"DELETED" : "#708090",
	"PENDINGAPPROVAL" : "#ff9800"
}

VolpayApp.filter('chooseStatus', function () {

	return function (val) {
		if (val) {
			val = val.toUpperCase();
			val = val.replace(/\s+/g, '');
			return clrs[val]

		} else {
			return '#666'
		}
	}
})

VolpayApp.filter('chooseColor', function () {

	return function (val) {

		if (val && ('Status' in val)) {
			var clrs = [{
					"status" : "ACTIVE",
					"color" : "#4155c3"
				}, {
					"status" : "SUSPENDED",
					"color" : "#00BCD4"
				}, {
					"status" : "CREATED",
					"color" : "#03a9f4"
				}, {
					"status" : "WAITINGFORAPPROVAL",
					"color" : "#CDDC39"
				}, {
					"status" : "APPROVED",
					"color" : "#4caf50"
				}, {
					"status" : "FORREVISION",
					"color" : "#673ab7"
				}, {
					"status" : "REJECTED",
					"color" : "#d81f12"
				}, {
					"status" : "DELETED",
					"color" : "#708090"
				}, {
					"status" : "PENDINGAPPROVAL",
					"color" : "#ff9800"
				}
			]
			val = val['Status']
				val = val.toUpperCase();
			val = val.replace(/\s+/g, '');
			for (var i in clrs) {
				if (clrs[i].status == val) {
					return clrs[i].color
				}
			}
		} else {
			return '#666'
		}
	}
})

function removeCommas(nStr) {
	if (nStr == null || nStr == "")
		return "";
	return nStr.toString().replace(/,/g, "");
}
function NumbersOnly(myfield, e, dec, neg) {
	if (isNaN(removeCommas(myfield.value)) && myfield.value != "-") {
		return false;
	}
	var allowNegativeNumber = neg || false;
	var key;
	var keychar;

	if (window.event)
		key = window.event.keyCode;
	else if (e)
		key = e.which;
	else
		return true;
	keychar = String.fromCharCode(key);
	var srcEl = e.srcElement ? e.srcElement : e.target;
	// control keys
	if ((key == null) || (key == 0) || (key == 8) ||
		(key == 9) || (key == 13) || (key == 27))
		return true;

	// numbers
	else if ((("0123456789").indexOf(keychar) > -1))
		return true;

	// decimal point jump
	else if (dec && (keychar == ".")) {
		//myfield.form.elements[dec].focus();
		return srcEl.value.indexOf(".") == -1;
	}

	//allow negative numbers
	else if (allowNegativeNumber && (keychar == "-")) {
		return (srcEl.value.length == 0 || srcEl.value == "0.00")
	} else
		return false;
}

function sidebarMenuControl(pID, cID) {

//	console.log(pID,cID)
	$('#' + cID).parent().parent().parent().find('.menuli').each(function () {		
		if ($(this).attr('id') == pID) {
			$(this).addClass('open').find('.sidebarSubMenu').slideDown();
			$(this).find('.ParentMenu').addClass('sidebarSubMenuSelected').find("span").next().removeAttr('class').attr('class', 'fa fa-plus');

			$(this).find("a span").next().removeAttr('class').attr('class', 'fa fa-minus');
			$(this).find('.sidebarSubMenu').find('li').each(function () {
				if ($(this).attr('id') == cID) {
					if (!($(this).hasClass('sideMenuSelected'))) {
						$(this).addClass('sideMenuSelected');
					}
				} else {
					$(this).removeClass('sideMenuSelected');
				}
			})
		} else {
			$(this).removeClass('open').find('.sidebarSubMenu').slideUp();
			$(this).removeClass('open').find('.ParentMenu').removeClass('sidebarSubMenuSelected').find("span").next().removeAttr('class').attr('class', 'fa fa-minus');
			$(this).find("a span").next().removeAttr('class').attr('class', 'fa fa-plus');
			$(this).find('.sidebarSubMenu li').find('li').removeClass('sideMenuSelected');
		}
	})
}
//console.log(sessionStorage.menuSelection)
var menuInterval = "";
function checkMenuOpen()
{
	if(sessionStorage.menuSelection != undefined)
	{
		var menus = JSON.parse(sessionStorage.menuSelection);

		console.log(menus)
		clearInterval(menuInterval)

			menuInterval = setInterval(function(){
				var flag1 = $('#'+menus.val).hasClass('open')
				var flag2 = $('#'+menus.subVal).hasClass('sideMenuSelected');

					
					if(!flag1)
					{
						sidebarMenuControl(menus.val,menus.subVal)
					}
					else
					{
						clearInterval(menuInterval)
					}
			},100)
	}
	else
	{
		clearInterval(menuInterval)
	}
 }

 checkMenuOpen()

function multipleSortParams(field, Target, multiSortObj) {
	var isAvailable = false;
	if (multiSortObj.length == 0) {
		multiSortObj.push({
			'Field' : field,
			'SortType' : 'Asc',
			'Count' : 0
		});
	} else {

		for (var i in multiSortObj) {
			if (field == multiSortObj[i].Field) {
				isAvailable = true;
				var SortCnt = 1 + multiSortObj[i].Count++;
				multiSortObj[i].Field = field;
				multiSortObj[i].Count = SortCnt;

				if (multiSortObj[i].SortType == 'Asc') {
					multiSortObj[i].SortType = 'Desc';
				} else {
					multiSortObj[i].SortType = 'Asc';
				}
				if (SortCnt == 2) {
					multiSortObj.splice(i, 1)
				}
			}
		}

		if (!isAvailable) {
			multiSortObj.push({
				'Field' : field,
				'SortType' : 'Asc',
				'Count' : 0
			});
		}
	}

	return multiSortObj
}

function updateUserProfile(uProfileData, $http, data) {
	//console.log(data)
	var restResponse = {};
	var localObj = {};
	localObj.UserID = sessionStorage.UserID;
	localObj.ProfileData = uProfileData;
	localObj.UserProfileData_PK = sessionStorage.UserProfileDataPK;
	console.log(localObj)

	return $http({
		method : 'PUT',
		url : BASEURL + RESTCALL.userProfileData,
		data : localObj
	}).then(function (response) {
		restResponse = {
			'Status' : 'success',
			'data' : response
		}
		return restResponse;
	}, function (error) {
		restResponse = {
			'Status' : 'danger',
			'data' : error
		}
		return restResponse;
	})

}

function JSONToCSVConvertor(bankData, JSONData, ReportTitle, ShowLabel) {

	//If JSONData is not an object then JSON.parse will parse the JSON string in an Object
	var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;

	var CSV = 'sep=,' + '\r\n\n';

	//This condition will generate the Label/Header
	if (ShowLabel) {
		var row = "";

		//This loop will extract the label from 1st index of on array
		for (var index in arrData[0]) {

			//Now convert each value to string and comma-seprated
			row += index + ',';
		}

		row = row.slice(0, -1);

		//append Label row with line break
		CSV += row + '\r\n';
	}
	//	console.log(CSV)
	//console.log(arrData);
	//1st loop is to extract each row
	for (var i = 0; i < arrData.length; i++) {
		var row = "";

		//2nd loop will extract each column and convert it in string comma-seprated
		for (var index in arrData[i]) {
			//console.log(arrData[i][index]);
			row += '' + JSON.stringify(arrData[i][index]) + ',';
		}

		row.slice(0, row.length - 1);
		//add a line break after each row
		CSV += row + '\r\n';
		//console.log(CSV)
	}

	if (CSV == '') {
		alert("Invalid data");
		return;
	}

	bankData.exportToExcel(CSV, ReportTitle)

}

function customDateRangePicker(sDate, eDate) {
		var startDate = new Date();
		var FromEndDate = new Date();
		var ToEndDate = new Date();
		ToEndDate.setDate(ToEndDate.getDate() + 365);
		$('#' + sDate).datepicker({
			weekStart: 1,
			startDate: '1900-01-01',
			minDate: 1,
			//endDate: FromEndDate,
			autoclose: true,
			format: 'yyyy-mm-dd'
		}).on('changeDate', function (selected) {
			startDate = new Date(selected.date.valueOf());
			startDate.setDate(startDate.getDate(new Date(selected.date.valueOf())));
			$('#' + eDate).datepicker('setStartDate', startDate);
		});

		$('#' + sDate).datepicker('setEndDate', FromEndDate);
		$('#' + eDate).datepicker({
			weekStart: 1,
			startDate: startDate,
			endDate: ToEndDate,
			autoclose: true,
			format: 'yyyy-mm-dd'
		})
			.on('changeDate', function (selected) {
				FromEndDate = new Date(selected.date.valueOf());
				FromEndDate.setDate(FromEndDate.getDate(new Date(selected.date.valueOf())));
				$('#' + sDate).datepicker('setEndDate', FromEndDate);
			});
		$('#' + eDate).datepicker('setStartDate', startDate);
	}

function constructQuery(inObj) {
	//console.log("inObj", inObj)
	var keyArr = [];
	var obj = {
		"filters" : {
			"logicalOperator" : "AND",
			"groupLvl1" : [{
					"logicalOperator" : "AND",
					"groupLvl2" : [{
							"logicalOperator" : "AND",
							"groupLvl3" : []
						}
					]
				}
			]
		},
		"sorts" : [],
		"start" : inObj.start,
		"count" : inObj.count
	};

	if ((Object.keys(inObj).indexOf('start') == -1) || (inObj.start == undefined)) {
		delete obj.start;
	}

	if ((Object.keys(inObj).indexOf('count') == -1) || (inObj.count == undefined)) {
		delete obj.count;
	}

	//console.log(Object.keys(inObj).indexOf('Queryfield'),inObj,obj)
	if (Object.keys(inObj).indexOf('Queryfield') != -1) {
		if (inObj.Queryfield.length != 0) {
			for (var i in inObj.Queryfield) {
				keyArr.push({
					'key' : inObj.Queryfield[i].ColumnName,
					'value' : inObj.Queryfield[i].ColumnValue,
					'operator' : inObj.Queryfield[i].ColumnOperation
				})
			}
			
			repeatingArrElem(keyArr, obj)
		} else {
			delete obj.filters;
		}
	} else {
		delete obj.filters;
	}

	if (Object.keys(inObj).indexOf('QueryOrder') != -1) {
		if (inObj.QueryOrder.length != 0) {
			for (var i in inObj.QueryOrder) {
				obj.sorts.push({
					'columnName' : inObj.QueryOrder[i].ColumnName,
					'sortOrder' : inObj.QueryOrder[i].ColumnOrder
				})
			}
		} else {
			delete obj.sorts;
		}

	} else {
		delete obj.sorts;
	}


	

	return obj;

}

function repeatingArrElem(arr, obj) {

	//console.log(arr,obj)

	var keyPairArr = [];
	arr.sort();

	var current = null;
	var cnt = 0;
	for (var i = 0; i < arr.length; i++) {
		if (arr[i].key != current) {
			if (cnt > 0) {
				keyPairArr.push({
					'key' : current,
					'value' : cnt,
					'array' : []
				})
			}
			current = arr[i].key;
			cnt = 1;
		} else {
			cnt++;
		}
	}

	if (cnt > 0) {
		keyPairArr.push({
			'key' : current,
			'value' : cnt,
			'operator' : '',
			'array' : []
		})
	}

	for (var i in keyPairArr) {
		for (var j in arr) {
			if (keyPairArr[i].key == arr[j].key) {
				keyPairArr[i].array.push(arr[j].value)
				keyPairArr[i].operator = arr[j].operator
			}
		}
	}

	obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3 = [];
	for (var i in keyPairArr) {
		//console.log("date",keyPairArr[i].key)

		if ((keyPairArr[i].array.length > 1) && (keyPairArr[i].key != 'ReceivedDate') && (keyPairArr[i].key != 'ValueDate') && (keyPairArr[i].key != 'Amount') && (keyPairArr[i].key != 'EntryDate') && (keyPairArr[i].key != 'SentDate')) {
			obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
				'logicalOperator' : 'OR',
				'clauses' : []
			})
		} else {
			
			obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3.push({
				'logicalOperator' : 'AND',
				'clauses' : []
			})
		}


		keyPairArr[i].array.sort()

		for (var j in keyPairArr[i].array) {

			console.log(i,keyPairArr[i].array[i],keyPairArr[i].array)
			if((keyPairArr[i].key != 'ReceivedDate') && (keyPairArr[i].key != 'ValueDate') && (keyPairArr[i].key != 'Amount') && (keyPairArr[i].key != 'EntryDate') && (keyPairArr[i].key != 'SentDate'))
			{
				obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses.push({
					'columnName' : keyPairArr[i].key,
					'operator' : keyPairArr[i].operator,
					'value' : keyPairArr[i].array[j]
				})

			}
			else
			{
				//console.log(keyPairArr[i].array)

				obj.filters.groupLvl1[0].groupLvl2[0].groupLvl3[i].clauses.push({
					'columnName' : keyPairArr[i].key,
					'operator' : (keyPairArr[i].array.length == 1)?'=':(j==0)? '>=':'<=',
					'value' : keyPairArr[i].array[j]
				})

			}
			
		
		}


		//console.log("2",obj) 
	}
}

function emailValidation(getID) {

	var email_regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/i;
	var eFlag = "";

	var currentID = getID;
	if (!email_regex.test($(currentID).val())) {

		$("div").find(getID).css("border", "2px solid #ff6363")
		eFlag = false;
	} else {
		$("div").find(getID).removeAttr("style");
		eFlag = true;
	}
	return eFlag;

}

function findLandingModule(data, state) {
	console.log(data)
	state.go('app.' + data.name, data.stateParams);
}

function uiConfiguration() {
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

		var ColpatriaAddonFunction = function () {
		return $.ajax({
			url : 'plug-ins/instructionprocess.json',
			cache : false,
			async : false,
			type : 'GET'
		}).responseJSON;
	}
	var ColpData = ColpatriaAddonFunction();
	sessionStorage.ColpData = btoa(JSON.stringify(ColpData));

	var PopUpAddonFunction = function () {
		return $.ajax({
			url : 'plug-ins/paymentdetail-buttons.json',
			cache : false,
			async : false,
			type : 'GET'
		}).responseJSON;
	}
	var PopUpAddonData = PopUpAddonFunction();
	sessionStorage.PopUpAddonData = btoa(JSON.stringify(PopUpAddonData));

}
uiConfiguration();