var wpApp;
// Define App
wpApp = angular.module('wpApp', ['ngRoute', 'ngResource']);

wpApp.filter('to_trusted', ['$sce', function($sce){
    return function(text) {
        return $sce.trustAsHtml(text);
    };
}]);

// Initial Run setup
wpApp.run(function($rootScope, $http, $sce, $location, $q) {
	
});