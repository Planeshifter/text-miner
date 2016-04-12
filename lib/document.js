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


// DOCUMENT //

/**
* Creates a document instance.
*
* @constructor
* @param {String} text - document text
* @returns {Document} class instance
*/
function Document( text ) {
	this.text = text;
	this.attributes = {};
} // end FUNCTION Document()


// PROTOTYPE METHODS //

/**
* Returns a string representation of the document.
*
* @returns {String} document text
*/
Document.prototype.toString = function toString() {
	return this.text;
};  // end METHOD attribute()

/**
* Applies transformation function to each document text in-place.
*
* @param {Function} func - transformation function called with `text` and `attribute` arguments
* @returns {Document} document reference
*/
Document.prototype.transform = function transform( func ) {
	this.text = func( this.text, this.attributes );
	return this;
}; // end METHOD transform()

/**
* Trims whitespace from the begining and end of the document.
*
* @returns {Document} document reference
*/
Document.prototype.trim = function trim() {
	this.text = _.trim( this.text );
	return this;
}; // end METHOD trim()

/**
* Strips extra whitespace from document.
*
* @returns {Document} document reference
*/
Document.prototype.clean = function clean() {
	this.text = _.clean( this.text );
	return this;
}; // end METHOD clean()

/**
* Transform document by converting text to lowe-case.
*
* @returns {Document} document reference
*/
Document.prototype.toLower = function toLower() {
	this.text = this.text.toLowerCase();
	return this;
}; // end METHOD toLower()

/**
* Transform document by converting text to upper-case.
*
* @returns {Document} document reference
*/
Document.prototype.toUpper = function toUpper() {
	this.text = this.text.toUpperCase();
	return this;
}; // end METHOD toUpper()

/**
* Remove all exclamation marks, question marks, periods, commas, semicolons and - from the
* document
*
* @returns {Document} document reference
*/
Document.prototype.removeInterpunctuation = function removeInterpunctuation() {
	this.text =  this.text.replace( /[\!\?\.,;-]/g, ' ' );
	return this;
}; // end METHOD removeInterpunctuation()

/**
* Remove all newlines from the document.
*
* @returns {Document} document reference
*/
Document.prototype.removeNewlines = function removeNewlines() {
	this.text = this.text.replace( /\r?\n|\r/g, ' ' );
	return this;
}; // end METHOD removeNewlines()

/**
* Remove all digits from the document.
*
* @returns {Document} document reference
*/
Document.prototype.removeDigits = function removeDigits() {
	this.text = this.text.replace( /\d/g, '' );
	return this;
}; // end METHOD removeDigits()

/**
* Replace all characters that are unrepresentable in Unicode.
*
* @returns {Document} document reference
*/
Document.prototype.removeInvalidCharacters = function removeInvalidCharacters() {
	this.text = this.text.replace( /\uFFFD/g, '' );
	return this;
}; // end METHOD removeInvalidCharacters()

/**
* Removes the supplied words from the documents.
*
* @param {Array} words - array of words to remove
* @param {Boolean} [caseInsensitive=false] - boolean indicating whether to ignore case when comparing words
* @returns {Document} document reference
*/
Document.prototype.removeWords = function removeWords( words, caseInsensitive ) {
	if ( !isArray( words ) ) {
		throw new TypeError( 'invalid input argument. Words argument must be an array. Value: `' + words + '`.' );
	}
	if ( arguments.length > 1 ) {
		if ( !isBoolean( caseInsensitive ) ) {
			throw new TypeError( 'invalid input argument. caseInsensitive argument must be a boolean primitive. Value: `' + caseInsensitive + '`.' );
		}
	}
	var i;
	for ( i = 0; i < words.length; i++ ) {
		var options = caseInsensitive ? 'gi' : 'g';
		var myRegExp = new RegExp( '\\b' + words[i] + '\\b', options );
		this.text = this.text.replace( myRegExp, '' );
	}
	// Clean the newly created extra whitespace...
	this.clean();
	return this;
}; // end METHOD removeWords()

/**
* Removes the supplied words from the document without checking input argument types.
*
* @param {Array} words - array of words to remove
* @param {Boolean} [caseInsensitive=false] - boolean indicating whether to ignore case when comparing words
* @returns {Document} document reference
*/
Document.prototype.removeWordsUnsafe = function removeWordsUnsafe( words, caseInsensitive ) {
	var i;
	for ( i = 0; i < words.length; i++ ) {
		var options = caseInsensitive ? 'gi' : 'g';
		var myRegExp = new RegExp( '\\b' + words[i] + '\\b', options );
		this.text = this.text.replace( myRegExp, '' );
	}
	// Clean the newly created extra whitespace...
	this.clean();
	return this;
}; // end METHOD removeWordsUnsafe()

// EXPORTS //

module.exports = Document;
