import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Form, Input, Button, Card, Select, Row, Col, DatePicker, Spin, Icon } from 'antd'
import moment from 'moment'

import MotherModel from './MotherModel'
import ModalSelectInput from 'Components/modal/ModalSelectInput'
import { PAGE_SIZE } from '../../pagination'
import * as actions from './reduck'
import styles from './style.less'
import api from '../../apis'
import { isEmpty } from 'Utils/lang'
import { fetchMaternity as fetchData } from 'Utils/fetch'

const FormItem = Form.Item
const RangePicker = DatePicker.RangePicker
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 }
}

class Appointment extends Component {
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
    motherLoading: false
  }

  // 提交处理
  _handleSubmit = e => {
    e.preventDefault()
    const { form } = this.props
    const nurse = form.getFieldValue('nurse')
    form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(
          actions.addAppointment({
            roomId: this.props.detail.roomId,
            centerId: values.centerId,
            roomNum: values.roomNum,
            startTimeWeb: moment(values.startTimeWeb[0]).format('YYYY-MM-DD HH:mm:ss'),
            endTimeWeb: moment(values.startTimeWeb[1]).format('YYYY-MM-DD HH:mm:ss'),
            roomStatus: values.roomStatus,
            clearStatus: values.clearStatus,
            recordCustomerList: [
              ...this._addBodyId(),
              {
                customerId: this.props.motherId,
                customerName: this.props.motherName,
                customerType: 1
              }
            ],
            contractNum: this.props.contractNum,
            nurseUser: (!isEmpty(nurse) && nurse[0].nurseName) ? nurse[0].nurseName : '',
          })
        )
      }
    })
  }

  componentDidMount() {
    const { dispatch, match } = this.props
    dispatch(actions.getAppointmentList({ status: 0 }, match.params))
  }

  componentWillUnmount() {
    this.props.dispatch(
      createAction(actions.getMotherList)({
        motherList: [],
        motherPagination: {
          current: 1,
          total: 0,
          pageSize: PAGE_SIZE
        }
      })
    )
    this.props.dispatch(
      createAction(actions.getMotherInfo)({
        motherId: '',
        motherName: '',
        babyIds: [],
        babyNames: [],
        comboList: [],
        contractNum: '',
      })
    )
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  _showModal = () => {
    const { dispatch } = this.props
    dispatch(createAction(actions.switchShowMotherModalAction)(true))
    dispatch(
      actions.getMombabyinfoList({
        centerId: '',
        currentPage: this.props.motherPagination.current,
        pageSize: this.props.motherPagination.pageSize,
        process: 4,
        type: 1
      })
    )
  }

  _addBodyId = () => {
    return this.props.babyIds.map((item, index) => {
      return {
        customerId: item,
        customerName: this.props.babyNames[index],
        customerType: 0
      }
    })
  }
  _cancel = () => {
    history.go(-1)
  }

  // 提取护士弹层列
  _nurseColumns = [
    {
      key: 'centerName',
      title: '所在中心',
      dataIndex: 'centerName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'nurseName',
      title: '护士姓名',
      dataIndex: 'nurseName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    }
  ]

  // 获取护士弹层参数
  _getNurseModalParams = () => {
    const { careCenterList } = this.props
    const { form } = this.props
    return {
      modalParam: {
        title: '获取床位护士'
      },
      selectType: 'radio',
      fetch: fetchData,
      url: api.roomInfo.nurseList,
      columns: this._nurseColumns,
      selectedList: form.getFieldValue('nurse'),
      rowKey: 'nurseId',
      filter: [{
        id: 'centerId',
        props: {
          label: '所在中心：'
        },
        element: (
          <Select
            placeholder='请选择所在中心'
            getPopupContainer={() => document.getElementsByClassName('ant-modal-wrap')[0]}
            style={{ width: '140px' }}
          >
            {
              !isEmpty(careCenterList) && careCenterList.map(item => (
                <SelectOption
                  key={item.centerId}
                  value={item.centerId}
                >
                  {item.centerName}
                </SelectOption>
              ))
            }
          </Select>
        )
      }, {
        id: 'keyWords',
        element: (
          <Input placeholder='请输入关键词' />
        )
      }]
    }
  }

  // 获取套餐信息
  _getComboNames = () => {
    const { comboList } = this.props
    return isEmpty(comboList) ? '--' : comboList.map((combo, i) => {
      return (
        <span key={i}>
          <a
            key={i}
            style={{ marginRight: '5px' }}
            target='_blank'
            href={`/maternity/packages/see/comboNo/${combo.comboNo}`}
          >
            {combo.comboName}
          </a>
          {
            i + 1 !== comboList.length && ';'
          }
        </span>
      )
    })
  }
  render() {
    const { getFieldDecorator } = this.props.form
    return (
      <Spin spinning={this.props.detailLoading}>
        <MotherModel
          showMotherModal={this.props.showMotherModal}
          motherList={this.props.motherList}
          dispatch={this.props.dispatch}
          parentForm={this.props.form}
          motherPagination={this.props.motherPagination}
          motherLoading={this.props.motherLoading}
        />
        <div>
          <Form onSubmit={this._handleSubmit} id='rowUser'>
            <Card title={<span className={styles['card-tit']}>房间详细信息</span>} className={styles['card-wrapper']}>
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
                      initialValue: [],
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
                      initialValue: this.props.motherName,
                      rules: [
                        {
                          required: true,
                          message: '请输入妈妈姓名'
                        }
                      ]
                    })(
                      <Input
                        placeholder='请输入妈妈姓名'
                        maxLength='50'
                        disabled={true}
                        addonAfter={<Icon type='plus' onClick={this._showModal} />}
                      />
                    )}
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='宝宝姓名：'>
                    {getFieldDecorator('babyNames', {
                      initialValue: this.props.babyNames.join(',')
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
                  <FormItem
                    label='床位护士：'
                    {...formItemLayout}
                  >
                    {getFieldDecorator('nurse', {
                      initialValue: [],
                    })(
                      <ModalSelectInput
                        displayName='nurseName'
                        params = {this._getNurseModalParams}
                      />
                    )}
                  </FormItem>
                </Col>
              </Row>
            </Card>

            <Card title={<span className={styles['card-tit']}>账户详细信息</span>} className={styles['card-wrapper']}>
              <Row justify='start' type='flex'>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='合同编号：'>
                    {
                      this.props.contractNum
                        ? <a
                          target='_blank'
                          href={`/maternity/contract/detail/contractNum/${this.props.contractNum}`}
                        >
                          {this.props.contractNum}
                        </a>
                        : '--'
                    }
                  </FormItem>
                </Col>
                <Col span={8}>
                  <FormItem {...formItemLayout} label='所选套餐：' style={{ wordBreak: 'break-all' }}>
                    {
                      this._getComboNames()
                    }
                  </FormItem>
                </Col>
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
                title='点击保存'
                htmlType='submit'
                loading={this.props.btnLoading}
                disabled={this.props.btnLoading}
              >
                预约
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
    contractNum: state.appointment.contractNum
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Appointment))
