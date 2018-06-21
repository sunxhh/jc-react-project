/**
 * author yanchong
 *
 * This is classRoom set list components
 */

import React, { Component } from 'react'
import { Form, Table, Input, Button, Popconfirm, Select, Divider, Row, Col } from 'antd'
import { connect } from 'react-redux'

import * as actions from './reduck'
import AddClassRoom from './AddClassRoom'
import EditClassRoom from './EditClassRoom'
import styles from './style.less'
import Ellipsis from 'Components/Ellipsis'
import { genPagination } from 'Utils/helper'

const { Item: FormItem } = Form

class ClassRoomManage extends Component {
  _columns = [{
    title: '序号',
    dataIndex: 'rowNo',
    key: 'rowNo',
    width: 80,
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
    title: '教室名称',
    dataIndex: 'classRoomName',
    key: 'classRoomName',
    render: (text) => {
      return (
        <Ellipsis
          length={15}
          tooltip={true}
        >
          {text}
        </Ellipsis>)
    }
  }, {
    title: '所属机构',
    dataIndex: 'orgName',
    key: 'orgName',
    render: (text) => {
      return (
        <Ellipsis
          length={15}
          tooltip={true}
        >
          {text}
        </Ellipsis>)
    }
  }, {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    width: 108,
  }, {
    title: '备注',
    dataIndex: 'memo',
    key: 'memo',
    render: (text) => {
      return (
        <Ellipsis
          length={30}
          tooltip={true}
        >
          {text}
        </Ellipsis>)
    }
  }, {
    title: '操作',
    dataIndex: 'option',
    key: 'option',
    width: 120,
    render: (text, row) => {
      const { auths, match } = this.props
      const btnRole = auths[match.path] ? auths[match.path] : []
      return (
        <span>
          {
            btnRole.includes('edit') && (
              <a
                href='javascript:void(0);'
                onClick={() => this._showEditClassroom(row.id)}
              >编辑
              </a>
            )
          }
          <Divider type='vertical' />
          {
            btnRole.includes('delete') && (
              <Popconfirm
                title={`确定要删除（${row.classRoomName}）吗?`}
                onConfirm={() => this._handleDel(row.id)}
                okText='确定'
                cancelText='取消'
              >
                <a href='javascript:void(0);'>删除</a>
              </Popconfirm>
            )
          }
        </span>)
    }
  }]

  // 设置 props 默认值
  static defaultProps = {
    list: [],
    pagination: {
      pageNo: 1,
      records: 0,
      pageSize: '10',
    },
    loading: true,
    showAddModal: false,
    showEditModal: false,
    detail: {
      classRoomName: undefined,
      orgId: undefined,
      memo: undefined,
    },
    spinning: false,
    okLoading: false,
    orgList: [],
    orgId: undefined,
    selectedRowKeys: [],
    orgLevel: '',
    auths: [],
  };

  // 初始化表格数据
  componentDidMount = () => {
    const { dispatch } = this.props
    dispatch(actions.queryOrg({ org: { orgMod: 1, orgLevel: 2 }}))
    this._handleAction(1, 10)
  }

  // 组件销毁时， 重置此组建列表数据为[]，减少内存不 必要的开销。
  componentWillUnmount() {
    this._willUnmountListData()
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(actions.getListAction({
      list: [],
      pagination: {
        pageNo: 1,
        pagination: 0,
        pageSize: 10,
      },
    }))
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = (current = this.props.pagination.pageNo, pageSize = this.props.pagination.pageSize) => {
    return { classRoom: { ...this.props.form.getFieldsValue() }, currentPage: current, pageSize: pageSize }
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

  // 添加 modal 的props
  _handleAddProps = () => {
    return {
      showAddModal: this.props.showAddModal,
      defaultValue: this._getQueryParameter(),
      dispatch: this.props.dispatch,
      okLoading: this.props.okLoading,
      orgList: this.props.orgList,
      orgId: this.props.orgId,
      orgLevel: this.props.orgLevel,
    }
  }

  // 点击添加按钮
  _showAddClassroom = () => {
    const { dispatch } = this.props
    dispatch(actions.showAddModalAction(true))
  }

  // 编辑的 props
  _handleEditProps = () => {
    return {
      showEditModal: this.props.showEditModal,
      dispatch: this.props.dispatch,
      detail: this.props.detail,
      defaultValue: this._getQueryParameter(),
      okLoading: this.props.okLoading,
      orgList: this.props.orgList,
      orgLevel: this.props.orgLevel,
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
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const pagination = genPagination(this.props.pagination)
    return (
      <div className={styles['common-table']}>
        <Form className='search-form'>
          <Row>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label='教室名称'
                className={styles['search-form-item']}
              >
                {getFieldDecorator('classRoomName')(
                  <Input placeholder='请输入教室名称' />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                {...formItemLayout}
                label='所属机构：'
              >
                {getFieldDecorator('orgId', {
                  initialValue: this.props.orgLevel === '2' ? this.props.orgId : '',
                })(
                  <Select
                    placeholder='请选择所属机构'
                    disabled = {this.props.orgLevel === '2' ? Boolean(1) : Boolean(0)}
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
            </Col>
            <Col span={12}>
              <div className={styles['operation-btn']}>
                <Button
                  type='primary'
                  onClick={this._handleSubmit}
                  icon='search'
                >
                  查询
                </Button>
                {
                  btnRole.includes('add') && (
                    <Button
                      type='primary'
                      onClick={this._showAddClassroom}
                    >新增
                    </Button>)
                }
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
                        className='ant-btn ant-btn-primary'
                        disabled = {this.props.selectedRowKeys.length !== 0 ? 0 : 1}
                      >删除
                      </Button>
                    </Popconfirm>
                  )
                }
              </div>
            </Col>
          </Row>
        </Form>
        <AddClassRoom {...this._handleAddProps()} />
        <EditClassRoom {...this._handleEditProps()} />
        <Table
          columns = {this._columns}
          rowKey = 'id'
          loading = {this.props.loading}
          dataSource = {this.props.list}
          onChange = {this._handlePagination}
          rowSelection = {_rowSelection}
          locale={{ emptyText: '暂无数据' }}
          pagination = {pagination}
        />
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.classroom.list,
    pagination: state.classroom.pagination,
    loading: state.classroom.loading,
    showAddModal: state.classroom.showAddModal,
    showEditModal: state.classroom.showEditModal,
    detail: state.classroom.detail,
    okLoading: state.classroom.okLoading,
    orgId: state.classroom.orgId,
    orgList: state.classroom.orgList,
    orgLevel: state.classroom.orgLevel,
    selectedRowKeys: state.classroom.selectedRowKeys,
    auths: state.common.auths,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Form.create()(ClassRoomManage))
