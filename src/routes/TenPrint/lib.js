const { setTimeout, clearTimeout } = window

const last = (array, d = 0) => array.slice(-1 - d)[0]

export class TubeGrid {
  constructor({ canvas, lineSize, interval }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.lineSize = lineSize
    this.interval = interval
    this.lines = [[]]
    this.running = false
    this.timeout = setTimeout(this.addLine, this.interval)
    this.signSize = canvas.width / lineSize
  }

  toggle = () => { this.running = !this.running }

  addLine = () => {
    if (!this.running) return setTimeout(this.addLine, this.interval)
    const char = Math.random() >= 0.5 ? '/' : '\\'
    const hasWater = this.checkWater(char)
    const newChar = { char, hasWater }
    if (last(this.lines).length === this.lineSize) {
      this.lines.push([newChar])
    } else {
      this.lines[this.lines.length - 1].push(newChar)
    }
    this.draw()
    setTimeout(this.addLine, this.interval)
  }

  checkWater = char => {
    if (
      this.lines.length === 1 &&
      last(this.lines).length !== this.lineSize
    ) return true
    const currentLine = last(this.lines)
    const previousLine = last(this.lines, 1)
    const previous = last(currentLine)
    const over = previousLine[currentLine.length]
    if (previous.char === char) return false
    return false
  }

  drawSign = ({ sign, y, x }) => {
    this.ctx.beginPath()
    const [x0, x1] = sign === '/'
      ? [this.signSize * (x + 1), this.signSize * x]
      : [this.signSize * x, this.signSize * (x + 1)]
    const y0 = this.signSize * y
    const y1 = this.signSize * (y + 1)
    this.ctx.moveTo(x0, y0)
    this.ctx.lineTo(x1, y1)
    this.ctx.stroke()
  }

  drawWater = ({ sign, x, y }) => {
    this.ctx.beginPath()
    const [x0, x1] = sign === '/'
      ? [this.signSize * (x + 1), this.signSize * x]
      : [this.signSize * x, this.signSize * (x + 1)]
    const y0 = this.signSize * y
    const y1 = this.signSize * (y + 1)
    this.ctx.moveTo(x0, y0)
    this.ctx.lineTo(x1, y1)
    this.ctx.lineTo(x1, y0)
    this.ctx.fillStyle = 'rgba(0, 0, 255, 0.4)'
    this.ctx.fill()
  }

  draw = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.lines.forEach((row, y) => {
      row.forEach((sign, x) => {
        sign.hasWater && this.drawWater({ sign: sign.char, x, y })
        this.drawSign({ sign: sign.char, x, y })
      })
    })
  }

  shutDown = () => clearTimeout(this.timeout)
}
