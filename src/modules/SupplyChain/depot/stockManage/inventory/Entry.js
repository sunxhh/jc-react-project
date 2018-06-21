import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Table, Button, InputNumber, Divider, message } from 'antd'
// import { Link } from 'react-router-dom'

import { isEmpty } from 'Utils/lang'
import { getUrlParam } from 'Utils/params'
import { genPlanColumn, genPagination, genEllipsisColumn } from 'Utils/helper'
import { queryOrgByLevel } from 'Global/action'
import { getInventoryInfo, doInventory, getPrintIp, handlePrint, getInventoryPrintInfo } from '../reduck'
import styles from './inventory.less'
import { sliceArray } from './json'

class InventoryEntry extends Component {
  constructor(props) {
    super(props)
    // initial state

    this.state = {
      inventoryNo: getUrlParam('id'),
      dataSource: [],
      isPagination: true,
      inventoryPage: {},
      noPrint: false
    }
  }

  componentWillMount() {
    const { dispatch, orgLevel } = this.props
    if (orgLevel === '') {
      dispatch(queryOrgByLevel())
    }
    dispatch(getInventoryInfo({ inventoryNo: this.state.inventoryNo, listType: '0', currentPage: 1, pageSize: 10 }))
    dispatch(getInventoryPrintInfo({ inventoryNo: this.state.inventoryNo, listType: '0' }))
    dispatch(getPrintIp())
  }

  _handleChange = (pagination) => {
    // console.log('params', pagination, filters, sorter)
    const { dispatch } = this.props
    const { current, pageSize } = pagination
    dispatch(getInventoryInfo({ inventoryNo: this.state.inventoryNo, listType: '0', currentPage: current, pageSize: pageSize }))
  }

