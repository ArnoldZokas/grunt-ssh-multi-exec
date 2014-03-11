'use strict';

exports.when_executing_single_successfull_command = {
    it_should_execute_success_callback: function(test) {
        test.expect(1);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'echo 1',
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

exports.when_executing_single_successfull_command_using_password_authentication = {
    it_should_execute_success_callback: function(test) {
        test.expect(1);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                password: 'test',
                commands: [
                    {
                        input: 'echo 1',
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

exports.when_executing_multiple_successfull_commands = {
    it_should_execute_success_callback: function(test) {
        test.expect(2);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'echo 2',
                        success: function(data) {
                            test.strictEqual(data, '2\n');
                        }
                    },
                    {
                        input: 'echo 3',
                        success: function(data) {
                            test.strictEqual(data, '3\n');
                            test.done();
                        }
                    }
                ]
            }
        });
    }
};

exports.when_executing_single_failing_command = {
    it_should_execute_error_callback: function(test) {
        test.expect(1);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'batman',
                        error: function(err) {
                            test.strictEqual(err, 'bash: batman: command not found\n');
                            test.done();
                        }
                    }
                ]
            }
        });
    }
};

exports.when_executing_multiple_successfull_commands_and_first_command_fails = {
    it_should_execute_success_callback: function(test) {
        test.expect(1);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'batman',
                        error: function(err) {
                            test.strictEqual(err, 'bash: batman: command not found\n');
                            test.done();
                        }
                    },
                    {
                        input: 'echo 1'
                    }
                ]
            }
        });
    }
};