(function(window,undefined) {

	var canvas = document.createElement('canvas');
	canvas.id = 'mycanvas';
	canvas.style.position = "absolute";
	canvas.style.zIndex = "-1";
	document.body.appendChild(canvas);
	var width,height;
	var num = 40; // 圆个数
	var ctx;
	var digit = [];
	var dpr = window.devicePixelRatio || 1;

	// 创建每个点的位置 半径 位移
	function generateNum () {
		var arr = []
		for (let i = 0; i < num; i++) {
			var list = {};
			list.x = Math.random() * width;
			list.y = Math.random() * height;
			list.r = Math.random() * 10 * dpr;
			list.mx = (0.6 - Math.random())/2;
			list.my = (0.6 - Math.random())/2;
			arr.push(list);
		}
		return arr;
	}

	// 更新圆位置
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

	// 画线
	function drawline () {
		for (let i = 0; i < digit.length; i++) {
			for (let j = i + 1; j < digit.length; j++) {
				var mx = Math.abs(digit[i].x - digit[j].x);
				var my = Math.abs(digit[i].y - digit[j].y);
				if (mx < width/7 && my < width/7) {
					ctx.strokeStyle="#f0f0f0";
					ctx.beginPath();
					ctx.moveTo(digit[i].x, digit[i].y);
					ctx.lineTo(digit[j].x, digit[j].y);
					ctx.stroke();
				}

			}
		}
	}

	// 画圆
	function draw () {
		ctx.clearRect(0, 0, width, height);
		ctx.fillStyle = "#eee";
		for (let i = 0; i < digit.length; i++) {
			ctx.beginPath();
			ctx.arc(digit[i].x, digit[i].y, digit[i].r, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fill();
		}
	}

	// 鼠标指针
	function showMouseStart (e) {
		var arr = {};
		arr.x = e.clientX * dpr;
		arr.y = e.clientY * dpr;
		arr.r = 10 * dpr;
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

	// 开始
	function start() {
		width = window.innerWidth * dpr;
		height = window.innerHeight * dpr;
		canvas.width = width;
		canvas.height = height;
		ctx = canvas.getContext('2d');
		digit = generateNum();
		draw(digit);
	}

	// 刷新动画
	setInterval(function () {
		draw();
		drawline();
		updata();
	}, 16)

	// 鼠标 hover 事件
	document.addEventListener('mousemove',showMouseStart,true);

	// 改变屏幕大小重新计算
	window.onresize = function () {
		start();
	}
	//开始
	
	start();

})(window)