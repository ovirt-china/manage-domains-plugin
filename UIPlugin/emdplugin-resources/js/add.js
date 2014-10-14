'use strict';

// Use in the modal to add a new domain

(function() {

  var app = angular.module('plugin.add', ['plugin.common']);

  app.run(['addMessageUtil', function (messager) {

    messager.sendMessage('justOpen', null);
  }]);

  // Redefine MessageUtil specially for the add-dialog
  app.factory('addMessageUtil', ['messageUtil', function(messageUtil){
    return {
      sendMessage: function(action, target){
        var message = {
           source: 'add-dialog',
           action: action,
           target: target
        };

        messageUtil.sendMessageToParent(message);
      }
    };
  }]);

   app.controller('AddFormController',['$scope', '$window', function($scope, $window){
     this.submit = function() {
        $window.alert('You pressed on the right button !');
      };
   }]);

   // Allow the chevron to change state when the Advanced Parameters are collapsed or not.
   app.controller('collapseWatcher', ['$scope', function($scope) {
      $scope.showAdvParam = false;

      $scope.actCollapse = function(state) {
         $scope.showAdvParam = !state;
      };
   }]);

})();
