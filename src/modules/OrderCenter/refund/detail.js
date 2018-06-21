import React, { Component } from 'react'
import {
  Form,
  Card,
  Button,
  Input,
  Table,
  Tag,
  InputNumber,
  Icon
} from 'antd'
import { connect } from 'react-redux'
// import * as actions from './reduck'
import styles from './style.less'
import { genPlanColumn, arrayToMap } from 'Utils/helper'
import { isEmpty } from 'Utils/lang'
import { getRefundOrderDetail, postRefundAudit, getDictionary } from './reduck'
import { AlignCenter } from '../dict'

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

class RefundOrderDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderInfo: {},
      refundNo: this.props.match.params.id,
      textarea: null
    }
  }
  // 生命周期， 初始化表格数据
  componentDidMount() {
    const refundNo = this.state.refundNo
    this.setState({ refundNo })
    // 获取相关字段数据
    this.props.dispatch(getDictionary({ codeKeys: ['refundStatus'] }))
    this.props.dispatch(getRefundOrderDetail({ refundNo }))
  }

  // 生成退单商品明细表
  _getRefundProductList = () => {
    const { detail } = this.props
    const _columns = [
      {
        key: 'img',
        title: '图片',
        className: styles['table-image'],
        dataIndex: 'img',
        ...AlignCenter,
        render: (text, record, index) => <img src={record.img} />
      },
      genPlanColumn('name', '名称', AlignCenter),
      genPlanColumn('refundNum', '退还数量', { ...AlignCenter, width: '15%' }),
      {
        key: 'goodsRefundAmount',
        title: '退还金额',
        ...AlignCenter,
        width: '15%',
        dataIndex: 'goodsRefundAmount',
        render: (text, record, index) => (record.goodsRefundAmount || 0).toFixed(2)
      }
    ]

    return (
      <Table
        size='small'
        columns={_columns}
        dataSource={detail.orderGoodsList}
        bordered
        rowKey='skuNo'
        pagination={false}
      />
    )
  }

  // 提交审批
  _handleSubmit = isAgree => {
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return
      }
      // if (!isAgree && !values.refuseReason) {
      //   message.warn('请输入审批意见')
      //   return
      // }
      const fieldsValue = {
        ...values,
        isAgree: isAgree ? 1 : 0,
        refundNo: this.state.refundNo
      }
      const { dispatch } = this.props
      dispatch(postRefundAudit(fieldsValue))
    })
  }

  render() {
    const { isBtnLoading, detail } = this.props
    const { getFieldDecorator } = this.props.form
    if (isEmpty(detail)) {
      return <Card>暂无数据</Card>
    }

    // 是否是审核入口
    const isAudit =
      this.props.location.state && this.props.location.state.isAudit
    const { dictionary } = this.props
    const refundStatus = (dictionary && dictionary.refundStatus) || []
    const refundStatusMap = arrayToMap(refundStatus, 'value')

    return (
      <div>
        <Card title='退款详情' extra={<a href='javascript:;' onClick={() => history.go(-1)} className={styles['goback']}><Icon type='rollback' />返回</a>}>
          <Form>
            <FormItem {...formItemLayout} label='退款订单编号：' className={styles['clear-margin-bottom']}>
              {detail.refundNo}
            </FormItem>
            <FormItem {...formItemLayout} label='订单编号：' className={styles['clear-margin-bottom']}>
              {detail.orderNo}
            </FormItem>
            <FormItem {...formItemLayout} label='关联退单单号：' className={styles['clear-margin-bottom']}>
              {detail.outRefundNo}
            </FormItem>
            <FormItem
              {...numberItemLayout}
              label='退款金额：'
              hasFeedback={true}
              className={styles['clear-margin-bottom']}
            >
              {detail.status === 4 && isAudit
                ? getFieldDecorator('refundAmount', {
                  rules: [
                    {
                      type: 'number',
                      message: '请输入合法的金额!'
                    },
                    {
                      required: true,
                      message: '请输入退款金额!'
                    }
                  ],
                  initialValue: detail.refundAmount
                })(
                  <InputNumber
                    min={1}
                    placeholder='请输入退款金额'
                    precision={2}
                    disabled={true}
                    className={styles['inline-block']}
                  />
                )
                : (detail.refundAmount || 0).toFixed(2)}
            </FormItem>
            <FormItem {...formItemLayout} label='状态：' className={styles['clear-margin-bottom']}>
              <Tag color='orange'>
                {refundStatusMap[detail.status] &&
                  refundStatusMap[detail.status].name}
              </Tag>
            </FormItem>
            <FormItem {...formItemLayout} label='提交人：' className={styles['clear-margin-bottom']}>
              {detail.createUserName}
            </FormItem>
            <FormItem {...formItemLayout} label='提交时间：' className={styles['clear-margin-bottom']}>
              {detail.applyTime}
            </FormItem>
            <FormItem {...formItemLayout} label='退款说明：' className={styles['clear-margin-bottom']}>
              <div className={styles['word-break-all']}>
                {detail.refundDesc}
              </div>
            </FormItem>
            <FormItem {...formItemLayout} label='商品明细：'>
              {this._getRefundProductList()}
            </FormItem>
            {detail.status === 4 && isAudit &&
              <div>
                <FormItem {...formItemLayout} label='审批意见：' className={styles['clear-margin-bottom']}>
                  {getFieldDecorator('refuseReason', {})(
                    <TextArea
                      placeholder='请输入审批意见'
                      autosize={{ minRows: 3, maxRows: 6 }}
                      ref={node => {
                        this.textarea = node
                      }}
                    />
                  )}
                </FormItem>
                <FormItem {...tailFormItemLayout} className={styles['clear-margin-bottom']}>
                  <Button
                    type='primary'
                    loading={isBtnLoading}
                    onClick={() => this._handleSubmit(true)}
                  >
                    同意
                  </Button>
                  <Button
                    type='default'
                    loading={isBtnLoading}
                    onClick={() => this._handleSubmit(false)}
                  >
                    不同意
                  </Button>
                </FormItem>
              </div>}
            {
              detail.checkUserName &&
              <FormItem {...formItemLayout} label='审批人：' className={styles['clear-margin-bottom']}>
                {detail.checkUserName}
              </FormItem>
            }
            {
              detail.checkTime &&
              <FormItem {...formItemLayout} label='审批时间：' className={styles['clear-margin-bottom']}>
                {detail.checkTime}
              </FormItem>
            }
            {
              detail.status === 5 &&
              <FormItem {...formItemLayout} label='审批意见：' className={styles['clear-margin-bottom']}>
                <div className={styles['word-break-all']}>
                  {detail.refuseReason}
                </div>
              </FormItem>
            }
          </Form>
        </Card>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.orderCenter.refund.refundOrderDetail,
    dictionary: state.orderCenter.refund.dictionary,
    isBtnLoading: state.common.showButtonSpin
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(RefundOrderDetail)
)
