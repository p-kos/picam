'use strict';

/**
 * @ngdoc service
 * @name picamApp.imageProvider
 * @description
 * # imageProvider
 * Factory in the picamApp.
 */
angular.module('picamApp')
  .factory('imageProvider', function ($http, $q, config) {

    function httpRequest(url, action) {
      if (!action){
        action = 'GET';
      }
      var request = new XMLHttpRequest();
      var deferred = $q.defer();

      request.open(action, url, true);
      request.onload = onload;
      request.onerror = onerror;
      request.onprogress = onprogress;
      request.send();

      function onload() {
        if (request.status === 200) {
          deferred.resolve(JSON.parse(request.response));
        } else {
          deferred.reject(new Error("Status code was " + request.status));
        }
      }

      function onerror() {
        deferred.reject(new Error("Can't XHR " + JSON.stringify(url)));
      }

      function onprogress(event) {
        deferred.notify(event.loaded / event.total);
      }

      return deferred.promise;
    }
    // Public API here
    return {
      query: function () {
        var defered=$q.defer();
        var url = config.serviceUrlBase + '/images';
        return httpRequest(url);
      },
      get:function(id){
        var defered = $q.defer();
        if (id){
          var url = config.serviceUrlBase + '/images/' + id;
          return httpRequest(url);
        }
        else{
          defered.reject({success:false, reason:'id param must be set.'})
        }
        return defered.promise;
      },
      byDate:function(y,m,d) {
        var defered = $q.defer();
        if (y && m && d) {
          var year = String(y);
          var month = String(m);
          var day = String(d);
          if (month.length == 1) {
            month = '0' + month;
          }
          if (day.length == 1) {
            day = '0' + day;
          }
          var url = config.serviceUrlBase + '/images/date/' + year + '-' + month + '-' + day;
          return httpRequest(url);
        }
        else{
          defered.reject({success:false, reason:'y, m, d must be set.'})
        }
        return defered.promise;
      },
      getLasted:function(){
        var defered = $q.defer();
        var url = config.serviceUrlBase + '/getLastedImageByDate';
        return httpRequest(url);
      },
      getAllDates:function(){
        var defered = $q.defer();
        var url = config.serviceUrlBase + '/dates';
        return httpRequest(url);
      },

      deleteImagesFromDate:function(date){
        var url = config.serviceUrlBase + '/images/dates/' + date ;
        return httpRequest(url, 'DELETE');
      },

      motionStatus:function() {
       // var defered = $q.defer();
        var url = config.serviceUrlBase + '/motion';
        return httpRequest(url);
      },

      turnOnOffMotion:function(on){
        var value = 0;
        if (on && on === true){
          value = 1;
        }
        var url = config.serviceUrlBase + '/motion/' + value;
        return httpRequest(url);
      }
    };

  });
