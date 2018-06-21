import moment from 'moment'
import React from 'react'
import { Form, Row, Col, DatePicker, TimePicker, Select, Checkbox, Input } from 'antd'
import styles from './courseArray.less'
import { isEmpty } from '../../../utils/lang'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const Group = Checkbox.Group
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
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

class RepeatScheduleItem extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      detailType: [1, 2, 3, 4, 5, 6, 7]
    }
  }

  componentDidMount() {
    const { dataSource } = this.props
    const dates = dataSource.startDate && dataSource.endDate
      ? [moment(new Date(dataSource.startDate)), moment(new Date(dataSource.endDate))] : null
    dates && this._handleDateChange(dates, false)
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
      const i = this.props.index || 0
      this.props.form.setFieldsValue({
        ['detailType' + i]: [],
      })
    }
    this.setState({ detailType: res })
  }

  _disabledDate = (current) => {
    return current && current.valueOf() < moment(moment(Date.now()).format('YYYY-MM-DD')).valueOf()
  }

  _startTimeValidator = (rule, value, callback) => {
    const i = this.props.index || 0
    const endTime = this.props.form.getFieldsValue(['endTime' + i])
    if (isEmpty(value) || !endTime['endTime' + i]) {
      callback()
      return
    }
    if (endTime['endTime' + i].valueOf() <= value.valueOf()) {
      callback('开始时间时间应该早于结束时间!')
      return
    }
    callback()
  }

  _endTimeValidator = (rule, value, callback) => {
    const i = this.props.index || 0
    const startTime = this.props.form.getFieldsValue(['startTime' + i])
    if (isEmpty(value) || !startTime['startTime' + i]) {
      callback()
      return
    }
    if (startTime['startTime' + i].valueOf() >= value.valueOf()) {
      callback('结束时间应该晚于开始时间!')
      return
    }
    callback()
  }

  render() {
    const { dataSource, inModal, getFieldDecorator, classroomList, teacherList, operateDom } = this.props
    const { detailType } = this.state
    const i = this.props.index || 0
    return (
      <Row
        id='schedule-row'
        style={{ position: 'relative' }}
        className={inModal ? '' : styles['repeat-schedule-item']}
        justify='start'
        type='flex'
        align='middle'
      >
        {operateDom}
        <Col span={10}>
          <FormItem
            {...formItemLayout}
            label='上课日期'
          >
            {getFieldDecorator('date' + i, {
              rules: [
                { required: true, message: '请选择上课日期！' }
              ],
              initialValue: dataSource.startDate && dataSource.endDate
                ? [moment(new Date(dataSource.startDate)), moment(new Date(dataSource.endDate))] : []
            })(
              <RangePicker
                disabledDate={this._disabledDate}
                getCalendarContainer={() => document.getElementById('schedule-row')}
                disabled={!inModal}
                onChange={(value) => this._handleDateChange(value, true)}
                placeholder='请选择上课日期'
              />
            )}
          </FormItem>
        </Col>
        <Col span={12} offset={1}>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 18 }}
          >
            <div>
              {getFieldDecorator('maxNum' + i, {
                rules: [
                  { required: true, message: '请输入最多排课次数！' },
                  {
                    pattern: /^[1-9]{1}\d*$/,
                    message: '请输入正确的正整数'
                  }
                ],
                initialValue: dataSource.maxNum
              })(
                <Input
                  disabled={!inModal}
                  addonAfter='次'
                  addonBefore='最多排'
                />
              )}
            </div>
          </FormItem>
        </Col>
        <Col span={20}>
          <Row>
            <Col span={12}>
              <FormItem
                labelCol={{ span: 10 }}
                wrapperCol={{ span: 14 }}
                label='上课时段：'
              >
                {getFieldDecorator('startTime' + i, {
                  rules: inModal ? [
                    { required: true, message: '请选择开始时间！' },
                    { validator: this._startTimeValidator }
                  ] : [],
                  initialValue: dataSource.startTime ? moment(dataSource.startTime, format) : ''
                })(
                  <TimePicker
                    disabled={!inModal}
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
                {getFieldDecorator('endTime' + i, {
                  rules: inModal ? [
                    { required: true, message: '请选择结束时间！' },
                    { validator: this._endTimeValidator }
                  ] : [],
                  initialValue: dataSource.endTime ? moment(dataSource.endTime, format) : ''
                })(
                  <TimePicker
                    disabled={!inModal}
                    format={format}
                    placeholder='结束时间'
                    style={{ marginLeft: 10, width: 150 }}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Col>
        <Col span={20}>
          <FormItem
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 20 }}
            label='多次设置'
          >
            {getFieldDecorator('detailType' + i, {
              rules: [
                { required: true, message: '请选择设置时间！' }
              ],
              initialValue: dataSource.detailType ? dataSource.detailType.split(',').map(item => parseInt(item)) : []
            })(
              <Group
                style={{ margin: 0 }}
                disabled={!inModal}
                placeholder='请选择设置时间！'
              >
                {weeks.map((item, index) => (
                  <Checkbox disabled={detailType.indexOf(index + 1) === -1} key={index + ''} value={index + 1}>{item}</Checkbox>
                ))}
              </Group>
            )}
          </FormItem>
        </Col>
        <Col span={10}>
          <FormItem
            {...formItemLayout}
            label='教师'
          >
            {getFieldDecorator('teacherId' + i, {
              rules: [
                { required: true, message: '请选择教师！' }
              ],
              initialValue: (dataSource.teacherId && teacherList.filter(item => item.uuid === dataSource.teacherId).length > 0)
                ? dataSource.teacherId
                : (dataSource.teacherName || '')
            })(
              <Select disabled={!inModal} placeholder='请选择教师'>
                {teacherList.map(item => (
                  <Option key={item.uuid} value={item.uuid}>{item.fullName}</Option>
                ))}
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            label='教室'
          >
            {getFieldDecorator('classroomId' + i, {
              rules: [
                { required: true, message: '请选择教室！' }
              ],
              initialValue: (dataSource.classroomId && classroomList.filter(item => item.id === dataSource.classroomId).length > 0)
                ? dataSource.classroomId
                : (dataSource.classroomName || '')
            })(
              <Select
                disabled={!inModal}
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

export default RepeatScheduleItem
