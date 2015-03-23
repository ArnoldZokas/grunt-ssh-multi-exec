#grunt-ssh-multi-exec
> Execute a set of SSH commands against multiple boxes

[![Build Status](https://travis-ci.org/ArnoldZokas/grunt-ssh-multi-exec.svg?branch=master)](https://travis-ci.org/ArnoldZokas/grunt-ssh-multi-exec) [![Dependency Status](https://david-dm.org/ArnoldZokas/grunt-ssh-multi-exec.svg)](https://david-dm.org/ArnoldZokas/grunt-ssh-multi-exec) [![NPM version](https://badge.fury.io/js/grunt-ssh-multi-exec.svg)](http://badge.fury.io/js/grunt-ssh-multi-exec)

[![NPM](https://nodei.co/npm/grunt-ssh-multi-exec.png?downloads=true&stars=true)](https://nodei.co/npm/grunt-ssh-multi-exec)

## Getting Started
This plugin requires Grunt `0.4.x`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-ssh-multi-exec --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-ssh-multi-exec');
```

##Overview
In your project's Gruntfile, add a section named `grunt-ssh-multi-exec` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  'ssh-multi-exec': {
    your_target: {
      hosts: ['127.0.0.1:2222'],
      username: 'user',
      privateKey: '/path/to/private/key',
      commands: [
        {
          input: 'uptime',
          success: function(data, context, done) {
            // optional callback
            // 'data' contains stdout response from the target box
            // 'context' contains:
            // {
            //   'host': '127.0.0.1',
            //   'port': '2222'
            // }
            done();
          },
          error: function(err, context, done) {
            // optional callback
            // 'err' contains stderr response from the target box
            // 'context' contains:
            // {
            //   'host': '127.0.0.1',
            //   'port': '2222',
            //   'force': false
            // }
            done();
          }
        }
      ]
    },
  },
});
```
Commands are executed sequentially, in the specified order.<br />
Command sets are executed against all specified hosts in parallel. You can control the number of parallel executions by setting `maxDegreeOfParallelism`.

##Examples
###Single machine, single command
```js
config: {
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  privateKey: '/path/to/private/key',
  commands: [
    {
      input: 'touch me'
    }
  ]
}
```

###Single machine, single command (with limited parallelism)
```js
config: {
  maxDegreeOfParallelism: 1,
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  privateKey: '/path/to/private/key',
  commands: [
    {
      input: 'touch me'
    }
  ]
}
```

###Single machine, single command (with callbacks)
```js
config: {
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  privateKey: '/path/to/private/key',
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
```

###Password authentication
```js
config: {
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  password: 'password',
  commands: [
    {
      input: 'touch me'
    }
  ]
}
```

###Private key with passphrase
```js
config: {
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  privateKey: '/path/to/private/key',
  passphrase: 'passphrase',
  commands: [
    {
      input: 'touch me'
    }
  ]
}
```

###Single machine, multiple commands
```js
config: {
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  privateKey: '/path/to/private/key',
  commands: [
    {
      input: 'touch me'
    },
    {
      input: 'touch again'
    }
  ]
}
```

###Single machine, multiple commands (with `force` option)
```js
config: {
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  privateKey: '/path/to/private/key',
  commands: [
    {
      input: 'this will fail',
      force: true,
      error: function(err, context, done) {
        console.log(err);
        done();
      }
    },
    {
      input: 'touch again',
      success: function(data, context, done) {
        console.log('but the show goes on...');
        done();
      }
    }
  ]
}
```

###Multiple machines, multiple commands
```js
config: {
  hosts: ['127.0.0.1:2222', '127.0.0.1:2223'],
  username: 'user',
  privateKey: '/path/to/private/key',
  commands: [
    {
      input: 'touch me'
    },
    {
      input: 'touch again'
    }
  ]
}
```

##Release History
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
 * **Breaking change!** - see port configration
 * added support for executing commands against multiple boxes
 * added log message batching (clean, coherent logs)
* **v0.1.2** (2014-03-10)
 * added password-based authentication
* **v0.1.0** (2014-03-07)
 * initial release

##Contributors
* [@matteofigus](https://github.com/matteofigus)
* [@jankowiakmaria](https://github.com/jankowiakmaria)
