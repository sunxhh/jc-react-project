import React from 'react'
import ReactDOM from 'react-dom'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import { LocaleProvider } from 'antd'
import { Provider } from 'react-redux'
import { createBrowserHistory } from 'history'
import { combineReducers } from 'redux'
// import { syncHistoryWithStore } from 'react-router-redux'
// import registerServiceWorker from './registerServiceWorker'
import configureStore from './configureStore'
import MainRouter from './router'
import storage from '../utils/storage'

import './index.less'

const browserHistory = createBrowserHistory()
const store = configureStore({}, browserHistory)

// const history = syncHistoryWithStore(browserHistory, store)
// history.listen(location => analytics.track(location.pathname))

// Rewrite console.log
;(function () {
  if (window.console && console.log) {
    const _log = console.log
    const showLog = storage.get('log')

    window.console.log = function () {
      // Array.prototype.unshift.call(arguments, 'Log start: ')
      showLog && _log.apply(this, arguments)
    }
  }
})()

ReactDOM.render(
  <LocaleProvider locale={zhCN}>
    <Provider store={store}>
      <MainRouter history={browserHistory} />
    </Provider>
  </LocaleProvider>,
  document.getElementById('root')
)
// registerServiceWorker()

// hot reload
if (module.hot) {
  module.hot.accept('../global/reducer', () => {
    const nextRootReducer = combineReducers(require('../global/reducer'))
    store.replaceReducer(nextRootReducer)
  })
}
