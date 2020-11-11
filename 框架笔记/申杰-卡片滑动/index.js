const photoData=[
    {
        imgSrc:"images/1.jpg",
        text:"If two people are meant to be together, eventually they will find their way back."
    },
    {
        imgSrc:"images/2.jpg",
        text:"If two people are meant to be together, eventually they will find their way back."
    },
    {
        imgSrc:"images/3.jpg",
        text:"If two people are meant to be together, eventually they will find their way back."
    },
    {
        imgSrc:"images/4.jpg",
        text:"If two people are meant to be together, eventually they will find their way back."
    }
]
let renderArr = photoData.slice(0,3);
let otherArr = photoData.slice(3);

const screenWidth = window.innerWidth;
const screenHeight = window.innerHeight;
render(renderArr);
function render(listData){
    let area = document.createDocumentFragment();
    listData.forEach((item,index)=>{
        let x1=0,y1=0;
        let moveX=0;
        let moveY=0;
        let card = document.createElement("div");
        card.classList.add("card");
        card.classList.add("transion");
        card.classList.add("font");
        card.innerHTML = `<div class="photo">
        <img src=${item.imgSrc} class="card-img-top" alt="图片">
    </div>
        <div class="card-body"><p>${item.text}</p>
        </div>`
        card.addEventListener("touchstart",function(e){
            e.stopPropagation();
            x1 = e.changedTouches[0].clientX;
            y1 =  e.changedTouches[0].clientY;
            this.classList.toggle("transion");
        });
        card.addEventListener("touchmove",function(e){
            e.stopPropagation();
            let x2 = e.changedTouches[0].clientX;
            let y2 = e.changedTouches[0].clientY;
            moveX += x2-x1;
            moveY += y2-y1;
            card.style.transform = `translate(${moveX}px,${moveY}px)`;
            x1 = e.changedTouches[0].clientX;//注
            y1 = e.changedTouches[0].clientY;
        });
        card.addEventListener("touchend",function(e){
            this.classList.toggle("transion");
            e.stopPropagation();
            if(Math.abs(moveX)<=screenWidth/2){
                card.style.transform = `translate(${0}px,${0}px)`;
            }else{ 
                card.parentNode.innerHTML="";
                let a1 = otherArr.pop();
                    a2 = renderArr.shift();
                    renderArr.push(a1);
                    otherArr.unshift(a2); 
                    render(renderArr);            
            }
        });
        area.append(card);
    });
    document.querySelector("body").append(area);
}