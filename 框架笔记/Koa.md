#### Koa
基于Node.js平台的下一代web开发框架
官网地址:[https://koa.bootcss.com/]
##### 一、简介
Koa 是由 Express 原班人马打造的，致力于成为一个更小、更富有表现力、更健壮的 Web 框架。使用 koa 编写 web 应用，通过组合不同的 generator，可以免除重复繁琐的回调函数嵌套，并极大地提升错误处理的效率。koa 不在内核方法中绑定任何中间件，它仅仅提供了一个轻量优雅的函数库，使得编写 Web 应用变得得心应手。
##### 二、应用
**Koa应用是一个包含一系列中间件generator函数的对象**。这些中间件函数基于request请求以一个类似于栈的结构组成并以此执行。Koa的核心设计思路是为中间件层提供高级语法糖封装，以增强其互用性和健壮性，并使得编写中间件变得相当有趣。

##### 三、起步教程
###### 1. 直接安装koa包，引入使用
- 1、使用npm安装koa包
```cmd
npm i koa
```
- 2、创建一个app.js文件，文件内容如下：
```js
const Koa = require('koa')
const app = new Koa()

app.use(async (ctx, next) => {
    await next()
    ctx.response.type = 'text/html'
    ctx.response.body = '<h1>Hello, koa2!</h1>'
})

app.listen(3000)
```
- 3、启动项目，在项目目录打开cmd,执行以下命令
```cmd
node app.js
```
恭喜你，已经成功的开启了Koa的世界大门，来跟着佳楠老师学习第二种入门方法吧。
###### 2. 配置package.json，使用npm安装依赖
- 1、在项目目录下，打开cmd,快速初始化一个项目依赖文件package.json
```cmd
npm init -y
```
- 2、在package.json文件中配置我们项目中所需要的依赖包，并且自定义项目启动命令
```json
{
  "name": "koa-demo",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "start": "node app.js" // 自定义项目启动命令
  },
  "dependencies": {
    "koa": "2.13.0" //配置项目需要的依赖包
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```
- 3、接下来在项目目录下打开cmd使用npm安装我们的依赖包
```cmd
npm i
```
- 4、在cmd中运行自定义的启动命令，就可以使用我们的Koa了！
```cmd
npm start
```
##### 四、进阶教程
接下来就是我们学习Koa的大菜了，我会以实践的方式带领大家一起学习Koa!

###### next 可以开启下一个use的执行

~~~js
app.use(async (ctx,next)=>{
    console.log(ctx.request.method,ctx.request.url)
    let start = new Date().getTime();
    await next();
    for(var i=0;i<100000;i++);
    let end =  new Date().getTime();
    console.log(end-start);
    
})
app.use(async (ctx,next)=>{
    // await next();
    ctx.response.type="text/html";
    ctx.response.body="<h1>hello world</h1>";
})
app.listen(3000);
~~~

根据请求的路径响应对应的路径只是对路径的判断进行:

所以我们可以使用router来解决这个问题:

原koa方式:

~~~js
app.use(async (ctx,next)=>{
   if( ctx.request.url==="/"){
       ctx.type="text/html";
       ctx.body="indexPage"
   }else{
       await next();
   }
})
app.use(async (ctx,next)=>{
    if( ctx.request.url==="/hello"){
        ctx.type="text/html";
        ctx.body="helloPage"
    }else{
        await next();
    }
})
~~~

现在使用router:

首先输入:

~~~
npm i koa-router --save-dev
~~~

来安装路由

引用:

~~~js
let router = require("koa-router")();
//注:引入这个包的时候要加上后面的小括号才行
~~~

启动路由:

~~~js
app.use(router.routes());
app.use(router.allowedMethods());//可写可不写
~~~

get和post的请求的完整案例:

~~~js
let Koa = require("koa");
let app = new Koa();//使用koa是这种方式
const bodyParser = require("koa-bodyparser");
let router = require("koa-router")();
let fs = require("fs");
router.get("/",async(ctx,next)=>{
    ctx.type="text/html";
  //连接到那个要显示的页面
    let data = fs.readFileSync(__dirname+"\\"+"index.html");
    ctx.body=data;
})
router.get("/hello/:name",async(ctx,next)=>{
    //注意:koa里的get请求方式数据的写法方式
    let obj = ctx.params;
    console.log(obj);
    let obj2 = JSON.parse(JSON.stringify(obj));
    console.log(obj2);
    console.log(ctx.request.url,ctx.request);
    ctx.body="hello world"
})
router.post("/login",async (ctx,next)=>{
    //注意:post请求的路径就是一个相对路径,在action里面也是这样写的
  if(ctx.request.body.username==="admin" && ctx.request.body.password === "12345"){
      ctx.body=`hello ${ctx.request.body.username}`;
  }else{
      ctx.body="登录失败";
  }
})
app.use(bodyParser());
app.use(router.routes());

app.listen(3002);
~~~

##### koa的全局封装示例:

1. 建立一个app.js

   用来遍历所有controller层的js文件,它也相当于那个假设没有封装的那个文件

   ~~~js
   let Koa = require("koa");
   let app = new Koa();
   let router = require("koa-router")();
   let fs = require("fs");
   let bodyParser = require("koa-bodyparser");
   //获取controller文件夹下的所有文件组成的一个数组
   let files = fs.readdirSync(__dirname+"\\"+"controller");
   //过掉掉其他文件只保留js文件
   let jsFiles = files.filter(file=>file.endsWith(".js"));
   console.log(jsFiles);
   //遍历js文件,调用路由参数执行业务代码
   for(let jsf of jsFiles){
       //引包,jsfUrl是我们当时暴露的对象
       let jsfUrl = require(`./controller/${jsf}`);
       console.log(jsfUrl);
       for(url in jsfUrl){
           if(url.startsWith("GET")){
               let path = url.substring(4);
               console.log(path)
               router.get(path,jsfUrl[url]);
           }else if(url.startsWith("POST")){
               let path = url.substring(5);
               console.log(path)
               router.post(path,jsfUrl[url]);
           }else return;
       }
   }
   app.use(bodyParser());
   app.use(router.routes());
   app.listen(3000);
   ~~~

   

2. 建立一个controller文件夹

3. 在controller文件夹建立各种js文件

   js文件里是路由要调用的各种模块下的封装函数
   
   下面假设有俩个业务
   
   business1.js
   
   ~~~js
   let index = async function(ctx,next){
       ctx.body = `<form action="/login" method="post">
       <input type="text"name="username">
       <input type="text"name="password">
       <input type="submit" value="登录">
    </form>`;
   }
   let login = async function(ctx,next){
       let name = ctx.request.body.username;
       let password = ctx.request.body.password;
       if(name === "admin" && password ==="12345"){
           ctx.body=`hello ${name}`;
       }
   }
   module.exports={
       "GET /":index,
       "POST /login":login
   }
   ~~~
   
   business2.js
   
   ~~~js
   let hello = async function(ctx,next){
       ctx.body=`<h1>Hello world</h1>`;
   }
   module.exports={
       "GET /hello":hello
   }
   ~~~
   
   最后:
   
   **对app.js里的代码进行函数化封装:**
   
   ~~~js
   function controllers(router){
       //获取controller文件夹下的所有文件组成的一个数组
       let files = fs.readdirSync(__dirname+"\\"+"controller");
       //过掉掉其他文件只保留js文件
       let jsFiles = files.filter(file=>file.endsWith(".js"));
       //遍历js文件,调用路由参数执行业务代码
       for(let jsf of jsFiles){
           //引包,jsfUrl是我们当时暴露的对象
           let jsfUrl = require(`./controller/${jsf}`);
           checkRoute( router,jsfUrl)
       }
   }
   function  checkRoute( router,jsfUrl) {
       for(url in jsfUrl){
           if(url.startsWith("GET")){
               let path = url.substring(4);
               console.log(path)
               router.get(path,jsfUrl[url]);
           }else if(url.startsWith("POST")){
               let path = url.substring(5);
               console.log(path)
               router.post(path,jsfUrl[url]);
           }else return;
       }
   }
   controllers(router);
   ~~~
   
   
   
   
   
   
   

