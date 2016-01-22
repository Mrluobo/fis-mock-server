/**
 * @file
 * Created by wangzhicheng on 16/1/20.
 */
var koa = require('koa');
var app = koa();
var http = require('http');
//var url = require('url');
var path = require('path');
var querystring = require('querystring');
var zlib = require('zlib');
var parse = require('co-body');
//var route = require('./route/route.js');
var serve = require('koa-static');
// 返回用户目录
function getUserHome() {
    return process.env.HOME || process.env.USERPROFILE;
}
var home = getUserHome();
console.log(path.join(home,'.mock'))
app.use(serve(path.join(home,'.mock'),{
    index:'index.html'
}))
//route(app);

// static-catche 不支持index.html 改用 koa-static
//var staticCache = require('koa-static-cache');
//app.use(staticCache(path.join(__dirname, 'public'), {
//    maxAge: 365 * 24 * 60 * 60,
//    gzip: true
//}))


app.use(function *(next) {
    var body;
    var reqUrl;
    var options = {
        hostname: 'mbc.baidu.com',
        port: null,
        path: '/',
        method: 'GET',
    };
    var data;
    var self = this;

    options.path = this.request.url;
    options.headers = this.request.header;
    options.headers.referer = options.hostname + options.path;
    options.headers.host = options.hostname;

    if (this.request.method === 'GET') {
        data = yield new Promise(function (reslove, reject) {
            var req = http.request(options, function (res) {
                self.res.writeHead(res.statusCode, res.headers);
                res.on('data', function (data) {
                    self.res.write(data);
                })
                res.on('end', function () {
                    self.res.end();
                    reslove()
                })
            })
            req.on('error', function (error) {
                console.log(error);
            })
            req.end();
        })

    } else if (this.request.method === 'POST') {
        console.log(options);
        options.method = 'POST';
        //reqUrl = url.parse(this.request.url);
        var body = yield parse(this);
        var postData = querystring.stringify(body);
        console.log(body);
        data = yield new Promise(function (reslove, reject) {
            var req = http.request(options, function (res) {
                self.res.writeHead(res.statusCode, res.headers);
                res.on('data', function (data) {
                    self.res.write(data);
                })
                res.on('end', function () {
                    self.res.end();
                    reslove()
                })
            })
            req.on('error', function (error) {
                console.log(error);
            });
            req.write(postData);
            req.end();
        })
    }
});

app.listen(3000);
console.log('listen at : 3000')


// 以下内容为  解析zlib
//    res.on('data', function (data) {
//        // console.log(data);
//        //console.log(data);
//        chunks.push(data);
//        console.log(data)
//        size += data.length;
//    })
//    res.on('end', function () {
//        var data = null;
//        switch (chunks.length) {
//            case 0:
//                data = new Buffer(0);
//                break;
//            case 1:
//                data = chunks[0];
//                break;
//            default:
//                data = new Buffer(size);
//                for (var i = 0, pos = 0, l = chunks.length; i < l; i++) {
//                    var chunk = chunks[i];
//                    chunk.copy(data, pos);
//                    pos += chunk.length;
//                }
//                break;
//        }
//        if (res.headers['content-encoding'] && res.headers['content-encoding'].indexOf('gzip') != -1) {
//            zlib.unzip(data, function (error, buffer) {
//                if (!error) {
//                    reslove(buffer.toString())
//                }
//            })
//        } else {
//            reslove(data.toString())
//        }
//    })
//})