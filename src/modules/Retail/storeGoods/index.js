import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col, Popover, Select, Input, message, Popconfirm, Spin, Checkbox, Icon } from 'antd'
import styles from './styles.less'
import { debounce } from 'Utils/function'
import { RETAIL_STORE_GOODS_DETAIL, RETAIL_STORE_GOODS } from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { fetchRetail as fetchData } from 'Utils/fetch'
import storage from 'Utils/storage'
import { showModalForm } from 'Components/modal/ModalForm'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import apis from '../apis'
import GoodsEdit from './goodsEdit'

import { connect } from '@dx-groups/arthur'
import { genPagination } from 'Utils/helper'
import Module from './module'

const FormItem = Form.Item
const SelectOption = Select.Option
const CheckboxGroup = Checkbox.Group

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 15 },
}
const goodsStatus = {
  '0': '待上架',
  '1': '已上架',
  '2': '已下架',
}
class StoreGoodList extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasInitParam: false,
      list: [],
      page: {
        pageNo: 1,
        pageSize: 20,
        records: 0
      },
      checkedValues: [],
      saleUnit: 0
    }
    this._handleOrgSearch = debounce(this._handleOrgSearch, 800)
    this._handleGoodsTypeList = debounce(this._handleGoodsTypeList, 800)
    this._handleCategory = debounce(this._handleCategory, 800)
  }

  // 生命周期， 初始化表格数据
  componentWillMount() {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategoryList())
    dispatch(Module.actions.getGoodsTypeList())
    dispatch(Module.actions.getShopList({ orgName: '' }))
    dispatch(Module.actions.getCategory({ isOtherCategory: '1' }))
    dispatch(Module.actions.getCategoryEdit({ isOtherCategory: '0' }))
    dispatch(Module.actions.getQuerySaleUnitList())
    dispatch(Module.actions.channelsList())
    this._getList()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    if (!location.pathname.startsWith(RETAIL_STORE_GOODS)) {
      dispatch(Module.actions.resetQueryPar())
    }
  }

  _getShowKey(data) {
    let elementStr = ''
    if (data) {
      elementStr = data.map((item) => {
        return item
      })
    }
    return elementStr
  }

  _getShowName = (str) => {
    const { channelsList } = this.props
    const res = channelsList && channelsList.find(item => item.channelNo === str)
    if (res) {
      return res.channelName
    }
    return ''
  }

  _channelsList(channelsList) {
    let elementStr = ''
    if (channelsList) {
      elementStr = channelsList.filter((item, i) => i > 0).map(item => {
        return item.channelName
      }).join('，')

      return elementStr
    }
  }

  _columns = [
    {
      key: 'key',
      title: '序号',
      dataIndex: 'key',
      width: 80,
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
        <Link to={`${RETAIL_STORE_GOODS_DETAIL}/${record.goodsNo}`}>
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
        <Popover
          placement='topRight'
          content={<div className={styles['pop']}>{text}</div>}
          title='规格'
        >
          <span>{text && text.length > 10 ? `${text.substring(0, 10)}...` : text}</span>
        </Popover>
      )
    },
    {
      key: 'spec',
      title: '规格',
      dataIndex: 'spec',
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsFrontCatgName',
      title: '前台分类',
      dataIndex: 'goodsFrontCatgName',
      render: (text, record) => (
        <span>{text && text !== 'null' ? text : '其他'}</span>
      )
    },
    {
      key: 'goodsCatgName',
      title: '系统分类',
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
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice',
      render: (text) => (
        <span>{(text && text !== 'null' && !isNaN(text)) ? parseFloat(text).toFixed(2) : '-'}</span>
      )
    },
    {
      key: 'status',
      title: '商品状态',
      dataIndex: 'status',
      render: (text, record) => (
        <span>{text && text !== 'null' && goodsStatus[text]}</span>
      )
    },
    {
      key: 'isWeighing',
      title: '是否称重',
      dataIndex: 'isWeighing',
      render: (text, record) => (
        <span>{text && text !== '0' ? '称重商品' : '非称重商品'}</span>
      )
    },
    {
      key: 'saleUnit',
      title: '计量单位',
      dataIndex: 'saleUnit',
      render: (text, record) => (
        <span>{text && text !== 'null' && this._getDictValue(this.props.querySaleUnitList, text)}</span>
      )
    },
  ]
  _storeColums = [
    {
      key: 'shopName',
      title: '所属门店',
      dataIndex: 'shopName',
      fixed: 'right',
      width: 200,
      render: (text) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
  ]
  _secondLevel = [
    {
      key: 'channelsNo',
      title: '渠道设置',
      dataIndex: 'channelsNo',
      fixed: 'right',
      width: 200,
      render: (text, record) => {
        const { channelsList } = this.props
        const channels = text && text.split(',').map(item => this._getShowName(item)).filter(item => !!item).join('，')
        return (
          <span>
            {text && text === '000' ? this._channelsList(channelsList) : channels && channels}
            <a
              href='javascript:;'
              style={{ paddingLeft: '10px' }}
            >
              <Icon type={'edit'} onClick={() => this._channelShowModal(record)} />
            </a>
          </span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 150,
      fixed: 'right',
      render: (text, record, index) => {
        const { auths, match } = this.props
        const btnRole = auths[match.path] ? auths[match.path] : []
        return (
          <div className={styles['table-ope']}>
            {
              btnRole.includes('shelves') &&
              <a
                href='javascript:;'
                onClick={(e) => { this._shelves(e, record) }}
              >
                {
                  (record.status === '0' || record.status === '2')
                    ? '上架'
                    : '下架'
                }
              </a>
            }
            {
              btnRole.includes('edit') &&
              <a
                href='javascript:;'
                onClick={() => this._handleSetUp({ sku: record.sku, goodsNo: record.goodsNo })}
              >编辑
              </a>
            }
            {
              btnRole.includes('delete') &&
              <span id='popArea'>
                <Popconfirm
                  title='确认要删除吗?'
                  onConfirm={(e) => { this._delete(e, record) }}
                  okText='确认'
                  cancelText='取消'
                  placement='topRight'
                  getPopupContainer={() => document.getElementById('popArea')}
                >
                  <a href='#'>删除</a>
                </Popconfirm>
              </span>
            }
          </div>
        )
      }
    }
  ]
  _modalGoodsColumns = [
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
      title: '系统分类',
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
    dispatch(Module.actions.getStoreGoodList(arg)).then((res) => {
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
    const { hasInitParam } = this.state
    const { dispatch, form, initQueryPar } = this.props
    const arg = form.getFieldsValue()
    const reg = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g
    arg.goodsNo = arg.goodsNo ? arg.goodsNo.replace(reg, '') : arg.goodsNo
    arg.sku = arg.sku ? arg.sku.replace(reg, '') : arg.sku
    arg.goodsName = arg.goodsName ? arg.goodsName.replace(reg, '') : arg.goodsName
    const param = {
      currentPage: current,
      pageSize: pageSize,
    }
    if (hasInitParam) {
      dispatch(Module.actions.setQueryPar(arg))
      return {
        ...arg,
        ...param,
      }
    } else {
      dispatch(Module.actions.setQueryPar(initQueryPar))
      this.setState({ hasInitParam: true })
      return {
        ...initQueryPar,
        ...param,
      }
    }
  }

  // 点击查询
  _handleQuery = () => {
    this._getList(1)
  }

  // 门店商品信息（设置）
  _handleSetUp = ({ sku, goodsNo }) => {
    const orgCode = storage.get('userInfo') ? storage.get('userInfo').orgCode : ''
    this.props.dispatch(Module.actions.getQueryShopGoodsInfo({ orgCode, sku, goodsNo })).then(res => {
      const { dispatch, queryShopGoodsInfo, queryNoAddCategoryEdit, querySaleUnitList } = this.props
      showModalWrapper(
        (
          <GoodsEdit
            getList={this._getList}
            dispatch = {dispatch}
            queryShopGoodsInfo={queryShopGoodsInfo}
            queryNoAddCategoryEdit={queryNoAddCategoryEdit}
            querySaleUnitList={querySaleUnitList}
          />
        ),
        {
          title: '商品设置',
          width: 700,
        }
      )
    })
  }

  // 渠道设置
  _channelShowModal = (record) => {
    const { dispatch } = this.props
    const channelsNo = record.channelsNo && record.channelsNo.split(',')
    dispatch(Module.actions.channelsList()).then(
      res => {
        const channelNos = []
        !isEmpty(this.props.channelsList) && this.props.channelsList.filter((item, i) => i > 0).map(item => (
          channelNos.push(item.channelNo)
        ))
        this.setState({
          checkedValues: channelsNo,
        }, () => {
          showModalForm({
            formItemLayout: {
              labelCol: { span: 6 },
              wrapperCol: { span: 18 }
            },
            title: '渠道设置',
            okText: '确定',
            cancelText: '取消',
            fields: [
              {
                id: 'channels',
                props: {
                  label: '请选择渠道',
                },
                options: {
                  initialValue: channelsNo,
                },
                element: (
                  <p style={{ paddingTop: '9px' }}>
                    <CheckboxGroup
                      style={{ width: '100%' }}
                      onChange={this._onChange}
                      defaultValue={record.channelsNo === '000' ? channelNos : channelsNo}
                    >
                      <Row>
                        {
                          !isEmpty(this.props.channelsList) && this.props.channelsList.filter((item, i) => i > 0).map(item => (
                            <Col
                              span={6}
                              key={item.channelNo}
                            >
                              <Checkbox
                                value={item.channelNo}
                              >
                                {item.channelName}
                              </Checkbox>
                            </Col>
                          ))}
                      </Row>
                    </CheckboxGroup>
                  </p>
                )
              },
            ],
            onOk: values => {
              const { dispatch } = this.props
              return dispatch(Module.actions.channelsStoreGood(this._getParam(values, record))).then(res => {
                if (res.status === 'success') {
                  this._getList()
                  return res
                }
              })
            }
          })
        })
      }
    )
  }

  _getParam = (values, record) => {
    if (record && record.id) {
      values['id'] = record.id
      values['channels'] = this.state.checkedValues
    }
    return values
  }

  _onChange = (checkedValues) => {
    this.setState({
      checkedValues: checkedValues,
    })
  }

  // 删除
  _delete = (e, record) => {
    const { dispatch } = this.props
    const { list, page } = this.state
    let length = list.length
    dispatch(Module.actions.deleteStoreGood({ id: record.id })).then(res => {
      if (res.status === 'success') {
        if (length > 1) {
          this._getList()
        } else if (length === 1) {
          let pageNo = page > 1 ? Number(page.pageNo) - 1 : 1
          this._getList(pageNo)
        }
      }
    })
  }

  // 上、下架
  _shelves = (e, record) => {
    const { dispatch } = this.props
    if (record.salePrice === '' || record.salePrice === null) {
      message.error('请先维护销售价！')
      return
    }
    let status = ''
    if (record.status === '0' || record.status === '2') {
      status = '1'
    } else if (record.status === '1') {
      status = '2'
    }

    dispatch(Module.actions.onAndOffGood({ id: record.id, status })).then(res => {
      if (res.status === 'success') {
        this._getList()
      }
    })
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.state.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 添加商品
  _handleAdd = () => {
    const { goodsTypeList, selectFetchingFlag, categoryList } = this.props
    showModalSelectForm({
      modalParam: {
        title: '添加商品',
        width: '920px'
      },
      listFieldName: 'data',
      rowKey: 'sku',
      selectType: 'radio',
      instantSelected: false,
      fetch: fetchData,
      url: apis.storeGoods.addQuery,
      columns: this._modalGoodsColumns,
      showOrderFlag: false,
      filter: [{
        id: 'keywords',
        props: {
          label: '关键字',
        },
        element: (
          <Input
            placeholder='SKU编码/商品编号/商品名'
            style={{ width: '189px' }}
          />
        )
      }, {
        id: 'categoryNo',
        props: {
          label: '系统分类',
        },
        element: (
          <Select
            allowClear
            showSearch
            optionLabelProp='title'
            placeholder='请选择系统分类'
            filterOption={false}
            onSearch={this._handleCategoryList}
            notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
            style={{ width: '160px' }}
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
        )
      }, {
        id: 'goodsType',
        props: {
          label: '商品类型',
        },
        element: (
          <Select
            allowClear
            showSearch
            optionLabelProp='title'
            placeholder='请选择商品类型'
            filterOption={false}
            onSearch={this._handleGoodsTypeList}
            notFoundContent={selectFetchingFlag ? <Spin size='small' /> : null}
            style={{ width: '160px' }}
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
        )
      }],
      onSelect: (selectedRows) => {
        const { dispatch } = this.props
        const goods = selectedRows.map((selectedRow) => {
          return {
            goodsNo: selectedRow.goodsNo,
            catgLevelOneNo: selectedRow.catgLevelOneNo,
            catgLevelTwoNo: selectedRow.catgLevelTwoNo,
            sku: selectedRow.sku,
          }
        })
        dispatch(Module.actions.addStoreGood({ goods })).then((res) => {
          if (res.status === 'success') {
            this._getList(1)
            this._handleSetUp({
              sku: goods[0].sku,
              goodsNo: goods[0].goodsNo,
            })
          }
        })
      },
    })
  }

  // 查询系统分类
  _handleCategoryList = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategoryList())
  }

  // 查询商品类型
  _handleGoodsTypeList = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getGoodsTypeList())
  }

  // 查询门店
  _handleOrgSearch = (orgName) => {
    const { dispatch } = this.props
    dispatch(Module.actions.getShopList({ orgName }))
  }

  // 查询前台分类
  _handleCategory = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getCategory())
  }

  // 获取字典类型
  _getDictValue = (dictionary, saleUnitCode) => {
    const filterDic = dictionary.filter(dictionary => dictionary.saleUnitCode === saleUnitCode)
    if (filterDic.length > 0) {
      return filterDic[0].saleUnitName
    }
    return ''
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const { showListSpin, initQueryPar, auths, match, shopList, selectFetchingFlag, goodsTypeList, queryNoAddCategory } = this.props
    const orgLevel = storage.get('userInfo') ? storage.get('userInfo').orgLevel : ''
    const { list, page } = this.state
    const pagination = genPagination(page)
    const btnRole = auths[match.path] ? auths[match.path] : []
    return (
      <div>
        <Form
          className={styles['parameter-wrap']}
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
            <Col span={12}>
              <div style={{ 'float': 'right' }}>
                <Button
                  type='primary'
                  title='点击查询'
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
              </div>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          {
            orgLevel !== '2' &&
            <Table
              className={styles['c-table-center']}
              columns={[...this._columns, ...this._storeColums]}
              rowKey='id'
              dataSource={list}
              bordered={true}
              loading={showListSpin}
              scroll = {{ x: 2410 }}
              onChange={this._handlePageChange}
              pagination={pagination}
            />
          }
          {
            orgLevel === '2' &&
            <Table
              className={styles['c-table-center']}
              columns={[...this._columns, ...this._secondLevel]}
              rowKey='sku'
              dataSource={list}
              bordered={true}
              loading={showListSpin}
              scroll = {{ x: 2410 }}
              onChange={this._handlePageChange}
              pagination={pagination}
            />
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    ...state['retail.storeGoods'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.storeGoods'], mapStateToProps)(Form.create()(StoreGoodList))
