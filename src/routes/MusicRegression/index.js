import React from 'react'
import { MusicSheet } from './lib'

export class MusicRegression extends React.Component {
  state = { width: 0, height: 0 }

  sheet = {}

  draw = () => {
    this.sheet = new MusicSheet(this.canvas)
  }

  renderContainer = div => {
    this.setState({
      width: div.offsetWidth * 0.9,
      height: div.offsetHeight * 0.85,
    }, this.draw)
  }

  renderCanvas = canvas => { this.canvas = canvas }

  save = () => this.sheet.save()

  reset = () => this.sheet.reset()

  play = () => this.sheet.play()

  render() {
    const { width, height } = this.state
    const style = { width: width, height: height }
    return (
      <div className="w-100 h-100 flex items-center justify-center relative" ref={this.renderContainer}>
        <div className="absolute flex top-1 justify-center">
          <div className="ph2 ba b--black" onClick={this.save}>Save</div>
          <div className="ph2 ba b--black" onClick={this.reset}>Reset</div>
          <div className="ph2 ba b--black" onClick={this.play}>Play</div>
        </div>
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
