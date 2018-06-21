import React, { Component } from 'react'
import { Table, Form, Row, Col, Button, Input, Modal, Select } from 'antd'
import styles from './style.less'
import { genPagination } from 'Utils/helper'
import { showModalSelectForm } from 'Components/modal/ModalSelectForm'
import { fetchRetail as fetchData } from 'Utils/fetch'
import { connect } from '@dx-groups/arthur'
import Module from './module'
import apis from '../../apis'
import { isEmpty } from 'Utils/lang'
import RetailModule from '../../module'

const FormItem = Form.Item
const TextArea = Input.TextArea

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class ShelfListAdd extends Component {
  constructor(props) {
    super(props)
    this.state = {
      shelfDetailList: []
    }
  }

  // 列表
  _columns = [
    {
      key: 'index',
      title: '序号',
      dataIndex: 'index',
      width: 50,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        if (!isEmpty(pageSize) && !isEmpty(pageNo)) {
          return (
            <span>{(pageNo - 1) * pageSize + index + 1}</span>
          )
        }
      }
    },
    {
      key: 'skuNo',
      title: 'sku编码',
      dataIndex: 'skuNo',
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
      key: 'frontCategoryName',
      title: '前台分类',
      dataIndex: 'frontCategoryName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' ? text : '其他'}</span>
        )
      }
    },
    {
      key: 'categoryName',
      title: '系统分类',
      dataIndex: 'categoryName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'goodsTypeName',
      title: '商品类型',
      dataIndex: 'goodsTypeName',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      key: 'stockCount',
      title: '系统在架库存',
      dataIndex: 'stockCount',
      width: 80,
      render: (text) => {
        return (
          <span>{text && text !== 'null' && text}</span>
        )
      }
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 80,
      render: (text, record, index) => {
        return (
          <div className={styles['table-ope']}>
            <a
              href='javascript:;'
              onClick={(e) => { this._handleDelete(e, record, index) }}
            >删除
            </a>
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
      key: 'category',
      title: '系统分类',
      dataIndex: 'category',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
    {
      key: 'goodsCategory',
      title: '商品类型',
      dataIndex: 'goodsCategory',
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
    {
      key: 'salePrice',
      title: '零售价',
      dataIndex: 'salePrice',
      render: (text, record) => (
        <span>{text && text !== 'null' && text}</span>
      )
    },
  ]

  // 生命周期， 初始化表格数据
  componentWillMount() {
    this._getList()
    this._getCategory()
  }

  componentWillUnmount() {
    this.props.dispatch(Module.actions.emptyList())
  }
  // 获取字典类型
  _getDictValue = (dictionary, value) => {
    // const filterDic = dictionary.filter(dictionary => dictionary.value === value)
    // if (filterDic.length > 0) {
    //   return filterDic[0].name
    // }
    // return ''
  }

  _getCategory = () => {
    const { dispatch } = this.props
    dispatch(RetailModule.actions.getCategoryList())
    dispatch(RetailModule.actions.getGoodsTypeList())
  }

  // 获取列表数据的公用方法
  _getList = (current, pageSize) => {
    const { dispatch } = this.props
    const arg = this._getParameter(current, pageSize)
    dispatch(Module.actions.getShelfAddList(arg))
  }

  // 获取所有表格需要的参数
  _getParameter = (current = this.props.page.pageNo, pageSize = this.props.page.pageSize) => {
    const { match } = this.props
    if (match.params && match.params.shelfNo) {
      const arg = { shelfNo: match.params.shelfNo }
      return {
        ...arg,
        currentPage: current,
        pageSize: pageSize,
      }
    }
  }

  // 点击分页获取列表数据
  _handlePageChange = (page) => {
    if (this.props.page.pageSize === page.pageSize) {
      this._getList(page.current)
    } else {
      this._getList(1, page.pageSize)
    }
  }

  // 删除商品
  _handleDelete = (event, record) => {
    const { dispatch } = this.props
    if (record.stockCount > 0) {
      Modal.confirm({
        title: '删除?',
        content: '该商品还存在在架库存，删除前请确认该商品已经从货架上移除。',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk: () => {
          dispatch(Module.actions.shelfGoodsDelete({ sku: record.skuNo, shelfNo: this.props.shelfObj && this.props.shelfObj.shelfNo })).then(status => {
            if (status) {
              this._getList()
            }
          })
        },
        onCancel() {
        },
      })
    } else {
      dispatch(Module.actions.shelfGoodsDelete({ sku: record.skuNo, shelfNo: this.props.shelfObj && this.props.shelfObj.shelfNo })).then(status => {
        if (status) {
          this._getList()
        }
      })
    }
  }

  // 添加商品
  _handleAdd = () => {
    const { categoryList, goodsTypeList } = this.props
    showModalSelectForm({
      modalParam: {
        title: '添加商品',
        width: '1000px'
      },
      listFieldName: 'data',
      rowKey: 'sku',
      selectType: 'checkbox',
      instantSelected: false,
      fetch: fetchData,
      url: apis.shelfList.addQuery,
      columns: this._modalGoodsColumns,
      showOrderFlag: true,
      filter: [{
        id: 'keywords',
        props: {
          label: '关键字',
        },
        element: (
          <TextArea
            placeholder='SKU编码\商品名\拼音码'
            rows={1}
            maxLength='500'
          />
        )
      }, {
        id: 'goodsCatgNo',
        props: {
          label: '选择系统分类',
        },
        element: (
          <Select
            placeholder='选择系统分类'
            allowClear={true}
            showSearch={true}
            style={{ width: '200px' }}
            optionFilterProp='children'
          >
            {categoryList.map((item, index) => (
              <Select.Option
                key={item.categoryNo}
                value={item.categoryNo}
              >{item.categoryName}
              </Select.Option>
            ))}
          </Select>
        )
      }, {
        id: 'goodsType',
        props: {
          label: '商品名称',
        },
        element: (
          <Select
            placeholder='选择商品类型'
            allowClear={true}
            style={{ width: '200px' }}
          >
            {goodsTypeList.map((item, index) => (
              <Select.Option
                key={item.goodsTypeNo}
                value={item.goodsTypeNo}
              >{item.goodsTypeName}
              </Select.Option>
            ))}
          </Select>
        )
      }],
      onSelect: (selectedRows) => {
        const { dispatch, match } = this.props
        let skuNos = []

        selectedRows.forEach(key => {
          skuNos.push(
            key.sku
          )
        })
        dispatch(Module.actions.addStoreGood({ skuNos: skuNos, shelfNo: match.params && match.params.shelfNo })).then((res) => {
          if (res) {
            this._getList()
          }
        })
      },
      beforeSearch: (params) => {
        const { match } = this.props
        return {
          ...params,
          shelfNo: match.params ? match.params.shelfNo : '',
        }
      }
    })
  }

  render() {
    const { showListSpin, shelfObj, list, page } = this.props
    const pagination = genPagination(page)
    return (
      <div>
        <div className={styles['card-wrapper']}>
          <Row
            justify='start'
            type='flex'
          >
            <Col span={5}>
              <FormItem
                {...formItemLayout}
                label='货架名称：'
              >
                <span className='ant-form-text'>{shelfObj && shelfObj.shelfName}</span>
              </FormItem>
            </Col>
            <Col span={19}>
              <div style={{ 'float': 'right' }}>
                <Button
                  type='primary'
                  onClick={this._handleAdd}
                >
                  添加商品
                </Button>
                <Button
                  type='primary'
                  onClick={() => history.go(-1)}
                  className={styles['button-spacing']}
                >返回
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className={styles['table-wrapper']}>
          <Table
            columns={this._columns}
            rowKey='skuNo'
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
    ...state['retail.shelf.list'],
    ...state['retail'],
    auths: state['common.auths'],
    showListSpin: state['common.showListSpin'],
  }
}
export default connect(['common.auths', 'common.showListSpin', 'retail.shelf.list', 'retail'], mapStateToProps)(Form.create()(ShelfListAdd))
