import React, { Component } from 'react'
import { Divider, Row, Card, Table, Form, Input, Button, Select, message, Modal } from 'antd'
import { connect } from 'react-redux'
import moment from 'moment'
import { createAction } from 'redux-actions'
import DescriptionList from 'Components/DescriptionList'

import {
  reservationRedirect,
  memberInfoByIdOrPhone,
  MEMBER_INFO,
  reservation,
  getReservationListByScheduleNo,
} from './reduck'
import { isEmpty } from '../../../utils/lang'
import paramsUtils from '../../../utils/params'
import styles from './schedule.less'
import { showModalWrapper } from 'Components/modal/ModalWrapper'

const { Description } = DescriptionList
const Option = Select.Option
const confirm = Modal.confirm

const courseMode = {
  'S': '私教课',
  'T': '小团课',
  'P': '公开课',
}

const orderType = {
  // 'PAID_ORDER': '已支付',
  // 'CANCEL_ORDER': '取消订单',
  '0': '未完成',
  '1': '已完成',
  '2': '已取消',
  '3': '待确认',
  '4': '已接单'
}

class HandSubscribe extends Component {
  constructor(props) {
    super(props)
    this.state = {
      scheduleNo: paramsUtils.url2json(location).scheduleNo,
      memberIdOrPhone: '',
      selectedRowKeys: [],
      selectedRows: [],
      privateTimeList: ''
    }
  }

  componentWillMount() {
    const { scheduleNo } = this.state
    const { dispatch } = this.props
    dispatch(reservationRedirect({ scheduleNo }))
  }

  _handleMemberIdChange = e => {
    this.setState({
      memberIdOrPhone: e.target.value
    })
  }

  _handleSearch = () => {
    const { memberIdOrPhone, scheduleNo } = this.state
    const { dispatch, reservationInfo } = this.props
    if (memberIdOrPhone) {
      dispatch(memberInfoByIdOrPhone({ userNoMobile: memberIdOrPhone, courseMode: reservationInfo.courseMode, scheduleNo })).then(res => {
        this.rowSelect([], [])
      })
    }
  }

  componentWillUnmount() {
    this.props.dispatch(createAction(MEMBER_INFO)({}))
  }

  _handleChange = (value) => {
    this.setState({
      privateTimeList: value
    })
  }

  rowSelect = (selectedRowKeys, selectedRows) => {
    this.setState({
      selectedRows,
      selectedRowKeys
    })
  }

  _handleSubscribe = e => {
    const { privateTimeList, selectedRows, scheduleNo } = this.state
    const { reservationInfo, reservationMemberInfo, dispatch } = this.props
    if (selectedRows.length < 1 && reservationInfo.courseMode !== 'P') {
      message.error('请先选择订单信息')
      return
    } else if (reservationInfo.courseMode === 'S' && privateTimeList.length < 1) {
      message.error('请先选择私教预约时段')
      return
    }
    const reqBean = {
      userNo: reservationMemberInfo.memberInfo.userNo,
      mobileNo: reservationMemberInfo.memberInfo.mobileNo,
      scheduleNo,
      operation: '0'
    }
    if (reservationInfo.courseMode !== 'P') {
      reqBean.orderNo = selectedRows[0].orderNo
    }
    if (reservationInfo.courseMode === 'S') {
      const privateTimeObj = JSON.parse(privateTimeList)
      reqBean.beginTime = privateTimeObj.beginTime
      reqBean.endTime = privateTimeObj.endTime
      reqBean.operation = '0'
    }
    dispatch(reservation(reqBean, (msg) => {
      confirm({
        title: msg,
        onOk() {
          reqBean.operation = '1'
          dispatch(reservation(reqBean))
        },
      })
    }))
  }

  goodsColumns = [
    {
      title: '购买商品',
      dataIndex: 'itemName',
      key: 'itemName',
      align: 'center',
    },
    {
      title: '课程模式',
      dataIndex: 'courseMode',
      key: 'courseMode',
      align: 'center',
      render: (text) => (
        <span>{courseMode[text]}</span>
      )
    },
    {
      title: '课时数',
      dataIndex: 'reservationNum',
      key: 'reservationNum',
      align: 'center',
      render: (text, record) => (
        <span>{record.hasReservationNum + '/' + record.courseTime}</span>
      )
    },
    {
      title: '订单价格',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
      align: 'center',
    },
    {
      title: '有效期',
      dataIndex: 'itemValid',
      key: 'itemValid',
      align: 'center',
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: text => (
        <span>{orderType[text]}</span>
      )
    },
    {
      title: '下单时间',
      dataIndex: 'createTime',
      key: 'createTime',
      align: 'center',
    }
  ]

  memberColumns = [
    {
      title: '会员id',
      dataIndex: 'userId',
      key: 'userId',
      align: 'center',
    },
    {
      title: '会员姓名',
      dataIndex: 'userName',
      key: 'userName',
      align: 'center',
    },
    {
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      align: 'center',
    },
    {
      title: '预约状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
    },
    {
      title: '上课时间',
      dataIndex: 'takeCourseTime',
      key: 'takeCourseTime',
      align: 'center',
    },
    {
      title: '预约时间',
      dataIndex: 'reservationTime',
      key: 'reservationTime',
      align: 'center',
    },
  ]

