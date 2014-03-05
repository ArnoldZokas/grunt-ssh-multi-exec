'use strict';

var shell = require('shelljs');

module.exports = function(grunt){
    grunt.registerTask('vagrant-up', function(){
        shell.exec('vagrant up');
    });

    grunt.registerTask('vagrant-destroy', function(){
        shell.exec('vagrant destroy -f');
    });
};