# webpack详解3

## WebpackDevServe

### 文件监听实现自动打包

之前我们每更新一次文件,都要重新打包一下,现在,我们可以让他自动打包

1. 修改package.json文件, 在里面增加一条指令

   ~~~js
   “watch”:”webpack --watch”
   ~~~

2. 开启(需要输入这条指令开启才行哦~~~)

   ~~~js
   npm run watch
   ~~~

### WebpackDevServe

**WebpackDevServer的作用就是在本地开启一个临时服务器,**我们可以给这个服务器设置很多的一些配置,使得开发者可以方便的对项目进行调试

1. 安装webpack-dev-server

   ~~~js
   npm i webpack-dev-server --save-dev
   ~~~

2. 增加webpack.config.js的配置信息

   ~~~js
   devServer:{
       contentBase:"/bundle"//这个是我们的路径
   }
   ~~~

3. 增加package.json的指令

   ~~~js
   "start":"webpack-dev-server"
   ~~~

4. 运行指令:

   ~~~js
   npm start
   ~~~
   此时bundle下的文件夹是打不开的了

5. 

   WebpackDevServer在运行之后,我们还得自己手动打来浏览器, 这个未免也麻烦,

6. 可以再增加一个配置选项”open”

   当值设置为true时,我们运行了npm run start指令之后, 

   就会自动帮我们打开浏览器,在默认配置的本地服务器上运行

   ~~~js
   devServer:{
       contentBase:"/bundle",//这个是我们的路径
       open:true
   }
   ~~~

   之所以平时咱们都要在本地服务器环境下运行一个网页, 这有几个原因:

   1. 模拟实际的运行环境,查找错误
   2. 有些ajax服务得在服务器环境才能发送请求
   3. 可以呈现实时预览的效果

7. 自定义服务器端口

   ~~~js
   devServer:{
       contentBase:"/bundle",//这个是我们的路径
       open:true,
       port:8080    
   }
   ~~~

   1. 注意:使用webpack-dev-server打包的时候,咱们看不到bundle里面有啥内容, 这个原因是为了提升打包效率, 这些基本文件都被放在了内存中,以加快打包速度
   2. **在这里我的output处添加了一个publciPath属性，本来只是为了加一个前缀，结果因为这个，导致页面无法自动打开，因为路径访问错误**
   
   

### Hot Module Replacement(热模块更新技术)

**注:热更新 `HMR`只能在开发环境使用，不适用于生产环境**

1. 新建一个js文件,js文件内实现的功能:

2. 点击button元素就创建一个新的元素(newcon)

3. 新建一个css样式规则:

   1:逢双数给newcon加上一个背景色

4. 现在的问题在于,每次**修改了一次css整个网页都被重置刷新**了

如何解决:?

1. 在webpack.config.js中添加如下代码

~~~js
let webpack = require("webpack");
~~~

2. 在plugins处添加使用:

~~~js
new webpack.HotModuleRepalcementPlugin()
~~~

3. 在devServers处添加hot属性

~~~js
devServer:{
    contentBase:"/bundle",//这个是我们的路径
    open:"true",
    port:8080,
    hot:true
}
~~~

4. 此时再修改css就不会导致网页的刷新

5. 但是还是存在问题,当我们修改js的时候同样会导致刷新,怎么办?

   给devServer添加一个hotonly属性就可以：

   ~~~js
   devServer:{
       contentBase:"/bundle",//这个是我们的路径
       open:"true",
       port:8080,
       hot:true，
       hotonly:true
   }
   ~~~

6. 此时我们修改js的内容是不会发生实时更新的，但是我们可以在index.js下使用如下代码：

   ~~~js
   if(moudule.hot){
       module.hot.accept("./slider.js",()=>{
           createContent(root)
       })
   }
   ~~~

   注：

   有些框架的loader可以帮助我们实现这个功能,而不需要手动去写,比如vue的loader

   这样就可以保证js内容的修改不会导致页面的刷新

   不过有一点我们需要知道，js更新的问题与css有些不同**，js的执行结果是累加的**，而不是替换的，这是js的一个特性

## Es6转ES5

为了兼容一些老版本的浏览器,我们有时候需要做到转码

### babel转译工具

babel是一个把es6语法转义成ES5语法的工具, 目的是为了保证项目最终能够运行在一些老旧的浏览器上面

1. 安装新组件:

   1. ~~~js
      npm i babel-loader @babel/core --save-dev
      ~~~

   2. ~~~js
      npm i @babel/preset-env --save-dev
      ~~~

      babel-loader只是一个babel和webpack进行打通

      但是babel并不会帮助我们来执行翻译的工作

      这个新安装的组件就是帮助我们实现翻译的

2. 修改webpack.config.js的配置项

   ~~~js
   {
       test:/\.js$/,
       exclude:/node_modules/,
       loader:"babel-loader",
       options:{
           presets:["@babel/preset-env"]
       }
           
   }
   ~~~

   此时可以发现:

   ES6的let和箭头函数,都已经完成了转换
   但是**promise确没有完成转换**,低版本浏览器依然无法执行

   **怎么办?**

#### babel转译工具之语法转译

