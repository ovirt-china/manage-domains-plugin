'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.add', ['plugin.common']);

   app.run(['messageUtil', function (messageUtil) {
      messageUtil.sendMessageToParent('justOpen');
   }]);

   app.controller('AddFormController',['$scope', '$window', function($scope, $window){
     $scope.submit = function() {
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
