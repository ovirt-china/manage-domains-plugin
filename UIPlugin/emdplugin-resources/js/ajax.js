'use strict';

(function() {

  var app = angular.module('plugin.ajax', ['plugin.common']);

  // Set the URL for the request
  // app.value('URL', 'https://192.168.3.40:8443/engineManageDomains');
  app.value('URL', '/engineManageDomains');
  app.value('sourceName', 'API Controller');
  app.value('msgRemoveUsers', 'Please remove all users and groups of this domain using the Administration portal or the API.');
  app.value('msgRestartEngine', 'oVirt Engine restart is required in order for the changes to take place (service ovirt-engine restart).');

  app.factory('request',['$http', 'URL', 'sourceName', 'messager', 'msgRemoveUsers', 'msgRestartEngine', function($http, URL, sourceName, messager, msgRemoveUsers, msgRestartEngine){
    return {

      list: function(){
        var urlReq = URL + '/domains/';
        console.log('API Request: GET - ' + urlReq);
        $http.get(urlReq).
        success(function(data, status, headers, config) {
          console.info('List request was successful.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateDomains', null, data);
        }).
        error(function(data, status, headers, config) {
          console.error('List request failed.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateDomainsFailed', null, data);
        });
      },

      delete: function(domain2delete){
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
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'add-dialog', data);
        }).
        error(function(data, status, headers, config) {
          console.error('Add request for the domain ' + domain2add.domain + ' failed.(' + status + ')');
          console.log(data);
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
          messager.sendDataMessage(sourceName, 'requestSuccessful', 'edit-dialog', data);
        }).
        error(function(data, status, headers, config) {
          console.error('Edit request for the domain ' + domain2edit.domain + ' failed.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'requestFailed', 'edit-dialog', data);
        });
      }


    };
  }]);

})();
