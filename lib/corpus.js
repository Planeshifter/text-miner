'use strict';

// MODULES //

var _  = require( 'underscore' );
// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require( 'underscore.string' );
// Mix in non-conflict functions to Underscore namespace if you want
_.mixin( _.str.exports() );
// All functions, include conflict, will be available through _.str object
_.str.include( 'Underscore.string', 'string' ); // => true

var isArray = require( 'validate.io-array-like' );
var isBoolean = require( 'validate.io-boolean-primitive' );
var isObject = require( 'validate.io-object' );
var isObjectArray = require( 'validate.io-object-array' );
var isString = require( 'validate.io-string-primitive' );
var isStringArray = require( 'validate.io-string-array' );
var Doc = require( './document.js' );

var natural = require( 'natural' );


// FUNCTIONS //

/**
* FUNCTION: isDoc( val )
*	Validates whether input is an instance of Document by using duck-typing.
*
* @private
* @param {*} val - input value
* @returns {Boolean} `true` if `val` is an object with both a `text` and an `attribute` key
*/
function isDoc( val ) {
	if ( isObject( val ) && val.hasOwnProperty( 'text' ) && val.hasOwnProperty( 'attributes' ) ) {
		return true;
	}
	return false;
} // end FUNCTION isDoc()


/**
* FUNCTION: isDocArray( val )
*	Validates whether input is an array of Document instances via duck-typing.
*
* @private
* @param {*} val - input value
* @returns {Boolean} `true` if `val` is an array of elements that pass the `isDoc` check
*/
function isDocArray( val ) {
	var len;
	var i;
	if ( !isArray( val ) ) {
		return false;
	}
	len = val.length;
	for ( i = 0; i < len; i++ ) {
		if ( !isDoc( val[ i ] ) ) {
			return false;
		}
	}
	return true;
} // end FUNCTION isDocArray()


// CORPUS //

/**
* FUNCTION Corpus( [docs] )
*	Create a corpus of documents.
*
* @constructor
* @param {String|Array} [docs] - string representing a single document or an array of documents
* @returns {Corpus} class instance
*/
function Corpus( docs ) {
	var self = this;
	if ( !( this instanceof Corpus ) ) {
		return new Corpus( docs );
	}

	Object.defineProperty( this, 'nDocs', {
		get: function() {
			return this.documents.length;
		},
		enumerable: true
	});

	/**
	* METHOD: init( val )
	*	Invoked when instance of `Corpus` is created. If the input argument is not undefined,
	*	the supplied documents are added to the corpus.
	*
	* @param {Array|String|Document} val - input value
	* @returns {Void}
	*/
	this.init = function init( val ) {
		var arr;
		var len;
		var i;
		// If nothing is passed, treat docs as empty array...
		if ( val === undefined ) {
			self.documents = [];
		} else {
			if ( isString( val ) ) {
				self.documents = [ new Doc( val ) ];
			} else if ( isStringArray( val ) ) {
				len = val.length;
				arr = new Array( len );
				for ( i = 0; i < len; i++ ) {
					arr[ i ] = new Doc( val[ i ] );
				}
				self.documents = arr;
			} else if ( isDoc( val ) ) {
				self.documents = [ val ];
			} else if ( isDocArray( val ) ) {
				self.documents = val;
			} else {
				throw new TypeError( 'Constructor expects either a single string / document or an array of strings / documents.' );
			}
		}
	}; // end METHOD init()

	/**
	* METHOD: addDoc( doc )
	*	Adds a document to the corpus.
	*
	* @param {String|Document} doc - input document
	* @returns {Void}
	*/
	this.addDoc = function addDoc( doc ) {
		if ( isString( doc ) ) {
			self.documents.push( new Doc( doc ) );
		} else if ( isDoc( doc ) ) {
			self.documents.push( doc );
		} else {
			throw new TypeError( 'Argument has to be a string or document.' );
		}
	}; // end METHOD addDoc()

	/**
	* METHOD: addDocs( docs )
	*	Adds an array documents to the corpus.
	*
	* @param {Array} docs - array of String or Documents
	* @returns {Void}
	*/
	this.addDocs = function addDocs( docs ) {
		var arr;
		var len;
		var i;
		if ( isStringArray( docs ) ) {
			len = docs.length;
			arr = new Array( len );
			for ( i = 0; i < len; i++ ) {
				arr[ i ] = new Doc( docs[ i ] );
			}
			self.documents = self.documents.concat( arr );
		} else if ( isDocArray( docs ) ) {
			self.documents = self.documents.concat( docs );
		} else {
			throw new TypeError( 'Parameter expects an array of strings or documents.' );
		}
	}; // end METHOD addDocs()

	/**
	* METHOD: setAttributes( arr )
	*	Sets attributes for the documents in the corpus
	*
	* @param {Array} arr - object array holding document-level attributes
	* @returns {Corpus} corpus reference
	*/
	this.setAttributes = function setAttributes( arr ) {
		var len;
		var i;
		if ( !isObjectArray( arr ) ) {
			throw new TypeError( 'Input argument has to be an object array.' );
		}
		len = arr.length;
		if ( len !== self.nDocs ) {
			throw new Error( 'Length of object array has to equal the number of documents in the corpus.' );
		}
		for ( i = 0; i < len; i++ ) {
			self.documents[ i ].attributes = arr[ i ];
		}
		return self;
	}; // end METHOD setAttributes()

	self.init( docs );
} // end FUNCTION Corpus()


