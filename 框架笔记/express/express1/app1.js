let express = require("express");
let app = express();
// app.get("/",function(req,res){
//     //在express中,它会自动帮我们设置状态码为200 还有请求头,当然我们也可以自动设置
//     // res.send("hello world")
//     //设置请求状态码
//     // res.status("404").send("你访问的页面不存在");
//     //设置请求头
//    
// })
//参数的传递:使用冒号传递
// app.get("/:user/:psd",function(req,res){
//     res.send(req.params);
// });
//路由可以被正则匹配,并且通过req.params[0]可以获取正则小括号里的参数，注意，正则是没有双引号的，他不是字符串此参数
app.get(/^\/shen\/([\d]{2,3})$/,function(req,res){
    console.log(req.params)
    res.send("参数为"+req.params);
});

//路由后的参数不区分大小写，？后面的内容被忽略
app.get("/hello",function(req,res){
    res.send("不区分大小写噢！")
});
app.listen(3000);