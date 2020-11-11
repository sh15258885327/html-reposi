# webpack详解2

## url-loader

用url-loader解析的资源里面,图片文件不在了,其他的正常,

 **url-loader整体上和file-loader差不多,** 

但是有一个地方有很大的区别, 

那就是**默认**情况下, 图片会把**解析为base64的编码**而不是直接生成文件

url-loader的配置：

~~~js
module{
    rules:[{
        test:/\.(jpg|png|gif)$/,
        use:{
            loader:'url-loader',
            options:{
                outputPath:'./images',
                name:'airu-jpg',
                limit:2048//这个配置的意思是小于2048个字节的解析成base64编码,大于的话就打包成文件
            }
        }
    }]
}
~~~

图片路径 有俩中方式：

1. 常见的那种路径
2. src = base64  也可以

**假设图片的大小小于2048字节**：

那么我们把上节的ctreateImage.js文件直接去掉那个bundle就可以，因为打包后出传入的url是一个base64

如果大于 就是 原处理方式

但是我们知道，这里加一个bundle前缀是很麻烦的，如果我们可以把html也打打包到这个bundle文件夹下就可以解决这个问题。这个问题请看：**@。。。请看下面的html-webpack-plugin**

**为什么我们要加这个字节限制呢？**

1. 每次http请求都是很耗时的，我们把小文件直接加载过来就可以提高很多性能
2. 大文件如果转成base64的话，会很占用缓存，所以大文件不能用base64加载
3. 所以加这个限制是很完美的

## css-loader

1. 安装：
   ~~~
   npm i style-loader css-loader --save-dev
   ~~~

2. 新建一个css文件夹，放置如下俩个css文件

   banner.css

   ~~~css
   h1{
       color:red
   }
   ~~~

   index.css

   ~~~css
   @import "./banner.css";
   p{
       background-color: skyblue;
   }
   ~~~

3. 在webpack-config.js中增加这体哦啊rules.增加俩个loader

   ~~~js
       module:{
           rules:[
            {
                   test:/\.(jpg|jpeg|png|gif)$/,
                   // use:{
                   //     loader:'file-loader',
                   //     options:{
                   //         outputPath:"/images",
                   //         name:"sh_[name].[ext]"
                   //     }
                   // }
                   use:{
                       loader:'url-loader',
                       options:{
                           outputPath:'/images',
                           name:'air.jpg',
                           limit:2048
                       }
                   }
                  
               },
               {
                   test:/\.css$/,
                   use:[
                       "style-loader",
                       "css-loader"
                   ]
               }
   
           ]
       }
   ~~~
   
   这里有几点说明：
   
   1. 新增加的loader需要写新的正则的时候，另起一个{}，在这个大{}里写test：正则，和use
   2. use对应一个loader时 是一个 对象 的写法
   3. 当是多个loader时，可以写成一个数组，数组中的每一项都是一个对象，上例中都是默认的loader的配置，所以，直接写成了上面的形式
   4. 多个loader之间的顺序很重要，加载方式是从下到上
   
4. 在indexjs处导入这个index.css文件：

   ~~~js
   require("../css/index.css");
   ~~~


注:这里有一个坑:

​	就是 上一个test的文件类型写了那个css的话,下面那个test再写css

会导致css文件加载不出来

#### scss文件的打包

1. 首先安装 :

~~~js
//安装sass-loader node-sass
npm i sass-loader node-sass --save-dev
//安装sass
npm i sass --save-dev
~~~

sass是一个css预处理语言,可以简化大量的css的书写工作,

**css-loader是无法解析sass语言的**

所有需要在webpack.config.js处引入上面安装的sass-loader包

~~~js
{
    test:'/\.scss$/',
    use:[
        "style-loader",
        "css-loader",
        "sass-loader"
    ]
}
~~~

2. 使用

   1. scss文件是可以引入css文件的

   2. 在test属性处添加scss正则

   3. 修改我们的index.js文件添加如下:

      ~~~js
      import "../css/index.scss"
      ~~~

   4. 运行显示

