
angular
  .module('app')
  .controller('LoginController', LoginController);


LoginController.$inject = ['auth', '$scope', '$state', 'loadingService'];

function LoginController(auth, $scope, $state, loadingService) {
    $scope.login = function (email, password) {
        console.log("trying to log in");
        loadingService.loading = true;
        auth.login(email, password, function (error) {
            Materialize.toast(error, 4000);
            loadingService.loading = false;
        }, function (authData) {
            $state.go("kitchen.home", { dormId: $scope.kitchen });
            loadingService.loading = false;
        });
    };

    $scope.forgotPassword = function () {
        auth.forgotPassword($scope.email, function(error) {
            Materialize.toast(error, 2000);
        }, function(success) {
            Materialize.toast("Password reset sendt til "+success, 2000);
        });
    }
};
