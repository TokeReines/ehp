(function () {
    'use strict';

    angular
        .module('app')
        .directive('ngFileSelect', ngFileSelect);

    ngFileSelect.$inject = ['$window'];

    function ngFileSelect($window) {
        return {
            scope: {
                callback: '&'
            },
            link: function (scope, el) {
                el.bind("change", function (e) {
                    scope.file = (e.srcElement || e.target).files[0];
                    scope.callback(scope.file);
                });
            }
        }
    }
})();