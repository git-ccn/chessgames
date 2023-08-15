<script setup>
import { onMounted, reactive, ref } from 'vue';
const clearDate = reactive({
  xy: [],
  height: null
})
const initPoint = { x: 30, y: 30 } //棋盘初始点
const compontsXY = reactive({
  x: 0,
  y: 0
})
const chessname = reactive({
  blackchess: ['車', '马', '相', '士', '帅', '士', '相', '马', '車', '炮', '炮', '卒', '卒', '卒', '卒', '卒'],
  redchess: ['兵', '兵', '兵', '兵', '兵', '炮', '炮', '車', '马', '象', '士', '将', '士', '象', '马', '車',]
})
// 棋子移动记录
const chessAdress = reactive([])
//
// 棋子选中
const selectedChess = ref(null)
// 是否选中
const selects = ref(false)
// 棋盘点的数据
const chesspoint = reactive({
  x: [],
  y: [],
  value: []
})
// 棋子
function chessman(ctx, x, y, r, text, textx, texty, color) {
  ctx.beginPath()
  ctx.fillStyle = 'green'
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
  ctx.beginPath()
  ctx.fillStyle = color
  ctx.arc(x, y, r - 2, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
  ctx.beginPath()
  ctx.font = 'bold 30px 宋体'
  ctx.fillStyle = 'white'
  ctx.fillText(text, textx, texty)
  ctx.closePath()
}
// 横向 分割线
function splitlineRow(ctx, startx, starty, width, height, i) {
  const Yx = Math.round(height / 9)
  const xsplit = Math.round(width / 8)
  compontsXY.x = xsplit
  compontsXY.y = Yx
  if (i === 4) {
    clearDate.xy.push(startx, starty + Yx * i)
    clearDate.height = Yx
  }
  if (i === 7) {
    crossline(ctx, startx + xsplit * 3, starty + Yx * i, startx + xsplit * 5, starty + Yx * (i + 2))
    crossline(ctx, startx + xsplit * 3, starty + Yx * (i + 2), startx + xsplit * 5, starty + Yx * i)
  }
  ctx.beginPath();
  ctx.moveTo(startx, starty + Yx * i)
  ctx.lineTo(startx + width, starty + Yx * i)
  ctx.stroke()
  ctx.closePath();
  chesspoint.y.push(starty + Yx * i)
}
// 竖向分割线
function splitlineBock(ctx, startx, starty, width, height, i) {
  const Yx = Math.round(width / 8)
  const ysplit = Math.round(height / 9)

  if (i === 3) {
    crossline(ctx, startx + Yx * i, starty, startx + Yx * (i + 2), starty + ysplit * 2)
    crossline(ctx, startx + Yx * i, starty + ysplit * 2, startx + Yx * (i + 2), starty)
  }
  ctx.beginPath();
  ctx.moveTo(startx + Yx * i, starty)
  ctx.lineTo(startx + Yx * i, starty + height)
  ctx.stroke()
  ctx.closePath();
  chesspoint.x.push(startx + Yx * i)
}

// 棋盘布局数据
const chessData = () => {
  chesspoint.x.push(chesspoint.x[chesspoint.x.length - 1] + compontsXY.x)
  chesspoint.x.push(chesspoint.x[0] - compontsXY.x)
  chesspoint.y.push(chesspoint.y[chesspoint.y.length - 1] + compontsXY.y)
  chesspoint.y.push(chesspoint.y[0] - compontsXY.y)
  chesspoint.x = chesspoint.x.sort((a, b) => a - b)
  chesspoint.y = chesspoint.y.sort((a, b) => a - b)
  for (let i = 0; i < chesspoint.x.length; i++) {
    const elementx = chesspoint.x[i];
    for (let index = 0; index < chesspoint.y.length; index++) {
      const elementy = chesspoint.y[index];
      chesspoint.value.push({ x: elementx, y: elementy })
    }
  }
  // console.log(chesspoint);
}

// 交叉线
function crossline(ctx, startx, starty, endx, endy) {
  ctx.beginPath()
  ctx.moveTo(startx, starty)
  ctx.lineTo(endx, endy)
  ctx.stroke()
  ctx.closePath()
}
// 清除线条
function clearCanvas(ctx, x, y, width, height) {
  ctx.beginPath()
  ctx.clearRect(x, y, width, height)
  ctx.fillStyle = 'rgb(213,168,111)'
  ctx.fillRect(x, y, width, height)
  ctx.fillStyle = 'black'
  ctx.font = '25px 楷体'
  ctx.textBaseline = 'middle'
  ctx.wordSpacing = `${compontsXY.x * 1}px`;
  ctx.fillText('大 河', x + compontsXY.x * 3, y + compontsXY.y / 2)
  ctx.closePath()
}

// 网格
const chessGrid = () => {
  var canvas = document.getElementById('chessback')
  const ctx = canvas.getContext("2d");
  // 横向
  for (let i = 0; i < 10; i++) {
    splitlineRow(ctx, initPoint.x, initPoint.y, canvas.width - 2 * initPoint.x, canvas.height - 2 * initPoint.y, i)
  }
  // // 纵向
  for (let i = 0; i < 9; i++) {
    splitlineBock(ctx, initPoint.x, initPoint.y, canvas.width - 2 * initPoint.x, canvas.height - 2 * initPoint.y, i)
  }
}

// 初始化棋盘
const init = () => {
  var canvas = document.getElementById('chessback')
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = 'rgb(213,168,111)'
  ctx.fillRect(0, 0, canvas.width, canvas.height)
  ctx.strokeStyle = '#000'
  // ctx.strokeRect(initPoint.x, initPoint.y, canvas.width - 2*initPoint.x, canvas.height - 2*initPoint.y)
  chessGrid()
  clearCanvas(ctx, clearDate.xy[0], clearDate.xy[1], canvas.width - 20, clearDate.height)
  // 黑子
  for (let i = 0; i < 16; i++) {
    let x = initPoint.x, textx = 14, y = initPoint.y, texty = 30
    if (i === 9) {
      x = x + compontsXY.x
      y = y + compontsXY.y * 2
      textx = textx + compontsXY.x
      texty = texty + compontsXY.y * 2
    } else if (i === 10) {
      x = x + compontsXY.x * 7
      y = y + compontsXY.y * 2
      textx = textx + compontsXY.x * 7
      texty = texty + compontsXY.y * 2
    } else if (i > 10) {
      x = x + compontsXY.x * (2 * (i - 11))
      y = y + compontsXY.y * 3
      textx = textx + compontsXY.x * (2 * (i - 11))
      texty = texty + compontsXY.y * 3
    } else {
      x = x + compontsXY.x * i
      textx = textx + compontsXY.x * i
    }
    const label = chessname.blackchess[i]
    const obj = {}
    obj[label] = { x, y, textx, texty, sign: 'black', key: i }
    chessAdress.push(obj)
    chessman(ctx, x, y, 25, chessname.blackchess[i], textx, texty, 'black')
  }
  // 红子
  for (let i = 0; i < 16; i++) {
    let x = initPoint.x, textx = 14, y = initPoint.y + compontsXY.y * 6, texty = 30 + compontsXY.y * 6
    if (i === 5) {
      x = x + compontsXY.x 
      y = y + compontsXY.y
      textx = textx + compontsXY.x
      texty = texty + compontsXY.y
    } else if (i === 6) {
      x = x + compontsXY.x * 7
      y = y + compontsXY.y
      textx = textx + compontsXY.x * 7
      texty = texty + compontsXY.y
    } else if (i < 5) {
      x = x + compontsXY.x * (2 * i)
      textx = textx + compontsXY.x * (2 * i)
    } else {
      x = x + compontsXY.x * (i - 7)
      y = y + compontsXY.y * 3
      textx = textx + compontsXY.x * (i - 7)
      texty = texty + compontsXY.y * 3
    }
    const label = chessname.redchess[i]
    const obj = {}
    obj[label] = { x, y, textx, texty, sign: 'red', key: i }
    chessAdress.push(obj)
    chessman(ctx, x, y, 25, chessname.redchess[i], textx, texty, 'red')
  }
  // console.log(chessAdress);
}
// 清除棋子
function clearArc(cxt, x, y, radius) {
  var stepClear = 1
  function clear(x, y, radius) {
    var calcWidth = radius - stepClear;
    var calcHeight = Math.sqrt(radius * radius - calcWidth * calcWidth);
    var posX = x - calcWidth;
    var posY = y - calcHeight;

    var widthX = 2 * calcWidth;
    var heightY = 2 * calcHeight;

    if (stepClear <= radius) {
      cxt.clearRect(posX, posY, widthX, heightY);
      stepClear += 1;
      clear(x, y, radius);
    }
  }
  clear(x, y, radius)
}

// 清除选中样式
function clearArcFun(cxt, data) {
  if (!data) return
  const { x, y, r, textx, texty, sign, name } = data
  clearArc(cxt, x, y, r);
  cxt.beginPath()
  cxt.fillStyle = 'rgb(213,168,111)'
  cxt.arc(x, y, r, 0, 2 * Math.PI)
  cxt.fill()
  cxt.closePath()
  chessman(cxt, x, y, 25, name, textx, texty, sign)
}

// 选中的样式
function chooseStyle(ctx, res) {
  const { x, y, r } = res
  clearArcFun(ctx, selectedChess.value)
  selectedChess.value = { ...selectedChess.value, ...res, r: r + 4 }
  ctx.beginPath()
  ctx.strokeStyle = 'blue'
  ctx.arc(x, y, r + 3, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.closePath()

}

// 移动样式
function walkBackground(ctx) {
  const { x, y, r } = selectedChess.value
  clearArc(ctx, x, y, r);
  ctx.beginPath()
  ctx.fillStyle = 'rgb(213,168,111)'
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
  ctx.closePath()
  repair(ctx, { x, y, r })
}

// 移动后填补棋盘
function repair(ctx, { x, y, r }) {
  ctx.beginPath()
  ctx.strokeStyle = 'black'
  //  四个拐角
  if (x === initPoint.x && y === initPoint.y) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x && y === initPoint.y + compontsXY.y * 9) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 8 && y === initPoint.y) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 8 && y === initPoint.y + compontsXY.y * 9) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.stroke()
    ctx.closePath()
  }
  // 十字角和中心点
  else if (x === initPoint.x + compontsXY.x * 3 && y === initPoint.y) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y + r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 5 && y === initPoint.y) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y + r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 3 && y === initPoint.y + compontsXY.y * 9) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y - r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 5 && y === initPoint.y + compontsXY.y * 9) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y - r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 3 && y === initPoint.y + compontsXY.y * 2) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y - r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 5 && y === initPoint.y + compontsXY.y * 2) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y - r)
    ctx.stroke()
    ctx.closePath()
  }
  else if (x === initPoint.x + compontsXY.x * 3 && y === initPoint.y + compontsXY.y * 7) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y + r)
    ctx.stroke()
    ctx.closePath()
  } else if (x === initPoint.x + compontsXY.x * 5 && y === initPoint.y + compontsXY.y * 7) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y + r)
    ctx.stroke()
    ctx.closePath()
  }
  else if ((x === initPoint.x + compontsXY.x * 4 && y === initPoint.y + compontsXY.y * 1) ||
    (x === initPoint.x + compontsXY.x * 4 && y === initPoint.y + compontsXY.y * 8)) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y - r)
    ctx.stroke()
    ctx.closePath()
  }
  // 边
  else if ((x - initPoint.x) % compontsXY.x === 0 && y === initPoint.y) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.stroke()
    ctx.closePath()
  } else if ((x - initPoint.x) % compontsXY.x === 0 && y === initPoint.y + compontsXY.y * 9) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.stroke()
    ctx.closePath()
  } else if ((y - initPoint.y) % compontsXY.y === 0 && x === initPoint.x) {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.stroke()
    ctx.closePath()
  } else if ((y - initPoint.y) % compontsXY.y === 0 && x === initPoint.x + compontsXY.x * 8) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.stroke()
    ctx.closePath()
  }
  // 河道的边
  else if ((x - initPoint.x) % compontsXY.x === 0 && y === initPoint.y + compontsXY.y * 4) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.stroke()
    ctx.closePath()
  }
  else if ((x - initPoint.x) % compontsXY.x === 0 && y === initPoint.y + compontsXY.y * 5) {
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.stroke()
    ctx.closePath()
  }
  // 十字格  
  else {
    ctx.moveTo(x, y)
    ctx.lineTo(x + r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x - r, y)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y - r)
    ctx.moveTo(x, y)
    ctx.lineTo(x, y + r)
    ctx.moveTo(x, y)
    ctx.stroke()
    ctx.closePath()
  }
}

