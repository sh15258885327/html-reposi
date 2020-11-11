### Canvas裁剪路径

裁切路径和普通的 canvas 图形差不多，不同的是它的作用是遮罩，用来隐藏不需要的部分。

红边五角星就是裁切路径，所有在路径以外的部分都不会在 canvas 上绘制出来。

1. ctx.clip()
2. ctx.clip(fillRule);
3. ctx.clip(path, fillRule);
4. 将当前正在构建的路径转换为当前的裁剪路径

我们使用 clip()方法来创建一个新的裁切路径。

默认情况下，canvas 有一个与它自身一样大的裁切路径（也就是没有裁切效果）

fillRule
这个算法判断一个点是在路径内还是在路径外。
允许的值：

1. "nonzero": 非零环绕原则，默认的原则。
2. "evenodd": 奇偶环绕原则。

~~~
     let path = new Path2D();
        path.arc(200,200,10,0,Math.PI*2,true);
        path.arc(200,200,20,0,Math.PI*2,true);
        path.arc(200,200,30,0,Math.PI*2,true); 
        path.arc(200,200,40,0,Math.PI*2,true);
        path.arc(200,200,50,0,Math.PI*2,true);
        path.arc(200,200,60,0,Math.PI*2,true);
        path.arc(200,200,70,0,Math.PI*2,true);
        // path.moveTo(150,150);
        // path.lineTo(200,150);
        // path.lineTo(200,200);
        // path.lineTo(150,150);
        // canCon.fillStyle="skyblue";
        // canCon.fillRect(0,0,500,500); 
             
        canCon.clip(path,'evenodd');
        canCon.fillStyle="red"; //被裁切的矩形区域填充的颜色
        canCon.fillRect(0,0,500,500);//被裁切的矩形区域
~~~

### Canvas动画原理

动画实现的基本要素:

1. **单位时间内连续播放多张图片。**这个单位时间一般以秒为单位，在计算机渲染的图形中要想获得一个足够流畅的视频，每秒钟内的图片数量必须要大于等于显示器的刷新频率（这个刷新频率一般为60hz）
2. **每一张图片**内的物体状态（大小，形状，颜色，位置，角度等等）**必须要发生改变**

~~~
         let y = 50;
        function anim(){
        function move(time){
                canCon.beginPath();
                canCon.clearRect(0,0,500,500);
                canCon.fillStyle="yellow";
                canCon.arc(250,y++,50,0,Math.PI*2,false);
                canCon.fill();
                requestAnimationFrame(move);
            }
            requestAnimationFrame(move);
        }
        anim()
~~~
#### Canvas动画原理之长尾效果

~~~
        let y = 0;
            setInterval(() => {
                canCon.beginPath();
                canCon.fillStyle="rgba(0,0,0,0.2)";//使用canCon的透明度图层进行遮盖堆积而逐步达成长尾效果
                canCon.fillRect(0,0,canvas.width,canvas.height);
                canCon.fillStyle="#fff";
                canCon.arc(500,y+=2,5,0,Math.PI*2,false);
               canCon.fill();
            }, 1000/60);
     
~~~

### Canvas像素处理

为了获得一个包含画布场景像素数据的ImageData对像，可以用getImageData()方法

var myImageData = ctx.**getImageData(left, top, width, height)**;

这个方法会返回一个ImageData对象，它代表了画布区域的对象数据，此画布的**四个角落分别表示为(left, top), (left + width, top), (left, top + height), 以及(left + width, top + height)四个点。**这些坐标点被设定为画布坐标空间元素。

你可以用putImageData()方法去对场景进行像素数据的写入。

**dx和dy参数表示你希望在场景内左上角**绘制的像素数据所得到**的设备坐标。**

**putImageData(myImageData,dx,dy);**

### Canvas像素管理之数据格式

**ImageData对象中存储着**canvas对象真实的像素数据，它包含以下几个只读属性：

**width**
图片宽度，单位是像素
**height**
图片高度，单位是像素
**data**
Uint8ClampedArray类型的一维数组，包含着RGBA格式的整型数据，范围在0至255之间（包括255）。

**data属性返回一个 Uint8ClampedArray**，它可以被使用作为查看初始像素数据。每个像素用4个1bytes值(按照红，绿，蓝和透明值的顺序; 这就是"RGBA"格式) 来代表。每个颜色值部份用0至255来代表。每个部份被分配到一个在数组内连续的索引，左上角像素的红色部份在数组的索引0位置。像素从左到右被处理，然后往下，遍历整个数组。

### Canvas像素管理之创建数据

去创建一个新的，空白的ImageData对象，使用createImageData() 方法。

有2个版本的createImageData()方法。

1. **var myImageData = ctx.createImageData(width, height);**

   上面代码创建了一个新的具体特定尺寸的ImageData对象。**所有像素被预设为透明黑。**

