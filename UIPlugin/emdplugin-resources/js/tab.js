'use strict';

(function() {

   var app = angular.module('plugin.tab', ['plugin.common']);

   app.factory('dataManager', ['$window', '$rootScope', function ($window, $rootScope) {
      var treeItemType, treeItemEntityId;

      return {
         exposeTestDataFunction: function () {
            $window.setTestData = function (type, entityId) {
               treeItemType = type;
               treeItemEntityId = entityId;
               $rootScope.$apply();
            };
         },
         getTreeItemType: function () {
            return treeItemType || '(no type)';
         },
         getTreeItemEntityId: function () {
            return treeItemEntityId || '(no entity)';
         }
      };
   }]);

   app.controller('tabController', ['$scope', 'dataManager', function ($scope, dataManager) {
      $scope.$watch(function() {
         return dataManager.getTreeItemType();
      },

      function(newVal, oldVal) {
         $scope.treeItemType = newVal;
      });

      $scope.$watch(function() {
         return dataManager.getTreeItemEntityId();
      },

      function(newVal, oldVal) {
         $scope.treeItemEntityId = newVal;
      });
   }]);

   app.run(['messageUtil', 'dataManager', function (messageUtil, dataManager) {
      dataManager.exposeTestDataFunction();
      messageUtil.sendMessageToParent('GetTabData');
   }]);



   // Hold all the function to create the dialog windows
   app.factory('dialogManager', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {

      // Grab the domain selected
      var selectedDomain = "TODO";

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
         showEditDialog: function () {
            var dialogName = "Edit " + selectedDomain;

            pluginApi.showDialog( dialogName, 'add-dialog', urlUtil.relativeUrl('edit.html'), '800px', '650px',
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

      };
   }]);

   // Controller to provide the functions to open the dialogs
   app.controller('dialogController', ['$scope', 'dialogManager', function ($scope, dialogManager){
      $scope.openAddDialog = function() {
         console.log("About to show the dialog");
         dialogManager.showAddDialog();
      };
   }]);


})();
