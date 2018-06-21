import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import Recommend from './recommend'

class BaseModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.LIBRARY} to={urls.LIBRARY_RECOMMEND} />
        <Route exact path={urls.LIBRARY_RECOMMEND} component={Recommend} />
      </Switch>
    )
  }
}
export default BaseModule
