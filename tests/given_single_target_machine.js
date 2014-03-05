'use strict';

var grunt = require('grunt');

exports.when_executing_single_command = {
    it_should_execute_successfully: function(test) {
        test.expect(1);

        test.equal(true, true);

        test.done();
    }
};