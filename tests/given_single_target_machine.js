'use strict';

var grunt = require('grunt');

exports.when_executing_single_command = {
    it_should_execute_command: function(test) {
        test.expect(1);

        var task = require('../src/ssh-multi-exec')(grunt);
        task.call({
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1'],
                port: 2222,
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        command: 'echo 1',
                        success: function(data) {
                            test.strictEqual(data, '1\n');
                            test.done();
                        }
                    }
                ]
            }
        });
    }
};