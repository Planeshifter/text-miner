'use strict';

// VARIABLES //

var CONTRACTIONS = require("./contractions.js");


// EXPAND CONTRACTIONS //

/**
* FUNCTION: expandContractions( str )
*	Expand contractions inside a string, e.g. haven't => have not.
*
* @param {String} str - input string
* @returns {String} string with expanded contractions
*/
function expandContractions( str ) {
	/*jshint -W089 */
	for ( var key in CONTRACTIONS ) {
		str = str.replace( new RegExp( key, 'gi' ), CONTRACTIONS[key][0] );
	}
	return str;
} // end FUNCTION expandContractions()


// EXPORTS //

module.exports = expandContractions;
