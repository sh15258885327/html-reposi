#### Express
##### 一、简介
Express 是一种保持最低程度规模的灵活Node.js Web应用程序框架，为Web和移动应用程序提供一组强大的功能。Express框架是后台的Node框架。
##### 二、性能
Express 提供精简的基本Web应用程序功能，而不会隐藏您了解和青睐的Node.js功能。Express不对Node.js已有的特性进行二次抽象，我们只是在它之上扩展了Web应用所需的功能。丰富的HTTP工具以及来自Content框架的中间件随取随用，创建强健、友好的API变得快速又简单。
##### 三、起步教程
###### 1. 配置package.json，使用npm安装依赖
- 1、新建一个项目目录，在项目目录下，打开cmd,快速初始化一个项目依赖文件package.json
```cmd
npm init -y
```
- 2、在项目目录中打开cmd安装Express
```cmd
npm install express --save
```
用--save安装的模块会添加到package.json文件中的dependencies里，以后运行项目目录中的npm i将自动安装依赖项列表中的模块。
- 3、在项目目录下创建app.js文件，文件中写入以下代码
```js
let express = require('express')
let app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

app.listen(3000, function () {
  console.log('Example app listening on port 3000!')
})
```
- 4、在项目目录中打开cmd，运行以下命令
```cmd
node app.js
```
此时在浏览器中访问http://localhost:3000就能看到服务器成功开启。而访问其他的路径则会以404 Not Found响应。
###### 2. 使用Express应用程序生成器
- 1、首先打开cmd安装一下express
```cmd
npm i express-generator -g
```
- 2、使用以下命令创建我们的第一个Express应用程序
```cmd
express --view=pug Express-demo
```
- 3、根据提示依次执行以下命令，进入项目目录中并且安装依赖
```cmd
cd Express-demo
```
```cmd
npm install
```
- 4、启动程序
在MasOS或Linux上，采用以下命令运行此应用程序
```cmd
$ DEBUG=Expree-demo:* npm start
```
在Windows上，使用以下命令：
```cmd
set DEBUG=Expree-demo:* & npm start | npm start
```
然后在浏览器中输入 http://localhost:3000/ 访问此应用程序。
##### 四、进阶教程
以实例循序渐进进行学习

###### express的内容分类

express:

1. express()

   1. express.json()
   2. express.static()
   3. express.Router()
   4. express.irlencoded()

2. Application

   细讲：

   ​		application就是通过调用Express模块导出的顶层的express()方法来创建的一个值,该值一般用**变量app**表示

   1. properites类

      app.METHOD(path, callback [, callback ...])

      这里的方法包括：

      get  post  use checkout  delete copy put trace等好几十个个方法

      我们使用app.get/post/put等等方式,可以为服务器所接收到的各种请求实现不同的业务处理

   2. events类

   3. Methods类

   

3. request

   1. properites类
   2. Methods类

4. response

   1. properites类
   2. Methods类

5. Router

   1. Methods类

###### 强大的路由

1. 在express中,它会自动帮我们设置状态码为200 还有请求头,当然我们也可以自动设置

~~~~JS
 res.status("404").send("你访问的页面不存在");
~~~~

~~~js
 res.set("contentType","text/html").send("<h1>hello  h1</h1>")
~~~

2. 参数 的传递:使用冒号传递

   ~~~js
    app.get("/:user/:psd",function(req,res){
        res.send(req.params);
    });
   ~~~

3. 路由可以被正则匹配,并且通过req.params[0]可以**获取正则小括号里的参数**，注意，**正则是没有双引号的**，他不是字符串此参数

   ~~~js
   app.get(/^\/shen\/([\d]{2,3})$/,function(req,res){
       console.log(req.params)
       res.send("参数为"+req.params);
   });
   ~~~

4. 路由后的参数不区分大小写，？后面的内容被忽略

   ~~~js
   app.get("/hello",function(req,res){
       res.send("不区分大小写噢！")
   });
   ~~~

###### 强大的静态文件渲染能力

​	**这条命令可以静态出public下所有的静态资源文件**

创建一个public文件夹，里面写一个html静态页面

然后按下面这样写：

**/public/之后会自动寻找public文件夹下的index.html页面**

改名字会访问失败，新增的也不会显示，因为，主页面只能有一个啊.。。

~~~js
let express = require("express");
let app = express();
app.use(express.static(__dirname+"/public/"));
app.listen(3000,function(){
    console.log("express startt at 3000")
})
~~~

1. **路由匹配是一次性原则**，也就是说假设第一个get的路径匹配上了，那么第二个也可以匹配上的路由就不会执行

   ~~~js
   let express = require("express");
   let app = express();
   app.get("/",function(req,res){
       console.log("这是第一个路由")
   })
   app.get("/",function(req,res){
       console.log("这是第二个路由")
   })
   打印：
   //这是第一个路由
   ~~~

   实际上，这个回调函数还有第三个参数next，执行它的话，会执行下一个也匹配上的路由

   ~~~js
   let express = require("express");
   let app = express();
   app.get("/",function(req,res，next){
         next();
       console.log("这是第一个路由")
    
   })
   app.get("/",function(req,res){
       console.log("这是第二个路由")
   })
   打印：
   //这是第二个路由
   //这是第一个路由
   ~~~

实际项目中利用这一点,有俩中路由冲突解决方案，这也是一种业务场景，比如就是，当有这个用户的时，让它进入用户界面，当没有这个用户的时候，让它进入游客界面或者管理员页面

​	方法1：位置互换

~~~js
app.get("/:user/:id",function(req,res){
    console.log("这是带冒号的那个路由");
    res.send(req.params);
});
app.get("/admin/login",function(req,res){
    res.send("登陆界面");
});
当输入：http://localhost:3000/admin/login
的时候会走第一个路由
如果我想走第二个，那么位置互换就可以
~~~

​	方法2：使用next方法加判断

​	比如当我们从数据库查找数据失败，那么我们可以用这个：

~~~js
app.get("/:user/:id",function(req,res,next){
    console.log("这是带冒号的那个路由");
    let state = false;//这个fasle是假设我们从数据返回的结果
    if(!state){
        res.send(req.params);
    }else{
        next()
    }
});
app.get("/admin/login",function(req,res){
    res.send("登陆管理员页面");
});
~~~

2. **app.use()是一个中间件**，当它访问根目录的时候，它也get的作用是一样的

   **所以，当它和get访问一样的路径时，也遵循一次性原则**

2. 在**get请求**中可以**使用req.query来获取参数值**：

   ~~~js
   app.get("/hello",function(req,res){
       console.log(req.originalUrl);
       console.log(req.path);
       console.log(req.query);
       console.log(req.params);
       console.log("执行了get")
   });
   打印结果：
   /hello?a=1&b=2
   /hello
   { a: '1', b: '2' }
   {}
   执行了get
   ~~~

3. 在post请求中：要先引入body-parser,然后可以使用req.body来获取请求的参数

   ~~~js
   let bodyparser = require("body-parser");
   app.use(bodyparser.urlencoded({extended:false}));
   app.post("/post",function(req,res){
       console.log(req.body);
       res.set({
           contentType:"text/html",
           charset:"utf-8"
       })
       res.send("<h1>请求成功，内容为"+JSON.stringify(req.body)+"</h1>");
   })
   ~~~

   这里需要注意：

   我们的**页面是不能解析对象数据的**，需要用JSON.stringfy(req.body)来把数据转一下

