/**
 * author yanchong
 *
 * This is role list components
 */
import React, { Component } from 'react'
import { Form, Table, Input, Button, Popconfirm, Divider } from 'antd'
import { connect } from 'react-redux'

import * as actions from './reduck'
import AddRoleManage from './AddRoleManage'
import EditRoleManage from './EditRoleManage'
import DetailRoleManage from './DetailRoleManage'
import styles from './style.less'
import Ellipsis from 'Components/Ellipsis'

const { Item: FormItem } = Form

class RoleManage extends Component {
  _cashColumns = [{
    title: '角色名称',
    dataIndex: 'roleName',
    key: 'roleName',
    with: 80,
  }, {
    title: '角色描述',
    dataIndex: 'roleDesc',
    key: 'roleDesc',
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
    with: 100,
    render: (text, row) => {
      const { auths, match } = this.props
      const btnRole = auths[match.path] ? auths[match.path] : []
      return (
        <span>
          <a
            href='javascript:void(0);'
            onClick={() => this._showDetailRole(row.id)}
          >详情
          </a>
          <Divider type='vertical' />
          { btnRole.includes('edit') && (
            <a
              href='javascript:void(0);'
              onClick={() => this._showEditRole(row.id)}
            >编辑
            </a>)
          }
          <Divider type='vertical' />
          {
            btnRole.includes('delete') && (
              <Popconfirm
                title={`确定要删除（${row.roleName}）吗?`}
                onConfirm={() => this._heandleDel(row.id)}
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
    loading: true,
    treeList: [],
    showAddModal: false,
    showEditModal: false,
    showDetailModal: false,
    showAddTypeModal: false,
    showEditTypeModal: false,
    detail: {},
    showBtnSpin: false,
    auths: {},
    spinning: false,
    parentNodeIds: [],
  };

  // 初始化表格数据
  componentDidMount = () => {
    this.props.dispatch(actions.getList({ 'roleName': '' }))
    this.props.dispatch(actions.getTreeList())
    this.props.dispatch(actions.getOrgForAddRole())
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = () => {
    return { ...this.props.form.getFieldsValue() }
  }

  // 发起列表查询的 ACTION
  _handleAction = () => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter()
    dispatch(actions.getList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = (e) => {
    e.preventDefault()
    this._handleAction()
  }

  // 添加 modal 的props
  _handleAddProps = () => {
    return {
      showAddModal: this.props.showAddModal,
      defaultValue: this._getQueryParameter(),
      dispatch: this.props.dispatch,
      showBtnSpin: this.props.showBtnSpin,
      treeList: this._loop(this.props.treeList),
      orgForRole: this.props.orgForRole,
      parentNodeIds: this.props.parentNodeIds,
    }
  }

  // 点击添加按钮
  _showAddRole= () => {
    const { dispatch } = this.props
    dispatch(actions.showAddModalAction(true))
  }

  // // 编辑的 props
  _handleEditProps = () => {
    return {
      showEditModal: this.props.showEditModal,
      dispatch: this.props.dispatch,
      detail: this.props.detail,
      defaultValue: this._getQueryParameter(),
      treeList: this._loop(this.props.treeList),
      roleMenuIds: this.props.roleMenuIds,
      showBtnSpin: this.props.showBtnSpin,
      orgForRole: this.props.orgForRole,
      spinning: this.props.spinning,
      parentNodeIds: this.props.parentNodeIds,
    }
  }

  // 编辑的 data 初始化
  _showEditRole = (id) => {
    const { dispatch } = this.props
    dispatch(actions.getTreeIds({ 'id': id }))
    dispatch(actions.showEditModalAction(true))
    dispatch(actions.detail({ 'id': id }))
  }

  // 查看详情的props
  _handleDetailProps = () => {
    return {
      showDetailModal: this.props.showDetailModal,
      dispatch: this.props.dispatch,
      detail: this.props.detail,
      orgForRole: this.props.orgForRole,
      treeList: this._loop(this.props.treeList),
      roleMenuIds: this.props.roleMenuIds,
      spinning: this.props.spinning,
    }
  }

  // 点击查看详情。
  _showDetailRole = (id) => {
    const { dispatch } = this.props
    dispatch(actions.showDetailModalAction(true))
    dispatch(actions.detail({ 'id': id }))
    dispatch(actions.getTreeIds({ 'id': id }))
  }
  // 删除
  _heandleDel = (id) => {
    this.props.dispatch(actions.del({ 'id': id }, this._getQueryParameter()))
  }

  _loop = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          label: item['menuName'],
          key: item['id'],
          value: item['id'],
          children: this._loop(item.children),
        }
      } else {
        return {
          label: item['menuName'],
          key: item['id'],
          value: item['id'],
        }
      }
    })
  }

  // 组件 jsx 的编写
  render() {
    const { getFieldDecorator } = this.props.form
    const { auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div className={styles['common-table']}>
        <div className={styles['search']}>
          <Form
            layout='inline'
            onSubmit={this._handleSubmit}
          >
            <FormItem label='角色名称：'>
              {getFieldDecorator('roleName')(
                <Input placeholder='请输入角色名称' />,
              )}
            </FormItem>
            <FormItem>
              <Button
                type='primary'
                htmlType='submit'
                icon='search'
              >
                查询
              </Button>
            </FormItem>
            { btnRole.includes('add') && (
              <FormItem>
                <Button
                  type='primary'
                  onClick={this._showAddRole}
                >新增
                </Button>
              </FormItem>)
            }
          </Form>
        </div>
        <AddRoleManage {...this._handleAddProps()} />
        <EditRoleManage {...this._handleEditProps()} />
        <DetailRoleManage {...this._handleDetailProps()} />
        <Table
          columns = {this._cashColumns}
          pagination={false}
          rowKey = 'id'
          loading = {this.props.loading}
          dataSource = {this.props.list}
        />
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.roleManage.list,
    loading: state.roleManage.loading,
    treeList: state.roleManage.treeList,
    showAddModal: state.roleManage.showAddModal,
    orgForRole: state.roleManage.orgForRole,
    detail: state.roleManage.detail,
    showEditModal: state.roleManage.showEditModal,
    roleMenuIds: state.roleManage.roleMenuIds,
    showBtnSpin: state.common.showButtonSpin,
    showDetailModal: state.roleManage.showDetailModal,
    auths: state.common.auths,
    spinning: state.common.showListSpin,
    parentNodeIds: state.roleManage.parentNodeIds,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Form.create()(RoleManage))
