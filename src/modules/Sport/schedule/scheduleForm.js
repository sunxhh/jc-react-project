import React from 'react'
import moment from 'moment'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Card, Form, Input, Row, Col, Select, Button, DatePicker, TimePicker, Checkbox, InputNumber } from 'antd'
import { fetchSport as fetchData } from 'Utils/fetch'
import ModalSelectInput from 'Components/modal/ModalSelectInput'
import apis from '../apis'

import {
  getScheduleDetail,
  addSchedule,
  modifySchedule,
  modifyRepeatSchedule,
  getScheduleRepeatDetail,
  SCHEDULE_DETAIL
} from './reduck'
import {
  classRoomList,
  courseList,
  courseModalList,
  jobList
} from '../reduck'
import {
  getCourseDetail
} from '../course/reduck'
import {
  queryOrg,
} from '../../../global/action'
import styles from './schedule.less'
import { isEmpty } from '../../../utils/lang'
import * as urls from 'Global/urls'
import SelectForSearch from './SelectForSearch'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea
const RangePicker = DatePicker.RangePicker
const Group = Checkbox.Group

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}
const weeks = [
  '周日',
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
]
const format = 'HH:mm'
const courseMode = {
  'T': '小团课',
  'S': '私教课',
  'P': '公开课',
}

class ScheduleForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduleNo: this.props.match.params.scheduleNo,
      batchNo: this.props.match.params.batchNo,
      detailType: [1, 2, 3, 4, 5, 6, 7],
      courseModeIsS: false,
      courseTime: 0
    }
  }
  _range = (start, end) => {
    const result = []
    for (let i = start; i < end; i++) {
      result.push(i)
    }
    return result
  }

  _disabledRangeTime = () => {
    const { form } = this.props
    const courseMode = form.getFieldValue('courseMode')
    if (courseMode === 'S') {
      const beginTimeSecond = form.getFieldValue('beginTime') && form.getFieldValue('beginTime').format('mm')
      const seconds = this._range(0, 60)
      const endTimeSecond = seconds.filter(i => {
        return i !== (beginTimeSecond - 0)
      })
      return endTimeSecond
    }
  }

  _disabledHours = () => {
    const { form } = this.props
    const courseMode = form.getFieldValue('courseMode')
    if (courseMode === 'S') {
      const beginTimeHours = form.getFieldValue('beginTime') && form.getFieldValue('beginTime').format('HH') - 0
      const hours = this._range(0, 24)
      const endTimeHours = hours.filter(i => {
        return i <= beginTimeHours
      })
      return endTimeHours
    }
  }

  _handleDateChange = (dates, isChange) => {
    const dateSpan = Math.abs(dates[1].valueOf() - dates[0].valueOf())
    const iDays = Math.floor(dateSpan / (24 * 3600 * 1000)) + 1
    let res = []
    if (iDays < 7) {
      const firstDay = dates[0].days()
      for (let i = 0; i < iDays; i++) {
        res.push(firstDay + i + 1)
      }
      res = res.map(item => {
        if (item > 7) {
          return item % 7
        }
        return item
      })
    } else {
      res = [1, 2, 3, 4, 5, 6, 7]
    }
    if (isChange) {
      if (res.length < 8) {
        this.props.form.setFieldsValue({
          validWeekDays: res,
        })
      } else {
        this.props.form.setFieldsValue({
          validWeekDays: [],
        })
      }
    }
    this.setState({ detailType: res })
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { scheduleNo, batchNo } = this.state
    if (scheduleNo) {
      dispatch(getScheduleDetail({ scheduleNo })).then(res => {
        if (res) {
          dispatch(jobList({ organizationId: res.organizationId }))
          dispatch(classRoomList({ organizationId: res.organizationId }))
          res.courseMode === 'S' && this.setState({ courseModeIsS: true })
          dispatch(getCourseDetail({ courseNo: res.courseNo })).then(e => {
            if (e) {
              this.setState({
                courseTime: e.singleTime
              })
            }
          })
        }
      })
      dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
    } else if (batchNo) {
      dispatch(getScheduleRepeatDetail({ batchNo })).then(res => {
        if (res) {
          const dates = res.beginDate && res.endDate
            ? [moment(new Date(res.beginDate)), moment(new Date(res.endDate))] : null
          dates && this._handleDateChange(dates, false)
          dispatch(jobList({ organizationId: res.organizationId }))
          dispatch(classRoomList({ organizationId: res.organizationId }))
          res.courseMode === 'S' && this.setState({ courseModeIsS: true })
          dispatch(getCourseDetail({ courseNo: res.courseNo })).then(e => {
            if (e) {
              this.setState({
                courseTime: e.singleTime
              })
            }
          })
        }
      })
      dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
    } else {
      dispatch(createAction(SCHEDULE_DETAIL)({}))
      dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }})).then(res => {
        if (res && res.myOrgLevel === '2') {
          dispatch(jobList({ organizationId: res.myOrgId }))
          dispatch(classRoomList({ organizationId: res.myOrgId }))
        } else {
          dispatch(jobList({}))
          dispatch(classRoomList({}))
        }
      })
    }
    dispatch(courseModalList({ type: 'courseMode' }))
    dispatch(courseList({}))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form, orgList, jobList, classRoomAllList } = this.props
    const { scheduleNo, batchNo } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        const orgs = orgList.filter(item => {
          return item.id === values.organizationId
        })
        const teachers = jobList.filter(item => {
          return item.uuid === values.teacherNo
        })
        const rooms = classRoomAllList.filter(item => {
          return item.roomNo === values.roomNo
        })
        let beginDate = null
        let endDate = null
        if (scheduleNo) {
          beginDate = values.date ? values.date.format('YYYY-MM-DD') : ''
          endDate = values.date ? values.date.format('YYYY-MM-DD') : ''
        } else {
          beginDate = values.date && !isEmpty(values.date) ? values.date[0].format('YYYY-MM-DD') : ''
          endDate = values.date && !isEmpty(values.date) ? values.date[1].format('YYYY-MM-DD') : ''
        }
        const reqBody = {
          // organizationId: values.organizationId,
          // courseMode: values.courseMode,
          // courseNo: values.courseNo,
          // signupNumber: values.signupNumber,
          // perCourseTime: values.perCourseTime,
          // status: values.status,
          // validWeekDays: values.validWeekDays,
          // teacherNo: values.teacherNo,
          // roomNo: values.roomNo,
          ...values,
          beginDate,
          endDate,
          beginTime: values.beginTime.format('HH:mm'),
          endTime: values.endTime.format('HH:mm'),
          courseNo: values.courseName[0].courseNo,
          courseName: values.courseName[0].courseName,
          validWeekDays: values.validWeekDays.join(','),
          perCourseTime: parseInt(values.perCourseTime),
          organizationName: orgs.length > 0 ? orgs[0].orgName : '',
          teacherName: teachers.length > 0 ? teachers[0].fullName : '',
          roomName: rooms.length > 0 ? rooms[0].roomName : '',
        }
        delete reqBody.date
        if (scheduleNo) {
          dispatch(modifySchedule({ ...reqBody, scheduleNo, validWeekDays: '1,2,3,4,5,6,7' })).then(res => {
            res && (location.href = urls.SPORT_SCHEDULE_LIST)
          })
        } else if (batchNo) {
          dispatch(modifyRepeatSchedule({ ...reqBody, batchNo })).then(res => {
            res && (location.href = urls.SPORT_SCHEDULE_LIST)
          })
        } else {
          dispatch(addSchedule(reqBody)).then(res => {
            res && (location.href = urls.SPORT_SCHEDULE_LIST)
          })
        }
      }
    })
  }

  _disabledDate = (current) => {
    return current && current.valueOf() < moment(moment(Date.now()).format('YYYY-MM-DD')).valueOf()
  }

  _startTimeValidator = (rule, value, callback) => {
    const endTime = this.props.form.getFieldsValue(['endTime'])
    if (isEmpty(value) || !endTime['endTime']) {
      callback()
      return
    }
    if (endTime['endTime'].valueOf() <= value.valueOf()) {
      callback('开始时间时间应该早于结束时间!')
      return
    }
    callback()
  }

  _endTimeValidator = (rule, value, callback) => {
    const { courseModeIsS } = this.state
    const beginTime = this.props.form.getFieldsValue(['beginTime'])

    if (isEmpty(value) || !beginTime['beginTime']) {
      callback()
      return
    }
    if (beginTime['beginTime'].valueOf() >= value.valueOf()) {
      callback('结束时间应该晚于开始时间!')
      return
    } else if (courseModeIsS && (value.valueOf() - beginTime['beginTime'].valueOf()) / 1000 % 3600 !== 0) {
      callback('私教课上课时段必须是一小时的整数倍!')
      return
    }
    callback()
  }

  _orgChange = value => {
    const { dispatch, form } = this.props
    if (value) {
      dispatch(classRoomList({ organizationId: value }))
      dispatch(jobList({ organizationId: value }))
    }
    form.setFieldsValue({
      teacherNo: '',
      roomNo: ''
    })
  }

  _serviceColumns = [
    {
      key: 'courseName',
      title: '课程名称',
      dataIndex: 'courseName',
    },
    {
      key: 'courseMode',
      title: '课程类别',
      dataIndex: 'courseMode',
      render: text => (
        <span>{courseMode[text]}</span>
      )
    }
  ]

  _getCourseParams = () => {
    const { form } = this.props
    return {
      modalParam: {
        title: '选择课程'
      },
      rowKey: 'courseNo',
      selectType: 'radio',
      fetch: fetchData,
      url: apis.course.courseList,
      extraParams: { courseMode: form.getFieldValue('courseMode') },
      columns: this._serviceColumns,
      filter: [{
        id: 'courseName',
        props: {
          label: '课程名称'
        },
        element: (
          <Input
            placeholder='请输入课程名称'
          />
        )
      }]
    }
  }

  _handleCourseModeChange = value => {
    if (value === 'S') {
      this.setState({
        courseModeIsS: true
      })
      this.props.form.setFieldsValue({ perCourseTime: 1, signupNumber: 1 })
    } else {
      this.setState({
        courseModeIsS: false
      })
    }
    this.props.form.setFieldsValue({ courseName: [], beginTime: null, endTime: null })
  }

  _handleCourseSelect = (selectedRows) => {
    if (selectedRows[0].courseMode !== 'S') {
      this.setState({
        courseTime: selectedRows[0].singleTime
      })
    }
  }

  beginTimeChange = (time, timeString) => {
    const { getFieldValue, setFieldsValue } = this.props.form
    if (!this.state.courseModeIsS) {
      if (!getFieldValue('courseName')) {
        setFieldsValue({ 'beginTime': undefined })
      } else {
        setFieldsValue({ 'endTime': moment(time.valueOf() + (this.state.courseTime * 60 * 1000)) })
      }
    }
  }
  _endTimeChange = () => {
    const { form } = this.props
    if (this.state.courseModeIsS) {
      form.validateFields(['beginTime'], (_, values) => {
        form.setFields({
          beginTime: {
            value: values.beginTime,
            errors: null,
          },
        })
      })
    }
  }

  render() {
    let { location, scheduleDetail, scheduleRepeatDetail, form, switchButtonLoading, courseModal, orgLevel, orgId, orgList, classRoomAllList, jobList } = this.props
    const { scheduleNo, detailType, batchNo, courseModeIsS } = this.state
    const { getFieldDecorator } = form
    if (batchNo && !scheduleNo) {
      scheduleDetail = scheduleRepeatDetail
    }
    const isOrder = location.state && location.state.isOrder
    return (
      <div>
        <Form
          onSubmit={this.handleSubmit}
          style={{ marginTop: 8, position: 'relative' }}
          id='filter-form'
        >
          <Card title='基础信息' style={{ marginBottom: 20 }}>
            <Row
              justify='start'
              type='flex'
            >
              <Col span={(scheduleNo || batchNo) ? 8 : 0}>
                <FormItem
                  {...formItemLayout}
                  label='批次号'
                >
                  {getFieldDecorator('batchNo', {
                    initialValue: scheduleDetail.batchNo
                  })(
                    <Input disabled />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='所属机构'
                >
                  {getFieldDecorator('organizationId', {
                    rules: [{
                      required: true, message: '请选择所属机构',
                    }],
                    ...((scheduleNo || batchNo || orgLevel === '2') ? { initialValue: orgLevel === '2'
                      ? orgId
                      : (scheduleDetail.organizationId || '') } : {})
                  })(
                    <SelectForSearch
                      placeholder='请选择所属机构'
                      disabled = {!!(orgLevel === '2' || scheduleNo || batchNo)}
                      style={{ width: '200px' }}
                      showSearch={true}
                      getPopupContainer={() => document.getElementById('filter-form')}
                      onChange={(value) => this._orgChange(value)}
                      options={orgList}
                      optionsValueLabel={{ label: 'orgName', value: 'id' }}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='课程模式'
                >
                  {getFieldDecorator('courseMode', {
                    rules: [{
                      required: true, message: '请输入课程模式',
                    }],
                    initialValue: scheduleDetail.courseMode
                  })(
                    <Select
                      disabled={!!(scheduleNo || batchNo)}
                      placeholder='请选择课程模式'
                      getPopupContainer={() => document.getElementById('filter-form')}
                      onChange={(value) => this._handleCourseModeChange(value)}
                    >
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
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='课程名称'
                >
                  {getFieldDecorator('courseName', {
                    rules: [{
                      required: true, message: '请输入课程名称',
                    }],
                    initialValue: scheduleDetail.courseName && scheduleDetail.courseNo
                      ? [{ courseName: scheduleDetail.courseName, courseNo: scheduleDetail.courseNo }]
                      : []
                  })(
                    <ModalSelectInput
                      onSelect={this._handleCourseSelect}
                      placeholder='请选择课程'
                      disabled={!!scheduleNo}
                      displayName='courseName'
                      params={this._getCourseParams}
                      inputParams={{ disabled: !!(scheduleNo || batchNo) }}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card title='上课信息'>
            <Row
              justify='start'
              type='flex'
            >
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='允许报名人数'
                >
                  {getFieldDecorator('signupNumber', {
                    rules: [{
                      required: true, message: '请输入允许报名人数',
                    }],
                    ...((!scheduleNo && !batchNo)
                      ? {}
                      : {
                        initialValue: scheduleDetail.signupNumber === 0 ? null : scheduleDetail.signupNumber
                      })
                  })(
                    <InputNumber
                      formatter={value => value > 0 ? parseInt(value, 10) : (value < 0 ? 1 : undefined)}
                      style={{ width: '100%' }}
                      placeholder='请输入允许报名人数'
                      min={1}
                      disabled={courseModeIsS}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='每节课时'
                >
                  {getFieldDecorator('perCourseTime', {
                    rules: [{
                      required: true, message: '请输入每节课时',
                    }],
                    ...((batchNo || scheduleNo) ? { initialValue: scheduleDetail.perCourseTime } : { initialValue: 1 })
                  })(
                    <InputNumber
                      formatter={value => value > 0 ? parseInt(value, 10) : (value < 0 ? 1 : undefined)}
                      style={{ width: '100%' }}
                      placeholder='请输入每节课时'
                      min={1}
                      disabled={courseModeIsS}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='报名状态'
                >
                  {getFieldDecorator('status', {
                    rules: [{
                      required: true, message: '请选择报名状态',
                    }],
                    initialValue: scheduleDetail.status ? (scheduleDetail.status + '') : '1'
                  })(
                    <Select placeholder='请选择报名状态'>
                      <Option value='1'>开启</Option>
                      <Option value='2'>关闭</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <FormItem
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 16 }}
                  label='上课日期'
                >
                  {getFieldDecorator('date', {
                    rules: [
                      { required: true, message: '请选择上课日期' }
                    ],
                    initialValue: scheduleDetail.beginDate && scheduleDetail.endDate
                      ? (scheduleNo
                        ? moment(new Date(scheduleDetail.beginDate))
                        : [moment(new Date(scheduleDetail.beginDate)), moment(new Date(scheduleDetail.endDate))])
                      : (scheduleNo ? undefined : [])
                  })(
                    (scheduleNo ? (
                      <DatePicker
                        disabled={isOrder}
                        disabledDate={this._disabledDate}
                        getCalendarContainer={() => document.getElementById('filter-form')}
                        placeholder='请选择上课日期'
                      />
                    ) : (
                      <RangePicker
                        disabledDate={this._disabledDate}
                        getCalendarContainer={() => document.getElementById('filter-form')}
                        onChange={(value) => this._handleDateChange(value, true)}
                        placeholder='请选择上课日期'
                      />
                    ))
                  )}
                </FormItem>
              </Col>
              <Col span={16}>
                <Row>
                  <Col span={12}>
                    <FormItem
                      labelCol={{ span: 8 }}
                      wrapperCol={{ span: 14 }}
                      label='上课时段：'
                    >
                      {getFieldDecorator('beginTime', {
                        rules: [
                          { required: true, message: '请选择开始时间！' },
                          { validator: this._startTimeValidator }
                        ],
                        initialValue: scheduleDetail.beginTime ? moment(scheduleDetail.beginTime, format) : undefined
                      })(
                        <TimePicker
                          disabled={isOrder}
                          style={{ width: '100%' }}
                          format={format}
                          placeholder='开始时间'
                          onChange={this.beginTimeChange}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <FormItem
                      labelCol={{ span: 0 }}
                      wrapperCol={{ span: 22 }}
                    >
                      {getFieldDecorator('endTime', {
                        rules: [
                          { required: true, message: '请选择结束时间！' },
                          { validator: this._endTimeValidator }
                        ],
                        initialValue: scheduleDetail.endTime ? moment(scheduleDetail.endTime, format) : undefined
                      })(
                        <TimePicker
                          disabledMinutes={this._disabledRangeTime}
                          disabledHours={this._disabledHours}
                          hideDisabledOptions={true}
                          disabled={isOrder || !courseModeIsS}
                          format={format}
                          placeholder='结束时间'
                          style={{ width: '100%' }}
                          onChange={this._endTimeChange}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
              <Col span={scheduleNo ? 0 : 16}>
                <FormItem
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  label='重复设置'
                >
                  {getFieldDecorator('validWeekDays', {
                    rules: [
                      { required: !scheduleNo, message: '请选择设置时间！' }
                    ],
                    initialValue: scheduleDetail.validWeekDays ? scheduleDetail.validWeekDays.split(',').map(item => parseInt(item)) : []
                  })(
                    <Group
                      style={{ margin: 0 }}
                      placeholder='请选择设置时间！'
                    >
                      {weeks.map((item, index) => (
                        <Checkbox disabled={detailType.indexOf(index + 1) === -1} key={index + ''} value={index + 1}>{item}</Checkbox>
                      ))}
                    </Group>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='教练'
                >
                  {getFieldDecorator('teacherNo', {
                    rules: [
                      { required: true, message: '请选择教练' }
                    ],
                    initialValue: (scheduleDetail.teacherNo && jobList.filter(item => item.uuid === scheduleDetail.teacherNo).length > 0)
                      ? scheduleDetail.teacherNo
                      : undefined,
                  })(
                    <Select
                      placeholder='请输入教练'
                    >
                      {jobList.map(item => (
                        <Option key={item.uuid} value={item.uuid}>{item.fullName}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={courseModeIsS ? 0 : 8}>
                <FormItem
                  {...formItemLayout}
                  label='教室'
                >
                  {getFieldDecorator('roomNo', {
                    rules: [
                      { required: !courseModeIsS, message: '请选择教室' }
                    ],
                    initialValue: scheduleDetail.roomNo
                  })(
                    <Select
                      placeholder='请选择教室'
                      getPopupContainer={() => document.getElementById('filter-form')}
                    >
                      {
                        classRoomAllList.map(item => (
                          <Option
                            key={item.roomNo}
                            value={item.roomNo}
                          >{item.roomName}
                          </Option>
                        ))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={16}>
                <FormItem
                  labelCol={{ span: 4 }}
                  wrapperCol={{ span: 20 }}
                  label='备注'
                >
                  {getFieldDecorator('remark', {
                    initialValue: scheduleDetail.remark
                  })(
                    <TextArea
                      maxLength='200'
                      placeholder='请输入备注'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <FormItem className={styles['operate-btn-center']}>
            <Button
              type='primary'
              title='点击保存'
              loading={switchButtonLoading}
              htmlType='submit'
            >
              保存
            </Button>
            <Button
              onClick={() => history.go(-1)}
              title='点击取消'
            >
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    scheduleDetail: state.sportSchedule.scheduleDetail,
    scheduleRepeatDetail: state.sportSchedule.scheduleRepeatDetail,
    courseModal: state.sportCommon.courseModal,
    orgList: state.common.orgList,
    orgLevel: state.common.orgLevel,
    orgId: state.common.orgId,
    classRoomAllList: state.sportCommon.classRoomAllList,
    courseAllList: state.sportCommon.courseAllList,
    jobList: state.sportCommon.jobList,
    switchButtonLoading: state.common.switchButtonLoading
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ScheduleForm))
