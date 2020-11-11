# vue的方法和混入/自定义指令

## vue的全局/实例方法

### vue的全局方法之extend

#### Vue.extend( options )

使用基础 Vue 构造器，创建一个“子类”。

**参数是一个包含组件选项的对象。**

data 选项是特例，需要注意 - 在 Vue.extend() 中它必须是函数

html部分:

~~~html
<template id="haha">
    <h1>{{name}}</h1>
</template>
<div id="animated-number-demo">

</div>
~~~

js部分:

~~~js
// 创建了一个构造函数
let Ext = Vue.extend({
    template:"#haha",
    data(){
        return{
            name:'申杰'
        }
    }
})
//根据构造函数创建了一个实例,挂载到我们想要的组件之下
new Ext().$mount("#animated-number-demo1")
new Ext().$mount("#animated-number-demo2")
new Ext().$mount("#animated-number-demo3")
//另外一种写法:
//new Ext({el:"#animated-number-demo"})
//另另外一种写法:
//let component = new Ext().$mount()
//document.getElemntById("#app3").appendChild(component.$el)
~~~

### vue的实例方法之mount

#### vm.$mount( [elementOrSelector] )

如果 Vue 实例在实例化时没有收到 el 选项，则它处于“未挂载”状态，没有关联的 DOM 元素。

可以使用 vm.$mount() 手动地挂载一个未挂载的实例。

即:

~~~js
new ext().$mount("#animated-number-demo")
~~~

如果.$mount()没有参数,则:

~~~js
document.getElementById("animated-number-demo").appendChild(new ext().$mount().$el)
~~~

### vue的全局方法之nextTick

#### Vue.nextTick( [callback, context] )

在下次 DOM 更新循环结束之后执行延迟回调。在修改数据之后立即使用这个方法，获取更新后的 DOM。

~~~js
let vue = new Vue({
    el:"#animated-number-demo",
    data:{
        msg:'123'
    },
    template:`<p>{{msg}}</p>`
})
vue.msg="hello";//此时dom并没有更新数据
console.log(vue.$el.textContent===vue.msg);//false
console.log(vue.$el.textContent)
Vue.nextTick(function(){//此时才完成更新
   console.log(vue.$el.textContent===vue.msg);//true
    console.log(vue.$el.textContent)
})	
~~~

####  vm.$nextTick( [callback] )

**它跟全局方法 Vue.nextTick 一样，不同的是回调的 this 自动绑定到调用它的实例上。**

~~~js
let vue = new Vue({
    el:"#animated-number-demo",
    data:{
        msg:'123'
    },
    template:`<p>{{msg}}</p>`,
    methods:{
        exmaple(){
            this.msg='hello';
            console.log(this.$el.textContent);//123
            this.$nextTick(function(){
                console.log(this.$el.textContent);//hello
            });
        }
    }
})
~~~

总结：使用场景：

​		在Vue生命周期的**created()函数中进行DOM操作是要放在Vue.nextTick()回调函数中**。

​		原因就是created()在执行的时候DOM只是创建出来并没有渲染在页面上，因此页面上没有这个元素也就无法对其进行操作。

​		当页面进行某个操作后，部分DOM随数据的改变而改变，这个时候就应该将这个操作放在Vue.nextTick()的回调函数中执行。

mounted()函数执行时所有的DOM的创建，布局和渲染都已完成。

~~~js
let vue = new Vue({
    el:"#animated-number-demo",
    data:{
        msg:'123'
    },
    template:`<p >{{msg}}</p>`,
    created(){
        this.msg='hello';
        this.$nextTick(function(){
            this.$el.textContent=this.msg;//hello
        });
    }
})
~~~

所以：nextTick就是更新后的一个回调，底层用到了Promise异步处理

所以当nextTick不传任何参数的时候，他返回一个Promise的对象

~~~
Vue.nextTick().then(function(){
	//...
})
~~~



### vue的实例方法之destroy

#### vm.$destroy()

完全销毁一个实例。清理它与其它实例的连接，解绑它的全部指令及事件监听器。
触发 beforeDestroy 和 destroyed 的钩子。

### vue的全局方法之set

#### Vue.set( target, propertyName/index, value )

参数：

* {Object | Array} target

* {string | number} propertyName/index

* {any} value

  **向响应式对象中添加一个属性，**并确保这个新属性同样是响应式的，且触发视图更新。它必须用于向响应式对象上添加新属性，因为 Vue 无法探测普通的新增属性 (比如 this.myObject.newProperty = 'hi')

**注意对象不能是 Vue 实例，或者 Vue 实例的根数据对象。**

全局 Vue.set 的别名: vm.$set( target, propertyName/index, value )

### vue的全局方法之delete

#### Vue.delete( target, propertyName/index )

删除对象的属性。如果对象是响应式的，确保删除能触发更新视图。这个方法主要用于避开 Vue 不能检测到属性被删除的限制，但是你应该很少会使用它。