function moveLine(ctx, value, { x, y, textx, texty, name, sign, r }) {
  return function movejub(judgment) {
    if (judgment) {
      value.x = x
      value.y = y
      value.textx = textx
      value.texty = texty
      walkBackground(ctx)
      chessman(ctx, x, y, r - 4, name, textx, texty, sign)
      // 吃子
      eatChess(x, y, sign)
      selectedChess.value = { ...selectedChess.value, x: x, y: y, textx: textx, texty: texty }
    }
  }
}
// 判断不可移动的点
const targetChess = (name, x, y, sign) => {
  let result
  if (name === '車') {
    result = chessAdress.find(item => {
      const label = Object.keys(item)[0]
      const value = item[label]
      if (((value.x > x && value.x < selectedChess.value.x) || (value.x > selectedChess.value.x && value.x < x)) && (value.y === y)
        || ((value.y > y && value.y < selectedChess.value.y) || (value.y > selectedChess.value.y && value.y < y)) && (value.x === x)
        || (value.x === x && value.y === y && value.sign === sign)
      ) {
        return true
      }
    })
  }
  else if (name === '马' || name === '相' || name === '象') {
    result = chessAdress.find(item => {
      const label = Object.keys(item)[0]
      const value = item[label]
      if (
        y >= initPoint.y + compontsXY.y * 5 && name === '相'
      ) {
        return true
      } if (
        y <= initPoint.y + compontsXY.y * 4 && name === '象'
      ) {
        return true
      }
      if (
        (value.x === selectedChess.value.x + compontsXY.x && value.y === selectedChess.value.y + compontsXY.y) ||
        (value.x === selectedChess.value.x - compontsXY.x && value.y === selectedChess.value.y + compontsXY.y) ||
        (value.x === selectedChess.value.x + compontsXY.x && value.y === selectedChess.value.y - compontsXY.y) ||
        (value.x === selectedChess.value.x - compontsXY.x && value.y === selectedChess.value.y - compontsXY.y) ||
        (value.x === x && value.y === y && value.sign === sign)
      ) {
        return true
      }
    })
  } else if (name === '炮') {
    result = chessAdress.find(item => {
      const label = Object.keys(item)[0]
      const value = item[label]
      let jumpCan
      const pointJump =
        ((value.x < x && value.x > selectedChess.value.x || (value.x > x && value.x < selectedChess.value.x)) && value.y === y) ||
        ((value.y < y && value.y > selectedChess.value.y || (value.y > y && value.y < selectedChess.value.y)) && value.x === x)
      if (pointJump) {
        console.log('111');
        jumpCan = chessAdress.find(item => {
          const label = Object.keys(item)[0]
          const value = item[label]
          if(x === value.x && y === value.y && sign != value.sign) return true
        })
      }
      if (pointJump && !jumpCan) {
        return true
      }
    })
  }
  return result
}

