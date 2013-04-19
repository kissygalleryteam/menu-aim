module.exports = function(grunt) {

  var DIR_BUILD      = '/build/',
      DIR_DEMO_CSS   = '/demo/assets/stylesheets/',
      DIR_DEMO_BUILD = '/demo/assets/build/';

  grunt.initConfig({

    pkg: grunt.file.readJSON('abc.json'),

    compass: {
      dist: {
        options: {
          sassDir: '<%= pkg.version %>' + DIR_DEMO_CSS + 'src/',
          cssDir : '<%= pkg.version %>' + DIR_DEMO_CSS + 'compiled/'
        }
      }
    },

    cssmin: {
      compress: {
        src : ['<%= pkg.version %>' + DIR_DEMO_CSS + 'compiled/style.css'],
        dest: '<%= pkg.version %>' + DIR_DEMO_BUILD + 'style-min.css'
      }
    },

    concat: {
      dist: {
        src : ['<%= pkg.version %>/index.js'],
        dest: '<%= pkg.version %>' + DIR_BUILD + 'index.js'
      }
    },

    uglify: {
      compress: {
        src : ['<%= pkg.version %>' + DIR_BUILD + 'index.js'],
        dest: '<%= pkg.version %>' + DIR_BUILD + 'index-min.js'
      }
    },

    watch: {
      compass: {
        files: ['<%= pkg.version %>' + DIR_DEMO_CSS + 'src/*.sass'],
        tasks: ['compass', 'cssmin']
      },
      js: {
        files: ['<%= pkg.version %>/*.js'],
        tasks: ['concat', 'uglify']
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-compass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('default', ['compass', 'cssmin', 'concat', 'uglify']);

};