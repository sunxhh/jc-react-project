import React, { Component } from 'react'
import { Table, Form, Row, Col, Select, Input, DatePicker, Spin, Button, Popover } from 'antd'

import styles from './styles.less'
import { isEmpty } from 'Utils/lang'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'

const { RangePicker } = DatePicker
const FormItem = Form.Item
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class SaleDetail extends Component {
  // 默认props
  static defaultProps = {
    shopList: [],
    saleDetail: [],
  }

  // 列表
  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 80,
      fixed: 'left',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.detailPage
        return (
          <span>{(currentPage - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'sku',
      title: 'SKU编码',
      dataIndex: 'sku',
      width: 150,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName',
      width: 200,
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '商品名称'
          >
            <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
          </Popover>)
      }
    },
    {
      key: 'category',
      title: '商品分类',
      dataIndex: 'category',
      width: 200,
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '商品分类'
          >
            <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
          </Popover>)
      }
    },
    {
      key: 'scale',
      title: '规格',
      dataIndex: 'scale',
      width: 200,
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '规格'
          >
            <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
          </Popover>)
      }
    },
    {
      key: 'unit',
      title: '库存单位',
      dataIndex: 'unit',
      width: 100,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'shopName',
      title: '门店名称',
      dataIndex: 'shopName',
      width: 200,
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '门店名称'
          >
            <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
          </Popover>)
      }
    },
    {
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice',
      width: 120,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'quantity',
      title: '销量',
      dataIndex: 'quantity',
      width: 120,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'actualAmount',
      title: '应收金额',
      dataIndex: 'actualAmount',
      width: 120,
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
      width: 120,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'raiseAmount',
      title: '加价金额',
      dataIndex: 'raiseAmount',
      width: 120,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'realAmount',
      title: '实收金额',
      dataIndex: 'realAmount',
      width: 120,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'gift',
      title: '赠品',
      dataIndex: 'gift',
      width: 200,
      render: (text) => {
        return (
          <Popover
            content = {<div className={styles['pop']}>{text}</div>}
            title = '赠品'
          >
            <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
          </Popover>)
      }
    },
    {
      key: 'payment',
      title: '支付方式',
      dataIndex: 'payment',
      width: 120,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'operator',
      title: '收银员',
      dataIndex: 'operator',
      width: 120,
      fixed: 'right',
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'orderDate',
      title: '下单时间',
      dataIndex: 'orderDate',
      width: 120,
      fixed: 'right',
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
    this._willUnmountQueryArgData()
    this._willUnmountListData()
  }

  _willUnmountQueryArgData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.setDetailQueryPar({
      keywords: '',
      orgCode: '',
      orderStartTime: '',
      orderEndTime: '',
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getSaleDetailAction({
      saleDetail: []
    }))
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getSaleDetail(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.detailPage.currentPage, pageSize = this.props.detailPage.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    const reg = /(^\s+)|(\s+$)/g
    return {
      ...arg,
      keywords: arg.keywords && arg.keywords.replace(reg, ''),
      orderStartTime: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[0].format('YYYY-MM-DD') : '',
      orderEndTime: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[1].format('YYYY-MM-DD') : '',
      currentPage: current,
      pageSize: pageSize,
    }
  }

  _setQueryPar = () => {
    const { dispatch } = this.props
    const arg = this._getParameter()
    dispatch(Module.actions.setDetailQueryPar(arg))
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

  // 点击分页获取列表数据
  _handlePageChange = (detailPage) => {
    if (this.props.detailPage.pageSize === detailPage.pageSize) {
      this._getList(detailPage.current)
    } else {
      this._getList(1, detailPage.pageSize)
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
    const { shopList, saleDetail, gatherMap, detailPage, showListSpin, selectFetchingFlag, initQueryPar } = this.props
    const pagination = genPagination(detailPage)
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowArea'>
            <Col span={6}>
              <FormItem
                label=''
              >
                {getFieldDecorator('keywords', {
                  initialValue: initQueryPar.keywords
                })(
                  <Input
                    placeholder='SKU编码/商品名/首字母'
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
        <div className={styles['table-wrapper']} style={{ paddingBottom: 20 }}>
          <Row>
            <Col span={24}>
              <label>统计：</label>销量总计：{gatherMap && gatherMap.saleCountTotal}；应收金额总计：{gatherMap && gatherMap.actualAmountTotal} 元 ；实收金额总计：{gatherMap && gatherMap.realAmountTotal} 元
            </Col>
          </Row>
        </div>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='index'
            scroll = {{ x: 2410 }}
            loading={showListSpin}
            dataSource={saleDetail}
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
    ...state['retail.report'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.report'], mapStateToProps)(Form.create()(SaleDetail))
