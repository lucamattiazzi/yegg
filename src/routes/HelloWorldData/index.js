import React from 'react'
import { independentVars, dependentVars, drawer } from './lib'
import { Input } from './Input'
import { Scale } from './Scale'
const { fetch } = window

export class HelloWorldData extends React.Component {
  state = {
    width: 0,
    height: 0,
    data: [],
    xAxys: independentVars[0],
    yAxys: independentVars[0],
    color: dependentVars[1],
    max: 0,
    min: 0,
  }

  async componentWillMount() {
    const response = await fetch('/hello-world-results-160k.json')
    const data = await response.json()
    this.setState({ data }, this.updateCanvas)
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

  setValue = k => e => this.setState({ [k]: e.target.value }, this.updateCanvas)

  setScale = key => val => this.setState({ [key]: val })

  updateCanvas = () => drawer(this)

  render() {
    const { xAxys, yAxys, color, max, min } = this.state
    return (
      <div className="w-100 h-100 flex flex-column justify-center items-center overflow-scroll relative" ref={this.renderContainer}>
        <Input
          setValue={this.setValue}
          independentVars={independentVars}
          dependentVars={dependentVars}
          xAxys={xAxys}
          yAxys={yAxys}
          color={color}
        />
        <Scale
          max={max}
          min={min}
        />
        <canvas className="w-80 h-60" ref={this.renderCanvas} />
      </div>
    )
  }
}
