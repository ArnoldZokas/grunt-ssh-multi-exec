'use strict';

var noop = function(){ return function(){}; },
    task = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe('authentication (happy path)', function() {
    it('password authentication', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
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

    it('private key authentication', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'vagrant',
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

    it('passphrase-protected private key authentication', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
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
});