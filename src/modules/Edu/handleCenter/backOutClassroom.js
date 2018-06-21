import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Select, Row, Col, Button, Card } from 'antd'
import styles from './index.less'
import storage from 'Utils/storage'
import { isEmpty } from 'Utils/lang'
import * as actions from './reduck'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const payStyle = {
  '1': '金诚币',
  '2': '银行卡'
}
const relationType = {
  '1': '父亲',
  '2': '母亲',
  '3': '本人',
}
// const orderHandleId = storage.get('userInfo')['ticket']
const orderPeopleName = storage.get('userInfo')['fullName']
class BackOutClassroom extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }
  componentDidMount() {
    this.props.dispatch(actions.getOrderDetail({
      id: this.props.match.params.orderId,
      detailObjType: '1'
    }))
  }
  // 提交
  handleSubmit = (e) => {
    e.preventDefault()
    const parentOrderId = this.props.match.params.orderId
    const orderChargeType = this.props.orderDetail.orderChargeType
    this.props.form.validateFields((err) => {
      if (!err) {
        this.props.dispatch(actions.backOutClassroom({
          parentOrderId: parentOrderId,
          orderChargeType: orderChargeType,
          orderType: '2'
        }))
      }
    })
  }
  // 取消退班
  _back = () => {
    history.go(-1)
  }
  render() {
    const { getFieldDecorator } = this.props.form
    const { orderDetail } = this.props
    let detailMoney = 0
    let detailNum = 0
    let detailDiscount = 0
    let detailUnitPrice = 0
    let detailUnit = ''

    if (isEmpty(orderDetail)) {
      return (
        <span>赞无数据</span>
      )
    } else {
      orderDetail.orderDetail.map((item) => {
        if (item.detailObjType === '1') {
          detailMoney = item.detailMoney
          detailNum = item.detailNum
          detailDiscount = item.detailDiscount
          detailUnitPrice = item.detailUnitPrice
          detailUnit = item.detailUnit
        }
      })
    }
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <Card
            className={styles['search-container']}
            title='学员选择'
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='编号'
                >
                  {getFieldDecorator('studentNo', {
                    initialValue: orderDetail.studentNo
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='姓名'
                >
                  {getFieldDecorator('name', {
                    initialValue: orderDetail.name
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='联系电话'
                >
                  {getFieldDecorator('linkPhone', {
                    initialValue: orderDetail.linkPhone
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={2}
              >
                <FormItem
                  {...formItemLayout}
                  label=''
                >
                  {getFieldDecorator('linkType', {
                    initialValue: relationType[orderDetail.linkType]
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <Card
            title='班级选择'
          >
            <Row className={styles['class-row']}>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='退出班级'
                >
                  {getFieldDecorator('orderClassName', {
                    initialValue: orderDetail.orderClassName
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                offset={1}
                span={16}
              >
                <Row>
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label='学费'
                    >
                      {getFieldDecorator('detailMoney', {
                        initialValue: detailMoney
                      })(
                        <Input
                          disabled={true}
                          addonAfter={<span>元</span>}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <div>
                      <FormItem
                        {...formItemLayout}
                        label='数量'
                      >
                        {getFieldDecorator('detailNum', {
                          initialValue: detailNum
                        })(
                          <Input
                            disabled={true}
                            addonAfter={<span>{'×' + detailUnitPrice + detailUnit}</span>}
                          />
                        )}
                      </FormItem>
                    </div>
                  </Col>
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label='优惠'
                    >
                      {getFieldDecorator('detailDiscount', {
                        initialValue: detailDiscount
                      })(
                        <Input
                          disabled={true}
                          addonAfter={<span>元</span>}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
                <Row>
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label='剩余学费'
                    >
                      {getFieldDecorator('resMoney', {
                        initialValue: orderDetail.orderRes.resMoney
                      })(
                        <Input
                          disabled={true}
                          addonAfter={<span>元</span>}
                        />
                      )}
                    </FormItem>
                  </Col>
                  <Col span={8}>
                    <div>
                      <FormItem
                        {...formItemLayout}
                        label='数量'
                      >
                        {getFieldDecorator('resClassHour', {
                          initialValue: orderDetail.orderRes.resClassHour
                        })(
                          <Input
                            disabled={true}
                            addonAfter={<span>{'×' + (orderDetail.orderRes.resClassMoney) + '元/课时'}</span>}
                          />
                        )}
                      </FormItem>
                    </div>
                  </Col>
                  <Col span={6}>
                    <FormItem
                      {...formItemLayout}
                      label='优惠'
                    >
                      {getFieldDecorator('resDiscount', {
                        initialValue: orderDetail.orderRes.resDiscount
                      })(
                        <Input
                          disabled={true}
                          addonAfter={<span>元</span>}
                        />
                      )}
                    </FormItem>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col
                span={6}
              >
                <FormItem
                  {...formItemLayout}
                  label='销售员'
                >
                  {getFieldDecorator('orderSalerId', {
                    initialValue: orderDetail.saleName
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='经办人'
                >
                  {getFieldDecorator('orderPeopleName', {
                    initialValue: orderPeopleName
                  })(
                    <Input
                      disabled={true}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='总计'
                >
                  {getFieldDecorator('orderMoney', {
                    initialValue: -orderDetail.orderRes.resMoney
                  })(
                    <Input
                      disabled={true}
                      addonAfter={<span>元</span>}
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
              >
                <FormItem
                  {...formItemLayout}
                  label=''
                >
                  {getFieldDecorator('orderChargeType', {
                    initialValue: orderDetail.orderChargeType
                  })(
                    <Select>
                      {
                        Object.keys(payStyle).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {payStyle[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
          </Card>
          <FormItem className={styles['operate-btn-center']}>
            <Button
              type='primary'
              title='点击保存'
              htmlType='submit'
              loading={this.props.showBtnSpin}
            >
              保存
            </Button>
            <Button
              onClick={() => history.go(-1)}
              title='点击取消'
            >
              取消
            </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    orderDetail: state.handleCenter.orderDetail,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BackOutClassroom))
