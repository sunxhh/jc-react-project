import React, { Component } from 'react'
import { createAction } from 'redux-actions'
import { Modal, Table, Form, Input, Button } from 'antd'
import * as actions from './reduck'
import { PAG_CONFIG } from '../../pagination'
import styles from './style.less'

const FormItem = Form.Item

class MotherModel extends Component {
  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      width: 80,
      render: (text, record, index) => {
        const { pageSize, current } = this.props.motherPagination
        return <span>{pageSize * current + (index + 1) - pageSize}</span>
      }
    },
    {
      title: '妈妈名称',
      dataIndex: 'name',
      key: 'name',
      width: 80
    },
    {
      title: '账户余额',
      dataIndex: 'availableAmount',
      key: 'availableAmount',
      width: 80
    },
    {
      title: '消费金额',
      dataIndex: 'consumeAmount',
      key: 'consumeAmount',
      width: 80
    },
    {
      title: '已付金额',
      dataIndex: 'rechargeAmount',
      key: 'rechargeAmount',
      width: 80
    },
    {
      title: '宝宝名称',
      dataIndex: 'babyList',
      key: 'babyList',
      width: 80,
      render: (text, record, index) => {
        return record.babyList.map(item => item.name).join(',')
      }
    }
  ]

  // 获取查询条件里面的 value 值
  _getQueryParameter = (
    current = this.props.motherPagination.current,
    pageSize = this.props.motherPagination.pageSize
  ) => {
    return { ...this.props.form.getFieldsValue(), currentPage: current, pageSize: pageSize }
  }

  // 发起列表查询的 ACTION
  _handleAction = (page, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(page, pageSize)
    arg.process = 4
    arg.type = 1
    dispatch(actions.getMombabyinfoList(arg))
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
    const { dispatch } = this.props
    // 1-25版本 同步合同编号及套餐信息
    dispatch(actions.queryContractByCustomerId({ customerId: selectedRows[0].id })).then((data) => {
      let comboList = []
      let contractNum = null
      let motherId = ''
      let motherName = ''
      let babyIds = []
      let babyNames = []
      if (data.status === 'success') {
        comboList = data.result.comboList
        contractNum = data.result.contractNum
        motherId = selectedRows[0].id
        motherName = selectedRows[0].name
        babyIds = selectedRows[0].babyList.map(item => item.id)
        babyNames = selectedRows[0].babyList.map(item => item.name)
      }
      dispatch(
        createAction(actions.getMotherInfo)({
          comboList,
          contractNum,
          motherId,
          motherName,
          babyIds,
          babyNames,
        })
      )
    })
    this.props.parentForm.resetFields(['customerName', 'babyNames'])
    this._onCancel()
  }

  _getSelectCourseNames = arr => {
    return arr.map(item => {
      return item.courseName
    })
  }

  _onCancel = () => {
    this.props.dispatch(createAction(actions.switchShowMotherModalAction)(false))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const _rowSelection = {
      type: 'radio',
      // selectedRowKeys: this.props.selectedRowKeys,
      onChange: this._onSelectChange
    }
    return (
      <Modal
        title='选择客户'
        visible={this.props.showMotherModal}
        width={900}
        bodyStyle={{ width: '900px' }}
        footer={false}
        onCancel={this._onCancel}
      >
        <Form layout='inline'>
          <FormItem label='妈妈名称：' className={styles['search-form-item']}>
            {getFieldDecorator('name')(<Input placeholder='请输入妈妈名称' />)}
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
          loading={this.props.motherLoading}
          rowKey='id'
          dataSource={this.props.motherList}
          onChange={this._handlePagination}
          rowSelection={_rowSelection}
          scroll={{
            x: 820,
            y: 300
          }}
          pagination={{ ...this.props.motherPagination, ...PAG_CONFIG }}
        />
      </Modal>
    )
  }
}

export default Form.create()(MotherModel)
