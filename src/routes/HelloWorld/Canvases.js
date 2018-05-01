import React from 'react'

export class Canvases extends React.Component {
  componentDidMount() {
    this.props.setCanvases(this.canvases)
  }

  canvases = {}

  renderCanvas = name => canvas => {
    if (!canvas) return
    if (this.canvases[name]) return
    canvas.width = canvas.offsetWidth * 2
    canvas.height = canvas.offsetHeight * 2
    const ctx = canvas.getContext('2d')
    this.canvases[name] = { canvas, ctx }
  }

  render() {
    return (
      <div className="flex h-50 w-100 justify-center items-center">
        <div className="flex h-50 w-100 justify-center items-center">
          <canvas id="mean" ref={this.renderCanvas('mean')} className="w-50 h-100" />
          <canvas id="best" ref={this.renderCanvas('best')} className="w-50 h-100" />
        </div>
      </div>
    )
  }
}
