'use strict';

var expect = require('expect.js'),
    grunt  = require('grunt'),
    noop   = function(){ return function(){}; },
    task   = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe('command parameter validation', function() {
    describe('input', function() {
        describe('given undefined', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "input" fails because ["input" is required]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        logFn: noop,
                        commands: [
                            {
                            }
                        ]
                    }
                });
            });
        });

        describe('given null', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "input" fails because ["input" must be a string]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: null
                            }
                        ]
                    }
                });
            });
        });

        describe('given empty', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "input" fails because ["input" is not allowed to be empty]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: ''
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('force', function() {
        describe('given non-boolean', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "force" fails because ["force" must be a boolean]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1',
                                force: ''
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('success fn', function() {
        describe('given non-function', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "success" fails because ["success" must be a Function]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1',
                                success: ''
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('error fn', function() {
        describe('given non-function', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "error" fails because ["error" must be a Function]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1',
                                error: ''
                            }
                        ]
                    }
                });
            });
        });
    });
});
