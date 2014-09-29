'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.add', ['plugin.common']);

   // Allow the chevron to change state when the Advanced Parameters are collapsed or not.
   app.controller('collapseWatcher', ['$scope', function($scope) {
      $scope.showAdvParam = false;

      $scope.actCollapse = function(state) {
         $scope.showAdvParam = !state;
      };
   }]);
   
})();
