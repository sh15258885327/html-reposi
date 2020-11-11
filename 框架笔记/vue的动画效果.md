# vue的动画效果

## 单元素/组件的过渡

Vue 提供了 transition 的封装组件，在下列情形中，可以给任何元素和组件添加进入/离开过渡

1. 条件渲染 (使用 v-if)
2. 条件展示 (使用 v-show)
3. 动态组件
4. 组件根节点

当插入或删除包含在 transition 组件中的元素时，Vue 将会做以下处理

1. 自动嗅探目标元素是否应用了 CSS 过渡或动画，如果是，在恰当的时机添加/删除 CSS 类名。
2. 如果过渡组件提供了 JavaScript 钩子函数( 就是在一个生命周期的各个阶段给我们提供的操作切入口 )，这些钩子函数将在恰当的时机被调用
3. 如果没有找到 JavaScript 钩子并且也没有检测到 CSS 过渡/动画，DOM 操作 (插入/删除) 在下一帧中立即执行。(注意：此指浏览器逐帧动画机制，和 Vue 的 nextTick 概念不同)

html代码：

~~~html
<div id="app">
    <button @click="show=!show">点击</button>
    <transition>
        <p v-show='show'>Hello World</p>
    </transition>
</div>
~~~

js代码：

~~~js
let vm = new Vue({
    el:'#app',
    data:{ 
        show:false
    }
});
~~~

上例直接在css里设置过度样式是没效果的，想设置过度的动画效果需要借用vue设置的如下6个class设置

### 触发式动画

**在进入/离开的过渡中，会有 6 个 class 切换。**

<font color='red'>前三个是元素插入(可以理解为被渲染时)*********后三个是元素离开(可以理解为取消渲染时)</font>

* v-enter-active：

  定义进入过渡生效时的状态。**在整个进入过渡的阶段中应用**，

  在元素被插入之前生效，在过渡/动画完成之后移除。

  这个类可以被**用来定义进入过渡的过程时间，延迟和曲线函数。**

* v-enter：

  定义进入过渡的开始状态。

  在元素被插入之前生效，在**元素被插入之后的下一帧移除**。

* v-enter-to

  定义进入过渡的结束状态

  在元素**被插入之后下一帧生效** (与此同时 v-enter 被移除)，

  **在过渡/动画完成之后移除。**

* v-leave-active

  定义离开过渡生效时的状态，**在整个离开过渡的阶段中应用**

  在离开过渡被触发时立刻生效，在过渡/动画完成之后移除。

  这个类可以被用来**定义离开过渡的过程时间，延迟和曲线函数。**

* v-leave

  定义离开过渡的开始状态。

  **在离开过渡被触发时立刻生效，下一帧被移除**。

* v-leave-to: 

  定义离开过渡的结束状态。

  在离开**过渡被触发之后下一帧生效** (与此同时 v-leave 被删除)，

  **在过渡/动画完成之后移除。**

~~~css
.fade-enter-active,.fade-leave-active{
    transition: 2s;
}
.fade-enter{
    opacity: 0;
}
.fade-enter-to{
    opacity: 1;
    transform: translateX(50px);
}
.fade-leave{
    opacity: 1;
}
.fade-leave-to{
    opacity: 0;
    transform: translateX(50px);
}
~~~

注;这里的fade需要在

~~~html
<transition name='fade'></transition>
~~~

的name属性上注册才阔以

注:这里使用的是默认的贝塞尔曲线,其实可以在transition下面定义一个贝塞尔曲线的 

### 主动式动画

主动式动画比起触发式动画, 

**少了enter, enter-to ,leave, leave-to的定义.**

但是这个定义可以在关键帧动画里面进行定义

enter就是 0% 的帧, enter-to就是100%的帧

leave就是100%的帧, leave-to就是0%的帧(就是动画到过来)

~~~css
.fade-enter-active{
    animation: bounce 2s;
}
.fade-leave-active{
    animation: bounce 2s reverse;
}
@keyframes bounce{
    0%{
        transform: scale(0);
    }
    50%{
        transform: scale(1.5);
    }
    100%{
        transform: scale(1);
    }
}
p{
    width: 100px;
    height: 100px;
    background: pink;
}
~~~

### 单元素/组件的动画应用自定义过渡的类名

