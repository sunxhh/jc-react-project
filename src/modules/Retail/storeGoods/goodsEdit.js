import React, { Component } from 'react'
import { Form, Button, InputNumber, Select, Row, Col, Radio } from 'antd'
import { isEmpty } from 'Utils/lang'
// import styles from './styles.less'
import Module from './module'

const FormItem = Form.Item
const SelectOption = Select.Option
const RadioGroup = Radio.Group
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 16 },
}
const titleLayout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 14 },
}

class GoodsEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isWeighing: this.props.queryShopGoodsInfo.isWeighing
    }
  }

  // 初始化数据
  componentDidMount() {
  }

  _onChangeIsWeighing = (e) => {
    this.setState({
      isWeighing: e.target.value,
    })
  }

  _confirm = () => {
    const { form, dispatch } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        const reqBean = {
          ...values,
          id: this.props.queryShopGoodsInfo.id.toString(),
          salePrice: values.salePrice.toString(),
        }
        dispatch(Module.actions.editStoreGood(reqBean)).then(res => {
          if (res) {
            this.props.onCancel()
            this.props.getList()
          }
        })
      }
    })
  }

  render() {
    const { queryShopGoodsInfo, queryNoAddCategoryEdit, querySaleUnitList, onCancel } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <div>
        <Form>
          <Row id='rowArea'>
            <Col span={14}>
              <FormItem
                label='商品名称：'
                {...titleLayout}
              >
                <span>{queryShopGoodsInfo.goodsName}</span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                label='SKU编码：'
                {...titleLayout}
              >
                <span>{queryShopGoodsInfo.sku}</span>
              </FormItem>
            </Col>
            <Col span={14}>
              <FormItem
                label='系统分类：'
                {...titleLayout}
              >
                <span>{queryShopGoodsInfo.goodsCatgName}</span>
              </FormItem>
            </Col>
            <Col span={10}>
              <FormItem
                label='统一零售价：'
                {...titleLayout}
              >
                <span>{queryShopGoodsInfo.brandPrice}</span>
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label='前台分类：'
                {...formItemLayout}
              >
                {getFieldDecorator('frontCategoryNo', {
                  initialValue: queryShopGoodsInfo.goodsFrontCatgNo || undefined,
                })(
                  <Select
                    allowClear
                    showSearch
                    optionLabelProp='title'
                    placeholder='请选择前台分类'
                    filterOption={false}
                    getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
                  >
                    {!isEmpty(queryNoAddCategoryEdit) && queryNoAddCategoryEdit.map(shop => (
                      <SelectOption
                        key={shop.categoryNo}
                        value={shop.categoryNo}
                        title={shop.categoryName}
                      >
                        {shop.categoryName}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label='门店零售价：'
                {...formItemLayout}
              >
                {getFieldDecorator('salePrice', {
                  initialValue: queryShopGoodsInfo.salePrice === null ? queryShopGoodsInfo.brandPrice : queryShopGoodsInfo.salePrice,
                  rules: [{
                    required: true,
                    message: '请填写门店零售价!'
                  }]
                })(
                  <InputNumber
                    style={{ width: '430px' }}
                    min={1}
                    step={0.01}
                    placeholder='门店零售价'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={24}>
              <FormItem
                label='销售类型：'
                {...formItemLayout}
              >
                {getFieldDecorator('isWeighing', {
                  initialValue: queryShopGoodsInfo.isWeighing,
                })(
                  <RadioGroup onChange={e => this._onChangeIsWeighing(e)}>
                    <Radio value={'0'}>非称重商品</Radio>
                    <Radio value={'1'}>称重商品</Radio>
                  </RadioGroup>
                )}
              </FormItem>
            </Col>
            {this.state.isWeighing !== '0' &&
              <Col span={24}>
                <FormItem
                  label='1 单位：'
                  {...formItemLayout}
                >
                  {getFieldDecorator('saleUnit', {
                    initialValue: queryShopGoodsInfo.saleUnit,
                    rules: [{
                      required: true,
                      message: '请选择称重单位!'
                    }]
                  })(
                    <Select
                      placeholder='请选择计量单位'
                      getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
                    >
                      {!isEmpty(querySaleUnitList) && querySaleUnitList.map(item => (
                        <SelectOption
                          key={item.saleUnitCode}
                          value={item.saleUnitCode}
                          title={item.saleUnitName}
                        >
                          {'1' + item.saleUnitName}
                        </SelectOption>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
          </Row>
          <div style={{ textAlign: 'right' }}>
            <Button
              onClick={onCancel}
              style={{ marginRight: '15px' }}
            >取消
            </Button>
            <Button
              type='primary'
              style={{ marginRight: '15px' }}
              onClick={() => this._confirm()}
            >确定
            </Button>
          </div>
        </Form>
      </div>
    )
  }
}

export default Form.create()(GoodsEdit)