### postcss-loader

**这个玩意超级牛逼,他可以用来兼容各种浏览器**

1. 在postcss.config.js中引入autoprefixer模块

   * 新建一个post.config.js文件,内容如下:

     ~~~js
     module.exports = {
         	plugins:[
                 require('autoprefixer')
             ]
     }
     ~~~

     

2. 在webpack.config.js配置css-loader的选项

   修改上述的css-loader

   引入我们的postcss-loader

   ~~~js
   把'css-loader'改写成
   {
       "style-loader",
       {
        loader:'css-loader',
        options:
           {
               importLoaders:2//通过import语法引入的文件,也要走下面的俩个loader
           }  
       }
       "sass-loader",
        "postcss-loader"
       
       
   }
   ~~~

3. 修改package.json,增加一个浏览器列表选项,并设置相应的内容

   ~~~js
   "browserslist":[
       "last 1 version",
       ">1%",
       "IE 10"
   ]
   ~~~

   注意browserslist千万别写错了,要不兼容性代码出不来

   而且也没有错误提示!!!

详细的浏览列表:

​		https://github.com/browserslist/browserslist#readme

###### 自定义字体文件的打包

1. 下载阿里图标

2. 在webpack.config.js中加载如下代码:

   ~~~js
   {
       test:/\.(eot|svg|ttf|woff|woff2)$/,
           use:{
               loader:"file-loader",
                   options:{
                       outputPath:"./font",
                           name:"[name].[ext]"
                   }
           }
   }
   ~~~

3. 在index.js处引入iconfont.css

   ~~~js
   import "../font/iconfont.css";
   import {createSiderbar} from "./createSiderbar.js";
   ~~~

4. 创建一个ctreateSiderBar.js文件,用来展示的页面

   ~~~js
   export function createSiderbar(root){
       let ele = document.createElement("div");
       ele.innerHTML="<i class='iconfont icon-icon_group'></i>";
       root.appendChild(ele);
   }
   ~~~

注:由于font文件夹下有css文件,所以需要在font文件夹下再复制一份postcss.config.js文件进去

## plugins

### plugins(插件)

webpack 有着丰富的插件接口(rich plugin interface)。**webpack 自身的多数功能都使用这个插件接口**。这个插件接口使 webpack **变得极其灵活。**

plugin可以帮助我们在用webpack来打包的动作运行到某个时刻, 来帮助我们做一些事情

https://www.webpackjs.com/plugins/

### html-webpack-plugin

HtmlWebpackPlugin插件会在打包结束后, **自动在bundle文件夹下生成一个html文件**,并把打包生成的js文件插入到html文件中

1. 安装插件:

   ~~~js
   npm i html-webpack-plugin --save-dev
   ~~~

2. 导入插件

   ~~~js
   require("html-webpack-plugin");
   ~~~

3. 使用插件:

   ~~~js
   {
   },
     plugins:[
         new htmlWebpackPlugin()
     ]
   ~~~

4. 此时可以开始打包实现我们要的效果了

   生成的index.html如下:

   ~~~html
   <!DOCTYPE html>
   <html>
       <head>
           <meta charset="utf-8">
           <title>Webpack App</title>
           <meta name="viewport" content="width=device-width, initial-scale=1"></head>
       <body>
           <script src="shenjie.js"></script></body>
   </html>
   ~~~

   可以发现我们的

   ~~~html
    <div id="app"></div>
   ~~~

   **和一些我们自定义的信息都没有了**,那怎么才可以生成和我们的原html一样的呢?

5.  htmlwebpackplugin给我们提供了一个配置选项, 让我们可以**自定义生成的html文件的基本模板**

6. 在src目录下新建一个html目录,并在里面**建立一个html模板文件**

7. template.html:

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
       <div id="app"></div>
   </body>
   </html>
   ~~~

