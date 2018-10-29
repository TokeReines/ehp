angular
    .module('app')
    .controller('AccountingController', AccountingController);

AccountingController.$inject = ['userService', 'productService', 'purchaseService', 'accountingService', '$scope', 'firebaseKitchenFactory'];

function AccountingController(userService, productService, purchaseService, accountingService, $scope, fbRef) {
    var vm = this;
    vm.toDate = new Date();
    vm.purchaseService = purchaseService;
    vm.fromDate = new Date(vm.toDate.getFullYear(), vm.toDate.getMonth() - 1, vm.toDate.getDate());
    vm.residents = userService.users();
    vm.products = productService.products();
    vm.loading = false;
    vm.statuses = [];
    vm.safeStatuses = [];
    vm.summed = [];
    // Called in the ng-repeat on purchases
    vm.sum = function (items, property) {
        var sum = 0;
        angular.forEach(items, function (item) {
            sum += item[property];
        });
        return sum;
    };
    vm.sumProduct = function (items, key) {
        var sum = 0;
        angular.forEach(items, function (item) {
            if (item.productId === key) {
                sum++;
            }
        });
        return sum;
    };
    vm.residents.$loaded(function () {
        vm.products.$loaded(function () {
            $scope.$watch('vm.fromDate', dateChanged);
            $scope.$watch('vm.toDate', dateChanged);
        });
    });


    vm.removeResidentFromFilter = function (userIndex) {
        vm.filterUsers.splice(userIndex, 1);
    };

    vm.filterAlreadyAdded = function (user) {
        return vm.filterUsers.indexOf(user) === -1;
    }

    vm.createAccounting = function () {
        var headers = $.map(vm.products, function (prod) {
            return prod.name;
        });
        headers.unshift("residentRoom","residentName");
        headers.push("status");
        var element = angular.element("#accountingTable");
        var ignoreSelector = '.ng-table-filters';
        var data = [];
        var rows = element.find('tr');
        angular.forEach(rows, function (row, i) {
            var tr = angular.element(row);
            var ths = tr.find('th');
            if (ths.length !== 0) {
                return;
            }
            var rowData = [];
            if (tr.is(ignoreSelector)) {
                return;
            }
            var tds = tr.find('td');
            angular.forEach(tds, function (td, i) {
                var value = '';
                td = angular.element(td);
                value = angular.element(td).text();
                rowData[headers[i]] = value;
            });
            data.push(rowData);
        });
        accountingService.create({ name: vm.newAccounting.title, toDate: new Date(vm.toDate).getTime(), fromDate: new Date(vm.fromDate).getTime(), statuses: data });
    }

    function dateChanged() {
        // Dunno how to get this into a controller and being purdy/realtime
        vm.loading = true;
        fbRef.child("purchases")
           .orderByChild("createdOn").startAt(new Date(vm.fromDate).getTime()).endAt(new Date(vm.toDate).getTime()).on('value', function (dataSnapshot) {
               $scope.$apply(function () {
                   vm.statuses = [];
                   vm.safeStatuses = [];
                   var purchases = dataSnapshot.val();
                   angular.forEach(purchases, function (value, key) {
                       var record = vm.residents.$getRecord(value.userId);
                       value.residentName = record.name;
                       value.residentRoom = record.room;
                       vm.statuses.push(value);
                       vm.safeStatuses.push(value);
                   });
                   vm.loading = false;
               });
           });
    };
}