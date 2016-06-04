'use strict';

var tm = require( '../lib/index.js' );

var corpus = new tm.Corpus( [
	"Hello  Mr DJ",
	" I am the king of the World!!!",
	"In these times, one can only hope for redemption"
] );

var filteredCorpus = corpus.clean()
	.trim()
	.toLower()
	.removeWords( tm.STOPWORDS.EN )
	.clean()
	.filter( function( txt, attr, index ) {
		if ( index <= 1 ) {
			return true;
		} else {
			return false;
		}
	});

console.log( filteredCorpus + '' );

var dtm = new tm.Terms( corpus );

console.log( dtm );
