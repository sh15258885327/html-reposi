### stream模块

#### stream的概念

​		数据读写可以看作是事件模式（Event）的特例，**不断发送的数据块好比一个个的事件**。读数据是read事件，写数据是write事件，而数据块是事件附带的信息。Node 为这类情况提供了一个特殊接口Stream。

​		数据流“（stream）是处理系统缓存的一种方式。操作系统采用数据块（chunk）的方式读取数据，每收到一次数据，就存入缓存。Node应用程序有两种缓存的处理方式，**第一种是等到所有数据接收完毕，一次性从缓存读取，**这就是传统的读取文件的方式；**第二种是采用“数据流”的方式，收到一块数据，就读取一块，**即在数据还没有接收完成时，就开始处理它。

​		第一种方式先将数据全部读入内存，然后处理，优点是符合直觉，流程非常自然，缺点是如果遇到大文件，要花很长时间，才能进入数据处理的步骤**。第二种方式**每次只读入数据的一小块，像“流水”一样，每当系统读入了一小块数据，就会触发一个事件，发出“新数据块”的信号。应用程序只要监听这个事件，就能掌握数据读取的进展，做出相应处理，这样就**提高了程序的性能**。

#### stream模块

​		在 Node.js 中有四种基本的流类型：**Readable（可读流），Writable（可写流），Duplex（双向流），Transform（转换流）**。

1. 可读流是数据可以被消费的源的抽象。一个例子就是 fs.createReadStream 方法。
2. 可读流是数据可以被写入目标的抽象。一个例子就是 fs.createWriteStream 方法。
3. 双向流即是可读的也是可写的。一个例子是 TCP socket。
4. 转换流是基于双向流的，可以在读或者写的时候被用来更改或者转换数据。一个例子是 **zlib.createGzip 使用 gzip 算法压缩数据**。你可以将转换流想象成一个函数，它的输入是可写流，输出是可读流。

##### stream模块之pipe方法

###### readableSrc.pipe(writableDest)

​		在这一行简单的代码中，我们导入可读流的输出 -- 源数据，作为可写流的输入 -- 目标。源数据必须是一个可读流，目标数据必须是一个可写流。当然，他们也都可以是 双向流/转换流。

​	最经典的案例：实现流式的读取和写入文件：

~~~js
fs.createReadStream(src).pipe(fs.createWriteStream(target))
~~~

##### stream模块之事件

​		**除了**从一个可读源流读取和往一个目标流中**写入数据之外**，**pipe 方式还可以自动管理一些事情。**
例如，处理错误，文件末尾，或者当一个流比另一个快或者满的情形。这里有一个 pipe 方法读取数据等价的使用事件消费流的代码：

~~~js
readable.on('data',(chunk)=>{
    writable.write(chunk)
})
readable.on('end',()=>{
    writeable.end()
})
~~~

基本等价于：

~~~js
readable.pipe(writeable)
~~~

###### stream模块之常见事件

这里有一个被可读流和可写流使用的重要事件和函数列表：

**readable对象有以下可以on的事件**：

1. data

   当流将数据块传送给消费者后触发

2. end

   'end' 事件只有在数据被完全消费掉后才会触发

3. error

   如果在读取或管道数据时发生错误，则会触发 'error' 事件。 当调用时，监听器回调会传入一个 Error 参数。

4. close

   当流或其底层资源（比如文件描述符）被关闭时触发。 表明不会再触发其他事件，也不会再发生操作。

5. readable

   当有数据可从流中读取时，就会触发 'readable' 事件。 

**readable对象有以下可以点的函数**

1. pipe
2. unpipe
3. read
4. unshift
5. resume
6. pause
7. isPaused
8. setEncoding

**writeable对象有以下可以on的事件:**

1. drain

   当可以继续写入数据到流时会触发 'drain' 事件。

2. finish

   当所有的数据都写入到底层系统中时会触发

3. error

   如果在写入或管道数据时发生错误，则会触发 'error' 事件。 当调用时，监听器回调会传入一个 Error 参数。

4. close

   当流或其底层资源（比如文件描述符）被关闭时触发。 表明不会再触发其他事件，也不会再发生操作。

