import { createAction } from 'redux-actions'
import { Form, Input, Modal, Select } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 }
  },

  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 }
  }
}

class AddRoom extends Component {
  _handleOk = () => {
    this.props.form.validateFields((errors, values) => {
      if (!errors) {
        this.props.dispatch(actions.add(values, this._handleOkCancel))
      }
    })
  }

  _handleOkCancel = () => {
    this.props.handleBack && this.props.handleBack()
    this._handleCancel()
  }

  _handleCancel = () => {
    this.props.dispatch(createAction(actions.showAddModalAction)(false))
    this.props.form.resetFields()
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Modal
        title='新增房间'
        confirmLoading={this.props.okLoading}
        visible={this.props.showAddModal}
        onOk={this._handleOk}
        onCancel={this._handleCancel}
        style={{ top: '30px' }}
        okText='确定'
        cancelText='取消'
      >
        <Form id={'rowArea'}>
          <FormItem {...formItemLayout} label='房间号：' hasFeedback>
            {getFieldDecorator('roomNum', {
              rules: [
                {
                  required: true,
                  message: '请输入房间号'
                }
              ]
            })(<Input type='text' placeholder='请输入房间号' maxLength='10' />)}
          </FormItem>
          <FormItem {...formItemLayout} label='房间状态：' hasFeedback>
            {getFieldDecorator('roomStatus', {
              rules: [
                {
                  required: true,
                  message: '请选择房间状态'
                }
              ]
            })(
              <Select
                placeholder='请选择房间状态'
                showSearch={true}
                filterOption={this._filterOption}
                getPopupContainer={() => document.getElementById('rowArea')}
              >
                <Select.Option key='' value=''>
                  请选择
                </Select.Option>
                {this.props.roomStatusList.map(item => {
                  return (
                    <Select.Option
                      key={item.value}
                      value={item.value}
                      disabled={item.value !== '0' && item.value !== '1' && true}
                    >
                      {item.name}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
          <FormItem {...formItemLayout} label='所属中心：' hasFeedback>
            {getFieldDecorator('centerId', {
              rules: [
                {
                  required: true,
                  message: '请选择所属中心'
                }
              ]
            })(
              <Select
                placeholder='请选择所属中心'
                showSearch={true}
                filterOption={this._filterOption}
                getPopupContainer={() => document.getElementById('rowArea')}
              >
                <Select.Option key='' value=''>
                  请选择
                </Select.Option>
                {this.props.careCenterList.map(item => {
                  return (
                    <Select.Option key={item.centerId} value={item.centerId}>
                      {item.centerName}
                    </Select.Option>
                  )
                })}
              </Select>
            )}
          </FormItem>
        </Form>
      </Modal>
    )
  }
}

export default Form.create()(AddRoom)