这是全局 Vue.delete 的别名。vm.$delete( target, propertyName/index )

## vue的混入

混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项( 比如可以单独把数据或是方法什么的单独变成一个混合对象 )。**当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。**

**因此可以做到"零件"的组合,哈哈哈**

~~~html
<template id="haha">
    <h1>{{name}}{{message}}</h1>
</template>
<div id="animated-number-demo">

</div>
~~~

~~~js
let mixData = {
    data(){
        return {
            name : '申杰'
        }
    }
}
let ext = Vue.extend({
    mixins:[mixData],
    template:"#haha",
    data(){
        return{
            message:'申杰'
        }
    }
})
new ext().$mount("#animated-number-demo");
~~~

#### vue混入的数据选项合并

当组件和混入对象含有同名选项时，这些选项将以恰当的方式进行“合并”。

比如，数据对象在内部会进行递归合并，并在发生冲突时以组件数据优先。

~~~js
let mixData = {
    data(){
        return {
            name : '申杰',
            msg:'hello world',
            data:a
        }
    }
}
let ext = Vue.extend({
    mixins:[mixData],
    template:"#haha",
    data(){
        return{
            message:'申杰',
             msg:'HELLO WORLD',
            data:b
        }
    }
})
new ext().$mount("#animated-number-demo");
~~~

上例的   msg:'HELLO WORLD' 覆盖  msg:'hello world'

data:b 覆盖   data:a 而非 data的那个对象,因为它底层是深度递归

#### vue混入的钩子函数选项合并

1. 同名钩子函数将合并为一个数组
2. 数组的每一项都是一个函数
3. 当钩子被触发之后, 数组里面的每个函数都会被依次执行
4. 混入对象的钩子先于组建自身的钩子执行(因为依次执行)

~~~js
let mixData = {
    created(){
        console.log("这是混入对象的钩子函数")
    }
}
let ext = Vue.extend({
    mixins:[mixData],
    created(){
        console.log("这是组件自身的钩子函数");
    }
})
new ext().$mount("#animated-number-demo");
~~~

#### vue混入的对象选项合并

值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象。

两个对象键名冲突时，取组件对象的键值对。

~~~js
let mixData = {
    methods:{
        foo(){
            console.log("这是混入对象的foo")
        }
    }

}
let ext = Vue.extend({
    mixins:[mixData],
    methods:{
        foo(){
            console.log("这是自身对象的foo")
        }
    }
})
let vm = new ext().$mount("#animated-number-demo");
~~~

#### vue的全局混入

混入也可以进行全局注册。使用时格外小心！一旦使用全局混入，**它将影响每一个之后创建的 Vue 实例。**使用恰当时，这可以用来为自定义选项注入处理逻辑。

**Vue.mixin( options )**

注:这里的options就相当于那个prototype一样，它可以对全局进行一个新的定义和修改，慎用！

~~~js

let v = Vue.mixin({
    created(){
        let s = this.$options.myOption;
        if(s){
           console.log(s);
        }
   
    }
})

let vue1 = new Vue({
    myOption:'这是一个自定义选项1'
})
//这个实例创建的时候会执行上面的代码一次 ，做一次打印
let vue2 = new Vue({
    myOption:'这是一个自定义选项2'
})
//这个实例创建的时候会再次执行上面的代码一次 ，再次做一次打印
~~~

## 自定义指令

### vue的全局自定义指令

除了核心功能默认内置的指令 (v-model , v-show等等)，Vue 也**允许注册自定义指令**

**Vue.directive( “eventName”, options)**

eventName:自定义的事件名

**options对象有如下几个钩子函数:均为可选:**

1. bind：只调用一次，。在这里可以进行一次性的初始化设置。指令第一次绑定到元素时调用
2. inserted：被绑定元素插入父节点时调用 (仅保证父节点存在，但不一定已被插入文档中)
3. update：所在组件的 VNode ( 抽象DOM )更新时调用，但是可能发生在其子 VNode 更新之前。指令的值可能发生了改变，也可能没有。但是你可以通过比较更新前后的值来忽略不必要的模板更新
4. componentUpdated：指令所在组件的 VNode 及其子 VNode 全部更新后调用。
5. unbind：只调用一次，指令与元素解绑时调用。

**上述五个钩子函数可以传入以下四个函数参数:**

1. **el**

   指令所绑定的元素,可以用来直接操作dom

2. binding:是一个对象,包含以下6个属性:

   1. **name**:指令名,不包含v-前缀
   2. **value:**指令的绑定至值,例如:v-my-directive="1+1"中,绑定值为2
   3. **oldValue**:指令绑定的前一个值,仅在update和componentUpdated钩子中可用,无论是值是否改变都可用
   4. **expression**:字符串形式的表达式.例如v-my-directive="1+1"中,表达式为"1+1"
   5. **arg:**传给指令的参数,可选,例如v-my-directive:foo中.参数为"foo"
   6. **modifiers:**一个包含修饰符的对象.例如:v-mydirective.foo.bar中,修饰符对象为{foo:true,bar:true}

