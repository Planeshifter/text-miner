'use strict';

// MODULES //

var tape = require( 'tape' );
var weightTfIdf = require( './../lib/weight_tf_idf.js' );


// TESTS //

tape( 'main export is a function', function test( t ) {
	t.ok( true, __filename );
	t.equal( typeof weightTfIdf, 'function', 'main export is a function' );
	t.end();
});

tape( 'weighs a document-term-matrix according to tf-idf scheme', function test( t ) {
	var data = [
		[ 16, 4, 1 ],
		[ 0, 0, 16 ],
		[ 0, 16, 0 ],
		[ 4, 0, 0 ],
		[ 2, 0, 1 ]
	];
	var expected = [
		[ 3.5702968210273553, 2.043302495063963, 0.2231435513142097 ],
		[ 0, 0, 3.5702968210273553 ],
		[ 0, 8.173209980255852, 0 ],
		[ 0.8925742052568388, 0, 0 ],
		[ 0.4462871026284194, 0, 0.2231435513142097 ]
	];
	var actual = weightTfIdf( data );

	t.equal( JSON.stringify( actual ), JSON.stringify( expected ), 'correctly weighs cells using tf-idf scheme' );
	t.end();
});
