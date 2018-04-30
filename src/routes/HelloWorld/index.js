import React from 'react'
import { GeneticGenerator, CHARACTER_SET } from './lib'

export class HelloWorld extends React.Component {
  state = {
    stats: [],
    iterations: [],
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
    const { stats, iterations } = this.generator.runUntilConvergence()
    this.setState({ stats, generated: false, iterations })
  }

  setValue = key => e => this.setState({ [key]: e.target.value })

  setGoal = e => {
    const { value } = e.target
    if (value.split('').some(v => CHARACTER_SET.indexOf(v) === -1)) return
    this.setState({ goal: e.target.value })
  }

  renderInput = (Input, name) => (
    <div className="flex flex-column items-center justify-center">
      <label className={this.state.generated ? 'gray' : ''}>{name}:</label>
      <Input />
    </div>
  )

  numericInput = ({ min, max, step, name }) => (
    <input
      disabled={this.state.generated}
      className="pv2 ph3"
      type="number"
      min={min}
      max={max}
      step={step}
      value={this.state[name]}
      onChange={this.setValue(name)}
    />
  )

  mutationRateInput = () => this.numericInput({ min: 0, max: 1, step: 0.01, name: 'mutationRate' })

  seedInput = () => this.numericInput({ min: 0, max: 400, step: 4, name: 'seedNumber' })

  convergedLimitInput = () => this.numericInput({ min: 0, max: 100, step: 1, name: 'convergedLimit' })

  goalInput = () => (
    <input
      disabled={this.state.generated}
      className="ph3 pv2"
      type="text"
      value={this.state.goal}
      onChange={this.setGoal}
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
