# 带缩放的轮播组建开发

夏天是一个躁动的季节，在季节的尾声，我们客户端又迎来的新的版本需求，这次的版本ui以圆角为主题，神奇的竟和京东app类似（手动滑稽🙈），于是我们的轮播效果也理所应当的和别人同步了🤣

先来一个效果图，和京东首页的轮播效果差不多

![image](/images/notes/2018-09-12-001.gif)

刚开始本着拿来主义在网上找了一圈，都没有特别合适的。因为我们需要在webview里边跑，兼容性几乎可以不用考虑，但是性能和size还是有点要求，所以拿不来只能自己写了。

仔细观察上边的 gif 图，可以看到其实这种轮播效果比平时的轮播就多了一个缩放的效果，然后放大的那个图片相对整个轮播有个据下定位的效果，这个我们可以用 `transform-origin` 和 `transform: scale3d` 来轻松实现，一下是各种尺寸效果图：

![image](/images/notes/2018-09-12-002.png)


还有循环轮播的效果，主要就是轮播前后放几个过渡用的 copy，因为我们效果是右边会显示下一个的一部分，所以最后边需要copy两个，效果如下：

![image](/images/notes/2018-09-12-003.png)

## 代码

#### js
我直接写的es6，之后用 gulp-babel 转成 es5 的
```javascript
class leadSlider {
    constructor (params) {
        this.container = document.querySelector(params.box),
        this.slide = this.container.querySelectorAll(params.item)
        this.leftMargin = parseFloat(window.getComputedStyle(this.slide[0]).getPropertyValue("margin-left"))
        this.slideOWidth = this.slide[0].clientWidth + this.leftMargin
        params.zoom = Number((1/params.zoom).toFixed(2))
        if (this.slide.length <= 1) {
            params.zoom = (((params.zoom - 1) * this.slide[0].clientWidth / 2) + this.slideOWidth) / this.slide[0].clientWidth
            params.zoom = params.zoom.toFixed(2)
            this.container.setAttribute('style', 'justify-content: center; -webkit-justify-content: center;')
            this.slide[0].setAttribute('style', `margin-left: 0;transform:scale3d(${params.zoom}, ${params.zoom}, 1);-webkit-transform:scale3d(${params.zoom}, ${params.zoom}, 1);`)
        } else {
            this.startX = 0
            this.canMove = 1
            this.Touches = {
                pageX: 0,
                pageY: 0
            }
            this.slideIndex = params.slide || 1
            if (this.slideIndex > this.slide.length) {
                this.slideIndex = 1
            }
            this.slideOldIndex = 0
            this.params = params
            this.container.appendChild(this.slide[0].cloneNode(true))
            this.container.appendChild(this.slide[1].cloneNode(true))
            this.container.insertBefore(this.slide[this.slide.length - 1].cloneNode(true), this.container.childNodes[0])
            this.slide = this.container.querySelectorAll(params.item)
            this.setTransform(0, 0, false)
            setTimeout(() => {
                this.setTransform(0, 0, true)
                this.autoSlide = this.autoAnimate()
            }, 0)
            this.container.addEventListener('touchstart', this.start.bind(this), false)
            this.container.addEventListener('touchmove', this.move.bind(this), false)
            this.container.addEventListener('touchend', this.end.bind(this), false)
            this.container.addEventListener('touchcancel', this.end.bind(this))
        }
    }
    autoAnimate () {
        return setInterval(() => {
            this.slideIndex++
            this.setTransform(0, 0, true)
            if (this.slideIndex > this.slide.length - 3) {
                setTimeout(()=> {
                    this.slideIndex = this.slideIndex % (this.slide.length - 3)
                    this.setTransform(0, 0, false)
                }, this.params.speed)
            }
        }, this.params.overTime)
    }
    setTransform (x, enlarge, ifOn) {
        this.writeSlideStyle(this.slide[this.slideIndex], enlarge === 0 ? this.params.zoom : this.params.zoom - enlarge, ifOn)
        if (x < 0) {
            if (this.slide[this.slideIndex - 1]) {
                this.writeSlideStyle(this.slide[this.slideIndex - 1], 1, ifOn)
            }
            if (this.slide[this.slideIndex + 1]) {
                this.writeSlideStyle(this.slide[this.slideIndex + 1], enlarge === 0 ? 1 : 1 + enlarge, ifOn)
            }
            if (this.slide[this.slideIndex + 2]) {
                this.writeSlideStyle(this.slide[this.slideIndex + 2], 1, ifOn)
            }
        } else if (x > 0) {
            if (this.slide[this.slideIndex - 1]) {
                this.writeSlideStyle(this.slide[this.slideIndex - 1], enlarge === 0 ? 1 : 1 + enlarge, ifOn)
            }
            if (this.slide[this.slideIndex + 1]) {
                this.writeSlideStyle(this.slide[this.slideIndex + 1], 1, ifOn)
            }
        } else if (x === 0) {
            if (this.slide[this.slideIndex - 1]) {
                this.writeSlideStyle(this.slide[this.slideIndex - 1], 1, ifOn)
            }
            if (this.slide[this.slideIndex + 1]) {
                this.writeSlideStyle(this.slide[this.slideIndex + 1], 1, ifOn)
            }
            if (this.slide[this.slideIndex + 2]) {
                this.writeSlideStyle(this.slide[this.slideIndex + 2], 1, ifOn)
            }
        }

        this.container.setAttribute('style', `transform: translate3d(${-this.slideOWidth * this.slideIndex + x}px, 0, 0);-webKit-transform: translate3d(${-this.slideOWidth * this.slideIndex + x}px, 0, 0);${ifOn && 'transition: all ' + this.params.speed + 'ms; -webkit-transition: all ' + this.params.speed + 'ms;'}`)

        if (ifOn) {
            let index = this.slideIndex === 0 ? 0 : this.slideIndex % (this.slide.length -3)
            if (index === 0) index = this.slide.length - 3
            typeof this.params.onChange === 'function' && this.params.onChange(index - 1)
        }
    }
    writeSlideStyle (tag, enlarge, ifOn) {
        enlarge = enlarge > 1 ? enlarge.toFixed(3) : enlarge
        if (enlarge === 1) {
            tag.setAttribute('style', `${ifOn && 'transition: all ' + this.params.speed + 'ms; -webkit-transition: all ' + this.params.speed + 'ms;'}`)
            // tag.setAttribute('style', '')
        } else {
            tag.setAttribute('style', `transform: scale3d(${enlarge}, ${enlarge}, 1);-webkit-transform: scale3d(${enlarge}, ${enlarge}, 1);${ifOn && 'transition: all ' + this.params.speed + 'ms; -webkit-transition: all ' + this.params.speed + 'ms;'}`)
        }
    }
    start (e) {
        this.startX = parseFloat(this.container.style.cssText.match(/transform: translate3d\((\S*)px/)[1])
        if (e.type === 'touchstart') {
            this.Touches.pageX = e.targetTouches[0].pageX
            this.Touches.pageY = e.targetTouches[0].pageY
            this.canMove = 2
        }
    }
    move (e) {
        let moveX = ~~e.targetTouches[0].pageX - ~~this.Touches.pageX
        let moveY = Math.abs(~~e.targetTouches[0].pageY - ~~this.Touches.pageY)
        if (this.canMove === 3) {
            if (e.type === 'touchmove') {
                moveX = moveX
            }
            let enlarge = (Math.abs(moveX / this.slideOWidth) * (this.params.zoom - 1)).toFixed(3) * 1
            enlarge = enlarge > (this.params.zoom - 1) ? (this.params.zoom - 1) : enlarge
            this.setTransform(moveX, enlarge, false)
            e.stopPropagation()
            e.preventDefault()
        } else if (this.canMove === 2 && (Math.abs(moveX) > 10 || Math.abs(moveY) > 10)) {
            if (Math.abs(moveX) > Math.abs(moveY)) {
                // 循环处理
                if (this.slideIndex >= this.slide.length - 2) {
                    this.slideIndex = 1
                } if (this.slideIndex < 1) {
                    this.slideIndex = this.slide.length - 3
                }
                this.slideOldIndex = this.slideIndex
                this.canMove = 3
                clearInterval(this.autoSlide)
            } else {
                this.canMove = 1
            }
        }
    }
    end (e) {
        if (this.canMove === 3) {
            this.canMove = 1
            let moveX = ~~e.changedTouches[0].pageX - ~~this.Touches.pageX
            if (moveX > this.slideOWidth / 4) {
                this.slideIndex--
            } else if (moveX < -(this.slideOWidth / 4)) {
                this.slideIndex++
            }
            this.setTransform(0, 0, true)
            this.autoSlide = this.autoAnimate()
        }
    }
}
```

