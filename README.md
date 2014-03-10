#grunt-ssh-multi-exec [![Build Status](https://travis-ci.org/ArnoldZokas/grunt-ssh-multi-exec.png?branch=master)](https://travis-ci.org/ArnoldZokas/grunt-ssh-multi-exec)
> Execute a set of SSH commands against multiple boxes

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
  'grunt-ssh-multi-exec': {
    your_target: {
      hosts: ['127.0.0.1:2222'],
      username: 'user',
      privateKey: '/path/to/private/key',
      commands: [
        {
          input: 'uptime',
          success: function(data) {
            // optional callback
            // 'data' contains  stdout response from the targer box
          },
          error: function(err) {
            // optional callback
            // 'data' contains  stderr response from the targer box
          }
        }
      ]
    },
  },
});
```
Commands execute sequentially, in the order specified.

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

###Single machine, single command (with callbacks)
```js
config: {
  hosts: ['127.0.0.1:2222'],
  username: 'user',
  privateKey: '/path/to/private/key',
  commands: [
    {
      input: 'touch me',
      success: function(data) {
        console.log(data);
      },
      error: function(err) {
        console.log(err);
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
