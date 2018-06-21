import { Modal } from 'antd'
import React, { Component } from 'react'
import * as actions from './reduck'

const IS_AVAILABLE_NAME = {
  0: '无效',
  1: '有效',
}
class DetailClassRoom extends Component {
  _handleCancel = () => {
    this.props.dispatch(actions.showDetailModalAction(false))
  }

  render() {
    return (
      <Modal
        title='教室设置详情'
        visible={this.props.showDetailModal}
        onCancel={this._handleCancel}
        footer={null}
        style={{ top: '30px' }}
      >
        <p style={{ padding: '10px 0' }}><span>项目名：{this.props.detail.codeName}</span></p>
        <p style={{ padding: '10px 0' }}><span>项目值：{this.props.detail.codeValue}</span></p>
        <p style={{ padding: '10px 0' }}><span>简拼：{this.props.detail.codePy}</span></p>
        <p style={{ padding: '10px 0' }}><span>排序：{this.props.detail.orders}</span></p>
        <p style={{ padding: '10px 0' }}><span>备注：{this.props.detail.remark}</span></p>
        <p style={{ padding: '10px 0' }}><span>是否有效：{IS_AVAILABLE_NAME[this.props.detail.isAvailable]}</span></p>
        <p style={{ padding: '10px 0' }}><span>创建时间：{this.props.detail.createTime}</span></p>
        <p style={{ padding: '10px 0' }}><span>拓展字段1：{this.props.detail.expendField1}</span></p>
        <p style={{ padding: '10px 0' }}><span>拓展字段1：{this.props.detail.expendField2}</span></p>
        <p style={{ padding: '10px 0' }}><span>拓展字段1：{this.props.detail.expendField3}</span></p>
      </Modal>)
  }
}

export default DetailClassRoom
