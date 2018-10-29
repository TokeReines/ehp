angular
  .module('app')
  .factory('userService', userService);

userService.$inject = ['$firebaseArray', 'firebaseKitchenFactory', 'auth'];

function userService($firebaseArray, fbRef, auth) {
    var service = {
        search: "",
        create: create,
        users: users,
        attachAuth: attachAuth,
        update: update,
        createUserRequest: createUserRequest
    };

    function users() {
        var ref = fbRef.child("users");
        return $firebaseArray(ref);
    };

    function update(resident) {
        var res = {
            active: resident.active,
            kitchen: resident.kitchen,
            room: resident.room,
            name: resident.name
        }
        if (resident.imageName) {
            res.imageName = resident.imageName;
        }
        if (resident.imgId) {
            res.imgId = resident.imgId;
        }
        fbRef.child("users").child(resident.$id).update(res);
    }


    function createUserRequest(user) {
        var userReqs = fbRef.child("user-requests");
        userReqs.push({
            name: user.name,
            room: user.room,
            authId: user.authId || "",
            email: user.email || "",
            kitchen: auth.kitchen()
        });
    }

    function randomString(length) {
        return Math.round((Math.pow(36, length + 1) - Math.random() * Math.pow(36, length))).toString(36).slice(1);
    }

    function create(user) {
        var residentsRef = fbRef.child("users");
        residentsRef.push({
            name: user.name,
            room: user.room,
            kitchen: auth.kitchen(),
            active: true
        });
    };

    function attachAuth(userId, authId) {
        var residentsRef = fbRef.child("users");
        residentsRef.child(userId).update({
            authId: authId
        });
    }

    return service;
};