#### html
主要为了看效果，写的很乱

```html
<!DOCTYPE html>
<html lang="zh-cn">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>test</title>
	<style>
		* {
			margin: 0;
			padding: 0;
		}
		html, body {
			height: 100%;
		}
		.main {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-align: center;
			-webkit-align-items: center;
			-ms-flex-align: center;
			align-items: center;
			-webkit-flex-direction: column;
			-ms-flex-direction: column;
			flex-direction: column;
			margin: 0 auto;
			width: 375px;
			height: 200px;
			overflow: hidden;
			background-color: rgb(255, 255, 255);
		}
		ul {
			list-style: none;
		}
		.box {
			display: -webkit-box;
			display: -webkit-flex;
			display: -ms-flexbox;
			display: flex;
			-webkit-box-align: center;
			-webkit-align-items: center;
			-ms-flex-align: center;
			align-items: center;
			width: 375px;
			height: 172px;
		}
		.item {
			z-index: 2;
			position: relative;
			-webkit-flex-shrink: 0;
			-ms-flex-negative: 0;
			flex-shrink: 0;
			margin-left: 40px;
			width: 246px;
			height: 125px;
			background-color: #fff;
			border-radius: 5px;
			overflow: hidden;
			transform-origin: 50% 50%;
		}

		.item img {
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
		}

		.item p {
			position: absolute;
			z-index: 90;
			width: 100%;
			line-height: 80px;
			font-size: 40px;
			color: red;
			text-align: center;
		}

		.autoS {
			width: 300px;
			height: 200px;
			overflow: auto;
			-webkit-overflow-scrolling : touch;
			background-color: red;
		}
	</style>
</head>
<body>
	<div class="main">
		<ul class="box" id="banner1">
			<li class="item"><img src="./test.png"> <p>1</p> </li>
			<li class="item"><img src="./test.png"> <p>2</p> </li>
			<li class="item"><img src="./test.png"> <p>3</p> </li>
		</ul>
	</div>

    <script src="./dist/leadSlide.min.js"></script>
    <script>
		var list1 = new leadSlider({
			zoom: 0.84,
			slide: 1,
			overTime: 3000,
			speed: 300,
			box: '#banner1',
			item: '.item',
			onChange: function (num) {
				console.log(num)
			}
		})
    </script>
</body>
</html>
```


附上 gulp 打包陪配置

```javascript
const gulp = require('gulp');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const rename = require("gulp-rename");

gulp.task('default', function () {
    gulp.src('leadSlide.js')
        .pipe(babel({
            presets: ['@babel/preset-env']
        }))
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename('leadSlide.min.js'))
        .pipe(gulp.dest('dist'))
});

gulp.task('watch', function () {
    gulp.watch('leadSlide.js', ['default'])
})
```
