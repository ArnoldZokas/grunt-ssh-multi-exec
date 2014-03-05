'use strict';

module.exports = function(grunt) {
    grunt.registerMultiTask('ssh-multi-exec', 'Execute series of SSH commands', function() {
        var options = this.options();

        grunt.log.writeln('Running task!');
    });

};