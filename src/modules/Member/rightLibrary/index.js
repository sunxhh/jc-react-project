import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Table, Button, Form, Card, Tree, Popconfirm, Divider, message } from 'antd'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import { getUrlParam } from 'Utils/params'
import AddRightLibrary from './AddRightLibrary'

import Module from './module'
import ParentModule from '../module'

class RightList extends Component {
  state = {
    orgList: [],
    currentOrgId: '',
    currentOrgName: '',
    fromOrgId: '',
    isEdit: false
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetRightLibraryList())
  }

  componentWillMount() {
    const { dispatch, userInfo } = this.props
    let orgLevel = userInfo['orgLevel']
    let orgCode = userInfo['orgCode']
    const param = orgLevel === '0' ? { org: { }} : { org: { orgCode }}
    dispatch(ParentModule.actions.getIndustryAndOrgList(param)).then(res => {
      if (res.status === 'success') {
        if (isEmpty(res.result)) {
          this.setState({ orgList: [] })
          dispatch(Module.actions.resetRightLibraryList())
        } else {
          let fromOrgId = getUrlParam('fromOrgId')
          let currentOrgName = ''
          if (orgLevel !== '0') {
            fromOrgId = res.result[0].orgs[0].orgCode
            currentOrgName = res.result[0].orgs[0].orgName
          }
          this.setState({ orgList: res.result }, () => {
            if (fromOrgId) {
              this.setState({ currentOrgId: fromOrgId, currentOrgName })
              dispatch(Module.actions.getRightLibraryList({ orgCode: fromOrgId }))
            }
          })
        }
      }
    })
  }

  _columns = [{
    title: '权益主题',
    dataIndex: 'rightName',
    key: 'rightName',
    width: '180px',
  }, {
    title: '权益选项',
    dataIndex: 'itemList',
    render(itemList) {
      return (
        <ul style={{ padding: 0, marginBottom: 0 }}>
          {
            itemList.map(item => {
              return (
                <li style={{ listStyleType: 'none' }} key={item.itemId}>{item.itemName}</li>
              )
            })
          }
        </ul>
      )
    }
  }, {
    title: '操作',
    key: 'handle',
    width: '120px',
    render: (text, record) => {
      const { auths, match, userInfo } = this.props
      const btnRole = auths[match.path] ? auths[match.path] : []
      const orgLevels = ['0', '1']
      const orgLevel = userInfo['orgLevel']
      return (
        <div>
          {
            orgLevels.includes(orgLevel) &&
            <div>
              {
                btnRole.includes('edit') &&
                <a href='javascript:;' onClick={() => { this._edit(record.rightId) }}>编辑</a>
              }
              {
                btnRole.includes('del') &&
                <span>
                  <Popconfirm
                    getPopupContainer={trigger => trigger.parentNode}
                    placement='topRight'
                    title={`删除该条权益？`}
                    onConfirm={() => { this._del(record.rightId) }}
                  >
                    <a href='javascript:;' style={{ margin: '0 10px' }} >删除</a>
                  </Popconfirm>
                </span>
              }
            </div>
          }
        </div>
      )
    }
  }]

  // 生成树
  _renderTreeNodes = (data) => {
    return data.map((item, index) => {
      return (
        <Tree.TreeNode
          title={item.industryName}
          key={`${item.industryName}${index}`}
          data-id={`${item.industryName}${index}`}
          selectable={false}
        >
          {
            item.orgs.map(org => {
              return (
                <Tree.TreeNode
                  title={org.orgName}
                  key={org.orgCode}
                  data-id={org.orgCode}
                />
              )
            })
          }
        </Tree.TreeNode>
      )
    })
  }

  // 点击左边树结构
  _clickTree = (key, e) => {
    const { dispatch } = this.props
    if (e.selected) {
      this.setState({ currentOrgId: key[0], currentOrgName: e.selectedNodes[0].props.title }, () => {
        dispatch(Module.actions.getRightLibraryList({ orgCode: key[0] }))
      })
    }
  }

  // 添加权益库
  _add = () => {
    this.setState({
      isEdit: false
    })
    this.props.dispatch(Module.actions.showAddModalAction(true))
  }

  // 修改权益库
  _edit = (rightId) => {
    this.props.dispatch(Module.actions.activated({ rightId: rightId })).then(res => {
      if (res.status === 'success') {
        if (res.result.flag === 1) {
          message.error(res.result.message)
        } else {
          this.setState({
            isEdit: true
          })
          this.props.dispatch(Module.actions.showAddModalAction(true))
          this.props.dispatch(Module.actions.getRightLibrary({ rightId: rightId }))
        }
      } else {
        message.error(res.errMsg)
      }
    })
  }

  // 删除权益主题
  _del = (rightId) => {
    const { dispatch } = this.props
    const { currentOrgId } = this.state
    dispatch(Module.actions.delRightLibrary({ rightId })).then(res => {
      if (res.status === 'success') {
        dispatch(Module.actions.getRightLibraryList({ orgCode: currentOrgId }))
      }
    })
  }

  render() {
    const { rightList, showListSpin, auths, match, userInfo, showAddModal, info } = this.props
    const { orgList, currentOrgId, currentOrgName } = this.state
    const btnRole = auths[match.path] ? auths[match.path] : []
    const orgLevels = ['0', '1']
    const orgLevel = userInfo['orgLevel']
    return (
      <div className={styles['common-table']}>
        <Card
          title='所属产业'
          className={styles['left-tree']}
        >
          {
            isEmpty(orgList)
              ? null
              : <Tree
                showLine
                defaultExpandAll
                onSelect={this._clickTree}
                selectedKeys={[currentOrgId]}
              >
                {
                  this._renderTreeNodes(orgList)
                }
              </Tree>
          }
        </Card>
        <div className={styles['right-table']}>
          <div className={styles['table-title']}>
            <span className={styles['table-title-name']}>{`${currentOrgName || ''}权益库`}</span>
            {
              currentOrgId !== '' && btnRole.includes('add') && orgLevels.includes(orgLevel) &&
              <Button
                onClick={this._add}
                type='primary'
                style={{ float: 'right' }}
              >
                添加权益库内容
              </Button>
            }
          </div>
          <Divider />
          <Table
            className={styles['c-table-center']}
            bordered
            pagination={false}
            loading={showListSpin}
            columns={this._columns}
            dataSource={rightList}
            rowKey='rightId'
          />
        </div>
        <AddRightLibrary
          showAddModal={showAddModal}
          orgCode={this.state.currentOrgId}
          info={isEmpty(info) ? info : null}
          isEdit={this.state.isEdit}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.rightLibrary'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    userInfo: state['common.userInfo'],
  }
}
export default connect(['common.userInfo', 'common.auths', 'common.showListSpin', 'memberCenter.rightLibrary'], mapStateToProps)(Form.create()(RightList))
