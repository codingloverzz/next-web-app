## MVVM模型

![01](D:\自己的笔记\vue\images\01.png)

创建app的方式不一样：

```
<div id ="app"> </div>
const app = Vue.createApp({
	tempalte:''
}).mount('#app')
```

## tempalte属性

表示的是vue需要帮助我们渲染的模板信息，template里面的东西会替换掉挂载元素的innerHTML

### template写法1：

```
<script type = "x-template" id ="zhuzhu">
	<div> 写法1</div>
</script>
Vue.createApp({
	template: '#zhuzhu'
})
```

### template写法2：

```html
<template id="zhuzhu"> 
	<div> </div>
</template>
```

### 细节：

1. 当vue中template属性后面跟了以#开头的东西，内部会执行

  document.querySelector()来找到那个模板元素

2. html中 的template 里面的内容会被浏览器解析但是不会被渲染到浏览器上

## data属性

data属性是传入一个函数，并且该函数返回一个对象

在vue2.x中，也可以传入一个对象

在vue3.x中，必须传入一个函数，否则报错

**data中返回的对象会被Vue的响应式系统劫持，之后对该对象的访问或修改都会在劫持中被处理**

## methods属性

官方文档描述：

不应该使用箭头函数来定义methods函数，理由是箭头函数绑定了父级作用域的上下文，所以this将不会按照期望指向组件实例

**methods中，箭头函数的this指向了window**

# 基本指令：

## 不常见指令：

### v-once: 用于指定元素或组件只渲染一次

当数据发生变化时，**元素或组件以及其所以的子元素**将视为静态内容并且跳过

该指令可以用于性能优化

### v-text：

```vue
<h2 v-text="mes"></h2>
//等价于
<h2> {{mes}}</h2>
```

两种写法等价

### v-html:

默认情况下，vue不会对html的内容进行解析，如果希望被解析出来，加上这个

```
<h2 v-html="mes"></h2>

```

### v-pre:

用于跳过元素和它子节点的编译过程，显示原始的Mustache标签

### v-cloak：

跟css ： [v-cloak]{display:none} 一起用，用于隐藏为编译的mustache标签直到组件实例准备完毕

## v-bind:动态绑定属性

### 绑定class：

#### 对象语法：

```
<div class="abc bbc" :class="{active:flag}">我的嘿嘿哈哈</div>
```

可以将对象单独抽离出来，并且可以与普通class共存

#### 数组语法：

```vue
<div :class="['active','bbd'，isActive?"active":'']"></div>

```

数组中的类必须加引号，否则会解析成变量,还可以加三元运算符

也可以嵌套对象语法

### 绑定style:

#### 对象语法：

{CSS属性名：CSS属性值}

```
<div ：style="{color:'red', 'font-size': mySize}"></div>

```

注意:  对象中的键可以不用引号，但是如果使用短横线写法，就需要加上引号，用驼峰可以不加引号值若不加引号则代表是变量的意思

#### 数组语法：

```
<div :style="[color,size]">呵呵呵</div>

corlor:{
	color:"red"
}
size:{
	fontSize:"50px"
}
```

### 动态绑定属性名称

将属性名称放进 []中

```vue
<div :[name]="value">呵呵呵</div>
data(){
	return{
		name:'active',
		value:'zhuzhu'
}
}
```

### 绑定一个对象：（很重要）

将一个对象的所以属性，绑定到元素上的所以属性

```
<div v-bind="info">哈哈哈</div>
//最后生成结果是：<div name='zhuzhu' age='18',heigth='1.88'>哈哈哈</div>
data(){
	return{
		info:{
			name: 'zhuzhu',
			age: 18,
			heigth: 1.88
		}
	}
}


```

## v-on：

**可以绑定一个对象，用于绑定多个事件**

```php+HTML
<h2 v-on={click:handleClick,mousemove:mouseMove}>
```

事件函数若不写参数会默认传一个事件对象，若自己本身要传参，且需要拿到事件对象，则需要通过**$event**

### v-on的修饰符

.stop  调用event.stopPropagation()，阻止冒泡

![02](D:\自己的笔记\vue\images\02.png)

通过这样同时传递事件对象和参数

```
<button @click="click($event,5)">点我</button>
```



## 条件渲染

### v-if：

v-if是惰性的，当条件为false时，其判断的内容完全不会被渲染或者会被销毁

为true时才会真正渲染内容

#### Vue3中v-if的优先级比v-for更高

### template元素和v-if结合使用

```

      <template v-if="isShow">
        <div>哈哈哈</div>
        <div>哈哈哈</div>
      </template>
      <template v-else>
        <div>嘿嘿嘿</div>
        <div>嘿嘿嘿</div>
      </template>
```

用template比div的好处是，渲染时不会渲染出template，但会渲染出div

### v-show

不支持template，display：none

## 列表渲染

```
 <ul>
    <li v-for="value in info">{{value}}</li>
 </ul>
  info:{
        name: "zhuzhu",
        age: 18,
        heigth: 1.88
       }
```

遍历对象时，value拿到的是值

(value,   key，index) in info 

key是键，index是索引

也可以遍历数字

v-for="num in 50" 

### template与v-for一起使用

与v-if差不多，可以少渲染div

### 数组更新检测

vue将被侦听的数组的变更方法进行了包裹，以下方法将会触发视图更新：

- push()
- pop()
- shift()
- unshift()
- splice()
- sort()
- reverse()

以上方法会直接修改原数组，某些方法不会直接修改原数组，而是生成新的数组，例如filter（），concat（），slice（）

##### 若需要用到生成新数组的方法，且想让他触发视图更新，则需要将生成的数组替换原来的数组

### v-for中key的作用：

#### 认识VNode：

先理解成HTML元素创建出来的VNode

VNode全称Virtual Node，也就是虚拟节点，是存在于内存中的JavaScript对象

无论组件还是元素，它们最终在Vue中表现出来的都是一个个VNode

VNode的本质是一个JavaScript的对象

template ===>VNode = = =>真实DOM

### 虚拟DOM:

虚拟DOM一大好处就是做跨平台，因为JavaScript对象是通用的

一大堆元素会形成一个VNode tree 

template--------->VNode-------->真实DOM

### 没有key时，会执行patchUnkeydChildren()

### 有key时，执行patchKeyedChildren()

当不使用ey时，Vue会使用一种最大限度减少动态元素并且尽可能地尝试**就地修改/复用相同类型的元素**的算法

当使用key时，它会基于key的变化重新排列元素，并且会移除/销毁key不存在的元素

### 没有key

取到新旧节点的长度，根据他们中最短的长度进行遍历，尽可能实现节点的复用。旧节点长度更长的话直接执行unmount的操作，新的更长执行mount 的操作

