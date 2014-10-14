'use strict';

// Use to initiate the plugin

(function() {

  var app = angular.module('plugin.init', ['plugin.common']);

  app.service('contentWindowService', function(){
    var contentWindow = null ;
        return {
            set : function(contentWindow) {
                this.contentWindow = contentWindow;
            },
            get : function() {
                return this.contentWindow;
            }
        };
  });

   app.factory('tabManager', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {
      return {
         addTab: function () {
            pluginApi.addMainTab('Domains', 'emd-tab', urlUtil.relativeUrl('tab.html'));
         }
      };
   }]);

   // Define event handler functions for later invocation by UI plugin infrastructure
   app.factory('pluginEventHandlers', ['pluginName', 'pluginApi', 'tabManager', 'contentWindowService', function (pluginName, pluginApi, tabManager, contentWindow) {
      return {
         UiInit: function () {
            tabManager.addTab();
         },
         MessageReceived: function (dataString, sourceWindow) {
              var data = JSON.parse(dataString);

              if (data.action && data.sender === pluginName) {
                console.info('Message received by EMDPlugin:'+ '\n' + dataString);

                switch (data.action) {
                  // When a dialog open, it notify the plugin to acquire the ContentWindow
                  case ('justOpen'):
                    contentWindow.set(sourceWindow); // Reference to Window object
                    console.info('EMDPlugin just acquired source window');
                    break;
                  // When the 'Ok' button is press this trigger the submission of the form
                  case ('submit'):
                    console.info('EMDPlugin just trigger submit in the source window');
                    contentWindow.get().submit();
                    break;
                  // If the work of the dialog is over, this close it.
                  case ('close'):
                    console.info('EMDPlugin just receive order to close target:' + data.target);
                    pluginApi.closeDialog(data.target);
                    break;
                  default:
                    console.warn('EMDPlugin just receive a message with an undefined action: ' + data.action);
                }
              //    if (data.action === 'GetTabData') {
              //       tabManager.setTabWindow(sourceWindow);
              //       tabManager.updateTab();
              //    }
              }

          }
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
