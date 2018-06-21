/**
 * Created with webstorm
 * User: HuangZeXia / huangzexiameishu@163.com
 * Date: 2018/3/1
 * Time: 上午11:04
 */
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import * as urls from 'Global/urls'
import { queryOrgByLevel } from 'Global/action'
import * as actions from './reduck'
import { stockOrgList } from '../reduck'
import { Form, Input, Select, Row, Col, Button, Table, Popconfirm, message, Divider } from 'antd'

import styles from './index.less'
import storage from '../../../utils/storage'
import { isString } from '../../../utils/lang'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

// 订单状态
const orderStatus = {
  '1': '待确认',
  '2': '已确认',
  '3': '分拣中',
  '4': '待收货',
  '5': '调拨完成'
}
const sortStatus = {
  '1': '待分拣',
  '2': '分拣中',
  '3': '分拣完成',
}
class AllocateOrder extends Component {
  constructor(props) {
    super(props)
    const { orgCode, orgName, orgLevel } = storage.get('userInfo')
    this.state = {
      selectedRowKeys: [],
      outerOrderIds: [],
      hasSelected: false,
      outDepartmentName: '',
      outDepartmentNo: '',
      applyDepartmentName: orgLevel === '2' ? orgName : '',
      applyDepartmentNo: orgLevel === '2' ? orgCode : '',
      loginDepartmentNo: orgLevel === '2' ? orgCode : '',
      disabledSearch: false
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, page } = this.props
    // if ((isEmpty(allocateOrderList) || !(preRouter && preRouter.startsWith(urls.SUPPLY_ORDER)))) {
    //
    // }
    this._getOrderList(page.currentPage, 10, {
      outDepartmentNo: ''
    })
    // 获取组织
    orgLevel === '' && dispatch(queryOrgByLevel())
    dispatch(stockOrgList({
      org: {
        orgName: ''
      }
    }))
  }
  // 获取列表数据的公用方法
  _getOrderList = (currentPage, pageSize = 10, restParams = {}) => {
    const arg = this._getParameter(currentPage, pageSize)
    this.props.dispatch(actions.getAllocateOrderList({ ...arg, ...restParams }))
    this.setState({
      selectedRowKeys: []
    })
  }

  // 获取所有搜索参数
  _getParameter = (currentPage = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    const { applyDepartmentName, applyDepartmentNo, outDepartmentName } = this.state
    localStorage.setItem('applyDepartmentName', applyDepartmentName)
    localStorage.setItem('applyDepartmentNo', applyDepartmentNo)
    const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    const param = {
      allocationOrderId: arg.allocationOrderId ? arg.allocationOrderId : '',
      orderStatus: arg.orderStatus ? arg.orderStatus : '',
      outDepartmentName: outDepartmentName || '',
      outDepartmentNo: arg.outDepartmentNo ? arg.outDepartmentNo : '',
      applyDepartmentName: applyDepartmentName || '',
      applyDepartmentNo: arg.applyDepartmentNo ? arg.applyDepartmentNo : applyDepartmentNo,
      sortOrderId: arg.sortOrderId ? arg.sortOrderId : '',
      userName: arg.userName ? arg.userName : '',
      sortStatus: arg.sortStatus ? arg.sortStatus : '',
      currentPage: currentPage,
      pageSize: pageSize,
    }
    for (let key in param) {
      if (isString(param[key]) && param[key] !== '') {
        param[key] = param[key].replace(reg, '')
      }
    }
    return param
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    const { page } = this.props
    const { current, pageSize } = pagination
    this._getOrderList(page.pageSize !== pageSize ? 1 : current, pageSize)
  }

  // 搜索
  _search = () => {
    const arg = this.props.form.getFieldsValue()
    const { loginDepartmentNo } = this.state
    const { orgLevel } = this.props
    if (
      (orgLevel !== '2' && arg.applyDepartmentNo === '' && arg.outDepartmentNo === '') ||
      (arg.applyDepartmentNo !== arg.outDepartmentNo &&
      ((orgLevel !== '2') || (arg.applyDepartmentNo === loginDepartmentNo || loginDepartmentNo === arg.outDepartmentNo)))
    ) {
      this._getOrderList(1, this.props.page.pageSize)
    } else {
      message.warn('申请部门和调出部门不能选择同一部门！且必须有一个为当前部门')
    }
  }

  // 删除
  _delOrder = (allocationOrderId) => {
    this.props.dispatch(actions.allocateOrderDel({
      allocationOrderId: allocationOrderId
    }, this.props.allocateOrderFilter))
  }

