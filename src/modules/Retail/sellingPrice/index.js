import React, { Component } from 'react'
import { Button, Table, Form, Row, Col, Select, Input, message, Popconfirm, Spin, InputNumber } from 'antd'
import styles from './styles.less'
import { debounce } from 'Utils/function'
import { isEmpty } from 'Utils/lang'
import { fetchRetail as fetchData } from 'Utils/fetch'
import storage from 'Utils/storage'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import apis from '../apis'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'

const FormItem = Form.Item
const SelectOption = Select.Option
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
}

class SellingPrice extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasInit: false,
      list: [],
      page: {
        pageNo: 1,
        pageSize: 20,
      },
    }
    this._handleCategoryTypeList = debounce(this._handleCategoryTypeList, 800)
    this._handleGoodsTypeList = debounce(this._handleGoodsTypeList, 800)
    this._handleCategory = debounce(this._handleCategory, 800)
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategoryList())
    dispatch(Module.actions.getGoodsTypeList())
    dispatch(Module.actions.getCategory())
    this._getList()
  }

  componentWillUnmount() {
    this._willUnmountQueryArgData()
    this._willUnmountListData()
  }

  _willUnmountQueryArgData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryPar({
      goodsNo: '',
      sku: '',
      goodsName: '',
      orgCode: '',
    }))
  }

  _willUnmountListData = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getSellingPriceListAction({
      list: [],
    }))
  }

  // 表格数据列表
  _columns = [
    {
      key: 'id',
      title: '序号',
      dataIndex: 'id',
      width: 60,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.state.page
        return (
          <span>{(pageNo - 1) * pageSize + index + 1}</span>
        )
      }
    },
    {
      key: 'goodsNo',
      title: '商品编码',
      dataIndex: 'goodsNo',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
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
      key: 'retailCatgName',
      title: '前台分类',
      dataIndex: 'retailCatgName'
    },
    {
      key: 'category',
      title: '系统分类',
      dataIndex: 'category',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodCategory',
      title: '商品类型',
      dataIndex: 'goodCategory',
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
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice',
      fixed: 'right',
      render: (text, record, index) => (
        <span>
          {
            record.isEdit
              ? <InputNumber
                value={record.salePrice}
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
    //   key: 'orgName',
    //   title: '所属门店',
    //   dataIndex: 'orgName',
    //   render: (text, record) => (
    //     <span>{text && text !== 'null' && text}</span>
    //   )
    // },
    // {
    //   key: 'updateUser',
    //   title: '更新人',
    //   dataIndex: 'updateUser',
    //   render: (text, record) => (
    //     <span>{text && text !== 'null' && text}</span>
    //   )
    // },
    // {
    //   key: 'updateTime',
    //   title: '更新时间',
    //   dataIndex: 'updateTime',
    //   width: 80,
    //   render: (text, record) => (
    //     <span>{text && text !== 'null' && text}</span>
    //   )
    // },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      fixed: 'right',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('delete') &&
              <span id='popArea'>
                <Popconfirm
                  title='确认要删除吗?'
                  onConfirm={(e) => { this._delete(e, record) }}
                  okText='确认'
                  cancelText='取消'
                  placement='topLeft'
                  getPopupContainer={() => document.getElementById('popArea')}
                >
                  <a href='#'>删除</a>
                </Popconfirm>
              </span>
            }
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

  _modalGoodsColumns = [
    {
      key: 'goodsNo1',
      title: '商品编码',
      dataIndex: 'goodsNo',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'sku',
      title: 'SKU编码',
      dataIndex: 'sku',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'spec',
      title: '规格',
      dataIndex: 'spec',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsCatgName',
      title: '所属分类',
      dataIndex: 'goodsCatgName',
      render: (text, record) => (
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
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
  ]

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getSellingPriceList(arg)).then((res) => {
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
    const arg = this.props.form.getFieldsValue()
    const reg = /(^\s+)|(\s+$)/g
    return {
      ...arg,
      goodsNo: arg.goodsNo && arg.goodsNo.replace(reg, ''),
      sku: arg.sku && arg.sku.replace(reg, ''),
      goodsName: arg.goodsName && arg.goodsName.replace(reg, ''),
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

  // 删除
  _delete = (e, record) => {
    const { dispatch } = this.props
    dispatch(Module.actions.deleteSalePrice({ id: record.id })).then(res => {
      if (res.status === 'success') {
        this._getList()
      }
    })
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
    let salePrice = list[index]['salePrice']
    if (salePrice === '' || salePrice === null || salePrice === undefined) {
      message.error('请填写差异价格！')
      return
    }
    salePrice = Math.round(salePrice * 100) / 100
    dispatch(Module.actions.modifySalePrice({ id: record.id, salePrice })).then(res => {
      if (res.status === 'success') {
        list[index]['isEdit'] = false
        this.setState({ list })
      }
    })
  }

  // 修改
  _handleInputChange = (value, index) => {
    const { list } = this.state
    list[index]['salePrice'] = value
    this.setState({
      list
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.state.page.pageSize === page.pageSize) {
      this._getList(page.pageNo)
    } else {
      this._getList(1, page.pageSize)
    }
  }
  // 添加商品
  _handleAdd = () => {
    showModalSelectForm({
      modalParam: {
        title: '添加商品',
        width: '920px'
      },
      listFieldName: 'data',
      rowKey: 'sku',
      selectType: 'checkbox',
      instantSelected: false,
      fetch: fetchData,
      url: apis.sellingPrice.goodsList,
      columns: this._modalGoodsColumns,
      showOrderFlag: true,
      filter: [{
        id: 'goodsNo',
        props: {
          label: '商品编码',
        },
        element: (
          <TextArea
            placeholder='请输入商品编码'
            rows={2}
            maxLength='500'
          />
        )
      }, {
        id: 'sku',
        props: {
          label: 'SKU编码',
        },
        element: (
          <TextArea
            rows={2}
            placeholder='请输入SKU编码'
            maxLength='500'
          />
        )
      }, {
        id: 'goodsName',
        props: {
          label: '商品名称',
        },
        element: (
          <Input placeholder='请输入商品名称' maxLength='50' />
        )
      }],
      onSelect: (selectedRows) => {
        const { dispatch } = this.props
        // const shopSkuIds = selectedRows && selectedRows.map((item) => {
        //   return {
        //     id: item.id,
        //   }
        // })
        const shopSkuIds = []
        if (selectedRows) {
          selectedRows.map((item) => {
            shopSkuIds.push(item.id)
          })
        }
        dispatch(Module.actions.addSellingGood({ shopSkuIds })).then((res) => {
          if (res.status === 'success') {
            this._getList(1)
          }
        })
      },
    })
  }

  // 查询系统分类
  _handleCategoryTypeList = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategoryList())
  }

  // 查询商品类型
  _handleGoodsTypeList = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getGoodsTypeList())
  }

  // 查询前台分类
  _handleCategory = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategory())
  }

  // 获取字典类型
  _getDictValue = (dictionary, orgCode) => {
    const filterDic = dictionary.filter(item => item.orgCode === orgCode)
    if (filterDic.length > 0) {
      return filterDic[0].orgName
    }
    return ''
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showListSpin, initQueryPar, auths, match, selectFetchingFlag, categoryList, goodsTypeList, queryNoAddCategory } = this.props
    const orgLevel = storage.get('userInfo') ? storage.get('userInfo').orgLevel : ''
    const { list, page } = this.state
    const pagination = genPagination(page)
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          className='search-form'
        >
          <Row id='rowArea'>
            <Col span={6}>
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
            <Col span={6}>
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
            <Col span={6}>
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
            <Col span={6}>
              <FormItem
                label='系统分类：'
                {...formItemLayout}
              >
                {getFieldDecorator('category', {
                  initialValue: initQueryPar.category || undefined,
                })(
                  <Select
                    allowClear
                    showSearch
                    optionLabelProp='title'
                    placeholder='请选择系统分类'
                    filterOption={false}
                    onSearch={this._handleCategory}
                    notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    {!isEmpty(categoryList) && categoryList.map(shop => (
                      <SelectOption
                        key={shop.categoryNo}
                        value={shop.categoryNo}
                        title={shop.categoryName}
                      >
                        {shop.categoryName}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem
                label='前台分类：'
                {...formItemLayout}
              >
                {getFieldDecorator('frontCategoryNo', {
                  initialValue: initQueryPar.frontCategoryNo || undefined,
                })(
                  <Select
                    allowClear
                    showSearch
                    optionLabelProp='title'
                    placeholder='请选择前台分类'
                    filterOption={false}
                    onSearch={this._handleCategory}
                    notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
                    getPopupContainer={() => document.getElementById('rowArea')}
                  >
                    {!isEmpty(queryNoAddCategory) && queryNoAddCategory.map(shop => (
                      <SelectOption
                        key={shop.categoryNo}
                        value={shop.categoryNo}
                        title={shop.categoryName}
                      >
                        {shop.categoryName}
                      </SelectOption>
                    ))}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col span={6}>
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
            <Col span={12}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='点击查询'
                  style={{ marginLeft: 90 }}
                  onClick={this._handleQuery}
                >
                  查询
                </Button>
                {
                  btnRole.indexOf('add') !== -1 && orgLevel === '2' &&
                  <Button
                    type='primary'
                    onClick={this._handleAdd}
                    className={styles['button-spacing']}
                  >
                    添加商品
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
            rowKey='id'
            loading={showListSpin}
            dataSource={list}
            scroll = {{ x: 1200 }}
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
    ...state['retail.sellingPrice'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.sellingPrice'], mapStateToProps)(Form.create()(SellingPrice))
