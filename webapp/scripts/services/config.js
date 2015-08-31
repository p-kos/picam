'use strict';

/**
 * @ngdoc service
 * @name picamApp.config
 * @description
 * # config
 * Constant in the picamApp.
 */
angular.module('picamApp')
  .constant('config', {
    intervalTimeInSeconds:1000
    , serviceUrlBase: '/api'
  });
