var _  = require('underscore');

// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

// All functions, include conflict, will be available through _.str object
_.str.include('Underscore.string', 'string'); // => true

var natural = require('natural');

var Corpus = function(docs){

	// if nothing passed, treat docs as empty array
	docs = docs || [];

	if (!(this instanceof Corpus)){
		return new Corpus(docs);
	}

	var self = this;

	if (typeof docs === "string"){
		docs = Array(docs);
		this.documents = docs;
	} else if (Array.isArray(docs) === true && docs.every(function(doc){
		return typeof doc === "string";})){
		this.documents = docs;
	} else {
		throw new TypeError("Constructor expects Array of documents");
	}

	// adds new document to Corpus
	this.addDoc = function(doc){
		if (typeof doc === "string"){
			self.documents.push(doc);
		}
		else throw new TypeError("Argument has to be a string");
	};

	this.addDocs = function(docs){
		if (Array.isArray(docs) === true && docs.every(function(doc){
			return typeof doc === "string";
		})){
			self.documents = self.documents.concat(docs);
		} else {
			throw new TypeError("Parameter expects an array of strings");
		}
	};

	// strips extra whitespace from docs
	this.clean = function(){
		self.documents = self.documents.map(function(doc){
			return _.clean(doc);
		});
		return self;
	};

	this.trim = function(){
		self.documents = this.documents.map(function(doc){
			return _.trim(doc);
		});
		return self;
	};

	this.inspect = function(truncLength){
		if (truncLength === undefined) truncLength = 200;
		self.documents.forEach(function(doc, index){
		 console.log("Document " + index + ":");
		 console.log( _(doc).truncate(truncLength));
		 console.log("\u2500 \u2500 \u2500 \u2500 \u2500");
		});
	};

	this.toLower = function(){
		self.documents = self.documents.map(function(doc){
			return doc.toLowerCase();
		});
		return self;
	};

	this.toUpper = function(){
		self.documents = self.documents.map(function(doc){
			return doc.toUpperCase();
		});
		return self;
	};

	this.stem = function(type){
		self.documents = self.documents.map(function(doc){
			if (type == "Lancaster")
				return natural.LancasterStemmer.stem(doc);
			else
				return natural.PorterStemmer.stem(doc);
		});
		return self;
	};

	this.map = function(FUN){
		self.documents = _corpus.documents.map(FUN);
		return self;
	};

	this.removeWords = function(words, case_sensitive){
		for (var doc = 0; doc < self.documents.length; doc++)
			for (var i = 0; i < words.length; i++)
				{
				var options = case_sensitive ? "g" : "gi";
				var myRegExp = new RegExp("\\b" + words[i] + "\\b", options);
				self.documents[doc] = self.documents[doc].replace(myRegExp,"");
				}
		return self;
		};

	this.removeInterpunctuation = function(){
		self.documents = self.documents.map(function(doc){
			return doc.replace(/[\!\?\.,;-]/g, " ");
		});
		return self;
	};

	this.removeNewlines = function(){
		self.documents = self.documents.map(function(doc){
			return doc.replace(/\r?\n|\r/g, " ");
		});
		return self;
	};

	this.removeDuplicateWords = function(){

		return self;
	};

	this.removeDigits = function(){
		self.documents = self.documents.map(function(doc){
			return doc.replace(/\d/g,"");
		});
		return self;
	};

};

exports.Corpus = Corpus;
