import React, { Component } from 'react'
import moment from 'moment'
import { Table, Button, Input, Form, Select, Checkbox, Row, Col } from 'antd'
import { connect } from 'react-redux'

import {
  getSyllabusList,
} from './reduck'
import {
  courseModalList,
  jobList,
  courseList,
  classRoomList,
  JOB_LIST
} from '../reduck'
import {
  queryOrg,
} from '../../../global/action'
import styles from './schedule.less'
import { isEmpty } from '../../../utils/lang'
import parmasUtil from '../../../utils/params'
import storage from '../../../utils/storage'
import { sportUrl } from '../../../config'
// import * as urls from '../../../global/urls'
import SelectForSearch from './SelectForSearch'
import { createAction } from 'redux-actions'

const FormItem = Form.Item
const Option = Select.Option
// const oneDayTime = 1000 * 60 * 60 * 24
const CheckboxGroup = Checkbox.Group
const weeksOptions = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']

const weeksKeyValue = [
  { value: '2', name: '周一' },
  { value: '3', name: '周二' },
  { value: '4', name: '周三' },
  { value: '5', name: '周四' },
  { value: '6', name: '周五' },
  { value: '7', name: '周六' },
  { value: '1', name: '周日' },
]
// const RangePicker = DatePicker.RangePicker

class ScheduleSyllabus extends Component {
  constructor(props) {
    super(props)
    this.yearArr = []
    const currentYear = moment(new Date()).year()
    for (let i = 0; i < 10; i++) {
      this.yearArr.push(currentYear + i)
    }
    this.state = {
      weeksCheckedList: weeksOptions,
      teacherCheckedList: [],
      weeksIndeterminate: false,
      teacherIndeterminate: false,
      weeksCheckAll: true,
      teacherCheckAll: true,
      yearValue: currentYear,
      weeksNum: moment(currentYear + '').weeksInYear(),
      weekValue: moment(new Date()).weeks()
    }
  }

  getTodayWeekInfo = () => {
    return {
      startDay: moment(new Date()).days(1).format('YYYY-MM-DD'),
      endDay: moment(new Date()).days(7).format('YYYY-MM-DD'),
      week: moment(new Date()).weeks()
    }
  }

