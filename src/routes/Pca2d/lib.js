import { generateCorrelatedData } from './stats'
import { POINT_RADIUS, ALLOWED_SIZE } from './constants'

export class Lights {
  constructor(canvas, width, height) {
    this.canvas = canvas
    this.width = width
    this.height = height
    this.ctx = canvas.getContext('2d')
    this.points = []
    this.light = [[0, this.height * 0.1], [this.width * 2, this.height * 0.1]]
    this.canvas.addEventListener('click', this.clickHandler)
  }

  generate = () => {
    this.points = generateCorrelatedData()
    this.draw()
  }

  clickHandler = e => {
    console.log(e.pageX)
  }

  drawPoint = (p, idx, points) => {
    const { width, height } = this.canvas
    const x = width * ((1 - ALLOWED_SIZE) / 2 + p[0] * ALLOWED_SIZE)
    const y = height * ((1 - ALLOWED_SIZE) / 2 + p[1] * ALLOWED_SIZE)
    const red = (255 - points.length) + idx
    this.ctx.fillStyle = `rgb(${red}, 0, 0)`
    this.ctx.beginPath()
    this.ctx.arc(x, y, POINT_RADIUS, 0, 2 * Math.PI, true)
    this.ctx.fill()
  }

  drawLight = () => {
    this.ctx.strokeStyle = 'rgb(255, 255, 0)'
    this.ctx.lineWidth = 5
    this.ctx.beginPath()
    this.ctx.moveTo(...this.light[0])
    this.ctx.lineTo(...this.light[1])
    this.ctx.stroke()
  }

  draw = () => {
    this.points.forEach(this.drawPoint)
    this.drawLight()
    // this.drawProjections()
  }
}
