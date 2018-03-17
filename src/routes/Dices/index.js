import React from 'react'
import { Plotter } from 'routes/Dices/lib'

const STARTING_PLOTS = [
  { rounds: 10000, color: 'red' },
  { rounds: 1000, color: 'blue' },
  { rounds: 500, color: 'green' },
]

export class Dices extends React.Component {
  state = {
    rounds: 0,
    color: 'black',
    plots: [...STARTING_PLOTS],
  }

  setValue = value => e => this.setState({ [value]: e.target.value })

  createPlotter = () => {
    this.plotter =
      this.plotter ||
      new Plotter({ ...this.state, canvas: this.canvas })
  }

  canvasRendered = canvas => {
    this.canvas = canvas
  }

  addPlot = () => {
    const { plots, rounds, color } = this.state
    this.setState({
      plots: [ ...plots, { rounds, color } ],
      rounds: 0,
      color: 'color',
    })
  }

  runTest = () => {
    this.plotter.draw(this.state.plots)
  }

  container = div => {
    if (!div) return
    const width = div.offsetWidth * 2
    const height = div.offsetHeight * 2
    this.setState({ height, width }, this.createPlotter)
  }

  render() {
    const { width, height, plots } = this.state
    const { input } = this
    return (
      <div className="w-100 h-100 flex flex-column items-center justify-center" >
        <div className="w-100 flex items-center justify-center">
          <label htmlFor="rounds">Rounds:</label>
          <input type="number" id="rounds" value={this.state.rounds} onChange={this.setValue('rounds')} />
          <label htmlFor="color">Color:</label>
          <input type="text" id="color" value={this.state.color} onChange={this.setValue('color')} />
          <input type="submit" onClick={this.addPlot} />
        </div>
        <div ref={this.container} className="w-100 h-100">
          <canvas className="w-100 h-100" width={width} height={height} ref={this.canvasRendered} />
        </div>
        <div className="pa2 ba b--black pointer" onClick={this.runTest}>
          RUN!
        </div>
        <div className="pa2">
          {
            plots.map(({ color, rounds }, idx) => (
              <div key={idx}>
                <span>{color} - {rounds}</span>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
