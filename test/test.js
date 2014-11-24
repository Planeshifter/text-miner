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
      expect(my_corpus.clean().documents[0]).to.be.equal("I am a document with whitespaces")
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
    })
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
  describe("Corpus:removeDuplicateWords()",function(){
    it("removes all duplicate words", function(){
      var corpus = new tm.Corpus(["I am doc with a double word word, see.", "I am a doc without a double word"]);
      console.log(corpus.removeDuplicateWords().documents)
      expect(corpus.removeDuplicateWords().documents).to.include("I am doc with a double word  , see.");
      expect(corpus.removeDuplicateWords().documents).to.include("I am a doc without a double word");
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
});
