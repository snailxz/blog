# vue 工程打包 css -webkit-box-orient 属性丢失问题

前段时间搭的新脚手架已经启用了，在使用中又发现许多小问题，今天就遇到一个。


有一个两行截断的scss:
```css
.tmp-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-top: 23px;
  font-size: 28px;
  color: #333;
}
```
结果打包出来的css少了 `z-webkit-box-orient: vertical` 这一行：
```css
.tmp-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  margin-top: 23px;
  font-size: 28px;
  color: #333;
}
```
于是查了一下，最终锁定是 `optimize-css-assets-webpack-plugin` 这个插件的问题，只要修改下 `webpack` 配置就可以解决，办法如下：

1. 注释掉 `build/webpack.prod.conf.js` 中的这几句配置
```javascript
new OptimizeCSSPlugin({
  cssProcessorOptions: config.build.productionSourceMap
    ? { safe: true, map: { inline: false } }
    : { safe: true }
}),
```
2. 在 `build/utils.js` 里边加上 `minimize: true`
```javascript
const cssLoader = {
  loader: 'css-loader',
  options: {
    sourceMap: options.sourceMap,
    minimize: true
  }
}
```

还有一种办法可以不用修改配置，只需要在 scss 里加上特定的注释就可以：
```css
.tmp-name {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  /*！ autoprefixer: off */
  -webkit-box-orient: vertical;
  /* autoprefixer: on */
  margin-top: 23px;
  font-size: 28px;
  color: #333;
}
```
