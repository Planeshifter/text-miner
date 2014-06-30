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
        src: 'src/corpus.js',
        dest: 'build/corpus.min.js'
    	},
    	{
    	src: 'src/dtm.js',
    	dest: 'build/dtm.min.js'
    	},
    	{
    	src: 'src/stopwords.js',
    	dest: 'build/stopwords.min.js'
    	}]
      }
    },
    jshint: {
    	all: ['src/*.js','gruntfile.js']
    },
    concat: {
        options: {
          separator: ';',
        },
        dist: {
          src: ['build/corpus.min.js','build/dtm.min.js','build/stopwords.min.js'],
          dest: 'build/text-miner.js',
        },
        },
    watch: {
        	target1: {
        	files: "src/*.js",
        	tasks: ["jshint"]
        	},
      },
  });

  // Define the default task
  grunt.registerTask('default', ['uglify','jshint','concat','watch']);
};
