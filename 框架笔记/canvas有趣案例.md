1. 八卦

   ~~~html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="author" content="申杰">
       <meta name="keywords" content="关键字信息">
       <meta name="description" content="信息描述">
       <title>
        
       </title>
       <style>
       #can{
               display: block;
                  border-radius: 50%;
                   margin: auto;
                   border: 1px solid black;
                   animation: anima 1s linear infinite;
               }
           @keyframes anima{
               0%{
                  transform: rotate(0deg);
               }
               25%{
                   transform: rotate(90deg);
               }
               50%{
                  transform: rotate(180deg);
               }
               75%{
                   transform: rotate(270deg);
               }
               100%{
                  transform: rotate(360deg);
               }
           }
       </style>
   </head>
   <body>
    <canvas id="can" width="500px" height="500px"></canvas>
    <script>
         let canvas = document.querySelector("#can");
         let canCon = canvas.getContext("2d");
           arc(250,250,250,Math.PI/2,Math.PI*3/2,'#000');
           arc(250,125,125,Math.PI/2,Math.PI*3/2,'#fff');
           arc(250,250,250,-Math.PI/2,Math.PI/2,'#fff');
           arc(250,375,125,-Math.PI/2,Math.PI/2,'#000');
           arc(250,125,40,0,Math.PI*2,'#000');
           arc(250,375,40,0,Math.PI*2,'#fff');
           function arc(x,y,r,bdeg,edeg,color){
               canCon.beginPath();
               canCon.arc(x,y,r,bdeg,edeg);
               canCon.fillStyle=color;
               canCon.fill();
           }
   
    </script>
   </body>
   </html>
   ~~~

2. 钟表

   ~~~html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="author" content="申杰">
       <meta name="keywords" content="关键字信息">
       <meta name="description" content="信息描述">
       <title></title>
       <style>
           .cav{
               background-color: pink;
           }
       </style>
   </head>
   <body>
    <canvas class="cav" width="500px" height="500px"></canvas>
    <script>
        let canvas = document.querySelector(".cav");
        let cavcon = canvas.getContext("2d");
   
       function drawClock(){
           cavcon.clearRect(0,0,500,500);
           //绘制表盘
           cavcon.beginPath();
           cavcon.arc(250,250,200,0,Math.PI*2);
           cavcon.strokeStyle="#000";
           cavcon.lineWidth=5;
           cavcon.stroke();
           let hour24 = new Date().getHours();
           let minute = new Date().getMinutes();
           hour24 = hour24>12?hour24%12:hour24;
           let hour = hour24+minute/60;
           let second = new Date().getSeconds();
           drawLine(500,500,200,12,25,5,'#000');
           drawLine(500,500,200,60,10,3,'#000');
           drawPoint(500,500,15,hour,100,5,'#000','round',12);
           drawPoint(500,500,15,minute,120,3,'blue','round',60);
           drawPoint(500,500,15,second,150,1,'red','round',60);
           cavcon.beginPath();
           cavcon.arc(250,250,5,0,Math.PI*2);
           cavcon.strokeStyle="blue";
           cavcon.stroke();
           cavcon.fillStyle="white";
           cavcon.fill();
           cavcon.font="18px Arial";
           cavcon.textAlign ="center";
           cavcon.fillStyle="blue";
           cavcon.fillText("Time is money",250,150,500);
       }
      drawClock();
      setInterval(drawClock,1000);
      //绘制刻度
       function drawLine(casWidth,casHeight,lineBegin,lineNumber,lineLenth,lineWidth,lineColor,lineCap='butt'){
           for(var i=0;i<lineNumber;i++){
               cavcon.save();//保存旋转前的状态 以便于下次旋转
               cavcon.translate(casWidth/2,casHeight/2);//修改坐标原点致中心点
               cavcon.rotate(i*Math.PI*2/lineNumber);
               cavcon.beginPath();
               cavcon.moveTo(0,-lineBegin);
               cavcon.lineCap=lineCap;
               cavcon.lineTo(0,-lineBegin+lineLenth);
               cavcon.lineWidth=lineWidth;
               cavcon.strokeStyle=lineColor;
               cavcon.stroke();
               cavcon.restore();//状态初始化
           }
       }
       //绘制指针
       function drawPoint(casWidth,casHeight,lineBegin,time,lineLenth,lineWidth,lineColor,lineCap='butt',degree){
               cavcon.save();//保存初始状态
               cavcon.translate(casWidth/2,casHeight/2);//修改坐标原点致中心点
               cavcon.rotate(time*Math.PI*2/degree);
               cavcon.beginPath();
               cavcon.moveTo(0,lineBegin);
               cavcon.lineCap=lineCap;
               cavcon.lineTo(0,-lineLenth);//负数用的很巧 刚好抵御那个180度
               cavcon.lineWidth=lineWidth;
               cavcon.strokeStyle=lineColor;
               cavcon.stroke();
               cavcon.restore();//状态初始化    
     }
            
    </script>
   </body>
   </html>
   ~~~

   



