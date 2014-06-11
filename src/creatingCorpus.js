var util = require('util');
var tm = require("./corpus.js");

var corpus = new tm(["Hello  Mr DJ"," I am the king of the World!!! In these times, one can only hope for redemption"]);

corpus.clean().trim().toLower().stem("Lancaster").inspect(200);
