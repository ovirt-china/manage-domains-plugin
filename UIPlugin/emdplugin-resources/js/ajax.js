'use strict';

(function() {

  var app = angular.module('plugin.ajax', ['plugin.common']);

  // Set the URL for the request
  app.value('URL', 'https://192.168.3.237:8080/engineManageDomains');
  app.value('sourceName', 'API Controller');

  app.factory('request',['$http', 'URL', 'sourceName', 'messager', function($http, URL, sourceName, messager){
    return {
      list: function(){
        var httpRequest = $http({
            method: 'GET',
            url: URL + '/domains/'

        }).success(function(data, status) {
            console.info('List request was successful.');
            console.log(data);
            console.log(status);
            messager.sendDataMessage(sourceName, 'updateTable', null, data);

        }).error(function(data, status, headers, config) {
            console.warn('List request failed.');
            messager.sendDataMessage(sourceName, 'updateTableFailed', null, data);
        });
      };

      delete: function(domain2delete){
        var httpRequest = $http({
            method: 'DELETE',
            url: URL + '/domains/' + domain2delete

        }).success(function(data, status) {
            console.info(domain2delete + 'has been successfully delete.');
            console.log(data);
            console.log(status);
            messager.sendDataMessage(sourceName, 'deleteSuccessful', null, data);

        }).error(function(data, status, headers, config) {
            console.warn('Delete request of the domain ' + domain2delete + ' failed.');
            messager.sendDataMessage(sourceName, 'deleteFailed', null, data);
        });
      }
    };
  }]);

})();
