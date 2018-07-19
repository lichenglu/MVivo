import {Provider} from 'mobx-react'
import DevTools from 'mobx-react-devtools'
import * as React from 'react'
import * as ReactDOM from 'react-dom'
import {BrowserRouter as Router, Route} from 'react-router-dom'

import codeBookStore from './stores/codebook'

import App from './App'

import './index.css'
import registerServiceWorker from './registerServiceWorker'

const store = {
  codeBookStore
}

const router = (
  <Provider {...store}>
    <Router>
      <Route path="/" component={App} exact={true} />
    </Router>
    <DevTools />
  </Provider>
)

ReactDOM.render(router, document.getElementById('root') as HTMLElement)

registerServiceWorker()
