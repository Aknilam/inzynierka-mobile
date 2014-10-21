var GpsPlugin = function() {
};

GpsPlugin.prototype.getPosition = function(win, fail) {
  cordova.exec(win, fail, "GpsPlugin", "get_position", []);
};

var gpsPlugin = new GpsPlugin();
module.exports = gpsPlugin;
