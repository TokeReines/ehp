angular
    .module('app')
    .controller('AccountingBillsController', AccountingBillsController);

AccountingBillsController.$inject = ['accountingService', '$timeout'];

function AccountingBillsController(accountingService, $timeout) {
    var vm = this;
    vm.loading = false;
    vm.accountings = accountingService.getAccountings();
    vm.newAccountings = accountingService.getNewAccountings();
    vm.downloadAccounting = function (accountingId) {
        accountingService.removeNewAccounting(accountingId);
    }
    vm.getProductNames = function (status) {
        var keys = [];
        for (var prop in status) {
            if (prop !== "residentName" && prop !== "residentRoom" && prop !== "status" && prop !== "$$hashKey") {
                keys.push(prop);
            }
        }
        return keys;
    }
    vm.statusesLoaded = function () {
        $(".no-propagate").on("click", function(e) {
            //do something
            e.stopPropagation();
        });
        // For now it must be called twice :/ or it wont work
        $('.collection').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
        $('.collection').collapsible({
            accordion: false // A setting that changes the collapsible behavior to expandable instead of the default accordion style
        });
    };
}