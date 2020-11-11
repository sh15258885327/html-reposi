#### Node核心模块(Query String)
##### 一、Query String模块简介
querystring从字面上的意思就是查询字符串，**一般是对http请求所带的数据进行解析**。querystring模块只提供4个方法。

###### 1. querystring.parse：将一个字符串反序列化为一个对象
语法：querystring.parse(str[, sep[, eq[, options]]])
- str需要反序列化的字符串
- sep可选，用于分割str字符串的字符或字符串，默认为"&"
- eq可选，用于划分键和值的字符或字符串，默认为"="
- options可选，是个对象，可设置maxKeys属性，传入一个number类型值，指定解析键值对的最大值，默认1000，如果设置为0，则取消解析的数量限制。
###### 2. querystring.stringify：将对象序列化成一个字符串，跟parse相对
语法：querystring.stringify(obj[, sep[, eq[, options]]])
- obj需要序列化的对象
- sep可选，用于连接键值对的字符或字符串，默认为"&"
- eq可选，用于连接键和值的字符或字符串，默认为"="
- options可选，是个对象，可设置encodeURIComponent属性，值类型为function，可以将一个不安全的url字符串转换成百分比的形式，默认为querystring.escape()
###### 3. querystring.escape：让传入的字符串进行编码
语法：querystring.escape(str)
###### 4. querystring.unescape：将含有%的字符串进行解码
语法：querystring.unescape(str)

总结:

用url.parse(req.url).query来获取get数据 用req.on("data",chunk->{/..})结合querystring来处理post数据

##### 二 events模块

回调函数模式让 Node 可以处理异步操作。

为了适应回调函数，异步操作只能有**两个状态：开始和结束**。

对于那些**多状态的异步操**作（状态1，状态2，状态3，……），**回调函数就会无法处理**，你**不得不将异步操作拆开，分成多个阶段**

每个阶段结束时，调用下一个回调函数。

**为了解决这个问题**，Node 提供 Event Emitter 接口。通过事件，**解决多状态异步操作的响应问题。**

###### events的使用：

1. 安装 和引入

~~~js
npm i events --save-dev
~~~

~~~js
var Event = require(“events)
let myEmitter = new Event()
~~~

2. 注册事件

   ~~~js
   myEmitter.on(‘someevent',function(){//这是一个匿名函数,不能移除
                ...
   })
   ~~~

   激活事件

   ~~~js
   myEmitter.emit(‘someevent')
   ~~~

   注：Events模块之once激活：

   该方法类似于on方法，但是回调函数只触发一次。

   ~~~js
   myEmitter.once(‘someevent',function(){
                ...
   })
   myEmitter.emit(‘someevent')//触发
   myEmitter.emit(‘someevent')//不触发
   ~~~

3. Events模块之removeListener()

   该方法**用于移除回调函数**。它接受**两个参数**，第一个是**事件**名称，第二个是**回调函数**名称。这就是说，不能用于移除匿名函数。

   ~~~js
   function test(){
       ...
   }
    myEmitter.on('someEvent',test)
    myEmitter.removeListener('someEvent',test)
   ~~~

   注：**on和removeListener的参数都是一个事件名和一个函数,** 

4. Events模块之**单事件多函数绑定和解绑**

   **单个事件可以绑定多个函数,** 

   每个函数被激活的**顺序**就是绑定的顺序
   **单个函数也可以绑定多个事件 **

5. Events模块之**setMaxListeners(10)**

   ​	Node默认允许同一个事件最多可以指定10个回调函数

   ​	就是一个警告而已，不影响执行

6. Events模块之清除所有回调函数

   1. emitter.removeAllListeners(“someEvent")：

      **移除某个事件的所有**回调函数

   2. emitter.removeAllListeners();

      **移除所有事件的**所有回调函数。

7. Events模块之**获取**所有回调函数

   ​	emitter.listeners(“someEvent”)：

   ​	返回该事件所有回调函数组成的数组。

8. Events模块之错误处理

   ​	事件处理过程中抛出的错误，可以**使用try...catch捕获**。

   ​	**一旦被捕获**，该事件**后面的监听函数都不会再执行**了

9. Events模块之**事件类型 **

   注：这是俩大**默认支持的事件**，前面写的那些事件是xxx事件

   1. **newListener事件**：添加新的回调函数时触发。

   2. **removeListener事件**：移除回调时触发。

   ~~~js
   ee.on('newListener',function(a){
       console.log("a:"+a)
   })
   ee.on('removeListener',function(b){ //此时会触发a一次
       console.log("b:"+b)
   })
   function foo(){}
   ee.on("save-user",foo) //此时 会触发 a 第二次
   ee.removeListener("save-use",foo) //此时会触发 b一次
   ~~~

   