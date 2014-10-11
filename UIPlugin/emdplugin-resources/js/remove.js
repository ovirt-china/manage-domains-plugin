'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.remove', ['plugin.common']);

   app.controller('CacheController', ['cacheManager', '$scope', function(cache, $scope){
     $scope.domain = cache.get('domainToRemove');
   }]);

})();
