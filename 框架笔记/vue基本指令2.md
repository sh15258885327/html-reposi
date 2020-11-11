### v-for指令

#### v-for指令遍历数组

v-for 指令需要使用 **item in items** 形式的特殊语法，其中 items 是源数据数组，而 item 则是被迭代的数组元素的别名。

~~~
	<ul id="app" >
				<li v-for="(item,index) in friends">
					{{index}}-->{{item.name}}
				</li>
			</ul>
		<script>
			let vm = new Vue({
				el:"#app",
				data:{
					friends:[
						{name:'小明',age:18},
						{name:'小红',age:22},
						{name:'小刚',age:15},
						{name:'小兰',age:17},
						{name:'小乞丐',age:20},
					]
				}
			})
		</script>
~~~

**注:**

* **in可以用 of 来代替**

* v-for 还支持一个可选的第二个参数，即当前项的索引。

  ~~~
  	<ul id="app" >
  				<li v-for="(item,index) of friends">
  					{{index}}-->{{item.name}}
  				</li>
  			</ul>
  ~~~


#### v-for指令遍历对象

* 第一个参数:value

* 第二个参数:key

* 第三个参数:index

~~~
		<ul id="app" >
				<li v-for="(value,key,index) of obj">
					{{index}}-->{{key}}-->{{value}}
				</li>
			</ul>
		<script>
			let vm = new Vue({
				el:"#app",
				data:{
					obj:{
						name:'马梦雨',
						age:"20",
						assign:'learn'
					}
				}
			})
		</script>
~~~

注:在遍历对象时，会按 Object.keys() 的结果遍历，但是不能保证它的结果在不同的 JavaScript 引擎下都一致。(对于出现的前后顺序不能完成保证一致)

#### V-for指令之对象更新状态

当 Vue 正在更新使用 v-for 渲染的元素列表时，它默认使用“就地更新”的策略。
如果数据项的顺序被改变，Vue 将**不会移动 DOM 元素来匹配数据项的顺序，而是就地更新每个元素**，并且确保它们在每个索引位置正确渲染。

注:直接对**数据对象**进行**新增操作**,**不会立即触发网页重新渲染**, 只有更改了某个值之后,才会进行渲染

那么怎么办可以做到响应式更新呢:

方法一:

~~~
Vue.set(vm.object, propertyName, value)
~~~

方法二:

~~~
vm.obj = Object.assign({},vm.obj,{srore:97})
~~~

#### V-for指令之数组更新检测

Vue 将被侦听的数组的变异方法进行了包裹，所以它们也将会触发视图更新。这些被包裹过的方法包括：

1. push()
2. pop()
3. shift()
4. unshift()
5. splice()
6. sort()
7. reverse()

你可以打开控制台，然后对前面例子的 items 数组尝试调用变异方法。

**注意:以上方法会改变vue实例里面的数组本身,这些方法也被成为变异方法**

**注:当我们直接对数据执行以下操作也是没啥意义的**
当你利用索引直接设置一个数组项时

~~~
当arr[index] = value时 没用
~~~

​	但是我们可以使用:

~~~
Vue.set(vm.items, indexOfItem, newValue)
在原数组长度只有4的情况下,我可以使用此方式设置第五项的值,并响应式更新
Vue.set(vm.dat,4,'申')
~~~

当你修改数组的长度时

~~~
当 arr.length = 5;时 没用
~~~



#### V-for指令之显示过滤/排序后的结果

有时，我们想要显示一个数组经过过滤或排序后的版本，而**不实际改变或重置原始数据**

栗子:**使用filter函数(数组的filter方法不改变原数组)**

~~~
<ul id="app" >
				<li v-for="(value,key) of marry">
					{{value.name}}
				</li>
			</ul>
		<script>
			let vm = new Vue({
				el:"#app",
				data:{
					obj:{
						name:'马梦雨',
						age:"20",
						assign:'learn'
					},
					arr:[
						{name:"宠儿",age:18},
						{name:"宝宝",age:2},
						{name:"老婆",age:28},
						{name:"妻子",age:22},
						{name:"爱妃",age:20},
					]
				},
				computed:{
					marry:function(){
						return this.arr.filter((item,index)=>{
							return item.age>=20
						})
					}
				}
			})
		</script>
~~~

#### V-for指令之值范围

**v-for 也可以接受整数。可以用来重复模板次数**

~~~
		<ul id="app" >
				<li v-for="n in 10">
					{{n}} hello world
				</li>
			</ul>
~~~

#### V-for指令之注意点

**不要在同一元素上使用 v-if 和 v-for**

**如果你的目的是有条件地跳过循环的执行，那么可以将 v-if 置于外层元素** 

v-for 的优先级比 v-if 高

它先循环,对于每一项,假若有一项不符合要求,那它就不会渲染

~~~
		<ul id="app" >
				<li v-for="item of dat" v-if="item">
					{{item}}//此时0 不会显示
				</li>
			</ul>
			let vm = new Vue({
				el:"#app",
				data:{
					dat:[1,2,3,0]
				}
				});
~~~

### V-on指令

#### V-on指令之代码绑定

