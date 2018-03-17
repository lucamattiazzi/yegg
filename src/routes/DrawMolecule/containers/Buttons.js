import React from 'react'
import { Button } from 'routes/DrawMolecule/components/Button'
import { observer, inject } from 'mobx-react'

@inject('state')
@observer
export class Buttons extends React.Component {
  render() {
    return (
      <div className="flex w-50 justify-around">
        <Button
          text="RESET"
          clickHandler={this.props.state.reset}
        />
        <Button
          text="GET STRUCTURE"
          clickHandler={this.props.state.logStructure}
        />
      </div>
    )
  }
}
