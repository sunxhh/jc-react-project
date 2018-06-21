import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from '../../global/urls'

import Dictionary from './dictionary/DictionaryList'

class BaseModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.BASE_MODULE} to={urls.BASE_MODULE_DICTIONARY} />
        <Route exact path={urls.BASE_MODULE_DICTIONARY} component={Dictionary} />
      </Switch>
    )
  }
}

export default BaseModule
