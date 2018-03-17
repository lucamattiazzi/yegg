import { ATOMS } from 'routes/DrawMolecule/constants/atoms'
import React from 'react'
import { observer, inject } from 'mobx-react'
const SIZE = '40px'

const atomStyle = color => ({
  width: SIZE,
  height: SIZE,
  borderRadius: '100%',
  border: '1px solid black',
  backgroundColor: color,
  textAlign: 'center',
  lineHeight: SIZE,
})

@inject('state')
@observer
export class AtomList extends React.Component {
  dragStartHandler = atom => e => {
    this.props.state.draggingStart(atom)
  }

  dragEndHandler = atom => e => {
    window.setTimeout(this.props.state.draggingStop, 100)
  }

  dragHandler = atom => e => {
  }

  renderAtom = (atom, idx) => {
    const dragStartHandler = this.dragStartHandler(atom)
    const dragEndHandler = this.dragEndHandler(atom)
    const dragHandler = this.dragHandler(atom)
    return (
      <div className="pa2" key={atom.symbol}>
        <div
          className="pointer bg-transparent"
          style={atomStyle(atom.color)}
          onDragStart={dragStartHandler}
          onDragEnd={dragEndHandler}
          onDrag={dragHandler}
          draggable
        >
          {atom.symbol}
        </div>
      </div>
    )
  }

  render() {
    return (
      <div className="flex w-50 justify-around">
        {
          Object.values(ATOMS).map(this.renderAtom)
        }
      </div>
    )
  }
}
