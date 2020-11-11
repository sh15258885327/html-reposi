#### Node核心模块(URL、Path)

##### 一、Path模块

如何去**得知自己的当前位置和目标文件的位置**,这**是**作为对本地文件**进行操作的基础**

Path模块**引进的是一个对象**, 内部**有很多的属性方法**

###### 1. join方法

​	**path.join方法用于连接路径**。

​		该方法的主要用途在于，**会正确使用当前系统的路径分隔符**，Unix系统是”/“，Windows系统是”\“。

  1. __dirname: 当前文件所在的目录名称(绝对路径)

  2. __filename: 当前文件所在的目录名称+文件名称(绝对路径)

     ~~~js
     let path = require("path")
     console.log(path.join(__dirname,"src"))//C:a/b/src
     console.log(path.join(__filename,"src"))//C:a/b/demo.js/src
     ~~~

###### 2. resolve方法

​	path.resolve方法用于**将相对路径转为绝对路径**。

​		它可以接受多个参数，依次表示所要进入的路径，直到将最后一个参数转为绝对路径。如果根据参数无法得到绝对路径，就以当前所在路径作为基准。除了根目录，**该方法的返回值都不带尾部的斜杠。**

~~~js
path.resovle(__dirname,"src","js","es6”)//C:a/b/src/js/es6
~~~

注**：join 和 resovle的区别**在于：

​		**join只是单纯**的把各个参数简单拼接成一个目录

​		**resovle是**会把各个参数拼**接成**一个目录**之后**再在前面**加上一个**相当于**__dirname**的绝对路径

**在规范情况下：生成绝对路径用resolve生成相对路径用join**

###### 3. relative 方法

​		**path.relative方法接受两个参数**，这两个参数**都应该是绝对路径**。

​		该方法**返回第二个相对第一个的那个相对路径**。

注：主要用来提取路径上的某一部分信息和拼接路径**

path模块提供许多使用的，可被用来处理与转换路径方法与属性。

###### 4. parse 方法

​	 **path.parse()方法可以返回路径各部分的信息**

​	path.parse(path.resolve(__dirname)返回的是如下一个对象：

~~~js
{
  root: 'C:\\',//root:路径的根目录,一般都是盘符(linux下就是/)
  dir: 'C:\\Users\\申杰\\Desktop',//:就是文件所在的绝对路径(dirname模式下这就是, 文件所在目录的上级目录)

  base: 'node2',//文件的基本信息(dirname模式下这就是, 文件所在目录相对于上级目录的相对路径)
  ext: '',//文件拓展名(dirname模式下, 没有后缀名,就是空值)
  name: 'node2'//文件名(dirname模式下,这个就是文件夹名称)
}
~~~

###### 5. path模块的其他部分

1. **path.basename("这是一个path")** 方法返回 path 的最后一部分（文件名字+后缀名）:

   	1. filename下就是文件名字+后缀名, 
    	2. dirname下就是文件所在的最后一个层级的目录名

   **相当于是对parse("path")里的属性的一个封装**

2. **delimiter** 提供不同平台特定的路径定界符

3. **dirname(path)**：返回”pathaddr”的目录名称

4. **extname(path)** 返回 path 的扩展名，没有就返回空

5. **format(pathObject)** 方法从对象返回路径字符串**与 path.parse() 相反**。

   这个玩意很好用，当我们写一个路径的时候，可以把它写成对象的形式，然后可以很简单的在这个对象里面进行正则表达式判断...等等

6. **isAbsolute(path)**是否是绝对路径

7. **normalize(path)**规范化给定的 path，解析 '..' 和 '.' 片段

    尾部的分隔符会保留,path 是零长度的字符串则返回 '.'

   ~~~js
   //比如给了一个这样的路径：
   let curPath = 'C:\\user\\nature\\desktop\\1106ndoe\\\\\src'
   path.normalize(curPath)//C:\user\nature\desktop\1106node\src
   ~~~

##### 二、URL模块

**url模块用于生成和解析URL**。该模块使用前，必须加载。

url解析路径的俩种方式：

方式1：new  url.URL（input,[base]）

input <string> 要解析的绝对或相对的 URL。如果 input 是相对路径，则需要 base。 如果 input 是绝对路径，则忽略 base。

base <string> | <URL> 如果 input 不是绝对路径，则为要解析的基本 URL

​		这里是base/input

~~~js
let url = require("url")
new url.URL("https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=node%E6%A8%A1%E5%9D%97%E7%9A%84url%E6%A8%A1%E5%9D%97%E9%87%8C%E7%9A%84url.parse%E5%92%8Cnew%20url.URL()&oq=node%25E6%25A8%25A1%25E5%259D%2597%25E7%259A%2584url%25E6%25A8%25A1%25E5%259D%2597%25E9%2587%258C%25E7%259A%2584url.parse%25E5%2592%258Cnew%2520url.URL()&rsv_pq=815f6f19002dc3b1&rsv_t=c616GSmqDDyhc5q97VFRsGLV4FGwcnyslti0VtWM5ItWRmiutqJe%2FU9Uco0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_sug3=1&rsv_btype=t&rsv_sug4=464")
~~~

方式2：url.parse（个人选择）

~~~js
let url = require("url")
url.parse("https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=node%E6%A8%A1%E5%9D%97%E7%9A%84url%E6%A8%A1%E5%9D%97%E9%87%8C%E7%9A%84url.parse%E5%92%8Cnew%20url.URL()&oq=node%25E6%25A8%25A1%25E5%259D%2597%25E7%259A%2584url%25E6%25A8%25A1%25E5%259D%2597%25E9%2587%258C%25E7%259A%2584url.parse%25E5%2592%258Cnew%2520url.URL()&rsv_pq=815f6f19002dc3b1&rsv_t=c616GSmqDDyhc5q97VFRsGLV4FGwcnyslti0VtWM5ItWRmiutqJe%2FU9Uco0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_sug3=1&rsv_btype=t&rsv_sug4=464")
~~~

返回的结果：（其实俩者返回的URL对象有一丢丢不同，可自行运行比较

~~~js
URL {
  href: 'https://www.baidu.com/s?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=node%E6%A8%A1%E5%9D%97%E7%9A%84url%E6%A8%A1%E5%9D%97%E9%87%8C%E7%9A%84url.parse%E5%92%8Cnew%20url.URL()&oq=node%25E6%25A8%25A1%25E5%259D%2597%25E7%259A%2584url%25E6%25A8%25A1%25E5%259D%2597%25E9%2587%258C%25E7%259A%2584url.parse%25E5%2592%258Cnew%2520url.URL()&rsv_pq=815f6f19002dc3b1&rsv_t=c616GSmqDDyhc5q97VFRsGLV4FGwcnyslti0VtWM5ItWRmiutqJe%2FU9Uco0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_sug3=1&rsv_btype=t&rsv_sug4=464',
  origin: 'https://www.baidu.com',
  protocol: 'https:',
  username: '',
  password: '',
  host: 'www.baidu.com',
  hostname: 'www.baidu.com',
  port: '',
  pathname: '/s',
  search: '?ie=utf-8&f=8&rsv_bp=1&tn=baidu&wd=node%E6%A8%A1%E5%9D%97%E7%9A%84url%E6%A8%A1%E5%9D%97%E9%87%8C%E7%9A%84url.parse%E5%92%8Cnew%20url.URL()&oq=node%25E6%25A8%25A1%25E5%259D%2597%25E7%259A%2584url%25E6%25A8%25A1%25E5%259D%2597%25E9%2587%258C%25E7%259A%2584url.parse%25E5%2592%258Cnew%2520url.URL()&rsv_pq=815f6f19002dc3b1&rsv_t=c616GSmqDDyhc5q97VFRsGLV4FGwcnyslti0VtWM5ItWRmiutqJe%2FU9Uco0&rqlang=cn&rsv_dl=tb&rsv_enter=0&rsv_sug3=1&rsv_btype=t&rsv_sug4=464',
  searchParams: URLSearchParams {
    'ie' => 'utf-8',
    'f' => '8',
    'rsv_bp' => '1',
    'tn' => 'baidu',
    'wd' => 'node模块的url模块里的url.parse和new url.URL()',
    'oq' => 'node%E6%A8%A1%E5%9D%97%E7%9A%84url%E6%A8%A1%E5%9D%97%E9%87%8C%E7%9A%84url.parse%E5%92%8Cnew%20url.URL()',
    'rsv_pq' => '815f6f19002dc3b1',
    'rsv_t' => 'c616GSmqDDyhc5q97VFRsGLV4FGwcnyslti0VtWM5ItWRmiutqJe/U9Uco0',
    'rqlang' => 'cn',
    'rsv_dl' => 'tb',
    'rsv_enter' => '0',
    'rsv_sug3' => '1',
    'rsv_btype' => 't',
    'rsv_sug4' => '464' },
  hash: ''
}
~~~

###### 参数详解：

| hash             | 获取及设置 URL 的片段部分。分配给 hash 属性的值中包含的无效 URL 字符是百分比编码的 |
| ---------------- | ------------------------------------------------------------ |
| host             | 获取及设置 URL 的主机部分。(也就是域名加端口部分)            |
| url.hostname     | 获取及设置 URL 的主机名部分。 url.host 和 url.hostname 之间的区别是 url.hostname 不包含端口 |
| href             | 获取及设置序列化的 URL。获取 href 属性的值等同于调用 url.toString()。将此属性的值设置为新值等同于使用 new URL(value) 创建新的URL对象。 URL 对象的每个属性都将被修改。如果给 href 属性设置的值是无效的 URL，则将会抛出 TypeError |
| origin           | 包含了协议的host, 获取只读的序列化的 URL 的 origin。         |
| port             | 端口获取及设置 URL 的端口部分。端口值可以是数字或包含 0 到 65535（含）范围内的数字字符串.端口可以是空字符串的,这时端口就会自动根据协议来选取 |
| protocol         | 设置连接协议, 无效协议值会被忽略. 比如http或是https          |
| **search(重要)** | :获取及设置 URL 的序列化查询部分。                           |
| searchParams     | 获取表示 URL 查询参数的 URLSearchParams 对象。 该属性是只读的。 使用 url.search 设置来替换 URL 的整个查询参数 |

实际上，**在url.parse解析出来的URL对象里有一个query属性，它是我们查询输入的内容**

例：

~~~js
let http = require("http");
let url = require("url");
http.createServer(function(req,res){
    //obj是get请求路径携带的参数
    let obj = url.parse(req.url,true).query;
    res.write(obj.name);
    res.end(obj.age);
}).listen(3002,"127.0.0.1");
~~~

与url.parse相对应的同样如path.parse那样有一个url.format,他可以把URL对象转成一个路径，从这里，同样有一个好玩的东西，**我们可以修改search里的值，从而改变搜索的内容**

#### os模块

##### os模块提供与操作系统相关的方法

~~~js
let os = require("os")
~~~

###### 1. os模块之EOL属性

 1. os.EOL属性是一个常量

 2. 回当前操作系统的换行符（Windows系统是\r\n，其他系统是\n）

    **注：这个换行符是不可见**的,咱们看到的就是个效果

###### 2. os模块之arch方法

~~~js
os.arch()//os.arch方法返回当前计算机的架构。
//可能的值有：'arm'、 'arm64'、 'ia32'、 'mips'、 'mipsel'、 'ppc'、 'ppc64'、 's390'、 's390x'、 'x32'、 'x64'。
~~~

###### 3. os模块之networkInterfaces方法

os.networkInterfaces() 方法**返回一个对象**，包含只有被赋予网络地址的网络接口。

​	包含的属性：

| address <string>   | 被赋予的 IPv4 或 IPv6 地址                                   |
| ------------------ | ------------------------------------------------------------ |
| netmask <string>   | IPv4 或 IPv6 子网掩码                                        |
| family <string>    | IPv4 或 IPv6。                                               |
| mac <string>       | 网络接口的 MAC 地址。                                        |
| internal <boolean> | 如果网络接口是 loopback 或相似的远程不能用的接口时，值为 true，否则为 false。 |
| scopeid <number>   | IPv6 数字领域识别码（只有当 family 是 IPv6 时可用）。        |
| cidr <string>      | 以 CIDR 表示法分配的带有路由前缀的 IPv4 或 IPv6 地址。如果 netmask 参数不可用，则该属性是 null。 |

###### 4. os模块之其他有趣的接口

 1. platform()

    返回一个字符串，指定 Node.js 编译时的操作系统平台

	2. release()

    返回一个操作系统的版本号

	3. cpus()

    返回一个逻辑CPU内核的信息