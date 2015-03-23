'use strict';

var noop = function(){ return function(){}; },
    task = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe.skip('authentication (edge cases)', function() {
    it('password authentication, bad username', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'BAD_USERNAME',
                password: 'test',
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

    it('password authentication, bad password', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                password: 'BAD_PASSWORD',
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

    it('private key authentication, bad username', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'BAD_USERNAME',
                privateKey: '/Users/' + process.env.USER + '/.vagrant.d/insecure_private_key',
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

    it('private key authentication, bad private key', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'vagrant',
                privateKey: '/dev/null',
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

    it('passphrase-protected private key authentication, bad username', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'BAD_USERNAME',
                privateKey: './test/test',
                passphrase: 'this.is.a.test',
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

    it('passphrase-protected private key authentication, bad private key', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                privateKey: '/dev/null',
                passphrase: 'this.is.a.test',
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

    it('passphrase-protected private key authentication, bad passphrase', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                privateKey: './test/test',
                passphrase: 'BAD_PASSPHRASE',
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