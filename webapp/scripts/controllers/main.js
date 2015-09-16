'use strict';

/**
 * @ngdoc function
 * @name picamApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the picamApp
 */
angular.module('picamApp')
  .controller('MainCtrl', function ($scope, $interval,  config, imageProvider) {

    $scope.imgSrc;
    var counter=1;
    var d = new Date();
    $scope.currentDate = d;
    $scope.Images = new Array();
    $scope.currentTime = "00:00:00";
    $scope.currentIndex = 0;
    $scope.speed = 1;
    imageProvider.getLasted()
      .then(function(images) {
          var firstImage = images[0];
          $scope.imgSrc = firstImage.FileName;
          $scope.currentIndex = 0;
          $scope.currentDate = firstImage.Date.substr(0, 10);

          angular.forEach(images, function (image, index) {
            $scope.Images.push({
              index: index,
              _id: image._id,
              FileName: image.FileName,
              Path: image.Path,
              Date: image.Date,
              Time: image.Date.substr(11),
              DateOnly: image.Date.substr(0, 10)
            });
          });

      }, function (error) {
        // If there's an error or a non-200 status code, log the error.
        console.error(error);
      }, function (progress) {
        // Log the progress as it comes in.
        $scope.currentTime = "Request progress: " + Math.round(progress * 100) + "%";
      });

    $scope.getImages = function(date) {
      //pause();
      var year =d.getFullYear();
      var month = d.getMonth() + 1;
      var day = d.getDate();
      if (date){
        year = date.substr(0,4);
        month = date.substr(5,2);
        day = date.substr(8,2);
      }

      imageProvider.byDate(year, month, day)
        .then(function (images) {
          if (images.length > 0) {
            var firstImage = images[0];
            $scope.imgSrc = firstImage.FileName;
            $scope.selectedItemId = firstImage._id;
            $scope.currentIndex = 0;
            $scope.currentDate = firstImage.Date.substr(0, 10);
            angular.forEach( images, function(image, index){
              $scope.Images.push({
                index:index,
                _id:image._id,
                FileName: image.FileName,
                Path: image.Path,
                Date: image.Date,
                Time: image.Date.substr(11),
                DateOnly: image.Date.substr(0, 10)
              });

            });
          }
        }, function (error) {
          // If there's an error or a non-200 status code, log the error.
          console.error(error);
        }, function (progress) {
          // Log the progress as it comes in.
          $scope.currentTime = "Request progress: " + Math.round(progress * 100) + "%";
        })
    };

    $scope.Dates = new Array();
    $scope.LoadingDates = "";
    imageProvider.getAllDates()
      .then(function(images) {
        angular.forEach(images, function (image, index) {
          $scope.Dates.push({
            index: index,
            _id: image._id,
            FileName: image.FileName,
            Path: image.Path,
            Date: image.Date,
            DateOnly: image.Date.substr(0, 10),
            Cnt:image.Cnt
          });
        });
        $scope.LoadingDates = "";
      }, function (error) {
        // If there's an error or a non-200 status code, log the error.
        console.error(error);
      }, function (progress) {
        // Log the progress as it comes in.
        $scope.LoadingDates = "Loading " + Math.round(progress * 100) + "%";
      });

    $scope.$watch('currentIndex', function() {

      if ($scope.currentIndex) {
        if ($scope.Images.length > 0) {
          $scope.imgSrc = $scope.Images[$scope.currentIndex].FileName;
        }
      }
    })


    var refreshImg;
    function createInterval() {
      var frecuency = config.intervalTimeInSeconds / $scope.speed;
      refreshImg = $interval(function () {
        play();
      }, frecuency);
    }

    $scope.$on('$destroy', function () {

      if (angular.isDefined(refreshImg)) {
        $interval.cancel(refreshImg);
        refreshImg = undefined;
      }
    });

    $scope.isPlaying=false;

    $scope.playPause=function(){
      if ($scope.isPlaying){
        $scope.pause();
      }
      else{
        $scope.speed = 1;
        play();
      }
    }

    var play = function () {
      $scope.isPlaying=true;
      if (!angular.isDefined(refreshImg)) {
        createInterval();
      }
      if ($scope.currentIndex <= $scope.Images.length) {
        $scope.selectedItemId = $scope.Images[$scope.currentIndex]._id;
        $scope.currentTime = $scope.Images[$scope.currentIndex].Date.substr(11) + ' - ' + $scope.Images[$scope.currentIndex].FileName;
        $scope.imgSrc = $scope.Images[$scope.currentIndex].FileName;
        $scope.currentIndex++;
      }
      else{
        $scope.currentIndex = 0;
        $scope.speed = 1;
        pause();
      }
    }
    $scope.pause=function(){
      $scope.isPlaying=false;
      if (angular.isDefined(refreshImg)) {
        $interval.cancel(refreshImg);
        refreshImg = undefined;
      }
    }

    $scope.setCurrentPositition=function() {
      var currentId = $scope.selectedItemId;
      for (var i = 0; i < $scope.Images.length; i++) {
        if ($scope.Images[i]._id == currentId) {
          $scope.currentIndex = i;
        }
      }
    }

    $scope.fwd=function(){
      if ($scope.isPlaying) {
        if ($scope.speed < 8) {
          $scope.speed = $scope.speed * 2;
        }
        else {
          $scope.speed = 1;
        }
        $scope.pause();
        play();
      }
    }
  });
