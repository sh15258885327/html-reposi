# vue组件进阶

## 组件注册

### 组件注册之组件名称要求

在注册一个组件的时候，我们始终需要给它一个名字。比如在全局注册的时候我们已经看到了：

~~~js
Vue.component('my-component-name', { /* ... */ })
~~~

该组件名就是 Vue.component 的第一个参数。

应用特定样式和约定的基础组件 (也就是展示类的、无逻辑的或无状态的组件) **应该全部以一个特定的前缀开头，比如 Base、App 或 V。**

它们的名字通常包含所包裹元素的名字 (**比如 BaseButton、BaseTable)**

好处:

1. 当你在编辑器中以字母顺序排序时，你的应用的**基础组件会全部列在一起**，这样更容易识别
2. 因为组件名应该始终是多个单词，所以这样做可以**避免你在包裹简单组件时随意选择前缀** (比如 MyButton、VueButton)

#### 定义组件名的俩种方式;

1. 使用 kebab-case( 烤肉串式 )

2. 使用 PascalCase ( 驼峰式 )

   注;直接在 DOM (即非字符串的模板) 中使用时**只有 kebab-case 是有效的。**

### 组件注册之全局注册

用 Vue.component 来创建组件是全局组件

它们在注册之后可以用在**任何新创建的 Vue 根实例 (new Vue) 的模板中**

~~~html
<div id="app">
			<component-a></component-a>
			<component-b></component-b>
			<component-c></component-c>
		</div>
		<script>
			Vue.component('component-a',{
				/*...*/
			})
			Vue.component('component-b',{
				/*...*/
			})
			Vue.component('component-c',{
				/*...*/
			})
			new Vue({el:'#app'});
		</script>
~~~

### 组件注册之局部注册

全局注册往往是不够理想的。

全局注册的所有的组件即便不再使用了，它仍然会被包含在你最终的构建结果中。这造成了用户下载的 JavaScript 的无谓的增加。

#### 局部组件定义方式

方式1;

~~~
let component-a = {
	template:'#test1'
}
let component-b = {
	template:'#test2'
}
~~~

方式2:

~~~js
let component-a = {
        name:'Home',
        component:{
        template:'#test1'
	}
}
let component-b = {
        name:'Home',
        component:{
        template:'#test2'
    }
}
new Vue({
    el:'#app',
    components:{
        'componenta':component-a.component,
        'componentb':component-b.component
    }
})
~~~

## 组件的属性

### 组件的属性Prop之属性名字的大小写

HTML 中的特性名是大小写不敏感的，所以浏**览器会把所有大写字符解释为小写字符**。这意味着当你使用 DOM 中的模板时，camelCase (驼峰命名法) 的 prop 名需要使用其等价的 kebab-case (短横线分隔命名) 命名：

### 组件的属性Prop之属性类型定义(类似于typescript的类型约束)

~~~
props: ['title', 'likes', 'isPublished', 'commentIds', 'author']
~~~

希望上述每个 prop 都有指定的值类型的话可以按下述方式写

~~~js
props:{
	title:String,
    likes:Object,
    ispublished:Boolean,
    commentIds:Array,
    author:Number,
    callback:Function,
    contactsPromise:Promise//构造函数类型
}
~~~

### 组件的属性Prop之传递静态或是动态Prop

#### 静态传值:

~~~
<div id="app">
<blog post-title="你好世界"></blog> 
</div>
<script>
Vue.component('blog',{
props:['postTitle'],
template:`<div>{{postTitle}}</div>`
})

let vm = new Vue({
el:'#app'
})

</script>
~~~

从上例的静态传值中:我们可以**总结到以下几点**:

1. 静态传递的值,传递到了一个叫做post-title的变量里面,这个变量可以被子组件 通过props接收使用
2. 它不是动态传值,所以,**不需要v-bind来绑定这个变量**
3. 在html里面不区分大小写,所以烤串式的命名会被传值的时候自动解析,,,即post-title---->postTitle

