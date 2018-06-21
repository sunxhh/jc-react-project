import React, { Component } from 'react'
// import moment from 'moment'
import { Table, Button, Input, Form, Select, DatePicker, Popconfirm } from 'antd'
import { connect } from 'react-redux'

import {
  getSubscribeList,
  cancelSub,
  // deleteCourse,
} from './reduck'
import {
  courseModalList,
  jobList,
  courseList, classRoomList
} from '../reduck'
import {
  queryOrg,
} from '../../../global/action'
import styles from './schedule.less'
import { isEmpty } from 'Utils/lang'
import parmasUtil from 'Utils/params'
import storage from 'Utils/storage'
import { sportUrl } from '../../../config'
import * as urls from 'Global/urls'
import SelectForSearch from './SelectForSearch'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const reservationSourceEnum = [
  { key: '-1', value: '', name: '全部' },
  { key: '1', value: '1', name: 'app预约' },
  { key: '2', value: '2', name: '后台预约' },
]

class Subscribe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduleNo: parmasUtil.url2json(location).scheduleNo,
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  columns = [
    {
      key: 'scheduleNo',
      title: '排课编号',
      dataIndex: 'scheduleNo',
    },
    {
      key: 'courseMode',
      title: '课程模式',
      dataIndex: 'courseMode',
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
    },
    {
      key: 'teacherName',
      title: '教练',
      dataIndex: 'teacherName'
    },
    {
      key: 'userId',
      title: '会员ID',
      dataIndex: 'userId'
    },
    {
      key: 'userName',
      title: '会员姓名',
      dataIndex: 'userName'
    },
    {
      key: 'sex',
      title: '性别',
      dataIndex: 'sex'
    },
    {
      key: 'age',
      title: '年龄',
      dataIndex: 'age'
    },
    {
      key: 'status',
      title: '预约状态',
      dataIndex: 'status'
    },
    {
      key: 'reservationSource',
      title: '预约来源',
      dataIndex: 'reservationSource'
    },
    {
      key: 'reservationTime',
      title: '预约时间',
      dataIndex: 'reservationTime'
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
    const { scheduleNo } = this.state
    dispatch(courseModalList({ type: 'courseMode' }))
    dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }})).then(res => {
      const subscribeListReqBody = { currentPage: 1, scheduleNo }
      if (res && res.myOrgLevel === '2') {
        dispatch(jobList({ organizationId: res.myOrgId }))
        subscribeListReqBody.organizationId = res.myOrgId
      } else {
        dispatch(jobList({}))
      }
      if (isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SPORT_SCHEDULE_SUBSCRIBE))) {
        dispatch(getSubscribeList(subscribeListReqBody))
      }
    })
    dispatch(courseList({}))
  }

  _onPaginationChange = page => {
    const { filter } = this.props
    this.props.dispatch(getSubscribeList({ ...filter, currentPage: this.props.page.pageSize === page.pageSize ? page.current : 1, pageSize: page.pageSize }))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleSearch = () => {
    const { filter, dispatch, form, courseAllList } = this.props
    const values = form.getFieldsValue()
    const courses = courseAllList.filter(item => item.courseNo === values.courseName)
    const searchBody = {
      currentPage: 1,
      organizationId: values.organizationId,
      courseMode: values.courseMode,
      courseName: courses.length > 0 ? courses[0].courseName : '',
      scheduleNo: values.scheduleNo,
      teacherNo: values.teacherNo,
      userName: values.userName,
      status: values.status,
      beginDate: values.courseDate && !isEmpty(values.courseDate) ? values.courseDate[0].format('YYYY-MM-DD') : '',
      endDate: values.courseDate && !isEmpty(values.courseDate) ? values.courseDate[1].format('YYYY-MM-DD') : '',
      pageSize: filter.pageSize,
      userId: values.userId,
      reservationSource: values.reservationSource
    }
    dispatch(getSubscribeList(searchBody))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleExport = (e) => {
    e.preventDefault()
    const { filter } = this.props
    const params = parmasUtil.json2url({ ...filter, exportType: 1 })
    const ticket = storage.get('userInfo').ticket
    const url = (sportUrl === '/') ? `http://${location.host}` : sportUrl
    let href = `${url}/api/reservation/v1/export?${params}&ticket=${ticket}`
    location.href = href
  }

  _orgChange = value => {
    this.props.dispatch(classRoomList({ organizationId: value }))
    this.props.dispatch(jobList({ organizationId: value }))
    this.props.form.setFieldsValue({ roomNo: '', teacherNo: '' })
  }

  _handleCourseModeChange = value => {
    this.props.dispatch(courseList({ courseMode: value }))
    this.props.form.setFieldsValue({ courseName: '' })
  }

  _handleCancel = (selectedRows) => {
    const { filter, dispatch } = this.props
    dispatch(cancelSub({ reservationIds: selectedRows.map(item => item.reservationId) })).then(res => {
      res && this.props.dispatch(getSubscribeList({ ...filter })) && this.setState({ selectedRows: [], selectedRowKeys: [] })
    })
  }

  render() {
    const { page, list, form, filter, auths, match, courseModal, orgLevel, orgId, orgList, courseAllList, jobList, showListSpin } = this.props
    const path = match.path
    const { selectedRowKeys, selectedRows } = this.state
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.rowSelect,
      type: 'checkbox',
      getCheckboxProps: record => ({
        disabled: authState.indexOf('cancel') === -1 && authState.indexOf('export') === -1
      })
    }
    const { getFieldDecorator } = form
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
                  placeholder='请选择课程模式'
                  style={{ width: '200px' }}
                  getPopupContainer={() => document.getElementById('filter-form')}
                  onChange={(value) => this._handleCourseModeChange(value)}
                >
                  <Select.Option
                    key='-1'
                    value=''
                  >全部
                  </Select.Option>
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
            <FormItem
              label='课程名称'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('courseName', {
                initialValue: filter.courseName || ''
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
              label='&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;会员'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('userName', {
                initialValue: filter.userName,
              })(
                <Input
                  placeholder='请输入会员'
                  style={{ width: '200px' }}
                />
              )}
            </FormItem>
            <FormItem
              label='&nbsp;&nbsp;&nbsp;&nbsp;会员ID'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('userId', {
                // TODO: userId还需要重新定义
                initialValue: filter.userId,
              })(
                <Input
                  placeholder='请输入会员ID'
                  style={{ width: '200px' }}
                />
              )}
            </FormItem>
            <FormItem
              label='预约状态'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('status', {
                initialValue: filter.status || ''
              })(
                <Select
                  placeholder='请选择预约状态'
                  style={{ width: '200px' }}
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
                  >预约成功
                  </Option>
                  <Option
                    key='3'
                    value='3'
                  >取消预约
                  </Option>
                </Select>
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
              label='上课日期'
            >
              {getFieldDecorator('courseDate', {
                initialValue: filter.courseDate || [],
              })(
                <RangePicker
                  style={{ width: '300px' }}
                  placeholder={['开始日期', '结束日期']}
                />
              )}
            </FormItem>
            <FormItem
              label='预约来源'
            >
              {getFieldDecorator('reservationSource', {
                initialValue: filter.reservationSource || '',
              })(
                <Select
                  placeholder='请选择预约来源'
                  style={{ width: '200px' }}
                  getPopupContainer={() => document.getElementById('filter-form')}
                >
                  {
                    reservationSourceEnum && reservationSourceEnum.map((item) => {
                      return (<Option key={item.key} value={item.value}>{item.name}</Option>)
                    })
                  }
                </Select>
              )}
            </FormItem>
          </Form>
        </div>
        <div className='operate-btn'>
          <Button
            type='primary'
            onClick={() => this._handleSearch()}
          >查询
          </Button>
          {authState.indexOf('cancel') !== -1 && (
            <Popconfirm
              title={`确认要取消预约吗？`}
              onConfirm={() => this._handleCancel(selectedRows)}
            >
              <Button
                type='danger'
                disabled={selectedRows.filter(item => item.status !== '取消预约').length < 1}
              >
                取消预约
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
          columns={this.columns}
          dataSource={list}
          rowKey='reservationId'
          rowSelection={rowSelection}
          onChange={this._onPaginationChange}
          loading={showListSpin}
          pagination={pagination}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    filter: state.sportSchedule.subscribeFilter,
    list: state.sportSchedule.subscribeList,
    page: state.sportSchedule.subscribePage,
    courseModal: state.sportCommon.courseModal,
    courseAllList: state.sportCommon.courseAllList,
    jobList: state.sportCommon.jobList,
    orgList: state.common.orgList,
    orgLevel: state.common.orgLevel,
    orgId: state.common.orgId,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    preRouter: state.router.pre
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Subscribe))

