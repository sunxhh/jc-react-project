import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Tabs, Row, Col, Button } from 'antd'
import { Route, Switch, Link, Redirect } from 'react-router-dom'
import { createAction } from 'redux-actions'

import {
  EDU_CLASS_MANAGE,
  EDU_CLASS_MANAGE_DETAIL,
  EDU_CLASS_MANAGE_DETAIL_STUDENT,
  EDU_CLASS_MANAGE_DETAIL_RECORD,
  EDU_CLASS_MANAGE_DETAIL_SCORE,
  EDU_CLASS_MANAGE_DETAIL_RECORD_ADD,
  EDU_CLASS_MANAGE_DETAIL_RECORD_EDIT,
  EDU_CLASS_MANAGE_DETAIL_RECORD_DETAIL,
} from 'Global/urls'
import paramsUtil from '../../../../utils/params'
import { isEmpty } from '../../../../utils/lang'
import {
  detail,
  getStudentInfoList,
  CLASS_DETAIL
} from '../reduck'
import AttendClassRecord from './attendClassRecord'
import StudentInfo from './studentInfo'
import StudentScore from './studentScore'
import AttendClassRecordForm from './attendClassRecordForm'

const TabPane = Tabs.TabPane

class ClassDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classId: paramsUtil.url2json(location).classId || this.props.match.params.classId
    }
  }

  componentDidMount() {
    const { classDetail, dispatch } = this.props
    const { classId } = this.state
    if (classId && (isEmpty(classDetail) || classDetail.id !== classId)) {
      dispatch(detail({ id: classId }))
      dispatch(getStudentInfoList({ classId, currentPage: 1 }))
    }
  }

  componentWillUnmount() {
    this.props.dispatch(createAction(CLASS_DETAIL)({}))
  }

  render() {
    const { classId } = this.state
    const { classDetail } = this.props
    const locationSearch = '?classId=' + classId

    let activeKey = 'student'
    if (location.pathname.startsWith(EDU_CLASS_MANAGE_DETAIL_RECORD)) {
      activeKey = 'record'
    } else if (location.pathname.startsWith(EDU_CLASS_MANAGE_DETAIL_SCORE)) {
      activeKey = 'score'
    }

    return (
      <div>
        <Row>
          <Col span={5}>
            <span>班级名称：{classDetail.name}</span>
          </Col>
          <Col span={5}>
            <span>课程：{classDetail.courseName}</span>
          </Col>
          <Col span={5}>
            <span>教师：{classDetail.teacherName}</span>
          </Col>
          <Col span={5}>
            <span>招生状态：{classDetail.classStatus + '' === '1' ? '开启' : '关闭'}</span>
          </Col>
          <Col span={4}>
            <Link to={EDU_CLASS_MANAGE}><Button type='primary'>返回</Button></Link>
          </Col>
        </Row>
        <Tabs
          style={{ overflow: 'visible' }}
          activeKey={activeKey}
        >

          <TabPane
            tab={<Link to={EDU_CLASS_MANAGE_DETAIL_STUDENT + locationSearch}>学员信息</Link>}
            key='student'
          >
            <Switch>
              <Redirect
                exact
                from={`${EDU_CLASS_MANAGE_DETAIL}`}
                to={EDU_CLASS_MANAGE_DETAIL_STUDENT + locationSearch}
              />
              <Route
                exact
                path={`${EDU_CLASS_MANAGE_DETAIL_STUDENT}`}
                component={StudentInfo}
              />
            </Switch>
          </TabPane>

          <TabPane
            tab={<Link to={EDU_CLASS_MANAGE_DETAIL_RECORD + locationSearch}>上课记录</Link>}
            key='record'
          >
            <Switch>
              <Route
                exact
                path={`${EDU_CLASS_MANAGE_DETAIL_RECORD}`}
                component={AttendClassRecord}
              />
              <Route exact path={`${EDU_CLASS_MANAGE_DETAIL_RECORD_ADD}`} component={AttendClassRecordForm} />
              <Route exact path={`${EDU_CLASS_MANAGE_DETAIL_RECORD_EDIT}`} component={AttendClassRecordForm} />
              <Route exact path={`${EDU_CLASS_MANAGE_DETAIL_RECORD_DETAIL}/:recordId/:classId/:status`} component={AttendClassRecordForm} />
            </Switch>
          </TabPane>

          <TabPane
            tab={<Link to={EDU_CLASS_MANAGE_DETAIL_SCORE + locationSearch}>成绩</Link>}
            key='score'
          >
            <Switch>
              <Route
                exact
                path={`${EDU_CLASS_MANAGE_DETAIL_SCORE}`}
                component={StudentScore}
              />
            </Switch>
          </TabPane>
        </Tabs>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    classDetail: state.classManage.detail
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(ClassDetail)
