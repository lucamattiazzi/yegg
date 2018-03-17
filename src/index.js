import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import App from 'components/App'
import { routes } from 'routes'
import 'tachyons'
import 'styles.css'
import 'fade.css'

const RoutedApp = () => {
  return (
    <Router>
      <div className="w-100 h-100 min-h-100 bg-light-gray">
        <Route exact path="/" component={App} />
        {
          routes.map(({ path, component }, idx) => (
            <Route exact key={idx} path={path} component={component} />
          ))
        }
      </div>
    </Router>
  )
}

ReactDOM.render(<RoutedApp />, document.getElementById('root'))
