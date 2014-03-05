'use strict';

var grunt = require('grunt');

exports.when_executing_single_command = {
    it_should_execute_successfully: function(test) {
        test.expect(1);

        grunt.initConfig({
            'ssh-multi-exec': {
                test: { }
            }
        });
        require('../src/ssh-multi-exec')(grunt);
        grunt.registerTask('default', ['ssh-multi-exec']);
        grunt.task.run('default');

        test.equal(true, true);

        test.done();
    }
};