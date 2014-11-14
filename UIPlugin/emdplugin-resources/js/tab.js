'use strict';

(function() {

  var app = angular.module('plugin.tab', ['plugin.common', 'plugin.ajax']);

  //  app.run(['menuController', 'alertController', function(menuCtrl, alertCtrl) {
  //   // Nothing here for the moment but the time to get the list of servers will come sooner or later.
  //   alertCtrl.alertInfo('Thanks for using this plugin. You can access the all code <a href="https://github.com/eayun/UIPlugin-Engine-Manage-Domains">here</a>. If you have any suggestion please use <a href="https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues">this</a>.');
  //   menuCtrl.refreshTable();
  //
  // }]);

  app.run(['alertManager', function(alertMan) {
   alertMan.alertInfo('Thanks for using this plugin. You can access the all code <a href="https://github.com/eayun/UIPlugin-Engine-Manage-Domains">here</a>. If you have any suggestion please use <a href="https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues">this</a>.');

 }]);

  app.controller('TableController', ['$scope', function($scope){
    $scope.domains = {};

    $scope.refreshTable = function(domains){
      $scope.domains = domains;
    };

  }]);

  app.factory('RefreshManager', ['request', function(request){
    return {
      getDomains: function(){
        request.list();
      }
    };
  }]);

  // Redefine MessageUtil specially for the main tab
  app.factory('tabMessageUtil', ['messageUtil', function(messageUtil){
    return {
      sendMessage: function(action, target){
        var message = {
           source: 'emd-tab',
           action: action,
           target: target
        };

        messageUtil.sendMessageToParent(message);
      }
    };
  }]);


   // Hold all the function to create the dialog windows
   app.factory('dialogManager', ['pluginApi', 'urlUtil', 'cacheService','tabMessageUtil', function (pluginApi, urlUtil, cache, messager) {

      return {
         // Show the Add Dialog Window
         showAddDialog: function () {
            pluginApi.showDialog('Add Domain', 'add-dialog', urlUtil.relativeUrl('add.html'), '780px', '650px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                          pluginApi.closeDialog('add-dialog');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('submit','add-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

         // Show the Edit Dialog Window
         showEditDialog: function (domain) {
            var dialogName = "Edit " + domain.name;

            cache.setData('domainToEdit', domain);

            pluginApi.showDialog( dialogName, 'edit-dialog', urlUtil.relativeUrl('edit.html'), '780px', '650px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('edit-dialog');
                           cache.removeData('domainToEdit');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('submit','edit-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

         // Show the Remove Dialog Window
         showRemoveDialog: function (domain) {
            var dialogName = "Remove " + domain.name;

            cache.setData('domainToRemove',domain);

            pluginApi.showDialog( dialogName, 'remove-dialog', urlUtil.relativeUrl('remove.html'), '450px', '170px',
               {
                  buttons: [
                     {
                        label: 'Cancel',
                        onClick: function() {
                           pluginApi.closeDialog('remove-dialog');
                           cache.removeData('domainToRemove');
                        }
                     },
                     {
                        label: 'Ok',
                        onClick: function() {
                          messager.sendMessage('remove','remove-dialog');
                        }
                      }
                  ],
                  resizeEnabled: true,
                  closeIconVisible: false,
                  closeOnEscKey: false
               }
            );
         },

      };
   }]);

   // Controller to provide the functions to open the dialogs
   app.controller('menuController', ['$scope', 'dialogManager', 'RefreshManager','alertManager', function ($scope, dialogManager, refreshManager, alertMan){
      $scope.openAddDialog = function() {
         dialogManager.showAddDialog();
      };

      $scope.openEditDialog = function(domain) {
         dialogManager.showEditDialog(domain);
      };

      $scope.openRemoveDialog = function(domain) {
         dialogManager.showRemoveDialog(domain);
      };

      // This part control the refresh button
      $scope.isAnimated = false;
      $scope.lastRefreshSuccess = true;

      $scope.refreshTable = function() {
        refreshManager.getDomains();
        $scope.isAnimated = true;
      };

      $scope.reqRefreshisOver = function(isSuccessful) {
        $scope.isAnimated = false;
        if(!isSuccessful){
          alertMan.alertDanger('Impossible to refresh the list of Domains.');
          $scope.lastRefreshSuccess = false;
        }else if(!lastRefreshSuccess){
          alertMan.alertSuccess('The list of Domains has just been refreshed.');
          $scope.lastRefreshSuccess = true;
        }

        $scope.$apply();
      };

   }]);

  // Filter the HTML to be able to insert it in a webpage
  app.filter('unsafe', function($sce) {
     return function(val) {
      return $sce.trustAsHtml(val);
    };
  });

  // Create the alert content and type.
  app.factory('alertManager', function(){
    var alert = {type:'', content:''};

    return {
      get : function(){
        return alert;
      },

      alertInfo : function (alertMsg){
        alert.type = 'alert-info';
        alert.content = '<span class="pficon pficon-info"></span>\n' + alertMsg;
      },

      alertSuccess : function (alertMsg){
        alert.type = 'alert-success';
        alert.content = '<span class="pficon pficon-ok"></span>\n' + alertMsg;
      },

      alertWarning : function (alertMsg){
        alert.type = 'alert-warning';
        alert.content = '<span class="pficon-layered">\n   <span class="pficon pficon-warning-triangle"></span>\n   <span class="pficon pficon-warning-exclamation"></span>\n</span>' + alertMsg;
      },

      alertDanger : function (alertMsg){
        alert.type = 'alert-danger';
        alert.content = '<span class="pficon-layered">\n   <span class="pficon pficon-error-octagon"></span>\n   <span class="pficon pficon-error-exclamation"></span>\n</span>' + alertMsg;
      },
    };
  });

  /*
  * Controle the message above the table.
  */
  app.controller('alertController', ['$scope', 'alertManager', function($scope, alertMan) {
    $scope.alert = alertMan.get();

    $scope.alertInfo = function (alertMsg){
      alertMan.alertInfo(alertMsg);
      $scope.alert = alertMan.get();

    };

    $scope.alertSuccess = function (alertMsg){
      alertMan.alertSuccess(alertMsg);
      $scope.alert = alertMan.get();
    };

    $scope.alertWarning = function (alertMsg){
      alertMan.alertWarning(alertMsg);
      $scope.alert = alertMan.get();
    };

    $scope.alertDanger = function (alertMsg){
      alertMan.alertDanger(alertMsg);
      $scope.alert = alertMan.get();
    };
  }]);

})();
