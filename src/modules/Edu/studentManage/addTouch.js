import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import { connect } from 'react-redux'
import { Form, Button } from 'antd'
import BaseInform from './baseInform'
import {
  getStudentDetail,
  addTouch,
  getTouchType,
} from '../studentManage/reduck'
import { Card, Row, Col, Input, Select, DatePicker } from 'antd'
import moment from 'moment'

const FormItem = Form.Item
const Option = Select.Option
const { TextArea } = Input
class AddTouch extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: []
    }
  }

  static defaultProps = {
    studentDetail: {},
  }
  componentDidMount() {
    const { dispatch } = this.props
    const studentId = this.props.match.params
    dispatch(getTouchType({ codeType: 'stuTouchType' }))
    dispatch(getStudentDetail(studentId))
  }

  // 点击新增沟通保存
  _handleAddTouch = () => {
    const { dispatch } = this.props
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const studentId = this.props.match.params.id
        const arg = { ...values, studentId }
        dispatch(addTouch({
          ...arg,
          touchNextTime: arg.touchNextTime ? moment(arg.touchNextTime).format('YYYY-MM-DD HH:mm:ss') : '',
          touchTime: arg.touchTime ? moment(arg.touchTime).format('YYYY-MM-DD HH:mm:ss') : '',
        }))
      }
    })
  }

  // 回访时间必须大于当前时间
  _disabledDate = (current) => {
    return current && current.valueOf() < new Date()
  }

  render() {
    const dateFormat = 'YYYY-MM-DD HH:mm:ss'
    const { getFieldDecorator } = this.props.form
    const { studentDetail, getTouchType } = this.props
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    return (
      <div>
        <div className='operate-btn'>
          <Button
            type='primary'
            title='点击保存'
            style={{ marginRight: '10px' }}
            onClick={this._handleAddTouch}
            loading={this.props.showBtnSpin}
          >
            保存
          </Button>
          <Link to={`${urls.EDU_STUDENT_MANAGE}`}>
            <Button
              title='点击取消'
            >
              取消
            </Button>
          </Link>
        </div>
        <BaseInform
          studentDetail={studentDetail}
        />
        <Card title= '沟通信息'>
          <Row>
            <Form>
              <Col
                id='touchType'
                span={8}
              >
                <FormItem
                  {...formItemLayout}
                  label='沟通类型：'
                >
                  {getFieldDecorator('touchType', {
                    rules: [{
                      required: true,
                      message: '请选择沟通类型'
                    }]
                  })(
                    <Select
                      style={{ width: '130px' }}
                      getPopupContainer = {() => document.getElementById('touchType')}
                    >
                      <Option
                        value=''
                        key=''
                      >
                        请选择
                      </Option>
                      {
                        getTouchType && getTouchType.map((item) => {
                          return (
                            <Option
                              value={item.value}
                              key={item.value}
                            >
                              {item.name}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                id='touchNextTime'
                span={8}
              >
                <FormItem
                  {...formItemLayout}
                  label='回访时间：'
                >
                  {getFieldDecorator('touchNextTime', {
                    initialValue: null
                  })(
                    <DatePicker
                      getCalendarContainer = {() => document.getElementById('touchNextTime')}
                      placeholder='请选择回访时间'
                      format={dateFormat}
                      showTime
                      disabledDate={this._disabledDate}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                id='touchTime'
                span={8}
              >
                <FormItem
                  {...formItemLayout}
                  label='沟通时间：'
                >
                  {getFieldDecorator('touchTime', {
                    initialValue: moment(new Date(), 'YYYY-MM-DD HH:mm:ss')
                  })(
                    <DatePicker
                      getCalendarContainer = {() => document.getElementById('touchTime')}
                      format={dateFormat}
                      showTime
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={24}
              >
                <FormItem
                  labelCol = {{ span: 2 }}
                  wrapperCol = {{ span: 20 }}
                  style={{ marginLeft: '30px' }}
                  label='沟通内容：'
                >
                  {getFieldDecorator('touchContent', {
                    rules: [{
                      required: true,
                      message: '请输入沟通内容！'
                    }],
                    initialValue: ''
                  })(
                    <TextArea
                      rows={6}
                      style={{ height: '100px' }}
                      maxLength='499'
                    />
                  )}
                </FormItem>
              </Col>
            </Form>
          </Row>
        </Card>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    token: state.common.qiniuToken || '',
    studentDetail: state.eduStudents.studentDetail,
    getTouchType: state.eduStudents.getTouchType,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AddTouch))