5. pipe/unpipe

   当在可读流上调用 stream.pipe() 方法时会发出 'pipe' 事件，并将此可写流添加到其目标集

**writeable对象有以下可以可以点的函数**

1. write
2. end
3. cork
4. uncork
5. setDefaultEncoding

##### stream模块之可读数据流的暂停和流动模式

可读流有两个主要模式影响到我们消费它们的方式：

1. 暂停模式（paused）

2. 流动（flowing）模式

   **所有的可读流默认都是以暂停模式开始的**，但是它们很容易切换到流动模式，并且在需要的时候退回到暂停模式。有时候，这种**切换是自动发生的**。

**三种方法可以让暂停态转为流动态**。

* 添加data事件的监听函数
* 调用resume方法
* 调用pipe方法将数据送往一个可写数据流

**使用pause让流动态转为暂停态**

### Zlib模块

​	**zlib 模块**提供通过 Gzip 和 Deflate/Inflate **实现压缩功能**，**Brotli 也是如此**。

压缩（例如一个文件）通过 zlib 流将源数据流传输到目标流中来完成。

~~~js
const zlib = require('zlib')
~~~

~~~js
const gzip = zlib.createGzip()
fs.createReadStream('str.txt').pipe(gzip).pipe(target,fs.createWriteSteam('str.gz'))
~~~

带错误回调版本：

