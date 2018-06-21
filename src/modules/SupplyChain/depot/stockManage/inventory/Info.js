import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Table, Button, Radio } from 'antd'
// import { Link } from 'react-router-dom'

import { isEmpty } from 'Utils/lang'
import { getUrlParam } from 'Utils/params'
import { genPlanColumn, genPagination, genEllipsisColumn } from 'Utils/helper'
import { getInventoryInfo } from '../reduck'
import styles from './inventory.less'

const RadioButton = Radio.Button
const RadioGroup = Radio.Group

class InventoryInfo extends Component {
  constructor(props) {
    super(props)
    // initial state

    this.state = {
      inventoryNo: getUrlParam('id'),
      dataSource: [],
      listType: '0',
      currentPage: 1,
      pageSize: 10,
    }
  }

  _loadData = () => {
    const { inventoryNo, listType, currentPage, pageSize } = this.state
    this.props.dispatch(getInventoryInfo({ inventoryNo, listType, currentPage, pageSize }))
  }

  componentWillMount() {
    this._loadData()
  }

  _resolveRecord = record => {
    const diffCount = record.stockCount - record.inventoryCount
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
        dataSource: nextProps.info.detailList.data.map(item => this._resolveRecord(item))
      })
    }
  }

  _columns = [
    { key: 'index',
      title: '序号',
      render: (text, record, index) => {
        const { pageSize, pageNo } = this.props.inventoryPage
        return (
          <span>{
            pageSize * pageNo + (index + 1) - pageSize
          }
          </span>
        )
      }
    },
    genEllipsisColumn('skuNo', 'SKU 编码', 13, { width: 140 }),
    genEllipsisColumn('goodsName', 'SKU 名称', 30),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsUnit', '库存单位'),
    genPlanColumn('stockCount', '当前库存'),
    genPlanColumn('inventoryCount', '盘点数量'),
    genPlanColumn('lack', '少货数量'),
    genPlanColumn('beyond', '多货数量'),
  ]

  _handleListTypeChange = e => {
    this.setState({ listType: e.target.value, currentPage: 1 }, () => {
      this._loadData()
    })
  }

  _handleChange = (pagination, filters, sorter) => {
    // console.log('params', pagination, filters, sorter)
    const { current, pageSize } = pagination
    this.setState({
      currentPage: current,
      pageSize,
    }, () => {
      this._loadData()
    })
  }

  render() {
    const { dataSource, inventoryNo, listType } = this.state
    const { info } = this.props

    const pagination = genPagination(info.detailList)

    return (
      <div className={styles.inventory}>
        <div className={styles.filter}>
          <span>单据编号： {inventoryNo}</span>
          <span>库区/分类： {info.houseareaName || info.goodsCatgName}</span>
          <span>库存部门： {info.warehouseName}</span>
          <span>
            <Button type='primary' onClick={() => this.props.dispatch(goBack())}>返回</Button>
          </span>
          <div>
            <RadioGroup onChange={this._handleListTypeChange} value={listType}>
              <RadioButton value='0'>全部</RadioButton>
              <RadioButton value='-1'>少货（{info.lessGoodsCount}）</RadioButton>
              <RadioButton value='1'>多货（{info.moreGoodsCount}）</RadioButton>
            </RadioGroup>
          </div>
        </div>
        <Table
          // style={{ width: '100%' }}
          pagination={pagination}
          columns={this._columns}
          onChange={this._handleChange}
          rowKey='skuNo'
          dataSource={dataSource}
          // loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    info: state.supplyChain.depotStock.inventory,
    inventoryPage: state.supplyChain.depotStock.inventoryPage
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(InventoryInfo)
