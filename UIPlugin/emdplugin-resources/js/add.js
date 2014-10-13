'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.add', ['plugin.common']);

   app.run(['messageUtil', function (messageUtil) {
      messageUtil.sendMessageToParent('The Add Dialog has been opened.');
   }]);

   app.controller('AddFormController',['$scope', '$window', function($scope, $window){
     $scope.displayForm = function() {
        $window.alert(domain | json);
      };
   });

   // Allow the chevron to change state when the Advanced Parameters are collapsed or not.
   app.controller('collapseWatcher', ['$scope', function($scope) {
      $scope.showAdvParam = false;

      $scope.actCollapse = function(state) {
         $scope.showAdvParam = !state;
      };
   }]);

})();
