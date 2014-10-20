(function() {
  'use strict';
  var mmHttp = angular.module('mmHttp', ['angularFileUpload', 'mmAnswer']);

  mmHttp.factory('mmHttp', ['$http', 'mmAnswer', function($http, answer) {
    var http = {
      url: 'http://192.168.0.10:1337',

      states: {
        not_checked: 'not_checked',
        connected: 'connected',
        disconnected: 'disconnected'
      },

      state: undefined,

      namespace: '/api/',

      all: function(type, success, failure) {
        http._get(type + '/all', success, failure);
      },

      add: function(type, data, success, failure) {
        http._post(type + '/add', data, success, failure);
      },

      sendFile: function(link, file, data, success, failure, onProgress) {
        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = file.substr(file.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";

        options.params = data;

        var ft = new FileTransfer();

        if (angular.isFunction(onProgress)) {
          ft.onprogress = function(progressEvent) {
            onProgress(progressEvent);
          };
        }
        ft.upload(
          file,
          http.url + http.namespace + link,
          function(answer) {
            if (angular.isFunction(success)) {
              var response = answer.response;
              try {
                success(JSON.parse(response));
              } catch (e) {
                success(response);
              }
            }
          },
          failure,
          options);
      },

      edit: function(type, data, success, failure) {
        http._put(type + '/edit/' + data.id, data, success, failure);
      },

      remove: function(type, data, success, failure) {
        http._delete(type + '/remove/' + data.id, success, failure);
      },

      get: function(link, success, failure) {
        http._get(link, success, failure);
      },

      post: function(link, data, success, failure) {
        http._post(link, data, success, failure);
      },

      put: function(what, data, success, failure) {
        http._put(what, data, success, failure);
      },

      delete: function(what, success, failure) {
        http._delete(what, success, failure);
      },

      _get: function(what, success, failure, ping) {
        if (http.state !== http.states.connected && !ping) {
          console.log(http.states.disconnected);
          if (angular.isFunction(failure)) {
            failure(http.states.disconnected);
          }
          return;
        }

        $http.get(http._toUrl(what)).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
          }
        }).error(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      },

      _post: function(what, data, success, failure) {
        if (http.state !== http.states.connected) {
          console.log(http.states.disconnected);
          if (angular.isFunction(failure))
            failure(http.states.disconnected);
          return;
        }

        var url = http._toUrl(what);
        console.log('http::_post url=\'' + url + '\' data=' + JSON.stringify(data));
        $http.post(url, data).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
          }
        }).error(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      },

      _put: function(what, data, success, failure) {
        if (http.state !== http.states.connected) {
          console.log(http.states.disconnected);
          if (angular.isFunction(failure))
            failure(http.states.disconnected);
          return;
        }

        $http.put(http._toUrl(what), data).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
          }
        }).error(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      },

      _delete: function(what, success, failure) {
        $http.delete(http.namespace + what).success(function(data, status, headers, config) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(success)) {
            success(data, status);
          }
        }).error(function(data, status) {
          console.debug(what + '; status: ' + status);
          console.debug(data);
          if (angular.isFunction(failure)) {
            if (status === 419) {
              failure(answer.server.project.closed, status);
            } else {
              failure(data, status);
            }
          }
        });
      },

      _toUrl: function(what) {
        return http.url + http.namespace + what;
      },

      _ping: function() {
        http._get('ping', function(data) {
          if (data === 'pong') {
            http.state = http.states.connected;
          }
        }, function(message) {
          http.state = http.states.disconnected;
          alert(message);
        }, true);
      }
    };
    http._ping();
    return http;
  }]);

})();
