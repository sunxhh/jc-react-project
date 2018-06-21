/**
 * author yanchong
 *
 * This is classRoom set list components
 */

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { createAction } from 'redux-actions'
import { Link } from 'react-router-dom'
import { Form, Button, Select, Pagination, Input } from 'antd'
import * as urls from 'Global/urls'

import * as actions from './roomInfoReduck'
import * as roomManageActions from '../roomManage/reduck'

import babyGray from '../../../../assets/images/center/icon_baby_gray.png'
import babyGreen from '../../../../assets/images/center/icon_baby_green.png'
import mamaGray from '../../../../assets/images/center/icon_mama_gray.png'
import mamaGreen from '../../../../assets/images/center/icon_mama_green.png'
import iconRest from '../../../../assets/images/center/icon_rest.png'

import AddRoom from '../roomManage/AddRoom'
import styles from './style.less'
import { PAG_CONFIG, PAGE_SIZE } from '../../pagination'

const { Item: FormItem } = Form

class RoomInfo extends Component {
  // 设置 props 默认值
  static defaultProps = {
    list: [],
    pagination: {
      current: 1,
      total: 0,
      pageSize: PAGE_SIZE
    },
    auths: [],
    hjStatusNum: '0',
    idleStatusNum: '0',
    yyStatusNum: '0',
    zzStatusNum: '0',
    xzStatusNum: '0',
    careCenterList: [],
    roomStatusList: [],
    clearStatusList: [],
    showAddModal: false,
    okLoading: false
  }

  // 初始化表格数据
  componentDidMount = () => {
    this._handleAction()
    this.props.dispatch(actions.queryStatusNum({ offFlag: 0 }))
    this.props.dispatch(actions.getQueryList({ status: 1 }))
  }

  // 组件销毁时， 重置此组建列表数据为[]，减少内存不 必要的开销。
  componentWillUnmount() {
    this._willUnmountListData()
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(
      createAction(actions.getListAction)({
        list: [],
        pagination: {
          currentPage: 1,
          totalCount: 0,
          pageSize: PAGE_SIZE
        }
      })
    )
  }

  // 获取查询条件里面的 value 值
  _getQueryParameter = (current = this.props.pagination.current, pageSize = this.props.pagination.pageSize) => {
    return {
      ...this.props.form.getFieldsValue(),
      offFlag: 0,
      currentPage: current,
      pageSize: pageSize
    }
  }

  // 发起列表查询的 ACTION
  _handleAction = (page, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getQueryParameter(page, pageSize)
    dispatch(actions.getList(arg))
  }

  // 点击查询按钮时，根据参数获取表格数据
  _handleSubmit = e => {
    this._handleAction(1)
  }

  // 点击分页时获取表格数据
  _handlePagination = (current, pageSize) => {
    if (pageSize === this.props.pagination.pageSize) {
      this._handleAction(current, pageSize)
    } else {
      this._handleAction(1, pageSize)
    }
  }

  _filterOption = (input, option) => {
    return option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
  }

  _free = () => {
    const { form } = this.props
    form.setFieldsValue({
      roomStatus: '1',
      centerId: ''
    })
    this._handleAction(1)
  }

  _alreadyReserved = () => {
    const { form } = this.props
    form.setFieldsValue({
      roomStatus: '2',
      centerId: ''
    })
    this._handleAction(1)
  }

  _check = () => {
    const { form } = this.props
    form.setFieldsValue({
      roomStatus: '3',
      centerId: ''
    })
    this._handleAction(1)
  }

  _fallow = () => {
    const { form } = this.props
    form.setFieldsValue({
      centerId: '',
      roomStatus: '0'
    })
    this._handleAction(1)
  }

  _handleAddProps = () => {
    return {
      showAddModal: this.props.showAddModal,
      defaultValue: this._getQueryParameter(),
      dispatch: this.props.dispatch,
      okLoading: this.props.okLoading,
      roomStatusList: this.props.roomStatusList,
      careCenterList: this.props.careCenterList,
      handleBack: this._handleBackInfo
    }
  }

  _handleBackInfo = () => {
    this._handleAction(1)
    this.props.dispatch(actions.queryStatusNum({ offFlag: 0 }))
  }

