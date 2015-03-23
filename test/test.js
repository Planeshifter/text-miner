'use strict';

var tm = require("../src/text-miner.js");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
chai.use(chaiAsPromised);

describe("Corpus", function tests() {

    it("is a constructor function", function test() {

        expect(tm.Corpus).to.be.a("function");

    });

    it("can be created with single string", function test() {

        var my_corpus = new tm.Corpus("I am a document");
        expect(my_corpus).to.have.property("documents");
        expect(my_corpus).to.be.an.instanceof(tm.Corpus);

    });

    it("can be invoked without new", function test() {

        var my_corpus = tm.Corpus("I am a document");
        expect(my_corpus).to.have.property("documents");
        expect(my_corpus).to.be.an.instanceof(tm.Corpus);

    });

    it("can be created with an array of strings", function test() {

        var my_corpus = new tm.Corpus(["I am a document","I am a second document"]);
        expect(my_corpus).to.have.property("documents");
        expect(my_corpus).to.be.an.instanceof(tm.Corpus);

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


    describe("Corpus:addDocs()", function tests() {

        it("allows a single document to be added", function test() {

            var my_corpus = new tm.Corpus();
            my_corpus.addDoc("Insert a document");
            expect(my_corpus.documents).to.have.length(1);

        });

        it( 'should throw an error if not provided a string', function test() {
            var my_corpus = new tm.Corpus();
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

            for ( var i = 0; i < values.length; i++ ) {
                expect( badValue( values[i] ) ).to.throw( Error );
            }
            function badValue( value ) {
                return function() {
                    my_corpus.addDoc( value );
                };
            }
        });

    });

    describe("Corpus:addDocs()", function tests() {

        it("allows multiple documents to be added", function test() {
            var my_corpus = new tm.Corpus();
            my_corpus.addDocs(["Insert a document","And another one"]);
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
                ["a", 3, 2],
                [NaN, "c", 0],
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

    describe("Corpus:clean()", function tests() {

        it("correctly cleans documents", function test() {
            var my_corpus = new tm.Corpus(["I am a  document  with whitespaces"]);
            expect(my_corpus.clean().documents[0]).to.be.equal("I am a document with whitespaces");
        });

    });

    describe("Corpus:trim()", function tests() {

        it("correctly trims documents", function test() {
            var my_corpus = new tm.Corpus([" I am a  document which needs trimming "]);
            expect(my_corpus.trim().documents[0]).to.be.equal("I am a  document which needs trimming");
        });

    });

    describe("Corpus:inspect()", function tests() {

        it("logs documents to console", function test() {
            var my_corpus = new tm.Corpus([" I am a  document which wants to be logged "]);
            my_corpus.inspect();
        });

    });

    describe("Corpus:map()", function tests() {

        it("allows a function to be applied to all docs", function test() {
            var my_corpus = new tm.Corpus(["UPPERCASE"]);
            expect(my_corpus.map(function(x){ return x.toLowerCase(); }).documents[0]).to.be.equal("uppercase");
        });

    });

    var case_corpus = new tm.Corpus( ["I am doc 1","I am doc 2"] );
    describe("Corpus:toUpper()", function tests() {

        it("converts all docs to upper case", function test() {
            expect(case_corpus.toUpper().documents).to.include("I AM DOC 1");
            expect(case_corpus.toUpper().documents).to.include("I AM DOC 2");
        });

    });

    describe("Corpus:toLower()", function tests() {

        it("converts all docs to lower case", function test() {
            expect(case_corpus.toLower().documents).to.include("i am doc 1");
            expect(case_corpus.toLower().documents).to.include("i am doc 2");
        });

    });

    describe("Corpus:stem()", function tests() {

        var corpus = new tm.Corpus(["reigning"]);

        it("stems with Porter stemmer by default", function test() {
            expect(corpus.stem().documents).to.include("reign");
        });

        it("can also stem with Lancaster algorithm", function test() {
            expect(corpus.stem("Lancaster").documents).to.include("reign");
        });

    });

    describe("Corpus:removeInterpunctuation()",function tests() {

        var corpus = new tm.Corpus(["I am doc 1!", "Am I a doc? Yes!"]);

        it("removes all ", function test() {
            expect(corpus.removeInterpunctuation().documents).to.include("I am doc 1 ");
            expect(corpus.removeInterpunctuation().documents).to.include("Am I a doc  Yes ");
        });

    });

    describe("Corpus:removeNewlines()",function tests() {

        it("removes all new lines", function test() {
            var corpus = new tm.Corpus(["I am doc \n with a new line", "I am a doc without a new line"]);
            expect(corpus.removeNewlines().documents).to.include("I am doc   with a new line");
            expect(corpus.removeNewlines().documents).to.include("I am a doc without a new line");
        });

    });

    describe("Corpus:removeDigits()",function tests() {

        it("removes all digits", function test() {
            var corpus = new tm.Corpus(["I am doc 1", "I am doc 12, ahh, 2"]);
            expect(corpus.removeDigits().documents).to.include("I am doc ");
            expect(corpus.removeDigits().documents).to.include("I am doc , ahh, ");
        });

    });

    describe("Corpus:removeWords()", function tests() {

        it("removes the supplied words (npt case-sensitive)", function test() {
            var corpus = new tm.Corpus(["The king is dead"]);
            expect(corpus.removeWords( ["King"], true ).documents).to.include("The  is dead");
        });

        it("removes the supplied words (case-sensitive)", function test() {
            var corpus = new tm.Corpus(["The king is dead"]);
            expect(corpus.removeWords( ["King"], false ).documents).to.include("The king is dead");
        });

    });

    describe("Corpus:removeInvalidCharacters()", function tests() {

        it("removes non-Unicode characters", function test(){
            var corpus = new tm.Corpus(["� � �"]);
            expect(corpus.removeInvalidCharacters().documents).to.include("  ");
        });

    });

});

describe("Document-Term-Matrix",function tests() {

    var my_corpus = new tm.Corpus(["I am a document","I am a second document"]);

    it("can be created from corpus", function test() {

        var dtm = new tm.Terms(my_corpus);
        expect(dtm).to.be.instanceof(tm.Terms);
        expect(dtm).to.have.property("nDocs");
        expect(dtm).to.have.property("nTerms");

    });

    it("can be invoked without new", function test() {

        var dtm = tm.Terms(my_corpus);
        expect(dtm).to.be.instanceof(tm.Terms);
        expect(dtm).to.have.property("nDocs");
        expect(dtm).to.have.property("nTerms");

    });

    describe("fill_zeros()", function(){

        var dtm = new tm.Terms(my_corpus);

        it("all non-assigned elements are set to zero", function(){

            expect(dtm.fill_zeros()).to.be.instanceof(tm.Terms);
            var check_zeros = function(dtm){
                for (var doc = 0; doc < dtm.length; doc++){
                    for (var word = 0; word < dtm[0].length; word++){
                        if ( dtm[doc][word] === undefined ) {
                            return false;
                        }
                    }
                }
                return true;
            };

            expect( check_zeros(dtm.dtm) ).to.be.ok;

        });
    });

    describe("findFreqTerms()", function tests() {

        var dtm = new tm.Terms(my_corpus);
        var sortedWordArray = dtm.findFreqTerms(2);

        it("returns array", function test() {
            expect(sortedWordArray).to.be.instanceof(Array);
        });

        it("contains objects like {word: 'and', count: 3}", function test() {
            sortedWordArray.forEach( function(w){
                expect(w).to.have.property("word");
                expect(w).to.have.property("count");
            });
        });

        it("is sorted in decreasing order", function test() {
            sortedWordArray .reduce(function(a,b){
                expect(a.count).to.be.at.least(b.count);
                return b;
            });
        });

        it("contains only words with counts larger than n", function test() {
            sortedWordArray.forEach(function(w){
                expect(w.count).to.be.above(1);
            });
        });
    });

    describe("removeSparseTerms()", function tests() {

        var my_corpus = new tm.Corpus(["I am a document","I am a second document","third document"]);
        var dtm = new tm.Terms(my_corpus);
        dtm.removeSparseTerms(0.5);

        it("should remove sparse terms from vocabulary", function test() {
            expect(dtm.vocabulary).to.have.members(["I","am","a","document"]);
            expect(dtm.vocabulary).to.not.have.members(["second","third"]);
        });

        it("should remove respective entries from document-term matrix", function test() {
            expect(dtm.dtm.length).to.be.equal(3); // number of docs
            expect(dtm.dtm[0].length).to.be.equal(4); // number of words in vocabulary
        });

    });

    describe("weighting()", function tests() {

        var my_corpus = new tm.Corpus(["I am a document","I am a second document","third document"]);
        var terms = new tm.Terms(my_corpus);

        it( "weights dtm according to supplied weighting function", function test() {
            var actual = terms.weighting(tm.weightTfIdf).dtm;
            var expected = tm.weightTfIdf(terms.dtm);
            expect(actual).to.be.equal(expected);
        });

    });

});

describe("weightTfIdf function", function tests() {

    it( "exports a function", function test() {
        expect(tm.weightTfIdf).to.be.a("function");
    });

    it( "can weigh dtm according to tf-idf scheme", function test() {
        var my_corpus = new tm.Corpus(["I am a document","I am a second document","third document"]);
        var terms = new tm.Terms(my_corpus);
        var result = tm.weightTfIdf(terms.dtm);
        expect(result).to.be.an("Array");
        expect(result[0].length).to.be.equal(6); // number of words in vocabulary
    });

});

describe("utility functions in util", function tests() {

    describe("expandContractions(str)", function tests() {
        it("should expand all contracted words in string str", function test() {
            var expandedPhrase = tm.utils.expandContractions("I don't believe in miracles");
            expect(expandedPhrase).to.be.equal("I do not believe in miracles");
        });

        it("can handle case in which no contractions appear", function test() {
            var expandedPhrase = tm.utils.expandContractions("Today is a good day, yeah!");
            expect(expandedPhrase).to.be.equal("Today is a good day, yeah!");
        });

    });

});
