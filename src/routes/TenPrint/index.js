import React from 'react'
import { TubeGrid } from './lib'

export class TenPrint extends React.Component {
  state = { width: 0, height: 0 }

  componentWillUnmount() {
    this.tubeGrid && this.tubeGrid.shutDown()
  }

  toggle = () => this.tubeGrid.toggle()

  renderCanvas = canvas => {
    if (!canvas) return
    const width = canvas.offsetWidth
    const height = canvas.offsetHeight
    canvas.width = width * 2
    canvas.height = height * 2
    this.tubeGrid = new TubeGrid({ canvas, lineSize: 40, interval: 10 })
  }

  render() {
    return (
      <div className="w-100 h-100 flex flex-column items-center justify-center relative">
        <div className="absolute top-2 w-100 tc">10 Print</div>
        <div
          className="absolute top-2 right-2 pointer white bg-black pa2"
          onClick={this.toggle}
        >Toggle</div>
        <div className="w-50 h-70 flex items-center justify-center">
          <canvas className="w-100 h-100 bg-white" ref={this.renderCanvas} />
        </div>
      </div>
    )
  }
}