  // 点击添加按钮
  _showAddClassroom = () => {
    const { dispatch } = this.props
    dispatch(createAction(roomManageActions.showAddModalAction)(true))
  }

  // 组件 jsx 的编写
  render() {
    const { getFieldDecorator } = this.props.form
    const { auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div className={styles['common-table']}>
        <div className='search-form'>
          <AddRoom {...this._handleAddProps()} />
          <Form layout='inline' id='rowArea'>
            <FormItem label='所在中心：'>
              {getFieldDecorator('centerId', {
                initialValue: ''
              })(
                <Select
                  placeholder='请选择所在中心'
                  style={{ width: '150px' }}
                  showSearch={true}
                  filterOption={this._filterOption}
                  getPopupContainer={() => document.getElementById('rowArea')}
                >
                  <Select.Option key='-1' value=''>
                    全部
                  </Select.Option>
                  {this.props.careCenterList.map(item => {
                    return (
                      <Select.Option key={item.centerId} value={item.centerId}>
                        {item.centerName}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label='房间状态：'>
              {getFieldDecorator('roomStatus', {
                initialValue: this.props.orgLevel === '2' ? this.props.orgId : ''
              })(
                <Select
                  placeholder='请选择房间状态'
                  disabled={this.props.orgLevel === '2' ? Boolean(1) : Boolean(0)}
                  style={{ width: '150px' }}
                  showSearch={true}
                  filterOption={this._filterOption}
                  getPopupContainer={() => document.getElementById('rowArea')}
                >
                  <Select.Option key='-1' value=''>
                    全部
                  </Select.Option>
                  {this.props.roomStatusList.map(item => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem label='清理状态：'>
              {getFieldDecorator('clearStatus', {
                initialValue: this.props.orgLevel === '2' ? this.props.orgId : ''
              })(
                <Select
                  placeholder='请选择清理状态'
                  disabled={this.props.orgLevel === '2' ? Boolean(1) : Boolean(0)}
                  style={{ width: '150px' }}
                  showSearch={true}
                  filterOption={this._filterOption}
                  getPopupContainer={() => document.getElementById('rowArea')}
                >
                  <Select.Option key='-1' value=''>
                    全部
                  </Select.Option>
                  {this.props.clearStatusList.map(item => {
                    return (
                      <Select.Option key={item.value} value={item.value}>
                        {item.name}
                      </Select.Option>
                    )
                  })}
                </Select>
              )}
            </FormItem>
            <FormItem style={{ marginTop: '3px' }}>
              {getFieldDecorator('customerName')(<Input placeholder='关键词' />)}
            </FormItem>
            <FormItem className={styles['search-form-item']}>
              <Button type='primary' onClick={this._handleSubmit} icon='search'>
                查询
              </Button>
            </FormItem>
            <FormItem className={styles['search-form-item']}>
              {btnRole.includes('add') && (
                <Button type='primary' onClick={this._showAddClassroom}>
                  新增
                </Button>
              )}
            </FormItem>
          </Form>
        </div>
        <div>
          <div className={styles['room-list-left']}>
            <div className={styles['room-list-left-top']}>
              <span>总计：</span>
              <span>{this.props.hjStatusNum} 间</span>
            </div>
            <ul>
              <li>
                <span>闲置：</span>
                <a href='javascript:void(0);' onClick={this._free}>
                  {this.props.idleStatusNum} 间
                </a>
              </li>
              <li>
                <span>已预约：</span>
                <a href='javascript:void(0);' onClick={this._alreadyReserved}>
                  {this.props.yyStatusNum} 间
                </a>
              </li>
              <li>
                <span>在住：</span>
                <a href='javascript:void(0);' onClick={this._check}>
                  {this.props.zzStatusNum} 间
                </a>
              </li>
              <li>
                <span>修整中：</span>
                <a href='javascript:void(0);' onClick={this._fallow}>
                  {this.props.xzStatusNum} 间
                </a>
              </li>
            </ul>
          </div>
          <div className={styles['room-list-right']}>
            {this.props.list.map((item, index) => (
              <dd key={item.roomId} className={styles['room-outside']}>
                <div className={styles['room-outside-color']}>
                  {(item.roomStatus === '0' && <div className={styles['fallow']}>{item.roomNum}</div>) ||
                    (item.roomStatus === '1' && <div className={styles['unused']}>{item.roomNum}</div>) ||
                    (item.roomStatus === '2' && <div className={styles['reserved']}>{item.roomNum}</div>) ||
                    (item.roomStatus === '3' && <div className={styles['check']}>{item.roomNum}</div>)}
                  <div className={styles['center-content']}>
                    {item.roomStatus === '1' && (
                      <span className={styles['appointment']}>
                        <Link to={`${urls.MATER_ROOM_INFO_APPOINTMENT}/${item.roomId}`}>预约</Link>
                      </span>
                    )}
                    {item.roomStatus === '1' && (
                      <span className={styles['check-btn']}>
                        <Link to={`${urls.MATER_ROOM_INFO_CHECKIN}/${item.roomId}`}>入住</Link>
                      </span>
                    )}
                    {item.roomStatus === '2' && (
                      <span className={styles['check-btn']}>
                        <Link to={`${urls.ROOM_INFO_AGTER_RESERVATION_CHECK_IN}/${item.recordId}`}>入住</Link>
                      </span>
                    )}
                    {(item.roomStatus === '3' || item.roomStatus === '2') && (
                      <span>
                        <span className={styles['check-btn']}>
                          <Link to={`${urls.MATER_ROOM_INFO_CHECKOUT}/${item.recordId}`}>退房</Link>
                        </span>
                        <span className={styles['check-btn']}>
                          <Link to={`${urls.ROOM_INFO_MATER_ROOM_CHANGE_RECORD}/${item.recordId}`}> 转房</Link>
                        </span>
                      </span>
                    )}
                    {item.roomStatus === '3' && (
                      <span className={styles['check-btn']}>
                        <Link to={`${urls.ROOM_INFO_MATER_ROOM_CONTINUED_REDUCK}/${item.recordId}`}>续房</Link>
                      </span>
                    )}
                    {item.roomStatus === '0' && (
                      <span className={styles['center-rest']}>
                        <img src={iconRest} />
                      </span>
                    )}
                    <div className={styles['appoinment-img']}>
                      {item.recordCustomerList.map((obj, index) => {
                        if (obj.customerType === '1' && obj.isInroom === '1') {
                          return <img key={index} src={mamaGreen} />
                        }
                        if (obj.customerType === '1' && obj.isInroom === '0') {
                          return <img key={index} src={mamaGray} />
                        }
                        if (obj.customerType === '0' && obj.isInroom === '1') {
                          return <img key={index} src={babyGreen} title='baby image' />
                        }
                        if (obj.customerType === '0' && obj.isInroom === '0') {
                          return <img key={index} src={babyGray} title='baby image' />
                        }
                      })}
                    </div>
                  </div>
                  {item.clearStatus === '0' &&
                    item.roomStatus !== '0' && <span className={styles['wait-clear']}>待清理</span>}
                  {item.clearStatus === '1' && item.roomStatus !== '0' && <span className={styles['clear']}>已清理</span>}
                </div>
              </dd>
            ))}
          </div>
        </div>

        <div className={styles['room-pagination-out']}>
          <Pagination
            className={styles['room-pagination']}
            onChange={this._handlePagination}
            onShowSizeChange={this._handlePagination}
            {...this.props.pagination}
            {...PAG_CONFIG}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    list: state.roomInfo.list,
    pagination: state.roomInfo.pagination,
    auths: state.common.auths,
    hjStatusNum: state.roomInfo.hjStatusNum,
    idleStatusNum: state.roomInfo.idleStatusNum,
    yyStatusNum: state.roomInfo.yyStatusNum,
    zzStatusNum: state.roomInfo.zzStatusNum,
    xzStatusNum: state.roomInfo.xzStatusNum,
    careCenterList: state.roomInfo.careCenterList,
    roomStatusList: state.roomInfo.roomStatusList,
    clearStatusList: state.roomInfo.clearStatusList,
    showAddModal: state.materClassRoom.showAddModal,
    okLoading: state.materClassRoom.okLoading
  }
}
const mapDispatchToProps = dispatch => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(RoomInfo))
