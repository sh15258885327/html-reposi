let querystring = require("querystring")

let str = querystring.escape("name=jianan")
let str2 = querystring.escape("name=佳楠")

console.log(str,str2)