'use strict';

(function() {

  var app = angular.module('plugin.ajax', ['plugin.common']);

  // Set the URL for the request
  app.value('URL', '/engineManageDomains');
  app.value('sourceName', 'API Controller');
  app.value('msgRemoveUsers', 'Please remove all users and groups of this domain using the Administration portal or the API.');
  app.value('msgRestartEngine', 'oVirt Engine restart is required in order for the changes to take place (service ovirt-engine restart).');

  app.factory('request',['$http', 'URL', 'sourceName', 'messager', 'msgRemoveUsers', 'msgRestartEngine', 'translateService', function($http, URL, sourceName, messager, msgRemoveUsers, msgRestartEngine, translateService){

    var tr = translateService.getTranslationJSON('zh');

    return {

      list: function(){
        var urlReq = URL + '/domains/';
        console.log('API Request: GET - ' + urlReq);
        $http.get(urlReq).
        success(function(data, status, headers, config) {
          console.info('List request was successful.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateDomains', null, tr.NOTIFICATION_REFRESH_SUCCESS);
        }).
        error(function(data, status, headers, config) {
          console.error('List request failed.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateDomainsFailed', null, tr.NOTIFICATION_REFRESH_FAILED);
        });
      },

      delete: function(domain2delete){
        // Activate the Spinner on the main tab
        messager.sendActionMessage(sourceName, 'activateLoadingStatus', null);

        var urlReq = URL + '/domains/' + domain2delete;
        console.log('API Request: DELETE - ' + urlReq);

        var config= {"method": "DELETE"};

        $http.delete(urlReq, config).
        success(function(data, status, headers, config) {
          var successDeleteText = '<strong>' + domain2delete + '</strong> has been successfully deleted.<ul><li>' + msgRemoveUsers + '</li><li>' + msgRestartEngine + '</li></ul>';
          console.info(domain2delete + ' has been successfully deleted.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'remove-dialog', successDeleteText);
        }).
        error(function(data, status, headers, config) {
          console.error('Delete request for the domain ' + domain2delete + ' failed.(' + status + ')');
          if(!data){
            data = 'Impossible to delete the domain <strong>' + domain2delete + '</strong>.';
          }
          console.log(data);
          messager.sendDataMessage(sourceName, 'requestFailed', 'remove-dialog', data);
        });
      },

      add: function(domain2add){
        var urlReq = URL + '/domains/' + domain2add.domain;
        console.log('API Request: PUT - ' + urlReq);
        $http.put(urlReq, domain2add).
        success(function(data, status, headers, config) {
          console.info(domain2add.domain + 'has been successfully added.(' + status + ')');
          console.log(data);
          // replace data by a phrase see translation
          var successMsg = data + '<ul><li>' + msgRestartEngine + '</li></ul>';
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'add-dialog', successMsg);
        }).
        error(function(data, status, headers, config) {
          console.error('Add request for the domain ' + domain2add.domain + ' failed.(' + status + ')');
          console.log(data);
          //replace data by a sentence before putting error message
          messager.sendDataMessage(sourceName, 'requestFailed', 'add-dialog', data);
        });
      },

      edit: function(domain2edit){
        var urlReq = URL + '/domains/' + domain2edit.domain + '/edit';
        console.log('API Request: PUT - ' + urlReq);
        $http.put(urlReq, domain2edit).
        success(function(data, status, headers, config) {
          console.info(domain2edit.domain + 'has been successfully edited.(' + status + ')');
          console.log(data);
          //change message edit
          var successMsg = data + '<ul><li>' + msgRestartEngine + '</li></ul>';
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'edit-dialog', successMsg);
        }).
        error(function(data, status, headers, config) {
          console.error('Edit request for the domain ' + domain2edit.domain + ' failed.(' + status + ')');
          console.log(data);
          //change message
          messager.sendDataMessage(sourceName, 'requestFailed', 'edit-dialog', data);
        });
      }
    };
  }]);

  app.factory('translateService', function(){
    var english = {
      NOTIFICATION_WELCOME : "Thanks for using this plugin. All the code is on <a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains\"> GitHub</a>. If you have any suggestion please <a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues\">open an issue on GitHub</a>.",
    NOTIFICATION_NEED_RESTART : "oVirt Engine restart is required in order for the changes to take place (service ovirt-engine restart).",
    NOTIFICATION_REMOVE_USERS : "Please remove all users and groups of this domain using the Administration portal or the API.",

    NOTIFICATION_REFRESH_FAILED : "Impossible to refresh the list of Domains.",
    NOTIFICATION_REFRESH_SUCCESS : "The list of Domains has been refreshed successfully.",

    NOTIFICATION_DELETE_SUCCESS_1 : "<strong>",
    NOTIFICATION_DELETE_SUCCESS_2 : "</strong> has been successfully deleted.",
    NOTIFICATION_DELETE_FAILED_1 : "Impossible to delete the domain <strong>",
    NOTIFICATION_DELETE_FAILED_2 : "</strong>.",

    NOTIFICATION_ADD_SUCCESS_1 : "The domain <strong>",
    NOTIFICATION_ADD_SUCCESS_2 : "</strong> has been added successfully.",
    NOTIFICATION_ADD_FAILED_1 : "Impossible to add the domain <strong>",
    NOTIFICATION_ADD_FAILED_2 : "</strong>.",

    NOTIFICATION_EDIT_SUCCESS_1 : "The domain <strong>",
    NOTIFICATION_EDIT_SUCCESS_2 : "</strong> has been edited successfully.",
    NOTIFICATION_EDIT_FAILED_1 : "Impossible to edit the domain <strong>",
    NOTIFICATION_EDIT_FAILED_2 : "</strong>."};

    var chinese = {
      NOTIFICATION_WELCOME : "感谢您使用这个插件。所有的代码是在<a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains\">GitHub</a>上。如果您有任何建议，请在<a href=\"https://github.com/eayun/UIPlugin-Engine-Manage-Domains/issues\">GitHub上提一个issue</a>。",
    NOTIFICATION_NEED_RESTART : "oVirt引擎需要重新启动，以更修改生效（service ovirt-engine restart）。",
    NOTIFICATION_REMOVE_USERS : "请删除所有使用了管理门户或API的域的用户和组。",

    NOTIFICATION_REFRESH_FAILED : "无法刷新域的列表。",
    NOTIFICATION_REFRESH_SUCCESS : "域名列表中已成功刷新。",

    NOTIFICATION_DELETE_SUCCESS_1 : "<strong>",
    NOTIFICATION_DELETE_SUCCESS_2 : "</strong>已成功删除。",
    NOTIFICATION_DELETE_FAILED_1 : "无法删除域<strong>",
    NOTIFICATION_DELETE_FAILED_2 : "</strong>。",

    NOTIFICATION_ADD_SUCCESS_1 : "域<strong>",
    NOTIFICATION_ADD_SUCCESS_2 : "</strong>已成功添加。",
    NOTIFICATION_ADD_FAILED_1 : "无法添加域<strong>",
    NOTIFICATION_ADD_FAILED_2 : "</strong>。",

    NOTIFICATION_EDIT_SUCCESS_1 : "域<strong>",
    NOTIFICATION_EDIT_SUCCESS_2 : "</strong>已成功编辑。",
    NOTIFICATION_EDIT_FAILED_1 : "无法编辑域<strong>",
    NOTIFICATION_EDIT_FAILED_2 : "</strong>。"};

  return {
    getTranslationJSON: function (langKey) {
      switch (langKey) {

        case ('zh'):
          return chinese;
          break;

        default:
          return english;
      }
    }
  };
  });

})();
