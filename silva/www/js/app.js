(function(){
	'use strict';
	var app = angular.module('myApp', ['onsen.directives', 'maLinkaEvents']);
	app.controller('app', ['$scope', 'maLinkaEvents', function($scope, events) {
		document.addEventListener('backbutton', events.back.click, true);
		document.addEventListener('menubutton', events.menu.click, true);

		$scope.events = events;
	}]);
})();
