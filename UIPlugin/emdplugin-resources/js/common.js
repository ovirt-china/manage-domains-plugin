'use strict';

(function() {

   var app = angular.module('plugin.common', []);

   // Set the name of the plugin
   app.value('pluginName', 'EMDPlugin');

   // Get API object for 'domain-name-mgmt' plugin
   app.factory('pluginApi', ['$window', 'pluginName', function ($window, pluginName) {
      return $window.parent.pluginApi(pluginName);
   }]);

   // Rewrite url
   app.factory('urlUtil', ['pluginName', function (pluginName) {
     return {
         relativeUrl: function (path) {
            return 'plugin/' + pluginName + '/' + path;
         }
      };
   }]);


   // Create the cache
   app.factory('dialogCache', ['$cacheFactory', function($cacheFactory){
     return $cacheFactory('dialogCache');
   }]);

   // Used to cache the information about the selected domain
   app.factory('cacheManager', ['dialogCache', function(cache){
     return {
       put: function(key, value) {
         cache.put(key, value === undefined ? null : value);
       },
       get: function(key) {
         return cache.get(key);
       }
     }
   }]);



   // Send a message to WebAdmin
   app.factory('messageUtil', ['$window', 'pluginName', function ($window, pluginName) {
      return {
         sendMessageToParent: function (action) {
            var data = {
               sender: pluginName,
               action: action
            };

            $window.parent.postMessage(JSON.stringify(data), '*');

            console.info('Send Message from [' + pluginName + '] to [$window.parent]' + '\n' +'Message: ' + action);
         }
      };
   }]);
})();
