import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import Book from './bookManage'
import Classify from './classManage/classifyManage'
import Teacher from './teacherManage'
import TeacherAdd from './teacherManage/add'
import TeacherEdit from './teacherManage/edit'
import Class from './classManage/classDetail'
import Add from './classManage/classDetail/add'
import Edit from './classManage/classDetail/edit'

class TeenCenterModule extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Redirect exact from={urls.TEENCENTER} to={urls.BOOK_MANAGE} />
          <Route exact path={urls.BOOK_MANAGE} component={Book} />
          {/* class manage */}
          <Route exact path={urls.CLASSIFY_MANAGE} component={Classify} />
          <Route exact path={urls.CLASS_DETAIL} component={Class} />
          <Route exact path={urls.CLASS_DETAIL_ADD} component={Add} />
          <Route exact path={`${urls.CLASS_DETAIL_EDIT}/:id`} component={Edit} />
          <Route exact path={urls.TEACHER_MANAGE} component={Teacher} />
          <Route exact path={urls.TEACHER_MANAGE_ADD} component={TeacherAdd} />
          <Route exact path={`${urls.TEACHER_MANAGE_EDIT}/:id`} component={TeacherEdit} />
        </Switch>
      </div>
    )
  }
}

export default TeenCenterModule