我们可以通过以下特性来自定义过渡类名：

1. enter-class
2. enter-to-class
3. enter-active-class
4. leave-class
5. leave-to-class
6. leave-active-class

**他们的优先级高于普通的类名**，

这对于 结合一起使用Vue 的过渡系统和其他第三方 CSS 动画库，

如 Animate.css 或是layui的CSS动画体系结合使用十分有用。

简单来说,原理和上面我们自己写的动画一毛一样, 就只是把自己做的动画代码改成别人的了

~~~
<link rel="stylesheet" href="./css/animate.css">
~~~

~~~html
transition name="fade">
<p v-show='show' enter-active-class="heartBeat" leave-active-class="bounceIn">Hello World</p>
</transition>
~~~

## 多元素过渡

**俩种没有动画效果的多元素过渡情况:**

1. ~~~html
   <transition name="fade">
       <p v-if='show' enter-active-class="heartBeat" leave-active-class="bounceIn">Hello World</p>
       <p v-if="show"enter-active-class="heartBeat" leave-active-class="bounceIn" >你好世界</p>
   </transition>
   ~~~

   这种方式只显示第一种,且会报错

2. ~~~html
   <transition name="fade">
       <p v-if='show' enter-active-class="heartBeat" leave-active-class="bounceIn">Hello World</p>
       <p v-else enter-active-class="heartBeat" leave-active-class="bounceIn" >你好世界</p>
   </transition>
   ~~~

   这种方式虽然显示俩种,也不报错,但是都不显示动画效果

**如何解决?**

给每个元素设置 一个 key 来让vue进行区分:

(假设一个是p元素,一个是div元素,那么就不需要设置key来区分)

~~~html
<transition name="fade">
    <p v-if='show' enter-active-class="heartBeat" leave-active-class="bounceIn" key="one">Hello World</p>
    <p v-else enter-active-class="heartBeat" leave-active-class="bounceIn" key="two">你好世界</p>
</transition>
~~~

在一些场景中，也可以通过给同一个元素的 key 特性设置不同的状态来代替 v-if 和 v-else，上面的例子可以重写为下面的示例, 效果是一样的：

~~~html
<transition name="fade">
    <p v-bind:key='show' enter-active-class="heartBeat" leave-active-class="bounceIn">{{show?'Hello World':'你好世界'}}</p>
</transition>
~~~

### 多元素的过渡状态重叠的解决方案

给transition标签添加一个mode 属性

~~~html
<transition name="fade" mode="in-out">
~~~

1. in-out：新元素先进行过渡，完成之后当前元素过渡离开
2. out-in：当前元素先进行过渡，完成之后新元素过渡进入

## 多组件过渡

多个组件的过渡简单很多 - 

我**们不需要使用 key 特性**。

相反，我们**只需要使用动态组件**：

例子:

html部分:

~~~html
<div id="app">
    <button @click="toggle">切换状态	</button>
    <transition name="fade" mode="in-out">
        <component v-bind:is="comp"></component>
    </transition>
</div>
~~~

js部分:

~~~js
let vm = new Vue({
    el:'#app',
    data:{ 
        comp:'v-a'
    },
    components:{
        'v-a':{
            template:'<p enter-active-class="heartBeat" leave-active-class="bounceIn">Hello World</p>'
        },
        'v-b':{
            template:'<p enter-active-class="heartBeat" leave-active-class="bounceIn">你好世界</p>'
        }
    },
    methods:{
        toggle(){
            return this.comp==='v-a'? this.comp='v-b':this.comp='v-a'
        }
    }
});
~~~

## 列表的过渡

#### 列表的排序过度

目前为止，关于过渡我们已经讲到：

1. 单个节点

2. 同一时间渲染多个节点中的一个

   

   **那么怎么同时渲染整个列表，比如使用 v-for ？**

   ​			在这种场景中，使用 <transition-group> 组件

* <transition-group>**本身可以解析成span标签**，但是可以添加tag属性来解析成其他标签
* **过渡模式不可用，**因为我们**不再相互切换特有的元素。**
* **内部元素** 总是需要 **提供唯一的 key 属性值**。
* CSS 过渡的类将会应用在内部的元素中，而不是这个组/容器本身

