# webpack4详解

## 开发环境和生产环境对比

### Development与production模式的区别

#### development模式

1. 使用 dev-serve会开启一个本地服务器, 可在本地进行服务器运行状态的模拟, 还可以开启热更新, 进行实时模拟
2. source-map,会包含大量的错误提醒信息,体积巨大
3. 无需压缩,方便直接观看代码内容,保留空格和换行

#### production模式中:

1. source-map,非常简洁
2. 代码会被压缩,缩小体积

### Development与production的分开文件配置

在development 和 produnction俩种生产模式中,

我们可以把俩种模式相同的代码提取到webpack.common.js中,

把不同的代码代码部分分别写在webpack.dev.js和webpack.prod.js中

webpack.common.js:

~~~js
let path = require("path");
let htmlWebpackPlugin = require("html-webpack-plugin");
let {CleanWebpackPlugin} = require("clean-webpack-plugin");
module.exports={
    entry:{
        "shenjie":"./src/js/index.js"
    },
    output:{
        path:path.resolve(__dirname,"../bundle")
    },
    module:{
        rules:[
            {
                test:/\.(jpg|jpeg|png|gif)$/,
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
                test:/\.(css|scss)$/,
                use:[
                    "style-loader",
                    {
                        loader:"css-loader",
                        options:{
                            importLoaders:2
                        }
                    },
                    "sass-loader",
                    "postcss-loader"
                ]
            },
            {
                test:/\.(eot|svg|ttf|woff|woff2)$/,
                use:{
                    loader:"file-loader",
                    options:{
                        outputPath:"./font",
                        name:"[name].[ext]"
                    }
                }
                
            },
            {
                test:/\.js$/,
                exclude:/node_modules/,
                loader:"babel-loader",
                options:{
                    presets:[["@babel/preset-env",{
                        useBuiltIns:"usage",
                        targets:{
                            edge:"17",
                            chrome:"67",
                            safari:"11.1"
                        }
                    }]]
                }
                        
            } 
        ]
    },
    plugins:[
        new htmlWebpackPlugin({
            template:"src/html/template.html"
        }),
        new CleanWebpackPlugin(),
    ]
}
~~~

webpack.dev.js:

~~~js
let webpack = require("webpack");
let commonConfig = require("./webpack.common.js");
let mergeF = require("webpack-merge").merge;
let devConfig = {
    mode:"development",
    devtool:"cheap-module-eval-source-map",
    devServer:{
        contentBase:"./bundle",//这个是我们的路径
        open:true,
        port:5327,
        hot:true
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ]
}
module.exports = mergeF(devConfig,commonConfig);
~~~

webpack.prod.js

~~~js
let commonConfig = require("./webpack.common.js");
let mergeF = require("webpack-merge").merge;
console.log(mergeF);
let prodConfig = {
    mode:"production",
    devtool:"cheap-module-source-map",
    optimization:{
        usedExports:true
    }
}
module.exports = mergeF(prodConfig,commonConfig);
~~~

现在对这三个文件做如下处理,使得它与webpack.config.js的内容等价:

1. 下载如上代码看到的一个包:webpack-merge

   ~~~js
   npm i webpack-merge --save-dev
   ~~~

2. 建立一个build文件夹,把上面三个代码文件放进去,文件夹目录与bundle文件夹目录是并列的

3. 修改package.json里的script属性的内容,添加如下代码:

   ~~~js
   "scripts": {
       "bundle": "webpack",
           "watch": "webpack --watch",
               "start": "webpack-dev-server",
                   "dev": "webpack-dev-server --config ./build/webpack.dev.js",					//新增
                       "prod": "webpack --config ./build/webpack.prod.js"						//新增
   },
   ~~~

4. 现在分别执行

   npm run dev 	会打包一个开发模式的包

   npm run prod   会打包一个生产模式的包

备注：时隔三个月之后我再跑这个项目的时候报了一个nodemouds下的一些包的not found错误，无论是重新安装还是怎么办都无法解决，希望以后可以发现解决的办法！！！

## code splitting

