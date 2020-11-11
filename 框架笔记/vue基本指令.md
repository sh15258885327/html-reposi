### V-model指令

**v-model指令用来在input、select、text、checkbox、radio等表单控件元素上创建双向数据绑定。**根据控件类型v-model自动选取正确的方法更新元素。尽管有点神奇，但是v-model不过是语法糖，在用户输入事件中更新数据，以及特别处理一些极端例子。
代码示例如下：

~~~
	<div id="app">			
			<textarea v-model="msg"></textarea>
			<p>{{msg}}</p>
		</div>
		<script>
			let vm = new Vue({
				el:'#app',
				data:{
					msg:"Hello World"
				}
			})
~~~

**v-model 会忽略所有表单元素的 value、checked、selected 特性的初始值而总是将 Vue 实例的数据作为数据来源。**你应该通过 JavaScript 在组件的 data 选项中声明初始值。

（道理很简单：因为我们是先加载html和css再加载js的，所以后者覆盖前者）

~~~
		<div id="app">			
			<input type="checkbox" v-model="toggle" checked="checked">
			{{toggle}}
		</div>
		<script>
			let vm = new Vue({
				el:'#app',
				data:{
					msg:"Hello World",
					toggle:'马梦雨'
				}
			})
//此处页面加载初始值是马梦雨，然后当点击复选框的时候，第一次是false，第二次是true，第三次是false，马梦雨只在第一次加载
~~~



v-model 在内部为不同的输入元素使用不同的属性并抛出不同的事件：

* **text 和 textarea 元素**使用 value 属性和 input 事件；

* **checkbox 和 radio** 使用 checked 属性和 change 事件；

  #### 复选框绑定指令：

  单个复选框，绑定到布尔值：

  多个复选框，绑定到同一个数组

  注：当v-model对应的属性写成数组形式，**以value值为准，**

  ​		当v-model写成对应的字符串形式，以checked值为准

  ~~~html
  <form id="app">			
      <input type="checkbox" v-model="toggle" name="1"  id="input1" value="马">
      <label for="input1">马</label>
      <input type="checkbox" v-model="toggle" name="1" value="梦" id="input2">
      <label for="input2">梦</label>
      <input type="checkbox" v-model="toggle" name="1" value="雨" id="input3">
      <label for="input3">雨</label>
      <input type="checkbox" v-model="toggle" name="1" value="妻" id="input4">
      <label for="input4">妻</label>
  </form>
  <script>
      let vm = new Vue({
          el:'#app',
          data:{
              msg:"Hello World",
              toggle:[]
          },
          watch:{
              toggle:function(value){
                  console.log(value)
              }
          }
      })
      //这里 复选框里如果写v-model=“toggle”的话，显示的是要么全选，要么全不选，怎么解决：
      方案1：把toggle对应的值改成如上：即 数组
      此时由于toggle是[]，所以当点击时，会往value里存储value属性对应的值// ["梦", "雨", "妻", "马", __ob__: Observer]
      但是假设在toggle上设置 false，此时是四个全选或者全不选的状态
      假设我给v-model=“toggle"改成v-model="toggle[0]",把toggle设置为[]，此时它会存储
      //[true, true, true, true, __ob__: Observer]
  ~~~

  #### 单选框指令：

  

  ~~~html
  <form id="app">			
      <input type="radio" v-model="toggle" name="1"  id="input1" value="马">
      <label for="input1">马</label>
      <input type="radio" v-model="toggle" name="1" value="梦" id="input2">
      <label for="input2">梦</label>
      <input type="radio" v-model="toggle" name="1" value="雨" id="input3">
      <label for="input3">雨</label>
      <input type="radio" v-model="toggle" name="1" value="妻" id="input4">
      <label for="input4">妻</label>
  </form>
  <script>
      let vm = new Vue({
          el:'#app',
          data:{
              msg:"Hello World",
              toggle:false//尽管此处我写了个false
          },
          watch:{
              toggle:function(value){
                  console.log(value)//这里依然输出的是对应的value值
              }
          }
      })
  </script>
  ~~~

  

* **select 字段**将 value 作为 prop 并将 change 作为事件。

  ~~~html
  <form id="app">	
      下面哪个是你的朋友
      <select v-model="friends">
          ：<option value=""></option>
          <option value="小明">小明</option>
          <option value="小刚">小刚</option>
          <option value="小红">小红</option>
          <option value="小兰">小兰</option>
      </select>
  </form>
  <script>
      let vm = new Vue({
          el:'#app',
          data:{
              msg:"Hello World",
              toggle:false,
              friends:"小兰"
          },
          watch:{
              friends:function(value){
                  console.log(value)
              }
          }
      })
  </script>
  ~~~

