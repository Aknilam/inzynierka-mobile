(function() {
  'use strict';
  var mmMaterials = angular.module('mmMaterial', []);

  mmMaterials.factory('mmMaterial', [
    function() {
      var mmMaterial = {
        focused: {},

        isSet: false,

        set: function(material) {
          mmMaterial.focused = material;
          mmMaterial.isSet = true;
        },

        unset: function() {
          delete mmMaterial.focused;
          mmMaterial.isSet = false;
        }
      };
      return mmMaterial;
    }
  ]);

  mmMaterials.controller('mmMaterialCtrl', ['$scope', function($scope) {
    $scope.material = MATERIAL;
  }]);

})();
