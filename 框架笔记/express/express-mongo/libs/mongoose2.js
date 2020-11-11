let mongoose = require("mongoose");
let url = "mongodb://127.0.0.1:27017/students";
mongoose.connect(url,{useNewUrlParser:true});
let stuScheme = mongoose.Schema({
    name:String,
    age:Number
})
let stu = mongoose.model("students",stuScheme);
let shen = new stu({
    name:"审计",
    age:18
})
shen.save(()=>{
    console.log("保存成功")
})