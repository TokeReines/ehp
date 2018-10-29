(function () {
    'use strict';

    angular
        .module('app')
        .factory('firebaseKitchenFactory', firebaseKitchenFactory);

    firebaseKitchenFactory.$inject = ['auth', 'firebaseFactory'];

    function firebaseKitchenFactory(auth, fbRef) {
        return fbRef.child(auth.kitchen());
    }
})();