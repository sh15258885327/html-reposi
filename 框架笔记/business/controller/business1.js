let index = async function(ctx,next){
    ctx.body = `<form action="/login" method="post">
    <input type="text"name="username">
    <input type="text"name="password">
    <input type="submit" value="登录">
 </form>`;
}
let login = async function(ctx,next){
    let name = ctx.request.body.username;
    let password = ctx.request.body.password;
    if(name === "admin" && password ==="12345"){
        ctx.body=`hello ${name}`;
    }
}
module.exports={
    "GET /":index,
    "POST /login":login
}