~~~html
<div id="animated-number-demo">
    <transition-group tag='ul' name='list'>
        <li v-for='(item,index) of arr' v-bind:key='item' class="load">{{index}}------{{item}}</li>
    </transition-group>
    <button @click='loadNum'>点击让它乱序起来</button>
</div>
~~~

~~~js
let vm = new Vue({
    el:'#animated-number-demo',
    data:{ 
        arr:[1,2,3,4,5,6,7,8,9]
    },
    methods:{
        loadNum(){
            return this.arr.sort(()=>{
                return Math.random()-0.5
            })
        }
    }

});
~~~

建议： 

​		使用 FLIP 过渡的元素不能设置为 display: inline 。作为替代方案，可**以设置为 display: inline-block 或者放置于 flex 中**

#### 列表的交错过度

**通过 data 属性与 JavaScript 通信 ，就可以实现列表的交错过渡**. 该动画效果核心的实现原理是利用生命周期的触发事件, 给元素设置不一样的动画延迟时间, 这个原理很是简单, 就是用到了一个动画库. 示例代码如下:

~~~html
<div id="animated-number-demo">
    <input v-model="input">
    <transition-group tag='ul' name='list' v-on:before-enter="beforeEnter" v-on:enter="enter" v-on:leave="leave">
        <li v-for='(item,index) of filterData':key='item.msg'  v-bind:data-index="index">{{item.msg}}</li>
    </transition-group>

</div>
~~~

~~~js
let vm = new Vue({
    el:'#animated-number-demo',
    data:{ 
        input:'',
        dataList:[
            {
                msg:'sahjh'
            },
            {
                msg:'ljklj'
            },
            {
                msg:'bdhqwg'
            },
            {
                msg:'dbqvcz'
            },
            {
                msg:'zacxqfdwuq'
            },
            {
                msg:'oppdq'
            }
        ]
    },
    computed:{
        filterData(){
            return this.dataList.filter(item=>{
                console.log(this.input);
                return item.msg.indexOf(this.input)!==-1
            })
        }
    },
    methods:{
        beforeEnter(el){//上面的before-enter会自动转译成beforeEnter，我们在这里是不可以写“-”的
            console.log(1);
            el.style.opacity=0;
            el.style.height=0;
        },
        enter(el,done){
            console.log(2);
            var  delay = el.dataset.index*150;
            setTimeout(function () {
                Velocity(
                    el,
                    { opacity: 1, height: '1.6em' },
                    { complete: done }
                )
            }, delay)
        },

        leave(el,done){
            console.log(3);
            var  delay = el.dataset.index*150;
            setTimeout(function () {
                Velocity(
                    el,
                    { opacity: 0, height: '0' },
                    { complete: done }
                )
            }, delay)
        }
    }
});
~~~

上述代码引入了一个js库：

~~~html
<script src="https://cdnjs.cloudflare.com/ajax/libs/velocity/1.2.3/velocity.min.js"></script>
~~~



## 数据的过渡

**比如1变成9  会有个数字增长变化的过程**

Vue 的过渡系统提供了非常多简单的方法设置进入、离开和列表的动效。那么对于数据元素本身的动效呢，比如：
**数字和运算**
颜色的显示
SVG 节点的位置
元素的大小和其他的属性
这些数据要么本身就以数值形式存储，要么可以转换为数值。有了这些数值后，我们就可以结合 Vue 的响应式和组件系统，使用第三方库来实现切换元素的过渡状态。

数据变动->

触发Vue的数据绑定系统,得到变化前后两个状态值->

触发动画库,将两个值变化的过程动画化( 原理就是定义某个步长, 延长数据的变化过程 )

###### html部分

~~~html
<script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/1.20.3/TweenMax.min.js"></script>
<div id="animated-number-demo">
		<input type="number" step='20' v-model.number="number">
		<p>{{animatedNumber}}</p>
</div>
~~~

js部分

~~~js
<script>
		let vm = new Vue({
			el:'#animated-number-demo',
			data:{ 
				number:0,
				tweenedNumber:0
			},
			computed:{
				animatedNumber:function(){
					return this.tweenedNumber.toFixed(0);
				}
			},
			watch:{
				number(newValue){
					
						TweenLite.to(this.$data,0.5,{tweenedNumber:newValue});
					
				}
			}
		});
</script>
~~~

