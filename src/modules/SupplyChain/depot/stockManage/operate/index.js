import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { Table, Button, Divider, Popconfirm } from 'antd'
// import styles from './stockCheck.less'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPlanColumn, genSelectColumn, filterResolver, genPagination, unshiftIndexColumn } from 'Utils/helper'
import Filter from 'Components/Filter'

import { queryOrgByLevel } from 'Global/action'
import { getOperateList, confirmBound, deleteBound } from '../reduck'
import { OperateTypes, InOutBillTypes, ConfirmStatus, InOutBillTypesByCreate } from '../dict'
import { codeList, stockOrgList } from '../../../reduck'

class StockOperate extends Component {
  getOperateListReq = (orgCode) => {
    const { dispatch, list, preRouter } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_STOCK_OPERATE)))) {
      dispatch(getOperateList({ pageSize: 10, currentPage: 1 }))
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, orgCode, inOutBillType, stockOrgListData } = this.props
    if (orgLevel === '') {
      dispatch(queryOrgByLevel()).then(res => {
        res && this.getOperateListReq(res.myOrgCode)
      })
    } else {
      this.getOperateListReq(orgCode)
    }
    isEmpty(inOutBillType) && dispatch(codeList({ codeKeys: ['inOutBillType'] }))
    isEmpty(stockOrgListData) && dispatch(stockOrgList({ org: {}}))
  }

  _handleConfirm = record => {
    const { dispatch, filter } = this.props
    dispatch(confirmBound({ outinOrderNo: record.outinOrderNo }, filter))
  }
  _handleEdit = record => {
    this.props.dispatch(push(`${record.operateType + '' === OperateTypes[0].value
      ? urls.SUPPLY_STOCK_OPERATE_INBOUND_EDIT : urls.SUPPLY_STOCK_OPERATE_OUTBOUND_EDIT}?id=${record.outinOrderNo}`))
  }
  _handleDelete = record => {
    const { dispatch, filter } = this.props
    dispatch(deleteBound({ outinOrderNo: record.outinOrderNo }, filter))
  }
  _handleReturn = record => {
    this.props.dispatch(push(`${urls.SUPPLY_STOCK_OPERATE_RETURN}?id=${record.outinOrderNo}`))
  }

  _columns = [
    {
      key: 'outinOrderNo',
      title: '单据编码',
      dataIndex: 'outinOrderNo',
      render: (text, record) => {
        if (record.operateStatus + '' === '1') { // 已确认
          return (
            <Link
              to={`${record.operateType + '' === OperateTypes[0].value
                ? urls.SUPPLY_STOCK_OPERATE_INBOUND_INFO : urls.SUPPLY_STOCK_OPERATE_OUTBOUND_INFO}?id=${record.outinOrderNo}`}
            >
              {record.outinOrderNo}
            </Link>
          )
        }
        return text
      }
    },
    genSelectColumn('operateType', '操作类型', OperateTypes),
    genPlanColumn('orderType', '单据类型'),
    genPlanColumn('supplier', '供应商'),
    genPlanColumn('amount', '单据金额（元）'),
    genPlanColumn('outWarehouseName', '出库部门'),
    genPlanColumn('inWarehouseName', '入库部门'),
    genSelectColumn('operateStatus', '操作状态', ConfirmStatus),
    genPlanColumn('operator', '操作人'),
    genPlanColumn('operatorTime', '操作时间', { width: 108, align: 'center' }),
    genPlanColumn('orderNo', '订单编码'),
  ]

  _handleSearch = searchData => {
    const { filter, dispatch } = this.props

    const finalSearchData = filterResolver(searchData, 'operateTime', 'startTime', 'endTime')
    const finalFilter = Object.assign({}, filter, finalSearchData, { currentPage: 1 })
    dispatch(getOperateList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getOperateList(finalFilter))
  }

  _genFilterFields = () => {
    const { stockOrgListData, inOutBillType, orgLevel, orgCode, filter } = this.props
    const fields = [
      {
        key: 'outinOrderNo',
        label: '单据编码',
        initialValue: filter.outinOrderNo || '',
        type: 'Input',
      }, {
        key: 'operateType',
        label: '操作类型',
        type: 'Select',
        initialValue: filter.operateType || '',
        content: OperateTypes
      }, {
        key: 'orderType',
        label: '单据类型',
        type: 'Select',
        initialValue: filter.orderType || '',
        content: inOutBillType
      }, {
        key: 'operateStatus',
        label: '操作状态',
        type: 'Select',
        initialValue: filter.operateStatus || '',
        content: ConfirmStatus
      }, {
        key: 'outWarehouseNo',
        label: '出库部门',
        type: 'Select',
        disabled: orgLevel === '2',
        initialValue: orgLevel === '2' ? orgCode : (filter.outWarehouseNo || ''),
        content: stockOrgListData.map(item => {
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
        initialValue: orgLevel === '2' ? orgCode : (filter.inWarehouseNo || ''),
        content: stockOrgListData.map(item => {
          return {
            value: item.orgCode,
            name: item.orgName,
          }
        })
      }, {
        key: 'orderNo',
        label: '订单编码',
        initialValue: filter.orderNo || '',
        type: 'Input',
      }, {
        key: 'supplierName',
        label: '供应商',
        initialValue: filter.supplierName || '',
        type: 'Input',
      }, {
        key: 'operator',
        label: '操作人',
        initialValue: filter.operator || '',
        type: 'Input',
      }, {
        key: 'operateTime', // startTime, endTime
        label: '操作时间',
        initialValue: filter.startTime ? [moment(filter.startTime), moment(filter.endTime)] : undefined,
        type: 'RangePicker',
      }
    ]

    return fields
  }

  _handleImport = () => {
    this.props.dispatch(push(urls.SUPPLY_STOCK_OPERATE_INBOUND_NEW))
  }
  _handleExport = () => {
    this.props.dispatch(push(urls.SUPPLY_STOCK_OPERATE_OUTBOUND_NEW))
  }

  operateColumn = () => {
    return [{
      key: 'operation',
      title: '操作',
      fixed: 'right',
      width: 160,
      render: (text, record) => {
        if (record.operateStatus + '' === ConfirmStatus[0].value) { // 未确认
          return (
            <span>
              {
                <Popconfirm
                  title='确认这条数据吗？'
                  onConfirm={() => this._handleConfirm(record)}
                >
                  <a>确认</a>
                </Popconfirm>
              }
              <Divider type='vertical' />
              <a onClick={() => this._handleEdit(record)}>编辑</a>
              {
                InOutBillTypesByCreate.some(item => item.name === record.orderType + '') && ( // 自产入库
                  <span>
                    <Divider type='vertical' />
                    <Popconfirm
                      title='确认要删除这条数据吗？'
                      onConfirm={() => this._handleDelete(record)}
                    >
                      <a>删除</a>
                    </Popconfirm>
                  </span>
                )
              }
            </span>
          )
        } else if (record.orderType + '' === InOutBillTypes[1].name && record.operateStatus + '' === ConfirmStatus[1].value) { // 入库单已确认
          return (
            <a onClick={() => this._handleReturn(record)}>采购退货</a>
          )
        }
      },
    }]
  }

  render() {
    const { showListSpin, orgLevel, list, page, auths, match } = this.props
    const btnRole = auths[match.path] ? auths[match.path] : []
    let finalColumns = unshiftIndexColumn(this._columns, page)
    const fields = this._genFilterFields()
    const pagination = genPagination(page)

    const extraBtns = orgLevel === '2' ? [
      btnRole.includes('inbound') ? <Button key='import' type='primary' onClick={this._handleImport}>自产入库</Button> : null,
      btnRole.includes('outbound') ? <Button key='export' type='primary' onClick={this._handleExport}>创建出库</Button> : null
    ] : []

    if (orgLevel === '2') {
      finalColumns = finalColumns.concat(this.operateColumn(btnRole))
    }

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
          extraBtns={extraBtns}
        />
        <Table
          // style={{ width: '100%' }}
          pagination={pagination}
          columns={finalColumns}
          onChange={this._handleChange}
          rowKey='outinOrderNo'
          scroll={{ x: 1600 }}
          dataSource={list}
          loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    auths: state.common.auths,
    showListSpin: state.common.showListSpin,
    orgLevel: state.common.orgLevel,
    orgName: state.common.orgName,
    orgCode: state.common.orgCode,
    list: state.supplyChain.depotStock.operateList,
    filter: state.supplyChain.depotStock.operateFilter,
    page: state.supplyChain.depotStock.operatePage,
    inOutBillType: state.supplyChain.commonSupply.inOutBillType,
    stockOrgListData: state.supplyChain.commonSupply.stockOrgList,

    preRouter: state.router.pre
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockOperate)
