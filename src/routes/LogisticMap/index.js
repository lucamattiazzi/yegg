import React from 'react'
import { Logistic } from './lib'

const fixFn = val => () => val

export class LogisticMap extends React.Component {
  state = {
    valueGenerator: undefined,
    started: false,
    lambda: 4,
    renderedPoints: 32,
    points: 2000,
    interval: 10,
  }

  componentWillUnmount() {
    this.world.stop()
  }

  canvasRendered = canvas => {
    if (!canvas) return
    const { valueGenerator, lambda, renderedPoints, points, interval } = this.state
    const generator = valueGenerator === undefined ? Math.random : fixFn(valueGenerator)
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    this.world = new Logistic(canvas, { generator, lambda, renderedPoints, points, interval })
    this.world.start()
  }

  renderCanvas = () => (
    <canvas className="w-100 h-100" ref={this.canvasRendered} />
  )

  handleSubmit = e => {
    e.preventDefault()
    e.stopPropagation()
    this.setState({ started: true })
  }

  handleCheckbox = e => {
    const valueGenerator = e.target.checked ? undefined : 0
    this.setState({ valueGenerator })
  }

  handleInput = key => e => this.setState({ [key]: e.target.value })

  renderSlider = ({ name, key, min, max, step }) => (
    <label className="pa3 flex flex-column justify-center items-center">
      {name}
      <input
        type="range"
        className="w-100"
        min={min}
        max={max}
        step={step}
        value={this.state[key]}
        onChange={this.handleInput(key)}
      />
      <div className="pa2 tc f4">{this.state[key]}</div>
    </label>
  )

  renderForm = () => {
    const { valueGenerator } = this.state
    const checked = valueGenerator === undefined
    return (
      <div className="w-100 h-100 flex justify-center">
        <form action="#" className="flex flex-column w-40 h-100" onSubmit={this.handleSubmit}>
          {this.renderSlider({ name: 'LambdaMax', key: 'lambda', min: 1, max: 7, step: 0.5 })}
          {this.renderSlider({ name: 'RenderedPoints', key: 'renderedPoints', min: 1, max: 256, step: 1 })}
          {this.renderSlider({ name: 'TotalPoints', key: 'points', min: 10, max: 4000, step: 10 })}
          {this.renderSlider({ name: 'Interval', key: 'interval', min: 1, max: 1000, step: 1 })}
          <label className="pa4 flex flex-column justify-center items-center">
            Generate Random
            <input type="checkbox" checked={checked} onChange={this.handleCheckbox} />
          </label>
          <label className="pa4 flex flex-column justify-center items-center">
            Select Fixed
            <input
              type="range"
              className="w-100"
              min="0"
              max="1"
              step="0.0001"
              value={valueGenerator || 0}
              disabled={checked}
              onChange={this.handleInput('valueGenerator')}
            />
            <div className="pa2 tc f4">{checked ? 'Random!' : valueGenerator}</div>
          </label>
          <input type="submit" value="Start!" className="pa3 ma4 br2" />
        </form>
      </div>
    )
  }

  render() {
    const { started } = this.state
    return (
      <div className="w-100 h-100">
        {started ? this.renderCanvas() : this.renderForm()}
      </div>
    )
  }
}