2. 你也可以创建一个被anotherImageData对象指定的相同像素的ImageData对象。**这个新的对象像素全部被预设为透明黑**。这个**并非复制了图片数据。**

   **var myImageData = ctx.createImageData(anotherImageData);**

3. 总结:

   想创造一个imageData实现,需要传参以上俩种,创建之后预设都是透明黑,但是不传参是不行的

   ~~~
   let data = canContentOne.createImageData(200,200);//显示一块200*200的花屏(如果改成一个imageData,会显示那个imageData大小的花屏)
       function randomPx(min,max){
           return Math.random()*(max-min)+min;
       }
       data.data.forEach((item,index,array)=>{
           item = Math.floor(randomPx(0,255));
           array[index] = item;
       })
       canContentTwo.putImageData(data,0,0);
       console.log(data);
   ~~~

   

### Canvas像素管理

~~~
    let canvas1 = document.querySelector(".canvas1");
     let canvas2 = document.querySelector(".canvas2");
     let canContentOne = canvas1.getContext("2d");
     let canContentTwo = canvas2.getContext("2d");
     let path = new Path2D();
     path.moveTo(200,0);
     path.lineTo(300,0);
     path.lineTo(300,200);
     path.lineTo(200,0);
     canContentOne.clip(path);
     canContentOne.fillStyle = "skyblue";
     canContentOne.fillRect(0,0,500,500);
     let imageData = canContentOne.getImageData(0,0,500,500);
 canContentTwo.putImageData(imageData,0,0);
~~~

### Canvas像素管理之缩放和反锯齿

**用drawImage() 方法**， **第二个画布**和**imageSmoothingEnabled** 属性的帮助下，我们**可以放大显示我们的图片及看到详情内容**。

CanvasRenderingContext2D.imageSmoothingEnabled 是 Canvas 2D API 用来设置图片是否平滑的属性，true表示图片平滑（默认值），false表示图片不平滑。当我们获取 imageSmoothingEnabled 属性值时， 它会返回最新设置的值。

~~~
    let img = new Image();
    img.src = './images/2.jpg';
    img.onload=function(){
        canContentOne.drawImage(img,0,0,500,500);
    }
    canContentTwo.imageSmoothingEnabled = true;
    canvas1.addEventListener('mousemove',function(e){
        canContentTwo.drawImage(canvas1,e.offsetX-25,e.offsetY-25,50,50,0,0,500,500);
    });
~~~

~~~
    let img = new Image();
    input.addEventListener("change",function(){
        img.src = window.URL.createObjectURL(input.files[0]);
        img.onload=function(){
        canContentOne.drawImage(img,0,0,500,500);
        }
    })
    
    canContentTwo.imageSmoothingEnabled = true;
    canvas1.addEventListener('mousemove',function(e){
        canContentTwo.drawImage(canvas1,e.offsetX-25,e.offsetY-25,50,50,0,0,500,500);
    });
~~~

### Canvas保存图片

