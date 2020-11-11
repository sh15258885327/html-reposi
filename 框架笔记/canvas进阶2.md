### Canvas文字绘制

#### canvas 提供了两种方法来渲染文本:

**fillText(text, x, y maxWidth?)**

​	text:**文本**

​	(x,y):**位置**

​	maxWidth:**绘制的最大宽度**

在指定的(x,y)位置填充指定的文本，绘制的最大宽度是可选的( 如果最大宽度小于文字的实际大小的话, 文字会被压缩 ) 大于的话,则没啥事

**strokeText(text, x, y maxWidth?)**

在指定的(x,y)位置绘制文本边框( **空心文字** )，绘制的最大宽度是可选的.

**font = value**

**当前我们用来绘制文本的样式**

 这个字符串使用和 CSS font 属性相同的语法. 默认的字体是 10px sans-serif。

~~~
 canCon.font="48px red";
    canCon.strokeText("马梦雨",150,150);
    canCon.fillText("申杰",150,220);
~~~

**textAlign = value**

文本对齐选项. 可选的值包括：start, end, left, right or center. 默认值是 start。

**textBaseline = value**

基线对齐选项. 可选的值包括：top, hanging(文本基线是悬挂基线), middle, alphabetic(文本基线是标准的字母基线), ideographic(文字基线是表意字基线；如果字符本身超出了alphabetic 基线，那么ideograhpic基线位置在字符本身的底部), bottom。默认值是 alphabetic。

**direction = value**

文本方向。可能的值包括：ltr, rtl, inherit。默认值是 inherit。

### Canvas文字绘制之预测量文本宽度

measureText()

将返回一个 TextMetrics对象的宽度、所在像素，这些体现文本特性的属性

~~~
   let text = canCon.measureText("hello world")
    console.log(text);
~~~

### Canvas图片绘制

引入图像到canvas里需要以下两步基本操作：

1. 获得一个指向HTMLImageElement( 即**new Image()** )

2. 使用drawImage()函数将图片绘制到画布上

**drawImage(image, x, y)**
其中 image 是 image 或者 canvas 对象，x 和 y 是其在目标 canvas 里的起始坐标。

**drawImage(image, x, y, width, height)**

这个方法多了2个参数：

**width 和 height**，这两个参数用来控制 当向canvas画入时应该缩放的大小**(图片的宽高而已)**

~~~
let image = new Image();
    image.src="C:/Users/申杰/Desktop/sherry课后作业/提交的作业/0946032002申杰/images/girl/1.jpg";
    image.onload = function(){
        canCon.drawImage(image,10,10,200,200);
    }
~~~

**image.src="base64的编码"**

其优点就是图片内容即时可用，无须再到服务器兜一圈。

（还有一个优点是，可以将 CSS，JavaScript，HTML 和 图片全部封装在一起，迁移起来十分方便。）

缺点就是图像没法缓存，图片大的话内嵌的 url 数据会相当的长：

### Canvas图片绘制之视频素材导入

~~~
    let video = document.querySelector("video");
    video.addEventListener("play",function(){
        timerCallBack();
    });
    function timerCallBack(){
        if(video.paused || video.ended) {return} ;
        canCon.drawImage(video,0,0,500,300);
        setInterval(() => {
            timerCallBack();
        }, 1000/60);
    }
~~~

### Canvas图片绘制之切片

#### drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight)

总结:

1. sx sy从原图片哪个地方开始切
2.  sWidth, sHeight原图片切割多大
3. dx, dy 切出来的图片放在canvas画布上的位置
4. dWidth, dHeight 切出来的图片用多大的图片显示

### Canvas状态保存

save():保存画布(canvas)的所有状态

restore():恢复画布(canvas)的所有状态

Canvas状态存储在栈中，每当save()方法被调用后，当前的状态就被推送到栈中保存。一个绘画状态包括：

1. 当前应用的变形（即移动，旋转和缩放，见下）

   2. strokeStyle, fillStyle, globalAlpha, lineWidth, lineCap, lineJoin, miterLimit, shadowOffsetX, shadowOffsetY, shadowBlur, shadowColor, globalCompositeOperation 的值

      3. 当前的裁切路径（clipping path）,会在下一节介绍

      可以调用任意多次 save 方法。每一次调用 restore 方法，上一个保存的状态就从栈中弹出，所有设定都恢复

~~~
    canCon.fillRect(0,0,100,100);
    canCon.save();
    canCon.fillStyle="red";
    canCon.fillRect(15,15,80,80);
    canCon.save();
    canCon.fillStyle="green";
    canCon.fillRect(30,30,60,60);
    canCon.restore();//这个restore恢复上个save
    canCon.fillRect(50,50,40,40);
    canCon.restore();//这个restore恢复上上个save
    canCon.fillRect(70,70,20,20);
