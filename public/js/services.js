'use strict';

/* Services */

var urlServices = angular.module('urlServices', ['ngResource']);

urlServices.factory('URL', ['$resource',
    function($resource){
        return $resource('/u/api', {}, {
            query: { 
                method:'GET',
                isArray: true,
                transformResponse: function(data) {
                    return angular.fromJson(data).data;
                }
            },
            add: {
                method: 'POST',
                isArray: false,
                transformResponse: function(data) {
                    return angular.fromJson(data).data;
                }
            },
            remove: {
                method: 'GET',
                url: '/u/api/:shortCode/delete',
                isArray: false
            }
        });
    }]);