import React from 'react'
import moment from 'moment'
import { Form, Row, Col, DatePicker, TimePicker, Select } from 'antd'
import { isEmpty } from '../../../utils/lang'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}
const format = 'HH:mm'

class SingleSchedule extends React.Component {
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
    const startTime = this.props.form.getFieldsValue(['startTime'])
    if (isEmpty(value) || !startTime['startTime']) {
      callback()
      return
    }
    if (startTime['startTime'].valueOf() >= value.valueOf()) {
      callback('结束时间应该晚于开始时间!')
      return
    }
    callback()
  }

  render() {
    const { getFieldDecorator, teacherList, classroomList, dataSource } = this.props
    return (
      <Row
        id='rowUser'
        justify='start'
        type='flex'
      >
        <Col span={8}>
          <FormItem
            {...formItemLayout}
            label='上课日期：'
          >
            {getFieldDecorator('date', {
              rules: [
                { required: true, message: '请选择上课日期！' }
              ],
              initialValue: dataSource.startDate ? moment(new Date(dataSource.startDate)) : ''
            })(
              <DatePicker
                getCalendarContainer={() => document.getElementById('filter-form')}
                placeholder='请选择上课日期'
                disabledDate={this._disabledDate}
              />
            )}
          </FormItem>
        </Col>
        <Col span={16}>
          <Row>
            <Col span={12}>
              <FormItem
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                label='上课时段：'
              >
                {getFieldDecorator('startTime', {
                  rules: [
                    { required: true, message: '请选择开始时间！' },
                    { validator: this._startTimeValidator }
                  ],
                  initialValue: dataSource.startTime ? moment(dataSource.startTime, format) : null
                })(
                  <TimePicker
                    getPopupContainer={() => document.getElementById('filter-form')}
                    format={format}
                    placeholder='开始时间'
                    style={{ width: 150 }}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem
                labelCol={{ span: 0 }}
                wrapperCol={{ span: 24 }}
              >
                {getFieldDecorator('endTime', {
                  rules: [
                    { required: true, message: '请选择结束时间！' },
                    { validator: this._endTimeValidator }
                  ],
                  initialValue: dataSource.endTime ? moment(dataSource.endTime, format) : null
                })(
                  <TimePicker
                    getPopupContainer={() => document.getElementById('filter-form')}
                    format={format}
                    placeholder='结束时间'
                    style={{ marginLeft: 10, width: 150 }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <FormItem
            {...formItemLayout}
            label='教师：'
          >
            {getFieldDecorator('teacherId', {
              rules: [
                { required: true, message: '请选择教师！' }
              ],
              initialValue: (dataSource.teacherId && teacherList.filter(item => item.uuid === dataSource.teacherId).length > 0)
                ? dataSource.teacherId
                : (dataSource.teacherName || '')
            })(
              <Select getPopupContainer={() => document.getElementById('filter-form')} placeholder='请选择教师'>
                {teacherList.map(item => (
                  <Option key={item.uuid} value={item.uuid}>{item.fullName}</Option>
                ))}
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
              rules: [
                { required: true, message: '请选择教室！' }
              ],
              initialValue: (dataSource.classroomId && classroomList.filter(item => item.id === dataSource.classroomId).length > 0)
                ? dataSource.classroomId
                : (dataSource.classroomName || '')
            })(
              <Select
                getPopupContainer={() => document.getElementById('filter-form')}
                placeholder='请选择教室'
              >
                {classroomList.map(item => (
                  <Option key={item.id} value={item.id}>{item.classRoomName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
}

export default SingleSchedule
