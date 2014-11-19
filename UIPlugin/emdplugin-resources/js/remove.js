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

    $scope.toggleLoadingModal = function() {
      $scope.modalShown = !$scope.modalShown;
      $scope.$apply();
    };

    $scope.remove = function() {

      $scope.toggleLoadingModal();

      console.log('[EMDPlugin > remove.js > RemoveController]' + '\n' + '--> Information about the domain to remove ' + angular.toJson($scope.domain));

      request.delete($scope.domain.domain);
      // request.put2delete($scope.domain.domain);
      // request.add($scope.domain);

      // Now the ajax.js will take care of the following steps.
    }

  }]);

  // Get the information about the domain from the local storage
  app.controller('CacheController', ['cacheService', '$scope', function(cache, $scope){

    $scope.domain = cache.getData('domainToRemove');

  }]);

})();
