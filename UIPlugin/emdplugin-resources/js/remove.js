'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.remove', ['plugin.common']);

   // Get the information about the domain from the local storage
   app.controller('CacheController', ['cacheService', '$scope', function(cache, $scope){

    $scope.domain = cache.getData('domainToRemove');
    
   }]);

})();
