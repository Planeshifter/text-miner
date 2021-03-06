'use strict';

// VARIABLES //

var CONTRACTIONS = require( './../data/contractions.json' );


// EXPAND CONTRACTIONS //

/**
* Expand contractions inside a string, e.g. haven't => have not.
*
* @param {string} str - input string
* @returns {string} string with expanded contractions
*/
function expandContractions( str ) {
	var key;
	/*jshint -W089 */
	for ( key in CONTRACTIONS ) {
		str = str.replace( new RegExp( key, 'gi' ), CONTRACTIONS[key][0] );
	}
	return str;
} // end FUNCTION expandContractions()


// EXPORTS //

module.exports = expandContractions;
