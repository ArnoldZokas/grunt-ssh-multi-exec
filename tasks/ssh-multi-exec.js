'use strict';

var fs    = require('fs'),
    async = require('async'),
    ssh   = require('ssh2'),
    noop  = function() {};

var init = function() {
    var done       = this.async(),
        logs       = [],
        target     = this.target,
        config     = this.data,
        hosts      = config.hosts,
        username   = config.username,
        privateKey = config.privateKey,
        password   = config.password;

    var writeBufferedLog = function(host, msg, fn) {
        (logs[host] = logs[host] || []).push(host.cyan + fn(msg || 'OK'));
    };

    var flushBufferedLog = function(host) {
        while(logs[host].length > 0) {
            console.log(logs[host].shift());
        }
        console.log('');
    };

    var executeCommandSet = function(target, callback) {
        var tunnel      = new ssh(),
            host        = target.split(':')[0],
            port        = target.split(':')[1],
            commands    = config.commands.slice(),
            shellPrefix = (username + '@' + host + ':' + port + ' ~$ '),
            response    = [],
            lastError   = null;

        tunnel.on('ready', function() {
            var executeCommand = function(command) {
                var hint    = command.hint,
                    input   = command.input.toString(),
                    success = command.success || noop,
                    error   = command.error || noop,
                    force   = command.force || false;

                if(hint) {
                    writeBufferedLog(shellPrefix, '# ' + hint + (force ? ' (force)' : ''), function(x) { return x.grey; });
                }

                writeBufferedLog(shellPrefix, input, function(x) { return x.yellow; });

                tunnel.exec(input, function(err, stream) {
                    if (err) {
                        throw err;
                    }

                    stream.on('data', function(data, extended) {
                        data = data.toString();
                        if(extended === 'stderr') {
                            lastError = data;
                        } else {
                            lastError = null;
                            response[shellPrefix + input] = data;
                        }
                    });

                    stream.on('close', function(){
                        if(lastError) {
                            writeBufferedLog(shellPrefix, lastError, function(x) { return x.red; });
                            flushBufferedLog(shellPrefix);
                            error(lastError, { host: host, port: port });

                            if(force === false) {
                                callback(null, null);
                                return;
                            }
                        }
                        else {
                            var data = response[shellPrefix + input];
                            writeBufferedLog(shellPrefix, data, function(x) { return x.green; });
                            flushBufferedLog(shellPrefix);
                            success(data, { host: host, port: port });
                        }

                        if(commands.length > 0) {
                            executeCommand(commands.shift());
                        } else {
                            callback(null, null);
                        }
                    });
                });
            };

            executeCommand(commands.shift());
        });

        tunnel.on('error', function(err) {
            writeBufferedLog(shellPrefix, 'Connection error: ' + err.red);
            flushBufferedLog(shellPrefix);
            done();
        });

        if(privateKey) {
            tunnel.connect({
                host: host,
                port: port,
                username: username,
                privateKey: fs.readFileSync(privateKey)
            });
        } else {
            tunnel.connect({
                host: host,
                port: port,
                username: username,
                password: password
            });
        }
    };

    if(config.maxDegreeOfParallelism) {
        console.log(('\n\nexecuting command set "' + target + '" (maxDegreeOfParallelism: ' + config.maxDegreeOfParallelism + ')').underline);
        async.eachLimit(hosts, config.maxDegreeOfParallelism, executeCommandSet, function(){
            done();
        });
    } else {
        console.log(('\n\nexecuting command set "' + target + '"').underline);
        async.each(hosts, executeCommandSet, function(){
            done();
        });
    }
};

module.exports = function(grunt) {
    grunt.registerMultiTask('ssh-multi-exec', 'Execute series of SSH commands', init);
    return init;
};