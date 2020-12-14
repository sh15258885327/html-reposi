# mongoDB的基本操作

## 连：//connect

看 数据库.md

~~~js
mongoose.connect("mongodb://127.0.0.1:27017/shen_data",{
    useNewUrlParser: true
}).then(()=>{
    console.log("连接成功")
}).catch((err)=>{
    console.log("连接失败")
    throw err
})
~~~



## 增： //create 

看 数据库.md

~~~js
mongoose.model("gfs",new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    age:Number,
    height:Number,
    fancy:String
})).create({ 
    name:"陈玉棋",
    age:18,
    height:160,
    fancy:"小说"
},{
    name:"萧燕燕",
    age:20,
    height:165,
    fancy:"古装"
},{
    name:"范冰冰",
    age:28,
    height:168,
    fancy:"演员"
}).then(()=>{
    console.log("添加成功")
   
}).catch((err)=>{
    console.log("添加失败")
    throw err
})
~~~



## 删：

### 删除单个数据：//deleteOne

~~~js
gfs.deleteOne({
    name:"陈玉棋"
}，function(err){
    if(err) throw err;
    console.log("删除成功")
})
~~~

查找需要删除的数据，可以选择数据中的某个字段和值

**这个会删除匹配到的第一个数据**

注：如果选中待删除的数据的条件出错, 那么不会有提示, 同时也不会有啥效果

### 删除多个数据 : //deleteMany

~~~js
gfs.deleteMany({
    name:"陈玉棋"
}，function(err){
    if(err) throw err;
    console.log("删除成功")
})
~~~

**deleteMany()会删除掉所有匹配的结果**

删除数据的操作同样也支持promise方法, 成功不传输数据,失败传输一个错误对象

建议使用promise的操作,这个最符合ES6的代码规范

### 多条件删除   //给对象添加多个字段

删除数据可以同时选中多个条件，只有多个条件都匹配才会删除

~~~js
gfs.deleteMany({
    name:"陈玉棋"，
    age:18
}，function(err){
    if(err) throw err;
    console.log("删除成功")
})
~~~

#### 那么问题来了,删除数据只能一个个匹配嘛?

比如我想让他删除年龄大于20 的，怎么操作？看查...

当然不是：

~~~js
gfs.deleteMany({
    age:{$gt:20}
}).then((data)=>{
    console.log("删除数据成功")
    console.log(data)
}).catch((err)=>{
    console.log("删除失败")
    throw err
})
~~~

结果：

~~~js
删除数据成功
{n:4,ok：1，deleteCount:4}
~~~



## 查：

查数据往往都是数据库中最复杂的操作,

 我们一般使用的方式有**find,findOne以及findMany**

~~~js
gfs.find(conditions,[projection,[options,[callback]]]){
    conditions:查询条件
 	projection: 返回的内容选项
    options: 查询配置选项
    callback: 回调函数 或是使用promise, 会返回err或是data
}
~~~

### 查之 find

