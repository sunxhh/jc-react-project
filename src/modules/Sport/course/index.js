import React, { Component } from 'react'
// import moment from 'moment'
import { Link } from 'react-router-dom'
import { Table, Button, Input, Form, Select, Popconfirm, Row, Col } from 'antd'
import { connect } from 'react-redux'

import {
  getCourseList,
  deleteCourse,
} from './reduck'
import {
  courseModalList,
} from '../reduck'
import styles from './course.less'
import * as urls from 'Global/urls'
import { isEmpty } from '../../../utils/lang'
import parmasUtil from '../../../utils/params'
import { sportUrl } from '../../../config'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const courseMode = {
  'S': '私教课',
  'T': '小团课',
  'P': '公开课',
}

class Course extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: [],
      selectedRowKeys: [],
    }
  }

  columns = [
    {
      key: 'courseNo',
      title: '课程编号',
      dataIndex: 'courseNo',
    },
    {
      key: 'courseName',
      title: '课程名称',
      dataIndex: 'courseName'
    },
    {
      key: 'courseMode',
      title: '课程模式',
      dataIndex: 'courseMode',
      render: (text) => (
        <span>{courseMode[text]}</span>
      )
    },
    {
      key: 'courseCategory',
      title: '课程类别',
      dataIndex: 'courseCategory'
    },
    {
      key: 'singleTime',
      title: '单节时间',
      dataIndex: 'singleTime',
      render: (text) => (
        <span>{text + '分钟'}</span>
      )
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
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime'
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      render: (text) => {
        return (
          <Ellipsis
            length={15}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>)
      }
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
    if (isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SPORT_COURSE))) {
      dispatch(getCourseList({ currentPage: 1 }))
    }
    dispatch(courseModalList({ type: 'courseMode' }))
  }

  _onPaginationChange = page => {
    const { filter } = this.props
    this.props.dispatch(getCourseList({ ...filter, currentPage: this.props.page.pageSize === page.pageSize ? page.current : 1, pageSize: page.pageSize }))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleSearch = () => {
    const { filter, dispatch, form } = this.props
    const values = form.getFieldsValue()
    const searchBody = {
      currentPage: 1,
      courseName: values.courseName,
      courseMode: values.courseMode,
      pageSize: filter.pageSize
    }
    dispatch(getCourseList(searchBody))
    this.setState({ selectedRows: [], selectedRowKeys: [] })
  }

  _handleDelete = (selectedRows) => {
    const { dispatch, filter } = this.props
    dispatch(deleteCourse({ courseNo: selectedRows[0].courseNo })).then(res => {
      res && dispatch(getCourseList(filter)) && this.setState({ selectedRows: [], selectedRowKeys: [] })
    })
  }

  _handleExport = (e) => {
    e.preventDefault()
    const { filter } = this.props
    const params = parmasUtil.json2url({ ...filter, exportType: 1 })
    const url = (sportUrl === '/') ? `http://${location.host}` : sportUrl
    let href = `${url}/api/fitness/course/v1/export?${params}`
    location.href = href
  }

  render() {
    const { page, list, form, filter, auths, match, courseModal, showListSpin } = this.props
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
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const pagination = genPagination(page)
    return (
      <div>
        <div className={styles['search']}>
          <Form
            className='search-form'
            id='filter-form'
            style={{ position: 'relative' }}
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='课程名称'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('courseName', {
                    initialValue: filter.courseName,
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
                  label='课程模式'
                  className={styles['search-form-item']}
                >
                  {getFieldDecorator('courseMode', {
                    initialValue: filter.courseMode || ''
                  })(
                    <Select
                      placeholder='全部'
                      allowClear={true}
                      getPopupContainer={() => document.getElementById('filter-form')}
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
              </Col>
              <Col span={12}>
                <div className={styles['operate-btn']}>
                  <Button
                    type='primary'
                    onClick={() => this._handleSearch()}
                  >查询
                  </Button>
                  {authState.indexOf('add') !== -1 && (
                    <Button
                      type='primary'
                    >
                      <Link to={urls.SPORT_COURSE_ADD}>新增</Link>
                    </Button>
                  )}
                  {authState.indexOf('edit') !== -1 && (
                    <Button
                      type='primary'
                      disabled={selectedRowsLength !== 1}
                    >
                      <Link to={`${urls.SPORT_COURSE_EDIT}${isEmpty(selectedRows) ? '/' : '/' + selectedRows[0].courseNo}`}>编辑</Link>
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
                      >删除
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
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          className={styles['c-table-center']}
          columns={this.columns}
          dataSource={list}
          rowKey='id'
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
    filter: state.sportCourse.filter,
    list: state.sportCourse.courseList,
    page: state.sportCourse.coursePage,
    courseModal: state.sportCommon.courseModal,
    auths: state.common.auths,
    preRouter: state.router.pre,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Course))

