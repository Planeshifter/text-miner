'use strict';

// MODULES //

var tape = require( 'tape' );
var tm = require( './../lib' );


// TESTS //

tape( 'main export is an object', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof tm, 'object', 'main export is an object' );
	t.end();
});

tape( 'exported `Document` property is a function', function test( t ) {
	t.equal( typeof tm.Document, 'function', 'property is a function' );
	t.end();
});

tape( 'exported `Corpus` property is a function', function test( t ) {
	t.equal( typeof tm.Corpus, 'function', 'property is a function' );
	t.end();
});

tape( 'exported `DocumentTermMatrix` property is a function', function test( t ) {
	t.equal( typeof tm.DocumentTermMatrix, 'function', 'property is a function' );
	t.end();
});

tape( 'exported `weightTfIdf` property is a function', function test( t ) {
	t.equal( typeof tm.weightTfIdf, 'function', 'property is a function' );
	t.end();
});

tape( 'exported `expandContractions` property is a function', function test( t ) {
	t.equal( typeof tm.expandContractions, 'function', 'property is a function' );
	t.end();
});

tape( 'exported `CONTRACTIONS` property is an object', function test( t ) {
	t.equal( typeof tm.CONTRACTIONS, 'object', 'property is an object' );
	t.end();
});

tape( 'exported `STOPWORDS` property is an object', function test( t ) {
	t.equal( typeof tm.STOPWORDS, 'object', 'property is an object' );
	t.end();
});
