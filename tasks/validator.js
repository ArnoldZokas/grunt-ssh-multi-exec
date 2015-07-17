'use strict';

var joi    = require('joi'),
    grunt  = require('grunt'),
    schema = require('./schema');

module.exports = {
    isValid: function(config) {
        var isValid = true;

        var taskOptionValidationResult = joi.validate(config, schema.task);
        if(taskOptionValidationResult.error) {
            grunt.fail.fatal(taskOptionValidationResult.error);
            isValid = false;
            return isValid;
        }

        config.commands.forEach(function(command) {
            var commandParameterValidationResult = joi.validate(command, schema.command);
            if(commandParameterValidationResult.error) {
                grunt.fail.fatal(commandParameterValidationResult.error);
                isValid = false;
                return isValid;
            }
        });

        return isValid;
    }
};
