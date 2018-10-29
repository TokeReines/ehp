(function () {
    'use strict';

    angular
        .module('app')
        .factory('firebaseFactory', firebaseFactory);
    
    function firebaseFactory() {
        return new Firebase("https://ehp.firebaseio.com/");
    }
})();