# 自己动手实现图片懒加载

## 实现
这两天在重构app上的一个一级页面，为了提高首屏渲染的时间，所以加上了图片懒加载，大概原理就是：接口拿到数据渲染 DOM 时 img 的 src 统一给一个默认的 dft.png，真实的地址写在 data-imgUrl 里，然后监听页面滚动事件，判断 img 是否在窗口内，然后替换成真实的地址，具体代码如下：

```html
<img src="../../images/public/dft.png" data-imgUrl="../../images/find/new/200x300.png">
```

```javascript
function LazyLoadImg() {
    var mainH = document.documentElement.clientHeight
    var imgList = document.querySelectorAll('img')
    for (var i = 0; i < imgList.length; i++) {
        var urlS = imgList[i].dataset.imgurl
        var srcS = imgList[i].getAttribute('src')
        var thisTop = imgList[i].getBoundingClientRect().top
        if (!!urlS && urlS !== srcS && thisTop <= mainH) {
            imgList[i].setAttribute('src', urlS)
        }
    }
}

window.addEventListener('scroll', LazyLoadImg)
```

这样一个简单的懒加载器就完成了，但是我们的实现还太简单，按照上边的写法，我们刚进入页面的时候首屏的图片是不会显示的，所以我们要在进入页面时手动调用一次懒加载方法：
```javascript
LazyLoadImg()
```
但是我们的页面数据是用 ajax 异步请求的，而且是多个接口，想了一下有这几个实现方式：
1. 每个接口成功后，在 ajax success 里都调用一次`LazyLoadImg` 方法
2. 将请求合并在一个方法里，统一使用一个成功回掉
3. 每次的接口请求其实都要将数据渲染在DOM上，可以通过监听DOM变化，来触发`LazyLoadImg`

用第一种方式，感觉每次都要写不是很方便；第二种的话是挺方便，但是耦合度太高扩展性不够好，不利于后期的维护；那就剩下最后一种方法了；于是在网上找了一下，果然有原生的api可以用。

## MutationObserver 监听
> MDN: MutationObserver给开发者们提供了一种能在某个范围内的DOM树发生变化时作出适当反应的能力.该API设计用来替换掉在DOM3事件规范中引入的Mutation事件.

该构造函数用来实例化一个新的Mutation观察者对象.
```javascript
new MutationObserver(
  function callback
)
```
callbak 是要回调的方法

`MutationObserver` 对象的 `observe` 方法接受两个参数 `target` 和 `options `。其中第一个参数为要监听的DOM对象，如<body>、.class、#id等；第二个参数是观察变化的类型，具体有：
1. childList: true          是否观察子节点
2. attributes: true         是否观察节点属性的变化
3. characterData: true      是否观察文本或注释的变化
4. subtree: true            是否观察所有后代节点
5. attributeOldValue: true	在attributes属性已经设为true的前提下,如果需要将发生变化的属性节点之前的属性值记录下来(记录到下面MutationRecord对象的oldValue属性中),则设置为true
6. characterDataOldValue: true	在characterData属性已经设为true的前提下,如果需要将发生变化的characterData节点之前的文本内容记录下来(记录到下面MutationRecord对象的oldValue属性中),则设置为true
7. attributeFilter: ['class', 'src'] 观察数组中的属性变化

写法如下：
```javascript
var observer = new MutationObserver(
  function callback
);
observer.observe(document.querySelector("body"), {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true,
    attributeOldValue: true,
    characterDataOldValue: true,
    attributeFilter: ['class', 'src']
);
```
应用到我们的懒加载里，我们只需要监听body里边的所有节点的变化,具体实现：
```javascript
var titleEl = document.querySelector("body");
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var MutationObserverConfig = {
    childList: true,
    subtree: true
};
var observer = new MutationObserver(function (mutations) {
    LazyLoad = true
    LazyLoadImg()
});
observer.observe(titleEl, MutationObserverConfig);
```
但是这样写就够了么，too simple，要知道我们的js是要跑在 `webview` 里的，你永远不知道 `webview` 的性能有多差，所以能优化的还是要优化一下滴。

## 优化

