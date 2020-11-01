let root = document.querySelector("#app");
import "@babel/polyfill";
import {createHeader}  from "./header.js";
import {createMain}  from "./content.js";
import {createFooter}  from "./footer.js";
import {createImg} from "./createImg.js";
import {createSiderbar} from "./createSiderbar.js";
import img from "../images/1.png";
import "../font/iconfont.css";
import {createContent} from "./createContent";
require("../css/index.scss");
require("html-webpack-plugin");
root.append(img);
createHeader(root);
createMain(root);
createFooter(root);
createImg(root,img);
createSiderbar(root);
createContent(root);
if(module.hot){
    module.hot.accept("./createContent.js",()=>{
        createContent(root);
    })
}
let  a = 66;
new Promise(()=>{
    console.log("你好世界")
    console.log(a);
})
function getComponent(){
    return import('lodash').then(({default:_})=>{
        let ele = document.createElement('div')
        ele.innerText=_.join(['a','b','c'],'***');
        return ele
    })
}
getComponent().then((ele)=>{
    document.body.appendChild(ele)
})