  _handleShowModal = (hasSignupNumber) => {
    const { dispatch } = this.props
    const { scheduleNo } = this.state
    dispatch(getReservationListByScheduleNo({ scheduleNo })).then(res => {
      if (res) {
        showModalWrapper((
          <Table
            pagination={false}
            dataSource={res.reservations}
            columns={this.memberColumns}
            rowKey='userId'
          />
        ), {
          title: '预约信息',
          width: 800
        })
      }
    })
  }

  render() {
    const searchRender = (
      <div style={{ marginBottom: 10 }}>
        <Input
          style={{ width: 200, marginRight: 10 }}
          value={this.state.memberIdOrPhone}
          onChange={e => this._handleMemberIdChange(e)}
          placeholder='可输入会员ID或手机号'
        />
        <Button
          onClick={() => this._handleSearch()}
        >查询
        </Button>
      </div>
    )
    const { reservationInfo, reservationMemberInfo, showButtonSpin } = this.props
    const { selectedRowKeys } = this.state
    const rowSelection = {
      selectedRowKeys,
      onChange: this.rowSelect,
      type: 'radio',
    }
    return (
      <div>
        <DescriptionList size='large' title='课程信息'>
          <Description term='所属机构'>{reservationInfo.organizationName}</Description>
          <Description term='课程名称'>{reservationInfo.courseName}</Description>
          <Description term='课程模式'>{courseMode[reservationInfo.courseMode]}</Description>
          <Description term='上课时间'>{reservationInfo.beginDate ? (reservationInfo.beginDate + ' ' + reservationInfo.beginTime + '-' + reservationInfo.endTime) : ''}</Description>
          <Description term='教练'>{reservationInfo.teacherName}</Description>
          <Description term='教室'>{reservationInfo.roomName}</Description>
          <Description term='预约人数'>
            {reservationInfo.hasSignupNumber ? (
              <a onClick={() => this._handleShowModal(reservationInfo.hasSignupNumber)}>{reservationInfo.hasSignupNumber}</a>
            ) : (
              <span>0</span>
            )}
            {reservationInfo.signupNumber ? ('/' + reservationInfo.signupNumber) : ''}
          </Description>
          <Description term='课时'>{reservationInfo.perCourseTime}</Description>
        </DescriptionList>
        <Divider style={{ marginTop: 0 }} />
        {reservationMemberInfo && !isEmpty(reservationMemberInfo) && reservationMemberInfo.memberInfo ? (
          <DescriptionList size='large' title='会员信息'>
            {searchRender}
            <Description term='金诚会员ID'>{reservationMemberInfo.memberInfo.userNo}</Description>
            <Description term='手机号码'>{reservationMemberInfo.memberInfo.mobileNo}</Description>
            <Description term='姓名'>{reservationMemberInfo.memberInfo.userName}</Description>
            <Description term='身份证号'>{reservationMemberInfo.memberInfo.idCard}</Description>
            <Description term='状态'>{moment(reservationMemberInfo.memberInfo.cardValidDatetime) > new Date().getTime() ? '已开卡' : '已失效'}</Description>
            <Description term='办卡日期'>{reservationMemberInfo.memberInfo.openCardDatetime}</Description>
            <Description term='失效日期'>{reservationMemberInfo.memberInfo.cardValidDatetime}</Description>
            <Description term='住址'>{reservationMemberInfo.memberInfo.address}</Description>
          </DescriptionList>
        ) : (
          <DescriptionList size='large' title='会员信息'>
            {searchRender}
          </DescriptionList>
        )}
        {reservationMemberInfo && !isEmpty(reservationMemberInfo) && reservationInfo.courseMode !== 'P' && (
          <div>
            <Row className='form-detail'>
              <Card title='订单信息'>
                <Table
                  pagination={false}
                  dataSource={reservationMemberInfo.userOrderList || []}
                  columns={this.goodsColumns}
                  rowKey='id'
                  rowSelection={rowSelection}
                />
              </Card>
            </Row>
            {reservationMemberInfo.privateTimeList && (
              <Row className='form-detail'>
                <Card title='私教预约时段' id='area'>
                  <Select
                    getPopupContainer={() => document.getElementById('area')}
                    // mode='tags'
                    style={{ width: 400 }}
                    placeholder='请选择预约时段'
                    onChange={(value) => this._handleChange(value)}
                  >
                    {reservationMemberInfo.privateTimeList.map((item, index) => (
                      <Option key={index} value={JSON.stringify(item)}>
                        {item.beginTime + '-' + item.endTime}
                      </Option>
                    ))}
                  </Select>
                </Card>
              </Row>
            )}
          </div>
        )}
        <div className={styles['operate-btn-center']}>
          <Button
            type='primary'
            title='点击预约'
            loading={showButtonSpin}
            onClick={e => this._handleSubscribe(e)}
          >
            预约
          </Button>
          <Button
            onClick={() => history.go(-1)}
            title='点击取消'
          >
            取消
          </Button>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    reservationInfo: state.sportSchedule.reservationInfo,
    reservationMemberInfo: state.sportSchedule.reservationMemberInfo,
    showButtonSpin: state.common.showButtonSpin,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(HandSubscribe))
