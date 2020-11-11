# webpack详解

##  什么是webpack

在模块化编程盛行的今天, 每个js,css都可以独立存在, 而每个独立存在的文件又有可能采取不同的工程化语言方法, 比如用TypeScript写js, 用sass写css等等, 这时候我们就需要用一个简单的工具, 完成这种统一编译解析输出的功能了

 **webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle(包)。**

### webpack的安装方法

1. 新建一个文件夹,输入npm init 指令

 此时会创建出 package.json，它会安装各种依赖

**（详见md中的npm包管理）**

2. 输入

   ~~~js
   npm install webpack-cli --save-dev
   ~~~

   ~~~
   npm install webpack --save-dev
   ~~~

   使用npm 安装 webpack
   webpack或是webpack-cli后面的—save-dev是指开发的时候依赖的工具, 正式发布的时候不包含
   如果直接写—save, 那么就是发布之后还要依赖的工具

3. webpack的查看

   npx 指令是在本地项目的 **查看是用的npx**

   ~~~js
   npx webpack -v
   ~~~

   ~~~
   npx webpack-cli -v
   ~~~

4. npm安装特殊版本的库

   ~~~
   npm install webpack@4.41.1 --save-dev
   ~~~

   如果我们不清楚一个库有多少版本，可以输入以下指令：

   ~~~
   npm info webpack
   ~~~

5. 当我们发送给别人项目时，可以把node_modules文件给删除了，当别人收到时，只需要 npm init 一下就行了，因为这个是根据

   package.json来生成的

## webpack的初步接触

1. 最原始的html与js分离

   ~~~
   就是<script src="./index.js"这种
   ~~~

2. 稍微懂点的HTML与js分离

   ~~~
   把每个js文件文件看作一个模块进行多次引入
   <script src="./index.js"></srcipt>
   <script src="./a.js"></srcipt>
   <script src="./b.js"></srcipt>
   <script src="./c.js"></srcipt>
   ~~~

   每个js文件负责写页面的一个部分

3. 稍微封装一下

   ~~~
   再index.js文件出调用各个其他js文件的函数
   其他文件把代码封装到一个函数里就行
   而不用靠html里对javasrcipt的引入顺序
   ~~~

上述代码有几个问题点:
1.代码文件引入的顺序必须要严格来, 否则出错

2. 网页需要引入的文件过多, 网页在加载时,需要大量的HTTP请求, 这样会造成网页加载慢
3. 在主index.js文件中, 无法看到每个方法具体来自于哪个文件,只能去html文件中看 

**怎么办呢？？**

​		优化一下,直接使用模块?
​		新浏览器还好说.老浏览器还不支持直接用ES6的模块系统

**使用webpack打包**

打包好之后，我们就可以在html那里引入打包后的js文件就好了

即：（**只需引用打包后的js文件**）

~~~html
<p>这是基本网页内容</p>
<script src="dist/main.js"></script>
~~~

##### 打包详解

###### webpack的配置文件webpack.config.js

该文件**一般在项目的根目录中创建**, 如果不创建, 那么webpack将采取默认配置进行运作. 

默认情况下：

1. 它会自动在根目录创建一个dist文件夹，该文件夹下方一个main的js文件作为出口
2. 这个main.js的代码是生产环境的代码

下面假设将webpack.config.js创建于根目录下：如下：

**webpack.config.js:**

~~~js
let path = require("path")//import path from "path"
module.exports = {
    mode:"development"，
    entry:"./js/index.js", //入口,可以有多个
    output:{//出口
        filename:"shenjie.js",//默认是main.js
        path:path.resolve(__dirname,"bundle")//绝对路径一直访问到bundle这个文件夹
    }
}
~~~

此时就可以把路径写成：

~~~html
<p>这是基本网页内容</p>
<script src="dist/main.js"></script>
~~~

具体配置样式:

https://www.cnblogs.com/feixian-blog/p/12465764.html

那么在package.json文件需要与其关联:

###### package.json的scripts(命令映射表)

在package.json里面有一个script属性

**package.json:**

~~~js
{
    "script":{
        "bundle":"webpack"
    }
}
//这个script对象就是我们内置的一个命令映射表
//现在运行 
//npm run bundle 与 npx webpack是等价的
~~~

###### webpack的基本打包参数

1. 本次打包唯一的hash值

   假设文件没动过，每次打包hash值不变，若动了，hash值会改变

2. 本次打包所使用的webpack版本号

3. 本次打包所用时间

4. 本次打包的时间

| asset:      | 打包的最终文件( 可能有多个文件 ) |
| ----------- | -------------------------------- |
| size:       | 文件大小                         |
| chunks:     | js文件对应的ID                   |
| chunk Name: | js文件对应的名字                 |

webpack采用了production作为默认的打包模式.我们还可以选择development模式

* production: 代码会被压缩
* development:代码会保持原本的缩进格式,更适合阅读

这俩种模式的设置是在这里添加如下代码

~~~
module.exports={
	mode:"development"
}
~~~

## webpack的loader

