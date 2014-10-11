'use strict';

// Use in the modal to add a new domain

(function() {

   var app = angular.module('plugin.remove', ['plugin.common']);

   app.controller('CacheController', ['dialogCache', '$scope', function(cache, $scope){
    var namefromcache = cache.get('domainToRemove');
    console.log('In the cache: ' + namefromcache);
    $scope.domain = namefromcache;

   }]);

})();
