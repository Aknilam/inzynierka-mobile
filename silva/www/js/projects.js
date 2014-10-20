(function() {
  'use strict';
  var mmProjects = angular.module('mmProjects', ['mmProject', 'mmHttp', 'mmAlert', 'mmAnswer']);

  mmProjects.factory('mmProjects', ['mmProject', 'mmHttp', 'mmAlert', 'mmAnswer', function(PROJECT, http, alert, answer) {
    var mmProjects = {
      data: {},

      get: function(id, callback) {
        if (angular.isDefined(data[id])) {
          callback(data[id]);
        } else {
          http.getId('projects', id, callback);
        }
      },

      getAll: function() {
        http.all('projects', function(projects) {
          angular.forEach(projects, function(project) {
            mmProjects.data[project.id] = mmProjects._create(project);
          });
        });
      },

      clean: function() {
        PROJECT.unset();
        mmProjects.data = {};
      },

      add: function(name, description) {
        http.add('projects', {name: name, description: description}, function(project) {
          mmProjects.data[project.id] = mmProjects._create(project);
          alert.success('Added project `' + name + '`');
        });
      },

      edit: function(project) {
        http.edit('projects', project, function(projectRes) {
          project.name = projectRes.name;
          project.actual.description = projectRes.description;
          project.accessible = projectRes.accessible;
          project.editable = projectRes.editable;
          alert.success('Project `' + project.name + '` saved successfully');
        });
      },

      join: function(accessCode) {
        http.post('projects/join', {accessCode: accessCode}, function(project) {
          mmProjects.data[project.id] = mmProjects._create(project);
          alert.success('Successfully joined to project `' + project.name + '`');
          PROJECT.set(mmProjects.data[project.id]);
        }, function() {
          alert.warning('Project already closed or doesn\'t exist');
        });
      },

      _create: function(project) {
        return {
          id: project.id,
          name: project.name,
          description: description;
          owner: project.owner,
          accessible: project.accessible,
          editable: project.editable,
          folderName: project.folderName,
          accessCode: project.accessCode
        };
      }
    };

    return mmProjects;
  }]);

})();
