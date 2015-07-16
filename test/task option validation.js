'use strict';

var expect = require('expect.js'),
    grunt  = require('grunt'),
    noop   = function(){ return function(){}; },
    task   = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe('task option validation', function() {
    describe('hosts', function() {
        describe('given undefined', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "hosts" fails because ["hosts" is required]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given null', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "hosts" fails because ["hosts" must be an array]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: null,
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given empty array', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "hosts" fails because ["hosts" does not contain 1 required value(s)]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: [],
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given empty array element', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "hosts" fails because ["hosts" at position 0 fails because ["0" is not allowed to be empty]]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: [''],
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('maxDegreeOfParallelism', function() {
        describe('given non-numeric', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "maxDegreeOfParallelism" fails because ["maxDegreeOfParallelism" must be a number]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        maxDegreeOfParallelism: 'INVALID',
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('username', function() {
        describe('given undefined', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "username" fails because ["username" is required]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given null', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "username" fails because ["username" must be a string]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: null,
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given empty', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "username" fails because ["username" is not allowed to be empty]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: '',
                        password: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('password', function() {
        describe('given null', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "password" fails because ["password" must be a string]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        password: null,
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given empty', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "password" fails because ["password" is not allowed to be empty]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        password: '',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('privateKey', function() {
        describe('given null', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "privateKey" fails because ["privateKey" must be a string]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        privateKey: null,
                        passphrase: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given empty', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "privateKey" fails because ["privateKey" is not allowed to be empty]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        privateKey: '',
                        passphrase: 'test',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('passphrase', function() {
        describe('given null', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "passphrase" fails because ["passphrase" must be a string]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        privateKey: 'test',
                        passphrase: null,
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });

        describe('given empty', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "passphrase" fails because ["passphrase" is not allowed to be empty]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1:2222'],
                        username: 'test',
                        privateKey: 'test',
                        passphrase: '',
                        logFn: noop,
                        commands: [
                            {
                                input: 'echo 1'
                            }
                        ]
                    }
                });
            });
        });
    });

    describe('commands', function() {
        describe('given undefined', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "commands" fails because ["commands" is required]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1'],
                        username: 'test',
                        password: 'test',
                        logFn: noop
                    }
                });
            });
        });

        describe('given null', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "commands" fails because ["commands" must be an array]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1'],
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: null
                    }
                });
            });
        });

        describe('given empty array', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "commands" fails because ["commands" does not contain 1 required value(s)]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1'],
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: []
                    }
                });
            });
        });

        describe('given empty array element', function() {
            it('should return validation error', function(next) {
                grunt.fail.fatal = function(error) {
                    expect(error.message).to.equal('child "commands" fails because ["commands" at position 0 fails because ["0" must be an object]]');
                    next();
                };

                task.call({
                    async: noop,
                    target: 'test',
                    data: {
                        hosts: ['127.0.0.1'],
                        username: 'test',
                        password: 'test',
                        logFn: noop,
                        commands: [null]
                    }
                });
            });
        });
    });
});
