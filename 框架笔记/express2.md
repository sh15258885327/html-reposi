### express 之router

router是设置公共路由：对公共路由的get请求 post请求，all请求做出一个响应的 函数

~~~js
let express = require("express")
let app = express();
app.listen(3000)//相当于 http.createHttpServer
app.route("/")//设置一个公共路由
.all(function(req,res,next){
    next()
}).get(function(req,res){
    res.set({//设置一个请求头
        "title":"my-site",//注意：这个title里的内容不能写汉文
        "name":"shenjie"
    })
    res.send("hello world1")
}).post(function(req,res){
    res.send("hello world2")
})
~~~

### express 之use

1. app.use(path,callback)中的callback既可以是**router对象**又可以是函数
2. app.get(path,callback)中的callback只能是函数

### express 之 static

可以一次性把多个文件夹下的静态资源加载过来，不用一个个引入了，

比如：

app.use(express.static("./public/"))

app.use(express.static("./files/"))

但是这是相对于服务器启动文件的路径，为了安全起见可以使用绝对路径

~~~js
app.use(path.resolve(`${__dirname}`,"public/"))
~~~

注：

server.js

~~~js
let express = require("express")
let app = express()

/*app.get("/",(req,res,next)=>{
    res.end("1111")
})*/
app.use(express.static("./public/")) //此时运行服务器会直接加载public下的index.html
app.listen(3000)
~~~



#### router对象

**router实例就是一个中间件**

~~~js
let express = require("express")
let app = express();
app.listen(3000)
let router = express.Router() //得到一个router对象
router.get("/admin",function(req,res.next){//注：此刻只是一个中间件。还没有被调用激活（使用app.use来调用激活）
    //...
    next()//注：当我们这个回调函数不是最终的一个，一定要调用next方法
})
app.use(router)//此刻激活，相当于app.get("/admin",(req,res,next)=>{//上面那个回调函数})
app.use(”/login“，router)//此刻激活相当于app.get("/login/admin",(req,res,next)=>{//上面那个回调函数})
~~~

关于router这个中间件的使用：

可以在多个文件中管理路由：

例子：

app.js（主路由）

~~~js
let express = require("express")
let app = express();
app.listen(3000)
let user = require("./server.js")
app.use(user)
~~~

server.js（一重子路由）

~~~js
let express = require("express")
let router = express.Router()//创建了一个中间件，可以创建多个中间件
let admin = require("./admin.js")
router.use("/user",admin)
~~~

setData.js

~~~js
module.exports = function(req,res,next){
    req.data=111
    next()//此时不是最后一个调用函数，一定要调用next方法
}
~~~

setNum.js

~~~js
module.exports = function(req,res,next){
    req.num=222
    next()//此时不是最后一个调用函数，一定要调用next方法
}
~~~

admin.js（二重子路由）

~~~js
let express = require("express")
let router = express.Router()//创建一个中间件
let setData = require("./setData.js")
let setNum = require("./setNum.js")
router.use("/admin",setData)
router.use("/admin",setNum)
router.get("/admin",(req,res,next)=>{//这里是一个回调函数，所以用get或者use都想
    console.log(req.data)
    console.log(req.num)
    console.log("admin runing")
    res.send("hello world")
})
~~~

此时：输入：

~~~text
http://localhost:8080/user/admin
~~~

就会返回hello world页面

控制台有如下信息：

~~~txt
111
222
admin runing
~~~

### multer中间件

相当于我们用过的formData函数...

​		当客户端想要提交**表单数据**或是直接**上传文件**时, 就会采用**post的请求**方式,但是post提交的数据类型多, 格式复杂,因此我们就要引入几个中间件来**辅助我们解析数据** 

~~~js
npm install multer
~~~

​		Multer 会添加一个 **body 对象 以及 file 或 files 对象** 到 express 的 request 对象中。 body 对象包含表单的文本域信息，file 或 files 对象包含对象表单上传的文件信息。

#### multer中间件的使用

###### 提交一个单一文件的代码：

html:

~~~html

<form method="POST" action="http://localhost:3000/uploads" enctype="multipart/form-data">
        用户名:<input type="text" name="username" placeholder="用户名">
        密码:<input type="text" name="password" placeholder="密码">
        上传文件:<input type="file" name="upfile">
        <input type="submit" value="提交">
</form>
~~~

注意：这里的action路径**必须写一个http://**才行

server.js

~~~js
let express = require("express")
let app = express()
let multer = require("multer")
let path = require("path")
let upload = multer({dest:path.join(__dirname,"uploads/")});
app.post("/uploads",upload.single("upfile"),(req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    res.send("上传成功")
})
app.listen(3000)
~~~

