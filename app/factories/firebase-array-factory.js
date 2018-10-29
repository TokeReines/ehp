angular
  .module('app')
  .factory('sumPurchases', sumPurchases);

sumPurchases.$inject = ['$firebaseArray'];

function sumPurchases($firebaseArray) {
	return $firebaseArray.$extend({
	    sum: function() {
		      var total = 0;
		      angular.forEach(this.$list, function(rec) {
		        total += rec.x;
	      });
	      return total;
	    }
	});
}