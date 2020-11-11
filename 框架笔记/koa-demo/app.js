let Koa = require("koa");
let app = new Koa();//使用koa是这种方式
const bodyParser = require("koa-bodyparser");
let router = require("koa-router")();
let fs = require("fs");
// app.use(async (ctx,next)=>{
//     await next();
//     ctx.response.type="text/html";
//     ctx.response.body="hello world";
//     console.log(ctx.response);
// })
// app.listen(3000);
// app.use(async (ctx,next)=>{
//     let start = new Date().getTime();
//     await next();
//     for(var i=0;i<100000;i++);
//     let end =  new Date().getTime();
//     console.log(end-start);
    
// })
// app.use(async (ctx,next)=>{
//     // await next();
//     ctx.response.type="text/html";
//     ctx.response.body="<h1>hello world</h1>";
// })
// app.use(async (ctx,next)=>{
//    if( ctx.request.url==="/"){
//        ctx.type="text/html";
//        ctx.body="indexPage"
//    }else{
//        await next();
//    }
// })
// app.use(async (ctx,next)=>{
//     if( ctx.request.url==="/hello"){
//         ctx.type="text/html";
//         ctx.body="helloPage"
//     }else{
//         await next();
//     }
// })
router.get("/",async(ctx,next)=>{
    ctx.type="text/html";
    let data = fs.readFileSync(__dirname+"\\"+"index.html");
    ctx.body=data;
})
router.get("/hello/:name",async(ctx,next)=>{
    let obj = ctx.params;
    console.log(obj);
    let obj2 = JSON.parse(JSON.stringify(obj));
    console.log(obj2);
    console.log(ctx.request.url,ctx.request);
    ctx.body="hello world"
})
router.post("/login",async (ctx,next)=>{
  if(ctx.request.body.username==="admin" && ctx.request.body.password === "12345"){
      ctx.body=`hello ${ctx.request.body.username}`;
  }else{
      ctx.body="登录失败";
  }
})
app.use(bodyParser());
app.use(router.routes());

app.listen(3002);