仅官方定义的loader就有几十个, 每个loader的配置又有几十个. 加上非官方的民间自定义或是企业提供的, 成千上万个loader不是个空话
所以,不要想去把每个loader都记住,**我们只要理清楚其核心的使用逻辑,**这样我们就足够了,以后在学习其他的loader的时候, 就能做到举一反三了

**webpack默认只能打包js文件**,但是文件有很多种,比如视频,音频,图片

等都需要打包,所以**我们需要loader来对资源进行转化**

如何使用呢?

1. **介绍**

module属性里面是一个对象,对象的rules属性值是一个数据, 内部的每个数组项目都是对某一类文件进行loader的配置对象

test:就是**筛选特定的文件**, 一般就是以后缀名为识别码
use:就是**采用哪个具体的loader**

~~~js
module:{
    rules:[
        {
            test:/\.jpg$/,
            use:{
                loader:'file-loader'
            }
        }
    ]
}
~~~



2. **安装**

   输入:

   ~~~
   npm install file-loader -D
   ~~~

   来安装file-loader组件

3. 打包成功

   生成的文件的**文件名就是文件内容的 MD5 哈希值**并会**保留**所引用资源的**原始扩展名**

###### file-loader帮助我做的事情:

1. 当file-loader检测到.jpg图片时, 会**把该图片资源移动到output的指定文件夹下**,并且给图片设置名字( **改名字可以自定义**或是设置为默认的md5值 )
2. 当把图片挪到output的指定文件夹之后, file-loader会把该图片相对于output指定的文件夹的相对位置参数作为返回值,返回给引入文件时定义的变量
3. 上述动作不限于图片, 可以用于一切文件

###### file-loader的详细配置

~~~js
module:{
    rules:[
        {
            test:/\.jpg$/,    
            use:{
                loader:'file-loader',
                options:{
                    //在这里为file-loader设置更详细的配置选项
                }
            }
        }
    ]
}

~~~
**file-loader里的options的属性参数：**

| 名称                                 | 类型               | 默认值                | 描述                               |
| ------------------------------------ | ------------------ | --------------------- | ---------------------------------- |
| <font color="red" >name</font>       | {String\|Function} | [hash].[ext]          | 为你的文件配置自定义模板           |
| context                              | {String}           | this.options.context  | ..                                 |
| publicPath                           | {String\|Function} | _webpack_public_path_ | 为你的文件配置自定义public发布目录 |
| <font color="red" >outputPath</font> | {String\|Function} | 'undefiend'           | 为你的文件配置自定义output输出目录 |
| userRelativePath                     | {Boolean}          | false                 | ..                                 |
| emitFile                             | {Boolean}          | true                  | ..                                 |

例:

多格式文件引入方法:

~~~js
module:{
    rules:[
        {
            test:/\.(jpg|jpeg|png|gif)$/
            use:{
                loader:'file-loader',
                options:{
                    outputPath:'./images',
                    name:"arls.jpg"
                }
            }
        }
    ]
}
~~~

完整demo：

创建一个src文件夹：

1. 里面有我们的css js images 和html（本例html）写在了webpack.config.js的同级目录了

2. js文件夹里面放的是各个功能模块的js文件，其中有有一个index.js用来调用各个其他功能模块js文件

   ~~~js
   let root = document.querySelector("#app");
   import {createHeader}  from "./header.js";
   import {createMain}  from "./content.js";
   import {createFooter}  from "./footer.js";
   import {createImg} from "./createImg.js";
   import {img} from "../images/1.png";
   root.append(img);
   createHeader(root);
   createMain(root);
   createFooter(root);
   createImg(root,img);
   ~~~

3. 根目录中的webpack.config.js写法如下：

   ~~~js
   let path = require("path");
   module.exports={
       mode:"development",
       entry:'./src/js/index.js',
       output:{
           filename:"shenjie.js",
           path:path.resolve(__dirname,"bundle")
       },
       module:{
           rules:[
               {
                   test:/\.(jpg|jpeg|png|gif)$/,
                   use:{
                       loader:'file-loader',
                       options:{
                           outputPath:"/images", //注：此路径上接上面的那个path的路径
                           name:"aaa.jpg"
                       }
                   }
               }
           ]
       }
   }
   ~~~

4. 执行 npm  run bundle来开启项目，让它自动生成各个生产环境下的文件

上例的use对象对应的options里的name属性写死了，可以使用placeholder参数来改成如下：

~~~js
 name:"aaa.jpg"
 ||
 \/
 name:"sh"+[path][name].[ext]
 注：默认值是：
 name:[hash].[ext]
~~~

placeholder参数表格如下：

| 名称   | 类型     | 默认值        | 描述                                                  |
| ------ | -------- | ------------- | ----------------------------------------------------- |
| [ext]  | {string} | file.extname  | 资源扩展名                                            |
| [name] | {string} | file.basename | 资源的基本名称                                        |
| [path] | {string} | file.dirname  | 资源相对于context的路径                               |
| [hash] | {string} | md5           | 内容的hash值                                          |
| [N]    | {Number} |               | 当前文件名按查询参数regExp匹配后多获得到第N个匹配结果 |
createImg.js
~~~js
export function createImg(root,url){
    let img = document.createElement("img");
    img.src = "bundle"+url;
    root.appendChild(img);
}
~~~

