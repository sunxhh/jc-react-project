import { Form, Input, Modal, Radio } from 'antd'
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

const IS_AVAILABLE_NAME = {
  0: '无效',
  1: '有效',
}

class EditDictionary extends Component {
  // 点击Modal 里面的确认按钮
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(actions.edit({ ...values, uuid: this.props.detail.uuid }, this.props.defaultValue, () => this.props.form.resetFields()))
      }
    })
  }
  _handleCancel = () => {
    this.props.dispatch(actions.showEditModalAction(false))
    this.props.form.resetFields()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='编辑数字字典'
        confirmLoading = {this.props.okLoading}
        visible={this.props.showEditModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='项目名：'
            hasFeedback
          >
            {getFieldDecorator('codeName', {
              initialValue: this.props.detail.codeName,
              rules: [{
                required: true, message: '请输入项目名',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入项目名'
                maxLength='30'
              />
            )}
          </FormItem>

          <FormItem
            {...formItemLayout}
            label='项目值：'
            hasFeedback
          >
            {getFieldDecorator('codeValue', {
              initialValue: this.props.detail.codeValue,
              rules: [{
                required: true, message: '请输入项目值',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入项目值'
                maxLength='30'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='简拼：'
            hasFeedback
          >
            {getFieldDecorator('codePy', {
              initialValue: this.props.detail.codePy,
              rules: [{
                required: true, message: '请输入简拼',
              }, {
                pattern: /^[0-9a-zA-Z]*$/,
                message: '只能输入数字和字母',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入简拼'
                maxLength='30'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='排序：'
            hasFeedback
          >
            {getFieldDecorator('orders', {
              initialValue: String(this.props.detail.orders),
              validateFirst: true,
              rules: [{
                required: true, message: '请输入排序',
              }, {
                pattern: /^[1-9]\d*$/,
                message: '只能输入1-9999的整数',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入排序'
                maxLength='4'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='备注：'
            hasFeedback
          >
            {getFieldDecorator('remark', {
              initialValue: this.props.detail.remark,
            })(
              <Input.TextArea
                type='text'
                maxLength='500'
                placeholder='请输入备注'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='是否有效'
          >
            {getFieldDecorator('isAvailable', {
              initialValue: String(this.props.detail.isAvailable),
            })(
              <Radio.Group>
                {
                  Object.keys(IS_AVAILABLE_NAME).map((item) => {
                    return (
                      <Radio
                        key={item}
                        value={item}
                      >{IS_AVAILABLE_NAME[item]}
                      </Radio>)
                  })
                }
              </Radio.Group>
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='拓展字段1：'
            hasFeedback
          >
            {getFieldDecorator('expendField1', {
              initialValue: this.props.detail.expendField1,
              rules: [{
                max: 10, message: '最多输入10个字符',
              }, {
                pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,}$/,
                message: '只能输入中文、数字、字母',
              }]
            })(
              <Input
                type='text'
                placeholder='请输入拓展字段1'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='拓展字段2：'
            hasFeedback
          >
            {getFieldDecorator('expendField2', {
              initialValue: this.props.detail.expendField2,
              rules: [{
                max: 10, message: '最多输入10个字符',
              }, {
                pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,}$/,
                message: '只能输入中文、数字、字母',
              }]
            })(
              <Input
                type='text'
                placeholder='请输入拓展字段2'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='拓展字段3：'
            hasFeedback
          >
            {getFieldDecorator('expendField3', {
              initialValue: this.props.detail.expendField3,
              rules: [{
                max: 10, message: '最多输入10个字符',
              }, {
                pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,}$/,
                message: '只能输入中文、数字、字母',
              }]
            })(
              <Input
                type='text'
                placeholder='请输入拓展字段3'
              />
            )}
          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(EditDictionary)
