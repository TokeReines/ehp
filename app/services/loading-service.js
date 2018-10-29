(function () {
    'use strict';

    angular
        .module('app')
        .factory('loadingService', loadingService);

    loadingService.$inject = [];

    function loadingService() {
        var service = {
            loading: false
        };

        return service;
    }
})();