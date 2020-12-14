#### Node核心模块(HTTP、fs)

在Node中，想要使用哪一个模块，我们就直接require那个模块。
##### 一、HTTP模块
http模块不是基于特定语言的，是一个通用的应用层协议。
1. METHODS：是一个数组，里面存储着所有支持的请求方法。
2. STATUS_CODES：是一个http模块基本状态类对象，属性名是状态码，属性值则是该状态码的简短解释。
~~~js
let http = require("http");
let server = http.createServer(function(res,req){
    req.writeHead(200,{'content-type':'text/html;charset=utf-8'});
    console.log(res.url)//   /hello.html
    if(res.url==="/hello.html"){
        req.end("hello world");
    }
    else{
        req.end("页面访问错误");
    }
   
})
server.listen(3002,"localhost");
~~~

##### http模块之服务器处理POST请求

​		当客户端采用POST方法发送数据时，服务器端可以对data和end两个事件，设立监听函数。

​		**data事件会在数据接收过程中，每收到一段数据就触发一次，接收到的数据被传入回调函数。end事件则是在所有数据接收完成后触发。**

~~~js
var http = require("http");
http.createServer((req,res)=>{
    var content="";
    req.on("data",function(chunk){
        content+=chunk
    })
    req.on("end",function(){
        res.writeHead(200,{'content-type':'text/plain'})
        res.write("you've sent"+content)
        res.end()
}).listen(3000)
~~~

##### http模块之在服务器端发送请求

1. get方法用于发出get请求。

~~~js
http.get({
    host:“www.aa.com",
    path:"/email"
},(response)=>{
    var body = ''
    response.on('data',function(d){
        body+=d
    })
    response.on('end',()=>{
        var parsed = JSON.parse(body)
        ...
    })
})
~~~

2. http.request方法

~~~js
http.request(options,[callback])
~~~

​		**request方法的options参数，可以是一个对象，也可以是一个字符串**。如果是字符串，就表示这是一个**UR**L，Node内部就会自动调用url.parse()，处理这个参数。

options对象可以设置如下属性

![image-20201106120341578](C:\Users\申杰\AppData\Roaming\Typora\typora-user-images\image-20201106120341578.png)

##### 二、fs模块

主要用来处理文件和目录的读写、复制、删除、重命名等操作。fs模块中的所有方法都有异步和同步版本。
**同步方法执行完并返回结果后，才能执行后续的代码。而异步方法采用回调函数接收返回结果，可以立即执行后续代码。**

###### 1、读取文件readFile
语法：fs.readFile(filename, [options], callback)三个参数
- filename是文件名;
- [options]是个可选参数，为一个对象，用于指定文件编码(encodeing)及操作方式(flag);
- callback是回调函数，传递异常err和文件内容data的2个参数。
~~~js
let http = require("http");
let fs = require("fs");
let server = http.createServer(function(res,req){
    req.writeHead(200,{'content-type':'text/html;charset=utf-8'});
    if(res.url==="/getResource.html"){
        let data = fs.readFile("test.txt",function(err,data){
            if(err){
                throw err
            }else{
                req.end(data);
            }
        });   
    }
    else{
        req.end("页面访问错误");
    }
   
})
server.listen(3002,"localhost");
~~~



###### 2、写入文件writeFile
语法：fs.writeFile(filename, data, [options], callback)四个参数
- filename是文件名
- data是要写入文件的数据
- options是个可选参数,为一个对象，包含编码格式(encodeing),模式(mode)以及操作方式(flag)
- callback是回调函数

flag的值|作用
---|---
r|读取文件，文件不存在时报错
r+|读取并写入文件，文件不存在时报错
rs|以同步的方式读取文件，文件不存在时报错
rs+|以同步方式读取并写入文件，文件不存在时报错
w|写入文件，文件不存在则创建，存在则清空
wx|和w一样，但是文件存在时会报错
w+|读取并写入文件，文件不存在则创建，存在则清空
wx+|和w+一样，但是文件存在时会报错
a|以追加方式写入文件，文件不存在则创建
ax|和a一样，但是文件存在时会报错
a+|读取并追加写入文件，文件不存在则创建
a+x|和a+一样，但是文件存在时会报错

-----

###### 追加写入内容


~~~js
let http = require("http");
let fs = require("fs");
let server = http.createServer(function(res,req){
    req.writeHead(200,{'content-type':'text/html;charset=utf-8'});
    if(res.url==="/getResource.html"){
        let data = fs.readFile("test.txt",function(err,res){
            if(err){
                throw err
            }else{
                req.end(res);
            }
        });   
    }else if(res.url==="/putResource.html"){
        fs.writeFile("test.txt","被追加写入的内容 ",{'flag':'a+'},(err,data)=>{
            if(err){
                throw err
            }else{
                let data = fs.readFile("test.txt",function(err,res){
                    if(err){
                        throw err
                    }else{
                        req.end(res);
                    }
                });  
            }
        })
    }
    else{
        req.end("页面访问错误");
    }
   
})
server.listen(3002,"localhost");
~~~



**使用fs.read()和fs.write()读写文件需要使用fs.open打开文件和fs.close关闭文件。**

###### 3、读取文件read
语法：fs.read(fd, buffer, offset, length, position, callback)六个参数
- fd是文件描述符，必须接收fs.open()方法中的回调函数返回的第二个参数
- buffer是存放读取到的数据的Buffer对象
- offset指定向buffer中存放数据的起始位置
- length指定读取文件中数据的字节数
- position指定在文件中读取内容的起始位置
- callback回调函数，参数有err(用于抛出异常)
，bytesRead(从文件中读取内容符实际字节数)，buffer(被读取的缓存区对象)
~~~js
else if(res.url==="/partData.html"){
    fs.open("test.txt","r",function(err,fd){
        if(err){
            throw err
        }
       // let buffer = new Buffer(255);这个被改了,用这个的话.close的时候会报错
          let buffer = new Buffer.alloc(255);
        fs.read(fd,buffer,0,10,0,function(err,byteData,buffer){
            console.log(byteData,buffer.slice(0,byteData).toString());
        })
	 fs.close(fd);
    });
}
~~~

###### 4、写入文件wrtie
语法：fs.wrtie(fd, buffer, offset, length, position, callback)六个参数。参数和fs.read()相同，buffer是需要写入文件的内容。

~~~js
else if(res.url==="/writePartData.html"){
    fs.open("test.txt","w",function(err,fd){
        if(err){
            throw err
        }
        fs.write(fd,"这是我要写入的文件",0,10,function(err,dara,da){
            console.log(dara,da);
        });
    })
}
~~~

注:这里buffer是不需要再使用了

###### 5、创建目录
语法：fs.mkdir(path, [mode], callback)
- path是需要创建的目录
- [mode]是目录的权限(默认值是0777)
- callback是回调函数

###### 6、删除目录
语法：fs.rmdir(path, callback),只能删除空目录

###### 6.2删除文件

fs.unlink(path,callback)

###### 7、读取目录
语法：fs.readdir(path, callback)
###### 8、查看文件与目录信息
语法：fs.stat(path, callback)
- path要查看目录/文件的完整路径
- callback操作完成回调函数，err(错误对象),stats(fs.stat一个对象实例，提供如:isFile, isDirectory等方法)
###### 9、查看文件与目录是否存在

**注:fs.exists(path, callback)已经弃用**

语法：fs.existsSync(path, callback)
- path查看目录文件的完整路径
- callback操作完成的回调函数，exists true存在，false不存在

###### 10、移动文件/重命名

**重命名和移动文件所使用的方法都是rename**

fs.rename(path1,path2,callback);

如果path1和path2在同一路径下,只是文件名不同,那么就相当于改名

如果path1和path2不在同一路径下,那么就是文件移动(还可以一边移动一边改名)

###### 11、createReadStream()

​		**createReadStream方法往往用于打开大型的文本文件，创建一个读取操作的数据流**。所谓大型文本文件，指的是文本文件的体积很大，读取操作的缓存装不下，只能分成几次发送，每次发送会触发一个data事件，发送结束会触发end事件。

~~~js
var input = fs.createReadStream('lines.txt')
input.on('data',function(data){
    console.log(data)
})
input.on('end',function(){
     ...
})
~~~

###### 12、createWriteStream()

​		createWriteStream方法创建一个写入数据流对象，**该对象的write方法用于写入数据，end方法用于结束写入操作**。

~~~js
var out = fs.createWriteStream(fileName,{
    encoding:'utf8'
})
out.write(str)
out.end()
~~~

###### 13、复制

方法1：(简单，但无法复制大文件)

~~~js
fs.writeFielSync(target,fs.readFileSync(src))
~~~

方法2：(读取大文件时不太容易导致内存溢出,代码比较复杂,由于读取和写入的速度不一样，同样存在内存溢出的风险，不过比 第一个要好很多)

~~~js
let rs = fs.createReadSream(‘index.txt')
fs.createWriteStream(fileName,function(data){
    rs.on('data',function(chunk)=>{
          	  ws.write(chunk)
          })
    rs.on('end'()=>{
        ws.end()
    })
})
~~~

3. 第三种方式：（同步了读取和写入的速度，没有内存溢出的风险代码比较复杂）

~~~js
let rs = fs.createReadSream(‘index.txt')
fs.createWriteStream(fileName,function(data){
    rs.on('data',function(chunk)=>{
          if(ws.write(chunk)===false){
        		ws.pause()
    		}else{
              	ws.resume()
            }
          	  
          })
    rs.on('end'()=>{
        ws.end()
    })
})
~~~

4. **第四种方式：推荐（代码简洁,没有内存溢出的风险）**（经典）

   ~~~js
   fs.createReadStream(src).pipe(fs.createWriteStream(target))
   ~~~

上述代码综合:

~~~js
let fs = require("fs");
let path = require("path");
let bol = fs.existsSync("test.txt");//可以是文件也可以是文件夹
console.log(bol);
if(bol){
    fs.mkdir("box",function(err,data){
        if(err){
            throw err
        }
        let da =  fs.readFileSync("test.txt","utf-8");
        //删除文件的方法,,,rmdir只能删除空文件夹
        fs.unlinkSync("test.txt");
        //写一个文件
        fs.writeFile("./box/test.txt",da,"utf-8",function(err,data){
            if(err){
                throw err
            }
            console.log(data)
        })

    });
}else{
    //找到box文件夹
    let pa = path.join(__dirname,"/box");
    //递归遍历文件夹,是文件删除,不是继续往下递归
    deleteDir()
    function deleteDir(){
        //读取这个文件夹的目录
        let files = fs.readdirSync(pa);
        files.forEach(file => {
            //找到路径
            let curPath = pa+"\\"+file;
            //判断是文件夹还是文件
            if(fs.statSync(curPath).isFile()){
                //删除文件
                fs.unlinkSync(curPath);
            }else{
                //是文件夹向下递归
                deleteDir()
            }
        });
    }
    //删除空文件夹
    fs.rmdirSync("./box");
    //把这个文件放到原文件夹的同级处
    fs.writeFileSync("test.txt","没想到吧,我又回来啦");
}
~~~



##### 三、 buffer模块

已经变更：.......

https://www.runoob.com/nodejs/nodejs-buffer.html

numbermonk.com

这个网址会展示 十进制  十六进制  二进制 和 罗马数字对应的表

Buffer对象是Node**处理二进制数据**的一个接口。它是Node原生提供的全局对象，可以直接使用，**不需要require('buffer')。**

 数据流），就不太擅长。Buffer对象就是为了解决这个问题而设计的。它是一个构造函数，**生成的实例代表了**V8引擎分配的**一段内存**，是一个**类似数组**的**对象**，成员都为0到255的整数值，即一个8位的字节。

Buffer作为构造函数，可以用new命令生成一个实例，

它**可以接受多种形式的参数**。

1. **参数是整数**，指定分配给多少个字节内容

~~~js
var storage = new Buffer(1052)
~~~

2. **参数是数组**，参数成员必须是整数值

~~~js
var storage = new Buffer([0x48,0x65,0x6c,0x6c,0xf])
storage.toString() //'hello'
~~~

3. **参数是字符串**，默认为utf-8编码

~~~js
var hello = new Buffer('hello')//省略编码
hello.toString()//hello
hello.length//5
var hello = new Buffer('hello','utf-8')//不省略编码
~~~

4. **参数是另一个参数的实例**，等同于**拷贝**后者

~~~~js
var hello = new Buffer('hello')//省略编码
var hello2= new Buffer(hello)//不省略编码
~~~~

###### buffer值的转换

1. ascii
2. utf8
3. utf16le：UTF-16的小端编码，支持大于U+10000的四字节字符。
4. ucs2：utf16le的别名。
5. base64
6. hex：将每个字节转为两个十六进制字符。

###### buffer的基本方法

假设：buffer代表 Buffer的一个实例

​			Buffer代表 Buffer的构造函数本身

| buffer.copy(anotherBuffer,0,4,8)         | 深拷贝，复制，从anotherBuffer的第四个开始复制，复制到第七个（左闭右开），复制到anotherBuffer的第0个位置开始复制 |
| ---------------------------------------- | ------------------------------------------------------------ |
| var anotherBuffer = buffer.slice(4,8)    | **浅拷贝**，从buffer的第4个开始复制到第七个到anotherBuffer中 |
| Buffer.isEncoding('utf-8')               | 返回布尔值，判断编码格式                                     |
| Buffer.isBuffer(Object)                  | 返回布尔值，判断对象是否为Buffer实例。                       |
| Buffer.byteLength(’hello'，’utf8')       | 返回字符串**实际占据**的字节长度，默认编码方式为utf8。       |
| Buffer.concat([buffer1,buffer2,buffer3]) | 将一组**Buffer对象合并**为一个Buffer对象。                   |
| buffer.write('hello')                    | write方法可以向指定的Buffer对象写入数据                      |
| buffer.toString('utf8',5,9)              | toString方法将Buffer实例，按照指定编码（默认为utf8）转为字符串。第二个参数是起始位置，第三个参数是终止位置 |
| buffer.toJSON()                          | toJSON方法将Buffer**实例转为JSON对象**。如果J**SON.stringify方法**调用Buffer实例，**默认会先调用toJSON方法**。 |

###### buffer的实例属性

length：

​		length属性返回Buffer对象所占据的内存长度。注意，这个值与Buffer对象的内容无关。

​		不管写入什么内容，**length属性**总**是**返回Buffer对象的**空间长度**。如果想知道一个字符串所占据的**字节长度**，可以将其传入**Buffer.byteLength**方法。

​		length属性是可写的，但是这会导致未定义的行为，不建议使用。如果想**修改Buffer对象的长度**，建议**使用slice方法**返回一个**新的Buffer对象**。

​		