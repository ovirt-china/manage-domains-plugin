'use strict';

// Use in the modal to add a new domain

(function() {

  var app = angular.module('plugin.edit', ['plugin.common']);

  app.value('dialogName', 'edit-dialog');

  app.run(['messager', 'dialogName', function (messager, dialogName) {

    messager.sendActionMessage(dialogName, 'justOpen', null);
  }]);

   app.controller('EditFormController',['$scope', '$window', 'messager', 'dialogName', function($scope, $window, messager, dialogName){

     $scope.submit = function() {
        // First verify the form
        if($scope.editForm.$valid){
          console.log('[EMDPlugin > edit.js > EditFormController]' + '\n' + '--> The form is valid.');

          // Test if the domain object is define
          if($scope.domain){
            $scope.domainJSON = angular.toJson($scope.domain);
            console.log('[EMDPlugin > edit.js > EditFormController]' + '\n' + '--> Information from the form ' + angular.toJson($scope.domain));
          }

          //////////////////////////////////////////////////////////////////////
          //                                                                  //
          //                  SEND THE REQUEST TO THE API                     //
          //                                                                  //
          //////////////////////////////////////////////////////////////////////

          // Close the window is evrything went well.
          messager.sendActionMessage(dialogName, 'close', dialogName);


        } else {
           $window.alert("Your form is not correct ! (Sorry, I don't know what to say to help you :( )");
        }

      };
   }]);



  // Get the information about the domain from the local storage
  app.controller('CacheController', ['cacheService', '$scope', function(cache, $scope){

    $scope.domain = cache.getData('domainToEdit');

  }]);

})();
