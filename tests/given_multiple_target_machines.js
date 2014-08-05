'use strict';

var wait = function(test, num) {
    setTimeout(function(){
        if(test._assertion_list.length === num) {
            test.done();
        } else {
            wait(test, num);
        }
    }, 50);
};

exports.when_executing_single_successfull_command = {
    it_should_execute_success_callback: function(test) {
        test.expect(2);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
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
                        success: function(data, context, done) {
                            test.strictEqual(data, '1\n');
                            done();
                        }
                    }
                ]
            }
        });

        wait.call(this, test, 2);
    }
};

exports.when_executing_single_successfull_command_with_iterator_limit = {
    it_should_execute_success_callback: function(test) {
        test.expect(2);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                maxDegreeOfParallelism: 1,
                hosts: ['127.0.0.1:2222','127.0.0.1:2223'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'echo 1',
                        success: function(data, context, done) {
                            test.strictEqual(data, '1\n');
                            done();
                        }
                    }
                ]
            }
        });

        wait.call(this, test, 2);
    }
};

exports.when_executing_multiple_successfull_commands = {
    it_should_execute_success_callback: function(test) {
        test.expect(4);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222', '127.0.0.1:2223'],
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
                            done();
                        }
                    }
                ]
            }
        });

        wait.call(this, test, 4);
    }
};

exports.when_executing_multiple_commands_and_first_command_fails = {
    it_should_execute_success_callback: function(test) {
        test.expect(2);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'echoes',
            async: function(){ return function(){}; },
            data: {
                hosts: ['127.0.0.1:2222', '127.0.0.1:2223'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'batman',
                        error: function(err, context, done) {
                            test.strictEqual(err, 'bash: batman: command not found\n');
                            done();
                        }
                    },
                    {
                        input: 'echo 1'
                    }
                ]
            }
        });

        wait.call(this, test, 2);
    }
};

exports.when_executing_multiple_commands_with_iterator_limit_and_first_command_fails = {
    it_should_execute_success_callback: function(test) {
        test.expect(2);

        var task = require('./../tasks/ssh-multi-exec')(require('grunt'));
        task.call({
            target: 'sequential echoes',
            async: function(){ return function(){}; },
            data: {
                maxDegreeOfParallelism: 1,
                hosts: ['127.0.0.1:2222', '127.0.0.1:2223'],
                username: 'vagrant',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                commands: [
                    {
                        input: 'batman',
                        error: function(err, context, done) {
                            test.strictEqual(err, 'bash: batman: command not found\n');
                            done();
                        }
                    },
                    {
                        input: 'echo 1'
                    }
                ]
            }
        });

        wait.call(this, test, 2);
    }
};