'use strict';

// Use in the modal to add a new domain

(function() {

  var app = angular.module('plugin.edit', ['plugin.common', 'plugin.ajax', 'plugin.translations']);

  app.value('dialogName', 'edit-dialog');

  app.run(['messager', 'dialogName', function (messager, dialogName) {

    messager.sendActionMessage(dialogName, 'justOpen', null);
  }]);

   app.controller('EditFormController',['$scope', '$window', 'messager', 'dialogName', 'cacheService', 'request', 'translationService', '$location', '$anchorScroll', function($scope, $window, messager, dialogName, cache, request, translationService, $location, $anchorScroll){

     translationService.getTranslation($scope);

     // initiate the Default domain2edit JSON object to be send to the API.
     $scope.domain ={"domain": "",
                     "provider": "",
                     "user": "",
                     "addPermissions": false,
                     "configFile": "",
                     "ldapServers": "",
                     "resolveKdc": false,
                     "passwordFile": ""
                    };
      // Get the name of the domain from the cache
      $scope.domain.domain = cache.getData('DOMAIN_TO_EDIT').domain;

    // functions to control the Loading Modal
    $scope.modalShown = false;

    $scope.toggleLoadingModal = function() {

      // Get back to the top of the page to display
      $location.hash('top');
      $anchorScroll();

      // Display or make the Loading Overlay to appear or disappear
      $scope.modalShown = !$scope.modalShown;
      $scope.$apply();
    };

     $scope.submit = function() {
        // First verify the form
        if($scope.editForm.$valid){

          $scope.toggleLoadingModal();

          console.log('[EMDPlugin > edit.js > EditFormController]' + '\n' + '--> The form is valid.');


          // Test if the domain object is define
          if($scope.domain){
            $scope.domainJSON = angular.toJson($scope.domain);
            console.log('[EMDPlugin > edit.js > EditFormController]' + '\n' + '--> Information from the form ' + angular.toJson($scope.domain));

          request.edit($scope.domain);

          }
        } else {
           $window.alert("Your form is not correct ! Please precise a valid absolute path to the file containing the password.");
        }

      };
   }]);

})();
