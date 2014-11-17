'use strict';

(function() {

  var app = angular.module('plugin.tab', ['plugin.common', 'plugin.ajax']);

  app.value('dialogName', 'emd-tab');

  app.run(['messager', 'dialogName', 'alertManager', 'domainsListManager', function(messager, dialogName, alertMan, domainsMan) {

    messager.sendActionMessage(dialogName, 'justLaunch', null);

    alertMan.alertInfo('Thanks for using this plugin. You can access the all code <a href="https://github.com/eayun/UIPlugin-Engine-Manage-Domains">here</a>. If you have any suggestion please use <a href="https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues">this</a>.');

    domainsMan.refreshDomains();

 }]);

  app.controller('TableController', ['$scope', 'domainsListManager', function($scope, domainMan){
    $scope.domains = domainMan.getDomains();

    $scope.setDomains = function(domains){
      domainMan.setDomains(domains);
      $scope.domains = domainMan.getDomains();
    };

  }]);

  app.factory('domainsListManager', ['request', function(request){
    var domains = {};

    return {
      refreshDomains: function() {
        request.list();
      },
      setDomains: function(domains2set) {
        domains = domains2set;
      },
      getDomains: function() {
        return domains;
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
            var dialogName = "Remove " + domain.domain;

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
   app.controller('menuController', ['$scope', 'dialogManager', 'domainsListManager','alertManager', function ($scope, dialogManager, domainsMan, alertMan){
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
      $scope.isAnimated = true;
      var requestFromBtn = false;

      $scope.refreshDomainsFromBtn = function() {
        requestFromBtn = true;
        domainsMan.refreshDomains();
        $scope.isAnimated = true;
      };

      $scope.refreshDomains = function() {
        domainsMan.refreshDomains();
        $scope.isAnimated = true;
      };

      $scope.reqRefreshisOver = function(isSuccessful) {
        $scope.isAnimated = false;
        if(!isSuccessful){
          alertMan.alertDanger('Impossible to refresh the list of Domains.');
        } else if (requestFromBtn) {
          alertMan.alertSuccess('The list of Domains has been refreshed successfully.');
          requestFromBtn = false;
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
      $scope.$apply();

    };

    $scope.alertSuccess = function (alertMsg){
      alertMan.alertSuccess(alertMsg);
      $scope.alert = alertMan.get();
      $scope.$apply();
    };

    $scope.alertWarning = function (alertMsg){
      alertMan.alertWarning(alertMsg);
      $scope.alert = alertMan.get();
      $scope.$apply();
    };

    $scope.alertDanger = function (alertMsg){
      alertMan.alertDanger(alertMsg);
      $scope.alert = alertMan.get();
      $scope.$apply();
    };
  }]);

})();
