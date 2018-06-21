import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
import { Table, Button, Form, Card, Tree, message, Popconfirm, Popover } from 'antd'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import styles from './styles.less'
import { isEmpty } from 'Utils/lang'
import storage from 'Utils/storage'
import { getUrlParam } from 'Utils/params'
import { typeToName } from './dic'

import Module from './module'
import ParentModule from '../module'

const statusName = {
  'N': '未启用',
  'Y': '已启用',
}

class CustomFields extends Component {
  state = {
    orgList: [],
    currentOrgId: '',
    fromOrgId: '',
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetFieldList())
  }

  componentWillMount() {
    const { dispatch } = this.props
    const userInfo = storage.get('userInfo')
    const param = userInfo.orgLevel === '0' ? { org: { }} : { org: { orgCode: userInfo.orgCode }}
    dispatch(ParentModule.actions.getIndustryAndOrgList(param)).then(res => {
      if (res.status === 'success') {
        if (isEmpty(res.result)) {
          this.setState({ orgList: [] })
          dispatch(Module.actions.resetFieldList())
        } else {
          let fromOrgId = getUrlParam('fromOrgId')
          if (userInfo.orgLevel !== '0') {
            fromOrgId = res.result[0].orgs[0].orgCode
          }
          this.setState({ orgList: res.result }, () => {
            if (fromOrgId) {
              this.setState({ currentOrgId: fromOrgId })
              dispatch(Module.actions.getFieldList({ orgCode: fromOrgId }))
            }
          })
        }
      }
    })
  }

  _columns = [{
    title: '产业字段',
    dataIndex: 'fieldLabel',
    key: 'fieldLabel',
    width: '150px',
  }, {
    title: '字段属性',
    dataIndex: 'componentType',
    key: 'componentType',
    width: '150px',
    render: (text, record) => {
      return text ? typeToName[text] : ''
    }
  }, {
    title: '字段内容',
    dataIndex: 'options',
    key: 'options',
    render: (text, record) => {
      const str = record.options.map(option => option.optionName).join(`,`)
      return (<Popover
        placement='topRight'
        content={<div className={styles['pop']}>{str}</div>}
        title='字段内容'
      >
        <span>{str && str.length > 40 ? `${str.substring(0, 40)}...` : str}</span>
      </Popover>)
    }
  }, {
    title: '启用状态',
    dataIndex: 'publishStatus',
    key: 'publishStatus',
    width: '100px',
    render: (text) => {
      return statusName[text]
    }
  }, {
    title: '操作',
    key: 'handle',
    width: '150px',
    render: (text, record) => {
      const { currentOrgId } = this.state
      const { auths, match } = this.props
      const btnRole = auths[match.path] ? auths[match.path] : []
      const orgLevel = storage.get('userInfo').orgLevel
      const orgLevels = ['0', '1']
      return (
        <div>
          {
            record.publishStatus === 'N' && orgLevels.includes(orgLevel) &&
            <div>
              {
                btnRole.includes('edit') &&
                <Link
                  to={{
                    pathname: `${urls.MEMBER_CUSTOM_FIELDS_EDIT}/${record.fieldId}`,
                    search: `?orgId=${currentOrgId}`,
                  }}
                  style={{ marginRight: '5px' }}
                >
                  编辑
                </Link>
              }
              {
                btnRole.includes('del') &&
                <Popconfirm
                  title={`确定删除吗？`}
                  onConfirm={() => { this._del(record.fieldId) }}
                >
                  <a href='javascript:;' style={{ marginRight: '5px' }} >删除</a>
                </Popconfirm>
              }
              {
                btnRole.includes('publish') &&
                <Popconfirm
                  placement='topRight'
                  title={`确定启用吗？启用后将无法进行编辑删除操作！`}
                  onConfirm={() => { this._publish(record.fieldId) }}
                >
                  <a href='javascript:;' >启用</a>
                </Popconfirm>
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
      this.setState({ currentOrgId: key[0] }, () => {
        dispatch(Module.actions.getFieldList({ orgCode: key[0] }))
      })
    }
  }

  // 添加产业字段
  _add = (e) => {
    e.preventDefault()
    const { currentOrgId } = this.state
    const { history } = this.props
    if (currentOrgId === '') {
      message.error('请选择产业！')
    } else {
      history.push({
        pathname: urls.MEMBER_CUSTOM_FIELDS_ADD,
        search: `?orgId=${currentOrgId}`,
      })
    }
  }

  // 删除产业字段
  _del = (fieldId) => {
    const { dispatch } = this.props
    const { currentOrgId } = this.state
    dispatch(Module.actions.delField({ fieldId })).then(res => {
      if (res.status === 'success') {
        dispatch(Module.actions.getFieldList({ orgCode: currentOrgId }))
      }
    })
  }

  // 启用产业字段
  _publish = (fieldId) => {
    const { dispatch } = this.props
    const { currentOrgId } = this.state
    dispatch(Module.actions.publishField({ fieldId })).then(res => {
      if (res.status === 'success') {
        dispatch(Module.actions.getFieldList({ orgCode: currentOrgId }))
      }
    })
  }

  render() {
    const { extfieldList, showListSpin, auths, match } = this.props
    const { orgList, currentOrgId } = this.state
    const btnRole = auths[match.path] ? auths[match.path] : []
    const orgLevel = storage.get('userInfo').orgLevel
    const orgLevels = ['0', '1']
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
          {
            currentOrgId !== '' && btnRole.includes('add') && orgLevels.includes(orgLevel) &&
            <Button
              onClick={this._add}
              type='primary'
            >
              新增产业字段
            </Button>
          }
          
          <p style={{ color: '#f30', marginTop: 10 }}>
            说明：产业会员的产业信息字段，根据此处的配置来确定。各个产业的产业字段均不相同，请根据自己产业需求自定义。
          </p>
          <Table
            className={styles['c-table-center']}
            bordered
            pagination={false}
            loading={showListSpin}
            columns={this._columns}
            dataSource={extfieldList}
            rowKey='fieldId'
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['memberCenter.customFields'],
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'memberCenter.customFields'], mapStateToProps)(Form.create()(CustomFields))
