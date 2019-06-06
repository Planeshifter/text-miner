'use strict';

// MODULES //

var _ = require( 'underscore' );


// DOCUMENT-TERM MATRIX //

/**
 * Creates a document-term matrix object.
 *
 * @constructor
 * @param {Corpus} corpus - input corpus
 * @param gramSize
 */
function DocumentTermMatrix( corpus, gramSize ) {

	gramSize = typeof gramSize !== 'undefined' ?  gramSize : 1;

	if ( !( this instanceof DocumentTermMatrix ) ) {
		return new DocumentTermMatrix(corpus, gramSize);
	}

	var self = this;

	this.vocabulary = [];
	this.data = [];

	Object.defineProperty( this, 'nDocs', {
		get: function() {
			return this.data.length;
		},
		enumerable: true
	});

	Object.defineProperty( this, 'nTerms', {
		get: function() {
			return this.vocabulary.length;
		},
		enumerable: true
	});

	this.removeSparseTerms = function removeSparseTerms( percent ) {
		var flaggedForKeeping = [];
		var newVocabulary;
		var counter;
		var newVec;
		var doc;
		var w;
		var i;
		var j;
		var d;
		var d2;

		for ( w = 0; w < self.vocabulary.length; w++ ) {
			counter = 0;
			for ( d = 0; d < self.data.length; d++ ){
				doc = self.data[d];
				if ( doc !== undefined && doc[w] !== undefined ) {
					counter++;
				}
			}
			if ( counter / self.data.length >= percent ) {
				flaggedForKeeping.push(w);
			}
		}

		newVocabulary = [];
		for ( i = 0; i < flaggedForKeeping.length; i++ ) {
			newVocabulary.push( self.vocabulary[ flaggedForKeeping[i] ] );
		}
		for ( d2 = 0; d2 < self.data.length; d2++ ) {
			newVec = [];
			for ( j = 0; j < flaggedForKeeping.length; j++ ) {
				newVec.push( self.data[d2][ flaggedForKeeping[j] ] );
			}
			self.data[d2] = newVec;
		}

		self.vocabulary = newVocabulary;
		return self;
	};

	this.weighting = function weighting( fun ) {
		self.data = fun( self.data );
		return self;
	};

	/**
	* Function called upon creating a DocumentTermMatrix instances
	*
	* @param  {Corpus} corpus - input corpus
	* @param gramSize
	* @return {DocumentTermMatrix} created document-term matrix
	*/
	this.init = function init( corpus, gramSize ) {
		var current_word;
		var wordArray;
		var index;
		var words;
		var doc;
		var i;
		var j;
		var k;

		for ( i = 0; i < corpus.nDocs; i++ ) {
			doc = corpus.documents[ i ];
			wordArray = doc.text.split( ' ' );
			words = [];
			for ( j = 0; j < wordArray.length - gramSize + 1; j++ ) {
				current_word = '';
				for( k = 0; k < gramSize; k++ ) {
					current_word += wordArray[ j + k ] + (k !== gramSize - 1 ? ' ' : '');
				}
				index = self.vocabulary.indexOf( current_word );
				if ( index > -1 ) {
					words[ index ] = words[ index ] + 1 || 1;
				} else {
					words[ self.vocabulary.length ] = 1;
					self.vocabulary.push( current_word );
				}
			}
			self.data.push( words );
		}
		for ( i = 0; i < self.data.length; i++ ) {
			doc = self.data[ i ];
			// Ensure that all rows in data have same length:
			doc.length = self.vocabulary.length;
		}
	};
	self.init( corpus, gramSize );
} // end FUNCTION DocumentTermMatrix()


// PROTOTYPE METHODS //

DocumentTermMatrix.prototype.fill_zeros = require( './fill_zeros.js' );

/**
* Find the `n` most frequent terms in the terms matrix and return them as a sorted array
* of objects with `word` and `count` keys.
*
* @param  {number} n - number indicating how many terms should be returned
* @return {Array} array of objects with `word` and `count` keys
*/
DocumentTermMatrix.prototype.findFreqTerms = function findFreqTerms( n ) {
	var sortedWordArray;
	var wordArray = [];
	var count;
	var obj;
	var w;
	var d;

	for ( w = 0; w < this.nTerms; w++ ) {
		count = 0;
		for ( d = 0; d < this.nDocs; d++ ) {
			if ( this.data[ d ][ w ] ) {
				count += this.data[ d ][ w ];
			}
		}
		obj = {};
		obj.word = this.vocabulary[ w ];
		obj.count = count;
		if ( count >= n ) {
			wordArray.push( obj );
		}
	}

	sortedWordArray = _.sortBy( wordArray, function by( obj ) {
		return obj.word;
	});
	return sortedWordArray;
}; // end METHOD findFreqTerms()


// EXPORTS //

module.exports = DocumentTermMatrix;