### 有key时

- 第一步，**从头部往后遍历**，会根据VNode的*类型和key值*判断，如果都相同，就会将两个节点进行匹配，执行patch操作，当遍历到不匹配的节点时，直接break，执行下一步操作
- 当break后，**从尾部开始遍历**，执行上面一样的操作，直到不匹配，break跳出循环
- 如果旧节点遍历完毕，依然有新的节点，就新增节点
- 如果新的节点遍历完毕，依然有旧的节点，就移除旧的节点
- 若新旧节点的顺序被打乱，则会根据某种算法，尽可能的使**类型和key值都相同的节点**进行patch

## 计算属性

**计算属性的好处是有缓存   多次调用只会执行一次，对比methods性能更高**

计算属性会随着依赖的数据的改变而重新计算的，因此计算属性的缓存不影响响应式

### 计算属性的setter和getter

```js
 computed: {
    fullName: {
     get: function(){
      return this.message + '呵呵呵'
},
     set: function(){
      console.log("这是setter");
    }
 }
 }
```

这是计算属性的完整写法

### 侦听器watch

 开发中，我们在data返回的对象中定义了数据，这个数据通过插值语法绑定到template中，当数据变化时，template会自动进行更新来显示最新的数据。

但在某些情况下，我们希望在**代码逻辑中监听某个数据的变化**，这个时候需要用侦听器watch来完成

写法：

```
watch :{
	message(newValue , oldValue){
	
	}
}
//newValue变化后的新值   oldValue变化前的值
```

侦听器通常用在数据变化后想进行一些逻辑处理，例如发生网络请求等

##### 注意：默认情况下，侦听器只会侦听数据本身的改变，对于数据内部发生的改变则监听不到

侦听器的配置选项：

- 深度侦听  deep : true
- 立即执行（一定会执行一次） immediate :true

例如info = {name: "zhuzhu"}，watch会侦听到info = {name: 'juju'}，但是不会侦听到info.name = 'juju'

解决上述问题，可以使用深度侦听：

```
watch：{
	info:{
		handler(newInfo, oldInfo){
			console.log(newInfo , oldInfo)
		},
	deep: true  //深度侦听
	}
}
```

如果只是想侦听对象的某一属性：

'info.name' (newName , oldValue){

}

##### watch里面可以有异步操作，computed不行

#### 可以再created的生命周期中，使用this.$watch()来侦听

this.$watch()会返回一个unwatch，调用unwatch可以取消侦听

第一个参数时要侦听的源，第二个参数时侦听的回调函数callback，第三个参数是一个对象，代表额外的选项，如deep，immediate

```

```

当监听对象或数组，使用deep选项时，newValue将于oldValue相同，因为他们的引用指向同一个对象/数组，Vue不会保留变更之前的副本

## v-model的基本使用

### v-model的原理：

①绑定value；

②监听input事件，来更新message

```
<input type='text' :value="message" @input="inputChange">
methods:{
	inputChange(event){
		this.message = event.target.value
	}
}
```

或者直接@input = 'message = $event.target.value'

### v-model绑定checkbox

多选时每一项必须跟上value值

![04](D:\自己的笔记\vue\images\04.png)

### v-model绑定radio

![05](D:\自己的笔记\vue\images\05.png)

### v-model绑定select

![06](D:\自己的笔记\vue\images\06.png)

### v-model的修饰符：

- .lazy

默认情况下，v-model进行双向数据绑定时，绑定的是input事件，当跟上lazy时，将会切换成change事件，只有在提交时（比如按回车）才会触发

- .number

	默认情况下，v-model绑定的都会是string类型，加上.number修饰符，可以将绑定的数据转换成number类型

- .trim

	可以删掉绑定数据开头和结尾的空格

## 注册组件

### 全局注册：

```
const app = Vue.createApp({
        template: "#my-app",
});
app.component("component-a", {
  template: `<h2>我是组件哈哈哈</h2>`,
});
app.mount("#app");
```



# 知识补充：

## 对象的引用-浅拷贝-深拷贝

对象是引用类型

### 浅拷贝：![03](D:\自己的笔记\vue\images\03.png)

### 深拷贝：

```
const info = {name:'zhu',age:18, friends:{name:'wei',heigth:1.88}}
const obj = JSON.parse(JSON.stringify(info))
```

# Vue3组件化开发

## 父子组件之间通信：

#### 父传子：props

props就是可以在组件上**注册的一些自定义属性**

##### 用法：

- 字符串数组

	props:['content','title']

- 对象

	```
	props:{
		title: String,
		content: {
		 type: String,
	 	 required: true,
		 default: "abc"
	}
	}
	```
	
	注意：当type是对象或数组时，default必须这样写：
	
	default () {
	
	​	return {}

}

##### 非props的attribute：

- 有根节点时，会将attribute继承到跟节点上

- 禁用继承和多根节点

  - 禁用attribute继承的常见情况是需要将attribute应用于根元素之外的其他元素

  - 我们可以**通过$attrs**来访问所有的非props的attribute

  - 当组件有多个根时，需要手动绑定到某个元素上，否则会报警告

  	

  在export default{

  ​	 inheritAttrs:false

  }

#### 子传父：$emit触发事件

##### vue3中需要先在emits中对事件进行注册：

emits:['add' , 'sub']，里面注册的事件是this.$emit里面发射的事件

##### emits也可以是对象的写法，对象写法的目的是进行参数验证：

```
emits:{
	add:null,
	sub:null,
	addN:(num)=>{
		if(num){
			return true
		}
		return false
	}
}
```

null表示不需要验证，return true表示验证通过，验证不通过会报警告

## 非父子组件之间通信

### Provide/Inject

用于非父子组件之间共享数据：比如有一些深度嵌套的组件，子组件想要获得父组件的部分内容，如果任使用props沿着组件链逐级传递下去会非常麻烦

这种情况下，我们可以使用Provide和Inject

无论层级结构有多深，父组件都可以作为其所有的子孙组件的依赖提供者

父组件有一个provide选项来提供数据，子组件有inject选项来开始使用这些数据

代码如下：

```
provide:{
	name:'zhuzhu',
	age:18				
}
//父组件
inject:['name','age']
```

**注意：兄弟之间不能使用**

#### 如果想在provide里面使用this，由于this指向问题，可以将provide写成函数形式：

```jsx
provide(){
	return {
		name:'zhuzhu',
		age:18,
		length:this.message.length
	}
}
```

### 全局事件总线Mitt库

首先安装这个库：npm install mitt

其次封装一个eventbus.js

```
import mitt from "mitt";
const emitter = mitt();
export default emitter
```

