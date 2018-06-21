import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
// import { Link } from 'react-router-dom'
import { Table, Form } from 'antd' // , Modal, message

import styles from './styles.less'
// import { MEMBER_INTEGRAL_RULE } from 'Global/urls'
import { getUrlParam } from 'Utils/params'
import Module from './module'
import storage from 'Utils/storage'

class StockDistribute extends Component {
  state = {
    orgLevel: '',
    orgCode: ''
  }
  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }
  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetStockShelfDistributeIn())
  }

  getColumns = () => {
    // 列表header信息
    return [
      {
        key: 'id',
        title: '序号',
        render: (text, record, index) => {
          return index
        }
      },
      {
        key: 'shelfName',
        title: '货架名称',
        dataIndex: 'shelfName'
      },
      {
        key: 'stockCount',
        title: '库存数量',
        dataIndex: 'stockCount'
      }
    ]
  }

  _init() {
    let userIn = storage.get('userInfo')
    this.setState({
      orgLevel: userIn.orgLevel,
      orgCode: userIn.orgCode
    })
    setTimeout(() => {
      const skuNo = getUrlParam('skuNo')
      this._getStockBySkuNo(skuNo)
      this._getStockSubList(skuNo)
    }, 100)
  }

  /**
   * 获取库存信息
   */
  _getStockBySkuNo = (skuNo) => {
    const { orgLevel } = this.state
    const { dispatch } = this.props
    dispatch(Module.actions.getStockBySku({
      skuNo: skuNo,
      orgLevel: orgLevel,
      orgCode: getUrlParam('orgCode')
    }))
  }

  /**
   * 库存分布列表
   */
  _getStockSubList = (skuNo) => {
    const { orgLevel } = this.state
    const { dispatch } = this.props
    dispatch(Module.actions.getStockShelfDistribute({
      skuNo: skuNo,
      orgLevel: orgLevel,
      orgCode: getUrlParam('orgCode')
    }))
  }

  render() {
    const { showListSpin, stockShelfDistributeList, stockIn } = this.props
    return (
      <div>
        <ul className={styles['item-option']}>
          <li><label>SKU编码：</label>{stockIn.skuNo}</li>
          <li><label>商品名称：</label>{stockIn.goodsName}</li>
          <li><label>总库存：</label>{stockIn.stockCount}</li>
        </ul>
        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            columns={this.getColumns()}
            rowKey='shelfName'
            dataSource={stockShelfDistributeList}
            bordered
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={false}
          />
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state['common.showListSpin'],
    ...state['retail.stock'],
    ...state['memberCenter.integral'],
    ...state['retail']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'retail', 'retail.stock'], mapStateToProps)(Form.create()(StockDistribute))
