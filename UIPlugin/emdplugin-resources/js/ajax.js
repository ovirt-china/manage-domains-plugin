'use strict';

(function() {

  var app = angular.module('plugin.ajax', ['plugin.common']);

  // Set the URL for the request
  app.value('URL', '/engineManageDomains');
  app.value('sourceName', 'API Controller');

  app.factory('request',['$http', 'URL', 'sourceName', 'messager', 'translateService', function($http, URL, sourceName, messager, translateService){

    var trans = translateService.get();

    return {

      list: function(){
        var urlReq = URL + '/domains/';
        console.log('API Request: GET - ' + urlReq);

        $http.get(urlReq).
        success(function(data, status, headers, config) {
          console.info('List request was successful.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateDomains', null, trans.NOTIFICATION_REFRESH_SUCCESS);
        }).
        error(function(data, status, headers, config) {
          console.error('List request failed.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateDomainsFailed', null, trans.NOTIFICATION_REFRESH_FAILED);
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
          var successDeleteText = '<strong>' + domain2delete + '</strong>' + trans.NOTIFICATION_DELETE_SUCCESS + '<ul><li>' + trans.NOTIFICATION_REMOVE_USERS + '</li><li>' + trans.NOTIFICATION_NEED_RESTART + '</li></ul>';
          console.info(domain2delete + ' has been successfully deleted.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'remove-dialog', successDeleteText);
        }).
        error(function(data, status, headers, config) {
          console.error('Delete request for the domain ' + domain2delete + ' failed.(' + status + ')');
          console.log(data);
          var failedDeleteText = trans.NOTIFICATION_DELETE_FAILED_1 + '<strong>' + domain2delete + '</strong>' + trans.NOTIFICATION_DELETE_FAILED_2;
          messager.sendDataMessage(sourceName, 'requestFailed', 'remove-dialog', failedDeleteText);
        });
      },

      add: function(domain2add){
        var urlReq = URL + '/domains/' + domain2add.domain;
        console.log('API Request: PUT - ' + urlReq);
        $http.put(urlReq, domain2add).
        success(function(data, status, headers, config) {
          console.info(domain2add.domain + 'has been successfully added.(' + status + ')');
          console.log(data);
          var successMsg = trans.NOTIFICATION_ADD_SUCCESS_1 + '<strong>' + domain2add.domain +'</strong>' + NOTIFICATION_ADD_SUCCESS_2 + '<ul><li>' + trans.NOTIFICATION_NEED_RESTART + '</li></ul>';
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'add-dialog', successMsg);
        }).
        error(function(data, status, headers, config) {
          console.error('Add request for the domain ' + domain2add.domain + ' failed.(' + status + ')');
          console.log(data);
          var failedMsg = trans.NOTIFICATION_ADD_FAILED_1 + '<strong>' + domain2add.domain + '</strong>' + trans.NOTIFICATION_ADD_FAILED_2;
          messager.sendDataMessage(sourceName, 'requestFailed', 'add-dialog', failedMsg);
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
          var successMsg = trans.NOTIFICATION_EDIT_SUCCESS_1 + '<strong>' + domain2edit.domain + '</strong>' + trans.NOTIFICATION_EDIT_SUCCESS_2 + '<ul><li>' + trans.NOTIFICATION_NEED_RESTART + '</li></ul>';
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'edit-dialog', successMsg);
        }).
        error(function(data, status, headers, config) {
          console.error('Edit request for the domain ' + domain2edit.domain + ' failed.(' + status + ')');
          console.log(data);
          var failedMsg = trans.NOTIFICATION_EDIT_FAILED_1 + '<strong>' + domain2edit.domain + '</strong>' + trans.NOTIFICATION_EDIT_FAILED_2;
          messager.sendDataMessage(sourceName, 'requestFailed', 'edit-dialog', failedMsg);
        });
      }
    };
  }]);

  app.factory('translateService', function(){
    var english = {
    NOTIFICATION_NEED_RESTART : "oVirt Engine restart is required in order for the changes to take place (service ovirt-engine restart).",
    NOTIFICATION_REMOVE_USERS : "Please remove all users and groups of this domain using the Administration portal or the API.",

    NOTIFICATION_REFRESH_FAILED : "Impossible to refresh the list of Domains.",
    NOTIFICATION_REFRESH_SUCCESS : "The list of Domains has been refreshed successfully.",

    NOTIFICATION_DELETE_SUCCESS : " has been successfully deleted.",
    NOTIFICATION_DELETE_FAILED_1 : "Impossible to delete the domain ",
    NOTIFICATION_DELETE_FAILED_2 : ".",
    NOTIFICATION_ADD_SUCCESS_1 : "The domain ",
    NOTIFICATION_ADD_SUCCESS_2 : " has been added successfully.",
    NOTIFICATION_ADD_FAILED_1 : "Impossible to add the domain ",
    NOTIFICATION_ADD_FAILED_2 : ".",

    NOTIFICATION_EDIT_SUCCESS_1 : "The domain ",
    NOTIFICATION_EDIT_SUCCESS_2 : " has been edited successfully.",
    NOTIFICATION_EDIT_FAILED_1 : "Impossible to edit the domain ",
    NOTIFICATION_EDIT_FAILED_2 : "."};

    var chinese = {
    NOTIFICATION_NEED_RESTART : "oVirt引擎需要重新启动，以更修改生效（service ovirt-engine restart）。",
    NOTIFICATION_REMOVE_USERS : "请删除所有使用了管理门户或API的域的用户和组。",

    NOTIFICATION_REFRESH_FAILED : "无法刷新域的列表。",
    NOTIFICATION_REFRESH_SUCCESS : "域名列表中已成功刷新。",

    NOTIFICATION_DELETE_SUCCESS : "已成功删除。",
    NOTIFICATION_DELETE_FAILED_1 : "无法删除域",
    NOTIFICATION_DELETE_FAILED_2 : "。",

    NOTIFICATION_ADD_SUCCESS_1 : "域",
    NOTIFICATION_ADD_SUCCESS_2 : "已成功添加。",
    NOTIFICATION_ADD_FAILED_1 : "无法添加域",
    NOTIFICATION_ADD_FAILED_2 : "。",

    NOTIFICATION_EDIT_SUCCESS_1 : "域",
    NOTIFICATION_EDIT_SUCCESS_2 : "已成功编辑。",
    NOTIFICATION_EDIT_FAILED_1 : "无法编辑域",
    NOTIFICATION_EDIT_FAILED_2 : "。"};

    var langKey = $filter('limitTo')($window.navigator.userLanguage || $window.navigator.language, 2);

  return {
    get: function () {
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
