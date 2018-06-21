import React, { Component } from 'react'
import { Table, Form, Row, Col, Select, Input, DatePicker, Spin, Button, Popconfirm, message } from 'antd'
import { retailUrl } from '../../../config'
import params from 'Utils/params'
import storage from 'Utils/storage'

import styles from './styles.less'
import { RETAIL_ORDER_DETAIL } from 'Global/urls'
import { isEmpty } from 'Utils/lang'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const SelectOption = Select.Option

const orderStatus = {
  '0': '待付款',
  '1': '已支付',
  '2': '已退款',
  '3': '已取消',
  '4': '退款中',
}

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class OrderList extends Component {
  // 默认props
  static defaultProps = {
    shopList: [],
  }

  // 列表
  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{(currentPage - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'orderNo',
      title: '订单号',
      dataIndex: 'orderNo',
      width: 100,
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['basic-a']}>
            {
              btnRole.includes('check') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._detail(e, record) }}
              >
                {text && text !== 'null' && text}
              </a>
            }
          </div>
        )
      }
    },
    {
      key: 'orderStatus',
      title: '订单状态',
      dataIndex: 'orderStatus',
      width: 80,
      render: (text, record) => {
        return (
          <p className={styles['item-content']}>{text && text !== 'null' && orderStatus[text]}</p>
        )
      }
    },
    {
      key: 'createTime',
      title: '下单时间',
      dataIndex: 'createTime',
      width: 80,
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'orderAmount',
      title: '应收金额',
      dataIndex: 'orderAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'amount',
      title: '实收金额',
      dataIndex: 'amount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'discountAmount',
      title: '优惠金额',
      dataIndex: 'discountAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'refundAmount',
      title: '退款金额',
      dataIndex: 'refundAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'refundNo',
      title: '退款编号',
      dataIndex: 'refundNo',
      width: 80,
    },
    {
      key: 'createUser',
      title: '下单人',
      dataIndex: 'createUser',
      width: 80,
    },
    {
      key: 'orgName',
      title: '所属门店',
      dataIndex: 'orgName',
      width: 90,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'orderSource',
      title: '订单来源',
      dataIndex: 'orderSource',
      width: 80,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'payTime',
      title: '付款时间',
      dataIndex: 'payTime',
      width: 80,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'applyTime',
      title: '退货时间',
      dataIndex: 'applyTime',
      width: 80,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'orderDesc',
      title: '备注',
      dataIndex: 'orderDesc',
      width: 80,
    },
    {
      dataIndex: 'option',
      title: '操作',
      key: 'option',
      width: 100,
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['basic-a']}>
            {
              btnRole.includes('refund') &&
              <Popconfirm
                title='确认要退款吗?'
                onConfirm={() => { this._handleRefund(record.orderNo) }}
                okText='确认'
                cancelText='取消'
              >
                {
                  record.orderStatus === '1' && record.shelfNo === null
                    ? <a
                      href='javascript:void(0);'
                    >申请退款
                    </a> : ''
                }
              </Popconfirm>
            }
          </div>
        )
      }
    }
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getShopList({ orgName: '' }))
    this._getList()
  }

  componentWillUnmount() {
    if (!location.pathname.startsWith(RETAIL_ORDER_DETAIL)) {
      this._willUnmountQueryArgData()
      this._willUnmountListData()
    }
  }

  _willUnmountQueryArgData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryPar({
      orderNo: '',
      orderStatus: '',
      createUser: '',
      orgCode: '',
      startTime: '',
      endTime: '',
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getOrderListAction({
      list: [],
    }))
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getOrderList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.currentPage, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    const reg = /(^\s+)|(\s+$)/g
    return {
      ...arg,
      orderNo: arg.orderNo && arg.orderNo.replace(reg, ''),
      createUser: arg.createUser && arg.createUser.replace(reg, ''),
      startTime: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[0].format('YYYY-MM-DD') : '',
      endTime: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[1].format('YYYY-MM-DD') : '',
      currentPage: current,
      pageSize: pageSize,
    }
  }

  _setQueryPar = () => {
    const { dispatch } = this.props
    const arg = this._getParameter()
    dispatch(Module.actions.setQueryPar(arg))
  }

  // 查询门店
  _handleOrgSearch = (orgName) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getShopList({ orgName }))
  }

  // 点击查询
  _handleQuery = () => {
    this._setQueryPar()
    this._getList(1)
  }

  // 导出操作
  _handleExport = () => {
    if (isEmpty(this.props.list)) {
      message.error('暂无数据可以导出！')
      return
    }
    const userNo = storage.get('userInfo') ? storage.get('userInfo').ticket : ''
    const arg = this._getParameter()
    const param = params.json2url({ ...arg, userNo })
    let url = (retailUrl === '/') ? `http://${location.host}` : retailUrl
    let newUrl = `${url}/api/retail/admin/orderControl/order/export?${param}`
    location.href = newUrl
  }

  // 查看
  _detail = (e, record) => {
    const { history } = this.props
    history.push(`${RETAIL_ORDER_DETAIL}/${record.orderNo}`)
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 获取字典类型
  _getDictValue = (dictionary, value) => {
    const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    if (filterDic.length > 0) {
      return filterDic[0].name
    }
    return ''
  }

  // 申请退款
  _handleRefund = (orderNo) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getRefund({ orderNo })).then(res => {
      if (res.status === 'success') {
        this._getList()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { shopList, orderList, page, showListSpin, auths, match, selectFetchingFlag, initQueryPar } = this.props
    const pagination = genPagination(page)
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowArea'>
            <Col span={7}>
              <FormItem
                label='订单号：'
                {...formItemLayout}
              >
                {getFieldDecorator('orderNo', {
                  initialValue: initQueryPar.orderNo
                })(
                  <Input
                    placeholder='请输入订单号'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label='订单状态：'
                {...formItemLayout}
              >
                {getFieldDecorator('orderStatus', {
                  initialValue: initQueryPar.orderStatus
                })(
                  <Select
                    placeholder='请选择订单状态'
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    <Select.Option key='' value=''>全部</Select.Option>
                    {
                      Object.keys(orderStatus).map((key) => {
                        return (
                          <Select.Option
                            key={key}
                            value={key}
                          >
                            {orderStatus[key]}
                          </Select.Option>
                        )
                      })
                    }
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label='操作人：'
                {...formItemLayout}
              >
                {getFieldDecorator('createUser', {
                  initialValue: initQueryPar.createUser
                })(
                  <Input
                    placeholder='请输入操作人'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label='所属门店：'
                {...formItemLayout}
              >
                {getFieldDecorator('orgCode', {
                  initialValue: initQueryPar.orgCode || undefined,
                })(
                  <Select
                    allowClear
                    showSearch
                    optionLabelProp='title'
                    placeholder='请选择所属门店'
                    filterOption={false}
                    onSearch={this._handleOrgSearch}
                    notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    {!isEmpty(shopList) && shopList.map(shop => (
                      <SelectOption
                        key={shop.orgCode}
                        value={shop.orgCode}
                        title={shop.orgName}
                      >
                        {shop.orgName}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={7}>
              <FormItem
                label='下单时间：'
                {...formItemLayout}
              >
                {getFieldDecorator('orderTime', {
                  initialValue: this.props.initQueryPar.orderTime
                })(
                  <RangePicker
                    style={{ width: '100%' }}
                    format='YYYY-MM-DD'
                    // showTime={{ format: 'HH:mm:ss' }}
                    getCalendarContainer={() => document.getElementById('rowArea')}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('export') !== -1 &&
                  <Button
                    type='primary'
                    onClick={this._handleExport}
                    className={styles['button-spacing']}
                  >
                    导出
                  </Button>
                }
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='orderNo'
            loading={showListSpin}
            dataSource={orderList}
            size='small'
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
    ...state['retail.order'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.order'], mapStateToProps)(Form.create()(OrderList))
