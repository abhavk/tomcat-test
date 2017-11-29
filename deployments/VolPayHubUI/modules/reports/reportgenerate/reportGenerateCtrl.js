VolpayApp.controller('reportGenerateCtrl', function ($scope, $http, $location, $timeout, $filter, GlobalService) {
       
	$http.get(BASEURL + RESTCALL.ReportIDDropVal).success(function (data) {
		$scope.reportIdVal = data;
		
	}).error(function () {})
      //   $scope.lenthofData = 20;
	  
	function convertXml2JSon(xml) {
		var x2js = new X2JS();
		return x2js.xml_str2json(xml);
	}
	function rawOutInject(Arr123){
		for(i=0;i<Arr123.length;i++){
			console.log(Arr123[i]);
			Arr123[i].rawOutPDF=convertXml2JSon(Arr123[i].ReturnStack).ResponseReportMessage.ReportInfo.rawOutFile
		}
		return Arr123;
	}  
	  
	$scope.fetchReportLogs = function () {

		var sortObj = {
			"QueryOrder" : [{
				"ColumnName" : "GeneratedDate",
				"ColumnOrder" : "Desc"
			}],
			"start":0,
			"count":20
		};

		var sortObj = constructQuery(sortObj);
		// var sortObj = {}
		$http({
			url : BASEURL + "/rest/v2/reports/log/readall",
			method : "POST",
			async : false,
			cache : false,
			data : sortObj,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			//console.log(convertXml2JSon(data[0].ReturnStack).ResponseReportMessage.ReportInfo);
		  //rawOutInject(data);
		  $scope.items = rawOutInject(data);
		  console.log($scope.items)
          $scope.lenthofData = data;
		 // console.log($scope.lenthofData.length)
			//$(".alert-danger").alert("close");
		}).error(function (data, status, headers, config) {
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

	$scope.RG = {};
	$scope.RG.OutputFormat = "PDF";

	$scope.generateReport = function (RG) {
	//	console.log(RG)

		var RG11 = {
			"ReportInfo" : {
				//"UserToken": "",
				//"CustomId": RG.CustomId,
				"ReportClass" : RG.ReportClass,
				"User" : sessionStorage.UserID,
				"OutputFormat" : RG.OutputFormat,
				"OutputMethod" : [{
						"Type" : "BOTH",
						"OutputPath" : ""
					}
				]
			},
			"GenerationFilters" : {
				"Filter" : [{
						"Name" : "",
						"Type" : "",
						"Value" : ""
					}
				]
			},
			"ColumnFilters" : [{
					"Colum" : [{
							"Name" : "",
							"Enabled" : true,
							"Value" : ""
						}
					]
				}
			]
		}

		//console.log(RG11)

		$http({
			url : BASEURL + RESTCALL.ReportsGenerate,
			method : "POST",
			async : false,
			cache : false,
			data : RG11,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config) {
			console.log(data);
			$scope.items = data;
			$scope.alerts = [{
					type : 'success',
					msg : 'Report generated successfully'
				}
			];

			$timeout(function () {
				$('.alert-success').hide();
			}, 4000)
			$timeout(function () {
				$scope.RG = {};
				$scope.RG.OutputFormat = "PDF";
			}, 1000)

			$scope.fetchReportLogs();

			//$(".alert-danger").alert("close");
		}).error(function (data, status, headers, config) {});
	}

	function GetIE() {
		var sAgent = window.navigator.userAgent;
		var Idx = sAgent.indexOf("MSIE");

		if (Idx > 0)
			return parseInt(sAgent.substring(Idx + 5, sAgent.indexOf(".", Idx)));
		else if (!!navigator.userAgent.match(/Trident\/7\./))
			return 11;
		else
			return 0; //It is not IE
	}

	$scope.fetchReportLogs();

	$scope.Download = function (reports) {

		$scope.pdfName = $filter('dateFormat')(reports.GeneratedDate) + '_' + reports.ReportID + '_' + reports.UserName + '.pdf'
			//console.log($scope.pdfName)

			$http({
				url : BASEURL + "/rest/v2/reports/download",
				method : "POST",
				async : false,
				cache : false,
				data : {
					"FolioID" : reports.FolioID
				},
				headers : {
					'Content-Type' : 'application/json'
				}
			}).success(function (data, status, headers, config) {

				if (GetIE() > 0) {
					$scope.alerts = [{
							type : 'danger',
							msg : "This feature is not supported by Internet Explorer"
						}
					];
					$timeout(function () {
						$(".alert").hide();
					}, 4000)

				} else {
					var pdf = 'data:application/octet-stream;base64,' + data.ReportInfo[0].rawOutFile;
					var dlnk = document.getElementById('dwnldLnk');
					dlnk.href = pdf;
					dlnk.download = $scope.pdfName;
					dlnk.click();

				}

			}).error(function (data, status, headers, config) {});

	}

	/*** To Maintain Alert Box width, Size, Position according to the screen size and on scroll effect ***/

	$scope.widthOnScroll = function()
	{
		var mq = window.matchMedia( "(max-width: 991px)" );
		var headHeight
		if (mq.matches) {
		 headHeight =0;
		 $scope.alertWidth = $('.pageTitle').width();
		} else {
		   $scope.alertWidth = $('.pageTitle').width();
			headHeight = $('.main-header').outerHeight(true)+10;
		}
		$scope.alertStyle=headHeight;
	}

		$scope.widthOnScroll();

	/*** On window resize ***/
	$(window).resize(function(){
		$scope.$apply(function () {

			$scope.alertWidth = $('.alertWidthonResize').width();
		});

	});

         	var len = 20;
             $scope.loadMore = function(){

					var sortObj = {
						"QueryOrder" : [{
							"ColumnName" : "GeneratedDate",
							"ColumnOrder" : "Desc"
						}],
						"start":len,
						"count":20
					};
            		$scope.loadMorecalled = true;
                   
                   sortObj = constructQuery(sortObj);

						$http({
							url : BASEURL + "/rest/v2/reports/log/readall",
							method : "POST",
							async : false,
							cache : false,
							data : sortObj,
							headers : {
								'Content-Type' : 'application/json'
							}
						}).then(function(response){
						//	console.log(response)
						//	console.log(response.data)
                            $scope.lenthofData = response.data;
					//		console.log(response.data.length)
                            if(response.data.length > 0 )
							{
								$scope.items  = $scope.items.concat(response.data)
						//		console.log($scope.items,$scope.items.length)
								len = len + 20;
							}

                    	})
                }

var debounceHandler = _.debounce($scope.loadMore, 700, true);
//$(document).ready(function(){
		jQuery(
        		function($)
        			{
        				$('.listView').bind('scroll', function()
        				{
							//console.log($(this).scrollTop() + $(this).innerHeight(),$(this)[0].scrollHeight)
        					$scope.widthOnScroll();
        					if($(this).scrollTop() + $(this).innerHeight()>=$(this)[0].scrollHeight)
        					{
        						if( $scope.lenthofData.length >= 20)
								{
									//console.log("greater than 20")
									debounceHandler()
        							//$scope.loadMore();
        						}
        					}
        				})
        				//setTimeout(function(){},1000)

        			}
        	);
//})
	

});