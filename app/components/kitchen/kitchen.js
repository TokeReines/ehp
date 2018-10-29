angular
    .module('app')
    .controller('KitchenController', KitchenController);

KitchenController.$inject = ['auth', 'kitchenService'];

function KitchenController(auth, kitchenService) {
    var vm = this;
    vm.logout = logout;
    if (!kitchenService.leftMenuInitialized) {
        $('.button-collapse').sideNav({
            edge: 'left', // Choose the horizontal origin
            closeOnClick: false, // Closes side-nav on <a> clicks, useful for Angular/Meteor,
            menuWidth: 188
        });
        kitchenService.leftMenuInitialized = true;
    }

    function logout() {
        auth.logout();
    }
}