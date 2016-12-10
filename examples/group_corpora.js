'use strict';

var tm = require( '../lib/index.js' );

var corpus = new tm.Corpus( [
	'Only the dead have seen the end of war',
	'True knowledge exists in knowing that you know nothing.',
	'You can discover more about a person in an hour of play than in a year of conversation.',
	'He who is not contented with what he has, would not be contented with what he would like to have.'
] );

corpus.setAttributes([
	{ 'author': 'Plato' },
	{ 'author': 'Socrates' },
	{ 'author': 'Plato' },
	{ 'author': 'Socrates' },
]);

var authorCorpora = corpus.groupBy( function group( text, attr ) {
	return attr.author;
});

console.log( 'Socrates: ' );
console.log( authorCorpora[ 'Socrates' ] );

console.log( 'Plato: ' );
console.log( authorCorpora[ 'Plato' ] );
