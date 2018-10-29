(function() {
    'use strict';

    angular
        .module('app')
        .directive('exportTable', exportTable);

    exportTable.$inject = ['$filter'];
    
    function exportTable(filter) {
        return {
            scope: {
                exportTable: '='
            },
          
            link: function (scope, element, attr, ctrl) {
                var flattenObject = function (ob) {
                    var toReturn = {};

                    for (var i in ob) {
                        if (!ob.hasOwnProperty(i)) continue;

                        if ((typeof ob[i]) == 'object') {
                            var flatObject = flattenObject(ob[i]);
                            for (var x in flatObject) {
                                if (!flatObject.hasOwnProperty(x)) continue;

                                toReturn[i + '_' + x] = flatObject[x];
                            }
                        } else if (i.indexOf('_type') == -1) {
                            toReturn[i] = ob[i];
                        }
                    }
                    return toReturn;
                };

                scope.sync = function () {
                    scope.prettified = [];
                    var header = {};
                    angular.forEach(scope.exportTable, function (object) {
                        var flat = flattenObject(object);
                        angular.forEach(flat, function (value, key) {
                            if (!header[key])
                                header[key] = key;
                        });
                    });
                    var array = [];
                    angular.forEach(header, function (object, key) {
                        if (key.indexOf('.') == -1 && key.indexOf('$') == -1)
                            array.push(key);
                    });
                    array = $filter('orderBy')(array, 'toString()');
                    scope.prettified.push(array);
                    angular.forEach(scope.exportTable, function (object) {
                        var a = [];
                        var flat = flattenObject(object);
                        angular.forEach(array, function (value) {
                            if (!flat[value])
                                a.push('N/A');
                            else
                                a.push(flat[value]);
                        });
                        scope.prettified.push(a);
                    });
                    return scope.prettified;
                };
            }
        };
    }

})();