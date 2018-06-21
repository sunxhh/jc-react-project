import React, { Component } from 'react'
import { connect } from '@dx-groups/arthur'
// import { Link } from 'react-router-dom'
import { Button, Table, Form, Row, Col } from 'antd' // , Modal

import styles from '../styles.less'
import { genPagination } from 'Utils/helper'

import Module from './module'
import { getUrlParam } from 'Utils/params'

const FormItem = Form.Item
const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

class StockInventoryDetail extends Component {
  // 打印的字段
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
      key: 'specName',
      title: '规格',
      dataIndex: 'specName'
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
      title: '实际在架库存',
      dataIndex: 'currentCount'
    }
  ]

  _inventoryStatus = {
    0: '待盘点',
    1: '盘点中',
    2: '盘点完成'
  }

  // 生命周期， 初始化表格数据
  componentDidMount() {
    this._init()
  }
  componentWillUnmount() {
    const { dispatch } = this.props
    dispatch(Module.actions.resetInventoryDetail())
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
        title: '实际在架库存',
        dataIndex: 'currentCount',
        width: 80,
        fixed: 'right'
      }
    ]
  }

  _init() {
    setTimeout(this._getInventoryDetailList, 100)
  }

  // 获取列表数据查询参数
  _getQueryParam(current = Module.state.inventoryDetailPage.current, pageSize = Module.state.inventoryDetailPage.pageSize) {
    const arg = {
      countsUuid: getUrlParam('countsUuid')
    }
    return {
      ...arg,
      currentPage: current,
      pageSize: pageSize,
    }
  }
  // 设置列表数据查询参数
  _setQueryParam = (queryParam) => {
    const { dispatch } = this.props
    dispatch(Module.actions.setQueryParam(queryParam))
  }

  /**
   * 库存盘点详情列表
   */
  _getInventoryDetailList = (current, pageSize) => {
    const { dispatch } = this.props
    let queryParam = this._getQueryParam(current, pageSize)
    dispatch(Module.actions.getInventoryDetailList(queryParam))

    this._setQueryParam(queryParam)
  }

  _handlePageChange = (page) => {
    if (this.props.inventoryDetailPage.pageSize === page.pageSize) {
      this._getInventoryDetailList(page.current, page.pageSize)
    } else {
      this._getInventoryDetailList(1, page.pageSize)
    }
  }

  /**
   * 打印盘点单
   * @returns {*}
   */
  _printInventoryDetail = () => {
    const { dispatch } = this.props
    dispatch(Module.actions.getInventoryDetailPrintList({
      countsUuid: getUrlParam('countsUuid')
    })).then((status) => {
      if (status) {
        const headstr = `<html><head><style type="text/css">h2 { font-size: 18px; color: #000000; text-align: center;padding: 10px 0; } .item-option { margin: 25px 0; list-style: none; display: flex; flex-flow: row wrap; width:100%; padding: 0;}  .item-option li { padding: 0 3%; flex: 44%; text-align: left; } .item-option li label { color: #000000; } .item-option li.right { text-align: right; } .data-wrap {padding: 0 3%;} .noPrint{display: none}.PageNext{page-break-after:always;}</style></head><body>`
        const footstr = '</body>'
        const newstr = document.getElementById('print-wrap').innerHTML
        document.body.innerHTML = headstr + newstr + footstr
        window.print()
        // window.location.reload()
      }
    })
  }

  render() {
    const { history, showListSpin, inventoryDetailList, inventoryDetailPage, inventoryDetailPrintList, inventoryDetailIn } = this.props
    const pagination = genPagination(inventoryDetailPage)
    return (
      <div>
        <Form
          id='filter-form'
          className={styles['parameter-wrap']}
        >
          <Row id='rowArea'>
            <Col span={5}>
              <FormItem
                label='库存单位'
                {...formItemLayout}
              >
                {inventoryDetailIn['shelfName']}
              </FormItem>
            </Col>
            <Col span={5}>
              <FormItem
                label='盘点状态'
                {...formItemLayout}
              >
                {this._inventoryStatus[inventoryDetailIn['status']]}
              </FormItem>
            </Col>
            <Col span={4} style={{ float: 'right' }}>
              <FormItem className={styles['operate-btn']}>
                <Button
                  type='primary'
                  title='打印'
                  onClick={this._printInventoryDetail}
                >
                  打印
                </Button>
                <Button
                  type='cancel'
                  title='取消'
                  onClick={() => history.go(-1)}
                  style={{ left: '20px' }}
                >
                  取消
                </Button>
              </FormItem>
            </Col>
          </Row>
        </Form>
        <div className={styles['table-wrapper']}>
          <Table
            locale={{
              emptyText: '暂无数据'
            }}
            columns={this.getColumns(inventoryDetailPage)}
            scroll={{ x: 1800 }}
            rowKey='goodsNo'
            dataSource={inventoryDetailList}
            bordered
            loading={showListSpin}
            onChange={this._handlePageChange}
            pagination={pagination}
          />
        </div>

        <div className={'print-wrap'} id={'print-wrap'} style={{ display: 'none' }}>
          <h2>商品盘点单</h2>
          <ul className={'item-option'}>
            <li><label>盘点单位：</label>{inventoryDetailIn.shelfName}</li>
            <li className={'right'}><label>创建日期：</label>{inventoryDetailIn.createTime}</li>
          </ul>
          <div className={'data-wrap'}>
            <Table
              locale={{
                emptyText: '暂无数据'
              }}
              columns={this._printColumns}
              rowKey='skuNo'
              dataSource={inventoryDetailPrintList}
              bordered
              onChange={this._handlePageChange}
              pagination={false}
            />
          </div>
          <ul className={'item-option'}>
            <li><label>盘点人：</label>{inventoryDetailIn.countsUser}</li>
            <li><label>盘点日期：</label>{inventoryDetailIn.countsDate}</li>
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
    ...state['retail.stock.inventory'],
    ...state['retail.stock'],
    ...state['retail']
  }
}
export default connect(['common.showListSpin', 'common.auths', 'retail', 'retail.stock', 'retail.stock.inventory'], mapStateToProps)(Form.create()(StockInventoryDetail))
