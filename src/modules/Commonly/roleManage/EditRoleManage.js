import { Form, Input, Modal, TreeSelect, Select, Spin } from 'antd'
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

class EditRoleManage extends Component {
  // 点击Modal 里面的确认按钮
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(actions.edit({ role: { ...values, id: this.props.detail.id }, menuIds: [...this.props.parentNodeIds, ...values.menuIds] }, this.props.defaultValue, () => this._handleCancel()))
      }
    })
  }

  _handleCancel = () => {
    this.props.dispatch(actions.showEditModalAction(false))
    this.props.form.resetFields()
    this.props.dispatch(actions.getRoleMenuIds([]))
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
        title='编辑角色'
        confirmLoading = {this.props.showBtnSpin}
        visible={this.props.showEditModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Spin spinning={this.props.spinning}>
          <Form>
            <FormItem
              {...formItemLayout}
              label='角色名称：'
            >
              {getFieldDecorator('roleName', {
                rules: [{
                  required: true, message: '请输入角色名称',
                }],
                initialValue: this.props.detail.roleName
              })(
                <Input
                  type='text'
                  placeholder='请输入角色名称'
                  maxLength ='50'
                />
              )}
            </FormItem>
            <div id='editTreeSelect'>
              <FormItem
                {...formItemLayout}
                label='拥有权限：'
              >
                {getFieldDecorator('menuIds', {
                  initialValue: this.props.roleMenuIds,
                  rules: [{
                    required: true, message: '请选择权限',
                  }],
                  getValueFromEvent: this._menuIdsValueFromEvent
                })(
                  <TreeSelect
                    treeData = {this.props.treeList}
                    treeCheckable = {true}
                    multiple={true}
                    onSelect={this._treeOnChange}
                    treeDefaultExpandedKeys={this.props.treeList && this.props.treeList.map((item) => {
                      return item.key
                    })}
                    showCheckedStrategy = {TreeSelect.SHOW_PARENT}
                    getPopupContainer={() => document.getElementById('editTreeSelect')}
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
              {getFieldDecorator('roleDesc', {
                initialValue: this.props.detail.roleDesc,
              })(
                <Input.TextArea
                  type='text'
                  placeholder='请输入角色描述'
                  maxLength ='500'
                />
              )}
            </FormItem>
          </Form>
        </Spin>
      </Modal>)
  }
}

export default Form.create()(EditRoleManage)
