## expresz之pug模板的使用

pug模板和ejs模板都是render函数有俩个参数，第一参数是渲染的ejs/pug模板的路径,第二个参数是一个对象，里面是从后端请求出来的JSON数据

注:接express那节的md中的使用Express应用程序生成器**

1. 安装pug,express

   ~~~js
   npm i pug --save-dev
   npm i express --save-dev
   ~~~

2. 创建app.js，

   内容如下：

   ~~~js
   let express = require("express");
   let app = express();
   app.set("view engine","pug");//注意：这里是set，不是use
   app.get("/",(req,res)=>{
       let data = {
           title:"哈哈"，
           message："aaa"
       }
       res.render("index",data)
       //此时的render会自动去寻找views文件夹下的index.pug文件传输数据到哪里去，并最终编译成html文件
   })
   app.listen(3000,function(){
       console.log("port start at 3000")
   })
   ~~~

3. 创建一个views文件夹，里面创建一个index.pug

   index.pug:

   ~~~pug
   html
   	head
   		title= title
   	body
   		h1=message
   ~~~

4. 此时运行页面就可以看到带有data数据的页面

现在这些任务让她自动生成:

看 express那节的md中的使用Express应用程序生成器的指令就可以把类似上面一些列的活全部生成

pug的使用文档网址:

https://www.pugjs.cn/language/inheritance.html

## expresz之ejs模板的使用

#### ejs模板引擎

##### 一、简介

官网地址:[https://ejs.bootcss.com/]
**模板引擎是为了使用户界面与业务数据（内容）分离而产生的**，它可以生成特定格式的文档，用于网站的模板引擎会生成一个标准的HTML文档。
**ejs是一款后端模板引擎，**是一个高效的嵌入式JavaScript模板引擎，可快速的利用JavaScript代码生成HTML页面。
一个网站提供的**子网页的数量浩如烟海**, 如果每次都是直接返回一个html文件的话,那么我们的服务器就得静态存储巨量的文件,这明显是不符合开发需求的, 因此,我们将数据与结构拆分, **通过模板引擎来实现网页的柔性开发**

即：

**变量数据 + 模板引擎 + 结构标签 = 网页代码**

##### 二、使用

- 1、下载ejs

```cmd
npm i ejs
```

- 2、简单使用
  1、在业务逻辑中的js文件当中需要使用**app.set("view engine", "ejs")命令设定ejs模板引擎**，并不需要require('ejs')。程序会自己从模块中寻找ejs模块并加载。
  2、需要使用**res.render("page", data)方法进行渲染模板**和传递数据并呈递模板引擎。默认情况下程序会自动从views文件夹下寻找ejs模板文件。

ejs模板和我们的html很像,它的用法也很简单

- <% %>流程控制标签（如：if语句，for循环）
- <%= %>输出标签（原文输出HTML标签）
- <%- %>输出标签（HTML会被浏览器解析）
- <%# %>注释标签
- % 对标记进行转义

#### ejs模板引擎的调用方式之res.render()

~~~js
res.render(view [, locals] [, callback])
~~~

渲染一个视图，然后将渲染得到的HTML文档发送给客户端。可选的参数为:

1. view：

   **模板引擎所在的路径**(默认是在${_dirname}/views的里面, 然后我们**只要写上该目录里面的文件名即可**;如果需要自定义,那么就需要提供一个绝对路径)

2. locals：

   定义了视图本地参数属性的一个对象。(这是一个数据对象,里面存储的数据会传输给模板引擎的数据)
   **记住,这个数据对象类似于全局对象window,我们是直接用到里面的属性的**

3. 回调函数

应用实例：

1. **模仿一下后端数据，实际开发是在数据库里获取的**

   创建1个data文件夹，里面放入如下文件

   footer.json

   ~~~json
   {
       "footer":"欢迎下次再来"
   }
   ~~~

   header.json

   ~~~js
   {
      "header":[
          {
              "titlle":"今日头条1"
          },
          {
           "titlle":"今日头条2"
           },
           {
               "titlle":"今日头条3"
           },
           {
               "titlle":"今日头条4"
           }
       ]
   }
   ~~~

   main.json

   ~~~~json
   {
       "main":[
           {
               "title":"侠客行",
               "author":"李白",
               "content":"赵客缦胡缨⑵，吴钩霜雪明⑶。银鞍照白马，飒沓如流星⑷。十步杀一人，千里不留行⑸。"
           },
           {
               "title":"静夜思⑴",
               "author":"李白",
               "content":"床前看月光，疑是地上霜。抬头望山月，低头思故乡。"
           },
           {
               "title":"侠客行",
               "author":"李绅",
               "content":"锄禾日当午⑹，汗滴禾下土。谁知盘中餐⑺，粒粒皆辛苦"
           }
       ]
   }
   ~~~~

   index.json

   ~~~json
   {
       "title":"hello world"
   }
   ~~~

2. 创建ejs文件夹，里面放入对应的ejs模板引擎：

   1. footer.ejs

      ~~~js
      <footer><%= footer.footer%></footer>
      ~~~

   2. header.ejs

      ~~~ejs
      <nav>
          <ul class="header">
              <% for(let i=0;i<header.header.length;i++){%>
              <li>
                  <%= header.header[i].titlle %>
              </li>
              <% } %>
          </ul>
      </nav>
      ~~~

   3. main.ejs

      ~~~ejs
      <main>
          <ul>
              <% for(let i=0;i<main.main.length;i++){ %>
              <li>
                  <p class="content">
                      <%= main.main[i].title %>
                  </p>
                  <p class="content">
                      <%= main.main[i].author %>
                  </p>
                  <p class="content">
                      <%= main.main[i].content %>
                  </p>
              </li>
              <% }%>
          </ul>
      </main>
      ~~~

   4. index.ejs（**ejs模板引擎的include导入模块）**

      ~~~ejs
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="author" content="申杰">
          <meta name="keywords" content="关键字信息">
          <meta name="description" content="信息描述">
          <title></title>
          <style>
              .header{
                  color: aqua;
              }
          </style>
      </head>
      <body>
          <h1><%= index.title %></h1>
       <%- include("./header.ejs")%>
       <%- include("./main.ejs")%>
       <%- include("./footer.ejs")%>
      </body>
      </html>
      ~~~

   备注：**ejs模板的数据是通过服务器的render函数映射过来的**

server.js:

~~~js
let express = require("express")
let fs = require("fs")
let app = express()
let cookieParser = require("cookie-parser")
let ejs = require("ejs");
app.set("view engine","ejs")
app.use(cookieParser())
app.get("/:id",(req,res)=>{
    //在这个地方可以 根据 id获取不同的数据,从而渲染出成千上万个页面
    let data = {
        index:fs.readFileSync(`${__dirname}/data/index.json`,"utf8"),
        header:JSON.parse(fs.readFileSync(`${__dirname}/data/header.json`,"utf8")),
        main:JSON.parse(fs.readFileSync(`${__dirname}/data/main.json`,"utf8")),
        footer:JSON.parse(fs.readFileSync(`${__dirname}/data/footer.json`,"utf8"))
    }
    console.log(data.index)
    console.log(JSON.parse(data.index))//使得数据格式规范化
    res.render(`${__dirname}/ejs/index.ejs`,data,(err,html)=>{
        res.send(html)
    })
})
app.listen(3000)
~~~

