import React, { Component } from 'react'
import { Form, Input, Select, Row, Col, Button, Table, Popconfirm, Divider } from 'antd'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import * as urls from 'Global/urls'
import { queryOrgByLevel } from 'Global/action'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'

import * as actions from './reduck'
import styles from './index.less'

const FormItem = Form.Item
const Option = Select.Option
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

// 订单状态
const orderStatus = {
  '1': '待采购',
  '2': '待入库',
  '3': '待结算',
  '4': '已结算'
}

class Eorder extends Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, orderList, preRouter } = this.props
    if ((isEmpty(orderList) || !(preRouter && preRouter.startsWith(urls.SUPPLY_PURCHASE_ORDER)))) {
      this._getOrderList(1, 10)
      dispatch(actions.getSupplyList())
      // 获取组织
      orgLevel === '' && dispatch(queryOrgByLevel())
    }
  }

  // 获取列表数据的公用方法
  _getOrderList = (currentPage, pageSize) => {
    const arg = this._getParameter(currentPage, pageSize)
    this.props.dispatch(actions.getOrderList(arg))
    this.setState({
      selectedRowKeys: []
    })
  }

  // 获取所有搜索参数
  _getParameter = (currentPage = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      purOrderId: arg.purOrderId ? arg.purOrderId : '',
      supplierNo: arg.supplierNo ? arg.supplierNo : '',
      status: arg.status ? arg.status : '',
      warehouseNo: arg.warehouseNo ? arg.warehouseNo : '',
      operatorName: arg.operator ? arg.operator : '',
      currentPage: currentPage,
      pageSize: pageSize
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (pagination) => {
    const { page } = this.props
    const { current, pageSize } = pagination
    this._getOrderList(page.pageSize !== pageSize ? 1 : current, pageSize)
  }

  // 搜索
  _search = () => {
    this._getOrderList(1, this.props.page.pageSize)
  }

  // 删除订单
  _delOrder = (purOrderId) => {
    const { dispatch } = this.props
    dispatch(actions.deletePurchaseOrder({
      purOrderId: purOrderId
    }))
  }

  // 确认采购
  _confirmPurchase = (purOrderId) => {
    const { dispatch } = this.props
    dispatch(actions.confirmPurchase({
      purOrderId: purOrderId
    }))
  }

  // 确认结算
  _confirmSettlement = (purOrderId) => {
    const { dispatch } = this.props
    dispatch(actions.confirmSettlement({
      purOrderId: purOrderId
    }))
  }
  // 表格项
  _columns = [
    {
      title: '序号',
      dataIndex: 'orderNo',
      key: 'orderNo',
      // width: 100,
      // fixed: 'left',
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
      title: '订单编码',
      dataIndex: 'purOrderId',
      key: 'purOrderId',
      render: (text, record) => {
        return (
          <Link to={`${urls.SUPPLY_PURCHASE_ORDERDETAIL}/?purOrderId=${record.purOrderId}`}> {text} </Link>
        )
      }
    },
    {
      title: '供应商',
      dataIndex: 'supplierName',
      key: 'supplierName',
    },
    {
      title: '单据金额（元）',
      dataIndex: 'purchaseAmount',
      key: 'purchaseAmount'
    },
    {
      title: '入库金额（元）',
      dataIndex: 'instockAmount',
      key: 'instockAmount'
    },
    {
      title: '采购部门',
      dataIndex: 'warehouseName',
      key: 'warehouseName'
    },
    {
      title: '订单状态',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        return (
          text ? orderStatus[text] : ''
        )
      }
    },
    {
      title: '操作人',
      dataIndex: 'operatorName',
      key: 'operatorName',
    },
    {
      title: '操作时间',
      dataIndex: 'modifyTime',
      key: 'modifyTime',
      width: 108,
    },
    {
      title: '入库单编码',
      dataIndex: 'instockOrderId',
      key: 'instockOrderId',
      render: (text, record) => {
        return (
          <Link to={`${urls.SUPPLY_PURCHASE_WAREHOUSEDETAIL}/?outinOrderNo=${record.instockOrderId}`}> {text} </Link>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'handle',
      key: 'handle',
      // fixed: 'right',
      // width: 180,
      render: (text, record) => {
        const { auths, match, orgLevel } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []

        if (record.status === '1') {
          return (
            <div>
              {
                btnRole.includes('confirmPur') && orgLevel === '2' && (
                  <Popconfirm
                    title='你确定要采购？'
                    onConfirm={() => {
                      this._confirmPurchase(record.purOrderId)
                    }}
                    okText='确定'
                    cancelText='取消'
                  >
                    <a href='javascript:;'>确认采购</a>
                  </Popconfirm>
                )
              }
              {
                btnRole.includes('confirmPur') && orgLevel === '2' &&
                (btnRole.includes('edit') || btnRole.includes('delete')) &&
                <Divider type='vertical' />
              }
              {
                btnRole.includes('edit') && orgLevel === '2' && (
                  <Link to={`${urls.SUPPLY_PURCHASE_EDITORDER}/?purOrderId=${record.purOrderId}`}> 编辑&nbsp;&nbsp;</Link>
                )
              }
              {
                btnRole.includes('edit') && btnRole.includes('delete') && orgLevel === '2' &&
                <Divider type='vertical' />
              }
              {
                btnRole.includes('delete') && orgLevel === '2' && (
                  <Popconfirm
                    title='你确定要删除该订单吗？'
                    onConfirm={() => {
                      this._delOrder(record.purOrderId)
                    }}
                    okText='确定'
                    cancelText='取消'
                  >
                    <a href='javascript:;'>删除</a>
                  </Popconfirm>
                )
              }
            </div>

          )
        } else if (record.status === '3') {
          return (
            <div>
              {
                btnRole.includes('confirmFinal') && orgLevel === '2' && (
                  <Popconfirm
                    title='你确定要结算？'
                    onConfirm={() => {
                      this._confirmSettlement(record.purOrderId)
                    }}
                    okText='确定'
                    cancelText='取消'
                  >
                    <a href='javascript:;'>确认结算</a>
                  </Popconfirm>
                )
              }
            </div>
          )
        }
      }
    }
  ]

  // 表格项选择
  onSelectChange = (selectedRowKeys) => {
    this.setState({ selectedRowKeys })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const {
      orderList,
      page,
      supplyList,
      orgLevel,
      orgList,
      orgCode,
      orgName,
      showListSpin
    } = this.props
    const pagination = genPagination({ ...page, pageNo: page.currentPage })
    return (
      <div>
        <div>
          <Form
            id='filter-form'
          >
            <Row>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='订单编码'
                >
                  {getFieldDecorator('purOrderId')(
                    <Input
                      placeholder='请输入订单编码'
                    />
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='supplierNo'
              >
                <FormItem
                  {...formItemLayout}
                  label='供应商'
                >
                  {getFieldDecorator('supplierNo', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择供应商'
                      getPopupContainer={() => document.getElementById('supplierNo')}
                    >
                      <Option value=''>全部</Option>
                      {
                        supplyList && supplyList.map((key) => {
                          return (
                            <Option
                              key={key.supplierNo}
                              value={key.supplierNo}
                            >
                              {key.supplierName}
                            </Option>
                          )
                        })
                      }
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                span={6}
                id='warehouseNo'
              >
                <FormItem
                  {...formItemLayout}
                  label='采购部门'
                >
                  {getFieldDecorator('warehouseNo', {
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
              <Col
                span={6}
                id='status'
              >
                <FormItem
                  {...formItemLayout}
                  label='订单状态'
                >
                  {getFieldDecorator('status', {
                    initialValue: ''
                  })(
                    <Select
                      allowClear
                      placeholder='请选择订单状态'
                      getPopupContainer={() => document.getElementById('status')}
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
            </Row>
            <Row className='search-form'>
              <Col span={6}>
                <FormItem
                  {...formItemLayout}
                  label='操作人'
                >
                  {getFieldDecorator('operator')(
                    <Input
                      placeholder='请输入操作人姓名'
                    />
                  )}
                </FormItem>
              </Col>
              <Col span={6}>
                <Button
                  type='primary'
                  className={styles['queryBtn']}
                  onClick={this._search}
                >查询
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <div className={styles['tabs']}>
          <Table
            loading={showListSpin}
            columns={this._columns}
            dataSource={orderList}
            scroll = {{ x: 1500 }}
            rowKey='purOrderId'
            locale={{
              emptyText: '暂无数据'
            }}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    orderList: state.purchase.purchaseOrder.orderList,
    page: state.purchase.purchaseOrder.page,
    supplyList: state.purchase.purchasePlan.supplyList,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    showListSpin: state.common.showListSpin,
    auths: state.common.auths,
    preRouter: state.router.pre,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Eorder))

