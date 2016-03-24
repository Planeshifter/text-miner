'use strict';

// VARIABLES //

var CONTRACTIONS = require("./contractions.js");


// EXPAND CONTRACTIONS //


function expandContractions( str ) {
	for ( var key in CONTRACTIONS ) {
		str = str.replace( new RegExp( key, 'gi' ), CONTRACTIONS[key][0] );
	}
	return str;
}


// EXPORTS //

module.exports = expandContractions;
