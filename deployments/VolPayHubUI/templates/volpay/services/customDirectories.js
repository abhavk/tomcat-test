VolpayApp.directive('preLoaderCircle', ['$rootScope',
    function($rootScope) {
        return {
            link: function(scope, ele) {
                    ele.addClass('hide');

                $rootScope.$on('$stateChangeStart', function() {
                    ele.removeClass('hide');
                });

                $rootScope.$on('$stateChangeSuccess', function() {
                    ele.addClass('hide');
                });
            }
        };
    }
])
VolpayApp.directive("httploader", function ($rootScope) {
    return function ($scope, element, attrs) {
        $scope.$on("showHttploader", function (event, args) {			
            return element.show();
        });
        return $scope.$on("hideHttploader", function (event, args) {
            return element.hide();
        });
    };
})
VolpayApp.factory('loadmeOnscroll', function ($q, $rootScope, $log) {

    var numofRestCalls = 0;
    return {
        request: function (config) {
            numofRestCalls++;
			onrequestTime = new Date().getTime();
            $rootScope.$broadcast("showHttploader");
            return config || $q.when(config)
        },
        requestError: function (rejection) {
            if (!(--numofRestCalls)) {
                $rootScope.$broadcast("hideHttploader");
            }
            return $q.reject(rejection);
		},
        response: function (response) {
			onresponseTime = new Date().getTime();
			timeTaken = (onresponseTime - onrequestTime)*50;
            if ((--numofRestCalls) === 0) {
				setTimeout(function(){					
                	$rootScope.$broadcast("hideHttploader");
				},timeTaken)
            }
			/*if(response.data.responseMessage){
				console.log(response)
				$rootScope.$broadcast("successMsg",{ msg: response.data.responseMessage });
			}*/
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (!(--numofRestCalls)) {
                $rootScope.$broadcast("hideHttploader");
            }
			//$rootScope.$broadcast("errorMsg",{ msg: rejection.data.error });
			//console.log(response)
            return $q.reject(response);
        }
    };
})