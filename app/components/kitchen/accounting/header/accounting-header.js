(function () {
    'use strict';

    angular
        .module('app')
        .controller('AccountingHeaderController', AccountingHeaderController);

    AccountingHeaderController.$inject = ['$state', 'accountingService', 'purchaseService'];

    function AccountingHeaderController($state, accountingService, purchaseService) {
        var vm = this;
        vm.state = $state;
        vm.purchaseService = purchaseService;
        if ($state.$current.name === "kitchen.accounting.bills") {
            $('ul.tabs').tabs('select_tab', 'bills');
        } else if($state.$current.name === "kitchen.accounting.status"){
            $('ul.tabs').tabs('select_tab', 'status');
        } else{
            //$('ul.tabs').tabs('select_tab', 'overview');
        } 
        vm.newAccountings = accountingService.getNewAccountings();
    }
})();
