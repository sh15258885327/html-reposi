#### Node核心模块(URL、Path)
##### 一、URL模块

**注：主要用来获取路径上提交的数据**

###### 1.1 parse:拿到url地址每一部分
Node.js中的url模块提供了一些实用函数，用于URL处理与解析。
语法：url.parse(urlStr,parseQueryString,slashesDenoteHost)
- urlStr是输入一个url字符串，返回一个对象
- parseQueryString(默认为false)
- slashesDenoteHost(默认为false)

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



##### 二、Path模块

**注：主要用来提取路径上的某一部分信息和拼接路径**

path模块提供许多使用的，可被用来处理与转换路径方法与属性。
###### 2.1 basename方法:获取路径中的文件名
语法：path.basename(path[,ext])
- path文件的完整路径
- ext为可选参数
###### 2.2 dirname方法:获取路径中的目录名
语法：path.dirname(path)
- path可以是文件、目录路径。参数是目录路径时，返回目录的上层目录，参数为文件路径时，返回文件所在目录。
###### 2.3 extname方法:获取路径中的扩展名
语法：path.extname(path)
- path返回文件的扩展名，若文件没有指定扩展名，则返回空字符串。
###### 2.4 join方法:将多个参数值字符串结合成一个路径字符串
语法：path.join([path1], [path2], [...])
此方法中，讲参数值结合生成一个路径
__dirname变量值代表程序运行的根目录