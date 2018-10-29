(function () {
    'use strict';

    angular
        .module('app')
        .directive("mdDropdown", [
            "$compile", "$timeout", function ($compile, $timeout) {
                return {
                    link: function (scope, element, attrs) {
                        if (scope.$last) {
                            $timeout(function () {
                                $('.dropdown-button').dropdown({
                                    inDuration: (angular.isDefined(scope.inDuration)) ? scope.inDuration : undefined,
                                    outDuration: (angular.isDefined(scope.outDuration)) ? scope.outDuration : undefined,
                                    constrain_width: (angular.isDefined(scope.constrainWidth)) ? scope.constrainWidth : undefined,
                                    hover: (angular.isDefined(scope.hover)) ? scope.hover : undefined,
                                    alignment: (angular.isDefined(scope.alignment)) ? scope.alignment : undefined,
                                    gutter: (angular.isDefined(scope.gutter)) ? scope.gutter : undefined,
                                    belowOrigin: (angular.isDefined(scope.belowOrigin)) ? scope.belowOrigin : undefined
                                });
                            });
                        }
                    }
                };
            }]);

})();