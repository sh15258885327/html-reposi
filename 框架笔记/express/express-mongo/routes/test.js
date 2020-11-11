var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  let result = db.collection("test").find();
  result.toArray((err,data)=>{
      if(err){
          throw err;
          return;
      }
    console.log(data);
    res.render('test', { results: data });
  })
});
//插入一条
router.get("/insertOne",(req,res,next)=>{
    db.collection("test").insertOne({"name":"申杰","age":18},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档插入成功");
    });
})
//插入多条
router.get("/insertMany",(req,res,next)=>{
    db.collection("test").insertMany([{"name":"神仙","age":20},{"name":"美女","age":18}],function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档插入成功");
    });
})
//修改一条
router.get("/update",(req,res,next)=>{
    db.collection("test").update({"name":"神仙","age":20},{"name":"祖宗","age":18},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档修改成功");
    });
})
//修改多条(这种批量更新是有问题的,加multi对象不管用)
router.get("/updateMany",(req,res,next)=>{
    db.collection("test").update({"name":"申杰"},{"name":"神仙","age":18},{multi:true},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档批量修改成功");
    });
})
//删除一条
router.get("/remove",(req,res,next)=>{
    db.collection("test").remove({"name":"祖宗","age":18},function(err,data){
        if(err) throw err;
        console.log(data);
        res.send("文档删除成功");
    });
})
module.exports = router;
