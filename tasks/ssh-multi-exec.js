'use strict';

var fs    = require('fs'),
    async = require('async'),
    ssh   = require('ssh2'),
    grunt = require('grunt');

var init = function() {
    var done       = this.async(),
        logs       = [],
        target     = this.target,
        config     = this.data,
        hosts      = config.hosts,
        username   = config.username,
        privateKey = config.privateKey,
        password   = config.password;

    var defaultErrorHandler = function(error, context, done) {
        if(!context.force) {
            grunt.fail.fatal(error);
        }
        done();
    };

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
                    success = command.success || function(_, __, done) { done(); },
                    error   = command.error || defaultErrorHandler,
                    force   = command.force || false;

                if(hint) {
                    writeBufferedLog(shellPrefix, '# ' + hint + (force ? ' (force)' : ''), function(x) { return x.grey; });
                }

                writeBufferedLog(shellPrefix, input, function(x) { return x.yellow; });

                tunnel.exec(input, function(err, stream) {
                    if (err) {
                        throw err;
                    }

                    lastError = null;

                    stream.on('data', function(data) {
                        response[shellPrefix + input] = data.toString();
                    });

                    stream.stderr.on('data', function(data) {
                        if(data != null) {
                            if(lastError === null) {
                                lastError = data.toString();
                            } else {
                                lastError += data.toString();
                            }
                        }
                    });

                    stream.on('close', function(){
                        var next = function() {
                            if(commands.length > 0) {
                                executeCommand(commands.shift());
                            } else {
                                callback(null, null);
                            }
                        };

                        if(lastError) {
                            writeBufferedLog(shellPrefix, lastError, function(x) { return x.red; });
                            flushBufferedLog(shellPrefix);
                            error(lastError, { host: host, port: port, force: force }, function() {
                                if(force === false) {
                                    callback(null, null);
                                    return;
                                }

                                next();
                            });
                        }
                        else {
                            var data = response[shellPrefix + input];
                            writeBufferedLog(shellPrefix, data, function(x) { return x.green; });
                            flushBufferedLog(shellPrefix);
                            success(data, { host: host, port: port }, function() {
                                next();
                            });
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