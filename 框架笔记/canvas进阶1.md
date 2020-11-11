### canvas图形绘制之色彩管理

之前基本都是绘制内容的方法.如果我们想要给图形上色,有俩个重要的属性可以做到:fillStyle和strokeStyle.

fillStyle = color

**设置图形的填充颜色**

strokeStyle = color

**设置图形轮廓的颜色**

默认情况下,线条和填充颜色都是黑色(css 颜色 值 #000000)

注:一旦设置了strokeStyle或者fillStyle的值,那么这个新值就会成为绘制的图形的默认值,如果要给每个图形上不同的颜色,你需要重新设置fillStyle或strokeStyle的值

~~~
function createColorBoard(row,col,sin){
        let canvas = document.querySelector("canvas")
        let canCon = canvas.getContext("2d");
        for(let i=0;i<row;i++){
            for(let j = 0;j<col;j++){
                for(let z = 0;j<sin;j++){
                    if(j>15){
                        canCon.globalAlpha=0.5//全局透明度,,注它只会影响之后绘制的而不会影响之前绘制的
                    }
                    canCon.strokeStyle=`rgb(${Math.floor(255-(255/row)*i)},${Math.floor(255-(255/col)*j)},${Math.floor(255-(255/sin)*z)})`;
                    canCon.beginPath();
                    canCon.arc(12.5+j*25,12.5+i*25,10,0,Math.PI*2,true);
                    canCon.stroke();
                }
            }
        }
    }
    createColorBoard(30,30,30);
~~~

### Canvas图形绘制之色彩管理(透明度Transparency)

**globalAlpha** = transparencyValue(范围:0-1)

例:

~~~
canCon.globalAlpha = 0.4
~~~

关于上述透明度可以改成如下方式:

~~~
canCon.strokeStyle = "rgba(255,0,0,0.5)";
canCon.fillStyle = "rgba(255,0,0,0.5)";
~~~

注:

绘制矩形有fillRect或是strokeRect方法,

**但是弧线的绘制是没有的**, 只能一个个来,

并且**每次都要重新开始路径**,避免不同的圆之间存在线条链接

### 基础图形绘制之线型管理

| lineWidth = value                               | 设置线条宽度。属性值必须为正数。默认值是1.0 ( 单位是px )粗细是在路径的两边各绘制线宽的一半 |
| ----------------------------------------------- | ------------------------------------------------------------ |
| lineCap = type                                  | 设置线条末端样式butt，round (圆头和 square(方头,都是向外扩,所以会显得长一些,长度为一半的线宽)。默认是 butt。 |
| lineJoin = type(图形中两线段连接处所显示的样子) | 设定线条与线条间接合处的样式。round,(边角处被磨圆了，圆的半径等于线宽) bevel 和 miter(默认) |
| miterLimit = value                              | 限制当两条线相交时交接处最大长度；所谓交接处长度（斜接长度）是指线条交接处内角顶点到外角顶点的长度。 |
| getLineDash()                                   | 返回一个包含当前虚线样式，长度为非负偶数的数组。             |
| setLineDash(segments)                           | 设置当前虚线样式。                                           |
| lineDashOffset = value                          | 设置虚线样式的起始偏移量。                                   |

#### lineWidth:

必须对路径施以更加精确的控制。

已知粗 1.0 的线条会在路径两边各延伸半像素

那么**我们的坐标 设置 为 半像素的即可(例如:x坐标为3.5)**

这样:**填充出来就是准确的宽为 1.0 的线条**

否则:

结果就是以实际笔触颜色一半色调的颜色来填充整个区域

(浅蓝和深蓝的部分)

#### Canvas图形绘制之线型管理虚线设置

用 setLineDash 方法和 lineDashOffset 属性来制定虚线样式. **setLineDash 方法接受一个数组**，来指定线段与间隙的交替；**lineDashOffset 属性设置起始偏移量.**

~~~js
   let offset = 0;
    let canvas = document.querySelector("canvas");
    let canCon = canvas.getContext("2d");
    function draw(){
        canCon.clearRect(0,0,canvas.width,canvas.height);
        canCon.setLineDash([6,6]);//这里的数字必须能被12整除
        canCon.lineDashOffset=-offset;
        canCon.strokeStyle="green";
        canCon.strokeRect(10,10,100,100);
    }
    function play(){
        offset++;
        if(offset>12){
            offset = 0;
        }
        draw();
        setTimeout(play,200);
    }
    play();
~~~

#### Canvas图形绘制之线型管理渐变

我们可以用线性或者径向的

渐变来填充(fillStyle)或描边(strokeStyle)。

1. createLinearGradient(x1, y1, x2, y2)

   4个参数:

    (x1,y1):表示渐变的起点 

   (x2,y2:表示渐变的终点

2. createRadialGradient(x1, y1, r1, x2, y2, r2)

   createRadialGradient 方法接受 6 个参数，

   前三个定义一个以 (x1,y1) 为原点，半径为 r1 的圆，

   后三个参数则定义另一个以 (x2,y2) 为原点，半径为 r2 的圆。

3. gradient.addColorStop(position, color)

   addColorStop 方法接受 2 个参数

   **position 参数必须是一个 0.0 与 1.0 之间的数值**，表示渐变中颜色所在的相对位置

   color 参数必须是一个有效的 CSS 颜色值

~~~
let linegrad = canCon.createLinearGradient(0,0,0,140);
    linegrad.addColorStop(0,'blue');
    linegrad.addColorStop(0.5,'white');
    linegrad.addColorStop(0.5,'green');
    linegrad.addColorStop(1,'white');
    let linegrad2 = canCon.createLinearGradient(0,50,0,95);
    linegrad2.addColorStop(0.5,'black');
    linegrad2.addColorStop(1,'rgba(0,0,0,0)');
    canCon.fillStyle = linegrad;//渐变来填充
    canCon.strokeStyle = linegrad2;//描边
    canCon.fillRect(10,10,130,130);
    canCon.strokeRect(50,50,50,50);
~~~

#### Canvas图形绘制之图案样式Patterns

createPattern(image, type)

Image 可以是一个 Image 对象的引用，或者另一个 canvas 对象

Type 必须是下面的字符串值之一：repeat，repeat-x，repeat-y 和 no-repeat。

图案的应用**跟渐变很类似**的，**创建出一个 pattern 之后，赋给 fillStyle 或 strokeStyle 属性即可**

~~~
    let img = new Image();
    let url = "C:/Users/申杰/Desktop/sherry课后作业/提交的作业/0946032002申杰/images/girl/1.jpg";
    img.src = url;
    img.onload = function(){
        var patrn = canCon.createPattern(img,'repeat');
        canCon.fillStyle=patrn;//这里也是把pattern对象赋予给fillStyle
        canCon.fillRect(0,0,500,500);
    }
   canCon.fillStyle="skyblue";
   canCon.fillRect(0,0,500,500);
~~~

#### Canvas图形绘制之线型管理阴影

| shadowOffsetX = value | shadowOffsetX 和 shadowOffsetY 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 0。 |
| --------------------- | ------------------------------------------------------------ |
| shadowOffsetY = value | shadowOffsetX 和 shadowOffsetY 用来设定阴影在 X 和 Y 轴的延伸距离，它们是不受变换矩阵所影响的。负值表示阴影会往上或左延伸，正值则表示会往下或右延伸，它们默认都为 0。 |
| shadowBlur = value    | shadowBlur 用于设定阴影的模糊程度，其数值并不跟像素数量挂钩，也不受变换矩阵的影响，默认为 0。 |
| shadowColor = color   | shadowColor 是标准的 CSS 颜色值，用于设定阴影颜色效果，默认是全透明的黑色。 |

~~~
    canCon.shadowColor="grey";
    canCon.shadowOffsetX="8";
    canCon.shadowOffsetY="6";
    canCon.shadowBlur="10";
    let img = new Image();
    let url = "C:/Users/申杰/Desktop/sherry课后作业/提交的作业/0946032002申杰/images/girl/1.jpg";
    img.src = url;
    img.onload = function(){
        var patrn = canCon.createPattern(img,'repeat');
        canCon.fillStyle=patrn;//这里也是把pattern对象赋予给fillStyle
        canCon.fillRect(0,0,100,100);
    }
   canCon.fillStyle="skyblue";
   canCon.fillRect(200,200,100,100);
   //注:这里绘制的俩个图形都带有阴影效果:即所有canCon绘制的都会带有阴影啊
~~~

#### Canvas图形绘制之线型管理填充规则

当我们**用到 fill你可以选择一个填充规则**，该填充规则根据某处在路径的**外面或者里面来决定该处是否被填充**，这对于自己与自己**路径相交****或者路径被嵌套**的时候是有用的。

两个可能的值：

1.  “nonzero”: 全部填充, 默认值.  

2. “evenodd”:  奇偶数区域填充.

~~~
  canCon.arc(250,250,10,0,Math.PI*2,true);
    canCon.arc(250,250,30,0,Math.PI*2,true);
    canCon.arc(250,250,50,0,Math.PI*2,true);
    canCon.arc(250,250,70,0,Math.PI*2,true);
    canCon.arc(250,250,90,0,Math.PI*2,true);
    canCon.fillStyle="black";
    canCon.fill("evenodd");//给fill方法传入了一个参数
~~~

#### Canvas图形绘制之Path2D对象

为了简化代码和提高性能，Path2D对象已可以在较新版本的浏览器中使用，用来缓存或记录绘画命令，这样你将能快速地回顾路径。

~~~
    let path = new Path2D();// 空的Path对象

    path.rect(10,10,50,50);
    let path2 = new Path2D(path);// 克隆Path对象

    path2.moveTo(200,50)
    path2.arc(150,50,50,0,Math.PI*2,true);
    canCon.stroke(path2);
~~~