  // 表格项
  _columns = [
    {
      title: '编号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      fixed: 'left',
      width: 60,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{pageSize * currentPage + (index + 1) - pageSize}</span>
        )
      }
    },
    {
      title: '订单编码',
      dataIndex: 'allocationOrderId',
      key: 'allocationOrderId',
      render: (text, record) => {
        return (
          <Link to={`${urls.SUPPLY_CATE_DETAIL}/?allocationOrderId=${record.allocationOrderId}`}>{text}</Link>
        )
      }
    },
    {
      title: '订单状态',
      dataIndex: 'orderStatus',
      key: 'orderStatus',
      render: (text) => {
        return orderStatus[text]
      }
    },
    {
      title: '分拣状态',
      dataIndex: 'sortStatus',
      key: 'sortStatus',
      render: (text) => {
        return sortStatus[text]
      }
    },
    {
      title: '单据金额（元）',
      dataIndex: 'orderAmount',
      key: 'orderAmount'
    },
    {
      title: '调出部门',
      dataIndex: 'outDepartmentName',
      key: 'outDepartmentName'
    },
    {
      title: '申请部门',
      dataIndex: 'applyDepartmentName',
      key: 'applyDepartmentName'
    },
    {
      title: '分拣编码',
      dataIndex: 'sortOrderId',
      key: 'sortOrderId'
    },
    {
      title: '物流单号',
      dataIndex: 'logisOrderId',
      key: 'logisOrderId'
    },
    {
      title: '调拨出库单',
      dataIndex: 'outboundOrderId',
      key: 'outboundOrderId'
    },
    {
      title: '调拨入库单',
      dataIndex: 'instockOrderId',
      key: 'instockOrderId',
    },
    {
      title: '收件人',
      dataIndex: 'receiveUserName',
      key: 'receiveUserName'
    },
    {
      title: '收件人电话',
      dataIndex: 'receiveUserTelephone',
      key: 'receiveUserTelephone',
    },
    {
      title: '收件人地址',
      dataIndex: 'receiveUserAddress',
      key: 'receiveUserAddress',
      render: (text, record) => {
        return (
          <span>
            {
              record.receiveUserProvince === null && record.receiveUserCity === null &&
              record.receiveUserArea === null ? text : record.receiveUserProvince + record.receiveUserCity + record.receiveUserArea + text
            }
          </span>
        )
      }
    },
    {
      title: '创建人',
      dataIndex: 'createUserName',
      key: 'createUserName'
    },
    {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      width: 108
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      fixed: 'right',
      width: 108,
      render: (text, record) => {
        const { auths, match, orgLevel } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        const { loginDepartmentNo } = this.state
        const { applyDepartmentNo } = this.props.allocateOrderFilter
        if (loginDepartmentNo === applyDepartmentNo && orgLevel === '2' && record.orderStatus === '1') {
          return (
            <div>
              {
                btnRole.includes('edit') && record.orderStatus !== '2' && (
                  <Link to={`${urls.SUPPLY_CATE_ORDER_EDIT}/?allocationOrderId=${record.allocationOrderId}`}>{'编辑'}</Link>
                )
              }
              {
                btnRole.includes('edit') && btnRole.includes('delete') && (<Divider type='vertical' />)
              }
              {
                btnRole.includes('delete') && record.orderStatus !== '2' && (
                  <Popconfirm
                    title='你确定要删除该订单吗？'
                    onConfirm={() => {
                      this._delOrder(record.allocationOrderId)
                    }}
                    placement='topRight'
                    okText='确定'
                    cancelText='取消'
                  >
                    <a href='javascript:;'>{'删除'}</a>
                  </Popconfirm>
                )
              }
            </div>
          )
        }
        return null
      }
    }
  ]

  // 生成分拣单
  _sortOrder = () => {
    const { outerOrderIds } = this.state
    if (outerOrderIds.length === 0) {
      message.warn('请至少选择一个订单进行操作')
      return
    }
    this.props.dispatch(actions.setEOrder({
      outerOrderIds: outerOrderIds,
      orderType: 2
    })).then((res) => {
      if (res === 0) {
        this._getOrderList(1)
        this.setState({ selectedRowKeys: [] })
      }
    })
  }

  // 订单选择
  onSelectChange = (selectedRowKeys, selectedRowItem) => {
    let outerOrderIds = []
    let hasSelected = false
    selectedRowItem && selectedRowItem.map(item => {
      if (parseInt(item.orderStatus) !== 3) {
        hasSelected = true
      }
      outerOrderIds.push(item.allocationOrderId)
      return outerOrderIds
    })
    this.setState({ selectedRowKeys, outerOrderIds: outerOrderIds, hasSelected: hasSelected })
  }

  // 选择申请部门或者申请部门时获取name
  _getName = (e, type) => {
    const { getStockList } = this.props
    if (!e) {
      this.setState({
        [type === '1' ? 'outDepartmentName' : 'applyDepartmentName']: '',
        [type === '1' ? 'outDepartmentNo' : 'applyDepartmentNo']: '',
      })
    }
    getStockList && getStockList.map(item => {
      if (e === item.orgCode && type === '1') {
        this.setState({
          outDepartmentName: e ? item.orgName : '',
          outDepartmentNo: e,
        })
      }
      if (e === item.orgCode && type === '2') {
        this.setState({
          applyDepartmentName: e ? item.orgName : '',
          applyDepartmentNo: e
        })
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { selectedRowKeys, hasSelected, applyDepartmentNo } = this.state
    const {
      allocateOrderList,
      page,
      showListSpin,
      getStockList,
      match,
      auths,
      allocateOrderFilter,
    } = this.props
    const orgLevel = storage.get('userInfo') && storage.get('userInfo').orgLevel
    const btnRole = auths[match.path] ? auths[match.path] : []
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    }

    return (
      <div>
        <div className={styles['search-container']}>
          <Form
            id='filter-form'
          >
            <Row className='search-form'>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='订单编码'
                >
                  {getFieldDecorator('allocationOrderId')(
                    <Input
                      placeholder='请输入订单编码'
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
                  {getFieldDecorator('orderStatus', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择订单状态'
                      getPopupContainer={() => document.getElementById('orderStatus')}
                    >
                      <Option value=''>全部</Option>
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
                id='outDepartmentNo'
              >
                <FormItem
                  {...formItemLayout}
                  label='调出部门'
                >
                  {getFieldDecorator('outDepartmentNo', {
                    initialValue: allocateOrderFilter && allocateOrderFilter.outDepartmentNo || ''
                  })(
                    <Select
                      onChange={e => { this._getName(e, '1') }}
                      placeholder='请选择调出部门'
                      getPopupContainer={() => document.getElementById('outDepartmentNo')}
                    >
                      <Option value=''>全部</Option>
                      {
                        getStockList && getStockList.map((key) => {
                          return (
                            <Option
                              key={key.orgCode}
                              value={key.orgCode}
                            >
                              {key.orgName}
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
                id='applyDepartmentNo'
              >
                <FormItem
                  {...formItemLayout}
                  label='申请部门'
                >
                  {getFieldDecorator('applyDepartmentNo', {
                    initialValue: orgLevel === '2' ? applyDepartmentNo : ''
                  })(
                    <Select
                      onChange={e => { this._getName(e, '2') }}
                      placeholder='请选择申请部门'
                      getPopupContainer={() => document.getElementById('applyDepartmentNo')}
                    >
                      <Option value=''>全部</Option>
                      {
                        getStockList && getStockList.map((key) => {
                          return (
                            <Option
                              key={key.orgCode}
                              value={key.orgCode}
                            >
                              {key.orgName}
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
                  label='分拣编码'
                >
                  {getFieldDecorator('sortOrderId')(
                    <Input
                      placeholder='请输入分拣编码'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8}>
                <FormItem
                  {...formItemLayout}
                  label='创建人'
                >
                  {getFieldDecorator('userName')(
                    <Input
                      placeholder='请输入创建人'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={8} id='sortStatus' >
                <FormItem
                  {...formItemLayout}
                  label='分拣状态'
                >
                  {getFieldDecorator('sortStatus', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择分拣状态'
                      getPopupContainer={() => document.getElementById('sortStatus')}
                    >
                      <Option value=''>全部</Option>
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
              <Col span={8}>
                <Button
                  type='primary'
                  className={styles['queryBtn']}
                  onClick={this._search}
                  disabled={this.state.disabledSearch}
                >查询
                </Button>
                {
                  btnRole.includes('setOrder') && orgLevel === '2' && (
                    <Popconfirm
                      title='你确定要生成分拣单吗？'
                      onConfirm={this._sortOrder}
                      okText='确定'
                      cancelText='取消'
                    >
                      <Button
                        type='primary'
                        disabled={!hasSelected}
                      >
                        生成分拣单
                      </Button>
                    </Popconfirm>
                  )
                }
                {
                  btnRole.includes('add') && orgLevel === '2' && (
                    <Link to={`${urls.SUPPLY_CATE_ORDER_ADD}`}><Button type='primary'>创建</Button></Link>
                  )
                }
              </Col>
            </Row>
          </Form>
        </div>
        <Table
          rowSelection={rowSelection}
          dataSource={allocateOrderList}
          columns={this._columns}
          scroll={{ x: 1800 }}
          rowKey='alloctionOrderId'
          locale={{
            emptyText: '暂无数据'
          }}
          loading={showListSpin}
          onChange={this._handlePageChange}
          pagination={{
            total: parseInt(page.records),
            pageSize: parseInt(page.pageSize),
            current: parseInt(page.currentPage),
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: total => `共 ${page.records} 项`,
            pageSizeOptions: ['5', '10', '20', '50'],
          }
          }
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    allocateOrderList: state.supplyChain.supplyOrder.allocateOrderList,
    allocateOrderFilter: state.supplyChain.supplyOrder.allocateOrderFilter,
    page: state.supplyChain.supplyOrder.allocatePage,
    showListSpin: state.common.showListSpin,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    getStockList: state.supplyChain.commonSupply.stockOrgList,
    auths: state.common.auths,
    preRouter: state.router.pre,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(AllocateOrder))
