import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
// import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Input, Select } from 'antd' // , Modal, message
import { Link } from 'react-router-dom'

import styles from './styles.less'
import { genPagination } from 'Utils/helper'
import { RETAIL_STOCK_DISTRIBUTE, RETAIL_STOCK_LIST } from 'Global/urls'

import Module from './module'
import RetailModule from '../module'
import storage from 'Utils/storage'

import { getCommonOrgList } from '../../../global/action' // 'Global/action'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class Stock extends Component {
  state = {
    orgLevel: ''
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }

  // 库存状态
  stockStatusArr = [
    { value: '1', name: '正常库存' },
    { value: '2', name: '低库存' },
    { value: '3', name: '高库存' }
  ]
  getColumns = (page) => {
    let returnColumns = []
    const { orgLevel } = this.state
    // 列表header信息
    let columnList = [
      {
        key: 'id',
        title: '序号',
        width: 80,
        fixed: 'left',
        render: (text, record, index) => {
          return page.pageSize * (page.pageNo - 1) + (index + 1)
        }
      },
      {
        key: 'skuNo',
        title: 'SKU编码',
        dataIndex: 'skuNo',
        width: 150,
        fixed: 'left'
      },
      {
        key: 'goodsName',
        title: '商品名称',
        dataIndex: 'goodsName'
      },
      orgLevel === '0' ? {
        key: 'retailCatgName',
        title: '前台分类',
        dataIndex: 'retailCatgName'
      } : null,
      {
        key: 'goodsCatgName',
        title: '系统分类',
        dataIndex: 'goodsCatgName'
      },
      {
        key: 'goodsTypeName',
        title: '商品类型',
        dataIndex: 'goodsTypeName'
      },
      {
        key: 'goodsUnit',
        title: '库存单位',
        dataIndex: 'goodsUnit'
      },
      {
        key: 'stockCount',
        title: '库存数量',
        dataIndex: 'stockCount'
      },
      {
        key: 'frozenStockCount',
        title: '占用库存',
        dataIndex: 'frozenStockCount'
      },
      {
        key: 'availStockCount',
        title: '可用库存',
        dataIndex: 'availStockCount'
      },
      {
        key: 'weightCost',
        title: '加权成本',
        dataIndex: 'weightCost'
      },
      {
        key: 'stockAmount',
        title: '库存金额',
        dataIndex: 'stockAmount'
      },
      {
        key: 'status',
        title: '库存状态',
        dataIndex: 'status'
      },
      orgLevel === '0' ? {
        key: 'warehouseName',
        title: '所属门店',
        dataIndex: 'warehouseName'
      } : null,
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        width: 100,
        fixed: 'right',
        render: (text, record, index) => {
          const { auths } = this.props
          const btnRole = auths[RETAIL_STOCK_LIST] ? auths[RETAIL_STOCK_LIST] : []
          return (
            <div className={styles['table-ope']}>
              {
                btnRole.includes('stockDistribute') &&
                (
                  orgLevel === '0' ? <Link to={{ pathname: `${RETAIL_STOCK_DISTRIBUTE}`, search: `?skuNo=${record.skuNo}&orgCode=${record.orgCode}` }}>库存分布</Link> : <Link to={{ pathname: `${RETAIL_STOCK_DISTRIBUTE}`, search: `?skuNo=${record.skuNo}` }}>库存分布</Link>
                )
              }
            </div>
          )
        }
      }
    ]
    columnList.forEach((columnIn) => {
      if (columnIn) {
        returnColumns.push(columnIn)
      }
    })
    return returnColumns
  }

  _init() {
    let userIn = storage.get('userInfo')
    this.setState({
      orgLevel: userIn.orgLevel
    })
    if (userIn.orgLevel === '0') {
      // 获得前端分类
      this._getQueryFrontCategory()
      // 获得所属门店列表
      this._getOrgList()
    }
    this._getCategory()
    setTimeout(this._getStockList, 100)
  }

  _getCategory = () => {
    const { dispatch } = this.props
    dispatch(RetailModule.actions.getCategoryList())
    dispatch(RetailModule.actions.getGoodsTypeList())
  }

  /**
   * 执行查询
   */
  _handleQuery = () => {
    this._getStockList(1)
  }

  // 获取列表数据查询参数
  _getQueryParam(current = Module.state.page.current, pageSize = Module.state.page.pageSize) {
    const { orgLevel } = this.state
    const { form } = this.props
    const arg = form.getFieldsValue()
    if (arg) {
      const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
      arg.skuNo = arg.skuNo ? arg.skuNo.replace(reg, '') : arg.skuNo
      arg.goodsName = arg.goodsName ? arg.goodsName.replace(reg, '') : arg.goodsName
    }
    return {
      ...arg,
      orgLevel: orgLevel,
      currentPage: current,
      pageSize: pageSize,
    }
  }
  // 设置列表数据查询参数
  _setQueryParam = (queryParam) => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryParam(queryParam))
  }

  /**
   * 前端分类
   */
  _getQueryFrontCategory = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getQueryFrontCategory())
  }
  /**
   * 所属门店
   */
  _getOrgList = () => {
    const { dispatch } = this.props
    dispatch(getCommonOrgList({
      org: {
        orgMod: '1',
        orgLevel: '1'
      }
    }))
  }
  /**
   * 库存列表
   */
  _getStockList = (current, pageSize) => {
    const { dispatch } = this.props
    let queryParam = this._getQueryParam(current, pageSize)
    dispatch(Module.actions.getStockList(queryParam))

    this._setQueryParam(queryParam)
  }

  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getStockList(page.current, page.pageSize)
    } else {
      this._getStockList(1, page.pageSize)
    }
  }

  render() {
    const { orgLevel } = this.state
    const { getFieldDecorator } = this.props.form
    const { showListSpin, stockList, stockQueryParam, page, categoryList, goodsTypeList, frontCategory, commonOrgList } = this.props
    page.pageNo = page.currentPage
    const pagination = genPagination(page)
    return (
      <div>
        <Form
          id='filter-form'
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={6}>
              <FormItem
                label='SKU编码'
                {...formItemLayout}
              >
                {getFieldDecorator('skuNo', {
                  initialValue: stockQueryParam.skuNo
                })(
                  <Input
                    placeholder='请输入SKU编码'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='商品名称'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsName', {
                  initialValue: stockQueryParam.goodsName
                })(
                  <Input
                    placeholder='请输入商品名称'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            {
              orgLevel === '0' && <Col span={6}>
                <FormItem
                  label='前台分类'
                  {...formItemLayout}
                >
                  {getFieldDecorator('retailCatg', {
                    initialValue: stockQueryParam.retailCatg,
                  })(
                    <Select
                      placeholder='选择前台分类'
                      allowClear={true}
                      showSearch
                      optionFilterProp='children'
                      searchPlaceholder='输入关键词'
                    >
                      {frontCategory.map((item, index) => (
                        <Select.Option
                          key={item.categoryNo}
                          value={item.categoryNo}
                        >{item.categoryName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            {
              orgLevel !== '0' && <Col span={6}>
                <FormItem
                  label='系统分类'
                  {...formItemLayout}
                >
                  {getFieldDecorator('goodsCatgNo', {
                    initialValue: stockQueryParam.goodsCatgNo,
                  })(
                    <Select
                      placeholder='选择系统分类'
                      allowClear={true}
                      showSearch
                      optionFilterProp='children'
                      searchPlaceholder='输入关键词'
                    >
                      {categoryList.map((item, index) => (
                        <Select.Option
                          key={item.categoryNo}
                          value={item.categoryNo}
                        >{item.categoryName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            <Col span={6}>
              <FormItem
                label='商品分类'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsType', {
                  initialValue: stockQueryParam.goodsType,
                })(
                  <Select
                    showSearch
                    optionFilterProp='children'
                    placeholder='选择商品类型'
                    allowClear={true}
                  >
                    {goodsTypeList.map((item, index) => (
                      <Select.Option
                        key={item.goodsTypeNo}
                        value={item.goodsTypeNo}
                      >{item.goodsTypeName}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='库存状态'
                {...formItemLayout}
              >
                {getFieldDecorator('status', {
                  initialValue: stockQueryParam.status,
                })(
                  <Select
                    placeholder='选择库存状态'
                    allowClear={true}
                  >
                    {this.stockStatusArr.map((item) => (
                      <Select.Option
                        key={item.name}
                        value={item.value}
                      >{item.name}
                      </Select.Option>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            {
              orgLevel === '0' && <Col span={6}>
                <FormItem
                  label='所属门店'
                  {...formItemLayout}
                >
                  {getFieldDecorator('orgCode', {
                    initialValue: stockQueryParam.orgCode,
                  })(
                    <Select
                      placeholder='选择所属门店'
                      allowClear={true}
                    >
                      {commonOrgList.map((item, index) => (
                        <Select.Option
                          key={item.orgCode}
                          value={item.orgCode}
                        >{item.orgName}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
            }
            <Col span={6}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  className={styles['search-btn']}
                  type='primary'
                  title='点击查询'
                  onClick={this._handleQuery}
                  style={{ left: '30px' }}
                >
                  查询
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            scroll={{ x: 2100 }}
            columns={this.getColumns(page)}
            rowKey='skuNo'
            dataSource={stockList}
            bordered
            loading={showListSpin}
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
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    commonOrgList: state['common.commonOrgList'],
    ...state['retail.stock'],
    ...state['memberCenter.integral'],
    ...state['retail']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'common.commonOrgList', 'retail', 'retail.stock'], mapStateToProps)(Form.create()(Stock))