3. vnode

   vue编译时生成的虚拟节点

4. oldVnode

   上一个虚拟节点,仅在update和componentUpdated钩子中可用

自定义简单示例:

~~~html
<body>
    <div id="animated-number-demo">

    </div>
    <script>
        Vue.directive('xxx',{//这是写options对象的地方
            inserted(el){ //这是指令钩子函数
                console.log("hello world")//当被插入时输出
            }
        })
        let m = Vue.extend({
            data(){
                return {
                    msg:'哈哈哈'
                }
            },
            template:`<div  v-xxx="msg">申杰</div>`
        })
        new m().$mount("#animated-number-demo");
    </script>
</body>
~~~

**上例子是全局自定义指令.**

**还可以定义局部自定义指令:**

~~~js
let m = Vue.extend({
    data(){
        return {
            msg:'哈哈哈'
        }
    },
    template:`<div  v-xxx="msg">申杰</div>`,
    directives:{
        xxx:{
            inserted(el){
                console.log("hello world")
            }
        }
    }
})
new m().$mount("#animated-number-demo");
~~~

注:

除了el之外,其他参数都应该是只读的**,切勿进行修改**,如果需要在钩子函数之间共享数据,建议通过元素的dataset来进行.

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
        <script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>

        <style>

        </style>

    </head>
    <body>

        <div id="animated-number-demo">

        </div>
        <script>
            let m = Vue.extend({
                data(){
                    return {
                        msg:'哈哈哈'
                    }
                },
                template:`<div  v-xxx="msg">申杰</div>`,
                directives:{
                    xxx:{
                        inserted(el,binding,vnode,oldNode){
                            console.log(el);
                            console.log(binding);
                            console.log(vnode);
                            console.log(oldNode);
                        }
                    }
                }
            })
            new m().$mount("#animated-number-demo");
        </script>
    </body>
</html>
~~~

可以打印在控制台看信息...

总结自定义指令:(玩呢)

全局的:

​	 Vue.direvtive里面俩个参数,第一个是指令名称,第二个是一个对象,对象里面有五个函数,每个函数的参数有4个,其中第二个参数又是一个对象,里面有4个属性

局部的:

​	directives:对应一个对象,其中有一个属性,是指令名,指令名对应一个对象,这个对象里面有5个函数,每个函数的参数有4个,其中第二个参数又是一个对象,里面有4个属性

#### vue的动态指令参数

指令的参数可以是动态的。例如，在 v-mydirective :[argument]="value" 中，argument 参数可以根据组件实例数据进行更新！这使得自定义指令可以在应用中被灵活使用。

~~~~js
let oldstyle;
Vue.directive('pos',{
    bind(el,binding,vnode,oldnode){
        el.style.position='absolute';
        el.style[binding.arg] = binding.value+'px';
        oldstyle = binding.arg;
        console.log("this is dir1");
    },
    componentUpdated(el,binding,vnode,oldnode){
        el.style.position='absolute';
        el.style[binding.arg] = binding.value+'px';
        el.style[oldstyle] = '';
        oldstyle = binding.arg;
        console.log("this is dir2");
    }
})

let vue = new Vue({
    el:"#animated-number-demo",
    template:`<button v-pos:[dir]="200" @click='clickfn'>hello world</button>`,
    data:{
        dir:'left'
    },
    methods:{
        clickfn(){
            this.dir==='left'?this.dir='right':this.dir='left'
        }
    }
})
~~~~

上面的 写法：值得理解记忆

#### vue的自定义指令的函数简写

想在 **bind 和 update 时触发相同行为**，而不关心其它的钩子的话可以这样写：

~~~js
let oldstyle='left',toggle=false;
Vue.directive('pos',function(el,binding){
    el.style.position='absolute';
    el.style[binding.arg] = binding.value+'px';
    if(toggle){//防止第一次的left被赋值之后立即被清理掉
        el.style[oldstyle] = '';
    }
    toggle= true;
    oldstyle = binding.arg;
    console.log("this is dir1");
})

let vue = new Vue({
    el:"#animated-number-demo",
    data:{
        dir:oldstyle
    },
    template:`<button v-pos:[dir]="200" @click='clickfn'>hello world</button>`,
    methods:{
        clickfn(){
            this.dir==='left'?this.dir='right':this.dir='left'
        }
    }
})
~~~

#### vue的自定义指令的对象字面量参数

上例的代码 v-pos传入的是一个200，其实可以传入一个对象，这样就可以传入多个值：即：

~~~js
template:`<button v-pos="{color:'white',text:'hello'}">hello world</button>`
~~~



