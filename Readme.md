fis-mock-server
 # fis-mock-server [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]
[![npm version](https://badge.fury.io/js/fis-mock-server.svg)](https://badge.fury.io/js/fis-mock-server)
a rewrite server build with [koa](https://github.com/koajs/koa) and [pm2](https://github.com/Unitech/pm2)
 ## Installation

 Run `npm install fis-mock-server -g`

 ## Usage

### start
Run `fis-mock-server start`

add a `server-conf.js` file in your project
eg:
```
module.exports = {
    hostname: 'www.baidu.com', // request that sent to localhost will be rewrited to hostname you config here
    port: 8888 // defult null
}
```

then release files in `~/.mock/` use [fis3](https://github.com/fex-team/fis3)

`fis3 release -d ~/.mock/`

### stop
Run `fis-mock-server stop`

### kill

Run `fis-mock-server kill`




 # License
 MIT © 2015 mrluobo (602003869@.com)

 [npm-image]: https://badge.fury.io/js/fis-mock-server.svg
 [npm-url]: https://www.npmjs.com/package/fis-mock-server
 [daviddm-image]: https://david-dm.org/Mrluobo/fis-mock-server.svg?theme=shields.io
 [daviddm-url]: https://david-dm.org/Mrluobo/fis-mock-server.svg