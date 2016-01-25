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
var fileparse = require('co-busboy');
//var route = require('./route/route.js');
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

// 未来会引入mock 假数据会用到路由
//route(app);


// static-cache 不支持index.html 改用 koa-static
//var staticCache = require('koa-static-cache');
//app.use(staticCache(path.join(__dirname, 'public'), {
//    maxAge: 365 * 24 * 60 * 60,
//    gzip: true
//}))


// 优先处理文件上传 multipart类型请求
app.use(function * (next) {
    if (!this.request.is('multipart/*')) {
        return yield next;
    }
    var options = {
        hostname: '',
        port: null,
        path: '/',
        method: 'POST',
    };
    options.hostname = config.hostname;
    if (config.port) {
        options.port = config.port;
    }

    var data;
    var self = this;

    options.path = this.request.url;
    options.headers = this.request.header;
    options.headers.referer = options.hostname + options.path;
    options.headers.host = options.hostname;
    data = yield new Promise(function (reslove, reject) {
        var req = http.request(options, function (res) {
            self.res.writeHead(res.statusCode, res.headers);

            res.pipe(self.res);

            //res.on('data', function (data) {
            //    self.res.write(data);
            //})
            //res.on('end', function () {
            //    self.res.end();
            //    reslove()
            //})
        })
        req.on('error', function (error) {
            console.log(error);
        })
        self.req.pipe(req,{end:false})
        self.req.on('end',function(){
            console.log(2222)
            req.end()
            console.log(self.req);
            console.log(req);
        })
        // req.end();
    })

    //var parts = fileparse(this);
    //var part
    //while (part = yield parts) {
    //    if (part.length) {
    //        // arrays are busboy fields
    //        console.log('key: ' + part[0])
    //        console.log('value: ' + part[1])
    //    } else {
    //        // otherwise, it's a stream
    //        part.pipe(fs.createWriteStream('some file.txt'))
    //    }
    //}

    //  var parts = fileparse(this);
})

app.use(function *(next) {
    if (this.request.is('multipart/*')) {
        return yield next;
    }
    var body;
    var reqUrl;
    var options = {
        hostname: '',
        port: null,
        path: '/',
        method: 'GET',
    };
    options.hostname = config.hostname;
    if (config.port) {
        options.port = config.port;
    }

    var data;
    var self = this;

    options.path = this.request.url;
    options.headers = this.request.header;
    options.headers.referer = options.hostname + options.path;
    options.headers.host = options.hostname;

    if (this.request.method === 'GET') {
        // 还是有必要的
        data = yield new Promise(function (reslove, reject) {
            var req = http.request(options, function (res) {
                self.res.writeHead(res.statusCode, res.headers);

                res.pipe(self.res);

                //res.on('data', function (data) {
                //    self.res.write(data);
                //})
                //res.on('end', function () {
                //    self.res.end();
                //    reslove()
                //})
            })
            req.on('error', function (error) {
                console.log(error);
            })
            req.end();
        })

    } else if (this.request.method === 'POST') {
        options.method = 'POST';
        //reqUrl = url.parse(this.request.url);
        var body = yield parse(this);
        var postData = querystring.stringify(body);
        data = yield new Promise(function (reslove, reject) {
            var req = http.request(options, function (res) {
                self.res.writeHead(res.statusCode, res.headers);

                // response 和request都是 Stream  遂用pipe来代替事件机制
                res.pipe(self.res);

                //res.on('data', function (data) {
                //    self.res.write(data);
                //})
                //res.on('end', function () {
                //    self.res.end();
                //    console.log(111)
                //    reslove()
                //})
            })
            req.on('error', function (error) {
                console.log(error);
            });
            // console.log(this);
            // console.log(this.request.pipe);

            req.write(postData);
            req.end();
        })
        console.log(data)
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