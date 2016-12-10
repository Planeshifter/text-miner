'use strict';

// MODULES //

var setReadOnly = require( 'utils-define-read-only-property' );


// NAMESPACE //

var ns = {};


// CLASSES //

setReadOnly( ns, 'Corpus', require( './corpus.js' ) );
setReadOnly( ns, 'Document', require( './document.js' ) );
setReadOnly( ns, 'DocumentTermMatrix', require( './dtm.js' ) );
setReadOnly( ns, 'TermDocumentMatrix', require( './tdm.js' ) );


// FUNCTIONS //

setReadOnly( ns, 'weightTfIdf', require( './weight_tf_idf.js' ) );
setReadOnly( ns, 'expandContractions', require( './expand_contractions.js' ) );


// DATA //

setReadOnly( ns, 'CONTRACTIONS', require( './../data/contractions.json' ) );
setReadOnly( ns, 'STOPWORDS', require( './../data/stopwords.json' ) );


// EXPORTS //

module.exports = ns;
