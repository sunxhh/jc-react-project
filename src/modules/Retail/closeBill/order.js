import React, { Component } from 'react'
import { Table, Form, Row, Col, Button, Popover } from 'antd'

import styles from './styles.less'
import { RETAIL_BILL, RETAIL_BILL_ORDER_DETAIL } from 'Global/urls'
import moment from 'moment'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'

const orderStatus = {
  '0': '待付款',
  '1': '已支付',
  '2': '已退款',
  '3': '已取消',
}

class BillOrderList extends Component {
  // 默认props
  static defaultProps = {
    list: [],
  }

  // 列表
  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.orderPage
        return (
          <span>{(currentPage - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'orderNo',
      title: '订单号',
      dataIndex: 'orderNo',
      width: 100,
      render: (text, record) => {
        return (
          <div className={styles['basic-a']}>
            <a
              href='javascript:;'
              onClick={(e) => { this._detail(e, record) }}
            >
              {text && text !== 'null' && text}
            </a>
          </div>
        )
      }
    },
    {
      key: 'orderStatus',
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 80,
      render: (text, record) => {
        return (
          <p className={styles['item-content']}>{text && text !== 'null' && orderStatus[text]}</p>
        )
      }
    },
    {
      key: 'cerateTime',
      title: '下单时间',
      dataIndex: 'cerateTime',
      width: 80,
      render: (text, record) => (
        <span>{moment(record.cerateTime).format('YYYY-MM-DD HH:mm:ss')}</span>
      )
    },
    {
      key: 'orderAmount',
      title: '应收金额',
      dataIndex: 'orderAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'amount',
      title: '实收金额',
      dataIndex: 'amount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text }</span>
        )
      }
    },
    {
      key: 'discountAmount',
      title: '优惠金额',
      dataIndex: 'discountAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'refundAmount',
      title: '退款金额',
      dataIndex: 'refundAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'refundNo',
      title: '退款编号',
      dataIndex: 'refundNo',
      width: 80,
    },
    {
      key: 'createUser',
      title: '下单人',
      dataIndex: 'createUser',
      width: 80,
    },
    {
      key: 'orgName',
      title: '所属门店',
      dataIndex: 'orgName',
      width: 90,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'orderSource',
      title: '订单来源',
      dataIndex: 'orderSource',
      width: 80,
    },
    {
      key: 'payTime',
      title: '付款时间',
      dataIndex: 'payTime',
      width: 80,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'applyTime',
      title: '退货时间',
      dataIndex: 'applyTime',
      width: 80,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'orderDesc',
      title: '备注',
      dataIndex: 'orderDesc',
      width: 80,
      render: (text) => {
        return (
          <Popover
            content = {<div>{text}</div>}
            title = '备注'
            placement='topLeft'
          >
            <span>{text && text.length > 5 ? `${text.substring(0, 5)}...` : text}</span>
          </Popover>)
      }
    },
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._getList()
  }

  componentWillUnmount() {
    if (!location.pathname.startsWith(RETAIL_BILL_ORDER_DETAIL)) {
      this._willUnmountQueryArgData()
      this._willUnmountListData()
    }
  }

  _willUnmountQueryArgData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryParOrder({
      orderNo: ''
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getBillOrderListAction({
      list: [],
    }))
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getBillOrderList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.currentPage, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
      accountNo: this.props.match.params.accountNo,
    }
  }

  _setQueryParOrder = () => {
    const { dispatch } = this.props
    const arg = this._getParameter()
    dispatch(Module.actions.setQueryParOrder(arg))
  }

  // 点击查询
  _handleQuery = () => {
    this._setQueryParOrder()
    this._getList(1)
  }

  // 查看
  _detail = (e, record) => {
    const { history } = this.props
    history.push(`${RETAIL_BILL_ORDER_DETAIL}/${record.orderNo}`)
  }

  // 返回
  _return = (e) => {
    const { history } = this.props
    history.push(`${RETAIL_BILL}`)
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  render() {
    const { orderList, orderPage, showListSpin } = this.props
    const pagination = genPagination(orderPage)

    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={2}>
              <Button
                type='primary'
                onClick={(e) => { this._return(e) }}
              >返回
              </Button>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='orderNo'
            loading={showListSpin}
            dataSource={orderList}
            size='small'
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.closeBill'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.closeBill'], mapStateToProps)(Form.create()(BillOrderList))