~~~

### Canvas原点移动之translate

translate(x, y)
translate 方法接受两个参数。x 是左右偏移量，y 是上下偏移量，如右图所示。

rotate(angle)
这个方法只接受一个参数：旋转的角度(angle)，它是顺时针方向的，以弧度为单位的值。
旋转的中心点始终是 canvas 的原点，如果要改变它，我们需要用到 translate 方法。

注意!!!!!!!  犹如CSS的transform的旋转与平移  

**先旋转后平移 ,与 先平移后旋转是不一样的**

Canvas缩放 Scaling

scale(x, y)
scale  方法可以缩放画布的水平和垂直的单位。两个参数都是实数，**可以为负数**，x 为水平缩放因子，y 为垂直缩放因子，**如果比1小，会比缩放图形**， **如果比1大会放大图形**。默认值为1， 为实际大小。

~~~
    let image = new Image();
    let image2 = new Image();
    image.src="./images/bladeSoul.jpg";
    image2.src = "./images/2.jpg";
    image2.onload=function(){
        canCon.translate(100,100);
        canCon.rotate(Math.PI/4);
        canCon.scale(0.5,0.5)
        canCon.drawImage(image,300,0,200,200);
        canCon.drawImage(image2,300,300,200,200);
    }

~~~



### Canvas的合成选项 globalCompositeOperation

我们不仅可以在已有图形后面再画新图形，还可以用来遮盖指定区域，清除画布中的某些部分

globalCompositeOperation = type

其中:type分为如下几种类型:

| source-over      | 这是默认设置，并在现有画布上下文之上绘制新图形               |
| ---------------- | ------------------------------------------------------------ |
| source-in        | 新图形**只在新图形和目标画布重叠的地方绘制**。其他的都是透明的。 |
| source-out       | 在不与现有画布内容重叠的地方绘制新图形                       |
| source-atop      | 新图形只在与现有画布内容重叠的地方绘制。                     |
| destination-over | 在现有的画布内容后面绘制新的图形。                           |
| destination-in   | 现有的画布内容保持在新图形和现有画布内容重叠的位置。其他的都是透明的。 |
| destination-out  | 现有内容保持在新图形不重叠的地方。                           |
| destination-atop | 现有的画布只保留与新图形重叠的部分，新的图形是在画布内容后面绘制的。 |
| lighter          | 两个重叠图形的颜色是通过颜色值相加来确定的。                 |
| copy             | 只显示新图形。                                               |
| xor              | 图像中，那些重叠和正常绘制之外的其他地方是透明的。           |
| multiply         | 将顶层像素与底层相应像素相乘，结果是一幅更黑暗的图片。       |
| screen           | 像素被倒转，相乘，再倒转，结果是一幅更明亮的图片。           |
| overlay          | multiply和screen的结合，原本暗的地方更暗，原本亮的地方更亮。 |
| darken           | 保留两个图层中最暗的像素。                                   |
| lighten          | 保留两个图层中最亮的像素。                                   |
| color-dodge      | 将底层除以顶层的反置。                                       |
| color-burn       | 将反置的底层除以顶层，然后将结果反过来。                     |
| hard-light       | 屏幕相乘（A combination of multiply and screen）类似于叠加，但上下图层互换了。 |
| soft-light       | 用顶层减去底层或者相反来得到一个正值。                       |
| difference       | 一个柔和版本的强光（hard-light）。纯黑或纯白不会导致纯黑或纯白。 |
| exclusion        | 和difference相似，但对比度较低。                             |
| hue              | 保留了底层的亮度（luma）和色度（chroma），同时采用了顶层的色调（hue）。 |
| saturation       | 保留底层的亮度（luma）和色调（hue），同时采用顶层的色度（chroma） |
| color            | 保留了底层的亮度（luma），同时采用了顶层的色调(hue)和色度(chroma |
| luminosity       | 保持底层的色调（hue）和色度（chroma），同时采用顶层的亮度（luma）。 |

注:这些很多是实验性质的属性,可以自行研习尝试一下

~~~
    let image = new Image();
    let image2 = new Image();
    image.src="./images/bladeSoul.jpg";
    image2.src = "./images/2.jpg";
    canCon.globalCompositeOperation="source-over";
    image2.onload=function(){
        canCon.translate(100,100);
        canCon.rotate(Math.PI/4);
        canCon.scale(0.5,0.5)
        canCon.drawImage(image,300,0,200,200);
        canCon.drawImage(image2,300,300,200,200);
        canCon.fillStyle="red";
        canCon.arc(350,350,20,0,Math.PI*2,true);
        canCon.fill();
    }
~~~

