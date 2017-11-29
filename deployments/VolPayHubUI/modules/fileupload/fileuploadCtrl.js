// console.log(new Date());
//console.log(Number(new Date()));
//console.log(Date().toString());

var d = new Date();
var n = d.toISOString();
//console.log(n);

VolpayApp.directive('fileModel', ['$parse', function ($parse) {

			return {
				restrict : 'A',
				link : function (scope, element, attrs) {

					//console.log(attrs)
					var model = $parse(attrs.fileModel);
					//var model = $parse(attrs.fileModel);

					// console.log(model)
					var modelSetter = model.assign;

					element.bind('change', function () {
						scope.$apply(function () {
							modelSetter(scope, element[0].files[0]);
						});
					});
				}
			};
		}
	]);

VolpayApp.controller('fileuploadCtrl', ['$scope', '$http', '$timeout', '$location', '$filter', 'LogoutService','GlobalService', function ($scope, $http, $timeout, $location, $filter, LogoutService,GlobalService) {

			var interval = "";
			clearInterval(interval)
			interval = setInterval(function () {
					if (!$('#PaymentModule').hasClass('open')) {
						sidebarMenuControl('PaymentModule', 'FileUpload')
					} else {
						clearInterval(interval)
					}
				}, 100)

				$scope.uploadedFileDetail = [];
			$scope.AllowUpload = true;
			$scope.srcChannelArr = [];
			$scope.srcChannelData = [];
			$scope.selectOptions = []

			var srcChObj = {}
			srcChObj.UserId = sessionStorage.UserID;

			//$http.get(BASEURL + RESTCALL.PartyCodeDropdown).then(function (response) {
				
			
			/*$http({
			method: 'GET',
			url: BASEURL + RESTCALL.PartyCodeDropdown,
			params:{'start':0,'count':1000}
			}).then(function (response) {
				console.log(response)
				var srcChannel = response.data;
				$scope.selectOptions = response.data;
				

			}, function (err) {
				// console.error('ERR', err);
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
			});*/


				


	$(document).ready(function(){
	

		$scope.limit = 500;

		$scope.remoteDataConfig = function()
		{
			
			$("#Filechannel").select2({
				ajax:{
					url:BASEURL + RESTCALL.PartyCodeDropdown,
					headers: {"Authorization" : "SessionToken:"+sessionStorage.SessionToken,"Content-Type" : "application/json"},
					dataType: 'json',
					delay: 250,
					xhrFields : {
						withCredentials : true
					},
					beforeSend : function(xhr){
					xhr.setRequestHeader('Cookie', document.cookie),
					xhr.withCrendentials = true
					},
					crossDomain : true,
					data:function(params)
						{
							console.log("1",params)
							var query = {
								start : params.page * $scope.limit ? params.page * $scope.limit : 0,
								count : $scope.limit
							}

							if(params.term){
							query = {
								search : params.term,
								start : params.page * $scope.limit ? params.page * $scope.limit : 0,
								count : $scope.limit
							};
						 }
							return query;
						},
					processResults:function(data,params)	
						{
							params.page = params.page ? params.page : 0;
							var myarr = []
							
							for(j in data){
								myarr.push({
									'id' : data[j].actualvalue,
									'text':data[j].displayvalue
								})
							}
							return {
								results: myarr,
								pagination: {
									more: data.length >= $scope.limit   
								}
							};
							
						},
					cache: true
				},
				placeholder : 'Select an option',
				minimumInputLength: 0,
				allowClear : true

			})
		}

		$scope.remoteDataConfig()

	})















			if (sessionStorage.uploadedFileDetail) {
				$scope.showUploadedfileDetails = true;

				$scope.uploadedFile = JSON.parse(sessionStorage.uploadedFileDetail)

					$scope.uploadedFileDetail = JSON.parse(sessionStorage.uploadedFileDetail);
				$scope.uploadedFileDetail.reverse();

			}

			$scope.uploaded = false;
			$scope.filesizeTooLarge = false;

			$scope.fileNameChanged = function (element) {

				var file = element.files[0]
					$scope.DeepFile = {
					"name" : element.files[0].name,
					"size" : element.files[0].size,
					"type" : element.files[0].type,
					"webkitRelativePath" : element.files[0].webkitRelativePath,
					"lastModifiedDate" : element.files[0].lastModifiedDate,
					"lastModified" : element.files[0].lastModified
				}

				$scope.file = angular.copy($scope.DeepFile)

					var str = file.name.split('.')[1];
				if (str == 'mt') {
					$scope.SwiftFileType = "text/plain"
						$scope.fileType = "text/plain";
				} else {
					$scope.SwiftFileType = "";
					$scope.fileType = $scope.file.type;
				}
				$scope.fileStatus = "File selected";

				if (($scope.file.size > 1024 * 1024)) {
					/*** for MB ***/
					$scope.UploadedFileSize = $scope.file.size / 1024 / 1024;
					// console.log($scope.UploadedFileSize)
					if ($scope.UploadedFileSize > sessionStorage.fileUploadLimit) {
						$('#uploadBtn').val('')

						$scope.filesizeTooLarge = true;

						$scope.alerts = [{
								type : 'danger',
								msg : "Your file size too large to upload. Maximum file upload limit is " + sessionStorage.fileUploadLimit + " MB ."
							}
						];

					} else {
						$scope.filesizeTooLarge = false;
						$('.alert-danger').alert('close')
					}

				} else {
					//$scope.filesizeTooLarge = false;

					//$('.alert-danger').alert('close')
					/*** For KB ***/
					$scope.UploadedFileSize = $scope.file.size / 1024;
					if ($scope.UploadedFileSize > sessionStorage.fileUploadLimit * 1024) {
						$('#uploadBtn').val('')
						$scope.filesizeTooLarge = true;
						$scope.alerts = [{
								type : 'danger',
								msg : "Your file size too large to upload. Maximum file upload limit is " + sessionStorage.fileUploadLimit + "KB."
							}
						];
					} else {
						$scope.filesizeTooLarge = false;
						$('.alert-danger').alert('close')
					}

				}

				if ($("#uploadBtn").val() != '') {
					$scope.showFileSize = true;
				} else {
					$scope.showFileSize = false;
				}
				$scope.Deepfile = angular.copy($scope.file)

			}

			$scope.alertMsg = false;

			$scope.uploadFile = function () {

				$scope.progress = 0;
				$scope.uploadTime = '';
				$scope.startTime = new Date().getTime();

				$scope.srcChannel = $('#Filechannel').val()

					$('#uploadHere').addClass('disabled');

				$scope.progress = 0;
				$scope.uploaded = true;
				var file = $scope.myFile;
				var binaryData;
				var uploadObj = {};

				$scope.uploadFileToUrl = function (file, srcChannel) {

					var reader = new FileReader();

					reader.onload = function (e) {
						var encoded_file = toUTF8Array(e.target.result.toString());
						var aa = textToBin(e.target.result.toString())

							//uploadObj.UserId = sessionStorage.UserID;
						uploadObj.InstructionData = aa;
						uploadObj.InstructionFileName = file.name;
						uploadObj.PSACode = srcChannel;

						var xhr = new XMLHttpRequest();
						xhr.upload.addEventListener("progress", uploadProgress, false);
						xhr.addEventListener("load", uploadComplete, false);
						xhr.addEventListener("error", uploadFailed, false);
						xhr.addEventListener("abort", uploadCanceled, false);
						xhr.withCredentials = true;
						xhr.open("POST", BASEURL + RESTCALL.FileUpload)

						xhr.setRequestHeader("Content-Type", "application/json");
						xhr.setRequestHeader("Authorization", "SessionToken:" + sessionStorage.SessionToken);
						xhr.send(JSON.stringify(uploadObj));

						xhr.onreadystatechange = function () {
							if (xhr.readyState == 4 && xhr.status == 200) {								
								// alert("aaaa")
							}

						};

						/*** Upload in Progress ***/

						function uploadProgress(evt) {

							$scope.fileStatus = "Upload in progress";

							console.log(evt)
							$scope.$apply(function () {
								if (evt.lengthComputable) {
									$scope.progress = Math.round(evt.loaded * 100 / evt.total)
										//$scope.progress = Math.ceil((evt.loaded / evt.total) * 100);

										//console.log("Progress---"+$scope.progress)
								} else {
									$scope.progress = 0;
								}

							})
						}

						/*** Upload complete ***/

						function uploadComplete(evt) {

								$('#uploadHere').removeClass('disabled');

							console.log(evt)
							if( (evt.currentTarget.readyState == 4) && ((evt.currentTarget.status == 202) || (evt.currentTarget.status == 201))) {
									console.log( JSON.parse(evt.currentTarget.response))
								$scope.showUploadedfileDetails = true;
								

									$scope.alerts = [{
										type : 'success',
										msg :  JSON.parse(evt.currentTarget.response).responseMessage
									}
								];

								$scope.fileStatus = "Uploaded";

								var timeTaken = new Date().getTime() - $scope.startTime;
								$scope.uploadTime = timeConversion(timeTaken)

									$timeout(function () {
										/*$scope.alerts = [{
										type : 'success',
										msg : "File uploaded successfuly."
										}
										];*/

										$scope.alertStyle = alertSize().headHeight;
										$scope.alertWidth = alertSize().alertWidth;

										//$scope.srcChannel = "";
										$('#uploadBtn').val('')
										$scope.showFileSize = false;
									}, 1000)

									$timeout(function () {

										$('.alert-success').alert('close')

									}, 5000);

									console.log(JSON.parse(evt.currentTarget.response),(evt.currentTarget.status))

									if(evt.currentTarget.status == 202)
									{

									
									$scope.Dval  =JSON.parse(evt.currentTarget.response).BusinessPrimaryKey[0].Value; 
									$scope.Dval = $scope.Dval.split('[')
									$scope.Dval1 = $scope.Dval[1].split(']')
									$scope.Dval1 = $scope.Dval1[0]
								}
								else
								{
									$scope.Dval  =JSON.parse(evt.currentTarget.response)
									$scope.Dval1 = $scope.Dval.Approval.ID;
								}
									
								$scope.fileInfo = {
									"FileName" : $scope.file.name,
									"InstructionID" : $scope.Dval1,
									"PsaCode" : $scope.srcChannel,
									"FileSize" : $scope.UploadedFileSize,
									"TimeTaken" : $scope.uploadTime,
									"UploadTime" : $filter('datetime')(new Date()),
									"FileType" : $scope.fileType
								}

								console.log($scope.fileInfo)

								$scope.uploadedFileDetail.push($scope.fileInfo);
								$scope.uploadedFileDetail.reverse();

								sessionStorage.uploadedFileDetail = JSON.stringify($scope.uploadedFileDetail);
								$scope.uploadedFile = JSON.parse(sessionStorage.uploadedFileDetail)
								$scope.showUploadedfileDetails = true;

								

								setTimeout(function () {
									$scope.file = {};
									$scope.fileStatus = '';
									$scope.uploaded = false;
									$scope.UploadedFileSize = '';
									$scope.SwiftFileType = ""
									$scope.fileType = "";
								}, 1500)
							} else {
								//$('#uploadHere').removeClass('disabled');
								$scope.fileStatus = "Failed";
								$scope.alerts = [{
										type : 'danger',
										msg : JSON.parse(evt.currentTarget.response).error.message
									}
								];
							}

							/* This event is raised when the server send back a response */

						}

						function uploadFailed(evt) {

							$scope.fileStatus = "Failed";
							// alert("There was an error attempting to upload the file.")
							$scope.alerts = [{
									type : 'danger',
									msg : "There was an error attempting to upload the file."
								}
							];
						}

						function uploadCanceled(evt) {

							$scope.fileStatus = "Cancelled";
							$scope.$apply(function () {
								$scope.uploaded = false;
							})
							// alert("The upload has been canceled by the user or the browser dropped the connection.")
							$scope.alerts = [{
									type : 'danger',
									msg : "The upload has been canceled by the user or the browser dropped the connection."
								}
							];
						}

					};

					reader.readAsText(file);

				}

				if (!$scope.filesizeTooLarge) {
					$scope.uploadFileToUrl(file, $scope.srcChannel);
				}

			};

			function timeConversion(millisec) {

				var seconds = (millisec / 1000).toFixed(1);

				var minutes = (millisec / (1000 * 60)).toFixed(1);

				var hours = (millisec / (1000 * 60 * 60)).toFixed(1);

				var days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

				if (seconds < 60) {
					return seconds + " Sec";
				} else if (minutes < 60) {
					return minutes + " Min";
				} else if (hours < 24) {
					return hours + " Hrs";
				} else {
					return days + " Days"
				}
			}
			
			
			$scope.clickRefId = function (id) {		
				
				GlobalService.fileListId = id;
				$location.path('app/filedetail')
			}

		}
	]);