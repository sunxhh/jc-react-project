import React, { Component } from 'react'
import { Form, Card, Button, Input, Table, InputNumber, Tag, Icon } from 'antd'
import { connect } from 'react-redux'
import styles from './style.less'
import { genPlanColumn } from 'Utils/helper'
import { isEmpty, trim } from 'Utils/lang'
import { AlignCenter } from '../dict'
import { getOrderDetail } from '../order/reduck'
import { applyRefund } from './reduck'

const FormItem = Form.Item
const TextArea = Input.TextArea
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 }
}

const numberItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 6 }
}

const tailFormItemLayout = {
  wrapperCol: {
    span: 14,
    offset: 6
  }
}

class ApplyRefund extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderCenterNo: this.props.match.params.id,
      refundAmount: 0,
      maxRefundAmount: 0,
      orderInfo: null
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const orderCenterNo = this.state.orderCenterNo
    this.props.dispatch(getOrderDetail({ orderCenterNo }))
  }

  // 生成商品行列表
  _getRefundProductList = () => {
    const { orderInfo } = this.props
    const _columns = [
      {
        key: 'img',
        title: '图片',
        ...AlignCenter,
        className: styles['table-image'],
        dataIndex: 'img',
        render: (text, record, index) => record.img && <img src={record.img} />
      },
      genPlanColumn('name', '名称', { ...AlignCenter, width: 100 }),
      {
        key: 'num',
        title: '退货数量',
        dataIndex: 'num',
        ...AlignCenter,
        width: 100
      },
      {
        key: 'price',
        title: '成交价',
        ...AlignCenter,
        dataIndex: 'price',
        width: 100,
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
        width: 150
      }
    ]

    return (
      <Table
        size='small'
        columns={_columns}
        dataSource={orderInfo.goodsRes}
        bordered
        rowKey='skuNo'
        pagination={false}
      />
    )
  }

  // 计算退货总金额
  _getRefundAmount = () => {
    const { orderInfo } = this.props
    let refundAmount = 0
    orderInfo.goodsRes.map(item => {
      refundAmount += (item.refundNum || item.num) * item.price
    })
    // 保存退款金额
    this.setState({
      refundAmount: refundAmount,
      maxRefundAmount: refundAmount
    })
    // 设置退款金额
    this.props.form.setFieldsValue({
      refundAmount: refundAmount
    })
  }

  // 提交退款申请
  _handleSubmit = e => {
    e.preventDefault()
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      const { orderInfo } = this.props
      const fieldsValue = {
        ...values,
        refundDesc: trim(values.refundDesc),
        orderNo: orderInfo.orderRes.orderNo,
        orderCenterNo: orderInfo.orderRes.orderCenterNo,
        refundType: 1, //  申请退款类型（1 仅退款 2 退货退款）
        refundSource: 0, //  申请退款来源（0 b端 1 c端）
        goodsFlag: 0, //  0 按单退款 1 商品行退款
        orderGoodsList: this._getRefundGoodsList()
      }
      const { dispatch } = this.props
      dispatch(applyRefund(fieldsValue))
    })
  }

  // 获取需要退款的商品列表
  _getRefundGoodsList = () => {
    const { orderInfo } = this.props
    const { selectedRowKeys } = this.state
    if (isEmpty(selectedRowKeys)) {
      return []
    }
    const refundGoodsList = orderInfo.goodsRes
      .filter(item => {
        return selectedRowKeys.indexOf(item.skuNo) >= 0
      })
      .map(item => {
        return {
          skuNo: item.skuNo,
          refundNum: item.refundNum || item.num
        }
      })
    return refundGoodsList
  }

  _isInRange = (rule, value, callback) => {
    if (isEmpty(value)) {
      callback()
      return
    }
    const objReg = /(^[0-9]{1,9}$)|(^[0-9]{1,9}[\.]{1}[0-9]{1,2}$)/
    if ((String(value) && !objReg.test(value)) || parseFloat(value) < 0) {
      callback('请输入合法的退款金额!')
      return
    }

    const { orderInfo } = this.props
    const maxRefundAmount =
      orderInfo.orderRes.amount - orderInfo.orderRes.applyRefundAmount
    if (parseFloat(value) > maxRefundAmount) {
      callback('超出可退金额上限!')
      return
    }
    callback()
  }

  render() {
    const { isBtnLoading, orderInfo } = this.props
    const { getFieldDecorator } = this.props.form
    if (isEmpty(orderInfo)) {
      return <Card>暂无数据</Card>
    }

    const maxRefundAmount =
      orderInfo.orderRes.amount > orderInfo.orderRes.applyRefundAmount
        ? orderInfo.orderRes.amount - orderInfo.orderRes.applyRefundAmount
        : 0

    return (
      <div>
        <Card title='退款申请' extra={<a href='javascript:;' onClick={() => history.go(-1)} className={styles['goback']}><Icon type='rollback' />返回</a>}>
          <Form onSubmit={this._handleSubmit}>
            <FormItem {...formItemLayout} label='订单编号：'>
              {orderInfo.orderRes.orderNo}
            </FormItem>
            <FormItem {...formItemLayout} label='商品明细：'>
              {this._getRefundProductList()}
            </FormItem>
            <FormItem {...numberItemLayout} label='退款金额：' hasFeedback>
              {getFieldDecorator('refundAmount', {
                rules: [
                  {
                    required: true,
                    message: '请输入退款金额！'
                  },
                  {
                    validator: this._isInRange
                  }
                ],
                initialValue: maxRefundAmount
              })(
                <InputNumber
                  placeholder='请输入退款金额'
                  min={0}
                  max={maxRefundAmount}
                  precision={2}
                  className={styles['inline-block']}
                />
              )}
            </FormItem>
            <FormItem {...formItemLayout} label='退款原因：' hasFeedback>
              {getFieldDecorator('refundDesc', {
                rules: [
                  {
                    required: true,
                    message: '请输入退款原因！'
                  }
                ]
              })(
                <TextArea
                  placeholder='请输入退款原因'
                  autosize={{ minRows: 3, maxRows: 6 }}
                />
              )}
            </FormItem>
            <FormItem {...tailFormItemLayout}>
              <Button type='primary' loading={isBtnLoading} htmlType='submit'>
                提交
              </Button>
              <Button type='default' onClick={() => history.go(-1)}>
                取消
              </Button>
            </FormItem>
          </Form>
        </Card>
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    orderInfo: state.orderCenter.order.orderDetail,
    isBtnLoading: state.common.showButtonSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(ApplyRefund)
)
