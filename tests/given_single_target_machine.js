'use strict';

exports.when_executing_single_successfull_command = {
    it_should_execute_success_callback: function(test) {
        test.expect(3);

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
                        hint: 'this is a test',
                        input: 'echo 1',
                        success: function(data, context, done) {
                            console.log('SUCCESS');
                            test.strictEqual(data, '1\n');
                            test.strictEqual(context.host, '127.0.0.1');
                            test.strictEqual(context.port, '2222');
                            test.done();
                            done();
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
                        success: function(data, context, done) {
                            test.strictEqual(data, '1\n');
                            test.done();
                            done();
                        }
                    }
                ]
            }
        });
    }
};

exports.when_executing_single_successfull_command_using_passphrase_protected_private_key = {
    it_should_execute_success_callback: function(test) {
        test.expect(1);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                privateKey: './tests/test',
                passphrase: 'this.is.a.test',
                commands: [
                    {
                        input: 'echo passphrase',
                        success: function(data, context, done) {
                            test.strictEqual(data, 'passphrase\n');
                            test.done();
                            done();
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
                        success: function(data, context, done) {
                            test.strictEqual(data, '2\n');
                            done();
                        }
                    },
                    {
                        input: 'echo TEST > ~/test.txt',
                        success: function(data, context, done) {
                            test.strictEqual(data, undefined);
                            test.done();
                            done();
                        }
                    }
                ]
            }
        });
    }
};

exports.when_executing_single_failing_command = {
    it_should_execute_error_callback: function(test) {
        test.expect(3);

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
                        error: function(err, context, done) {
                            console.log('FAILURE');
                            test.strictEqual(err, 'bash: batman: command not found\n');
                            test.strictEqual(context.host, '127.0.0.1');
                            test.strictEqual(context.port, '2222');
                            test.done();
                            done();
                        }
                    }
                ]
            }
        });
    }
};

exports.when_executing_multiple_commands_and_first_command_fails = {
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
                        error: function(err, context, done) {
                            test.strictEqual(err, 'bash: batman: command not found\n');
                            test.done();
                            done();
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

exports.when_executing_multiple_commands_and_first_command_with_force_flag_fails = {
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
                        force: true,
                        error: function(err, context, done) {
                            test.strictEqual(err, 'bash: batman: command not found\n');
                            done();
                        }
                    },
                    {
                        input: 'echo 1',
                        success: function(data, context, done) {
                            test.done();
                            done();
                        }
                    }
                ]
            }
        });
    }
};