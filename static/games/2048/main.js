// 获取画布方法
let ctx = canvas.getContext('2d')

class Main {
	constructor() {
		this.restart()
		this.initEvent()
	}

	// 启动 and 重新启动
	restart() {
		this.GameOver = false
		this.drawGame = new initGame()
		this.loop()
	}

	// 事件绑定
	initEvent() {
		let _this = this
		let x = 0
		let y = 0
		let start = 0
		canvas.addEventListener('touchstart', function (e) {
			start = window.performance.now()
			x = e.changedTouches[0].clientX
			y = e.changedTouches[0].clientY
			e.preventDefault()
			e.stopPropagation()
		}, {passive: false})
		canvas.addEventListener('touchend', function (e) {
			let stop = window.performance.now() - start
			let endx = x - e.changedTouches[0].clientX
			let endy = y - e.changedTouches[0].clientY
			if ((Math.abs(endx) > 30 || Math.abs(endy) > 30) && stop < 500) {
				if (Math.abs(endx) > Math.abs(endy)) {
					if (endx > 0) {
						if (_this.drawGame.canMoveLeft()) {
							_this.drawGame.moveLeft()
						}
					} else {
						if (_this.drawGame.canMoveRight()) {
							_this.drawGame.moveRight()
						}
					}
				} else {
					if (endy > 0) {
						if (_this.drawGame.canMoveTop()) {
							_this.drawGame.moveTop()
						}
					} else {
						if (_this.drawGame.canMoveBottom()) {
							_this.drawGame.moveBottom()
						}
					}
				}
			} else if (Math.abs(endx) < 5 && Math.abs(endy) < 5 && stop > 1000) {
				_this.drawGame = new initGame()
			}
			e.preventDefault()
			e.stopPropagation()
		}, {passive: false})
		document.addEventListener('keydown', function(e) {
			switch(e.keyCode) {
				case 37:
					if (_this.drawGame.canMoveLeft()) {
						_this.drawGame.moveLeft()
					}
					break;
				case 38:
					if (_this.drawGame.canMoveTop()) {
						_this.drawGame.moveTop()
					}
					break;
				case 39:
					if (_this.drawGame.canMoveRight()) {
						_this.drawGame.moveRight()
					}
					break;
				case 40:
					if (_this.drawGame.canMoveBottom()) {
						_this.drawGame.moveBottom()
					}
					break;
				default: break;
			}
			e.preventDefault()
			e.stopPropagation()
		}, {passive: false})
	}
	loop() {
		this.drawGame.draw(ctx)
		this.drawGame.countBlock(ctx)
		window.requestAnimationFrame(this.loop.bind(this))
	}
}