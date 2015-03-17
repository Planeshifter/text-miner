'use strict';

var _ = require('underscore');

var Terms = function(corpus){

	if( !(this instanceof Terms) ){
		return new Terms(corpus);
	}

	var self = this;

	this.vocabulary = [];
	this.dtm = [];

	Object.defineProperty(this,"nDocs",{
		get: function() {
			return this.dtm.length;
		},
		enumerable: true
	});

	Object.defineProperty(this, "nTerms",{
		get: function() {
			return this.vocabulary.length;
		},
		enumerable: true
	});

	this.fill_zeros = function(){
		for (var doc = 0; doc < self.dtm.length; doc++){
			for (var word = 0; word < self.dtm[0].length; word++){
				if (self.dtm[doc][word] === undefined) {
					self.dtm[doc][word] = 0;
				}
			}
		}
		return self;
	};

	var _processDoc = function(doc){

		var wordArray = doc.split(" ");
		var words = [];

		for (var i = 0; i < wordArray.length; i++){

			var current_word = wordArray[i];
			var index = self.vocabulary.indexOf(current_word);

			if (index > -1){
					words[index] = words[index] + 1 || 1;
				}
				else{
					words[self.vocabulary.length] = 1;
					self.vocabulary.push(current_word);
				}
			}
		self.dtm.push(words);
	};

	var _wordFreq = function(wordIndex){
		var mapping = self.dtm.map(function(doc){
			return doc[wordIndex] || 0;
		});
		var reducing = mapping.reduce(function(a,b){
			return a + b;
		});
		return reducing;
	};

	this.findFreqTerms = function(n){
		var wordArray = [];
		for (var w = 0; w < self.vocabulary.length; w++){
			var wordCount = _wordFreq(w);
			var obj = {};
			obj.word = self.vocabulary[w];
			obj.count = wordCount;
			if ( wordCount >= n ) {
				wordArray.push(obj);
			}
		}

		var sortedWordArray = _.sortBy(wordArray, function(obj){
			return obj.word;
		});
		return sortedWordArray;
	};

	this.removeSparseTerms = function(percent){

		var flaggedForRemoval = [];
		for (var w = 0; w < self.vocabulary.length; w++){
			var counter = 0;
			for (var d = 0; d < self.dtm.length; d++){
				var doc = self.dtm[d];
				if (doc !== undefined && doc[w] !== undefined){
					counter++;
				}
			}
			if (counter / self.dtm.length < percent){
				flaggedForRemoval.push(w);
			}
		}

		for (var i = flaggedForRemoval.length - 1 ; i >= 0; i--){
			var word_to_be_removed = flaggedForRemoval[i];
			self.vocabulary.splice(word_to_be_removed, 1);
			for (var d2 = 0; d2 < self.dtm.length; d2++){
				self.dtm[d2].splice(word_to_be_removed, 1);
			}
		}
		return self;
	};

	this.weighting = function(fun){
		self.dtm = fun(self.dtm);
		return self;
	};

	// initialization
	(function(){
		var documents = corpus.documents;
		documents.forEach(_processDoc);
		self.dtm.forEach(function(doc){
			doc.length = self.vocabulary.length; // ensure that all rows in dtm have same length
		});
	})();

};

function weightTfIdf(dtm){

	var word_doc_freq = [];

	for (var w = 0; w < dtm[0].length; w++){
		var count = 0;
		for (var d = 0; d < dtm.length; d++){
			if (dtm[d][w] !== undefined) {
				count++;
			}
		}
		word_doc_freq.push(count);
	}

	for (var doc = 0; doc < dtm.length; doc++) {
		for (var word = 0; word < dtm[0].length; word++){
			var idf = Math.log(dtm.length) - Math.log(1 + word_doc_freq[word]);

			if (dtm[doc][word] !== undefined) {
				dtm[doc][word] = dtm[doc][word] * idf;
			}
		}
	}

	return dtm;
}

module.exports = {
	'Terms': Terms,
	'weightTfIdf': weightTfIdf
};