在**之前的项目**中, 无论引用了多少插件**, 最终输出的还是单个js文件**, 这会造成几个问题:

1. 单文件过大
2. 业务代码和环境代码压缩到一起了
3. 单次修改业务代码,就得重新打包所有的文件
4. 每次修改业务代码,最终的打包出来的js就是一个新的文件(即便只是修改了一个字母),这样就会导致用户浏览器无法缓存文件

**如何解决上述的问题?**

* 把插件代码单独写一个js文件引入
* 我们的代码导入我们那个单独写的js文件
* 同时记得在entry处添加一个插件js的出口,这样浏览器就会缓存插件代码,可以提高性能

具体操作如下:

##### 一:Code Splitting第一种方式:

1. 安装一个lodash 组件(它是一个方法库,**只是用loadsh做一个例子**)

   ~~~js
   npm i lodash --save-dev
   ~~~

2. 在src的js的文件夹下创建一个loadsh.js

   ~~~js
   import _ from 'loadsh'
   window._= _;
   ~~~

3. 在webpack.config.js中分开引入index.js和loadsh.js

   ~~~js
   module.exports={
       entry:{
           loadsh:"./src/js/loadsh",
           index:"./src/js/index.js"
       }
   }
   ~~~

4. 此时会打包生成俩个js文件。其中的loadsh是一个不会变化的文件，这样的话浏览器就可以把这个文件给缓存起来

   现在俩个文件都是1mb大小

   **这种代码分隔是手动的，既不智能也不方便**

##### 二:Code Splitting第二种方式:

1. 恢复到最初的模式。采取同步请求的方式来导入组件

   **在index,js中写入如下代码：**

   ~~~js
   import _ from 'loadsh' //假设组件1mb
   //假设业务代码也是1mb
   console.log(_.join(['a','b','c'],'***'))
   ~~~

2. 配置webpack.config.js

   ~~~~js
   optimization:{
       splitChunks:{//webpack自动带领我们完成代码分割
           chunks:"all"
       }
   }
   ~~~~

3. 打包的结果是lodash被打包进了vendors-index.js里面去了

##### Code Splitting第三种方式

