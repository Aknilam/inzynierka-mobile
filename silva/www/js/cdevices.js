(function() {
  'use strict';
  var mmDevices = angular.module('mmDevices', []);

  mmDevices.factory('mmDevices', ['$cordovaCamera', '$cordovaGeolocation', '$cordovaDeviceOrientation',
    function($cordovaCamera, $cordovaGeolocation, $cordovaDeviceOrientation) {
      var mmDevices = {
        toast: function(text, which) {
          if (which) {
            window.Toast.show_long(text);
          } else {
            window.Toast.show_short(text);
          }
        },
        gps: function(success, failure) {
          $cordovaGeolocation.getCurrentPosition().then(function(position) {
            if (angular.isFunction(success)) {
              success({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              });
            }
          }, function(err) {
            if (angular.isFunction(failure)) {
              failure(err);
            }
          });
        },
        camera: function(success, failure) {
          var options = {
            quality : 75,
            destinationType : Camera.DestinationType.FILE_URI,
            sourceType : Camera.PictureSourceType.CAMERA,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false
          };

          $cordovaCamera.getPicture(options).then(function(imageData) {
            if (angular.isFunction(success)) {
              success(imageData);
            }
          });
        },
        orientation: function(success, failure) {
          $cordovaDeviceOrientation.getCurrentHeading().then(function(result) {
            if (angular.isFunction(success)) {
              success(result);
            }
          }, function(error) {
            if (angular.isFunction(failure)) {
              failure(error);
            }
          });
        }
      };
      return mmDevices;
    }
  ]);
})();
