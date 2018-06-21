import React, { Component } from 'react'
import { Table, Form, Row, Col, Select, Input, DatePicker, Button, Spin } from 'antd'
// import { connect } from 'react-redux'
import { connect } from '@dx-groups/arthur'
// import { debounce } from 'Utils/function'

import styles from './styles.less'
import { RETAIL_BILL_ORDER } from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPagination } from 'Utils/helper'
import Module from './module'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class BillList extends Component {
  // 默认props
  static defaultProps = {
    list: [],
  }

  // 套餐列表
  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{(currentPage - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'accountNo',
      title: '单据编号',
      dataIndex: 'accountNo',
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
      key: 'orderCounts',
      title: '订单总数',
      dataIndex: 'orderCounts',
      width: 80,
      render: (text, record) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'saleCounts',
      title: '销售数量',
      dataIndex: 'saleCounts',
      width: 80,
      render: (text, record) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'refundCounts',
      title: '退款数量',
      dataIndex: 'refundCounts',
      width: 80,
      render: (text, record) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'receivableAmounts',
      title: '应收金额',
      dataIndex: 'receivableAmounts',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'receivedAmounts',
      title: '实收金额',
      dataIndex: 'receivedAmounts',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'promotionAmounts',
      title: '优惠金额',
      dataIndex: 'promotionAmounts',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'refundAmounts',
      title: '退款金额',
      dataIndex: 'refundAmounts',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'orgName',
      title: '所属门店',
      dataIndex: 'orgName',
      width: 90,
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'createUser',
      title: '操作人',
      dataIndex: 'createUser',
      width: 80,
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'createTime',
      title: '操作时间',
      dataIndex: 'createTime',
      width: 80,
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
  ]

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getShopList({ orgName: '' }))
    this._getList()
  }

  componentWillUnmount() {
    if (!location.pathname.startsWith(RETAIL_BILL_ORDER)) {
      this._willUnmountQueryArgData()
      this._willUnmountListData()
    }
  }

  _willUnmountQueryArgData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryPar({
      accountNo: '',
      createUser: '',
      startTime: '',
      endTime: '',
      orgCode: '',
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getBillListAction({
      billList: [],
    }))
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getBillList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.currentPage, pageSize = this.props.page.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    const reg = /(^\s+)|(\s+$)/g
    return {
      ...arg,
      accountNo: arg.accountNo && arg.accountNo.replace(reg, ''),
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

  // 点击查询
  _handleQuery = () => {
    this._setQueryPar()
    this._getList(1)
  }

  // 查看
  _detail = (e, record) => {
    const { history } = this.props
    history.push(`${RETAIL_BILL_ORDER}/${record.accountNo}`)
  }

  // 查询门店
  _handleOrgSearch = (orgName) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getShopList({ orgName }))
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
  render() {
    const { getFieldDecorator } = this.props.form
    const { shopList, billList, page, showListSpin, selectFetchingFlag } = this.props
    const pagination = genPagination(page)
    
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowArea'>
            <Col span={5}>
              <FormItem
                label='单据编号：'
                {...formItemLayout}
              >
                {getFieldDecorator('accountNo', {
                  initialValue: this.props.initQueryPar.accountNo
                })(
                  <Input
                    placeholder='请输入单据编号'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                label='操作人：'
                {...formItemLayout}
              >
                {getFieldDecorator('createUser', {
                  initialValue: this.props.initQueryPar.createUser
                })(
                  <Input
                    placeholder='请输入操作人'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                label='所属门店：'
                {...formItemLayout}
              >
                {getFieldDecorator('orgCode', {
                  initialValue: this.props.initQueryPar.orgCode || undefined,
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
            <Col span={2}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='accountNo'
            loading={showListSpin}
            dataSource={billList}
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
    ...state['retail.closeBill'],
    // ...state['retail.order'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.showListSpin', 'common.auths', 'retail.closeBill'], mapStateToProps)(Form.create()(BillList))
