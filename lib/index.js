'use strict';

// MODULES //

var setReadOnly = require( 'utils-define-read-only-property' );


// NAMESPACE //

var ns = {};


// CLASSES //

setReadOnly( ns, 'Corpus', require( './corpus.js' ) );
setReadOnly( ns, 'Document', require( './document.js' ) );
setReadOnly( ns, 'Terms', require( './dtm.js' ) );


// FUNCTIONS //

setReadOnly( ns, 'weightTfIdf', require( './weightTfIdf.js' ) );
setReadOnly( ns, 'expandContractions', require( './expandContractions.js' ) );


// DATA //

setReadOnly( ns, 'CONTRACTIONS', require( './../data/contractions.json' ) );
setReadOnly( ns, 'STOPWORDS', require( './../data/stopwords.json' ) );


// EXPORTS //

module.exports = ns;
