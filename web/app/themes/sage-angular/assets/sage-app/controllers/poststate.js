// sageApp.controller('postsController', function($scope, $http, $routeParams) {
//   console.log('Main file loaded.');
//   $scope.substateHello = 'Goodbye Cruel World';
//   // $http.get('wp-json/posts/').success(function(res) {
//   //   $scope.posts = res;
//   // });
// });
// sageApp.controller('postsController', function($scope, $http, $routeParams) {
//   $scope.poststateHello = 'Hello Asshole, I\'m a substate.';
//   $http.get('wp-json/wp/v2/post/?filter[name]=' + $routeParams.slug).success(function(res) {
//     $scope.posts = res;
//   });
// });

//Content controller
sageApp.controller('postsController', ['$scope', '$http', '$routeParams', function($scope, $http, $routeParams) {
	$http.get('wp-json/posts/?filter[name]=' + $routeParams.slug).success(function(res){
		$scope.post = res[0];
	});
}]);
