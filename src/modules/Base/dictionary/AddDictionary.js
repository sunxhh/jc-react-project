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
const isAvailable = {
  0: '无效',
  1: '有效',
}

class AddDictionary extends Component {
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(
          actions.add({ ...values, typeNo: this.props.defaultValue.typeNo },
            this.props.defaultValue, () => this.props.form.resetFields()))
      }
    })
  }
  _handleCancel = () => {
    this.props.dispatch(actions.showAddModalAction(false))
    this.props.form.resetFields()
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='新增数字字典'
        confirmLoading = {this.props.okLoading}
        visible={this.props.showAddModal}
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
              rules: [{
                required: true, message: '请输入项目名',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入项目名'
                maxLength={30}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='项目值：'
            hasFeedback
          >
            {getFieldDecorator('codeValue', {
              rules: [{
                required: true, message: '请输入项目值',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入项目值'
                maxLength={30}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='简拼：'
            hasFeedback
          >
            {getFieldDecorator('codePy', {
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
                maxLength={30}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='排序：'
            hasFeedback
          >
            {getFieldDecorator('orders', {
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
                maxLength={4}
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='备注：'
            hasFeedback
          >
            {getFieldDecorator('remark')(
              <Input.TextArea
                maxLength='500'
                type='text'
                placeholder='请输入备注'
              />
            )}
          </FormItem>
          <FormItem
            {...formItemLayout}
            label='是否有效'
          >
            {getFieldDecorator('isAvailable', {
              initialValue: '1',
            })(
              <Radio.Group>
                {
                  Object.keys(isAvailable).map((item) => {
                    return (
                      <Radio
                        key={item}
                        value={item}
                      >{isAvailable[item]}
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

export default Form.create()(AddDictionary)