通过emiter.emit('zhuzhu',{name:'zhuzhu'})发出事件，emitter.on监听事件，通常在created周期中监听emitter('zhuzhu',()=>{})

可以同时发出和监听多个事件

emitter.on('*',（type,info）=>{}) 通过\*可以监听所有事件，type表示事件名称

#### 取消监听：

##### 取消所有监听：emitter.all.clear()

##### 取消某一个：

需要先把回调函数取一个名字：

```
function onFoo(){}
emitter.on('foo',onFoo)
emitter.off('foo',onFoo)
```

## 插槽slot

可以插标签，普通文本，组件等

若插槽里有东西，则这些东西就会作为默认元素

### 具名插槽

```
<div class="nav">
	<div class="left">
		<slot name="left"></slot>
	</div>
	<div class="center">
		<slot name="center"></slot>
	</div>
	<div class="right">
		<slot name="right"></slot>
	</div>
</div>
```

```
<my-slot-cpn>
	<template v-slot:left>
		左边
	</template>
	<template v-slot:center>
		中间
	</template>
	<template v-slot:right>
		右边
	</template>
</my-slot-cpn>
```

注意：v-slot:不跟引号

### 动态决定插槽名：

v-slot : [name]，需要将变量用中括号包起来

### 使用时候的简写：

v-slot: left====> #left

### 作用域插槽

由于编译作用域的存在，父组件无法使用子组件的数据，但又想用，可以使用作用域插槽：

子组件：通过自定义属性

```
<slot :item="item" :index="index"> </slot>
```

父组件：通过v-slot="slotProps"来获取子组件属性中的数据

```
<template v-slot="slotProps"> 
	<button>{{slotProps.item}}</button>
	<button>{{slotProps.index}}</button>
</template>
```

#### 若插槽本身有名字(具名插槽)，则这样写：

v-slot:zhuzhu="slotProps"

#### 若组件没有其他具名插槽，可以将v-slot:zhuzhu写在组件标签的位置

## 动态组件的实现

通过component标签来实现，里面有一个属性**is**, is后面的值可以是通过component函数注册的全局组件，也可以是components对象注册的局部组件

 <component :is="current"></component>

动态组件传值跟普通组件传值一样的

## keep-alive

### keep-alive的属性：

- include:  只有匹配名称的组件会被缓存，字符串/正则/数组

	如果用字符串，想匹配多个，则用逗号分隔：include="a,b"

- exclude 任何匹配名称的组件都不会被缓存 字符串/正则/数组

- max  number/string  最多可以缓存多少个组件实例，一旦达到这个数字，缓存组件中最近没有被访问的实例会被销毁

#### include和exclude中的值来自组件对象中的name属性

## 异步组件的使用

### webpack的分包：

通过vue cli打包后的js代码，app.js里面是我们自己编写的所有代码逻辑

chunk-vendors里面是第三方的包

但是随着代码的增多，app.js变得很大，会影响首屏渲染效率

#### 使用：在导入某一模块的时候，不要import ... from ...

**import("路径")，这个import函数会返回一个promise**

```
import("./utils/math.js").then((res)={
	console.log(res.sum(20,30))
})
```

### vue3中异步组件的使用：

首先导入import {defineAsyncComponent} from 'vue'

defineAsyncComponent这个函数可以传两个类型的值：

- 函数

	```
	const AsyncCpn = defineAsyncComponent(()=>import("./AsyncCpn.vue"))
	```

	然后再在components里面注册AsyncCpn就行了

- 对象

```
const AsyncCpn = defineAsyncComponent({
    loader: () => import('./AsyncCpn.vue'),
    loadingComponent: loadingComponent,
    errorComponent: errorComponent,
    delay: 200,
    timeout: 3000,
    suspensible: false,
    onError(error, retry, fail, attempts) {
        if (error.message.match(/fetch/) && attempts <= 3) {
            retry()
        } else {
            fail()
        }
    },
})
```

loadingComponent是在加载过程中用来占位的组件

errorComponent是加载失败展示的组件

### 异步组件和Suspense

suspense是一个内置的全局组件，该组件有两个插槽

- default  如果default可以显示，那么显示default的内容
- fallback  如果default无法显示，则显示fallback的内容

```
<suspense>
    <template #default>
       <async-cpn></async-cpn>
    </template>
    <template #fallback>
       <errror-cpn></errror-cpn>
    </template>
</suspense>
```

## $refs的使用

在vue开发中，不推荐进行DOM操作；

这个时候，可以给元素或组件绑定一个**ref**的attribute

$refs是一个对象

```
 <h2 ref="title">哈哈哈哈</h2>
 
 this.$refs.title获取这个h2元素
```

绑定在组件上时，也能直接拿到这个组件，可以直接调用组件中的方法或者访问它的属性

## $parent, $root

获取父组件，根组件

### vue3移除了$children  

### $el，可以拿到某个组件的根元素

# 生命周期

### created  实例化完成后

### mounted 挂载到DOM后

### updated DOM发生更新后

### ummounted 卸载后

## 针对缓存组件的生命周期

### activated

### deactivated

# 组件的v-model

```
//App.vue

<my-cpn v-model="message"> </my-cpn>
//相当于：<my-cpn :modelValue="message" @updata:model-value="message=$event">
<h2> {{message}}</h2>

message: 'hello wordl'


//MyCpn.vue

<input :value="modelvalue" @input="btnClick"
emits:['updata:modelValue']
btnClick(event){
	this.$emit('updata:modelValue', event.target)
}
```

# 动画

## 内置组件transition

没有动画的情况下，整个内容的显示和隐藏会非常的生硬。如果想给**单个元素或组件**添加动画，可以使用transition组件

### 过渡动画class(若transition组件没有name,则默认是v)

- v-enter-from  定义进入过渡的开始状态，在元素被插入之前生效，在元素被插入之后的下一帧移除
- v-enter-active 定义进入过渡生效时的状态，在整个进入过渡状态中应用，在元素被插入之前生效，在过渡/动画完成之后移除。这个类可以被用来定义进入过渡的过程时间，延迟和曲线函数
- v-enter-to  定义进入过渡的结束状态，在元素被插入之后下一帧生效，在过渡/动画完成之后移除

### class添加的时间

![09](D:\自己的笔记\vue\images\09.png)

### animation：

```
@keyframes bounce {
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
.zhu-enter-active{
    animation: bounce 1s ease;
}
.zhu-leave-active{
    animation: bounce 1s ease reverse;
}
```

### transition：

```
.zhu-enter-from,
.zhu-leave-to{
    opacity: 0;
}

.zhu-enter-to,
.zhu-leave-from{
    opacity: 1;
}
.zhu-enter-active,
.zhu-leave-active{
    transition: opacity 3s ease;
}
```

