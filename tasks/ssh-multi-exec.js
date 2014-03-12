'use strict';

var fs    = require('fs'),
    async = require('async'),
    ssh   = require('ssh2');

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
        var entry = msg ? host.cyan + fn(msg) : '';
        (logs[host] = logs[host] || []).push(entry);
    };

    var flushBufferedLog = function(host) {
        while(logs[host].length > 0) {
            console.log(logs[host].shift());
        }
    };

    var executeCommandSet = function(target, callback) {
        var tunnel      = new ssh(),
            host        = target.split(':')[0],
            port        = target.split(':')[1],
            commands    = config.commands.slice(),
            shellPrefix = (username + '@' + host + ':' + port + ' ~$ '),
            response    = [],
            lastError   = [];

        tunnel.on('ready', function() {
            var executeCommand = function(command) {
                var input   = command.input.toString(),
                    success = command.success || function() {},
                    error   = command.error || function() {};

                writeBufferedLog(shellPrefix, input, function(x) { return x.yellow });

                tunnel.exec(input, function(err, stream) {
                    if (err) {
                        throw err;
                    }

                    stream.on('data', function(data, extended) {
                        data = data.toString();
                        if(extended === 'stderr') {
                            writeBufferedLog(shellPrefix, data, function(x) { return x.red });
                            flushBufferedLog(shellPrefix);
                            lastError[shellPrefix] = data;
                            error(data);
                        } else {
                            response[shellPrefix + input] = data;
                        }
                    });

                    stream.on('close', function(){
                        if(lastError[shellPrefix]) {
                            callback(null, null);
                            return;
                        }

                        var data = response[shellPrefix + input];
                        writeBufferedLog(shellPrefix, data, function(x) { return x.green });
                        success(data);

                        if(commands.length > 0) {
                            executeCommand(commands.shift());
                        } else {
                            flushBufferedLog(shellPrefix);
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

    console.log(('\n\nexecuting command set "' + target + '" against hosts: ' + config.hosts).underline);
    async.each(hosts, executeCommandSet, function(){
        done();
    });
};

module.exports = function(grunt) {
    grunt.registerMultiTask('ssh-multi-exec', 'Execute series of SSH commands', init);
    return init;
};