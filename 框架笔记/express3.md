### request对象

​		req对象代表了一个HTTP请求，其具有一些属性来保存请求中的一些数据，比如query string，parameters，body，HTTP headers等等。按照惯例，这个对象总是简称为req(http响应简称为res)，但是它们实际的名字由这个回调方法在那里使用时的参数决定。

​	**req.baseUrl：一个路由实例挂载的Url路径。**

​		当一个请求路径是/greet/jp，baseUrl是/greet，当一个请求路径是/hello/jp，req.baseUrl是/hello。

~~~js
let express = require("express")
let app = express()
app.listen(3000)
let router = express.Router()
let greet = router.get("/p",function(req,res,next){
    //do somting
    console.log(req.baseUrl)
})
app.use("/hello",greet)
~~~

#### request对象之req.body

​		在请求的body中保存的是提交的一对对键值数据。默认情况下，它是undefined，**当你使用比如body-parser和multer这类解析body数据的中间件时，它是填充的**。

​	建议所有的项目, 都使用这个中间件, 这样可以保证我们获得数据格式统一且清晰

###### body-parser

1. 解析application/json的Content-Type的数据
2. 解析的application/x-www-form-urlencoded的Content-Type的数据
3. 解析text/plain的Content-Type的数据

server.js

解析application/json或者application/x-www-form-urlencoded或者text/plain

写法1：(关键处已标记)（推荐）

~~~js
let express = require("express")
let bodyparser = require("body-parser")
let app = express()
let jsonParse = bodyparser.json()//关键
let urlencoded = bodyparser.urlencoded({extended:true})//关键
//关键 用来解析application/json
app.use(jsonParse)
//关键 用来解析application/x-www-form-urlencoded
app.use(urlencoded)
app.post("/user",function(req,res,next){
    console.log("server has got..")
    res.setHeader(
        "Access-Control-Allow-Origin","*"
    )
    console.log(req.body)//返回一个前端对象
    res.end("success")
})
~~~

写法2：(关键处已标记)

~~~js
let express = require("express")
let bodyparser = require("body-parser")
let app = express()
let jsonParse = bodyparser.json()//关键
let urlencoded = bodyparser.urlencoded({extended:true})//关键
/*解析application/json*/
app.post("/user",jsonParse  function(req,res,next){ //关键
    console.log("server has got..")
    res.setHeader(
        "Access-Control-Allow-Origin","*"
    )
    console.log(req.body)//返回一个前端对象
    res.end("success")
})
/*解析application/x-www-form-urlencoded*/
app.post("/user",urlencoded  function(req,res,next){ //关键
    console.log("server has got..")
    res.setHeader(
        "Access-Control-Allow-Origin","*"
    )
    console.log(req.body)//返回一个前端对象
    res.end("success")
})
/*解析text-plain*/
app.post("/user", function(req,res,next){ //关键
    console.log("server has got..")
    res.setHeader(
        "Access-Control-Allow-Origin","*"
    )
    console.log(req.body)//返回一个前端对象
    res.end("success")
})
~~~

注：写法2 不推荐，代码太冗余了

**关于body-parse的底层实现：**

​		https://www.cnblogs.com/chyingp/p/nodejs-learning-express-body-parser.html

关于底层实现的关键代码粗记：

~~~js
var http = require('http');
var querystring = require('querystring');

var parsePostBody = function (req, done) {
    var length = req.headers['content-length'] - 0;
    var arr = [];
    var chunks;

    req.on('data', buff => {
        arr.push(buff);
    });

    req.on('end', () => {
        chunks = Buffer.concat(arr); //buffer用的很有参考意义
        done(chunks);
    });
};

var server = http.createServer(function (req, res) {
    parsePostBody(req, (chunks) => {//函数写法很有参考意义（回调源码啊这是
        var body = querystring.parse( chunks.toString() );  // 关键代码,text-plain的是这句
        res.end(`Your nick is ${body.nick}`)
    });
});

server.listen(3000);
~~~

text-plain的是这句：

~~~~js
var body = chunks.toString(); 
~~~~

application/json的是这句：

~~~js
var body = JSON.parse( chunks.toString() ); 
~~~

application/x-www-form-urlencoded是这句：

~~~js
 var body = querystring.parse( chunks.toString() ); 
~~~

###### multer

1. 解析new FormData出来的multipart/form-data的数据
2. 解析multipart/form-data数据
3. 可以用来上传文件

具体看express2的multer笔记

#### request对象之req.cookie

​		当使用cookie-parser中间件的时候，这个属性是一个对象，其包含了请求发送过来的cookies。如果请求没有带cookies，那么其值为{}

