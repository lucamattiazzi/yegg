import React from 'react'
import { randomCalculation } from 'lib/utils'

const MARGIN = 0.1
const OPERATIONS = 20
const FADERS = 10

export class Loader extends React.Component {
  state = { numbers: Array.from({ length: OPERATIONS }, randomCalculation) }

  refContainer = container => { this.container = container }

  render() {
    const { numbers } = this.state
    const width = window.innerWidth
    const height = window.innerHeight
    return (
      <div className="absolute w-100 h-100 bg-black-80">
        {
          numbers.map((operation, idx) => {
            const style = {
              left: width * MARGIN + Math.random() * (width - 2 * MARGIN * width),
              top: height * MARGIN + Math.random() * (height - 2 * MARGIN * height),
            }
            const fadeClass = `fadein${Math.ceil(Math.random() * FADERS)}`
            return (
              <div className={`absolute white f3 fw8 ${fadeClass}`} key={idx} style={style}>
                {operation}
              </div>
            )
          })
        }
      </div>
    )
  }
}
