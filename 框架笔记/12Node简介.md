#### Node简介
##### 一、简介
**Node.js是一个JavaScript运行环境。实质上是对Chrome V8引擎进行了封装。**Node.js对一些特殊用例进行优化，提供替代的API，使得V8在非浏览器环境下运行的更好。

V8引擎本身就是用于Chrome浏览器的JS解释部分，但是Ryan Dahl把这个V8搬到了服务器上，用于做服务器的软件。

Node.js是一个让JavaScript运行在服务器端的开发平台。它不是一种独立的语言，跟PHP、Python的“既是语言，也是平台”不同，Node.js使用JavaScript进行编程，运行在JavaScript引擎上（V8）。

与PHP、.net等后端语言相比，Node.js跳过了Apache、Nginx、IIS等HTTP服务器，它自己不用建设在任何服务器软件之上。Node.js没有Web容器。

Node.js自身的哲学是花最小的硬件成本，追求更高的并发，更高的性能处理。

Node.js官网地址：[https://nodejs.org/en/](下载LTS长期支持板，安装过程中勾选Add to Path)
<img src='./img/1.png'>
<img src='./img/2.png'>

##### 二、特点
**1、单线程**
单线程|
--- |
优点：操作系统不用再有线程创建、销毁、的时间开销。|
缺点：一个用户造成了线程的崩溃，整个服务器就崩溃了，其他人也就崩溃了。|
<img src='./img/3.png'>

**2、非阻塞I/O**
访问磁盘和网络这样的I/O 请求会比较慢,所以我们希望，在读取文件或通过网络发送消息时，运行平台不会阻塞业务逻辑的执行。

**Node.js采用了非阻塞型I/O机制**，比如在执行访问数据库代码的时候，会立即转而执行其后面的代码，把数据库返回结果的处理代码放在回调函数中，从而提高了程序的执行效率。

当某个I/O执行完毕时，将以事件的形式通知执行I/O操作的线程，线程执行这个事件的回调函数。为了处理异步I/O，线程必须有事件循环，不断的检查有没有未处理的事件，依次予以处理。

阻塞模式|非阻塞型模式
---|---
一个线程只能够处理一项任务，要想提高吞吐量必须通过多线程|一个线程永远在执行计算操作，这个线程的CPU核心利用率永远是100%。

所以由此可见，Node.js采用了一种很有哲理的解决方案：与其人多，但是好多人闲着，还不如一个人玩命，往死里干活。
**3、事件驱动 event-driven**
在Node中，客户端请求建立连接，提交数据等行为，会触发相应的事件。在Node中，在一个时刻，只能执行一个事件回调函数，但是在执行一个事件回调函数的途中，可以转而处理其他事件(比如又有新用户连接了)，然后返回继续执行原事件的回调函数，这种处理机制，称为“事件环”机制。

综上所述，我们的**Node三大特点**，实际上一个特点，离开谁都不行，离开了任何一个都玩转不了。
Node.js很像一个抠门的餐厅老板，只聘请1个服务生。但是结果却请很多服务员效率还高。
要记住**Node.js中所有的I/O都是异步的，回调函数，套回调函数。**

#### 三：node安装：

https://nodejs.org/zh-cn/

安装时：

​	注意,请务必勾选add to path

#### 四：node基本用法

node  “js文件地址”

#### 五：node的核心概念

1. 单线程
2. 非阻塞IO
3. 事件循环

##### 三、适合开发什么
当应用程序需要处理大量并发的I/O，而在向客户端发出响应之前，应用程序内部并不需要进行非常复杂的处理的时候，Node就很适合。Node也很适合和webscoket配合，开发长连接的实时交互应用程序。
比如：
- 用户表单收集
- 考试系统
- 聊天室
