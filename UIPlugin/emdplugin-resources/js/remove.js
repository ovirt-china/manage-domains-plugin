'use strict';

// Use in the modal to add a new domain

(function() {

  var app = angular.module('plugin.remove', ['plugin.common', 'plugin.ajax']);

  app.value('dialogName', 'remove-dialog');

  app.run(['messager', 'dialogName', function (messager, dialogName) {

    messager.sendActionMessage(dialogName, 'justOpen', null);

  }]);

  app.controller('RemoveController', ['cacheService', '$scope', 'messager', 'dialogName', 'request', function(cache, $scope, messager, dialogName, request){

    $scope.domain = cache.getData('domainToRemove');

    $scope.modalShown = false;

    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };

    $scope.remove = function() {

      $scope.toggleModal();
      console.log('[EMDPlugin > remove.js > RemoveController]' + '\n' + '--> Information about the domain to remove ' + angular.toJson($scope.domain));

      //////////////////////////////////////////////////////////////////////
      //                                                                  //
      //                  SEND THE REQUEST TO THE API                     //
      //                                                                  //
      //////////////////////////////////////////////////////////////////////

      request.delete($scope.domain.name);

      // Close the window is evrything went well.
      //messager.sendActionMessage(dialogName, 'close', dialogName);

    }

  }]);

  // Get the information about the domain from the local storage
  app.controller('CacheController', ['cacheService', '$scope', function(cache, $scope){

    $scope.domain = cache.getData('domainToRemove');

  }]);

  app.controller('dialogController', ['$scope', function($scope) {
    $scope.modalShown = false;
    $scope.toggleModal = function() {
      $scope.modalShown = !$scope.modalShown;
    };
  }]);

})();
