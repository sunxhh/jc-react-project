import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Pagination, Card, Tag, Button, Popover } from 'antd'
import { Link } from 'react-router-dom'
import style from './style.less'
import { isEmpty } from 'Utils/lang'
import { genPagination, genPlanColumn } from 'Utils/helper'
import { ORDER_CENTER_ORDER_DETAIL, ORDER_CENTER_REFUND_ADD } from 'Global/urls'
import { AlignCenter, CS_PIN_CODE, OrderShowStatus } from '../dict'
import storage from 'Utils/storage'

class List extends Component {
  _handlePageChange = (page, pageSize) => {
    this.props.pageChange && this.props.pageChange(page, pageSize)
  }

  // 根据各业务方、订单内部状态、支付状态、发货状态、退款状态显示订单外部状态
  _getOrderStatusText = detail => {
    const showStatausConfig = OrderShowStatus.default
    return showStatausConfig[`${detail.orderStatus}_${detail.payStatus}_${detail.refundStatus}`] || '异常状态'
  }

  render() {
    const _columns = [
      {
        key: 'img',
        title: '图片',
        className: style['table-image'],
        ...AlignCenter,
        dataIndex: 'img',
        render: (text, record, index) => record.img && <img src={record.img} />
      },
      genPlanColumn('name', '名称', { ...AlignCenter }),
      genPlanColumn('num', '数量', { ...AlignCenter, width: '10%' }),
      {
        key: 'price',
        title: '单价',
        ...AlignCenter,
        width: '10%',
        dataIndex: 'price',
        render: (text, record, index) => (record.price || 0).toFixed(2)
      },
      {
        key: 'scale',
        title: '规格',
        dataIndex: 'scale',
        render: (text, record, index) => {
          return (
            !isEmpty(record.scale) &&
            Object.keys(record.scale).map((key, index) => {
              return (
                <div key={index}>
                  <Tag>{`${key}:${record.scale[key]}`}</Tag>
                </div>
              )
            })
          )
        },
        width: '25%'
      }
    ]

    const { list, page, auths, path } = this.props
    const btnRole = auths[path] ? auths[path] : []
    if (isEmpty(list)) {
      return <Card>暂无数据</Card>
    }
    const pagination = genPagination(page)
    const userInfo = storage.get('userInfo')
    return (
      <div className='table-list'>
        {list.map((item, index) => {
          return (
            <Table
              key={index}
              className={style['table-bottom']}
              columns={_columns}
              dataSource={item.goodsRes}
              bordered
              rowKey='_rowKey'
              pagination={false}
              title={() => {
                return (
                  <div>
                    <div>
                      <span className={`${style['order-n']} ${style['order-n-25']}`}>
                        创建时间：{item.orderRes.dateCreated}
                      </span>
                      <span className={`${style['order-n']} ${style['order-n-35']}`}>
                        <Popover content={item.orderRes.orderNo} trigger='hover' title='订单编号'>
                          订单编号：{item.orderRes.orderNo}
                        </Popover>
                      </span>
                      <span className={`${style['order-n']} ${style['order-n-25']}`}>
                        <Popover content={item.orderRes.merchantUserName} trigger='hover' title='店铺名称'>
                          店铺名称：{item.orderRes.merchantUserName}
                        </Popover>
                      </span>
                      <Tag color='orange' className={style['float-right']}>
                        {this._getOrderStatusText(item.orderRes)}
                      </Tag>
                    </div>
                    <div>
                      <span className={`${style['order-n']} ${style['order-n-25']}`}>
                        <Popover content={item.orderRes.userNo} trigger='hover' title='下单用户'>
                          下单用户：{item.orderRes.userNo}
                        </Popover>
                      </span>
                      <span className={`${style['order-n']} ${style['order-n-35']}`}>
                        订单金额：{(item.orderRes.orderAmount || 0).toFixed(2)}
                      </span>
                    </div>
                  </div>
                )
              }}
              footer={() => {
                // const pinCodeInfo = PinCodeMap[item.orderRes.pinCode] || {}
                return (
                  <div className={style['table-footer']}>
                    {btnRole.includes('check') &&
                      <Button type='primary' className={style['float-right']}>
                        <Link
                          to={`${ORDER_CENTER_ORDER_DETAIL}/${item.orderRes.orderCenterNo}`}
                        >
                          查看
                        </Link>
                      </Button>}
                    {btnRole.includes('apply') &&
                      userInfo.orgCode !== 'jccy' && // 超级管理员不可以申请退款
                      item.orderRes.pinCode !== CS_PIN_CODE && // 慈善订单不可申请退款
                      `${item.orderRes.orderStatus}_${item.orderRes.payStatus}_${item.orderRes.refundStatus}` === '1_3_0' &&
                      <Button type='default' className={style['float-right']}>
                        <Link
                          to={`${ORDER_CENTER_REFUND_ADD}/${item.orderRes.orderCenterNo}`}
                        >
                          退款
                        </Link>
                      </Button>}
                  </div>
                )
              }}
            />
          )
        })}
        <div className={style['page-right']}>
          <Pagination
            {...pagination}
            onChange={this._handlePageChange}
            showSizeChanger={false}
          />
        </div>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    list: state.orderCenter.order.orderList,
    page: state.orderCenter.order.orderPage,
    auths: state.common.auths,
    dictionary: state.orderCenter.order.dictionary
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(List)