1.  采用异步加载的模式进行组件加载

   在index.js文件中写入如下代码：

   ~~~js
   function getComponent(){
       return import('lodash').then(({default:_})=>{
           let ele = document.createElement('div')
           ele.innerText=_.join(['a','b','c'],'***');
           return ele
       })
   }
   getComponent().then((ele)=>{
       document.body.appendChild(ele)
   }
   ~~~

2. 异步加载的文件存在了0.js文件中

   

#### Code Splitting的注意点

代码分割这个概念本身与webpack无关, webpack实现代码的分割的两个方式

1. 同步代码:只需要在webpack.common.js中配置optimization的配置即可
2. 异步代码(import函数):无需任何配置,webpack会自动进行配置,会自动放在新的文件夹中间

#### Code Splitting的底层插件SplitChunksPlugin

前面有讲到我们**使用webpack分割异步加载的组件**,但是**输出的文件**啥的,都**是默认的配置**,现在我们要**进行一些自定义配置**

1. 安装动态引入插件

   ~~~js
   npm i @babel/plugin-syntax-dynamic-import --save-dev
   ~~~

2. 修改babel配置文件

   ~~~js
   presets:[["@babel/preset-env",{
                           useBuiltIns:"usage",
                           targets:{
                               edge:"17",
                               chrome:"67",
                               safari:"11.1"
                           }
                       }]],
   "plugins":["@babel/plugin-syntax-dynamic-import"]//就是这个位置，上面那段是让你看一下位置的
   ~~~

3. 使用魔法注释

   ~~~js
   function getComponent(){
       return import(/*webpackChunkName:"loadsh"*/'lodash')
          .then(({default:_})=>{
           let ele = document.createElement('div')
           ele.innerText=_.join(['a','b','c'],'***');
           return ele
       })
   }
   getComponent().then((ele)=>{
       document.body.appendChild(ele)
   }
   ~~~

4. 当前用魔法注释自定义的文件名称前面**还是有一个前缀**的, 这个前缀是因为webpack.common.js里面的optimization属性影响的

   修改optimization的配置文件

   ~~~js
   optimization:{
       splitChunks:{//webpack自动带领我们完成代码分割
           chunks:"all"，
           cacheGroups:{
               vendors:false,
                   default:false
           }
       }
   }
   ~~~

5. 打包结果就是：

   在bundle文件夹下有打包出来的index.html和loadsh.js和index.js

#### Code Splitting的底层插件SplitChunksPlugin参数讲解

1. chunks:针对不同的打包方式来实现代码分割 有 all async initial(同步代码)三种

2. 异步的直接分割即可,异步分割的CacheGroups的配置如下：

   ~~~js
   optimization:{
       splitChunks:{//webpack自动带领我们完成代码分割
           chunks:"all"，
           minSize:30000,
           minChunks:1,
           maxAsyncRequest5,
           maxInitialRequest:3,
           automaticNameDelimiter:“~”,//前缀和名字之间的连接符
        	name:true,
           cacheGroups:{
               vendors:false,
               default:false
           }
       }
   }
   ~~~

   **注：如果是同步的话,就会往下继续读取CacheGroups的配置**

3. 同步导入采取如下配置：

   ~~~js
   optimization:{
       splitChunks:{//webpack自动带领我们完成代码分割
           chunks:"all"，
           minSize:30000,
           minChunks:1,
           maxAsyncRequest5,
           maxInitialRequest:3,
           automaticNameDelimiter:“~”,//前缀和名字之间的连接符
        	name:true,
           cacheGroups:{
               vendors:{
                   test:/[\\/]node_modules[\\/]/,
                   priority:-10
               },
               default:{
                   minChunks:2,
                   priority:-20,
                   reuseExistingChunk:true
               }
           }
       }
   }
   ~~~

   此时打包后的结果：

   ~~~js
   bundle文件夹下有：
   	index.html index.js  vendors~index.js
   ~~~

   

#### Code Splitting的底层插件SplitChunksPlugin参数讲解

​	除了cacheGroups这个参数之外的其他参数解释：

| minSize                | 小于这个尺寸的文件, 就不再做文件分割了, 就直接合并的         |
| ---------------------- | ------------------------------------------------------------ |
| maxSize                | 可配可不配,如果配置了, 比如值为50000, 那么单个被独立出来的引用包如果大于50000就会再次被分割(但是如果这个库是无法拆分的,那么这个maxSize就是没啥用的了) |
| minChunks              | 当一个模块被应用了多少次才会被分割, 一般就是1                |
| maxAsyncRequests       | 最大引用的模块数,webpack在该值设定的上限前会正确打包,后面的就不会再分割了 |
| maxInitialRequests     | 最大入口文件引用的模块数                                     |
| automaticNameDelimiter | 前缀和名字之间的连接符                                       |
| name                   | 一般就为true,专门用来标明下面的cacheGroups里面的基本配置是否生效 |

### 懒加载

懒加载有俩种思路：

图片中：

1. 先放置一张低清图片，当低清图片加载完成之后再让他请求对应的高清的图片，然后覆盖这张低清图片
2. 根据滚动条的位置请求图片，让滚动条每滚动一定的距离就让它请求一次数据

lazy loading 就是懒加载 

懒加载不是webpack的概念, 

它**在js里面就被提出来了**,我们**结合webpack的代码分割**,可以很好的实现该功能

例子：

~~~js
function getComponent(){
    return import('lodash').then(({default:_})=>{
        let ele = document.createElement('div')
        ele.innerText=_.join(['a','b','c'],'***');
        return ele
    })
}
document.addEventListener(’click‘，()=>(getComponent().then((ele)=>{
    document.body.appendChild(ele)
})
//此时，当点击时 getComponent 才会执行和加载对应的组件
~~~

##### chunk是啥？

每一个打包出来的文件都是一个chunk，这个文件数和minChunks的参数息息相关，

意思就是打包出来的chunk有几个用到了某个组件，用到了才会使用代码分割