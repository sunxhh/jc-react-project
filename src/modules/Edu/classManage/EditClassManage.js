import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
// import { Link } from 'react-router-dom'
import { Form, Input, Button, Card, Select, Row, Col, DatePicker, TimePicker, Checkbox, message } from 'antd'
import moment from 'moment'

import * as actions from './reduck'
import styles from './style.less'
import LessonModal from './LessonModal'
import { PAGE_SIZE } from '../pagination'
import params from '../../../utils/params'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const SelectOption = Select.Option
const CheckboxGroup = Checkbox.Group
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const formItemLayoutCheckbox = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}
const enrolmentStatus = {
  '1': '开启',
  '2': '关闭'
}

const repeatDate = {
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六',
  '7': '星期日',
}

class EditClassManage extends Component {
// 设置 props 默认值
  static defaultProps = {
    orgList: [],
    orgId: undefined,
    classroomList: [],
    teacherList: [],
    courseLoading: false,
    courseList: [],
    coursePagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE,
    },
    showLessonModal: false,
    courseIds: [],
    courseNames: [],
    comDisabled: false,
    detail: {},
    spinning: false,
  };

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch } = this.props
    form.validateFields((err, values) => {
      const isValue = this._courseTime(values.courseStartTime, values.courseEndTime)
      if (!isValue) {
        message.error('结束时段不能小于开始时段')
        return
      }
      if (!err) {
        const idObj = params.url2json(location)
        dispatch(actions.edit({ classTo: {
          organizationId: values.organizationId,
          name: values.name,
          planStudentCount: values.planStudentCount,
          courseHour: values.courseHour,
          classStatus: values.classStatus,
          teacherId: values.teacherId,
          classroomId: values.classroomId,
          mark: values.mark,
          courseStartDate: values.courseStartDate.length ? values.courseStartDate[0].format('YYYY-MM-DD') : '',
          courseEndDate: values.courseStartDate.length ? values.courseStartDate[1].format('YYYY-MM-DD') : '',
          courseStartTime: values.courseStartTime ? values.courseStartTime.format('HH:mm') : '',
          courseEndTime: values.courseEndTime ? values.courseEndTime.format('HH:mm') : '',
          courseIds: this.props.courseIds,
          ...idObj,
        },
        repeatDate: values.repeatDate,
        }))
      }
    })
  }

  _courseTime = (startTime, endTime) => {
    if (!startTime || !endTime) {
      return true
    }
    const startTimeValue = new Date(startTime).valueOf()
    const endTimeValue = new Date(endTime).valueOf()
    if (endTimeValue > startTimeValue) {
      return true
    } else {
      return false
    }
  }

  componentDidMount() {
    const { dispatch } = this.props
    const arg = params.url2json(location)
    dispatch(actions.queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
    dispatch(actions.teacherList({ jobTitle: 1 }))
    dispatch(actions.getCourseList({ course: {}, currentPage: 1, ...this.props.coursePagination }))
    dispatch(actions.detail(arg)).then(res => {
      dispatch(actions.classroomList({ orgId: res.data.organizationId }))
      dispatch(actions.getCourseAndCourseId({
        courseIds: res.data.cCourse.map((item) => item.courseId),
        courseNames: res.data.cCourse.map((item) => item.courseName)
      }))
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(actions.getCourseAndCourseId({
      courseIds: [],
      courseNames: [],
    }))
    dispatch(createAction(actions.CLASS_DETAIL)({}))
  }

  _lessonShowModal = (e) => {
    const { dispatch } = this.props
    dispatch(actions.switchShowLessonModal(true))
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { detail } = this.props

    return (
      <div>
        <LessonModal
          courseLoading = {this.props.courseLoading}
          courseList = {this.props.courseList}
          coursePagination = {this.props.coursePagination}
          showLessonModal = {this.props.showLessonModal}
          dispatch = {this.props.dispatch}
          addForm = {this.props.form}
        />
        <Form
          onSubmit={this._handleSubmit}
        >
          <FormItem className='operate-btn'>
            <Button
              type='primary'
              title='点击保存'
              htmlType='submit'
              loading={this.props.showBtnSpin}
            >
                保存
            </Button>
            <Button
              title='点击取消'
              onClick={() => history.go(-1)}
            >
                取消
            </Button>
          </FormItem>
          <Card
            title={<span className={styles['card-tit']}>基础信息</span>}
            className={styles['card-wrapper']}
            loading={!detail.id}
          >
            <Row
              id='rowUser'
              justify='start'
              type='flex'
            >
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='所属机构：'
                >
                  {getFieldDecorator('organizationId', {
                    initialValue: detail.organizationId,
                    rules: [{
                      required: true,
                      message: '请选择所属机构'
                    }],
                  })(
                    <Select
                      placeholder='请选择所属机构'
                      disabled = {true}
                      showSearch={true}
                      filterOption={this._filterOption}
                      getPopupContainer={() => document.getElementById('rowUser')}
                    >
                      {
                        this.props.orgList.map(item => {
                          return (
                            <SelectOption
                              key={item.id}
                              value={item.id}
                            >
                              {item.orgName}
                            </SelectOption>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='班级名称：'
                >
                  {getFieldDecorator('name', {
                    initialValue: detail.name,
                    rules: [
                      { required: true, message: '请输入班级名称！', whitespace: true }
                    ],
                  })(
                    <Input
                      placeholder='请输入班级名称'
                      maxLength={50}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='课程名称：'
                >
                  {getFieldDecorator('courseIds', {
                    initialValue: this.props.courseNames[0],
                    rules: [
                      { required: true, message: '请输入课程名称：', whitespace: true }
                    ],
                  })(
                    <Input
                      width='50px'
                      placeholder='请输入课程名称'
                      disabled={true}
                      maxLength={50}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='预招人数'
                >
                  {getFieldDecorator('planStudentCount', {
                    initialValue: String(detail.planStudentCount),
                    rules: [{
                      required: true,
                      message: '请输入预招人数',
                    }, {
                      pattern: '^([1-9][0-9]*){1,3}$',
                      message: '请输入大于0的正整数',
                    }],
                  })(
                    <Input
                      placeholder='请输入预招人数'
                      maxLength={50}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='每次上课：'
                >
                  {getFieldDecorator('courseHour', {
                    initialValue: detail.courseHour,
                    whitespace: true,
                    rules: [{
                      required: true,
                      message: '请输入每次上课(课时)'
                    }],
                  })(
                    <Input
                      maxLength={13}
                      placeholder='请输入每次上课(课时)'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='招生状态：'
                >
                  {getFieldDecorator('classStatus', {
                    initialValue: detail.classStatus,
                    rules: [{
                      required: true,
                      message: '请选择招生状态'
                    }],
                  })(
                    <Select
                      showSearch
                      optionLabelProp='title'
                      placeholder='请选择招生状态'
                      filterOption={false}
                      getPopupContainer={() => document.getElementById('rowUser')}
                    >
                      {
                        Object.keys(enrolmentStatus).map((key) => {
                          return (
                            <SelectOption
                              key={key}
                              value={key}
                              title={enrolmentStatus[key]}
                            >
                              {enrolmentStatus[key]}
                            </SelectOption>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='上课日期：'
                >
                  {getFieldDecorator('courseStartDate', {
                    initialValue: detail.courseStartDate && detail.courseEndDate ? [moment(detail.courseStartDate), moment(detail.courseEndDate)] : [],
                  })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD'
                      placeholder={['开始日期', '结束日期']}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={16}
                style={{ paddingLeft: '15px' }}
              >
                <Row>
                  <Col span={10}>
                    <FormItem
                      {...formItemLayout}
                      label='上课时段'
                    >
                      {getFieldDecorator('courseStartTime', {
                        initialValue: detail.courseStartTime ? moment(detail.courseStartTime, 'HH:mm') : null,
                      })(
                        <TimePicker
                          style={{ width: '140px' }}
                          format='HH:mm'
                          placeholder='上课时段'
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={6}>
                    <FormItem>
                      {getFieldDecorator('courseEndTime', {
                        initialValue: detail.courseEndTime ? moment(detail.courseEndTime, 'HH:mm') : null,
                      })(
                        <TimePicker
                          style={{ width: '140px' }}
                          format='HH:mm'
                          placeholder='上课时段'
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col
                span={24}
                style={{ marginLeft: '-11px' }}
              >
                <FormItem
                  {...formItemLayoutCheckbox}
                  label='重复设置：'
                >
                  {getFieldDecorator('repeatDate', {
                    initialValue: detail.repeatDate,
                  })(
                    <CheckboxGroup>
                      {
                        Object.keys(repeatDate).map((key) => {
                          return (
                            <Checkbox
                              key={key}
                              value={key}
                            >
                              {repeatDate[key]}
                            </Checkbox>)
                        })
                      }
                    </CheckboxGroup>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='教师：'
                >
                  {getFieldDecorator('teacherId', {
                    initialValue: (detail.teacherId && this.props.teacherList.filter(item => item.uuid === detail.teacherId).length > 0)
                      ? detail.teacherId
                      : (detail.teacherName || '')
                  })(
                    <Select
                      placeholder='请选择教师'
                      showSearch={true}
                      filterOption={this._filterOption}
                      getPopupContainer={() => document.getElementById('rowUser')}
                    >
                      <SelectOption
                        key='-1'
                        value=''
                      >
                          请选择
                      </SelectOption>
                      {
                        this.props.teacherList.map((item) => {
                          return (
                            <SelectOption
                              key={item.uuid}
                              value={item.uuid}
                            >
                              {item.fullName}
                            </SelectOption>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='教室：'
                >
                  {getFieldDecorator('classroomId', {
                    initialValue: (detail.classroomId && this.props.classroomList.filter(item => item.uuid === detail.classroomId).length > 0)
                      ? detail.classroomId
                      : (detail.classroomName || '')
                  })(
                    <Select
                      placeholder='请选择教室'
                      showSearch={true}
                      filterOption={this._filterOption}
                      getPopupContainer={() => document.getElementById('rowUser')}
                    >
                      <SelectOption
                        key='-1'
                        value=''
                      >
                          请选择
                      </SelectOption>
                      {
                        this.props.classroomList.map((item) => {
                          return (
                            <SelectOption
                              key={item.id}
                              value={item.id}
                            >
                              {item.classRoomName}
                            </SelectOption>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='备注：'
                >
                  {getFieldDecorator('mark', {
                    initialValue: detail.mark,
                  })(
                    <TextArea
                      placeholder='请输入备注'
                      maxLength={500}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orgList: state.classManage.orgList,
    orgId: state.classManage.orgId,
    classroomList: state.classManage.classroomList,
    teacherList: state.classManage.teacherList,
    courseLoading: state.classManage.courseLoading,
    courseList: state.classManage.courseList,
    coursePagination: state.classManage.coursePagination,
    showLessonModal: state.classManage.showLessonModal,
    courseIds: state.classManage.courseIds,
    courseNames: state.classManage.courseNames,
    showBtnSpin: state.common.showButtonSpin,
    detail: state.classManage.detail,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditClassManage))
