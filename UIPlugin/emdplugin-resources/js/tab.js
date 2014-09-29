'use strict';

// Use to initiate the plugin

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
      }, function(newVal, oldVal) {
         $scope.treeItemEntityId = newVal;
      });
   }]);

   app.run(['messageUtil', 'dataManager', function (messageUtil, dataManager) {
      dataManager.exposeTestDataFunction();
      messageUtil.sendMessageToParent('GetTabData');
   }]);

   app.controller('dialogController', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {
      openAddDialog = function(){
         pluginApi.showDialog('Add Domain', 'add-domain-dialog', urlUtil.relativeUrl('add.html'), '640px', '480px',
      {
         buttons: [
            {
               label: 'Close',
               onClick: function() {
                  pluginApi.closeDialog('add-domain-dialog');
               }
            }
         ],
         resizeEnabled: true,
         closeIconVisible: true,
         closeOnEscKey: true
      });};
   }]);


})();
