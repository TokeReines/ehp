angular
    .module('app')
    .controller('ProductsSbslController', ProductsSbslController);

ProductsSbslController.$inject = ['kitchenService', 'messageService', '$state', '$scope', 'productService', 'fileReader', 'Upload', '$http'];

function ProductsSbslController(kitchenService, messageService, $state, $scope, productService, fileReader, $upload, $http) {
    console.log("ProductsController");
    var vm = this;
    vm.service = productService;
    vm.products = productService.sbslProducts();
    vm.safeProducts = productService.sbslProducts();
    vm.state = $state;

    vm.purchasePriceChange = function (prod) {
        if (prod.markup !== undefined) {
            // Round to 2 decimals
            prod.retailPrice = prod.purchasePrice + removeButTwoDecimals(prod.markup / 100 * prod.purchasePrice);
        }
    };

    vm.markupChange = function (prod) {
        if (prod.purchasePrice !== undefined) {
            prod.retailPrice = prod.purchasePrice + removeButTwoDecimals(prod.markup / 100 * prod.purchasePrice);
        }
    };

    vm.retailPriceChange = function (prod) {
        if (prod.purchasePrice !== undefined) {
            prod.markup = removeButTwoDecimals(100 * ((prod.retailPrice / prod.purchasePrice) - 1));
        }
    };

    function removeButTwoDecimals(val) {
        return Math.round(val * 100) / 100;
    }
}