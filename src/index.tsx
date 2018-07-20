import {Provider} from 'mobx-react'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import codeBookStore from './stores/codebook'

import App from './App'

import 'normalize.css'
import './index.css'
import registerServiceWorker from './registerServiceWorker'

const store = {
  codeBookStore
}

const router = (
  <Provider {...store}>
    <App />
  </Provider>
)

ReactDOM.render(router, document.getElementById('root') as HTMLElement)

registerServiceWorker()
