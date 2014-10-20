(function() {
  'use strict';
  var mmProject = angular.module('mmProject', ['mmHttp', 'mmAlert']);

  mmProject.factory('mmProject', ['mmHttp', 'mmAlert', function(http, alert) {
    var mmProject = {
      actual: undefined,

      isSet: false,

      onSetFunctions: [],

      onUnsetFunctions: [],

      set: function(project) {
        http.get('projects/enter/' + project.id, function(data) {
          project.ownerData = data.owner;
          project.members = data.members;
          mmProject.actual = project;
          mmProject.isSet = true;

          // run functions
          angular.forEach(mmProject.onSetFunctions, function(ftn) {
            ftn(project);
          });
        });
      },

      unset: function() {
        mmProject.actual = undefined;
        mmProject.isSet = false;

        // run functions
        angular.forEach(mmProject.onUnsetFunctions, function(ftn) {
          ftn();
        });
      },

      onSet: function(callback) {
        if (angular.isFunction(callback)) {
          mmProject.onSetFunctions.push(callback);
        }
      },

      onUnset: function(callback) {
        if (angular.isFunction(callback)) {
          mmProject.onUnsetFunctions.push(callback);
        }
      },

      get: function() {
        return mmProject.actual;
      },

      edit: function() {
        http.edit('projects', mmProject.actual, function(project) {
          mmProject.actual.name = project.name;
          mmProject.actual.description = project.description;
          mmProject.actual.accessible = project.accessible;
          alert.success('Project `' + project.name + '` saved successfully');
        });
      },

      open: function() {
        http.put('projects/open/' + mmProject.actual.id, {}, function(project) {
          console.log('project');
          console.log(project);
          mmProject.actual.accessible = project.accessible;
          alert.success('Project `' + project.name + '` opened');
        });
      },

      close: function() {
        http.put('projects/close/' + mmProject.actual.id, {}, function(project) {
          console.log('project');
          console.log(project);
          mmProject.actual.accessible = project.accessible;
          alert.success('Project `' + project.name + '` closed');
        });
      },

      allow: function() {
        http.put('projects/allow/' + mmProject.actual.id, {}, function(project) {
          console.log('project');
          console.log(project);
          mmProject.actual.editable = project.editable;
          alert.success('Project `' + project.name + '` editing allowed');
        });
      },

      deny: function() {
        http.put('projects/deny/' + mmProject.actual.id, {}, function(project) {
          console.log('project');
          console.log(project);
          mmProject.actual.editable = project.editable;
          alert.success('Project `' + project.name + '` editing disabled');
        });
      }
    };
    return mmProject;
  }]);

})();
