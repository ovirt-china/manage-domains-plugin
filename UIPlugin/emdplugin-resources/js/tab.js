'use strict';

(function() {

  var app = angular.module('plugin.tab', ['plugin.common', 'plugin.ajax']);

   app.run(function() {
    // Nothing here for the moment but the time to get the list of servers will come sooner or later.
   });

  app.controller('TableController', ['$scope', function($scope){
    this.domains = [
        {
          name: "AD_DOMAIN",
          provider: "Active Directory",
          status: "Validate"
        },
        {
          name: "auth-server",
          provider: "free-ipa",
          status: "Validate"
        }
    ];

  }]);

  app.factory('RefreshManager', ['request', function(request){
    return {
      getDomains: function(){
        request.list();

      }
    };
  }]);

  // Redefine MessageUtil specially for the main tab
  app.factory('tabMessageUtil', ['messageUtil', function(messageUtil){
    return {
      sendMessage: function(action, target){
        var message = {
           source: 'emd-tab',
           action: action,
           target: target
        };

        messageUtil.sendMessageToParent(message);
      }
    };
  }]);


   // Hold all the function to create the dialog windows
   app.factory('dialogManager', ['pluginApi', 'urlUtil', 'cacheService','tabMessageUtil', function (pluginApi, urlUtil, cache, messager) {

      return {
         // Show the Add Dialog Window
         showAddDialog: function () {
            pluginApi.showDialog('Add Domain', 'add-dialog', urlUtil.relativeUrl('add.html'), '780px', '650px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                          pluginApi.closeDialog('add-dialog');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('submit','add-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

         // Show the Edit Dialog Window
         showEditDialog: function (domain) {
            var dialogName = "Edit " + domain.name;

            cache.setData('domainToEdit', domain);

            pluginApi.showDialog( dialogName, 'edit-dialog', urlUtil.relativeUrl('edit.html'), '780px', '650px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('edit-dialog');
                           cache.removeData('domainToEdit');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('submit','edit-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

         // Show the Remove Dialog Window
         showRemoveDialog: function (domain) {
            var dialogName = "Remove " + domain.name;

            cache.setData('domainToRemove',domain);

            pluginApi.showDialog( dialogName, 'remove-dialog', urlUtil.relativeUrl('remove.html'), '450px', '170px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('remove-dialog');
                           cache.removeData('domainToRemove');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('remove','remove-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

      };
   }]);

   // Controller to provide the functions to open the dialogs
   app.controller('menuController', ['$scope', '$rootScope', 'dialogManager', 'RefreshManager', function ($scope, $rootScope, dialogManager, refreshManager){
      $scope.openAddDialog = function() {
         dialogManager.showAddDialog();
      };

      $scope.openEditDialog = function(domain) {
         dialogManager.showEditDialog(domain);
      };

      $scope.openRemoveDialog = function(domain) {
         dialogManager.showRemoveDialog(domain);
      };

      // This part control the refresh button
      $scope.isAnimated = false;

      $scope.refreshTable = function() {
        refreshManager.getDomains();
        $scope.isAnimated = true;
      };

      $scope.reqRefreshisOver = function() {
        $scope.isAnimated = false;
        $scope.$apply();
      };

   }]);

  app.controller('alertController', ['$scope', 'iconService', function($scope, iconService) {
    $scope.alert = {type:'alert-info', msg:'No information to display at the moment.'};
    $scope.alertIcon = iconService.get($scope.alert.type);

    $scope.newMessage = new function(alert){
      $scope.alert = alert;
      $scope.$apply();
    };

  }]);

  app.service('iconService', function () {

    var iconDanger = '<span class="pficon-layered">' +
                        '<span class="pficon pficon-error-octagon"></span>' +
                        '<span class="pficon pficon-error-exclamation"></span>' +
                      '</span>';

    var iconWarning = '<span class="pficon-layered">' +
                        '<span class="pficon pficon-warning-triangle"></span>' +
                        '<span class="pficon pficon-warning-exclamation"></span>' +
                      '</span>';

    var iconSuccess = '<span class="pficon pficon-ok"></span>';

    var iconInfo = '<span class="pficon pficon-info"></span>';

    return {
      get : function(type) {
        switch (type) {
          case ('alert-danger'):
            return this.iconDanger;
            break;

          case ('alert-warning'):
            return this.iconWarning;
            break;

          case ('alert-success'):
            return this.iconSuccess;
            break;

          case ('info'):
            return this.iconInfo;
            break;

          default:
            console.warn(type + ' is not a valid type for the alerts.');
            return this.iconInfo;
        }
      }
    }
  });


})();