// PROTOTYPE METHODS //

/**
* METHOD: toString()
*	Creates a string representation of the document collection.
*
* @returns {String} string representation with document excerpts
*/
Corpus.prototype.toString = function toString() {
	var doc;
	var nchars = 500;
	var i;
	var str = '';
	for ( i = 0; i < this.nDocs; i++ ) {
		doc = this.documents[ i ];
		str += 'Document ' + i + ':\n';
		str += '\t' + _(doc.text).truncate( nchars );
		str += '\n' + '\u2500 '.repeat( 16 ) + '\n';
	}
	return str;
}; // end METHOD toString()

/**
* METHOD: trim()
*	Trims whitespace from the begining and end of the documents.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.trim = function trim() {
	this.apply( function( text ) {
		return _.trim( text );
	});
	return this;
}; // end METHOD trim()

/**
* METHOD: clean()
*	Strips extra whitespace from documents.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.clean = function clean() {
	this.apply( function( text ) {
		return _.clean( text );
	});
	return this;
}; // end METHOD clean()

/**
* METHOD: toLower()
*	Transform documents in-place by converting their texts to lowe case.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.toLower = function toLower() {
	this.apply( function( text ) {
		return text.toLowerCase();
	});
	return this;
}; // end METHOD toLower()

/**
* METHOD: toUpper()
*	Transform documents in-place by converting their texts to upper case.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.toUpper = function toUpper() {
	this.apply( function( text ) {
		return text.toUpperCase();
	});
	return this;
}; // end METHOD toUpper()

/**
* METHOD: stem( [type] )
*	Applies a stemming algorithm to reduce words to their root form. Mutates the corpus.
*
* @param {String} [type='Porter'] - used stemming algorithm
* @returns {Corpus} corpus reference
*/
Corpus.prototype.stem = function stem( type ) {
	this.apply( function( text ) {
		if ( type === 'Lancaster' ) {
			return natural.LancasterStemmer.stem( text );
		} else {
			return natural.PorterStemmer.stem( text );
		}
	});
	return this;
}; // end METHOD stem()

/**
* METHOD: apply( func )
*	Applies transformation function to each document in-place.
*
* @param {Function} func - transformation function called with `text`, `attribute` and `id` arguments
* @returns {Corpus} original corpus
*/
Corpus.prototype.apply = function apply( func ) {
	var i;
	var doc;
	for ( i = 0; i < this.nDocs; i++ ) {
		doc = this.documents[ i ];
		doc.text = func( doc.text, doc.attributes, i );
		this.documents[ i ] = doc;
	}
	return this;
}; // end METHOD apply()

/**
* METHOD: map( func )
*	Applies a transformation function to each document and returns new corpus.
*
* @param {Function} func - transformation function called with `text`, `attribute` and `id` arguments
* @returns {Corpus} new corpus
*/
Corpus.prototype.map = function map( func ) {
	var ret = new Corpus();
	var i;
	var doc;
	for ( i = 0; i < this.nDocs; i++ ) {
		doc = this.documents[ i ];
		doc.text = func( doc.text, doc.attributes, i );
			ret.addDoc( doc );
	}
	return ret;
}; // end METHOD map()

