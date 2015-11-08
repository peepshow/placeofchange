function SignUpCtrl( $rootScope, $scope, Users ){

	$scope.newUser = {};
	
	// New User
	$scope.newUserSubmit = function(){
		
		Users.save( $scope.newUser, function(res) {
			
			console.log( res.user_id );
				
			if( res.user_id ) {
				$scope.newUser = {};
				
				$scope.newUserConf = res;
				$scope.newUserConf.success = true;
				
			}
			
		});
	};

}