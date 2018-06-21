import React, { Component } from 'react'
import { Form, Input, Row, Col, Icon, Tooltip, InputNumber, message } from 'antd'
import styles from './index.less'
import * as actions from './reduck'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import ClassSelect from './classSelect'
import BookSelect from './bookSelect'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class ClassItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      className: '',
      textBookTitle: '',
      feeTotal: 0,
      detailDiscountTotal: 0,
      feeNum: 1,
      fee: 0,
      bookTotal: 0,
      textbookPrices: [],
      feeType: [],
      hasSetFromStore: false,
      classItemInfo: [],
      classPage: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
        totalCount: 0,
      },
      bookPage: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      a: ''
    }
  }

  // 班级表格单元选择
  onSelectChangeClass = (selectedRowKeys, selectedRows, onCancel) => {
    const { setFieldsValue, dispatch, itemKey, setOrder, calTotalPrice, index, onSelect } = this.props
    let { feeNum, detailDiscountTotal } = this.state
    this.setState({ hasSetFromStore: false })
    setFieldsValue({
      ['orderClassName' + this.props.itemKey]: selectedRows[0].name,
    })
    dispatch(actions.getClassBook({
      classId: selectedRows[0].id
    }, index)).then((res) => {
      const fee = res.length > 0 ? res[0].fee : ''
      let feeData = {
        detailType: '1',
        detailObjType: '1',
        detailObjId: res[0].id,
        detailNum: feeNum,
        detailDiscount: detailDiscountTotal
      }
      let textbookPrices = 0
      if (res.length === 1) {
        this.setState({ textbookPrices: [], bookTotal: 0 })
      } else {
        res.forEach(item => {
          if (item.type === '2') {
            textbookPrices += (item.fee * item.amount)
          }
        })
        let finalBookTotal = 0
        const textbookPricesArr = res.filter(item => {
          if (item.type === '2') {
            finalBookTotal += item.amount * item.fee
            return true
          }
          return false
        })

        this.setState({
          fee: fee,
          feeTotal: fee,
          textbookPrices: textbookPricesArr,
          bookTotal: finalBookTotal
        })
      }
      calTotalPrice({ value: fee + textbookPrices, index: itemKey, textbookPrices: res.filter(item => item.type === '2'), feeData })
      // 设置学费
      this.props.setFieldsValue({
        ['fee' + this.props.itemKey]: fee
      })
    })

    onSelect && onSelect(index, selectedRows[0].id)
    onCancel && onCancel()
    setOrder({ orderClassId: selectedRows[0].id, orderClassName: selectedRows[0].name, index: itemKey })
  }

  // 教材表格单元选择
  onSelectChangeBook = (selectedRowKeys, selectedRows, onCancel) => {
    let { textbookPrices } = this.state
    textbookPrices.push({
      fee: selectedRows[0].salePrice,
      unit: selectedRows[0].textBookTitle,
      type: '2',
      id: selectedRows[0].id,
    })
    if (this.state.textbookPrices.length > 0) {
      this.setState({ textbookPrices: this.state.textbookPrices }, () => {
        this._getBookPrice()
      })
    }
    onCancel && onCancel()
    this.setState({ textbookPrices })
  }

  // 删除教材
  removeBook = index => {
    let { textbookPrices, feeTotal } = this.state
    const { calTotalPrice, itemKey } = this.props
    // calTotalPrice({ value: bookTotal + feeTotal, index: itemKey, textbookPrices: textbookPrices })
    const finalTextbookPrices = [...textbookPrices]
    if (finalTextbookPrices.length > 0) {
      finalTextbookPrices.splice(index, 1)
      this.setState({ textbookPrices: finalTextbookPrices }, () => {
        this._getBookPrice()
      })
    } else {
      calTotalPrice({ value: 0 + feeTotal, index: itemKey, textbookPrices: finalTextbookPrices })
    }
  }

  // 班级选择弹窗
  renderClassModal = (e) => {
    e.preventDefault()
    showModalWrapper(
      (
        <ClassSelect
          dispatch={this.props.dispatch}
          onSelectChangeClass={this.onSelectChangeClass}
        />
      ),
      {
        title: '班级选择',
        width: 1200,
      }
    )
  }

  // 教材选择弹窗
  renderTextBookModal = (e) => {
    e.preventDefault()
    showModalWrapper(
      (
        <BookSelect
          dispatch={this.props.dispatch}
          onSelectChangeBook={this.onSelectChangeBook}
        />
      ),
      {
        title: '教材选择',
        width: 1200,
      }
    )
  }
  // 计算费用
  _handleOnChangeFee = (value, type) => {
    let { feeNum, detailDiscountTotal, feeTotal, fee, bookTotal, textbookPrices } = this.state
    const { calTotalPrice, itemKey, coursePrices } = this.props
    let feeData = ''
    if (typeof value !== 'number' || value === '') {
      message.info('确认你输入的数量或优惠是否正确，数量最小为1，优惠最小为0元！')
      return
    }
    if (!isEmpty(coursePrices)) {
      feeData = {
        detailType: '1',
        detailObjType: '1',
        detailObjId: coursePrices[0].id,
        detailNum: feeNum,
        detailDiscount: value
      }
    }
    if (type === 1) {
      feeNum = value
    } else if (type === 2) {
      // if (value < fee) {
      //   detailDiscountTotal = value
      // }
      detailDiscountTotal = value
    }
    // 计算学费
    feeTotal = (feeNum * fee) - detailDiscountTotal
    this.setState({
      feeNum,
      detailDiscountTotal,
      feeTotal,
    })
    calTotalPrice({ value: bookTotal + feeTotal, index: itemKey, textbookPrices: textbookPrices, feeData })
    this.props.setFieldsValue({
      ['fee' + this.props.itemKey]: feeTotal,
    })
  }
  // 计算教材费
  _getBookPrice = () => {
    const { textbookPrices, feeTotal } = this.state
    const { calTotalPrice, itemKey } = this.props
    let bookTotal = 0
    textbookPrices && textbookPrices.forEach((item) => {
      // if (isNaN(item.amount)) {
      if (Object.prototype.toString.call(item.amount) !== '[object Number]') {
        item.amount = 1
      }
      bookTotal += item.fee * item.amount
    })
    this.setState({ bookTotal })
    calTotalPrice({ value: bookTotal + feeTotal, index: itemKey, textbookPrices: textbookPrices })
  }

  // 教材数量变化
  _handleItemNumChange = (num, index) => {
    let { textbookPrices } = this.state
    textbookPrices[index]['amount'] = num
    this.setState({ textbookPrices: textbookPrices }, () => {
      this._getBookPrice()
    })
  }

  componentWillReceiveProps(nextProps) {
    const { textbookPrices } = nextProps
    const { hasSetFromStore } = this.state
    if (textbookPrices && textbookPrices.length > 0 && !hasSetFromStore) {
      this.setState({ textbookPrices: JSON.parse(JSON.stringify(textbookPrices)), hasSetFromStore: true }, () => {
        this._getBookPrice()
      })
    }
  }

  _feeValidator = (rule, value, callback) => {
    if (parseFloat(value) < 0) {
      callback('优惠金额不能大于学费！')
    }
    callback()
  }

  render() {
    const {
      getFieldDecorator,
      remove,
      coursePrices,
    } = this.props
    return (
      <div>
        <Row className={styles['class-row']}>
          <Col span={5}>
            <FormItem
              {...formItemLayout}
              label='班级名称'
            >
              {getFieldDecorator(`orderClassName${this.props.itemKey}`, {
                rules: [{
                  required: true,
                  message: '班级名称不能为空！'
                }]
              })(
                <Input
                  placeholder='请输入班级名称'
                  disabled={true}
                  addonAfter={
                    <a
                      onClick={this.renderClassModal}
                      href='javascript:;'
                    >
                      <Icon
                        type='plus'
                        title='点击添加班级'
                      />
                    </a>
                  }
                />
              )}
            </FormItem>
          </Col>
          <Col
            span={18}
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='学费'
                >
                  {getFieldDecorator(`fee${this.props.itemKey}`, {
                    initialValue: this.state.feeTotal,
                    rules: [{
                      validator: this._feeValidator
                    }]
                  })(
                    <Input
                      disabled={true}
                      addonAfter={<span>元</span>}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={9}>
                <div>
                  <FormItem
                    {...formItemLayout}
                    label='数量'
                  >
                    {getFieldDecorator(`feeNum${this.props.itemKey}`, {
                      initialValue: this.state.feeNum
                    })(
                      <InputNumber
                        min={1}
                        precision={1}
                        maxLength={9}
                        onChange={value => this._handleOnChangeFee(value, 1)}
                        name={`feeNum${this.props.itemKey}`}
                      />
                    )}
                    <span>{coursePrices && coursePrices.length > 0 ? coursePrices[0].fee + coursePrices[0].unit : ''}</span>
                  </FormItem>
                </div>
              </Col>
              <Col span={9}>
                <FormItem
                  {...formItemLayout}
                  label='优惠'
                >
                  {getFieldDecorator(`detailDiscount${this.props.itemKey}`, {
                    initialValue: this.state.detailDiscountTotal
                  })(
                    <InputNumber
                      precision={2}
                      min={0}
                      maxLength={12}
                      onChange={value => this._handleOnChangeFee(value, 2)}
                      name={`detailDiscount${this.props.itemKey}`}
                    />
                  )}
                  <span>元</span>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='教材费'
                >
                  {getFieldDecorator(`bookPrice${this.props.itemKey}`, {
                    initialValue: this.state.bookTotal
                  })(
                    <Input
                      disabled={true}
                      addonAfter={<span>元</span>}
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8} >
                {
                  this.state.textbookPrices && this.state.textbookPrices.map((item, index) => {
                    return (
                      <FormItem
                        {...formItemLayout}
                        label='数量'
                        key={item.id}
                      >
                        <Input
                          value={item.amount ? item.amount : '1'}
                          onChange = {(e) => this._handleItemNumChange(e.target.value, index)}
                          addonAfter={
                            <div>
                              <span>{item.fee }<Tooltip placement='top' title={item.unit}>{ item.unit.length > 4 ? `${item.unit.substring(0, 4)}...` : item.unit }</Tooltip></span>
                              <a
                                onClick={() => this.removeBook(index)}
                                href='javascript:;'
                              >
                                &nbsp;&nbsp;
                                <Icon type='minus-circle-o' />
                              </a>
                            </div>
                          }
                        />

                      </FormItem>
                    )
                  })
                }
                <Col
                  offset={8}
                  span={16}
                >
                  <Input
                    placeholder='请选择教材'
                    className={styles['price']}
                    disabled={true}
                    addonAfter={
                      <span onClick={this.renderTextBookModal}>
                        <Icon
                          type='plus'
                          title='点击添加'
                        />
                      </span>
                    }
                  />
                </Col>
              </Col>
            </Row>
          </Col>
          <Tooltip
            placement='top'
            title={<span>删除班级</span>}
          >
            <a
              href='javascript:;'
              style={{ fontSize: '20px' }}
              className={styles['del-icon']}
              onClick={remove}
            >
              <Icon
                type='minus'
                style={this.props.keys && this.props.keys.length === 1 ? { display: 'none' } : { display: 'block', marginTop: '10px' }}
              />
            </a>
          </Tooltip>
        </Row>
      </div>
    )
  }
}
export default ClassItem

