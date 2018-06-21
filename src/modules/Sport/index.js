import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import Room from './room'
import Course from './course'
import CourseForm from './course/courseForm'
import ScheduleList from './schedule'
import ScheduleForm from './schedule/scheduleForm'
import HandSubscribe from './schedule/handSubscribe'
import Subscribe from './schedule/subscribe'
import ScheduleSyllabus from './schedule/scheduleSyllabus'

class EduModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.SPORT_MODULE} to={urls.SPORT_ROOM} />
        <Route exact path={urls.SPORT_ROOM} component={Room} />
        <Route exact path={urls.SPORT_COURSE} component={Course} />
        <Route exact path={urls.SPORT_COURSE_ADD} component={CourseForm} />
        <Route exact path={urls.SPORT_COURSE_EDIT + '/:courseNo'} component={CourseForm} />
        <Route exact path={urls.SPORT_SCHEDULE_LIST} component={ScheduleList} />
        <Route exact path={urls.SPORT_SCHEDULE_LIST_ADD} component={ScheduleForm} />
        <Route exact path={urls.SPORT_SCHEDULE_LIST_SUBSCRIBE} component={HandSubscribe} />
        <Route exact path={urls.SPORT_SCHEDULE_LIST_EDIT_REPEAT + '/:batchNo'} component={ScheduleForm} />
        <Route exact path={urls.SPORT_SCHEDULE_LIST_EDIT + '/:scheduleNo'} component={ScheduleForm} />
        <Route exact path={urls.SPORT_SCHEDULE_SYLLABUS} component={ScheduleSyllabus} />
        <Route exact path={urls.SPORT_SCHEDULE_SUBSCRIBE + '/:scheduleNo'} component={Subscribe} />
        <Route exact path={urls.SPORT_SCHEDULE_SUBSCRIBE} component={Subscribe} />
      </Switch>
    )
  }
}

export default EduModule
