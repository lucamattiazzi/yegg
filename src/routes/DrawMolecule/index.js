import React from 'react'
import { Provider } from 'mobx-react'
import { App } from './containers/App'
import { createState } from './state'

export class DrawMolecule extends React.Component {
  render() {
    return (
      <Provider state={createState()}>
        <App />
      </Provider>
    )
  }
}