### 同时使用animation和transition，type属性

同时使用可能存在某一个动画执行结束而另一个没结束，这种情况下，我们可以设置type属性为animation或transition来明确告诉vue以哪个时间来结束

### 指定动画时间

可以通过duration属性来指定动画时间（用得比较少）

### 过渡模式mode

当切换多个显示或隐藏时，会出现一个还没隐藏完另外一个就显示出来的情况

值：

- in-out   一个元素先进入，另外一个再消失
- out-in  先消失，再进入

### appear属性：

默认为false，当为true时，第一次加载的时候也会出现动画

## 结合第三方库animate.css

### 安装-导入

npm install animate.css

在main.js中： import "animate.css"

### 自定义过渡class：

可以再transition组件上添加以下属性来自定义对应的class

- enter-from-class
- enter-active-class
- enter-to-class
- leave-from-class
- leave-active-class
- leave-to-class

使用animate.css的类时，要加上**animate__animated**

## gsap库

某些情况我们希望通过js来实现动画，就可以用这个库

### 安装-导入

npm install gsap

在vue文件中导入：import "gsap" from "gsap"

### javascript钩子：

![010](D:\自己的笔记\vue\images\010.png)

其中：:css属性为false表示会让vue跳过css的检测，略微提高性能，也避免了让css规则的影响

### 使用：

![011](D:\自己的笔记\vue\images\011.png)



```
enter(el,done){
	gsap.from(el,{
		scale:0,
		x:200,
		onComplete: done
	})
}
```

注意：若不手动调用done，则会自动同步调用，也就是说动画还没执行结束就调用了done

## 列表的过渡

如果希望渲染的是一个列表，并且该列表中添加删除数据也希望有动画执行，这个时候要使用**transition-group**组件来完成

![012](D:\自己的笔记\vue\images\012.png)

###### 注意：行内元素会对一些动画效果进行限制，应该转换成行内块元素

### 通过zhu-move来对其他需要移动的节点添加动画

它会在元素改变位置的过程中应用

# Mixin

编写导出的js代码后，在需要混入的组件对象中添加mixins属性，mixins属性通常是一个数组

```
import {demoMixin} from "./mixins/demoMixin"
    export default {
        mixins:[demoMixin]
}
```

## mixin的合并规则

#### data中发生命名冲突

以组件内部的data为主

#### 生命周期钩子函数发生冲突

mixin和组件的生命周期会被合并到数组里面，都会被调用

#### 当值为对象的选项时，例如methods，computed等

比如都有methods选项，都定义了方法，则都会生效

但是如果对象里面的key相同，则会保留组件内部的key

## 全局混入

当组件中某些选项时所有组件都需要的，可以使用全局的mixin

```
const app = createApp(app);
app.mixin({
	data(){
		return{}
	},
	methods:{
	
	}
})

app.mount("#app")
```

# composition API

**注意：setup里面不能使用this来调用实例的属性和方法！！**因为源码里面没有绑定this

**因为setup是在created之前调用的，这个时候还没有data，computed这些**

## setup函数有哪些参数

### 参数一：props

可以通过props拿到父组件传过来的属性值

```
 props:{
     message:{
       type:String,
       required:true
     }
},
 setup (props) {
   console.log(props.message);
}
```

### 参数二：context，里面包含三个属性：

- attrs： 所有非prop 的attribute
- slots: 父组件传递过来的插槽
- emit：当我们组件内部需要发出事件时会用到emit（因为不能访问this，所以不可以通过this.$emit发出事件）

```
setup(props, context) {
    console.log(props.message);
    console.log(context.attrs.id);
    console.log(context.attrs.class);
    console.log(context.slots);
    console.log(context.emit);
  },
```

context可以写成对象解构：

{attrs , slot , emit}

## setup的返回值

**setup的返回值可以在模板template中被使用**，也就是说，我们可以通过**setup的返回值来替代data选项**

暂 时先记返回一个对象

## reactive API

在setup返回值中返回的数据，并非响应式的

需要使用reactive函数，将数据变成响应式的

reactive里面的对象如果有深层的，深层的也是响应式的

#### 导入-使用

```
import {reactive} from "vue"
export  default{
	setup() {
      const state = reactive({
          counter:100
      })
      const add = ()=>{
          state.counter++;
      }
    return{
        state,
        add
    }
  },
}
```

**reactive API只能传入对象或者数组**

## ref API

如果我们只是想让一些简单的数据变成响应式的，使用reactive就太麻烦了

这个时候可以用ref API

 **ref会返回一个可变的响应式对象**，该对象作为一个响应式的引用维护着它内部的值

```
import {ref} from "vue"
setup(props, context) {  
     let counter = ref(100)
     const add = ()=>{
         counter.value++
     }
     return{
         counter,
         add
     }
  },
```

通过ref返回对象里面的value属性可以访问这个值

在模板中使用这个对象，它会自动解包，可以省略这个value

## readonly API

```
import {readonly} from "vue"
setup() {  
     const info = {name:'zhuwei'}
     const readonlyInfo = readonly(info)
     const updataInfo = ()=>{
         readonly.name="zhangzhang"
     }
     return{
         updataInfo
     }
  },

```

这个时候调用updataInfo就会报警告，无法修改值

也可以向readonly中**传入一个响应式对象**

```
const info = reactive({
        name:'zhuwei'
    })
     const readonlyInfo = readonly(info)
     const updata = ()=>{
         readonlyInfo.name="weiwei"
}////传入reactive响应式对象

const info = ref('zhuwei')
     const readonlyInfo = readonly(info)
     const updata = ()=>{
         readonlyInfo.value="weiwei"
}
////传入ref响应式
```

## 补充的API（以下都需要导入）

### isProxy

检查对象是否是由reactive或readonly创建的proxy

### isReactive

检查对象是否由reactive创建的响应式代理，如果该代理是readonly创建的，但是包裹了reactive创建的另一个代理，也返回true

### isReadonly

检查对象是否由readonly创建的只读代理

### toRaw

返回reactive或readonly代理的原始对象

### shallowReactive

创建一个浅层的响应式代理

### shallowReadonly

​	创建一个proxy为只读，但其深层还是可读写的

### toRefs

**作用：将reactive对象所有属性都变成ref**

当对一个响应式对象进行解构的时候，解构出来的就不再是响应式了

```
const info = reactive({name:'zhuzhu',age:18})
let {name,age} = info
```

这样的话name，age就不是响应式的，但是可以使用toRefs

```
const info = reactive({name:'zhuzhu',age:18})
let {name,age} = toRefs(info)
```

这样会返回两个对象，这个时候name，age都是ref对象了，需要用name.value来访问值

**注意：这样的话info.name和name.value任意一个修改都会使得另外一个修改**

