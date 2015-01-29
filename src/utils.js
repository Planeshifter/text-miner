var expandContractions = function(str){
  for (var key in CONTRACTIONS){
    str = str.replace(new RegExp(key,"gi"), CONTRACTIONS[key]);
  }
  return str;
};

var utils = {};
utils.expandContractions = expandContractions;

exports.utils = utils;
