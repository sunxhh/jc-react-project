import React, { Component } from 'react'
import { connect } from 'react-redux'
import { goBack } from 'react-router-redux'
import { Table, Button, InputNumber } from 'antd'
// import { Link } from 'react-router-dom'

import * as urls from 'Global/urls'
import { isEmpty } from 'Utils/lang'
import { getUrlParam } from 'Utils/params'
import { genPlanColumn, genPagination, unshiftIndexColumn } from 'Utils/helper'
import { PageTypes } from '../dict'
import { getDifferenceInfo, doDifference } from '../reduck'
import styles from './difference.less'

class DifferenceInfo extends Component {
  constructor(props) {
    super(props)
    // initial state
    let pageType = PageTypes.INFO
    if (props.match.path === urls.SUPPLY_STOCK_DIFFERENCE_EDIT) {
      pageType = PageTypes.EDIT
    }

    this.state = {
      pageType,
      differenceNo: getUrlParam('id'),
      dataSource: [],
    }
  }

  componentWillMount() {
    const reqBean = {
      differenceNo: this.state.differenceNo,
      currentPage: 1,
      pageSize: 10,
    }
    this.props.dispatch(getDifferenceInfo(reqBean))
  }

  componentWillReceiveProps(nextProps) {
    if (!isEmpty(nextProps.info) && this.props.info !== nextProps.info) {
      this.setState({
        dataSource: nextProps.info.detailList.data.map(item => {
          // if (item.inventoryCount) {
          return { ...item, lackCount: item.stockCount - item.inventoryCount - (item.handleCount || 0) }
          // }
          // return item
        })
      })
    }
  }

  _handleCountChange = (value, record) => {
    const newData = [...this.state.dataSource]
    let target = newData.filter(item => record.skuNo === item.skuNo)[0]
    if (target) {
      target = Object.assign(target, { ...target, handleCount: value, lackCount: record.stockCount - record.inventoryCount - (value || 0) })
      this.setState({ dataSource: newData })
    }
  }

  _columns = [
    genPlanColumn('skuNo', 'SKU 编码'),
    genPlanColumn('goodsName', 'SKU 名称'),
    genPlanColumn('goodsCatgName', '所属分类'),
    genPlanColumn('goodsUnit', '库存单位'),
    genPlanColumn('stockCount', '当前库存'),
    genPlanColumn('inventoryCount', '盘点数量'),
    {
      key: 'lackCount',
      title: '少货数量',
      dataIndex: 'lackCount',
      render: text => (
        <span>{text ? parseFloat(parseFloat(text).toFixed(3)) : text}</span>
      )
    },
    {
      key: 'handleCount',
      title: '差异处理',
      dataIndex: 'handleCount',
      render: (text, record) => {
        return this.state.pageType === PageTypes.INFO ? text : (
          <InputNumber
            precision={3}
            min={0}
            max={record.stockCount - record.inventoryCount}
            value={text}
            onChange={value => this._handleCountChange(value, record)}
          />
        )
      }
    },
  ]

  _handleSave = () => {
    const { filter } = this.props
    const finalArg = {
      differenceNo: this.state.differenceNo,
      differenceList: this.state.dataSource.map(({ skuNo, handleCount }) => ({ skuNo, handleCount })),
      status: 1
    }
    this.props.dispatch(doDifference(finalArg, filter))
  }
  _handleSubmit = () => {
    const finalArg = {
      differenceNo: this.state.differenceNo,
      differenceList: this.state.dataSource.map(({ skuNo, handleCount }) => ({ skuNo, handleCount })),
      status: 2
    }
    this.props.dispatch(doDifference(finalArg))
  }

  _handleOnChange = (pagination) => {
    const { dispatch, info } = this.props
    const { current, pageSize } = pagination
    dispatch(getDifferenceInfo({ differenceNo: this.state.differenceNo, currentPage: info.detailList.pageSize !== pageSize ? 1 : current, pageSize }))
  }

  render() {
    const { pageType, dataSource, differenceNo } = this.state
    const { info } = this.props

    const statistics = dataSource.reduce((a, b) => {
      return a + (b.lackCount || 0)
    }, 0)

    return (
      <div className={styles.difference}>
        <div className={styles.filter}>
          <span>差异编号： {differenceNo}</span>
          <span>库区/分类： {info.dataSource}</span>
          <span>库存部门： {info.warehouseName}</span>
          <span>
            {
              pageType !== PageTypes.INFO && (
                <span className='margin-right'>
                  <Button type='primary' onClick={this._handleSave}>保存</Button>
                  <Button type='primary' onClick={this._handleSubmit}>提交</Button>
                </span>
              )
            }
            <Button type='primary' onClick={() => this.props.dispatch(goBack())}>{pageType === PageTypes.INFO ? '返回' : '取消'}</Button>
          </span>
        </div>
        <Table
          columns={unshiftIndexColumn(this._columns, info.detailList)}
          rowKey='skuNo'
          dataSource={dataSource}
          onChange={this._handleOnChange}
          pagination={genPagination(info.detailList)}
          title={() => (
            <div className={styles.statistic}>
              差异数量 <span className={styles.statistic_number}>{statistics ? parseFloat(parseFloat(statistics).toFixed(3)) : statistics}</span>
            </div>
          )}
        />
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    info: state.supplyChain.depotStock.difference,
    filter: state.supplyChain.depotStock.differenceFilter,
  }
}

const mapDispatchToProps = (dispatch) => ({
  dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(DifferenceInfo)