* 可以用 v-on 指令监听 DOM 事件，并在触发时**运行一些 JavaScript 代码。**

~~~
		<div id="app">
				<button v-on:click="count+=1">点击</button>
				{{count}}
			</div>
~~~

* 然而许多事件处理逻辑会更为复杂，所以直接把 JavaScript 代码写在 v-on 指令中是不可行的。因此 **v-on 还可以接收一个需要调用的方法名称。**

~~~
	<div id="app">
				<button v-on:click="setCount">点击</button>
				{{count}}
			</div>
	let vm = new Vue({
				el:"#app",
				data:{
					count:0
				},
					methods:{
					setCount:function(){
						this.count>=4?this.count=0:this.count++;
					}
					
				}
	})
~~~

* 除了直接绑定到一个方法，也可以在内联 JavaScript 语句中调用方法：直接调用并且传参
* 有时也需要在内联语句处理器中访问原始的 DOM 事件。可以用特殊变量 $event 把它传入方法：

~~~html
<div id="app">
<button v-on:click="say('我是申杰',$event)">点击</button>
</div>

methods:{
	say:function(value,e){
		console.log(value,e.target)
	}					
}
//我是申杰 <button>​点击​</button>​
~~~

#### V-on指令之事件修饰符(点击事件)

在事件处理程序中

​		调用 event.preventDefault() 或 event.stopPropagation() 是非常常见的需求。

尽管我们可以在方法中轻松实现这点，

**但更好的方式是：**

方法只有纯粹的数据逻辑，而不是去处理 DOM 事件细节。

为了解决这个问题，

Vue.js 为 v-on 提供了事件修饰符。之前提过，修饰符是由点开头的指令后缀来表示的。

| .stop     //只有冒泡阶段才会触发,并且不再向上冒泡            |
| ------------------------------------------------------------ |
| .prevent  //阻止元素的默认行为                               |
| .capture //只有捕获阶段才会触发,上层有捕获的也会触发         |
| .self  //必须是元素自身才会触发                              |
| .once     //就只能点击一次,下次点击就没效果了                |
| .passive//这个属性就是BOM里面对事件监听的选项设置表示 listener 永远不会调用preventDefault() |

​	使用修饰符时，**顺序很重要；**

​		相应的代码会以同样的顺序产生。

​				因此，**用 v-on:click.prevent.self 会阻止所有的点击**，而 **v-on:click.self.prevent 只会阻止对元素自身的点击**。

~~~html
<div id="app">
    <div class="middle" @click.stop="green">
        <div class="small" @click.capture="blue">
            <div class="red" @click.capture="red"></div>
        </div>
    </div>
</div>
<script>
    let vm = new Vue({
        el:"#app",
        methods:{
            red:function(){
                alert("红色触发")
            },
            green:function(){
                alert("绿色触发")
            },
            blue:function(){
                alert("蓝色触发")
            }
        }

    })
</script>
~~~



#### V-on指令之按键修饰符(按键事件)

在监听键盘事件时，我们经常需要检查详细的按键。

Vue 允许为 v-on 在监听键盘事件时添加按键修饰符

~~~
//只有在key是enter时才会调用vm.submit()
<input v-on:keyup.enter="submit">
~~~

你可以直接将 KeyboardEvent.key (https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key/Key_Values)暴露的任意有效按键名转换为 kebab-case 来作为修饰符。

常见的一些按键修饰符：

* .enter
* .tab
* .delete (捕获“删除”和“退格”键)
* .esc
* .space
* .up
* .down
* .left
* .right

还有一些属于更加底层的按键, 不同的操作系统实现的功能可能会有些差异, 这些按键被称为系统按键

* .ctrl

* .alt

* .shift

* .meta

* .exact 修饰符允许你控制由精确的系统修饰符组合触发的事件。

  注意：在 Mac 系统键盘上，meta 对应 command 键 (⌘)。在 Windows 系统键盘 meta 对应 Windows 徽标键 (⊞)。在 Sun 操作系统键盘上，meta 对应实心宝石键 (◆)。在其他特定键盘上，尤其在 MIT 和 Lisp 机器的键盘、以及其后继产品，比如 Knight 键盘、space-cadet 键盘，meta 被标记为“META”。在 Symbolics 键盘上，meta 被标记为“META”或者“Meta”。

**注:@符号是v-on:的缩写形式, 可以减少些代码量**

#### V-on指令之多事件绑定

​		V-on指令可以给单个元素绑定多个事件,**每个事件另起一个v-on指令即可**

### v-for的key值绑定

key值绑定: 在v-for循环后绑定      :key="item"

可以实现其子节点的dom随着item变化顺序而变化顺序

~~~html
<div id="app">
    <div  v-for="(item,index) of arr" :key="item">
        {{item}}--
        <input type="text">
    </div>
    <button v-on:click="solveFun">点击</button>
</div>
<script>
    let vm = new Vue({
        el:"#app",
        data:{
            arr:['金','木','水','火','土']
        },
        methods:{
            solveFun:function(){
                this.arr.sort(()=>{
                    return Math.random()-0.5;//这是数组实现乱序的实现方式
                });
            }
        }	
    });
</script>
~~~

