(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterKitchenController', RegisterKitchenController);

    RegisterKitchenController.$inject = ['$state', 'auth', 'firebaseFactory', '$firebaseObject'];

    function RegisterKitchenController($state, auth, fbRef, $firebaseObject) {
        var vm = this;

        vm.continue = function (building, floor) {
            var kitchen = building + floor;
            var adminId = $firebaseObject(fbRef.child(kitchen).child("adminId"));
            adminId.$loaded().then(function () {
                $state.go("register.user", { kitchen: kitchen });
            }, function(error) {
                Materialize.toast("Køkken eksisterer allerede", 4000);
            });
        }
    }
})();
