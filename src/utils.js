'use strict';

var CONTRACTIONS = require("./contractions.js");

var expandContractions = function(str){
  for (var key in CONTRACTIONS ){
    str = str.replace(new RegExp(key,"gi"), CONTRACTIONS[key][0]);
  }
  return str;
};

module.exports = {
	'expandContractions': expandContractions
};
