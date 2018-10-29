angular
  .module('app')
  .factory("auth", authFactory);

authFactory.$inject = ['$cookies', '$state', 'firebaseFactory'];

function authFactory($cookies, $state, fbRef) {
    var vm = {
        kitchen: kitchen,
        changeEmail: changeEmail,
        changePassword: changePassword,
        reqAccess: reqAccess,
        login: login,
        logout: logout,
        register: register,
        isAuthenticated: isAuthenticated,
        forgotPassword: forgotPassword
    };

    function forgotPassword(email, errorCallback, successCallback) {
        fbRef.resetPassword({
            email: email
        }, function (error) {
            if (error) {
                errorCallback(error);
            } else {
                successCallback(email);
            }
        });
    };

    function isAuthenticated(user) {
        var authed = fbRef.getAuth();
        return authed && (!user ||
           ($cookies.getObject("auth") !== null
            && $cookies.getObject("auth") !== undefined));
    };

    function register(email, password, errorCallback, successCallback) {
        fbRef.createUser({
            email: email,
            password: password
        }, function (error, userData) {
            if (error) {
                errorCallback(error);
            } else {
                successCallback(userData);
            }
        });
    };

    function logout() {
        fbRef.unauth();
        fbRef.offAuth(authDataCallback);
        $cookies.remove("auth");
        $state.go("landing-page");
    };

    function login(email, password, errorCallback, successCallback) {
        fbRef.authWithPassword({
            email: email,
            password: password
        }, function (error, authData) {
            if (error) {
                errorCallback(error);
            } else {
                var kitchen = "";
                fbRef.child("users").child(authData.uid).on('value', function (dataSnapshot) {
                    if (!dataSnapshot.exists()) {
                        errorCallback("Bruger eksisterer ikke");
                        return;
                    }
                    kitchen = dataSnapshot.val();
                    fbRef.onAuth(authDataCallback);
                    // Store the authToken in localstorage if browser supports HTML5, otherwise in the cookie
                    setAuth(authData, kitchen, function () {
                        successCallback(authData);
                    }, function (error) {
                        errorCallback(error);
                    });
                });
            }
        });
    };

    function changeEmail(oldE, newE, password, errorCallback, successCallback) {
        fbRef.changeEmail({
            oldEmail: oldE,
            newEmail: newE,
            password: password
        }, function (error) {
            if (error) {
                errorCallback(error);
            } else {
                successCallback();
            }
        });
    };

    function changePassword(email, oldP, newP, errorCallback, successCallback) {
        fbRef.changePassword({
            email: email,
            oldPassword: oldP,
            newPassword: newP
        }, function (error) {
            if (error) {
                errorCallback(error);
            } else {
                successCallback();
            }
        });
    };

    function reqAccess(password, errorCallback, successCallback) {
        fbRef.offAuth(authDataCallback);
        fbRef.authWithPassword({
            email: "auth@ehp.dk",
            password: password
        }, function (error, authData) {
            if (error) {
                errorCallback(error);
            } else {
                successCallback(authData);
            }
        });
    };

    function kitchen() {
        var auth = $cookies.getObject("auth");
        if (auth !== null && auth !== undefined)
            return auth.kitchen;
        return $state.params.kitchen;
    };

    function setAuth(authData, kitchenId, callback, errorCallback) {
        var auth = $cookies.getObject("auth");
        if ((auth === undefined || auth === null) && (kitchen() || kitchenId)) {
            auth = {};
            auth.kitchen = kitchen() || kitchenId;
            $cookies.putObject("auth", auth);
            if (callback)
                callback();
        } else if (callback)
            callback();
    }

    // Create a callback which logs the current auth state
    function authDataCallback(authData) {
        if (authData) {
            setAuth(authData);
        } else {
            console.log("User is logged out");
            $cookies.remove('auth');
            $state.go("landing-page");
        }
    }

    fbRef.onAuth(authDataCallback);
    return vm;
}