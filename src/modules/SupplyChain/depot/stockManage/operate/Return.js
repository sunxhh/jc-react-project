import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Table, Button, InputNumber } from 'antd'
// import { Link } from 'react-router-dom'

import { isEmpty } from 'Utils/lang'
import { getUrlParam } from 'Utils/params'
import { genPlanColumn, genPagination, unshiftIndexColumn } from 'Utils/helper'
import { getInboundInfo, returnInbound } from '../reduck'
import styles from './operate.less'

class StockReturn extends Component {
  constructor(props) {
    super(props)
    // initial state

    this.state = {
      outinOrderNo: getUrlParam('id'),
      dataSource: [],
    }
  }

  componentWillMount() {
    this.props.dispatch(getInboundInfo({ outinOrderNo: this.state.outinOrderNo, currentPage: 1, pageSize: 10 }))
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.info) && this.props.info !== nextProps.info) {
      this.setState({
        dataSource: nextProps.info.result.data.map(item => ({ ...item, returnCount: 0, amount: 0 }))
      })
    }
  }

  _handleCountChange = (value, record) => {
    const newData = [...this.state.dataSource]
    let target = newData.filter(item => record.skuNo === item.skuNo)[0]
    if (target) {
      target = Object.assign(target, {
        returnCount: value,
        amount: (target.purAmount * (value || 0)).toFixed(2)
      })
      this.setState({ dataSource: newData })
    }
  }

  _columns = [
    genPlanColumn('skuNo', 'SKU 编码'),
    genPlanColumn('goodsName', 'SKU 名称'),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsUnit', '库存单位'),
    genPlanColumn('purAmount', '采购价格'),
    {
      key: 'returnCount',
      title: '退货数量',
      dataIndex: 'returnCount',
      render: (text, record) => {
        return (
          <InputNumber
            precision={3}
            min={0}
            value={text}
            onChange={value => this._handleCountChange(value, record)}
          />
        )
      }
    },
    genPlanColumn('amount', '合计金额（元）'),
    genPlanColumn('count', '采购数量'),
  ]

  _handleSave = () => {
    const finalArg = {
      outinOrderNo: this.state.outinOrderNo,
      goodsInfo: this.state.dataSource.map(({ skuNo, returnCount }) => ({
        skuNo,
        count: returnCount,
      }))
    }
    this.props.dispatch(returnInbound(finalArg))
  }

  _handleOnChange = (pagination) => {
    const { dispatch, info } = this.props
    const { current, pageSize } = pagination
    dispatch(getInboundInfo({ outinOrderNo: this.state.outinOrderNo, currentPage: info.result.pageSize !== pageSize ? 1 : current, pageSize }))
  }

  render() {
    const { dataSource, outinOrderNo } = this.state
    const { info } = this.props

    return (
      <div className={styles.inbound}>
        <div className={styles.filter}>
          <span>单据编号： {outinOrderNo}</span>
          <span>单据类型： {info.dataSource}</span>
          <span>出库部门： {info.warehouseName}</span>
          <span>
            <Button type='primary' onClick={this._handleSave}>提交</Button>
            <Button type='primary' className='margin-left' onClick={() => this.props.dispatch(goBack())}>取消</Button>
          </span>
        </div>
        <Table
          // style={{ width: '100%' }}
          columns={unshiftIndexColumn(this._columns, info.result)}
          rowKey='skuNo'
          dataSource={dataSource}
          onChange={this._handleOnChange}
          pagination={genPagination(info.result)}
          // loading={showListSpin}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    info: state.supplyChain.depotStock.inbound
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(StockReturn)
