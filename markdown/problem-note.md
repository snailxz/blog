# 问题笔记


### 1. vue webpack 官方 2.0+ 单页面脚手架 添加 scss 编译 
> 只需安装 node-sass sass-loader 无需其他配置, 参考地址[https://segmentfault.com/a/1190000009802725](https://segmentfault.com/a/1190000009802725)

### 2. prerender-spa-plugin 预渲染插件安装出错问题
> [https://www.jianshu.com/p/a89d8d6c007b](https://www.jianshu.com/p/a89d8d6c007b)

### 3. 跨域获取 response headers
> 接口跨域时，getResponseHeader 只能获取到固定的几个值， 如果想获取自定义的，返回头得加上 Access-Control-Expose-Headers: xxx 字段, xxx 就是想获取的字段名称，值为多个时用逗号隔开

### 4. https 页面请求 http 接口，http 页面请求 https 接口
> 以上两种方式都是不行的，浏览器会拦截请求

### 5. http 页面缓存问题
> 使用 http 协议访问资源时，会遇到 cdn 缓存问题，https 就不会

### 6. 轮播组件开发遇到的问题
> 在开发轮播组件时，为了省事在 `touchstart` 时，直接将 `e.targetTouches[0]` 进行了保存，然后在 `touchmove` 中使用，代码如下：

```javascript
    // 只贴了部分重要代码
    
    // touchstart
    start (e) {
        if (e.type === 'touchstart') {
            this.Touches = e.targetTouches[0]
        }
    }
    
    // touchmove
    move (e) {
        let moveX = e.targetTouches[0].pageX - this.Touches.pageX
        let moveY = e.targetTouches[0].pageY - this.Touches.pageY
    }
```

> 在一般浏览器中是没有问题的，但是在较老的浏览器 例如 ios9 safari 中就会出现问题，问题表现在 `touchmove` 时 `e.targetTouches[0].pageX` 总是和之前保存的 `this.Touches.pageX` 相等，猜测应该是对象内存指向的问题，低版本的 start 和 move 的 targetTouches 修改的是同一个对象，也有可能不是这个原因，本次重在修改bug，具体的以后知道了再来修改原因。修改方式是将 `touchstart` 中的 `e.targetTouches[0].pageX` 和 `e.targetTouches[0].pageY` 单独保存，这样就脱离了原先的对象，代码如下：

```javascript
    // 同样 只贴了部分重要代码
    
    // touchstart
    start (e) {
        if (e.type === 'touchstart') {
            this.Touches.pageX = e.targetTouches[0].pageX
            this.Touches.pageY = e.targetTouches[0].pageY
        }
    }
    
    // touchmove
    move (e) {
        let moveX = e.targetTouches[0].pageX - this.Touches.pageX
        let moveY = e.targetTouches[0].pageY - this.Touches.pageY
    }
```

> 另外在 `touchend` 时，`targetTouches` 会为空，此时应该取 `changedTouches` 的值

### 7. position:sticky 定位问题

> 使用 `position:sticky` 定位时，所有父级包含父级的父级都不能使用 BFC 清除浮动，否则会使定位失效

### 8.快速删除一条数组的一项
```javascript
Array.splice(Array.findIndex(item => item == anyObj-or-string), 1)
```
### 9.返回符合条件的数组
```javascript
this.mailList.filter(item => item.id === id)
```
### 10.js千分位
```javascript
let num = 100000
num.toLocaleString()   // 100,000
```
### 11.svg 动态颜色
> 主要使用 `currentColor` 动态样式
相关链接 [https://www.zhangxinxu.com/wordpress/2014/10/currentcolor-css3-powerful-css-keyword/](https://www.zhangxinxu.com/wordpress/2014/10/currentcolor-css3-powerful-css-keyword/)

```css
.icon {
  fill: #FCEC55;
  color: #FCEC55;
}
```
```html
<g id="政务服务" transform="translate(0.500000, 0.500000)" fill="currentColor" fill-rule="nonzero">
</g>
```
### 12.canvas 颜色渐变 `createLinearGradient`
```javascript
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

const grd = ctx.createLinearGradient(0,0,170,0);
      grd.addColorStop(0, '#000');
      grd.addColorStop(1, 'red');
    
ctx.beginPath();  // 开始绘制线条，若不使用beginPath，则不能绘制多条线条
ctx.moveTo( 100, 50 ); 
ctx.quadraticCurveTo( 100, 200, 300, 200); // 贝塞尔曲线
    
ctx.lineWidth = 9;  // 设置线条宽度
ctx.strokeStyle = grd;  // 设置线条颜色
ctx.stroke();  // 用于绘制线条
```
### 13.npm查看全局安装过的包
```bash
npm list -g --depth 0
```

### 14.`post-git` git修改提示
[https://github.com/dahlbyk/posh-git](https://github.com/dahlbyk/posh-git)

### 15. js Date() 对象常用方法
```javascript
getDate()  // 返回一个月的某一天
getDay()  // 返回一周的某一天 0:星期天 1: 星期一
getFullYear()	// 从 Date 对象以四位数字返回年份。
getHours()	// 返回 Date 对象的小时 (0 ~ 23)。
getMilliseconds()	// 返回 Date 对象的毫秒(0 ~ 999)。
getMinutes()	// 返回 Date 对象的分钟 (0 ~ 59)。
getMonth()	// 从 Date 对象返回月份 (0 ~ 11)。
getSeconds()	// 返回 Date 对象的秒数 (0 ~ 59)。
getTime()	// 返回 1970 年 1 月 1 日至今的毫秒数。
getTimezoneOffset()	// 返回本地时间与格林威治标准时间 (GMT) 的分钟差。
getUTCDate()	// 根据世界时从 Date 对象返回月中的一天 (1 ~ 31)。
getUTCDay()	// 根据世界时从 Date 对象返回周中的一天 (0 ~ 6)。
getUTCFullYear()	// 根据世界时从 Date 对象返回四位数的年份。
getUTCHours()	// 根据世界时返回 Date 对象的小时 (0 ~ 23)。
getUTCMilliseconds()	// 根据世界时返回 Date 对象的毫秒(0 ~ 999)。
getUTCMinutes()	// 根据世界时返回 Date 对象的分钟 (0 ~ 59)。
getUTCMonth()	// 根据世界时从 Date 对象返回月份 (0 ~ 11)。
getUTCSeconds()	// 根据世界时返回 Date 对象的秒钟 (0 ~ 59)。
getYear()	// 已废弃。 请使用 getFullYear() 方法代替。
parse()	// 返回1970年1月1日午夜到指定日期（字符串）的毫秒数。
setDate()	// 设置 Date 对象中月的某一天 (1 ~ 31)。
setFullYear()	// 设置 Date 对象中的年份（四位数字）。
setHours()	// 设置 Date 对象中的小时 (0 ~ 23)。
setMilliseconds()	// 设置 Date 对象中的毫秒 (0 ~ 999)。
setMinutes()	// 设置 Date 对象中的分钟 (0 ~ 59)。
setMonth()	// 设置 Date 对象中月份 (0 ~ 11)。
setSeconds()	// 设置 Date 对象中的秒钟 (0 ~ 59)。
setTime()	// setTime() 方法以毫秒设置 Date 对象。
setUTCDate()	// 根据世界时设置 Date 对象中月份的一天 (1 ~ 31)。
setUTCFullYear()	// 根据世界时设置 Date 对象中的年份（四位数字）。
setUTCHours()	// 根据世界时设置 Date 对象中的小时 (0 ~ 23)。
setUTCMilliseconds()	// 根据世界时设置 Date 对象中的毫秒 (0 ~ 999)。
setUTCMinutes()	// 根据世界时设置 Date 对象中的分钟 (0 ~ 59)。
setUTCMonth()	// 根据世界时设置 Date 对象中的月份 (0 ~ 11)。
setUTCSeconds()	// setUTCSeconds() 方法用于根据世界时 (UTC) 设置指定时间的秒字段。
setYear()	// 已废弃。请使用 setFullYear() 方法代替。
toDateString()	// 把 Date 对象的日期部分转换为字符串。
toGMTString()	// 已废弃。请使用 toUTCString() 方法代替。
toISOString()	// 使用 ISO 标准返回字符串的日期格式。
toJSON()	// 以 JSON 数据格式返回日期字符串。
toLocaleDateString()	// 根据本地时间格式，把 Date 对象的日期部分转换为字符串。 "2019/3/9"
toLocaleTimeString()	// 根据本地时间格式，把 Date 对象的时间部分转换为字符串。 "上午11:02:45"
toLocaleString()	// 据本地时间格式，把 Date 对象转换为字符串。 "2019/3/9 上午11:01:56"
toString()	// 把 Date 对象转换为字符串。 "Sat Mar 09 2019 11:03:24 GMT+0800 (中国标准时间)"
toTimeString()	// 把 Date 对象的时间部分转换为字符串。 "11:03:41 GMT+0800 (中国标准时间)"
toUTCString()	// 根据世界时，把 Date 对象转换为字符串。
UTC()	// 根据世界时返回 1970 年 1 月 1 日 到指定日期的毫秒数。
valueOf()	// 返回 Date 对象的原始值。  1552100644155

```

### 16.数据扁平化(带去重)
```javascript
Array.from(new Set(arr.flat(Infinity))).sort((a,b)=>{ return a-b})
```
> flat(depth) 扁平化方法 参数可以是数字表示扁平化深度，也可以是Infinity 扁平化所有
> Array.from(arr) 将结构化数据转成数组

### 17.判断js浮点数是否相等
```javascript
console.log(Math.abs(0.1 + 0.2 - 0.3) <= Number.EPSILON)
// true
```
### 18.兼容腻子汇总

[https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills](https://github.com/Modernizr/Modernizr/wiki/HTML5-Cross-browser-Polyfills)

### 19.一份详细的 canvas 中文文档
[https://www.canvasapi.cn/](https://www.canvasapi.cn/)

### 20. contenteditable
全局属性 `contenteditable`  是一个枚举属性，表示元素是否可被用户编辑。 如果可以，浏览器会修改元素的部件以允许编辑。

### 21. 给页面每个元素加1px边框
```javascript
[].forEach.call($$('*'), function(a) {
    a.style.border = "1px solid #" + (~~(Math.random()*(1<<24))).toString(16);
});
```

### 22. `IntersectionObserver` 监听元素是否进入可视区域

### 23. `-webkit-overflow-scrolling: touch` ios滚动缓冲效果


### 24. `svn add . --no-ignore --force` svn add 全部文件命令
