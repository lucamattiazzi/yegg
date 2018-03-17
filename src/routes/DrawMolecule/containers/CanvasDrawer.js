import React from 'react'
import { Drawer2d } from 'routes/DrawMolecule/lib/drawer2d'
import { observer, inject } from 'mobx-react'

const pointers = {
  'Alt': 'move',
  'Meta': 'no-drop',
  [undefined]: 'crosshair',
}

@inject('state')
@observer
export class CanvasDrawer extends React.Component {
  state = { cursor: 'crosshair' }

  canvasRendered = canvas => {
    const { state } = this.props
    const ctx = canvas.getContext('2d')
    canvas.height = canvas.offsetHeight
    canvas.width = canvas.offsetWidth
    state.setContext2d(canvas, ctx)
    this.drawer = new Drawer2d(canvas, ctx, state)
    window.addEventListener('keydown', this.handleKeyDown)
    window.addEventListener('keyup', this.handleKeyUp)
  }

  handleKeyDown = e => {
    const cursor = pointers[e.key] || this.state.cursor
    this.setState({ cursor })
  }

  handleKeyUp = () => {
    const cursor = pointers[undefined]
    this.setState({ cursor })
  }

  render() {
    return (
      <canvas
        className={this.props.className}
        style={{ cursor: this.state.cursor }}
        ref={this.canvasRendered}
      />
    )
  }
}
