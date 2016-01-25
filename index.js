/**
 * @file
 * Created by wangzhicheng on 16/1/25.
 */

var koa = require('koa');
var app = koa();
var http = require('http');
var path = require('path');
var querystring = require('querystring');
var zlib = require('zlib');
var parse = require('co-body');
var serve = require('koa-static');


// 返回用户目录
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}


var home = getUserHome();

// 读取配置文件
var confPath = path.join(home, '.mock/server-conf.js');
var config = require(confPath);

// 静态服务器  默认为index.html
app.use(serve(path.join(home, '.mock'), {
    index: 'index.html'
}))


// options
function Options() {
    this.hostname = config.hostname;
    if (config.port) {
        this.port = config.port;
    } else {
        this.port = null;
    }
    this.method = 'GET';
    this.path = '/';
}

// 优先处理文件上传 multipart类型请求
app.use(function * (next) {
    if (!this.request.is('multipart/*')) {
        return yield next;
    }
    var self = this;
    var options = new Options();
    options.method = 'POST';
    options.path = this.request.url;
    options.headers = this.request.header;
    options.headers.referer = options.hostname + options.path;
    options.headers.host = options.hostname;

    yield new Promise(function (reslove, reject) {
        var req = http.request(options, function (res) {
            self.res.writeHead(res.statusCode, res.headers);
            res.pipe(self.res);
        })
        req.on('error', function (error) {
            console.log(error);
        })
        self.req.pipe(req, {end: false})
        self.req.on('end', function () {
            req.end()
        })
    })
})
// 处理普通get
app.use(function *(next) {
    if(this.request.method != 'GET'){
        return yield next;
    }
    var self = this;
    var options = new Options();

    options.path = this.request.url;
    options.headers = this.request.header;
    options.headers.referer = options.hostname + options.path;
    options.headers.host = options.hostname;

    yield new Promise(function (reslove, reject) {
        var req = http.request(options, function (res) {
            self.res.writeHead(res.statusCode, res.headers);
            res.pipe(self.res);
        })
        req.on('error', function (error) {
            console.log(error);
        })
        req.end();
    })
});
// 处理普通POST
app.use(function *() {
    if(this.request.method != 'POST'){
        return yield next;
    }
    var self = this;
    var options = new Options();

    options.path = this.request.url;
    options.headers = this.request.header;
    options.headers.referer = options.hostname + options.path;
    options.headers.host = options.hostname;
    options.method = 'POST';
    var body = yield parse(this);
    var postData = querystring.stringify(body);
    yield new Promise(function (reslove, reject) {
        var req = http.request(options, function (res) {
            self.res.writeHead(res.statusCode, res.headers);
            res.pipe(self.res);
        })
        req.on('error', function (error) {
            console.log(error);
        });
        req.write(postData);
        req.end();
    })
})

app.listen(3000);
console.log('listen at : 3000')