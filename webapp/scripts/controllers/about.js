'use strict';

/**
 * @ngdoc function
 * @name picamApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the picamApp
 */
angular.module('picamApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
