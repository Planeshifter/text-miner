'use strict';

// MODULES //

var _ = require( 'underscore' );


// DOCUMENT-TERM MATRIX //

/**
* FUNCTION Terms( corpus )
*	Creates a term-document matrix object.
*
* @constructor
* @param {Object} corpus - an instance of class Corpus
*/
function Terms( corpus ) {

	if( !( this instanceof Terms ) ) {
		return new Terms(corpus);
	}

	var self = this;

	this.vocabulary = [];
	this.dtm = [];

	Object.defineProperty( this, "nDocs", {
		get: function() {
			return this.dtm.length;
		},
		enumerable: true
	});

	Object.defineProperty( this, "nTerms", {
		get: function() {
			return this.vocabulary.length;
		},
		enumerable: true
	});

	this.fill_zeros = function() {
		for ( var doc = 0; doc < self.dtm.length; doc++ ) {
			for ( var word = 0; word < self.dtm[0].length; word++ ) {
				if ( self.dtm[doc][word] === undefined ) {
					self.dtm[doc][word] = 0;
				}
			}
		}
		return self;
	};

	function _processDoc( doc ) {

		var wordArray = doc.split( ' ' );
		var words = [];

		for ( var i = 0; i < wordArray.length; i++ ){
			var current_word = wordArray[i];
			var index = self.vocabulary.indexOf( current_word );

			if ( index > -1 ) {
					words[index] = words[index] + 1 || 1;
			} else {
					words[self.vocabulary.length] = 1;
					self.vocabulary.push( current_word );
			}
		}
		self.dtm.push(words);
	}

	function _wordFreq( wordIndex ) {
		var mapping = self.dtm.map( function( doc ) {
			return doc[wordIndex] || 0;
		});
		var reducing = mapping.reduce( function( a, b ) {
			return a + b;
		});
		return reducing;
	}

	this.findFreqTerms = function( n ) {
		var wordArray = [];
		for ( var w = 0; w < self.vocabulary.length; w++ ) {
			var wordCount = _wordFreq(w);
			var obj = {};
			obj.word = self.vocabulary[w];
			obj.count = wordCount;
			if ( wordCount >= n ) {
				wordArray.push(obj);
			}
		}

		var sortedWordArray = _.sortBy( wordArray, function( obj ) {
			return obj.word;
		});
		return sortedWordArray;
	};

	this.removeSparseTerms = function( percent ) {

		var flaggedForKeeping = [];
		for ( var w = 0; w < self.vocabulary.length; w++ ) {
			var counter = 0;
			for ( var d = 0; d < self.dtm.length; d++ ){
				var doc = self.dtm[d];
				if ( doc !== undefined && doc[w] !== undefined ) {
					counter++;
				}
			}
			if ( counter / self.dtm.length >= percent ) {
				flaggedForKeeping.push(w);
			}
		}

		var newVocabulary = [];
		for ( var i = 0; i < flaggedForKeeping.length; i++ ) {
			newVocabulary.push( self.vocabulary[ flaggedForKeeping[i] ] );
		}

		for ( var d2 = 0; d2 < self.dtm.length; d2++ ) {
			var newVec = [];
			for ( var j = 0; j < flaggedForKeeping.length; j++ ) {
				newVec.push( self.dtm[d2][ flaggedForKeeping[j] ] );
			}
			self.dtm[d2] = newVec;
		}

		self.vocabulary = newVocabulary;
		return self;
	};

	this.weighting = function( fun ) {
		self.dtm = fun(self.dtm);
		return self;
	};

	// initialization
	this.init = function( documents ) {
		var i;

		for ( i = 0; i < documents.length; i++ ) {
			_processDoc( documents[i] );
		}

		for ( i = 0; i < self.dtm.length; i++ ) {
			var doc = self.dtm[i];
			doc.length = self.vocabulary.length; // ensure that all rows in dtm have same length
		}

	};
	self.init( corpus.documents );

} // end FUNCTION Terms()


// EXPORTS //

module.exports = Terms;
