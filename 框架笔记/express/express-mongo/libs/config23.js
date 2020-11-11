
//4.0以上版本写法
let MongoClient = require("mongodb").MongoClient;
let url = " mongodb://127.0.0.1:27017/test";
let fun = async function(url){
    var client = await MongoClient.connect(url,{useNewUrlParser:true,useUnifiedTopology: true});
    return client;
}
exports.insert = async function(dbName,collectionName,jsonData){
    let client = await fun(url);
    let db = client.db(dbName);
    let cn = db.collection(collectionName);
    cn.insertOne(jsonData,function(err,data){
        if(err) throw err;
        console.log("文档插入成功");
        client.close().then(()=>{
            console.log(数据库连接关闭);
        })
    });
}
exports.update = async function(dbName,collectionName,jsonData1,jsonData2){
    let client = await fun(url);
    let db = client.db(dbName);
    let cn = db.collection(collectionName);
    cn.update(jsonData1,jsonData2,(err,data)=>{
        if(err) throw err;
        console.log("文档修改成功");
        client.close().then(()=>{
            console.log(数据库连接关闭);
        })
    })
}
exports.count = async function(dbName,collectionName){
    let client = await fun(url);
    let db = client.db(dbName);
    let cn = db.collection(collectionName);
    // cn.count({},()=>{
    //     if(err) throw err;
    //     console.log(data);
    //     res.send("计数完成");
    //     client.close().then(()=>{
    //         console.log(数据库连接关闭);
    //     })
    // })
    cn.count({}).then((count)=>{
        console.log(count);
        client.close();
    })
}