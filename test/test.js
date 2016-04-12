'use strict';

// MODULES //

var tm = require( '../lib/index.js' );
var chai = require( 'chai' );
var chaiAsPromised = require( 'chai-as-promised' );
var expect = chai.expect;
chai.use( chaiAsPromised );


// TESTS //

describe( 'Corpus', function tests() {

    it( 'is a constructor function', function test() {
        expect(tm.Corpus).to.be.a( 'function' );
    });

    it( 'can be created with single string', function test() {
        var my_corpus = new tm.Corpus( 'I am a document' );
        expect( my_corpus ).to.have.property( 'documents' );
        expect( my_corpus ).to.be.an.instanceof( tm.Corpus );
    });

    it( 'can be invoked without new', function test() {
        var my_corpus = tm.Corpus('I am a document');
        expect(my_corpus).to.have.property('documents');
        expect(my_corpus).to.be.an.instanceof(tm.Corpus);
    });

    it( 'can be created with an array of strings', function test() {
        var my_corpus = new tm.Corpus([
            'I am a document',
            'I am a second document'
        ]);
        expect(my_corpus).to.have.property( 'documents' );
        expect(my_corpus).to.be.an.instanceof( tm.Corpus );
    });

    it( 'should throw an error if constructor is provided a non-array', function test() {
        var values = [
            5,
            true,
            null,
            NaN,
            function(){},
            {}
        ];
        for ( var i = 0; i < values.length; i++ ) {
            expect( badValue( values[i] ) ).to.throw( TypeError );
        }
        function badValue( value ) {
            return function() {
                tm.Corpus( value );
            };
        }
    });

    describe( '.addDoc()', function tests() {

        it( 'allows a single document to be added', function test() {
            var my_corpus = new tm.Corpus();
            my_corpus.addDoc( 'Insert a document' );
            expect( my_corpus.documents ).to.have.length( 1 );
        });

        it( 'should throw an error if not provided a string', function test() {
            var my_corpus = new tm.Corpus();
            var i;
            var values = [
                5,
                null,
                undefined,
                NaN,
                true,
                [],
                {},
                function(){}
            ];

            for ( i = 0; i < values.length; i++ ) {
                expect( badValue( values[i] ) ).to.throw( Error );
            }
            function badValue( value ) {
                return function() {
                    my_corpus.addDoc( value );
                };
            }
        });

    });

    describe( '.addDocs()', function tests() {

        it( 'allows multiple documents to be added', function test() {
            var my_corpus = new tm.Corpus();
            my_corpus.addDocs([
                'Insert a document',
                'And another one'
            ]);
            expect(my_corpus.documents).to.have.length(2);
        });

        it( 'should throw an error if addDocs is provided a non-array', function test() {
            var my_corpus = new tm.Corpus();
            var values = [
                '5',
                5,
                true,
                undefined,
                null,
                NaN,
                function(){},
                {}
            ];
            for ( var i = 0; i < values.length; i++ ) {
                expect( badValue( values[i] ) ).to.throw( TypeError );
            }
            function badValue( value ) {
                return function() {
                    my_corpus.addDocs( value );
                };
            }
        });

        it( 'should throw an error if addDocs is provided an array not only consisting of Strings', function test() {
            var my_corpus = new tm.Corpus();
            var values = [
                ['a', 3, 2],
                [NaN, 'c', 0],
                [null, null, null]
            ];
            for ( var i = 0; i < values.length; i++ ) {
                expect( badValue( values[i] ) ).to.throw( TypeError );
            }
            function badValue( value ) {
                return function() {
                    my_corpus.addDocs( value );
                };
            }
        });

    });

    describe( '.clean()', function tests() {

        it( 'correctly cleans documents', function test() {
            var my_corpus = new tm.Corpus([
                'I am a  document  with whitespaces'
            ]);
            var out = my_corpus.clean();
            expect( out.documents[0].text ).to.be.equal( 'I am a document with whitespaces' );
        });

    });

    describe( '.trim()', function tests() {

        it( 'correctly trims documents', function test() {
            var my_corpus = new tm.Corpus([
                ' I am a  document which needs trimming '
            ]);
            var out = my_corpus.trim();
            expect( out.documents[0].text ).to.be.equal( 'I am a  document which needs trimming' );
        });

    });

    describe( '.map()', function tests() {

        it( 'allows a function to be applied to all docs', function test() {
            var my_corpus = new tm.Corpus([
                'UPPERCASE'
            ]);
            expect( my_corpus.map( function( str ) {
                return str.toLowerCase();
            }).documents[ 0 ].text ).to.be.equal( 'uppercase' );
        });

    });

    var case_corpus = new tm.Corpus([
        'I am doc 1',
        'I am doc 2'
    ]);

    describe( '.toUpper()', function tests() {

        it( 'converts all docs to upper case', function test() {
            var out = case_corpus.toUpper();
            expect( out.documents[0].text ).to.be.equal( 'I AM DOC 1' );
            expect( out.documents[1].text  ).to.be.equal( 'I AM DOC 2' );
        });

    });

    describe( '.toLower()', function tests() {

        it( 'converts all docs to lower case', function test() {
            var out = case_corpus.toLower();
            expect( out.documents[0].text ).to.be.equal( 'i am doc 1' );
            expect( out.documents[1].text ).to.be.equal( 'i am doc 2' );
        });

    });

    describe( '.stem()', function tests() {

        var corpus = new tm.Corpus([
            'reigning'
        ]);

        it( 'stems with Porter stemmer by default', function test() {
            var out = corpus.stem();
            expect( out.documents[0].text ).to.be.equal( 'reign' );
        });

        it( 'can also stem with Lancaster algorithm', function test() {
            var out = corpus.stem( 'Lancaster' );
            expect( out.documents[0].text ).to.include( 'reign' );
        });

    });

    describe( '.removeInterpunctuation()',function tests() {

        var corpus = new tm.Corpus([
            'I am doc 1!',
            'Am I a doc? Yes!'
        ]);

        it( 'removes all interpunctuation', function test() {
            var out = corpus.removeInterpunctuation();
            expect( out.documents[0].text ).to.be.equal( 'I am doc 1 ' );
            expect(  out.documents[1].text ).to.be.equal( 'Am I a doc  Yes ' );
        });

    });

    describe( '.removeNewlines()',function tests() {

        it( 'removes all new lines', function test() {
            var corpus = new tm.Corpus([
                'I am doc \n with a new line',
                'I am a doc without a new line'
            ]);
            var out = corpus.removeNewlines();
            expect( out.documents[0].text ).to.be.equal( 'I am doc   with a new line' );
            expect( out.documents[1].text ).to.be.equal( 'I am a doc without a new line' );
        });

    });

    describe( '.removeDigits()',function tests() {

        it( 'removes all digits' , function test() {
            var corpus = new tm.Corpus([
                'I am doc 1',
                'I am doc 12, ahh, 2'
            ]);
            var out = corpus.removeDigits();
            expect( out.documents[0].text ).to.be.equal( 'I am doc ' );
            expect( out.documents[1].text ).to.be.equal( 'I am doc , ahh, ' );
        });

    });

    describe( '.removeWords()', function tests() {

        it( 'removes the supplied words (not case-sensitive)', function test() {
            var corpus = new tm.Corpus([
                'The king is dead'
            ]);
            var out = corpus.removeWords( [ 'King' ], true );
            expect( out.documents[0].text).to.be.equal( 'The is dead' );
        });

        it( 'removes the supplied words (case-sensitive)', function test() {
            var corpus = new tm.Corpus([
                'The king is dead'
            ]);
            var out = corpus.removeWords( [ 'King' ], false );
            expect( out.documents[0].text ).to.be.equal( 'The king is dead' );
        });

    });

    describe( '.removeInvalidCharacters()', function tests() {

        it( 'removes non-Unicode characters', function test(){
            /* jshint -W100 */
            var corpus = new tm.Corpus(['� � �']);
            var out = corpus.removeInvalidCharacters();
            expect( out.documents[0].text ).to.be.equal('  ');
        });

    });

});

