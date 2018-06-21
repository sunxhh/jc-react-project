import React, { Component } from 'react'
import { Button, Select, Form, Row, Col, Table, Input, Divider } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
// import styles from './style.less'
import * as actions from './reduck'
import { PAG_CONFIG, PAGE_SIZE } from '../../pagination'

const FormItem = Form.Item
const Option = Select.Option

const statusList = [
  {
    key: '0',
    value: '已预约'
  },
  {
    key: '1',
    value: '在住'
  },
  {
    key: '2',
    value: '退房'
  }
]

class checkRecord extends Component {
  constructor(props) {
    super(props)
    this.state = {
      initialReq: {
        currentPage: 1,
        pageSize: PAGE_SIZE,
        centerId: '',
        roomStatus: '',
        customerName: ''
      }
    }
  }

  _getStatusValue = (status, arg) => {
    let statusName = ''
    status.map(item => {
      if (item.key === arg) {
        statusName = item.value
      }
    })
    return statusName
  }

  _columns = [
    {
      title: '所在中心',
      dataIndex: 'centerId',
      render: text => {
        return (
          this.props.AllListCondition.careCenterList &&
          this.props.AllListCondition.careCenterList
            .filter(center => {
              return center.centerId === text
            })
            .map(item => {
              return <span key={item.id}>{item.centerName}</span>
            })
        )
      }
    },
    {
      title: '会员姓名',
      dataIndex: 'customerName'
    },
    {
      title: '房间号',
      dataIndex: 'roomNum'
    },
    {
      title: '入住状态',
      dataIndex: 'status',
      render: text => {
        return <span>{this._getStatusValue(statusList, text)}</span>
      }
    },
    {
      title: '入住天数',
      dataIndex: 'checkinDateNum'
    },
    {
      title: '入住日期',
      dataIndex: 'startTime'
    },
    {
      title: '离店日期',
      dataIndex: 'endTime'
    },
    {
      title: '操作人',
      dataIndex: 'modifyUser'
    },
    {
      title: '操作',
      dataIndex: 'option',
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        if (btnRole.includes('see')) {
          return (
            <span>
              <Link to={`materRoomCheckRecord/room/see/${record.recordId}/${record.roomId}`}>查看</Link>
              {this._judgeBtnIsShow('checkRoom', record, btnRole)}
              {this._judgeBtnIsShow('extendRoom', record, btnRole)}
            </span>
          )
        } else {
          this._judgeBtnIsShow('checkRoom', record, btnRole)
          this._judgeBtnIsShow('extendRoom', record, btnRole)
        }
      }
    }
  ]

  componentDidMount() {
    const args = this.props.queryData
    this.props.dispatch(actions.getCheckRecordList(args))
    this.props.dispatch(actions.getListConditions({ status: '0' }))
  }

  componentWillUnmount() {
    if (!location.pathname.startsWith(`${urls.MATER_MANAGE_CHECK_RECORD_INDEX}`)) {
      this.props.dispatch(actions.setQueryData({ currentPage: 1, pageSize: 20 }))
    }
  }

  // 转房和退房 按钮
  _changeRoomAndAddRoomBtn = (record, btnRole) => {
    const changeRoomAndAddRoomHtml = (
      <span>
        {btnRole.includes('change') && (
          <Link to={`${urls.MATER_MANAGE_CHECK_RECORD_INDEX_ROOMCHANGE}/${record.recordId}`}>转房</Link>
        )}
        {btnRole.includes('checkout') && (
          <span>
            <Divider type='vertical' />
            <Link to={`${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CHECKOUT}/${record.recordId}`}>退房</Link>
          </span>
        )}
      </span>
    )
    return changeRoomAndAddRoomHtml
  }

  // 控制按钮显隐
  _judgeBtnIsShow = (btnType, record, btnRole) => {
    if (btnType === 'checkRoom' && btnRole.includes('check')) {
      if (record.status === '0') {
        return (
          <span>
            <Divider type='vertical' />
            <Link to={`${urls.ROOM_INFO_AGTER_RESERVATION_CHECK_IN}/${record.recordId}`}>入住</Link>
            <Divider type='vertical' />
            {this._changeRoomAndAddRoomBtn(record, btnRole)}
          </span>
        )
      }
    } else if (btnType === 'extendRoom' && btnRole.includes('extend')) {
      if (record.status === '1') {
        return (
          <span>
            <Divider type='vertical' />
            <Link to={`${urls.MATER_MANAGE_CHECK_RECORD_INDEX_CONTINUEDREDUCK}/${record.recordId}`}>续房</Link>
            <Divider type='vertical' />
            {this._changeRoomAndAddRoomBtn(record, btnRole)}
          </span>
        )
      }
    }
  }

  _getHandleData = (current = this.state.initialReq.currentPage, pageSize = this.state.initialReq.pageSize) => {
    const args = { ...this.props.form.getFieldsValue(), currentPage: current, pageSize: pageSize }
    this.setState({ initialReq: args }, () => {
      this.props.dispatch(actions.getCheckRecordList(this.state.initialReq))
      this.props.dispatch(actions.setQueryData(this.state.initialReq))
    })
    return args
  }

  // 点击分页时获取 数据
  _handlePagination = page => {
    if (page.pageSize === this.state.initialReq.pageSize) {
      this._getHandleData(page.current, page.pageSize)
    } else {
      this._getHandleData(1, page.pageSize)
    }
  }

  // 点击查询
  _handleSearch = () => {
    this._getHandleData(1)
  }

  render() {
    const { checkRecordList, AllListCondition, queryData, showListSpin } = this.props
    const { getFieldDecorator } = this.props.form
    const formItemLayout = {
      labelCol: { span: 8 },
      wrapperCol: { span: 16 }
    }
    const centerList = AllListCondition.careCenterList
    const statusList = AllListCondition.statusList
    const pagination = checkRecordList.page || {}
    const paginationData = {
      current: pagination.currentPage,
      total: pagination.totalCount,
      pageSize: pagination.pageSize,
      ...PAG_CONFIG
    }
    return (
      <div id='statusSelect' style={{ position: 'relative' }}>
        <Form className='search-form'>
          <Row>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'所在中心'}>
                {getFieldDecorator('centerId', {
                  initialValue: (queryData && queryData.centerId) || ''
                })(
                  <Select getPopupContainer={() => document.getElementById('statusSelect')}>
                    <Option key='' value=''>
                      全部
                    </Option>
                    {centerList &&
                      centerList.map(centerList => {
                        return (
                          <Option key={centerList.centerId} value={centerList.centerId}>
                            {centerList.centerName}
                          </Option>
                        )
                      })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout} label={'入住状态'}>
                {getFieldDecorator('status', {
                  initialValue: (queryData && queryData.roomStatus) || ''
                })(
                  <Select getPopupContainer={() => document.getElementById('statusSelect')}>
                    <Option key='' value=''>
                      全部
                    </Option>
                    {statusList &&
                      statusList.map(roomStatus => {
                        return (
                          <Option key={roomStatus.value} value={roomStatus.value}>
                            {roomStatus.name}
                          </Option>
                        )
                      })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem {...formItemLayout}>
                {getFieldDecorator('customerName', {
                  initialValue: queryData.customerName || ''
                })(<Input style={{ marginLeft: '20px' }} placeholder='关键词' />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <Button
                type='primary'
                onClick={() => {
                  this._handleSearch()
                }}
              >
                查询
              </Button>
            </Col>
          </Row>
        </Form>
        <Table
          columns={this._columns}
          dataSource={checkRecordList.result}
          rowKey={(item, index) => index}
          loading={showListSpin}
          pagination={paginationData}
          onChange={this._handlePagination}
        />
      </div>
    )
  }
}
const mapStateToProps = state => {
  return {
    queryData: state.roomRecord.queryData,
    checkRecordList: state.roomRecord.checkRecordList,
    AllListCondition: state.roomRecord.getListConditions,
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
  }
}

const mapDispatchToProps = dispatch => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(checkRecord))