1. 安装新组件

   ~~~js
   npm i @babel/polyfill --save-dev
   ~~~

   **babel/preset是完成了ES6~ES5语法的翻译,**但是对于一些符合语法, 但是老版本浏览器不支持的**方法,babel/preset是无法支持的**, **因此**我们得**安装新的组件**,来完成这些js内置对象的翻译

2. 在index.js中导入babel/polyfill模块

   index.js:

   ~~~js
   import "@babel/polyfill"
   ~~~

3. 最终打包的文件里面有大量自定义的函数对象, 这样就可以在一些老浏览器内运行es6的内容了

#### babel转译工具之内置对象/方法转义

当前的转义有一个小小的问题, **babel/polyfill**在翻译的时候, **把**哪些在ES5中**不存在的**一个对象或是方法**都给封装**出来**了**, **导致**最终的打包**文件**分外的**大**,这种情况明显太过于臃肿了.

所以:**需要修改webpack.config.js的配置项**

~~~js
{
    test:/^.js$/,
    exclude:/node_modules/,
    loader:"babel-loader",
    options:{
        /*presets:["@babel/preset-env"]*/
         presets:[["@babel/preset-env",{
                        useBuiltIns:"usage"
           }]]
    }  
}
~~~

此时打包的文件一下小了很多

#### Babel转义工具之针对性的js版本兼容

这个targets配置是要求开发者自行指定我们的项目最终要想运行在哪些平台上, 然后Babel转义系统就会判断在chrome的67及以上版本…等是否内置了这些方法, 如果内置的话, 就不会帮我们实现转义, 没实现的版本, 就会自动转义

~~~js
{
    test:/^.js$/,
    exclude:/node_modules/,
    loader:"babel-loader",
    options:{
        /*presets:["@babel/preset-env"]*/
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
~~~

#### Babel转义工具之polyfill的缺陷和替代方案

**polyfill实现兼容的方法是直接进行全局注入**, 就相当于修改了全局的配置, 这对于一些业务型的代码来说自然没啥, 但是咱们要开发一个组件的话, 这个就有点hold不住了, 所以我们在某些**底层开发的场景下, 可以使用另外的转义方法**

**使用runtime 替代 polyfill 进行转译**

1. 安装新组件

   这个插件的好处就是可以避免污染全局的环境

   1. 

   ~~~js
   npm i @babel/plugin-transform-runtime --save-dev
   ~~~

   2. 

   ~~~js
   npm i @babel/runtime --save-dev
   ~~~

   3. 

   ~~~js
   npm i @babel/runtime-corejs2 --save-dev
   ~~~

2. webpackage.config.js:

   ~~~js
   {
       test:/^.js$/,
       exclude:/node_modules/,
       loader:"babel-loader",
       options:{
           "plugins":[
               [
                   "@babel/plugin-transform-runtime",
                   {
                       "absoluteRuntime":false,
                       "corejs":2,
                       "helpers":true,
                       "regenerator":true,
                       "useESMoudles":false
                   }    
               ]     
           ]
    }  
   }
   ~~~
   

#### Babel的特殊配置文件.babelrc

**把options里面的值单独拿出来放在一个对象里面**, 

减少webpack.config.js的文件的复杂度

除回调外，所有Babel API [选项](https://www.babeljs.cn/docs/6.26.3/babel-core#options)均允许使用

（因为`.babelrc`文件已序列化为[JSON5](https://github.com/json5/json5)）。

.babelrc:

用来替代了上面的options选项的内容

~~~.babelrc
{
    "plugins":[
        [
            "@babel/plugin-transform-runtime",
            {
                "absoluteRuntime":false,
                "corejs":2,
                "helpers":true,
                "regenerator":true,
                "useESMoudles":false
            }    
        ]     
    ]
} 
~~~

## tree Shaking详解

**能够在最后发布到网页上去的js内容中那些用不到的给去除掉,**这样就好了
**tree shaking的作用就是实现这个功能的**

1. 修改webpack.config.js的配置项:

   ~~~js
   //与上面那个大对象并列处写:
   optimization:{
       usedExports:true
   }
   ~~~

2. webpack打包的时候会标注某个文件最终会导出的接口都有哪些, 并且还会标注到底有哪些导出的被使用了

**注意: 开发环境下,** 为了保证能够正确给用户提示错误代码的行数信息等,即便是增加了该选项,实际导出的代码也不会进行削减

**在index.js中:**

如果我们偏偏导入了polyfill,  这个polyfill的方法或是函数什么的都是直接定义在全局的, 没啥导出的东西.

~~~js
import "@babel/polyfill"
~~~

如果被tree shaking解析的时候发现polyfill里面啥也没导出, 可能就会被忽略了
所以我们要对这个文件**加一个特殊的标记, 表示它被排除在tree shaking的检测系统之外**

在package.json文

**sideEffects:**就是之排除到tree Shaking系统之外的配置:
**false:默认值, 默认不排除任何情况** 

package.json:

~~~js
  "sideEffects":[
        "@babel/poly-fill",
        "*.css"
    ]
~~~

当切换到生产环境的时候,会发现只有用到的js被打包的,

**上面说过,开发环境为了提示错误信息,实际上是没有削减的**