### toRef

只转换reactive对象中一个属性为ref

```
let age =  toRef(info, 'age')
```

## computed

需要先导入

**computed返回值是一个ref对象**

### 用法一：传入一个getter

```
const firstName = ref("zhu")
const lastName = ref("wei")
let fullName = computed(()=>firstName.value+lastName.value)
return{
   fullName
}
```

### 用法二：传入一个对象，包含一个getter和setter

```
let fullName = computed({
get:()=>firstName.value+' '+lastName.value,
 set(newValue){
   const names = newValue.split(' ')
  firstName.value = names[0]
   lastName.value = names[1]
    }
   })

    const change = ()=>{
      fullName.value = '朱 为'
    }
```

## watch

需要导入

在compositionAPI中的watch中，提供了两个API：

### watchEffect

用于自动收集响应式数据的依赖

**他会立即执行一次**，在执行过程中收集依赖，即回调函数中所使用到的响应式对象，然后自动地对这些对象实施侦听

```
 watchEffect(()=>{
  	 console.log("age",age.value);
 })
```

#### 停止侦听

watchEffect会返回一个停止侦听的函数，调用这个函数就会停止侦听

```
const stop = watchEffect(()=>{
  	 console.log("name",age.value);
 })
stop()
```

#### 清除副作用

如果我们在开发中需要在侦听函数中执行网络请求，但是网络请求还没达到的时候，我们停止了侦听器，或者侦听器侦听函数再次被执行了

那么上一次的网络请求应该被取消掉，这个时间就要清除副作用

这个函数会在停止侦听器或侦听器函数再次被执行的时候自动执行

```
onst stop = watchEffect((onInvalidata)=>{
  	onInvalidata(()=>{
  		在这个函数中清除额外的副作用
  	})
 })
```

#### 在setup中使用ref

watchEffect第二个参数可以传入一个对象：

flush默认为pre,会在第一次DOM更新前刷新一次，当为post时，会在DOM更新后刷新

```
<h2 ref="title">  哈哈哈  </h2>

setup(){
	const title = ref(null)
	watchEffect(()=>{
      console.log(title.value);//通过title.value可以拿到元素
        },{
          flush:'post'
       })
	return{
		title
	}
}
```



### watch

需要手动指定侦听的数据源

watch 完全等同于组件的watch选项

只有当被侦听的源发生变化才会执行回调，第一次不会直接执行

#### 用法一：传入一个getter函数

```
const info = reactive({ name: "zhuwei", age: 18 });
    watch(()=>info.name, (newValue, oldValue) => {
      console.log("newValue:", newValue, "oldValue:", oldValue);
    });
    const change = () => {
      info.name="zhang";
    };
```

#### 用法二：传入一个可响应对象

##### 传入一个reactive对象(不推荐)：

传入reactive对象获取到的newValue和oldValue都是reactive对象，所以他们的值是一样的

```
setup() {
    const info = reactive({ name: "zhuwei", age: 18 });
    watch(info, (newValue, oldValue) => {
      console.log("newValue:", newValue, "oldValue:", oldValue);
    });
```

​	如果希望变成普通对象：对info进行解构

```
setup() {
    const info = reactive({ name: "zhuwei", age: 18 });
    watch(()=>{return {...info}}, (newValue, oldValue) => {
      console.log("newValue:", newValue, "oldValue:", oldValue);
    });
```

##### 传入一个ref对象：

传入ref对象获取到的newValue和oldValue是ref的value值本身

```
const info = ref("zhuwei")
watch(info,(newValue,oldValue)=>{
   console.log("newValue:", newValue, "oldValue:", oldValue)
})
```

#### 侦听多个数据

第一个参数就为数组

```
const info =reactive({name:'zhuzhu'})
    const name = ref("朱威")
    watch([()=>({...info}),name],([newName,newInfo],[oldName,oldInfo])=>{
        console.log(newName,newInfo,oldName,oldInfo); })

```

#### watch的选项

deep   传入reactive对象时，默认会进行深度侦听，但把reactive解构成普通对象则不会默认深度监听

immediate

## 生命周期

在setup中直接导入onX函数注册生命周期钩子

```
import { onMounted, onUpdated ,ref} from "vue";
export default {
  setup() {
    const info = ref("zhuwei")
    const onClick = ()=>{
        info.value = "朱威"
    }
    onMounted(() => {
      console.log("挂载咯");
    });
    onUpdated(()=>{
        console.log("更新咯");
    })
```

注意：**setup里面没有beforeCreate和created这两个**生命周期，如果需要在这两个生命周期中执行的话，**直接放到setup里面就行了**

**setup执行的时间比beforeCreate和created还要早**

## provide和inject

```
import { provide } from "vue"
    export default {
        setup(){
            const name = "zhuwei"
            const age = 18
            provide("name",name)
            provide("age",age)
        }
    }
//APP.vue

//provide(键，值)
```

```
import {inject} from "vue"
    export default {
        setup(){
            const name = inject("name","")
            const age = inject("age",0)
        }
}
Home.vue
```

其中inject的第二个参数是默认值，可以不给

provide提供的是响应式，则拿到的就是响应式

但是通常我们不会允许子孙组件随便修改父组件的值，这时候需要包裹一个readonly

```
 setup(){
            const name = ref("zhuwei")
            const age = ref(0)
            const readName = readonly(name)
            const readAge = readonly(age)
            const AppClick = ()=>{
                age.value++
            }
            provide("name",readName)
            provide("age",readAge)
            return {
                AppClick
            }
        }
```

## 一个计数器案例

```
					//useCounter.js
import {ref,computed} from "vue"
export default function () {
    let counter = ref(0)
    let doubleCounter = computed(() => counter.value * 2)
    const add = () => counter.value++
    const dec = () => counter.value--
    return {counter,doubleCounter,add,dec}
}

```

```
					//App.vue
import useCounter from "./hooks/useCounter";
export default {
  setup() {
    const { counter, add, dec, doubleCounter } = useCounter();
    return {
      counter,
      add,
      doubleCounter,
      dec,
    };
  },
};
```

其中App.vue可以写成下面，但不推荐

```
setup() {
    return {
      ...useCounter()
    };
  }
```

## \<script setup>

### 导入组件后直接可以使用不需要注册了

### 需要传入props时

```
<script setup>
import {defineProps} from "vue"
const props = defineProps({
    message:{
        type:String,
        default:"哈哈哈"
    }
})
</script>
```

### 需要发出事件时

```
import {defineEmits} from "vue"
const emit = defineEmits(['myEvent'])
emit('myEvent',"嘻嘻嘻嘻")
```

# 认识render函数

![013](D:\自己的笔记\vue\images\013.png)

