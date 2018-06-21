import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Form, Input, Button, Card, Select, Row, Col, DatePicker, Icon } from 'antd'

import { PAGE_SIZE } from '../../pagination'
import * as actions from './checkChangeReduck'
import RoomModal from './RoomInfoRoomModal'
import styles from './style.less'
import moment from 'moment'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class CheckChange extends Component {
  // 设置 props 默认值
  static defaultProps = {
    detail: {},
    roomStatusList: [],
    clearStatusList: [],
    careCenterList: [],
    btnLoading: false,
    showRoomModal: false,
    roomList: [],
    roomPagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE
    },
    roomLoading: false,
  }

  // 提交处理
  _handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(
          actions.roomChangeSave({
            recordId: this.props.detail.recordId,
            centerId: this.props.detail.centerIdChange,
            roomId: this.props.detail.roomIdChange,
            roomNum: this.props.detail.roomNumChange,
            clearStatus: this.props.detail.clearStatusChange
          })
        )
      }
    })
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    dispatch(actions.getRoomSelectList({ status: 0 }, match.params))
  }

  componentWillUnmount() {}

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  _showModal = () => {
    const { dispatch } = this.props
    dispatch(createAction(actions.showRoomModalAction)(true))
    dispatch(
      actions.getRoomModal({
        offFlag: 0,
        isLock: 1,
        roomStatus: 1,
        currentPage: this.props.roomPagination.current,
        pageSize: this.props.roomPagination.pageSize
      })
    )
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
      <div>
        <RoomModal
          showRoomModal={this.props.showRoomModal}
          roomList={this.props.roomList}
          dispatch={this.props.dispatch}
          roomPagination={this.props.roomPagination}
          roomLoading={this.props.roomLoading}
          roomId={this.props.roomId}
          roomNum={this.props.roomNum}
          centerId={this.props.centerId}
          centerName={this.props.centerName}
          clearStatus={this.props.clearStatus}
          careCenterList={this.props.careCenterList}
          parentForm={this.props.form}
        />
        <div>
          <Form onSubmit={this._handleSubmit} id='rowUser'>
            <Card title={<span className={styles['card-tit']}>原住房</span>} className={styles['card-wrapper']}>
              <Row justify='start' type='flex'>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='房间号：'>
                    {getFieldDecorator('roomNum', {
                      whitespace: true,
                      initialValue: this.props.detail.roomNum
                    })(<Input placeholder='请输入房间号' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='房间状态：'>
                    {getFieldDecorator('roomStatus', {
                      initialValue: this.props.detail.roomStatus
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
                      initialValue: [moment(this.props.detail.startTime), moment(this.props.detail.endTime)]
                    })(
                      <RangePicker
                        style={{ width: '100%' }}
                        format='YYYY-MM-DD'
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
                        .join(',')
                    })(<Input placeholder='请输入妈妈姓名' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='宝宝姓名：'>
                    {getFieldDecorator('babyNames', {
                      initialValue: this.props.detail.recordCustomerList
                        ? this.props.detail.recordCustomerList
                          .map(item => {
                            if (item.customerType === '0') {
                              return item.customerName
                            }
                          })
                          .filter(item => item !== undefined)
                          .join(',')
                        : ''
                    })(<Input placeholder='请输入宝宝姓名' maxLength='50' disabled={true} />)}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='清理状态：'>
                    {getFieldDecorator('clearStatus', {
                      initialValue: this.props.detail.clearStatus
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
                      initialValue: this.props.detail.centerId
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
            <Card title={<span className={styles['card-tit']}>更换房间</span>} className={styles['card-wrapper']}>
              <Row justify='start' type='flex'>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='所在中心：'>
                    {getFieldDecorator('centerIdChange', {
                      initialValue: this.props.detail.centerIdChange,
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
                  <FormItem {...formItemLayout} label='房间号：'>
                    {getFieldDecorator('roomNumChange', {
                      whitespace: true,
                      initialValue: this.props.detail.roomNumChange,
                      rules: [{ required: true, message: '请输入房间号' }]
                    })(
                      <Input
                        placeholder='请输入房间号'
                        maxLength='50'
                        disabled={true}
                        addonAfter={<Icon type='plus' onClick={this._showModal} />}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='清理状态：'>
                    {getFieldDecorator('clearStatusChange', {
                      initialValue: this.props.detail.clearStatusChange,
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
                          message: '请输入已付余额'
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
                title='点击保存'
                htmlType='submit'
                loading={this.props.btnLoading}
                disabled={this.props.btnLoading}
              >
                保存
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
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    detail: state.roomChange.detail,
    roomStatusList: state.roomChange.roomStatusList,
    clearStatusList: state.roomChange.clearStatusList,
    careCenterList: state.roomChange.careCenterList,
    comDisabled: state.common.comDisabled,
    btnLoading: state.roomChange.btnLoading,
    showRoomModal: state.roomChange.showRoomModal,
    roomList: state.roomChange.roomList,
    roomPagination: state.roomChange.roomPagination,
    roomLoading: state.roomChange.roomLoading,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(CheckChange))
