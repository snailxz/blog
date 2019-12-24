# canvas 仿知乎登录页背景

> 每当我们登陆知乎的时候就会看到这样一幅画面, 当然不是让你看输入框，而是背景那若隐若现的许多点，仔细看的话还会发现，临近的点都是被线连起来的，看到这不禁感叹，知乎不愧是一帮年入百万大佬的聚居地啊，登录页面果然逼格高

![image](/images/notes/2017-5-25-001.png)

> 感叹的同时，想想自己是否也可以年入百万呢~~~~~ 做梦啦。。。
> 但是虽然不能年入百万，自己仿写一个逼格满满的登录背景还是可以的，练着练着不一定真的会升职加薪哦

---

## 分析

**拿到问题先分析一下情况，埋头就开始敲很容易导致重头再来**

首先，我们肯定是要用 canvas 作为 绘制动画的基础，然后观察每个点的外观，每个点具有不同大小，不同的位置，还会移动，而且每个点移动的速度和方向都是不一样的。由此我们可以得出，一个点应该具有 大小（r）、位置（x和y）、移动速度（mx和my）这几个参数,你会发现少了之前所说的运动方向参数，这是因为方向完全可以由速度的正、负来体现，因为我们计算位置的基础是像素，所以你给了一个负方向的值，它就会向向相反的方向移动。

---

## 敲码

**分析完我们就可以动手实践了**

### 1.画点

写之前我们先考虑好应该注意的全局要素，页面宽高，当页面大小改变时canvas也应该重绘，先创建好所需要的全局变量。


```javascript
var canvas = document.createElement('canvas'); // canvas
    canvas.id = 'mycanvas';
    canvas.style.position = "absolute";
    canvas.style.zIndex = "-1";
    document.body.appendChild(canvas);
var width,height; // 宽高
var num = 60; // 圆个数
var ctx = canvas.getContext('2d'); // canvas绘画对象
var digit = [];  // 点的数据
var dpr = window.devicePixelRatio || 1;  // 移动端显示优化
	
```
首先创建canvas标签，然后设置样式，num 是自定义要显示点的个数，digit 是储存点数据的数组，window.devicePixelRatio 是获取设备像素比，这到底是什么东西我们不深究，只要知道它是为了让canvas在移动设备上显示更清晰的就行了，

基本参数给齐，继续往下写


```javascript
function start() {
    width = window.innerWidth * dpr;
    height = window.innerHeight * dpr;
    canvas.width = width;
    canvas.height = height;
    digit = generateNum();
    draw(digit);
}

// 创建每个点的位置 半径 位移
function generateNum () {
    var arr = []
    for (let i = 0; i < num; i++) {
    	var list = {};
    	list.x = Math.random() * width;
    	list.y = Math.random() * height;
    	list.r = Math.random() * 15;
    	list.mx = (0.6 - Math.random())/2;
    	list.my = (0.6 - Math.random())/2;
    	arr.push(list);
    }
    return arr;
}
// 画点
function draw () {
    ctx.clearRect(0, 0, width, height); //清空画布
    ctx.fillStyle = "#eee";
    for (let i = 0; i < digit.length; i++) {
    	ctx.beginPath();
    	ctx.arc(digit[i].x, digit[i].y, digit[i].r, 0, Math.PI*2, true);
    	ctx.closePath();
    	ctx.fill();
    }
}
```

start() 里边获取了窗口大小，并乘以之前的设备像素比作为canvas的宽高，这样就保证了移动设备的清晰度，有人问了，这样canvas不就比网页还要大了么，确实在移动设备上是这样，因为移动设备的设备像素比基本都比1大，但是我们可以使用css来保证canvas和窗口保持一样的大小。

> js 中设置的 canvas.width 和 html 中 canvas 上设置的 width 是 canvas 的实际大小，和css大小没有关系。就好比图片实际大小和网页中展示的大小一样。

generateNum() 生成点信息数组，里边包含刚才所提到的所有参数，Math.random() * width 和 Math.random() * height 保证点的位置不会超出画布范围，mx,my 按照预想的可能输出负数，代表反方向。

draw() 主要是画点 循环遍历 digit 数组中每个对象的属性，然后画出。


**现在我们就能得到如下一个页面了**

![image](/images/notes/2017-5-25-002.png)

### 2.画线

点已经画好了，现在就让我们来画线吧

先分析线是怎么形成的，仔细观察我们就能发现，其实线就是一定距离以内的点相连，这个距离是多少呢，一般不要太长也不要太短，我们就取 width/7 这个值就行了，当然你也可以根据喜好自己设置，但是注意不要设置数字，不然大小屏幕其中有一个就会线太多或者太少。

```javascript
// 画线
function drawline () {
    for (let i = 0; i < digit.length; i++) {
    
        for (let j = i + 1; j < digit.length; j++) {
            var rangex = Math.abs(digit[i].x - digit[j].x);
            var rangey = Math.abs(digit[i].y - digit[j].y);
            
            if (rangexx < width/7 && rangey < width/7) {
                ctx.strokeStyle="#f0f0f0";
                ctx.beginPath();
                ctx.moveTo(digit[i].x, digit[i].y);
                ctx.lineTo(digit[j].x, digit[j].y);
                ctx.stroke();
            }
            
        }
    }
}
```

具体实现就是这样，我这里判断的是点之间的横纵坐标距离同时小于 width/7 ，你也可以根据横纵坐标用勾股定理算出他们的直线距离做判断，然后我们将满足条件的点连接起来。

**连好线之后是这样的**

![image](/images/notes/2017-5-25-003.png)

### 3.动画

所有静态的元素都创建完后，我们就要开始要让它动起来了，要让元素动起来其实就是让它不断刷新重画，然后根据相应参数进行移动，话不多说看代码。

```javascript

//更新点位置
function updata () {
    for (let i = 0; i < digit.length; i++) {
        digit[i].x = digit[i].x + digit[i].mx;
        digit[i].y = digit[i].y + digit[i].my;
        
        if (digit[i].x < 0 || digit[i].y < 0 || digit[i].x > width || digit[i].y > height) {
            digit[i].x = Math.random() * width;
            digit[i].y = Math.random() * height;
        }
    }
}

```

更新位置函数已经写好，其重要注意的是里边 if ，它是判断当点移动到画布外时赋予它新的位置，不然画布最终将变成空的。接下来就是把它们放到定时器里边，让它不断刷新。

```javascript
// 刷新动画
setInterval(function () {
    draw();
    drawline();
    updata();
}, 16)

```

**最终效果如下**

线比较细，GIF可能看不清楚

![image](/images/notes/2017-5-25-004.gif)

### 4.更高逼格

为了逼格更高，我们再加一个鼠标 hover 效果，即当鼠标移动到网页上时，在鼠标位置出现一个点，这个点不移动，但会和离得近的点连线,具体实现如下。

```javascript
// 鼠标指针
function showMouseStart (e) {
    var arr = {};
    arr.x = e.clientX;
    arr.y = e.clientY;
    arr.r = 10;
    arr.mx = 0;
    arr. my = 0;
    if(digit[num]){
        digit[num].x = arr.x;
        digit[num].y = arr.y;
        digit[num].r = arr.r;
        digit[num].mx = arr.mx;
        digit[num].my = arr.my;
    }else{
        digit.push(arr);
    }
}

// 鼠标 hover 事件
document.addEventListener('mousemove',showMouseStart,true);
```

**至此我们逼格满满的 canvas 动画就已经完成，是不是感觉很炫呢，赶紧动手实践一下吧**