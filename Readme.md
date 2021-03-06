fis-mock-server


# fis-mock-server [![NPM version][npm-image]][npm-url] [![Dependency Status][daviddm-image]][daviddm-url]


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

add
```
fis.match('server-conf.js',{
    useHash:false,
    release:'/$0',
    isMod:false
})

```
into `fis-conf.js`

then release files in `~/.mock/` use [fis3](https://github.com/fex-team/fis3)

`fis3 release -d ~/.mock/`

or

add
```
fis.media('test').match('*',{
    deploy: fis.plugin('local-deliver', {
        to: '~/.mock'
    }
})
```

open  `http://127.0.0.1:3000/` will see your project

### stop
Run `fis-mock-server stop`

### kill

Run `fis-mock-server kill`

## todo

#### Custom listen port



# License
 MIT © 2015 mrluobo (602003869@qq.com)

 [npm-image]: https://badge.fury.io/js/fis-mock-server.svg
 [npm-url]: https://www.npmjs.com/package/fis-mock-server
 [daviddm-image]: https://david-dm.org/Mrluobo/fis-mock-server.svg?theme=shields.io
 [daviddm-url]: https://david-dm.org/Mrluobo/fis-mock-server.svg