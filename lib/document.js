'use strict';

/**
* FUNCTION: Document( text )
*	Creates a document instance.
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
* METHOD: toString()
*	Returns a string representation of the document.
*
* @returns {String} document text
*/
Document.prototype.toString = function toString() {
	return this.text;
};  // end METHOD attribute()


// EXPORTS //

module.exports = Document;
