# vue的组件进阶

## 自定义事件

### 自定义事件之事件名称

不同于组件和 prop，**事件名不存在任何自动化的大小写转换**

触发的事件名**需要完全匹配**监听这个事件所用的名称。

所以:

如果**事件名称 有大写字母 会报错**

因此，我们推荐你始终使用 kebab-case 的事件名。

### 自定义组件的V-model

一个组件上的 **v-model 默认会利用名为 value 的 prop 和名为 input 的事件**，

但是像单选框、复选框等类型的输入控件可能会将 value 特性用于不同的目的。**model 选项可以用来避免这样的冲突：**

~~~html
<div id="app">
    <blog  v-model='lovingvue'></blog>
    {{lovingvue}}
</div>
<script>
    Vue.component('blog',{
        model:{//此处相当于对 lovingvue 解构赋值
            prop:'checked',
            event:'change'
        },
        props:{
            checked:Boolean
        },
        template:`<div><input type="checkbox" @change="$emit('change',$event.target.checked)" v-bind:checked="checked">
<p>{{checked}}</p> </div>`
    })

    let vm = new Vue({
        el:'#app',
        data:{
            lovingvue:null
        }
    })
</script>
~~~

这里的 lovingVue 的值将会传入这个名为 checked 的 prop。同时当 <base-checkbox> 触发一个 change 事件并附带一个新的值的时候，这个 lovingVue 的属性将会被更新**(解构赋值)**

### 自定义事件之将原生事件绑定到组件

我们可能想要**在一个组件的根元素上直接监听一个原生事件**。这时，你可以使用 **v-on 的 .native 修饰符**：

~~~html
<div id="app">
<test-listener @click.native="fn"></test-listener>
</div>
<script>
Vue.component('test-listener',{
template:`<div class="tem"><p>点击</p></div>`,
})

let vm = new Vue({
el:'#app',
methods:{
fn(){
console.log(111)
}
}
})
</script>
~~~

**上述我们点击根元素就会触发,现在我想只点击根元素里的某一个子元素才会触发该怎么做?**

Vue 提供了一个 **$listeners 属性**，它是一个对象，里面包含了作用在这个组件上的所有监听器

使用方式如下:

1. 去除组件标签里的属性变量的.native

   ~~~
    <test-listener @click="fn"></test-listener>//已去除.native
   ~~~

2. 在根组件下的一个子组件处写上  **$listeners 属性**

   (假设根组件是div,div下有一个button)

   ~~~
   	<button v-on="$listeners">
   ~~~

   此时这个button元素就获取了所有的监听事件,**它可以用来触发父组件对应的监听函数**

3. 同时,这个子组件还可以自行定义其他监听事件,监听事件的函数写在子组件的methods的对象中

   ~~~html
   template:`<div class="tem" ><button v-on="$listeners" @dblclick="myfn" @click="singleClick">点击</button></div>`
   methods:{
       myfn(){
           console.log(222)
       },
       singleClick(){
           console.log(333)
       }
   }
   ~~~


## 插槽

### 插槽的基本用法

情景一:

~~~html
<div id="app">
    <test-listener>

    </test-listener>
</div>
<script>
  Vue.component('test-listener',{
        template:`
        <div>
            <p>Hello World</p>
            <slot>思密达</slot>
            <p>Hello World</p>
         </div>`
    })
    let vm = new Vue({
        el:'#app'
    })
</script>
~~~

此时结果:

~~~
Hello World
思密达
Hello World
~~~

情景2:

~~~js
<div id="app">
    <test-listener>
    你好世界
</test-listener>
</div>
<script>
    Vue.component('test-listener',{
    template:`
        <div>
        <p>Hello World</p>
        <slot>思密达</slot>
        <p>Hello World</p>
        </div>`,
})

let vm = new Vue({
    el:'#app'
})
</script>
~~~

此时结果:

~~~
Hello World
你好世界
Hello World
~~~

总结:外部的嵌套内容会替换模板内的slot元素的内容

也就是说 <slot>思密达</slot> 里的思密达 是 后备内容

### 具名插槽

~~~html
<div id="app">
		   <test-listener>
			   <template v-slot:header></template>
			   你好2
			   <template v-slot:footer>你好3</template>
		   </test-listener>
</div>
~~~

上述代码在使用子组件的插槽时,需要给 template标签绑定v-slot:header(具体哪个插槽的名字)

~~~js
 Vue.component('test-listener',{
    	template:`
			<div>
				<header>
					<slot name='header'>11</slot>
				</header>
				<main>
					<slot>22</slot>
				</main>
				<footer>
					<slot name='footer'>333</slot>
				</footer>
			</div>
		`
	})
~~~

上述代码是给每个插槽命名 使用 name='footer 没有命名的那个是默认的插槽

### 作用域插槽

有时让插槽内容能够访问子组件中才有的数据是很有用的。

子组件里的插槽里的值 如何把值传递 到 父级作用域里?

方式1;(默认独占,把v-slot写在根组件处进行接收)

~~~html
<div id="app">
	<current v-slot="user">
		{{user.name}}
	</current>
</div>
~~~
**注:下面通过v-bind将插槽里面的值传到了上面的user里面:**

