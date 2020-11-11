let mongoose = require("mongoose");
let url = " mongodb://127.0.0.1:27017/students";
mongoose.connect(url, {useNewUrlParser:true,useUnifiedTopology: true});
let stuSchema = mongoose.Schema({
    name:String,
    age:Number
})
let monModel = mongoose.model("students",stuSchema);
let mm = new monModel({"name":"s","age":18});
mm.save(()=>{
    console.log("保存炒年糕个");
})
