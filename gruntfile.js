'use strict';

module.exports = function (grunt) {
	var taskObject = {
		pkg: grunt.file.readJSON('package.json')
	};

    grunt.file.expand('grunt_tasks/*.js', '!grunt_tasks/_*.js').forEach(function(file) {
        var name = file.split('/');
        name = name[name.length - 1].replace('.js', '');
        var task = require('./'+ file);

        if(grunt.util._.isFunction(task)){
            task(grunt);
        } else {
            taskObject[name] = task;
        }
    });

	grunt.initConfig(taskObject);

	require('time-grunt')(grunt);
	require('load-grunt-tasks')(grunt);

	grunt.registerTask('default', ['build']);
	grunt.registerTask('build', ['jshint:all']);
};