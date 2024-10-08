### 关键路径

就是浏览器在初次渲染页面时，浏览器经历的一些事情，如下图

这个过程中需要HTML本身外和呈现这个HTML的其他关键资源，

放在<head>中的css和js都会阻塞这个过程![image-20240813114830534](/Users/zhu/Library/Application Support/typora-user-images/image-20240813114830534.png)

#### 阻塞渲染

css会阻塞渲染，但是不会阻塞HTML的解析，这是完全正确的，因为如果CSS不阻塞渲染的话，浏览器会经常看到没有任何样式的html

其中放在<head>中的css，会阻塞整个页面的渲染

#### 阻塞解析器

默认情况下，JavaScript 会阻塞解析器（除非明确标记为**async**或**defer**，因为 JavaScript 可能会在执行时更改 DOM 或 CSSOM。

阻塞解析器的同时也会阻塞渲染

![image-20240813143633933](/Users/zhu/Library/Application Support/typora-user-images/image-20240813143633933.png)

#### 优化资源加载

##### Css

- 通过coverage工具或其他方式，移除未使用的css
- 压缩css大小
- 避免使用@import，因为@import是在另一个css内，需要解析了对应的css才会去下载和解析这个css，不利于预加载器提前下载对应的css，应该使用**link**
- 合理运用**preload**和**prefetch**

##### Js

- 适当的使用**async**、**defer**
- 通过工具进行**uglily**



### BFC

Block-formating-context

一个独立的渲染上下文，不会影响区域外的渲染，区域外的渲染也不会影响这个区域。怎么理解这个独立渲染呢？？？

例如给下面的图片一个**float:left**，会导致div元素高度坍塌，从而img元素渲染到了别的区域，也就是影响了别的区域的渲染

因此给div一个**overflow:hidden**，把div变成一个单独的bfc，就能解决高度坍塌的问题，这时img就不会渲染到别的区域了

```html
<div>
  <img src='test/png'/>
</div>
```

#### 使用场景

- 解决元素高度坍塌，上面那个例子
- 解决垂直方向相邻元素外边距合并问题，给任意一个盒子开启BFC即可
- 排除外部浮动：一个元素开启浮动后，会脱离正常流，会覆盖正常流，给被覆盖的元素开启BFC，就不会被覆盖了
- 父子元素中，给子元素一个外边距，这个外边距会被传递到父元素，给父元素开启BFC即可![image-20240820183051932](/Users/zhu/Library/Application Support/typora-user-images/image-20240820183051932.png)

### HTTP

#### http1.1

- 升级了长连接功能，不用在每次发送HTTP请求时都建立的TCP连接。**connection: keep-alive**

- 引入了管道(pipeline)机制，1.1允许在一个TCP连接中，同时发送多个请求如A和B，但是请求的返回还是按照先回应A请求，等A

  完成后再回应B

  - 由于一个连接里面可以有多个响应，就需要一种机制来区分哪些数据是属于哪个请求的，Content-Length就是起这个作用

#### http2.0

http2.0仅支持在https中

- 与1.1版本不同，2.0传输数据采用了二进制格式而文本传输

- 允许多路复用，多个请求并行发送，且服务器可以不按照顺序处理请求(和1.1不一样)

  - 每个请求或相应都称为一个**数据流（stream）**,每个流都有一个独一无二的标记
  - 客户端和服务器都可以发送信号来**中断**这个流，即取消请求，1.1想要取消请求只能中断TCP连接
  - 客户端还可以指定每个流的**优先级**

- 头信息压缩，每次请求的请求头都有很多相似的，比如cookie,user-agent等。一方面使用gzip或compress进行压缩，另一方面在客户端和浏览器都维护一张表，已经发送过的字段就存起来生成一个索引，下次就不发送字段了，只发送索引，大大的减少了数据的传输量

- 服务器推送，服务器可以直接像客户端发送资源。

  ```html
  常见场景是客户端请求一个网页，这个网页里面包含很多静态资源。
  正常情况下，客户端必须收到网页后，解析HTML源码，发现有静态资源，再发出静态资源请求。
  其实，服务器可以预测到客户端请求网页后，很可能会再请求静态资源，所以就主动把这些静态资源随着网页一起发给客户端了。
  ```

#### TLS协议

https采用的是**非对称加密+对称加密+身份验证**

##### TLS协议的握手过程

1. 客户端发起加密通信的请求，客户端发送一个随机数、客户端支持的协议版本号、支持的加密算法
2. 服务端确认使用的协议、加密算法，服务器发送一个随机数、数字证书
3. 客户端确认数字证书有效性（是否过期、是否是可信机构颁发）,有效的话则取出证书中的公钥，客户端再次生成一个随机数，用共钥加密这个随机数，发送给服务器
4. 服务器用私钥解密这个随机数
5. 客户端和服务器用三个随机数生成一个对话密钥（session key），这个session key用来加密真正的内容
6. 防止消息被篡改：数据发送方会用对话密钥将发送的内容进行加密，生成一个验证码连同数据一起发送，接收方接收数据后也会对数据加密，如果发现验证码不一样则说明数据被篡改了

##### 三个随机数的作用

​	由于证书中的公钥是静态的，因此需要一种机制来保证对话密钥的随机性，计算机貌似不能产生真正的随机，而是伪随机，但是三个伪随机就十分接近真正的随机了	

​	

































































