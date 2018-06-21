import React, { Component } from 'react'
import { Table, Form, Row, Col, Select, DatePicker, Spin, Button, message } from 'antd'
import { reportUrl } from '../../../config'
import params from 'Utils/params'
import storage from 'Utils/storage'

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

class Goods extends Component {
  // 默认props
  static defaultProps = {
    shopList: [],
    rankGoodsList: [],
  }

  // 列表
  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 60,
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.rankGoodsPage
        return (
          <span>{(currentPage - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'sku',
      title: 'SKU编码',
      dataIndex: 'sku',
      width: 100,
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
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'category',
      title: '商品分类',
      dataIndex: 'category',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'unit',
      title: '库存单位',
      dataIndex: 'unit',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'averagePrice',
      title: '平均价格',
      dataIndex: 'averagePrice',
      width: 80,
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
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'quantityRatio',
      title: '销量占比',
      dataIndex: 'quantityRatio',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'salesAmount',
      title: '销售额',
      dataIndex: 'salesAmount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'salesAmountRatio',
      title: '销售占比',
      dataIndex: 'salesAmountRatio',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
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
    dispatch(Module.actions.setGoodsQueryPar({
      orgCode: '',
      orderStartTime: '',
      orderEndTime: '',
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getGoodsAction({
      rankGoodsList: [],
    }))
  }
  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getRankGoodsList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.rankGoodsPage.currentPage, pageSize = this.props.rankGoodsPage.pageSize) => {
    const arg = this.props.form.getFieldsValue()
    return {
      ...arg,
      orderStartTime: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[0].format('YYYY-MM-DD') : '',
      orderEndTime: arg.orderTime && arg.orderTime.length > 0 ? arg.orderTime[1].format('YYYY-MM-DD') : '',
      currentPage: current,
      pageSize: pageSize,
    }
  }

  _setQueryPar = () => {
    const { dispatch } = this.props
    const arg = this._getParameter()
    dispatch(Module.actions.setGoodsQueryPar(arg))
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
    if (isEmpty(this.props.rankGoodsList)) {
      message.error('暂无数据可以导出！')
      return
    }
    const ticket = storage.get('userInfo') ? storage.get('userInfo').ticket : ''
    const arg = this._getParameter()
    const param = params.json2url({ ...arg, ticket })
    let url = (reportUrl === '/') ? `http://${location.host}` : reportUrl
    let newUrl = `${url}/api/retail/admin/report/saleRank/exportByGoods?${param}`
    location.href = newUrl
  }

  // 点击分页获取列表数据
  _handlePageChange = (rankGoodsPage) => {
    if (this.props.rankGoodsPage.pageSize === rankGoodsPage.pageSize) {
      this._getList(rankGoodsPage.current)
    } else {
      this._getList(1, rankGoodsPage.pageSize)
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { shopList, rankGoodsList, rankGoodsPage, showListSpin, selectFetchingFlag, initQueryPar } = this.props
    const pagination = genPagination(rankGoodsPage)
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={6}>
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
                <Button
                  type='primary'
                  onClick={this._handleExport}
                  className={styles['button-spacing']}
                >
                  导出
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            className={styles['c-table-center']}
            columns={this._columns}
            rowKey='sku'
            loading={showListSpin}
            dataSource={rankGoodsList}
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
    ...state['retail.report'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.report'], mapStateToProps)(Form.create()(Goods))
