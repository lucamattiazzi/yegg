import { testRandom, wait } from 'lib/utils'

const MARGIN = 60
const FACE_EXTENT = [2, 200]
const ERROR_TICKS = [0.1, 0.25, 0.5, 0.75, 0.9]
const FACE_ARRAY = Array.from(
  { length: FACE_EXTENT[1] - FACE_EXTENT[0] },
  (_, idx) => FACE_EXTENT[0] + idx
)

class Plotter {
  constructor({ canvas, ctx }) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.drawPlot()
  }

  drawPlot() {
    this.ctx.strokeStyle = '#000000'
    this.ctx.fillStyle = `rgba(0, 0, 0, 1)`
    this.ctx.lineWidth = 4
    const { width, height } = this.canvas
    const plotWidth = width - MARGIN * 2
    const cellWidth = plotWidth / FACE_ARRAY.length
    const smallMargin = MARGIN - 3
    this.ctx.moveTo(smallMargin, height - smallMargin)
    this.ctx.lineTo(width, height - smallMargin)
    this.ctx.moveTo(smallMargin, smallMargin)
    this.ctx.lineTo(smallMargin, height - smallMargin)
    this.ctx.stroke()
    this.ctx.font = '30px monospace'
    this.ctx.textAlign = 'center'
    FACE_ARRAY.forEach((faces, idx) => {
      if (idx % 10 !== 0) return
      this.ctx.fillText(faces, MARGIN + (idx + 0.5) * cellWidth, height)
    })
    ERROR_TICKS.forEach(tick => {
      this.ctx.fillText(tick, 6, height - height * tick)
    })
  }

  async draw(plots) {
    const { width, height } = this.canvas
    const plotWidth = width - MARGIN * 2
    const plotHeight = height - MARGIN * 2
    const unitWidth = plotWidth / FACE_ARRAY.length
    this.ctx.clearRect(MARGIN, MARGIN, plotWidth, plotHeight)
    for (let idx = 0; idx < plots.length; idx++) {
      const { color, rounds } = plots[idx]
      this.ctx.fillStyle = color
      for (let jdx = 0; jdx < FACE_ARRAY.length; jdx++) {
        const faces = FACE_ARRAY[jdx]
        const errors = testRandom({ faces, rounds })
        const cx = MARGIN + jdx * unitWidth
        const cy = MARGIN + (plotHeight - errors * plotHeight)
        this.ctx.beginPath()
        this.ctx.arc(cx, cy, 3, 0, Math.PI * 2, true)
        this.ctx.closePath()
        this.ctx.fill()
        await wait(1)
      }
    }
  }
}

export { Plotter }