**注**：

1. req.body是一个对象，属性分别是input的name**属性对应的值**

2. req.body是一个文件对象，里面有

   ~~~js
   {
     fieldname: 'upfile',
     originalname: '1.jpg',
     encoding: '7bit',
     mimetype: 'image/jpeg',
     destination: 'C:\\Users\\申杰\\Desktop\\文件上传\\uploads\\',
     filename: 'a17192ec488b360c7f54df155b5f929e',
     path: 'C:\\Users\\申杰\\Desktop\\文件上传\\uploads\\a17192ec488b360c7f54df155b5f929e',
     size: 528299
   }
   ~~~

| 键           | 描述                       |
| ------------ | -------------------------- |
| fieldname    | 表单中指定的字段名称       |
| originalname | 用户计算机上文件的名称     |
| encoding     | 文件的编码类型             |
| mimetype     | 文件的文件类型             |
| size         | 文件大小（以字节为单位）   |
| destination  | 文件已保存到的文件夹       |
| filename     | 文件中的文件名 destination |
| path         | 上载文件的完整路径         |



###### 一次性在一个input里面提交多个文件的代码

html 部分：(这段修改成如下)

~~~html
上传文件:<input type="file" name="upfile" multiple="multipart">
~~~

server.js:(这段修改成如下)

~~~js
app.post("/uploads",upload.array("upfile"),(req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    res.send("上传成功")
})
~~~

###### 一次性在多个input里面分别提交多个文件的代码

(这段代码修改如下，以俩个input为例子)

html:

~~~html
上传文件1:<input type="file" name="upfile1" multiple="multipart">
上传文件2:<input type="file" name="upfile2" multiple="multipart">
~~~

server.js

~~~js
app.post("/uploads",upload.fields(["upfile1","upfile2"]),(req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    res.send("上传成功")
})
~~~

或者：

~~~js
app.post("/uploads",upload.fields([{name:"upfile1",maxCount:12},{name:"upfile2",maxCount:12}]),(req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    res.send("上传成功")
})
~~~

**注：**

**maxCount表示最多上传的多少个文件，如果不设置，默认是无限**

###### 如果我只想提交文本域的表单的话

(这段代码修改如下)

~~~js
app.post("/uploads",upload.none,(req,res,next)=>{
	//此时只响应文本域的表单内容
    console.log(req.body)
})
~~~

##### multer中间件的使用之文件存储选项（用storage替代dest）

​	1. **磁盘存储引擎**可以让你控制文件的存储。

​	2. 有两个选项可用，**destination 和 filename**。他们都是**用来确定文件存储**的函数。

3. **destination 是用来确定上传的文件应该存储在哪个文件夹中**。也可以提供一个 string (例如 '/tmp/uploads')。如果没有设置 destination，则使用操作系统默认的临时文件夹。

   注意：注意: 如果你提供的 destination **是一个函数**，你需要**负责创建文件夹**。**当提供一个字符串，multer 将确保这个文件夹是你创建的。**

4. **filename 用于确定文件夹中的文件名**。 如果没有设置 filename，每个文件将设置为一个随机文件名，并且是没有扩展名的。

   注意：filename 用于确定文件夹中的文件名的确定。 如果**没有设置 filename**，每个文件将设置为一个随机文件名，并且是**没有扩展名**的。

server.js

multer()传成如下的对象：

~~~js
et upload = multer({
    storage:storage,
    fileFilter:function(req,file,callback){
        switch(file.mimetype){
            case "image/jpeg":
            case "imagge/png":
            case "image/gif":
            case "imagge/bmp":
                callback(null,true);
                break
            default:
                callback(null,false);
                break
        }
    }
})
~~~

storage对象如下：(实现了分文件存储)

~~~js
let storage = multer.diskStorage({
    destination:function(req,file,callback){
        switch(file.mimetype){
            case "image/jpeg":
                callback(null,path.join(__dirname,'uploads/images'));
                break
            default:
                callback(null,path.join(__dirname,'uploads'));
                break
        }  
    },
    filename:function(req,file,callback){
        callback(null,file.originalname)//此时就有扩展名了
    }
})
~~~

其他不变：

~~~js
app.post("/uploads",upload.single("upfile"),(req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    res.send("上传成功")
})
~~~

###### multer参数详解：

​		Multer接受一个options对象，其中**最基本的是dest 属性**，它告诉Multer在哪里上传文件。**如果省略options对象**，文件将保留在内存中，并且**永远不会写入磁盘。**

​		默认情况下，**Multer将重命名文件**，以避免命名冲突。重命名功能可以根据您的需求进行定制

这个参数对象如下：