#### 动态传值:

~~~html
<div id="app">
<blog :post-title="title"></blog>
</div>
<script>
Vue.component('blog',{
props:['postTitle'],
template:`<div>{{postTitle}}</div>`
})

let vm = new Vue({
el:'#app',
data:{
title:"你好世界"
}
})

</script>
~~~

注:

~~~
<blog :post-title="title"></blog>
~~~

这里多了一个:号,它是绑定的简写,若不写,就成为了静态传值了

### 组件的属性Prop之数字/数组/布尔值传递

注;这样写会直接报错

~~~html
	<div id="app">
			<blog :post-title="你好"></blog>
		</div>
~~~

这样写才是字符串 ,**不带那对单引号是一个 JavaScript 表达式**

(即便 `14` 是静态的，我们仍然需要 `v-bind` 来告诉 vue)

~~~
<div id="app">
			<blog :post-title="'14'"></blog>
</div>
~~~

### 组件的属性Prop之对象的传递

#### 静态传值

~~~html
<div id="app">
    <blog :author="{name:'申杰',age:'25'}" :student="{name:'马梦雨',age:'20'}"></blog>
</div>
<script>
    Vue.component('blog',{
        props:['author','student'],
        template:`<h4>{{data}}</h4>`,
        computed:{
            data(a){
                return `${a.student.name}+${a.author.name}`
            }
        }
    })

    let vm = new Vue({
        el:'#app'
    })
~~~

总结如下:

1. 对象的静态传值和字符串的静态传值一样不同:,它也是和数字,布尔,数组一样,需要带有v-bind
2. 上述的data方法的参数a是代表的是props的数据,而其本身无法展示,需要通过"."的形式来调用具体哪个对象才不会报错

#### 动态传值:

~~~js
<div id="app">
    <blog :author="author"></blog>
</div>
<script>
        Vue.component('blog',{
        props:['author'],
        template:`<h4>{{data}}</h4>`,
        computed:{
            data(a){
                return `${a.author.name}`
            }
        }
    })

let vm = new Vue({
    el:'#app',
    data:{
        author:{
            name:'申杰',
            age:'25'
        }
    }
})

</script>
~~~

### 组件的属性Prop之对象的传递的注意点!!!

1. 我们直接传进来的数组或是对象啥的, 这个变量a并不是原始的值,而是一个包装了的对象, 真实的原始值是在a.author里面

~~~js
<div id="app">
    <blog :author="{name:'申杰',age:'25'}" :student="{name:'马梦雨',age:'20'}"></blog>
</div>
<script>
    Vue.component('blog',{
        props:['author','student'],
        template:`<h4>{{data}}</h4>`,
        computed:{
            data(a){
                return `${a.student.name}+${a.author.name}`
            }
        }
    })

    let vm = new Vue({
        el:'#app'
    })
~~~



2. 如果想要将一个对象的所有属性都作为 prop 传入，你可以使用不带参数的 v-bind (取代 v-bind:prop-name)

~~~html
<div id="app">
<blog :name="author.name" :age='author.age'></blog>
</div>

//注:props['name','age']接收
~~~

**等价于**

~~~html
<div id="app">
<blog v-bind='author'></blog>
</div>
//注:props['name','age']接收
~~~

### 组件的属性Prop之单向数据流

**父级 prop 的更新会向下流动到子组件中，但是反过来则不行。**

每次父级组件发生更新时，子组件中所有的 prop 都将会刷新为最新的值。这意味着**你不应该在一个子组件内部改变 prop**。如果你这样做了，Vue 会在浏览器的控制台中发出警告。

一般来说, 会改变Prop的场景有如下两种:

