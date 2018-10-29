(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterUserController', RegisterUserController);

    RegisterUserController.$inject = ['$scope', 'auth', '$state', 'userService', 'kitchenService', 'firebaseFactory'];

    function RegisterUserController($scope, auth, $state, userService, kitchenService, fbRef) {
        console.log("RegisterController");
        var vm = this;
        vm.kitchen = auth.kitchen();
        vm.adminId = kitchenService.getAdminAuthId();

        vm.residents = [];
        vm.residents = userService.users();
        vm.anyUnauthedResidents = function () {
            return vm.residents.some(function (res, i, a) {
                return res.authId === "";
            });
        }
        vm.emptyAuthIdFilter = function (resident) {
            return resident.authId === "";
        }
        vm.register = function () {
            auth.register(vm.email, vm.password, function (error) {
                console.log(error);
            }, function (userData) {
                kitchenService.update({ adminId: userData.uid });
                // Push a user to the user-array for smooth login
                fbRef.child("users").child(userData.uid).set(auth.kitchen());
                // Login the newly registered user
                Materialize.toast("Ny bruger registreret, logger dig ind", 4000);
                auth.login(vm.email, vm.password, function (error) {
                    Materialize.toast(error, 4000);
                }, function (authData) {
                    $state.go("kitchen.home", { dormId: auth.kitchen() });
                });
            });
        }
    }
})();