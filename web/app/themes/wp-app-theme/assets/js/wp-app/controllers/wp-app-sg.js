function StyleGuideCtrl( $rootScope, $scope, StyleGuides ){

	StyleGuides.query( function(res) {
		$scope.sg = res;
	});
	
	$scope.newSG = {
		'status' : 'publish',
		'type' : 'style-guides'
	}
	
	$scope.newStyleGuide = function() {
		StyleGuides.save( $scope.newSG, function(res) { 
			console.log(res);
		})
	}
	

}