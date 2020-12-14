# 数据库

## 关系型数据库

关系数据库是由多个表组成的
**关系数据库=多张表+各表之间的关系**

1. 表的结构

   表的结构是指要了解关系数据库中每张表长什么样。

   每个表由一个名字标识。**表包含带有列名的列，和记录数据的行**。

2. 关系数据库是由多张表组成的，每张表之间由某些数据联结起来

   关系就是数据能够对应的匹配，在关系数据库中正式名称叫联结，对应的英文名称叫做join。**联结是关系型数据库中的核心概念**

#### 什么是数据库管理系统?

​		上面描述的表结构以及表与表之间的关系是数据的基本理论, 而**把这个理论变成可操作的实际软件的就是数据库管理系统**.

​		**SQL是为操作数据库而开发的一种语言**，它可以对数据库里的表进行操作，比如修改数据，查找数据。

##### 典型的关系型数据库MySQL的基本操作

​		**首先navicat只是mysql数据库的一个连接界面，方便操作mysql而已**

**所以我们还是需要安装mysql的**

安装mysql：

1. 解压数据库文件目录

2. 数据库文件**根目录下**新建一个配置文件

   配置myConfig.ini

   myConfig.ini:

   ~~~ini
   [client]
   # 设置mysql客户端默认字符集
   default-character-set=utf8
   [mysqld]
   # 设置3306端口
   port = 3306
   # 设置mysql的安装目录
   basedir=F:\\mysql-8.0.18-winx64
   # 设置 mysql数据库的数据的存放目录，MySQL 8+ 不需要以下配置，系统自己生成即可，否则有可能报错
   # datadir=F:\\mysql-8.0.18-winx64\\sqldata
   # 允许最大连接数
   max_connections=20
   # 服务端使用的字符集默认为8比特编码的latin1字符集
   character-set-server=utf8
   # 创建新表时将使用的默认存储引擎
   default-storage-engine=INNODB
   ~~~
   

在dos中进入mysql文件夹的bin子目录

输入：

~~~js
net start mysql
~~~

启动mysql

然后使用navcat中间件管理工具来操作mysql

可以添加表，单表查询，多表查询，多表连接查询

## 非关系型数据库

对比：

1. NoSQL无需事先为要存储的数据建立字段，随时可以存储自定义的数据格式
2. NoSQL数据库采用类JOSN的键值对来存储文档
3. SQL增删字段是一件非常麻烦的事情。如果是非常大数据量的表，增加字段简直就是一个噩梦。
4. SQL数据库提供关系型的表来存储数据

#### 安装

