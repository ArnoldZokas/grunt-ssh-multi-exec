#grunt-ssh-multi-exec
> Execute a set of SSH commands against multiple boxes

[![Build Status](https://semaphoreci.com/api/v1/projects/32a3b1ae-251c-48d1-ba91-9cd3106f7135/380458/badge.png)](https://semaphoreci.com/ArnoldZokas/grunt-ssh-multi-exec)[![Dependency Status](https://david-dm.org/ArnoldZokas/grunt-ssh-multi-exec.svg)](https://david-dm.org/ArnoldZokas/grunt-ssh-multi-exec) [![NPM version](https://badge.fury.io/js/grunt-ssh-multi-exec.svg)](http://badge.fury.io/js/grunt-ssh-multi-exec)

[![NPM](https://nodei.co/npm/grunt-ssh-multi-exec.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-ssh-multi-exec)

## Getting Started
This plugin requires Grunt `0.4.x`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm i grunt-ssh-multi-exec --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ssh-multi-exec');
```

## Overview
In your project's Gruntfile, add a section named `grunt-ssh-multi-exec` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'ssh-multi-exec': {
    echo: {
      hosts: ['192.168.1.64:22', '192.168.1.65:22'],
      username: 'user',
      password: '********',
      commands: [
        {
          input: 'echo 1'
        },
        {
          input: 'echo 2'
        }
      ]
    }
  }
});
```

## Authentication Options
### Password
```js
grunt.initConfig({
  'ssh-multi-exec': {
    echo: {
      hosts: ['127.0.0.1:22'],
      username: 'user',
      password: '********',
      commands: [
        {
          input: 'echo 1'
        }
      ]
    }
  }
});
```

### Private Key
```js
grunt.initConfig({
  'ssh-multi-exec': {
    echo: {
      hosts: ['127.0.0.1:22'],
      username: 'user',
      privateKey: '/path/to/private/key',
      passphrase: 'passphrase', // optional
      commands: [
        {
          input: 'echo 1'
        }
      ]
    }
  }
});
```

## Additional Options
### Limited Parallelism
By default, this module will execute commands against all specified hosts all at once.<br />
Setting `maxDegreeOfParallelism` will split available hosts into multiple batches; each batch no greater than the specified number. In this example, hosts will be split into two batches with two hosts per batch:
```js
grunt.initConfig({
  'ssh-multi-exec': {
    echo: {
      hosts: ['192.168.1.64:22', '192.168.1.65:22', '192.168.1.66:22', '192.168.1.67:22'],
      maxDegreeOfParallelism: 2
      username: 'user',
      password: '********',
      commands: [
        {
          input: 'echo 1'
        }
      ]
    }
  }
});
```

### Forced Execution
In some scenarios it is useful to be able to continue execution of a command set despite failures.<br />
A boolean `force` flag applied at command level allows you to mark individual commands for forced execution.<br />
In this example, second command will execute even though first had failed:
```js
grunt.initConfig({
  'ssh-multi-exec': {
    echo: {
      hosts: ['127.0.0.1:22'],
      username: 'user',
      password: '********',
      commands: [
        {
          input: '/etc/init.d/my_svc stop',
          force: true
        },
        {
          input: 'rm -rf /var/www/my_svc'
        }
      ]
    }
  }
});
```

### Success and Error Handlers
Optional `success` and `error` handlers can be defined at individual command level to handle additional tasks such as logging or cleanup:
```js
grunt.initConfig({
  'ssh-multi-exec': {
    echo: {
      hosts: ['127.0.0.1:22'],
      username: 'user',
      password: '********',
      commands: [
        {
          input: 'touch me',
          success: function(data, context, done) {
            console.log(data);
            done();
          },
          error: function(err, context, done) {
            console.log(err);
            done();
          }
        }
      ]
    }
  }
});
```

## Release History
* **v4.2.0** (2015-03-23)
 * updated dependencies
* **v4.1.0** (2015-01-20)
 * added `passphrase` option
* **v4.0.4** (2014-11-26)
 * fixed error reporting
* **v4.0.3** (2014-08-31)
 * fixed error noop behaviour
* **v4.0.2** (2014-08-31)
 * fixed error noop behaviour
* **v4.0.1** (2014-08-05)
 * fixed noop behaviour
* **v4.0.0** (2014-08-05)
 * made callback behaviour more deterministic (to allow long-running operations to block further ssh command execution)
 * updated dependencies
 * updated to ssh2 v0.3.4 (hopefully, this will put an end to internal ssh2 errors we've been seeing)
* **v3.1.1** (2014-03-19)
 * fixed a `force` option bug that was preventing execution of subsequent commands in some scenarios
* **v3.1.0** (2014-03-18)
 * added `force` option
* **v3.0.0** (2014-03-14)
 * **Breaking change!** - remove `mode` option
 * added `maxDegreeOfParallelism` option
* **v2.4.0** (2014-03-14)
 * added option to execute command sets sequentially
* **v2.3.0** (2014-03-13)
 * added context to success and error callbacks
* **v2.2.0** (2014-03-12)
 * fixed dependency versioning
* **v2.1.0** (2014-03-12)
 * fixed bug that was preventing execution of commands that do not return a response
* **v2.0.0** (2014-03-11)
 * **Breaking change!** - task renamed to `ssh-multi-exec`
* **v1.0.0** (2014-03-10)
 * **Breaking change!** - see port configuration
 * added support for executing commands against multiple boxes
 * added log message batching (clean, coherent logs)
* **v0.1.2** (2014-03-10)
 * added password-based authentication
* **v0.1.0** (2014-03-07)
 * initial release

##Contributors
* [@matteofigus](https://github.com/matteofigus)
* [@jankowiakmaria](https://github.com/jankowiakmaria)
