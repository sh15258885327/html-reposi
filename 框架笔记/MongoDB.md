#### MongoDB
##### 一、简介
官网：[https://www.mongodb.com/]
手册：[https://docs.mongodb.com/manual/]
传统的数据库都是结构性数据库，如MySQL、SQL Server、Oracle、Access等数据库。有行和列的概念，数据有关系并且数据不是散的。每个表中，都有明确的字段，每行记录，都有这些字段，不能有的行有，有的行没有。
MongoDB是由C++语言编写的，是一个基于分布式文件存储的开源数据库系统。MongoDB 将数据存储为一个文档，数据结构由键值(key=>value)对组成。MongoDB 文档类似于 JSON 对象。字段值可以包含其他文档，数组及文档数组。

##### 二、安装步骤
1. 打开下载链接：
[https://www.mongodb.com/try/download/community]
(如果是32位的，用这个地址:[http://dl.mongodb.org/dl/win32/x86_64])

2. 选择对应的下载版本,下载msi程序
<img src="./1.png">

3. 下载完毕后进行安装，默认或者自定义都可以（建议默认）

4. 安装的过程中注意不要勾选‘Install MongoDB Compass’。MongoDB Compass是一个图形界面管理工具，不安装没有问题的，我们用<a href='https://robomongo.org/'>Robo 3T</a>这个图形界面管理工具。
<img src="./2.png">

5. 如果安装过程中出现了这个提示，就选择忽略掉。<img src='./3.png'>

6. 安装完成后,创建数据目录
MongoDB把数据存储在db目录下，但是这个数据目录不会主动创建，我们在安装完成后需要创建它。这里要注意的是，数据目录应该放在根目录下（比如C:\或者D:\）
这里我的MongoDB装在了C盘，所以我的数据目录也建在C盘,我这里用cmd操作的方便大家看过程，大家可以不用cmd，直接创建目录就行。
<img src="./5.png">

7. 进入C:\Program Files\MongoDB\Server\4.2\bin目录下，打开cmd，执行mongod --dbpath C:\data\db(mongod --dbpath命令是选择数据库文件存放的位置)命令执行成功会出现以下提示：
<img src="./6.png">

8. 连接MongoDB在bin目录中打开cmd输入mongo.exe|mongo就连接上数据库了,退出mongodb使用exit命令。
<img src="./7.png">

##### 三、详细使用
第一步需要连接数据库，建议大家配置好环境变量。然后打开cmd，执行mongo命令
命令|作用
---|---
mongo|使用数据库
show dbs|列出所有数据库
use 数据库名字|使用和新建数据库
db|查看当前操作的数据库
db.数据库名称.insert()|插入数据
db.数据库库名称.find()|查找数据
db.数据库名称.update()|修改数据
db.数据库名称.remove()|删除数据
db.数据库名称.drop()|删除集合
db.dropDatabase()|删除数据库

~~~js
find("age",18);
find("age",{$lt:18});
find("age",{$gt:18});
find()
~~~

~~~js
update({"name":"申杰"},{$set:{"age":12})
~~~

~~~js
remove("age",{$lt:18})//删除小于18
~~~

~~~js
db.test.drop() //删除所有数据
~~~

删除数据库

~~~js
use test//先use 那个要删除的表
db.dropDatabase();//然后这样删除就可以
~~~

连接数据库:

先express --view=ejs express-mongo创建一个项目

在根目录建立一个libs文件夹,在libs文件夹下创建一个config.js文件:

~~~js
let MongoClient = require("mongodb").MongoClient;
let url = "mongodb://localhost:27017/test"
MongoClient.connect(url,(err,client)=>{
    let db = client.db("test");
    if(err){
        throw err;
        return
    }
    console.log("数据库连接成功")
})
~~~

4.0以上版本写法:

config.js

~~~js
//4.0以上版本写法
let MongoClient = require("mongodb").MongoClient;
let url = " mongodb://127.0.0.1:27017/test";
module.exports = async ()=>{
    var client = await MongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});
    db = client.db("test");
    console.log("数据库连接成功");
    return db
}
~~~

在routers文件夹下的test.js下的调用:

routers/test.js:

~~~js
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let result = db.collection("test").find();
  result.toArray((err,data)=>{
      if(err){
          throw err;
          return;
      }
    console.log(data);
    res.render('test', { results: data });
  })
});
//插入一条
router.get("/insertOne",(req,res,next)=>{
    db.collection("test").insertOne({"name":"申杰","age":18},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档插入成功");
    });
})
//插入多条
router.get("/insertMany",(req,res,next)=>{
    db.collection("test").insertMany([{"name":"神仙","age":20},{"name":"美女","age":18}],function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档插入成功");
    });
})
//修改一条
router.get("/update",(req,res,next)=>{
    db.collection("test").update({"name":"神仙","age":20},{"name":"祖宗","age":18},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档修改成功");
    });
})
//修改多条(这种批量更新是有问题的,加multi对象不管用)
router.get("/updateMany",(req,res,next)=>{
    db.collection("test").update({"name":"申杰"},{"name":"神仙","age":18},{multi:true},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档批量修改成功");
    });
})
//删除一条
router.get("/remove",(req,res,next)=>{
    db.collection("test").remove({"name":"祖宗","age":18},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档删除成功");
    });
})
module.exports = router;
~~~

在app.js关于db的调用:

app.js:

~~~js
var db;
(async ()=>{
  db= await mdb()
})();
~~~

1. 注意:项目的搭建是通过

~~~js
express --view=ejs express-mongodb来搭建的
~~~

2. 我们启动app.js需要使用

   ~~~js
   npm start 来启动,node app.js在这个搭建的项目中会报错
   ~~~

   3. 我们在链接数据的时候,要注意写上

      ~~~js
      {useNewUrlParser:true,useUnifiedTopology: true} 
      ~~~

## mongodb的封装

在libs文件夹下创建一个config2.js,内容如下:

config2.js:

~~~js

//4.0以上版本写法
let MongoClient = require("mongodb").MongoClient;
let url = " mongodb://127.0.0.1:27017/test";
let fun = async function(url){
    var client = await MongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});
    return client;
}
exports.insert = async function(dbName,collectionName,jsonData){
    let client = await fun(url);
    let db = client.db(dbName);
    let cn = db.collection(collectionName);
    cn.insertOne(jsonData,function(err,data){
        if(err) throw err;
        console.log("文档插入成功");
        client.close().then(()=>{
            console.log(数据库连接关闭);
        })
    });
}
exports.update = async function(dbName,collectionName,jsonData1,jsonData2){
    let client = await fun(url);
    let db = client.db(dbName);
    let cn = db.collection(collectionName);
    cn.update(jsonData1,jsonData2,(err,data)=>{
        if(err) throw err;
        console.log("文档修改成功");
        client.close().then(()=>{
            console.log(数据库连接关闭);
        })
    })
}
exports.count = async function(dbName,collectionName){
    let client = await fun(url);
    let db = client.db(dbName);
    let cn = db.collection(collectionName);
    // cn.count({},()=>{
    //     if(err) throw err;
    //     console.log(data);
    //     res.send("计数完成");
    //     client.close().then(()=>{
    //         console.log(数据库连接关闭);
    //     })
    // })
    cn.count({}).then((count)=>{
        console.log(count);
        client.close();
    })
}
~~~

在该目录下创建一个test.js调用一下:

test.js:

~~~js
let db = require("./config23")

db.insert("test","test", {"sex": "女"})
db.update("test","test", {"sex": "女"}, {"sex": "男"})
db.count("test","test");
~~~

