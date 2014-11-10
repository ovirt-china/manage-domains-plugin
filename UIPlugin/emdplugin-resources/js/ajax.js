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
            console.info('List request failed.');
            console.log(data);
            console.log(status);
            messager.sendDataMessage(sourceName, 'updateTableFailed', null, data);
        });
      }
    };
  }]);

})();
