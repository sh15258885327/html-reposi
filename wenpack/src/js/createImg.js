export function createImg(root,url){
    let img = document.createElement("img");
    img.src = "bundle"+url;
    root.appendChild(img);
}