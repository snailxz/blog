# DOCTYPE 详解

**DOCTYPE 是 document type (文档类型的）的简写。用来说明你用的`XHTML`或`HTML`是什么版本。**

> <!DOCTYPE> 声明必须是 HTML 文档的第一行，位于 <html> 标签之前。<br/><!DOCTYPE> 声明不是 HTML 标签；它是指示 web 浏览器关于页面使用哪个 HTML 版本进行编写的指令。<br/>在 HTML 4.01 中<!DOCTYPE> 声明引用 DTD，因为 HTML 4.01 基于 SGML。DTD 规定了标记语言的规则，这样浏览器才能正确地呈现内容。<br/>HTML5 不基于 SGML，所以不需要引用 DTD。


## document.compatMode
**`document.compatMode` 可以获取当前页面是以哪种模式渲染的。**

当声明 DOCTYPE 并且 DOCTYPE 声明正确时，浏览器会以 DOCTYPE 中声明的模式对页面进行渲染，称为`标准模式`，此时 `document.compatMode` 的值为 `CSS1Compat`；

未声名 DOCTYPE 或者 DOCTYPE 声明错误时，浏览器则以自己的方式渲染页面，不同的浏览器就会出现差别，称为`怪癖模式`，此时 `document.compatMode` 的值为 `BackCompat`。

**提示：html 中 <!DOCTYPE> 声明对大小写不敏感**

## 常用的 HTML DOCTYPE 声明

#### HTML 5
因为 [HTML 5标准放弃了与 SGML 的兼容](https://www.w3.org/TR/html5-diff/#doctype)，所以其实不需要在文档开头引用 DTD，保留 DOCTYPE 是为了保证与旧浏览器的兼容。之所以选用 <!DOCTYPE html> 是因为这个声明格式在当前所有的浏览器（IE、FF、Opera、Safar等，即使没有实现 HTML 5）下都会以标准模式渲染并且长度最短。

```html
<!DOCTYPE html>
```

#### HTML 4.01 Strict (严格模式)
该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
```

#### HTML 4.01 Transitional (过渡模式)
该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
```

#### HTML 4.01 Frameset (框架模式)
该 DTD 等同于 HTML 4.01 Transitional，但允许框架集内容。
```html
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">
```

## 常用的 XHTML DOCTYPE 声明

#### XHTML 1.0 Strict (严格模式)
该 DTD 包含所有 HTML 元素和属性，但不包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。必须以格式正确的 XML 来编写标记。
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
```

#### XHTML 1.0 Transitional (过渡模式)
该 DTD 包含所有 HTML 元素和属性，包括展示性的和弃用的元素（比如 font）。不允许框架集（Framesets）。必须以格式正确的 XML 来编写标记。
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
```

#### XHTML 1.0 Frameset (框架模式)
该 DTD 等同于 XHTML 1.0 Transitional，但允许框架集内容。
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">
```

#### XHTML 1.1
该 DTD 等同于 XHTML 1.0 Strict，但允许添加模型（例如提供对东亚语系的 ruby 支持）。
```html
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
```

## 区别

#### 1. 元素 width
标准模式：width是内容（content）宽度，元素真正的宽度是外边距、内边距、边框宽度的和，即元素宽度 = width + 左右border + 左右padding + 左右margin  
怪癖模式：width则是元素的实际宽度 width = 内容(content)宽度 + 左右border + 左右padding。

题外话：IE盒子模型中：盒子总宽度 ＝ width + margin

#### 2. 行内元素的高宽
标准模式：给span等行内元素设置wdith和height都不会生效  
怪癖模式：会生效

#### 3. 可设置百分比的高度
在标准模式下，一个元素的高度由其包含的内容content决定，如果父元素没有设置高度，子元素设置一个百分比高度是无效的。

#### 4. 用margin : 0 auto设置水平居中
标准模式： 可以水平居中
怪癖模式： 无效，可以设置text-align： center来实现居中

#### 5. 怪异模式下设置图片的padding会失效

#### 6. 怪异模式下table中的字体属性不能继承上层的设置

#### 7. 元素溢出的处理
标准模式： overflow 默认取 visible  
怪癖模式： 溢出会被当做扩展box来对待，溢出不会裁减，元素框自动调整大小，能够包含溢出内容。

**除此之外还有很多样式上的区别 例如： !important会在ie7、ie8 下失效，white-space:pre 会失效等等**

<br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/><br/>

文档参考地址:

[https://blog.csdn.net/xujie_0311/article/details/42044277](https://blog.csdn.net/xujie_0311/article/details/42044277)<br/>
[https://www.cnblogs.com/jenry/archive/2013/01/05/2846557.html](https://www.cnblogs.com/jenry/archive/2013/01/05/2846557.html)<br/>
[http://www.w3school.com.cn/tags/tag_doctype.asp](http://www.w3school.com.cn/tags/tag_doctype.asp)<br/>
[https://www.w3.org/TR/html5-diff/#doctype](https://www.w3.org/TR/html5-diff/#doctype)<br/>
[https://hsivonen.fi/doctype/](https://hsivonen.fi/doctype/)
<br/><br/><br/><br/><br/><br/>