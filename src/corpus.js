'use strict';

var _  = require( 'underscore' );

// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require( 'underscore.string' );

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin( _.str.exports() );

// All functions, include conflict, will be available through _.str object
_.str.include( 'Underscore.string', 'string' ); // => true

var natural = null;

/**
* FUNCTION Corpus( [docs] )
*	Create a corpus of documents.
*
* @constructor
* @param {String|Array} docs - string representing a single document or an array of documents
*/
function Corpus( docs ) {

	// load natural module
	if ( !natural ) {
		natural = require( 'natural' );
	}

	// if nothing passed, treat docs as empty array
	if ( docs === undefined ) {
		docs = [];
	}

	if ( !( this instanceof Corpus ) ) {
		return new Corpus(docs);
	}

	var self = this;

	if ( typeof docs === "string" ) {
		docs = new Array(docs);
		this.documents = docs;
	} else if ( Array.isArray(docs) === true && docs.every( function(doc){
		return typeof doc === "string";} ) ) {
		this.documents = docs;
	} else {
		throw new TypeError("Constructor expects array of documents");
	}

	// hold meta information for documents
	this.meta = [];

	// adds new document to Corpus
	this.addDoc = function addDoc( doc ) {
		if (typeof doc === "string"){
			self.documents.push(doc);
		}
		else {
			throw new TypeError("Argument has to be a string");
		}
	};

	this.addDocs = function addDocs( docs ) {
		if (Array.isArray(docs) === true && docs.every(function(doc){
			return typeof doc === "string";
		})){
			self.documents = self.documents.concat(docs);
		} else {
			throw new TypeError("Parameter expects an array of strings");
		}
	};

	// strips extra whitespace from docs
	this.clean = function clean() {
		self.documents = self.documents.map(function(doc){
			return _.clean(doc);
		});
		return self;
	};

	this.trim = function trim() {
		self.documents = this.documents.map(function(doc){
			return _.trim(doc);
		});
		return self;
	};

	this.inspect = function inspect( truncLength ) {
		if ( truncLength === undefined ){
			truncLength = 200;
		}
		truncLength = 200;
		self.documents.forEach( function( doc, index ) {
			console.log("Document " + index + ":");
			console.log( _(doc).truncate( truncLength ) );
			console.log("\u2500 \u2500 \u2500 \u2500 \u2500");
		});
	};

	this.toLower = function toLower() {
		self.documents = self.documents.map(function(doc){
			return doc.toLowerCase();
		});
		return self;
	};

	this.toUpper = function toUpper() {
		self.documents = self.documents.map(function(doc){
			return doc.toUpperCase();
		});
		return self;
	};

	this.stem = function stem( type ) {
		self.documents = self.documents.map(function(doc){
			if( type === "Lancaster" ) {
				return natural.LancasterStemmer.stem(doc);
			} else {
				return natural.PorterStemmer.stem(doc);
			}
		});
		return self;
	};

	this.map = function map( FUN ) {
		self.documents = this.documents.map(FUN);
		return self;
	};

	this.removeWords = function removeWords( words, case_insensitive ) {
		for ( var doc = 0; doc < self.documents.length; doc++ ) {
			for ( var i = 0; i < words.length; i++ ) {
				var options = case_insensitive ? "gi" : "g";
				var myRegExp = new RegExp( "\\b" + words[i] + "\\b", options );
				self.documents[doc] = self.documents[doc].replace( myRegExp,"" );
			}
		}
		// Clean the newly created extra whitespace...
		self.clean();
		return self;
	};

	this.removeInterpunctuation = function removeInterpunctuation() {
		self.documents = self.documents.map(function(doc){
			return doc.replace(/[\!\?\.,;-]/g, " ");
		});
		return self;
	};

	this.removeNewlines = function removeNewlines() {
		self.documents = self.documents.map(function(doc){
			return doc.replace(/\r?\n|\r/g, " ");
		});
		return self;
	};

	this.removeDigits = function removeDigits() {
		self.documents = self.documents.map(function(doc){
			return doc.replace(/\d/g,"");
		});
		return self;
	};

	this.removeInvalidCharacters = function removeInvalidCharacters() {
		self.documents = self.documents.map(function(doc){
			return doc.replace(/\uFFFD/g, '');
		});
		return self;
	};

} // end FUNCTION Corpus()


// EXPORTS //

module.exports = Corpus;
