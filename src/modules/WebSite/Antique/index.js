import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import Book from './book'
import Famous from './famous'
import Edit from './famous/edit'

class TeenCenterModule extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Redirect exact from={urls.ANTIQUE} to={urls.ANTIQUE_BOOK} />
          <Route exact path={urls.ANTIQUE_BOOK} component={Book} />
          <Route exact path={urls.ANTIQUE_FAMOUS} component={Famous} />
          <Route exact path={urls.ANTIQUE_FAMOUS_ADD} component={Edit} />
          <Route exact path={`${urls.ANTIQUE_FAMOUS_ADD}/:id`} component={Edit} />
        </Switch>
      </div>
    )
  }
}

export default TeenCenterModule

