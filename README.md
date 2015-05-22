[![NPM version][npm-image]][npm-url]
[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![Dependencies][dependencies-image]][dependencies-url]

text-miner
==========

> text mining utilities for node.js

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
var my_corpus = new tm.Corpus([]);
```

where `[]` is an array of text documents which form the data of the corpus. The class supports method chaining, such that mutliple methods can be invoked after each other, e.g.

```
my_corpus
	.trim()
	.toLower()
	.inspect();
```

The following methods and properties are part of the Corpus class:

### Methods

#### `.addDoc(doc)`

Add a single document to the corpus. Has to be a string.

#### `.addDocs(docs)`

Adds a collection of documents (in form of an array of strings) to the corpus.

#### `.clean()`
Strips extra whitespace from all documents, leaving only at most one whitespace between any two other characters.

#### `.inspect(truncLength)`
Displays the contents of all documents. The optional parameter `trunLength` determines after how many characters a document
is truncated.

#### `.map(fun)`
Applies the function supplied to `fun` to each document in the corpus and maps each document to the result of its respective
function call.

#### `.removeInterpunctuation()`
Removes interpunctuation characters (! ? . , ; -) from all documents.

#### `.removeNewlines()`
Removes newline characters (\n) from all documents.

#### `.removeWords(words[, case_sensitive])`
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

The second (optional) parameter of the function `case_sensitive` expects a Boolean indicating whether to ignore cases or not.
The default value is `false`.

#### `.removeDigits()`

Removes any digits occuring in the texts.

#### `.removeInvalidCharacters()`

Removes all characters which are unknown or unrepresentable in Unicode.

#### `.stem(type)`
Performs stemming of the words in each document. Two stemmers are supported: Porter and Lancaster. The former is the default
option. Passing "Lancaster" to the `type` parameter of the function ensured that the latter one is used.

#### `.toLower()`
Converts all characters in the documents to lower-case.

#### `.toUpper()`
Converts all characters in the documents to upper-case.

#### `.trim()`
Strips off whitespace at the beginning and end of each document.

## Terms

We can pass a corpus to the constructor `Terms` in order to create a term-document-matrix

```
var terms = new tm.Terms(my_corpus);
```

An instance of `Terms` has the following properties:

### Properties

#### `.vocabulary`
An array holding all the words occuring in the corpus, in order corresponding to the row entries of the document-term matrix.

#### `.dtm`
The document-term matrix, implemented as a nested array in JavaScript. Columns correspond to individual documents, while each row index
corresponds to the respective word in `vocabulary`. Each entry of `dtm` holds the number of counts the word appears in the respective documents. The array
is sparse, such that each entry which is undefined corresponds to a value of zero.

#### `.nDocs`
The number of documents in the term matrix

#### `.nTerms`
The number of distinct words appearing in the documents

### Methods

#### `.findFreqTerms(n)`

Returns all terms in alphabetical ordering which appear `n` or more times in the corpus. The return value is an array of objects of the form
`{word: "<word>", count: <number>}`.

#### `.removeSparseTerms(percent)`

Remove all words from the document-term matrix which appear in less than `percent` of the documents.

#### `.weighting(fun)`

Apply a weighting scheme to the entries of the document-term matrix. The `weighting` method expects a function as its argument, which is then applied to each entry of the document-term matrix. Currently, the function `weightTfIdf`, which calculates the term-frequency inverse-document-frequency (TfIdf) for each word, is the only built-in weighting function.  

#### `.fill_zeros()`

Turn the document-term matrix `dtm` into a non-sparse matrix by replacing each value which is `undefined` by zero and save the result. 

## Utils

Namespace object which bundles several other utility functions.

### `.expandContractions(str)`

Replaces all occuring English contractions by their expanded equivalents, e.g. "don't" is changed to
"do not". The resulting string is returned.

## Unit Tests

Run tests via the command `npm test`

---
## License

[MIT license](http://opensource.org/licenses/MIT).

[npm-image]: https://badge.fury.io/js/text-miner.svg
[npm-url]: http://badge.fury.io/js/text-miner

[travis-image]: https://travis-ci.org/Planeshifter/text-miner.svg
[travis-url]: https://travis-ci.org/Planeshifter/text-miner

[coveralls-image]: https://img.shields.io/coveralls/Planeshifter/text-miner/master.svg
[coveralls-url]: https://coveralls.io/r/Planeshifter/text-miner?branch=master

[dependencies-image]: http://img.shields.io/david/Planeshifter/text-miner.svg
[dependencies-url]: https://david-dm.org/Planeshifter/text-miner
