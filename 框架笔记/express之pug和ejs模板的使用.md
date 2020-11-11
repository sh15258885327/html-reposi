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

可以自动生成ejs模板的样式

也可以生成pug模板样式,还有很多其他的

ejs模板和我们的html很像,它的用法也很简单

- <% %>流程控制标签
- <%= %>输出标签（原文输出HTML标签）
- <%- %>输出标签（HTML会被浏览器解析）
- <%# %>注释标签
- % 对标记进行转义

pug的使用文档网址:

https://www.pugjs.cn/language/inheritance.html