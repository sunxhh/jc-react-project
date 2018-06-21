import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, TreeSelect, message, Button, Form } from 'antd'
import { Link } from 'react-router-dom'
import moment from 'moment'

import { isEmpty } from 'Utils/lang'
import parmasUtil from 'Utils/params'
import { supplyChainUrl } from '../../../../config'
import storage from 'Utils/storage'
import * as urls from 'Global/urls'
import { genPlanColumn, genPagination, genEllipsisColumn } from 'Utils/helper'
import Filter from 'Components/Filter'

import { getFormulaList } from './reduck'
import styles from './formula.less'
import { PageTypes, BoundTypes, GoodsTypes } from './dict'
import { goodscatgList } from '../../reduck'

const TreeNode = TreeSelect.TreeNode

class Formula extends Component {
  constructor(props) {
    super(props)
    // initial state
    let pageType = PageTypes.INFO
    if (props.match.path === urls.SUPPLY_STOCK_OPERATE_OUTBOUND_NEW) {
      pageType = PageTypes.NEW
    } else if (props.match.path === urls.SUPPLY_STOCK_OPERATE_OUTBOUND_EDIT) {
      pageType = PageTypes.EDIT
    }
    this.state = {
      pageType,
      dataSource: [],
    }
  }
  // 设置 props 默认值
  static defaultProps = {
    list: [],
    page: {
      currentPage: 1,
      total: 0,
      pageSize: 10,
    }
  };

