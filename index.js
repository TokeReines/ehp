
angular
    .module('app')
    .controller('IndexController', IndexController);

IndexController.$inject = ['$state', 'auth', 'loadingService'];

function IndexController($state, auth, loadingService) {
    var vm = this;
    vm.$state = $state;
    vm.isAuthenticated = isAuthenticated;
    vm.logout = logout;
    vm.openLogoutDialog = openLogoutDialog;
    vm.isFullScreen = false;
    vm.fullScreen = fullScreen;
    vm.loadingService = loadingService;
    moment.locale("dk");

    function isAuthenticated() {
        return auth.isAuthenticated(true) && auth.kitchen();
    }

    function openLogoutDialog() {
        $('#logoutDialog').openModal();
    }

    function logout() {
        auth.logout();
    }

    function fullScreen() {
        toggleFullScreen(document.documentElement);
        vm.isFullScreen = !vm.isFullScreen;
    }

    function toggleFullScreen(elem) {
        // ## The below if statement seems to work better ## if ((document.fullScreenElement && document.fullScreenElement !== null) || (document.msfullscreenElement && document.msfullscreenElement !== null) || (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if ((document.fullScreenElement !== undefined && document.fullScreenElement === null) || (document.msFullscreenElement !== undefined && document.msFullscreenElement === null) || (document.mozFullScreen !== undefined && !document.mozFullScreen) || (document.webkitIsFullScreen !== undefined && !document.webkitIsFullScreen)) {
            if (elem.requestFullScreen) {
                elem.requestFullScreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullScreen) {
                elem.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        } else {
            if (document.cancelFullScreen) {
                document.cancelFullScreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        }
    }
}