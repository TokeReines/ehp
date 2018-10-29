(function () {
    'use strict';

    angular
        .module('app')
        .directive('shadow', shadow);

    shadow.$inject = [];

    function shadow() {
        return {
            scope: true,
            link: function (scope, el, att) {
                scope[att.shadow] = angular.copy(scope[att.shadow]);

                scope.commit = function (firebaseCollection) {
                    scope.$parent[att.shadow] = angular.copy(scope[att.shadow]);
                    firebaseCollection.$save(scope.$parent[att.shadow]);
                };
            }
        }
    };

})();