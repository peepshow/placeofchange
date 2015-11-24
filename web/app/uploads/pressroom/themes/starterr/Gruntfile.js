'use strict';
module.exports = function(grunt) {

    require('load-grunt-tasks')(grunt);
    // Show elapsed time
    require('time-grunt')(grunt);

    var jsContent = [
        'assets/js/vendor/modernizr-custom.js',
        'assets/bower_components/fluidvids/src/fluidvids.js',
        'assets/bower_components/fastclick/lib/fastclick.js',
        'assets/js/source/_main__init.js'
    ];

    var jsToc = [
        'assets/bower_components/modernizer/modernizr.js',
        'assets/bower_components/swiper/src/idangerous.swiper.js',
        'assets/bower_components/fastclick/lib/fastclick.js',
        'assets/js/source/_toc__init.js'
    ];

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: [
                'Gruntfile.js',
                'assets/js/source/*.js',
                '!assets/js/scripts.min.js'
            ]
        },

        sass: {
                dev: {
                        files: {
                                'assets/css/styles.css': 'assets/sass/styles.scss',
                                'assets/css/toc.css': 'assets/sass/toc.scss'
                        },
                        options: {
                                compass: false,
                                debugInfo: true,
                                lineNumbers: true,
                                sourcemap: 'auto',
                                precision: 7,
                                loadPath: 'assets/bower_components/',
                                style: 'expanded'
                        }
                },
                dist: {
                        files: {
                                'assets/css/styles.min.css': 'assets/sass/styles.scss',
                                'assets/css/toc.min.css': 'assets/sass/toc.scss'
                        },
                        options: {
                                debugInfo: false,
                                lineNumbers: false,
                                sourcemap: 'none',
                                precision: 7,
                                loadPath: 'assets/bower_components/',
                                style: 'compressed'
                        }
                }
        },

        cssmin: {
            options: {
                keepSpecialComments:0
            },
            combine: {
                files: {
                    'assets/css/styles.min.css': [
                        ''
                    ]
                }
            }
        },

        uglify: {
            dev: {
                options: {
                  compress: false,
                  mangle: false,
                  beautify: true,
                  preserveComments: 'all'
                },
                files: {
                    'assets/js/scripts.js': [jsContent],
                    'assets/js/toc.js': [jsToc]
                }
            },
            dist: {
                files: {
                    'assets/js/scripts.min.js': [jsContent],
                    'assets/js/toc.min.js': [jsToc]
                }
            }
        },

        rsync: {
                options: {
                        args: ["--verbose --no-p --no-g --chmod=ugo=rwX"],
                        exclude: ['node_modules', '.bowerrc', '.editorconfig', '.gitignore', '.jshintrc','assets/sass', 'assets/bk*', 'assets/js/source', 'assets/bower_components', '*.map', '.*', '.sass-cache/', 'Gemfile', 'version.json', 'Gemfile.lock', 'Gruntfile.js', '*.md', 'screenshot.png', 'lang', 'package.json', 'bower.json'],
                        recursive: true
                },
                stage: {
                        options: {
                                src: "../starterr/",
                                dest: "",
                                host: "",
                                syncDestIgnoreExcl: false
                        }
                },
                prod: {
                        options: {
                                src: "../starterr/",
                                dest: "",
                                host: "",
                                syncDestIgnoreExcl: false
                        }
                }
        },

        version: {
            assets: {
                options: {
                    length: 16,
                    format: false, 
                    rename: true,
                    manifest: 'assets/pr-manifest.json',
                    summaryOnly: true,
                },
                files: {
                    'inc/pr_scripts.php': 'assets/{css,js}/{styles,toc,scripts}.min.{css,js}'
                }
            }
        },

        watch: {

            js: {
                files: [
                    '<%= jshint.all %>',
                    'js/_toc__init.js',
                    'js/_main__init.js'
                ],
                tasks: ['jshint', 'uglify']
            },

            sass: {
                files: [
                    'assets/sass/*.sass',
                    'assets/sass/*.scss',
                    'assets/sass/base/*.scss',
                    'assets/sass/components/*.scss',
                    'assets/sass/layout/*.scss',
                    'assets/sass/utility/*.scss',
                    'assets/sass/pages/*.scss'
                ],
                tasks: ['clean','uglify:dev', 'sass:dev']
            }
            
        },

        clean: {
            dist: [
                'assets/css/*.css',
                'assets/css/*.map',
                'assets/js/scripts.*.js',
                'assets/js/toc.*.js'
            ]
        }

    });

    grunt.registerTask('default', [
        'clean',
        'sass:dist',
        'uglify:dist',
        'version',
    ]);

    grunt.registerTask('dev', [
        'watch'
    ]);

    grunt.registerTask('stage', ['rsync:stage']);

    grunt.registerTask('deploy', ['rsync:prod']);
};
