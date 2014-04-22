module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            css: {
                src: [
                    'css/*'
                ],
                dest: 'css.css'
            },
            js: {
                src: [
                    'js/*'
                ],
                dest: 'js.js'
            }
        },
        cssmin: {
            css: {
                src: 'css.css',
                dest: 'css.min.css'
            }
        },

        uglify: {
            js: {
                files: {
                    'js.min.js': ['js.js']
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concat:css', 'cssmin:css', 'concat:js', 'uglify:js']);
};
