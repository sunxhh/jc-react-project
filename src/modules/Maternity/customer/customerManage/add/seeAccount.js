import React, { Component } from 'react'
import { Form, Row, Col, Input } from 'antd'
import { connect } from 'react-redux'
import * as actions from '../reduck'
import style from './index.less'
import Title from './Title'

const FormItem = Form.Item

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

// 账户信息页面
class SeeAccount extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
      isShowType: this.props.match.params.type,
      isSeeInfo: false
    }
  }

  _isSeeInfo = () => {
    if (this.state.isShowType === 'see') {
      this.setState({
        isSeeInfo: true
      })
    }
  }

  componentWillMount() {
    if (this.state.isShowType === 'edit' || this.state.isShowType === 'see') {
      this._isSeeInfo()
      this.props.dispatch(actions.getAccountInfo({ id: this.state.id }))
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { accountInfo } = this.props
    return (
      <div>
        <Title txt='会员信息' />
        <Form id='expectedTime'>
          <div className={style['card-title']}><p>&nbsp;</p></div>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='会员姓名'
              >
                {getFieldDecorator('name', {
                  initialValue: accountInfo && accountInfo.name,
                })(
                  <Input
                    disabled={this.state.isSeeInfo}
                    placeholder=''
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Title txt='资产' />
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='账户总金额'
              >
                {getFieldDecorator('totalAmount', {
                  initialValue: accountInfo && accountInfo.totalAmount + '元',
                })(
                  <Input
                    disabled={this.state.isSeeInfo}
                    placeholder=''
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='可用余额'
              >
                {getFieldDecorator('availableAmount', {
                  initialValue: accountInfo && accountInfo.availableAmount + '元',
                })(
                  <Input
                    disabled={this.state.isSeeInfo}
                    placeholder=''
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Title txt='累计' />
          <Row>
            <Col span={12}>
              <FormItem
                label='累计充值'
                {...formItemLayout}
              >
                {getFieldDecorator('rechargeAmount', {
                  initialValue: accountInfo && accountInfo.rechargeAmount + '元',
                })(
                  <Input
                    disabled={this.state.isSeeInfo}
                    placeholder='累计充值'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='累计提现'
              >
                {getFieldDecorator('withdrawAmount', {
                  initialValue: accountInfo && accountInfo.withdrawAmount + '元',
                })(
                  <Input
                    disabled={this.state.isSeeInfo}
                    placeholder='累计提现'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='累计消费'
              >
                {getFieldDecorator('consumeAmount', {
                  initialValue: accountInfo && accountInfo.consumeAmount + '元',
                })(
                  <Input
                    disabled={this.state.isSeeInfo}
                    placeholder='累计消费'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accountInfo: state.customerManage.getAccountInfo
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(SeeAccount))
