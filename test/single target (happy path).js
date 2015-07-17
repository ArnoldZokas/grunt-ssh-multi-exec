'use strict';

var expect = require('expect.js');

var noop = function() { return function() {}; },
    task = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe('single target (happy path)', function() {
    it('single command, successful', function(done) {
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
                        hint: 'hint',
                        input: 'echo 1',
                        success: function(data, context) {
                            expect(data).to.equal('1\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            done();
                        }
                    }
                ]
            }
        });
    });

    it('single command, failing', function(done) {
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
                        hint: 'hint',
                        input: '_test_',
                        error: function(err, context) {
                            expect(err).to.equal('bash: _test_: command not found\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            done();
                        }
                    }
                ]
            }
        });
    });

    it('multiple commands, successful', function(done) {
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
                        hint: 'hint 1',
                        input: 'echo 1',
                        success: function(data, context, next) {
                            expect(data).to.equal('1\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            next();
                        }
                    },
                    {
                        hint: 'hint 2',
                        input: 'echo 2',
                        success: function(data, context) {
                            expect(data).to.equal('2\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            done();
                        }
                    }
                ]
            }
        });
    });

    it('multiple commands, first failing', function(done) {
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
                        hint: 'hint 1',
                        input: '_test_',
                        error: function(err, context) {
                            expect(err).to.equal('bash: _test_: command not found\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            done();
                        }
                    },
                    {
                        hint: 'hint 2',
                        input: 'echo 2',
                        success: function() {
                            expect().fail('Previous command failed - this should not have been executed!');
                        }
                    }
                ]
            }
        });
    });

    it('multiple commands, first failing +force', function(done) {
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
                        hint: 'hint 1',
                        input: '_test_',
                        force: true,
                        error: function(err, context, next) {
                            expect(err).to.equal('bash: _test_: command not found\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            next();
                        }
                    },
                    {
                        hint: 'hint 2',
                        input: 'echo 2',
                        success: function(data, context) {
                            expect(data).to.equal('2\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            done();
                        }
                    }
                ]
            }
        });
    });

    it('multiple commands, last failing', function(done) {
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
                        hint: 'hint 1',
                        input: 'echo 1',
                        success: function(data, context, next) {
                            expect(data).to.equal('1\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            next();
                        }
                    },
                    {
                        hint: 'hint 2',
                        input: '_test_',
                        error: function(err, context) {
                            expect(err).to.equal('bash: _test_: command not found\n');
                            expect(context.host).to.equal('127.0.0.1');
                            expect(context.port).to.equal('2222');
                            done();
                        }
                    }
                ]
            }
        });
    });
});
