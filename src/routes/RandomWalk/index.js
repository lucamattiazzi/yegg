import React from 'react'
import { Loader } from 'components/Loader'
import { Walker } from 'routes/RandomWalk/lib'
import { Sidebar } from 'routes/RandomWalk/Sidebar'

const constants = {
  GROUPING_SIZE: 2,
  MARGIN: 40,
  TIMES: 100,
  STEPS: 1e4,
  VERTICAL_TICK_SIZE: 0.005,
}

const STARTING_DIMENSIONS = [
  { color: 'blue', size: 1 },
  { color: 'red', size: 5 },
  { color: 'orange', size: 10 },
]

export class RandomWalk extends React.Component {
  state = {
    color: 'green',
    size: 25,
    dimensions: [...STARTING_DIMENSIONS],
    results: [],
    loading: false,
  }

  renderCanvas = canvas => { this.canvas = canvas }

  setValue = key => e => this.setState({ [key]: e.target.value })

  syncSetState = state => {
    return new Promise((resolve, reject) => {
      this.setState({ ...state }, () => {
        setTimeout(resolve, 1)
      })
    })
  }

  startWalking = async () => {
    const { dimensions, multipleStep } = this.state
    const { canvas } = this
    await this.syncSetState({ loading: true })
    const walker = new Walker({ dimensions, canvas, constants, multipleStep })
    const results = walker.start()
    await this.syncSetState({ results, loading: false })
  }

  container = div => {
    if (!div) return
    const width = div.offsetWidth
    const height = div.offsetHeight
    this.setState({ height, width }, this.createPlotter)
  }

  removeDimension = idx => () => this.setState({ dimensions: this.state.dimensions.filter((d, jdx) => jdx !== idx) })

  addDimension = () => {
    const { color, size } = this.state
    const newDim = { color, size }
    this.setState({
      dimensions: [...this.state.dimensions, newDim],
      color: '',
      size: 1,
    })
  }

  render() {
    const { dimensions, size, color, width, height, results } = this.state
    return (
      <div className="w-100 h-100 flex items-center f4 fw4 relative">
        <div className="w-30 h-90 flex flex-column items-center justify-between br b--black">
          <Sidebar
            dimensions={dimensions}
            size={size}
            color={color}
            results={results}
            constants={constants}
            setValue={this.setValue}
            addDimension={this.addDimension}
            removeDimension={this.removeDimension}
            startWalking={this.startWalking}
          />
        </div>
        <div className="w-70 h-100 flex items-center justify-center" ref={this.container}>
          <canvas ref={this.renderCanvas} className="w-80 h-80 bg-light-silver" width={width} height={height} />
        </div>
        { this.state.loading && <Loader /> }
      </div>
    )
  }
}
