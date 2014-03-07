#grunt-ssh-multi-exec [![Build Status](https://travis-ci.org/ArnoldZokas/grunt-ssh-multi-exec.png?branch=master)](https://travis-ci.org/ArnoldZokas/grunt-ssh-multi-exec)
> Execute set of SSH commands against multiple boxes

###Getting Started
```shell
npm install grunt-ssh-multi-exec --save-dev
```

###Examples
####Single machine, single command
```js
config: {
  hosts: ['127.0.0.1'],
  port: 22,
  username: 'user',
  privateKey: '/path/to/private/key',
  commands: [
    {
      input: 'touch me'
    }
  ]
}
```

####Single machine, single command (with callbacks)
```js
config: {
  hosts: ['127.0.0.1'],
  port: 22,
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

###Release History
* **v0.1.0** (2014-03-08) - initial release

###Contributors
* [@matteofigus](https://github.com/matteofigus)
* [@jankowiakmaria](https://github.com/jankowiakmaria)