![014](D:\自己的笔记\vue\images\014.png)

## render函数的计数器实现

![015](D:\自己的笔记\vue\images\015.png)

## JSX实现计数器![016](D:\自己的笔记\vue\images\016.png)

# 自定义指令

在某些情况下，需要对DOM元素进行底层操作，这个时候需要用到自定义指令

自定义局部指令：组件中通过directives选项，只能在当前组件使用                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  

```
export default {
  directives:{
    focus:{
       mounted(el) {
          console.log("focus！！！")
          el.focus()
        },
       }
      }
}
```

自定义全局指令：app的directive方法，可以再任意组件中被使用    

```
const app = createApp(App)
app.directive("focus",{
    mounted(el) {
        console.log("focus！！！")
        el.focus()
    }
})
app.mount('#app')
```

## 指令的生命周期

- created 在绑定元素的attribute或事件监听器被应用之前调用
- beforeMount 当指令第一次绑定到元素并且在挂载到父组件之前调用
- mounted 在绑定元素的父组件被挂载后调用
- beforeUpdata 在更新呢包含组件的VNode之前调用

每个生命周期都有el , bingdings  ,vnode , preVnode这四个参数

其中，给指令传的值放在了bingdings里面的value属性中，传的修饰符放在了bingdings的modifiers里面

# Vue插件

通常我们向Vue全局添加一些功能时，会采用插件的模式，有两种编写方式

- 对象类型：一个对象，但是必须包含一个install函数，该函数会在安装插件时执行

- 函数类型：一个function，该函数会在安装插件时自动执行

	```
	export default function(app){
		 app.config.globalProperties.$name= "zhuweizhuwei666"
	}
	```

	![017](D:\自己的笔记\vue\images\017.png)

	

```
					//plugin_object.js 对象类型
export default{
    install(app){
        app.config.globalProperties.$name= "zhuweizhuwei666"
        console.log(app)
    }
}
					//main.js
import plugin_object from './plugins/plugin_object'
app.use(plugin_object) //实际上是plugin_object.install(app)
```

通过 app.config.globalProperties.$name这种方法，就可以再全局通过this.$name的方法拿到这个值了

但是，在setup中只能通过下面这种方法拿：

```
import {getCurrentInstance} from "vue"
export default {
   setup(){
      const instance = getCurrentInstance() 
      console.log(instance.appContext.config.globalProperties.$name);
   }
     
}
```

### 插件安装：

通过app.use()来安装

# Vue3源码学习

![018](D:\自己的笔记\vue\images\018.png)

![019](D:\自己的笔记\vue\images\019.png)

![020](D:\自己的笔记\vue\images\020.png)

![021](D:\自己的笔记\vue\images\021.png)

## 实现mini_vue

### 渲染器

VNode就是一个个JavaScript对象！！！

![026](D:\自己的笔记\vue\images\026.png)

# vue router

## hash和history模式

### URL的hash

url的hash也就是锚点（#），本质上是改变window.location的href属性

我们可以通过直接赋值location.hash来改变href，但是页面不发生刷新

```js
<div id="app">
   <a href="#/home">home</a>
   <a href="#/about">about</a>
   <div class="content"></div>
</div>
<script>
  const contentEl = document.querySelector(".content")
    window.addEventListener("hashchange", () => {
      switch (window.location.hash) {
        case "#/home":
          contentEl.innerHTML = "Home页面"
          break;
        case "#/about":
          contentEl.innerHTML = "about页面"
          break;
        default:
          break;
      }
    })
  </script>
```



### HTML的history

history接口值HTML5新增的，它有6种模式改变RUL而不刷新页面

- replaceState :替换原来的路径
- pushState : 使用新的路径
- popState ：路径的后退
- go : 向前或向后改变路径
- forward ：向前改变路径
- back：向后改变路径

## vue-router的基本使用

安装：npm install vue-router@4

新建一个router文件夹，index.js中

### 步骤：

1. 配置映射关系

```
import { createRouter, createWebHistory, createWebHashHistory } from "vue-router"
import Home from "../pages/Home.vue"
import About from "../pages/About.vue"
const routes = [
    {
        path: '/home',
        component: Home
    },
    {
        path: '/about',
        component: About
    },
]
```

2. 创建一个路由对象router并导出

	如果是hash模式，需要导入**createWebHashHistory**，history模式要导入**createWebHistory**

```
const router = createRouter({
    routes,//ES6增强写法 
    history: createWebHistory()
})
export default router
```

3. 在main.js中导入并安装

	```
	import { createApp } from 'vue'
	import router from './router/index.js'
	import App from './App.vue'
		const app = createApp(App)
		app.use(router)
		app.mount('#app')
	
	```

## vue-router内置组件

### 通过router-view组件进行占位，所占位置就是路由组件显示的位置

#### router-view和v-slot

router-view的v-slot里面也有props里面有很多属性：

- Component 当前显示的组件     （注意C是大写）

	```
	 <router-view v-slot="props">
	      <transition name="zhu">
	            <component :is='props.Component'></component>
	      </transition>
	</router-view>
	```

- route  路由对象跟其他的一样


#### router-link

router-link的to属性决定跳转的地址

```
<router-link to="/home">首页</router-link>
<router-link to="/about">关于</router-link>

<router-view></router-view>
```

router-link可以传入很多属性：

- to属性 : 是一个字符串或者是一个对象
- replace属性 ：设置replace属性的话，当点击时，会调用router.replace()而不是router.push()
- active-class属性：设置激活a元素应用的class，默认是 router-link-active
- exact-active-class属性：精准匹配时才会有的class，整个路径完全一致才有，上面那个当路径前一部分匹配就会有的

#### router-link和v-slot

router-link默认渲染成   **a标签**，如果想自定义成其他标签，需要这样来做

```
<router-link to="/home" >
     <button>首页</button>
 </router-link>
```

**router-link中间有插槽，中间放组件也是可以的**

可以通过作用域插槽，拿到props，props中有很多属性可以拿

- href 链接，如下面这段代码中props.href拿到的就是 /home

- route对象，即将跳转至的路由对象

- navigate导航函数 ，当router-link添加了custom属性时，最外层就没有了a标签，不能跳转了，可以通过这种方式跳转：

	```
	<router-link to="/home" v-slot="props" custom>
	 <button @click="props.navigate">哈哈哈</button>
	</router-link>
	```

	

- isActive 当前是否处于活跃状态

- isExactActive 是否处于精确的活跃状态

	

```
<router-link to="/home" v-slot="props">
            <button>{{props.href}}</button>
             <button>{{props.route}}</button>
</router-link>
```



### 细节：

#### 配置默认路由：

 {path:'',redirect:'/home'},

#### **路由懒加载**

