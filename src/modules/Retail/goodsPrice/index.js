import React, { Component } from 'react'
import { Button, Table, Form, Row, Col, Input, InputNumber, Select } from 'antd'

import styles from './styles.less'
import { debounce } from 'Utils/function'
import { retailUrl } from '../../../config'
import apis from '../apis'
import params from 'Utils/params'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'
import { isEmpty } from 'Utils/lang'

const FormItem = Form.Item
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
}

class GoodPriceList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      page: {
        pageNo: 1,
        pageSize: 20,
      },
    }
    this._handleCategorySearch = debounce(this._handleCategorySearch, 800)
    this._handleGoodsTypeList = debounce(this._handleGoodsTypeList, 800)
  }
  // 生命周期， 初始化表格数据
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategoryList())
    dispatch(Module.actions.getGoodsTypeList())
    this._getList()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetQueryPar())
  }

  _columns = [
    {
      key: 'key',
      title: '序号',
      dataIndex: 'key',
      render: (text, record, index) => {
        const { pageSize, currentPage } = this.props.page
        return (
          <span>{(currentPage - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'goodsNo',
      title: '商品编码',
      dataIndex: 'goodsNo'
    },
    {
      key: 'sku',
      title: 'SKU编码',
      dataIndex: 'sku'
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName'
    },
    {
      key: 'category',
      title: '系统分类',
      dataIndex: 'category'
    },
    {
      key: 'goodCategory',
      title: '商品类型',
      dataIndex: 'goodCategory'
    },
    {
      key: 'unit',
      title: '库存单位',
      dataIndex: 'unit'
    },
    {
      key: 'brandPrice',
      title: '统一零售价',
      dataIndex: 'brandPrice',
      render: (text, record, index) => (
        <span>
          {
            record.isEdit
              ? <InputNumber
                value={record.brandPrice}
                onChange={(value) => { this._handleInputChange(value, index) }}
                style={{ width: '100px' }}
                maxLength='50'
                min={0}
                step={0.01}
              />
              : (text !== 'null' && parseFloat(text) >= 0) ? text.toFixed(2) : '-'
          }

        </span>
      )
    },
    // {
    //   key: 'updateUser',
    //   title: '更新人',
    //   dataIndex: 'updateUser'
    // },
    // {
    //   key: 'updateTime',
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   render: (text) => {
    //     return (
    //       <Popover
    //         placement='topRight'
    //         content={<div className={styles['pop']}>{moment(text).format('YYYY-MM-DD HH:mm:ss')}</div>}
    //         title='更新时间'
    //       >
    //         <span>{moment(text).format('YYYY-MM-DD')}</span>
    //       </Popover>
    //     )
    //   }
    // },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 80,
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('edit') && !record.isEdit &&
              <a
                href='javascript:;'
                onClick={(e) => { this._edit(e, record, index) }}
              >编辑
              </a>
            }
            {
              btnRole.includes('edit') && record.isEdit &&
              <a
                href='javascript:;'
                onClick={(e) => { this._save(e, record, index) }}
              >保存
              </a>
            }
          </div>
        )
      }
    }
  ]

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getGoodPriceList(arg)).then((res) => {
      if (res.status === 'success') {
        this.setState({
          page: {
            pageNo: res.result.pageNo,
            pageSize: res.result.pageSize,
            records: res.result.records
          },
          list: res.result.data,
        })
      }
    })
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.state.page.pageNo, pageSize = this.state.page.pageSize) => {
    const { dispatch, form } = this.props
    const arg = form.getFieldsValue()
    const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    arg.goodsNo = arg.goodsNo ? arg.goodsNo.replace(reg, '') : arg.goodsNo
    arg.sku = arg.sku ? arg.sku.replace(reg, '') : arg.sku
    arg.goodsName = arg.goodsName ? arg.goodsName.replace(reg, '') : arg.goodsName
    dispatch(Module.actions.setQueryPar(arg))
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 获取表单提交参数
  _getParam = (values, data) => {
    if (data && data.id) {
      values['id'] = data.id
    }
    return values
  }

  // 编辑
  _edit = (e, record, index) => {
    const { list } = this.state
    list[index]['isEdit'] = true
    this.setState({ list })
  }

  // 保存
  _save = (e, record, index) => {
    const { dispatch } = this.props
    const { list } = this.state
    let brandPrice = list[index]['brandPrice']
    if (brandPrice === '' || brandPrice === null || brandPrice === undefined) {
      message.error('请填写品牌价格！')
      return
    }
    brandPrice = Math.round(brandPrice * 100) / 100
    dispatch(Module.actions.updateGood({ sku: record.sku, brandPrice })).then(res => {
      if (res.status === 'success') {
        list[index]['isEdit'] = false
        list[index]['brandPrice'] = brandPrice
        this.setState({ list })
      }
    })
  }

  // 修改
  _handleInputChange = (value, index) => {
    const { list } = this.state
    list[index]['brandPrice'] = value
    this.setState({
      list
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 导出操作
  _handleExport = () => {
    const { initQueryPar } = this.props
    let url = (retailUrl === '/') ? `http://${location.host}` : retailUrl
    let newUrl = `${url}${apis.goodsPrice.export}?${params.json2url(initQueryPar)}`
    location.href = newUrl
  }

  // 查询系统分类
  _handleCategorySearch = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategoryList())
  }

  // 查询商品类型
  _handleGoodsTypeList = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getGoodsTypeList())
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showListSpin, initQueryPar, auths, match, categoryList, goodsTypeList, selectFetchingFlag } = this.props
    const { list, page } = this.state
    const pagination = genPagination(page)
    const btnRole = auths[match.path] ? auths[match.path] : []

    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowArea'>
            <Col span={8}>
              <FormItem
                label='商品编码：'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsNo', {
                  initialValue: initQueryPar.goodsNo,
                })(
                  <Input
                    placeholder='请输入商品编码'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='SKU编码：'
                {...formItemLayout}
              >
                {getFieldDecorator('sku', {
                  initialValue: initQueryPar.sku,
                })(
                  <Input
                    placeholder='请输入SKU编码'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='商品名称：'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsName', {
                  initialValue: initQueryPar.goodsName,
                })(
                  <Input
                    placeholder='请输入商品名称'
                    maxLength='50'
                  />
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='系统分类：'
                {...formItemLayout}
              >
                {getFieldDecorator('categoryNo', {
                  initialValue: initQueryPar.categoryNo || undefined,
                })(
                  <Select
                    allowClear
                    showSearch
                    optionLabelProp='title'
                    placeholder='请选择系统分类'
                    filterOption={false}
                    onSearch={this._handleCategorySearch}
                    notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    {!isEmpty(categoryList) && categoryList.map(item => (
                      <SelectOption
                        key={item.categoryNo}
                        value={item.categoryNo}
                        title={item.categoryName}
                      >
                        {item.categoryName}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
              <FormItem
                label='商品类型：'
                {...formItemLayout}
              >
                {getFieldDecorator('goodsType', {
                  initialValue: initQueryPar.goodsType || undefined,
                })(
                  <Select
                    allowClear
                    showSearch
                    optionLabelProp='title'
                    placeholder='请选择商品类型'
                    filterOption={false}
                    onSearch={this._handleGoodsTypeList}
                    notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    {!isEmpty(goodsTypeList) && goodsTypeList.map(item => (
                      <SelectOption
                        key={item.goodsTypeNo}
                        value={item.goodsTypeNo}
                        title={item.goodsTypeName}
                      >
                        {item.goodsTypeName}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={8}>
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
                      title='新增合同'
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
            rowKey='sku'
            dataSource={list}
            bordered={true}
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
    ...state['retail.goodsPrice'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.goodsPrice'], mapStateToProps)(Form.create()(GoodPriceList))
