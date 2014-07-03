text-miner
==========

text mining utilities for node.js

# Introduction

The text-miner package can be easily installed via npm:

```
npm install text-miner
```

To require the module in a project, we can use the expression

```
var tm = require('text-miner);
```

## Corpus

The fundamental data type in the `text-miner` module is the *Corpus*. An instance of this class wraps a collection of documents
and provides several methods to interact with this collection and perform post-processing tasks such as stemming,
stopword removal etc.

A new corpus is created by calling the constructor 

```
var my_corpus = new Corpus([]),
```

where `[]` is an array of text documents which form the data of the corpus. The class supports function chaining, such that mutliple methods
can be invoked after each other, e.g.

``` 
my_corpus
	.trim()
	.toLower()
	.inspect();
```	

The following methods and properties are part of the Corpus class:

### Methods

#### `clean()`
Strips extra whitespace from all documents, leaving only at most one whitespace between any two other characters.

#### `inspect(truncLength)`
Displays the contents of all documents. The optional parameter `trunLength` determines after how many characters a document 
is truncated.

#### `map(fun)`
Applies the function supplied to `fun` to each document in the corpus and maps each document to the result of its respective
function call.

#### `removeInterpunctuation()`
Removes interpunctuation characters (! ? . , ; -) from all documents. 

#### `removeNewlines()`
Removes newline characters (\n) from all documents.

#### `removeWords(words)`
Removes all words in the supplied `words` array from all documents. This function is usually invoked to remove stopwords. For convenience,
the *text-miner* package ships with a list of stopwords for different languages. These are stored in the 
`STOPWORDS` object of the module.

Currently, stopwords for the following languages are included:

```
STOPWORDS.DE
STOPWORDS.EN
STOPWORDS.ES
STOPWORDS.IT
```

As a concrete example, we could remove all english stopwords from corpus `my_corpus` as follows:

```
my_corpus.removeWords(tm.STOPWORDS.EN)
```

#### `stem(type)`
Performs stemming of the words in each document. Two stemmers are supported: Porter and Lancaster. The former is the default
option. Passing "Lancaster" to the `type` parameter of the function ensured that the latter one is used.

#### `toLower()`
Converts all characters in the documents to lower-case.

#### `toUpper()`
Converts all characters in the documents to upper-case.

#### `trim()`
Strips off whitespace at the beginning and end of each document. 

## Terms

We can pass a corpus to the constructor `Terms` in order to create a term-document-matrix

```
var terms = new Terms(my_corpus);
```

An instance of `Terms` has the following properties:

### Properties

#### vocabulary
An array holding all the words occuring in the corpus, in order corresponding to the row entries of the document-term matrix.

#### dtm
The document-term matrix, implemented as a nested array in JavaScript. Columns correspond to individual documents, while each row index
corresponds to the respective word in `vocabulary`. Each entry of `dtm` holds the number of counts the word appears in the respective documents. The array
is sparse, such that each entry which is undefined corresponds to a value of zero.

#### nDocs
The number of documents in the term matrix

#### nTerms
The number of distinct words appearing in the documents 

### Methods 

#### `findFreqTerms`

#### `removeSparseWords`

#### `weighting`
