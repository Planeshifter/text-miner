var Terms = function(corpus){
	var self = this;

	this.vocabulary = [];
	this.dtm = [];
	
	var _processDoc = function(doc){
		
		var wordArray = doc.split(" ");
		var words = [];
		
		for (var i = 0; i < wordArray.length; i++){
			
			var current_word = wordArray[i];
			var index = self.vocabulary.indexOf(current_word);
			
			if (index > -1){
					words[index] += 1;
				}
				else{
					words[self.vocabulary.length] = 1;
					self.vocabulary.push(current_word);
				}
			}	
		self.dtm.push(words);
	};
	
	this.removeSparseTerms = function(percent){
		
		for (var w = 0; w < self.vocabulary.length; w++){
			var counter = 0;
			for (var d = 0; d < self.dtm.length; d++){
				var doc = self.dtm[d];
				if (doc !== undefined && doc[w] !== undefined){
					counter++;
					console.log("counter hochgezaehl");
				}
			}
			if (counter / self.dtm.length < percent){
				 self.vocabulary = self.vocabulary.splice(w, 1);
				 
				 for (var d2 = 0; d2 < self.dtm.length; d2++){
					 if (self.dtm[d2] !== undefined){
						 self.dtm[d2] = self.dtm[d2].splice(w, 0.1); 		 
					 }
				 }
				}
		}

	 return self;
	};
	
	// initialization
	(function(){
		var documents = corpus.documents;
		documents.forEach(_processDoc);
	})();

};

exports.Terms = Terms;