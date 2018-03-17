import { max, min, maxBy, round, sum } from 'lodash'

class Walker {
  constructor({ dimensions, canvas, constants }) {
    Object.assign(this, constants)
    this.dimensions = dimensions
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
  }

  drawAxys(maxDistance, maxFrequency) {
    this.ctx.strokeStyle = '#000000'
    this.ctx.fillStyle = `rgba(0, 0, 0, 1)`
    this.ctx.lineWidth = 3
    this.ctx.font = '20px monospace'
    this.ctx.textAlign = 'start'
    const { height, width } = this.canvas
    const horizontalTicks = Math.floor(maxDistance / this.GROUPING_SIZE)
    const horizontalTick = (width - 2 * this.MARGIN) / horizontalTicks
    const verticalTicks = Math.floor(maxFrequency / this.VERTICAL_TICK_SIZE)
    const verticalTick = (height - 2 * this.MARGIN) / verticalTicks
    this.ctx.fillText('Dist', this.MARGIN, height - 10)
    Array.from(
      { length: horizontalTicks },
      (_, idx) => {
        if (idx === 0 || idx % 10 !== 0) return
        this.ctx.fillText(idx * this.GROUPING_SIZE, this.MARGIN + idx * horizontalTick, height - 10)
      }
    )
    this.ctx.save()
    this.ctx.translate(25, height - this.MARGIN)
    this.ctx.rotate(-Math.PI / 2)
    this.ctx.fillText('Freq', 0, 0)
    this.ctx.restore()
    Array.from(
      { length: verticalTicks },
      (_, idx) => {
        if (idx === 0) return
        this.ctx.save()
        this.ctx.translate(25, height - (this.MARGIN + idx * verticalTick))
        this.ctx.rotate(-Math.PI / 2)
        this.ctx.fillText(round(idx * this.VERTICAL_TICK_SIZE, 3), 0, 0)
        this.ctx.restore()
      }
    )
  }

  start() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    const allDimensions = this.dimensions.map(dimension => {
      const results = Array.from(
        { length: this.TIMES },
        () => this.walk(dimension)
      )
      const all = results.reduce((acc, walk) => {
        return {
          max: Math.max(acc.max, walk.max),
          crossed: walk.crossed ? acc.crossed + 1 : acc.crossed,
          distances: [...acc.distances, ...walk.distances],
        }
      }, { min: 0, max: 0, crossed: 0, distances: [] })
      return { all, dimension }
    })
    const maxDistance = maxBy(allDimensions, 'all.max').all.max
    const groupedDimensions = allDimensions.reduce((acc, { all, dimension }) => {
      const barLength = Math.floor(maxDistance / this.GROUPING_SIZE) + 1
      const groupedDistances = all.distances.reduce((grouped, distance) => {
        const index = Math.floor(distance / this.GROUPING_SIZE)
        grouped[index]++
        return grouped
      }, Array.from({ length: barLength }, () => 0))
      const avg = sum(all.distances) / all.distances.length
      const maxBar = max(groupedDistances) / (this.STEPS * this.TIMES)
      const median = groupedDistances.indexOf(max(groupedDistances)) * this.GROUPING_SIZE
      const variance = all.distances.reduce((accVariance, dist) => (
        accVariance + (dist - avg) ** 2
      ), 0) / all.distances.length
      const std = Math.sqrt(variance)
      const plot = {
        all,
        dimension,
        groupedDistances,
        maxBar,
        median,
        avg,
        std,
      }
      return {
        plots: [...acc.plots, plot],
        maxFrequency: Math.max(acc.maxFrequency, maxBar),
      }
    }, { plots: [], maxFrequency: 0 })
    groupedDimensions.plots.forEach(({ maxFrequency, groupedDistances, dimension }) => {
      this.draw(groupedDistances, dimension, maxDistance, groupedDimensions.maxFrequency)
    })
    this.drawAxys(maxDistance, groupedDimensions.maxFrequency)
    return groupedDimensions.plots
  }

  draw(groupedDistances, dimension, maxDistance, maxBar) {
    const width = this.canvas.width - 2 * this.MARGIN
    const height = this.canvas.height - 2 * this.MARGIN
    const barLength = Math.floor(maxDistance / this.GROUPING_SIZE) + 1
    const maxBarHeight = height
    const barWidth = width / barLength
    this.ctx.lineWidth = 1
    this.ctx.strokeStyle = dimension.color
    this.ctx.fillStyle = dimension.color
    groupedDistances.forEach((bar, idx) => {
      const barHeight = (maxBarHeight * bar) / (maxBar * (this.STEPS * this.TIMES))
      this.ctx.beginPath()
      this.ctx.rect(this.MARGIN + barWidth * idx, this.MARGIN + height - barHeight, barWidth, barHeight)
      this.ctx.save()
      this.ctx.globalAlpha = 0.3
      this.ctx.fillRect(this.MARGIN + barWidth * idx, this.MARGIN + height - barHeight, barWidth, barHeight)
      this.ctx.restore()
      this.ctx.stroke()
    })
    return maxBar / (this.STEPS * this.TIMES)
  }

  walk(dimension) {
    const position = Array.from({ length: dimension.size }, () => 0)
    const distances = Array.from(
      { length: this.STEPS },
      () => {
        const move = Math.random() >= 0.5 ? 1 : -1
        const direction = Math.floor(Math.random() * dimension.size)
        position[direction] += move
        const distance = Math.sqrt(position.reduce((acc, coord) => acc + coord ** 2, 0))
        return distance
      }
    )
    return {
      distances,
      max: max(distances),
      crossed: min(distances) === 0,
    }
  }
}

export { Walker }
