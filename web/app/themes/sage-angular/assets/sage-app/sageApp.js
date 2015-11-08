/* ========================================================================
 * Angular code goes here:
 * ======================================================================== */

var sageApp = angular.module('sageApp', ['ui.router', 'ui.bootstrap', 'ngRoute'])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider) {
    // For any unmatched url, redirect to /
    $urlRouterProvider.otherwise('/');
    $locationProvider.html5Mode(true);

    // Routes
    $stateProvider
      .state('index', {
        url: '/',
        controller: 'sageAppIndexController',
        templateUrl: GLOBALS.partialsPath + 'index.html',
      })
      .state('index.substate', {
        url: 'substate',
        templateUrl: GLOBALS.partialsPath + 'substate.html',
        controller: 'substateController'
      })
      .state('index.poststate', {
        url: '/:slug',
        templateUrl: GLOBALS.partialsPath + 'poststate.html',
        controller: 'postsController'
      })
      // .state('index.contentstate', {
      //   url: '/:slug',
      // 	templateUrl: GLOBALS.partialsPath + 'content.html',
      // 	controller: 'contentController'
      // })
    ;
  })

.controller('sageAppController', function($scope, $http, $routeParams) {
  $scope.hello = 'Hello World';
  $http.get('wp-json/posts/?filter[name]=' + $routeParams.slug)
    .success(function(res) {
      $scope.post = res[0];
    });
})

.controller('sageAppIndexController', function($scope) {
    $scope.hello = 'Hello World';
  })
  .controller('postsController', function($scope) {
    $scope.hello = 'Goodbye Cruel World';

  })
  .controller('contentController', function($scope) {
    $scope.hello = 'A single post';

  });
