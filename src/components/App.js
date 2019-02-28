import React from 'react'
import { Link } from 'react-router-dom'
import { routes } from 'routes'

export default class App extends React.Component {
  renderRoute = ({ route, path, description, external }, idx) => {
    const link = external ? (
      <a href={path} target="_blank" rel="noopener noreferrer">
        {route}
      </a>
    ) : (
      <Link to={path}>{route}</Link>
    )
    return (
      <div key={idx} className="f3 pv2">
        {link}
        <div className="f5 gray">{description}</div>
      </div>
    )
  }

  render() {
    return (
      <div className="w-100 h-100 min-h-100 flex flex-column items-center relative">
        <div className="w-80 flex flex-column items-center justify-center pt4">
          <div className="pa3 f1">Grokked it!</div>
          <div className="pa3 f4">{"Stuff i'm learning"}</div>
        </div>
        <div className="w-80 flex flex-column pt4 h-80 overflow-y-scroll">
          {routes.map(this.renderRoute)}
        </div>
        <div className="absolute right-2 bottom-2 flex flex-column tc items-center">
          <div className="flex justify-around w-100">
            <a href="https://github.com/yeasteregg" target="_blank" rel="noopener noreferrer">
              <img src="/github.png" width="16" height="16" />
            </a>
          </div>
          Luca Mattiazzi
        </div>
      </div>
    )
  }
}
