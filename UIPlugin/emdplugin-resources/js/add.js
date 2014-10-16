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

   app.controller('AddFormController',['$scope', '$window', 'addMessageUtil', function($scope, $window, messager){

     $scope.submit = function() {
        // $window.alert('You pressed on the right button !');
        if($scope.domain){
        console.log('The domain to add is ' + $scope.domain);
        }

        // if($scope.addForm.$valid){
        //   console.log('[EMDPlugin > add.js > AddFormController]' + '\n' + '--> The form is valid.');
        //   messager.sendMessage('close', 'add-dialog');
        // }

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
