import { Form, Input, Modal, Select } from 'antd'
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

class AddClassRoom extends Component {
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(
          actions.add({ classRoom: { ...values }},
            this.props.defaultValue, () => this.props.form.resetFields()))
      }
    })
  }
  _handleCancel = () => {
    this.props.dispatch(actions.showAddModalAction(false))
    this.props.form.resetFields()
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='新增教室设置'
        confirmLoading = {this.props.okLoading}
        visible={this.props.showAddModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
        okText='确定'
        cancelText='取消'
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='教室名称：'
            hasFeedback
          >
            {getFieldDecorator('classRoomName', {
              rules: [{
                required: true, message: '请输入教室名称',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入教室名称'
                maxLength='50'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='所属机构：'
          >
            {getFieldDecorator('orgId', {
              initialValue: this.props.orgLevel === '2' ? this.props.orgId : '',
              rules: [{
                required: true, message: '请选择所属机构',
              }],
            })(
              <Select
                placeholder='请选择所属机构'
                disabled = {this.props.orgLevel === '2' ? Boolean(1) : Boolean(0)}
                showSearch={true}
                filterOption={this._filterOption}
              >
                <Select.Option
                  key=''
                  value=''
                >请选择
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
            {...formItemLayout}
            label='备注：'
            hasFeedback
          >
            {getFieldDecorator('memo')(
              <Input.TextArea
                maxLength='500'
                type='text'
                placeholder='请输入备注'
              />
            )}
          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(AddClassRoom)