  _resolveRecord = record => {
    const diffCount = record.stockCount - (record.inventoryCount || 0)
    if (diffCount > 0) {
      return { ...record, lack: diffCount, beyond: null }
    } else if (diffCount === 0) {
      return { ...record, lack: null, beyond: null }
    }
    return { ...record, lack: null, beyond: -diffCount }
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.info) && this.props.info !== nextProps.info) {
      this.setState({
        dataSource: nextProps.info.detailList.data.map(item => this._resolveRecord(item)),
        inventoryPage: {
          pageNo: nextProps.info.detailList.pageNo,
          pageSize: nextProps.info.detailList.pageSize,
          records: nextProps.info.detailList.records,
          pages: nextProps.info.detailList.pages
        }
      })
    }
  }

  _handleCountChange = (value, record) => {
    const newData = [...this.state.dataSource]
    let target = newData.filter(item => record.skuNo === item.skuNo)[0]
    if (target) {
      target = Object.assign(target, this._resolveRecord({ ...target, inventoryCount: value }))
      this.setState({ dataSource: newData })
    }
  }

  _columns = [
    { key: 'index', title: '序号', render: (text, record, index) => {
      const { pageSize, pageNo } = this.state.inventoryPage
      return (
        <span>{
          pageSize *
          pageNo +
          (index + 1) -
          pageSize
        }
        </span>
      )
    } },
    genEllipsisColumn('skuNo', 'SKU 编码', 13, { width: 140 }),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsUnit', '库存单位'),
    genPlanColumn('stockCount', '当前库存'),
    {
      key: 'inventoryCount',
      title: '盘点数量',
      dataIndex: 'inventoryCount',
      render: (text, record) => {
        const cProps = parseFloat(record.stockCount) > 0 ? { min: 0 } : {}
        return (
          <InputNumber
            {...cProps}
            precision={3}
            max={99999999999.999}
            min={-99999999999.999}
            value={text}
            onChange={value => this._handleCountChange(value, record)}
          />
        )
      }
    },
    {
      key: 'lack',
      title: '少货数量',
      dataIndex: 'lack',
      render: text => (
        <span>{text ? parseFloat(text).toFixed(2) : text}</span>
      )
    },
    {
      key: 'beyond',
      title: '多货数量',
      dataIndex: 'beyond',
      render: text => (
        <span>{text ? parseFloat(text).toFixed(2) : text}</span>
      )
    },
  ]

  _handleSave = () => {
    const { filter } = this.props
    const finalArg = {
      inventoryNo: this.state.inventoryNo,
      inventoryList: this.state.dataSource.map(({ skuNo, inventoryCount }) => ({ skuNo, inventoryCount })),
      operateStatus: 2
    }
    this.props.dispatch(doInventory(finalArg, filter))
  }
  _handleSubmit = () => {
    const finalArg = {
      inventoryNo: this.state.inventoryNo,
      inventoryList: this.state.dataSource.map(({ skuNo, inventoryCount }) => ({ skuNo, inventoryCount })),
      operateStatus: 3
    }
    this.props.dispatch(doInventory(finalArg))
  }

  _handlePrint = () => {
    const { inventoryNo, warehouseName, houseareaName, goodsCatgName, detailList } = this.props
    const data = sliceArray(inventoryNo, warehouseName, houseareaName || goodsCatgName, detailList)
    const { dispatch, printIp } = this.props
    dispatch(handlePrint(`${printIp}api/printer/inventory`, data)).then(res => {
      if (res) {
        message.success('正在打印...', 2)
      }
    })
  }

  render() {
    const { dataSource, inventoryNo, isPagination } = this.state
    const { info, orgLevel } = this.props
    const pagination = genPagination(info.detailList)

    const statistics = dataSource.reduce((a, b) => {
      return { lack: b.lack ? (b.lack + a.lack) : a.lack, beyond: b.beyond ? (b.beyond + a.beyond) : a.beyond }
    }, { lack: 0, beyond: 0 })
    return (
      <div>
        <div style={{ height: '34px', clear: 'both', lineHeight: '34px' }}>
          <div style={{ float: 'right' }}>
            <span className={styles.operate_group} disabled={this.state.noPrint ? Boolean(1) : Boolean(0)} >
              {orgLevel === '2' && <Button type='primary' onClick={this._handleSave}>保存</Button>}
              {orgLevel === '2' && <Button type='primary' onClick={this._handleSubmit}>提交</Button>}
              <Button type='primary' onClick={() => this.props.dispatch(goBack())}>{orgLevel === '2' ? '取消' : '返回'}</Button>
              <Button type='primary' onClick={this._handlePrint}>打印</Button>
            </span>
          </div>
        </div>
        <div className={styles.statistic}>
          共计： 少货数量 <span className={styles.statistic_number}>{statistics.lack ? statistics.lack.toFixed(2) : statistics.lack}</span>
          <Divider type='vertical' />
          多货数量 <span className={styles.statistic_number}>{statistics.beyond ? statistics.beyond.toFixed(2) : statistics.beyond}</span>
        </div>
        <div id='printPage' className={styles.inventory}>
          <div className={styles.filter}>
            <span>单据编号： {inventoryNo}</span>
            <span>库区/分类： {info.houseareaName || info.goodsCatgName}</span>
            <span>库存部门： {info.warehouseName}</span>
          </div>
          <Table
            // style={{ width: '100%' }}
            columns={this._columns}
            rowKey='skuNo'
            dataSource={dataSource}
            pagination={isPagination ? pagination : false}
            onChange={this._handleChange}
            // loading={showListSpin}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    info: state.supplyChain.depotStock.inventory,
    printIp: state.supplyChain.depotStock.printIp,
    inventoryNo: state.supplyChain.depotStock.inventoryNo,
    warehouseName: state.supplyChain.depotStock.warehouseName,
    houseareaName: state.supplyChain.depotStock.houseareaName,
    goodsCatgName: state.supplyChain.depotStock.goodsCatgName,
    detailList: state.supplyChain.depotStock.detailList,
    filter: state.supplyChain.depotStock.inventoryFilter,
    orgLevel: state.common.orgLevel,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(InventoryEntry)
