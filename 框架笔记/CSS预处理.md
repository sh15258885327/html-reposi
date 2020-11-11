#### CSS预处理
##### 一、什么是CSS预处理器？
CSS预处理器定义了一种新的语言，其基本思想是用一种专门的编程语言，为CSS增加一些编程的特性，将CSS作为目标生成文件，然后开发者就只要使用这种语言进行编码工作。

**优点：使用CSS预处理器语言，可以让我们的CSS代码更加简洁、适应性更强、可读性更佳、更易于维护等诸多好处。**

目前比较优秀的CSS预处理器语言有Less、Sass(Scss)、Stylus。这里我们学习Less和Sass。

Less和Sass包含了一套自定义的语法及一个解释器，用户根据这些语言定义自己的样式规则，这些规则会通过解析器，编译生成对应的CSS文件，只有在被编译后才能够被浏览器识别使用。编译Less、Sass的方法有很多，比如通过命令行编译、编辑器编译、在线编译、第三方工具等。这里我们来介绍一款比较古老的工具--(Koala)考拉。

##### 二、软件使用
1. 软件介绍
Koala官网下载地址：[http://koala-app.com/index-zh.html]
koala是一个前端预处理器语言图形编译工具，他可以跨平台运行，完美兼容windows、linux、mac。
2. 操作步骤

##### 三、Less语法学习
less学习网址[https://less.bootcss.com/]
- 1.注释
less有两种注释风格。
标准的CSS注释/* code */，会保留到编译后的文件。
单行注释 // code，只保留在less源文件中，编译后被省略。
- 2.import导入样式
引入.css文件  同于css的import命令
```css
@import 'reset.css'
```
编译后：
```css
@import reset.css
```
.css后缀名不能省略  引入.less文件可以省略扩展名
```css
@import 'reset'
```
编译后：导入的文件会与当前的文件内容合并
- 3.变量

Less允许开发者自定义变量，变量可以在全局样式中使用，变量使得样式修改起来更加简单。
(1)变量以@开头，变量名与变量值之间用**冒号**分割
```less
@width: '20px'
#header {
    width: @width;
}
```
(2)变量嵌套在字符串时，必须写在@{}之中
```less
@side: left;
.round {
    border-@{side}-radius: 5px;
}
```
- 4.嵌套
(1)选择器嵌套
```less
p {
    font-size: 20px;
    a {
        text-decoration: none;
        &:hover { border-width: 1px }
        // 在嵌套在代码块内，可以使用&引用父元素。
    }
}
```
- 5.混合
混合可以将一个定义好的class A 轻松的引入到另一个 class B中，从而实现 class B 继承 classA中所有的属性。
5.1混合之继承类
```less
.border {
    border: 1px dotted yellow;
}
.main {
    color: #fff;
    .border;
}
```
5.2混合参数没有设置默认值，此时调用必须传入参数
```less
// 1.定义
.top (@top) {
    top: @top;
}
// 2.调用
#main {
    .top(30px);
}
```
5.3混合参数并且设置了默认值，调用时可以不用传入参数。
```less
// 1.定义
.top (@top: 25px) {
    top: @top;
}
// 2.调用时不传参数，则使用默认值25px
#main {
    .top;
}
// 3.若调用时传入参数，则使用传入的值。
#cont {
    .top(50px);
}
```
5.4混合参数中使用@arguments来引用所有传入的变量
```less
// 1.定义
.box-shadow (@x: 0,@y :0,@blur: 1px, @color: #000) {
    box-shadow: @arguments;
    -moz-box-shadow: @arguments;
    -webkit-box-shadow: @arguments;
}
// 2.调用
div {
    .box-shadow (10px, 5px)
}
```
- 6.继承：extend伪类来实现样式的继承使用
混合已经可以实现很简单的继承了，为什么还要使用extend来实现继承呢。这是因为混合实现继承的原理是把代码copy一份过来。编译后的css代码中会有大量的冗余代码，而extend则能很好的避免这一点问题。
```less
.public {
    background: yellow;
}
li {
    &:extend(.public);
    list-style: none;
}
// 等同于
li:extend(.public) {
    list-style: none;
}
```
上面代码编译后的css结果是
```css
.public, li {
    background: yellow;
}
li {
    list-style: none;
}
```
- 7.运算
任何的数字、颜色或者变量都可以参与运算，运算应该被包裹在括号中,以()进行优先级计算。
```less
.width {
    width: (200px - 30)*2;
}
// 编译后
.width {
    width: 340px;
}
```
##### 四、Sass语法学习
- 1.注释:Sass跟Less的注释语法一样
- 2.Sass引入用@import url(reset.css)
sass学习网址：[https://www.sass.hk/docs/]

##### 五、自己写的代码

~~~less
@import 'reset.css';
@width:200px;
@green:green;
@pink:pink;
@thetop:top;
.box-shadow(@x:0,@y:0,@blur:1px,@color:#000){
    box-shadow: @arguments;
};
*{
    padding: 0;
    margin: 0;
}
/*
   1. /*的注释可以被编译
    //的不会被编译

*/
.public{
    background-color: yellow;
}
.main{
    width: @width;//2可以使用变量
    h1{
        font-size: 20px;
        color: @green;
    }
    p{//3.嵌套
        margin-@{thetop}:200px*0.1;//4.可以进行计算5.变量嵌套在字符串中
        color: @pink;
    }
}
.two{
    &:extend(.main);//可以直接使用上面的样式,混合
    .box-shadow(3px,4px,5px,#ccc);
    p{//使用继承来去除代码的大量冗余
        .public
    }
}
~~~

注:echarts待学习