  componentWillMount() {
    const { dispatch, filter, list, preRouter } = this.props
    if (isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_GOODS_FORMULA))) {
      dispatch(getFormulaList({ currentPage: 1, pageSize: 10 }))
    } else {
      dispatch(getFormulaList(filter))
    }
    dispatch(goodscatgList({ parentNo: '', status: '1' }))
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.list !== nextProps.list) {
      this.setState({
        dataSource: nextProps.list
      })
    }
  }

  _handleDelete = record => {
    this.setState(prevState => ({
      dataSource: prevState.dataSource.filter(item => item.skuNo !== record.skuNo)
    }))
  }

  _columns = [
    {
      key: 'index',
      title: '序号',
      fixed: 'left',
      width: 80,
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.page
        return (
          <span>
            {parseInt(pageSize * pageNo + (index + 1) - pageSize, 10)}
          </span>
        )
      }
    },
    genEllipsisColumn('goodsNo', '货物编码', 20),
    { key: 'skuNo', title: 'SKU 编码', render: (text, record) => (
      <Link
        style={{ cursor: 'pointer' }}
        to={{
          pathname: `${urls.SUPPLY_GOODS_FORMULA_INFO}/${record.skuNo}`,
          state: { current: record }
        }}
      >
        {record.skuNo}
      </Link>
    )
    },
    genEllipsisColumn('goodsName', '货物名称', 10),
    { key: 'skuSpecs', title: '规格', render: (text, record) => {
      const specs = record.skuSpecs.map((o) => o.specName)
      const specsString = specs.join('/')
      return specsString
    }
    },
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsTypeName', '货物类型'),
    genPlanColumn('goodsUnit', '库存单位'),
    { key: 'isBound', title: '绑定状态', render: (text, record) => record.isBound === 1 ? '已绑定' : '未绑定' },
    { key: 'modifyTime', title: '更新时间', width: 108, render: (text, record) => moment(record.modifyTime).format('YYYY-MM-DD HH:mm:ss') },
    {
      key: 'operation',
      title: '操作',
      fixed: 'right',
      width: 90,
      render: (text, record) => {
        if (record.isBound === 1) {
          return (
            <Link
              style={{ cursor: 'pointer' }}
              to={{
                pathname: `${urls.SUPPLY_GOODS_FORMULA_EDIT}/${record.skuNo}`,
                state: { current: record }
              }}
            >
              编辑
            </Link>
          )
        } else {
          return (
            <Link
              style={{ cursor: 'pointer' }}
              to={{
                pathname: `${urls.SUPPLY_GOODS_FORMULA_BOUND}/${record.skuNo}`,
                state: { current: record }
              }}
            >
              绑定
            </Link>
          )
        }
      }
    },
  ]

  _handlePageChange = (page) => {
    const { filter, dispatch } = this.props
    const newFilter = Object.assign({}, filter, { currentPage: filter.pageSize !== page.pageSize ? 1 : page.current, pageSize: page.pageSize })
    dispatch(getFormulaList(newFilter))
  }

  _selectChange = (rule, value, callback) => {
    const { goodsCatgList } = this.props
    const { setFieldsValue } = this.category
    const bool = goodsCatgList && goodsCatgList.some(item => { return item.goodsCatgNo === value })
    if (bool) {
      message.warning('请勿选择一级分类', 2)
      setFieldsValue({
        goodsCatgNo: ''
      })
    } else {
      callback()
    }
  }

  _genFilterFields = () => {
    const { goodsCatgList, filter } = this.props
    const fields = [
      {
        key: 'goodsNo',
        label: '货物编码',
        initialValue: filter.goodsNo || '',
        type: 'Input',
      }, {
        key: 'skuNo',
        label: 'SKU 编码',
        initialValue: filter.skuNo || '',
        type: 'Input'
      }, {
        key: 'goodsName',
        label: '货物名称',
        initialValue: filter.goodsName || '',
        type: 'Input',
      }, {
        key: 'goodsCatgNo',
        label: '货物分类',
        initialValue: filter.goodsCatgNo,
        rules: [{
          validator: (rule, value, callback) => {
            this._selectChange(rule, value, callback)
          }
        }],
        element: (
          <TreeSelect
            style={{ width: 180 }}
            showSearch
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            placeholder='请选择所属货物分类'
            treeNodeFilterProp='title'
            allowClear
            getPopupContainer={() => document.getElementById('listFilter')}
          >
            {
              goodsCatgList && goodsCatgList.map(item => {
                if (item.childGoodsCatgList && !isEmpty(item.childGoodsCatgList)) {
                  return (
                    <TreeNode
                      value={item.goodsCatgNo}
                      title={item.goodsCatgName}
                      key={item.goodsCatgNo}
                    >
                      {
                        item.childGoodsCatgList.map(i => {
                          if (i.childGoodsCatgList && !isEmpty(i.childGoodsCatgList)) {
                            return (
                              <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo}>
                                {
                                  i.childGoodsCatgList.map(ele => {
                                    return (
                                      <TreeNode value={ele.goodsCatgNo} title={ele.goodsCatgName} key={ele.goodsCatgNo} />
                                    )
                                  })
                                }
                              </TreeNode>
                            )
                          } else {
                            return (
                              <TreeNode value={i.goodsCatgNo} title={i.goodsCatgName} key={i.goodsCatgNo} />
                            )
                          }
                        })
                      }
                    </TreeNode>
                  )
                } else {
                  return (
                    <TreeNode
                      value={item.goodsCatgNo}
                      disabled={true}
                      title={item.goodsCatgName}
                      key={item.goodsCatgNo}
                    />
                  )
                }
              })
            }
          </TreeSelect>
        )
      }, {
        key: 'isBound',
        label: '绑定状态',
        type: 'Select',
        placeHolder: '请选择绑定状态',
        content: BoundTypes,
        initialValue: filter.isBound || '',
      }, {
        key: 'goodsType',
        label: '货物类型',
        type: 'Select',
        placeHolder: '请选择货物类型',
        content: GoodsTypes,
        initialValue: filter.goodsType || '',
      }
    ]
    return fields
  }

  _handleSearch = searchData => {
    const notEmptyValues = {
      goodsNo: searchData.goodsNo.trim(),
      skuNo: searchData.skuNo.trim(),
      goodsName: searchData.goodsName.trim(),
      goodsCatgNo: searchData.goodsCatgNo,
      isBound: searchData.isBound,
      goodsType: searchData.goodsType
    }
    const { filter, dispatch } = this.props
    const finalFilter = Object.assign({}, filter, notEmptyValues, { currentPage: 1 })
    dispatch(getFormulaList(finalFilter))
  }

  _handleExport = () => {
    const values = this.props.filter
    const exportBean = {
      goodsType: values.goodsType || '',
      goodsNo: values.goodsNo || '',
      skuNo: values.skuNo || '',
      goodsName: values.goodsName || '',
      goodsCatgNo: values.goodsCatgNo || '',
      isBound: values.isBound
    }
    const params = parmasUtil.json2url(exportBean)
    const ticket = storage.get('userInfo').ticket
    const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/cargo/formula/export/v1?ticket=${ticket}&${params}`
    location.href = href
  }
  render() {
    const { showListSpin, page } = this.props
    const { dataSource } = this.state
    const fields = this._genFilterFields()
    const pagination = genPagination(page)

    return (
      <div className={styles.inbound}>
        <div className={styles.filter}>
          <Filter
            ref={(ref) => { this.category = ref }}
            fields={fields}
            onSearch={this._handleSearch}
            extraBtns={
              [
                <Button
                  onClick={this._handleExport}
                  type='primary'
                  key='export'
                >导出
                </Button>

              ]
            }
          />
        </div>
        <Table
          scroll = {{ x: 1300 }}
          rowKey='skuNo'
          columns={this._columns}
          dataSource={dataSource}
          pagination={pagination}
          loading={showListSpin}
          onChange={this._handlePageChange}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    goodsCatgList: state.purchase.commonPurc.goodscatgListData,

    list: state.purchase.goods && state.purchase.goods.formula && state.purchase.goods.formula.formulaList,
    filter: state.purchase.goods && state.purchase.goods.formula && state.purchase.goods.formula.formulaFilter,
    page: state.purchase.goods && state.purchase.goods.formula && state.purchase.goods.formula.formulaPage,
    preRouter: state.router.pre
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})
export default connect(mapStateToProps, mapDispatchToProps)(Form.create()(Formula))
