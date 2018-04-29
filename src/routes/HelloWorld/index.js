import React from 'react'
import { GeneticGenerator } from './lib'

export class HelloWorld extends React.Component {
  state = {
    stats: [],
    seedNumber: 40,
    mutationRate: 0.1,
    convergedLimit: 10,
    goal: 'hello world',
    generated: false,
  }

  generate = () => {
    const { seedNumber, mutationRate, goal, convergedLimit } = this.state
    this.generator = new GeneticGenerator({ seedNumber, mutationRate, goal, convergedLimit })
    this.setState({ generated: true }, this.start)
  }

  start = () => {
    const stats = this.generator.runUntilConvergence()
    console.log(stats)
    this.setState({ stats, generated: false })
  }

  setValue = key => e => this.setState({ [key]: e.target.value })

  renderInput = (Input, name) => (
    <div className="flex flex-column items-center justify-center">
      <label className={this.state.generated ? 'gray' : ''}>{name}:</label>
      <Input />
    </div>
  )

  mutationRateInput = () => (
    <input
      disabled={this.state.generated}
      className="ph3 pv2"
      type="range"
      min={0}
      max={1}
      step={0.01}
      value={this.state.mutationRate}
      onChange={this.setValue('mutationRate')}
    />
  )

  seedInput = () => (
    <input
      disabled={this.state.generated}
      className="ph3 pv2"
      type="number"
      min={0}
      max={400}
      step={4}
      value={this.state.seedNumber}
      onChange={this.setValue('seedNumber')}
    />
  )

  convergedLimitInput = () => (
    <input
      disabled={this.state.generated}
      className="ph3 pv2"
      type="number"
      min={0}
      max={100}
      step={1}
      value={this.state.convergedLimit}
      onChange={this.setValue('convergedLimit')}
    />
  )

  goalInput = () => (
    <input
      disabled={this.state.generated}
      className="ph3 pv2"
      type="text"
      value={this.state.goal}
      onChange={this.setValue('goal')}
    />
  )

  render() {
    const { stats } = this.state
    return (
      <div className="w-100 h-100 flex flex-column items-center justify-center overflow-scroll relative" >
        <div className="w-100 flex pv3 justify-between bb b--black">
          { this.renderInput(this.mutationRateInput, 'Mutation Rate') }
          { this.renderInput(this.seedInput, 'Seeds') }
          { this.renderInput(this.convergedLimitInput, 'Converged Limit') }
          { this.renderInput(this.goalInput, 'Goal') }
          <input className="ph3 pv2" type="button" value="Generate" onClick={this.generate} />
        </div>
        <div className="flex flex-column w-100 flex-auto">
          {
            stats.map(({ name, value }, idx) => {
              return <div key={idx}>{name} - {value}</div>
            })
          }
        </div>
      </div>
    )
  }
}
