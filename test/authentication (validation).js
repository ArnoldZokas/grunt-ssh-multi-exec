'use strict';

var noop = function(){ return function(){}; },
    task = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe.skip('authentication (validation)', function() {
    it('password authentication, null username', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: null,
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

    it('password authentication, null password', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                password: null,
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

    it('private key authentication, null private key', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'vagrant',
                privateKey: null,
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

    it('passphrase-protected private key authentication, null passphrase', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                privateKey: './test/test',
                passphrase: null,
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