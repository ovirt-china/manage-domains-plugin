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

  // Return the language used by the browser
  app.factory('languageUtil', function () {
    return {
        langKey: 'zh'
     };
  });

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
         sendMessageToParent: function (message) {
            var data2send = {
               sender: pluginName,
               source: message.source,
               action: message.action,
               target: message.target,
               data: message.data
            };

            $window.parent.postMessage(JSON.stringify(data2send), '*');

            console.info('--Message Sent--' + '\n'
                          + '   From: ' + pluginName + ' > ' + message.source + '\n'
                          + '   To: WebAdmin' + '\n'
                          + '   Action: ' + message.action + '\n'
                          + '   Target: ' + message.target + '\n'
                          + '   Data: ' + message.data);
         }
      };
   }]);


   // Factory to simplify the action to send a message
   app.factory('messager', ['messageUtil', function(messageUtil){
     return {
       sendActionMessage: function(source, action, target){
         var message = {
            source: source,
            action: action,
            target: target,
            data: null
         };

         messageUtil.sendMessageToParent(message);
       },
       sendDataMessage: function(source, action, target, data){
        var message = {
           source: source,
           action: action,
           target: target,
           data: data
        };

        messageUtil.sendMessageToParent(message);
       }
     };
   }]);



})();
