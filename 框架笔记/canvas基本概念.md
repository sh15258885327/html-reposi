# canvas

## 基本概念

Canvas负责在页面中设定一个区域,然后通过**js动态地在这个区域中绘制图形**

**(它就是一个图片,但是是通过js绘制的)**

与浏览器环境中的其他组件类似,canvas由几组API构成,

具备基本绘图能力的2D上下文.所有浏览器都支持这些API

canvas还建议了一个名为WebGl的3D上下文.,支持不够好呢

使用<canvas>元素,必须**先设置width 和 height属性**,用来指定可以绘制的区域大小.

**出现在开始和结束标签中的内容是后备信息,**如果浏览器布置canvas元素,就会显示这些信息

~~~html
 <canvas>
     您的浏览器不支持本网站的业务,请换一个谷歌浏览器查看</canvas>
~~~

### Canvas的尺寸概念

Canvas元素有俩个可以控制自身的尺寸和可绘制区域

1. css,控制元素大小
2. 标签的width和height属性(拥有默认为300*150),该属性直接体现为canvas的可绘制区域

#### 以下是几种常见的尺寸设置情况:

1. 没设置css,只设置了w和h属性,那么元素的可绘制区域与尺寸都是w,h
2. **设置css,没设置w和h属性(或者俩者不一致),**那么元素绘制时图像会伸缩以适应它的元素尺寸:如果css的尺寸与初始画布的比例不一致,**他会出现扭曲**

### 2D上下文

#### 渲染上下文

canvas元素创造了一个可以自定义大小的画布,它公开了一个或多个渲染上下文,其可以用来绘制和处理要展示的内容

canvas元素有一个叫做getContext()的方法,这个方法是用来获得渲染上下文和它的绘画功能**,getContext()只有一个参数,**上下文的格式

~~~
  let  canvas = document.querySelector("canvas");//获取canvas元素
   let canCon = canvas.getContext("2d");//获取canvas元素的渲染上下文
~~~

#### canvas的绘图概念模拟

1. 拿到国画上的宣纸部分 (找到canvas元素上的可绘制区域)

2. 拿起一支笔并蘸上有颜色的墨(设置绘制方式和绘制颜色)

3. 构思画什么(设置待绘制图形的参数)

4. 下笔作画   

#### canvas图形绘制之圆形

~~~
   let  canvas = document.querySelector("canvas");
     let canCon = canvas.getContext("2d");//上下文
        console.log(canCon);
        canCon.fillStyle = "green";//拿起一只笔,并蘸上有颜色的墨
        canCon.arc(250,250,66,0,Math.PI*2);//(圆心的x,y,圆的半径,从什么位置开始画,画到哪里结束)
~~~

   #### canvas图形绘制之矩形

   三种方法:

   1. fillRect(x,y,width,height**)绘制一个实心的矩形**
   
   2. storkeRect(x,y,width,height)**绘制一个空心的边框**
   
   3. clearRect(x,y,width,height)清除指定矩形区域,让清除部分完全透明
   
      **注:上面的fillRect相当于是把构思图形参数和下笔作画溶于一处,这样可以减少这些步骤**

   #### canvas 图形绘制之路径

   图形的基本元素是路径.**路径是通过不同颜色和宽度的线段或曲线相连形成的不同形状的点的集合**.一个路径,甚至一个子路径,都是闭合的,使用路径绘制图形需要一些额外的步骤

   1. 首先,需要创建路径的起始点
   
   2. 然后使用画图命令去画出路径
   
   3. 之后你把路径封闭
   
   4. 一旦路径生成,你就能通过描边或填充路径区域来渲染图形
   
      

| begainPath() | 开始一个路径                                             |
| ------------ | -------------------------------------------------------- |
| moveTo(x,y)  | 将笔触移动到指定的坐标x以及y上                           |
| lineTo(x,y)  | 绘制一条从当前位置到指定x以及y位置的直线                 |
| stroke()     | 通过线条来绘制图形轮廓                                   |
| fill()       | 通过填充路径的内容区域生成实心的图形                     |
| closePath()  | 新建一条路径,生成之后,图形绘制命令被指向到路径上生成路径 |

   #### canvas 图形绘制之弧线

   **arc(x,y,radius,startAngle,endAngle,boolean)**

   boolean:为true时是逆时针,当为false时是顺时针

   不写默认为false,为顺时针

   #### canvas 图形绘制之弧线

   **arcTo(x1,y1,x2,y2,radius)**

   根据给定的控制点和半径画一段圆弧,再以直线连接俩个控制点

   #### canvas 图形绘制之贝塞尔曲线

   quadraticCurveTo(cp1x,cp1y,x,y)

   绘制二次贝塞尔曲线,cp1x,cp1y为一个控制点,x,y为结束点

   bezierCurveTo(150,100,100,100,50,20)

   #### 贝塞尔曲线算法

   1. 在平面内任选3个不共线的点,依次用线段连接
   
   2. 在第一条线段上任选一个点D.计算该点到线段起点的距离AD,与该线段段总长AB的比例AD:AB
   
   3. 根据上一步得到的比例,从第二条线段上找出对应的点E,使得AD:AB = BE:BC
   
   4. 连接这俩点DE
   
   5. 从新的线段DE上再次找出相同比例的点F,使得DF:DE =AD:AB = BE:BC
   
      ![image-20200522210634834](C:\Users\申杰\AppData\Roaming\Typora\typora-user-images\image-20200522210634834.png)
   
   6. 到这里,我们就确定可贝塞尔曲线上的一个点F.接下来,,让选取的点D在第一条线段上从起点A移动到终点B,**找出所有的贝塞尔曲线上的点F,所有的点找出来之后**,我们也就得到了这条贝塞尔曲线
   
      ![image-20200522210939690](C:\Users\申杰\AppData\Roaming\Typora\typora-user-images\image-20200522210939690.png)

#### 贝塞尔曲线的升级版

当控制点个数为4时,情况会怎么样?

![image-20200523184132110](C:\Users\申杰\AppData\Roaming\Typora\typora-user-images\image-20200523184132110.png)

步骤是相同的,只不过我们每确定一个贝塞尔曲线上的点,要进行三轮取点操作.

![image-20200523184152690](C:\Users\申杰\AppData\Roaming\Typora\typora-user-images\image-20200523184152690.png)

AE:AB = BF:BC=CG:CD=EH:EF=FI:FG=HJ:HI,其中点J就是最终得到的贝塞尔曲线上的一个点

![image-20200523184204053](C:\Users\申杰\AppData\Roaming\Typora\typora-user-images\image-20200523184204053.png)

这样我们就得到的是一条三次贝塞尔曲线