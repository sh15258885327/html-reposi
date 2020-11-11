let express = require("express");
let app = express();
app.set("view engine","pug");
app.get("/",function(req,res){
    let data = {
        title:"haha",
        h1:"hjahjd"
    }
    res.render("index",data);
})
app.listen("3000");