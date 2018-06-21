/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/1
 * Time: 上午9:55
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import * as actions from './reduck'
import { queryOrgByLevel } from 'Global/action'
import { Form, Input, Select, Row, Col, DatePicker, Button, Table, message, Radio } from 'antd'
import styles from './index.less'
import { isString } from 'Utils/lang'
import { isEmpty } from 'Utils/lang'
import { showModalWrapper } from '../../../components/modal/ModalWrapper'
import { genPagination } from 'Utils/helper'

const FormItem = Form.Item
const Option = Select.Option
const RangePicker = DatePicker.RangePicker
const RadioButton = Radio.Button
const RadioGroup = Radio.Group

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

// 订单状态
const orderStatus = {
  '3': '待发货',
  '4': '分拣中',
  '5': '待收货',
  '6': '已完成'
}

// 操作状态
const sortStatus = {
  '1': '待分拣',
  '2': '分拣中',
  '3': '分拣完成',
}
// tab操作
const deliveryStatus = {
  '0': '自提',
  '1': '派送',
}
// 订单类型
const orderType = {
  '01': '电商订单',
  '02': '零售订单'
}
class Eorder extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedRowKeys: [],
      orderBeginTime: '',
      orderEndTime: '',
      orderType: 1,
      receiveNames: [], // 生成分拣单或者合并单的时候判断是否收件人信息相同，相同则则让生成
      operatorStatus: '',
      defaultOrderStatus: 3,
      listType: ''
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, preRouter, eorderList } = this.props
    if (isEmpty(eorderList) || !(preRouter && preRouter.startsWith(urls.SUPPLY_ORDER_EORDER))) {
      this._getOrderList(1)
      dispatch(actions.getShopList({ shopType: '1' }))
      dispatch(actions.getWareHouseList())
      // 获取组织
      orgLevel === '' && dispatch(queryOrgByLevel({ org: { orgMod: 1, orgLevel: 2 }}))
    }
  }
  // 获取列表数据的公用方法
  _getOrderList = (currentPage, pageSize = 10) => {
    const arg = this._getParameter(currentPage, pageSize)
    this.props.dispatch(actions.getEOrderList(arg))
    this.setState({
      selectedRowKeys: []
    })
  }

  // 获取所有搜索参数
  _getParameter = (currentPage = this.props.page.currentPage, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    const { orderBeginTime, orderEndTime, operatorStatus, defaultOrderStatus } = this.state
    const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    const param = {
      outerOrderId: arg.outerOrderId ? arg.outerOrderId : '',
      orderStatus: arg.orderStatus ? arg.orderStatus : defaultOrderStatus,
      sortStatus: arg.sortStatus ? arg.sortStatus : '',
      shopId: arg.shopId ? arg.shopId : '',
      receiveUserName: arg.receiveUserName ? arg.receiveUserName : '',
      receiveUserMobile: arg.receiveUserMobile ? arg.receiveUserMobile : '',
      orderBeginTime: orderBeginTime,
      orderEndTime: orderEndTime,
      wareHouseNo: arg.wareHouseNo ? arg.wareHouseNo : '',
      // sortUserName: arg.sortUserName ? arg.sortUserName : '',
      sortOrderId: arg.sortOrderId ? arg.sortOrderId : '',
      logisOrderId: arg.logisOrderId ? arg.logisOrderId : '',
      platformBusinessNo: arg.platformBusinessNo ? arg.platformBusinessNo : '',
      delivery: arg.delivery ? arg.delivery : '',
      currentPage: currentPage,
      pageSize: pageSize,
      operatorStatus: operatorStatus
    }
    for (let key in param) {
      if (isString(param[key]) && param[key] !== '') {
        param[key] = param[key].replace(reg, '')
      }
    }
    return param
  }
  // 格式化日期
  _formatterDate = (val) => {
    this.setState({
      orderBeginTime: isEmpty(val) ? '' : val[0].format('YYYY-MM-DD HH:mm:ss'),
      orderEndTime: isEmpty(val) ? '' : val[1].format('YYYY-MM-DD HH:mm:ss'),
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    const { page } = this.props
    const { current, pageSize } = pagination
    this._getOrderList(page.pageSize !== pageSize ? 1 : current, pageSize)
  }

  // 搜索3
  _search = () => {
    this._getOrderList(1, this.props.page.pageSize, 1)
  }

  // 点击切换查询
  _tabSearch = (e) => {
    let { setFieldsValue } = this.props.form
    if (this.state.listType === '3') {
      // resetFields['sortStatus']
      setFieldsValue({ sortStatus: '' })
    }
    // else if (this.state.listType === '4') {
    //   // resetFields['orderStatus']
    //   setFieldsValue({ orderStatus: '' })
    // }

    if (e.target.value === '') {
      setFieldsValue({ orderStatus: '3' })
      this.setState({
        listType: e.target.value,
        operatorStatus: e.target.value,
        defaultOrderStatus: 3
      }, () => {
        this._getOrderList(1)
      })
    }
    if (e.target.value === '2') {
      setFieldsValue({ orderStatus: '' })
      this.setState({
        listType: e.target.value,
        operatorStatus: e.target.value,
        defaultOrderStatus: ''
      }, () => {
        this._getOrderList(1)
      })
    }
    if (e.target.value === '3') {
      setFieldsValue({ orderStatus: '' })
      this.setState({
        listType: e.target.value,
        operatorStatus: e.target.value,
        defaultOrderStatus: ''
      }, () => {
        this._getOrderList(1)
      })
    }
    if (e.target.value === '4') {
      setFieldsValue({ orderStatus: '' })
      this.setState({
        listType: e.target.value,
        operatorStatus: e.target.value,
        defaultOrderStatus: ''
      }, () => {
        this._getOrderList(1)
      })
    }
  }

  _showLogistics = (record) => {
    this.props.dispatch(actions.getWaybillDetail({ waybillNo: record.logisOrderId })).then(
      res => {
        showModalWrapper((
          <Table
            columns={this.columnsLogistics}
            dataSource={!isEmpty(res) && !isEmpty(res.trajectoryList) ? res.trajectoryList : []}
            rowKey='waybillNo'
            locale={{
              emptyText: '暂无数据'
            }}
            pagination={false}
          />
        ), {
          title: '物流轨迹',
          width: '70%',
          bodyStyle: {
            overflow: 'auto',
            width: 'calc(100% + 18px)',
            maxHeight: '70vh'
          },
          style: {
            overflow: 'hidden',
            top: '10%'
          },
        })
      }

    )
  }

  columnsLogistics = [
    {
      key: 'operateTime',
      title: '操作时间',
      dataIndex: 'operateTime',
    },
    {
      key: 'statusInfo',
      title: '物流状态',
      dataIndex: 'statusInfo',
    },
    {
      key: 'trajectoryDetail',
      title: '轨迹详情',
      dataIndex: 'trajectoryDetail',
    }
  ]

  // 表格项
  _columns = [
    {
      title: '序号',
      dataIndex: 'index',
      key: 'index',
      fixed: 'left',
      width: 60,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{
            pageSize *
            currentPage +
            (index + 1) -
            pageSize
          }
          </span>
        )
      }
    },
    {
      title: '订单编号',
      dataIndex: 'outerOrderId',
      key: 'outerOrderId',
      render: (text, record) => {
        return (
          <Link to={`${urls.SUPPLY_ORDER_DETAIL}/?orderId=${record.orderId}`}>{ text }</Link>
        )
      }
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (text) => {
        return (
          <span>{orderStatus[text]}</span>
        )
      }
    },
    {
      title: '操作状态',
      dataIndex: 'operatorStatus',
      key: 'operatorStatus',
      render: (text, record) => {
        return (
          <span>{sortStatus[text]}</span>
        )
      }
    },
    {
      title: '配送方式',
      dataIndex: 'delivery',
      key: 'delivery',
      render: (text, record) => {
        return (
          <span>{deliveryStatus[text]}</span>
        )
      }
    },
    {
      title: '下单时间',
      dataIndex: 'outerOrderTime',
      key: 'outerOrderTime',
      width: 108
    },
    {
      title: '订单金额（元）',
      dataIndex: 'amount',
      key: 'amount',
    },
    {
      title: '收件人',
      dataIndex: 'userName',
      key: 'userName',
    },
    {
      title: '收件人电话',
      dataIndex: 'userTelephone',
      key: 'userTelephone',
    },
    {
      title: '收件人地址',
      dataIndex: 'userAddress',
      key: 'userAddress',
      render: (text, record) => {
        return (
          <span>{record.provinceName + record.cityName + record.areaName + text}</span>
        )
      }
    },
    {
      title: '店铺名称',
      dataIndex: 'shopName',
      key: 'shopName',
    },
    {
      title: '仓库部门',
      dataIndex: 'warehouseName',
      key: 'warehouseName',
    },
    {
      title: '分拣单编号',
      dataIndex: 'sortOrderId',
      key: 'sortOrderId',
    },
    {
      title: '物流单号',
      dataIndex: 'logisOrderId',
      key: 'logisOrderId',
      render: (text, record) => {
        return (
          <a onClick={() => this._showLogistics(record)}>{text}</a>
          // <a>{text}</a>
        )
      }
    },
    {
      title: '分拣人',
      dataIndex: 'sortName',
      key: 'sortName',
    },
    {
      title: '分拣开始时间',
      dataIndex: 'sortStartTime',
      key: 'sortStartTime',
      width: 108
    },
    {
      title: '分拣完成时间',
      dataIndex: 'sortFinishTime',
      key: 'sortFinishTime',
      width: 108
    }
  ]

  // 订单选择
  onSelectChange = (selectedRowKeys, selectedRows) => {
    let outOrderId = []
    selectedRows && selectedRows.map(item => {
      if (item.outerOrderId) {
        outOrderId.push(item.outerOrderId)
      }
    })

    this.setState({
      selectedRowKeys,
      receiveNames: selectedRows,
      outOrderId
    })
  }

  // 分拣单
  _sortOrder = () => {
    const { outOrderId, receiveNames } = this.state
    if (isEmpty(outOrderId)) {
      message.warn('请选择一个或多个订单')
      return
    }
    if (receiveNames.length >= 1 || receiveNames.length >= 1 && new Set(receiveNames).length !== receiveNames.length) {
      this.props.dispatch(actions.setEOrder({
        outerOrderIds: outOrderId,
        orderType: 1,
        sortType: 2
      }))
    }
  }

  // 合并分单
  _concatOrder = () => {
    const { selectedRowKeys, outOrderId } = this.state
    if (selectedRowKeys.length === 0) {
      message.warn('请选择一个订单')
      return
    }
    if (selectedRowKeys.length < 1) {
      message.warn('至少选择一条数据！')
      return
    }
    this.props.dispatch(actions.concatOrder({
      outerOrderIds: outOrderId,
      orderType: 1,
      sortType: 1
    }))
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys, listType, operatorStatus } = this.state
    const {
      eshopList,
      eorderList,
      page,
      showListSpin,
      orgLevel,
      orgList,
      orgCode,
      orgName,
      auths,
      match,
      showButtonSpin
    } = this.props

    const pages = genPagination({ ...page, pageNo: page.currentPage })
    const btnRole = auths[match.path] ? auths[match.path] : []
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: operatorStatus === '3'
      })
    }
    return (
      <div>
        <div className={styles['search-container']}>
          <Form
            id='filter-form'
          >
            <Row>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='订单编号'
                >
                  {getFieldDecorator('outerOrderId')(
                    <Input
                      placeholder='请输入订单编号'
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={8}
                id='orderStatus'
              >
                <FormItem
                  {...formItemLayout}
                  label='订单状态'
                >
                  {getFieldDecorator('orderStatus')(
                    <Select
                      disabled={listType !== '4'}
                      allowClear
                      placeholder='请选择订单状态'
                      getPopupContainer={() => document.getElementById('orderStatus')}
                    >
                      {
                        Object.keys(orderStatus).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {orderStatus[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                span={8}
                id='handleStatus'
              >
                <FormItem
                  {...formItemLayout}
                  label='操作状态'
                >
                  {getFieldDecorator('sortStatus')(
                    <Select
                      disabled={listType !== '3'}
                      allowClear
                      placeholder='请选择操作状态'
                      getPopupContainer={() => document.getElementById('handleStatus')}
                    >
                      {
                        Object.keys(sortStatus).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {sortStatus[key]}
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
              <Col
                span={8}
                id='shopNames'
              >
                <FormItem
                  {...formItemLayout}
                  label='店铺名称'
                >
                  {getFieldDecorator('shopId', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择店铺'
                      getPopupContainer={() => document.getElementById('shopNames')}
                    >
                      <Option value=''>全部</Option>
                      {
                        eshopList && eshopList.map((key) => {
                          return (
                            <Option
                              key={key.shopId}
                              value={key.shopId}
                            >
                              {key.shopName}
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
                  {...formItemLayout}
                  label='收件人'
                >
                  {getFieldDecorator('receiveUserName')(
                    <Input
                      placeholder='请输入收件人姓名'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='收件电话'
                >
                  {getFieldDecorator('receiveUserMobile')(
                    <Input
                      placeholder='请输入收件人电话'
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col
                span={8}
                id='delivery'
              >
                <FormItem
                  {...formItemLayout}
                  label='配送方式'
                >
                  {getFieldDecorator('delivery', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择配送方式'
                      getPopupContainer={() => document.getElementById('delivery')}
                    >
                      <Option value=''>全部</Option>
                      {
                        Object.keys(deliveryStatus).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {deliveryStatus[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                span={8}
                id='warehouseNo'
              >
                <FormItem
                  {...formItemLayout}
                  label='仓库部门'
                >
                  {getFieldDecorator('wareHouseNo', {
                    initialValue: orgLevel === '2' ? orgCode : ''
                  })(
                    <Select
                      allowClear
                      disabled={orgLevel === '2' ? Boolean(1) : Boolean(0)}
                      placeholder='请选择采购部门'
                      getPopupContainer={() => document.getElementById('warehouseNo')}
                    >
                      <Option value=''>全部</Option>
                      {
                        orgLevel && orgLevel === '2' ? (<Option value={orgCode} key={orgCode}>{orgName}</Option>) : (
                          orgList && orgList.map(item => {
                            return (
                              <Option key={item.orgCode} value={item.orgCode}>{item.orgName}</Option>
                            )
                          }))
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='分拣单编号'
                >
                  {getFieldDecorator('sortOrderId')(
                    <Input
                      placeholder='请输入分拣单编号'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='物流单号'
                >
                  {getFieldDecorator('logisOrderId')(
                    <Input
                      placeholder='请输入物流单号'
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={8}
                id='platformBusinessNo'
              >
                <FormItem
                  {...formItemLayout}
                  label='订单类型'
                >
                  {getFieldDecorator('platformBusinessNo', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择订单类型'
                      getPopupContainer={() => document.getElementById('platformBusinessNo')}
                    >
                      <Option value=''>全部</Option>
                      {
                        Object.keys(orderType).map((key) => {
                          return (
                            <Option
                              key={key}
                              value={key}
                            >
                              {orderType[key]}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={8} id={'dateSelect'}>
                <FormItem
                  {...formItemLayout}
                  label='下单时间'
                >
                  {getFieldDecorator('date')(
                    <RangePicker
                      style={{ width: '100%' }}
                      showTime
                      format='YYYY-MM-DD HH:mm:ss'
                      placeholder={['开始日期', '结束日期']}
                      getCalendarContainer={() => document.getElementById('dateSelect')}
                      onChange={this._formatterDate}
                    />
                  )}
                </FormItem>
              </Col>
            </Row>
            <div className='operate-btn'>
              <Button
                type='primary'
                className={styles['queryBtn']}
                onClick={this._search}
              >查询
              </Button>
              {
                btnRole.includes('creatOrder') && orgLevel === '2' &&
                <Button
                  type='primary'
                  loading={showButtonSpin}
                  onClick={this._sortOrder}
                >生成分拣单
                </Button>
              }
              {
                btnRole.includes('creatOrder') && orgLevel === '2' &&
                <Button
                  type='primary'
                  loading={showButtonSpin}
                  onClick={this._concatOrder}
                >
                  合单分拣
                </Button>
              }
            </div>
            <RadioGroup onChange={this._tabSearch} value={this.state.listType} style={{ marginBottom: 10 }}>
              <RadioButton value=''>待发货</RadioButton>
              <RadioButton value='2'>可合单</RadioButton>
              <RadioButton value='3'>进入分拣单</RadioButton>
              <RadioButton value='4'>全部</RadioButton>
            </RadioGroup>
          </Form>
        </div>
        <Table
          rowSelection={rowSelection}
          dataSource={eorderList}
          columns={this._columns}
          scroll={{ x: 2000 }}
          rowKey='outerOrderId'
          locale={{
            emptyText: '暂无数据'
          }}
          loading={showListSpin}
          onChange={this._handlePageChange}
          pagination={pages}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    eshopList: state.supplyChain.supplyOrder.eshopList,
    eshopWareHouseList: state.supplyChain.supplyOrder.eshopWareHouseList,
    eorderList: state.supplyChain.supplyOrder.eorderList,
    page: state.supplyChain.supplyOrder.page,
    showListSpin: state.common.showListSpin,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    auths: state.common.auths,
    preRouter: state.router.pre,
    waybillDetail: state.supplyChain.logistics.waybillDetail,
    showButtonSpin: state.common.showButtonSpin
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Eorder))

