;(function(window, document){
  var svgWave = function (container, params) {
    // 所需变量
    var i = 0, // 全局循环
        dp = 0, //上升动画第一条浪
        db = 1, //上升动画第二条浪
        num = 200, // 容器高度
        waveHeight = params.waveHeight || 4, // 浪高，值越大越浪
        perc = 200 - 200*params.perc, // 占容器百分比，值越大越满
        percFloat = params.percFloat || false, // 是否百分比动画
        waveFloat = params.waveFloat || false, // 是否要浪
        txt = params.txt || '', // 文字
        bcolor = params.bcolor || 'red', // 背景
        color = params.color || 'rgba(0, 0, 255, .3)'; // 文字颜色

    // 创建dom及相关设置
    var svg = document.getElementById(container);
        svg.setAttribute('preserveAspectRatio','xMinYMin meet');
        svg.setAttribute('viewBox','0,0,200,200');
    var upline =  document.createElementNS('http://www.w3.org/2000/svg','path');
        upline.setAttribute('fill',bcolor);
    var downline = document.createElementNS('http://www.w3.org/2000/svg','path');
        downline.setAttribute('fill',bcolor);
    var text = document.createElementNS('http://www.w3.org/2000/svg','text');
        text.setAttribute('x','100');
        text.setAttribute('y','110');
        text.setAttribute('text-anchor','middle');
        text.setAttribute('font-size','40');
        text.setAttribute('fill', color);
    var textnode=document.createTextNode(txt);
    text.appendChild(textnode);
    svg.appendChild(upline);
    svg.appendChild(downline);
    svg.appendChild(text);
    var parr = []; // 第一个path的路径数组
    var barr = []; // 第二个path的路径数组

    // 根据sin函数计算 曲线路径 
    function dwrline (pi, h) {
      var arr = [];
      var line = 'M 0 ' + ((Math.sin(pi + 50)) * waveHeight + h) + ',';
      for (var i = 0; i < 21; i++) {
          
          var a = (Math.sin(pi + i*50)) * waveHeight + h;
          line += 'L ' + (i * 10) + ' ' + a + ',';
      }
      line += 'L 200 200,L0 200,';
      return line;
    }

    // 计算出63个path路径 以后只需循环使用无需再计算
    function numlist (perc, callback) {
      var p = 0;
      var b = 1;
      // var parr = []; // 第一个path的路径数组
      // var barr = []; // 第二个path的路径数组
      for (var i = 0; i < 63; i++) {
        var pline = dwrline (p, perc);
        var bline = dwrline (b, perc);
        parr.push(pline);
        barr.push(bline);
        p += 0.1;
        b += 0.1;
      }
      typeof callback === 'function' && callback(parr,barr);
    }

    // 循环改变63个path路径 
    function renderWave(parr, barr){
      if (i < 63) {
        upline.setAttribute('d',parr[i]);
        downline.setAttribute('d', barr[i]);
      }else{
        i = 0;
        upline.setAttribute('d',parr[i]);
        downline.setAttribute('d', barr[i]);
      }
      
    }

    // 高度为200时画满 0则不画 其他根据参数执行
    if(perc == 200){
      upline.setAttribute('d','M0 0, H 200, V 200, H 0');
      downline.setAttribute('d','M0 0, H 200, V 200, H 0');
    }else if (perc != 0) {
      numlist(perc, function(parr,barr){
        var animate = setInterval(function () {
            if (percFloat) {  // 有上升动画
              upline.setAttribute('d',dwrline(dp+= 0.2, num));
              downline.setAttribute('d', dwrline(db+= 0.2, num));
              if (num > perc) {
                num -= 2
              }else{
                percFloat = false
              }
            }else if (!percFloat && waveFloat) { // 上升动画执行完毕或无 && 有波浪动画
              renderWave(parr,barr);
              i++;
            }else if (!percFloat && !waveFloat) { // 上升动画执行完毕或无 && 无波浪动画
              upline.setAttribute('d',parr[0]);
              downline.setAttribute('d', barr[0]);
              clearInterval(animate);
            }
        }, 50)
      })
    }
  };
  window.svgWave = svgWave;
}(window, document))

// waveHeight: 浪高
// perc: 百分比
// txt: 文字
// percFloat: 是否百分比动画
// waveFloat: 是否波浪动画,
// bcolor：背景波浪颜色
// color: 颜色
// new svgWave('wave',{
//   waveHeight: 5,
//   perc: 0.5,
//   txt: '50%',
//   percFloat: true,
//   waveFloat: true,
//   bcolor: 'rgba(0, 0, 255, .6)',
//   color: 'rgba(0, 0, 255, .3)'
// });