8. 在webpack.config.js处:

   (给htmlWebpackPlugin传入了一个对象参数)

   ~~~js
   let htmlWebpackPlugin = require("html-webpack-plugin");
   plugins:[
       new htmlWebpackPlugin({
           template:"src/html/template.html"
       })
   ]
   ~~~

9. 此时打包后会生成:

   index.html

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
       <div id="app"></div>
        <script src="shenjie.js"></script>//给模板自动添加了这个js文件
   </body>
   </html>
   ~~~

10. 此时如果我们把生成的index.html修改成aaa.html的文件再打包的话会出现俩个文件名不同(aaa.html和index.html)但是内容相同的文件,为了避免这种情况:我们引入下面的插件:

###### clean-webpack-plugin(三方插件)

1. 安装:

   ~~~js
   npm i clean-webpack-plugin --save-dev
   ~~~

2. 在webpack.config.js

   ~~~js
   let {CleanWebpackPlugin} = require("clean-webpack-plugin");
   plugins:[
       new htmlWebpackPlugin({
           template:"src/html/template.html"
       }),
       new CleanWebpackPlugin()
   ]
   ~~~

3. 运行,Ok,此时会发现我们那个aaa.hstml就木得了

## entry和output

### entry和output之多文件输出

如下俩种entry和output等价:

1. ~~~js
   entry:"./src/js/index.js"
   output:{
       filename:"index.js",
       path:path.resolve(__dirname,"bundle")
   }
   ~~~

2. ~~~js
   entry:{
       "index":"./src/js/index.js"
   }
   output:{
       //这里的filename就是上面的entry的键值"idnex"
        path:path.resolve(__dirname,"bundle")
   }
   ~~~

一**个输入多个输出,多个输入一起加入到最后的html文件中**

~~~js
    entry:{
        "shenjie":'./src/js/index.js',
        "sub":'./src/js/index.js'
    },
    output:{
        path:path.resolve(__dirname,"bundle")
    },
~~~

整合后的html文件如下:

~~~html
<script src="shenjie.js">
    </script>
<script src="sub.js"></script>
~~~

### entry和output之公共路径

增加一个公共的路径前缀, **一般都会采用某个网址: “https://cdn.com”**等

整加后的html文件如下:

~~~html
<script src="jsFile/shenjie.js"></script><script src="jsFile/sub.js"></script></body>
~~~

实际上:webpack并没有创建jsFile文件夹,它只是一个公共的路径前缀

## sourceMap

一行错误代码不影响打包,只有在运行的时候才会报错,但是**报错的时候**, 我们**无法**从最终文件中**得知**, 到底是**哪一个文件**的哪一行**出错**

而:

​	**sourceMap:就是一种映射关系,**他能**将**最终打包后**出错的代码所在的原始文件信息展示出来**

使用:

1. 开启 source-map模式:

   (**默认就是开启的,**而且不会生成.map文件,如果我们自己写就可以生成.map文件,当然格式可以自己设置)

   ~~~js
   module.exports={
       mode:"development",
       devtool:"source-map",
       entry:{
           "bundle":"./src/js/index.js"
       }
   }
   ~~~

2. 现在我们关闭source-map这个映射文件,他就不会追溯到那个具体是哪个文件出错了

   ~~~js
   module.exports={
       mode:"development",
       devtool:"none",
       entry:{
           "bundle":"./src/js/index.js"
       }
   }
   ~~~

   此时,将无法追溯具体哪个文件出错

3. 实际上:devtool这个属性对应了很多关键词:

   不同的关键词代表的基本含义如下:

   1. cheap:只处理业务代码的错误信息, 其他的引用模块或是loader的错误予以忽略
   2. inline:把生成的.map文件编码成base64格式, 内嵌到最后生成的js文件中
   3. module:也处理module或是loader里面的错误信息
   4. source-map:生成一个.map文件
   5. eval:以eval的方式来处理业务代码, 以方便吧代码和原始文件地址进行管理

总结:

	1. **建议在development的模式下, 采用cheap-module-eval-source-map**
 	2. **建议在production的模式下,采用cheap-module-source-map**

