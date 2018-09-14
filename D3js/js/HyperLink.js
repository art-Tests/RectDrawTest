function HyperLink() {
  this.Data = []
}
HyperLink.prototype.BindToList = function() {
  clearList()
  var allRect = this.Data
  allRect.forEach(element => {
    appendToList(element)
  })

  function clearList() {
    var ul = document.getElementById('list')
    ul.innerHTML = ''
  }
  function appendToList(data) {
    var txt = `x:${data.x} y:${data.y} w:${data.w} h:${data.h}`
    var ul = document.getElementById('list')
    var li = document.createElement('li')
    li.appendChild(document.createTextNode(txt))
    ul.appendChild(li)
  }
}

HyperLink.prototype.ReadDataAndBindToList = function() {
  this.Data = []
  var RectData = this.Data
  var elements = document.querySelectorAll('.rect-main')
  elements.forEach(function(v, i, obj) {
    const getVal = e => parseInt(e.baseVal.value, 10)
    var x = getVal(v.x)
    var y = getVal(v.y)
    var w = getVal(v.width)
    var h = getVal(v.height)

    // console.log(`第${i + 1}筆資料 x:${x} y:${y} w:${w} h:${h}`)
    RectData.push({ x: x, y: y, w: w, h: h })
  })
  this.BindToList()
}
