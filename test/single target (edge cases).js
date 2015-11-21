'use strict';

var expect = require('expect.js');

var noop = function() { return function() {}; },
    task = require('./../tasks/ssh-multi-exec')(require('grunt'));

describe('single target (edge cases)', function() {
    it('unreachable host', function(done) {
        task.call({
            async: noop,
            target: 'test',
            data: {
                hosts: ['127.0.0.1:1234'],
                username: 'test',
                password: 'test',
                logFn: function(message) {
                    if(message) {
                        expect(message).to.equal('\u001b[36mtest@127.0.0.1:1234 ~$ \u001b[39mConnection error: \u001b[31mError: connect ECONNREFUSED 127.0.0.1:1234\u001b[39m');
                        done();
                    }
                },
                commands: [
                    {
                        hint: 'hint',
                        input: 'echo 1'
                    }
                ]
            }
        });
    });
});
