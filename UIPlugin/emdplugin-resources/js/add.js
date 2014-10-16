'use strict';

// Use in the modal to add a new domain

(function() {

  var app = angular.module('plugin.add', ['plugin.common']);

  app.value('dialogName', 'add-dialog');

  app.run(['messager', 'dialogName', function (messager, dialogName) {

    messager.sendActionMessage(dialogName, 'justOpen', null);
  }]);

   app.controller('AddFormController',['$scope', '$window', 'messager', 'dialogName', function($scope, $window, messager, dialogName){

     $scope.submit = function() {
        // First verify the form
        if($scope.addForm.$valid){
          console.log('[EMDPlugin > add.js > AddFormController]' + '\n' + '--> The form is valid.');

          // Test if the domain object is define
          if($scope.domain){
            $scope.domainJSON = angular.toJson($scope.domain);
            console.log('[EMDPlugin > add.js > AddFormController]' + '\n' + '--> Information from the form ' + angular.toJson($scope.domain));
          }

          //////////////////////////////////////////////////////////////////////
          //                                                                  //
          //                  SEND THE REQUEST TO THE API                     //
          //                                                                  //
          //////////////////////////////////////////////////////////////////////

          // Close the window is evrything went well.
          messager.sendActionMessage(dialogName, 'close', dialogName);

        } else {
           $window.alert("Domain, Provider and User are requiered input. Please fill them correctly !");
        }

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
