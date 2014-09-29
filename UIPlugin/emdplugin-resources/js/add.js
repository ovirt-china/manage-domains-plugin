'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.add', ['plugin.common']);

   app.factory('dialogManager', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {
      return {
         showDialog: function () {
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
           });
         }
      };
   }]);

   app.controller('collapseWatcher', ['$scope', function($scope) {
     $scope.showAdvParam = false;

      $scope.actCollapse = function(state) {
        $scope.showAdvParam = !state;
    };
  }]);




})();
