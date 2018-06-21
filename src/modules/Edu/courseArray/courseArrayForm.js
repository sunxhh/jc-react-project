import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Form, Input, Button, Card, Row, Col, Select, Icon, message } from 'antd'
import { isEmpty } from '../../../utils/lang'
import ClassList from './classList'
import {
  getCourseArrayDetail,
  getCourseArrayDayDetail,
  COURSE_ARRAY_DETAIL,
  queryOrg,
  classroomList,
  teacherList,
  addCourseArray,
  getClassList,
  editSingleCourseArray,
  editRepeatCourseArray,
} from './reduck'
import { showModalWrapper } from '../../../components/modal/ModalWrapper'
import RepeatScheduleModal from './repeatScheduleModal'
import styles from './courseArray.less'
import SingleSchedule from './singleSchedule'
import RepeatSchedule from './repeatSchedule'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}

class CourseArrayForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduleType: '1',
      scheduleNo: this.props.match.params.scheduleNo,
      scheduleId: this.props.match.params.scheduleId,
    }
  }

  getScheduleDetail = (scheduleType, values) => {
    if (scheduleType === '1') {
      return [
        {
          teacherId: values.teacherId,
          classroomId: values.classroomId,
          startDate: values.date ? values.date.format('YYYY-MM-DD') : '',
          endDate: values.date ? values.date.format('YYYY-MM-DD') : '',
          startTime: values.startTime.format('HH:mm'),
          endTime: values.endTime.format('HH:mm'),
          maxNum: values.maxNum || 1,
          detailType: values.detailType || '1,2,3,4,5,6,7',
        }
      ]
    } else {
      return this.props.scheduleDetail.filter(item => !isEmpty(item)).map(item => {
        return {
          teacherId: item.teacherId,
          classroomId: item.classroomId,
          startDate: item.startDate,
          endDate: item.endDate,
          startTime: item.startTime,
          endTime: item.endTime,
          maxNum: item.maxNum || 1,
          detailType: item.detailType || '1,2,3,4,5,6,7',
        }
      })
    }
    // return scheduleType === '1' ?  : this.props.scheduleDetail.filter(item => !isEmpty(item))
  }

  getReqBody = values => {
    return {
      scheduleClassId: values.classId,
      scheduleOrgId: values.scheduleOrgId,
      scheduleType: values.scheduleType,
      scheduleDetail: this.getScheduleDetail(this.state.scheduleType, values)
    }
  }

  // 提交处理
  _handleSubmit = (e) => {
    e.preventDefault()
    const { dispatch, form } = this.props
    const { scheduleNo, scheduleId } = this.state
    form.validateFields((err, values) => {
      if (!err) {
        const reqBody = this.getReqBody(values)
        if (scheduleNo) {
          if (scheduleId) {
            dispatch(editSingleCourseArray({
              id: scheduleId,
              scheduleClassId: values.classId,
              scheduleOrgId: values.scheduleOrgId,
              scheduleType: values.scheduleType,
              teacherId: values.teacherId,
              classroomId: values.classroomId,
              startDate: values.date ? values.date.format('YYYY-MM-DD') : '',
              endDate: values.date ? values.date.format('YYYY-MM-DD') : '',
              startTime: values.startTime.format('HH:mm'),
              endTime: values.endTime.format('HH:mm'),
            }))
          } else {
            dispatch(editRepeatCourseArray({ ...reqBody, scheduleNo }))
          }
        } else {
          dispatch(addCourseArray(reqBody))
        }
      }
    })
  }

  _getCourseDetail = (scheduleId, scheduleNo) => {
    const { dispatch } = this.props
    if (scheduleId) {
      return dispatch(getCourseArrayDayDetail({ id: scheduleId }))
    } else {
      return dispatch(getCourseArrayDetail({ scheduleNo }))
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, orgId } = this.props
    const { scheduleNo, scheduleId } = this.state
    // dispatch(teacherList({ jobTitle: 1 }))
    dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
    dispatch(teacherList({ jobTitle: 1 }))
    if (scheduleNo) {
      this._getCourseDetail(scheduleId, scheduleNo).then(res => {
        dispatch(classroomList({ orgId: res.scheduleOrgId }))
        if (!scheduleId) {
          res && res.scheduleType === '2' && this.setState({ scheduleType: res.scheduleType })
        }
      })
      // dispatch(getRecordDetail({  }))
    } else {
      if (orgLevel) {
        dispatch(classroomList({ orgId }))
      }
      dispatch(createAction(COURSE_ARRAY_DETAIL)({}))
    }
  }

  _handleOrgChange = (value) => {
    this.props.dispatch(classroomList({ orgId: value }))
    this.props.form.setFieldsValue({ classroomId: '' })
  }

  getClassList = (page) => {
    const { dispatch } = this.props
    return dispatch(getClassList({
      classTo: {
        name: '',
        organizationId: '',
        classStatus: '',
        courseStartDate: '',
        courseEndDate: ''
      },
      currentPage: page || 1,
      pageSize: 10
    }))
  }

  _handleSelectClass = () => {
    const { form, dispatch } = this.props
    showModalWrapper((
      <ClassList
        dispatch={dispatch}
        selectRow={(selectedRows) => {
          form.setFieldsValue({ classId: selectedRows[0].id, className: selectedRows[0].name })
        }}
      />
    ), {
      title: '选择班级',
      width: '60%'
    })
  }

  _showModal = (title, index) => {
    const { classroomList, teacherList, form, dispatch, scheduleDetail } = this.props
    const dataSource = !scheduleDetail || isEmpty(scheduleDetail)
      ? [{}]
      : scheduleDetail
    if (form.getFieldValue('scheduleOrgId')) {
      showModalWrapper((
        <RepeatScheduleModal
          dataSource={dataSource[index] || {}}
          classroomList={classroomList}
          teacherList={teacherList}
          allLength={dataSource.length}
          dispatch={dispatch}
          index={index}
          setFieldsValue={form.setFieldsValue}
        />
      ), {
        title: title,
        width: '60%'
      })
    } else {
      message.info('请选择所属机构！')
    }
  }

  render() {
    const { dispatch, form, orgList, orgLevel, orgId, teacherList, classroomList, courseArrayDetail, scheduleDetail } = this.props
    const { scheduleType, scheduleNo } = this.state
    const { getFieldDecorator } = form
    return (
      <Form
        id='filter-form'
        onSubmit={this._handleSubmit}
        style={{ position: 'relative' }}
      >
        <Card
          title='课程记录'
          bodyStyle={{ padding: 10 }}
        >
          <Row
            justify='start'
            type='flex'
          >
            <Col span={scheduleNo ? 8 : 0}>
              <FormItem
                {...formItemLayout}
                label='批次号：'
              >
                {getFieldDecorator('scheduleNo', {
                  initialValue: courseArrayDetail.scheduleNo
                })(
                  <Input disabled={true} />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='班级名称：'
              >
                {getFieldDecorator('className', {
                  rules: [
                    { required: true, message: '请选择班级名称！' }
                  ],
                  initialValue: courseArrayDetail.scheduleClassName
                })(
                  <Input
                    disabled={true}
                    addonAfter={
                      <Icon
                        type='plus'
                        onClick={scheduleNo ? null : () => this._handleSelectClass()}
                      />
                    }
                  />
                )}
              </FormItem>
            </Col>
            <Col span={0}>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('classId', {
                  initialValue: courseArrayDetail.scheduleClassId
                })(
                  <Input />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='排课方式：'
              >
                {getFieldDecorator('scheduleType', {
                  rules: [
                    { required: true, message: '请选择排课方式！' }
                  ],
                  initialValue: courseArrayDetail.scheduleType || '1'
                })(
                  <Select
                    getPopupContainer={() => document.getElementById('filter-form')}
                    disabled={scheduleNo}
                    onChange={(value) => this.setState({ scheduleType: value })}
                  >
                    <Option value='1'>单次</Option>
                    <Option value='2'>多次</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='所属机构：'
              >
                {getFieldDecorator('scheduleOrgId', {
                  rules: [
                    { required: true, message: '请选择所属机构！' }
                  ],
                  initialValue: courseArrayDetail.scheduleOrgId || (orgLevel + '' === '2' ? orgId : '')
                })(
                  <Select
                    placeholder='请选择所属机构'
                    disabled = {orgLevel + '' === '2' || scheduleNo}
                    style={{ width: '200px' }}
                    showSearch={true}
                    getPopupContainer={() => document.getElementById('filter-form')}
                    onChange={(value) => this._handleOrgChange(value)}
                  >
                    {
                      orgList.map((item) => {
                        return (
                          <Option
                            key={item.id}
                            value={item.id}
                          >
                            {item.orgName}
                          </Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card
          title='上课信息'
          bodyStyle={{ padding: 10 }}
          extra={
            <div>
              {scheduleType === '2' && scheduleDetail.filter(item => !isEmpty(item)).length > 0 && (
                <Icon
                  type='plus'
                  style={{ fontSize: 20, marginRight: 10, color: '#1890ff' }}
                  onClick={() => {
                    this._showModal('新增上课信息', scheduleDetail.length)
                  }}
                />
              )}
            </div>
          }
        >
          {scheduleType === '1' ? (
            <SingleSchedule
              form={form}
              getFieldDecorator={getFieldDecorator}
              teacherList={teacherList}
              classroomList={classroomList}
              dataSource={!scheduleDetail || isEmpty(scheduleDetail)
                ? {}
                : scheduleDetail[0]}
            />
          ) : (
            <RepeatSchedule
              dispatch={dispatch}
              getFieldDecorator={getFieldDecorator}
              teacherList={teacherList}
              classroomList={classroomList}
              showModal={(index) => this._showModal('编辑上课信息', index)}
              dataSource={!scheduleDetail || isEmpty(scheduleDetail)
                ? [{}]
                : scheduleDetail}
            />
          )}
        </Card>
        <FormItem className={styles['operate-btn-center']}>
          <Button
            type='primary'
            title='点击保存'
            loading={this.props.showBtnSpin}
            disabled={false}
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

const mapStateToProps = (state) => {
  return {
    orgList: state.courseArray.orgList,
    orgLevel: state.courseArray.orgLevel,
    orgId: state.courseArray.orgId,
    teacherList: state.courseArray.teacherList || [],
    classroomList: state.courseArray.classroomList || [],
    courseArrayDetail: state.courseArray.courseArrayDetail,
    scheduleDetail: state.courseArray.scheduleDetail,
    showBtnSpin: state.common.showButtonSpin,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CourseArrayForm))
