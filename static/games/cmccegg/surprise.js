class Game {
  constructor () {
    let btn = document.createElement('button')
    btn.innerHTML = '关闭彩蛋'
    btn.className = 'surpriseClose'
    document.body.appendChild(btn)
    let _this = this
    btn.addEventListener('click', function () {
      _this.closeGame()
    }, false)
    this.closeBtn = btn
    let btn1 = document.createElement('button')
    btn1.innerHTML = '再来一次'
    btn1.className = 'surpriseAgain'
    btn1.style.display = 'none'
    document.body.appendChild(btn1)
    btn1.addEventListener('click', function () {
      _this.playGame()
    }, false)
    this.againBtn = btn1
    let dpr = window.devicePixelRatio || 1
    let canvas = document.createElement('canvas')
    canvas.className = 'surprise'
    canvas.width = window.innerWidth > 440 ? 440 * dpr : window.innerWidth * dpr
    canvas.height = window.innerHeight > 840 ? 820 * dpr : window.innerHeight * dpr
    document.body.appendChild(canvas)
    canvas.addEventListener('touchmove', function(e) {
      e.preventDefault()
      e.stopPropagation()
    }, false)
    this.canvas = canvas // canvas
    this.ctx = canvas.getContext('2d') // ctx
    this.singleW = ~~(this.canvas.width / 10) // 车宽
    this.singleH = ~~(this.canvas.height / 9) // 车长
    this.speedM = 5 // 程序员车速
    this.speedO = 5 // 产品车速
    this.probability = 0.99 // 产生产品车的概率
    this.gameOver = false // 游戏是否结束
    this.keyCode = false // 按键操控
    this.speedTime = null // 速度加速器 键盘玩的时候才有
    this.animateTime = null // 动画控制器
    this.messTime = null // 题词器 给用户一个 Story 就会觉得很有意思
    this.score = 0 // 分数
    this.colorHub = ['#ff6601', '#0199cb', '#353299', '#67349b', '#98cb04'] // 产品经理车颜色库 有钱的产品经理啊 有好多颜色可以选择
    this.dreamCar = {  // 程序员车况 其实程序猿没有车 也没有女朋友 都是他幻想的
      w: this.singleW,
      h: this.singleH,
      x: (this.canvas.width - this.singleW) / 2,
      y: this.canvas.height - this.singleH - 20,
      colour: '#ca0032',
      txtColor: '#fff',
      text: '程序猿'
    }
    this.oncoming = []  // 产品经理的车况 产品经理有许多车 所以是个数组
    this.showMessage()
  }
  // 碰撞检测
  handleEgdeCollisions (sp) {
		if (sp.x < this.dreamCar.x + this.dreamCar.w &&
        sp.x + sp.w > this.dreamCar.x &&
        sp.y < this.dreamCar.y + this.dreamCar.h &&
        sp.h + sp.y > this.dreamCar.y) {
			this.gameOver = true
		}
  }
  // 汽车帧
  drawCar (car) {
    this.ctx.fillStyle = car.colour
    this.ctx.beginPath()
    this.ctx.rect(car.x, car.y, car.w, car.h)
    this.ctx.fill()
    this.ctx.font = (car.w / 2) + 'px Verdana'
    this.ctx.fillStyle = car.txtColor
    this.ctx.textAlign = 'center'
    if (car.text == '程序猿') {
      this.ctx.textBaseline = 'bottom'
      this.ctx.fillText(car.text, car.x + car.w / 2, car.y + car.h / 2, car.w)
      this.ctx.textBaseline = 'top'
      this.ctx.fillText('的车', car.x + car.w / 2, car.y + car.h / 2, car.w)
    } else {
      this.ctx.textBaseline = 'bottom'
      this.ctx.fillText('的车', car.x + car.w / 2, car.y + car.h / 2, car.w)
      this.ctx.textBaseline = 'top'
      this.ctx.fillText(car.text, car.x + car.w / 2, car.y + car.h / 2, car.w)
    }
  }
  // 分数帧
  drawScore () {
    this.ctx.fillStyle = '#fff'
    this.ctx.font = (this.canvas.width/30) + 'px Verdana'
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'top'
    this.ctx.fillText('已躲过：' + this.score + '个障碍', 20, 20)
  }
  // 游戏结束帧
  overShow () {
    clearInterval(this.speedTime)
    this.againBtn.style.display = 'block'
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
    this.ctx.rect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.fill()
    this.ctx.fillStyle = '#fff'
    this.ctx.font = (this.canvas.width/25) + 'px Verdana'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'top'
    if (this.score > 64) {
      this.ctx.fillText('wow~~~, 你是老司机吧', this.canvas.width / 2, this.canvas.height / 2)
      this.ctx.fillText('太感谢你了, 我已经看到出口了', this.canvas.width / 2, this.canvas.height / 2 + 50, this.canvas.width)
      this.ctx.fillText('剩下的那几个障碍我相信我自己可以躲过去的', this.canvas.width / 2, this.canvas.height / 2 + 100, this.canvas.width)
    } else {
      this.ctx.fillText('Wu~~~~', this.canvas.width / 2, this.canvas.height / 2)
      this.ctx.fillText('你的车技令人惊叹', this.canvas.width / 2, this.canvas.height / 2 + 50)
      this.ctx.fillText('看来程序猿小哥哥要永远困在这里了', this.canvas.width / 2, this.canvas.height / 2 + 100)
    }
  }
  // 更新数据
  update () {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    // 分数
    this.drawScore()
    // 小车键盘移动
    if (this.keyCode === 37) {
      this.dreamCar.x = this.dreamCar.x - this.speedM < 0 ? 0 : this.dreamCar.x - this.speedM - 5
    }
    if (this.keyCode === 39) {
      this.dreamCar.x = this.dreamCar.x + this.speedM > (this.canvas.width - this.dreamCar.w) ? (this.canvas.width - this.dreamCar.w) : this.dreamCar.x + this.speedM + 5
    }
    this.drawCar(this.dreamCar)
    // 加入新车辆
    if (this.oncoming.length === 0 || (Math.random() > this.probability && this.oncoming[this.oncoming.length - 1].y > this.dreamCar.h)) {
      this.oncoming.push({
        w: this.singleW,
        h: this.singleH,
        x: (this.canvas.width - this.singleW) * Math.random(),
        y: 0,
        colour: this.colorHub[Math.floor(this.colorHub.length * Math.random())],
        txtColor: '#fff',
        text: '产品'
      })
    }

    let i = 0
    while (i < this.oncoming.length) {
      this.oncoming[i].y += this.speedO
      if (this.oncoming[i].y > this.canvas.height) {
        this.oncoming.splice(i, 1)
        this.score++
    	} else {
        if (!this.gameOver) {
          this.handleEgdeCollisions(this.oncoming[i])
        }
				this.drawCar(this.oncoming[i])
				i++
    	}
    }
    // 动画
    this.animateTime = requestAnimationFrame(() => {
      // console.log('动画倒计时')
      if (this.gameOver) {
        this.overShow()
      } else {
        this.update()
      }
    })
  }
  // 关闭
  closeGame () {
    if (this.messTime) {
      clearInterval(this.messTime)
    }
    if (this.speedTime) {
      clearInterval(this.speedTime)
    }
    if (this.animateTime) {
      window.cancelAnimationFrame(this.animateTime)
    }
    let body = document.querySelector('body')
    body.removeChild(this.canvas)
    body.removeChild(this.closeBtn)
    body.removeChild(this.againBtn)
  }
  // 开始
  playGame () {
    this.againBtn.style.display = 'none'
    this.score = 0
    this.speedM = 5 // 程序员车速
    this.speedO = 5 // 产品车速
    this.probability = 0.99 // 产生产品车的概率
    this.gameOver = false // 游戏是否结束
    this.oncoming = []  // 产品经理的车况 产品经理有许多车 所以是个数组
    this.dreamCar.x = (this.canvas.width - this.singleW)/2
    this.keyCode = false
    let _this = this
    // 这俩事件是键盘玩的
    document.addEventListener('keydown', function (e) {
      _this.keyCode = e.keyCode
    }, false);
    document.addEventListener('keyup', function () {
    	_this.keyCode = false
    }, false);
    // 这个事件是手机玩的
    window.addEventListener('deviceorientation', function (e) {
    	var x = _this.dreamCar.x + (~~e.gamma * 2)
    	if (x < 0) {
    		x = 0
    	}
    	if (x > _this.canvas.width - _this.dreamCar.w) {
    		x = _this.canvas.width - _this.dreamCar.w
    	}
    	_this.dreamCar.x = x
    }, false);
    this.speedTime = setInterval(() => {
      // console.log('速度倒计时')
      this.speedO += 1 // 产品车速度增加
      // this.speedM = this.speedM + 0.5 > 25 ? 25 : this.speedM + 0.5 // 程序猿车速度增加 （键盘玩）
      this.probability = this.probability - 0.001 < 0.75 ? 0.75 : this.probability - 0.001 // 生成产品车概率增加
    }, 5000);
    this.update()
  }

  // 先来一个小故事
  showMessage () {
    this.ctx.fillStyle = '#fff'
    this.ctx.font = (this.canvas.width/30) + 'px Verdana'
    this.ctx.textAlign = 'left'
    this.ctx.textBaseline = 'top'
    let messInfo = [
      '谢天谢地，你终于来了',
      '我是程序猿小哥哥',
      '我也不知道发生了什么事',
      '那天我正写着bug，突然屏幕出现一道强光',
      '然后我就晕了，醒来之后我就到了这里',
      '据我这几天观察，我可能是被代码困在了母体世界里',
      '现在我的身体已经坍缩成了二维的，只能用这样的方式和你交流',
      '这几天我一直在寻找出去的方法',
      '就在昨天，终于让我找到了一段标注出口信息的注释',
      '注释上说只要我将自己虚拟成二维世界的车辆，并且穿过产品车流的障碍',
      '就可以逃出这个代码世界了，但是需要有人帮助我',
      '我也不知道什么是产品车流，但是我相信你一定会帮我的对吧',
      '我已经好久没见到我的女神了，我好像念女神，你一定要帮我啊',
      '事不宜迟，我们开始吧',
      '你需要“左右倾斜手机”来控制我虚拟出的车辆，躲避障碍',
      '快点准备，倒计时已经开始了：',
      '3',
      '2',
      '1'
    ]
    this.ctx.fillText(messInfo[0], 20, this.canvas.width/20, this.canvas.width - 100)
    let i = 1
    this.messTime = setInterval(() => {
      // console.log('信息倒计时')
      this.ctx.fillText(messInfo[i], 20, (this.canvas.width/20) * (i + 1), this.canvas.width - 40)
      i++
      if (i >= messInfo.length) {
        clearInterval(this.messTime)
        this.messTime = setTimeout(() => {
          // console.log('马上开始倒计时')
          this.playGame()
        }, 1000)
      }
    }, 1500)
  }
}
