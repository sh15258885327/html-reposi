const {JSDOM} = require("jsdom");
const fs = require("fs");
const request = require("request");
const queryString = require("querystring");
// const { resolve } = require("path");
// const { pathMatch } = require("tough-cookie");
const path = require("path")
const Event = require("events");
const { resolve } = require("path");
const { constants } = require("buffer");
let events = new Event();
let promises=[];
let small_title=[];
let imgSrclist=[];
request.get({
    url:"http://www.zhibopt.com/",
    method:"GET",
    "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
},(err,response,body)=>{
    let dom = new JSDOM(body);
    //获取首页的导航栏信息
    let smallTitles = dom.window.document.querySelectorAll("div.ShowNav>a")
    for(let a of smallTitles){
        small_title.push({title:a.title,curUrl:a.href})
    }
    //创造一个个promise数组来获取图片路径
    small_title.forEach((item)=>{
        console.log(item)
        promises.push(new Promise((resolve)=>{
            // let curImgSrcList = [];
            getImgSrc(resolve,item)
        }).then((data)=>{
            if(!fs.existsSync(`D:/downloads/${data}`)){
                fs.mkdirSync(`D:/downloads/${data}`)
            }
            // return data.curImgSrcList
        }))
    })
    Promise.all(promises).then(()=>{  
        imgSrclist.forEach((item)=>{
            //设置一个请求失败重复请求的次数
            let index = 0;
            function getSource(){
                request(item.src).on('error',(error)=>{
                    index++;
                    if(index<5){
                        if(error.code==="ETIMEDOUT"){
                            console.log("请求失败,尝试重新请求...")
                            getSource()
                        }
                    }else{
                        console.log("请求次数过多，已为你跳过该请求，并尝试下一个请求...")
                        index = 0
                    }
                   
                }).pipe(fs.createWriteStream(`D:/downloads/${item.title}/${item.name}`))
                console.log("请求成功")
            }
            getSource()
            
    })

/*.then((data)=>{
    data.forEach((item)=>{
        console.log(item)
        request(item.src).on('error',(error)=>{
        }).pipe(fs.createWriteStream(`D:/downloads/${item.title}/${item.name}`))
    })
})*/
})
})     
function  getImgSrc(resolve,item){
    request.get({
        url:`http://www.zhibopt.com/${item.curUrl}`,
        method:"GET",
        "User-Agent":"Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3770.100 Safari/537.36"
    },(err,response,body)=>{
        let dom = new JSDOM(body);
        let img = dom.window.document.querySelectorAll("div.imgc>a>img")
        img.forEach((it)=>{
            if(path.basename(it.src) !== 'notimg.gif')
            imgSrclist.push({
                src:it.src,
                name:path.basename(it.src),
                title:item.title
            })
        })
        let pos = dom.window.document.querySelector(".thisclass>a")
        let nextpos = dom.window.document.querySelector(".thisclass+li>a")
            if(pos!==null){
                if(nextpos===null||pos.text==="尾页"){
                    resolve(item.title)
                    return
                }else{
                    let obj = {curUrl:nextpos.href,title:item.title}
                    if(parseInt(path.basename(obj.curUrl).split("_")[1])<10){
                        getImgSrc(resolve,obj)
                    }else{
                        resolve(item.title)
                    }      
                }
            }else{
                resolve(item.title)
            }
       
    })
}