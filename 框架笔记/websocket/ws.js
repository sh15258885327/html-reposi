let webSocket = require("ws");
let wss = new webSocket.Server({port:8080});
wss.on("connection",function connection(ws){
    ws.on("message",function incoming(message){
        console.log("接收到的信息:"+message)
        if(message.includes("a")){
            ws.send("啊啊啊,雅蠛蝶")
        }else{
            ws.send("大人再玩会儿嘛");
        }
    })
});