1. **把接收到的初始值最好更改成本地命名的属性**

   ~~~
   Vue.component('blog',{
   	props['name','company'], //接收到的初始值
   	data(){
   		return{//更改成本地的属性
   			localName:this.name,
   			localCompany:this.company
   		}
   	}
   })
   ~~~

2. **这个 prop 以一种原始的值传入且需要进行转换。在计算属性中来定义**

   ~~~js
   Vue.component('blog',{
   	props['name','company'], //接收到的初始值
       template:`{{changeName}}`,
   	computed:{
   		changeName():{//更改成本地的属性
   			let newName = this.name+'本地名字';
   			return newName
   		}
   	}
   })
   ~~~

   **注:这里是对子组件得到的数据进行加工,而不是改变数据**

   子组件不建议改变数据,在子组件中**改变这个对象或数组**本身将**会影响到父组件**的状态。

### 组件的属性Prop之Prop验证组件的属性Prop之Prop验证

为组件的 prop 指定验证要求

如果有一个需求没有被满足，

则 Vue 会在浏览器控制台中警告你

#### 组件的属性Prop之Prop验证细则

 **prop 会在一个组件实例创建之前进行验证**，所以实例的属性 (如 data、computed 等) 在 default 或 validator 函数中是不可用的。

1. type 可以是下列原生构造函数中的一个：
   1. String
   2. Number
   3. Boolean
   4. Date
   5. Object
   6. Symbol
   7. Array
   8. Function

2. type 还可以是一个自定义的构造函数，通过 instanceof 来进行检查确认来验证 author prop 的值是否是通过 new Person 创建的

   ~~~
   function Person(name,age){
   	this.name = name;
   	this.age = age
   }
   props:{
   	type;Preson//此时底层会通过instanceof 来检查实例是否通过Proson构造函数来创建得到的
   }
   ~~~

   

3. 除了type,还有required,default ,validator

   例:,validator

~~~
propF:{
	validator:function(value){
		return ['success','warning','danger'].indexOf(value)!==-1
	}
}
~~~

#### 组件的属性Prop之非 Prop 的特性

一个非prop特性是指传向一个组件,但是**该组件并没有相应prop定义的特性**

由于组件库的作者并不总能预见组件会被用于怎样的场景,所以组件可以接受任意的prop特性,这些prop特性会被添加到这个组件的根元素上

最常见的就vue项目和其他UI框架结合一起用,比如layui,elementUI等

例如:

父组件向子组件传值:

~~~html
<div id="app">
	    <blog  aaa='test'></blog>
</div>
~~~

~~~js
<script>
    Vue.component('blog',{
    //此处;并没有相应prop定义的aaa属性特性
    	template:`<h4>申杰</h4>`
	})

    let vm = new Vue({
        el:'#app',
        data:{
            test:'Hello World'
        }
    })
</script>
~~~

此时; aaa='test' 这条属性 会传到h4标签处,作为h4标签的属性

浏览器解析结果如下:

~~~
<div id="app">
	    <h4  aaa='test'>申杰</h4>
</div>
~~~

假如有

~~~
props:['aaa']
~~~

那么解析结果为:

~~~
<div id="app">
	    <h4>申杰</h4>
</div>
~~~

#### 组件的属性Prop之替换/合并已有的特性

从外部提供给组件的值会替换掉组件内部设置好的值。

例如:

(外部);

~~~
<div id="app">
	    <blog  type='hello' class="f1"></blog>
</div>
~~~

(内部):

~~~
<template>
	<h4 type="world" class="f2">申杰</h4>
</template>
~~~

此时浏览器解析为

~~~
<div id="app">
	    <h4 type='hello' class="f1 f2">申杰</h4>
</div>
~~~

**注;class 和 style 是个例外,它是合并属性的值(特性)**

#### 组件的属性Prop之禁用特性继承

如果我不希望向上边那样继承特性,我该怎么办?

**在子组件中定义;**

```
inheritAttrs: false
```

**注;这对class和style是不起作用的,他们依然可以合并**