~~~js
let express = require("express")
let app= express()
let cookieParser = require("cookie-parser")
app.use(cookieParser())//使用方式和bodyParser差不多
//Cookie: name="ss"
app.get("/user",(req,res,next)=>{
    console.log(req.cookies.name)
})
~~~

#### request对象之req.params

​		一个大型网站的**子页面可能有数百数千万**, 比如百度知道, 百度搜索分页等等,这每个分页的网址都不一样,我们不可能写个几百几千万的网页的

​		所以我们采用的都是**以模板+数据然后返回特殊的值的方式来生成无数个子页面**, 这个时候我们就得采取一个灵活的措施来应对这些个动态的网页

  **模板 + 数据 = 无数的网页**

~~~js
app.get("/user/article/:id",(req,res,next)=>{
    console.log(req.param）//弃用，不存在
    //http://localhost:3000/user/article/1234
    console.log(req.params.id)//1234
    console.log(req.params)//{id:1234}
    //http://localhost:3000/user/article/1234
})
app.get("/user/:name/article",(req,res,next)=>{
    //http://localhost:3000/user/shenjiee/article
    console.log(req.params)//{ name: 'shenjiee' }
})
app.get("/user/:name/article/:id",(req,res,next)=>{
    //http://localhost:3000/user/shenjiee/article/1234
    console.log(req.params)//{ name: 'shenjiee', id: '1234' }
})
~~~

#### request对象之app.param中间件

​		app.param中间价可以监听某个特定ID被访问的情况,可以**优先做好一些预处理或是做一些基本配置数据**

~~~js
let express = require("express")
let app = express()
let str;
app.param("id",(req,res,next,id)=>{
    console.log("id为："+id)//id为：1234
    id="ID is" + id
    str = id+"hello world"
    next()
})
app.get("/user/:name/article/:id",(req,res,next,id)=>{
 	console.log(req.params)//{ name: 'shenjie', id: '1234' }
    res.end(str)//ID is1234hello world
})
~~~

注：从 id="ID is" + id 可知，id属性对应的值不会改变，想把id的值修改一下，可以借助全局变量str

#### request对象之其他属性

1. req.hostname

   包含了源自HostHTTP**头部的hostname**

   ~~~js
   //Host：“example.com"
   req.hostname
   // => "example.com"
   ~~~

2. req.path

   包含请求URL的部分路径。

   ~~~js
   //Host“example.com/users?sort=desc"
   req.path
   // => "/users"
   ~~~

3. req.protocol

   请求的协议，一般为http，当启用TLS加密，则为https。

   ~~~js
   req.protocol
   // => "http"
   ~~~

4. req.query

   一个对象，为每一个路由中的query string参数都分配一个属性。如果没有query string，它就是一个空对象，{}。

   ~~~js
   //Host“example.com/users?sort=desc&shoe[color]="red"&shoe[type]="coverage"
   req.query
   //{ sort: 'desc', shoe: { color: '"red"', type: '"coverage' } }
   ~~~

#### request对象的方法之accepts(types)

​		**基于请求的Accept HTTP头部，检查指定的内容类型是否被接受 。**这个方法返回最佳匹配，如果没有一个匹配，那么其返回undefined(在这个case下，服务器端应该返回406和"Not Acceptable")。
**type值可以是一个单的MIME type字符串(比如application/json)**，一个扩展名比如json，一个逗号分隔的列表，或者一个数组。对于一个列表或者数组，这个方法返回最佳项(如果有的话)。

​		这个**可以用来所返回的数据类型的校验**

比如我们写一个包含所有数据数据类型的数组，然后，进来遍历，如若返回的不是undefined说明这个数据类型支持，反之不支持

Accept的的type值举例：

~~~js
Accept:text/html
Accept:text/* 
Accept:text/*;q=.5,application/json
~~~

![image-20201111222933655](C:\Users\申杰\AppData\Roaming\Typora\typora-user-images\image-20201111222933655.png)

#### request对象的方法之accepts的衍生方法

###### req.acceptsCharsets(charset[, ...])
​		**返回指定的字符集集合中第一个的配置的字符集**，基于请求的Accept-CharsetHTTP头。如果指定的字符集**没有匹配的，那么就返回false。**

###### req.acceptsEncodings(encoding[, ...])

​	 **返回指定的编码集合中第一个的配置的编码，**基于请求的Accept-EncodingHTTP头。如果指定的编码集**没有匹配的，那么就返回false**。

###### req.acceptsLanguages(lang [, ...])

​		**返回指定的语言集合中第一个的配置的语言**，基于请求的Accept-LanguageHTTP头。如果指定的语言集**没有匹配的，那么就返回false**。

#### request对象的方法之获取请求头的详细数据

###### req.get(field)

返回指定的请求HTTP头部的域内容(不区分大小写)。

例如：

~~~js
req.get("Content-type")
// text/plain
req.get("Something")
// undefined
~~~

### response对象

​		res对象代表了当一个HTTP请求到来时，Express程序返回的HTTP响应。

**res.headersSent**：布尔类型的属性，指示这个**响应是否已经发送HTTP头部**。

~~~js
app.get("/",function(req,res){
    console.log(res.headersSent)//false
    res.end("OK")
    console.log(res.headersSent)//true
})
~~~

#### Response对象的方法之append(field,value)

​		在指定的field的HTTP头部追加特殊的值value。如果这个头部没有被设置，那么将用value新建这个头部。value可以是一个字符串或者数组。

注意：
1:多次调用**res.append**添加同一个样式,效果是多个同名域的值相同(或者不同，反正**不会覆盖**)
2:在res.append()之后调用**res.set()**函数将重置前面设置的值（**会覆盖**）

#### Response对象的方法之attachment([filename])（下载方式1）

```
Content-Disposition: attachment
Content-Disposition: inline
Content-Disposition: attachment; filename="filename.jpg"
```

​		设置HTTP响应的Content-Disposition头内容为"attachment"。如果**提供了filename**，那么将通过**res.type()获得扩展名来设置Content-Type**，并且设置**Content-Disposition内容为"filename="parameter**。

​		在常规的HTTP应答中，**Content-Disposition 响应头指示回复的内容该以何种形式展示**，是以内联的形式（即网页或者页面的一部分），还是以附件的形式下载并保存到本地。

​		在HTTP场景中，第一个参数**或者是inline**（默认值，表示回复中的消息体会以页面的一部分或者整个页面的形式展示）**，或者是attachment**（意味着消息体应该被下载到本地；大多数浏览器会呈现一个“保存为”的对话框，将filename的值预填为下载后的文件名，假如它存在的话）。

下载附件：

~~~js
app.get("/",function(req,res){
    fs.readFile("./images/1.jpg",(err,data)=>{
        console.log(data)
        res.attachment("hello.jpg")
        res.send(data)
    })
})
~~~

注：此时会直接完成下载，如果下载内容是一个可执行程序，会弹出提示的

#### Response对象的方法之download(path, [,filename], [,fn])（下载方式2）

**传输path指定的文件作为一个附件。**
通常，浏览器提示用户下载。默认情况下，Content-Disposition头部"filename="的参数为path(通常会出现在浏览器的对话框中)。通过指定filename参数来覆盖默认值。
当一个错误发生时或者传输完成，这个方法将调用fn指定的回调方法。

~~~js
app.get("/",function(req,res){
	res.download(`${__dirname}/images/1.jpg`,"1.jpg",(err)=>{
        if(err){
            console.log(err)
        }else{
             res.sendFile(`${__dirname}/images/1.jpg`)
        }
    })
})
~~~

**注：**

1. **这个方法使用res.sendFile()来传输文件。**
2. **download的第一个路径参数一定要在sendFile里面配置上**

#### Response对象的方法之res.sendFile(path [, options] [, fn(err)])

​		传输path指定的文件。根据文件的扩展名设置Content-Type的HTTP头部。除非在options中有关于root的设置，**path一定是关于文件的绝对路径**。

​		当传输完成或者**发生了什么错误，这个方法调用fn回调方法**。如果这个回调参数指定了和一个错误发生，回调方法必须明确地通过结束请求-响应循环或者传递控制到下个路由来处理响应过程。

​	options参数细节：

| 属性         | 描述                                                         | 默认值   | 可用版本 |
| ------------ | ------------------------------------------------------------ | -------- | -------- |
| maxAge       | 设置Cache-Control的max-age属性，格式为毫秒数，或者是ms，format的一串字符串 | 0        |          |
| root         | 相对文件名 的根目录                                          |          |          |
| lastModified | 设置last-Modified头部为此文件在系统中的最后一次修改时间，设置false来禁用它 | Enable   | 4.9.0+   |
| headers      | 一个对象，包含了文件所在的server 的HTTP头部                  |          |          |
| dotfiles     | 是否支持**点开头文件名**的选项。可选的值“allow","deny","ignore" | "ignore" |          |

#### Response对象的方法之res.cookie(name, value [,options])

​		设置name和value的cookie，value参数可以是一串字符或者是转化为json字符串的对象。

​		options是一个对象，其可以有下列的属性。

| 属性     | 类型    | 描述                                                         |
| -------- | ------- | ------------------------------------------------------------ |
| domain   | String  | **设置cookie的域名**，默认是你本app的域名                    |
| expires  | Date    | **cookie的过期时间**，GMT格式。如果没有指定或者设置为0，则产生新的cookie。 |
| httpOnly | Boolean | 这个cookie**只能被web服务器**获取的标示。                    |
| maxAge   | String  | 其为**过期时间**到当前时间的**毫秒值**                       |
| path     | String  | **cookie的路径**。默认值是/。                                |
| secure   | Boolean | 标示这个cookie**只能被HTTPS协议使用**。                      |
| signed   | Boolean | 指示这个**cookie**应该是**签名**的。(安全性使用)             |

1. **服务端获取和设置一个cookie**：

   备注：cookie  sessionStorage和localStorage中只有cookie是可以在服务端和客户端来回发送的

   方式1：通过req.get("cookie")得到一个cookie的字符串（不好用）

   方式2：通过cookie-parser得到对cookie的字符串加工后的数据（好用）

   ~~~js
   app.get("/",function(req,res){
       let name = req.cookies.name
       console.log(name)
       if(name === "shenjie"){//获取cookie
           console.log(req.cookies.name)
       }else{//设置cookie
           res.cookie("name","shenjie",{
               maxAge:20000
           })
       }
       res.end("hello")
   
   })
   ~~~

#### Response对象的方法之res.format(object)

​		根据请求的对象中AcceptHTTP头部指定的接受内容。它使用req.accepts()来选择一个句柄来为请求服务，这些句柄按质量值进行排序。如果这个头部没有指定，那么第一个方法默认被调用。当不匹配时，服务器将返回406"Not Acceptable"，或者调用default回调。

​		例子:

~~~js
app.get("/",function(req,res){
    res.type("application/json")//设置contentType类型
    res.send({message:"hey"})
}
~~~

此时前端页面显示{"message":"hey"}

实际开发中，我们可以**根据不同的请求头内容响应不同的内容格式**：

例子：

当我们在浏览器地址栏输入一个localhost:3000请求服务器的时候，实际上我们发送到服务器的contentType是text/html

~~~js
    res.format({
        "text/plain":function(){
            res.send("hey")
        },
        "text/html":function(){ //这个会被返回（根据请求文本形式）
            res.send("<p>hey</p>")
        },
        "application/json":function(){
            res.send({message:"hey"})
        },
        "default":function(){
            res.status(406).send("no Accept")
        }
    })
~~~

(前端meta设置了content-type是text/html)

#### Response对象的方法之res.redirect([status,] path)

  1. **重定向来源于指定path的URL**，以及指定的HTTP status codestatus。如果你没有指定status，**status code默认为"302 Found"**。

  2. **重定向也可以是完整的URL**，来重定向到不同的站点。

  3. **重定向也可以相对于当前的URL**。比如，来之于http://example.com/blog/admin/**(注意结尾的/)**，下面将重定向到http://example.com/blog/admin/post/new。

     ~~~js
     res.redirect("post/new")
     ~~~

     如果**结尾没有/**那么将重定向到：http://example.com/blog/post/new。**（中间少了/admin)**

     ~~~js
     res.redirect("post/new")
     ~~~

		4. 如果你当前的路径为http://example.com/admin/post/new，下面的操作将重定向到http://example.com/admin/post：

     ~~~js
     res.redirect("..")
     ~~~

     

**经验：**

当我们请求一个路径的时候，一般是先查看登录的时候cookie里有没有存用户的登录信息，存在就自动登录，跳转到该页

不存在就让它跳转到登录页面，并在登录之后，把用户信息存储到cookie

此时为了让登录的网址显示的合理：就需要用到重定向

代码展示：

~~~js
let express = require("express")
let fs = require("fs")
let app = express()
let cookieParser = require("cookie-parser")
app.use(cookieParser())
app.get("/article",function(req,res,next){
    res.setHeader('Content-type',"text/html;charset=utf-8")
    let name = req.cookies.name
    console.log(name)       
    if(name === "shenjie"){
        // res.redirect(302,"/article")

        //方式1
        next()
        //方式2：
        // fs.readFile(`${__dirname}/article.html`,(err,data)=>{
        //     console.log(data)
        //     res.end(data)
        // })
    }else{
        res.redirect("/login")
    }
})
app.get("/article",(req,res)=>{
    res.setHeader('Content-type',"text/plain;charset=utf-8")
    res.end("文章")
})
app.get("/login",(req,res)=>{
    res.setHeader('Content-type',"text/plain;charset=utf-8")
  res.cookie("name","shenjie",{
            maxAge:20000
        })
    res.end("登录页")
})
app.listen(3000)
~~~

备注：**设置响应的字符编码有俩种方式**：

1.  res.setHeader(个人选择)
2. res.wirteHead(200,{})

跳转页面有俩种方式：

1. ~~~js
   fs.readFile(`${__dirname}/article.html`,(err,data)=>{res.send(data)})
   ~~~

2. ~~~js
    res.redirect("/article")//这种方式更合理
   ~~~

   