跟webpack分包有点关系，这样做的话不同的路由组件就会被打包到不同的文件下，提升性能

```
{
 	path: '/home',
	component: ()=>import("../pages/Home.vue")
}
```

就是给component属性传一个函数，使用import()函数

#### 可以给打包的文件自己起一个名字:魔法注释

```
{
        path: '/home',
        component: () => import(/*webpackChunkName:"home-chunk"*/"../pages/Home.vue")
    }
```

#### 路由的name属性和meta属性 

meta属性跟着一个对象，里面存放一些数据

```
meta：{
	name:"zhu",
	age:18
}
```

### 动态路由匹配

```
 {
        path:'/user/:username/id/:id',
        component:()=>import("../pages/User.vue")
 }
```

**可以通过this.$route拿到当前路由的一些数据！！！**

在setup中：

```vue
import {useRoute} from "vue-router"
  export default {
     setup(){
       const route = useRoute()
       console.log(route.params.username);
     }
}
```

useRoute()会返回当前路由的对象，里面保存着相关的值

### NotFound

当匹配到某一个不存在的路径时，显示某一组件

添加路由：

```
{
 path:'/:pathMatch(.*)',
 component:()=>import("../pages/NotFound.vue")
}
```

这是固定写法

匹配不到的路径会被放到$route.params.pathMatch中

### 路由的嵌套

在路由里面添加**children属性**

```
{
 path: '/home',
 component: () => import("../pages/Home.vue")，
 children:[
  {path:'message',component:()=>import("../pages/HomeMessage.vue")},
  {path:'shops',component:()=>import("../pages/HomeShops.vue")}
 ]
},
```

