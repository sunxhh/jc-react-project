
import arthur from '@dx-groups/arthur'

import { createBrowserHistory } from 'history'
// user BrowserHistory
// import createHistory from 'history/createBrowserHistory';

import Router from './router'
// import commonModule from '../global/module'
import arthurModule from '../modules/Arthur/module'
import retailModule from '../modules/Retail/module'
import memberModule from '../modules/Member/module'
import libraryModule from '../modules/Library/module'
import PetModule from '../modules/Pet/module'
import extraReducers from '../global/reducer'
import { readMenuTreeList, setUserInfo } from '../global/action'
import storage from '../utils/storage'
import { initUserInfo } from '../utils/fetch'
import * as urls from 'Global/urls'
import './index.less'

let currentUserInfo = {}

// 1. Initialize
const app = arthur({
  history: createBrowserHistory(),
  extraReducers,
  onStateChange: (state) => {
    if (state.common.userInfo.ticket !== currentUserInfo.ticket) {
      currentUserInfo = state.common.userInfo
      initUserInfo(currentUserInfo.ticket)
    }
  },
})

app.init(() => dispatch => {
  const userInfo = storage.get('userInfo')
  if (userInfo) {
    dispatch(setUserInfo(userInfo))
    dispatch(readMenuTreeList())
  } else {
    if (location.pathname !== urls.LOGIN) {
      location.href = urls.LOGIN
    }
  }
})

// 2. Plugins
// app.use(createLoading());

// 3. Register global model
// app.module(commonModule)
// app.module(arthurModule)
// app.module(memberModule)
// app.module(libraryModule)
app.modules([
  arthurModule,
  memberModule,
  libraryModule,
  retailModule,
  PetModule
])

// 4. Router
app.router(Router)

// 5. Start
app.start('#root')

export default app._store;  // eslint-disable-line

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

/**
 * @param {String}  errorMessage   错误信息
 * @param {String}  scriptURI      出错的文件
 * @param {Long}    lineNumber     出错代码的行号
 * @param {Long}    columnNumber   出错代码的列号
 * @param {Object}  errorObj       错误的详细信息，Anything
 */
window.onerror = function(errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
  console.log()
}
