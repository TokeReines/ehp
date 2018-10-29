(function () {
    'use strict';

    angular
        .module('app')
        .factory('productService', productService);

    productService.$inject = ['firebaseKitchenFactory', '$firebaseArray'];

    function productService(fbRef, $firebaseArray) {
        var service = {
            products: products,
            sbslProducts: sbslProducts,
            create: create,
            update: update,
            search: ""
        };

        function sbslProducts() {
            //$http.defaults.headers.common['Authorization'] = 'Basic ' + btoa("egmont_system:EQ$46q!vq2Whhpy="); // jshint ignore:line
            //$http({
            //    url: 'http://studenterbolaget.dk/services/rest/product',
            //    method: "GET",
            //    withCredentials: true,
            //    headers: {
            //        'Authorization': 'Basic ' + btoa("egmont_system:EQ$46q!vq2Whhpy=")
            //    }
            //});
            var xhr = createCORSRequest('GET', 'http://studenterbolaget.dk/services/rest/product');
            if (!xhr) {
                throw new Error('CORS not supported');
            }
            xhr.setRequestHeader("Authorization",'Basic ' + btoa("egmont_system:EQ$46q!vq2Whhpy="));
            // Response handlers.
            xhr.onload = function () {
                var text = xhr.responseText;
                alert('Response from CORS request to ' + url + ': ' + text);
            };

            xhr.onerror = function (error) {
                console.log(error);
            };

            xhr.send(); 
        }

        function createCORSRequest(method, url) {
            var xhr = new XMLHttpRequest();
            if ("withCredentials" in xhr) {

                // Check if the XMLHttpRequest object has a "withCredentials" property.
                // "withCredentials" only exists on XMLHTTPRequest2 objects.
                xhr.open(method, url, true);

            } else if (typeof XDomainRequest != "undefined") {

                // Otherwise, check if XDomainRequest.
                // XDomainRequest only exists in IE, and is IE's way of making CORS requests.
                xhr = new XDomainRequest();
                xhr.open(method, url);

            } else {

                // Otherwise, CORS is not supported by the browser.
                xhr = null;

            }
            return xhr;
        }

        function products() {
            var ref = fbRef.child("products");
            return $firebaseArray(ref);
        }

        function create(prod) {
            fbRef.child("products").push({ name: prod.name, imageName: prod.imageName, imgId: prod.imgId, purchasePrice: prod.purchasePrice, markup: prod.markup, retailPrice: prod.retailPrice, active: true });
        }

        function update(prod) {
            var validatedProd = {
                active: prod.active,
                imageName: prod.imageName,
                imgId: prod.imgId,
                markup: prod.markup,
                name: prod.name,
                purchasePrice: prod.purchasePrice,
                retailPrice: prod.retailPrice
            }
            fbRef.child("products").child(prod.$id).update(validatedProd);
        }

        return service;
    }
})();