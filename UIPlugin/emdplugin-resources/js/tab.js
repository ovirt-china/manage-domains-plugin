'use strict';

(function() {

   var app = angular.module('plugin.tab', ['plugin.common']);

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

  // Used to cache the information about the selected domain
  app.factory('dialogManagerCache', ['$cacheFactory', function($cacheFactory){
    return {
      put: function(key, value) {
        $cacheFactory('dialogManagerCache').put(key, value === undefined ? null : value);
      },
      get: function(key) {
        return $cacheFactory('dialogManagerCache').get(key);
      }
    }
  }]);


   // Hold all the function to create the dialog windows
   app.factory('dialogManager', ['pluginApi', 'urlUtil', 'dialogManagerCache', function (pluginApi, urlUtil, cache) {

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

            cache.put('domainToEdit',domain.name);

            pluginApi.showDialog( dialogName, 'edit-dialog', urlUtil.relativeUrl('edit.html'), '300px', '300px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('edit-dialog');
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

            cache.put('domainToRemove',domain.name);

            pluginApi.showDialog( dialogName, 'remove-dialog', urlUtil.relativeUrl('remove.html'), '300px', '300px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('remove-dialog');
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
   app.controller('dialogController', ['$scope', 'dialogManager', function ($scope, dialogManager){
      $scope.openAddDialog = function() {
         dialogManager.showAddDialog();
      };

      $scope.openEditDialog = function(domain) {
         dialogManager.showEditDialog(domain);
      };

      $scope.openRemoveDialog = function(domain) {
         dialogManager.showRemoveDialog(domain);
      };
   }]);

})();
