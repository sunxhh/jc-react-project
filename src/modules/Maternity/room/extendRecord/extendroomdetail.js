import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, DatePicker, Select, Card } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import style from './style.less'
import * as actions from './reduck'
import { showModalForm } from '../../../../components/modal/ModalForm'

const FormItem = Form.Item
const { RangePicker } = DatePicker
const Option = Select.Option

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

const formItemLayoutLarge = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

const isInRoom = {
  0: '否',
  1: '是',
}

const sex = {
  '0': '女',
  '1': '男',
}

class MaterExtendDetail extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recordAuditId: this.props.match.params.id,
      auditType: this.props.match.params.type,
    }
  }

  componentWillMount () {
    this.props.dispatch(actions.getExtendDetail({ recordAuditId: this.state.recordAuditId }))
    this.props.dispatch(actions.getListConditions({ status: '0' }))
  }

  // 查看妈妈信息
  _renderShowMomInfo = recordCustomerList => {
    recordCustomerList.map(item => {
      if (item.customerType === '1') {
        this.props.dispatch(actions.getMomInfo({ id: item.customerId })).then(res => {
          if (res) {
            const momInfo = this.props.momInfo || {}
            showModalForm({
              formItemLayout: {
                labelCol: { span: 4 },
                wrapperCol: { span: 16 }
              },
              title: `查看妈妈信息`,
              okVisible: false,
              cancelText: '关闭',
              fields: [
                {
                  id: 'name',
                  props: {
                    label: `姓名`
                  },
                  options: {
                    initialValue: momInfo.name || '',
                  },
                  element: (
                    <Input
                      disabled={true}
                    />
                  )
                },
                {
                  id: 'birthday',
                  props: {
                    label: `妈妈生日`
                  },
                  options: {
                    initialValue: momInfo.birthday ? moment(momInfo.birthday).format('YYYY-MM-DD') : '',
                  },
                  element: (
                    <Input
                      disabled={true}
                    />
                  )
                },
                {
                  id: 'mobile',
                  props: {
                    label: '手机'
                  },
                  options: {
                    initialValue: momInfo.mobile || '',
                  },
                  element: (
                    <Input
                      disabled={true}
                    />
                  )
                },
                {
                  id: 'wechat',
                  props: {
                    label: '微信'
                  },
                  options: {
                    initialValue: momInfo.wechat || '',
                  },
                  element: (
                    <Input
                      disabled={true}
                    />
                  )
                },
                {
                  id: 'qq',
                  props: {
                    label: 'QQ'
                  },
                  options: {
                    initialValue: momInfo.qq || '',
                  },
                  element: (
                    <Input
                      disabled={true}
                    />
                  )
                },
                {
                  id: 'idcard',
                  props: {
                    label: '身份证'
                  },
                  options: {
                    initialValue: momInfo.idcard || '',
                  },
                  element: (
                    <Input
                      disabled={true}
                    />
                  )
                },
                {
                  id: 'email',
                  props: {
                    label: '邮箱'
                  },
                  options: {
                    initialValue: momInfo.email || '',
                  },
                  element: (
                    <Input
                      disabled={true}
                    />
                  )
                }
              ]
            })
          }
        })
      }
    })
  }

  // 获取宝宝信息
  _renderShowBabyInfo = recordCustomerList => {
    recordCustomerList.map(item => {
      if (item.customerType === '0') {
        this.props.dispatch(actions.getBabyInfo({ babyId: item.customerId }))
          .then(res => {
            if (res) {
              const babyInfo = this.props.babyInfo || {}
              showModalForm({
                formItemLayout: {
                  labelCol: { span: 4 },
                  wrapperCol: { span: 16 }
                },
                title: '查看宝宝信息',
                okVisible: false,
                cancelText: '关闭',
                fields: [
                  {
                    id: 'babyName',
                    props: {
                      label: `宝宝姓名`
                    },
                    options: {
                      initialValue: babyInfo.babyName || '',
                    },
                    element: (
                      <Input
                        disabled={true}
                      />
                    )
                  },
                  {
                    id: 'babyBirthday',
                    props: {
                      label: `宝宝生日`
                    },
                    options: {
                      initialValue: babyInfo.babyBirthday && moment(babyInfo.babyBirthday).format('YYYY-MM-DD'),
                    },
                    element: (
                      <Input
                        disabled={true}
                      />
                    )
                  },
                  {
                    id: 'babySex',
                    props: {
                      label: '性别'
                    },
                    options: {
                      initialValue: sex[babyInfo.babySex],
                    },
                    element: (
                      <Input
                        disabled={true}
                      />
                    )
                  },
                  {
                    id: 'babyRemark',
                    props: {
                      label: '备注'
                    },
                    options: {
                      initialValue: babyInfo.babyRemark || '',
                    },
                    element: (
                      <Input
                        disabled={true}
                      />
                    )
                  }
                ]
              })
            }
          })
      }
    })
  }

  // 保存编辑信息
  _saveEditInfo = detailRecordListData => {
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(actions.modifyExtendRoom({
          recordAuditId: this.state.recordAuditId,
          startTimeWeb: values.startTimeWeb && values.startTimeWeb.format('YYYY-MM-DD 12:00:00') || '',
          endTimeWeb: values.endTimeWeb && values.endTimeWeb.format('YYYY-MM-DD 12:00:00') || '',
          recordId: detailRecordListData.recordId,
          recordProcessId: detailRecordListData.newRecordProcessId,
        }))
      }
    })
  }

  _disabledStartDate = (endTimeValue) => {
    const { getFieldValue } = this.props.form
    const starTimeValue = getFieldValue('startTimeWeb')
    if (!endTimeValue || !starTimeValue) {
      return false
    }
    return (starTimeValue.valueOf() + (1000 * 60 * 60 * 24)) > endTimeValue.valueOf()
  }

  _renderBtnType = detailRecordListData => {
    if (this.state.auditType === 'see') {
      return (
        <Button
          type='default'
          onClick={() => history.go(-1)}
        >关闭
        </Button>
      )
    } else {
      return (
        <span>
          <Button
            type='default'
            onClick={() => history.go(-1)}
          >取消
          </Button>
          <Button
            type='primary'
            onClick={() => { this._saveEditInfo(detailRecordListData) }}
          >保存
          </Button>
        </span>
      )
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const detailRecordListData = this.props.extendDetail
    const AllListCondition = this.props.AllListCondition
    return (
      <Form id='roomStatusSelect'>
        <Card title={<span>原住房</span>}>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='房间号'
              >
                {getFieldDecorator('oldRoomNum', {
                  initialValue: detailRecordListData.roomNum,
                })(
                  <Input
                    plageholder={detailRecordListData.roomNum}
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='房间状态'
              >
                {getFieldDecorator('roomStatus', {
                  initialValue: detailRecordListData.roomStatus,
                })(
                  <Select
                    disabled={true}
                    getPopupContainer={() => document.getElementById('roomStatusSelect')}
                  >
                    <Option key='' value=''>全部</Option>
                    {
                      AllListCondition.roomStatusList && AllListCondition.roomStatusList.map(roomStatus => {
                        return (
                          <Option
                            key={roomStatus.value}
                            value={roomStatus.value}
                          >{roomStatus.name}
                          </Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                {...formItemLayout}
                label='在住日期'
              >
                {getFieldDecorator('livedTime', {
                  initialValue: [moment(detailRecordListData.startTime), moment(detailRecordListData.endTime)],
                })(
                  <RangePicker
                    disabled={true}
                    style={{ width: '100%' }}
                    placeholder={['开始日期', '结束日期']}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label='妈妈姓名'
                {...formItemLayout}
              >
                {getFieldDecorator('motherName', {
                  initialValue: '111',
                })(
                  <div>
                    <Input
                      placeholder={detailRecordListData.recordCustomerList && detailRecordListData.recordCustomerList
                        .filter(item => item.customerType === '1').map(momName => momName.customerName)}
                      disabled={true}
                    />
                    {/* <a*/}
                    {/* onClick={() => { this._renderShowMomInfo(detailRecordListData.recordCustomerList) }}*/}
                    {/* >查看妈妈信息*/}
                    {/* </a>*/}
                  </div>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label='宝宝姓名'
                {...formItemLayout}
              >
                {getFieldDecorator('babyName', {
                  initialValue: '11111',
                })(
                  <div>
                    <Input
                      placeholder={detailRecordListData.recordCustomerList.filter(item => item.customerType === '0').map(momName => momName.customerName)}
                      disabled={true}
                    />
                    {/* <a*/}
                    {/* onClick={() => { this._renderShowBabyInfo(detailRecordListData.recordCustomerList) }}*/}
                    {/* >查看宝宝信息*/}
                    {/* </a>*/}
                  </div>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label='在房状态'
                {...formItemLayout}
              >
                {getFieldDecorator('isInroom', {
                  initialValue: detailRecordListData.isInroom === '0' ? '否' : '是',
                })(
                  <Select
                    disabled={true}
                    placeholder={isInRoom[detailRecordListData.isInroom]}
                  >
                    <Option value={detailRecordListData.isInroom}>{detailRecordListData.isInroom}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label='清理状态'
                {...formItemLayout}
              >
                {getFieldDecorator('oldClearStatus', {
                  initialValue: detailRecordListData.clearStatus,
                })(
                  <Select
                    disabled={true}
                    placeholder='请选择'
                    getPopupContainer={() => document.getElementById('statusSelect')}
                  >
                    {
                      AllListCondition.clearStatusList && AllListCondition.clearStatusList
                        .map(roomStatus => {
                          return (
                            <Option
                              key={roomStatus.value}
                              value={roomStatus.value}
                            >{roomStatus.name}
                            </Option>
                          )
                        })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col span={12}>
              <FormItem
                label='所在中心'
                {...formItemLayout}
              >
                {getFieldDecorator('oldCenterName', {
                  initialValue: AllListCondition.careCenterList && AllListCondition.careCenterList.filter(center => {
                    return center.centerId === detailRecordListData.centerId
                  }).map(item => item.centerName),
                })(
                  <Select
                    disabled={true}
                  >
                    {
                      AllListCondition.centerList && AllListCondition.centerList.map(centerList => {
                        return (
                          <Option
                            key={centerList.centerId}
                            value={centerList.centerId}
                          >{centerList.centerName}
                          </Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem
                label='床位护士'
                {...formItemLayout}
              >
                {getFieldDecorator('nurseUser', {
                  initialValue: detailRecordListData.nurseUser,
                })(
                  <Select
                    disabled={true}
                  >
                    <Option value={detailRecordListData.nurseUse}>{detailRecordListData.nurseUse}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='合同编号：'>
                {
                  this.props.extendDetail.contractNum
                    ? <a
                      target='_blank'
                      href={`/maternity/contract/detail/contractNum/${this.props.extendDetail.contractNum}`}
                    >
                      {this.props.extendDetail.contractNum}
                    </a>
                    : '--'
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='所选套餐：'>
                {
                  this.props.extendDetail.contractComboList && this.props.extendDetail.contractComboList.map((combo, i) => {
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
        <Card title={<span>续房</span>}>
          <Row>
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'所在中心'}
              >
                {getFieldDecorator('centerId', {
                  initialValue: AllListCondition.careCenterList && AllListCondition.careCenterList.filter(center => {
                    return center.centerId === detailRecordListData.centerId
                  }).map(item => item.centerName),
                  rules: [{ required: true, message: '请选择所在中心' }],
                })(
                  <Select
                    disabled={true}
                    placeholder='请选择'
                    getPopupContainer={() => document.getElementById('statusSelect')}
                  >
                    {
                      AllListCondition.careCenterList && AllListCondition.careCenterList
                        .map(item => {
                          return (
                            <Option
                              key={item.centerId}
                              value={item.centerId}
                            >{item.centerName}
                            </Option>
                          )
                        })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='续住开始日期'
                {...formItemLayoutLarge}
              >
                {getFieldDecorator('startTimeWeb', {
                  initialValue: moment(detailRecordListData.endTime),
                  rules: [{
                    required: true,
                    message: '请输入续住日期'
                  }],
                })(
                  <DatePicker
                    disabled={true}
                    style={{ width: '100%' }}
                    placeholder='开始日期'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='续住结束日期'
                {...formItemLayoutLarge}
              >
                {getFieldDecorator('endTimeWeb', {
                  initialValue: moment(detailRecordListData.endTimeContinued),
                  rules: [{
                    required: true,
                    message: '请输入续住结束日期'
                  }],
                })(
                  <DatePicker
                    disabled={this.state.auditType === 'see' ? Boolean(1) : Boolean(0)}
                    disabledDate={this._disabledStartDate}
                    style={{ width: '100%' }}
                    placeholder='请选择结束日期'
                  />
                )}
              </FormItem>
            </Col>
          </Row>
        </Card>
        <Card title={<span>账户详细信息</span>}>
          <Row>
            <Col span={8}>
              <FormItem
                label='账户余额'
                {...formItemLayoutLarge}
              >
                {getFieldDecorator('availableAmount', {
                  initialValue: '0',
                })(
                  <Input
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='已付金额'
                {...formItemLayoutLarge}
              >
                {getFieldDecorator('Amount', {
                  initialValue: '0',
                })(
                  <Input
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='消费金额'
                {...formItemLayoutLarge}
              >
                {getFieldDecorator('discountAmount', {
                  initialValue: '0',
                })(
                  <Input
                    disabled={true}
                  />
                )}
              </FormItem>
            </Col>
          </Row>
          <Row>
            <FormItem
              className={style['handle-box']}
            >
              {this._renderBtnType(detailRecordListData)}
            </FormItem>
          </Row>
        </Card>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    extendDetail: state.extendRecordList.getExtendDetail,
    AllListCondition: state.extendRecordList.getListConditions,
    saveData: state.extendRecordList.getSaveData,
    momInfo: state.extendRecordList.momInfo,
    babyInfo: state.extendRecordList.babyInfo,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(MaterExtendDetail))
