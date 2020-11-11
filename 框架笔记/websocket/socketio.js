let app = require("express")();
let http = require("http").Server(app);
var io = require("socket.io")(http);
var fs = require("fs");
app.get("/",function(req,res){
    console.log("渲染了页面")
    fs.readFile("./chat.html",function(err,data){
        res.end(data)
    })
});
io.on("connection",function(socket){
    socket.on("chat",function(msg){
        console.log(msg);
       io.emit("chat",msg);
    })
});
http.listen("3000",function(){
    console.log("Server run at 3000")
});