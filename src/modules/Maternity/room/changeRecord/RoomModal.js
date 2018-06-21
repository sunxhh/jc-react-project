import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { Modal, Table, Form, Input, Button } from 'antd'

import * as actions from './updChangeReduck'
import { PAG_CONFIG } from '../../pagination'
import styles from './style.less'

const FormItem = Form.Item

class RoomModel extends Component {
  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      width: 80,
      render: (text, record, index) => {
        const { pageSize, current } = this.props.roomPagination
        return <span>{pageSize * current + (index + 1) - pageSize}</span>
      }
    },
    {
      title: '房间号',
      dataIndex: 'roomNum',
      key: 'roomNum',
      width: 200
    },
    {
      title: '所属中心',
      dataIndex: 'centerId',
      key: 'centerId',
      render: centerId =>
        this.props.careCenterList
          .map(item => {
            if (centerId === item.centerId) {
              return item.centerName
            }
          })
          .filter(value => value !== undefined)
          .join()
    }
  ]

  // 获取查询条件里面的 value 值
  _getQueryParameter = (current = this.props.roomPagination.current, pageSize = this.props.roomPagination.pageSize) => {
    return {
      ...this.props.form.getFieldsValue(),
      offFlag: 0,
      isLock: 1,
      roomStatus: 1,
      currentPage: current,
      pageSize: pageSize
    }
  }

  // 发起列表查询的 ACTION
  _handleAction = (page, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(page, pageSize)
    dispatch(actions.getRoomModal(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = e => {
    this._handleAction()
  }

  // 点击分页时获取表格数据
  _handlePagination = page => {
    this._handleAction(page.current, page.pageSize)
  }

  _onSelectChange = (selectedRowKeys, selectedRows) => {
    this.props.dispatch(
      createAction(actions.getRoomModalInfo)({
        centerIdChange: selectedRows[0].centerId,
        centerNameChange: selectedRows[0].centerName,
        roomIdChange: selectedRows[0].roomId,
        roomNumChange: selectedRows[0].roomNum,
        clearStatusChange: selectedRows[0].clearStatus,
        roomStatusChange: selectedRows[0].roomStatus
      })
    )
    this._onCancel()
  }

  _getSelectCourseNames = arr => {
    return arr.map(item => {
      return item.courseName
    })
  }

  _onCancel = () => {
    this.props.dispatch(createAction(actions.showRoomModalAction)(false))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const _rowSelection = {
      type: 'radio',
      onChange: this._onSelectChange
    }
    return (
      <Modal
        title='选择房间'
        visible={this.props.showRoomModal}
        width={900}
        bodyStyle={{ width: '900px' }}
        footer={false}
        onCancel={this._onCancel}
      >
        <Form layout='inline'>
          <FormItem label='房间号：' className={styles['search-form-item']}>
            {getFieldDecorator('roomNum')(<Input placeholder='请输入房间号' />)}
          </FormItem>
          <FormItem className={styles['search-form-item']}>
            <Button
              type='primary' onClick={this._handleSubmit} icon='search'
              style={{ marginBottom: '20px' }}
            >
              查询
            </Button>
          </FormItem>
        </Form>
        <Table
          bordered={true}
          columns={this._columns}
          loading={this.props.roomLoading}
          rowKey='roomId'
          dataSource={this.props.roomList}
          onChange={this._handlePagination}
          rowSelection={_rowSelection}
          scroll={{
            x: 820,
            y: 300
          }}
          pagination={{ ...this.props.roomPagination, ...PAG_CONFIG }}
        />
      </Modal>
    )
  }
}

export default Form.create()(RoomModel)
