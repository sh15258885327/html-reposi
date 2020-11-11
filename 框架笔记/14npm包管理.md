#### NPM
##### 一、NPM简介
npm已经在Node.js安装的时候顺带装好了。我们在命令提示符或者终端输入npm -v，可以看到npm的版本号。

##### 二、NPM相关网站以及使用
NPM官网：[https://www.npmjs.com/]
NPM中文网：[https://www.npmjs.cn/]
淘宝NPM镜像：[https://developer.aliyun.com/mirror/NPM?from=tnpm]

##### 三、package.json
我们使用package.json来管理依赖
在cmd中，我们可以使用npm init来初始化一个package.json文件，用回答问题的方式生成一个新的package.json文件。

```cmd
npm init
```
快速创建:
```cmd
npm init -y
```
给生成的package.json添加依赖

(在package.json文件中:添加一个如下键值对:)

~~~js
"dependencies": {
    "timestamp": "^0.0.1",
    "jquery":"^3.5.1"
  }
~~~

**这里注意俩点:**

1. 前面是安装的文件名
2. 后面是安装的文件版本号,版本号前面 要加 一个 ^

使用一下命令能安装所有依赖

所以:npm install (也可以缩写成 npm -i)是根据package.json里的内容来安装对应的文件

```cmd
npm install
```
当安装好之后会在package.json所在的文件夹下创建一个(如果没有)node_modules文件,来存放我们所安装的文件

卸载安装好的文件:

~~~js
npm uninstall jquery
~~~

就可以卸载一个依赖,同时会把depency中的这个jquery属性也给删除掉

**补充: 自定义npm指令 来 运行 node程序:**

在package.json文件里面找到"scripts"所对应的对象,在这里可以手动创建一个"start"来修改我们的node执行命令

~~~js
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
         "start": "node ./index.js"
  }	
~~~

此时与package.json同级的index.js输入

~~~js
const timestamp = require('time-stamp');
 
console.log(timestamp("YYYY-MM-DD"));
~~~

然后在命令行输入

~~~
npm start
~~~

即可在控制套打印出

~~~~
2020-07-08
~~~~

注:加入那个位置我不用start命名的话,需要再添加一个run,假设我把start改成dev则:

~~~
npm  run dev
~~~

才可以打印出上述信息

package.json介绍官网：[http://docs.npmjs.com/files/package.json]

##### 四：npm基本指令集

| npm install packagename                                  | 安装模块不指定版本号 默认会安装最新的版本                    |
| -------------------------------------------------------- | ------------------------------------------------------------ |
| npm install packagename 0.0.1                            | 安装指定版本的模块                                           |
| npm install packagename --save 或 -S--save、-S           | 参数意思是把模块的版本信息保存到dependencies（生产环境依赖）中，即你的package.json文件的dependencies字段中； |
| npm install packagename -g 或 --global                   | 安装全局的模块（不加参数的时候默认安装本地模块）             |
| npm install packagename --save-dev 或 -D--save-dev 、 -D | 参数意思是吧模块版本信息保存到devDependencies（开发环境依赖）中，即你的package.json文件的devDependencies字段中； |
| npm uninstall packagename [options]                      | 卸载已经安装的模块，后面的options参数意思与安装时候的意思一样,与这个命令相同的还有npm remove 、npm rm、npm r 、 npm un 、 npm unlink 这几个命令功能和npm uninstall基本一样 |
| npm outdated                                             | 这个命令会列出所有已经过时了的模块，                         |
| npm update [-g]                                          | 对于已经过时了的模块可以使用上面的命令去更新                 |
| npm update  [包名称]                                     | 更新指定名称的包                                             |

