### ajax实例之跨域请求

​		默认情况下，JavaScript在发送AJAX请求时，**URL的域名必须和当前页面完全一致**。
完全一致的意思是，**域名要相同**（www.example.com和example.com不同），**协议要相同**（http和https不同），**端口号要相同（**默认是:80端口，它和:8080就不同）。有的浏览器口子松一点，允许端口不同，大多数浏览器都会严格遵守这个限制。

###### ajax实例之跨域请求的实现方式之CORS

​		CORS全称Cross-Origin Resource Sharing

​		假设本域是my.com，外域是sina.com，**只要响应头Access-Control-Allow-Origin为http://my.com**，或者是*，本次请求就可以成功。

​		可见，跨域能否成功，取决于对方服务器**是否愿意给你设置一个正确的Access-Control-Allow-Origin**，决定权始终在对方手中。

​		上面**这种跨域请求，称之为“简单请求”。**简单请求包括GET、HEAD和POST（POST的Content-Type类型 仅限application/x-www-form-urlencoded、multipart/form-data和text/plain），并且不能出现任何自定义头（例如，X-Custom: 12345）。

​		**对于PUT、DELETE以及其他类型如application/json的POST请求**，在发送AJAX请求之前，浏览器会先发送一个OPTIONS请求（称为preflighted请求）到这个URL上，**询问目标服务器是否接受**：

​		**服务器必须响应并明确指出允许的Method：**

​		浏览器确认服务器响应的Access-Control-Allow-Methods头确实包含将要发送的AJAX请求的Method，才会继续发送AJAX，否则，抛出一个错误。

​		由于以POST、PUT方式传送JSON格式的数据在REST中很常见，所以要跨域正确处理POST和PUT请求，服务器端必须正确响应OPTIONS请求。

###### ajax实例之跨域请求的实现方式之JSONP的实现思路

​		JSONP的全称是JSON with Padding，由于同源策略的限制，XmlHttpRequest只允许请求当前源（协议，域名，端口）的资源。**如果要进行跨域请求，我们可以通过使用html的script标记来进行跨域请求，并在响应中返回要执行的script代码**( 因为外联的js文件地址没有同源的限制要求, 为了实现CDN )，其中**可以直接使用JSON传递javascript对象。这种跨域的通讯方式成为JSONP**。

1. 网页 发送 一个 js文件请求：

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
    <script>
        function getDate(a){
           console.log(a)
        }
    </script>
   </body>
   <script src="http://127.0.0.2:3000/data?func=getDate"></script>
   </html>
   ~~~

   

2. 服务器获取参数和回调函数名，根据参数准备数据并把数据作为参数传入回调函数中

   server.js

   ~~~js
   const http = require("http")
   http.createServer((req,res)=>{
       console.log("server start")
       res.writeHead(200, {'Content-type' : 'application/json'});
       res.write(`getDate({'a':1})`)
       res.end()
   }).listen(3000,'127.0.0.2')
   ~~~

   

Json:

~~~json
{
    "roses":"red",
    "violets":“blue",
    "grass":"green"
}
~~~

jsonp：

~~~jsonp
grab{
    "roses":"red",
    "violets":“blue",
    "grass":"green"
}
~~~

json思想自我总结：

 1. script标签可以跨域请求文件

 2. 所以我让服务器返回一个文件

    ~~~js
    res.write('文件字符串')
    ~~~

	3. 现在我让这个文件是一个携带参数的可执行函数发送过去，就实现了数据的传递

	4. 为了不让传递的数据混乱：所以我们在请求服务器的时候，就把对应的函数名写好在路径里发送过去，然后服务器返回的时候就以这个函数名来命名就可以了

    ~~~js
     res.write(`getDate({'a':1})`)
    ~~~

    

