'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.remove', ['plugin.common']);

   app.controller('CacheController', ['cacheService', '$scope', function(cache, $scope){
    $scope.domain = cache.getData('domainToRemove');

    $scope.testcache = function(){
      var namefromcache = cache.getData('domainToRemove');
      console.log('In the cache: ' + namefromcache);
    };
   }]);

})();
