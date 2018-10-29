angular
    .module('app')
    .controller('DormBookController', DormBookController);

DormBookController.$inject = ['userService', 'messageService', '$state', '$scope', 'auth'];

function DormBookController(userService, messageService, $state, $scope, auth) {
    var vm = this;
    vm.residents = userService.users();
    vm.messages = messageService.getMessages();
    vm.safeMessages = messageService.getMessages();
    vm.addMessage = addMessage;
    vm.addComment = addComment;

    vm.residents.$loaded().then(function () {
        messageUserMutex();
    });
    vm.messages.$loaded().then(function() {
        messageUserMutex();
    });

    function addComment(keyEvent, message) {
        if(keyEvent.which === 13) {
            if(message.comments === undefined) {
                message.comments = [];
            }
            var comment = {};
            comment.message = message.newComment;
            comment.timestamp = Firebase.ServerValue.TIMESTAMP;

            message.comments.push(comment);
            message.newComment = "";
            vm.messages.$save(message);
        }
    }

    function addMessage() {
        messageService.create(JSON.parse(vm.resident), auth.kitchen(), vm.title, vm.message, Firebase.ServerValue.TIMESTAMP);
        vm.resident = null;
        vm.title = "";
        vm.message = "";
        $scope.messageForm.$setPristine(true);
    }

    function messageUserMutex() {
        if(vm.residents.length > 0 && vm.messages.length > 0) {
            vm.messages.forEach (function (m) {
                m.residentName = vm.residents.$getRecord(m.residentId).name;
                m.residentRoom = vm.residents.$getRecord(m.residentId).room;
            });
        }
    }
}