# cache manifest 离线缓存简单介绍

在做app内嵌web页面的时候，遇到首次打开白屏问题，从5s到20s甚至有时候干脆页面不显示，这对于app十个灾难，经过分析主要原因是网络差的时候静态资源加载过于缓慢，
后来提出两种解决方案
1. 将前端资源打包进app里
2. 使用h5 manifest 进行缓存

第一种因为改造成本太高，每次需求的改动即使不涉及app也要重新发包，并且对目前前端开发模式有比较大的改动，所以被否决

## cache manifest

##### 什么是 cache manifest

> cache manifest 是一个 .manifest 后缀名的文件，通过 `<html lang="en" manifest="index.manifest">` 方式引入，文件规定了缓存版本、需要缓存的文件，不需要缓存的文件。用户在访问网页时浏览器会先检查 manifest 文件中的缓存配置，如果有改动就会根据配置下载新的配置文件缓存在浏览器的 cache 目录，如果没有改动过，就直接从 cache 目录加载 所缓存的内容，不经过网络，从而使网页加载的速度更快、减少服务器的请求压力，在没网的时候，浏览器也可以加载资源，配合接口 localStorage 达到离线访问的效果。

### manifest配置介绍

先来看一个完整的缓存清单文件 index.manifest

```
CACHE MANIFEST
# v1 2011-08-14

CACHE:
./index.html
http://test.com/style.css
/images/image1.png

NETWORK:
index.js

FALLBACK:
/ 404.html
```

其中第一行 `CACHE MANIFEST` 是固定写法，它告诉浏览器这是一个 cache manifest 文件，浏览器才会做相应的处理

接下来一行是混存文件的版本，我们的新工程是 webpack 自动打包的，所以这里我设置成了时间戳

`CACHE` 下边就是我们需要缓存的文件地址，这个地址可以是相对的也可以是绝对的


`NETWORK` 告诉浏览器这些文件不要咬缓存，必须每次都从网络上下载

`FALLBACK` 规定了资源链接出问题时的替代方案，相当于404页面

### 如何更新缓存

1. 更新 .manifest 文件
2. 通过js `window.applicationCache.update()` 来更新
3. 清空浏览器缓存

### 注意事项

1. 缓存在更新后在下一次访问页面时才会生效，如果想要立即生效请使用 `window.applicationCache.swapCache()`
2. html文件 和 FALLBACK 中的文件，必须和 .manifest 在同一个域
3. 如果 manifest 中一个资源加载出错，则本次混存全部失败，浏览器会继续使用老的缓存


### 参考地址
[https://developer.mozilla.org/zh-CN/docs/Web/HTML/Using_the_application_cache](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Using_the_application_cache)

