import React from 'react'
import { groupBy, meanBy, minBy, maxBy } from 'lodash'

const CIRCLE_RADIUS = 10
const { fetch } = window

export class HelloWorldData extends React.Component {
  state = {
    width: 0,
    height: 0,
    data: [],
    categories: [],
    xSelected: '',
    ySelected: '',
  }

  async componentWillMount() {
    const response = await fetch('/genetic-hello-world-results.json')
    const data = await response.json()
    const categories = Object.keys(data[0])
    const xSelected = categories[0]
    const ySelected = categories[1]
    this.setState({ data, categories, xSelected, ySelected }, this.updateCanvas)
  }

  renderContainer = div => {
    if (!div) return
    this.canvas.width = div.offsetWidth * 1.6
    this.canvas.height = div.offsetHeight * 1.2
    this.setState({
      width: div.offsetWidth,
      height: div.offsetHeight,
    })
  }

  renderCanvas = canvas => {
    if (!canvas) return
    this.canvas = canvas
    this.ctx = this.canvas.getContext('2d')
  }

  handleXSelect = e => {
    this.setState({ xSelected: e.target.value }, this.updateCanvas)
  }

  handleYSelect = e => {
    this.setState({ ySelected: e.target.value }, this.updateCanvas)
  }

  updateCanvas = () => {
    const { width, height } = this.canvas
    const { xSelected, ySelected, data } = this.state
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)

    const availableWidth = width - 2 * CIRCLE_RADIUS
    const availableHeight = height - 2 * CIRCLE_RADIUS
    const grouped = groupBy(data, xSelected)
    const stats = this.getStats(grouped, ySelected)
    console.log(stats)
    const columnWidth = availableWidth / stats.length
    const yMin = (minBy(stats, ySelected))[ySelected]
    const yMax = (maxBy(stats, ySelected))[ySelected]
    const yScale = v => availableHeight * (v - yMin) / (yMax - yMin)
    stats.forEach((p, idx) => {
      const xPoint = CIRCLE_RADIUS + idx * columnWidth
      const yPoint = height - (CIRCLE_RADIUS + yScale(p[ySelected]))
      this.ctx.beginPath()
      this.ctx.arc(xPoint, yPoint, CIRCLE_RADIUS, 0, 2 * Math.PI)
      this.ctx.fill()
    })
  }

  getStats = (grouped, ySelected) => (
    Object.entries(grouped).map(([x, values]) => (
      { x, [ySelected]: meanBy(values, ySelected) }
    ))
  )

  render() {
    const { xSelected, ySelected, categories } = this.state
    return (
      <div className="w-100 h-100 flex flex-column justify-center items-center overflow-scroll relative" ref={this.renderContainer}>
        <div className="absolute top-2 right-2 flex flex-column">
          <div>X axys</div>
          <select className="mv2" selected={xSelected} onChange={this.handleXSelect}>
            { categories.filter(c => c !== ySelected).map(cat => <option key={cat} value={cat}>{cat}</option>) }
          </select>
          <div>Y axys</div>
          <select className="mv2" selected={ySelected} onChange={this.handleYSelect}>
            { categories.filter(c => c !== xSelected).map(cat => <option key={cat} value={cat}>{cat}</option>) }
          </select>
        </div>
        <canvas className="w-80 h-60" ref={this.renderCanvas} />
      </div>
    )
  }
}
