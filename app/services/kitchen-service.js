(function () {
    'use strict';

    angular
        .module('app')
        .factory('kitchenService', kitchenService);

    kitchenService.$inject = ['firebaseKitchenFactory', '$firebaseObject'];

    function kitchenService(fbRef, $firebaseObject) {
        var service = {
            update: update,
            getAdminAuthId: getAdminAuthId,
            leftMenuInitialized: false
        };

        function update(obj) {
            fbRef.update(obj);
        }

        function getAdminAuthId() {
            return $firebaseObject(fbRef.child("adminId"));
        }

        return service;
    }
})();