
VolpayApp.controller('sidebarController', function ($scope, $http, $location, $state, $timeout, $filter, GlobalService, $translate, $stateParams) {
	// $scope.callLang = function(argu){
	// 	console.log(argu,$translate.use(),$translate.instant('Forgotpassword.SubTitle'))
	// 	$translateProvider.postProcess(function (translationId, translation, interpolatedTranslation, params, lang) {
	// 		console.log((translationId, translation, interpolatedTranslation, params, lang)
	// 	//return '<span style="color: #cccccc">' + translationId + '(' + lang + '):</span> ' +
	// 		//(interpolatedTranslation ? interpolatedTranslation : translation);
	// 	});

	// }

	$scope.translateFn = function (translateVal) {
		$scope.tVal = translateVal;
		$scope.firstFilteredVal = $filter('removeSpace')($scope.tVal);
		$scope.secondFilteredVal = $filter('specialCharactersRemove')($scope.firstFilteredVal);
		$scope.translatedVal = $filter('translate')('Sidebar.' + $scope.secondFilteredVal);
		if ($scope.translatedVal.indexOf('Sidebar.') != -1) {
			//$scope.translatedVal = $scope.translatedVal.substr(8)
			$scope.translatedVal = translateVal
		}
		return $scope.translatedVal;
	}

	function removeAdminPanel(sideBarVal) {

		console.log(sideBarVal)
		for (i = 0; i < sideBarVal.length; i++) {
			if (sideBarVal[i].ParentName == "Admin Panel") {
				delete sideBarVal[i];
			}
		}
		return orderArray(sideBarVal);
	}

	function orderArray(Arr) {
		for (i = 0; i < Arr.length; i++) {
			if (Arr[i] != undefined) {
				Arr[i] = Arr[i];
			}
		}
		return Arr;
	}

	/*var getAddon = function () {
	return $.ajax({
	url : 'plug-ins/addon.json',
	async : false,
	cache : false,
	type : 'GET',
	dataType : 'json'
	}).responseJSON;
	}*/

	var getAddon = function (path) {
		return $.ajax({
			url : path,
			async : false,
			cache : false,
			type : 'GET',
			dataType : 'json'
		}).responseJSON;
	}

	function appendAddon(data1) {

		var addon1 = [];
		var addon = getAddon('plug-ins/addon.json');
		if (addon.length > 0) {
			var addon1 = data1.concat(addon);

		} else {
			addon1 = data1;
		}
		return addon1;
	}

	function appendNewModule(data1) {

		$scope.dupIndex = '';
		var addon1 = [];
		var addon = getAddon('plug-ins/modules.json');

		//console.log(userData)

		// console.log(addon.length)
		if (addon.length > 0) {
			for (k in data1) {
				for (i in addon) {

					if ((addon[i].ParentName == data1[k].ParentName) && (!addon[i].ExternalMenu)) {
						$scope.dupIndex = i;

						for (j in addon[i].subMenu) {

							data1[k].subMenu.push(addon[i].subMenu[j])
						}
						if ($scope.dupIndex != '') {
							addon.splice($scope.dupIndex, 1)
						}

					}
					addon1 = data1.concat(addon);
				}
			}

		} else {
			addon1 = data1;
		}

		return addon1;
	}

	function externalLink(sVal) {
		var extLink = getAddon('plug-ins/externallinks.json');
		sVal.push(extLink)
		return sVal;
	}

	if ((sessionStorage.pwRest == false) || (sessionStorage.pwRest == 'false')) {
		$scope.sidebarArr = [];
		$http.get('config/sidebarVal.json').success(function (data) {
			var sidebarObj = {};
			sidebarObj.RoleId = sessionStorage.ROLE_ID;
			sidebarObj.menu = appendAddon(data);
			$http.post(BASEURL + RESTCALL.sideBarValues, sidebarObj).success(function (data) {

				/*if(sidebarObj.RoleId!="Super Admin"){
				data=removeAdminPanel(data);
				}*/
				GlobalService.sidebarVal = data;

				$scope.sidebarVal = appendNewModule(data)

					$scope.sidebarVal = externalLink($scope.sidebarVal)

					sidebarMenuControl('PaymentModule', 'DashboardPayments')

					// var interval = setInterval(function(){
					// 		if(!$('#PaymentModule').hasClass('open'))
					// 		{sidebarMenuControl('PaymentModule','DashboardPayments')
					// 		}
					// 		else
					// 		{clearIterval(interval)
					// 		}
					// },100)

			}).error(function (err) {
				//console.log(err)
			})

		}).error(function () {})

	}

	if ((configData.Authorization == "External") && (document.cookie)) {

		$timeout(function () {

			$scope.sidebarArr = [];
			$http.get('config/sidebarVal.json').success(function (data) {
				var sidebarObj = {};
				sidebarObj.RoleId = sessionStorage.ROLE_ID;
				sidebarObj.menu = appendAddon(data);

				$http.post(BASEURL + RESTCALL.sideBarValues, sidebarObj).success(function (data) {
					/*if(sidebarObj.RoleId!="Super Admin"){
					data=removeAdminPanel(data);
					}*/
					GlobalService.sidebarVal = data;
					//sessionStorage.sidebarVal = JSON.stringify(data);
					//$scope.sidebarVal = data;
					$scope.sidebarVal = appendNewModule(data)
						sidebarMenuControl('PaymentModule', 'DashboardPayments')
				}).error(function (err) {
					//console.log(err)
				})

			}).error(function () {})

		}, 1500);

	}

	setTimeout(function () {
		if (userData.customDashboardWidgets.showDashboard) {
			$('#MyDashboard').css('display', 'block')
		} else {
			$('#MyDashboard').css('display', 'none')
		}
	}, 1000)

	$scope.prev = -1;

	$scope.gotoPage = function (eve, val, subVal, fl) {
		//	console.log(eve, val, subVal,fl)
			
			subVal.IconName = val.IconName

			


			if (subVal) {

				sessionStorage.menuSelection = JSON.stringify({'val':$filter('specialCharactersRemove')($filter('removeSpace')(val.ParentName)),'subVal':$filter('specialCharactersRemove')($filter('removeSpace')(subVal.Name))})

				$('.sidebar-menu').each(function () {
					$(this).find('.sidebarSubMenu').find('li').removeClass('sideMenuSelected')
				})
				$(eve.currentTarget).parent().addClass('sideMenuSelected')

				subVal.ParentName = val.ParentName;

				if ((subVal.Link == 'businessrules') || (subVal.Link == 'mpitemplate') || (subVal.Link == 'fxratecharts') || (subVal.Link == 'timezone') || (subVal.Link == 'configurations') || (subVal.Link == 'taskdetails') || (subVal.Link == 'idconfigurations') || (subVal.Link == 'routeregistry')) {
					$scope.stateApp = subVal.Link;
					
				} else {
					$scope.stateApp = val.Link != 'app' ? val.Link : subVal.Link
				}
				// console.log("stateApp",$scope.stateApp)
				$scope.addActive = $filter('removeSpace')(subVal.Name);
				$scope.addActives = $filter('removeSpace')(val.ParentName);

				// console.log($filter('specialCharactersRemove')($filter('removeSpace')(val.ParentName),$filter('specialCharactersRemove')($filter('removeSpace')(subVal.Name))))
				if (fl) {
					setTimeout(function () {
						sidebarMenuControl($filter('specialCharactersRemove')($filter('removeSpace')(val.ParentName)), $filter('specialCharactersRemove')($filter('removeSpace')(subVal.Name)));
					}, 500)
				} else {
					sidebarMenuControl($filter('specialCharactersRemove')($filter('removeSpace')(val.ParentName)), $filter('specialCharactersRemove')($filter('removeSpace')(subVal.Name)));
				}

				

			} else {
				$scope.stateApp = "paymentsummary";
				$scope.callDefault()
			}
			$scope.input = {
			'gotoPage' : subVal,
			'responseMessage' : ''
			}

		/*$state.go('app.' + $scope.stateApp, {
		input: $scope.input
		});*/
		//console.log(subVal.external)
		if (!val.allowThirdParty) {
			if ((subVal.PlugPlay) || (val.ExternalMenu)) {
				$scope.urlVal = $filter('nospace')(subVal.Name);

				$scope.urlVal = $filter('specialCharactersRemove')($scope.urlVal)
					$scope.tUrl = $filter('nospace')(subVal.Name);
				$scope.tUrl = $filter('specialCharactersRemove')($scope.tUrl)
					// console.log($filter('lowercase')( $scope.tURL))

					$scope.dataObj = {
					"url" : $filter('lowercase')($scope.urlVal),
					"tempUrl" : 'plug-ins/modules/' + $filter('lowercase')($scope.tUrl),
					"contrl" : subVal.controller
				}

				$state.go('app.newmodules', {
					url : $filter('lowercase')($scope.urlVal),
					tempUrl : 'plug-ins/modules/' + $filter('lowercase')($scope.tUrl),
					contrl : subVal.controller
				});

				//$state.go('app.newmodules', {data:$scope.dataObj});
			} else {
				//console.log('insidebar', $scope.stateApp, $scope.input)
				if (fl) {
					$scope.input.triggerIs = fl;
				}

				
				$state.go('app.' + $scope.stateApp, {
					input : $scope.input

				});
			}

		} else {

			$state.go('app.externalLink', {
				"url" : subVal.Link
			})

		}

		$scope.mediaQuery = window.matchMedia("(max-width: 767px)");
		// console.log("aa",$scope.mediaQuery)
		if ($scope.mediaQuery.matches) {
			$("body").removeClass('sidebar-open');
			$scope.sidebarToggleTooltip = "Show Menu"
		}

	}

	$scope.parentMenu = function (evt) {
		
		if ($('#' + $(evt.currentTarget).parent().attr('id')).hasClass('open')) {
			$('#' + $(evt.currentTarget).parent().attr('id')).removeClass('open').find('.sidebarSubMenu').slideUp();
			$('#' + $(evt.currentTarget).parent().attr('id')).find("a span").next().removeAttr('class').attr('class', 'fa fa-plus');
		} else {
			$('#' + $(evt.currentTarget).parent().attr('id')).parent().find('.menuli').removeClass('open').find('.sidebarSubMenu').slideUp();
			$('#' + $(evt.currentTarget).parent().attr('id')).parent().find('.menuli .ParentMenu span').next().removeAttr('class').attr('class', 'fa fa-plus');

			$('#' + $(evt.currentTarget).parent().attr('id')).addClass('open').find('.sidebarSubMenu').slideDown();
			$('#' + $(evt.currentTarget).parent().attr('id')).find("a span").next().removeAttr('class').attr('class', 'fa fa-minus');
		}
	}


	$scope.showSmallLogo = false;

		
				$('#sidebarMenu').find('.appLogo').css('display','block');
				$scope.sidebarToggleTooltip = "Hide Menu"
					$("body").removeClass('sidebar-collapse');
				$('.ParentMenu').find("span").next().removeAttr('class').attr('class', 'fa fa-plus').css({
					'float' : 'right'
				})
				$('.sidebarSubMenu li a').css('padding-left', '24px');
				$('.sidebarSubMenu li a span').css('margin-left', '0px');
				$('.fixedfooter').css('margin-left', '230px');
				$('.footertext1').css('left', '-210px');

	$scope.sideBar = function (value) {
		/*$('.sidebar-menu').find('.sidebarSubMenu').removeClass('open').css({
			'display' : 'none'
		})*/
		$scope.prev = -1;

		


		if (value == 1) {
			if ($("body").hasClass('sidebar-collapse')) {

					$scope.showSmallLogo = false;
				$('#sidebarMenu').find('.appLogo').css('display','block');
				$scope.sidebarToggleTooltip = "Hide Menu"
					$("body").removeClass('sidebar-collapse');
				$('.ParentMenu').find("span").next().removeAttr('class').attr('class', 'fa fa-plus').css({
					'float' : 'right'
				})
				$('.sidebarSubMenu li a').css('padding-left', '24px');
				$('.sidebarSubMenu li a span').css('margin-left', '0px');
				$('.fixedfooter').css('margin-left', '230px');
				$('.footertext1').css('left', '-210px');
			} else {
				
				$scope.showSmallLogo = true;
				$('#sidebarMenu').find('.appLogo').css('display','none');

				$("body").addClass('sidebar-collapse');
				$scope.sidebarToggleTooltip = "Show Menu"
					$('.ParentMenu').find("span").next().css({
						'float' : ''
					})

					$('.sidebarSubMenu li a').css('padding-left', '13px');
					$('.sidebarSubMenu li a span').css('margin-left', '10px');
					$('.fixedfooter').css('margin-left', '50px');
					$('.footertext1').css('left', '-30px');
			}
		}
	};
	//$scope.sideBar(1)

	if ($("body").hasClass('sidebar-open')) {
		$scope.sidebarToggleTooltip = "Show Menu"
	} else {
		$scope.sidebarToggleTooltip = "Hide Menu"
	}

	if ($stateParams.details) {
		//console.log($stateParams.details)
		for (j in GlobalService.sidebarVal) {
			for (k in GlobalService.sidebarVal[j].subMenu) {
				if (GlobalService.sidebarVal[j].subMenu[k].Link == $stateParams.details.toPage) {
					$scope.gotoPage('', GlobalService.sidebarVal[j], GlobalService.sidebarVal[j].subMenu[k], $stateParams.details)
				}
			}
		}
	}

})