~~~js
Vue.component('test-listener',{
    data(){
        return{
            user:{
                name:'申杰',
                age:28
            }
        }
    },
    template:`
<div>
<main>
<slot v-bind='user'>22</slot>
</main>
</div>
`
})
~~~

如果把上面的

~~~
<slot v-bind='user'>22</slot>
~~~

改写成

~~~
<slot v-bind:xxx='user'>22</slot>
~~~

那么数据接收方应该改写成:

~~~
{{user.xxx.name}}
~~~

方式2; 把 v-slot写在template标签里接收,也就是改写成:(道理同上)

~~~html
<div id="app">
    <test-listener >
        <template v-slot='user'>{{user.name}}</template>
    </test-listener>
</div>
<!--假设v-bind:xxx 那么 上面就是 user.xxx.name-->
~~~

注:俩种使用默认插槽的方式不可混合写,否则会报错

所以:当出现多个插槽时,一定要使用具名插槽,而默认插槽采取方式二的方式

即:

~~~html
<div id="app">
    <test-listener >
        <template v-slot:default='user'>{{user.name}}</template>
        <template v-slot:foo="people">{{people.other.sex}}</template>
    </test-listener>
</div>
~~~



~~~js
Vue.component('test-listener',{
    data(){
        return{
            user:{
                name:'申杰',
                age:28
            },
            people:{
                sex:'男'
            }
        }
    },
    template:`
<div>
    <main>
        <slot v-bind='user'>22</slot>
    </main>
    <footer>
        <slot name='foo' v-bind:other='people'>这是一个具名插槽</slot>
    </footer>
</div>
`
})
~~~

### 具名插槽&&作用域插槽讲解中的总结;

~~~
<template v-slot:footer = 'bind-data'>{{bind-data.name}}</template>
~~~

* 这样就可得到下面slot 里v-bind传过来的数据

* 这个数据是是可以通过解构赋值的 方式进行重命名的

  ~~~
  <template v-slot:footer = '{bind-data:newname}'>{{newname.name}}</template>
  ~~~

* 属性可以绑定多个, 只需设置不同的bind即可

  还可以给解构赋值的变量设置默认值 ( 但是会发出警报 )

  ~~~html
  <template v-slot:foo="{a:people,b:user}">{{people.sex}}{{user.name}}</template>
  ~~~

  js代码如下:

  ~~~js
  template:`
  <div>
      <footer>
          <slot name='foo' v-bind:a='people' v-bind:b='user'>这是一个具名插槽</slot>
      </footer>
  </div>
  `
  ~~~

  ### 作用域插槽之具名插槽的缩写

  跟 v-on 和 v-bind 一样，v-slot 也有缩写，即把参数之前的所有内容 (v-slot:) 替换为**字符 #**。

  例如 v-slot:header 可以被重写为 #header

  然而，和其它指令一样，该缩写只在其有参数的时候才可用。默认的时候使用会发出警告

## 动态组件 & 异步组件

### 动态组件上使用keep-alive

使用了这个keep-alive标签之后，可以把原组件的状态缓存下来，有利于性能

例子；

html部分：

**在一个多标签的界面中使用 is 特性来切换不同的组件：**

~~~html
<div id="app">
    <button v-for="item of tab" @click="cur=item">{{item.name}}</button>
    <keep-alive>
        <component v-bind:is="cur.component"></component>
    </keep-alive>
</div>
~~~

js部分;

~~~js
let btn = [
    {
        name:'home',
        component:{
            template:'<div><input type="checkbox">这是一个主页</div>'
        }
    },
    {
        name:'news',
        component:{
            template:'<div><input type="checkbox">这是一个新闻</div>'
        }
    },
    {
        name:'img',
        component:{
            template:'<div><input type="checkbox">这是一个图片</div>'
        }
    }
]

let vm = new Vue({
    el:'#app',
    data:{
        tab:btn,
        cur:btn[0]
    }
})
~~~

当在这些组件之间切换的时候，我们有时会想**保持这些组件的状态，**

以避免反复重渲染导致的性能问题。

此时我们**使用<keep-alive>标签来包裹component的组件**

#### 异步组件

在大型应用中，我们可能需要将应用分割成小一些的代码块，并且只在需要的时候才从服务器加载一个模块。为了简化，Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。

~~~js
Vue.component('async-example',function(resolve,reject){
    setTimeout(()=>{
        resolve({
            template:'<div>I am async</div>'
        })
    },1000)
})
~~~

如你所见，这个工厂函数会收到一个 resolve 回调，这个回调函数会在你从服务器得到组件定义的时候被调用。你也可以调用 reject(reason) 来表示加载失败。这里的 setTimeout 是为了演示用的，如何获取组件取决于你自己

上面的异步工厂函数也可以返回如下对象：

~~~js
function asyncComponent(){
    return{
        //需要加载的组件，这里应该是一个Promise对象
        component：‘import('./vue/compoent.vue')',
        //异步组件加载时使用的组件
        loading :LoadingComponent,
        //加载失败时使用的组件
        error:ErrorComponent,
        //展示加载时组件的延时时间，默认是200（ms)
        delay：200，
        //如果提供了超时时间且组件加载也超时了。则使用加载失败时使用的组件，默认值是Infinity
        timeout:3000
    }
})
~~~

