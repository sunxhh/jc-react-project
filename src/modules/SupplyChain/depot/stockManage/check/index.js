import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, TreeSelect, message } from 'antd'
import { Link } from 'react-router-dom'
// import styles from './stockCheck.less'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPlanColumn, genSelectColumn, genPagination, unshiftIndexColumn, genEllipsisColumn } from 'Utils/helper'
import Filter from 'Components/Filter'

import { queryOrgByLevel } from 'Global/action'
import { getCheckList } from '../reduck'
import { StockStatus } from '../dict'
import storage from 'Utils/storage'
import { supplyChainUrl } from '../../../../../config'
import parmasUtil from 'Utils/params'
import { codeList, goodscatgList } from '../../../reduck'

const TreeNode = TreeSelect.TreeNode

class StockCheck extends Component {
  getCheckListReq = (orgCode) => {
    const { dispatch, list, preRouter, orgLevel } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_STOCK_CHECK)))) {
      dispatch(getCheckList({ pageSize: 10, currentPage: 1, warehouseNo: orgLevel === '2' ? orgCode : '' }))
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, goodsType, orgCode } = this.props
    if (orgLevel === '') {
      dispatch(queryOrgByLevel()).then(res => {
        res && this.getCheckListReq(res.myOrgCode)
      })
    } else {
      this.getCheckListReq(orgCode)
    }
    isEmpty(goodsType) && dispatch(codeList({ codeKeys: ['goodsType'] }))
    dispatch(goodscatgList({ parentNo: '', status: '1' }))
  }

  _columns = [
    genEllipsisColumn('skuNo', 'SKU 编码', 13),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsTypeName', '货物类型'),
    genPlanColumn('goodsUnit', '库存单位'),
    genSelectColumn('status', '库存状态', StockStatus),
    genPlanColumn('stockCount', '库存数量'),
    genPlanColumn('frozenStockCount', '占用库存'),
    genPlanColumn('availStockCount', '可用库存'),
    genPlanColumn('unConfirmStockCount', '待入库库存'),
    genPlanColumn('warehouseName', '库存部门'),
    genPlanColumn('weightCost', '加权成本（元）'),
    genPlanColumn('stockAmount', '库存金额（元）'),
    {
      key: 'operation',
      title: '操作',
      fixed: 'right',
      width: 100,
      render: (text, record) => (
        <Link to={urls.SUPPLY_STOCK_RECORD + '?id=' + record.skuNo}>操作记录</Link>
      ),
    },
  ]

  _handleSearch = searchData => {
    const { filter, dispatch } = this.props
    const finalFilter = { ...filter, ...searchData, currentPage: 1 }
    dispatch(getCheckList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getCheckList(finalFilter))
  }

  _selectChange = (rule, value, callback) => {
    const { goodscatgListData } = this.props
    const { setFieldsValue } = this.category
    const bool = goodscatgListData && goodscatgListData.some(item => { return item.goodsCatgNo === value })
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
    const { filter, orgCode, orgName, orgLevel, orgList, goodscatgListData, goodsType } = this.props
    const fields = [
      {
        key: 'skuNo',
        label: 'SKU 编码',
        initialValue: filter.skuNo,
        type: 'Input',
      }, {
        key: 'goodsName',
        label: 'SKU 名称',
        initialValue: filter.goodsName,
        type: 'Input',
      }, {
        key: 'goodsCatgNo',
        label: '所属分类',
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
            placeholder='请选择所属分类'
            treeNodeFilterProp='title'
            allowClear
            getPopupContainer={() => document.getElementById('listFilter')}
          >
            {
              goodscatgListData && goodscatgListData.map(item => {
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
        key: 'goodsType',
        label: '货物类型',
        initialValue: filter.goodsType || '',
        type: 'Select',
        content: goodsType
      }, {
        key: 'status',
        label: '库存状态',
        initialValue: filter.status || '',
        type: 'Select',
        content: StockStatus
      }
    ]

    if (orgLevel === '2') { // 二级机构
      fields.push({
        key: 'warehouseNo',
        label: '库存部门',
        initialValue: orgCode || '',
        type: 'Select',
        disabled: true,
        content: [{ value: orgCode, name: orgName }]
      })
    } else if (orgLevel !== '') { // 一级机构或总部
      fields.push({
        key: 'warehouseNo',
        label: '库存部门',
        initialValue: filter.warehouseNo,
        type: 'Select',
        content: orgList && orgList.map(({ orgCode, orgName }) => ({ value: orgCode, name: orgName })) || []
      })
    }
    return fields
  }

  _handleExport = () => {
    const { filter } = this.props
    const exportBean = {
      skuNo: filter.skuNo,
      goodsName: filter.goodsName,
      goodsCatgNo: filter.goodsCatgNo,
      goodsType: filter.goodsType,
      status: filter.status,
      warehouseNo: filter.warehouseNo,
    }
    const params = parmasUtil.json2url(exportBean)
    const ticket = storage.get('userInfo').ticket
    const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/stock/exportStock/v1?ticket=${ticket}&${params}`
    location.href = href
  }

  render() {
    const { showListSpin, list, page, orgLevel } = this.props
    const finalColumns = unshiftIndexColumn(this._columns, page, {
      fixed: 'left',
    })

    const fields = this._genFilterFields()
    const extraBtns = orgLevel === '2' ? [
      <Button key='export' type='primary' onClick={this._handleExport}>导出</Button>
    ] : []
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          ref={(ref) => { this.category = ref }}
          fields={fields}
          onSearch={this._handleSearch}
          extraBtns={extraBtns}
        />
        <Table
          // style={{ width: '100%' }}
          pagination={pagination}
          columns={finalColumns}
          onChange={this._handleChange}
          rowKey='index'
          dataSource={list}
          loading={showListSpin}
          scroll={{ x: 2000 }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    orgId: state.common.orgId,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    preRouter: state.router.pre,

    goodscatgListData: state.supplyChain.commonSupply.goodscatgListData,
    goodsType: state.supplyChain.commonSupply.goodsType,
    list: state.supplyChain.depotStock.checkList,
    filter: state.supplyChain.depotStock.checkFilter,
    page: state.supplyChain.depotStock.checkPage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockCheck)
