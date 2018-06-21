import React, { Component } from 'react'
import { connect } from 'react-redux'
// import moment from 'moment'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { Table, Button, Divider, Popconfirm } from 'antd'
// import styles from './stockCheck.less'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPlanColumn, genSelectColumn, filterResolver, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'

import { queryOrgByLevel } from 'Global/action'
import { getInventoryList, deleteInventory } from '../reduck'
import { OperateStatus, InventoryTypes, InventoryStatus } from '../dict'
import { showModalWrapper } from 'Components/modal/ModalWrapper'
import CreateInventory from './createInventory'
import { goodscatgList } from '../../../reduck'

class StockInventory extends Component {
  getInventoryListReq = (orgCode) => {
    const { dispatch, list, preRouter, orgLevel } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_STOCK_INVENTORY)))) {
      dispatch(getInventoryList({ pageSize: 10, currentPage: 1, warehouseNo: orgLevel === '2' ? orgCode : '' }))
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, orgCode } = this.props
    dispatch(goodscatgList({ parentNo: '', status: '1' }))
    if (orgLevel === '') {
      dispatch(queryOrgByLevel()).then(res => {
        res && this.getInventoryListReq(res.myOrgCode)
      })
    } else {
      this.getInventoryListReq(orgCode)
    }
  }

  _handleStart = record => {
    this.props.dispatch(push(`${urls.SUPPLY_STOCK_INVENTORY_ENTRY}?id=${record.inventoryNo}`))
  }
  _handleDelete = record => {
    const { dispatch, filter } = this.props
    dispatch(deleteInventory({ inventoryNo: record.inventoryNo }, filter))
  }

  _columns = [
    {
      key: 'inventoryNo',
      title: '单据编码',
      dataIndex: 'inventoryNo',
      render: (text, record) => {
        return (
          <Link
            to={`${record.operateStatus === InventoryStatus[2].value
              ? urls.SUPPLY_STOCK_INVENTORY_INFO : urls.SUPPLY_STOCK_INVENTORY_ENTRY}?id=${record.inventoryNo}`}
          >
            {record.inventoryNo}
          </Link>
        )
      }
    },
    genSelectColumn('inventoryType', '盘点类型', InventoryTypes),
    genPlanColumn('warehouseName', '库存部门'),
    genPlanColumn('houseareaName', '库区名称'),
    genPlanColumn('goodsCatgName', '分类名称'),
    genPlanColumn('lessGoodsCount', '少货'),
    genPlanColumn('moreGoodsCount', '多货'),
    genSelectColumn('operateStatus', '操作状态', InventoryStatus),
    genPlanColumn('operatorName', '盘点人'),
    genPlanColumn('operateTime', '操作时间'),
  ]

  operateColumn = () => ([
    {
      key: 'operation',
      title: '操作',
      fixed: 'right',
      width: 136,
      render: (text, record) => {
        if (record.operateStatus === InventoryStatus[0].value) { // 未开始
          return (
            <span>
              <a onClick={() => this._handleStart(record)}>开始盘点</a>
              <Divider type='vertical' />
              <Popconfirm
                title='确定删除该条数据吗？'
                onConfirm={() => this._handleDelete(record)}
              >
                <a>删除</a>
              </Popconfirm>
            </span>
          )
        } else if (record.operateStatus === InventoryStatus[1].value) { // 盘点中
          return (
            <a onClick={() => this._handleStart(record)}>继续盘点</a>
          )
        }
      },
    },
  ])

  _handleSearch = searchData => {
    const { filter } = this.props

    const finalSearchData = filterResolver(searchData, 'operateTime', 'startTime', 'endTime')
    const finalFilter = Object.assign({}, filter, finalSearchData, { currentPage: 1 })
    this.props.dispatch(getInventoryList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getInventoryList(finalFilter))
  }

  _handleCreate = () => {
    const { dispatch, orgCode, orgName, filter, goodscatgListData } = this.props
    if (!orgCode || isEmpty(goodscatgListData)) {
      message.warn('用户机构信息获取失败，请稍后再试！')
      return
    }
    showModalWrapper((
      <CreateInventory
        filter={filter}
        dispatch={dispatch}
        orgCode={orgCode}
        orgName={orgName}
        goodsCateList={goodscatgListData}
      />
    ), {
      title: '创建盘点单'
    })
  }

  _genFilterFields = () => {
    const { filter, orgCode, orgName, orgLevel, orgList } = this.props
    const fields = [
      {
        key: 'inventoryNo',
        label: '单据编码',
        initialValue: filter.inventoryNo,
        type: 'Input',
      }, {
        key: 'areaOrCatgName',
        label: '库区/分类',
        initialValue: filter.areaOrCatgName,
        type: 'Input',
      }, {
        key: 'operateStatus',
        label: '操作状态',
        initialValue: filter.operateStatus || '',
        type: 'Select',
        content: OperateStatus
      }, {
        key: 'operatorName',
        label: '操作人',
        initialValue: filter.operatorName,
        type: 'Input',
      }
    ]

    if (orgLevel === '2') { // 二级机构
      fields.push({
        key: 'warehouseNo',
        label: '仓库部门',
        initialValue: orgCode,
        disabled: true,
        type: 'Select',
        content: [{ value: orgCode, name: orgName }]
      })
    } else if (orgLevel !== '') { // 一级机构或总部
      fields.push({
        key: 'warehouseNo',
        label: '仓库部门',
        initialValue: filter.warehouseNo,
        type: 'Select',
        content: orgList && orgList.map(({ orgCode, orgName }) => ({ value: orgCode, name: orgName })) || []
      })
    }
    fields.push({
      key: 'operateTime', // startTime, endTime
      label: '操作时间',
      type: 'RangePicker',
      exProps: {
        showTime: true
      }
    })
    return fields
  }

  render() {
    const { showListSpin, orgLevel, list, filter, page } = this.props
    const finalColumns = [{
      key: 'index',
      title: '序号',
      fixed: 'left',
      render: (text, record, index) => page.pageSize * page.pageNo + (index + 1) - page.pageSize
    }].concat(this._columns)
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    const extraBtns = orgLevel !== '2' ? []
      : [
        <Button key='import' type='primary' onClick={this._handleCreate}>创建</Button>
      ]

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
          columns={orgLevel === '2' ? finalColumns.concat(this.operateColumn()) : finalColumns}
          onChange={this._handleChange}
          rowKey='skuNo'
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
    showListSpin: state.common.showListSpin,
    orgId: state.common.orgId,
    orgCode: state.common.orgCode,
    orgName: state.common.orgName,
    orgLevel: state.common.orgLevel,
    orgList: state.common.orgList,
    preRouter: state.router.pre,

    list: state.supplyChain.depotStock.inventoyList,
    filter: state.supplyChain.depotStock.inventoyFilter,
    page: state.supplyChain.depotStock.inventoyPage,
    goodscatgListData: state.supplyChain.commonSupply.goodscatgListData,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockInventory)
