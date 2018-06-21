import React, { Component } from 'react'
import { connect } from 'react-redux'
import moment from 'moment'
import { createAction } from 'redux-actions'
// import { Link } from 'react-router-dom'
import { Form, Input, Button, Card, Row, Col, Select, DatePicker, Radio, Icon } from 'antd'
// import { isEmpty } from '../../../../utils/lang'
import paramsUtils from '../../../../utils/params'
import {
  detail,
  teacherList,
  getStudentList,
  getRecordDetail,
  addRecord,
  editRecord,
  RECORD_DETAIL,
  CHANGE_STATUS_ALL,
  CHANGE_VALUE_ALL,
} from '../reduck'
import styles from '../style.less'

const FormItem = Form.Item
const RadioGroup = Radio.Group
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}
const TextArea = Input.TextArea

class AttendClassRecordForm extends Component {
  constructor(props) {
    super(props)
    const params = paramsUtils.url2json(location)
    this.state = {
      classId: params.classId,
      recordId: params.recordId,
      readOnly: params.status + '' === '1',
    }
  }

  getRecordArg = (values, isEdit) => {
    const { classId, recordId } = this.state
    return {
      classRecord: {
        [isEdit ? 'id' : 'classId']: recordId || classId,
        teacherId: values.teacherId,
        recoreDate: values.recoreDate.format('YYYY-MM-DD'),
        content: values.content,
      },
      classStudentRecord: this.props.studentInfoAllList.map((item, index) => {
        const classOrderIdObj = !isEdit ? { classOrderId: item.id } : {}
        return {
          ...classOrderIdObj,
          [isEdit ? 'id' : 'classStudentId']: item.stuRecordId || item.studentId,
          recordType: this.props.form.getFieldValue('status' + index),
          recordHour: this.props.form.getFieldValue('recordHour' + index),
          teacherMsg: this.props.form.getFieldValue('teacherMsg' + index),
        }
      })
    }
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const args = this.getRecordArg(values, !!this.state.recordId)
        const request = this.state.recordId ? editRecord : addRecord
        dispatch(request(args))
      }
    })
  }

  componentWillMount() {
    const { dispatch } = this.props
    const { recordId, classId } = this.state
    if (classId) {
      dispatch(detail({ id: classId }))
      dispatch(teacherList({ jobTitle: 1 }))
      if (recordId) {
        dispatch(getRecordDetail({ id: recordId }))
      } else {
        dispatch(getStudentList({ classId }))
        dispatch(createAction(RECORD_DETAIL)({}))
      }
    }
  }

  StudentItem = props => {
    const { info, getFieldDecorator, index } = props
    const { recordId } = this.state
    const { classDetail } = this.props
    return (
      <Row
        type='flex'
        align='middle'
      >
        <Col span={2} style={{ textAlign: 'center' }}>
          <Icon type='user' style={{ fontSize: 40 }} />
          <div>{info.studentNo + '/' + info.name}</div>
        </Col>
        <Col span={22}>
          <Row>
            <Col span={12}>
              <FormItem
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
                label='&nbsp;'
                colon={false}
              >
                {getFieldDecorator('status' + index, {
                  rules: [
                    { required: true, message: '请选择上课状态！' }
                  ],
                  initialValue: info.recordType
                })(
                  <RadioGroup>
                    <Radio value='1'>上课</Radio>
                    <Radio value='2'>请假</Radio>
                    <Radio value='3'>旷课</Radio>
                    <Radio value='4'>补课</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label='扣除学时：'
                labelCol={{ span: 6 }}
                wrapperCol={{ span: 18 }}
              >
                {getFieldDecorator('recordHour' + index, {
                  rules: [
                    { required: true, message: '请输入扣除学时！' }
                  ],
                  initialValue: info.recordHour || classDetail.courseHour || ''
                })(
                  <Input
                    disabled={!!recordId}
                    size='small'
                    style={{ width: 100 }}
                    addonAfter='课时'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <FormItem
            labelCol={{ span: 3 }}
            wrapperCol={{ span: 14 }}
            label='教师留言'
          >
            {getFieldDecorator('teacherMsg' + index, {
              initialValue: info.teacherMsg
            })(
              <TextArea />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }

  globalValueChange = e => {
    this.props.dispatch(createAction(CHANGE_VALUE_ALL)(e.target.value))
    const values = this.props.form.getFieldsValue()
    const keys = Object.keys(values).filter(item => item.includes('recordHour'))
    const res = {}
    keys.forEach(item => {
      res[item] = e.target.value
    })
    this.props.form.setFieldsValue(res)
  }

  globalStatusChange = e => {
    this.props.dispatch(createAction(CHANGE_STATUS_ALL)(e.target.value))
    const values = this.props.form.getFieldsValue()
    const keys = Object.keys(values).filter(item => item.includes('status'))
    const res = {}
    keys.forEach(item => {
      res[item] = e.target.value
    })
    this.props.form.setFieldsValue(res)
  }

  render() {
    const { form, classDetail, studentInfoAllList, teacherList, recordDetail } = this.props
    const { getFieldDecorator } = form
    const { recordId } = this.state
    const StudentItem = this.StudentItem
    const values = this.props.form.getFieldsValue()
    const attendNum = Object.keys(values).filter(item => item.includes('status') && (values[item] === '1' || values[item] === '4')).length
    return (
      <div>
        <Form
          onSubmit={this._handleSubmit}
        >
          <FormItem className={styles['operate-btn']}>
            <Button
              type='primary'
              title='点击保存'
              loading={this.props.showBtnSpin}
              htmlType='submit'
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
            className={styles['form-card']}
            bodyStyle={{ padding: 10 }}
          >
            <div className={styles['card-title']}><p>课程记录</p></div>
            <Row
              id='rowUser'
              justify='start'
              type='flex'
            >
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='机构：'
                >
                  {getFieldDecorator('organization', {})(
                    <span>{classDetail.orgName || ''}</span>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='班级名称：'
                >
                  {getFieldDecorator('className', {})(
                    <span>{classDetail.name}</span>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='课程名称：'
                >
                  {getFieldDecorator('courseName', {})(
                    <span>{classDetail.courseName}</span>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='上课日期：'
                >
                  {getFieldDecorator('recoreDate', {
                    rules: [
                      { required: true, message: '请选择上课日期！' }
                    ],
                    initialValue: recordDetail.recoreDate ? moment(new Date(recordDetail.recoreDate)) : ''
                  })(
                    <DatePicker
                      placeholder='请选择上课日期'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='教师：'
                >
                  {getFieldDecorator('teacherId', {
                    rules: [
                      { required: true, message: '请输入教师名称！' }
                    ],
                    initialValue: recordDetail.teacherId
                  })(
                    <Select>
                      {teacherList.map((item, index) => (
                        <Option key={index} value={item.uuid}>{item.fullName}</Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='上课内容：'
                >
                  {getFieldDecorator('content', {
                    rules: [
                      { required: true, message: '请输入上课内容！' }
                    ],
                    initialValue: recordDetail.content
                  })(
                    <TextArea
                      placeholder='请输入上课内容'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            className={styles['form-card']}
            bodyStyle={{ padding: 10 }}
          >
            <div
              className={styles['card-title']}
              style={{ marginTop: -10, marginBottom: 0, paddingBottom: 0 }}
            >
              <Row
                type='flex'
                justify='center'
                align='middle'
              >
                <Col span={2}>
                  <p>学员记录</p>
                </Col>
                <Col span={18}>
                  <Row>
                    <Col span={12}>
                      <FormItem
                        style={{ margin: 0 }}
                        labelCol = {{ span: 6 }}
                        wrapperCol = {{ span: 18 }}
                        label='批量操作：'
                      >
                        <RadioGroup onChange={e => this.globalStatusChange(e)}>
                          <Radio value='1'>上课</Radio>
                          <Radio value='2'>请假</Radio>
                          <Radio value='3'>旷课</Radio>
                          <Radio value='4'>补课</Radio>
                        </RadioGroup>
                      </FormItem>
                    </Col>
                    <Col span={9}>
                      <FormItem
                        style={{ margin: 0 }}
                        labelCol = {{ span: 15 }}
                        wrapperCol = {{ span: 9 }}
                        label='扣除学时：'
                      >
                        <Input
                          disabled={!!recordId}
                          size='small'
                          style={{ width: 100 }}
                          onChange={(e) => this.globalValueChange(e)}
                          addonAfter='课时'
                        />
                      </FormItem>
                    </Col>
                  </Row>
                </Col>
                <Col span={3}>
                  <span>{'上课人数：' + (attendNum || 0) + '人'}</span>
                </Col>
              </Row>
            </div>
            {studentInfoAllList && studentInfoAllList.map((item, index) => (
              <StudentItem
                key={item.stuRecordId}
                info={item}
                getFieldDecorator={getFieldDecorator}
                index={index}
              />
            ))}
          </Card>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    recordDetail: state.classManage.recordDetail,
    classDetail: state.classManage.detail,
    studentInfoAllList: state.classManage.studentInfoAllList,
    teacherList: state.classManage.teacherList,
    showBtnSpin: state.common.showButtonSpin,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AttendClassRecordForm))
