import React, { Component } from 'react'
import { Form, Row, Col, DatePicker, Input, Button, Select, Popover } from 'antd'
import { connect } from 'react-redux'
import style from './index.less'
import moment from 'moment'
import {
  getBasicInfo,
  resetBabyCustomer,
  modifyBabyCustomer,
  getProcessConditions,
} from '../reduck'

const FormItem = Form.Item
const { TextArea } = Input
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const formItemLayoutLarge = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 },
}

class EditBaby extends Component {
  constructor(props) {
    super(props)
    this.state = {
      id: this.props.match.params.id,
    }
  }

  componentWillMount() {
    const { dispatch, match } = this.props
    dispatch(getProcessConditions()).then((data) => {
      if (data.status === 'success') {
        if (match.params && match.params.id) {
          dispatch(getBasicInfo({ id: match.params.id }))
        }
      }
    })
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(resetBabyCustomer())
  }

  disabledDate = (current) => {
    let date = new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + (new Date().getDate())
    let currDate = moment(current).format('YYYY-MM-DD')
    return current && new Date(currDate).valueOf() < new Date(date).valueOf()
  }

  // 获取跟进状态
  _getProcessName = (value) => {
    const processStatus = {
      '0': '未启用',
      '1': '潜在用户',
      '2': '意向用户',
      '3': '签单用户',
      '4': '正式客户'
    }
    if (!value) {
      return ''
    }
    return processStatus[value.toString()]
  }

  _handleSubmit = () => {
    const { match, dispatch, form, history } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        values.birthday = moment(values.birthday).format('YYYY-MM-DD HH:mm:ss')
        dispatch(modifyBabyCustomer({ ...values, id: match.params.id })).then((data) => {
          data.status === 'success' && history.push('/maternity/materCustomerManage')
        })
      }
    })
  }

  _handleCancel = () => {
    const { history } = this.props
    history.push('/maternity/materCustomerManage')
  }

  _renderBtn = () => {
    const { showButtonSpin } = this.props
    return (
      <Row>
        <Col span={16}>
          <FormItem
            className={style['handle-box']}
          >
            <Button
              type='default'
              onClick={this._handleCancel}
            >取消
            </Button>
            <Button
              type='primary'
              loading={showButtonSpin}
              onClick={this._handleSubmit}
            >保存
            </Button>
          </FormItem>
        </Col>

      </Row>
    )
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { getBasicInfo } = this.props
    let babyInfo = getBasicInfo
    return (
      <div>
        <Form >
          <Row id='babyArea'>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='客户编号：'
              >
                <span className='ant-form-text'>{babyInfo.number}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='会员类型：'
              >
                <span className='ant-form-text'>宝宝客户</span>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='跟进阶段：'
              >
                <span className='ant-form-text'>{this._getProcessName(babyInfo.process)}</span>
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='跟进人员：'
              >
                <span className='ant-form-text'>{babyInfo.processorName}</span>
              </FormItem>
            </Col>

          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='会员姓名：'
              >
                {getFieldDecorator(`name`, {
                  initialValue: babyInfo.name ? babyInfo.name : '',
                  rules: [{
                    required: true,
                    message: '请输入会员姓名！'
                  }],
                })(
                  <Input
                    maxLength='20'
                    placeholder= '会员姓名'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='生日：'
              >
                {getFieldDecorator(`birthday`, {
                  initialValue: babyInfo.birthday
                    ? moment(new Date(babyInfo.birthday), 'YYYY-MM-DD')
                    : undefined,
                })(
                  <DatePicker
                    disabledDate={this.disabledDate}
                    getCalendarContainer={() => document.getElementById('babyArea')}
                    style={{ width: '100%' }}
                    format='YYYY-MM-DD'
                    showTime={false}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label='性别：'
              >
                {getFieldDecorator(`sex`, {
                  initialValue: babyInfo.sex ? babyInfo.sex : undefined,
                  rules: [{
                    required: true,
                    message: '请输入宝宝性别'
                  }],
                })(
                  <Select
                    getPopupContainer={() => document.getElementById('babyArea')}
                    placeholder='请选择性别'
                  >
                    <Option value={'0'}>女</Option>
                    <Option value={'1'}>男</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem
                label='住址：'
                {...formItemLayoutLarge}
              >
                <Popover
                  placement='topRight'
                  content={<div className={style['pop']}>{babyInfo && babyInfo.address}</div>}
                  title='住址'
                >
                  <span>{ babyInfo.address && babyInfo.address.length > 45 ? `${babyInfo.address.substring(0, 45)}...` : babyInfo.address}</span>
                </Popover>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={16}>
              <FormItem
                label='备注：'
                {...formItemLayoutLarge}
              >
                {getFieldDecorator(`remark`, {
                  initialValue: babyInfo.remark ? babyInfo.remark : undefined
                })(
                  <TextArea
                    maxLength='500'
                    placeholder='请输入备注'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          {this._renderBtn()}
        </Form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showButtonSpin: state.common.showButtonSpin,
    getBasicInfo: state.customerManage.getBasicInfo,
    processStatusList: state.customerManage.processConditions.processStatusList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(EditBaby))
