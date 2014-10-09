'use strict';

// Use to initiate the plugin

(function() {

   var app = angular.module('plugin.init', ['plugin.common']);

   app.factory('tabManager', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {
      return {
         addTab: function () {
            pluginApi.addMainTab('Domains', 'emd-tab', urlUtil.relativeUrl('tab.html'));
         }
      };
   }]);

   // Define event handler functions for later invocation by UI plugin infrastructure
   app.factory('pluginEventHandlers', ['pluginName', 'tabManager', function (pluginName, tabManager) {
      return {
         UiInit: function () {
            tabManager.addTab();
         },
         MessageReceived: function (dataString, sourceWindow) {
            if (dataString) {
              console.log(dataString);
              var data = JSON.parse(dataString);
              if (data.sender === pluginName) {
                console.info('Message received from ' + sourceWindow + ' Message is ' + data);
              //    if (data.action === 'GetTabData') {
              //       tabManager.setTabWindow(sourceWindow);
              //       tabManager.updateTab();
              //    }
              }
            }
          },
      };
   }]);

   // Register event handler functions and tell the API we are good to go.
   app.factory('initService', ['pluginApi', 'pluginEventHandlers', function (pluginApi, pluginEventHandlers) {
      return {
         bootstrapPlugin: function () {

          // Get the config file and merge it with the default file.
          // var config = pluginApi.configObject();
          //
          // pluginApi.options({
          // 	// Note: "config.allowedOrigins" is JSON array
          // 	allowedMessageOrigins: config.allowedOrigins
          // });

            var apiOptions = {
               allowedMessageOrigins: ['https://192.168.2.98']
            };
            pluginApi.options(apiOptions);

            pluginApi.register(pluginEventHandlers);
            pluginApi.ready();
         }
      };
   }]);

   app.run(['initService', function (initService) {
      initService.bootstrapPlugin();
   }]);
})();
