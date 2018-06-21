/**
 * author yanchong
 *
 * This is class set list components
 */

import React, { Component } from 'react'
import { Form, Table, Input, Button, Popconfirm, Popover, Select, DatePicker, Divider } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'

import * as actions from './reduck'
import styles from './style.less'
import {
  EDU_CLASS_MANAGE_DETAIL,
  EDU_CLASS_MANAGE_ADD,
  EDU_CLASS_MANAGE_EDIT
} from 'Global/urls'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const { Item: FormItem } = Form
const RangePicker = DatePicker.RangePicker

const enrolmentStatus = {
  '0': '全部',
  '1': '开启',
  '2': '关闭',
}

const repeatDate = {
  '1': '星期一',
  '2': '星期二',
  '3': '星期三',
  '4': '星期四',
  '5': '星期五',
  '6': '星期六',
  '7': '星期日',
}

class ClassManage extends Component {
  _columns = [{
    title: '序号',
    fixed: 'left',
    dataIndex: 'rowNo',
    key: 'rowNo',
    // width: 80,
    render: (text, record, index) => {
      const { pageSize, pageNo } = this.props.pagination
      return (
        <span>{
          pageSize *
          pageNo +
          (index + 1) -
          pageSize
        }
        </span>
      )
    }
  }, {
    title: '班级名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    render: (text, record) => {
      return (
        <Popover
          content = {<div className={styles['pop']}>{text}</div>}
          title = '班级名称'
        >
          <Link to={`${EDU_CLASS_MANAGE_DETAIL}?classId=${record.id}`}>
            {text && text.length > 10 ? `${text.substring(0, 10)}...` : text}
          </Link>
        </Popover>)
    }
  }, {
    title: '报名人数',
    dataIndex: 'inCount',
    key: 'inCount',
    width: 100,
  }, {
    title: '预招人数',
    dataIndex: 'planStudentCount',
    key: 'planStudentCount',
    width: 100,
  }, {
    title: '课程名称',
    dataIndex: 'courseName',
    key: 'courseName',
    width: 150,
    render: (text) => {
      return (
        <Popover
          content = {<div className={styles['pop']}>{text}</div>}
          title = '课程名称'
        >
          <span>{text && text.length > 6 ? `${text.substring(0, 6)}...` : text}</span>
        </Popover>)
    },
  }, {
    title: '所属机构',
    dataIndex: 'orgName',
    key: 'orgName',
    width: 150,
    render: (text) => {
      return (
        <Ellipsis
          length={6}
          tooltip={true}
        >
          {text || ''}
        </Ellipsis>)
    }
  }, {
    title: '招生状态',
    dataIndex: 'classStatus',
    key: 'classStatus',
    width: 100,
    render: (key) => {
      return <span>{enrolmentStatus[key]}</span>
    }
  }, {
    title: '开课日期',
    dataIndex: 'courseStartDate',
    key: 'courseStartDate',
    width: 150,
  }, {
    title: '上课时段',
    dataIndex: 'courseStartTime',
    key: 'courseStartTime',
    width: 150,
    render: (text, row) => {
      return (
        <span>
          {text && `${text} - ${row.courseEndTime}`}
        </span>)
    }
  }, {
    title: '重复设置',
    dataIndex: 'repeatDate',
    key: 'repeatDate',
    width: 150,
    render: (text) => {
      const repeatDateArray = text && text.map((key) => repeatDate[key]).join(',')
      return (
        <Ellipsis
          length={7}
          tooltip={true}
        >
          {repeatDateArray || ''}
        </Ellipsis>
      )
    },
  }, {
    title: '教师',
    dataIndex: 'teacherName',
    key: 'teacherName',
    width: 100,
  }, {
    title: '教室',
    dataIndex: 'classRoomName',
    key: 'classRoomName',
    width: 150,
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 180,
    render: (text) => (
      <span>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</span>
    )
  }, {
    title: '备注',
    dataIndex: 'mark',
    key: 'mark',
    render: (text) => {
      return (
        <Ellipsis
          length={15}
          tooltip={true}
        >
          {text || ''}
        </Ellipsis>)
    }
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    width: 120,
    fixed: 'right',
    render: (text, row) => {
      const { auths, match } = this.props
      const btnRole = auths[match.path] ? auths[match.path] : []
      return (
        <span>
          {
            btnRole.includes('edit') && (
              <Link
                to={`${EDU_CLASS_MANAGE_EDIT}?id=${row.id}`}
              >
                编辑
              </Link>
            )
          }
          <Divider type='vertical' />
          {
            btnRole.includes('delete') && (
              <Popconfirm
                title={`确定要删除（${row.name}）吗?`}
                onConfirm={() => this._handleDel(row.id)}
                okText='确定'
                cancelText='取消'
              >
                <a href='javascript:void(0);'>删除</a>
              </Popconfirm>)
          }
        </span>)
    }
  }]

  // 设置 props 默认值
  static defaultProps = {
    list: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: '20',
    },
    loading: true,
    showAddModal: false,
    showEditModal: false,
    detail: {
      classRoomName: undefined,
      orgId: undefined,
      memo: undefined,
    },
    okLoading: false,
    orgList: [],
    orgId: '',
    orgLevel: '',
    selectedRowKeys: [],
    initQueryPar: {
      name: '',
      organizationId: '',
      classStatus: '0',
      courseStartDate: [],
    },
  };

  // 初始化表格数据
  componentDidMount = () => {
    this._handleAction()
    const { dispatch } = this.props
    dispatch(actions.queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
  }

  // 组件销毁时， 重置此组建列表数据为[]，减少内存不 必要的开销。
  componentWillUnmount() {
    if (location.pathname !== '/classManage/edit' && location.pathname !== '/classManage/add') {
      this._willUnmountQueryArgData()
      this._willUnmountListData()
    }
  }

  _willUnmountQueryArgData = () => {
    const { dispatch } = this.props
    dispatch(actions.setQueryPar({
      name: '',
      organizationId: '',
      classStatus: '0',
      courseStartDate: [],
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(actions.getListAction({
      list: [],
      pagination: {
        currentPage: 1,
        totalCount: 0,
        pageSize: '20',
      },
    }))
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = (current = this.props.pagination.pageNo, pageSize = this.props.pagination.pageSize) => {
    const { dispatch, form } = this.props
    const formData = form.getFieldsValue()
    dispatch(actions.setQueryPar(formData))
    return {
      classTo: formData,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 发起列表查询的 ACTION
  _handleAction = (page, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(page, pageSize)
    dispatch(actions.getList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = (e) => {
    const { dispatch } = this.props
    dispatch(actions.setSelectedRowKeys([]))
    this._handleAction(1)
  }

  // 点击分页时获取表格数据
  _handlePagination = (page) => {
    if (page.pageSize === this.props.pagination.pageSize) {
      this._handleAction(page.current, page.pageSize)
    } else {
      this._handleAction(1, page.pageSize)
    }
  }

  // 编辑的 modal 初始化
  _showEditClassroom = (id) => {
    const { dispatch } = this.props
    dispatch(actions.showEditModalAction(true))
    dispatch(actions.detail({ 'id': id }))
  }

  // 删除
  _handleDel = (id) => {
    const length = this.props.list.length
    if (length > 1) {
      this.props.dispatch(actions.del({ 'idList': [id] }, this._getQueryParameter()))
    } else if (length === 1) {
      let page = Number(this.props.pagination.pageNo)
      const current = page > 1 ? Number(this.props.pagination.pageNo) - 1 : 1
      this.props.dispatch(actions.del({ 'idList': [id] }, this._getQueryParameter(current)))
    }
  }

  _heandleDels = () => {
    const { selectedRowKeys } = this.props
    if (selectedRowKeys.length === this.props.list.length) {
      let page = Number(this.props.pagination.pageNo)
      const current = page > 1 ? Number(this.props.pagination.pageNo) - 1 : 1
      this.props.dispatch(actions.del({ 'idList': selectedRowKeys }, this._getQueryParameter(current)))
      return
    }
    this.props.dispatch(actions.del({ 'idList': selectedRowKeys }, this._getQueryParameter()))
  }

  _onSelectChange = (ids) => {
    const { dispatch } = this.props
    dispatch(actions.setSelectedRowKeys(ids))
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  // 组件 jsx 的编写
  render() {
    const { getFieldDecorator } = this.props.form
    const _rowSelection = {
      selectedRowKeys: this.props.selectedRowKeys,
      onChange: this._onSelectChange,
    }
    const { auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    const pagination = genPagination(this.props.pagination)
    return (
      <div className={styles['common-table']}>
        <div className='search-form'>
          <Form
            layout='inline'
          >
            <FormItem
              label='班级名称：'
              className={styles['search-form-item']}
            >
              {getFieldDecorator('name', {
                initialValue: this.props.initQueryPar.name,
              })(
                <Input
                  placeholder='请输入班级名称'
                  style={{ width: '200px' }}
                />
              )}
            </FormItem>
            <FormItem
              label='所属机构：'
            >
              {getFieldDecorator('organizationId', {
                initialValue: this.props.orgLevel === '2' ? this.props.orgId : this.props.initQueryPar.organizationId,
              })(
                <Select
                  placeholder='请选择所属机构'
                  disabled = {this.props.orgLevel === '2' ? Boolean(1) : Boolean(0)}
                  style={{ width: '200px' }}
                  showSearch={true}
                  filterOption={this._filterOption}
                >
                  <Select.Option
                    key='-1'
                    value=''
                  >全部
                  </Select.Option>
                  {
                    this.props.orgList.map((item) => {
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
            <FormItem
              label='招生状态：'
            >
              {getFieldDecorator('classStatus', {
                initialValue: this.props.initQueryPar.classStatus,
              })(
                <Select
                  placeholder='请选择招生状态'
                  style={{ width: '200px' }}
                >
                  {
                    Object.keys(enrolmentStatus).map((key) => {
                      return (
                        <Select.Option
                          key={key}
                          value={key}
                          title={enrolmentStatus[key]}
                        >
                          {enrolmentStatus[key]}
                        </Select.Option>
                      )
                    })
                  }
                </Select>
              )}
            </FormItem>
            <FormItem
              label='开课日期：'
            >
              {getFieldDecorator('courseStartDate', {
                initialValue: this.props.initQueryPar.courseStartDate,
              })(
                <RangePicker
                  style={{ width: '300px' }}
                  format='YYYY-MM-DD'
                  placeholder={['开课开始日期', '开课结束日期']}
                />
              )}
            </FormItem>
            <FormItem
              className={styles['search-form-item']}
            >
              <Button
                type='primary'
                onClick={this._handleSubmit}
                icon='search'
              >
              查询
              </Button>
            </FormItem>
            <FormItem
              className={styles['search-form-item']}
            >
              {
                btnRole.includes('add') && (
                  <Link to={EDU_CLASS_MANAGE_ADD}>
                    <Button
                      type='primary'
                    >
                      新增
                    </Button>
                  </Link>)
              }
            </FormItem>
            <FormItem
              className={styles['search-form-item']}
            >
              {
                btnRole.includes('delete') && (
                  <Popconfirm
                    title='确定要删除吗?'
                    onConfirm={() => this._heandleDels()}
                    okText='确定'
                    cancelText='取消'
                  >
                    <Button
                      type='danger'
                      disabled = {this.props.selectedRowKeys.length !== 0 ? 0 : 1}
                    >
                      删除
                    </Button>
                  </Popconfirm>
                )
              }
            </FormItem>
          </Form>
        </div>
        <Table
          columns = {this._columns}
          rowKey = 'id'
          loading = {this.props.loading}
          dataSource = {this.props.list}
          scroll = {{ x: 2150 }}
          onChange = {this._handlePagination}
          rowSelection = {_rowSelection}
          locale={{
            emptyText: '暂无数据'
          }}
          pagination={pagination}
        />
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.classManage.list,
    pagination: state.classManage.pagination,
    loading: state.classManage.loading,
    showAddModal: state.classManage.showAddModal,
    showEditModal: state.classManage.showEditModal,
    detail: state.classManage.detail,
    okLoading: state.classManage.okLoading,
    orgId: state.classManage.orgId,
    orgList: state.classManage.orgList,
    orgLevel: state.classManage.orgLevel,
    selectedRowKeys: state.classManage.selectedRowKeys,
    auths: state.common.auths,
    initQueryPar: state.classManage.initQueryPar,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch,
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(ClassManage))
