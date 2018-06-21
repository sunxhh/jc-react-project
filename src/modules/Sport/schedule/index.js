import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Table, Button, Input, Form, Select, Popconfirm, DatePicker, message, Icon, Tooltip, Popover } from 'antd'
import { connect } from 'react-redux'

import {
  getScheduleList,
  deleteSchedule,
  deleteRepeatSchedule,
  // addRoom,
  // modifyRoom,
} from './reduck'
import {
  queryOrg,
} from '../../../global/action'
import {
  courseModalList,
  jobList,
  classRoomList,
  courseList
} from '../reduck'
import styles from './schedule.less'
import * as urls from 'Global/urls'
import { isEmpty } from '../../../utils/lang'
import parmasUtil from '../../../utils/params'
import storage from '../../../utils/storage'
import { sportUrl } from '../../../config'
import SelectForSearch from './SelectForSearch'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class ScheduleList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  columns = [
    {
      key: 'scheduleNo',
      title: '排课编号',
      dataIndex: 'scheduleNo',
      width: 90,
      fixed: 'left'
    },
    {
      key: 'scheduleBatchNo',
      title: '课程批次',
      dataIndex: 'scheduleBatchNo'
    },
    {
      key: 'courseModeName',
      title: '课程模式',
      dataIndex: 'courseModeName',
    },
    {
      key: 'courseName',
      title: '课程名称',
      dataIndex: 'courseName'
    },
    {
      key: 'takeCourseTime',
      title: '上课时间',
      dataIndex: 'takeCourseTime',
      render: (text, record) => (
        <span>{record.beginDate + ' ' + record.beginTime + '-' + record.endTime}</span>
      )
    },
    {
      key: 'signupNumber',
      title: '允许预约人数',
      dataIndex: 'signupNumber'
    },
    {
      key: 'hasSignupNumber',
      title: '已预约人数',
      dataIndex: 'hasSignupNumber',
      render: (text, record) => {
        const { auths } = this.props
        if (auths[urls.SPORT_SCHEDULE_SUBSCRIBE] && !isEmpty(auths[urls.SPORT_SCHEDULE_SUBSCRIBE]) && parseInt(text) > 0) {
          return (
            <Link
              target='_blank'
              to={urls.SPORT_SCHEDULE_SUBSCRIBE + '?scheduleNo=' + record.scheduleNo}
            >{text}</Link>
          )
        } else {
          return (
            <span>{text}</span>
          )
        }
      }
    },
    {
      key: 'roomName',
      title: '教室',
      dataIndex: 'roomName'
    },
    {
      key: 'teacherName',
      title: '教练',
      dataIndex: 'teacherName'
    },
    {
      key: 'perCourseTime',
      title: '每节课时',
      dataIndex: 'perCourseTime'
    },
    {
      key: 'courseStrength',
      title: '运动强度',
      dataIndex: 'courseStrength',
      render: (text) => (
        <span>{'⭐'.repeat(text)}</span>
      )
    },
    {
      key: 'status',
      title: '报名状态',
      dataIndex: 'status',
      render: text => (
        <span>{text + '' === '1' ? '开启' : '停止'}</span>
      )
    },
    {
      key: 'secondOrganizationName',
      title: '所属机构',
      dataIndex: 'secondOrganizationName'
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 110,
      fixed: 'right'
    },
    {
      key: 'conflictDescription',
      title: '冲突原因',
      dataIndex: 'conflictDescription',
      fixed: 'right',
      render: (text) => (
        <Popover
          placement='topRight'
          content={<div>{text && text !== 'null' && text}</div>}
          title='冲突原因'
        >
          <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
        </Popover>
      )
    },
  ]

  rowSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }

  componentWillMount() {
    const { dispatch, list, preRouter } = this.props
    if (isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SPORT_SCHEDULE_LIST))) {
      dispatch(getScheduleList({ currentPage: 1, pageSize: 10 }))
    }
    dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }})).then(res => {
      if (res && res.myOrgLevel === '2') {
        dispatch(jobList({ organizationId: res.myOrgId }))
        dispatch(classRoomList({ organizationId: res.myOrgId }))
      } else {
        dispatch(jobList({}))
        dispatch(classRoomList({}))
      }
    })
    dispatch(courseModalList({ type: 'courseMode' }))
    dispatch(courseList({}))
    // if () {

    // }
  }

  _onPaginationChange = page => {
    const { filter } = this.props
    this.props.dispatch(getScheduleList({ ...filter, currentPage: this.props.page.pageSize === page.pageSize ? page.current : 1, pageSize: page.pageSize }))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleSearch = () => {
    const { filter, dispatch, form } = this.props
    const values = form.getFieldsValue()
    const searchBody = {
      organizationId: values.organizationId,
      courseMode: values.courseMode,
      teacherNo: values.teacherNo,
      isConflict: values.isConflict,
      roomNo: values.roomNo,
      takeCourseBeginTime: values.courseDate && !isEmpty(values.courseDate) ? values.courseDate[0].format('YYYY-MM-DD') : '',
      takeCourseEndTime: values.courseDate && !isEmpty(values.courseDate) ? values.courseDate[1].format('YYYY-MM-DD') : '',
      batchNo: values.batchNo,
      courseNo: values.courseNo,
      scheduleNo: values.scheduleNo,
      currentPage: 1,
      pageSize: filter.pageSize
    }
    dispatch(getScheduleList(searchBody))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleDelete = (selectedRows) => {
    const row = selectedRows[0]
    if (parseInt(row.hasSignupNumber) > 0) {
      message.warn('已有客户预约，不可删除课程。')
      return
    }
    const { dispatch, filter } = this.props
    dispatch(deleteSchedule({ scheduleNoList: [row.scheduleNo] })).then(res => {
      res && dispatch(getScheduleList(filter)) && this.setState({ selectedRows: [], selectedRowKeys: [] })
    })
  }

  _handleRepeatDelete = (selectedRows) => {
    const row = selectedRows[0]
    if (parseInt(row.isOrder) > 0) {
      message.warn('已有客户预约，不可删除课程。')
      return
    }
    const { dispatch, filter } = this.props
    dispatch(deleteRepeatSchedule({ batchNo: row.scheduleBatchNo })).then(res => {
      res && dispatch(getScheduleList(filter)) && this.setState({ selectedRows: [], selectedRowKeys: [] })
    })
  }

  _handleExport = (e) => {
    e.preventDefault()
    const { filter } = this.props
    const params = parmasUtil.json2url({ ...filter, exportType: 1 })
    const ticket = storage.get('userInfo').ticket
    const url = (sportUrl === '/') ? `http://${location.host}` : sportUrl
    let href = `${url}/api/schedule/course/v1/list/export?ticket=${ticket}&${params}`
    location.href = href
  }

  _orgChange = value => {
    this.props.dispatch(classRoomList({ organizationId: value }))
    this.props.dispatch(jobList({ organizationId: value }))
    this.props.form.setFieldsValue({ roomNo: '', teacherNo: '' })
  }

  _handleCourseModeChange = value => {
    this.props.dispatch(courseList({ courseMode: value }))
    this.props.form.setFieldsValue({ courseNo: '' })
  }

  _handleSubscribe = e => {
    const { selectedRows } = this.state
    if (selectedRows[0].status + '' === '2') {
      message.error('课程报名已停止，不能预约')
      return
    } else if (parseInt(selectedRows[0].conflictNumber) > 0) {
      message.error('有冲突的排课，不能预约')
      return
    }
    this.props.history.push(urls.SPORT_SCHEDULE_LIST_SUBSCRIBE + '?scheduleNo=' + selectedRows[0].scheduleNo)
  }

  render() {
    const { page, list, form, filter, auths, match, history, courseModal, orgLevel, orgList, orgId, classRoomAllList, courseAllList, jobList, showListSpin } = this.props
    const path = match.path
    const { selectedRows, selectedRowKeys } = this.state
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.rowSelect,
      type: 'radio',
      getCheckboxProps: record => ({
        disabled: authState.indexOf('edit') === -1 && authState.indexOf('delete') === -1
      })
    }
    const { getFieldDecorator } = form
    const selectedRowsLength = selectedRowKeys.length
    const pagination = genPagination(page)

    return (
      <div>
        <div className={styles['search']}>
          <Form
            layout='inline'
            id='filter-form'
            style={{ position: 'relative' }}
          >
            <FormItem
              label='所属机构'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('organizationId', {
                initialValue: orgLevel === '2'
                  ? orgId
                  : (filter.organizationId || ''),
              })(
                <SelectForSearch
                  placeholder='全部'
                  disabled = {orgLevel === '2'}
                  style={{ width: '200px' }}
                  showSearch={true}
                  allowClear={true}
                  getPopupContainer={() => document.getElementById('filter-form')}
                  onChange={(value) => this._orgChange(value)}
                  options={orgList}
                  optionsValueLabel={{ label: 'orgName', value: 'id' }}
                  showAllOption={true}
                />
              )}
            </FormItem>
            <FormItem
              label='课程模式'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('courseMode', {
                initialValue: filter.courseMode || ''
              })(
                <Select
                  allowClear={true}
                  placeholder='全部'
                  style={{ width: '200px' }}
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
            <FormItem
              label='课程名称'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('courseNo', {
                initialValue: filter.courseNo || ''
              })(
                <SelectForSearch
                  placeholder='全部'
                  style={{ width: '200px' }}
                  showSearch={true}
                  allowClear={true}
                  getPopupContainer={() => document.getElementById('filter-form')}
                  options={courseAllList}
                  optionsValueLabel={{ label: 'courseName', value: 'courseNo' }}
                  showAllOption={true}
                />
              )}
            </FormItem>
            <FormItem
              label='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;教练'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('teacherNo', {
                initialValue: filter.teacherNo || ''
              })(
                <SelectForSearch
                  placeholder='全部'
                  style={{ width: '200px' }}
                  showSearch={true}
                  allowClear={true}
                  getPopupContainer={() => document.getElementById('filter-form')}
                  options={jobList}
                  optionsValueLabel={{ label: 'fullName', value: 'uuid' }}
                  showAllOption={true}
                />
              )}
            </FormItem>
            <FormItem
              label={
                <span>
                  是否冲突&nbsp;
                  <Tooltip
                    placement='rightTop'
                    title={
                      <div>
                        <span>冲突说明：</span><br />
                        <span>1.私教课，同一天，同一个教练排了两次私教课，会冲突。</span><br />
                        <span>2. 小团课和公开课，同一教练在同一天有2个时间交叉或重合的排课，同一个教室，在同一天有2个时间交叉或重合的排课。</span><br />
                        <span>3. 有冲突的排课，不能预约。</span>
                      </div>
                    }
                  >
                    <Icon type='exclamation-circle' style={{ fontSize: 12, color: '#ff0000' }} />
                  </Tooltip>
                </span>
              }
              className={styles['search-form-item']}
            >
              {getFieldDecorator('isConflict', {
                initialValue: filter.isConflict || ''
              })(
                <Select
                  allowClear={true}
                  placeholder='全部'
                  style={{ width: 186 }}
                  getPopupContainer={() => document.getElementById('filter-form')}
                >
                  <Option
                    key='-1'
                    value=''
                  >全部
                  </Option>
                  <Option
                    key='1'
                    value='1'
                  >是
                  </Option>
                  <Option
                    key='2'
                    value='2'
                  >否
                  </Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              label='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;教室'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('roomNo', {
                initialValue: filter.roomNo || ''
              })(
                <SelectForSearch
                  placeholder='全部'
                  style={{ width: '200px' }}
                  showSearch={true}
                  allowClear={true}
                  getPopupContainer={() => document.getElementById('filter-form')}
                  options={classRoomAllList}
                  optionsValueLabel={{ label: 'roomName', value: 'roomNo' }}
                  showAllOption={true}
                />
              )}
            </FormItem>
            <FormItem
              label='排课编号'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('scheduleNo', {
                initialValue: filter.scheduleNo,
              })(
                <Input
                  placeholder='请输入排课编号'
                  style={{ width: '200px' }}
                />
              )}
            </FormItem>
            <FormItem
              label='课程批次'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('batchNo', {
                initialValue: filter.batchNo,
              })(
                <Input
                  placeholder='请输入课程批次'
                  style={{ width: '200px' }}
                />
              )}
            </FormItem>
            <FormItem
              label='上课日期'
            >
              {getFieldDecorator('courseDate', {
                initialValue: filter.takeCourseBeginTime && filter.takeCourseEndTime
                  ? [moment(filter.takeCourseBeginTime), moment(filter.takeCourseEndTime)]
                  : [],
              })(
                <RangePicker
                  showTime
                  style={{ width: '300px' }}
                  placeholder={['开始日期', '结束日期']}
                  getCalendarContainer={() => document.getElementById('filter-form')}
                />
              )}
            </FormItem>
          </Form>
        </div>
        <div className='operate-btn'>
          {authState.indexOf('subscribe') !== -1 && (
            <Button
              type='primary'
              disabled={selectedRowsLength !== 1}
              onClick={(e) => this._handleSubscribe(e)}
            >预约
            </Button>
          )}
          <Button
            type='primary'
            onClick={() => this._handleSearch()}
          >查询
          </Button>
          {authState.indexOf('add') !== -1 && (
            <Link className={styles.margeSpace} to={urls.SPORT_SCHEDULE_LIST_ADD}>
              <Button
                type='primary'
              >排课
              </Button>
            </Link>
          )}
          {authState.indexOf('edit') !== -1 && (
            <Link
              to={{
                pathname: `${urls.SPORT_SCHEDULE_LIST_EDIT}${isEmpty(selectedRows) ? '/' : '/' + selectedRows[0].scheduleNo}`,
                state: { isOrder: !isEmpty(selectedRows) && parseInt(selectedRows[0].hasSignupNumber) > 0 }
              }}
            >
              <Button
                type='primary'
                disabled={selectedRowsLength !== 1}
              >
                编辑单次
              </Button>
            </Link>
          )}
          {authState.indexOf('edit') !== -1 && (
            <Button
              type='primary'
              disabled={selectedRowsLength !== 1}
              onClick={() => {
                if (parseInt(selectedRows[0].isOrder) > 0) {
                  message.warn('已有客户预约，不可编辑课程。')
                } else {
                  history.push(`${urls.SPORT_SCHEDULE_LIST_EDIT_REPEAT}${isEmpty(selectedRows) ? '/' : '/' + selectedRows[0].scheduleBatchNo}`)
                }
              }}
            >
              编辑批次
            </Button>
          )}
          {authState.indexOf('delete') !== -1 && (
            <Popconfirm
              title={`确定要删除该条数据吗？`}
              onConfirm={() => this._handleDelete(selectedRows)}
            >
              <Button
                type='danger'
                disabled={selectedRowsLength < 1}
              >删除单次
              </Button>
            </Popconfirm>
          )}
          {authState.indexOf('delete') !== -1 && (
            <Popconfirm
              title={`确定要删除该条数据吗？`}
              onConfirm={() => this._handleRepeatDelete(selectedRows)}
            >
              <Button
                type='danger'
                disabled={selectedRowsLength < 1}
              >删除批次
              </Button>
            </Popconfirm>
          )}
          {authState.indexOf('export') !== -1 && (
            <Button
              type='primary'
              onClick={(e) => this._handleExport(e)}
            >Excel导出
            </Button>
          )}
        </div>
        <Table
          className={styles['c-table-center']}
          rowClassName={(record) => {
            return (parseInt(record.conflictNumber) > 0) ? styles['red-row'] : ''
          }}
          columns={this.columns}
          dataSource={list}
          rowKey='scheduleNo'
          rowSelection={rowSelection}
          onChange={this._onPaginationChange}
          scroll={{ x: 1800 }}
          loading={showListSpin}
          pagination={pagination}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    filter: state.sportSchedule.filter,
    list: state.sportSchedule.scheduleList,
    page: state.sportSchedule.schedulePage,
    courseModal: state.sportCommon.courseModal,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    orgList: state.common.orgList,
    orgLevel: state.common.orgLevel,
    orgId: state.common.orgId,
    classRoomAllList: state.sportCommon.classRoomAllList,
    courseAllList: state.sportCommon.courseAllList,
    jobList: state.sportCommon.jobList,
    preRouter: state.router.pre
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ScheduleList))

