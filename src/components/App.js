import React from 'react'
import { Link } from 'react-router-dom'
import { routes } from 'routes'

export default class App extends React.Component {
  render() {
    return (
      <div className="w-100 h-100 min-h-100 flex flex-column items-center relative">
        <div className="w-80 flex flex-column items-center justify-center pv5">
          <div className="pa3 f1">
            Stuff
          </div>
          <div className="pa3 f4">
            Currenlty interested in n-dimensional stuff.
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
        <div className="absolute right-2 bottom-2 flex flex-column tc items-center">
          <div className="flex justify-around w-100">
            <a href="https://github.com/yeasteregg" target="_blank" rel="noopener noreferrer">
              <img src="/github.png" width="16" height="16" />
            </a>
            {/* <a href="https://www.linkedin.com/in/mattiazziluca/" target="_blank" rel="noopener noreferrer">
              <img src="/linkedin.png" width="16" height="16" />
            </a> */}
          </div>
          Luca Mattiazzi
        </div>
      </div>
    )
  }
}
