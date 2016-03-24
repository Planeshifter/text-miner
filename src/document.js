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


// EXPORTS //

module.exports = Document;
