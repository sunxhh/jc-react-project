import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import * as urls from 'Global/urls'

import CourseManage from './courseManage' // 课程设置
import TextbookManage from './textbookManage' // 教材设置
import ClassRoomManage from './classRoomManage' // 教室设置
import ClassManage from './classManage' // 班级管理
import AddClassManage from './classManage/AddClassManage' // 用户管理 / 新增
import EditClassManage from './classManage/EditClassManage'
import ClassDetail from './classManage/classDetail'
// import AttendClassRecordForm from './classManage/classDetail/attendClassRecordForm'
import CourseAdd from './courseManage/add' // 新增课程
import CourseEdit from './courseManage/edit' // 修改课程
import CourseArray from './courseArray'
import ClassSchedule from './courseArray/classSchedule'
import CourseArrayForm from './courseArray/courseArrayForm'

import HandleCenter from './handleCenter' // 办理中心
import AddClassroom from './handleCenter/addClassroom' // 报班
import BackOutClassroom from './handleCenter/backOutClassroom' // 退班
import ChangeClassroom from './handleCenter/changeClassroom' // 转班
import BuyTextBook from './handleCenter/buyTextBook' // 购教材
import BackTextBook from './handleCenter/backTextBook' // 退教材

import StudentManage from './studentManage' // 学员管理
import StudentDetail from './studentManage/studentDetail' // 学员明细
import StudentAdd from './studentManage/add' // 学员管理 / 新增
import StudentEdit from './studentManage/editStudent' // 学员管理 / 编辑
import AddTouch from './studentManage/addTouch' // 学员管理 / 添加沟通
import EditTouch from './studentManage/editTouch' // 学员管理 / 添加沟通
import ChannelSet from './studentManage/channelSet' // 渠道设置

class EduModule extends Component {
  render() {
    return (
      <Switch>
        <Redirect exact from={urls.EDU_MODULE} to={urls.EDU_COURSE_MANAGE} />
        <Route exact path={urls.EDU_COURSE_MANAGE} component={CourseManage} />
        <Route exact path={urls.EDU_TEXTBOOK_MANAGE} component={TextbookManage} />
        <Route exact path={urls.CLASS_ROOM_MANAGE} component={ClassRoomManage} />
        <Route exact path={urls.EDU_CLASS_MANAGE} component={ClassManage} />
        <Route exact path={urls.EDU_CLASS_MANAGE_ADD} component={AddClassManage} />
        <Route exact path={urls.EDU_CLASS_MANAGE_EDIT} component={EditClassManage} />
        <Route exact={false} path={urls.EDU_CLASS_MANAGE_DETAIL} component={ClassDetail} />
        <Route exact path={urls.EDU_COURSE_MANAGE_ADD} component={CourseAdd} />
        <Route exact path={`${urls.EDU_COURSE_MANAGE_EDIT}/:courseId`} component={CourseEdit} />
        <Route exact path={urls.HANDLE_CENTER} component={HandleCenter} />
        <Route exact path={urls.HANDLE_CENTER_ADD_CLASSROOM} component={AddClassroom} />
        <Route exact path={`${urls.HANDLE_CENTER_BACKOUT_CLASSROOM}/:orderId`} component={BackOutClassroom} />
        <Route exact path={`${urls.HANDLE_CENTER_CHANGE_CLASSROOM}/:orderId`} component={ChangeClassroom} />
        <Route exact path={urls.HANDLE_CENTER_BUY_TEXTBOOK} component={BuyTextBook} />
        <Route exact path={`${urls.HANDLE_CENTER_BACK_TEXTBOOK}/:orderId`} component={BackTextBook} />
        <Route exact path={`${urls.EDU_COURSE_LIST}`} component={CourseArray} />
        <Route exact path={`${urls.EDU_COURSE_ARRAY_ADD}`} component={CourseArrayForm} />
        <Route exact path={`${urls.EDU_COURSE_ARRAY_EDIT}/:scheduleNo`} component={CourseArrayForm} />
        <Route exact path={`${urls.EDU_COURSE_ARRAY_EDIT}/:scheduleNo/:scheduleId`} component={CourseArrayForm} />
        <Route exact path={`${urls.EDU_COURSE_SYLLABUS}`} component={ClassSchedule} />
        <Route exact path={urls.EDU_STUDENT_MANAGE} component={StudentManage} />
        <Route exact path={`${urls.EDU_STUDENT_DETAIL}/:id`} component={StudentDetail} />
        <Route exact path={urls.EDU_STUDENT_ADD} component={StudentAdd} />
        <Route exact path={`${urls.EDU_STUDENT_EDIT}/:studentId`} component={StudentEdit} />
        <Route exact path={`${urls.EDU_ADD_TOUCH}/:id`} component={AddTouch} />
        <Route exact path={`${urls.EDU_EDIT_TOUCH}/:id`}component={EditTouch} />
        <Route exact path={urls.EDU_CHANNEL_SET} component={ChannelSet} />
      </Switch>
    )
  }
}

export default EduModule