#### V-model指令详解之值绑定

~~~php+HTML
	<input type="checkbox" true-value="你好" false-value="你坏" v-model="toggle[0]" name="1">
			<input type="checkbox" true-value="你好" false-value="你坏" v-model="toggle[1]" name="1">
<--当checkbox为true时候，toggle数组存储true-value对应的值，当checkbox为false时候，toggle数组存储false-value对应的值<!-->//注：这里假设 toggle是数组形式的话


<input type="checkbox" true-value="你好" false-value="你坏" v-model="toggle" name="1">{{toggle}}
let vm = new Vue({
				el:'#app',
				data:{
					msg:"Hello World",
					toggle:"",
					friends:"小兰"
				}
})；
//此时toggle 直接 你好 你坏 之间切换 
~~~

#### V-model指令详解之修饰符

	##### 1. lazy

.lazy

​	在默认情况下，v-model 在每次 **input 事件触发后将输入框的值与数据进行同步** (除了上述输入法组合文字时)。你可以**添加 lazy 修饰符，从而转变为使用 change 事件进行同步**

即：

1. 普通模式,每输入一个字符,下面的内容就变化一次

2. lazy模式,input触发change事件才会激活数据同步

   ~~~
   <input type="text" v-model.lazy="msg" name="1">
   			{{msg}}
   ~~~

##### 2.number

将用户的输入值自动转为数值类型，可以给 v-model 添加 number 修饰符

~~~html
你的名字是：？<input type="text" v-model.number="msg" name="1">
{{msg}}
let vm = new Vue({
        el:'#app',
        data:{
        msg:"",
    }
})
~~~



这通常很有用，因为即使在 type="number" 时，HTML 输入元素的值也总会返回字符串。如果这个值无法被 parseFloat() 解析，则会返回原始的值。

3. trim

   如果要**自动过滤用户输入的首尾空白字符**，可以给 v-model 添加 trim 修饰符：

### V-bind

#### v-bind与img进行绑定

v-bind指令用于响应更新HTML特性，将一个或多个attribute，或者一个组件prop动态绑定到表达式。

~~~
<img id="app" v-bind:src="src" v-bind:alt="msg">
<!– 绑定属性 -->
简写形式：
<img id="app" :src="src" :alt="msg">
<!– 简写方式属性 -->
~~~

~~~html
<div id="app">
    <img  v-bind:src="img[0].src" v-bind:alt="img[0].alt">
    <img  v-bind:src="img[1].src" v-bind:alt="img[1].alt">
</div>

<script>
    let img = [{
        src:'./img/3.jpg',
        alt:'小女孩'
    },
               {
                   src:'./img/4.jpg',
                   alt:'小女孩',
               }
              ]
    let vm = new Vue({
        el:'#app',
        data:{
            img:[{
                src:'./img/1.jpg',
                alt:'小女孩'
            },
                 {
                     src:'./img/2.jpg',
                     alt:'小女孩',
                 }
                ]
        },
        watch:{
            img:function(value){
                this.img = value
            }
        }
    })
</script>
//此时 我们在控制台 输入 vm.img = img
就可以让图片达到切换的效果
~~~

#### v-bind与style和class进行绑定

我们可以传给 v-bind:class 一个对象，以动态地切换 class：

~~~html
<div v-bind:class="{ active: isActive }"></div>
~~~

上面的语法表示 active 这个 class **存在与否**将**取决于数据属性 isActive 的 布尔值**

~~~html
<style>
    .active{
        background-color: pink;
        font-size: 24px;
        color: aqua;
    }
</style>


<div id="app">
    <p v-bind:class="{active:isActive}">你是我的一瞥惊鸿</p>
</div>
let vm = new Vue({
    el:'#app',
    data:{
    isActive:false
    }
})
//此时active的样式不会显示
//但是当我们vm.isActive=true，样式就会显示啦
~~~

类属性写法：**大括号里写属性**

~~~html
<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8" />
        <title></title>
        <script src="js/vue.js" type="text/javascript" charset="utf-8"></script>
        <style>
            .active{
                border-radius: 50%;
            }
            .shadow{
                box-shadow:10px 10px 3px #ccc;
            }
        </style>
    </head>
    <body>
        <div id="app">
            <img v-bind:src="img[0].src" v-bind:alt="img[0].alt" v-bind:class="{active:isActive,shadow:setBoxShadow}">
        </div>

        <script>
            let img = [{
                src:'./img/3.jpg',
                alt:'小女孩'
            },
                       {
                           src:'./img/4.jpg',
                           alt:'小女孩',
                       }
                      ]
            let vm = new Vue({
                el:'#app',
                data:{
                    img:[{
                        src:'./img/1.jpg',
                        alt:'小女孩'
                    },
                         {
                             src:'./img/2.jpg',
                             alt:'小女孩',
                         }
                        ],
                    isActive:false,
                    setBoxShadow :false
                }

            })
        </script>
    </body>
