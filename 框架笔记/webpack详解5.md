### 打包分析

https://github.com/webpack/analyse

这款工具可以帮助我们**分析webpack打包的全过程**和**相应的资源消耗**

#### 修改package.json里面的基本指令

原来的这个地方：

~~~js
"scripts": {
    "bundle": "webpack",
}
~~~

修改成：

~~~js
"scripts": {
    "bundle": "webpack --profile --json > stats.json --config ./build/webpack.dev.js",
}
~~~

然后会在package.json的兄弟目录中生出一个新的json文件：stats.json文件

该文件的内容就是我们在打包过程中的基本数据：内容如下：

~~~js
{
  "hash": "10fd34bd7e4052bddefb",
  "version": "5.3.2",
  "time": 242,
  "builtAt": 1604216479262,
  "publicPath": "auto",
  "outputPath": "C:\\Users\\申杰\\Desktop\\webpack-cli-project\\dist",
  "assetsByChunkName": {
    "main": [
      "main.js"
    ]
  },
  "assets": [
 	...
}

~~~

该文件的内容就是我们在打包过程中的基本数据

然后访问http://webpack.github.io/analyse/

把这个生的stats.json文件提交上去就可以了

我在测试的时候这个链接并无法访问，可以在

webpack官网上的指南中找到bundle，那里面提供了几个stats.json图形化工具

[https://www.webpackjs.com/guides/code-splitting/#bundle-%E5%88%86%E6%9E%90-bundle-analysis-](https://www.webpackjs.com/guides/code-splitting/#bundle-分析-bundle-analysis-)

### 代码使用率优化

利**用代码分割从而实现代码文件的缓存**,但是这个缓存从本质上来讲提升的是第二次访问网页的性能,并不能提升初次访问网页的性能

打包后：

运行html,在浏览器的控制台中输入ctrl+shift+p指令

打开命令行:并输入coverage指令

记录网页渲染的过程中代码的使用率

红色代表该代码没有在浏览器渲染网页的时候运行, 绿色则代表确实是运行了

所以：

​		在上述的代码可以分析得知,对于那种必须由某些**事件触发的函数其实并不参与网页的初次渲染**, 那么这段代码其实没必要一开始就传输过来,完全可以进行代码分割

如何实现这种代码的分割？

1. **新建一个click.js文件**,把点击后的业务挪到click.js里面

   index.js：

   ~~~js
   document.addEventListenr('click'，()=>{
       import("./click").then(({createElement})=>{
           createElement()
       })
   })
   ~~~

   click.js

   ~~~js
   function  createElement(){
       ...
   }
   export {createElement}
   ~~~

2.  此时可以看到代码利用率一下就提高了很多

   其中首次加载网页时需要下载的js代码变少了, 变成了异步加载

3. 注：**这也是webpack在帮助我们优化项目时采用的基本逻辑,** 

   比如用于代码分割的属性splitChunks里面的chunks的默认值就是async,

   即异步,因为异步的代码请求才可以减少首屏加载的时间

继续优化：

1. 前面的触发是由一个事件触发的,

   比如我要实现点击登录按钮,然后把登录界面传输过来,

   那么一旦网络不是很好,这个卡顿就会很明显,

   所以我们还得继续优化
   **比如说,在网络空闲的时候,就自动发送请求,然后下载相应的文件**?

如何实现？

**利用一个魔法注释**

1. /* webpackPrefetch:true */等主业务核心逻辑加载完再加载其他文件

   或者：

2. /* webpackLoad:true */和主业务核心逻辑一起加载,尽可能的提前加载

3. index.js

   ~~~js
   document.addEventListener("click",()=>{
       import(/* webpackPrefetch:true */"./click").then(({createElement})=>{
           createElement()
       })
   })
   ~~~

### webpack的性能优化

1. 提升webpack的打包速度：

   大型项目的打包甚是耗时间, 我们得从各个方面去提升这个打包的速度和效率
   跟上技术的更迭,升级最新环境(node,npm,Yarn)

2. 在尽可能少的模块上应用Loader(做好排除,tree shaking或是转义的目标模块)

3. 在开发模式下减少没必要的插件, 尽可能选择官方推荐的插件

4. 控制包文件的大小

5. 可以用thread-loader或是parallel-webpack , happypack等进行多线程打包

6. 合理使用sourcemap, sourcemap越大, 解析速度越慢

7. 在开发环境下使用内存进行编译

### 多页面文件打包

之前我们打包的页面只有一个index.html文件

现在我想要多打包出来几个html文件怎么做呢？、

1. 在src的html文件夹下新增一个content.html

content.html

~~~html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="author" content="申杰">
    <meta name="keywords" content="关键字信息">
    <meta name="description" content="信息描述">
    <title>自定义模板之内容页模板</title>
</head>
<body>
 <p>内容页模板</p>
</body>
</html>
~~~

2. 在src的js文件夹下新增一个content.js文件

   ~~~js
   let ele = documentElement("div");
   ele.innerText="content的页面内容"
   document.body.appendChild(ele)
   ~~~

3. 修改webpack.common.js

   ~~~js
       entry:{
           shenjie:'./src/js/index.js',
           content:"./src/js/content.js"
       },
           plugins:[
               new htmlWebpackPlugin({
                   template:"./src/html/template.html",
                   filename:"main.html",
                   chunks:['index']
               }),
               new htmlWebpackPlugin({
                   template:"./src/html/content.html",
                   filename:"content.html",
                   chunks:['content']
               }),
               new CleanWebpackPlugin(),
           ]
   ~~~

   这样就可以实现了

但是这是手动操作，还可以改进一下变成自动的

给 webpack.common.js添加如下代码，并把上述的 plugins对应的这段删除

添加代码如下：

~~~js
let createPlugins = (config)=>{
    let plugins = [new CleanWebpackPlugin()];
    Object.keys(config.entry).forEach((key)=>{
        plugins.push(new htmlWebpackPlugin({
            template:"./src/html/template.html",
            filename:`${key}.html`,
            chunks:[key]
        }))
    })
    return plugins
}
config.plugins = createPlugins(config)
module.exports = config
~~~

### 自定义loader

loader其实就是一个特殊的函数

让loader的属性值(路径）对应我们写的一个loader的一个js文件就可以了

~~~js
loader:path.resolve(__dirname,"./loader/replaceloader.js"),
   options:{
       a:"hello 小明",
       b:"hello 小红"
   }
~~~

replaceloader.js

~~~js
module.exports = function(source){
    return source.replace(this.query.a,this.query.b
}
~~~

所以这里的this就指向了webpack.common.js里的options

### Eslint的基本配置

...