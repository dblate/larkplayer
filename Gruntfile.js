module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        babel: {
            options: {
                    sourceMap: false,
                    presets: ['env']
                },
                dist: {
                    files: [{
                        expand: true,
                        cwd: './src/js',
                        src: ['**/*.js'],
                        dest: './lib'
                    }]
                }
        },
        copy: {
            dist: {
                files: [{
                    expand: true,
                    cwd: './src/css/resource',
                    src: ['*/*'],
                    dest: './dist'
                }]
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: {
                    'dist/<%= pkg.name %>.min.js': ['./dist/<%= pkg.name %>.js']
                }
            }
        },
        less: {
            compile: {
                files: {
                    './dist/<%= pkg.name %>.css': './src/css/<%= pkg.name %>.less'
                }
            },
            compress: {
                options: {
                    compress: true
                },
                files: {
                    './dist/<%= pkg.name %>.min.css': './dist/<%= pkg.name %>.css'
                }
            }
        },
        browserify: {
            dist: {
                options: {
                    transform: [
                        ["babelify", {
                            presets: ['env']
                        }]
                    ],
                    browserifyOptions: {
                        standalone: '<%= pkg.name %>'
                    }
                },
                files: {
                    './dist/<%= pkg.name %>.js': ['./src/js/<%= pkg.name %>.js']
                }
            }
        }
    });
    grunt.loadNpmTasks('grunt-babel');
    // grunt.loadNpmTasks('grunt-contrib-jshint');
    // grunt.loadNpmTasks('grunt-contrib-watch');
    // grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-browserify');
    grunt.registerTask('default', ['less', 'browserify', 'uglify', 'copy']);

    grunt.registerTask('generate-lib', ['babel'])
};