**canvas.toDataURL('image/png’, quality)**
默认设定。创建一个PNG图片。 格式是bese64格式
你可以有选择地提供从0到1的品质量，1表示最好品质，0基本不被辨析但有比较小的文件大小。

~~~
    btn.addEventListener("click",function(){
        img.src = window.URL.createObjectURL(input.files[0]);
        let base64 = canvas1.toDataURL("",1);
        let a = document.createElement("a");
        a.href=base64;
        a.download="111.png";
        a.click();
    })
~~~

### Canvas点击区域

判断鼠标坐标是否在canvas上一个特定区域里一直是个有待解决的问题。(比如上面的例子)
hit region API让你可以在canvas上定义一个区域，这让无障碍工具获取canvas上的交互内容成为可能。它能让你更容易地进行点击检测并把事件转发到DOM元素去。这个API有以下三个方法**（都是实验性特性，请先在浏览器兼容表上确认再使用）**

CanvasRenderingContext2D.addHitRegion() 
在canvas上添加一个点击区域。
CanvasRenderingContext2D.removeHitRegion() 
从canvas上移除指定id的点击区域。
CanvasRenderingContext2D.clearHitRegions() 
移除canvas上的所有点击区域。

你可以把一个点击区域添加到路径里并检测MouseEvent.region属性来测试你的鼠标有没有点击这个区域，

~~~
let canvas1 = document.querySelector(".canvas1");
let canContentOne = canvas1.getContext("2d");
canContentOne.beginPath();
    canContentOne.arc(250,250,150,0,Math.PI*2);
    canContentOne.fill();
    canContentOne.addHitRegion({id:"图形点击区域"});
    canvas1.addEventListener("click",function(e){
        if(e.region){
            console.log("点击区域为:"+e.region);
        }
    })
~~~

### 雨滴

~~~js
   let video = document.querySelector("video");
        let canvas = document.querySelector(".rain>canvas");
        let p = document.querySelector(".rain>p");
        let w,h;
        let rainArray=[];
        ~~function(){
            window.onresize = arguments.callee;//这段代码注意
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = w;
            canvas.height = h;
            video.play();
            video.loop = true;
        }();
        let canCon = canvas.getContext("2d");
        function random(min,max){
            return Math.random()*(max-min)+min;
        }
        class Rain{
            constructor(){
              
            }
            init(){
                this.x = random(0,w);//雨滴的x坐标
                this.y = 0;//雨滴的y坐标
                this.v = random(10,15);//雨滴的下落速度
                this.end = random(0.85,0.88);//雨滴的结束位置'
                this.r = 2;
                this.rv = random(0.95,0.98);
                this.a = 1.1;
            }
            draw(){
                if(this.y<this.end*h){
                    canCon.fillStyle="#3ff";
                    canCon.fillRect(this.x,this.y,2,10);           
                }else{
                    canCon.strokeStyle=`rgba(51,255,255,${this.a})`;
                    canCon.beginPath();
                    canCon.arc(this.x,this.y,this.r,0,Math.PI*2);
                    canCon.stroke();
                }
            }
            move(){                
                    if(this.y>=this.end*h){
                        if(this.a>0.05){
                            this.r += 2 ;
                            this.a*= this.rv;
                        }else{
                            this.init();
                        }
                    }else{
                        this.y += this.v;
                    }          
                    this.draw();             
            }
        }
        /*存储雨滴*/
        function createRain(num){
            for(let i=0;i<=num;i++){
                let rain = new Rain();
                rain.init();
                rainArray.push(rain);
            }
        }
        createRain(200);
        /*遍历雨滴,添加图层*/
       function carryArray(arr){
           setInterval(function(){
               canCon.fillStyle="rgba(0,0,0,0.5)";
               canCon.fillRect(0,0,w,h);
                for(item of arr){
                    item.move();
                }
           },1000/60)
       }
       carryArray(rainArray);
~~~

### 马赛克

~~~
    <div class="content">
        <canvas class="pic" width="500" height="500"></canvas>
        <div class="operate">
            <input type="file">
            <div class="download">下载</div>
        </div>
    </div>
 <script>
     let input = document.querySelector("input");
     let image = new Image();
     let w,h;
     let mouserange=10;//定义一个马赛克涂抹的范围
     let x,y,toggle=false;
     let canvas = document.querySelector("canvas");
     let canCon = canvas.getContext("2d");
     let download = document.querySelector(".download");
     input.addEventListener("change",function(){
        canCon.clearRect(0,0,canvas.width,canvas.height);
        let url = window.URL.createObjectURL(this.files[0]);
        image.src = url;
        image.onload = function(){
            let nw = image.naturalWidth;
            let nh = image.naturalHeight;
            if(nw>nh){
                w = canvas.width;//实际展示宽度
                h = nh*w/nw;//实际展示高度
                canCon.drawImage(image,0,(canvas.height-h)/2,w,h);
            }else{
                h = canvas.height;
                w = nw*h/nh;
                canCon.drawImage(image,(canvas.width-w)/2,0,w,h);
            }
        }
     });
     canvas.addEventListener("mousedown",misco);
     canvas.addEventListener("mousemove",misco);
     canvas.addEventListener("mouseup",misco);
     function misco(e=window.event){
        e.stopPropagation();
        switch(e.type){
            case "mousedown":
                toggle = true;
                x = e.offsetX;
                y = e.offsetY;
                x = x-mouserange/2;
                y = y-mouserange/2;
                decoration(x,y,mouserange);//在这个位置开始涂鸦,涂鸦范围为往右边mouserange,往左边mouserange
                break;
            case "mousemove":
                if(toggle){
                    x = e.offsetX;
                    y = e.offsetY;
                    x = x-mouserange/2;
                    y = y-mouserange/2;
                    decoration(x,y,mouserange);
                }
                break;
            case "mouseup":
                toggle= false;
                break;
        }
     }
     function decoration(x,y,range){
         let arr = [];
         let r=0,g=0,b=0;
        let data = canCon.getImageData(x,y,range,range);
        for(let index=0;index< data.data.length-4;index+=4){
            arr.push(data.data.slice(index,index+4));
        }
        for(let item of arr){
           r += item[0];
           g += item[1];
           b += item[2];
        }
        canCon.fillStyle=`rgb(${Math.round(r/arr.length)},${Math.round(g/arr.length)},${Math.round(b/arr.length)})`;//马赛克关键是把每个r色平均一下,g平均一下,r平均一下
        canCon.fillRect(x,y,range,range);
        
     }
     download.addEventListener("click",function(){
        let base64 = canvas.toDataURL("",1);
        let a = document.createElement("a");
        a.href = base64;
        a.download = "图片.png";
        a.click();
     });
~~~

