'use strict';

// Use to initiate the plugin

(function() {

   var app = angular.module('plugin.init', ['plugin.common']);

   app.factory('tabManager', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {
      var tabWindow, selectedTreeItem;
      return {
         addTab: function () {
            pluginApi.addMainTab('Domains', 'emd-tab', urlUtil.relativeUrl('tab.html'));
         },
         setTabWindow: function (window) {
            tabWindow = window;
         },
         setSelectedTreeItem: function (item) {
            selectedTreeItem = item;
         },
         updateTab: function () {
            if (tabWindow && selectedTreeItem) {
               var type = selectedTreeItem.type;
               var entityId = selectedTreeItem.entity && selectedTreeItem.entity.id;
               tabWindow.setTestData(type, entityId);
            }
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
            var data = JSON.parse(dataString);
            if (data && data.sender === pluginName) {
               if (data.action === 'GetTabData') {
                  tabManager.setTabWindow(sourceWindow);
                  tabManager.updateTab();
               }
            }
         },
         SystemTreeSelectionChange: function (selectedItem) {
            tabManager.setSelectedTreeItem(selectedItem);
            tabManager.updateTab();
         }
      };
   }]);

   // Register event handler functions and tell the API we are good to go.
   app.factory('initService', ['pluginApi', 'pluginEventHandlers', function (pluginApi, pluginEventHandlers) {
      return {
         bootstrapPlugin: function () {


          var config = pluginApi.configObject();

          pluginApi.options({
          	// Note: "config.allowedOrigins" is JSON array
          	allowedMessageOrigins: config.allowedOrigins
          });



            // var apiOptions = {
            //    allowedMessageOrigins: ['http://localhost:8080']
            // };
            // pluginApi.options(apiOptions);



            pluginApi.register(pluginEventHandlers);
            pluginApi.ready();
         }
      };
   }]);

   app.run(['initService', function (initService) {
      initService.bootstrapPlugin();
   }]);
})();
