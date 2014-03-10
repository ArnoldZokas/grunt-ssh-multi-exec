'use strict';

exports.when_executing_single_successfull_command = {
    it_should_execute_success_callback: function(test) {
        test.expect(2);

        var task = require('../src/grunt-ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222','127.0.0.1:2223'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'echo 1',
                        success: function(data) {
                            test.strictEqual(data, '1\n');
                        }
                    }
                ]
            }
        });

        setTimeout(function(){
            test.done();
        }, 500);
    }
};