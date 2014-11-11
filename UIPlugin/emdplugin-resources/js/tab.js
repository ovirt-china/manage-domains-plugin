'use strict';

(function() {

  var app = angular.module('plugin.tab', ['plugin.common', 'plugin.ajax']);

   app.run(function() {
    // Nothing here for the moment but the time to get the list of servers will come sooner or later.
   });

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
   app.controller('menuController', ['$scope', '$rootScope', 'dialogManager', 'RefreshManager', 'animationService', function ($scope, $rootScope, dialogManager, refreshManager, animationState){
      $scope.openAddDialog = function() {
         dialogManager.showAddDialog();
      };

      $scope.openEditDialog = function(domain) {
         dialogManager.showEditDialog(domain);
      };

      $scope.openRemoveDialog = function(domain) {
         dialogManager.showRemoveDialog(domain);
      };

      // $scope.isAnimated = animationState.get;
      $scope.isAnimated = {state:false};
      // $rootScope.isAnimated = false;

      $scope.refreshTable = function() {
        refreshManager.getDomains();
        // animationState.set(true);
        $scope.isAnimated.state = true;
        // $rootScope.isAnimated = true;
        console.log($scope);
      };

      $scope.reqRefreshisOver = function() {
        console.log('Refreshing is over, time re-enable the button.');
        // animationState.set(false);
        // console.log('animationState.get = ' + animationState.get);
        $scope.isAnimated.state = false;
        // $rootScope.isAnimated = false;
      }


   }]);

   app.service('animationService', function(){
      var isAnimated = false ;
      return {
        set : function(isAnimated) {
           this.isAnimated = isAnimated;
        },
        get : this.isAnimated
         };
   });

  app.service('alertService', function () {
    var type = 'info';
    var msg = 'No information at the the moment.';
    var icon = '';

    var iconDanger = '<span class="pficon-layered">' +
                        '<span class="pficon pficon-error-octagon"></span>' +
                        '<span class="pficon pficon-error-exclamation"></span>' +
                      '</span>';

    var iconWarning = '<span class="pficon-layered">' +
                        '<span class="pficon pficon-warning-triangle"></span>' +
                        '<span class="pficon pficon-warning-exclamation"></span>' +
                      '</span>';

    var iconSuccess = '<span class="pficon pficon-ok"></span>';

    var iconInfo = '<span class="pficon pficon-info"></span>';

    return {
      set : function(type, msg) {
        this.msg = msg;
        switch (type) {
          case ('danger'):
            this.type = 'alert-danger';
            this.icon = this.iconDanger;
            break;

          case ('warning'):
            this.type = 'alert-warning';
            this.icon = this.iconWarning;
            break;

          case ('success'):
            this.type = 'alert-success';
            this.icon =  this.iconSuccess;
            break;

          case ('info'):
            this.type = 'alert-info';
            this.icon =  this.iconInfo;
            break;

          default:
            console.warn(type + ' is not a valid type for the alerts.');
            this.type = 'alert-info';
            this.icon = '';
        }
      },
      getType : function() {
        return this.type;
      },
      getMsg : function() {
        return this.msg;
      },
      getIcon : function() {
        return this.icon;
      }
    }
  });

  app.controller('alertController', ['$scope', 'alertService', function($scope, alertService) {
    $scope.alertType = 'alert-info';
    $scope.alertMsg = 'No information to display at the moment.';
    $scope.alertIcon = '';
  }]);


})();