1. 安装文件包
   1. 打开下载链接：
      [https://www.mongodb.com/try/download/community]
      (如果是32位的，用这个地址:[http://dl.mongodb.org/dl/win32/x86_64])

   2. 选择对应的下载版本,下载msi程序
      <img src="C:/Users/申杰/Desktop/框架笔记/1.png">

   3. 下载完毕后进行安装，默认或者自定义都可以（建议默认）

   4. 安装的过程中注意不要勾选‘Install MongoDB Compass’。MongoDB Compass是一个图形界面管理工具，不安装没有问题的，我们用<a href='https://robomongo.org/'>Robo 3T</a>这个图形界面管理工具。
      <img src="C:/Users/申杰/Desktop/框架笔记/2.png">

   5. 如果安装过程中出现了这个提示，就选择忽略掉。<img src="C:/Users/申杰/Desktop/框架笔记/3.png">

   6. 安装完成后,创建数据目录
      MongoDB把数据存储在db目录下，但是这个数据目录不会主动创建，我们在安装完成后需要创建它。这里要注意的是，数据目录应该放在根目录下（比如C:\或者D:\）
      这里我的MongoDB装在了C盘，所以我的数据目录也建在C盘,我这里用cmd操作的方便大家看过程，大家可以不用cmd，直接创建目录就行。
      <img src="C:/Users/申杰/Desktop/框架笔记/5.png">

   7. 进入C:\Program Files\MongoDB\Server\4.2\bin目录下，打开cmd，执行mongod --dbpath C:\data\db(mongod --dbpath命令是选择数据库文件存放的位置)命令执行成功会出现以下提示：
      <img src="C:/Users/申杰/Desktop/框架笔记/6.png">

   8. 连接MongoDB在bin目录中打开cmd输入mongo.exe|mongo就连接上数据库了,退出mongodb使用exit命令。
      <img src="C:/Users/申杰/Desktop/框架笔记/7.png">

2. 配置环境变量

   在用户变量下到Path处把安装到文件夹到bin文件夹路径复制进去

   ~~~js
   C:\Program Files\MongoDB\Server\4.4\bin
   ~~~

   把这个路径放到Path里面去的时候就可以直接在桌面到左下角输入一个cmd，再接着输入一个mongo就可以打开数据库

   此时返回一个详细的信息, 这个标识了地址,端口,版本等等信息

   **里面有连接路径，在路径最后放入自己要连接的数据库名即可**

   **接着下方**提供了一个MongoDB的命令行窗口, 我们可以在该窗口输入某些操作(一般不直接在此操作而是在程序中操作)

   **在里面可以找到一些在连接时有用到配置提示**

#### 关系型数据库的MongoDB之连接数据库

目的：连接数据库--->建表(规则和表名)--->增删改查

在服务器上做如下操作:

连接处：

~~~js
let mongoose = require("mongoose")
mongoose.connect(" mongodb://127.0.0.1:27017/shen_data",{
    useNewUrlParser: true
}).then(()=>{
    console.log("连接成功")
}).catch((err)=>{
    console.log("连接失败")
    throw err
})
~~~

建立表规则：

~~~js
let Schema = mongoose.Schema//获取创建表规则的构造函数
let schem = new Schema({
    name:{
        type:String,
        require:true
    },
    age:Number,
    height:Number,
    fancy:String
})
~~~

​		注：**mongoose 的所有合法 SchemaTypes**

	1. String
 	2. Number
 	3. Date
 	4. Buffer
 	5. Boolean
 	6. Mixed
 	7. ObjectId
 	8. Array
 	9. Decimal128

创建表名：

~~~js
let gfs = mongoose.model("gfs",schem)
~~~

给表添加内容：

~~~js
gfs.create({
    name:"陈玉棋",
    age:18,
    height:160,
    fancy:"小说"
},{
    name:"萧燕燕",
    age:20,
    height:165,
    fancy:"古装"
},{
    name:"范冰冰",
    age:28,
    height:168,
    fancy:"演员"
}).then(()=>{
    console.log("添加成功")
   
}).catch((err)=>{
    console.log("添加失败")
    throw err
})
~~~

#### 关于页面，服务器，数据库的构建思考

1. 用户数据单独建立一个js文件，把数据库的操作，全部放进去

   再exports出去

   ~~~js
   let mongoose = require("mongoose")
   
   // async function(){
       
   // }
   mongoose.connect("mongodb://127.0.0.1:27017/shen_data",{
       useNewUrlParser: true
   }).then(()=>{
       console.log("连接成功")
   }).catch((err)=>{
       console.log("连接失败")
       throw err
   })
   let Schema = mongoose.Schema
   let schema = new Schema({
       username:{
           type:String,
           required:true
       },
       password:{
           type:String,
           required:true
       },
       sex:String,
       email:String,
       phone:String,
       sign:String,
       photo:String
   })
   let user = mongoose.model("user",schema)
   module.exports.create = async function(obj){
        await user.create(obj) 
   }
   ~~~

2. 在服务器处require过来我们导出来到用户js方法上

   在服务器上获取前端数据，并调用用户js方法存储到mongoDB上

   ~~~js
   let express = require("express");
   let mongoose = require("mongoose")
   let muletr = require("multer")
   let bodyparse = require("body-parser")
   let path = require("path")
   let userDB = require("./userDB/user")
   let app = express()
   app.listen(3000)
   app.use(express.static(path.resolve(__dirname,"public/")))
   app.use(bodyparse.json())
   app.use(bodyparse.urlencoded({extended:false}))
   
   let storage = muletr.diskStorage({
       destination:(req,file,cb)=>{
           console.log(file.mimetype)
           switch(file.mimetype){
               case "image/jpeg":
               
               case "image/png":
                   
               case "image/gif":
                   cb(null,path.join(__dirname,"userDB/images"))
                   break;
               default:
                   cb(null,path.join(__dirname,"userDB/other"))
                   break;
           }
       },
       filename:(req,file,cb)=>{
           cb(null,file.originalname)
       }
   })
   let uploads =  muletr({
       storage:storage
   })
   app.post("/singleUploads",uploads.single("photo"),(req,res,next)=>{
       userDB.create({...req.body}).then(()=>{
           console.log("success")
           res.end("success")
       }).catch((err)=>{
           throw err
       })
   })
   ~~~

3. 在前端页面发送一个formData数据

   ~~~js
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="author" content="申杰">
       <meta name="keywords" content="关键字信息">
       <meta name="description" content="信息描述">
       <title>注册界面</title>
   </head>
   <body>
       用户名：<input type="text" placeholder="用户名" name="username"><br>
       密码：<input type="password" placeholder="密码" name="password"><br>
       年龄：<input type="text" placeholder="年龄" name="age"><br>
       性别：<input type="text" placeholder="性别" name="sex"><br>
       邮箱地址：<input type="email" placeholder="邮箱地址" name="email"><br>
       手机号：<input type="text" placeholder="手机号" name="phone"><br>
       个性签名：<textarea class="sign" name="sign"></textarea><br>
       用户照片：<input type="file" name="photo" class="file"><br>
       <button class="btn">提交</button>
       <div class="paper"></div>
   </body>
   <script>
       
       let btn = document.querySelector(".btn");
       let xhr = new XMLHttpRequest();
       let paper = document.querySelector(".paper")
       btn.onclick = function(){
           let photo = document.querySelector(".file")
           console.log(photo.files[0])
           let username = document.querySelector("input[name='username']")
           let password = document.querySelector("input[name='password']")
           let age = document.querySelector("input[name='age']")
           let sex = document.querySelector("input[name='sex']")
           let email = document.querySelector("input[name='email']")
           let sign = document.querySelector(".sign")    
           let formData = new FormData();
           formData.append("username",username.value)
           formData.append("password",password.value)
           formData.append("age",age.value )
           formData.append("sex",sex.value )
           formData.append("email",email.value)
           formData.append("sign",sign.value ) 
           formData.append("photo",photo.files[0])
           xhr.open("POST","/singleUploads")
           xhr.send(formData)
       }
       xhr.onreadystatechange =  function(){
           if(xhr.readyState === 4){
               console.log(111)
               paper.append(xhr.responseText)
           }
       }
   </script>
   </html>
   ~~~

## 数据库辨析

适合使用SQL开发的项目：

1. 可以预先定义逻辑相关的离散数据的需求
2. 数据一致性是必要的
3. 具有良好的开发者经验和技术支持的标准的成熟技术

适合使用NoSQL开发的项目：

1. 不相关，不确定和逐步发展的数据需求
2. 更简单或者更宽松的能够快速开始编程的项目
3. 速度和可扩展性至关重要的




