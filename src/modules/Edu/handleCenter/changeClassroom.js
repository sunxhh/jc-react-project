import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as actions from './reduck'
import storage from '../../../utils/storage'
import { Form, Input, Select, Row, Col, Button, Card, Icon, Tooltip, message } from 'antd'
import styles from './index.less'
import ClassItem from './classItem'
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
// 获取当前登陆者的id和名字
const orderHandleId = storage.get('userInfo')['ticket']
const orderPeopleName = storage.get('userInfo')['fullName']
class ChangeClassroom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      classid: 0,
      keys: [{
        key: 0,
        initVal: [],
        totalPrice: 0,
        textbookPrices: [],
        orderClassId: '',
        orderClassName: '',
        feeData: {},
      }],
      studentId: '',
      visible: false,
      orderHandleId: orderHandleId,
      studentName: '',
      isRepeat: [],
    }
  }

  componentDidMount() {
    this.props.dispatch(actions.sellUser()) // 获取销售人员
    this.props.dispatch(actions.getOrderDetail({
      id: this.props.match.params.orderId,
      detailObjType: '1'
    }))
  }
  // 计算总价
  _calAllClassPrice = (param) => {
    let { keys } = this.state
    let { setFieldsValue } = this.props.form
    let sum = 0
    const newKeys = keys.map((item) => {
      if (item.key === param.index) {
        item['totalPrice'] = param.value
        item['textbookPrices'] = param.textbookPrices
        if (param.feeData) {
          item['feeData'] = param.feeData
        }
      }
      if (item.orderClassId) {
        sum += item.totalPrice
      }
      return item
    })

    this.setState({ keys: newKeys })
    setFieldsValue({ amountAll: (this._defaultVal() + sum).toFixed(2) })
  }

  // 设置所选班级
  _setOrder = (param) => {
    const { keys } = this.state
    const finalKeys = keys.map(item => {
      if (item.key === param.index) {
        item['orderClassId'] = param.orderClassId
        item['orderClassName'] = param.orderClassName
      }
      return item
    })
    this.setState({ keys: finalKeys })
  }

  // 姓名表格选项
  _columns = [
    {
      title: '序号',
      dataIndex: 'rowNo',
      key: 'rowNo',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.studentListPage
        return (
          <span>
            {
              pageSize *
              currentPage +
              (index + 1) -
              pageSize
            }
          </span>
        )
      }
    },
    {
      title: '编号',
      dataIndex: 'studentNo',
      key: 'studentNo'
    },
    {
      title: '姓名',
      dataIndex: 'name',
      key: 'name'
    },
    {
      title: '联系电话',
      dataIndex: 'linkPhone',
      key: 'linkPhone'
    }
  ]
  // 增加班级
  addClassroom = () => {
    if (this.state.keys.some(item => !item.orderClassId)) {
      message.warn(' 请先选择班级后再继续添加！')
      return
    }
    this.setState({
      classid: this.state.classid += 1
    })
    const classItem = {
      key: this.state.classid,
      initVal: []
    }
    this.state.keys.push(classItem)
  }
  // 删除班级
  remove = (key, index) => {
    let { keys, isRepeat } = this.state
    let { getFieldValue, setFieldsValue } = this.props.form
    const allPrice = getFieldValue('amountAll')
    let newSum = allPrice
    const finalKeys = keys.filter((item, keyIndex) => {
      if (key === item.key) {
        if (item.orderClassId) {
          newSum -= item.totalPrice
        }
        return false
      }
      return true
    })
    setFieldsValue({ 'amountAll': newSum })
    const finalIsRepeat = isRepeat.filter((rr, ri) => ri !== index)
    this.setState({
      keys: finalKeys,
      isRepeat: finalIsRepeat,
    })
  }

  // 编辑提交
  handleSubmit = (e) => {
    e.preventDefault()
    const { form, dispatch } = this.props
    let { isRepeat } = this.state
    const tempRepeat = [...isRepeat]
    let repeatArr = tempRepeat.sort()

    for (let i = 0; i < repeatArr.length; i++) {
      if (repeatArr[i] === repeatArr[i + 1]) {
        message.error('相同的班级不能重复报！')
        return
      }
    }
    form.validateFields((err, values) => {
      if (!err) {
        dispatch(actions.changesClassroom(this.getParameters(values)))
      }
    })
  }
  _defaultVal = () => {
    return -(this.props.orderDetail.orderRes.resMoney)
  }

  _handleSelect = (index, classId) => {
    const { isRepeat } = this.state
    let finalIsRepeat = []
    if (isRepeat[index]) {
      finalIsRepeat = isRepeat.map((item, i) => {
        if (i === index) {
          return classId
        }
        return item
      })
    } else {
      finalIsRepeat = [...isRepeat, classId]
    }

    this.setState({ isRepeat: finalIsRepeat })
  }

  // 获取提交参数
  getParameters = (values) => {
    const { keys } = this.state
    const { orderDetail } = this.props
    let orderSub = []
    keys.forEach((data) => {
      let orderSubItem = {}
      let orderDetail = []
      orderSubItem['orderClassId'] = data['orderClassId']
      orderSubItem['orderClassName'] = data['orderClassName']
      if (!isEmpty(data.textbookPrices)) {
        data.textbookPrices.forEach((bookPrice) => {
          orderDetail.push({
            detailType: '3',
            detailObjType: '2',
            detailObjId: bookPrice['id'],
            detailNum: bookPrice['amount'] ? bookPrice['amount'] : 1,
            detailDiscount: '0'
          })
        })
      }
      orderDetail.push(data.feeData)
      orderSubItem['orderDetail'] = orderDetail
      orderSub.push(orderSubItem)
    })
    let param = {
      order: {
        orderSub,
        studentId: orderDetail.studentId,
        orderSalerId: orderDetail.orderSalerId,
        orderHandleId: orderHandleId,
        orderType: 1,
        orderChargeType: orderDetail.orderChargeType,
        parentOrderId: this.props.match.params.orderId
      }
    }
    return param
  }

  render() {
    const {
      getFieldDecorator,
      setFieldsValue,
      getFieldValue
    } = this.props.form
    const {
      coursePriceList,
      textbookPrices,
      coursePrices,
      orderDetail
    } = this.props
    let detailMoney = 0
    let detailNum = 0
    let detailDiscount = 0
    let detailUnitPrice = 0
    let detailUnit = ''
    if (isEmpty(orderDetail)) {
      return (
        <span>暂无数据</span>
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
            extra={
              <Tooltip
                placement='top'
                title={<span>增加班级</span>}
              >
                <a
                  href='javascript:;'
                  style={{ fontSize: '20px' }}
                  onClick={this.addClassroom}
                >
                  <Icon type='plus' />
                </a>
              </Tooltip>
            }
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
                            addonAfter={<span>{'×' + orderDetail.orderRes.resClassMoney + '元/课时'}</span>}
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
            <div id='classItem'>
              {
                this.state.keys.map((item, index) => {
                  return (
                    <ClassItem
                      getFieldDecorator={getFieldDecorator}
                      getFieldValue={getFieldValue}
                      setFieldsValue={setFieldsValue}
                      textbookPrices={textbookPrices[index]}
                      coursePrices={coursePrices[index]}
                      coursePriceList={coursePriceList}
                      dispatch={this.props.dispatch}
                      key={item.key}
                      index={index}
                      itemKey={item.key}
                      remove={() => this.remove(item.key, index)}
                      keys={this.state.keys}
                      totalPrice={item.totalPrice}
                      calTotalPrice = {this._calAllClassPrice}
                      setOrder = {this._setOrder}
                      isRepeat = {this.state.isRepeat}
                      onSelect={this._handleSelect}
                    />
                  )
                })
              }
            </div>
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
                    initialValue: this._defaultVal()
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
    orderDetail: state.handleCenter.orderDetail,
    coursePriceList: state.handleCenter.coursePriceList,
    coursePrices: state.handleCenter.coursePrices,
    textbookPrices: state.handleCenter.textbookPrices,
    showBtnSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(ChangeClassroom))
