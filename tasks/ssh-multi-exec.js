'use strict';

var joi   = require('joi'),
    fs    = require('fs'),
    async = require('async'),
    ssh   = require('ssh2'),
    grunt = require('grunt');

var defaultErrorHandler = function(error, context, done) {
    if(!context.force) {
        grunt.fail.fatal(error);
    }
    done();
};

var init = function() {
    var done       = this.async(),
        target     = this.target,
        config     = this.data,
        hosts      = config.hosts,
        username   = config.username,
        privateKey = config.privateKey,
        password   = config.password,
        passphrase = config.passphrase,
        logger     = require('./logger')(config.logFn || console.log);

    var taskOptionValidationResult = joi.validate(config, require('./schema').task);
    if(taskOptionValidationResult.error) {
        return grunt.fail.fatal(taskOptionValidationResult.error);
    }

    var exit = false;
    config.commands.forEach(function(command) {
        var commandParameterValidationResult = joi.validate(command, require('./schema').command);
        if(commandParameterValidationResult.error) {
            exit = true;
            return grunt.fail.fatal(commandParameterValidationResult.error);
        }
    });

    if (exit) {
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
            done();
        });

        if(privateKey) {
            tunnel.connect({
                host: host,
                port: port,
                username: username,
                privateKey: fs.readFileSync(privateKey),
                passphrase: passphrase
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
        logger.write('', ('\n\nexecuting command set "' + target + '" (maxDegreeOfParallelism: ' + config.maxDegreeOfParallelism + ')').underline, function(x) { return x; });
        async.eachLimit(hosts, config.maxDegreeOfParallelism, executeCommandSet, function() {
            done();
        });
    } else {
        logger.write('', ('\n\nexecuting command set "' + target + '"').underline, function(x) { return x; });
        async.each(hosts, executeCommandSet, function() {
            done();
        });
    }
};

module.exports = function(grunt) {
    grunt.registerMultiTask('ssh-multi-exec', 'Execute series of SSH commands', init);
    return init;
};
