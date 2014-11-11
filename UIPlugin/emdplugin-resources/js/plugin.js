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
                // console.info('--Message Received--' + '\n'
                //               + '   From: WebAdmin > ' + pluginName + ' > ' + data.source + '\n'
                //               + '   To: ' + pluginName + '\n'
                //               + '   Action: ' + data.action + '\n'
                //               + '   Target: ' + data.target );

                switch (data.action) {

                  // When a dialog open, it notify the plugin to acquire the ContentWindow
                  case ('justOpen'):
                    contentWindow.set(sourceWindow); // Reference to Window object
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Acquired source window from opening dialog [' + data.source + '].');
                    break;

                  // When the 'Ok' button is press this trigger the submission of the form
                  case ('submit'):
                    var formDialog = contentWindow.get();
                    var formContainer = formDialog.angular.element("#form-container");
                    var formScope = formContainer.scope();

                    // Trigger the function in the Dialog
                    formScope.submit();
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Triggered Form Submit in dialog [' + data.target + '].');

                    break;

                  case ('remove'):
                    var infoDialog = contentWindow.get();
                    var infoContainer = infoDialog.angular.element("#info-container");
                    var infoScope = infoContainer.scope();

                    // Trigger the function in the Dialog
                    infoScope.remove();
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Triggered Removing of the selected domain.');

                  // If the work of the dialog is over, this close it.
                  case ('close'):
                    pluginApi.closeDialog(data.target);
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Closed dialog [' + data.target + '].');
                    break;

                  case ('updateTableFailed'):
                    var menuContainer = sourceWindow.angular.element("#menu");
                    var menuScope = menuContainer.scope();
                    // Change the state of the refreshing button
                    menuScope.reqRefreshisOver();
                    console.log(menuScope);
                    // Trigger the message to notify it failed.

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
               allowedMessageOrigins: ['https://192.168.3.237']
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
