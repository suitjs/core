
/**
* Debug class
* @module
* @class
*/
var Debug =
function(){


		var _Debug = {

		/**
		* Some func		
		* @param {Number} a - A param
		* @param {Number|null} b - B param		
		*/
		func: function(a,b) {},


		/**
	     * A
	     * @type {Number}	     
	     */
		a: 10,
		
		/**
	     * B
	     * @type {String}	     
	     */
		b: "hello",

		/**
		* Container for model functions.
		* @class				
		*/
		model: {

			/**
			* Read stuff.
			* @param {Number} a - A
			* @param {Number}  b - B
			* @param {?Number} c - C
			*/
			read: function(a,b,c){}
		}

	};

	return _Debug;

}();

