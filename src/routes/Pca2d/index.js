import React from 'react'
import { Lights } from 'routes/Pca2d/lib'

export class Pca2d extends React.Component {
  state = { width: 0, height: 0 }

  draw = () => {
    const { width, height } = this.state
    this.lights = new Lights(this.canvas, width, height)
    this.lights.generate()
  }

  renderContainer = div => {
    if (!div) return
    this.setState({
      width: div.offsetWidth * 0.95,
      height: div.offsetHeight * 0.95,
    }, this.draw)
  }

  renderCanvas = canvas => { this.canvas = canvas }

  render() {
    const { width, height } = this.state
    const style = { width: width, height: height }
    return (
      <div className="w-100 h-100 flex items-center justify-center relative" ref={this.renderContainer}>
        <canvas
          ref={this.renderCanvas}
          className="bg-navy"
          width={width * 2}
          height={height * 2}
          style={style}
        />
      </div>
    )
  }
}
