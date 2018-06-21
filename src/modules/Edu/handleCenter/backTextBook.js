import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import storage from '../../../utils/storage'
import { Form, Input, Select, Row, Col, Button, Card, Icon, message } from 'antd'
import styles from './index.less'
import { isEmpty } from 'Utils/lang'

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
const orderPeopleName = storage.get('userInfo')['fullName']
class BackTextBook extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderDetail: '',
      keys: [{
        key: 0,
        amountAll: '',
        orderDetail: [],
      }],
    }
  }

  componentDidMount() {
    this.props.dispatch(actions.sellUser()) // 获取销售人员
    this.props.dispatch(actions.getOrderDetail({
      id: this.props.match.params.orderId,
      detailObjType: '2'
    })).then(res => {
      if (!isEmpty(res) && !isEmpty(res.orderDetail)) {
        let newOrderDetail = res.orderDetail.map((item) => {
          item['originDetailNum'] = item['detailNum']
          return item
        })
        this.setState({ orderDetail: newOrderDetail })
        res.orderDetail.map((item, index) => {
          this._countTotalMoney(index)
        })
      }
    })
  }
  // 计算总价
  _calAllClassPrice = (value, key, orderDetail) => {
    let { keys } = this.state
    let { setFieldsValue } = this.props.form
    let sum = 0
    keys[0]['amountAll'] = value
    keys[0]['orderDetail'] = orderDetail
    keys.map((data) => {
      sum += data.amountAll
    })
    setFieldsValue({ amountAll: sum })
    this.setState({ keys })
  }
  // 教材数量变化
  _handleItemNumChange = (num, index) => {
    let { orderDetail } = this.state
    if (isNaN(num)) {
      message.error('确认你输入的数量是否为数字！')
      return
    }
    let defaultVal = orderDetail[index]['originDetailNum']
    if (parseFloat(num) > parseFloat(defaultVal)) {
      message.error('退教材的数量不能大于已有的数量！')
      return
    }
    if (num <= 0) {
      message.error('退教材的数量不能为0！')
      return
    }
    orderDetail[index]['detailNum'] = num
    this.setState({ orderDetail: orderDetail }, () => {
      this._countTotalMoney(index)
    })
  }
  // 计算价格
  _countTotalMoney = (index) => {
    const { orderDetail } = this.state
    let bookTotal = 0
    orderDetail && orderDetail.forEach(function(item) {
      bookTotal += item.detailUnitPrice * item.detailNum
    })
    this.setState({ bookTotal })
    this._calAllClassPrice(bookTotal, index, orderDetail)
  }
  // 删除教材
  removeBook = index => {
    let { orderDetail, bookTotal } = this.state
    this._calAllClassPrice(bookTotal, index, this.state.orderDetail)
    if (orderDetail.length > 0) {
      orderDetail.splice(index, 1)
      this.setState({ orderDetail: orderDetail }, () => {
        this._countTotalMoney(index)
      })
    }
  }

  // 保存提交
  handleSubmit = (e) => {
    e.preventDefault()
    const { keys } = this.state
    const { form, dispatch, orderDetail } = this.props
    let orderSubItem = []
    keys.forEach((data) => {
      let orderDetail = []
      if (!isEmpty(data.orderDetail)) {
        data.orderDetail.forEach((bookPrice) => {
          orderDetail.push({
            detailType: '4',
            detailObjType: '2',
            detailObjId: bookPrice['detailObjId'],
            detailNum: bookPrice['detailNum'] ? bookPrice['detailNum'] : '',
          })
        })
        orderSubItem = orderDetail
      }
    })
    if (orderSubItem.length <= 0) {
      message.info('请至少保留一个教材！')
      setTimeout(() => {
        window.location.reload()
      }, 1000)
      return
    }
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(actions.backClassBook({
          order: {
            orderChargeType: orderDetail.orderChargeType,
            parentOrderId: this.props.match.params.orderId
          },
          orderDetail: orderSubItem.map((item) => {
            return item
          })
        }))
      }
    })
  }

  render() {
    const {
      getFieldDecorator,
    } = this.props.form
    const {
      orderDetail
    } = this.props
    const {
      orderDetail: newOrderDetail
    } = this.state
    if (isEmpty(orderDetail)) {
      return (
        <span>暂无数据</span>
      )
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
            title='教材选择'
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='教材费'
                >
                  {getFieldDecorator('bookPrice', {
                    initialValue: this.state.bookTotal
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
                {
                  newOrderDetail && newOrderDetail.map((item, index, arr) => {
                    return (
                      <FormItem
                        {...formItemLayout}
                        label='数量'
                        key={item.id}
                      >
                        <Input
                          value={item.detailNum ? item.detailNum : '1'}
                          onChange = {(e) => this._handleItemNumChange(e.target.value, index)}
                          addonAfter={
                            <div>
                              <span>{item.detailUnitPrice }{item.detailUnit}</span>
                              {arr.length > 1 && (
                                <a
                                  onClick={() => this.removeBook(index)}
                                  href='javascript:;'
                                >
                                  &nbsp;&nbsp;
                                  <Icon type='minus-circle-o' />
                                </a>
                              )}
                            </div>
                          }
                        />

                      </FormItem>
                    )
                  })
                }
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
                  {getFieldDecorator('amountAll', {
                    initialValue: 0
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
    sellUser: state.handleCenter.sellUser,
    studentList: state.handleCenter.studentList,
    studentListPage: state.handleCenter.studentListPage,
    coursePriceList: state.handleCenter.coursePriceList,
    coursePrices: state.handleCenter.coursePrices,
    textbookPrices: state.handleCenter.textbookPrices,
    orderDetail: state.handleCenter.orderDetail,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(BackTextBook))
