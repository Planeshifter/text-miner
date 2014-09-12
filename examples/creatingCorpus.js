var util = require('util');
var tm = require("../build/text-miner.js");

var corpus = new tm.Corpus(["Hello  Mr DJ"," I am the king of the World!!! In these times, one can only hope for redemption"]);

var wordArr = corpus.clean().trim().toLower().removeWords(tm.STOPWORDS.EN).documents.map(function(x){
	return x.split(" ");
});

console.log(wordArr)
