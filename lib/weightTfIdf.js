'use strict';

/**
* FUNCTION weightTfIdf( dtm )
*	Weights a term-document matrix by
*	term frequency - inverse document frequency.
*
* @param {Object} dtm - input document-term matrix
* @returns {Object} mutated document-term matrix object
*/
function weightTfIdf( dtm ) {
	var word_doc_freq = [];
	for ( var w = 0; w < dtm[0].length; w++ ) {
		var count = 0;
		for ( var d = 0; d < dtm.length; d++ ) {
			if ( dtm[d][w] !== undefined ) {
				count++;
			}
		}
		word_doc_freq.push( count );
	}
	for ( var doc = 0; doc < dtm.length; doc++ ) {
		for ( var word = 0; word < dtm[0].length; word++ ){
			var idf = Math.log( dtm.length ) - Math.log( 1 + word_doc_freq[word] );
			if ( dtm[doc][word] !== undefined ) {
				dtm[doc][word] = dtm[doc][word] * idf;
			}
		}
	}
	return dtm;
} // end FUNCTION weightTfIdf()


// EXPORTS //

module.exports = weightTfIdf;
