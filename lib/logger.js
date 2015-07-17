'use strict';

var colors = require('colors/safe');

module.exports = function(logFn) {
    return {
        logs: [],
        write: function(host, msg, fn) {
            (this.logs[host] = this.logs[host] || []).push(colors.cyan(host) + fn(msg || 'OK'));
        },
        flush: function(host) {
            while(this.logs[host].length > 0) {
                logFn(this.logs[host].shift());
            }
            logFn('');
        }
    };
};
