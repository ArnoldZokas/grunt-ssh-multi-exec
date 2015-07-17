'use strict';

var async  = require('async'),
    colors = require('colors/safe'),
    fs     = require('fs'),
    grunt  = require('grunt'),
    ssh    = require('ssh2');

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
                    logger.write(shellPrefix, '# ' + hint + (force ? ' (force)' : ''), function(x) { return colors.grey(x); });
                }

                logger.write(shellPrefix, input, function(x) { return colors.yellow(x); });

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
                            logger.write(shellPrefix, lastError, function(x) { return colors.red(x); });
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
                            logger.write(shellPrefix, data, function(x) { return colors.green(x); });
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
            logger.write(shellPrefix, 'Connection error: ' + colors.red(err), function(x) { return x; });
            logger.flush(shellPrefix);
            next();
        });

        if(config.privateKey) {
            fs.exists(config.privateKey, function(exists) {
                if(exists) {
                    fs.readFile(config.privateKey, function(error, privateKey) {
                        if(error) {
                            logger.write(shellPrefix, 'Failed to load private key from path ' + config.privateKey, function(x) { return x; });
                            logger.flush(shellPrefix);
                            next();
                        }

                        try {
                            tunnel.connect({
                                host: host,
                                port: port,
                                username: username,
                                privateKey: privateKey,
                                passphrase: config.passphrase
                            });
                        } catch(error) {
                            logger.write(shellPrefix, 'Connection error: ' + colors.red(error), function(x) { return x; });
                            logger.flush(shellPrefix);
                            next();
                        }
                    });
                } else {
                    logger.write(shellPrefix, 'Failed to load private key from path ' + config.privateKey, function(x) { return x; });
                    logger.flush(shellPrefix);
                    next();
                }
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
        logger.write('', colors.underline('\n\nexecuting command set "' + target + '" (maxDegreeOfParallelism: ' + config.maxDegreeOfParallelism + ')'), function(x) { return x; });
        async.eachLimit(config.hosts, config.maxDegreeOfParallelism, executeCommandSet, function() {
            next();
        });
    } else {
        logger.write('', colors.underline('\n\nexecuting command set "' + target + '"'), function(x) { return x; });
        async.each(config.hosts, executeCommandSet, function() {
            next();
        });
    }
};

module.exports = function(grunt) {
    grunt.registerMultiTask('ssh-multi-exec', 'Execute series of SSH commands', init);
    return init;
};
