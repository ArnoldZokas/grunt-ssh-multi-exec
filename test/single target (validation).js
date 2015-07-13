'use strict';

var noop   = function(){ return function(){}; },
    task   = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe.skip('single target (validation)', function() {
    it('null hosts', function(done) {
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
                        input: 'echo 1',
                        success: function() {
                            done();
                        }
                    }
                ]
            }
        });
    });

    it('0 hosts', function(done) {
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
                        input: 'echo 1',
                        success: function() {
                            done();
                        }
                    }
                ]
            }
        });
    });

    it('invalid host', function(done) {
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
                        input: 'echo 1',
                        success: function() {
                            done();
                        }
                    }
                ]
            }
        });
    });

    it('null commands', function() {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                password: 'test',
                logFn: noop,
                commands: null
            }
        });
    });

    it('0 commands', function() {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:2222'],
                username: 'test',
                password: 'test',
                logFn: noop,
                commands: []
            }
        });
    });

    it('null command', function(done) {
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
                        input: null,
                        success: function() {
                            done();
                        }
                    }
                ]
            }
        });
    });
});