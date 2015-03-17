'use strict';

module.exports = function(grunt) {

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Project configuration.
  grunt.initConfig({
    uglify: {
      target1: {
      	files: [{
						src: 'src/text-miner.js',
						dest: 'build/text-miner.min.js'
					},
					{
            src: 'src/corpus.js',
            dest: 'build/corpus.js'
        	},
        	{
        	src: 'src/dtm.js',
        	dest: 'build/dtm.js'
        	},
        	{
        	src: 'src/stopwords.js',
        	dest: 'build/stopwords.js'
          },
          {
            src: 'src/contractions.js',
            dest: 'build/contractions.js'
          },
          {
            src: 'src/utils.js',
            dest: 'build/utils.js'
          },]
      }
    },
    jshint: {
    	all: ['src/*.js','gruntfile.js']
    },
    watch: {
        	target1: {
        	files: "src/*.js",
        	tasks: ['uglify','jshint','concat','watch']
        	},
      },
  });

  // Define the default task
  grunt.registerTask('default', ['uglify','jshint','watch']);
};
