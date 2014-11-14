'use strict';

(function() {

  var app = angular.module('plugin.ajax', ['plugin.common']);

  // Set the URL for the request
  app.value('URL', 'https://192.168.3.237:8443/engineManageDomains');
  app.value('sourceName', 'API Controller');

  app.factory('request',['$http', 'URL', 'sourceName', 'messager', function($http, URL, sourceName, messager){
    return {

      list: function(){
        var urlList = URL + '/domains/';
        console.log('API Request: GET - 'urlList);
        $http.get(urlList).
        success(function(data, status, headers, config) {
          console.info('List request was successful.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateTable', null, data);
        }).
        error(function(data, status, headers, config) {
          console.error('List request failed.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateTableFailed', null, data);
        });

        // var httpRequest = $http({
        //     method: 'GET',
        //     url: URL + '/domains/'
        //
        // }).success(function(data, status) {
        //     console.info('List request was successful.');
        //     console.log(data);
        //     console.log(status);
        //     messager.sendDataMessage(sourceName, 'updateTable', null, data);
        //
        // }).error(function(data, status, headers, config) {
        //     console.warn('List request failed.');
        //     messager.sendDataMessage(sourceName, 'updateTableFailed', null, data);
        // });

      },

      delete: function(domain2delete){
        var urlDelete = URL + '/domains/' + domain2delete;
        console.log('API Request: DELETE - 'urlList);
        $http.delete(urlDelete).
        success(function(data, status, headers, config) {
          console.info(domain2delete + 'has been successfully deleted.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestSuccessful', null, data);
          // Close the window is evrything went well.
          messager.sendActionMessage('remove-dialog', 'close', 'remove-dialog');
        }).
        error(function(data, status, headers, config) {
          console.error('Delete request for the domain ' + domain2delete + ' failed.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'requestFailed', null, data);
          // Close the window
          messager.sendActionMessage('remove-dialog', 'close', 'remove-dialog');
        });
      },

      add: function(domain2add){
        var urlAdd = URL + '/domains/' + domain2add.domain;
        $http.put(urlAdd, domain2add).
        success(function(data, status, headers, config) {
          console.info(domain2add.domain + 'has been successfully added.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestSuccessful', null, data);
        }).
        error(function(data, status, headers, config) {
          console.warn('Add request for the domain ' + domain2add.domain + ' failed.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestFailed', null, data);
        });
      },

      edit: function(domain2edit){
        var urlEdit = URL + '/domains/' + domain2edit.domain + '/edit';
        $http.put(urlEdit, domain2edit).
        success(function(data, status, headers, config) {
          console.info(domain2edit.domain + 'has been successfully edited.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestSuccessful', null, data);
        }).
        error(function(data, status, headers, config) {
          console.warn('Edit request for the domain ' + domain2edit.domain + ' failed.(' + status + ')');
          messager.sendDataMessage(sourceName, 'requestFailed', null, data);
        });
      }


    };
  }]);

})();
