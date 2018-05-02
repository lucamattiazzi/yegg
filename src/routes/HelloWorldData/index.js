import React from 'react'

const { fetch } = window

export class HelloWorldData extends React.Component {
  state = {
    data: undefined,
  }

  async componentWillMount() {
    const response = await fetch('/genetic-hello-world-results.json')
    const data = await response.json()
    this.setState({ data })
  }

  render() {
    console.log(this.state.data)
    return (
      <div className="w-100 h-100 flex flex-column items-center justify-center overflow-scroll relative" >
        ciao
      </div>
    )
  }
}
