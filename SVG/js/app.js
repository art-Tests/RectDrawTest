var point = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

function swap(num1, num2) {
  let tmp = num1
  num2 = num1
  num1 = tmp
}
function createRectAndShow() {
  if (point.height < 0) {
    point.height = point.height * -1
    swap(point.y, point.height)
  }

  var svgns = 'http://www.w3.org/2000/svg'
  var rect = document.createElementNS(svgns, 'rect')
  rect.setAttributeNS(null, 'x', point.x)
  rect.setAttributeNS(null, 'y', point.y)
  rect.setAttributeNS(null, 'height', point.height)
  rect.setAttributeNS(null, 'width', point.width)
  rect.setAttributeNS(null, 'opacity', 0.5)
  rect.setAttributeNS(
    null,
    'fill',
    '#' + Math.round(0xffffff * Math.random()).toString(16)
  )
  document.getElementById('svg').appendChild(rect)
}

// svg 綁定滑鼠事件，點擊
let svg = document.querySelector('#svg')
svg.addEventListener('mousedown', function(event) {
  console.log(event.target)
  let hitTarget = event.target

  point.x = event.clientX
  point.y = event.clientY
})

svg.addEventListener('mouseup', function(event) {
  if (event.clientX > point.x) {
    // 如果往右移動，寬度直接用第二個點減去原先的x
    point.width = event.clientX - point.x
  } else {
    //如果往左移動
    var tmp = point.x
    point.x = event.clientX
    point.width = tmp - point.x
  }
  if (event.clientY > point.y) {
    point.height = event.clientY - point.y
  } else {
    var tmp = point.y
    point.y = event.clientY
    point.height = tmp - point.y
  }
  displayPoint()
  createRectAndShow()
})

svg.addEventListener('mousemove', function(event) {
  displayNowPoint(event.clientX, event.clientY)

  if (event.buttons !== 1) return
})

function displayNowPoint(x, y) {
  $('#nowX').text(x)
  $('#nowY').text(y)
}
function displayPoint() {
  $('#x').text(point.x)
  $('#y').text(point.y)
  $('#height').text(point.height)
  $('#width').text(point.width)
}
