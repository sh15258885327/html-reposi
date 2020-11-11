let express = require("express");
let app = express();
let bodyparser = require("body-parser");
const { encode } = require("punycode");
// app.get("/",function(req,res,next){
  
  
//     next();
//     console.log("这是第一个路由")
// })
// app.get("/",function(req,res){
//     console.log("这是第二个路由")
// })
// app.get("/admin/login",function(req,res){
//     res.send("登陆界面");
// });
// app.get("/:user/:id",function(req,res){
//     console.log("这是带冒号的那个路由");
//     res.send(req.params);
// });
app.use(bodyparser.urlencoded({extended:false}));
app.get("/hello",function(req,res){
    res.send(`<form action="http://localhost:3000/post" method="post">
    用户名:<input type="text" name="username">
    密码:<input type="text" name="password">
    <input type="submit" value="提交">
 </form> `);
});
app.post("/post",function(req,res){
    console.log(req.body);
    res.set({
        contentType:"text/html",
        charset:"utf-8"
    })
    res.send("<h1>请求成功，内容为"+JSON.stringify(req.body)+"</h1>");
})

app.listen("3000",function(){
    console.log("port start at 3000 ")
})
