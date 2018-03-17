import React from 'react'
import { App } from 'routes/DrawMolecule/containers/App'
import { Provider } from 'mobx-react'
import { state } from 'routes/DrawMolecule/state'

export class DrawMolecule extends React.Component {
  render() {
    return (
      <Provider state={state}>
        <App />
      </Provider>
    )
  }
}