我们上边的代码执行后，`window.onscroll` 只要在滚动的时候就会触发懒加载，如果频率过快就会卡顿，所以可以通过减少触发次数来拯救我们的性能，结合 `setTimeout` 来降低触发频率：
```javascript
// 为了性能
var LazyLoadImgTimeout = null
function LazyLoadImg() {
    if (LazyLoadImgTimeout) {
        clearTimeout(LazyLoadImgTimeout)
    }
    LazyLoadImgTimeout = setTimeout(function () {
        var mainH = document.documentElement.clientHeight
        var imgList = document.querySelectorAll('img')
        for (var i = 0; i < imgList.length; i++) {
            var urlS = imgList[i].dataset.imgurl
            var srcS = imgList[i].getAttribute('src')
            var thisTop = imgList[i].getBoundingClientRect().top
            if (!!urlS && urlS !== srcS && thisTop <= mainH) {
                imgList[i].setAttribute('src', urlS)
            }
        }
    }, 100);
}
```
这样就可以保证 `window.onscroll` 事件不会频繁触发懒加载了。

但是，这样真的够了么，too naive，我们的 js 可是要跑在 5 年前安卓手机的 `webview` 上的。

## 继续优化

仔细观察上边代码会发现，即使整个页面的所有图片都已经加载完成， `window.onscroll` 还是会继续触发懒加载，所以我们需要在整个页面的图片都加载完成后，停止对 `scroll` 事件的监听。

```javascript
// 为了性能
var LazyLoadImgTimeout = null
var LazyLoad = true
var LazyLoadNum = 0
function LazyLoadImg() {
    if (LazyLoad) {
        if (LazyLoadImgTimeout) {
            clearTimeout(LazyLoadImgTimeout)
        }
        LazyLoadImgTimeout = setTimeout(function () {
            LazyLoad = false
            var mainH = document.documentElement.clientHeight
            var imgList = document.querySelectorAll('img')
            for (var i = 0; i < imgList.length; i++) {
                var urlS = imgList[i].dataset.imgurl
                var srcS = imgList[i].getAttribute('src')
                if (!!urlS && urlS !== srcS) {
                    var thisTop = imgList[i].getBoundingClientRect().top
                    if (thisTop <= mainH) {
                        imgList[i].setAttribute('src', urlS)
                        LazyLoadNum++
                    } else {
                        LazyLoad = true
                    }
                }
            }
        }, 100);
    } else {
        console.log('页面当前所有图片懒加载完成，一共:', LazyLoadNum, '张图片')
        window.removeEventListener('scroll', LazyLoadImg)
    }
}
```
这样还存在一个问题，万一用户操作或者别的什么东西，导致又有图片需要懒加载了呢？其实我们可以将绑定监听事件写在 `MutationObserver` 里，这样就解决了。
贴一下完整代码：
```javascript
/**
 * img 懒加载
 */
(function (window) {
    var LazyLoadImgTimeout = null
    var LazyLoad = true
    var LazyLoadNum = 0
    function LazyLoadImg() {
        if (LazyLoad) {
            // 为了性能
            if (LazyLoadImgTimeout) {
                clearTimeout(LazyLoadImgTimeout)
            }
            LazyLoadImgTimeout = setTimeout(function () {
                LazyLoad = false
                var mainH = document.documentElement.clientHeight
                var imgList = document.querySelectorAll('img')
                for (var i = 0; i < imgList.length; i++) {
                    var urlS = imgList[i].dataset.imgurl
                    var srcS = imgList[i].getAttribute('src')
                    if (!!urlS && urlS !== srcS) {
                        var thisTop = imgList[i].getBoundingClientRect().top
                        if (thisTop <= mainH) {
                            imgList[i].setAttribute('src', urlS)
                            LazyLoadNum++
                        } else {
                            LazyLoad = true
                        }
                    }
                }
            }, 100);
        } else {
            console.log('页面当前所有图片懒加载完成，一共:', LazyLoadNum, '张图片')
            window.removeEventListener('scroll', LazyLoadImg)
        }
    }
    var titleEl = document.querySelector("body");
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var MutationObserverConfig = {
        childList: true,
        subtree: true
    };
    var observer = new MutationObserver(function (mutations) {
        window.removeEventListener('scroll', LazyLoadImg)
        LazyLoad = true
        LazyLoadImg()
        window.addEventListener('scroll', LazyLoadImg)
    });
    observer.observe(titleEl, MutationObserverConfig);
})(this)
```
至此我们的图片懒加载器就完成了。

</br></br></br></br>

如有错误欢迎指正，谢谢。
</br></br></br></br>