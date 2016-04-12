'use strict';

/**
* Replaces undefined values in the `data` array-of-arrays with zero.
*
* @returns {DocumentTermMatrix|TermDocumentMatrix} terms object
*/
function fill_zeros() {
	/* jshint -W040 */
	var i;
	var j;
	for ( i = 0; i < this.data.length; i++ ) {
		for ( j = 0; j < this.data[0].length; j++ ) {
			if ( this.data[i][j] === undefined ) {
				this.data[i][j] = 0;
			}
		}
	}
	return this;
} // end METHOD fill_zeros()


// EXPORTS //

module.exports = fill_zeros;
