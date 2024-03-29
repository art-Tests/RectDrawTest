function SVGCanvas(options) {
  // An SVG-based drawing
  var self = this

  // Define the global SVG options
  this.options = options || {}
  this.options.h = options.h || 250 // SVG Height and Width
  this.options.w = options.w || 250
  this.options.addTo = options.addTo || 'body' // Where to add the SVG (a css selector)
  this.options.addBorderRect = options.addBorderRect // Whether to add a border around the SVG.
  this.options.hyperlink = options.hyperlink || null
  this.options.data = options.data || []

  // Make the SVG
  this.svg = d3
    .select(this.options.addTo)
    .append('svg')
    .attr('height', this.options.h)
    .attr('width', this.options.w)
    .attr('class', 'display-svg')

  // Add border if requested
  if (this.options.addBorderRect) {
    this.svg
      .append('rect')
      .attr('height', this.options.h)
      .attr('width', this.options.w)
      .attr('stroke', 'black')
      .attr('stroke-width', 4)
      .attr('opacity', 0.25)
      .attr('fill-opacity', 0.0)
      .attr('class', 'border-rect')
  }

  // Add Data if Exist
  console.log(this.options.data)
  if (this.options.data) {
    console.log(this.svg)
    // this.svg
    //   .data(data)
    //   .enter()
    //   .append('rect')
    //   .attr({
    //     x: d => d.x,
    //     y: d => d.y,
    //     width: d => d.w,
    //     height: d => d.h,
    //     fill: d => d.fill,
    //     url: d => d.url
    //   })
  }

  // Add zoom and pan group
  this.zoomG = this.svg.append('g').attr('class', 'zoom-group')

  // Rectangles
  this.Rect = {
    r: null,
    x0: null,
    y0: null
  } // Current Selection
  this.Rects = [] // Collection

  // Transformation state
  this.transform = d3.zoomTransform(this.zoomG.node())

  // Load methods for behaviors
  this.makeAddRect() // Add Rectangle Methods
  this.makeZoomPan() // SVG Zooming and Panning Methods
  this.makeDragBehavior()

  // Dragging Behavior - account for both addRect and pan.
  this.svg.call(
    d3
      .drag()
      .on('start', self.dragBehavior.start())
      .on('drag', self.dragBehavior.drag())
      .on('end', self.dragBehavior.end())
  )

  // Zooming behavior
  this.svg
    .call(
      d3
        .zoom()
        .scaleExtent([1, 10])
        .on('zoom', this.zoomPan.zoom)
    )
    .on('.zoom', this.zoomPan.zoom)
    .on('mousedown.zoom', null)
    .on('mousemove.zoom', null)
    .on('mouseup.zoom', null)
}

SVGCanvas.prototype.makeZoomPan = function() {
  // Defines zooming and panning behavior from zoom listener

  var self = this

  zoom = function() {
    self.transform = d3.event.transform

    self.zoomG.attr('transform', self.transform)

    // Go back to initial position if zoomed out.
    if (d3.event.transform.k === 1) {
      self.zoomG
        .transition(
          d3
            .transition()
            .duration(100)
            .ease(d3.easeLinear)
        )
        .attr('transform', 'translate(0,0) scale(1, 1)')

      self.transform = d3.zoomTransform(self.zoomG.node())
    }
  }

  var pan = function() {
    var m = d3.event
    self.transform.x += m.dx
    self.transform.y += m.dy

    // Update Attribute
    d3.select('g.zoom-group').attr('transform', self.transform)
  }

  self.zoomPan = {
    zoom: zoom,
    pan: pan
  }
}

SVGCanvas.prototype.mouseOffset = function() {
  var m = d3.event
  m.x = (-this.transform.x + m.x) / this.transform.k
  m.y = (-this.transform.y + m.y) / this.transform.k
  return m
}

SVGCanvas.prototype.makeAddRect = function() {
  var self = this

  start = function() {
    //Add a rectangle
    // 1. Get mouse location in SVG
    var m = self.mouseOffset() //d3.event;
    self.Rect.x0 = m.x
    self.Rect.y0 = m.y
    // 2. Make a rectangle
    self.Rect.r = self.zoomG
      .append('g')
      .append('rect') // An SVG `rect` element
      .attr('x', self.Rect.x0) // Position at mouse location
      .attr('y', self.Rect.y0)
      .attr('width', 1) // Make it tiny
      .attr('height', 1)
      .attr('class', 'rect-main') // Assign a class for formatting purposes
  }

  drag = function() {
    // What to do when mouse is dragged
    // 1. Get the new mouse position
    var m = self.mouseOffset() //d3.event;
    // 2. Update the attributes of the rectangle
    self.Rect.r
      .attr('x', Math.min(self.Rect.x0, m.x))
      .attr('y', Math.min(self.Rect.y0, m.y))
      .attr('width', Math.abs(self.Rect.x0 - m.x))
      .attr('height', Math.abs(self.Rect.y0 - m.y))
  }

  end = function() {
    // What to do on mouseup
    self.Rects.push(self.Rect)
  }

  self.addRect = {
    start: start,
    drag: drag,
    end: end
  }
}

SVGCanvas.prototype.makeDragBehavior = function() {
  var self = this

  var start = function() {
    return function() {
      if (!d3.event.sourceEvent.shiftKey) {
        self.addRect.start()
      }
      if (d3.event.sourceEvent.shiftKey) {
        null
      }
    }
  }

  var drag = function() {
    return function() {
      if (!(self.Rect.r === null) && !d3.event.sourceEvent.shiftKey) {
        self.addRect.drag()
      }
      if (d3.event.sourceEvent.shiftKey) {
        self.zoomPan.pan()
      }
    }
  }

  var end = function() {
    return function() {
      if (!(self.Rect.r === null) & !d3.event.sourceEvent.shiftKey) {
        self.addRect.end()
        if (self.options.hyperlink) {
          self.options.hyperlink.ReadDataAndBindToList()
        }
      }
      if (d3.event.sourceEvent.shiftKey) {
        null
      }
    }
  }

  self.dragBehavior = {
    start: start,
    drag: drag,
    end: end
  }
}
