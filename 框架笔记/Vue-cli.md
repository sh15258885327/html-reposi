#### vue-cli学习
##### 一、准备工作
需要安装node、webpack、vue-cli
安装webpack之后检查版本的时候可能会叫我们安装webpack-cli，按照提示安装即可。
```cmd
npm i webpack -g
npm i vue-cli -g
```
安装完之后检查一下,如下图出现对应的版本号即为成功。
注意:vue -V是大写的V
<img src="./vue-cli1.png"/>

##### 二、使用脚手架
初始化一个项目名称为demo的vue项目
```cmd
vue init webpack demo
```
<img src="./vue-cli2.png"/>

在这里可能会出现以下错误:

~~~text
 Command vue init requires a global addon to be installed.
  Please run npm install -g @vue/cli-init and try again.
~~~

所以对于vue2.0版本我们还需要在全局环境下安装如下:

~~~js
cnpm install -g @vue/cli-init
~~~



安装完成会出现如下提示：
<img src="./vue-cli3.png"/>

接下来按照提示操作即可运行程序
<img src="./vue-cli4.png"/>

打开浏览器访问http://localhost:8080即可看到一个vue项目
<img src="./vue-cli5.png"/>

接下来我们来看一下这个vue项目的目录文件的作用
<img src="./vue-cli6.png"/>

  let total = 0;

  //1+1/2+1/3 ...

  function fn(i){

   i++;

   return 1/i

  }

  for(let i = 0;i<1000;i++){

   total += fn(i);

  }

  console.log(total)