import React from 'react'
import { findFriends } from './lib'

export class LookAroundYou extends React.Component {
  state = { validAddresses: [] }

  componentDidMount() {
    findFriends(this.addAddress)
  }

  addAddress = address => this.setState({ validAddresses: [...this.state.validAddresses, address] })

  render() {
    const { validAddresses } = this.state
    const iframeStyle = {
      '-webkit-transform': 'scale(0.4)',
      '-moz-transform': 'scale(0.4)',
      position: 'absolute',
    }
    const baseHeight = window.innerHeight / 2
    const baseWidth = window.innerWidth / 2
    return (
      <div className="w-100 h-100 relative">
        {validAddresses.map((address, idx) => {
          const top = -window.innerHeight / 2 + (0.5 + Math.floor(idx / 2)) * baseHeight
          const left = -window.innerWidth / 2 + baseWidth / 2 + (idx % 2) * baseWidth
          const style = { ...iframeStyle, top, left }
          return (
            <iframe
              src={address}
              key={address}
              width={window.innerWidth}
              height={window.innerHeight}
              style={style}
              className="pointer"
            />
          )
        })}
      </div>
    )
  }
}
