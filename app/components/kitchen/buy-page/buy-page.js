angular
    .module('app')
    .controller('BuyPageController', BuyPageController);

BuyPageController.$inject = ['$firebaseArray', 'productService', 'userService', 'firebaseFactory', 'purchaseService'];

function BuyPageController($firebaseArray, productService, userService, fbRef, purchaseService) {
    var vm = this;
    vm.dormproducts = productService.products();
    vm.dormusers = userService.users();
    vm.purchases = purchaseService.purchases();
    vm.removePurchase = function(purchase) {
        vm.purchases.$remove(purchase);
    }

    vm.buy = buy;
    vm.clear = clear;

    vm.selectedProduct = undefined;
    vm.selectedUsers = [];

    vm.selectUser = selectUser;
    vm.selectProduct = selectProduct;
    vm.productCount = -1;

    vm.openPurchaseHistory = openPurchaseHistory;
    vm.deletePurchase = deletePurchase;
    vm.purchaseSearch = '';

    vm.openDeletePurchaseModal = function (purchase) {
        vm.deletePurchase = purchase;
        $('#deletePurchaseModal').openModal();
    }

    vm.isSelected = function(product) {
        return vm.selectedProduct !== undefined && vm.selectedProduct.$id === product.$id;
    }

    function openPurchaseHistory() {
        vm.assocUsers = createAssocArray(vm.dormusers);
        vm.assocProducts = createAssocArray(vm.dormproducts);
        $('#modal1').openModal();
    }

    function deletePurchase(purchase) {
        purchases.$remove(purchase);
    }

    function clear() {
        vm.selectedUsers.splice(0, vm.selectedUsers.length);
        vm.selectedProduct = undefined;
        vm.productCount = -1;
    }

    function selectUser(user) {
        if (vm.selectedUsers.indexOf(user) == -1) {
            vm.selectedUsers.push(user);
        }
        else {
            vm.selectedUsers.splice(vm.selectedUsers.indexOf(user), 1);
        }
    }

    function selectProduct(product) {
        if (vm.selectedProduct === product) {
            vm.productCount++;
        }
        else {
            vm.productCount = 1;
            vm.selectedProduct = product;
        }
    }

    function createAssocArray(items) {
        var res = new Array();
        items.forEach(function (item) {
            res[item.$id] = item;
        });
        return res;
    }

    function buy() {
        if (vm.productCount <= 0 || vm.selectedProduct == undefined || vm.selectedUsers.length === 0)
            return;

        vm.selectedUsers.forEach(function (user) {
            for (var i = 0; i < vm.productCount; i++) {
                var p = {
                    userId: user.$id,
                    userName: user.name,
                    userRoom: user.room,
                    productId: vm.selectedProduct.$id,
                    productName: vm.selectedProduct.name,
                    price: vm.selectedProduct.retailPrice
                };
                purchaseService.create(p);
            }
            Materialize.toast("Køb gennemført for " + user.name, 2000);
        });
        clear();
    }
}