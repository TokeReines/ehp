(function () {
    'use strict';

    angular
        .module('app')
        .directive("mdSelect", [
            "$compile", "$timeout", function ($compile, $timeout) {
                return {
                    restrict: 'A',
                    link: function (scope, element, attrs) {
                        if (element.is("option")) {
                            if (scope.$last) {
                                $timeout(function () {
                                    $('select').material_select();
                                });
                            }
                        }
                    }
                };
            }]);

})();