import React, { Component } from 'react'
import { Form, Input, Row, Col, Icon, Tooltip, message } from 'antd'
import styles from './index.less'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import BookSelect from './bookSelect'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}
const formItemLayoutNum = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

class bookItem extends Component {
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
      classPage: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      },
      bookPage: {
        currentPage: 1,
        total: 0,
        pageSize: 10
      }
    }
  }

  // 教材表格单元选择
  onSelectChangeBook = (selectedRowKeys, selectedRows, onCancel) => {
    let { textbookPrices } = this.state
    this.props.classIdInfo.push(selectedRows[0].id)
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
    let { textbookPrices, feeTotal, bookTotal } = this.state
    this.props.classIdInfo.splice(index, 1)
    const { calTotalPrice, itemKey } = this.props
    calTotalPrice({ value: bookTotal + feeTotal, index: itemKey, textbookPrices: textbookPrices })
    if (textbookPrices.length > 0) {
      textbookPrices.splice(index, 1)
      this.setState({ textbookPrices: textbookPrices }, () => {
        this._getBookPrice()
      })
    } else {
      calTotalPrice({ value: 0 + feeTotal, index: itemKey, textbookPrices: this.state.textbookPrices })
    }
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
  // 计算教材费
  _getBookPrice = () => {
    const { textbookPrices, feeTotal } = this.state
    const { calTotalPrice, itemKey } = this.props
    let bookTotal = 0
    textbookPrices && textbookPrices.map((item) => {
      if (isNaN(item.amount)) {
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
    if (num <= 0) {
      message.info('购教材的数量最低为1！')
      textbookPrices[index]['amount'] = 1
      return
    }
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

  render() {
    const {
      getFieldDecorator,
      remove,
    } = this.props
    return (
      <div>
        <Row className={styles['class-row']}>
          <Col span={18}>
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
                        {...formItemLayoutNum}
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
export default bookItem

