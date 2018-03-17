import React from 'react'
import { Link } from 'react-router-dom'
import { routes } from 'routes'

export default class App extends React.Component {
  render() {
    return (
      <div className="w-100 h-100 min-h-100 flex flex-column items-center">
        <div className="w-80 flex flex-column items-center justify-center pv5">
          <div className="pa3 f1">
            Stuff
          </div>
          <div className="pa3 f4">
            Some stuff. Not much style, not much stability, mostly out of curiosity.
          </div>
        </div>
        <div className="w-80 flex flex-column pv3">
          {
            routes.map(({ route, path, description }, idx) => (
              <div key={idx} className="f3 pv2">
                <Link to={path}>{route}</Link>
                <div className="f5 gray">{description}</div>
              </div>
            ))
          }
        </div>
      </div>
    )
  }
}
