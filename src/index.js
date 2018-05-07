import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from 'react-router-dom'
import App from 'components/App'
import { routes } from 'routes'
import 'tachyons'
import 'styles.css'
import 'fade.css'

const routeDecorator = ({ route, openInfo }) => {
  const { component: Component, routeInfo } = route
  const DecoratedRoute = props => {
    return (
      <div className="w-100 h-100 min-h-100 relative flex flex-column">
        <div className="w-100 flex justify-between items-center bb pv2">
          <Link className="f3 no-underline" to="/">Home</Link>
          <div className="tc f3 underline">{route.route}</div>
          <div className="f3 pointer" onClick={openInfo(routeInfo)}>Info</div>
        </div>
        <div className="w-100 flex-auto h-100">
          <Component {...props} />
        </div>
      </div>
    )
  }
  return DecoratedRoute
}

class RoutedApp extends React.Component {
  state = { info: undefined }

  openInfo = routeInfo => () => this.setState({ info: routeInfo })

  closeInfo = () => this.setState({ info: undefined })

  render() {
    const { openInfo, state: { info } } = this
    return (
      <Router>
        <div className="w-100 h-100 min-h-100 bg-light-gray relative">
          <Route exact path="/" component={App} />
          {
            info &&
            <div className="z-999 absolute w-100 h-100 bg-white-90 flex flex-column items-center pa5 f4 tl">
              <div onClick={this.closeInfo} className="absolute top-1 right-1">X</div>
              { info.map((row, idx) => <div key={idx} className="pb2 w-100">{row}</div>) }
            </div>
          }
          {
            routes.map(({ path, ...route }, idx) => (
              <Route
                exact path={path}
                component={routeDecorator({ route, openInfo })}
                key={idx}
                openInfo={this.openInfo}
              />
            ))
          }
        </div>
      </Router>
    )
  }
}

ReactDOM.render(<RoutedApp />, document.getElementById('root'))
