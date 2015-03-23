'use strict';

var expect = require('expect.js'),
    noop   = function(){ return function(){}; },
    task   = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe.skip('single target (edge cases)', function() {
    it('unreachable host', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:1234'],
                username: 'test',
                password: 'test',
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
});