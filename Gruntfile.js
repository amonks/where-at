module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        copy: {
            readme: {
                files: [{
                    src: 'README.md',
                    dest: 'views/readme.md',
                }]
            }
        },
        concat: {
            css: {
                src: [
                    'css/*'
                ],
                dest: 'public/css.css'
            },
            js: {
                src: [
                    'js/*'
                ],
                dest: 'public/js.js'
            }
        },
        cssmin: {
            css: {
                src: 'public/css.css',
                dest: 'public/css.min.css'
            }
        },

        uglify: {
            js: {
                files: {
                    'public/js.min.js': ['public/js.js']
                }
            }
        }

    });
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['copy:readme', 'concat:css', 'cssmin:css', 'concat:js', 'uglify:js']);
};
