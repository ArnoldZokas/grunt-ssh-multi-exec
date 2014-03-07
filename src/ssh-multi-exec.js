'use strict';

var fs  = require('fs'),
    ssh = require('ssh2'),
    log = console.log;

var init = function() {
    var done = this.async(),
        config = this.data,
        host = config.hosts[0],
        port = config.port,
        username = config.username,
        privateKey = config.privateKey,
        commands = config.commands,
        tunnel = new ssh();

    tunnel.on('ready', function() {
        var shellPrefix = (username + '@' + host + ':~$ ').cyan,
            command = commands[0].command.toString();

        log('\n\n' + shellPrefix + (command).yellow);

        tunnel.exec(command.toString(), function(err, stream) {
            if (err) throw err;

            stream.on('data', function(data) {
                log(shellPrefix + data.toString().green);
                commands[0].success(data.toString());
            });

            stream.on('close', function() {
                done();
            });
        });
    });

    tunnel.on('error', function(err) {
        log('Connection error: ' + err);
        done();
    });

    tunnel.connect({
        host: host,
        port: port,
        username: username,
        privateKey: fs.readFileSync(privateKey)
    });
};

module.exports = function(grunt) {
    grunt.registerMultiTask('ssh-multi-exec', 'Execute series of SSH commands', init);
    return init;
};