'use strict';

var tm = require( '../build/text-miner.js' );

var corpus = new tm.Corpus(["Hello  Mr DJ"," I am the king of the World!!! In these times, one can only hope for redemption"]);

var wordArr = corpus.clean().trim().toLower().removeWords(tm.STOPWORDS.EN).clean().documents.map(function(x){
	return x;
});

console.log(wordArr);

var dtm = new tm.Terms(corpus);

console.log(dtm);
