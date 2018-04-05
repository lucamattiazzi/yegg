import * as d3 from 'd3'
import { geoCylindricalStereographic, geoInterrupt, geoMollweideRaw } from 'd3-geo-projection'
import { COLORS } from './constants'

const fetchGeoJson = async () => window.fetch('/world-110m.geojson').then(w => w.json())

export class MapCutter {
  constructor(drawingCanvas, cutterCanvas, width, height) {
    this.drawing = drawingCanvas
    this.cutter = cutterCanvas
    this.width = width
    this.height = height
    this.lobes = [[
      [[-180, 0], [-90, 90], [ 0, 0]],
      [[0, 0], [90, 90], [180, 0]],
    ], [
      [[-180, 0], [-90, 90], [0, 0]],
      [[0, 0], [90, -90], [180, 0]],
    ]]
    this.drawingProj =
    geoCylindricalStereographic()
      .scale(this.width / Math.PI)
      .translate([this.width, this.height / 2])
    this.cutterProj =
    geoInterrupt(geoMollweideRaw, this.lobes)
      .scale(this.width / Math.PI)
      .translate([this.width, this.height / 2])
    this.drawing.addEventListener('mousemove', this.mouseMoveHandler)
  }

  generateWorld = (projection, canvas) => {
    const ctx = canvas.getContext('2d')
    const path = d3.geoPath().projection(projection).context(ctx)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
    ctx.strokeStyle = 'rgba(120, 120, 120, 0.9)'
    ctx.lineWidth = 1

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.beginPath()
    path(this.worldGeoJson)
    ctx.fill()
    ctx.stroke()
    ctx.beginPath()
    ctx.strokeStyle = 'rgba(200, 200, 200, 0.5)'
    path(this.geoGraticule())
    ctx.stroke()
  }

  generate = async () => {
    this.worldGeoJson = await fetchGeoJson()
    this.geoGraticule = d3.geoGraticule()
    this.draw()
  }

  draw = () => {
    this.generateWorld(this.drawingProj, this.drawing)
    this.generateWorld(this.cutterProj, this.cutter)
    this.drawMouse()
    this.drawLobes()
  }

  drawLobes = () => {
    const ctx = this.drawing.getContext('2d')
    ctx.lineWidth = 3
    this.lobes.forEach((hemisphere, idx) => {
      hemisphere.forEach((line, jdx) => {
        ctx.strokeStyle = COLORS[idx][jdx]
        ctx.beginPath()
        line.forEach((p, kdx) => {
          const point = this.drawingProj(p)
          kdx === 0
            ? ctx.moveTo(...point)
            : ctx.lineTo(...point)
        })
        ctx.stroke()
      })
    })
  }

  drawMouse = () => {
    if (!this.mouse) return
    const ctx = this.cutter.getContext('2d')
    const [x, y] = this.cutterProj(this.mouse)
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255, 0, 0, 0.9)'
    ctx.strokeStyle = 'rgba(0, 0, 0, 1)'
    ctx.arc(x, y, 10, 0, 2 * Math.PI)
    ctx.fill()
    ctx.stroke()
  }

  mouseMoveHandler = e => {
    this.mouse = this.drawingProj.invert([e.offsetX * 2, e.offsetY * 2])
    this.draw()
  }
}