  getDatesByWeeks = (year, week, weeks) => {
    if (weeks) {
      return weeks.map(item => {
        return moment(year + '').weeks(week).days(item).format('YYYY-MM-DD')
      })
    }
    return {
      startDay: moment(year + '').weeks(week).days(1).format('YYYY-MM-DD'),
      endDay: moment(year + '').weeks(week).days(7).format('YYYY-MM-DD'),
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(createAction(JOB_LIST)([]))
    dispatch(courseModalList({ type: 'courseMode' }))
    dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }})).then(res => {
      const dayInfo = this.getTodayWeekInfo()
      const subscribeListReqBody = {
        takeCourseBeginDate: dayInfo.startDay,
        takeCourseEndDate: dayInfo.endDay,
        week: {
          isAll: true,
          weekDays: []
        },
        teachers: {
          isAll: true,
          teacherNos: []
        }
      }
      if (res && res.myOrgLevel === '2') {
        subscribeListReqBody.organizationId = res.myOrgId
        dispatch(classRoomList({ organizationId: res.myOrgId }))
      } else if (res && res.myOrgList && !isEmpty(res.myOrgList)) {
        subscribeListReqBody.organizationId = res.myOrgList[0].id
        dispatch(classRoomList({ organizationId: res.myOrgList[0].id }))
      }
      dispatch(jobList({ organizationId: subscribeListReqBody.organizationId })).then(res => {
        if (res) {
          this.setState({
            teacherCheckedList: res.map(item => item.fullName)
          })
        }
      })
      dispatch(getSyllabusList(subscribeListReqBody))
    })
    dispatch(courseList({}))
  }

  _getSearchBean = () => {
    const { form, courseAllList, jobList } = this.props
    const values = form.getFieldsValue()
    const courses = courseAllList.filter(item => item.courseNo === values.courseName)
    const { yearValue, weekValue } = this.state
    const date = this.getDatesByWeeks(yearValue, weekValue)
    const searchBody = {
      organizationId: values.organizationId,
      courseMode: values.courseMode,
      courseName: courses.length > 0 ? courses[0].courseName : '',
      memberNo: values.memberName,
      roomNo: values.roomNo,
      takeCourseBeginDate: date.startDay,
      takeCourseEndDate: date.endDay,
      week: {
        isAll: this.state.weeksCheckedList.length === 7,
        weekDays: this.state.weeksCheckedList.filter(item => !!item).map(item => this.getWeekValueByName(item))
      },
      teachers: {
        isAll: this.state.teacherCheckedList.length === jobList.length,
        teacherNos: this.state.teacherCheckedList.map(item => {
          const teacher = jobList.filter(i => i.fullName === item)
          return !isEmpty(teacher) ? teacher[0].uuid : ''
        })
      }
    }
    return searchBody
  }

  _handleSearch = () => {
    const { dispatch } = this.props
    dispatch(getSyllabusList(this._getSearchBean()))
  }

  _handleExport = (e) => {
    e.preventDefault()
    const searchBody = this._getSearchBean()
    searchBody.weekDays = searchBody.week.weekDays
    searchBody.teacherNos = searchBody.teachers.teacherNos
    delete searchBody.week
    delete searchBody.teachers
    const params = parmasUtil.json2url(searchBody)
    const ticket = storage.get('userInfo').ticket
    const url = (sportUrl === '/') ? `http://${location.host}` : sportUrl
    let href = `${url}/api/schedule/course/v1/timetableList/export?${params}&ticket=${ticket}`
    location.href = href
  }

  _orgChange = value => {
    this.props.dispatch(classRoomList({ organizationId: value }))
    this.props.dispatch(jobList({ organizationId: value })).then(res => {
      res && this.setState({
        teacherCheckedList: res.map(item => item.fullName)
      })
    })
    this.props.form.setFieldsValue({ roomNo: '' })
  }

  _handleCourseModeChange = value => {
    this.props.dispatch(courseList({ courseMode: value }))
    this.props.form.setFieldsValue({ courseName: '' })
  }

  _weeksChange = (weeksCheckedList) => {
    if (weeksCheckedList.length > 0) {
      this.setState({
        weeksCheckedList,
        weeksIndeterminate: !!weeksCheckedList.length && (weeksCheckedList.length < weeksOptions.length),
        weeksCheckAll: weeksCheckedList.length === weeksOptions.length,
      })
    }
  }

  _teacherChange = (teacherCheckedList) => {
    if (teacherCheckedList.length > 0) {
      const { jobList } = this.props
      this.setState({
        teacherCheckedList,
        teacherIndeterminate: !!teacherCheckedList.length && (teacherCheckedList.length < jobList.length),
        teacherCheckAll: teacherCheckedList.length === jobList.length,
      })
    }
  }

  onCheckAllChange = (e) => {
    if (e.target.checked) {
      this.setState({
        weeksCheckedList: e.target.checked ? weeksOptions : [],
        weeksIndeterminate: false,
        weeksCheckAll: e.target.checked,
      })
    }
  }

  onTeacherCheckAllChange = (e) => {
    if (e.target.checked) {
      this.setState({
        teacherCheckedList: e.target.checked ? this.props.jobList.map(item => item.fullName) : [],
        teacherIndeterminate: false,
        teacherCheckAll: e.target.checked,
      })
    }
  }

  getTeacherNum = () => {
    const teachers = []
    this.props.syllabusList.forEach((item) => {
      // if (!columns.includes(item.weekDay)) {
      //   columns.push(item.weekDay)
      // }
      if (!teachers.includes(item.teacherName)) {
        teachers.push(item.teacherName)
      }
    })
    return teachers
  }

  getWeekValueByName = item => {
    const week = weeksKeyValue.filter(i => i.name === item)[0]
    return !isEmpty(week) ? week.value : ''
  }

  getTableColumns = () => {
    const { syllabusFilter, syllabusList } = this.props
    if (!syllabusList) {
      return []
    }
    const columns = !syllabusFilter.week || syllabusFilter.week.isAll ? weeksOptions : syllabusFilter.week.weekDays.map(item => weeksKeyValue.filter(i => i.value === item)[0].name)
    const teachers = this.getTeacherNum()
    const width = (90 / (columns.length + 1)) + '%'
    return [{
      key: 'teacher',
      title: '教练\\星期',
      dataIndex: 'teacher',
      width: '10%',
      render: (text, record, index) => (
        <span>{teachers[index]}</span>
      )
    }].concat(columns.map(item => {
      return {
        key: this.getWeekValueByName(item),
        title: item,
        dataIndex: this.getWeekValueByName(item),
        width: width,
        render: (text, record, renderIndex) => {
          const course = syllabusList.filter(item1 => item1.weekDay === this.getWeekValueByName(item) && item1.teacherName === teachers[renderIndex])
          return (
            <div>
              {course.map((item2, index2) => (
                <div
                  key={item2.takeCourseTime + index2}
                  style={{ padding: 5, marginBottom: 10, background: '#108ee9', color: '#FFFFFF', borderRadius: 4 }}
                >
                  {item2.takeCourseTime + '/' + item2.courseName + (item2.roomName ? ('/' + item2.roomName) : '')}
                </div>
              ))}
            </div>
          )
        }
      }
    }))
  }

  yearOnChange = (value) => {
    this.setState({
      weeksNum: moment(value + '').weeksInYear(),
      yearValue: value
    })
  }

  weekOnChange = value => {
    this.setState({
      weekValue: value
    })
  }

  renderWeekOption = () => {
    const weeksArr = []
    for (let i = 0; i < this.state.weeksNum; i++) {
      weeksArr.push(i + 1)
    }
    return weeksArr.map(item => (
      <Option key={item} value={item}>{item}</Option>
    ))
  }

  getDateSection = () => {
    const { yearValue, weekValue } = this.state
    if (!yearValue || !weekValue) {
      return ''
    }
    const date = this.getDatesByWeeks(yearValue, weekValue)
    return date.startDay + ' ~ ' + date.endDay
  }

  _handlePrint = () => {
    const headstr = `<html><head><style media=print>.PageNext{page-break-after:always;}</style></head><body>`
    const footstr = '</body>'
    const newstr = document.all.item(`printPage`).innerHTML
    const oldstr = document.body.innerHTML
    document.body.innerHTML = headstr + newstr + footstr
    window.print()
    document.body.innerHTML = oldstr
    window.location.reload()
  }

  render() {
    const { form, syllabusFilter, auths, match, courseModal, orgLevel, orgId, orgList, courseAllList, showListSpin, jobList, classRoomAllList } = this.props
    const path = match.path
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    return (
      <div>
        <div className={styles['search']}>
          <Form
            id='filter-form'
            style={{ position: 'relative' }}
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='所属机构'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('organizationId', {
                    initialValue: orgLevel === '2'
                      ? orgId
                      : (syllabusFilter.organizationId || (orgList && !isEmpty(orgList) ? orgList[0].id : '')),
                  })(
                    <SelectForSearch
                      placeholder='全部'
                      disabled = {orgLevel === '2'}
                      showSearch={true}
                      // allowClear={true}
                      getPopupContainer={() => document.getElementById('filter-form')}
                      onChange={(value) => this._orgChange(value)}
                      options={orgList}
                      optionsValueLabel={{ label: 'orgName', value: 'id' }}
                      showAllOption={false}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='课程模式'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('courseMode', {
                    initialValue: syllabusFilter.courseMode || ''
                  })(
                    <Select
                      placeholder='请选择课程模式'
                      getPopupContainer={() => document.getElementById('filter-form')}
                      onChange={(value) => this._handleCourseModeChange(value)}
                    >
                      <Option
                        key='-1'
                        value=''
                      >全部
                      </Option>
                      {courseModal.map(item => (
                        <Option
                          key={item.value}
                          value={item.value}
                        >{item.name}
                        </Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='课程名称'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('courseName', {
                    initialValue: syllabusFilter.courseName || ''
                  })(
                    <SelectForSearch
                      placeholder='全部'
                      showSearch={true}
                      allowClear={true}
                      getPopupContainer={() => document.getElementById('filter-form')}
                      options={courseAllList}
                      optionsValueLabel={{ label: 'courseName', value: 'courseNo' }}
                      showAllOption={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;会员'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('memberName', {
                    initialValue: syllabusFilter.memberName,
                  })(
                    <Input
                      placeholder='请输入会员'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;教室'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('roomNo', {
                    initialValue: syllabusFilter.roomNo || ''
                  })(
                    <SelectForSearch
                      placeholder='全部'
                      showSearch={true}
                      allowClear={true}
                      getPopupContainer={() => document.getElementById('filter-form')}
                      options={classRoomAllList}
                      optionsValueLabel={{ label: 'roomName', value: 'roomNo' }}
                      showAllOption={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className='operate-btn'>
          <Button
            type='primary'
            onClick={() => this._handleSearch()}
          >查询
          </Button>
          {authState.indexOf('print') !== -1 && (
            <Button
              type='primary'
              onClick={this._handlePrint}
            >
              打印
            </Button>
          )}
          {authState.indexOf('export') !== -1 && (
            <Button
              type='primary'
              onClick={(e) => this._handleExport(e)}
            >导出
            </Button>
          )}
        </div>
        <div className={styles['box-margin-bottom']}>
          <Select
            value={this.state.yearValue}
            onChange={this.yearOnChange}
          >
            {this.yearArr.map(item => (
              <Option key={item} value={item}>{item}</Option>
            ))}
          </Select>
          <span> 年&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span> 第 </span>
          <Select
            value={this.state.weekValue}
            onChange={this.weekOnChange}
            dropdownMatchSelectWidth={false}
          >
            {this.renderWeekOption()}
          </Select>
          <span> 周&nbsp;&nbsp;&nbsp;&nbsp;</span>
          <span>{this.getDateSection()}</span>
        </div>
        <div className={styles['box-margin-bottom']}>
          <Checkbox
            indeterminate={this.state.weeksIndeterminate}
            onChange={this.onCheckAllChange}
            checked={this.state.weeksCheckAll}
          >
            全部
          </Checkbox>
          <CheckboxGroup
            className={styles['checkbox-display']}
            options={weeksOptions}
            value={this.state.weeksCheckedList}
            onChange={this._weeksChange}
          />
        </div>
        {jobList && !isEmpty(jobList) && (
          <div className={styles['box-margin-bottom']}>
            <Checkbox
              indeterminate={this.state.teacherIndeterminate}
              onChange={this.onTeacherCheckAllChange}
              checked={this.state.teacherCheckAll}
            >
              全部
            </Checkbox>
            <CheckboxGroup
              className={styles['checkbox-display']}
              options={jobList.map(item => item.fullName)}
              value={this.state.teacherCheckedList}
              onChange={this._teacherChange}
            />
          </div>
        )}
        <div className='PageNext' id='printPage'>
          <Table
            className={styles['c-table-center']}
            columns={this.getTableColumns()}
            dataSource={this.getTeacherNum()}
            pagination={false}
            rowKey='reservationId'
            onChange={this._tableChange}
            loading={showListSpin}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    syllabusFilter: state.sportSchedule.syllabusFilter,
    syllabusList: state.sportSchedule.syllabusList,
    jobList: state.sportCommon.jobList,
    courseModal: state.sportCommon.courseModal,
    courseAllList: state.sportCommon.courseAllList,
    classRoomAllList: state.sportCommon.classRoomAllList,
    orgList: state.common.orgList,
    orgLevel: state.common.orgLevel,
    orgId: state.common.orgId,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ScheduleSyllabus))
