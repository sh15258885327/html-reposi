
const request = require("request"),fs = require("fs"),jsdom = require("jsdom"),path = require("path"),queryString = require("querystring");
// const {JSDOM} = jsdom

console.log(2)
new Promise((resolve,rejects)=>{
    let imgLi = [];
    let stream = request({
        method:"GET",
        url:"http://www.zhibopt.com/",
        headers:{
            "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
        }
    },(err,response,body)=>{
        let dom = new jsdom.JSDOM(body)
        let imgList = dom.window.document.querySelectorAll("li>a>img")
        imgList.forEach((item,index)=>{
            console.log(item.src)
            imgLi.push(item)
            resolve({stream,imgLi})
        })
    })
}).then((obj)=>{
    obj.imgLi.forEach((item,index)=>{
        request(item.src).pipe(fs.createWriteStream('D:/downloads/'+index+path.basename(item.src)))
        console.log("爬取成功")

    })
})

