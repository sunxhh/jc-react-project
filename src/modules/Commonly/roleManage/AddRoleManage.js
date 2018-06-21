import { Form, Input, Modal, Select, TreeSelect } from 'antd'
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

class AddRoleManage extends Component {
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(
          actions.add({
            role: {
              roleName: values.roleName,
              roleOrgId: values.roleOrgId,
              roleDesc: values.roleDesc,
            },
            menuIds: [...this.props.parentNodeIds, ...values.menuIds],
          }, this.props.defaultValue, () => this.props.form.resetFields()))
      }
    })
  }
  _handleCancel = () => {
    this.props.dispatch(actions.showAddModalAction(false))
    this.props.form.resetFields()
  }

  _treeOnChange = (value, node, extra) => {
    this.props.dispatch(actions.switchParentNodeIds(extra.halfCheckedKeys))
  }

  _getAllNodes = (allCheckedNodes, arr) => {
    allCheckedNodes.map(item => {
      arr.push(item.node.key)
      if (item.children) {
        this._getAllNodes(item.children, arr)
      }
    })
    return arr
  }

  _menuIdsValueFromEvent = (value, node, extra) => {
    return this._getAllNodes(extra.allCheckedNodes, [])
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='新增角色'
        confirmLoading = {this.props.showBtnSpin}
        visible={this.props.showAddModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='角色名称：'
          >
            {getFieldDecorator('roleName', {
              rules: [{
                required: true, message: '请输入角色名称',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入角色名称'
                maxLength ='50'
              />
            )}
          </FormItem>
          <div id='treeSelect'>
            <FormItem
              {...formItemLayout}
              label='拥有权限：'
            >
              {getFieldDecorator('menuIds', {
                rules: [{
                  required: true, message: '请选择权限',
                }],
                getValueFromEvent: this._menuIdsValueFromEvent
              })(
                <TreeSelect
                  treeData = {this.props.treeList}
                  treeCheckable = {true}
                  multiple={true}
                  treeDefaultExpandedKeys={this.props.treeList && this.props.treeList.map((item) => {
                    return item.key
                  })}
                  onSelect={this._treeOnChange}
                  showCheckedStrategy = {TreeSelect.SHOW_PARENT}
                  getPopupContainer={() => document.getElementById('treeSelect')}
                  placeholder = '选择权限'
                />
              )}
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
                  placeholder = '请选择所属机构'
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
            {getFieldDecorator('roleDesc')(
              <Input.TextArea
                type='text'
                placeholder='请输入角色描述'
                maxLength ='500'
              />
            )}
          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(AddRoleManage)
