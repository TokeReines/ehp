(function () {
    'use strict';

    angular
        .module('app')
        .factory('accountingService', accountingService);

    accountingService.$inject = ['firebaseKitchenFactory', '$firebaseArray'];

    function accountingService(fbRef, $firebaseArray) {
        var accountings = $firebaseArray(fbRef.child("accountings"));
        var newAccountings = $firebaseArray(fbRef.child("accountings").child("new"));
        var service = {
            getAccountings: getAccountings,
            create: create,
            getNewAccountings: getNewAccountings,
            removeNewAccounting: removeNewAccounting
        };

        function removeNewAccounting(id) {
            fbRef.child("accountings").child("new").child(id).remove();
        }

        function getAccountings() {
            return accountings;
        }

        function create(acc) {
            var newPostRef = fbRef.child("accountings")
                .push({ name: acc.name, toDate: acc.toDate, fromDate: acc.fromDate, createdOn: Firebase.ServerValue.TIMESTAMP, statuses: acc.statuses });
            fbRef.child("accountings").child("new")
                .child(newPostRef.key()).push(true);
        }

        function getNewAccountings() {
            return newAccountings;
        }

        return service;
    }
})();