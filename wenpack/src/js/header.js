 function createHeader(root){
    let header = document.createElement("h1");
    header.append("这是你的洗发");
    root.appendChild(header);
}
 function MM(){
    console.log(22)
}
export{
    createHeader,
    MM
}