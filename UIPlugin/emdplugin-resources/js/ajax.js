'use strict';

(function() {

  var app = angular.module('plugin.ajax', ['plugin.common']);

  // Set the URL for the request
  app.value('URL', 'https://192.168.3.237:8080/engineManageDomains');
  app.value('sourceName', 'API Controller');

  app.factory('request',['$http', 'URL', 'sourceName', 'messager', function($http, URL, sourceName, messager){
    return {
      list: function(){
        var urlList = URL + '/domains/';
        $http.get(urlList).
        success(function(data, status, headers, config) {
          console.info('List request was successful.(' + status + ')');
          console.log(data);
          messager.sendDataMessage(sourceName, 'updateTable', null, data);
        }).
        error(function(data, status, headers, config) {
          console.warn('List request failed.(' + status + ')');
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

      };

      delete: function(domain2delete){
        var httpRequest = $http({
            method: 'DELETE',
            url: URL + '/domains/' + domain2delete

        }).success(function(data, status) {
            console.info(domain2delete + 'has been successfully deleted.');
            console.log(data);
            console.log(status);
            messager.sendDataMessage(sourceName, 'deleteSuccessful', null, data);

        }).error(function(data, status, headers, config) {
            console.warn('Delete request of the domain ' + domain2delete + ' failed.');
            messager.sendDataMessage(sourceName, 'deleteFailed', null, data);
        });
      },

      add: function(domain2add){
        var httpRequest = $http({
            method: 'PUT',
            url: URL + '/domains/'

        }).success(function(data, status) {
            console.info(domain2add.domain + 'has been successfully added.');
            console.log(data);
            console.log(status);
            messager.sendDataMessage(sourceName, 'addSuccessful', null, data);

        }).error(function(data, status, headers, config) {
            console.warn('Delete request of the domain ' + domain2delete + ' failed.');
            messager.sendDataMessage(sourceName, 'deleteFailed', null, data);
        });
      },


    };
  }]);

})();
