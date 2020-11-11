#### 路由vue-router
官网地址:[https://router.vuejs.org/zh/]
##### 一、路由简介
这里的路由并不是指我们平时所说的硬件路由器，这里的路由就是SPA（single page application）的路径管理器。vue的单页面应用是基于路由和组件的，路由用于设定访问路径，并将路径和组件映射起来。

传统的页面应用，是用一些超链接来实现页面切换和跳转的。在vue-router单页面应用中，则是路径之间的切换，也就是组件的切换。路由模块的本质 就是建立起url和页面之间的映射关系。

至于我们为啥不能用a标签，这是因为用Vue做的都是单页应用（当你的项目准备打包时，运行npm run build时，就会生成dist文件夹，这里面只有静态资源和一个index.html页面），所以你写的标签是不起作用的，你必须使用vue-router来进行管理。

##### 二、实现原理
单页面应用(SPA)的核心之一是: 更新视图而不重新请求页面;
vue-router在实现单页面前端路由时，提供了两种方式：Hash模式和History模式；根据mode参数来决定采用哪一种方式。

###### 1、vue-router实现原理之hash模式
hash 模式的原理是 onhashchange 事件(监测hash值变化)，可以在 window 对象上监听这个事件。

vue-router 默认 hash 模式 —— 使用 URL 的 hash 来模拟一个完整的 URL，于是当 URL 改变时，页面不会重新加载。hash（#）是URL 的锚点，代表的是网页中的一个位置，单单改变#后的部分，浏览器只会滚动到相应位置，不会重新加载网页，也就是说hash 出现在 URL 中，但不会被包含在 http 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面；

###### 2、vue-router实现原理之history模式
由于hash模式会在url中自带#，如果不想要很丑的 hash，我们可以用路由的 history 模式，只需要在配置路由规则时，加入"mode: 'history’”

这种模式充分利用了html5 history中新增的 pushState() 和 replaceState() 方法。这两个方法应用于浏览器记录栈，在当前已有的 back、forward、go 基础之上，它们提供了对历史记录修改的功能。只是当它们执行修改时，虽然改变了当前的 URL ，但浏览器不会立即向后端发送请求。

##### 三、vue-router激活路由样式
给当前激活的菜单添加激活的样式
- 1. linkActiveClass
```js
let router = new Router({
    linkActiveClass:'custom-active-class'
})
```
- 2. linkExactActiveClass需要路由精确匹配才会添加到对应菜单上
```js
let router = new Router({
    linkExactActiveClass :'custom-exact-active-class'
})
```

##### 四、编程式导航
使用一个声明出来的固定元素来实现跳转局限性大，必须要有某个固定的触发元素, 为了实现更加柔性的跳转, 我们就引申出编程式的导航。
使用场景eg:在一个路由组件里面点击可以切换到另一个路由组件。
```js
// this.$router的基本方法
this.$router.push('目标路径') // 强制跳转至某一路径
this.$router.go(-1) //返回上一级
this.$router.replace('目标路径') // 路由替换
```
编程式导航代码示范:

html部分:

~~~js
<div id="app">
    <router-view></router-view>
</div>

<template id="temp1">
    <div>
    <button @click="sub">我是model1111</button>
</div>
</template>
<template id="temp2">
    <div>
    <button @click="sub">我是model222</button>
</div>
</template>
~~~

js部分:

~~~js
let child1 = {
    template:"#temp1",
    methods:{
        sub(){
            this.$router.push("/child2")
        }
    }
}
let child2 = {
    template:"#temp2",
    methods:{
        sub(){
            this.$router.push("/child1")
        }
    }
}
let router = new VueRouter({
    routes:[{
        path:"/child1",
        component:child1
    },
            {
                path:"/child2",
                component:child2
            }]
})
// let vm = Vue.extend({
// 	template:"#temp",
// 	router
// })
// new vm().$mount("#app")
let vm = new Vue({
    el:"#app",
    router
})
~~~

##### 六:vue-router代码示范:

###### vue-router的基本实现代码:

引入部分

~~~js
<script src="https://unpkg.com/vue-router/dist/vue-router.js"></script>
~~~

html部分

~~~html
		<div id="app">
			<p>
				<router-link to="/demo1">go demo1</router-link>
				<router-link to="/demo2">go demo2</router-link>
				<router-link to="/demo3">go demo3</router-link>
			</p>
			
			<router-view></router-view>
		</div>
~~~

​	js部分:

~~~js
let demo1 = {
    template:"<div>demo1adsasda</div>"
}
let demo2 = {
    template:"<div>demo2dasdad</div>"
}
let demo3 = {
    template:"<div>{{$route.params.id}}{{$route.params.user}}</div>"
}
let router = new VueRouter({
    routes:[
        {path:"/demo1",component:demo1},
        {path:"/demo2",component:demo2},
        {path:"/demo3/:id",component:demo3}
    ],
    linkActiveClass:"active"
})
let app = new Vue({
    el:"#app",
    router
})
~~~

###### vue-router的递归:

~~~js
let shandong={
    template:"<div>山东pro</div>"
}
let heze={
    template:"<div>菏泽pro</div>"
}
let henan={
    template:"<div>河南pro</div>"
}
let shangqiu={
    template:"<div>商丘pro</div>"
}
let xiayixian={
    template:"<div>夏邑pro</div>"
}
let beijing={
    template:"<div>北京pro</div>"
}
let zhaoyang ={
    template:"<div>朝阳pro</div>"
}
let MenuComponent={
    name:"MenuComponent",//这里必须写name啊啊啊啊啊啊
    template:"#menu-component",
    props:["menus"]
}
let router = new VueRouter({
    routes:[{
        path:"/shandong",component:shandong
    },{
        path:"/heze",component:heze
    },{
        path:"/henan",component:henan
    },{
        path:"/shangqiu",component:shangqiu
    },{
        path:"/xiayixian",component:xiayixian
    },{
        path:"/beijing",component:beijing
    },{
        path:"/zhaoyang",component:zhaoyang
    }]
})
let vue = new Vue({
    el:"#app",
    router,
    data:{
        menus:[{
            name:"山东省",
            path:"/shandong",
            child:[{
                name:"菏泽市",
                path:"/heze"		
            }]
        },{
            name:"河南省",
            path:"/henan",
            child:[{
                name:"商丘市",
                path:"/shangqiu",
                child:[{
                    name:"夏邑县",
                    path:"xiayixian"	
                }],	
            }]
        },
               {
                   name:"北京市",
                   path:"/beijing",
                   child:[{
                       name:"朝阳区",
                       path:"zhaoyang"
                   }]
               }
              ]
    },
    components:{
        MenuComponent
    }
})
~~~

html部分:

~~~html
<div id="app">
    <menu-component :menus="menus"></menu-component>
    <main>
        <router-view></router-view>
    </main>
</div>
<template id="menu-component">
    <ul>
        <li v-for="item in menus">
            <router-link :to="item.path">{{item.name}}</router-link>
            <menu-component  v-if="item.child" :menus="item.child"></menu-component>
        </li>
    </ul>
</template>
~~~

###### vue-router的嵌套

html部分:

~~~html
<div id="app">
    <router-view></router-view>
</div>
<template id="user">
    <div>
        user
        <router-view></router-view>
    </div>
</template>
<template id="demo">
    <div>
        demo
        <router-view></router-view>
    </div>
</template>
<template id="demochild">
    <div>demochild</div>
</template>
~~~

js部分:

~~~js
let user = {
    template:"#user"
}
let demo = {
    template:"#demo"
}
let demochild = {
    template:"#demochild"
}
let router = new VueRouter({
    routes:[
        {path:"/user",component:user,
         children:[{
             path:"/demo",component:demo,
             children:[{
                 path:"/demochild",component:demochild
             }]
         }]
        }
    ]
})
let vue = Vue.extend({
    router
})
new vue().$mount("#app");
~~~

