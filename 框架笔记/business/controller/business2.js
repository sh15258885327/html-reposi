let hello = async function(ctx,next){
    ctx.body=`<h1>Hello world</h1>`;
}
module.exports={
    "GET /hello":hello
}