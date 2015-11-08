sageApp.controller('contentController', function($scope, $http, $routeParams) {
	$http.get('wp-json/wp/v2/post/?filter[name]=' + $routeParams.slug).success(function(res){
		$scope.post = res;
	});
});
