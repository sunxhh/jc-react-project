import React, { Component } from 'react'
import { Button, Form, Row, Col, Select, Cascader, Input, DatePicker } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 }
}
const rangeFormItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 }
}
const Option = Select.Option
const RangePicker = DatePicker.RangePicker

class OrderFilter extends Component {
  render() {
    const { businessTypeList, orgList, filter } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form className='search-form'>
        <Row>
          {/* <Col span={7}>
            <FormItem {...formItemLayout} label='订单状态'>
              <div id='orderStatus' style={{ position: 'relative' }}>
                {
                  getFieldDecorator('orderStatus', {
                    initialValue: filter.orderStatus
                  })(
                    <Select allowClear getPopupContainer={() => document.getElementById('orderStatus')}>
                      <Option value=''>全部</Option>
                      {dictionary &&
                        dictionary.orderStatus.map((key, index) => {
                          return (
                            <Option key={key.value} value={key.value}>
                              {key.name}
                            </Option>
                          )
                        })}
                    </Select>
                  )
                }
              </div>
            </FormItem>
          </Col> */}
          <Col span={7}>
            <FormItem {...formItemLayout} label='商品类型'>
              <div id='businessType' style={{ position: 'relative' }}>
                {
                  getFieldDecorator('businessType', {
                    initialValue: [filter.parentBusinessType, filter.businessType]
                  })(
                    <Cascader
                      options={businessTypeList}
                      expandTrigger='hover'
                      placeholder='请选择商品类型'
                      getPopupContainer={() => document.getElementById('businessType')}
                    />
                  )
                }
              </div>
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label='店铺'>
              <div id='merchantUserNo' style={{ position: 'relative' }}>
                {
                  getFieldDecorator('merchantUserNo', {
                    initialValue: filter.merchantUserNo
                  })(
                    <Select
                      showSearch
                      allowClear
                      optionFilterProp='children'
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      getPopupContainer={() => document.getElementById('merchantUserNo')}
                    >
                      <Option value=''>全部</Option>
                      {orgList &&
                        orgList.map(item => {
                          return (
                            <Option key={item.id} value={item.shopId}>
                              {item.shopName || item.orgName}
                            </Option>
                          )
                        })}
                    </Select>
                  )
                }
              </div>
            </FormItem>
          </Col>
          <Col span={7}>
            <FormItem {...formItemLayout} label='订单编号'>
              {
                getFieldDecorator('orderNo', {
                  initialValue: filter.orderNo
                })(
                  <Input placeholder='请输入订单编号' />
                )
              }
            </FormItem>
          </Col>
          <Col span={3}>
            <Button
              type='primary'
              style={{ marginTop: 3 }}
              onClick={() => this.props.handleChange(this.props.form.getFieldsValue())}
            >查询</Button>
          </Col>
        </Row>
        <Row>
          <Col span={7}>
            <FormItem {...formItemLayout} label='用户'>
              {
                getFieldDecorator('userMobile', {
                  rules: [
                    {
                      pattern: /^\d{11}$/,
                      message: '请输入正确的手机号！'
                    }
                  ],
                  initialValue: filter.userMobile
                })(
                  <Input placeholder='请输入用户手机号' />
                )
              }
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem {...rangeFormItemLayout} label='订单时间'>
              <div id='orderTime' style={{ position: 'relative' }}>
                {
                  getFieldDecorator('orderTime', {
                    initialValue: filter.startDate && [moment(filter.startDate), moment(filter.endDate)]
                  })(
                    <RangePicker
                      style={{ width: '100%' }}
                      format='YYYY-MM-DD HH:mm:ss'
                      showTime={{ format: 'HH:mm:ss' }}
                      getPopupContainer={() => document.getElementById('orderTime')}
                    />
                  )
                }
              </div>
            </FormItem>
          </Col>
        </Row>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
    isBtnLoading: state.common.showButtonSpin,
    dictionary: state.orderCenter.order.dictionary,
    orgList: state.orderCenter.order.subOrgList,
    businessTypeList: state.orderCenter.order.businessTypeList,
    filter: state.orderCenter.order.orderFilter || {}
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(OrderFilter)
)
