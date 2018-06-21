import React, { Component } from 'react'
import { Form, Row, Col, Input, Button, DatePicker, Select, Popconfirm, Card } from 'antd'
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

class checkRoom extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roomType: this.props.match.params.type,
      recordId: this.props.match.params.id,
      roomId: this.props.match.params.roomId,
    }
  }

  componentWillMount () {
    this.props.dispatch(actions.getDetailRecord({ recordId: this.state.recordId }))
    this.props.dispatch(actions.getListConditions({ status: '0' }))
    if (this.state.roomType === 'change') {
      this.props.dispatch(actions.getRoomList({
        offFlag: 0,
        isLock: 1,
        roomStatus: 1,
        currentPage: 1,
        pageSize: 20,
      }))
    }
  }

  // 确认入住
  _confirmCheckBtn = () => {
    const { roomId, recordId } = this.state
    this.props.dispatch(actions.confirmCheck({ roomId: roomId, recordId: recordId }))
  }

  // 退房
  _deleteRoomBtn = () => {
    const { roomId, recordId } = this.state
    this.props.dispatch(actions.deleteRoom({ roomId: roomId, recordId: recordId }))
  }

  // 续房
  _extendRoomBtn = () => {
    const centerList = this.props.AllListCondition.careCenterList
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(actions.saveExtendRoom({
          recordId: this.state.recordId,
          centerId: centerList.filter(item => { return item.centerName === values.centerId[0] }).map(center => center.centerId)[0],
          clearStatus: values.clearStatus,
          startTimeWeb: values.startTimeWeb && values.startTimeWeb.format('YYYY-MM-DD 12:00:00') || '',
          endTimeWeb: values.endTimeWeb && values.endTimeWeb.format('YYYY-MM-DD 12:00:00') || '',
        }))
      }
    })
  }

  // 换房
  _changeRoomBtn = () => {
    const roomList = this.props.roomList.result
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.dispatch(actions.saveChangeRoom({
          recordId: this.state.recordId,
          clearStatus: roomList && roomList.filter(item => { return item.roomId === values.roomNum }).map(roomList => roomList.clearStatus)[0],
          centerId: roomList && roomList.filter(item => { return item.roomId === values.roomNum }).map(roomList => roomList.centerId)[0],
          roomId: roomList && roomList.filter(item => { return item.roomId === values.roomNum }).map(roomList => roomList.roomId)[0],
          roomNum: roomList && roomList.filter(item => { return item.roomId === values.roomNum }).map(roomList => roomList.roomNum)[0],
          roomStatus: roomList && roomList.filter(item => { return item.roomId === values.roomNum }).map(roomList => roomList.roomStatus)[0],
        }))
      }
    })
  }

  // 查看妈妈信息
  _renderShowMomInfo = recordCustomerList => {
    recordCustomerList.map(item => {
      if (item.customerType === '1') {
        this.props.dispatch(actions.getMomInfo({ id: item.customerId })).then(res => {
          if (res) {
            const momInfo = this.props.momInfo
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

  // 查看宝宝信息
  _renderShowBabyInfo = recordCustomerList => {
    recordCustomerList.map(item => {
      if (item.customerType === '0') {
        this.props.dispatch(actions.getBabyInfo({ babyId: item.customerId })).then(res => {
          if (res) {
            const babyInfo = this.props.babyInfo
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
                    initialValue: babyInfo.babyName,
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
                  id: 'sex',
                  props: {
                    label: '性别'
                  },
                  options: {
                    initialValue: babyInfo.babySex === '0' ? '女' : '男',
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
                    initialValue: babyInfo.babyRemark,
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

  _renderRoomType = (type, getFieldDecorator, detailRecordListData) => {
    if (type === 'change') {
      return (
        <Col span={8}>
          <FormItem
            label='房间号'
            {...formItemLayoutLarge}
          >
            {getFieldDecorator('roomNum', {
              rules: [{ required: true, message: '请输入更换房间号' }],
            })(
              <Select
                placeholder='请选择'
                getPopupContainer={() => document.getElementById('statusSelect')}
              >
                {
                  this.props.roomList.result.map(roomList => {
                    return (
                      <Option
                        key={roomList.roomId}
                        value={roomList.roomId}
                      >{roomList.roomNum}
                      </Option>
                    )
                  })
                }
              </Select>
            )}
          </FormItem>
        </Col>
      )
    } else if (type === 'extend') {
      return (
        <div>
          <Col span={8}>
            <FormItem
              label='续住开始日期'
              {...formItemLayoutLarge}
            >
              {getFieldDecorator('startTimeWeb', {
                initialValue: moment(moment(detailRecordListData.endTime).format('YYYY-MM-DD')),
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
                initialValue: '',
                rules: [{
                  required: true,
                  message: '请输入续住结束日期'
                }],
              })(
                <DatePicker
                  disabledDate={this._disabledStartDate}
                  style={{ width: '100%' }}
                  placeholder='请选择结束日期'
                />
              )}
            </FormItem>
          </Col>
        </div>
      )
    }
  }

  _disabledStartDate = (endTimeValue) => {
    const { getFieldValue } = this.props.form
    const starTimeValue = getFieldValue('startTimeWeb')
    if (!endTimeValue || !starTimeValue) {
      return false
    }
    return (starTimeValue.valueOf() + (1000 * 60 * 60 * 24)) > endTimeValue.valueOf()
  }

  // 根据操作类型渲染不同操作
  _renderOptionType = (detailRecordListData, getFieldDecorator, AllListCondition) => {
    const { roomType } = this.state
    if (roomType === 'extend' || roomType === 'change') {
      return (
        <div>
          <Title txt={this.state.roomType === 'extend' ? '续房' : '转房'} />
          <Row id='statusSelect'>
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
            {this._renderRoomType(roomType, getFieldDecorator, detailRecordListData)}
            <Col span={8}>
              <FormItem
                {...formItemLayout}
                label={'清理状态'}
              >
                {getFieldDecorator('clearStatus', {
                  initialValue: detailRecordListData.clearStatus,
                  rules: [{ required: true, message: '请选择清理状态' }],
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
        </div>
      )
    } else {
      return ''
    }
  }

  // 操作按钮类型
  _renderOptionBtn = () => {
    const cancelbtnHtml = (
      <Button
        type='default'
        onClick={() => history.go(-1)}
      >关闭
      </Button>
    )
    const roomType = this.state.roomType
    if (roomType === 'see') {
      return (
        <Button
          type='default'
          onClick={() => history.go(-1)}
        >关闭
        </Button>
      )
    } else if (roomType === 'check') {
      return (
        <div>
          {cancelbtnHtml}
          <Popconfirm
            title={'确认入住?'}
            onConfirm={() => { this._confirmCheckBtn() }}
            okText='确定'
            cancelText='取消'
          >
            <Button
              type='primary'
            >入住
            </Button>
          </Popconfirm>
        </div>
      )
    } else if (roomType === 'delete') {
      return (
        <div>
          {cancelbtnHtml}
          <Popconfirm
            title={'确认退房?'}
            onConfirm={() => { this._deleteRoomBtn() }}
            okText='确定'
            cancelText='取消'
          >
            <Button
              type='primary'
            >退房
            </Button>
          </Popconfirm>
        </div>
      )
    } else if (roomType === 'extend') {
      return (
        <div>
          {cancelbtnHtml}
          <Popconfirm
            title={'确认续房?'}
            onConfirm={() => { this._extendRoomBtn() }}
            okText='确定'
            cancelText='取消'
          >
            <Button
              type='primary'
            >续房
            </Button>
          </Popconfirm>
        </div>
      )
    } else if (roomType === 'change') {
      return (
        <div>
          {cancelbtnHtml}
          <Popconfirm
            title={'确认转房?'}
            onConfirm={() => { this._changeRoomBtn() }}
            okText='确定'
            cancelText='取消'
          >
            <Button
              type='primary'
            >转房
            </Button>
          </Popconfirm>
        </div>
      )
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const detailRecordListData = this.props.detailRecordList
    const AllListCondition = this.props.AllListCondition
    return (
      <Form>
        <Card title={<span>入住信息</span>}>
          <Row id={'rowArea'}>
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
                    placeholder={isInRoom[detailRecordListData.isInroom]}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
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
                      placeholder={detailRecordListData.recordCustomerList.filter(item => item.customerType === '1').map(momName => momName.customerName)}
                      disabled={true}
                    />
                    { /* <a*/}
                    { /* onClick={() => { this._renderShowMomInfo(detailRecordListData.recordCustomerList) }}*/}
                    { /* >查看妈妈信息*/}
                    { /* </a>*/}
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
                    { /* <a*/}
                    { /* onClick={() => { this._renderShowBabyInfo(detailRecordListData.recordCustomerList) }}*/}
                    { /* >查看宝宝信息*/}
                    { /* </a>*/}
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
                    getPopupContainer={() => document.getElementById('rowArea')}
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
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    {
                      AllListCondition.clearStatusList && AllListCondition.clearStatusList.map(roomStatus => {
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
                    getPopupContainer={() => document.getElementById('rowArea')}
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
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    <Option value={detailRecordListData.nurseUse}>{detailRecordListData.nurseUse}</Option>
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='合同编号：'>
                {
                  this.props.detailRecordList.contractNum
                    ? <a
                      target='_blank'
                      href={`/maternity/contract/detail/contractNum/${this.props.detailRecordList.contractNum}`}
                    >
                      {this.props.detailRecordList.contractNum}
                    </a>
                    : '--'
                }
              </FormItem>
            </Col>
            <Col span={12}>
              <FormItem {...formItemLayout} label='所选套餐：'>
                {
                  this.props.detailRecordList.contractComboList && this.props.detailRecordList.contractComboList.map((combo, i) => {
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
        {this._renderOptionType(detailRecordListData, getFieldDecorator, AllListCondition)}
        <Card title={<span>账户详细信息</span>}>
          <Row>
            <Col span={8}>
              <FormItem
                label='账户余额'
                {...formItemLayoutLarge}
              >
                {getFieldDecorator('availableAmount', {
                  initialValue: '0元',
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
                  initialValue: '0元',
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
                  initialValue: '0元',
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
              {this._renderOptionBtn()}
            </FormItem>
          </Row>
        </Card>
      </Form>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    AllListCondition: state.roomRecord.getListConditions,
    detailRecordList: state.roomRecord.detailRecord,
    momInfo: state.roomRecord.momInfo,
    babyInfo: state.roomRecord.babyInfo,
    queryData: state.roomRecord.queryData,
    roomList: state.roomRecord.getRoomList,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(checkRoom))
