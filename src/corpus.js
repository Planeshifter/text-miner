var _  = require('underscore');

// Import Underscore.string to separate object, because there are conflict functions (include, reverse, contains)
_.str = require('underscore.string');

// Mix in non-conflict functions to Underscore namespace if you want
_.mixin(_.str.exports());

// All functions, include conflict, will be available through _.str object
_.str.include('Underscore.string', 'string'); // => true

var natural = require('natural');

var Corpus = function(docs){
	
	_corpus = {};
	
	_corpus.documents = docs;
	
	_corpus.clean = function(){
		_corpus.documents = _corpus.documents.map(function(doc){
			return _.clean(doc);
		});
		return _corpus;
	};
	
	_corpus.trim = function(){
		_corpus.documents = _corpus.documents.map(function(doc){
			return _.trim(doc);
		});
		return _corpus;
	};
	
	_corpus.inspect = function(truncLength){
		if (truncLength === undefined) truncLength = 200;
		_corpus.documents.forEach(function(doc, index){
		 console.log("Document " + index + ":");
		 console.log( _(doc).truncate(truncLength));
		 console.log("\u2500 \u2500 \u2500 \u2500 \u2500");
		});
	};
	
	_corpus.toLower = function(){
		_corpus.documents = _corpus.documents.map(function(doc){
			return doc.toLowerCase();
		});
		return _corpus;
	};
	
		_corpus.toUpper = function(){
		_corpus.documents = _corpus.documents.map(function(doc){
			return doc.toUpperCase();
		});
		return _corpus;
	};
	
	_corpus.stem = function(type){
		_corpus.documents = _corpus.documents.map(function(doc){
			if (type == "Lancaster")
				return natural.LancasterStemmer.stem(doc);
			else 
				return natural.PorterStemmer.stem(doc);
		});
		return _corpus;
	};
			
	_corpus.map = function(FUN){
		_corpus.documents = _corpus.documents.map(FUN);
		return _corpus;
	};
			
	return  _corpus;
};


module.exports = Corpus;
