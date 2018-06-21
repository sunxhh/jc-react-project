import React, { Component } from 'react'
import {
  Form,
  Row,
  Col,
  Card,
  Tabs,
  Table,
  Tag,
  Button,
  Icon,
  Popover
} from 'antd'
import { connect } from 'react-redux'
import { getOrderDetail, getDictionary } from './reduck'
import styles from './style.less'
import { genPlanColumn } from 'Utils/helper'
import { isEmpty } from 'Utils/lang'
import { ORDER_CENTER_REFUND } from 'Global/urls'
import { AlignCenter, OrderShowStatus } from '../dict'

const FormItem = Form.Item
const TabPane = Tabs.TabPane
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class OrderDetail extends Component {
  constructor(props) {
    super(props)

    this.state = {
      orderCenterNo: this.props.match.params.id
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    // 获取相关字段数据
    this.props.dispatch(getDictionary({ codeKeys: ['orderStatus'] }))
    this.props.dispatch(
      getOrderDetail({ orderCenterNo: this.state.orderCenterNo })
    )
  }

  _handleViewRefunds = () => {
    const { history, detail } = this.props
    history.push({
      pathname: ORDER_CENTER_REFUND,
      state: {
        orderNo: detail.orderRes.orderNo
      }
    })
  }

  // 根据各业务方、订单内部状态、支付状态、发货状态、退款状态显示订单外部状态
  _getOrderStatusText = detail => {
    const showStatausConfig = OrderShowStatus.default
    return (
      showStatausConfig[
        `${detail.orderStatus}_${detail.payStatus}_${detail.refundStatus}`
      ] || '异常状态'
    )
  }

  _getLangItem = (text, title, len) => {
    text = text || ''
    if (text.length <= len) {
      return (
        <span>
          {text}
        </span>
      )
    }
    return (
      <Popover content={text} trigger='hover' title={title}>
        {text.substring(0, len) + '...'}
      </Popover>
    )
  }

  render() {
    const { detail } = this.props
    if (isEmpty(detail)) {
      return <Card>暂无数据</Card>
    }

    const _columns = [
      {
        key: 'productImageUrl',
        title: '图片',
        ...AlignCenter,
        className: styles['table-image'],
        dataIndex: 'productImageUrl',
        render: (text, record, index) => record.img && <img src={record.img} />
      },
      genPlanColumn('name', '名称', AlignCenter),
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

    // 订单外部状态：订单内部状态_订单支付状态_订单退款状态
    const outOrderStatus = `${detail.orderRes.orderStatus}_${detail.orderRes
      .payStatus}_${detail.orderRes.refundStatus}`
    return (
      <div>
        <Card
          title='基本信息'
          extra={
            <a
              href='javascript:;'
              onClick={() => history.go(-1)}
              className={styles['goback']}
            >
              <Icon type='rollback' />返回
            </a>
          }
        >
          <Row gutter={16}>
            <Col span={12}>
              <Tabs>
                <TabPane key='order' tab={<h4>订单信息</h4>}>
                  <Form>
                    <FormItem
                      {...formItemLayout}
                      label='订单编号：'
                      className={styles['clear-margin-bottom']}
                    >
                      {this._getLangItem(detail.orderRes.orderNo, '订单编号', 32)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label='关联编号：'
                      className={styles['clear-margin-bottom']}
                    >
                      {this._getLangItem(detail.orderRes.orderCenterNo, '关联编号', 32)}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label='订单状态：'
                      className={styles['clear-margin-bottom']}
                    >
                      <Tag color='orange'>
                        {this._getOrderStatusText(detail.orderRes)}
                      </Tag>
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label='创建时间：'
                      className={styles['clear-margin-bottom']}
                    >
                      {detail.orderRes.dateCreated}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label='下单用户：'
                      className={styles['clear-margin-bottom']}
                    >
                      {detail.orderRes.userNo}
                    </FormItem>
                    <FormItem
                      {...formItemLayout}
                      label='买家留言：'
                      className={styles['clear-margin-bottom']}
                    >
                      {detail.orderRes.buyerNote}
                    </FormItem>
                  </Form>
                </TabPane>
              </Tabs>
            </Col>
            {/* {
              detail.orderRes.orderStatus === 1 &&
              <Col span={6}>
                <Tabs>
                  <TabPane key='delivery' tab={<h4>收件人</h4>}>
                    <Form className={styles['order-detail-form']}>
                      <FormItem
                        {...formItemLayout}
                        label='物流方式：'
                        className={styles['clear-margin-bottom']}
                      >
                        {detail.orderRes.logisticsWay}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='物流单号：'
                        className={styles['clear-margin-bottom']}
                      >
                        {detail.orderRes.logisticsNo}
                      </FormItem>
                    </Form>
                    <Divider />
                    <Form className={styles['order-detail-form']}>
                      <FormItem
                        {...formItemLayout}
                        label='收货人：'
                        className={styles['clear-margin-bottom']}
                      >
                        {detail.addressRes.userNo}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='收件地址：'
                        className={styles['clear-margin-bottom']}
                      >
                        {detail.addressRes.addressDetail}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='联系电话：'
                        className={styles['clear-margin-bottom']}
                      >
                        {detail.addressRes.mobile}
                      </FormItem>
                    </Form>
                  </TabPane>
                </Tabs>
              </Col>
            } */}
            {detail.orderRes.orderStatus === 1 &&
              <Col span={12}>
                <Tabs>
                  <TabPane key='pay' tab={<h4>付款信息</h4>}>
                    <Form className={styles['order-detail-form']}>
                      <FormItem
                        {...formItemLayout}
                        label='付款方式：'
                        className={styles['clear-margin-bottom']}
                      >
                        {detail.orderRes.payType}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='支付时间：'
                        className={styles['clear-margin-bottom']}
                      >
                        {detail.orderRes.payTime}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='支付订单：'
                        className={styles['clear-margin-bottom']}
                      >
                        {this._getLangItem(detail.orderRes.payNo, '支付订单', 32)}
                      </FormItem>
                      <FormItem
                        {...formItemLayout}
                        label='付款金额：'
                        className={styles['clear-margin-bottom']}
                      >
                        {(detail.orderRes.amount || 0).toFixed(2)}
                      </FormItem>
                    </Form>
                  </TabPane>
                </Tabs>
              </Col>}
          </Row>
        </Card>
        <h4 className={styles['product-title']}>商品信息</h4>
        <Tabs>
          <TabPane
            key='detail'
            tab={
              <h4>
                商铺名称: {detail.orderRes.merchantUserName}
              </h4>
            }
          >
            <Table
              columns={_columns}
              dataSource={detail.goodsRes}
              bordered
              rowKey='skuNo'
              pagination={false}
            />
          </TabPane>
        </Tabs>
        <div className={styles['clear']}>
          <Form className={styles['order-pay']}>
            <FormItem
              {...formItemLayout}
              label='商品总额：'
              className={styles['clear-margin-bottom']}
            >
              {(detail.orderRes.amount || 0).toFixed(2)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='店铺优惠：'
              className={styles['clear-margin-bottom']}
            >
              <span className={styles['color-red']}>
                {detail.orderRes.discountAmount ? '-' : ''}
                {(detail.orderRes.discountAmount || 0).toFixed(2)}
              </span>
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='运费：'
              className={styles['clear-margin-bottom']}
            >
              {(detail.orderRes.freightAmount || 0).toFixed(2)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label='应付金额：'
              className={styles['clear-margin-bottom']}
            >
              {(detail.orderRes.orderAmount || 0).toFixed(2)}
            </FormItem>
          </Form>
        </div>
        {outOrderStatus === '1_3_2' &&
          <Row type='flex' justify='center'>
            <Col span={4}>
              <Button type='primary' onClick={this._handleViewRefunds}>
                查看退款订单
              </Button>
            </Col>
          </Row>}
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    detail: state.orderCenter.order.orderDetail,
    dictionary: state.orderCenter.order.dictionary
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(OrderDetail)
)
