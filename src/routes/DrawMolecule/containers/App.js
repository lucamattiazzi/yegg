import React from 'react'
import { CanvasDrawer } from 'routes/DrawMolecule/containers/CanvasDrawer'
import { CanvasRenderer } from 'routes/DrawMolecule/containers/CanvasRenderer'
import { AtomList } from 'routes/DrawMolecule/containers/AtomList'
import { Buttons } from 'routes/DrawMolecule/containers/Buttons'
import { observer, inject } from 'mobx-react'

@inject('state')
@observer
export class App extends React.Component {
  render() {
    return (
      <div className="flex flex-column w-100 h-100">
        <div className="flex w-100 h-90 mh-90 relative">
          <div className="flex w-50 h-100 mh-100 relative">
            <CanvasDrawer className="h-100 w-100 absolute bg-black-20" />
          </div>
          <div className="flex w-50 h-100 mh-100 relative">
            <CanvasRenderer className="h-100 w-100 absolute bg-black-20" />
          </div>
        </div>
        <div className="flex w-100 h-10 bg-black-50">
          <AtomList />
          <Buttons />
        </div>
      </div>
    )
  }
}
