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

   // If we need access to the API it is maybe in the plugin.js that we need to create this.
   app.controller('dialogController', ['$scope', '$window', function ($scope, $window) {
      $scope.openAddDialog = function() {
         $window.alert("Soon a beautiful dialog to add a new domain ;)");
      };
   }]);


})();