describe( 'DocumentTermMatrix', function tests() {

    var my_corpus = new tm.Corpus([
        'I am a document',
        'I am a second document'
    ]);

    it( 'can be created from corpus', function test() {
        var dtm = new tm.DocumentTermMatrix( my_corpus );
        expect(dtm).to.be.instanceof( tm.DocumentTermMatrix );
        expect(dtm).to.have.property( 'nDocs' );
        expect(dtm).to.have.property( 'nTerms' );
    });

    it( 'can be invoked without new', function test() {
        var dtm = tm.DocumentTermMatrix( my_corpus );
        expect( dtm ).to.be.instanceof( tm.DocumentTermMatrix );
        expect( dtm ).to.have.property( 'nDocs' );
        expect( dtm ).to.have.property( 'nTerms' );
    });

    describe( '.fill_zeros()', function tests() {
        var dtm = new tm.DocumentTermMatrix(my_corpus);

        it( 'all non-assigned elements are set to zero', function test() {
            var doc;
            var word;
            expect( dtm.fill_zeros() ).to.be.instanceof( tm.DocumentTermMatrix );
            var check_zeros = function( dtm ){
                for ( doc = 0; doc < dtm.length; doc++ ) {
                    for ( word = 0; word < dtm[0].length; word++ ) {
                        if ( dtm[doc][word] === undefined ) {
                            return false;
                        }
                    }
                }
                return true;
            };
            expect( check_zeros(dtm.data) ).to.be.ok;
        });
    });

    describe( '.findFreqTerms( n )', function tests() {

        var dtm = new tm.DocumentTermMatrix( my_corpus );
        var sortedWordArray = dtm.findFreqTerms( 2 );

        it( 'returns array', function test() {
            expect(sortedWordArray).to.be.instanceof(Array);
        });

        it( 'contains objects like {word: \'and\', count: 3}', function test() {
            sortedWordArray.forEach( function( w ) {
                expect( w ).to.have.property( 'word' );
                expect( w ).to.have.property( 'count' );
            });
        });

        it( 'is sorted in decreasing order', function test() {
            sortedWordArray.reduce( function( a, b ) {
                expect( a.count ).to.be.at.least( b.count );
                return b;
            });
        });

        it( 'contains only words with counts larger than n', function test() {
            sortedWordArray.forEach( function( w ) {
                expect( w.count ).to.be.above( 1 );
            });
        });
    });

    describe( '.removeSparseTerms()', function tests() {
        var my_corpus = new tm.Corpus([
            'I am a document',
            'I am a second document',
            'third document'
        ]);
        var dtm = new tm.DocumentTermMatrix(my_corpus);
        dtm.removeSparseTerms( 0.5 );

        it( 'should remove sparse terms from vocabulary', function test() {
            expect( dtm.vocabulary ).to.have.members(['I','am','a','document']);
            expect( dtm.vocabulary) .to.not.have.members(['second','third']);
        });

        it( 'should remove respective entries from document-term matrix', function test() {
            expect( dtm.data.length ).to.be.equal( 3 ); // number of docs
            expect( dtm.data[0].length ).to.be.equal( 4 ); // number of words in vocabulary
        });

    });

    describe( '.weighting()', function tests() {
        var my_corpus = new tm.Corpus([
            'I am a document',
            'I am a second document',
            'third document'
        ]);
        var terms = new tm.DocumentTermMatrix( my_corpus );

        it( 'weights dtm according to supplied weighting function', function test() {
            var actual = terms.weighting( tm.weightTfIdf ).data;
            var expected = tm.weightTfIdf( terms.data );
            expect( actual ).to.be.equal( expected );
        });

    });

});

describe( '.weightTfIdf( terms )', function tests() {

    it( 'weighs dtm according to tf-idf scheme', function test() {
        var my_corpus = new tm.Corpus([
            'I am a document',
            'I am a second document',
            'third document'
        ]);
        var terms = new tm.DocumentTermMatrix( my_corpus );
        var result = tm.weightTfIdf( terms.data );
        expect( result ).to.be.an( 'Array' );
        expect( result[0].length ).to.be.equal( 6 ); // number of words in vocabulary
    });

});

describe( '.expandContractions( str )', function tests() {

    it( 'should expand all contracted words in a string', function test() {
        var expandedPhrase = tm.expandContractions( 'I don\'t believe in miracles' );
        expect(expandedPhrase).to.be.equal( 'I do not believe in miracles' );
    });

    it( 'can handle case in which no contractions appear', function test() {
        var expandedPhrase = tm.expandContractions( 'Today is a good day, yeah!' );
        expect(expandedPhrase).to.be.equal( 'Today is a good day, yeah!' );
    });

});
