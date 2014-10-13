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

  // Service to communicate with the local Storage
  app.factory('storageService', function () {

    return {

        get: function (key) {
           return localStorage.getItem(key);
        },

        save: function (key, data) {
           localStorage.setItem(key, data);
        },

        remove: function (key) {
            localStorage.removeItem(key);
        },

        clearAll : function () {
            localStorage.clear();
        }
    };
  });

  // Mid Layer Factory to manage the local storage
  app.factory('cacheService', ['storageService', function(storageService) {

    return {

        getData: function (key) {
            return JSON.parse(storageService.get(key));
        },

        setData: function (key,data) {
            storageService.save(key, JSON.stringify(data));
        },

        removeData: function (key) {
            storageService.remove(key);
        }
    };
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

            console.info('Send Message from [' + pluginName + '] to [$window.parent]' + '\n' +'Action: ' + action);
         },
         sendMessageToParent: function (action, target) {
            var data = {
               sender: pluginName,
               action: action
               target: target
            };

            $window.parent.postMessage(JSON.stringify(data), '*');

            console.info('Send Message from [' + pluginName + '] to [$window.parent]' + '\n' +'Action: ' + action + 'Target: ' + target);
         }
      };
   }]);
})();
