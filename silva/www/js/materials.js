(function() {
  'use strict';
  var mmMaterials = angular.module('mmMaterials', ['mmProject', 'mmMaterial', 'mmTags', 'mmHttp', 'mmAlert', 'mmAnswer', 'mmDevices']);

  mmMaterials.factory('mmMaterials', ['$rootScope', '$cordovaDialogs', 'mmProject', 'mmMaterial', 'mmTags', 'mmHttp', 'mmAlert', 'mmAnswer',
    function($rootScope, $cordovaDialogs, PROJECT, MATERIAL, TAGS, http, alert, answer) {
      var icon = {
        iconUrl: 'images/arrow.png',
        iconSize:     [30, 30], // size of the icon
        shadowSize:   [0, 0], // size of the shadow
        iconAnchor:   [30 / 2, 30 / 2], // point of the icon which will correspond to marker's location
        shadowAnchor: [0, 0],  // the same for the shadow
        popupAnchor:  [0, 0] // point from which the popup should open relative to the iconAnchor
      };
      var mmMaterials = {
        url: http.url,

        data: {},

        mapData: {},

        showAll: true,

        nonTagged: false,

        updateMapData: function(tag) {
          if (tag === 'nontagged') {
            mmMaterials.nonTagged = !mmMaterials.nonTagged;
          }

          var tags = TAGS.data;

          if (mmMaterials.showAll) {
            mmMaterials.mapData = mmMaterials.data;
          } else {
            var toReturn = {};
            angular.forEach(mmMaterials.data, function(material, name) {
              var materialTags = material.tags;
              var isOk = false;
              if (name === 'selected') {
                toReturn.selected = material;
              } else {
                if (Object.keys(materialTags).length > 0) {
                  for (var i in tags) {
                    for (var j in materialTags) {
                      if ( ( (tags[i].checked || tags[i].checked === 'true') && tags[i].checked !== 'false') &&
                          tags[i].id === materialTags[j].id
                        ) {
                          isOk = true;
                      }
                    }
                  }
                  if (isOk) {
                    toReturn[material.id] = material;
                  }
                } else {
                  if (mmMaterials.nonTagged) {
                    toReturn[material.id] = material;
                  }
                }
              }
            });
            mmMaterials.mapData = toReturn;
          }
        },

        setSelected: function(lat, lng) {
          if (angular.isUndefined(mmMaterials.data.selected)) {
            mmMaterials.data.selected = {
              lat: lat,
              lng: lng,
              name: "New marker",
              description: "",
              iconAngle: 0,
              icon: icon
            };
          } else {
            mmMaterials.data.selected.lat = lat;
            mmMaterials.data.selected.lng = lng;
            mmMaterials.data.selected.name = 'New marker';
            mmMaterials.data.selected.description = '';
            mmMaterials.data.selected.iconAngle = 0;
            mmMaterials.data.selected.icon = icon;
          }

          mmMaterials.updateMapData();
        },

        get: function(id, callback) {
          http.getId('materials', id, callback, answer.project.failure);
        },

        getAll: function() {
          mmMaterials.data = {};
          http.all('materials', function(materials) {
            angular.forEach(materials, function(material) {
              mmMaterials.data[material.id] = mmMaterials._create({
                id: material.id,
                createdAt: material.createdAt,
                updatedAt: material.updatedAt
              }, material.name, material.description, material.lat, material.lng, material.angle, material.fileName, material.tags);
            });

            mmMaterials.updateMapData();
          }, answer.project.failure);
        },

        clean: function() {
          mmMaterials.data = {};
        },

        selectedFile: undefined,

        setSelectedFile: function($files, where) {
          var file = $files[0];
          if (angular.isDefined(file)) {
            mmMaterials.selectedFile = file;
            var reader = new FileReader();
            reader.onload = function (e) {
              $(where).attr('src', e.target.result);
            };
            reader.readAsDataURL(file);
          }
        },

        loadImage: function(where) {
          if (angular.isDefined(mmMaterials.selectedFile)) {
            var reader = new FileReader();
            reader.onload = function (e) {
              $(where).attr('src', e.target.result);
            };
            reader.readAsDataURL(mmMaterials.selectedFile);
          }
        },

        add: function(data, success, failure) {
          if (angular.isDefined(data)) {
            mmMaterials.data.selected = data;
            mmMaterials.selectedFile = data.selectedFile;
          }
          if (angular.isDefined(mmMaterials.data.selected)) {
            var name = mmMaterials.data.selected.name,
              description = mmMaterials.data.selected.description,
              lat = mmMaterials.data.selected.lat,
              lng = mmMaterials.data.selected.lng,
              angle = mmMaterials.data.selected.iconAngle,
              file = mmMaterials.selectedFile;

            http.sendFile('materials/add', file, mmMaterials._create({}, name, description, lat, lng, angle), function(material) {
              mmMaterials.data[material.id] = mmMaterials._create({
                id: material.id,
                createdAt: material.createdAt,
                updatedAt: material.updatedAt
              }, material.name, material.description, material.lat, material.lng, material.angle, material.fileName);

              delete mmMaterials.data.selected;
              delete mmMaterials.selectedFile;

              MATERIAL.set(mmMaterials.data[material.id]);
              mmMaterials.updateMapData();
              alert.success('Added material `' + material.name + '`');
              if (angular.isFunction(success)) {
                success();
              }
            }, function(err) {
              answer.project.failure(err);
              if (angular.isFunction(failure)) {
                failure();
              }
            });
          } else {
            if (angular.isFunction(failure)) {
              failure();
            }
          }
        },

        addPossibleTag: function(material, tag) {
          if (angular.isDefined(TAGS.data[tag.name])) {
            mmMaterials.addTag(material, TAGS.data[tag.name], true);
          } else {
            $cordovaDialogs.confirm(
              'Do you want to add new tag `' + tag.name + '`?',
              'New tag',
              ['Yes', 'No']).then(function(buttonIndex) {
                // no button = 0, 'OK' = 1, 'Cancel' = 2 
                var btnIndex = buttonIndex;
                if (btnIndex === 1) {
                  TAGS.add(tag.name).then(function(data) {
                    if (angular.isObject(data)) {
                      mmMaterials.addTag(material, data, true);
                    } else {
                      if (data === false) {
                        alert.error('An error occured: `addPossibleTag`');
                      }
                      material.pluginTags.splice(material.pluginTags.indexOf(tag), 1);
                    }
                  });
                } else {
                  material.pluginTags.splice(material.pluginTags.indexOf(tag), 1);
                }
              }
            );
          }
        },

        addTag: function(material, tag, fromPossible) {
          if (angular.isUndefined(material.tags[tag.name])) {
            http.post('materials/add/tag', {material: material, tag: tag}, function(answer) {
              material.tags[tag.name] = tag;

              if (!fromPossible) {
                material.pluginTags.push(tag);
              }

              mmMaterials.updateMapData();
              alert.success('Tag `' + tag.name + '` added to material `' + material.name + '`');
            }, function(data, status) {
              material.pluginTags.splice(tag, 1);
              answer.project.failure(data, status);
            });
          } else {
            alert.info('Tag `' + tag.name + '` already added to material `' + material.name + '`');
          }
        },

        removeTag: function(material, tag) {
          if (angular.isDefined(material.tags[tag.name])) {
            http.delete('materials/remove/tag/' + material.id + '/' + tag.id, function(answer, status) {
              delete material.tags[tag.name];

              mmMaterials.updateMapData();
              alert.success('Tag `' + tag.name + '` removed from material `' + material.name + '`');
            }, answer.project.failure);
          } else {
            alert.info('Tag `' + tag.name + '` already removed from material `' + material.name + '`');
          }
        },

        edit: function(material) {
          http.edit('materials', material, function(savedMaterial) {
            mmMaterials.data[savedMaterial.id] = mmMaterials._create(material, savedMaterial.name, savedMaterial.description,
              savedMaterial.lat, savedMaterial.lng, savedMaterial.angle, savedMaterial.fileName);

            mmMaterials.updateMapData();
            alert.success('Material `' + savedMaterial.name + '` saved successfully');
          }, answer.project.failure);
        },

        remove: function($event, material) {
          $event.preventDefault();
          $event.stopPropagation();
          http.remove('materials', material, function(data) {
            if (data) {
              delete mmMaterials.data[material.id];

              mmMaterials.updateMapData();
              alert.success('Material `' + material.name + '` removed successfully');
              if (material === MATERIAL.focused) {
                MATERIAL.unset();
              }
            }
          }, answer.project.failure);
        },

        _create: function(base, name, description, lat, lng, angle, fileName, tags) {
          if (name) {
            base.name = name;
          }
          if (description) {
            base.description = description;
          }
          if (lat && lng) {
            if (!angular.isNumber(lat)) lat = parseFloat(lat);
            base.lat = lat;
            if (!angular.isNumber(lng)) lng = parseFloat(lng);
            base.lng = lng;
          }
          if (angle) {
            base.iconAngle = angle;
            base.angle = angle;
          } else {
            base.angle = 0;
          }
          if (fileName) {
            base.fileName = fileName;
          } else {
            base.fileName = '';
          }
          if (tags) {
            base.tags = tags;
            base.pluginTags = [];
            angular.forEach(tags, function(tag) {
              base.pluginTags.push(tag);
            });
          } else if (!base.tags) {
            base.tags = {};
            base.pluginTags = [];
          }
          base.icon = icon;
          return base;
        }

      };
      PROJECT.onSet(mmMaterials.getAll);
      PROJECT.onUnset(mmMaterials.clean);

      mmMaterials.updateMapData();
      return mmMaterials;
    }
  ]);

  mmMaterials.controller('mmMaterialsCtrl', ['$scope', 'mmMaterials', 'mmMaterial', 'mmDevices', 'mmAlert', function($scope, MATERIALS, MATERIAL, devices, alert) {
    $scope.material = MATERIAL.focused;
    $scope.ready = false;
    $scope.processing = false;

    $scope.refresh = function() {
      var callNumber = 0;
      var maxCallNumber = 3;

      var callback = function() {
        callNumber++;
        if (callNumber === maxCallNumber) {
          $scope.ready = true;
        }
      };

      if (angular.isDefined(MATERIAL.focused.selectedFile)) {
        callback();
      } else {
        alert.warning('Photo is missing');
      }

      devices.gps(function(coords) {
        MATERIAL.focused.lat = coords.latitude;
        MATERIAL.focused.lng = coords.longitude;
        callback();
      }, function() {
        MATERIAL.focused.lat = 0;
        MATERIAL.focused.lng = 0;
        callback();
      });

      devices.orientation(function(angle) {
        MATERIAL.focused.iconAngle = angle;
        callback();
      }, function() {
        MATERIAL.focused.iconAngle = 0;
        callback();
      });
    };

    $scope.photo = function() {
      devices.camera(function(file) {
        MATERIAL.focused.selectedFile = file;
        $scope.refresh();
      });
    };

    $scope.save = function() {
      if ($scope.ready && !$scope.processing) {
        $scope.processing = true;
        MATERIALS.add(MATERIAL.focused, function() {
          $scope.ready = false;
          $scope.processing = false;
          MATERIAL.focused = {
            name: ''
          };
        }, function() {
          alert.warning('An error occured');
          $scope.processing = false;
        });
      } else if (!$scope.ready) {
        alert.warning('Not enough data');
      } else {
        alert.warning('Saving actual material');
      }
    };
  }]);

})();
