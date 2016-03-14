'use strict';

// Use to initiate the plugin

(function() {

  var app = angular.module('plugin.init', ['plugin.common', 'plugin.translations']);

  app.service('contentWindowService', function(){
    var contentWindow = null ;
    var tabWindow = null;

    var menuScope = null;
    var alertScope = null;
    var tableScope = null;

        return {
            set : function(contentWindow) {
                this.contentWindow = contentWindow;
            },
            get : function() {
                return this.contentWindow;
            },
            setTabWindow : function(tabWindow) {
                this.tabWindow = tabWindow;
            },
            getTabWindow : function() {
                return this.tabWindow;
            },
            setMenuScope : function(menuScope) {
                this.menuScope = menuScope;
            },
            getMenuScope : function() {
                return this.menuScope;
            },
            setAlertScope : function(alertScope) {
                this.alertScope = alertScope;
            },
            getAlertScope : function() {
                return this.alertScope;
            },
            setTableScope : function(tableScope) {
                this.tableScope = tableScope;
            },
            getTableScope : function() {
                return this.tableScope;
            }
        };
  });

   app.factory('tabManager', ['pluginApi', 'urlUtil', 'translationService', function (pluginApi, urlUtil, translationService) {
      return {
         addTab: function () {
            var  trans = translationService.translate();

            pluginApi.addMainTab(trans.TAB_NAME, 'emd-tab', urlUtil.relativeUrl('tab.html'));
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

              try {
                    var data = JSON.parse(dataString); // verify that json is valid
                }
                catch (e) {
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Impossible to parse the received message. --> Message ignored.');
                }

              if (data && data.action && data.sender === pluginName) {
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

                  case ('justLaunch'):
                    var tabWindow = sourceWindow

                    contentWindow.setTabWindow(tabWindow);

                    contentWindow.setMenuScope(tabWindow.angular.element("#menu").scope());
                    contentWindow.setAlertScope(tabWindow.angular.element("#alert").scope());
                    contentWindow.setTableScope(tabWindow.angular.element("#domainTable").scope());

                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Acquired source window of tab from opening tab [' + data.source + '].');
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

                    console.log("infoScope =");
                    console.log(infoScope);

                    // Trigger the function in the Dialog
                    infoScope.remove();
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Triggered Removing of the selected domain.');

                  // If the work of the dialog is over, this close it.
                  case ('close'):
                    pluginApi.closeDialog(data.target);
                    console.log('[EMDPlugin > plugin.js > MessageReceived]' + '\n' + '--> Closed dialog [' + data.target + '].');
                    break;

                  case ('updateDomains'):
                    contentWindow.getTableScope().setDomains(data.data);
                    contentWindow.getMenuScope().reqRefreshisOver(true);
                    break;

                  case ('updateDomainsFailed'):
                    contentWindow.getMenuScope().reqRefreshisOver(false);
                    break;

                  case ('requestFailed'):
                    contentWindow.getMenuScope().setLoadingStatus(false);
                    contentWindow.getAlertScope().alertDanger(data.data);
                    pluginApi.closeDialog(data.target);
                    break;

                  case ('requestSuccessful'):
                    if (data.target){
                      contentWindow.getMenuScope().setLoadingStatus(false);
                      contentWindow.getMenuScope().refreshDomains();
                      pluginApi.closeDialog(data.target);
                    }
                    contentWindow.getAlertScope().alertSuccess(data.data);
                    break;

                  case ('activateLoadingStatus'):
                      contentWindow.getMenuScope().setLoadingStatus(true);
                    break;

                  default:
                    console.warn('EMDPlugin just receive a message with an undefined action: ' + data.action);
                }
              }

          },
          SystemTreeSelectionChange: function(selectedNode) {
              pluginApi.setTabAccessible('emd-tab', selectedNode.type == 'System');
          }
      };
   }]);

   // Register event handler functions and tell the API we are good to go.
   app.factory('initService', ['pluginApi', 'pluginEventHandlers', function (pluginApi, pluginEventHandlers) {
      return {
         bootstrapPlugin: function () {

          // Get the config from the file to setup the api plugin
          var config = pluginApi.configObject();
          pluginApi.options(config.allowedMessageOriginsJSON);

          pluginApi.register(pluginEventHandlers);
          pluginApi.ready();
        }
      };
   }]);

   app.run(['initService', function (initService) {
      initService.bootstrapPlugin();
   }]);
})();