~~~js
gfs.find({
     name:"陈玉棋"
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

配置了查询条件和回调函数 查询成功时数据会传到.then方法中

### 查之**conditions**

除去直接的字段匹配之外, 我们还需要一些**条件查询**

#### 基础条件查询:（对应值）

1. $gt: 大于,是 greater than的缩写
2. $gte: 大于等于
3. $lt: 小于
4. $lte: 小于等于
5. $ne: 不等于

~~~js
gfs.find({
     age:{
         $lt:20
     }
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

#### 逻辑条件查询:（对应属性）

1. $or ：或
2. $nor: 非
3. $and: 与

~~~js
gfs.find({
     $or:[
         {
             name:"陈玉棋"
         }，
         {
             name:"萧燕燕"
         }
     ]
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

#### 存在条件查询:

1. $in: 存在特定**值**
2. $nin: 不存在特定**值**
3. $exists: 存在某**属性**

~~~js
gfs.find({
    name:{
       $in:["陈玉棋","萧燕燕"]
    }，
    hansome:{
    	$exists:false
	}
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

#### 数组条件查询:

**对于数组属性的判断**（某个字段类型是数组的情况下）

1. $size: 数组长度匹配
2. $all : 数组中是否包含指定项

~~~js
gfs.find({
    /*
  typelist:{
      $size:3  
  }*/
    typelist:{
     $all:["金矿石","银矿石"]
  }
    
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

#### 自定义判断(推荐)

**$where:”代码块或是函数”**

**代码块或是函数返回的值得是一个布尔值**

~~~js
gfs.find({
	$where:function(){
        return this.typelist.length>3
    }
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

#### 正则匹配判断

~~~js
gfs.find({
	type：/矿石/       //关键字查询呗
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

#### 联合判断

​		查询条件可以是多个, 这样的话,当多个条件都匹配的时候才会返回一个正确的结果

~~~js
gfs.find({
	$or:[
    	{
            name:"陈玉棋"
        }，
        {
            name:"萧燕燕"
        }
    ]，
     age:{$lt:20}
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

注意点：

**联合查询的时候，如果一个属性已经是$变量，其值不能再是$变量**

~~~js
$size:{
    $lt:3 //报错
}
~~~



### 查之projection

**对符合查询结果的数据中显示的字段进行控制**

当设置一个字段为true的时候，除了这个其他都不显示，id除外，除非手动设置id

当设置一个字段为false的时候，除了这个其他都显示

~~~js
gfs.find({
	$or:[
    	{
            name:"陈玉棋"
        }，
        {
            name:"萧燕燕"
        }
    ]，
     age:{$lt:20}
},{
    typelist:true
    
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

### 查之options

**这个是控制单次查询返回的数据的量或是其他的要求等等**

常用的一些基本属性:

1. skip: 跳过前n项
2. limit : 最多返回n条数据
3. sort: 将返回的数据里面的值的顺序进行排序

~~~js
gfs.find({
	$or:[
    	{
            name:"陈玉棋"
        }，
        {
            name:"萧燕燕"
        }
    ]，
     age:{$lt:20}
},{
    typelist:true
    
}，{
    skip:1, //跳过第一项
    limit:3， //最多返回三条
    sort：-1 //负值为倒序，正值为正序
}).then((data)=>{
    console.log("数据查询成功")
    consile.log(data)
}).catch((err)=>{
    throw err
})
~~~

###### 应用：（分页）

~~~
{
	skip:index+=limit,
	limit:3
}
~~~

## 改:

改就是更新表中现有条目的已经存储的数据

update updateOne updateMany  findByIdAndUpdate

~~~js
gfs.update( conditions, doc,[options,[callback]] ){
    conditions:查询条件
    doc: 要修改的内容
    options: 更新配置选项
    callback: 回调函数 或是使用promise, 会返回err或是data
}
~~~

###  改之update  (等同于updateOne)

~~~js
gfs.update({
    $where:function(){
        return this.num>30
    }
},{
    $set:{num:20}
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

返回的数据：

~~~js
更新成功
{n:1,nModified:1,ok:1}
~~~

n:改了几个数据

nModified:数据的值有变化的是几个

ok:更改是否成功

### 改之updateMany

updateMany方法会把查询到的所有数据进行更新

~~~js
gfs.updateMany({
    $where:function(){
        return this.num>30
    }
},{
    $set:{num:20}
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

返回的数据：

~~~js
更新成功
{n:2,nModified:2,ok:1}
~~~

### 改之更新数组

##### 数组增加项

###### 往数组增加一个值

~~~js
goods.updateMany({
    type:"矿石"
},{
    $push:{
        typelist:"新增未知矿物"
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

###### 数组添加新数据，存在则跳过

~~~js
goods.updateMany({
    type:"矿石"
},{
   $addToSet:{
        typelist:{$each:["高级矿山"，"中级矿石","普通矿石"]}  //删除第一项  1是删除最后一项
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~



##### 更新数组的某一项

###### 更新已知数组下标的某一项：

~~~js
goods.updateMany({
    type:"矿石"
},{
    $set:{
        "typelist.2":"钻石矿"
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

###### 更新未知数组下标的某一项：

~~~js
goods.updateMany({
    type:"矿石",
    typelist:{
        $elemMatch:{
            $in:"金矿石"
        }
    }
},{
    $set:{
        "typelist.$":"银矿石"
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

###### 更新对象

~~~js
goods.updateMany({
    "parent.father":"赵德明"
},{
    $set:{
        "parent.father":"隔壁老王"
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~



##### 删除数组数据

###### 删除第一项和最后一项数据

~~~js
goods.updateMany({
    type:"矿石"
},{
    $pop:{
        typelist:-1  //删除第一项  1是删除最后一项
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

###### 删除特定项目的数据

~~~js
goods.updateMany({
    type:"矿石"
},{
    $pull:{
        typelist:{
            $in:["银石"，"中级矿石"]
        }  //删除第一项  1是删除最后一项
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

#### 改之自增（$inc)

对于一些特殊的字段,比如数据**版本号**,每次操作都会要**更新**一下
$inc , 就是让某个字段的值自增

~~~js
goods.updateMany({
    "parent.father":"赵德明"
},{
    $set:{
        "parent.father":"隔壁老王1"
    },
    $inc:{
        _v:1  //自增一个1
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

#### 改之移除属性值($unset)

如果想要移除部分字段的值,**可以用$unset的属性**, 该属性的值为一个对象, 对象里的属性名即为需要移除的属性, 但是这个值可以随意设置,不影响结果

~~~js
goods.updateMany({
    "parent.father":"赵德明"
},{
    $unset:{
         _v:true,
        age:true
    }
}).then((data)=>{
    console.log("更新成功")
    console.log(data)
}).catch((err)=>{
    if(err) throw err
})
~~~

## 验证

### 验证之数字验证

们可以手动在表规则里面定义一个字段数值的上下限

~~~js
let gfsSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:Number,
        required:true,
        min:0,//定义值的下限，低于这个值就会报错
        max:[150."你输入的年纪太大了"]
        //定义值的上限，超出，提示 你输入的年纪太大了
    } 
})
~~~

### 验证之字符串验证

~~~js
let gfsSchema = new Schema({
    name:{
        type:String,
        required:true,
        enum:["万章","吴彦祖"，"金城武"] //该字段的值只允许出现这俩个
    },
    age:{
        type:Number,
        required:true,
        min:0,//定义值的下限，低于这个值就会报错
        max:[150."你输入的年纪太大了"]
        //定义值的上限，超出，提示 你输入的年纪太大了
    } 
})
~~~

### 验证之自定义验证

~~~js
let gfsSchema = new Schema({
    name:{
        type:String,
        required:true,
        valodate:{//自定义验证
            validator:function(value){
                return value==="万章"
            }
        }，
        message:"name的值出错了，不能输入这个值"
    },
    age:{
        type:Number,
        required:true,
        min:0,//定义值的下限，低于这个值就会报错
        max:[150."你输入的年纪太大了"]
        //定义值的上限，超出，提示 你输入的年纪太大了
    } 
})
~~~

1. validator函数的**value参数就是当前字段传入的值**
2. message:作为错误的提示信息
3. 如同是查询条件一般, 我们在验证的时候也是可以用自定义的函数来实现的
4. 注意返回的是一个布尔值, true则表示这个值可以使用,报错则是不可以使用

## 中间件/预处理

我们可以在对表进行数据处理之前, 先激活一个中间件, 来做一些预处理, 比如:

1. 在存储密码的时候首先进行加密
2. 在身份核实的时候对数据进行预加密

~~~js
bfsSchema.pre("save",function(next){
    //查询find
    console.log("存储前激发")
    next()
})
bfsSchema.post("save",function(doc){
    //查询find
    console.log("存储后激发")
    console.log(doc._id)
})
~~~

具体的监听事件很多, 逻辑都是一样的,:

https://mongoosejs.com/docs/middleware.html

## 表关联

表1：

~~~js
字段1：
{
    type:Schema.Types,//Schema.Types.ObjectId
     ref:"表2"
}
~~~

表2：

~~~js
字段1：
{
    type:Schema.Types,//Schema.Types.ObjectId
     ref:"表3"
}
~~~

表3：

~~~js
字段1：
{
    type:Schema.Types//Schema.Types.ObjectId
}
~~~

操作：

方法1(很笨)

~~~js
表1.find({}).then((data)=>{
    表2.find({}).then((data)=>{
        console.log("//...")
    })
})
~~~

方法2：

######  当关联条件并列时

~~~js
表1.find({}).populate("关联的字段").populate("关联的字段2").then((data)=>{
    console.log(data)
}).catch((err)=>{
    console.log(err.message)
})
~~~

当关联条件嵌套时(表1关联表2，表2关联表3，从1查3)

~~~js
表1.find({}).populate(
    {
        path:"关联的字段",
        populate:{
            path:"关联的字段2",
            populate:{
				 path:"关联的字段3",
            }
        }
}).then((data)=>{
    console.log(data)
}).catch((err)=>{
    console.log(err.message)
})
~~~

