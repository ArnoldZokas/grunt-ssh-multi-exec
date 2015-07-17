'use strict';

var expect = require('expect.js'),
    noop   = function(){ return function(){}; },
    task   = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe('authentication', function() {
    describe('password', function() {
        it('happy path', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'test',
                    password: 'test',
                    logFn: noop,
                    commands: [
                        {
                            input: 'echo 1',
                            success: function() {
                                done();
                            }
                        }
                    ]
                }
            });
        });

        it('bad username', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'BAD_USERNAME',
                    password: 'test',
                    logFn: function(message) {
                        if(message) {
                            expect(message).to.equal('\u001b[36mBAD_USERNAME@127.0.0.1:2222 ~$ \u001b[39mConnection error: \u001b[31mError: All configured authentication methods failed\u001b[39m');
                        } else {
                            done();
                        }
                    },
                    commands: [
                        {
                            input: 'echo 1'
                        }
                    ]
                }
            });
        });

        it('bad password', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'test',
                    password: 'BAD_PASSWORD',
                    logFn: function(message) {
                        if(message) {
                            expect(message).to.equal('\u001b[36mtest@127.0.0.1:2222 ~$ \u001b[39mConnection error: \u001b[31mError: All configured authentication methods failed\u001b[39m');
                        } else {
                            done();
                        }
                    },
                    commands: [
                        {
                            input: 'echo 1',
                            success: function() {
                                done();
                            }
                        }
                    ]
                }
            });
        });
    });

    describe('private key', function() {
        it('happy path', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'test',
                    privateKey: './test/test',
                    passphrase: 'this.is.a.test',
                    logFn: noop,
                    commands: [
                        {
                            input: 'echo 1',
                            success: function() {
                                done();
                            }
                        }
                    ]
                }
            });
        });

        it('bad username', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'BAD_USERNAME',
                    privateKey: './test/test',
                    passphrase: 'this.is.a.test',
                    logFn: function(message) {
                        if(message) {
                            expect(message).to.equal('\u001b[36mBAD_USERNAME@127.0.0.1:2222 ~$ \u001b[39mConnection error: \u001b[31mError: All configured authentication methods failed\u001b[39m');
                        } else {
                            done();
                        }
                    },
                    commands: [
                        {
                            input: 'echo 1'
                        }
                    ]
                }
            });
        });

        it('bad private key', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'test',
                    privateKey: './does/not/exist',
                    passphrase: 'this.is.a.test',
                    logFn: function(message) {
                        if(message) {
                            expect(message).to.equal('\u001b[36mtest@127.0.0.1:2222 ~$ \u001b[39mFailed to load private key from path ./does/not/exist');
                        } else {
                            done();
                        }
                    },
                    commands: [
                        {
                            input: 'echo 1'
                        }
                    ]
                }
            });
        });

        it('bad username', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'test',
                    privateKey: './test/test',
                    passphrase: 'BAD_PASSPHRASE',
                    logFn: function(message) {
                        if(message) {
                            expect(message).to.equal('\u001b[36mtest@127.0.0.1:2222 ~$ \u001b[39mConnection error: \u001b[31mError: Malformed private key (expected sequence). Bad passphrase?\u001b[39m');
                        } else {
                            done();
                        }
                    },
                    commands: [
                        {
                            input: 'echo 1'
                        }
                    ]
                }
            });
        });
    });

    describe('private key (no passphrase)', function() {
        it('happy path', function(done) {
            task.call({
                async: noop,
                target: 'test',
                data: {
                    hosts: ['127.0.0.1:2222'],
                    username: 'vagrant',
                    privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
                    logFn: noop,
                    commands: [
                        {
                            input: 'echo 1',
                            success: function() {
                                done();
                            }
                        }
                    ]
                }
            });
        });
    });
});
