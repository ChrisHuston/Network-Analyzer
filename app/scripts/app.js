'use strict';

/**
 * @ngdoc overview
 * @name networkAnalyzerApp
 * @description
 * # networkAnalyzerApp
 *
 * Main module of the application.
 */
angular
  .module('networkAnalyzerApp', [
    'ngAnimate',
    'ngRoute',
    'ngTouch', 'ngMaterial', 'ui.grid', 'ui.grid.selection', 'ui.bootstrap'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
