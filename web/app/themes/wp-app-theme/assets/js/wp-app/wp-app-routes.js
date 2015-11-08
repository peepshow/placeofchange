wpApp.config(function($routeProvider) {

	// Sign Up
	$routeProvider.when('/signup/', {
		controller: SignUpCtrl,
		templateUrl: APIdata.templateUrl + '/wp-app-templates/signup.html'
	});
	
	$routeProvider.when('/new-style-guide/', {
		controller: StyleGuideCtrl,
		templateUrl: APIdata.templateUrl + '/wp-app-templates/new-style-guide.html'
	});

});