let Koa = require("koa");
let app = new Koa();
let router = require("koa-router")();
let fs = require("fs");
let bodyParser = require("koa-bodyparser");


function controllers(router){
    //获取controller文件夹下的所有文件组成的一个数组
    let files = fs.readdirSync(__dirname+"\\"+"controller");
    //过掉掉其他文件只保留js文件
    let jsFiles = files.filter(file=>file.endsWith(".js"));
    //遍历js文件,调用路由参数执行业务代码
    for(let jsf of jsFiles){
        //引包,jsfUrl是我们当时暴露的对象
        let jsfUrl = require(`./controller/${jsf}`);
        checkRoute( router,jsfUrl)
    }
}
function  checkRoute( router,jsfUrl) {
    for(url in jsfUrl){
        if(url.startsWith("GET")){
            let path = url.substring(4);
            console.log(path)
            router.get(path,jsfUrl[url]);
        }else if(url.startsWith("POST")){
            let path = url.substring(5);
            console.log(path)
            router.post(path,jsfUrl[url]);
        }else return;
    }
}
controllers(router);
app.use(bodyParser());
app.use(router.routes());
app.listen(3000);