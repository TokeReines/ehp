(function () {
    'use strict';

    angular
        .module('app')
        .controller('ProductsHeaderController', ProductsHeaderController);

    ProductsHeaderController.$inject = ['$state', 'productService'];

    function ProductsHeaderController($state, productService) {
        var vm = this;
        vm.state = $state;
        vm.service = productService;
    }
})();
