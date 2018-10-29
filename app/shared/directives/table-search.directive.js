(function () {
    'use strict';

    angular
        .module('app')
        .directive('tableSearch', tableSearch);

    tableSearch.$inject = [];

    function tableSearch() {
        return {
            restrict: 'A',
            require: '^?stTable',
            scope: {
                tableSearch: '='
            },
            link: function (scope, ele, attr, ctrl) {
                
                scope.$watch('tableSearch', function (val) {
                    ctrl.search(val);
                });

            }
        };
    }

})();