</html>

~~~

这种写法可以改写成下述写法： **把大括号写到data里面去**

~~~js
<div id="app">
    <img v-bind:src="img[0].src" v-bind:alt="img[0].alt" v-bind:class="cssData">
        </div>

let vm = new Vue({
    el:'#app',
    data:{
        cssData:{
            active:true,
            shadow:true,
            size:true
        }
    }
});
~~~

上述写法也可以这样写：**中括号里写个 对象**（表达式）

~~~html
<style>
    .active{
        border-radius: 50%;
    }
    .shadow{
        box-shadow:10px 10px 3px #ccc;
    }
    .size{
        width: 100px;
        height: 100px;
    }
</style>


<div id="app">
    <img v-bind:src="img[0].src" v-bind:alt="img[0].alt" v-bind:class="['size',cssObject]">//cssObject是个表达式
</div>

<script>
    let img = [{
        src:'./img/3.jpg',
        alt:'小女孩'
    },
               {
                   src:'./img/4.jpg',
                   alt:'小女孩',
               }
              ]
    let vm = new Vue({
        el:'#app',
        data:{
            img:[{
                src:'./img/1.jpg',
                alt:'小女孩'
            },
                 {
                     src:'./img/2.jpg',
                     alt:'小女孩',
                 }
                ],
            cssData:{
                isActive:true,
                setBoxShadow:true
            }

        },
        computed:{
            cssObject:function(){
                return{
                    active:this.cssData.isActive,
                    shadow:this.cssData.setBoxShadow
                }
            }
        }

    })
</script>
~~~

把v-bind:class绑定为表达式：

~~~html
<div id="app">
    <img v-bind:src="img[0].src" v-bind:alt="img[0].alt" v-bind:class="[cssData.isActive ? 'size':cssObject]">//此处 在中括号里写表达式
</div>

<script>
    let img = [{
        src:'./img/3.jpg',
        alt:'小女孩'
    },
               {
                   src:'./img/4.jpg',
                   alt:'小女孩',
               }
              ]
    let vm = new Vue({
        el:'#app',
        data:{
            img:[{
                src:'./img/1.jpg',
                alt:'小女孩'
            },
                 {
                     src:'./img/2.jpg',
                     alt:'小女孩',
                 }
                ],
            cssData:{
                isActive:true,
                setBoxShadow:true
            },
            size:true

        },
        computed:{
            cssObject:function(){
                return{
                    active:this.cssData.isActive,
                    shadow:this.cssData.setBoxShadow
                }
            }
        }

    })
</script>
~~~

###### v-bind:style

v-bind:style 的对象语法十分直观——看着非常**像 CSS**，但其实是一个 JavaScript 对象。**CSS 属性名可以用驼峰式** (**camelCase**) 或**短横线分隔 (kebab-case，记得用引号括起来)** 来命名：

~~~html
<div id="app">
    <p v-bind:style="{fontSize:size+'px',color:cor}">马梦雨，你撞我心里啦</p>
</div>
<script>
    let vm = new Vue({
        el:"#app",
        data:{
            size:28,
            cor:'red'
        }
    })
~~~

改进：

​	**直接绑定到一个样式对象通常更好，这会让模板更清晰：**

~~~html
<div id="app">
    <p v-bind:style="styleCss">马梦雨，你撞我心里啦</p>
</div>
<script>
    let vm = new Vue({
        el:"#app",
        data:{
            styleCss:{
                fontSize:28+'px',
                color:'red'
            }

        }
    })
</script>
~~~

v-bind:style 的数组语法**可以将多个样式对象应用到同一个元素上**

~~~html
<div id="app">
    <p v-bind:style="[styleCss1,styleCss2]">马梦雨，你撞我心里啦</p>
</div>
<script>
    let vm = new Vue({
        el:"#app",
        data:{
            styleCss1:{
                fontSize:28+'px',
            },
            styleCss2:{
                color:'red'
            }

        }
    })
</script>
~~~

当 v-bind:style 使用需要添加浏览器引擎前缀的 CSS 属性时，如 transform，Vue.js 会自动侦测并添加相应的前缀。

