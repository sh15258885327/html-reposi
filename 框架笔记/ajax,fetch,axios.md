# ajax fetch axios

三者是前后端数据交互的应用,三者底层都是封装的xhr,但是最好用的是axios,因为它

## ajax

### 获取数据

~~~js
$.ajax({
    type: 'GET',
    url: 'http://jsonplaceholder.typicode.com/users',
    data: '',
    dataType: '',
    success: function(data) {
        console.log(data)
    },
    error: function() {}
})
~~~

增加数据

~~~js
// 2、post请求
$.ajax({
    type: 'POST',
    url: 'http://jsonplaceholder.typicode.com/users',
    data: {name: 'JN', username: "jianan", email: "1234565@qq.com"},
    dataType: 'json',
    success: function(data) {
        console.log(data)
    },
    error: function() {}
})
~~~

## fetch

~~~js
//简单示范:(获取数据)
let url = "http://jsonplaceholder.typicode.com/posts"

console.log(fetch(url))

fetch(url)
    .then(response => response.json()) //res是响应的信息
    .then(data => console.log(data)) //data是响应的数据
    .catch(err => console.log("出错了"))
~~~

#### fetch封装

~~~js
// promise是可以得知状态的，fecth是可以得到数据的，我们把二者结合使用，封装一下
class HTTP {
    get(url) {
        return new Promise((resolve, reject) => {
            fetch(url)
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    }

    post(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    }

    put(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "PUT",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => resolve(data))
                .catch(err => reject(err))
        })
    }

    delete(url, data) {
        return new Promise((resolve, reject) => {
            fetch(url, {
                method: "DELETE",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => resolve("数据删除成功"))
                .catch(err => reject(err))
        })
    }
}
~~~

#### fetch的使用:

~~~js
const http = new HTTP
var url = "http://jsonplaceholder.typicode.com/users"
// 1、请求数据
http.get(url)
    .then(data => {
    console.log(data)
})
    .catch(err => console.log(err))

// 2、提交数据
let data = {
    name: "hahaha",
    email: "qqqq@qq.com"
}
// http.post(url,data)
//     .then(data => console.log(data))
//     .catch(err => console.log(err))
// 3、修改数据
http.put(url + "/3",data)
    .then(data => console.log(data))
    .catch(err => console.log(err))
// 4、删除数据
http.delete(url + "/3",data)
    .then(data => console.log(data))
    .catch(err => console.log(err))       
~~~

## axios

axios的获取数据:

~~~js
axios.get("http://jsonplaceholder.typicode.com/posts/1")
    .then(res => {
    console.log(res)
    console.log(res.data)
})
    .catch(err => {
    console.log(err)
})
~~~

axios的添加数据:

~~~js
axios.post("http://jsonplaceholder.typicode.com/users", {
    name: 'JN',
    username: 'jianan',
    age: 16
})
    .then(res => {
    console.log(res)
})
    .catch(err => console.log(err))
~~~

axios修改数据:

~~~js

axios.put("http://jsonplaceholder.typicode.com/posts/1", {
    name: 'JN',
    username: 'jianan',
    age: 16
})
    .then(res => {
    console.log(res)
})
    .catch(err => console.log(err))
~~~

在post添加数据中,其实是可以修改数据的,因为它和put差不多,找到就改,找不到就新增