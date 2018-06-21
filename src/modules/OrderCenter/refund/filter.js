import React, { Component } from 'react'
import { Button, Form, Row, Col, Select, Input } from 'antd'
import { connect } from 'react-redux'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 }
}
const Option = Select.Option

class RefundFilter extends Component {
  render() {
    const { dictionary, filter } = this.props
    const { getFieldDecorator } = this.props.form
    return (
      <Form className='search-form'>
        <Row>
          <Col span={6}>
            <FormItem {...formItemLayout} label='订单状态'>
              <div id='status' style={{ position: 'relative' }}>
                {
                  getFieldDecorator('status', {
                    initialValue: filter.status
                  })(
                    <Select allowClear getPopupContainer={() => document.getElementById('status')}>
                      <Option value=''>全部</Option>
                      {dictionary &&
                        dictionary.refundStatus.map((key, index) => {
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
          </Col>
          <Col span={8}>
            <FormItem {...formItemLayout} label='退款订单编号'>
              {
                getFieldDecorator('refundNo', {
                  initialValue: filter.refundNo
                })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={8} >
            <FormItem {...formItemLayout} label='商品订单编号'>
              {
                getFieldDecorator('orderNo', { initialValue: filter.orderNo })(
                  <Input />
                )
              }
            </FormItem>
          </Col>
          <Col span={2}>
            <Button
              type='primary'
              style={{ marginTop: 3 }}
              onClick={() => this.props.handleChange(this.props.form.getFieldsValue())}
            >查询</Button>
          </Col>
        </Row>
      </Form>
    )
  }
}
const mapStateToProps = state => {
  return {
    isBtnLoading: state.common.showButtonSpin,
    filter: state.orderCenter.refund.refundFilter || {},
    dictionary: state.orderCenter.refund.dictionary
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(
  Form.create()(RefundFilter)
)
