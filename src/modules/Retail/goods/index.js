import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Input, Select, Spin } from 'antd'
import styles from './styles.less'
import { debounce } from 'Utils/function'
import { RETAIL_GOODS_ADD, RETAIL_GOODS_EDIT, RETAIL_GOODS_DETAIL, RETAIL_GOODS } from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { retailUrl } from '../../../config'
import apis from '../apis'
import params from 'Utils/params'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'

const FormItem = Form.Item
const SelectOption = Select.Option

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 17 },
}

class GoodList extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
    this._handleCategorySearch = debounce(this._handleCategorySearch, 800)
    this._handleGoodsTypeList = debounce(this._handleGoodsTypeList, 800)
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(RETAIL_GOODS)) {
      dispatch(Module.actions.resetQueryPar())
    }
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategoryList())
    dispatch(Module.actions.getGoodsTypeList())
    this._getList()
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
      dataIndex: 'goodsNo',
      render: (text, record) => (
        <Link to={`${RETAIL_GOODS_DETAIL}/${record.goodsNo}`}>
          {text}
        </Link>
      )
    },
    {
      key: 'sku',
      title: 'SKU编码',
      dataIndex: 'sku',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsCatgName',
      title: '系统分类',
      dataIndex: 'goodsCatgName',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsTypeName',
      title: '商品类型',
      dataIndex: 'goodsTypeName',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'unit',
      title: '库存单位',
      dataIndex: 'unit',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      render: (text, record) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('edit') &&
              <Link to={`${RETAIL_GOODS_EDIT}/${record.goodsNo}`}>
                编辑
              </Link>
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
    dispatch(Module.actions.getGoodList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.currentPage, pageSize = this.props.page.pageSize) => {
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

  // 导出操作
  _handleExport = () => {
    const { initQueryPar } = this.props
    let url = (retailUrl === '/') ? `http://${location.host}` : retailUrl
    let newUrl = `${url}${apis.goods.export}?${params.json2url(initQueryPar)}`
    location.href = newUrl
  }

  // 修改商品
  _edit = (e, record) => {
    const { history } = this.props
    history.push(`${RETAIL_GOODS_EDIT}/${record.contractId}`)
  }

  // 商品详情
  _detail = (e, record) => {
    const { history } = this.props
    history.push(`${RETAIL_GOODS_DETAIL}/${record.contractId}`)
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
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
    const { auths, showListSpin, goodList, initQueryPar, page, match, selectFetchingFlag, categoryList, goodsTypeList } = this.props
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
                  className={styles['button-spacing']}
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('add') !== -1 &&
                  <Link to={`${RETAIL_GOODS_ADD}`}>
                    <Button
                      type='primary'
                      className={styles['button-spacing']}
                    >
                      新增
                    </Button>
                  </Link>
                }
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
            rowKey='sku'
            dataSource={goodList}
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
    ...state['retail.goods'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.goods'], mapStateToProps)(Form.create()(GoodList))
