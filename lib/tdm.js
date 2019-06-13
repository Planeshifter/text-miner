'use strict';

// MODULES //

var _ = require( 'underscore' );


// TERM-DOCUMENT MATRIX //

/**
 * Creates a term-document matrix object.
 *
 * @constructor
 * @param {Object} corpus - an instance of class Corpus
 * @param gramSize
 */
function TermDocumentMatrix( corpus, gramSize ) {

	gramSize = typeof gramSize !== 'undefined' ?  gramSize : 1;

	if ( !( this instanceof TermDocumentMatrix ) ) {
		return new TermDocumentMatrix(corpus, gramSize);
	}

	var self = this;

	this.vocabulary = [];
	this.dtm = [];

	Object.defineProperty( this, 'nDocs', {
		get: function() {
			return this.dtm.length;
		},
		enumerable: true
	});

	Object.defineProperty( this, 'nTerms', {
		get: function() {
			return this.vocabulary.length;
		},
		enumerable: true
	});

	this.fill_zeros = function() {
		var word;
		var doc;
		for ( doc = 0; doc < self.dtm.length; doc++ ) {
			for ( word = 0; word < self.dtm[0].length; word++ ) {
				if ( self.dtm[doc][word] === undefined ) {
					self.dtm[doc][word] = 0;
				}
			}
		}
		return self;
	};

	function _wordFreq( wordIndex ) {
		var mapping = self.dtm.map( function( doc ) {
			return doc[wordIndex] || 0;
		});
		var reducing = mapping.reduce( function( a, b ) {
			return a + b;
		});
		return reducing;
	}

	this.findFreqTerms = function findFreqTerms( n ) {
		var sortedWordArray;
		var wordCount;
		var wordArray = [];
		var obj;
		var w;

		for ( w = 0; w < self.vocabulary.length; w++ ) {
			wordCount = _wordFreq(w);
			obj = {};
			obj.word = self.vocabulary[w];
			obj.count = wordCount;
			if ( wordCount >= n ) {
				wordArray.push(obj);
			}
		}

		sortedWordArray = _.sortBy( wordArray, function( obj ) {
			return obj.word;
		});
		return sortedWordArray;
	};

	this.removeSparseTerms = function removeSparseTerms( percent ) {
		var flaggedForKeeping = [];
		var newVocabulary;
		var counter;
		var newVec;
		var doc;
		var d;
		var d2;
		var i;
		var j;
		var w;

		for ( w = 0; w < self.vocabulary.length; w++ ) {
			counter = 0;
			for ( d = 0; d < self.dtm.length; d++ ){
				doc = self.dtm[d];
				if ( doc !== undefined && doc[w] !== undefined ) {
					counter++;
				}
			}
			if ( counter / self.dtm.length >= percent ) {
				flaggedForKeeping.push(w);
			}
		}

		newVocabulary = [];
		for ( i = 0; i < flaggedForKeeping.length; i++ ) {
			newVocabulary.push( self.vocabulary[ flaggedForKeeping[i] ] );
		}

		for ( d2 = 0; d2 < self.dtm.length; d2++ ) {
			newVec = [];
			for ( j = 0; j < flaggedForKeeping.length; j++ ) {
				newVec.push( self.dtm[d2][ flaggedForKeeping[j] ] );
			}
			self.dtm[d2] = newVec;
		}

		self.vocabulary = newVocabulary;
		return self;
	};

	this.weighting = function weighting( fun ) {
		self.dtm = fun( self.dtm );
		return self;
	};

	// initialization
	this.init = function init( corpus, gramSize ) {
		var current_word;
		var wordArray;
		var words;
		var index;
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
			self.dtm.push( words );
		}
		for ( i = 0; i < self.dtm.length; i++ ) {
			doc = self.dtm[ i ];
			doc.length = self.vocabulary.length; // ensure that all rows in dtm have same length
		}
	};
	self.init( corpus, gramSize );
} // end FUNCTION TermDocumentMatrix()


// EXPORTS //

module.exports = TermDocumentMatrix;
