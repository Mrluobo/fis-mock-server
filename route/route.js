/**
 * @file
 * Created by wangzhicheng on 16/1/20.
 */
var router = require('koa-router')();


module.exports = function (app) {
    router.get('/', function *(next) {
        yield next
    })
    app.use(router.routes())
}