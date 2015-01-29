var tm = require("../build/text-miner.js");
var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");
var expect = chai.expect;
chai.use(chaiAsPromised);

describe("Corpus", function(){
  it("can be created with single string", function(){
    var my_corpus = new tm.Corpus("I am a document");
    expect(my_corpus).to.have.property("documents");
    expect(my_corpus).to.be.an.instanceof(tm.Corpus);
  });
  it("can be created with an array of strings", function(){
    var my_corpus = new tm.Corpus(["I am a document","I am a second document"]);
    expect(my_corpus).to.have.property("documents");
    expect(my_corpus).to.be.an.instanceof(tm.Corpus);
  });
  it("allows a document to be added via addDoc", function(){
    var my_corpus = new tm.Corpus();
    my_corpus.addDoc("Insert a document");
    expect(my_corpus.documents).to.have.length(1);
  });
  it("allows multiple documents to be added via addDocs", function(){
    var my_corpus = new tm.Corpus();
    my_corpus.addDocs(["Insert a document","And another one"]);
    expect(my_corpus.documents).to.have.length(2);
  });
  describe("Corpus:clean()", function(){
    it("correctly cleans documents", function(){
      var my_corpus = new tm.Corpus(["I am a  document  with whitespaces"]);
      expect(my_corpus.clean().documents[0]).to.be.equal("I am a document with whitespaces");
    });
  });
  describe("Corpus:trim()", function(){
    it("correctly trims documents",function(){
      var my_corpus = new tm.Corpus([" I am a  document which needs trimming "]);
      expect(my_corpus.trim().documents[0]).to.be.equal("I am a  document which needs trimming");
    });
  });
  var case_corpus = new tm.Corpus(["I am doc 1","I am doc 2"]);
  describe("Corpus:toUpper()",function(){
    it("converts all docs to upper case", function(){
      expect(case_corpus.toUpper().documents).to.include("I AM DOC 1");
      expect(case_corpus.toUpper().documents).to.include("I AM DOC 2");
    });
  });
  describe("Corpus:toLower()",function(){
    it("converts all docs to lower case", function(){
      expect(case_corpus.toLower().documents).to.include("i am doc 1");
      expect(case_corpus.toLower().documents).to.include("i am doc 2");
    });
  });
  describe("Corpus:removeInterpunctuation()",function(){
    var corpus = new tm.Corpus(["I am doc 1!", "Am I a doc? Yes!"]);
    it("removes all ", function(){
      expect(corpus.removeInterpunctuation().documents).to.include("I am doc 1 ");
      expect(corpus.removeInterpunctuation().documents).to.include("Am I a doc  Yes ");
    });
  });
  describe("Corpus:removeNewlines()",function(){
    it("removes all new lines", function(){
      var corpus = new tm.Corpus(["I am doc \n with a new line", "I am a doc without a new line"]);

      expect(corpus.removeNewlines().documents).to.include("I am doc   with a new line");
      expect(corpus.removeNewlines().documents).to.include("I am a doc without a new line");
    });
  });

  describe("Corpus:removeDigits()",function(){
    it("removes all digits", function(){
      var corpus = new tm.Corpus(["I am doc 1", "I am doc 12, ahh, 2"]);
      expect(corpus.removeDigits().documents).to.include("I am doc ");
      expect(corpus.removeDigits().documents).to.include("I am doc , ahh, ");
    });
  });

});

describe("Document-Term-Matrix",function(){
  var my_corpus = new tm.Corpus(["I am a document","I am a second document"]);
  it("can be created from corpus", function(){
    var dtm = new tm.Terms(my_corpus);
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
            if (dtm[doc][word] === undefined) return false;
          }
        }
        return true;
      };
      expect(check_zeros(dtm.dtm)).to.be.ok;
    });
  });

  describe("findFreqTerms()", function(){
    var dtm = new tm.Terms(my_corpus);
    var sortedWordArray = dtm.findFreqTerms(2);
    it("returns array", function(){
      expect(sortedWordArray).to.be.instanceof(Array);
    });
    it("contains objects like {word: 'and', count: 3}", function(){
      sortedWordArray.forEach(function(w){
        expect(w).to.have.property("word");
        expect(w).to.have.property("count");
      });
    });
    it("is sorted in decreasing order", function(){
      sortedWordArray .reduce(function(a,b){
        expect(a.count).to.be.at.least(b.count);
        return b;
      });
    });
    it("contains only words with counts larger than n", function(){
      sortedWordArray.forEach(function(w){
        expect(w.count).to.be.above(1);
      });
    });
  });

  describe("removeSparseTerms()", function(){
    var my_corpus = new tm.Corpus(["I am a document","I am a second document","third document"]);
    var dtm = new tm.Terms(my_corpus);
    dtm.removeSparseTerms(0.5);
    it("should remove sparse terms from vocabulary", function(){
      expect(dtm.vocabulary).to.have.members(["I","am","a","document"]);
      expect(dtm.vocabulary).to.not.have.members(["second","third"]);
    });
    it("should remove respective entries from document-term matrix", function(){
      console.log(dtm.dtm.length)
       expect(dtm.dtm.length).to.be.equal(3); // number of docs
       expect(dtm.dtm[0].length).to.be.equal(4); // number of words in vocabulary
    });
  });
});

describe("utility functions in util", function(){
  describe("expandContractions(str)", function(){
    it("should expand all contracted words in string str", function(){
      var expandedPhrase = tm.utils.expandContractions("I don't believe in miracles");
      expect(expandedPhrase).to.be.equal("I do not believe in miracles");
    });
    it("can handle case in which no contractions appear", function(){
      var expandedPhrase = tm.utils.expandContractions("Today is a good day, yeah!");
      expect(expandedPhrase).to.be.equal("Today is a good day, yeah!");
    });
  });
});
