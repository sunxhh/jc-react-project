import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Table, Button, message } from 'antd'
// import styles from './stockCheck.less'

// import * as urls from 'Global/urls'
// import { isEmpty } from 'Utils/lang'
import { getUrlParam } from 'Utils/params'
import { genPlanColumn, genSelectColumn, filterResolver, genPagination, genEllipsisColumn } from 'Utils/helper'
import Filter from 'Components/Filter'

import { queryOrgByLevel } from 'Global/action'
import { getRecordList } from '../reduck'
import { codeList, stockOrgList } from '../../../reduck'
import { OperateTypes, InOutBillTypes } from '../dict'
import storage from 'Utils/storage'
import { supplyChainUrl } from '../../../../../config'
import parmasUtil from 'Utils/params'
import { isEmpty } from 'Utils/lang'
import * as urls from 'Global/urls'

class OperateRecord extends Component {
  getRecordListReq = (orgCode) => {
    const { dispatch, list, preRouter, orgLevel } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_STOCK_RECORD)))) {
      dispatch(getRecordList({ pageSize: 10, currentPage: 1, skuNo: getUrlParam('id'), outWarehouseNo: orgLevel === '2' ? orgCode : '', inWarehouseNo: orgLevel === '2' ? orgCode : '' }))
    }
  }

  componentWillMount() {
    const { dispatch, inOutBillType, orgLevel, orgCode } = this.props
    isEmpty(inOutBillType) && dispatch(codeList({ codeKeys: ['inOutBillType'] }))
    dispatch(stockOrgList({ org: {}}))
    if (orgLevel === '') {
      dispatch(queryOrgByLevel()).then(res => {
        res && this.getRecordListReq(res.myOrgCode)
      })
    } else {
      this.getRecordListReq(orgCode)
    }
  }

  _columns = [
    genEllipsisColumn('skuNo', 'SKU 编码', 13),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsTypeName', '货物类型'),
    genPlanColumn('goodsUnit', '库存单位'),
    genSelectColumn('operateType', '操作类型', OperateTypes),
    genSelectColumn('orderType', '单据类型', InOutBillTypes),
    genPlanColumn('inOutCount', '出入库数'),
    genPlanColumn('availStockCount', '剩余库存'),
    genPlanColumn('purAmount', '采购价/成本（元）'),
    genPlanColumn('totalAmount', '合计金额（元）'),
    genPlanColumn('outWarehouseName', '出库部门'),
    genPlanColumn('inWarehouseName', '入库部门'),
    genPlanColumn('outinOrderNo', '单据编码'),
    genPlanColumn('supplier', '供应商'),
    genPlanColumn('operator', '操作人', { fixed: 'right', width: 100 }),
    genPlanColumn('operateTime', '操作时间', { fixed: 'right', width: 108 }),
  ]

  _handleSearch = searchData => {
    const { filter, orgCode, orgLevel } = this.props

    if (orgLevel === '2') { // 二级机构
      if (searchData.outWarehouseNo !== orgCode && searchData.inWarehouseNo !== orgCode) {
        message.warn('当前仅支持查询本部门的操作记录，请重新选择查询条件！')
        return
      }
    }

    const finalSearchData = filterResolver(searchData, 'operateTime', 'startTime', 'endTime')
    const finalFilter = Object.assign({}, filter, finalSearchData, { currentPage: 1 })
    this.props.dispatch(getRecordList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getRecordList(finalFilter))
  }

  _handleExport = () => {
    const { filter } = this.props
    const exportBean = {
      skuNo: filter.skuNo,
      goodsName: filter.goodsName,
      operateType: filter.operateType,
      orderType: filter.orderType,
      outWarehouseNo: filter.outWarehouseNo,
      inWarehouseNo: filter.inWarehouseNo,
      supplierName: filter.supplierName,
      operator: filter.operator,
      startTime: filter.startTime,
      endTime: filter.endTime,
    }
    const params = parmasUtil.json2url(exportBean)
    const ticket = storage.get('userInfo').ticket
    const url = (supplyChainUrl === '/') ? `http://${location.host}` : supplyChainUrl
    let href = `${url}/api/supplychain/stock/exportOperateLog/v1?${params}&ticket=${ticket}`
    location.href = href
  }

  _genFilterFields = (filter) => {
    const { stockOrgList, inOutBillType, orgLevel, orgCode } = this.props
    const fields = [
      {
        key: 'skuNo',
        label: 'SKU 编码',
        initialValue: filter['skuNo'],
        type: 'Input',
      }, {
        key: 'goodsName',
        label: 'SKU 名称',
        initialValue: filter['goodsName'],
        type: 'Input',
      }, {
        key: 'operateType',
        label: '操作类型',
        type: 'Select',
        initialValue: '',
        content: OperateTypes
      }, {
        key: 'orderType',
        label: '单据类型',
        type: 'Select',
        initialValue: '',
        content: inOutBillType
      }, {
        key: 'outWarehouseNo',
        label: '出库部门',
        type: 'Select',
        disabled: orgLevel === '2',
        initialValue: orgLevel === '2' ? orgCode : '',
        content: stockOrgList.map(item => {
          return {
            value: item.orgCode,
            name: item.orgName,
          }
        })
      }, {
        key: 'inWarehouseNo',
        label: '入库部门',
        type: 'Select',
        disabled: orgLevel === '2',
        initialValue: orgLevel === '2' ? orgCode : '',
        content: stockOrgList.map(item => {
          return {
            value: item.orgCode,
            name: item.orgName,
          }
        })
      }, {
        key: 'supplierName',
        label: '供应商',
        initialValue: filter['supplierName'],
        type: 'Input',
      }, {
        key: 'operator',
        label: '操作人',
        initialValue: filter['operator'],
        type: 'Input',
      }, {
        key: 'operateTime', // startTime, endTime
        label: '操作时间',
        type: 'RangePicker',
      }
    ]

    return fields
  }

  render() {
    const { showListSpin, list, filter, page } = this.props
    const finalColumns = [{
      key: 'index',
      title: '序号',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => page.pageSize * page.pageNo + (index + 1) - page.pageSize
    }].concat(this._columns)
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
          extraBtns={[
            <Button key='export' type='primary' onClick={this._handleExport}>导出</Button>
          ]}
        />
        <Table
          // style={{ width: '100%' }}
          pagination={pagination}
          columns={finalColumns}
          onChange={this._handleChange}
          rowKey='index'
          dataSource={list}
          loading={showListSpin}
          scroll={{ x: 2600 }}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state.common.showListSpin,
    orgCode: state.common.orgCode,
    orgLevel: state.common.orgLevel,
    orgName: state.common.orgName,
    orgList: state.common.orgList,

    stockOrgList: state.supplyChain.commonSupply.stockOrgList,
    inOutBillType: state.supplyChain.commonSupply.inOutBillType,
    list: state.supplyChain.depotStock.recordList,
    filter: state.supplyChain.depotStock.recordFilter,
    page: state.supplyChain.depotStock.recordPage,
    preRouter: state.router.pre
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(OperateRecord)
