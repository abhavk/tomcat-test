VolpayApp.controller('fileDashboardController', function ($scope, $http, $filter, $timeout, $state, $location, $window, PersonService1, AllPaymentsGlobalData, GlobalService, LogoutService, DashboardService) {

	/*var interval = "";
	clearInterval(interval)
	interval = setInterval(function(){
				if(!$('#PaymentModule').hasClass('open'))
				{sidebarMenuControl('PaymentModule','InstructionsDashboard')
				}
				else
				{clearInterval(interval)
				}
		},100)*/

	sessionStorage.menuSelection = JSON.stringify({'val':'PaymentModule','subVal': 'InstructionsDashboard'})
	checkMenuOpen()


	$scope.aa = {
					"Queryfield":[
						{
						  "ColumnName": "UserID",
						  "ColumnOperation": "=",
						  "ColumnValue": sessionStorage.UserID
						}
					],
                    "Operator":"AND"
				}

    $scope.aa =  constructQuery( $scope.aa);
    $http.post(BASEURL+RESTCALL.userProfileData+'/readall',$scope.aa).success(function(data)
    {
        userData = JSON.parse($filter('hex2a')(data[0].ProfileData))

     }).error(function(data){
         userData = uProfileData;    
    })

    $scope.checkstatusBarVal = function()
    {


	$scope.statusBarVal = 	[
								{
								"Status":"HOLD",
								"NavStatus":"HOLD",
								"Icon":"fa fa-hand-paper-o",
								"Color":"linear-gradient(to right, rgb(255, 178, 73), rgb(208, 129, 27) 60%, rgb(171, 112, 25) 100%)",
								"Visibility":"",
								"searchArr":["HOLD"],
								"Count":0
								},
								{
								"Status":"DEBULKED",
								"NavStatus":"DEBULKED",
								"Icon":"fa fa-check-circle-o",
								"searchArr":["DEBULKED"],
								"Color":"linear-gradient(to right, rgb(162, 230, 132), rgb(132, 199, 99) 60%, rgb(109, 154, 89) 100%)",
								"Visibility":"",
								"Count":0
								},
								{
								"Status":"DUPLICATE",
								"NavStatus":"DUPLICATE",
								"Icon":"fa fa-copy",
								"searchArr":["DUPLICATE"],
								"Color":"linear-gradient(to right, rgb(196, 173, 228), rgb(169, 119, 236) 60%, #8875a2 100%)",
								"Visibility":"",
								"Count":0
								},{
								"Status":"REJECTED",
								"NavStatus":"REJECTED",
								"Icon":"fa fa-times-circle",
								"searchArr":["REJECTED"],
								"Color":"linear-gradient(to right, rgb(241, 149, 147), rgb(251, 110, 103) 60%, #e35b5a 100%)",
								"Visibility":"",
								"Count":0
								}
							]


					//setTimeout(function(){
                      for(var i in userData.DboardPreferences.fileDashboard.statusSummary)           
                      {
                            for(var j in $scope.statusBarVal)
                            {
                                if(userData.DboardPreferences.fileDashboard.statusSummary[i].name == $scope.statusBarVal[j].NavStatus)
                                {
                                    $scope.statusBarVal[j].Visibility = userData.DboardPreferences.fileDashboard.statusSummary[i].visibility;
                                }
                            }
                      }

                      //console.log(userData.DboardSetting.paymentDashboard.statusSummary)

                       for(var i in userData.DboardPreferences.fileDashboard.statusSummary)           
                      {
                            
                                if(userData.DboardPreferences.fileDashboard.statusSummary[i].visibility)
                                {
                                   $scope.count=userData.DboardPreferences.fileDashboard.statusSummary.filter(function(x){ return x.visibility; }).length;
                                   console.log($scope.count)
                                    
                                }
                            
                      }

                   //  },100)

			}

	$scope.uSetting = {};
		//setTimeout(function(){
			for(var i in userData.DboardPreferences.fileDashboard.widget)
			{
			$scope.uSetting[userData.DboardPreferences.fileDashboard.widget[i].name] = userData.DboardPreferences.fileDashboard.widget[i].visibility
			}
		//},100);

	$scope.checkstatusBarVal()

	var myColors = ["#578ebe", "#e35b5a", "#8775a7", "#6D9B5B", "#ab7019", "#777", "#ff9933", "#ff0066","#a24e4e","#607D8B","#d4638a","#5d5d96",'#FA58F4','#0174DF','#FE642E','#DF0101','#64FE2E','#8A0868','#585858','#4C0B5F','#B18904','#8A2908','#F781BE','#A9F5E1'];


     $scope.fileStatusColor = [{
         "Status": "DEBULKED",
         "Color": "#6D9B5B"
     }, {
         "Status": "DUPLICATE",
         "Color": "#8775a7"
     }, {
         "Status": "HOLD",
         "Color": "#ab7019"
     }, {
         "Status": "IN_PROGRESS",
         "Color": "#6D9B5B"
     }, {
         "Status": "PENDING",
         "Color": "#578ebe"
     }, {
         "Status": "RECEIVED",
         "Color": "#777"
     }, {
         "Status": "REJECTED",
         "Color": "#e35b5a"
     }, {
         "Status": "REPAIR",
         "Color": "#ff9933"
     }];

    $scope.selectStatuscolor = function(status)
    {
        for(i in $scope.fileStatusColor)
        {
            if(status == $scope.fileStatusColor[i].Status)
            {
            return $scope.fileStatusColor[i].Color
            }
        }
    }


	var fileContObj = {
						getCurrencySymbol : function (dCntAmt, keyName){
							dCntAmt = String(dCntAmt);
							var xx = $filter('isoCurrency')(dCntAmt,keyName)

							if(xx.indexOf(',') != -1){
								var yy = xx.split(',');
								xx='';
								for(var i in yy){
									xx = xx+yy[i]
								}
							}
							xx=xx.replace(dCntAmt,'');
							xx=xx.split('.')[0];

							if(xx.indexOf('0') != -1){
								xx = xx.replace('0','')
								xx = xx+" "+keyName
							}
							else{
								xx=xx.split('.')[0]+" "+keyName;
							}
							return xx;
						}
    }

    $scope.loadData = function () {

    var restdata = {};
	$scope.dashboardData = function (obj) {
        $http({
			url : BASEURL + RESTCALL.fileDashboard,
			method : "POST",
			data : obj,
			headers : {
				'Content-Type' : 'application/json'
			}
		}).success(function (data, status, headers, config){

            restdata = data;
            d3.scale.myColors = function () {
				return d3.scale.ordinal().range(myColors);
			};

			$scope.fileNotfound = false;
    

        $('.custDropDown').find('button').find('span:first-child').html('Count');
        $('.custDropDown').find('ul').find('li').removeClass('listSelected').removeClass('listNotSelected')
        $('.custDropDown').find('ul').find('li:first-child').addClass('listSelected').removeClass('listNotSelected')

			var fileCntAmt = 'Count';

			$scope.fileDetailChart = function (val){
     var inData = $scope.restdataFileStatus;
             fileCntAmt = val;
             FileDonut = val;
    		var LinechartData = "";
    		var BarChart,BarChartDatum,LineChart,LineChartDatum, BarchartconstructedObj,BarchartconstructedObj1,statusChart;
    	$scope.individual='';
    	   //Donut chart
    		nv.addGraph(function() {
    			var constructedObj = constructObject.constructObj(constructObject.getUniqueVal(inData, "PSACode"), inData, "PSACode");


    			//console.log(inData)

    		//console.log(constructedObj)
    			var getTotalVal = constructObject.calcTotal(constructedObj, FileDonut).toString().replace(/,/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
				//console.log(getTotalVal)
				$scope.fileDonutHeader = 'All ('+constructObject.calcTotal(constructedObj, FileDonut)+')'


    			var Donutchart = nv.models.pieChart()
    			.x(function(d) {
                     d.key = $filter('underscoreRemove')(d.key)
    			    return d.key
    			    })
    			.y(function(d) { return d[FileDonut]})
    			.color(d3.scale.myColors().range())
    			.showLabels(true)
    			.title(getTotalVal)
    			.labelThreshold(.05)  //Configure the minimum slice size for labels to show up
    			.valueFormat(function(d){ return d3.format(',')(d);})
    			.labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
    			.donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
    			.donutRatio(0.35)     //Configure how big you want the donut hole size to be.
    			.showLegend(true)
    			.margin({top: 0, right: 0, bottom: 0, left: 0 });
			Donutchart.legend.updateState(false);
			
    		d3.select("#FileDetailsDonutChart svg").datum(constructedObj).call(Donutchart);

    		/*Custom Title begins here*/
    		d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select("#cstmtitle").remove();
    		d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select('.nv-pie-title').each(function(d){	
    			d3.select(this.parentNode).append("svg:text").attr("id","cstmtitle").attr("dy","0em").attr("transform","translate(0, 0)").attr("style","text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class','nv-pie-title').text('Total '+val);
    			d3.select(this.parentNode).append("svg:text").attr("id","cstmtitle").attr("dy","1.25em").attr("transform","translate(0, 0)").attr("style","text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class','nv-pie-title').text(getTotalVal);
				d3.select(this).remove()
    		})
    		/*Custom Title Ends here*/

    		/*Custom Lable begins here*/
    		/* d3.select(".nv-pieLabels").selectAll(".nv-label").selectAll("#cstmtxt").remove();
    		d3.select(".nv-pieLabels").selectAll(".nv-label").append("svg:text").attr("id","cstmtxt").attr("dy","15").attr("style","text-anchor: middle; fill: rgb(0, 0, 0);");
    		d3.select(".nv-pieLabels").selectAll(".nv-label").selectAll("text").each(function(d){
    				if((d3.select(this).attr('id')=="cstmtxt")){
    					d3.select(this).text(Math.round((d.value * 100/getTotalVal).toFixed(1)) + '%')
    					d3.select(this.parentNode).selectAll("text").each(function(){
    						if((d3.select(this).attr('id')==null)&&(d3.select(this).text()==''))
    							d3.select(this.parentNode).select('#cstmtxt').text('')
    					})
    				}
    			}) */
    		/*Custom Title Ends here*/

    		/*Get the arc value for restoration starts here*/
    		Donutchart.dispatch.on("renderEnd",function(){
    			arcDetails = [];
    			d3.select("#FileDetailsDonutChart svg").select(".nv-pie").selectAll(".nv-slice").selectAll("path").each(function(){
    				arcDetails.push(d3.select(this).attr("d"))
    			})
    		})
    		/* Donutchart.legend.dispatch.on("legendClick",function(e){
    			console.log(e)
    		}) */
    		/*Get the arc value for restoration Ends here*/

    		d3.select("FileDetailsDonutChart svg").select('.nv-pie').selectAll(".nv-slice").attr('sliceClicked',null).classed('hover', false);

    		prevI = -1;

            $scope.fileChannelSelected = '';
    		Donutchart.pie.dispatch.on("elementClick", function(e) {

    			var Filestatus,compareStatus,obtainedStatus;
    		var obtainedCurrency = [], compareCurrency = [];




    			if(prevI != e.index){
    			$scope.fileChannelSelected = e.data.key;

    			 for(Cr in e.data.values){
    			   // if((e.data.values[Cr]['Status'] != "REJECTED") && (e.data.values[Cr]['Status'] != "DUPLICATE")){
    			    if(e.data.values[Cr]['Status'] == "DEBULKED"){
                        obtainedCurrency.push(e.data.values[Cr])
    				}


    			}

                var dum = constructObject.getUniqueVal(inData, "Currency");
                for(Cr in dum){
    				if(dum[Cr]){
    					compareCurrency.push(dum[Cr])
    				}
    			}



    				if(obtainedCurrency.length < compareCurrency.length){
    					var missingStatus = arr_diff(compareCurrency, constructObject.getUniqueVal(obtainedCurrency, "Currency"));
    					for (var k in missingStatus) {
    						obtainedCurrency.push({
    							'Currency': missingStatus[k],
    							'Count':0,
    							'Amount':0
    						});
    					}
    				}

    			obtainedCurrency = $filter('orderBy')(obtainedCurrency,'Currency')

    				d3.select(e.Iam.parentNode).selectAll(".nv-slice").classed('hover', true);
    				d3.select(e.Iam).classed('hover', false).attr('sliceClicked','true');
    				d3.select(d3.select(e.Iam.parentNode).selectAll(".nv-slice")[0][prevI]).attr('sliceClicked',null).select("path").attr("d", arcDetails[prevI]);

                    BarChart.x(function(d) {
                        return fileContObj.getCurrencySymbol(d[fileCntAmt], d.Currency)
                    }).color([myColors[e.index]])
					BarChart.y(function(d) { return d[FileDonut] })

                    // console.log(obtainedCurrency)
    				// d3.select('#barChart svg').datum([{values : obtainedCurrency}]).transition().duration(750).call(BarChart);
    				d3.select('#barChart svg').datum([{values : obtainedCurrency}]).call(BarChart);

					d3.select('#barChart svg').selectAll(".tick text").call(wrap, this)

    				prevI = e.index;
    				getTotalVal = constructObject.calcTotal(obtainedCurrency, FileDonut);
    				Filestatus = e.data.key+" ("+getTotalVal+")";
    				$scope.individualName = e.data.key
    				$scope.fileDonutHeader = e.data.key+' ('+e.data[FileDonut]+')'
    				// console.log(e.data[FileDonut])

    			var obtainedStatus = constructObject.constructObj1(constructObject.getUniqueVal(e.data.values, "Status"), e.data.values, "Status");

    			//console.log(constructObject.getUniqueVal(e.data.values, "Status"),e.data.values,"Status")
    			//console.log(obtainedStatus)

    			compareStatus = constructObject.getUniqueVal(inData, "Status");
    			if(obtainedStatus.length < compareStatus.length){
    					var missingStatus = arr_diff(compareStatus, constructObject.getUniqueVal(obtainedStatus, "Name"));
    					for (var k in missingStatus) {
    						obtainedStatus.push({
    							'Name': missingStatus[k],
    							'Count':0,
    							'Amount':0
    						});
    					}

    				}
    				obtainedStatus = $filter('orderBy')(obtainedStatus,'Name')
    				statusChart.barColor([myColors[e.index]])
    				//d3.select('#lineChart svg').datum([{values : obtainedStatus}]).transition().duration(750).call(statusChart);
    				d3.select('#lineChart svg').datum([{values : obtainedStatus}]).call(statusChart);
    				/* prevI = e.index;
    				getTotalVal = constructObject.calcTotal(e.data.values, FileDonut);
    				Filestatus = e.data.key+" ("+getTotalVal+")";
    				$scope.individualName = e.data.key */
    			}
    			else{

                    $scope.fileChannelSelected = "";
    				d3.select(e.Iam.parentNode).selectAll(".nv-slice").attr('sliceClicked',null).classed('hover', false);
    				BarchartconstructedObj = $filter('orderBy')(BarchartconstructedObj,'Name')


    				BarChart.x(function(d) {
    				 //return constructObject.getCurrencySymbol(d, 'Name')
    				 return fileContObj.getCurrencySymbol(d[fileCntAmt], d.Name)
    				 }).color(d3.scale.myColors().range())
    				//d3.select('#barChart svg').datum([{values : BarchartconstructedObj}]).transition().duration(500).call(BarChart);
    				d3.select('#barChart svg').datum([{values : BarchartconstructedObj}]).call(BarChart);
    				prevI = -1;
    				getTotalVal = constructObject.calcTotal(BarchartconstructedObj, FileDonut);
    				Filestatus = "ALL"+" ("+getTotalVal+")";
    				$scope.individualName = 'ALL'

    				statusChart.barColor(function (d, i) {	return myColors[i]})
    			//d3.select('#lineChart svg').datum([{values : BarchartconstructedObj1}]).transition().duration(750).call(statusChart);
    			d3.select('#lineChart svg').datum([{values : BarchartconstructedObj1}]).call(statusChart);
    			$scope.fileDonutHeader = 'All ('+constructObject.calcTotal(constructedObj, FileDonut)+')'
    			}
    				$scope.$apply(function () {
    					$scope.barChartTitle= "File Channel - "+Filestatus;
    					//$scope.individual = Filestatus;

    				});
    				nv.utils.windowResize(BarChart.update);
    		});

    			nv.utils.windowResize(function(d){
    				Donutchart.update();
					d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select("#cstmtitle").remove();
					d3.select("#FileDetailsDonutChart svg").select(".nv-pie").select('.nv-pie-title').each(function(d){	
						d3.select(this.parentNode).append("svg:text").attr("id","cstmtitle").attr("dy","0em").attr("transform","translate(0, 0)").attr("style","text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class','nv-pie-title').text('Total '+val);
						d3.select(this.parentNode).append("svg:text").attr("id","cstmtitle").attr("dy","1.25em").attr("transform","translate(0, 0)").attr("style","text-anchor: middle;fill: rgb(0, 0, 0);font-size: 20px;").attr('class','nv-pie-title').text(getTotalVal);
						d3.select(this).remove()
					})
    			});
    			return Donutchart;
    		});

			function wrap(text, width) {
				console.log(text, width)
				/*text.each(function() {
					var text = d3.select(this),
						words = text.text().split(/\s+/).reverse(),
						word,
						line = [],
						lineNumber = 0,
						lineHeight = 1.1, // ems
						y = text.attr("y"),
						dy = parseFloat(text.attr("dy")),
						tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
					while (word = words.pop()) {
					line.push(word);
					tspan.text(line.join(" "));
					if (tspan.node().getComputedTextLength() > width) {
						line.pop();
						tspan.text(line.join(" "));
						line = [word];
						tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
					}
					}
				});*/
				}

    		//Line Chart

    		nv.addGraph(function() {
    		BarchartconstructedObj1 = constructObject.constructObj1(constructObject.getUniqueVal(inData, "Status"), inData, "Status");
    	BarchartconstructedObj1 = $filter('orderBy')(BarchartconstructedObj1,'Name')
    		statusChart = nv.models.multiBarHorizontalChart()
    		.x(function(d) { return d.Name })
    		.y(function(d) {
    		return d[FileDonut] })
    	    .barColor(function (d, i) {
    	        //return myColors[i]
                return $scope.selectStatuscolor([d.Name])
    	    })
    		.showValues(true)
    		.valueFormat(function(d){ return d3.format(',')(d);})
    		.showControls(false)
    		.showLegend(false)
    		.margin({left:90,bottom:0,top:0})
    		.showYAxis(false);
    		/*statusChart.yAxis.axisLabel('Count')
    		statusChart.yAxis.rotateLabels(-45)
    		.xAxis.axisLabel('Channel vs Status')
    		.yAxis.axisLabel('Count');
    		console.log(data.FileStatus[1])
    		var val = [{color : 'red', values : data.FileStatus[0]},{color : 'blue', values : data.FileStatus[1]}]*/

            //d3.select('#lineChart svg').datum([{values : BarchartconstructedObj1}]).transition().duration(500).call(statusChart);
            d3.select('#lineChart svg').datum([{values : BarchartconstructedObj1}]).call(statusChart);

    	nv.utils.windowResize(statusChart.update);


    	statusChart.multibar.dispatch.on("elementClick", function(e) {

//    	   console.log(e)
  //  	   console.log($scope.fileChannelSelected)

    	   if($scope.fileChannelSelected)
    	   {
    	   $scope.fileChannelSelected = $filter('addunderscore')($scope.fileChannelSelected)
    	   }

    	   dBoardtoFileList(GlobalService,e.data.Name,$scope.fileChannelSelected)
    	   //$location.path('app/filelist')
		   $state.go("app.instructions")
    	   $('.nvtooltip').css({
                               'display' : 'none'
                               });
    	   $('.toggleTop').click()



          });



    		return statusChart;
    		});

    		//Bar chart
    		nv.addGraph(function() {

    			BarchartconstructedObj = constructObject.constructObj1(constructObject.getUniqueVal(inData, "Currency"), inData, "Currency");

    			$scope.$apply(function () {
    				$scope.barChartTitle= "File Channel - ALL "+'('+constructObject.calcTotal(BarchartconstructedObj, FileDonut)+')';
    				$scope.individual = 'ALL '+'('+constructObject.calcTotal(BarchartconstructedObj, FileDonut)+')';
    				$scope.individualName = 'ALL'

    			});
    			BarchartconstructedObj = $filter('orderBy')(BarchartconstructedObj,'Name')
    			BarChart = nv.models.discreteBarChart()
    			.x(function(d,i) {
					return fileContObj.getCurrencySymbol(d[FileDonut],d.Name)
                })

    			.y(function(d) {

    			 return d[FileDonut];

    			 })
                .color(d3.scale.myColors().range())
    			.showYAxis(false)
    			.margin({bottom:70})
    			.showValues(true)
    			.valueFormat(function(d){ return d3.format(',')(d);});
    			BarChart.xAxis.axisLabel('Currency vs '+val);
    			BarChart.xAxis.rotateLabels(-45);
    			BarChartDatum = d3.select('#barChart svg');
    			//BarChartDatum.datum([{values : BarchartconstructedObj}]).transition().duration(750).call(BarChart);
    			BarChartDatum.datum([{values : BarchartconstructedObj}]).call(BarChart);
                nv.utils.windowResize(BarChart.update);
                /*d3.select('#barChart').selectAll(".nv-bar").on("click", function (e) {
                    fileToCurrency(e.Name)
                });*/
                return BarChart;
    		});
    		}

            //this condition works when the data is not present
            if (Object.keys(restdata).length == 0)
            {


                //this condition works when the data is empty
				  $scope.fileNotfound = true;

				  $scope.checkstatusBarVal()

				PersonService1.GetChart1().then(function (items) {
                        $scope.restdataFileStatus = items.data.FileStatus;
                        var FileDonut, prevI, arcDetails;
                        $scope.barChartTitle = '';

				        $scope.fileDetailChart(fileCntAmt);

                });
			}
			else {
			    //this condition works when the data is present

		      $scope.fileNotfound = false;

		    $scope.fCntAmt=[];

            $scope.uniqueFileStatus = constructObject.getUniqueVal(restdata.FileStatus,'Status')
            for(var i in $scope.uniqueFileStatus)
            {
                $scope.fCnt=0;
                for(var j in restdata.FileStatus)
                {
                    if($scope.uniqueFileStatus[i] == restdata.FileStatus[j].Status)
                    {
                        $scope.fCnt = $scope.fCnt+restdata.FileStatus[j].Count;
                    }
                }

               $scope.fCntAmt.push({'Status':$scope.uniqueFileStatus[i],'Count':$scope.fCnt})
            }

            for(var i in $scope.statusBarVal)
            {
                for(var j in $scope.fCntAmt)
                {
                   if($scope.statusBarVal[i].NavStatus == $scope.fCntAmt[j].Status)
                    {
                    $scope.statusBarVal[i].Count = $scope.fCntAmt[j].Count;
                    }
                }
            }



        /*** File Details Chart Control Starts Here ***/

                    $scope.restdataFileStatus = restdata.FileStatus;
       				var FileDonut, prevI, arcDetails;
       				$scope.barChartTitle = '';


                   $scope.fileDetailChart(fileCntAmt);
        /*** File Details Chart Control Ends Here ***/
        }

    })
	.error(function (data, status, headers, config) {
		

		if (status == 401) {
			if(configData.Authorization=='External'){										
				window.location.href='/VolPayHubUI'+configData['401ErrorUrl'];
			}
			else{
				LogoutService.Logout();
			}
		}
		else
		{
			
			$scope.alerts = [{
				type : 'danger',
				msg : data.error.message
			}];

		}
	});


		var find1 = $('.custDropDown').find('.mylist li:first-child');
		//var _id = find1.attr('id').split('_')[1];

		$(find1).addClass('listSelected');

		var childTxt = "Count";
		var txt = "All";

		//console.log(srcChannelObj)

		$scope.chartDrop = function (eve) {
   var parent = $(eve.currentTarget).parent().parent().find('button').find('a')
		
		var parentTxt = parent.text();

		var child = $(eve.currentTarget);
		var id = child.attr('id').split('_')[1];
		//childTxt = child.text()
		childTxt = child.find('a').html()

		console.log(parent,childTxt)
		//console.log(child.find('a').html()	)
                if (id == 11 || id == 12) {
					$('.listClass6').addClass('listNotSelected').removeClass('listSelected')
				}
				$(child).addClass('listSelected').removeClass('listNotSelected');

			$(parent).html(childTxt)
        }



		$scope.closeAlert = function (index) {
			$scope.alerts.splice(index, 1);
		};

	}

	//$scope.allData = DashboardService.allData;
	$scope.allData = true;


	var objData = {};

	if ($scope.allData) {
		objData = {};
		objData.IsAllInfoRead = true;
		$scope.dashboardData(objData);
	}

	$scope.dashboardPrint = function () {
		$('[data-toggle="tooltip"]').tooltip('hide');
		window.print()
	}

/* 	$scope.dashboardToAllPayment = function (status) {

		AllPaymentsGlobalData.fromDashboard = true;
		AllPaymentsGlobalData.paymentStatusDropVal = status;
		AllPaymentsGlobalData.AdPaymentId = "";
		AllPaymentsGlobalData.CreditorAccount = "";
		AllPaymentsGlobalData.CreditorCustomerId = "";
		AllPaymentsGlobalData.CreditorName = "";
		AllPaymentsGlobalData.DataLoadedCount = 20;
		AllPaymentsGlobalData.DebtorAccount = "";
		AllPaymentsGlobalData.DebtorCustomerId = "";
		AllPaymentsGlobalData.DebtorName = "";
		AllPaymentsGlobalData.FLuir = "";
		AllPaymentsGlobalData.MOPoptionDropVal = "--Select--";
		AllPaymentsGlobalData.Paymentstatus = true;
		AllPaymentsGlobalData.SelectSearchVisible = false;
		AllPaymentsGlobalData.ShowEndDate = "";
		AllPaymentsGlobalData.ShowStartDate = "";
		AllPaymentsGlobalData.adAmount = false;
		AllPaymentsGlobalData.adCreditorAccount = false;
		AllPaymentsGlobalData.adCreditorCustomId = false;
		AllPaymentsGlobalData.adCreditorName = false;
		AllPaymentsGlobalData.adDebtorAccount = false;
		AllPaymentsGlobalData.adDebtorCustomId = false;
		AllPaymentsGlobalData.adDebtorName = false;
		AllPaymentsGlobalData.adEntrydate = false;
		AllPaymentsGlobalData.adMop = false;
		AllPaymentsGlobalData.adMsgrefid = false;
		AllPaymentsGlobalData.adPaymentcurrency = false;
		AllPaymentsGlobalData.adPaymentid = false;
		AllPaymentsGlobalData.adSrcchannel = false;
		AllPaymentsGlobalData.adValuedate = false;
		AllPaymentsGlobalData.advancedSearchEnable = true;
		AllPaymentsGlobalData.advancedUIR = false;
		AllPaymentsGlobalData.all = true;
		AllPaymentsGlobalData.amountEnd = "";
		AllPaymentsGlobalData.amountStart = "";
		AllPaymentsGlobalData.custom = false;
		AllPaymentsGlobalData.ddCreditorAccountNumber = false;
		AllPaymentsGlobalData.ddCreditorCustomId = false;
		AllPaymentsGlobalData.ddCreditorName = false;
		AllPaymentsGlobalData.ddDebtorAccountNumber = false;
		AllPaymentsGlobalData.ddDebtorCustomId = false;
		AllPaymentsGlobalData.ddDebtorName = false;
		AllPaymentsGlobalData.endDate = "";
		AllPaymentsGlobalData.entryenddate = "";
		AllPaymentsGlobalData.entrystartdate = "";
		AllPaymentsGlobalData.isEntered = false;
		AllPaymentsGlobalData.isSortingClicked = false;
		AllPaymentsGlobalData.month = false;
		AllPaymentsGlobalData.monthEnd = "";
		AllPaymentsGlobalData.monthStart = "";
		AllPaymentsGlobalData.msgRefId = "";
		AllPaymentsGlobalData.myProfileFLindex = "";
		AllPaymentsGlobalData.orderByField = "ReceivedDate";
		AllPaymentsGlobalData.paymentCurrencyDropVal = "--Select--";
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
		AllPaymentsGlobalData.srcChannelDropVal = "--Select--";
		AllPaymentsGlobalData.startDate = "";
		AllPaymentsGlobalData.today = false;
		AllPaymentsGlobalData.todayDate = "";
		AllPaymentsGlobalData.uirTxtValue = "";
		AllPaymentsGlobalData.valueenddate = "";
		AllPaymentsGlobalData.valuestartdate = "";
		AllPaymentsGlobalData.week = false;
		AllPaymentsGlobalData.weekEnd = "";
		AllPaymentsGlobalData.weekStart = "";

		AllPaymentsGlobalData.FromDashboardFieldArr = ['Status=' + status];

		$location.path('app/allpayments');

	}
 */
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

	$timeout(function(){
	mediaMatches();
	},10)





	/*** On window resize ***/
	$(window).resize(function () {
		mediaMatches()
		$scope.$apply(function () {
			$scope.alertWidth = $('.alertWidthonResize').width();
		});
	});
	/*** On window resize ***/

	$('.channelLegendInbnd,.channelLegendCurDis,.channelLegendMOP,.channelLegendStatus').css({'opacity':1,'font-weight':'normal'})

};

    $(document).ready(function(){
        $timeout(function(){
        $scope.loadData();
        },300)
    })


    $scope.dashboardToFileList=function(status)
    {
    dBoardtoFileList(GlobalService,status)
    //$location.path('app/filelist')
	$state.go("app.instructions")
    }

   /* setTimeout(function(){
        $('.page-sidebar-menu').css({'pointer-events':'none'})
    },300)

    setTimeout(function(){
    $('.page-sidebar-menu').css('pointer-events','auto')
    },300)*/

});

