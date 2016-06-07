'use strict';

// FUNCTIONS //

var ln = Math.log;


// WEIGHT TF-IDF //

/**
* Weights a document-term matrix (stored as an array-of-arrays) by
* term frequency - inverse document frequency.
*
* @param {Array} dtm - input document-term matrix (array-of-arrays)
* @returns {Array} mutated document-term matrix object (array-of-arrays)
*/
function weightTfIdf( dtm ) {
	var word_doc_freq = [];
	var count;
	var word;
	var doc;
	var idf;
	var d;
	var w;

	for ( w = 0; w < dtm[0].length; w++ ) {
		count = 0;
		for ( d = 0; d < dtm.length; d++ ) {
			if ( dtm[d][w] !== undefined && dtm[d][w] > 0 ) {
				count++;
			}
		}
		word_doc_freq.push( count );
	}

	for ( doc = 0; doc < dtm.length; doc++ ) {
		for ( word = 0; word < dtm[0].length; word++ ){
			idf = ln( dtm.length ) - ln( 1 + word_doc_freq[word] );
			if ( dtm[doc][word] !== undefined ) {
				dtm[doc][word] = dtm[doc][word] * idf;
			}
		}
	}
	return dtm;
} // end FUNCTION weightTfIdf()


// EXPORTS //

module.exports = weightTfIdf;
