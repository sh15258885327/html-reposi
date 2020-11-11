# vue的基本逻辑

## 基本的设计模式

### 基本的设计模式之MVC模式

MVC是目前应用最广泛的软件架构之一, 一般MVC是指: Model(模型), Controller(控制器), View(视图),这主要是基于分层的目的. 

View一般都是通过Controller来和Model进行联系的。Controller是Model和View的协调者，View和Model不直接联系。基本联系都是单向

### 基本的设计模式之MVP模式

MVP是从经典的MVC模式演变而来的

在MVP中，Presenter完全把View和Model进行了分离，主要的程序逻辑在Presenter里实现

而且，Presenter与具体的View是没有直接关联的，而是通过定义好的接口进行交互，从而使得在变更View的时候可以保持Presenter不变。

### 基本的设计模式之MVVM模式

相比前面两种模式，MVVM只是把MVC的Controller和MVP的Presenter改成了ViewModel。

View的变化会自动更新到ViewModel , ViewModel的变化也会自动同步到View上显示。这种自动同步是因为ViewModel中的属性实现了Observer( 观察者模式 )，当属性变更时都能触发对应的操作. 

## 什么是Vue

**某种意义上来讲,  Vue.js不是一个框架-**

只聚焦视图层，是一个构建数据驱动的web界面的库(当然, 按照目前的发展来看,vue有完善的生态圈, 早可以成为框架)。Vue.js通过简单的API提供高效的数据绑定和灵活的组件系统. Vue内置的额外方法库较少, 比如Router, ajax,表单验证等等一些额外的功能得由我们自行引入

### Vue的一些基本特性

1. 轻量化: 生产环境的Vue可以做到才30多KB, 这个代码量非常之小, 是jQuery生产版本体量的几分之一
2. 数据绑定: 非常方便的讲js控制的数据与页面内容进行绑定, 省去了我们大量的同步设置环节
3. 指令: 我们可以通过内置指令**v-* 和一些自定义的指令**来实现我们要实现的业务功能
4. 方便拓展: 虽说我们vue内置的方法不多，但是可以很方便的去引入一些其他的组件库

### Vue的使用

1. 直接引入vue.js的框架源码

2. 安装vue的开发工具, 在谷歌商店安装( 需要翻墙哦 )

### vue的实例创造

~~~js
let vue = new Vue({
    el:"#app",
	data:{
		msg:"你好"
	},
	computed:{
		cmmsg:function(){
			
		},
		/*name: {
           	get:function(){
                return this.msg
            },
            set:function(value){
                this,msg = value
            }
        }这对set和get方法是模拟data里面数据的赋值操作*/
	},
	watch:{
		msg:function(){//这里监听的是data里的msg,当data里的msg发生变化时就会触发这个函数
		}
	}
});
~~~

### Vue的插值

文本插值是最基本的形式，使用双大括号{{}}（类似于Mustache，所以本文中称作Mustache标签）

~~~
<div id="app">
	{{msg}}
</div>
	
~~~

#### vue的表达式插值

Mustache标签也接受表达式形式的值，表达式可由JavaScript表达式构成**。表达式是各种数值、变量、运算符的综合体。**简单的表达式可以是常量或者变量名称。表达式的值是其运算结果：
**js**表达式
{{  msg/100 }}  //在原始值上除以100
{{true?1:0}}//值为真,则渲染出1,否则渲染出0
{{ msg.split(“ , ”) }} //把值对应的字符串进行处理//也就是说立即执行函数也是可行的
无效示例
{{ var a = 1 }}  // **这是一条语句**, 不是表达式
{{ if (ok) { return message } }} //**控制流程的代码也是没有用的**

### Vue**的计算属性**

模板内的表达式非常便利，但是设计它们的初衷是用于简单运算的。在模板中放入太多的逻辑会让模板过重且难以维护

