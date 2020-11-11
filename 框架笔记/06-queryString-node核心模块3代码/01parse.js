let querystring = require("querystring")

let url = querystring.parse("name=jianan&url=http://www.tanzhouedu.com/")

console.log(url)

let url2 = querystring.parse("name*jianan#url*http://www.tanzhouedu.com/#age*5", "#" ,"*", {maxKeys:2})

console.log(url2)