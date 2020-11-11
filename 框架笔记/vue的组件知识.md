# VUE的基本组件知识

## 组件模板的写法

1. 定义组件

   ~~~
   let son = {
   	template:"<p>Hello World</p>"
   	//	template:“#test”
   }
   ~~~

2. 挂载组件（son组件挂载到跟组件上）

   ~~~
   let vm = new Vue({
   	el:"#app",
   	components:{//存放组件的子组件
   		//son:son
   		son
   	}
   })
   ~~~

3. 使用组件 （组件变量化为了标签名）

   ~~~
   <son></son>
   ~~~

注意：定义组件有俩中写法：

1. 在html中：(推荐)

   **注：我们是不可以在一个组件内部的第一层设置多个同级别元素的**

   ~~~
   <template id="test">
   	<p>Hello World</p>
   </template>
   ~~~

2. 在js中（不推荐）：

   ~~~
   <javascript src="text/template.js ">
   	<p>Hello World</p>
   </javascript>
   ~~~

   

~~~html
		<!-- <javascript type="text/template" id="test">
			<p>Hello World js</p>
		</javascript>     不推荐，而且这种会多编译一次-->
		<template id="test2">
			<p>Hello World html</p>
		</template>
			<div id="app">
				<son></son>
			</div>
		<script>
			let son = {
				template:'#test2'
			}
			let vm = new Vue({
				el:"#app",
				data:{
				},
				components:{
					son
//假设：写成heaven:son,那么html使用标签时就是<heaven></heaven>
				}
			});
		</script>
~~~

## 父子组件传值

### 父组件向子组件传值：prop

例子：

~~~html
	<template id="test2">//这是子组件
			<ul>
				<li v-for="p in people">
					{{p.age}}的{{p.name}}
				</li>
			</ul>
		</template>
		
			<div id="app">//这是父组件
				<people v-bind:people='people'>//'people'是父组件向子组件传递的值</people>
				<people v-bind:people='people'></people>
				<people v-bind:people='people'>//这是在使用子组件</people>
			</div>
			
		<script>
/*
	这是一个全局组件，也是一个子组件
*/
	Vue.component('people',{
		props:['people'],//接收data里面的变量数据，，在这里做到了父组件向子组件传值
		template:"#test2"
				
	})
            
            /*
            	这是父组件
            */
			let vm = new Vue({
				el:"#app",
				data:{
					people:[//这是父组件的数据
						{
						name:'申杰',
						age:"18"
						},
						{
						name:'小马',
						age:"20"
						},
						{
						name:'小神',
						age:"22"
						},
						{
						name:'小雨',
						age:"18"
						}
					]
				}
			});
		</script>
~~~

上述一段代码可以这样简看：

~~~
Vue.component('people',{//在这里当作标签来使用
		props:['people'],//从父组件中拿到数据
		template:"#test2"//在这里使用这个数据
	})
~~~

props可以设置成数组,此时父组件传什么值都会接收

~~~
props:['people'，‘msg1','msg2']
~~~

props还可以设置成对象,此时可以设置一些条件来过滤着接收

~~~、
props:{
    msg1:{
    type:Number   //msg1必须是数字类型
    required:true // msg1必传
    validator(value){
    	return value>10
    },
    default:200 //默认值是200
    },
    msg2:{
    type:[String,Number] //msg2 必须是字符串或者是数字
    
}
~~~

### 子组件向父组件传值

首先父组件要自定义一个事件

然后子组件再向父组件发射这一个事件

#### 具体过程

~~~
	<template id="test">
			<button @click="handleClick">点击</button>	
	</template>
	<div id="app">
		<son @xxx='xxx'></son>
	</div>
	<script>
		let son = {
			template:'#test',
			data(){
				return {
					name:'我是子组件的数据'
				}
			},
			methods:{
				handleClick(){
					this.$emit('xxx',this.name)
				}
			}
		}
		let vm = new Vue({
			el:"#app",
			components:{
				son
			},
			methods:{
				xxx(value){
					window.console.log(`我是父组件，收到${value}`)
				}
			}
		})
	</script>
~~~

还可以改用 minxin来混入数据