| 键                | 描述                                   |
| ----------------- | -------------------------------------- |
| dest 或者 storage | 文件存放在哪里                         |
| fileFilter        | 控制接受哪些文件的功能                 |
| limits            | 上传数据的限制                         |
| preservePath      | 保留文件的完整路径，而不仅仅是基本名称 |

其中：limits是一个对象：

| 键            | 描述                                           | 默认    |
| ------------- | ---------------------------------------------- | ------- |
| fieldNameSize | 最大字段名称大小                               | 100字节 |
| fieldSize     | 最大字段值大小                                 | 1MB     |
| fields        | 非文件字段的最大数量                           | 无限    |
| fileSize      | 对于多部分表单，最大文件大小（以字节为单位）   | 无限    |
| files         | 对于多部分表单，最大文件字段数                 | 无限    |
| parts         | 对于多部分表单，最大部分数（字段+文件）        | 无限    |
| headerPairs   | 对于多部分形式，要解析的标头键=>值对的最大数量 | 2000    |

#### 自定义提交的其他实现方式：

1. **form表单提交时会调到一个新页面，所以我们不使用action来达到效果**

html代码如下：

html:

~~~html
<body>
    <form method="POST" enctype="multipart/form-data" class="aform">
        用户名:<input type="text" name="username" placeholder="用户名" class="input1">
        密码:<input type="text" name="password" placeholder="密码">
        上传文件:<input type="file" name="upfile">
        <button id="btn">提交</button>
</form>
<div class="content"></div>
<script>
    /*用这段js代码替代action属性，来确保不用跳转页面*/
    let btn = document.querySelector("#btn");
    let content = document.querySelector(".content");
    let xhr = new XMLHttpRequest();
    btn.onclick=function(e){
        e.preventDefault()
        let form = document.querySelector(".aform");
        let formData = new FormData(form);
        console.log(formData.get("username"))
        xhr.open("POST","http://localhost:3000/uploads")
        xhr.send(formData)
    }
    xhr.onreadystatechange = function(){
        console.log(xhr.status)
        console.log(xhr.readyState)
        if(xhr.readyState === 4){
           console.log(xhr.responseText)
           content.append(xhr.responseText)
        }
    }
</script>
~~~

​		**注：我在此处遇到一个坑，在没输入数据之前就把formData传参获取了，导致输入的是空数据**

server.js(其实没变,和action提交是一个效果的)

~~~js
app.post("/uploads",upload.single("upfile"),(req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    res.setHeader("Access-Control-Allow-Origin","*")
    res.end("上传成功")
})
~~~

2. **由于form表单限制了布局**，我可以通过formData来**不用form表单**

   （也就是手动 给 FormData实例append数据）

html

~~~html
<body>
        用户名:<input type="text" name="username" placeholder="用户名" class="username">
        密码:<input type="text" name="password" placeholder="密码" class="password">
        批量上传文件1:<input type="file" name="upfile1" class="file1" multiple="multipart">
        批量上传文件2:<input type="file" name="upfile2" class="file2" multiple="multipart">
        <button id="btn">提交</button>
</form>
<div class="content"></div>
<script>
    /*用这段js代码替代action属性，来确保不用跳转页面*/
    let btn = document.querySelector("#btn");
    let content = document.querySelector(".content");
    let xhr = new XMLHttpRequest();
    btn.onclick=function(e){
        e.preventDefault()
        // let form = document.querySelector(".aform");
        // let formData = new FormData(form);
        let file1 = document.querySelector(".file1")
        let file2 = document.querySelector(".file2")
        let username = document.querySelector(".username")
        let password = document.querySelector(".password")
        let formData = new FormData();
        for(let i=0;i<file1.files.length;i++){
            formData.append("upfile1",file1.files[i])
        }
        for(let i=0;i<file2.files.length;i++){
            formData.append("upfile2",file2.files[i])
        }
        formData.append("username",username.value)
        formData.append("password",password.value)
        xhr.open("POST","http://localhost:3000/uploads")
        xhr.send(formData)
    }
    xhr.onreadystatechange = function(){
        console.log(xhr.status)
        console.log(xhr.readyState)
        if(xhr.readyState === 4){
           console.log(xhr.responseText)
           content.append(xhr.responseText)
        }
    }
</script>
</body>
~~~

server.js部分我修改了的如下：

~~~js
app.post("/uploads",upload.fields([{name:"upfile1",maxCount:5},{name:"upfile2",maxCount:5}]),(req,res,next)=>{
    console.log(req.file)
    console.log(req.body)
    res.setHeader("Access-Control-Allow-Origin","*")
    res.end("上传成功")
})
~~~

