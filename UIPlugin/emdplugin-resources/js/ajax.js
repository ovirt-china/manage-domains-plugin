'use strict';

(function() {

  var app = angular.module('plugin.ajax', ['plugin.common']);

  // Set the URL for the request
  app.value('URL', 'https://192.168.3.237:8443/engineManageDomains');
  app.value('sourceName', 'API Controller');

  app.factory('request',['$http', 'URL', 'sourceName', 'messager', function($http, URL, sourceName, messager){
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
        $http.delete(urlReq).
        success(function(data, status, headers, config) {
          console.info(domain2delete + 'has been successfully deleted.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestSuccessful', null, data);
          // Close the window is evrything went well.
          messager.sendActionMessage('remove-dialog', 'close', 'remove-dialog');
        }).
        error(function(data, status, headers, config) {
          console.error('Delete request for the domain ' + domain2delete + ' failed.(' + status + ')');
          if(!data){
            data = 'Impossible to delete the domain <strong>' + domain2delete + '</strong>.';
          }
          console.log(data);
          messager.sendDataMessage(sourceName, 'requestFailed', null, data);
          // Close the window
          messager.sendActionMessage('remove-dialog', 'close', 'remove-dialog');
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
          console.warn('Add request for the domain ' + domain2add.domain + ' failed.(' + status + ')');
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
          console.warn('Edit request for the domain ' + domain2edit.domain + ' failed.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'requestFailed', 'edit-dialog', data);
        });
      }


    };
  }]);

})();
