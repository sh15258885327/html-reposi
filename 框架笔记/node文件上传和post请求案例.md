post请求的demo:

html部分:

~~~html
<!DOCTYPE html>
<html lang="zh">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>第九期框架-佳楠</title>
</head>
<body>
    <form action="http://127.0.0.1:3001/post" method="post">
        <p>姓名：<input type="text" name="姓名"></p>
        <p>年龄：<input type="text" name="年龄"></p>
        <p>兴趣：
            <input type="checkbox" name="hobby" id="" value="美食">美食
            <input type="checkbox" name="hobby" id="" value="睡觉">睡觉
            <input type="checkbox" name="hobby" id="" value="游戏">游戏
            <input type="checkbox" name="hobby" id="" value="旅游">旅游
        </p>
        <p><input type="submit" value="提交"></p>
    </form>
</body>
</html>
~~~

node.js部分:

注:由于是**post请求**,数据是**在body里面**的,我们所以我才**用到了req.on来监听数据**,然后这个数据是按块传输 的,**解析**里面的数据需要使用**querystring来解析**

~~~js
let http = require("http")
let querystring = require("querystring")

let server = http.createServer(function(req, res) {
    // console.log(req)
    res.writeHead(200, {"Content-type":"text/html;charset=utf-8"})
    if (req.url === "/post" && req.method.toLocaleLowerCase() === "post") {
        let allData = ''
        // 通过req的data事件监听函数，接收数据，数据是按块传输的，data是传输数据的
        req.on("data", function(chunk) {
            allData += chunk
            // console.log(chunk, allData)
        })
        // 在我们的end事件触发后，所有的数据传输完毕，我们处理接收到的数据字符串，转换成对象
        req.on("end", function() {
            let dataObj = querystring.parse(allData.toString())
            console.log(dataObj)
        })
    }
    res.end("提交成功！")
})

server.listen(3001)
~~~

**注:res.end里只能是 字符串 或者buffer类型的数据**

文件上传的demo

html部分:

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="申杰">
    <meta name="keywords" content="关键字信息">
    <meta name="description" content="信息描述">
    <title></title>
</head>
<body>
 <form action="http://localhost:3002/upload" method="POST" enctype="multipart/form-data">
     <input type="file" name="file">
    <input type="submit" value="提交">
 </form>
</body>
</html>
~~~

js部分:

我写的js:

~~~js
let http = require("http");
let formidable = require("formidable");
let path = require("path");
let timestamp = require("time-stamp");
let fs = require("fs");
http.createServer(function(req,res){
    console.log(req.url);
    let name,time,extname,olddir,newdir;
    if(req.url==="/upload" && req.method.toLowerCase()==='post'){
        const form = formidable({ multiples: true });//俩种创建方式之一
        form.uploadDir="./upload";  
        form.parse(req, (err, fields, files) => {
            if(err){
                throw err;
            }
            name = "upload";
            time = timestamp("YYYYMMDDmmss");
            extname = path.extname(files.file.name);
            olddir = __dirname+"/"+files.file.path;
            newdir = __dirname+"/upload/"+name+time+extname;
        });
        form.on("end",function(err){
            if(err){
                throw err;
            }
            fs.rename(olddir,newdir,function(err){
                if(err){
                    throw err
                }
                res.end("修改成功")
            })
        });
        return;
    }
}).listen(3002,"localhost");
~~~

老师写的js:

~~~js
let http = require("http")
let formidable = require("formidable")
let timestamp = require("time-stamp")
let path = require("path")
let fs = require("fs")

http.createServer(function (req, res) {
    if (req.url === "/upload" && req.method === "POST") {
        const form = formidable({multiples: true})
        form.uploadDir = "./uploads"
        form.parse(req, function(err, fields, files) {
            let time = timestamp("YYYYMMDDHHmmss") //格式化时间
            // let ran = parseInt(Math.random()*899999+10000)
            console.log(files)
            let ext = path.extname(files.uploads.name) //定义文件后缀名
            let oldPath = __dirname + "/" + files.uploads.path
            let newPath = __dirname + "/uploads" + time + ext
            // 对文件进行重命名
            fs.rename(oldPath, newPath, function(err) {
                if (err) {
                    throw Error("改名失败")
                }
            })
            res.writeHead(200, {"Content-type":"text/plain"})
            res.end("success!")
        })
    }
}).listen(3002)
~~~



