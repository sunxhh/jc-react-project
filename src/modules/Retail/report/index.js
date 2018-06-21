import React, { Component } from 'react'
import { Table, Form, Row, Col, DatePicker } from 'antd'
import moment from 'moment'

import styles from './styles.less'

import { connect } from '@dx-groups/arthur'
import Module from './module'

const FormItem = Form.Item
const formItemLayout = {
  wrapperCol: { span: 22 },
}

let nowDate = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()

class SaleTimeLine extends Component {
  // 列表
  _columns = [
    {
      key: 'timeLine',
      title: '时间带',
      dataIndex: 'timeLine',
      width: 100,
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'salePrice',
      title: '销售金额',
      dataIndex: 'salePrice',
      width: 80,
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'customerCount',
      title: '来客数',
      dataIndex: 'customerCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'perCustomerTransaction',
      title: '客单价',
      dataIndex: 'perCustomerTransaction',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'totalAmount',
      title: '金额累计',
      dataIndex: 'totalAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'totalCustomer',
      title: '客数累计',
      dataIndex: 'totalCustomer',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getSaleTimeLine({ date: moment(nowDate).format('YYYY-MM-DD') }))
  }

  componentWillUnmount() {
    this._willUnmountListData()
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getOrderListAction([]))
  }

  // 点击查询
  _handleDateChange = (date, dateStr) => {
    // e.preventDefault()
    console.log(date, dateStr)
    const values = {
      date: dateStr,
    }
    const { dispatch } = this.props
    dispatch(Module.actions.getSaleTimeLine(values))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { saleTimeLine, showListSpin } = this.props
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={4}>
              <FormItem
                {...formItemLayout}
              >
                {getFieldDecorator('date', {
                  initialValue: moment(nowDate)
                })(
                  <DatePicker
                    getCalendarContainer={() => document.getElementById('rowArea')}
                    format='YYYY-MM-DD'
                    onChange={this._handleDateChange}
                    allowClear={false}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={3}>
              <FormItem
                {...formItemLayout}
              >
                销售实绩
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='orderNo'
            loading={showListSpin}
            dataSource={saleTimeLine}
            size='small'
            pagination={false}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.report'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.report'], mapStateToProps)(Form.create()(SaleTimeLine))
