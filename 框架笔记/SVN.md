#### SVN版本控制系统
SVN是一种集中式管理代码的版本控制系统，其原理是：
**把代码都保存到一个固定的位置，每次从这个位置拷贝更新代码，进行编辑，再把修改后的代码提交到该目录中。**

- 服务端VisualSVN Server:[https://www.visualsvn.com/]
- 客户端ToroiseSVN(小乌龟):[https://tortoisesvn.net/downloads.zh.html]

##### 一、安装VisualSVN Server步骤
1. 下载VisualSVN Server
<img src="./SVNSERVER1.png"/>
<img src="./SVNSERVER2.png"/>

2. 双击进行安装，安装过程如下：
<img src="./VisualSVN.gif"/>

3. 创建资源库：
<img src="./reposit.gif"/>

4. 创建用户，设定密码：
<img src="./creatUser.gif"/>

##### 二、安装SVN(小乌龟)步骤
1. 下载SVN(小乌龟)
<img src ="./SVN1.png"/>

2. 安装过程如下：
<img src="./svn.gif"/>

安装完毕之后点击鼠标右键可以看到有小乌龟的图标。此时我们安装的是英文版，如果需要中文版可以安装中文语言包。
安装语言包过程如下：
<img src="./svnLan.gif"/>
安装中文语言包之后就可以使用中文版了~

3. 管理代码：
1、在想要下载代码的位置，右键单击SVN Checkout/SVN 检出
2、填写资源库url，以及本地代码文件夹名称。可以选择全部检出或者根据特定版本号检出。
<img src="./code.gif"/>
