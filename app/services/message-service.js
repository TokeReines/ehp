(function () {
    'use strict';

    angular
        .module('app')
        .factory('messageService', messageService);

    messageService.$inject = ['firebaseKitchenFactory', '$firebaseArray', 'auth'];

    function messageService(fbRef, $firebaseArray, auth) {
        var kitchen = auth.kitchen();
        var messages = $firebaseArray(fbRef.child("messages").orderByChild("kitchen").equalTo(kitchen));

        var service = {
            getMessages: getMessages,
            create: create
        };

        function getMessages() {
            return messages;
        }

        function create(resident, kitchen, title, message, timestamp) {
            var msg = { residentId: resident.$id, residentImgId: resident.imgId, kitchen: kitchen, title: title, message: message, timestamp: timestamp };
            fbRef.child("messages").push(msg);
        }

        return service;
    }
})();