/**
 * author yanchong
 *
 * This is orAuthority list components
 */

import React, { Component } from 'react'
import { Button, Tree, Spin, Table, Input, Card } from 'antd'
import { connect } from 'react-redux'

import * as actions from './reduck'
import styles from './style.less'

const Search = Input.Search

class OrgAuthority extends Component {
// 设置 props 默认值
  static defaultProps = {
    list: [],
    chooseOrgId: '',
    loading: false,
    treeList: [],
    spinning: false,
    okLoading: false,
    orgMenuIds: [],
    auths: {},
    parentNodeIds: [],
  };

  _columns = [{
    title: '一级机构组织',
    dataIndex: 'orgName',
    key: 'orgName',
    with: 80,
  }]

  // 初始化表格数据
  componentDidMount = () => {
    this._handleAction()
  }

  componentWillUnmount = () => {
    const { dispatch } = this.props
    dispatch(actions.setChooseOrgId(''))
    dispatch(actions.getTreeListAction({ treeList: [], orgMenuIds: [] }))
  }

  _handleRowClick = (selectedRowKeys) => {
    this.props.dispatch(actions.getTreeList({ chooseOrgId: selectedRowKeys[0] }))
    this.props.dispatch(actions.setChooseOrgId(selectedRowKeys[0]))
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = (orgName) => {
    return { org: { orgMod: '1', orgLevel: '1', orgName }}
  }

  // 发起列表查询的 ACTION
  _handleAction = (orgName) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(orgName)
    dispatch(actions.getList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = (orgName) => {
    const { dispatch } = this.props
    this._handleAction(orgName)
    dispatch(actions.setChooseOrgId(''))
    dispatch(actions.getTreeListAction({ treeList: [], orgMenuIds: [] }))
  }

  _handleSave = () => {
    this.props.dispatch(actions.save({ chooseOrgId: this.props.chooseOrgId, orgMenuIds: [...this.props.parentNodeIds, ...this.props.orgMenuIds] }))
  }

  // 树的一个递归。
  _renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode
            title={item.menuName}
            key={item.id}
            data-id={item.id}
          >
            { this._renderTreeNodes(item.children) }
          </Tree.TreeNode>
        )
      }
      return (<Tree.TreeNode
        title={item.menuType === '2' ? <span>{item.menuName}</span> : item.menuName}
        key={item.id}
        data-id={item.id}
      />)
    })
  }

  _handleOnCheck = (checkedKeys, e) => {
    this.props.dispatch(actions.setOrgMenuIds(checkedKeys))
    this.props.dispatch(actions.switchParentNodeIds(e.halfCheckedKeys))
  }

  // 组件 jsx 的编写
  render() {
    const { auths, path, spinning, chooseOrgId } = this.props
    const btnRole = auths[path] ? auths[path] : []
    const _rowSelection = {
      type: 'radio',
      selectedRowKeys: [chooseOrgId],
      onChange: this._handleRowClick
    }
    return (
      <div className={styles['common-table']}>
        <div className={styles['search']}>
          <Search
            placeholder='请输入组织名称'
            enterButton
            onSearch={this._handleSubmit}
            style={{ width: 256 }}
          />
        </div>
        <div className={styles['left-tree']}>
          <Table
            bordered
            columns = {this._columns}
            rowKey = 'id'
            loading = {this.props.loading}
            dataSource = {this.props.list}
            pagination = {false}
            rowSelection = {_rowSelection}
          />
        </div>
        <div className={styles['right-table']}>
          <Spin
            spinning={(typeof spinning === 'boolean' && spinning) ||
          (typeof spinning === 'object' && spinning.bool)}
          >
            {this.props.treeList.length > 0 && (
              <Card
                title='机构权限'
                extra={
                  btnRole.includes('edit') && (
                    <Button
                      type='primary'
                      icon='save'
                      onClick={this._handleSave}
                      loading = {this.props.showBtnSpin}
                    >保存
                    </Button>)
                }
              >
                <div>
                  <Tree
                    showLine
                    checkedKeys = {this.props.orgMenuIds}
                    onCheck={this._handleOnCheck}
                    defaultExpandedKeys={this.props.treeList.map((item) => {
                      return item.id
                    })}
                    checkable={true}
                  >
                    {this._renderTreeNodes(this.props.treeList || [])}
                  </Tree>
                </div>
              </Card>
            )}
          </Spin>
        </div>
      </div>)
  }
}

const mapStateToProps = (state) => {
  return {
    list: state.orgAuthority.list,
    loading: state.orgAuthority.loading,
    treeList: state.orgAuthority.treeList,
    spinning: state.common.showListSpin,
    showBtnSpin: state.common.showButtonSpin,
    orgMenuIds: state.orgAuthority.orgMenuIds,
    chooseOrgId: state.orgAuthority.chooseOrgId,
    auths: state.common.auths,
    parentNodeIds: state.orgAuthority.parentNodeIds,
  }
}
const mapDispatchToProps = (dispatch) => ({
  dispatch,
})
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrgAuthority)