~~~js
computed:{
    cmmsg:function(){
        console.log(this.msg)//刷新一瞬间就会执行一次(假如data里面有这个属性的话)
    }
~~~

在这个地方，模板不再是简单的声明式逻辑。你必须看一段时间才能意识到，这里是想要显示变量msg的翻转字符串。当你想要在模板中多次引用此处的翻转字符串时，就会更加难以处理。
所以针对这样的复杂的处理逻辑, 我们引入了计算属性这一技术来实现

####  Vue的计算属性的setter

计算属性默认只有 getter(只能读取不能设置) ，**不过在需要时你也可以提供一个 setter ：**

~~~js
computed:{
    name:{	//此时name相当于vue实例的一个属性
        get:function(){
            console.log("get执行啦")
            return "申杰"
        },
            set:function(value){
                console.log("set执行啦")
                this.text = value
            }
    }
    此时 vm.name//get执行啦 申杰
    vm.name="申杰"//set执行啦
}
~~~

### vue的方法

我们可以将同一函数定义为一个方法而不是一个计算属性。两种方式的最终结果确实是完全相同的。
然而，不同的是计**算属性是基于它们的响应式依赖进行缓存的。只在相关响应式依赖发生改变时**它们才会**重新求值**。这就意味着只要 msg 还没有发生改变，多次访问 reversedMsg 计算属性会立即返回之前的计算结果，而不必再次执行函数。
相比之下，调用方法将总会再次执行函数。

~~~js
let vm = new Vue({
    data:{
        msg:"大帅比"
    },
    computed:{
        reversedMsg:function(){
            return this.msg.split("").reverse().join("")
        }
    },
    method:{
        //此处的reversedMsg会覆盖上面的
        reversedMsg:function(){
            return this.msg.split("").reverse().join("")
        }
    }
})
~~~



### Vue的侦听属性

Vue 提供了一种更通用的方式来观察和响应 Vue 实例上的数据变动：**侦听属性。**

注意点:
**侦听某个属性的变化函数中不要对该属性本身进行修改操作**, 否则会陷入无限死循环,导致栈溢出

### vue的侦听器的应用

~~~js
watch:{
msg:function(){
console.log(this.msg);//当data里面的msg属性发生变化时,就会触发这个函数
}
},
~~~

## Vue的指令1

### Vue的基本指令

指令 (Directives) 是带有 v- 前缀的特殊特性。指令特性的值预期是**单个 JavaScript 表达式**
**指令的职责是，当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM**

### Vue的指令之v-once

上面有介绍过,如何将一个vue实例中的data对象中的数据渲染到dom元素中, 但是如果我们只想在网页加载时,**只渲染一次数据,** 后期即便是data中的数据变化了, 我们也不要再次进行渲染, 那么我们可以用v-once指令

~~~
	<input type="text" v-model="msg">
			<p v-once>{{msg}}</p> //此时此处的表达式只渲染一次
~~~

### Vue的指令之v-html  标签代码渲染

双大括号会将数据解释为普通文本，而非 HTML 代码。为了输出真正的 HTML，我们可以使用 v-html 指令

~~~
	<div id="app">			
			<input type="text" v-model="msg">
			<p v-once>{{msg}}</p>
			<div  v-html="elecode"></div>//此处的v-html会把'<p>你好</p>'渲染出来,,替换掉所有该div下的子节点
		</div>
	let vm = new Vue({
		el:'#app',
				data:{
					msg:'Hello World',
					text:"别气我",
					elecode:"<p>你好</p>"
				},
	})
~~~

### V-if指令

if指令可以完全根据表达式的值在DOM中生成或移除一个元素。如果v-if表达式赋值为false，那么对应的元素就会从DOM中移除；否则，对应元素的一个克隆将被重新插入DOM中。 记住, **这个是直接决定是否在网页进行渲染, 而不是元素是否显示**

~~~
		<div id="app">			
			<p v-if="toggle">{{msg}}</p>
			<input v-model="toggle">
		</div>
			let vm = new Vue({
				el:'#app',
				data:{
					msg:'Hello World',
					text:"别气我",
					elecode:"<p>你好</p>",
					toggle:false
				}
			})
~~~

### V-show指令

v-show指令是根据表达式的值来显示或者隐藏HTML元素。当v-show赋值为false时，元素将被隐藏。查看DOM时，会发现元素上多了一个内联样式style="display:none"。
代码示例如下：	

~~~
<p v-show="toggle">{{msg}}</p>
~~~

### V-if和V-show指令辨析

v-if是惰性的一一如果初始渲染时条件为假，则什么也不做，**在条件第一次变为真时才开始局部编译（编译会被缓存起来）。**

相比之下，v-show简单得多一一**元素始终被编译并保留，只是简单地基于切换。**

一般来说，v-if有更高的切换消耗，而v-show有更高的初始渲染消耗。

因此，如果需要**频繁地切换，则使用v-show**较好；如果在运行时**条件不大可能改变，则使用v-if**较好。

### V-else指令

顾名思义，v-else就是JavaScript中else的意思，**它必须跟着v-if**，充当else功能。代码示例如下：

~~~
	<p v-if="toggle">{{msg}}</p>
			<p v-else="toggle">{{text}}</p>
~~~

### V-else-if指令

v-else-if，顾名思义，充当 v-if 的“else-if 块”，可以连续使用：

~~~
<div id="app">			
			<p v-if="type==='A'">{{msg}}</p>
			<p v-else-if="type==='B'">{{text}}</p>
			<p v-else="type">{{toggle}}</p>
		</div>
~~~

注:由此可知  v-if="" ,里的""里面是一个表达式

### V-model指令

v-model指令用来在input、select、text、checkbox、radio等表单控件元素上创建双向数据绑定。根据控件类型v-mode1自动选取正确的方法更新元素。尽管有点神奇，但是v-model不过是语法糖，在用户输入事件中更新数据，以及特别处理一些极端例子。
代码示例如下：

