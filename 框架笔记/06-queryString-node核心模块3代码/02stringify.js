let querystring = require("querystring")

let str = querystring.stringify({name:"jianan",age:18})

console.log(str)

let str2 = querystring.stringify({name:"jianan",age:18}, "*", "$")

console.log(str2)
