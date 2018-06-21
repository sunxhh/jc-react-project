import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
// import { Link } from 'react-router-dom'
import { Button, Table, Form } from 'antd' // , Modal, message

import styles from '../styles.less'
import { genPagination } from 'Utils/helper'
import { getUrlParam } from 'Utils/params'

import Module from './module'
import { retailUrl } from '../../../../config'
import parmasUtil from 'Utils/params'
import storage from 'Utils/storage'
import { RETAIL_STOCK_LOSS_OVERFLOW } from 'Global/urls'

class StockLossOverflowDetail extends Component {
  _printColumns = [
    {
      key: 'skuNo',
      title: 'SKU编码',
      dataIndex: 'skuNo'
    },
    {
      key: 'goodsName',
      title: '商品名称',
      dataIndex: 'goodsName'
    },
    {
      key: 'goodsUnit',
      title: '库存单位',
      dataIndex: 'goodsUnit'
    },
    {
      key: 'salePrice',
      title: '门店零售价',
      dataIndex: 'salePrice'
    },
    {
      key: 'diffCount',
      title: '差异数量',
      dataIndex: 'diffCount'
    },
    {
      key: 'diffAmount',
      title: '差异金额',
      dataIndex: 'diffAmount'
    }
  ]
  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }

  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetLossOverflowDetailIn())
  }

  getColumns = (page) => {
    // 列表header信息
    return [
      {
        key: 'id',
        title: '序号',
        width: 80,
        fixed: 'left',
        render: (text, record, index) => {
          return page.pageSize * (page.pageNo - 1) + (index + 1)
        }
      },
      {
        key: 'goodsNo',
        title: '商品编码',
        dataIndex: 'goodsNo',
        width: 150,
        fixed: 'left',
      },
      {
        key: 'skuNo',
        title: 'SKU编码',
        dataIndex: 'skuNo'
      },
      {
        key: 'goodsName',
        title: '商品名称',
        dataIndex: 'goodsName'
      },
      {
        key: 'specName',
        title: '规格',
        dataIndex: 'specName'
      },
      {
        key: 'retailCatgName',
        title: '前台分类',
        dataIndex: 'retailCatgName'
      },
      {
        key: 'goodsCatgName',
        title: '前台分类',
        dataIndex: 'goodsCatgName'
      },
      {
        key: 'goodsTypeName',
        title: '系统分类',
        dataIndex: 'goodsTypeName'
      },
      {
        key: 'goodsUnit',
        title: '库存单位',
        dataIndex: 'goodsUnit'
      },
      {
        key: 'salePrice',
        title: '门店零售价',
        dataIndex: 'salePrice'
      },
      {
        key: 'currentCount',
        title: '系统在架库存',
        dataIndex: 'currentCount'
      },
      {
        key: 'realCount',
        title: '实际在架库存',
        dataIndex: 'realCount'
      },
      {
        key: 'diffCount',
        title: '差异数量',
        dataIndex: 'diffCount'
      },
      {
        key: 'diffAmount',
        title: '差异金额',
        dataIndex: 'diffAmount'
      }
    ]
  }

  _init() {
    setTimeout(this._getLossOverflowDetailList, 100)
  }

  // 获取列表数据查询参数
  _getQueryParam(current = Module.state.lossOverflowDetailPage.current, pageSize = Module.state.lossOverflowDetailPage.pageSize) {
    let arg = { lossUuid: getUrlParam('lossUuid') }
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }

  /**
   * 报损报溢单列表
   */
  _getLossOverflowDetailList = (current, pageSize) => {
    const { dispatch } = this.props
    let queryParam = this._getQueryParam(current, pageSize)
    dispatch(Module.actions.getLossOverflowDetailList(queryParam))
  }

  _handlePageChange = (page) => {
    if (this.props.lossOverflowDetailPage.pageSize === page.pageSize) {
      this._getInventoryList(page.current, page.pageSize)
    } else {
      this._getInventoryList(1, page.pageSize)
    }
  }

  /**
   * 导出报损报溢单详情
   * @returns {*}
   */
  _exportLossOverflowDetail = () => {
    const exportParam = {
      lossUuid: getUrlParam('lossUuid')
    }
    const params = parmasUtil.json2url(exportParam)
    const ticket = storage.get('userInfo').ticket
    const url = (retailUrl === '/') ? `http://${location.host}` : retailUrl
    let href = `${url}/api/retail/store/inventory/lossOverflow/exportDetail?${params}&ticket=${ticket}`
    window.open(href)
  }

  /**
   * 打印报损报溢单
   * @returns {*}
   */
  _printLossOverflow = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getLossOverflowDetailPrintList({
      lossUuid: getUrlParam('lossUuid')
    })).then((status) => {
      if (status) {
        const headstr = `<html><head><style type="text/css">h2 { font-size: 18px; color: #000000; text-align: center;padding: 10px 0; } .item-option { margin: 25px 0; list-style: none; display: flex; flex-flow: row wrap; width:100%; padding: 0;}  .item-option li { padding: 0 3%; flex: 44%; text-align: left; } .item-option li label { color: #000000; } .item-option li.right { text-align: right; } .data-wrap {padding: 0 3%;} .noPrint{display: none}.PageNext{page-break-after:always;}</style></head><body>`
        const footstr = '</body>'
        const newstr = document.getElementById('print-wrap').innerHTML
        document.body.innerHTML = headstr + newstr + footstr
        window.print()
        window.location.reload()
      }
    })
  }

  render() {
    const { showListSpin, lossOverflowDetailList, lossOverflowDetailIn, lossOverflowDetailPage, lossOverflowDetailPrintIn, auths } = this.props
    const pagination = genPagination(lossOverflowDetailPage)
    const btnRole = auths[RETAIL_STOCK_LOSS_OVERFLOW] ? auths[RETAIL_STOCK_LOSS_OVERFLOW] : []
    return (
      <div>
        <div
          id='filter-form'
          className={styles['parameter-wrap']}
        >
          <ul className={styles['item-option']}>
            <li><label>报损报溢单号：</label>{lossOverflowDetailIn.lossNo}</li>
            <li><label>报损数量：</label>{lossOverflowDetailIn.lossCount}</li>
            <li><label>报损金额：</label>{lossOverflowDetailIn.lossAmount}</li>
            <li><label>报溢数量：</label>{lossOverflowDetailIn.spillCount}</li>
            <li><label>报溢金额：</label>{lossOverflowDetailIn.spillAmount}</li>
            <li><label>盘点人：</label>{lossOverflowDetailIn.operator}</li>
            <li><label>盘点日期：</label>{lossOverflowDetailIn.countsDate}</li>
          </ul>

          <div className={styles['button-wrap']}>
            {
              btnRole.includes('stockLossOverflowPrint') &&
              <Button
                type='primary'
                title='报损报溢单打印'
                onClick={this._printLossOverflow}
              >
                打印
              </Button>
            }
            {
              btnRole.includes('stockLossOverflowDetailExport') &&
              <Button
                type='primary'
                title='报损报溢单详细导出'
                onClick={this._exportLossOverflowDetail}
                style={{ left: '10px' }}
              >
                导出
              </Button>
            }
          </div>
        </div>
        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            scroll={{ x: 1800 }}
            columns={this.getColumns(lossOverflowDetailPage)}
            rowKey='goodsNo'
            dataSource={lossOverflowDetailList}
            bordered
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>
        <div className={'print-wrap'} id={'print-wrap'} style={{ display: 'none' }}>
          <h2>报损报溢单</h2>
          <ul className={'item-option'}>
            <li><label>盘点单位：</label>{lossOverflowDetailPrintIn.shelfName}</li>
            <li className={'right'}><label>关联盘点单：</label>{lossOverflowDetailPrintIn.countsNo}</li>
            <li><label>差异数量：</label>{lossOverflowDetailPrintIn.diffCount}</li>
            <li className={'right'}><label>差异金额：</label>{lossOverflowDetailPrintIn.diffAmount}</li>
          </ul>
          <div className={'data-wrap'}>
            <Table
              locale={{
                emptyText: '暂无数据'
              }}
              columns={this._printColumns}
              rowKey='skuNo'
              dataSource={lossOverflowDetailPrintIn.result.data}
              bordered
              pagination={false}
            />
          </div>
          <ul className={'item-option'}>
            <li><label>盘点人：</label>{lossOverflowDetailPrintIn.operator}</li>
            <li><label>盘点日期：</label>{lossOverflowDetailPrintIn.countsDate}</li>
          </ul>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    showListSpin: state['common.showListSpin'],
    auths: state['common.auths'],
    ...state['retail.stock.lossOverflow'],
    ...state['retail.stock'],
    ...state['retail']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'retail', 'retail.stock', 'retail.stock.lossOverflow'], mapStateToProps)(Form.create()(StockLossOverflowDetail))
