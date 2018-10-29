(function () {
    'use strict';

    angular
        .module('app')
        .controller('RegisterController', RegisterController);

    RegisterController.$inject = ['$state', 'auth'];

    function RegisterController($state, auth) {
        var vm = this;
        vm.authAccess = function(password) {
            auth.reqAccess(password, function (error) {
                Materialize.toast(error, 4000);
            }, function (authData) {
                $state.go("register.kitchen");
            });
        }
    }
})();