/**
* METHOD: filter( func )
*	Filter out documents and return a new corpus with the remaining documents.
*
* @param {Function} func - filter function
* @returns {Corpus} corpus without documents for which `func` has returned `false`
*/
Corpus.prototype.filter = function filter( func ) {
	var ret = new Corpus();
	var i;
	var bool;
	var doc;
	for ( i = 0; i < this.nDocs; i++ ) {
		doc = this.documents[ i ];
		bool  = func( doc.text, doc.attributes, i );
		if ( bool ) {
			ret.addDoc( doc );
		}
	}
	return ret;
}; // end METHOD filter()

/**
* METHOD: groupBy( func )
*	Group documents by the unique elements returned from the supplied function.
*
* @param {Function} func - function invoked for each document with `text`, `attribute` and `id` arguments
* @returns {Array} object holding multiple corpora indexed by the values returned by `FUN`
*/
Corpus.prototype.groupBy = function groupBy( func ) {
	var corpora = {};
	var group;
	var doc;
	var i;
	for ( i = 0; i < this.nDocs; i++ ) {
		doc = this.documents[ i ];
		group = func( doc.text, doc.attributes, i );
		if ( !corpora.hasOwnProperty( group ) ) {
			corpora[ group ] = new Corpus( doc );
		} else {
			corpora[ group ].addDoc( doc );
		}
	}
	return corpora;
}; // end METHOD groupBy()

/**
* METHOD: removeInterpunctuation()
*	Remove all exclamation marks, question marks, periods, commas, semicolons and - from the
*	documents. Mutates corpus.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.removeInterpunctuation = function removeInterpunctuation() {
	this.apply( function( text ) {
		return text.replace( /[\!\?\.,;-]/g, ' ' );
	});
	return this;
}; // end METHOD removeInterpunctuation()

/**
* METHOD: removeNewlines()
*	Remove all newlines from the corpus documents. Mutates corpus.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.removeNewlines = function removeNewlines() {
	this.apply( function( text ) {
		return text.replace( /\r?\n|\r/g, ' ' );
	});
	return this;
}; // end METHOD removeNewlines()

/**
* METHOD: removeDigits()
*	Remove all digits from the document texts. Mutates corpus.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.removeDigits = function removeDigits() {
	this.apply( function( text ) {
		return text.replace( /\d/g, '' );
	});
	return this;
}; // end METHOD removeDigits()

/**
* METHOD: removeInvalidCharacters()
*	Replace all characters that are unrepresentable in Unicode. Mutates corpus.
*
* @returns {Corpus} corpus reference
*/
Corpus.prototype.removeInvalidCharacters = function removeInvalidCharacters() {
	this.apply( function( text ) {
		return text.replace( /\uFFFD/g, '' );
	});
	return this;
}; // end METHOD removeInvalidCharacters()

/**
* METHOD: removeWords( words[, caseInsensitive] )
*	Removes the supplied words from all documents in the corpus. Mutates corpus.
*
* @param {Array} words - array of words to remove
* @param {Boolean} [caseInsensitive=false] - boolean indicating whether to ignore case when comparing words
* @returns {Corpus} corpus reference
*/
Corpus.prototype.removeWords = function removeWords( words, caseInsensitive ) {
	if ( !isArray( words ) ) {
		throw new TypeError( 'invalid input argument. Words argument must be an array. Value: `' + words + '`.' );
	}
	if ( arguments.length > 1 ) {
		if ( !isBoolean( caseInsensitive ) ) {
			throw new TypeError( 'invalid input argument. caseInsensitive argument must be a boolean primitive. Value: `' + caseInsensitive + '`.' );
		}
	}
	var i;
	var doc;
	for ( doc = 0; doc < this.nDocs; doc++ ) {
		for ( i = 0; i < words.length; i++ ) {
			this.documents[ doc ] = this.documents[ doc ].removeWordsUnsafe( words, caseInsensitive );
		}
	}
	return this;
}; // end METHOD removeWords()


// EXPORTS //

module.exports = Corpus;
