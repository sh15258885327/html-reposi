
export function createContent(root){
    let ele = document.createElement("button");
    ele.innerHTML="新增元素";
    root.appendChild(ele);
    ele.onclick = function(){
        let p= document.createElement("p");
        p.innerHTML="新增的内容dqd";
        root.appendChild(p);
    }
}