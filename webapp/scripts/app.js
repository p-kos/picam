'use strict';

/**
 * @ngdoc overview
 * @name picamApp
 * @description
 * # picamApp
 *
 * Main module of the application.
 */
angular
  .module('picamApp', [
    'ngResource',
    'ngRoute'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
