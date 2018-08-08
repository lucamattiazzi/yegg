const sleep = ms => new Promise(
  (resolve, reject) => window.setTimeout(resolve, ms)
)

class Experiment {
  constructor(world, lambda) {
    this.world = world
    this.lambda = lambda
    this.val = this.world.generator()
    this.values = []
  }

  update() {
    this.val = this.lambda * this.val * (1 - this.val)
    this.values.push(this.val)
    this.values = this.values.slice(-this.world.renderedPoints)
  }

  draw(x) {
    const { columnWidth, ctx, height, verticalMargin } = this.world
    this.values.forEach(val => {
      const scaledVal = this.world.scale(val)
      const y = verticalMargin + height - scaledVal * height
      ctx.fillRect(x, y, columnWidth, columnWidth)
    })
  }
}

export class Logistic {
  constructor(canvas, { generator, lambda, renderedPoints, points, interval }) {
    this.canvas = canvas
    this.generator = generator || Math.random
    this.lambda = lambda || 4
    this.renderedPoints = renderedPoints || 16
    this.points = points || 1000
    this.interval = interval || 10
    this.ctx = canvas.getContext('2d')
    this.width = this.canvas.width * 0.9
    this.height = this.canvas.height * 0.9
    this.horizontalMargin = this.canvas.width * 0.05
    this.verticalMargin = this.canvas.height * 0.05
    this.columnWidth = this.width / this.points
    this.maxVal = 1
    this.minVal = 0
    this.experiments = Array.from(
      { length: this.points },
      this.generateExperiment.bind(this)
    )
  }

  generateExperiment(_, idx) {
    const lambda = this.lambda * idx / this.points
    const experiment = new Experiment(this, lambda)
    return experiment
  }

  update() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.experiments.forEach((exp, idx) => {
      const x = this.horizontalMargin + this.width * idx / this.points
      exp.update()
      exp.draw(x)
    })
  }

  scale(val) {
    return (val - this.minVal) / (this.maxVal - this.minVal)
  }

  async drawLoop() {
    if (!this.running) return
    this.update()
    await sleep(this.interval)
    this.drawLoop()
  }

  stop() {
    this.running = false
  }

  async start() {
    this.running = true
    await this.drawLoop()
  }
}