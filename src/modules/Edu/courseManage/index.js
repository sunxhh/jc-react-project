import React, { Component } from 'react'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { Button, Popconfirm, Table, Form, Input, message, Row, Col, Select } from 'antd'
import {
  getCourseList,
  deleteList,
  updateSelectedCourseIds,
  updateDisabledFlag,
  getCourseModelList,
  getPayModelList,
  getCourseTypeList
} from './reduck'
import styles from './index.less'
import { isEmpty } from '../../../utils/lang'
import {
  EDU_COURSE_MANAGE_ADD,
  EDU_COURSE_MANAGE_EDIT
} from 'Global/urls'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class CourseList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRows: []
    }
  }

  static defaultProps = {
    list: [],
    idList: [],
    page: {
      pageNo: 1,
      pageSize: 20,
      records: 0,
      isLoading: false,
    },
  }

  _columns = [
    {
      key: 'key',
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        return (
          <span>{(pageNo - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'courseName',
      title: '课程名称',
      dataIndex: 'courseName',
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
    {
      key: 'courseModel',
      title: '课程模式',
      dataIndex: 'courseModel',
      render: (text) => (
        <span>{this._getCourseText(text)}</span>
      )
    },
    {
      key: 'courseType',
      title: '课程类别',
      dataIndex: 'courseType',
      render: (text) => (
        <span>{this._getCourseText(text, 'type')}</span>
      )
    },
    {
      key: 'standardFees',
      title: '学费标准',
      dataIndex: 'standardFees',
      render: (text, record) => (
        <span>{this._getStandardFees(record)}</span>
      )
    },
    {
      key: 'textbookPrice',
      title: '教材费',
      dataIndex: 'textbookPrice',
      render: (text) => (
        <span>{text && text !== 'null' && this._formatPrice(text)}</span>
      )
    },
    {
      key: 'updateTime',
      title: '更新时间',
      dataIndex: 'updateTime',
      width: 150,
      render: (text) => (
        <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'memo',
      title: '备注',
      dataIndex: 'memo',
      width: 150,
      render: (text) => {
        return (
          <Ellipsis
            length={15}
            tooltip={true}
          >
            {text || ''}
          </Ellipsis>)
      }
    }
  ]

  // 获取课程相关文案（根据数据字典）
  _getCourseText = (val, type) => {
    const { courseTypeList, courseModelList } = this.props
    let arr = (type === 'type' ? courseTypeList : courseModelList) || []
    if (!val && val === '') {
      return ''
    }
    const index = arr.findIndex((data) => {
      return data.value === val
    })
    return index !== -1 ? arr[index].name : ''
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(getCourseList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      course: { ...arg },
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    this._getList(page.current, page.pageSize)
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 点击删除
  _handleDelete = () => {
    const { idList, dispatch } = this.props
    dispatch(deleteList({ idList }, this._getParameter(1)))
  }

  // 编辑时必须要选一个用户
  _handleEdit = () => {
    const { idList, dispatch, history } = this.props
    if (idList.length === 1) {
      history.push(`${EDU_COURSE_MANAGE_EDIT}/${idList[0]}`)
    } else {
      dispatch(updateDisabledFlag(true))
      message.error('请选择一个课程', 3, () => dispatch(updateDisabledFlag(false)))
    }
  }

  // 列表复选框事件
  _onSelectChange = (selectedRowKeys, selectedRows) => {
    const { dispatch } = this.props
    this.setState({ selectedRows })
    dispatch(updateSelectedCourseIds(selectedRowKeys))
  }

  // 获取学费标准
  _getStandardFees = (record) => {
    const str = `${this._formatPrice(record.standardFees)} ${record.unit || ''}`
    if (isEmpty(record.courseTimeTotal)) {
      return str
    } else {
      return `${str}(${this._formatNum(record.courseTimeTotal)}课时)`
    }
  }

  // 格式化价格
  _formatPrice(x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    f = Math.round(x * 100) / 100
    return f
  }

  // 格式化数字
  _formatNum(x) {
    let f = parseFloat(x)
    if (isNaN(f)) {
      return ''
    }
    f = Math.round(x * 10) / 10
    return f
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    this._getList(1)
    dispatch(getCourseTypeList())
    dispatch(getCourseModelList())
    dispatch(getPayModelList())
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { list, idList, showListSpin, page, courseTypeList, match, auths } = this.props
    const authState = (isEmpty(auths) || isEmpty(auths[match.path])) ? [] : auths[match.path]
    const rowSelection = {
      selectedRowKeys: idList,
      onChange: this._onSelectChange,
    }
    const pagination = genPagination(page)
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowUser'>
            <Col span={6}>
              <FormItem
                label='课程名称：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                {getFieldDecorator('courseName')(
                  <Input
                    type='text'
                    placeholder='请输入课程名称'
                    maxLength={50}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='课程类别：'
                className={styles['form-item']}
                {...formItemLayout}
              >
                {getFieldDecorator('courseType')(
                  <Select
                    allowClear
                    optionLabelProp='title'
                    filterOption={false}
                    placeholder='请选择课程类别'
                    getPopupContainer={() => document.getElementById('rowUser')}
                  >
                    {!isEmpty(courseTypeList) ? courseTypeList.map(d => (
                      <SelectOption
                        key={d.value}
                        value={d.value}
                        title={d.name}
                      >
                        {d.name}
                      </SelectOption>
                    )) : null}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <div className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  authState.indexOf('add') !== -1 &&
                  <Link to={EDU_COURSE_MANAGE_ADD}>
                    <Button
                      type='primary'
                      title='点击新增'
                    >
                      新增
                    </Button>
                  </Link>
                }
                {
                  authState.indexOf('edit') !== -1 &&
                  <Button
                    type='primary'
                    title='点击编辑'
                    disabled={idList.length !== 1}
                    onClick={this._handleEdit}
                  >
                    编辑
                  </Button>
                }
                {
                  authState.indexOf('delete') !== -1 &&
                  <Popconfirm
                    title='确定要删除吗？'
                    onConfirm={() => this._handleDelete()}
                  >
                    <Button
                      disabled={idList.length > 0 ? 0 : 1}
                      className={styles['f-right']}
                      type='danger'
                      title='点击删除'
                    >删除
                    </Button>
                  </Popconfirm>
                }
              </div>
            </Col>
          </Row>
        </Form>
        <Table
          className={styles['c-table-center']}
          columns={this._columns}
          rowKey='id'
          dataSource={list}
          rowSelection={rowSelection}
          loading={showListSpin}
          pagination={pagination}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.eduCourse.courseList,
    page: state.eduCourse.page,
    idList: state.eduCourse.idList,
    showListSpin: state.common.showListSpin,
    courseModelList: state.eduCourse.courseModelList,
    payModelList: state.eduCourse.payModelList,
    courseTypeList: state.eduCourse.courseTypeList,
    auths: state.common.auths
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CourseList))
