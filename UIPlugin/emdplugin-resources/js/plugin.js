'use strict';

// Use to initiate the plugin

(function() {

   var app = angular.module('plugin.init', ['plugin.common']);

   // Get API object for 'domain-name-mgmt' plugin
   app.factory('pluginApi', ['$window', 'pluginName', function ($window, pluginName) {
      return $window.parent.pluginApi(pluginName);
   }]);

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


   // Hold all the function to create the dialog windows
   app.factory('dialogManager', ['pluginApi', 'urlUtil', function (pluginApi, urlUtil) {

         // Show the Add Dialog Window
         var showAddDialog = function () {
            pluginApi.showDialog('Add Domain', 'add-dialog', urlUtil.relativeUrl('add.html'), '780px', '650px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('add-dialog');
                        }
                     }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         };

      return {

         //Add the Add Dialog Window
         addAddDialog: function(){
            pluginApi.addMainTabActionButton('DataCenter', 'Hello',
               {
                  onClick: function() {
                     console.log('About to show the dialog.');
                     showAddDialog();
                  },
                  location: 'OnlyFromContext'
               }
            );
         }
      };
   }]);



   // Define event handler functions for later invocation by UI plugin infrastructure
   app.factory('pluginEventHandlers', ['pluginName', 'tabManager', 'dialogManager', function (pluginName, tabManager, dialogManager) {
      return {
         UiInit: function () {
            tabManager.addTab();
            dialogManager.addAddDialog();

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
            var apiOptions = {
               allowedMessageOrigins: ['http://localhost:8080']
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
