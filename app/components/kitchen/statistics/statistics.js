(function () {
    'use strict';

    angular
        .module('app')
        .controller('StatisticsController', StatisticsController);

    StatisticsController.$inject = ['purchaseService', 'firebaseKitchenFactory', '$scope', '$q'];

    function StatisticsController(purchases, fbRef, $scope, $q) {
        var vm = this;
        vm.activate = activate;
        vm.purchases = purchases.purchases();

        function orderPurchases(purchasesObj) {
            return $q(function (resolve) {
                var arr = $.map(purchasesObj, function (value) {
                    return [value];
                });
                var purchases = arr.reverse();
                var orderedPurchases = {};
                var products = {};
                angular.forEach(purchases, function (purchase) {
                    var userId = purchase.userId;
                    if (!orderedPurchases[userId]) {
                        orderedPurchases[userId] = {};
                        orderedPurchases[userId].userName = purchase.userName;
                        orderedPurchases[userId].userRoom = purchase.userRoom;
                    }
                    var productName = purchase.productName;
                    var productId = purchase.productId;
                    if (!orderedPurchases[userId].purchases) {
                        orderedPurchases[userId].purchases = {};
                    }
                    if (!orderedPurchases[userId].purchases[productId]) {
                        orderedPurchases[userId].purchases[productId] = {};
                        orderedPurchases[userId].purchases[productId].count = 0;
                        orderedPurchases[userId].purchases[productId].name = productName;
                    }
                    if (!products[purchase.productId]) {
                        products[purchase.productId] = productName;
                    }
                    orderedPurchases[userId].purchases[productId].count += 1;
                });
                orderedPurchases = sortOrderedPurchases(orderedPurchases);
                return resolve({ orderedPurchases, products });
            });
        }

        function sortOrderedPurchases(obj) {
            // convert object into array
            var sortable = objToArray(obj);

            sortable.sort(function (a, b) {
                return a.userRoom - b.userRoom;
            });
            return sortable;
        }

        function objToArray(obj) {
            var sortable = [];
            for (var key in obj)
                if (obj.hasOwnProperty(key))
                    sortable.push(obj[key]);
            return sortable;
        }

        function renderPieChart(orderedPurchases) {
            return $q(function (resolve, reject) {
                if (!orderedPurchases) {
                    return reject("No items");
                }
                var chartObject = {};

                chartObject.type = "PieChart";
                var data = [['User', 'Count']];
                angular.forEach(orderedPurchases, function (purch, key) {
                    angular.forEach(purch.purchases, function (prodPurch, key) {
                        if (prodPurch.name.toLowerCase() === "maribo") {
                            data.push([purch.userName, prodPurch.count]);
                        }
                    });
                    data.push([purch.userName, purch.count]);
                });
                chartObject.data = data;

                chartObject.options = {
                    'title': 'Maribo føretrøjen',
                    'pieHole': 0.4
                };
                resolve(chartObject);
            });
        };

        function addDays(date, days) {
            date.setDate(date.getDate() + days);
            return date;
        }

        function getDates(startDate, endDate) {
            var dates = {};
            var currentDate = startDate;
            var counter = 0;
            while (currentDate <= endDate) {
                var month = currentDate.getMonth() + 1;
                var dateString = currentDate.getDate() + "/" + month;
                dates[dateString] = { order: counter };
                currentDate = addDays(currentDate, 1);
                counter++;
            }
            return dates;
        };

        function renderSalesChart(purchasesObj, fromDate) {
            return $q(function(resolve) {
                var users = {};
                var purchases = objToArray(purchasesObj);
                var mariboPurchases = purchases.filter(function(val) {
                    return val.productName.toLowerCase() === "maribo";
                });
                var datesBetween = getDates(fromDate, new Date());

                angular.forEach(mariboPurchases, function(purchase, key) {
                    var date = moment(new Date(purchase.createdOn)).format('D/M');
                    if (!datesBetween[date].users) {
                        datesBetween[date].users = {};
                    }
                    if (!datesBetween[date].users[purchase.userId])
                        datesBetween[date].users[purchase.userId] = 0;
                    if (!users[purchase.userId]) {
                        users[purchase.userId] = purchase.userName;
                    }
                    datesBetween[date].users[purchase.userId]++;
                });
                var cols = [{ id: "Date", label: "Dato", type: "string" }];
                var rows = [];
                angular.forEach(users, function (user, key) {
                    cols.push({ id: user, label: user, type: "number" });
                });
                angular.forEach(datesBetween, function (date, key) {
                    var row = { c: [{ v: key}] };
                    angular.forEach(users, function (userName, userId) {
                        var count = 0;
                        if (!!date.users && !!date.users[userId]) {
                            count = date.users[userId];
                        }
                        row.c.push({ v: count });
                    });
                    rows.push(row);
                });
                var salesChart = {};

                salesChart.type = "LineChart";
                salesChart.data = {};

                salesChart.data.cols = cols;
                salesChart.data.rows = rows;

                salesChart.options = {
                    'title': 'Mariboforbrug',
                    'isStacked': true,
                    "vAxis": {
                        "title": "Dato"
                    },
                    "hAxis": {
                        "title": "Antal"
                    },
                    //'curveType': 'function',
                };
                return resolve(salesChart);
            });
        }

        function renderBarChart(orderedPurchases, products) {
            return $q(function (resolve, reject) {
                if (!orderedPurchases) {
                    return reject("No purchases");
                }
                var cols = [{ id: "Name", label: "Navn", type: "string" }];
                var rows = [];
                angular.forEach(products, function (product, key) {
                    cols.push({ id: product, label: product, type: "number" });
                });
                angular.forEach(orderedPurchases, function (purchase, key) {
                    var row = { c: [{ v: purchase.userName }] };
                    angular.forEach(products, function (prod, productId) {
                        var count = 0;
                        if (!!purchase.purchases[productId]) {
                            count = purchase.purchases[productId].count;
                        }
                        row.c.push({ v: count });
                    });
                    rows.push(row);
                });
                var stackedBarChart = {};

                stackedBarChart.type = "ColumnChart";
                stackedBarChart.data = {};

                stackedBarChart.data.cols = cols;
                stackedBarChart.data.rows = rows;

                stackedBarChart.options = {
                    'title': 'Køleskabsforbrug',
                    'isStacked': true
                };
                return resolve(stackedBarChart);
            });
        };

        function calculateGraphs(fromDate) {
            fbRef.child("purchases")
             .orderByChild("createdOn").startAt(fromDate.getTime()).endAt(new Date().getTime()).on('value', function (dataSnapshot) {
                 vm.loading = false;
                 var purchases = dataSnapshot.val();
                 if (!purchases) return;
                 $scope.$apply(function () {
                     vm.loadingBarChart = true;
                     vm.loadingPieChart = true;
                     vm.loadingSalesChart = true;
                     vm.loading = false;
                 });
                 orderPurchases(purchases).then(function (chartData) {
                     renderBarChart(chartData.orderedPurchases, chartData.products).then(function (stackedBarChartObject) {
                         vm.loadingBarChart = false;
                         vm.stackedBarChartObject = stackedBarChartObject;
                     });
                     renderPieChart(chartData.orderedPurchases).then(function (pieCharObject) {
                         vm.pieCharObject = pieCharObject;
                         vm.loadingPieChart = false;
                     });
                 });
                 renderSalesChart(purchases, fromDate).then(function (chartData) {
                     vm.salesChartObject = chartData;
                     vm.loadingSalesChart = false;
                 });
             });
        }


        activate();

        function activate() {
            vm.month = ['Januar', 'Februar', 'Marts', 'April', 'Maj', 'Juni', 'Juli', 'August', 'September', 'Oktober', 'November', 'December'];
            var prevMonth = new Date();
            prevMonth.setDate(prevMonth.getDate());
            prevMonth.setMonth(prevMonth.getMonth() - 1);

            if (!vm.fromDate) {
                vm.fromDate = prevMonth;
            }
            $scope.$watch('vm.fromDate', function (newValue, oldValue) {
                if (newValue !== oldValue) {
                    var dayMonth = newValue.split("/");
                    var date = new Date();
                    date.setMonth(dayMonth[1] - 1);
                    date.setDate(dayMonth[0]);
                    calculateGraphs(date);
                };
            });
            vm.loading = true;
            calculateGraphs(prevMonth);

        }
    }
})();