**其中path直接写成'message'或 'shops'，不能加/**

如果嵌套的路由需要设置默认路由，应该这样：

```
{path:'',redirect:'/home/message'},
```

**需要写完整**

## 编程式导航

可以通过：

```
 methods: {
   toAbout() {
   this.$router.push("/about")
   }
 }
```

### 在setup里面

导入：import {useRouter} from "vue-router"

```
setup(){
   const router = useRouter()
   const toAbout = ()=>{
   router.push("/about")
   }
  return{
    toAbout
  }
}
```

### 可以给push传入一个对象而不是字符串：

```
router.push({
   path:'/about',
   query:{
   name:'zhuwei',
   age:18
   }
})
```

这样跳转到about时，地址就变成了

http://localhost:8080/about?name=zhuwei&age=18

通过query传入的数据，可以通过$route.query拿到

#### 其中push方法可以替换成replace方法，go等方法也可以使用



## 动态添加路由

在router文件夹中index.js中的router对象中，使用addRoute方法

```
const categoryRoute = {
    path:'/category',
    component:()=>import("../pages/Category.vue")
}
router.addRoute(categoryRoute)

```

这种方法默认是添加顶级路由

### 添加二级路由

```
router.addRoute("home",{
    path:'moment',
    component:()=>import("../pages/HomeMoment.vue")
})
```

​	第一个参数"home"来自路由对象的**name属性**

## 动态删除路由

### 三种方式：

- 添加一个name相同的路由，用来顶替需要删除的路由

- 通过removeRoute方法，传入路由的名称

- 通过addRoute方法的返回值回调

	router.addRoute方法会返回一个函数，调用这个函数就会将添加的路由删除

## 路由导航守卫

vue-router提供的导航守卫主要用来通过跳转或取消的方式守卫导航

### beforeEach

全局的前置守卫beforeEach是在导航触发时会被回调

```
router.beforeEach((to,from)=>{
    console.log(to,from);
    return false
})
```

其中to,from参数都是route对象，to是即将跳转到的路由对象，from是从哪儿跳的对象

#### 返回值：

- false ：不进行导航，哪儿都不去了
- 返回 undifined 或者不写返回值 ：进行默认导航
-   字符串：路径，跳转到对应的路径中
- 对象：就是一个路由对象 

### 除了全局导航守卫，还有路由的独享守卫和组件的独享守卫

https://next.router.vuejs.org/zh/guide/advanced/navigation-guards.html

## historyApiFallback

![023](D:\自己的笔记\vue\images\023.png)

# Vuex

### 安装使用导出

npm install vuex@next	

新建一个文件夹，index.js

```
import { createStore } from "vuex";
const store = createStore({
    state(){
        return{
            counter:0
        }
    },
    mutations:{
        add(state){
            state.counter++
        },
        dec(state){
            state.counter--
        }
    }
})
export default store
```

## state

### 辅助函数mapState

我们可以将类似 $store.state.name的表达式写成计算属性，但是如果变量太多了， 就要写很多的计算属性，这个时候可以使用辅助函数：mapState

#### mapState返回的是一个对象，接收数组或对象

```
<div>
       Home: {{counter}}
       Home: {{name}}
       Home: {{age}}
       Home: {{height}}
</div>
 import { mapState } from "vuex"
    export default {
        computed:{   ...mapState(["counter","name","age","height"])
        }
}
```

通过  ...来展开mapState返回的对象

##### 对象写法：

```
 ...mapState({
                sCounter:state=>state.counter,
                sName :state=>state.name,
                sAge:state=>state.age,
                sHeight:state=>state.height
})
```

写成键值对的形式，值是一个函数。好处就是可以自定义名字，

### 在setup中使用

```
import {computed } from "vue"
import { useStore } from "vuex"
 setup(){
            const store = useStore()
            const sCounter = computed(()=>store.state.counter)
            return{
                sCounter
      }
 }
```

**useStore ( ) 返回的是一整个store对象**

## getters

某些属性我们可能需要经过变化后来使用，这个时候可以用getters，类似于计算属性

```
 					//定义
getters:{
   totalPrice(state){
      let totalPrice = 0
      for( const book of state.books){
      totalPrice += book.count*book.price 
      }
    return  totalPrice
    }
 }
 					//使用
```

还可以传入第二个参数，getters,用来使用其他的getter

```
totalPrice(state,getters){
            let totalPrice = 0
            for( const book of state.books){
                totalPrice += book.count*book.price 
            }
            return  totalPrice*getters.currentDiscount
        },
        currentDiscount(state){
            return state.discount*0.9
}
```

### 辅助函数mapGetters

传入数组的用法跟mapState一样的  

传入对象时：

```
import { mapGetters } from "vuex"
  export default {
     computed:{
        ...mapGetters({
            sNameInfo:'nameInfo',
            sAgeInfo :'ageInfo'
         })
      } 
}
```

### 在setup中使用

```
import {computed } from "vue"
import { useStore } from "vuex"
setup(){
      const store = useStore()
      const sNameInfo = computed(()=>store.getters.nameInfo)
            return{
                sNameInfo
      }
 }
```

## mutations

更改vuex的store中的状态的唯一方法是提交mutation

mutations的第二个参数是commit时传过来的

```
methods: {
     incrementN() {              this.$store.commit('incrementN',10)
      }
}

//VueX
 incrementN(state,payload){
            state.counter +=payload
}
 
```

传入的payload通常是一个对象，这样就能传入多个值

```
incrementN(n) {
     this.$store.commit('incrementN',{n:10,name:'zhuzhu',age:18})
}
```

### 另外一种提交风格：全部写成一个对象，写上type属性

```
incrementN(n) {
     this.$store.commit({
     type:'increment',
     n:10,
     name:'zhuzhu',
     age:18})
}
```

### 辅助函数

```
import { mapMutations } from "vuex"
    export default {
        methods: {
           ...mapMutations(['add','dec'])
        },
     
}
```

传入对象的写法跟getters一样的

### 在setup中使用辅助函数

这个跟前两个不一样，比前两个简单，因为这些辅助函数返回的本来就是函数

```
setup(){
  const storeMutations = mapMutations(['add','dec'])
 return{
       ...storeMutations
 }
 }
```

## actions

actions类似于mutation，不同在于：

- action提交的是mutation，而不是直接变更状态

- action可以包含异步操作

这里一个非常重要的参数context

可以通过context的commit方法来提交一个mutation，或者通过context.state,context.getters来获取state和getters

```
actions:{
     incrementAction(context,payload){
     	console.log(payload)
     	setTimeout(() => {
     	context.commit('add')
     	}, 3000);
     }
}
```

```
add(){
                  		this.$store.dispatch('incrementAction',{name:'zhuwei'})
            },
```

### 另一种派发方式：

this.$store.dispatch({

​	type:incrementAction",

​	name:'zhuwei'

})

### context对象包含的属性和方法

- commit 
- dispatch 用来调用其它的action
- getters   在action中获取getter
- rootGetters
- rootSate
- state  

### 辅助函数mapActions

使用跟mutations的辅助函数一样的

### action是可以返回一个promise的

incrementAction(context){

​	return new Promise()

}

## module

```
//user.js
const userModule = {
  state(){
    return{
       userCounter:200
    }
  },
  actions:{
  }
}
export default userModule					
```

```
//index.js
modules:{
   user,
   home
}
```

```
//使用：
<div>
  <h2>{{$store.state.rootCounter}}</h2>
  <h2>{{$store.state.home.homeCounter}}</h2>
  <h2>{{$store.state.user.userCounter}}</h2>
</div>
```

### 使用模块中的getters

```
<h2>{{$store.getters.homeDoubleCounter}}</h2>
```

**需要省略掉模块名，不能这样写：$store.getters.home.homeDoubleCounter**

### 使用mutation和action

```
this.$store.commit('increment')
```

都是跟原来一样，但是有一个问题，没有办法区分是来自哪一个模块，并且会调用所有increment。

### 解决方法：namespaced

在模块对象中加上namespaced属性为true

```
namespaced:true,
   state(){
     return{
         homeCounter:100
     }
   }
```

#### 使用getters时：

```
<h2>{{$store.getters['home/homeDoubleCounter']}}</h2>
```

其中home是模块名，homeDoubleCounter是具体的getter

#### 使用mutations时：

```
 this.$store.commit('home/increment')
```

#### 使用actions时：

```
this.$store.dispatch('home/incrementAction')
```

### 当使用了命名空间后：

- getter里面有了另外两个参数：rootState，rootGetters

- 如果同时commit模块里的mutation和根的mutation，则可以：

	```
	commit('increment',null,{root:true})
	```

	null表示传过去的payload

- dispatch也一样

#### 辅助函数们里面的东西都要是在根里面的

当想对模块里面的东西用辅助函数：

##### 写法一(不推荐)：

```
...mapState({
	homeCounter: state =>state.	home.homeCounter
})

...mapGetters({
	homeDoubleCounter: "home/homeDoubleCounter"
})

...mapMutations({
	increment:"home/increment"
})

...mapActions({
	incrementAction:"home/incrementAction"
})
```

##### 写法二：

```
...mapState("home",["homeCounter"])
//	先告诉是哪一个模块，后面可以是对象也可以是数组
...mapGetters("home",["homeDoubleCounter"])

...mapMutations("home",["increment"])
...maoActions("home",["incrementAction"])

```

##### 写法三：

先导入createNamespacedHelpers

createNamespacedHelpers函数返回的是一个对象，里面有四个属性分别是mapState，mapActions，mapMutations,mapGetters

```
import {createNamespacedHelpers} from "vuex"

const {mapState，mapGetters,mapMutations,mapActions} = createNamespacedHelpers("home")

export default {
    computed:{
     ...mapState(["homeCounter"]),
     ...mapGetters(['homeDoubleCounter'])
    },
    methods:{
     ...mapMutations(["increment"]),
     ...mapActions(["incrementAction"])
    }
}
```

# nexttick

![022](D:\自己的笔记\vue\images\022.png)

```
import { nextTick, ref } from "vue"
    export default {
        setup(){
            const message = ref("哈哈哈")
            const add = ()=>{
                message.value+='haha '
                //更改了数据，等待更新
                nextTick(()=>{
                console.log(titleRef.value.offsetHeight);
                })
            }
            const titleRef = ref(null)
            return {
                message,
                add,
                titleRef
            }
        }
    }
```

#### nexttick中的回调函数会被加入到微任务队列中

# 区分环境

通过process.env.NODE_ENV

它在不同环境中有不同的值：

- 开发环境：development
- 生产环境：production
- 测试环境：test

# axios

![024](D:\自己的笔记\vue\images\024.png)

### axios的默认配置选项

都在axios.defaults对象中，如axios.defaults.baseURL

![025](D:\自己的笔记\vue\images\025.png)

### axios.all

发送多个请求，然后一起返回数据

### axios的拦截器

- axios.interceptors.request.use(fn1, fn2)拦截请求

	fn1代表请求发送成功执行的函数，fn2请求发送失败执行的函数

	```
	axios.interceptors.request.use(
	  (config) => {
	    console.log('请求发送成功')
	
	    return config
	  },
	  (err) => {
	    console.log('请求发送失败')
	    return err
	  }
	)
	```

	

- axios.interceptors.response.use(fn1, fn2)拦截响应

	fn1代表数据响应成功执行的函数（服务器正常返回数据）

	fn2代表数据响应失败执行的函数

	```
	axios.interceptors.response.use(
	  (res) => {
	    console.log('响应成功拦截')
	
	    return res
	  },
	  (err) => {
	    console.log('服务器响应失败')
	
	    return err
	  }
	)
	```

	

