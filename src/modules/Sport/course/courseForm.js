import React from 'react'
import { connect } from 'react-redux'
import { Card, Form, Input, Row, Col, Select, Button } from 'antd'

import {
  getCourseDetail,
  addCourse,
  modifyCourse,
  COURSE_DETAIL,
} from './reduck'
import {
  courseModalList
} from '../reduck'
import { SPORT_COURSE } from 'Global/urls'
import styles from './course.less'
import { createAction } from 'redux-actions'

const FormItem = Form.Item
const Option = Select.Option
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class CourseForm extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      courseNo: this.props.match.params.courseNo
    }
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { courseNo } = this.state
    if (courseNo) {
      dispatch(getCourseDetail({ courseNo }))
    } else {
      dispatch(createAction(COURSE_DETAIL)({}))
    }
    dispatch(courseModalList({ type: 'courseMode' }))
  }

  handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    const { courseNo } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        const reqBody = {
          courseCategory: values.courseCategory,
          courseName: values.courseName,
          courseMode: values.courseMode,
          singleTime: parseFloat(values.singleTime),
          courseStrength: parseInt(values.courseStrength),
          remark: values.remark,
        }
        if (courseNo) {
          dispatch(modifyCourse({ ...reqBody, courseNo })).then(res => {
            res && (location.href = SPORT_COURSE)
          })
        } else {
          dispatch(addCourse(reqBody)).then(res => {
            res && (location.href = SPORT_COURSE)
          })
        }
      }
    })
  }

  render() {
    const { courseDetail, form, courseModal } = this.props
    const { courseNo } = this.state
    const { getFieldDecorator } = form
    return (
      <Form
        onSubmit={this.handleSubmit}
        style={{ marginTop: 8, position: 'relative' }}
        id='filter-form'
      >
        <Card title='基础信息'>
          <Row
            justify='start'
            type='flex'
          >
            <Col span={courseNo ? 8 : 0}>
              <FormItem
                {...formItemLayout}
                label='课程编号'
              >
                {getFieldDecorator('courseNo', {
                  initialValue: courseDetail.courseNo
                })(
                  <Input disabled placeholder='请输入课程编号' />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='课程类别'
              >
                {getFieldDecorator('courseCategory', {
                  rules: [{
                    required: true, message: '请选择课程类别',
                  }],
                  initialValue: '健身'
                })(
                  <Input disabled />
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
                  initialValue: courseDetail.courseName
                })(
                  <Input placeholder='请输入课程名称' maxLength='8' />
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
                    required: true, message: '请选择课程模式',
                  }],
                  initialValue: courseDetail.courseMode
                })(
                  <Select
                    disabled={!!courseNo}
                    placeholder='请选择课程模式'
                    getPopupContainer={() => document.getElementById('filter-form')}
                  >
                    {courseModal.map(item => (
                      <Select.Option
                        key={item.value}
                        value={item.value}
                      >{item.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='单节时间'
              >
                {getFieldDecorator('singleTime', {
                  rules: [{
                    required: true, message: '请输入单节时间',
                  }, {
                    pattern: /^[1-9]\d*$/,
                    message: '请输入1-999的正整数',
                  }],
                  initialValue: courseDetail.singleTime
                })(
                  <Input
                    maxLength='3'
                    placeholder='请输入单节时间'
                    addonAfter='分钟'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='运动强度'
              >
                {getFieldDecorator('courseStrength', {
                  rules: [{
                    required: true, message: '请选择运动强度',
                  }],
                  initialValue: courseDetail.courseStrength ? courseDetail.courseStrength + '' : null
                })(
                  <Select
                    placeholder='请选择运动强度'
                    getPopupContainer={() => document.getElementById('filter-form')}
                  >
                    <Option value='1'>⭐</Option>
                    <Option value='2'>⭐⭐</Option>
                    <Option value='3'>⭐⭐⭐</Option>
                    <Option value='4'>⭐⭐⭐⭐</Option>
                    <Option value='5'>⭐⭐⭐⭐⭐</Option>
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
                  initialValue: courseDetail.remark
                })(
                  <TextArea
                    maxLength='200'
                    placeholder='最多输入200字符'
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
            loading={this.props.showBtnSpin}
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
    )
  }
}

const mapStateToProps = state => {
  return {
    courseDetail: state.sportCourse.courseDetail,
    courseModal: state.sportCommon.courseModal,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CourseForm))
