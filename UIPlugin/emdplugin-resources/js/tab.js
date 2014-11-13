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
    this.domains = [
        {
          name: "AD_DOMAIN",
          provider: "Active Directory",
          status: "Validate"
        },
        {
          name: "auth-server",
          provider: "free-ipa",
          status: "Validate"
        }
    ];

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

      $scope.refreshTable = function() {
        refreshManager.getDomains();
        $scope.isAnimated = true;
      };

      $scope.reqRefreshisOver = function(isSuccessful) {
        $scope.isAnimated = false;
        if(!isSuccessful){
          alertMan.alertDanger('Impossible to refresh the list of Domains.');
        }

        $scope.$apply();
      };

   }]);


  app.factory('alertManager', function(){
    var alert = {type:' ', msg:' ', icon:' '};

    return {
      get : function(){
        return alert;
      },

      alertInfo : function (alertMsg){
        alert.msg = alertMsg;
        alert.type = 'alert-info';
        alert.icon = '<span class="pficon pficon-info"></span>';
      },

      alertSuccess : function (alertMsg){
        alert.msg = alertMsg;
        alert.type = 'alert-success';
        alert.icon = '<span class="pficon pficon-ok"></span>';
      },

      alertWarning : function (alertMsg){
        alert.msg = alertMsg;
        alert.type = 'alert-warning';
        alert.icon = '<span class="pficon-layered">' +
                              '<span class="pficon pficon-warning-triangle"></span>' +
                              '<span class="pficon pficon-warning-exclamation"></span>' +
                            '</span>';
      },

      alertDanger : function (alertMsg){
        alert.msg = alertMsg;
        alert.type = 'alert-danger';
        alert.icon = '<span class="pficon-layered">' +
                    '<span class="pficon pficon-error-octagon"></span>' +
                              '<span class="pficon pficon-error-exclamation"></span>' +
                            '</span>';
      }
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
