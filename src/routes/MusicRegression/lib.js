import { regress } from './stats'
import { notesPlayer, equationPlayer, KEYS } from './player'

const { localStorage } = window
const LINES = Array.from({ length: 5 }, (_, idx) => idx)
const LINE_HEIGHT = 40
const LINE_WIDTH = 3
const HORIZONTAL_PADDING = 0
const DOT_RADIUS = 10

export class MusicSheet {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.points = JSON.parse(localStorage.getItem('points') || '[]')
    const verticalPadding = (this.canvas.height - (LINES.length - 1) * LINE_HEIGHT) / 2
    this.linesPosition = LINES.map(idx => {
      const x0 = HORIZONTAL_PADDING
      const x1 = this.canvas.width - HORIZONTAL_PADDING
      const y0 = verticalPadding + idx * LINE_HEIGHT
      const y1 = y0
      return [[x0, y0], [x1, y1]]
    })
    this.canvas.addEventListener('click', this.clickHandler)
    this.equationPlayer = equationPlayer(this.canvas)
    this.draw()
  }

  clickHandler = e => {
    const point = [
      e.pageX - this.canvas.offsetLeft,
      e.pageY - this.canvas.offsetTop,
    ]
    const lineIdx = this.linesPosition.findIndex(line => {
      const y0 = line[0][1]
      const distance = Math.abs(point[1] - y0 / 2)
      return distance <= DOT_RADIUS
    })
    if (lineIdx === -1) return
    const note = {
      coordinates: [
        point[0] * 2,
        this.linesPosition[lineIdx][0][1],
      ],
      key: KEYS[4 - lineIdx],
    }
    this.points.push(note)
    this.draw()
  }

  draw = () => {
    this.clear()
    this.drawLines()
    this.drawPoints()
    this.drawRegression()
  }

  clear = () => { this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height) }

  drawLines = () => {
    this.linesPosition.forEach(([[x0, y0], [x1, y1]]) => {
      this.ctx.beginPath()
      this.ctx.lineWidth = LINE_WIDTH
      this.ctx.strokeStyle = '#ffffff'
      this.ctx.moveTo(x0, y0)
      this.ctx.lineTo(x1, y1)
      this.ctx.stroke()
    })
  }

  drawPoints = () => {
    this.points.forEach(({ coordinates }) => {
      this.ctx.beginPath()
      this.ctx.arc(coordinates[0], coordinates[1], DOT_RADIUS, 0, 2 * Math.PI, false)
      this.ctx.fillStyle = '#cccccc'
      this.ctx.fill()
      this.ctx.lineWidth = 1
      this.ctx.strokeStyle = '#999999'
      this.ctx.stroke()
    })
  }

  drawRegression = () => {
    if (this.points.length < 2) return
    this.transformer = regress(this.points.map(p => p.coordinates))
    this.ctx.beginPath()
    this.ctx.lineWidth = LINE_WIDTH / 2
    this.ctx.strokeStyle = '#cccccc'
    for (let i = 0; i < this.canvas.width; i++) {
      i === 0
        ? this.ctx.moveTo(i, this.transformer(i))
        : this.ctx.lineTo(i, this.transformer(i))
    }
    this.ctx.stroke()
  }

  save = () => {
    localStorage.setItem('points', JSON.stringify(this.points))
  }

  reset = () => {
    this.points = []
    this.draw()
  }

  playNotes = async () => {
    await notesPlayer(this.points)
  }

  playRegression = async () => {
    await this.equationPlayer(this.transformer)
  }
}
