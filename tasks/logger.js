'use strict';

module.exports = function(logFn) {
    return {
        logs: [],
        write: function(host, msg, fn) {
            (this.logs[host] = this.logs[host] || []).push(host.cyan + fn(msg || 'OK'));
        },
        flush: function(host) {
            while(this.logs[host].length > 0) {
                logFn(this.logs[host].shift());
            }
            logFn('');
        }
    };
};