// 吃子
const eatChess = (x, y, sign) => {
  for (let index = 0; index < chessAdress.length; index++) {
    const item = chessAdress[index];
    const label = Object.keys(item)[0]
    const value = item[label]
    if (x === value.x && y === value.y && sign != value.sign) {
      chessAdress.splice(index, 1)
      break
    }
  }
}

// 棋子的路径规则
const chessrules = (ctx, data, pagex, pagey) => {
  let { x, y, textx, texty, sign, name, r, key } = data.value
  // 判断点击的点是否在棋盘上
  const adress = chesspoint.value.filter(item => (pagex >= item.x - 25 && pagex <= item.x + 25) && (pagey >= item.y - 25 && pagey <= item.y + 25))
  textx = textx + adress[0].x - x
  texty = texty + adress[0].y - y
  x = adress[0].x
  y = adress[0].y
  // 无法移动点
  if (targetChess(name, x, y, sign)) {
    return;
  }
  // 移动
  for (let index = 0; index < chessAdress.length; index++) {
    const item = chessAdress[index];
    const label = Object.keys(item)[0]
    const value = item[label]
    if (value.sign === sign && value.key === key) {
      const comp = moveLine(ctx, value, { x, y, textx, texty, name, sign, r })
      if (name === '車' || name == '炮') {
        comp(x === value.x || y === value.y)
      } else if (name === '马') {
        comp(
          (x === value.x + compontsXY.x * 2 || x === value.x - compontsXY.x * 2) && (y === value.y + compontsXY.y || y === value.y - compontsXY.y) ||
          (y === value.y + compontsXY.y * 2 || y === value.y - compontsXY.y * 2) && (x === value.x + compontsXY.x || x === value.x - compontsXY.x)
        )
      } else if (name === '相' || name === '象') {
        comp(
          (x === value.x + compontsXY.x * 2 || x === value.x - compontsXY.x * 2) && (y === value.y + compontsXY.y * 2 || y === value.y - compontsXY.y * 2)
        )
      } else if (name === '士') {
        comp(
          (x >= initPoint.x + compontsXY.x * 3 && x <= initPoint.x + compontsXY.x * 5)
          && ((y >= initPoint.y && y <= initPoint.y + compontsXY.y * 2) ||
            (y >= initPoint.y + compontsXY.y * 7 && y <= initPoint.y + compontsXY.y * 9))
          && (Math.abs(x - value.x) === compontsXY.x || Math.abs(y - value.y) === compontsXY.y)
        )
      } else if (name === '帅' || name === '将') {
        comp(
          (x >= initPoint.x + compontsXY.x * 3 && x <= initPoint.x + compontsXY.x * 5)
          && ((y >= initPoint.y && y <= initPoint.y + compontsXY.y * 2) ||
            (y >= initPoint.y + compontsXY.y * 7 && y <= initPoint.y + compontsXY.y * 9))
          && (Math.abs(x - value.x) === compontsXY.x || Math.abs(y - value.y) === compontsXY.y)
          && (x === value.x || y === value.y)
        )
      } else if (name === '卒') {
        if (y >= initPoint.y + compontsXY.y * 5) {
          comp(
            (Math.abs(x - value.x) === compontsXY.x || (y - value.y) === compontsXY.y)
            && (x === value.x || y === value.y)
          )
        } else {
          comp(
            (y - value.y) === compontsXY.y
            && (x === value.x || y === value.y)
          )
        }
      } else if (name === '兵') {
        if (y <= initPoint.y + compontsXY.y * 4) {
          comp(
            (Math.abs(x - value.x) === compontsXY.x || (value.y - y) === compontsXY.y)
            && (x === value.x || y === value.y)
          )
        } else {
          comp(
            (value.y - y) === compontsXY.y
            && (x === value.x || y === value.y)
          )
        }
      }
    }
  }
}

// 移动
const play = (e) => {
  const canvas = document.getElementById('chessback')
  const ctx = canvas.getContext("2d");
  const x = e.offsetX
  const y = e.offsetY
  if (selectedChess.value?.flag) {
    chessrules(ctx, selectedChess, x, y)
    selectedChess.value.flag = false
    return
  }
  for (const item of chessAdress) {
    const label = Object.keys(item)[0]
    const value = item[label]
    if ((x >= value.x - 25 && x <= value.x + 25) && (y >= value.y - 25 && y <= value.y + 25)) {
      selectedChess.value = { ...selectedChess.value, flag: true }
      chooseStyle(ctx, { ...value, r: 25, name: label })
      break
    }
  }
}

onMounted(() => {
  init()
  chessData()
})
</script>

<template>
  <div class="container">
    <canvas id="chessback" width="600" height="650" @click="play" />
  </div>
</template>

<style scoped>
.selected-chess {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 2px solid red;
  /* 其他样式... */
}

.container {
  background-image: url('./assets/backimg.jpg');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  /* color: white; */
}
</style>
