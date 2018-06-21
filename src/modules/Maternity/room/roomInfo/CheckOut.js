import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Form, Input, Button, Card, Select, Row, Col, DatePicker, Spin } from 'antd'
import moment from 'moment'

import { PAGE_SIZE } from '../../pagination'
import * as actions from './reduck'
import styles from './style.less'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class CheckOut extends Component {
  // 设置 props 默认值
  static defaultProps = {
    detail: {},
    roomStatusList: [],
    clearStatusList: [],
    careCenterList: [],
    btnLoading: false,
    detailLoading: false,
    showMotherModal: false,
    motherList: [],
    motherPagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE
    },
    motherId: '',
    motherName: '',
    babyIds: [],
    babyNames: [],
    motherLoading: false,
    comboList: [],
    contractNum: ''
  }

  // 提交处理
  _handleCheckOut = e => {
    e.preventDefault()
    this.props.dispatch(
      actions.addCheckCheckOut({
        recordId: this.props.detail.recordId,
        roomId: this.props.detail.roomId
      })
    )
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    dispatch(actions.getOrderList({ status: 0 }, match.params))
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }
  _cancel = () => {
    history.go(-1)
  }

  // 获取套餐信息
  _getComboNames = () => {
    const { comboList } = this.props
    return isEmpty(comboList) ? '--' : comboList.map((combo, i) => {
      return (
        <a
          key={i}
          style={{ marginRight: '5px' }}
          target='_blank'
          href={`/maternity/packages/see/comboNo/${combo.comboNo}`}
        >
          {combo.comboName}
        </a>
      )
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Spin spinning={this.props.detailLoading}>
        <div>
          <Form onSubmit={this._handleCheckOut}>
            <Card title={<span className={styles['card-tit']}>房间详细信息</span>} className={styles['card-wrapper']} id='rowUser'>
              <Row justify='start' type='flex'>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='房间号：'>
                    {getFieldDecorator('roomNum', {
                      whitespace: true,
                      initialValue: this.props.detail.roomNum,
                      rules: [{ required: true, message: '请输入房间号' }]
                    })(<Input placeholder='请输入房间号' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='房间状态：'>
                    {getFieldDecorator('roomStatus', {
                      initialValue: this.props.detail.roomStatus,
                      rules: [
                        {
                          required: true,
                          message: '请选择房间状态'
                        }
                      ]
                    })(
                      <Select
                        placeholder='请选择房间状态'
                        onChange={this._orgListOnChange}
                        showSearch={true}
                        filterOption={this._filterOption}
                        disabled={true}
                        getPopupContainer={() => document.getElementById('rowUser')}
                      >
                        <SelectOption value='' key='-1' />
                        {this.props.roomStatusList.map(item => {
                          return (
                            <SelectOption key={item.value} value={item.value}>
                              {item.name}
                            </SelectOption>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='在住日期：'>
                    {getFieldDecorator('startTimeWeb', {
                      initialValue: [
                        this.props.detail.startTime && moment(this.props.detail.startTime),
                        this.props.detail.endTime && moment(this.props.detail.endTime)
                      ],
                      rules: [
                        {
                          required: true,
                          message: '请选择在住日期'
                        }
                      ]
                    })(
                      <RangePicker
                        style={{ width: '100%' }}
                        format='YYYY-MM-DD HH:mm:ss'
                        showTime={true}
                        disabled={true}
                        placeholder={['开始日期', '结束日期']}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='妈妈姓名'>
                    {getFieldDecorator('customerName', {
                      initialValue:
                        this.props.detail.recordCustomerList &&
                        this.props.detail.recordCustomerList
                          .map(item => {
                            if (item.customerType === '1') {
                              return item.customerName
                            }
                          })
                          .filter(value => value !== undefined)
                          .join(','),
                      rules: [
                        {
                          required: true,
                          message: '请输入妈妈姓名'
                        }
                      ]
                    })(<Input placeholder='请输入妈妈姓名' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='宝宝姓名：'>
                    {getFieldDecorator('babyNames', {
                      initialValue:
                        this.props.detail.recordCustomerList &&
                        this.props.detail.recordCustomerList
                          .map(item => {
                            if (item.customerType === '0') {
                              return item.customerName
                            }
                          })
                          .filter(value => value !== undefined)
                          .join(',')
                    })(<Input placeholder='请输入宝宝姓名' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='清理状态：'>
                    {getFieldDecorator('clearStatus', {
                      initialValue: this.props.detail.clearStatus,
                      rules: [
                        {
                          required: true,
                          message: '请选择清理状态'
                        }
                      ]
                    })(
                      <Select
                        placeholder='请选择清理状态'
                        showSearch={true}
                        filterOption={this._filterOption}
                        disabled={true}
                        getPopupContainer={() => document.getElementById('rowUser')}
                      >
                        <SelectOption key='-1' value=''>
                          全部
                        </SelectOption>
                        {this.props.clearStatusList.map(item => {
                          return (
                            <SelectOption key={item.value} value={item.value}>
                              {item.name}
                            </SelectOption>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='所在中心：'>
                    {getFieldDecorator('centerId', {
                      initialValue: this.props.detail.centerId,
                      rules: [
                        {
                          required: true,
                          message: '请选择所在中心'
                        }
                      ]
                    })(
                      <Select
                        placeholder='请选择所在中心'
                        showSearch={true}
                        filterOption={this._filterOption}
                        disabled={true}
                        getPopupContainer={() => document.getElementById('rowUser')}
                      >
                        <SelectOption key='-1' value=''>
                          全部
                        </SelectOption>
                        {this.props.careCenterList.map(item => {
                          return (
                            <SelectOption key={item.centerId} value={item.centerId}>
                              {item.centerName}
                            </SelectOption>
                          )
                        })}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='床位护士：'>
                    {
                      this.props.detail.nurseUser
                        ? this.props.detail.nurseUser
                        : '--'
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='合同编号：'>
                    {
                      this.props.detail.contractNum
                        ? <a
                          target='_blank'
                          href={`/maternity/contract/detail/contractNum/${this.props.detail.contractNum}`}
                        >
                          {this.props.detail.contractNum}
                        </a>
                        : '--'
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='所选套餐：'>
                    {
                      this.props.detail.contractComboList && this.props.detail.contractComboList.map((combo, i) => {
                        return (
                          <a
                            key={i}
                            style={{ marginRight: '5px' }}
                            target='_blank'
                            href={`/maternity/packages/see/comboNo/${combo.comboNo}`}
                          >
                            {combo.comboName}
                          </a>
                        )
                      })
                    }
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <Card title={<span className={styles['card-tit']}>账户详细信息</span>} className={styles['card-wrapper']}>
              <Row justify='start' type='flex'>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='账户余额：'>
                    {getFieldDecorator('name', {
                      initialValue: '0.00',
                      whitespace: true,
                      rules: [{ required: true, message: '请输入账户余额：' }]
                    })(<Input placeholder='请输入账户余额' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='已付余额：'>
                    {getFieldDecorator('organizationId', {
                      initialValue: '0.00',
                      rules: [
                        {
                          required: true,
                          message: '请选择房间状态'
                        }
                      ]
                    })(<Input placeholder='请输入已付余额' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='消费金额：'>
                    {getFieldDecorator('courseStartDate', {
                      initialValue: '0.00'
                    })(<Input placeholder='请输入消费金额' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
              </Row>
            </Card>
            <div className={styles['btn-center']}>
              <Button
                type='primary'
                title='退房'
                htmlType='submit'
                loading={this.props.btnLoading}
                disabled={this.props.btnLoading}
              >
                退房
              </Button>
              <Button
                title='点击取消'
                onClick={() => {
                  this._cancel()
                }}
              >
                取消
              </Button>
            </div>
          </Form>
        </div>
      </Spin>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.appointment.detail,
    roomStatusList: state.appointment.roomStatusList,
    clearStatusList: state.appointment.clearStatusList,
    careCenterList: state.appointment.careCenterList,
    comDisabled: state.common.comDisabled,
    btnLoading: state.appointment.btnLoading,
    detailLoading: state.appointment.detailLoading,
    showMotherModal: state.appointment.showMotherModal,
    motherList: state.appointment.motherList,
    motherPagination: state.appointment.motherPagination,
    motherId: state.appointment.motherId,
    motherName: state.appointment.motherName,
    babyIds: state.appointment.babyIds,
    babyNames: state.appointment.babyNames,
    motherLoading: state.appointment.motherLoading,
    comboList: state.appointment.comboList,
    contractNum: state.appointment.contractNum,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CheckOut))
