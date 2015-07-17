'use strict';

var async = require('async'),
    fs    = require('fs'),
    grunt = require('grunt'),
    ssh   = require('ssh2');

var defaultErrorHandler = function(error, context, done) {
    if(!context.force) {
        grunt.fail.fatal(error);
    }
    done();
};

var init = function() {
    var next      = this.async(),
        target    = this.target,
        config    = this.data,
        username  = config.username,
        logger    = require('./logger')(config.logFn || console.log),
        validator = require('./validator');

    if(validator.isValid(config) === false) {
        return;
    }

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
                    logger.write(shellPrefix, '# ' + hint + (force ? ' (force)' : ''), function(x) { return x.grey; });
                }

                logger.write(shellPrefix, input, function(x) { return x.yellow; });

                tunnel.exec(input, function(err, stream) {
                    if (err) {
                        throw err;
                    }

                    lastError = null;

                    stream.on('data', function(data) {
                        response[shellPrefix + input] = data.toString();
                    });

                    stream.stderr.on('data', function(data) {
                        if(data !== null) {
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
                            logger.write(shellPrefix, lastError, function(x) { return x.red; });
                            logger.flush(shellPrefix);
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
                            logger.write(shellPrefix, data, function(x) { return x.green; });
                            logger.flush(shellPrefix);
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
            logger.write(shellPrefix, 'Connection error: ' + err.red);
            logger.flush(shellPrefix);
            next();
        });

        if(config.privateKey) {
            tunnel.connect({
                host: host,
                port: port,
                username: username,
                privateKey: fs.readFileSync(config.privateKey),
                passphrase: config.passphrase
            });
        } else {
            tunnel.connect({
                host: host,
                port: port,
                username: username,
                password: config.password
            });
        }
    };

    if(config.maxDegreeOfParallelism) {
        logger.write('', ('\n\nexecuting command set "' + target + '" (maxDegreeOfParallelism: ' + config.maxDegreeOfParallelism + ')').underline, function(x) { return x; });
        async.eachLimit(config.hosts, config.maxDegreeOfParallelism, executeCommandSet, function() {
            next();
        });
    } else {
        logger.write('', ('\n\nexecuting command set "' + target + '"').underline, function(x) { return x; });
        async.each(config.hosts, executeCommandSet, function() {
            next();
        });
    }
};

module.exports = function(grunt) {
    grunt.registerMultiTask('ssh-multi-exec', 'Execute series of SSH commands', init);
    return init;
};
