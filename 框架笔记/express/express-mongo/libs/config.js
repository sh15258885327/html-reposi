// let MongoClient = require("mongodb").MongoClient;
// let url = "mongodb://localhost:27017/test"
// MongoClient.connect(url,(err,client)=>{
//     if(err){
//         throw err;
//         return
//     }
//     console.log("数据库连接成功")
// })


    //4.0以上版本写法
    let MongoClient = require("mongodb").MongoClient;
    let url = " mongodb://127.0.0.1:27017/test";
    module.exports = async ()=>{
        var client = await MongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});
        db = client.db("test");
        console.log("数据库连接成功");
        return db
    }