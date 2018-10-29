angular
  .module('app')
  .filter('reverse', function() {
    return function(items) {
        if(items === undefined)
            return items;
        else
            return items.slice().reverse();
    }
  });