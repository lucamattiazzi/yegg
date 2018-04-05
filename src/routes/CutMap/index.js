import React from 'react'
import { MapCutter } from './lib'

export class CutMap extends React.Component {
  state = { width: 0, height: 0 }

  draw = () => {
    const { width, height } = this.state
    this.lights = new MapCutter(this.drawingCanvas, this.cutterCanvas, width, height)
    this.lights.generate()
  }

  renderContainer = div => {
    this.setState({
      width: div.offsetWidth * 0.95,
      height: div.offsetHeight * 0.95,
    }, this.draw)
  }

  renderDrawingCanvas = drawingCanvas => { this.drawingCanvas = drawingCanvas }

  renderCutterCanvas = cutterCanvas => { this.cutterCanvas = cutterCanvas }

  render() {
    const { width, height } = this.state
    const style = { width: width, height: height / 2 }
    return (
      <div className="w-100 h-100 flex items-center justify-around flex-column relative" ref={this.renderContainer}>
        <canvas
          ref={this.renderDrawingCanvas}
          className="bg-navy"
          width={width * 2}
          height={height}
          style={style}
        />
        <canvas
          ref={this.renderCutterCanvas}
          className="bg-navy"
          width={width * 2}
          height={height}
          style={style}
        />
      </div>
    )
  }
}
