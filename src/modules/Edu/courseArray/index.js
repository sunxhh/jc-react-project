import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Table, Button, Input, Form, Select, DatePicker, Popconfirm, Row, Col } from 'antd'
import { connect } from 'react-redux'
import {
  getCourseList,
  queryOrg,
  deleteRepeatDelete,
  deleteSingleDelete,
} from './reduck'
import styles from './courseArray.less'
import * as urls from 'Global/urls'
import { isEmpty } from '../../../utils/lang'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class CourseArray extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  columns = [
    {
      key: 'orgIndex',
      title: '序号',
      dataIndex: 'orgIndex',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        return (
          <span>{pageSize * pageNo + (index + 1) - pageSize}</span>
        )
      }
    },
    {
      key: 'scheduleNo',
      title: '批次号',
      dataIndex: 'scheduleNo'
    },
    {
      key: 'startTime',
      title: '上课时间',
      dataIndex: 'startTime',
      render: (text, record) => (
        <span>{text + ' ' + moment(record.endTime).format('HH:mm')}</span>
      )
    },
    {
      key: 'scheduleClassName',
      title: '班级名称',
      dataIndex: 'scheduleClassName'
    },
    {
      key: 'scheduleCourseName',
      title: '课程名称',
      dataIndex: 'scheduleCourseName'
    },
    {
      key: 'teacherName',
      title: '教师',
      dataIndex: 'teacherName',
    },
    {
      key: 'classroomName',
      title: '教室',
      dataIndex: 'classroomName',
    },
    {
      key: 'scheduleType',
      title: '排课方式',
      dataIndex: 'scheduleType',
      render: text => (
        <span>{text + '' === '1' ? '单次' : '多次'}</span>
      )
    },
    {
      key: 'scheduleOrgName',
      title: '所属机构',
      dataIndex: 'scheduleOrgName',
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
    }
  ]

  rowSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }

  componentWillMount() {
    const { dispatch } = this.props
    dispatch(getCourseList({ currentPage: 1 }))
    dispatch(queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
  }

  _onPaginationChange = page => {
    const { filter } = this.props
    this.props.dispatch(getCourseList({ ...filter, currentPage: page.current, pageSize: page.pageSize }))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleSearch = () => {
    const { filter, dispatch, form } = this.props
    const values = form.getFieldsValue()
    const searchBody = {
      currentPage: filter.currentPage,
      scheduleClassName: values.scheduleClassName,
      scheduleCourseName: values.scheduleCourseName,
      teacherName: values.teacherName,
      classroomName: values.classroomName,
      scheduleOrgId: values.scheduleOrgId,
      ifConflict: values.ifConflict,
      lessonStartDate: values.lessonDate && values.lessonDate.length > 1 ? values.lessonDate[0].format('YYYY-MM-DD') : '',
      lessonEndDate: values.lessonDate && values.lessonDate.length > 1 ? values.lessonDate[1].format('YYYY-MM-DD') : '',
    }
    dispatch(getCourseList(searchBody))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleRepeatDelete = (selectedRows) => {
    const { dispatch, filter } = this.props
    dispatch(deleteRepeatDelete({ scheduleNo: selectedRows[0].scheduleNo })).then(res => {
      res && dispatch(getCourseList(filter)) && this.setState({ selectedRows: [], selectedRowKeys: [] })
    })
  }

  _handleSingleDelete = (selectedRows) => {
    const { dispatch, filter } = this.props
    dispatch(deleteSingleDelete({ idList: selectedRows.map(item => item.id) })).then(res => {
      res && dispatch(getCourseList(filter)) && this.setState({ selectedRows: [], selectedRowKeys: [] })
    })
  }

  render() {
    const { page, list, form, orgList, filter, orgLevel, orgId, auths, match } = this.props
    const path = match.path
    const { selectedRows, selectedRowKeys } = this.state
    const authState = (isEmpty(auths) || isEmpty(auths[path])) ? [] : auths[path]
    const rowSelection = {
      selectedRowKeys,
      onChange: this.rowSelect,
      type: 'checkbox',
      getCheckboxProps: record => ({
        disabled: authState.indexOf('edit') === -1 && authState.indexOf('delete') === -1
      })
    }
    const { getFieldDecorator } = form
    const selectedRowsLength = selectedRows.length
    const scheduleTypeSingleLength = selectedRows.filter(item => item.scheduleType + '' === '1').length
    const scheduleTypeRepeatLength = selectedRowsLength - scheduleTypeSingleLength
    const isSameScheduleNo = selectedRowsLength > 0 && scheduleTypeRepeatLength > 0 &&
      selectedRows.filter((item, index, arr) => item.scheduleNo === arr[0].scheduleNo).length === selectedRowsLength
    // const isSingleScheduleNo = scheduleTypeSingleLength === 1 && scheduleTypeRepeatLength === 0
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
    }
    const pagination = genPagination(page)
    return (
      <div>
        <div className={styles['search']}>
          <Form
            id='filter-form'
            style={{ position: 'relative' }}
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='班级名称：'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('scheduleClassName', {
                    initialValue: '',
                  })(
                    <Input
                      placeholder='请输入班级名称'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='课程名称：'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('scheduleCourseName', {
                    initialValue: '',
                  })(
                    <Input
                      placeholder='请输入课程名称'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='教师：'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('teacherName', {
                    initialValue: '',
                  })(
                    <Input
                      placeholder='请输入教师名称'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='教室：'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('classroomName', {
                    initialValue: '',
                  })(
                    <Input
                      placeholder='请输入教室名称'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='是否冲突：'
                >
                  {getFieldDecorator('ifConflict', {
                    initialValue: '',
                  })(
                    <Select
                      placeholder='请选择是否冲突'
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
                        key='0'
                        value='0'
                      >否
                      </Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='所属机构：'
                >
                  {getFieldDecorator('scheduleOrgId', {
                    initialValue: orgLevel === '2'
                      ? orgId
                      : (filter.schedule && filter.schedule.scheduleOrgId || ''),
                  })(
                    <Select
                      placeholder='请选择所属机构'
                      disabled = {orgLevel === '2'}
                      showSearch={true}
                      getPopupContainer={() => document.getElementById('filter-form')}
                    >
                      <Select.Option
                        key='-1'
                        value=''
                      >全部
                      </Select.Option>
                      {
                        orgList.map((item) => {
                          return (
                            <Select.Option
                              key={item.id}
                              value={item.id}
                            >
                              {item.orgName}
                            </Select.Option>
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
                  label='上课时间：'
                >
                  {getFieldDecorator('lessonDate', {
                    initialValue: [],
                  })(
                    <RangePicker
                      style={{ width: '300px' }}
                      format='YYYY-MM-DD'
                      placeholder={['上课开始时间', '上课结束时间']}
                      getCalendarContainer={() => document.getElementById('filter-form')}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Form>
        </div>
        <div className='operate-btn'>
          <Button
            type='primary'
            onClick={() => this._handleSearch()}
          >查询
          </Button>
          {authState.indexOf('add') !== -1 && (
            <Link to={urls.EDU_COURSE_ARRAY_ADD}>
              <Button
                style={{ marginRight: 10 }}
                type='primary'
              >排班
              </Button>
            </Link>
          )}
          {authState.indexOf('edit') !== -1 && (
            <Link to={`${urls.EDU_COURSE_ARRAY_EDIT}${isEmpty(selectedRows) ? '/' : '/' + selectedRows[0].scheduleNo}/${isEmpty(selectedRows) ? '' : selectedRows[0].id}`}>
              <Button
                style={{ marginRight: 10 }}
                type='primary'
                disabled={selectedRowsLength !== 1}
              >
                编辑单次
              </Button>
            </Link>
          )}
          {authState.indexOf('edit') !== -1 && (
            <Link to={`${urls.EDU_COURSE_ARRAY_EDIT}/${isEmpty(selectedRows) ? '' : selectedRows[0].scheduleNo}`}>
              <Button
                type='primary'
                disabled={!isSameScheduleNo}
              >
                编辑多次
              </Button>
            </Link>
          )}
          {authState.indexOf('delete') !== -1 && (
            <Popconfirm
              title={`确定要删除该条数据吗？`}
              onConfirm={() => this._handleSingleDelete(selectedRows)}
            >
              <Button
                type='danger'
                disabled={selectedRowsLength < 1}
              >删除
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
                disabled={!isSameScheduleNo}
              >删除多次
              </Button>
            </Popconfirm>
          )}
        </div>
        <Table
          className={styles['c-table-center']}
          rowClassName={(record) => {
            return (record.ifConflict + '' === '0') ? '' : styles['red-row']
          }}
          columns={this.columns}
          dataSource={list}
          rowKey='id'
          rowSelection={rowSelection}
          pagination={pagination}
          onChange={this._onPaginationChange}
        />
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.courseArray.courseList,
    page: state.courseArray.coursePage,
    orgList: state.courseArray.orgList,
    orgLevel: state.courseArray.orgLevel,
    orgId: state.courseArray.orgId,
    filter: state.courseArray.filter,
    auths: state.common.auths
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CourseArray))
