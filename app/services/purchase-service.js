(function () {
    'use strict';

    angular
        .module('app')
        .factory('purchaseService', purchaseService);

    purchaseService.$inject = ['firebaseKitchenFactory', '$firebaseArray'];

    function purchaseService(fbRef, $firebaseArray) {
        var service = {
            purchases: purchases,
            dateFilteredPurchases: dateFilteredPurchases,
            create: create,
        };


        function dateFilteredPurchases(from, to) {
            var ref = fbRef.child("purchases")
                .orderByChild("createdOn").startAt(from.getTime()).endAt(to.getTime());
            return $firebaseArray(ref);
        }   

        function purchases() {
            var ref = fbRef.child("purchases").orderByChild("createdOn").limitToLast(100);
            return $firebaseArray(ref);
        }

        function create(purchase) {
            var purchasesRef = fbRef.child("purchases");
            purchasesRef.push({
                createdOn: Firebase.ServerValue.TIMESTAMP,
                userId: purchase.userId,
                productId: purchase.productId,
                productName: purchase.productName,
                price: purchase.price,
                userName: purchase.userName,
                userRoom: purchase.userRoom
            });
        };

        return service;
    }
})();