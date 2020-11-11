#### Mongoose
##### 一、简介
Mongoose是一个将JavaScript对象与数据库产生关系的一个框架。
Mongoose中文网：[http://www.mongoosejs.net/]
##### 二、Schema简介
Schema：一种以文件形式存储的数据库模型骨架，无法直接通往数据库端，也就是说它不具备对数据库的操作能力，仅仅只是数据库模型在程序片段中的一种表现，可以说是数据属性模型（传统意义的表结构），又或者是“集合”的模型骨架。
##### 三、如何使用
```js
// 引包，我们并不需要MongoDB的包
var mongoose = require("mongoose")
// 连接数据库,mongoose是数据库名字
mongoose.connect("mongoose://localhost/mongoose")
// 定义一个Schema，创建一个猫的模型，所有的猫都有名字.是字符串，“类”
var catSchema = mongoose.Schema({
    name: String
})
// Schema定义集合结构(定义表的列)

// Model:操作数据库
var catModel = mongoose.model("kitty", catSchema)
```
上面的代码中，没有一个语句是在明显的操作数据库，感觉都在创建类、实例化类、调用类的方法，都在操作对象。
mongoose的哲学就是让我们用操作对象的方式操作数据库。
##### 四、定义模型
创造schema（创造模型）
创造schema语句：new mongoose.schema({})
创造模型语句：db.model("Student", schema名字)

```js
// 创建了一个schema结构
var studentSchema = new mongoose.Schema({
    name: {type: String},
    age: {type: Number},
    sex: {type: String}
})
// 创建了一个模型，就是学生模型，也就是学生类
// 类是基于schema创建的
var studentModel = db.model("Student", studentSchema)
```

自己写的一个:

~~~js
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
~~~

