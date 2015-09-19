'use strict';

var tm = require( '../src/text-miner.js' );

var corpus = new tm.Corpus([]);

corpus.addDoc( 'wat you cash money go to boots and cats and dogs with me' );
corpus.removeWords( tm.STOPWORDS.EN) ;

var terms = new tm.Terms(corpus);

console.log( terms );
