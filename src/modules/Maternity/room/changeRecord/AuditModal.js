import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { Modal, Form, Input, Radio } from 'antd'
import * as actions from './reduck'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 }
  },
  wrapperCol: {
    xs: { span: 14 },
    sm: { span: 16 }
  }
}
class AuditModal extends Component {
  _onCancel = () => {
    this.props.dispatch(createAction(actions.swtichShowAuditModal)(false))
    this.props.form.resetFields()
  }
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(
          actions.saveAudit({ ...values, ...this.props.auditProps }, this.props.defaultValue, () =>
            this.props.form.resetFields()
          )
        )
      }
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='转房审核'
        visible={this.props.showAuditModal}
        onCancel={this._onCancel}
        onOk={this._handleOk}
        confirmLoading={this.props.okLoading}
      >
        <Form>
          <FormItem label='审核状态：' {...formItemLayout}>
            {getFieldDecorator('auditStatus', {
              rules: [
                {
                  required: true,
                  message: '请选择审核状态'
                }
              ]
            })(
              <Radio.Group>
                <Radio value='1'>审核通过</Radio>
                <Radio value='2'>驳回</Radio>
              </Radio.Group>
            )}
          </FormItem>
          <FormItem label='备注：' {...formItemLayout}>
            {getFieldDecorator('remark')(<Input.TextArea placeholder='请输入备注' maxLength='500' />)}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AuditModal)
