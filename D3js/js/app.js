var data = [
  {
    x: 50,
    y: 50,
    w: 50,
    h: 50,
    fill: '#ff0000',
    url: 'http://www.google.com.tw'
  },
  {
    x: 350,
    y: 350,
    w: 70,
    h: 30,
    fill: '#00cc00',
    url: 'http://www.google.com.tw'
  },
  {
    x: 450,
    y: 250,
    w: 200,
    h: 60,
    fill: '#0000ff',
    url: 'http://www.google.com.tw'
  },
  {
    x: 550,
    y: 350,
    w: 90,
    h: 100,
    fill: '#ff9900',
    url: 'http://www.google.com.tw'
  }
]
var point = {
  x: 0,
  y: 0,
  width: 0,
  height: 0
}

var drag = d3.behavior
  .drag()
  .on('dragstart', function(d) {
    d3.select(this).attr({ fill: 'black' })
  })
  .on('drag', function(d) {
    d3.select(this).attr({
      x: (d.x = d3.event.x),
      y: (d.y = d3.event.y)
    })
  })
  .on('dragend', function(d) {
    d3.select(this).attr({ fill: d.fill })
  })

var svg = d3
  .select('#container')
  .append('svg')
  .attr({
    width: '900',
    height: '700'
  })
  .style({
    border: '1px solid #000'
  })

svg
  .selectAll('rect')
  .data(data)
  .enter()
  .append('rect')
  .attr({
    x: function(d) {
      return d.x
    },
    y: function(d) {
      return d.y
    },
    width: function(d) {
      return d.w
    },
    height: function(d) {
      return d.h
    },
    fill: function(d) {
      return d.fill
    },
    onclick: function(d) {
      return window.open(d.url)
    }
  })
// .call(drag)

//=======================

// svg 綁定滑鼠事件，點擊
svg.on('mousedown', function() {
  var mouse = d3.mouse(this)

  point.x = mouse[0]
  point.y = mouse[1]
})

svg.on('mouseup', function() {
  var mouse = d3.mouse(this)
  var x = mouse[0]
  var y = mouse[1]
  if (x > point.x) {
    // 如果往右移動，寬度直接用第二個點減去原先的x
    point.width = x - point.x
  } else {
    //如果往左移動
    var tmp = point.x
    point.x = x
    point.width = tmp - point.x
  }
  if (y > point.y) {
    point.height = y - point.y
  } else {
    var tmp = point.y
    point.y = y
    point.height = tmp - point.y
  }
  displayPoint()

  // createRectAndShow()
})

svg.on('mousemove', function() {
  var mouse = d3.mouse(this)
  var x = mouse[0]
  var y = mouse[1]
  displayNowPoint(x, y)

  if (d3.event.buttons !== 1) {
    // idle
  } else {
    // drawline
  }
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