~~~js
const gzip = zlib.createGzip()
fs.createReadStream('str.txt')
    .on(’error',function(){})
    .pipe(gzip)
    .on('error',function(){})
    .pipe(target,fs.createWriteSteam('str.gz'))
~~~

| 方法               | 说明                                                   |
| ------------------ | ------------------------------------------------------ |
| zlib.createGzip    | 返回Gzip流对象，使用Gzip算法对数据进行压缩处理         |
| zlib.createGunzip  | 返回Gzip流对象，使用Gzip算法对压缩的数据进行解压缩处理 |
| zlib.createDeflate | 返回Deflate流对象，使用Deflate算法对数据进行压缩处理   |
| zlib.createInflate | 返回Deflate流对象，使用Deflate算法对数据进行解压缩处理 |

#### Zlib模块之压缩HTTP的请求和响应

zlib 模块可以用来实现对 HTTP 中定义的 gzip 和 deflate 内容编码机制的支持。

1. HTTP 的 **Accept-Encoding 消息头**用来**标记客户端接受的压缩编码**。
2. **Content-Encoding 消息头**用于**标识实际应用于消息的压缩编码**

客户端：

~~~js
const zlip = require('zlib');
const http = require('http')；
const fs = require('fs');
const request = http.get({
    host:'example.com',
    path:'/',
    port:80,
    headers:{'Accept-Encoding':'br,gzip,deflate'}
})
request.on('response',(response)=>{
    const output = fs.createWriteStream('example.com_index.html')；
    switch (response.headers[Accept-Encoding]){
            case:'br':
            response.pipe(zlib.createBrolibDecompress()).pipe(output);
            break;
            case:'gzip':
            response.pipe(zlib.createGunzip()).pipe(output);
            break;
            case:'deflate':
            response.pipe(zlib.createInflate()).pipe(output);
            break;
        default:
            response.pipe(output)
            break;
    }
})
~~~

服务端：

~~~js
const zlib = require('zlib')
const http = require('http')
const fs = require('fs')
http.createServer((requset,response)=>{
    const raw = fs.createReadStream('index.html')
    //存储资源的压缩版本和未压缩版本
    response.setHeader('Vary:Accept-Encoding');
    let acceptEncoding = request.headers['accept-encoding'];
    if(!acceptEncoding){
         acceptEncoding=''
    }
})
//注：这不是一个合适的accept-encoding解析器
if(/\bdeflate/.test(acceptEncoding)){
    response.writeHead(200,{
        'Content-Encoding':'deflate'
    })
    raw.pipe(zlib.createDeflate()).pipe(response)
}else if(/\bgzip\b/.test(acceptEncoding)){
        response.writeHead(200,{
        'Content-Encoding':'gzip'
    })
    raw.pipe(zlib.createGzip()).pipe(response)
}else if(/\bbr\b/.test(acceptEncoding)){
        response.writeHead(200,{
        'Content-Encoding':'br'
    })
    raw.pipe(zlib.createBrotliCompress()).pipe(response)
}else{
    response.writeHead(200,{})
    raw.pipe(response)
}
~~~

### Crypto模块

**crypto 模块提供了加密功能**，包括对 OpenSSL 的哈希、HMAC、加密、解密、签名、以及验证功能的一整套封装

~~~js
const crypto = require('crypto');
console.log(crypto.getHashes())
~~~

Node的crypto模块支持的hash算法很多，这些算法咱们是没法一一深入研究了，这次我们先来学习一下其中的一些实用的部分。

Crypto模块的几个方法：

1. Update:添加数据

2. Digest:编码格式，一般以16进制为主

Crypto模块之Hmac算法：

​		**HMAC是密钥相关的哈希运算消息认证码**（Hash-based Message Authentication Code）,**HMAC运算利用哈希算法，以一个密钥和一个消息为输入，生成一个消息摘要作为输出**。HMAC可以有效防止一些类似md5的彩虹表等攻击，比如一些常见的密码直接MD5存入数据库的，可能被反向破解。

​		定义HMAC**需要一个加密用散列函数**（表示为H，可以是MD5或者SHA-1）**和一个密钥K**。我们用B来表示数据块的字节数。（以上所提到的散列函数的分割数据块字长B=64），用L来表示散列函数的输出数据字节数（MD5中L=16,SHA-1中L=20）。鉴别密钥的长度可以是小于等于数据块字长的任何正整数值。应用程序中使用的密钥长度若是比B大，则首先用使用散列函数H作用于它，然后用H输出的L长度字符串作为在HMAC中实际使用的密钥。一般情况下，推荐的最小密钥K长度是L个字节。

​		通过比对短key和长key，在编码比较长的算法上面会有一些影响。由于Hmac有了第二参数key，所以会比单独的hash加密登陆密码，有更好的安全性上的保证。
对于网站登陆密码的设计，我们可以做成2个字段存储，**用password字段存密文，passkey字段存储key，把算法直接封装到程序里面**。

​		就算数据库被攻击，黑客也只是拿了密文和key，密码明文并没有被泄露。并且在**不知道加密算法的情况下，也很难通过彩虹表进行攻击**。

###### Crypto模块之 加密和解密算法

​		对于登陆密码来说，是不需要考虑解密的，通常都会用不可逆的算法，像md5,sha-1等。但是，**对于有安全性要求的数据来说，我们是需要加密存储，然后解密使用的，这时需要用到可逆的加密算法**。对于这种基于KEY算法，可以分为**对称加密和不对称加密。**

* **对称加密**算法的原理很容易理解，通信一方用KEK加密明文，另一方收到之后用同样的KEY来解密就可以得到明文。
* **不对称加密算法**，使用两把完全不同但又是完全匹配的一对Key:公钥和私钥。在使用不对称加密算法加密文件时，**只有使用匹配的一对公钥和私钥，**才能完成对明文的加密和解密过程。

加密函数：

~~~js
const crypto = require('crypto'),fs = require('fs')
//加密
/*
	@parma 加密算法函数
	@algoritm 算法函数
	@key 密钥
	@buf buffer数据
	@cb 回调函数
*/
function cipher(algorithm,key,buf,cb){
    var encrypted = "";//加密通道
    var cip = crypto.createCipher(algorithm,key)//创建一个密码
    encrypted += cip.update(buf,'binary','hex')//添加二进制的原始buffer转为16进制的值
     encrypted += cip.final('hex')//最后统一变成16进制
    cb(encrypted);//把获得的最终加密值，传输到回调函数中
}
~~~

解密函数：

~~~js
/*
	@parma 加密算法函数
	@algoritm 算法函数
	@key 密钥
	@buf buffer数据
	@cb 回调函数
*/
function  decipher(algorithm,key,encrypted,cb){
    var decrypted = "";
   var decipher = crypto.createDecipher(algorithm,key)//创建解密通道
   decrypted +=   decipher.update(encrypted,'hex','binary')//往解码通道中添加加密的数据
    decrypted += decipher.final('binary')//解码通道最后输出二进制数据
    cb( decrypted)
}
~~~

