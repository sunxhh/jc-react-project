import React, { Component } from 'react'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { Link } from 'react-router-dom'
import { Table } from 'antd'
// import styles from './stockCheck.less'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { genPlanColumn, genSelectColumn, filterResolver, genPagination } from 'Utils/helper'
import Filter from 'Components/Filter'

import { queryOrgByLevel } from 'Global/action'
import { getDifferenceList } from '../reduck'
import { DifferenceStatus } from '../dict'

class StockDifference extends Component {
  getDifferenceListReq = (orgCode) => {
    const { dispatch, list, preRouter, orgLevel } = this.props
    if ((isEmpty(list) || !(preRouter && preRouter.startsWith(urls.SUPPLY_STOCK_DIFFERENCE)))) {
      dispatch(getDifferenceList({ pageSize: 10, currentPage: 1, warehouseNo: orgLevel === '2' ? orgCode : '' }))
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel, orgCode } = this.props
    if (orgLevel === '') {
      dispatch(queryOrgByLevel()).then(res => {
        res && this.getDifferenceListReq(res.myOrgCode)
      })
    } else {
      this.getDifferenceListReq(orgCode)
    }
  }

  _handleStart = record => {
    this.props.dispatch(push(`${urls.SUPPLY_STOCK_DIFFERENCE_EDIT}?id=${record.differenceNo}`))
  }

  getOperateColumn = () => {
    return [
      {
        key: 'operation',
        title: '操作',
        render: (text, record) => {
          if (record.status === DifferenceStatus[0].value) { // 未处理
            return (
              <span>
                <a onClick={() => this._handleStart(record)}>开始处理</a>
              </span>
            )
          } else if (record.status === DifferenceStatus[1].value) { // 处理中
            return (
              <a onClick={() => this._handleStart(record)}>继续处理</a>
            )
          }
        },
      }
    ]
  }

  _getColumns = () => {
    return [
      {
        key: 'differenceNo',
        title: '差异编码',
        dataIndex: 'differenceNo',
        render: (text, record) => {
          return (
            <Link
              to={`${record.status === DifferenceStatus[2].value || this.props.orgLevel !== '2'
                ? urls.SUPPLY_STOCK_DIFFERENCE_INFO : urls.SUPPLY_STOCK_DIFFERENCE_EDIT}?id=${record.differenceNo}`}
            >
              {record.differenceNo}
            </Link>
          )
        }
      },
      genPlanColumn('houseareaName', '库区名称'),
      genPlanColumn('goodsCatgName', '分类名称'),
      genPlanColumn('warehouseName', '仓库部门'),
      genPlanColumn('lessGoodsCount', '少货'),
      genSelectColumn('status', '处理状态', DifferenceStatus),
      genPlanColumn('handlerName', '盘点人'),
      genPlanColumn('handleTime', '操作时间', { width: 108 }),
    ]
  }

  _handleSearch = searchData => {
    const { filter } = this.props
    const finalSearchData = filterResolver(searchData, 'handleTime', 'startTime', 'endTime')
    const finalFilter = Object.assign({}, filter, finalSearchData, { currentPage: 1 })
    this.props.dispatch(getDifferenceList(finalFilter))
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { filter, dispatch, page } = this.props
    const { current, pageSize } = pagination
    const finalFilter = { ...filter, currentPage: page.pageSize !== pageSize ? 1 : current, pageSize }
    dispatch(getDifferenceList(finalFilter))
  }

  _handleCreate = () => {}

  _genFilterFields = () => {
    const { filter, orgCode, orgName, orgLevel, orgList } = this.props
    const fields = [
      {
        key: 'differenceNo',
        label: '差异编码',
        initialValue: filter.differenceNo,
        type: 'Input',
      }, {
        key: 'areaOrCatgName',
        label: '库区/分类',
        initialValue: filter.areaOrCatgName,
        type: 'Input',
      }, {
        key: 'status',
        label: '操作状态',
        initialValue: filter.status || '',
        type: 'Select',
        content: DifferenceStatus
      }, {
        key: 'handlerName',
        label: '处理人',
        initialValue: filter.handlerName,
        type: 'Input',
      }, {
        key: 'handleTime', // startTime, endTime
        label: '操作时间',
        type: 'RangePicker',
      }
    ]

    if (orgLevel === '2') { // 二级机构
      fields.push({
        key: 'warehouseName',
        label: '仓库部门',
        initialValue: orgCode,
        type: 'Text',
        content: orgName
      })
    } else if (orgLevel !== '') { // 一级机构或总部
      fields.push({
        key: 'warehouseName',
        label: '仓库部门',
        initialValue: filter.warehouseName,
        type: 'Select',
        content: orgList && orgList.map(({ orgCode, orgName }) => ({ value: orgCode, name: orgName })) || []
      })
    }
    return fields
  }

  render() {
    const { showListSpin, list, filter, page, orgLevel } = this.props
    const finalColumns = [{
      key: 'index',
      title: '序号',
      width: 60,
      fixed: 'left',
      render: (text, record, index) => page.pageSize * page.pageNo + (index + 1) - page.pageSize
    }].concat(this._getColumns())
    const fields = this._genFilterFields(filter)
    const pagination = genPagination(page)

    return (
      <div>
        <Filter
          fields={fields}
          onSearch={this._handleSearch}
        />
        <Table
          // style={{ width: '100%' }}
          pagination={pagination}
          columns={orgLevel === '2' ? finalColumns.concat(this.getOperateColumn()) : finalColumns}
          onChange={this._handleChange}
          rowKey='skuNo'
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

    list: state.supplyChain.depotStock.differenceList,
    filter: state.supplyChain.depotStock.differenceFilter,
    page: state.supplyChain.depotStock.differencePage,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockDifference)
