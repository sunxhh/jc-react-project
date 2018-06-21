import { Form, Modal, Tree, Select, Spin } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}

class DetailRoleManage extends Component {
  _handleCancel = () => {
    this.props.dispatch(actions.showDetailModalAction(false))
    this.props.form.resetFields()
    this.props.dispatch(actions.getRoleMenuIds([]))
  }
  // 树的一个递归。
  _renderTreeNodes = (data) => {
    return data.map((item) => {
      if (item.children && item.children.length > 0) {
        return (
          <Tree.TreeNode
            disableCheckbox
            title={item.label}
            key={item.key}
          >
            { this._renderTreeNodes(item.children) }
          </Tree.TreeNode>
        )
      }
      return (<Tree.TreeNode
        title={item.label}
        disableCheckbox
        key={item.key}
      />)
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='角色详情'
        visible={this.props.showDetailModal}
        footer={null}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Spin spinning={this.props.spinning}>
          <Form>
            <FormItem
              {...formItemLayout}
              label='角色名称：'
            >
              <span>{this.props.detail.roleName}</span>
            </FormItem>
            <div id='dtailTreeSelect'>
              <FormItem
                {...formItemLayout}
                label='拥有权限：'
              >
                <span>
                  {
                    this.props.treeList.length > 0 && (
                      <Tree
                        showLine
                        checkedKeys = {this.props.roleMenuIds}
                        treeCheckable = {true}
                        multiple={true}
                        defaultExpandedKeys={this.props.treeList.map((item) => {
                          return item.key
                        })}
                        checkable={true}
                      >
                        {this._renderTreeNodes(this.props.treeList)}
                      </Tree>)
                  }
                </span>
              </FormItem>
            </div>
            <FormItem
              {...formItemLayout}
              label='所属机构：'
            >
              {getFieldDecorator('roleOrgId', {
                initialValue: this.props.orgForRole.id
              })(
                <Select disabled={true}>
                  <Select.Option
                    key={this.props.orgForRole.id}
                    value={this.props.orgForRole.id}
                  >
                    {this.props.orgForRole.orgName}
                  </Select.Option>
                </Select>
              )}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='角色描述：'
            >
              <span
                style={{ wordBreak: 'break-all' }}
              >
                {this.props.detail.roleDesc}
              </span>
            </FormItem>
          </Form>
        </Spin>
      </Modal>)
  }
}

export default Form.create()(DetailRoleManage)
