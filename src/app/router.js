import React, { Component } from 'react'
import { connect } from 'react-redux'
import {
  Route,
  Switch,
  Redirect
} from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import { LocaleProvider } from 'antd'
import { hot } from 'react-hot-loader'

import * as urls from 'Global/urls'
import storage from 'Utils/storage'
import routes from '../routes'
import Layout from './pages/layout'
import Login from './pages/login'
import { isEmpty } from 'Utils/lang'
import NotFoundPage from './pages/notFoundPage'
import { bundle } from './bundle'
import zhCN from 'antd/lib/locale-provider/zh_CN'
import 'moment/locale/zh-cn'

class RouteConfig extends Component {
  constructor(props) {
    super(props)
    this.state = {
      acceptRoutes: []
    }
  }

  verifyUser = (match, route, finalRoutes) => {
    let userInfo = storage.get('userInfo')
    if (userInfo) {
      return (
        <Layout
          routes={finalRoutes}
          match={match}
          content={route.baseComponent ? bundle(route.baseComponent) : route.component}
          path={route.path}
        />
      )
    } else {
      return <Redirect to={urls.LOGIN} />
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldAuths = this.props.auths
    const { auths } = nextProps
    if (isEmpty(oldAuths) && !isEmpty(auths)) {
      this.setState({
        acceptRoutes: Object.keys(auths)
      })
    }
  }

  render() {
    const { acceptRoutes } = this.state
    const finalRoutes = routes.filter(
      item =>
        acceptRoutes.indexOf(item.path) !== -1 || item.path === '/' || acceptRoutes.indexOf(item.parentPath) !== -1
    )
    return (
      <LocaleProvider locale={zhCN}>
        <ConnectedRouter history={this.props.history}>
          <Switch>
            <Route key='login' path={urls.LOGIN} component={Login} />
            {
              finalRoutes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  exact={route.exact}
                  render={match => this.verifyUser(match, route, finalRoutes)}
                />
              ))
            }
            <Route key='404' path='/404' component={NotFoundPage} />
            {!isEmpty(acceptRoutes) && <Redirect from='*' to='/404' />}
          </Switch>
        </ConnectedRouter>
      </LocaleProvider>
    )
  }
}

const mapStateToProps = state => {
  return {
    auths: state.common.auths
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})

export default hot(module)(connect(mapStateToProps, mapDispatchToProps)(RouteConfig))
