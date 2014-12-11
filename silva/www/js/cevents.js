(function() {
	'use strict';
	var mmEvents = angular.module('mmEvents', ['mmMaterials']);

	mmEvents.factory('mmEvents', ['$rootScope', 'mmMaterials', function($rootScope, materials) {
		var mmEvents = {
			assignEvents: function() {
				console.log('assignEvents');
        document.addEventListener('backbutton', mmEvents.back.click, false);
        document.addEventListener('menubutton', mmEvents.menu.click, false);
        document.addEventListener('searchbutton', mmEvents.search.click, false);
			},

			back: {
				count: 0,
				click: function(e) {
					mmEvents.back.count++;
					console.log('back button clicked ' + mmEvents.back.count + ' times');
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
					mmEvents.menu.count++;
					console.log('menu button clicked ' + mmEvents.menu.count + ' times');
					$rootScope.ons.slidingMenu.toggleMenu();
				}
			},
			search: {
				click: function() {
					console.log('search button clicked');
					/*var onSuccess = function(position) {
						console.log(
							'Latitude: '          + position.coords.latitude          + '\n' +
							'Longitude: '         + position.coords.longitude         + '\n' +
							'Altitude: '          + position.coords.altitude          + '\n' +
							'Accuracy: '          + position.coords.accuracy          + '\n' +
							'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
							'Heading: '           + position.coords.heading           + '\n' +
							'Speed: '             + position.coords.speed             + '\n' +
							'Timestamp: '         + position.timestamp                + '\n');
					};

					function onError(error) {
						console.log('code: '    + error.code    + '\n' +
							'message: ' + error.message + '\n');
					};

					var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, { maximumAge: 0, timeout: 30000, enableHighAccuracy: true });
					console.log('search button clicked behind');*/
				}
			}
		};
		return mmEvents;
	}]);
})();
