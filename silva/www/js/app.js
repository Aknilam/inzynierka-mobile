(function() {
	'use strict';
	var mmApp = angular.module('mmApp', [
    'onsen.directives',
    'ui.bootstrap',
    'ngTagsInput',
    'mmEvents',
    'mmAlert',
    'mmLogin',
    'mmProjects',
    'mmProject',
    'mmMaterials',
    'mmTags'
  ]);

	mmApp.controller('mmAppCtrl', [
    '$rootScope',
    '$scope',
    'mmLogin',
    'mmProjects',
    'mmProject',
    'mmMaterials',
    'mmTags',
    'mmEvents',
    function($rootScope, $scope, LOGIN, PROJECTS, PROJECT, MATERIALS, TAGS, events) {
    document.addEventListener('deviceready', events.assignEvents, false);

		$scope.events = events;

    $rootScope.LOGIN = LOGIN;

    $rootScope.PROJECT = PROJECT;

    $rootScope.PROJECTS = PROJECTS;

    $rootScope.TAGS = TAGS;

    $rootScope.MATERIALS = MATERIALS;
	}]);

  mmApp.directive('fullHeight', ['$window', function($window) {
    return {
      restrict: 'EA',
      link: function(scope, element) {
        var setHeight = function() {
          element.height(window.innerHeight - element[0].getBoundingClientRect().top + 'px');
        };
    
        angular.element($window).on('resize', function () {
          setHeight();
        });

        setHeight();
      }
    };
  }]);

  mmApp.filter('orderObjectBy', function() {
    return function(items, field, reverse, notRun) {

      var filtered = [];
      angular.forEach(items, function(item) {
        filtered.push(item);
      });

      if (!notRun) {
        filtered.sort(function(a, b) {
          return (a[field].toUpperCase() > b[field].toUpperCase() ? 1 : -1);
        });
      }

      if (reverse) filtered.reverse();
      return filtered;
    };
  });
})();
