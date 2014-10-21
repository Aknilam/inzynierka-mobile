(function() {
  'use strict';
  var mmAlert = angular.module('mmAlert', ['ngCordova']);

  mmAlert.factory('mmAlert', ['$cordovaToast', function($cordovaToast) {
    var alert = {
      types: {
        success: 'success',
        info: 'info',
        warning: 'warning',
        danger: 'danger'
      }
    };
    angular.forEach(alert.types, function(type) {
      alert[type] = function(text) {
        if (window.plugins && window.plugins.toast) {
          $cordovaToast.show(text, 'short', 'bottom');
        }
      };
    });
    return alert;
  }]);
})();
