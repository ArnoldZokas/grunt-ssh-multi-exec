'use strict';

module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        eslint: {
            options: {
                configFile: '.eslintrc'
            },
            target: [ './*.js', './tasks', './lib', './test' ]
        }
    });

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);

    grunt.registerTask('default', ['build']);
    grunt.registerTask('build', ['eslint']);
};
