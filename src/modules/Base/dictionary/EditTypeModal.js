import { Form, Input, Modal } from 'antd'
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

class EditType extends Component {
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(actions.updType({ ...values, uuid: this.props.uuid, typeNo: this.props.typeNo }, () => this.props.form.resetFields()))
      }
    })
  }
  _handleCancel = () => {
    this.props.dispatch(actions.showEditTypeModalAction(false))
    this.props.form.resetFields()
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='编辑分类'
        confirmLoading = {this.props.okLoading}
        visible={this.props.showEditTypeModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
      >
        <Form>
          <FormItem
            {...formItemLayout}
            label='分类名称：'
            hasFeedback
          >
            {getFieldDecorator('typeName', {
              initialValue: this.props.typeName && String(this.props.typeName.split('-')[0]),
              rules: [{
                required: true, message: '请输入分类名称',
              }, {
                max: 10, message: '最多输入10个字符',
              }, {
                pattern: /^[\u4E00-\u9FA5A-Za-z0-9]{1,}$/,
                message: '只能输入中文、字母、数字',
              }],
            })(
              <Input
                type='text'
                placeholder='请输入分类名称'
              />
            )}
          </FormItem>
        </Form>
      </Modal>)
  }
}

export default Form.create()(EditType)
