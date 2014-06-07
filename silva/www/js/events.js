(function(){
	'use strict';
	var events = angular.module('maLinkaEvents', []);
	events.factory('maLinkaEvents', ['$rootScope', function($rootScope) {
		var events = {
			back: {
				count: 0,
				click: function(e) {
					events.back.count++;
					console.log('back button clicked ' + events.back.count + ' times');
					if ($rootScope.ons.navigator.getPages().length > 1) {
						e.preventDefault();
						$rootScope.ons.navigator.popPage();
					} else {
						$rootScope.ons.slidingMenu.toggleMenu();
					}
				}
			},
			menu: {
				count: 0,
				click: function(e) {
					events.menu.count++;
					console.log('menu button clicked ' + events.menu.count + ' times');
					$rootScope.ons.slidingMenu.toggleMenu();
				}
			}
		};
		return events;
	}]);
})();
