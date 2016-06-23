module.exports = function(grunt) {
    grunt.initConfig({
        typescript: {
            ts: {
                files: {
                    'js/sazae.js': 'ts/sazae.ts'
                }
            }
        },
        uglify: {
            build: {
                src: ['js/sazae.js'],
                dest: 'js/sazae.min.js'
            }
        },
        watch: {
            compile: {
                files: ['ts/*.ts'],
                tasks: ['typescript', 'uglify']
            }
        }
    });
    grunt.loadNpmTasks('grunt-typescript');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
};
