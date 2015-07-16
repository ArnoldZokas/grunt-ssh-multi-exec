'use strict';

var joi = require('joi');

module.exports = {
    task: {
        hosts: joi.array().items(joi.string().required()).required(),
        maxDegreeOfParallelism: joi.number(),
        username: joi.string().required(),
        password:  joi.string(),
        privateKey: joi.string(),
        passphrase: joi.string(),
        logFn: joi.func(),
        commands: joi.array().items(joi.object().required()).required()
    },
    command: {
        hint: joi.any(),
        input: joi.string().required(),
        force: joi.boolean(),
        success: joi.func(),
        error: joi.func()
    }
};
