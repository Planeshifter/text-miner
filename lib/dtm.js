'use strict';

// MODULES //

var _ = require( 'underscore' );


// DOCUMENT-TERM MATRIX //

/**
* Creates a document-term matrix object.
*
* @constructor
* @param {Object} corpus - an instance of class Corpus
*/
function DocumentTermMatrix( corpus ) {

	if( !( this instanceof DocumentTermMatrix ) ) {
		return new DocumentTermMatrix(corpus);
	}

	var self = this;

	this.vocabulary = [];
	this.data = [];

	Object.defineProperty( this, "nDocs", {
		get: function() {
			return this.data.length;
		},
		enumerable: true
	});

	Object.defineProperty( this, "nTerms", {
		get: function() {
			return this.vocabulary.length;
		},
		enumerable: true
	});

	this.removeSparseTerms = function removeSparseTerms( percent ) {

		var flaggedForKeeping = [];
		for ( var w = 0; w < self.vocabulary.length; w++ ) {
			var counter = 0;
			for ( var d = 0; d < self.data.length; d++ ){
				var doc = self.data[d];
				if ( doc !== undefined && doc[w] !== undefined ) {
					counter++;
				}
			}
			if ( counter / self.data.length >= percent ) {
				flaggedForKeeping.push(w);
			}
		}

		var newVocabulary = [];
		for ( var i = 0; i < flaggedForKeeping.length; i++ ) {
			newVocabulary.push( self.vocabulary[ flaggedForKeeping[i] ] );
		}

		for ( var d2 = 0; d2 < self.data.length; d2++ ) {
			var newVec = [];
			for ( var j = 0; j < flaggedForKeeping.length; j++ ) {
				newVec.push( self.data[d2][ flaggedForKeeping[j] ] );
			}
			self.data[d2] = newVec;
		}

		self.vocabulary = newVocabulary;
		return self;
	};

	this.weighting = function weighting( fun ) {
		self.data = fun(self.data);
		return self;
	};

	/**
	* Function called upon creating a DocumentTermMatrix instances
	*
	* @param  {Corpus} corpus - input corpus
	* @return {DocumentTermMatrix} created document-term matrix
	*/
	this.init = function init( corpus ) {
		var i;
		var j;
		var doc;
		for ( i = 0; i < corpus.nDocs; i++ ) {
			doc = corpus.documents[ i ];
			var wordArray = doc.text.split( ' ' );
			var words = [];
			for ( j = 0; j < wordArray.length; j++ ) {
				var current_word = wordArray[ j ];
				var index = self.vocabulary.indexOf( current_word );
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
	self.init( corpus );
} // end FUNCTION DocumentTermMatrix()


// PROTOTYPE METHODS //

DocumentTermMatrix.prototype.fill_zeros = require( './fill_zeros.js' );

/**
* Find the `n` most frequent terms in the terms matrix and return them as a sorted array
* of objects with `word` and `count` keys.
*
* @param  {Number} n - number indicating how many terms should be returned
* @return {Array} array of objects with `word` and `count` keys
*/
DocumentTermMatrix.prototype.findFreqTerms = function findFreqTerms( n ) {
	var count;
	var obj;
	var wordArray = [];
	var sortedWordArray;
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

	sortedWordArray = _.sortBy( wordArray, function( obj ) {
		return obj.word;
	});
	return sortedWordArray;
}; // end METHOD findFreqTerms()


// EXPORTS //

module.exports = DocumentTermMatrix;
